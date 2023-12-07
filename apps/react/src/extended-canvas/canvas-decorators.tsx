import { RenderDecoratorProps, Strong } from '@contensis/canvas-react';

export function StrongAl(props: RenderDecoratorProps) {
    // return <Strong {...props} style={{ backgroundColor: 'red'}} />;

    return (
        <code>
            <Strong.Children {...props} />
        </code>
    );
}
