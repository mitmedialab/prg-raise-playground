export abstract class variedOrderCollection<T> {
    protected storage : T[];

    constructor() {
        this.storage = [];
    }

    size() : number {
        return this.storage.length;
    }

    abstract add(elem : T);
    abstract remove() : T | undefined;
}

