import { variedOrderCollection } from './variedordercollection';
export class Stack<T> extends variedOrderCollection<T> {
    add(elem: T) {
        this.storage.push(elem);
    }

    remove(): T | undefined {
        return this.storage.pop();
    }
}