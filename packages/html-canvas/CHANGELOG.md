# Changelog

## [1.1.0](https://github.com/contensis/canvas/compare/@contensis/html-canvas-v1.0.0...@contensis/html-canvas-v1.1.0) (2024-09-26)


### Features

* add support for Liquid canvas blocks ([#22](https://github.com/contensis/canvas/issues/22)) ([c18c591](https://github.com/contensis/canvas/commit/c18c5918a64c4e6ad9cf00daf0f65c00af507159))

## 1.0.0 (2024-08-09)


### Bug Fixes

* add `rootUri` option to parser configuration that is prefixed to relative links in the generated canvas ([2772a72](https://github.com/contensis/canvas/commit/2772a7239dce7b5fa5e80e3cc11edbd2b521f565))
* component data omitted from canvas output due to missing list of allowed component ids when creating a html parser and not validating ([255c97b](https://github.com/contensis/canvas/commit/255c97b045f41527116c519f489961c9753dbf4b))
* output relative urls in prepared canvas that does not have a `rootUri` ([baf7917](https://github.com/contensis/canvas/commit/baf7917c7f6e93ebc43f08aa50c5880c19713296))
* when creating the html parser config handle the '*' allowed type to allow any supplied component to be validated and parsed although it may not exist in the project ([a198fd2](https://github.com/contensis/canvas/commit/a198fd2975ef4984397e8eea84953d33d9533846))


### Build

* restrict published files in `html-canvas` ([7f169af](https://github.com/contensis/canvas/commit/7f169aff293fd47eff9e1e545745dbcbd789d929))
* set a minimum required version of `contensis-delivery-api` peer dependency ([98491d7](https://github.com/contensis/canvas/commit/98491d7f1ef26491cde2ae7f04b75efb7561bdd6))
