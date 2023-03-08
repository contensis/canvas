import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths(), solidPlugin()],
  server: {
    port: 5174,
  },
  build: {
    target: 'esnext',
  },
});
