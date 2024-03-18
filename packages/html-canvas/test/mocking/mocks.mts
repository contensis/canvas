import { Config } from 'contensis-delivery-api';
import fs from 'fs';
import nock, { Definition, Scope } from 'nock';
import path from 'path';
import { fileURLToPath } from 'url';

// esm polyfills
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RECORD_MOCKS = !!process.env.RECORD_MOCKS;
const USE_MOCKS = process.env.USE_MOCKS === 'true' || process.env.npm_config_USE_MOCKS === 'true';
const RECORD_PATH = './recorded';

export class NockMocker {
  private recordedPath = path.join(__dirname, RECORD_PATH);
  private files = {
    checkDir: (filePath: string) => {
      const directoryPath = path.dirname(filePath);
      if (!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath, { recursive: true });
    },

    loadRecorded: (recordedPath: string) => {
      const files = fs.readdirSync(recordedPath);
      return files.map((fileName) => this.files.loadRecordedMock(fileName, recordedPath));
    },

    loadRecordedMock: (fileName: string, recordedPath: string) => {
      return JSON.parse(fs.readFileSync(path.join(recordedPath, fileName), 'utf8'));
    }
  };

  constructor(private operation: string) {
    this.loadMocks();
  }
  static maskConfig = (config: Config) => {
    if (USE_MOCKS) {
      config.rootUrl = 'https://mock-cms.cloud.contensis.com';
      config.clientDetails = { clientId: 'mock', clientSecret: 'mock' };
      config.projectId = 'canvas'
    }
    return config;
  };
  static startRecorder = () => {
    // if we've asked to record mocks, the network calls
    // made for this op will be recorded by nock.recorder
    if (RECORD_MOCKS) {
      nock.recorder.rec({
        dont_print: true,
        output_objects: true
        // enable_reqheaders_recording: true,
      });
      console.info('[nock] recording requests to save for later');
    }
  };

  done = (response?: any, operation = this.operation) => {
    // if we're using mocks here (and we're not recording)
    // re-activate network connection
    if (!RECORD_MOCKS && USE_MOCKS) {
      if (nock.pendingMocks().length > 0) {
        console.error('[nock] pending mocks: %j', nock.pendingMocks().length);
        nock.pendingMocks().map((pm) => {
          console.info(' %j', pm);
        });
      }
      nock.enableNetConnect();
    }

    // if we've asked to record mocks, the network calls
    // for this op will be dumped and saved to a json file
    if (RECORD_MOCKS && operation) {
      const nockCalls = nock.recorder.play();
      nock.recorder.clear();
      //   nock.restore();

      const recorded: {
        operation: string;
        response: any;
        nockCalls: string[] | Definition[];
      } = {
        operation,
        response,
        nockCalls
      };

      const filename = path.join(__dirname, RECORD_PATH, `/${operation}.json`);

      console.info(`[nock recorder] Writing ${nockCalls?.length} recorded mocks to '${filename}'`);

      this.files.checkDir(filename);
      fs.writeFileSync(
        filename,
        JSON.stringify(recorded)
          .replaceAll(`${process.env.clientId}`, 'mock')
          .replaceAll(`${process.env.sharedSecret}`, 'mock')
          .replaceAll(`${process.env.rootUrl}`, 'https://mock-cms.cloud.contensis.com')
      );
    } 
  };

  loadMocks = () => {
    // if we're using mocks here (and we're not recording)
    // attempt to load mocks for this operation
    if (USE_MOCKS && !RECORD_MOCKS) {
      const mocks = this.files.loadRecorded(this.recordedPath);

      nock.cleanAll();
      nock.enableNetConnect();
      const mock = mocks.find((m) => m.operation === this.operation);
      if (mock && 'nockCalls' in mock) {
        if (nock.pendingMocks().length > 0) console.warn('[nock] pending mocks: %j', nock.pendingMocks().length);
        nock.define(
          mock.nockCalls.map((nc: Scope) => ({
            ...nc
            // options: { allowUnmocked: true },
          }))
        );

        nock.disableNetConnect();
        // console.info('[nock] pending mocks: ');
        // nock.pendingMocks().map((pm) => {
        //   console.info(' %j', pm);
        // });
        console.info(`[nock] found mocks for ${this.operation}, loaded ${nock.pendingMocks().length} network calls`);
      } else {
        console.warn(`[nock] no mocks found for ${this.operation}, using real api`);
      }
    } else {
      return null;
    }
  };
}

NockMocker.startRecorder();

export const mocks = (operation: string) => new NockMocker(operation);
