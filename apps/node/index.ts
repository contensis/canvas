import express, { Request, Response } from 'express';
import * as CanvasData from './content/canvas-data';
import { toEmail, getHtml } from './content/contents';

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req: Request, res: Response) => {
	res.render('pages/index', { content: getHtml(CanvasData.data) });
});

app.get('/email', (req: Request, res: Response) => {
	res.render('pages/plain', { content: toEmail(CanvasData.emailData) });
});

export const viteNodeApp = app;