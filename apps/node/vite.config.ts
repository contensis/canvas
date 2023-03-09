import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { VitePluginNode } from 'vite-plugin-node';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tsConfigPaths(),
		...VitePluginNode({
			adapter: 'express',
			appPath: './index.ts'
		})
	],
	server: {
		port: 5177,
	},
});