import { Resolver } from '../models';

export class NullResolver implements Resolver {
    async resolve() {}
}
