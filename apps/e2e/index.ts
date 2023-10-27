import express, { Request, Response } from 'express';
import { getMenu, getRoot, getEntry, getBreadcrumb } from './api/api';
import { getHtml } from './api/contents';

const app = express();

app.set('view engine', 'ejs');

app.get('*', async (req: Request, res: Response) => {
	const root = await getRoot();
	const menu = await getMenu(req.path);
	const entry = await getEntry(req.path);
	const breadcrumb = await getBreadcrumb(req.path);
	let content = null;
	if (entry?.entry?.canvas) {
		content = getHtml(entry?.entry?.canvas);
	}
	res.render('pages/index', {
		...(entry || { entry: null, node: null }),
		root,
		menu,
		breadcrumb,
		content
	});
});

export const viteNodeApp = app;