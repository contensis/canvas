import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        ['canvas-react']: 'src/index.ts'
    },
    format: ['esm', 'cjs'],
    target: 'es6',
    legacyOutput: true, // outputs esm to folder avoiding .mjs file extension
    // this runs tsc to do type checking during build but the console
    // output is not as readable as vanilla tsc when there are problems to resolve
    //   dts: true,
    sourcemap: true,
    clean: true
});
