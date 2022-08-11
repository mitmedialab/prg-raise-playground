import { Graph } from './graph';

describe("Graph tests", () => {
  test("Test exists and add vertex", () => {
    let G = new Graph(4,false);
    G.addVertex(1);
    G.addVertex(2);
    G.addVertex(3);
    G.addVertex(4);
    expect(G.exists(4)).toBe(true);
    expect(G.exists(5)).toBe(false);
  })

  test("Test max size addV", () => {
    let G = new Graph(3,false);
    G.addVertex(1);
    G.addVertex(2);
    G.addVertex(3);
    expect(G.size()).toBe(3);
    G.addVertex(4);
    expect(G.size()).toBe(3);
  })

  test("Test basic add edge functionality", () => {
    let G = new Graph(3,false);
    G.addEdge([1,2]);
    expect(G.size()).toBe(2);
    G.addEdge([1,3]);
    expect(G.size()).toBe(3);
    G.addEdge([1,3]);
    expect(G.size()).toBe(3); //adding the same edge again should not affect size
  })

  test("Test basic add edge functionality with both/only 1 vertex present", () => {
    let G = new Graph(undefined,false);
    G.addVertex(1);
    G.addVertex(2);
    G.addEdge([1,2]);
    expect(G.existsEdge([1,2])).toBe(true);

    let G1 = new Graph(undefined,false);
    G1.addVertex(1);
    G1.addEdge([2,1]);
    expect(G1.existsEdge([1,2])).toBe(true);

  })

  test("Test max size addE where neither exists", () => {
    let G = new Graph(3,false);
    G.addEdge([1,2]);
    G.addEdge([1,3]);
    G.addEdge([4,5]);
    expect(G.size()).toBe(3);
  })

  test("Test max size addE where one exists and we're already at the limit", () => {
    let G = new Graph(3,false);
    G.addEdge([1,2]);
    G.addEdge([1,3]);
    G.addEdge([1,4]);
    expect(G.size()).toBe(3);
  })

  test("Test max size addE where one exists and we're not at the limit", () => {
    let G = new Graph(3,false);
    G.addEdge([1,2]);
    G.addEdge([1,3]);
    G.addEdge([1,5]);
    expect(G.size()).toBe(3);
  })

  test("Test that neither vertex is added in addEdge if there's room for one more", () => {
    let G = new Graph(4,false);
    G.addEdge([1,2]);
    G.addEdge([1,3]);
    G.addEdge([5,4]);
    expect(G.size()).toBe(3);
  })

  test("Test existsEdge", () => {
    let G = new Graph(undefined,false);
    G.addEdge([1,1]);
    expect(G.size()).toBe(0);
    G.addEdge([1,2]);
    expect(G.size()).toBe(2);
    expect(G.existsEdge([1,2])).toBe(true);
    expect(G.existsEdge([2,1])).toBe(true); // E(v1,v2) === E(v2,v1)
    expect(G.existsEdge([1,3])).toBe(false);
    G.addVertex(3);
    expect(G.existsEdge([1,3])).toBe(false);
  })

  test("Test remove vertex", () => {
    let G = new Graph(undefined,false);
    G.addVertex(1);
    G.addVertex(2);
    G.removeVertex(1);
    expect(G.size()).toBe(1);

    let G1 = new Graph(undefined,false);
    G1.addEdge([1,2]);
    G1.removeVertex(1);
    expect(G1.size()).toBe(1);
  })

  test("Test basic removal", () => {
    let G = new Graph(undefined,false);
    G.addEdge([1,2]);
    G.addEdge([3,4]);
    expect(G.removeEdge([1,2])).toBe(true);
    expect(G.removeVertex(3)).toBe(true);
    expect(G.size()).toBe(3);
  })

  test("Test vertex/edge removal on stuff that isn't there", () => {
    let G = new Graph(undefined,false);
    G.addVertex(1);
    expect(G.removeVertex(2)).toBe(false);
    expect(G.removeEdge([1,2])).toBe(false);
    expect(G.size()).toBe(1);
  })

  test('bfs test simple graph', () => {
    let G = new Graph(undefined,false);
    G.addEdge([1,2]);
    G.addEdge([2,3]);
    G.addEdge([3,4]);
    G.addEdge([1,5]);
    G.addEdge([5,4]);
    expect(G.bfs(1,4)).toStrictEqual([[1,5,4],true]);
    G.addVertex(26);
    expect(G.bfs(1,7)).toStrictEqual([[],false]);
  })

  test('bfs test more complicated graph', () => {
    let G = new Graph(undefined,false);
    G.addEdge([1,2]);
    G.addEdge([2,4]);
    G.addEdge([2,5]);
    G.addEdge([7,5]);
    G.addEdge([7,6]);
    G.addEdge([4,5]);
    G.addEdge([4,6]);
    G.addEdge([8,6]);
    G.addEdge([9,6]);
    G.addEdge([3,4]);
    G.addEdge([2,12]);
    G.addEdge([13,12]);
    G.addEdge([13,14]);
    G.addEdge([15,14]);
    G.addEdge([7,15]);
    G.addVertex(26);

    expect(G.bfs(1,5)).toStrictEqual([[1,2,5],true]);
    expect(G.bfs(13,5)).toStrictEqual([[13,12,2,5],true]);
    expect(G.bfs(8,14)).toStrictEqual([[8,6,7,15,14],true]);
    expect(G.bfs(14,8)).toStrictEqual([[14,15,7,6,8],true]);
    expect(G.bfs(14,26)).toStrictEqual([[],false]);
    expect(G.bfs(1,1)).toStrictEqual([[1],true]);
  })

})