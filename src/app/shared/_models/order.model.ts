export class Order {

    public id: number;
    public name: string;
    public description: string | undefined;
    public price: number;
    public creationDate: number;
    public thumbnailImage: string;
    public urlImage: string;

    constructor(
        fields?: {
            id: number,
            name: string,
            description?: string | undefined,
            price: number,
            creationDate: number,
            thumbnailImage: string,
            urlImage: string
        }
    ) {
        if (fields) Object.assign(this, fields);
    }
}