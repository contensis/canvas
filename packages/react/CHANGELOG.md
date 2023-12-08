# Changelog

## [1.0.1](https://github.com/contensis/canvas/compare/@contensis/canvas-react-v1.0.0...@contensis/canvas-react-v1.0.1) (2023-12-08)


### Documentation

* update examples in README to include missing typings ([bff2d9e](https://github.com/contensis/canvas/commit/bff2d9ed07e41f9ce038a5724f3d39aa2f9ee618))


### Bug Fixes

* export additional typings for use in overrides functions ([d0eb685](https://github.com/contensis/canvas/commit/d0eb6853c4943817a93c3b84ccfaaaed30da5bf3))


### Build

* add build script at monorepo root to build all projects ([63db6a3](https://github.com/contensis/canvas/commit/63db6a34bd9333d921aa2f7e2db690492e953d4c))

## 1.0.0 (2023-12-01)


### Build

* add build script for `canvas-html` package and update module references in `package.json` ([b76fe91](https://github.com/contensis/canvas/commit/b76fe91ba97a2b8875367903744e8bf1452a83d9))
* add cjs / esm module build script to `canvas-react`, each bundle type referenced in `package.json` for a consumer to use with their respective build/runtime ([2b01ca5](https://github.com/contensis/canvas/commit/2b01ca527c9887838f54406b76c703f0d7514976))
* export `canvas-types` in `canvas-react` package ([082482e](https://github.com/contensis/canvas/commit/082482e9c96d5d7a23b75f2e9c9dd1d10916f0e3))
* install `canvas-types` package from devDependencies and install typescript from monorepo root ([e16362e](https://github.com/contensis/canvas/commit/e16362e9e70c5dd5b425b61bc75f3737d007b546))
* install `tsup` bundler for react package build ([4e43636](https://github.com/contensis/canvas/commit/4e43636438bed22d2c1c9cdd8b3c9cadb6185547))
