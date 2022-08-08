import { Graph } from './graph';

describe("Graph tests", () => {
  test("Test exists and add vertex", () => {
    let G = new Graph(4,false);
    G.addVertex('a');
    G.addVertex('b');
    G.addVertex('c');
    G.addVertex('d');
    expect(G.exists('c')).toBe(true);
    expect(G.exists('e')).toBe(false);
  })

  test("Test max size addV", () => {
    let G = new Graph(3,false);
    G.addVertex('a');
    G.addVertex('b');
    G.addVertex('c');
    expect(G.size()).toBe(3);
    G.addVertex('d');
    expect(G.size()).toBe(3);
  })

  test("Test basic add edge functionality", () => {
    let G = new Graph(3,false);
    G.addEdge(['a','b']);
    expect(G.size()).toBe(2);
    G.addEdge(['a','c']);
    expect(G.size()).toBe(3);
    G.addEdge(['a','c']);
    expect(G.size()).toBe(3); //adding the same edge again should not affect size
  })

  test("Test basic add edge functionality with both/only 1 vertex present", () => {
    let G = new Graph(undefined,false);
    G.addVertex('a');
    G.addVertex('b');
    G.addEdge(['a','b']);
    expect(G.existsEdge(['a','b'])).toBe(true);

    let G1 = new Graph(undefined,false);
    G1.addVertex('a');
    G1.addEdge(['b','a']);
    expect(G1.existsEdge(['a','b'])).toBe(true);

  })

  test("Test max size addE where neither exists", () => {
    let G = new Graph(3,false);
    G.addEdge(['a','b']);
    G.addEdge(['a','c']);
    G.addEdge(['d','e']);
    expect(G.size()).toBe(3);
  })

  test("Test max size addE where one exists and we're already at the limit", () => {
    let G = new Graph(3,false);
    G.addEdge(['a','b']);
    G.addEdge(['a','c']);
    G.addEdge(['a','d']);
    expect(G.size()).toBe(3);
  })

  test("Test max size addE where one exists and we're not at the limit", () => {
    let G = new Graph(3,false);
    G.addEdge(['a','b']);
    G.addEdge(['a','c']);
    G.addEdge(['a','e']);
    expect(G.size()).toBe(3);
  })

  test("Test that neither vertex is added in addEdge if there's room for one more", () => {
    let G = new Graph(4,false);
    G.addEdge(['a','b']);
    G.addEdge(['a','c']);
    G.addEdge(['e','d']);
    expect(G.size()).toBe(3);
  })

  test("Test existsEdge", () => {
    let G = new Graph(undefined,false);
    G.addEdge(['a','a']);
    expect(G.size()).toBe(0);
    G.addEdge(['a','b']);
    expect(G.size()).toBe(2);
    expect(G.existsEdge(['a','b'])).toBe(true);
    expect(G.existsEdge(['b','a'])).toBe(true); // E(v1,v2) === E(v2,v1)
    expect(G.existsEdge(['a','c'])).toBe(false);
    G.addVertex('c');
    expect(G.existsEdge(['a','c'])).toBe(false);
  })

  test("Test remove vertex", () => {
    let G = new Graph(undefined,false);
    G.addVertex('a');
    G.addVertex('b');
    G.removeVertex('a');
    expect(G.size()).toBe(1);

    let G1 = new Graph(undefined,false);
    G1.addEdge(['a','b']);
    G1.removeVertex('a');
    expect(G1.size()).toBe(1);
  })

  test("Test basic removal", () => {
    let G = new Graph(undefined,false);
    G.addEdge(['a','b']);
    G.addEdge(['c','d']);
    expect(G.removeEdge(['a','b'])).toBe(true);
    expect(G.removeVertex('c')).toBe(true);
    expect(G.size()).toBe(3);
  })

  test("Test vertex/edge removal on stuff that isn't there", () => {
    let G = new Graph(undefined,false);
    G.addVertex('a');
    expect(G.removeVertex('b')).toBe(false);
    expect(G.removeEdge(['a','b'])).toBe(false);
    expect(G.size()).toBe(1);
  })

  test('bfs test simple graph', () => {
    let G = new Graph(undefined,false);
    G.addEdge(['a','b']);
    G.addEdge(['b','c']);
    G.addEdge(['c','d']);
    G.addEdge(['a','e']);
    G.addEdge(['e','d']);
    G.bfs('a','d');
    G.addVertex('z');
    G.bfs('a','g');
  })

  test('bfs test more complicated graph', () => {
    let G = new Graph(undefined,false);
    G.addEdge(['a','b']);
    G.addEdge(['b','d']);
    G.addEdge(['b','e']);
    G.addEdge(['g','e']);
    G.addEdge(['g','f']);
    G.addEdge(['d','e']);
    G.addEdge(['d','f']);
    G.addEdge(['h','f']);
    G.addEdge(['i','f']);
    G.addEdge(['c','d']);
    G.addEdge(['b','l']);
    G.addEdge(['m','l']);
    G.addEdge(['m','n']);
    G.addEdge(['o','n']);
    G.addEdge(['g','o']);
    G.addVertex('z');

    expect(G.bfs('a','e')).toStrictEqual(['a','b','e']);
    expect(G.bfs('m','e')).toStrictEqual(['m','l','b','e']);
    expect(G.bfs('h','n')).toStrictEqual(['h','f','g','o','n']);
    expect(G.bfs('n','h')).toStrictEqual(['n','o','g','f','h']);
    expect(G.bfs('n','z')).toStrictEqual([]);
  })

})