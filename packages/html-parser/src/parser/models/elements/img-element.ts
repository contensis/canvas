import { ImageBlock, Transformations } from '../../../models';
import { VoidElement } from '../void-element';
import { Attributes, Element } from '../models';
import { Context } from '../context';
import { FigureElement } from './figure-element';
import { isBase64 } from '../images';

export class ImgElement extends VoidElement {
    private _imageItem: ImageBlock;

    constructor(name: string, attributes: Attributes, context: Context) {
        super(name, attributes, context);
        this.popContext = context.setType('_image', this);
    }

    appendTo(parent: Element) {
        this.popContext();
        if (this.context.canAddType('_image')) {
            const src = this.attributes.src;
            if (!isBase64(src)) {
                const { path, queryParams } = this.context.getUrl(src);
                const asset = this.context.getImage(path);
                const imageType = asset ? 'managed' : 'external';
                if (this.context.hasSetting(['type.image.imageType', imageType])) {
                    let transformations: Transformations = undefined;
                    if (asset) {
                        transformations = toTransformations(queryParams);
                    }
                    this._imageItem = {
                        type: '_image',
                        id: this.id(),
                        properties: this.withFriendlyId(),
                        value: {
                            altText: this.attributes.alt,
                            caption: this.attributes.title,
                            asset: asset ? asset : { sys: { uri: src } },
                            transformations
                        }
                    };
                    if (parent instanceof FigureElement) {
                        parent.setWithCaption(this);
                    } else {
                        parent.append(this._imageItem);
                    }
                }
            }
        }
    }

    withCaption(caption: string) {
        return caption ? { ...this._imageItem, value: { ...this._imageItem.value, caption } } : this._imageItem;
    }
}

function toTransformations(search: Record<string, string>): Transformations {
    let t: Transformations = undefined;

    const width = toNumber(search['w']);
    const height = toNumber(search['h']);
    if (width || height) {
        t = t || {};
        t.size = t.size || {};
        t.size = width ? { ...t.size, width } : t.size;
        t.size = height ? { ...t.size, height } : t.size;
    }

    const crop = search['crop'];
    if (crop) {
        const [cropWidthString, cropHeightString, cropXString, cropYString] = crop.split(',');
        let width = toNumber(cropWidthString);
        let height = toNumber(cropHeightString);
        if (width || height) {
            width = width || height;
            height = height || width;
            const x = toNumber(cropXString) || 0;
            const y = toNumber(cropYString) || 0;

            t = t || {};
            t.crop = t.crop || {};
            t.crop.width = width;
            t.crop.height = height;
            t.crop.x = x;
            t.crop.y = y;
        }
    }

    const flip = search['flip'] as Transformations['flip'];
    if (flip) {
        t = t || {};
        t.flip = flip;
    }

    const rotate = toNumber(search['r']);
    if (rotate) {
        t = t || {};
        t.rotate = rotate;
    }

    const quality = toNumber(search['q']);
    if (quality) {
        t = t || {};
        t.quality = quality;
    }

    const format = search['format'];
    if (format) {
        t = t || {};
        t.format = format;
    }

    return t;
}

function toNumber(s: string) {
    if (s) {
        const value = parseInt(s);
        if (!isNaN(value)) {
            return value;
        }
    }
    return null;
}
