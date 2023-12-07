import { ComponentBlock, RenderBlockProps } from '@contensis/canvas-react';

type BookComponent = { cover: string; name: string };

export function MyBookComponent(props: RenderBlockProps<ComponentBlock<BookComponent>>) {
    const book = props.block?.value;
    if (!book) return <></>;
    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{book.name}</h5>
                        <p className="card-text">{book.name}</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <img alt={book.name} src={book.cover} className="img-fluid rounded-start" />
                </div>
            </div>
        </div>
    );
}

type AuthorComponent = { cover: string; name: string };

export function MyAuthorComponent(props: RenderBlockProps<ComponentBlock<AuthorComponent>>) {
    const author = props.block?.value;
    if (!author) return <></>;
    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className="col-md-4">
                    <img alt={author.name} src={author.cover} className="img-fluid rounded-start" />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{author.name}</h5>
                        <p className="card-text">{author.name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Al() {
    return <div>I am an Al component</div>;
}
