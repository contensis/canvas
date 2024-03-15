import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        ['html-canvas']: 'src/index.ts'
    },
    format: ['esm', 'cjs'],
    target: 'node16',
    // this runs tsc to do type checking during build but the console
    // output is not as readable as vanilla tsc when there are problems to resolve
    //   dts: true,
    sourcemap: true,
    clean: true
});
