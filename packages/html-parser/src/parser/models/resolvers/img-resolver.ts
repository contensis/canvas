import { isBase64 } from '../images';
import { Attributes, Resolver } from '../models';
import { ResolveContext } from '../resolve-context';

export class ImgResolver implements Resolver {
    constructor(_name: string, private attributes: Attributes, private context: ResolveContext) {}

    resolve() {
        const url = this.attributes.src;
        if (url && !isBase64(url)) {
            this.context.resolve('asset', url);
        }
        // just data attributes not needed
        // if you are in the canvas editor you won;t need to parse
        // as the image would be updated aginst the json not the html
    }
}
