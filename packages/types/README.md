# @contensis/canvas-types

Base TypeScript definitions used in the workspace packages

## Developers

These types are used during package development and should be installed into the package `devDependencies`

## Consumers
The types are re-exported for use by consumers in each of the published packages. So to use a type in your project you will import it from the package you installed e.g.

```typescript
import { UseThisType } from '@contensis/canvas-html'
```