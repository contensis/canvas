# Changelog

## [1.3.2](https://github.com/contensis/canvas/compare/@contensis/canvas-react-v1.3.1...@contensis/canvas-react-v1.3.2) (2026-02-12)


### Bug Fixes

* now using NPM Trusted Publishing ([18a88cc](https://github.com/contensis/canvas/commit/18a88cc3e19c3ebf15a7f5d2ce18b67b55353206))

## [1.3.1](https://github.com/contensis/canvas/compare/@contensis/canvas-react-v1.3.0...@contensis/canvas-react-v1.3.1) (2026-02-12)


### Bug Fixes

* add scope to table headers [#34](https://github.com/contensis/canvas/issues/34) [@dantkid](https://github.com/dantkid) ([5c5393f](https://github.com/contensis/canvas/commit/5c5393f156b1d0bd6c2805f6e8fd9dd3e4e65589))

## [1.3.0](https://github.com/contensis/canvas/compare/@contensis/canvas-react-v1.2.0...@contensis/canvas-react-v1.3.0) (2025-09-09)


### Features

* add entry and asset blocks ([4e05e84](https://github.com/contensis/canvas/commit/4e05e84de3b5ec97246efaf71f4f8aa2ddd4d273))
* added abbreviation rendering ([#30](https://github.com/contensis/canvas/issues/30)) ([d060c73](https://github.com/contensis/canvas/commit/d060c73d4d365feb4c73fab7ddfc1dbc19e581c4))

## [1.2.0](https://github.com/contensis/canvas/compare/@contensis/canvas-react-v1.1.0...@contensis/canvas-react-v1.2.0) (2024-09-26)


### Features

* add support for Liquid canvas blocks ([#22](https://github.com/contensis/canvas/issues/22)) ([c18c591](https://github.com/contensis/canvas/commit/c18c5918a64c4e6ad9cf00daf0f65c00af507159))
* added default forms render ([#22](https://github.com/contensis/canvas/issues/22)) ([c18c591](https://github.com/contensis/canvas/commit/c18c5918a64c4e6ad9cf00daf0f65c00af507159))
* updated rendering of forms within canvas and ensured canvas renderer can handle unknown types ([#22](https://github.com/contensis/canvas/issues/22)) ([c18c591](https://github.com/contensis/canvas/commit/c18c5918a64c4e6ad9cf00daf0f65c00af507159))


### Build

* use .mjs extension for ESM build - reverts change in v1.0.5 and fixes [#20](https://github.com/contensis/canvas/issues/20) `Cannot use import statement outside a module` when project specifies `type: module` ([aacbae8](https://github.com/contensis/canvas/commit/aacbae87695e8b965445b9957fc99b65563b61df))

## [1.1.0](https://github.com/contensis/canvas/compare/@contensis/canvas-react-v1.0.6...@contensis/canvas-react-v1.1.0) (2024-07-05)


### Features

* handle forms as a canvas block type ([#17](https://github.com/contensis/canvas/issues/17)) ([5f6e93c](https://github.com/contensis/canvas/commit/5f6e93c698359e23a02f10ee9d41ccb1b30e344c))

## [1.0.6](https://github.com/contensis/canvas/compare/@contensis/canvas-react-v1.0.5...@contensis/canvas-react-v1.0.6) (2024-05-22)


### Bug Fixes

* missing export `RenderChildren` for rendering a value that may be a composite block array inside an overridden block render component ([f3dae2f](https://github.com/contensis/canvas/commit/f3dae2fbf3323795226007a79b0739bbc296a4d1))

## [1.0.5](https://github.com/contensis/canvas/compare/@contensis/canvas-react-v1.0.4...@contensis/canvas-react-v1.0.5) (2024-05-02)


### Bug Fixes

* issue building some webpack projects without adding this node_module to the babel include list ([ad2b797](https://github.com/contensis/canvas/commit/ad2b797ee4dca905e2e9b1006042ec2fe9f7e553))


### Build

* avoid .mjs extension in esm builds to prevent error `Can't import the named export 'useContext' from non EcmaScript module` in legacy consumer webpack builds ([4470cb8](https://github.com/contensis/canvas/commit/4470cb829975cd6f79a7ca6f4018c5f9de09cf09))

## [1.0.4](https://github.com/contensis/canvas/compare/@contensis/canvas-react-v1.0.3...@contensis/canvas-react-v1.0.4) (2024-01-18)


### Bug Fixes

* avoid duplicate versions of react when using yarn package manager ([cff2046](https://github.com/contensis/canvas/commit/cff2046a59d0e6ee35065196396acea167863187))


### Build

* update project dev dependencies ([08ff7bd](https://github.com/contensis/canvas/commit/08ff7bd4f3479e61e452c7be587462ae17834bfb))

## [1.0.3](https://github.com/contensis/canvas/compare/@contensis/canvas-react-v1.0.2...@contensis/canvas-react-v1.0.3) (2024-01-16)


### Build

* avoid `Can't resolve 'react/jsx-runtime'` error in consumer projects ([aac6cc3](https://github.com/contensis/canvas/commit/aac6cc3b7ada157a6fd9236c44d840f0d8ee71cd))

## [1.0.2](https://github.com/contensis/canvas/compare/@contensis/canvas-react-v1.0.1...@contensis/canvas-react-v1.0.2) (2023-12-14)


### Documentation

* JSDoc comments for the exported React functions ([#10](https://github.com/contensis/canvas/issues/10)) ([2f053ba](https://github.com/contensis/canvas/commit/2f053ba398603a767deb9c5b1a6c4a07788e3b0b))


### Bug Fixes

* missing types in `canvas-react` ([133509b](https://github.com/contensis/canvas/commit/133509b73747416d191903b3400f3848869ccbfc))
* null is valid JSX return type ([4c9b20b](https://github.com/contensis/canvas/commit/4c9b20b959e3e88eeb373e2242f8db1824085a10))

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
