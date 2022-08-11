import { VariedOrderCollection } from './variedordercollection';
export class Queue<T> extends VariedOrderCollection<T> {
    add(elem: T) {
        this.storage.push(elem);
    }

    remove(): T | undefined {
        return this.storage.shift();
    }
}