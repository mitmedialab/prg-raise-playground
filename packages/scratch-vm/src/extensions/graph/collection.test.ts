import { Queue } from './queue';
import { Stack } from './stack';

describe("Basic queue and stack tests", () => {
    test('queue test', () => {
        let q = new Queue<number>;
        q.add(1);
        q.add(2);
        q.add(3);
        expect(q.size()).toBe(3);
        expect(q.remove()).toBe(1);
        expect(q.remove()).toBe(2);
        expect(q.remove()).toBe(3);
        expect(q.remove()).toBe(undefined);
    })

    test('stack test', () => {
        let s = new Stack<number>;
        s.add(1);
        s.add(2);
        s.add(3);
        expect(s.size()).toBe(3);
        expect(s.remove()).toBe(3);
        expect(s.remove()).toBe(2);
        expect(s.remove()).toBe(1);
        expect(s.remove()).toBe(undefined);
    })
})