# Changelog

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
