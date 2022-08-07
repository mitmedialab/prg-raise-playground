import { variedOrderCollection } from './variedordercollection';
export class Queue<T> extends variedOrderCollection<T> {
    add(elem: T) {
        this.storage.push(elem);
    }

    remove(): T | undefined {
        return this.storage.shift();
    }
}