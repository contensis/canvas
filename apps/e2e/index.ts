import express, { Request, Response } from 'express';
import { getSitemap, getEntry } from './api/api';
import { getHtml } from './api/contents';

const app = express();

app.set('view engine', 'ejs');

app.get('*', async (req: Request, res: Response) => {
	const sitemap = await getSitemap();
	const root = sitemap as any;
	const node = root?.children?.find(n => n.path === req.path);
	if (!node && !!root?.children?.length) {
		const firstNode = root.children[0];
		res.redirect(firstNode.path);
	} else if (!node) {
		res.render('pages/index', {
			sitemap,
			entry: null,
			content: null
		});
	} else {
		const entry = await getEntry(node.entry.sys.id, node.entry.sys.language);
		res.render('pages/index', {
			sitemap,
			entry,
			content: getHtml(entry.content)
		});
	}
});

export const viteNodeApp = app;