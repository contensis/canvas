import express, { Request, Response } from 'express';
import * as CanvasData from './content/canvas-data';
import { getHtml } from './content/contents';

const app = express();

app.set('view engine', 'ejs');

// // todo: get this to work and can we get a markdown render???????
// // could this just use the dom render with a look up?????
app.get('/', (req: Request, res: Response) => {
	res.render('pages/index', { content: getHtml(CanvasData.data) });
});

export const viteNodeApp = app;