import express, { Request, Response } from 'express';
import * as CanvasData from './content/canvas-data';
import { getHtml } from './content/contents';

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req: Request, res: Response) => {
	res.render('pages/index', { content: getHtml(CanvasData.data) });
});

export const viteNodeApp = app;