import { Entry, Node, Asset } from './models';
import { Url } from '../parser';

export type CmsUrlData = {
    projectId: string;
    entryId?: string;
    nodeId?: string;
    language?: string;
};

export interface IResolver {
    isAbsoluteUrl(text: string): boolean;
    isLocalUrl(text: string): boolean;
    isAsset(url: string): Promise<boolean>;
    isEntry(url: string): Promise<boolean>;
    isNode(url: string): Promise<boolean>;
    isImage(url: string): Promise<boolean>;
    isCmsImage(url: string): Promise<boolean>;
    getCmsUrlData(url: string): Promise<CmsUrlData>;
    getEntry(projectId: string, entryId: string, language: string): Promise<Entry>;
    getNode(projectId: string, nodeId: string, language: string): Promise<Node>;
    getAsset(projectId: string, entryId: string, language: string): Promise<Asset>;
    parseUrl(path: string): Url;
    toAbsoluteUrl(path: string): string;
}
