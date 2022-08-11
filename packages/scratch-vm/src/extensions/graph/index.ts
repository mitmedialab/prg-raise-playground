import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Block } from "../../typescript-support/types";
import { Graph, vertex, edge } from './graph';
import { Draw } from './draw';
import { NumTupSet } from './numtuple';
import type BlockUtility from '../../engine/block-utility';

type DisplayDetails = {
  title: "Basic Graph Theory",
  description: "Visualize some basic properties of graphs and graph algorithms",
  iconURL: "graph.png",
  insetIconURL: "typescript-logo.svg"
};

type Blocks = {
  addVertex: (v:vertex) => void;
  addEdge: (v1:vertex,v2:vertex) => void;
  removeVertex: (v:vertex) => void;
  removeEdge: (v1:vertex,v2:vertex) => void;
  clear: () => void;
  clearEdges: () => void;
  shortestPath: (v1:vertex,v2:vertex) => void;
  Kn: (n:number) => void;
  randomGraph: (vertexProb:number, edgeProb:number) => void;
  spanningForest: () => void;
}

type coordinatePair = [x:number,y:number];

type VertexDisplayInfo = {
  label: number;
  coordinates: coordinatePair;
  focus: coordinatePair;
}

class GraphExtension extends Extension<DisplayDetails, Blocks> {
  options: number[];
  name = () => "ScratchGraph";
  d : Draw;
  private vertexDisplay: Map<number,VertexDisplayInfo>;
  private originialVertexDisplay: Map<number,VertexDisplayInfo>;
  private currVertices: Set<vertex>;
  private currEdges: Set<string>; //do not reassign currEdges
  private G: Graph;
  private addCurrEdge: (e:edge) => void;
  private hasCurrEdge: (e:edge) => boolean;
  private removeCurrEdge: (e:edge) => boolean;
  private valuesCurrEdges: () => Set<edge>;
  private forEachCurrEdge: (f:((e:edge) => any)) => void;
  private range = {min:0,max:19};
  private lastWasComplete : boolean;
  private prev_k_n_size : number;

  init() { 
    console.log('Get ready to graph it up.');
    this.d = new Draw(this.runtime);
    this.vertexDisplay = new Map();
    this.originialVertexDisplay = new Map();

    this.currVertices = new Set();
    this.currEdges = new Set();

    const coords : coordinatePair[] = [[81,-8],[-11,-31],[-50,50],[-2,105],[100,60],[112,143],[178,60],[-183,27],[-194,-66],[-144,115],[-206,145],[-201,-132],[-132,-106],[-46,140],[-110,-30],[-20,-129],[23,-80],[76,-126],[189,-36],[117,-76]];
    const foci : coordinatePair[] = [[99.26,-26],[7.26,-49],[-31.74,32],[16.26,87],[118.26,42],[130.26,125],[196.26,42],[-164.73,9],[-175.74,-84],[-125.73,97],[-187.74,127],[-182.73,-150],[-113.73,-124],[-27.73,122],[-91.73,-48],[-1.74,-147],[41.26,-98],[94.26,-144],[207.26,-54],[135.26,-94]];
    coords.forEach((_:coordinatePair,i:number) => {
      const infoForVertex = {
        label: i,
        coordinates: coords[i],
        focus: foci[i]
      }
      this.vertexDisplay.set(i,infoForVertex);
      this.originialVertexDisplay.set(i,infoForVertex);
      this.prev_k_n_size = -1;
    })

    this.G = new Graph(20,false);
    this.lastWasComplete = false;

    this.addCurrEdge = NumTupSet.add(this.currEdges);
    this.hasCurrEdge = NumTupSet.has(this.currEdges);
    this.removeCurrEdge = NumTupSet.delete_(this.currEdges);
    this.valuesCurrEdges = () => NumTupSet.values(this.currEdges);
    this.forEachCurrEdge = NumTupSet.forEach(this.currEdges);
  }

  blockBuilders() {
    return ({
    'addVertex': (self: GraphExtension): Block<(v:vertex) => void> => {
      return {
        type: BlockType.Command,
        args: [ {type: ArgumentType.Number, defaultValue: 0} ],
        text: (v:vertex) => `add vertex ${v}`,
        operation: this.addVertex.bind(self)
      }
    },

    'addEdge': (self: GraphExtension): Block<(v1:number,v2:number) => void> => {
      return {
        type: BlockType.Command,
        args: [ { type: ArgumentType.Number, defaultValue: 0 }, { type: ArgumentType.Number, defaultValue: 1 }],
        text: (v1:vertex,v2:vertex) => `add edge (${v1},${v2})`,
        operation: this.addEdge.bind(self)
      }
    },

    'removeVertex': (self: GraphExtension): Block<(v:vertex) => void> => {
      return {
        type: BlockType.Command,
        args: [{ type: ArgumentType.Number }],
        text: (v:vertex) => `remove vertex ${v}`,
        operation: this.removeVertex.bind(self)
      }
    },

    'removeEdge': (self: GraphExtension): Block<(v1:vertex,v2:vertex,dontupdate?:boolean) => void> => {
      return {
        type: BlockType.Command,
        args: [{ type: ArgumentType.Number, defaultValue: 0 }, { type: ArgumentType.Number, defaultValue: 1 }],
        text: (v1:vertex,v2:vertex) => `remove edge (${v1},${v2})`,
        operation: this.removeEdge.bind(self)
      }
    },

    'Kn': (self: GraphExtension): Block<(n:number) => void> => {
      return {
        type: BlockType.Command,
        args: [ { type: ArgumentType.Number, defaultValue: 8 }],
        text: (n) => `get the complete graph on ${n} vertices`,
        operation: this.Kn.bind(this)
      }
    },

    'randomGraph': (self: GraphExtension): Block<(vertexProb:number,edgeProb:number) => void> => {
      return {
        type: BlockType.Command, 
        args: [ { type: ArgumentType.Number, defaultValue: 50 }, { type: ArgumentType.Number, defaultValue: 50 } ], 
        text: (p1,p2) => `get random graph with ${p1}% vertex probability, ${p2}% edge prob.`,
        operation: this.randomGraph.bind(this)
      }
    },

    'shortestPath': (self: GraphExtension): Block<(v1:vertex,v2:vertex) => void> => {
      return {
        type: BlockType.Command,
        args: [ { type: ArgumentType.Number, defaultValue: 0 }, { type: ArgumentType.Number, defaultValue: 1 } ],
        text: (v1,v2) => `find shortest path from ${v1} to ${v2}`,
        operation: this.shortestPath.bind(this)
      }
    },

    'spanningForest': (self: GraphExtension): Block<() => void> => {
      return {
        type: BlockType.Command,
        args: [],
        text: () => `find a spanning forest`,
        operation: this.spanningForest.bind(this)
      }
    },

    'clear': (self: GraphExtension): Block<() => void> => {
      return {
        type: BlockType.Command,
        args: [],
        text: () => 'reset graph',
        operation: this.clear.bind(this)
      }
    },

    'clearEdges': (self: GraphExtension): Block<() => void> => {
      return {
        type: BlockType.Command,
        args: [],
        text: () => 'reset edges',
        operation: this.clearEdges.bind(this)
      }
    }


  })};

  private includeFromProbability(p, random_outcome) {
    return p - random_outcome > 0;
  }

  spanningForest(util:BlockUtility) {
    this.updateDisplay(util);
    const edgesToHighlight : edge[] = this.G.bfsAll().flat();
    this.d.setPenColorToColor('0xff0000',util);
    edgesToHighlight.forEach(e => this.drawEdge(e,util));
    this.d.setPenColorToColor('0x0000ff',util);

  } 

  randomGraph(vertex_probability:number, edge_probability:number, util:BlockUtility) {
    const max_vertices = 13;
    this.clear(util);
    this.lastWasComplete = false;
    const coords = this.pointsAroundCircle(max_vertices);
    this.vertexDisplay = new Map();
    this.currVertices = new Set();
    for (let i = 0; i < this.G.size(); i++) {
      this.G.removeVertex(i); //will also remove all edges in this.G
    }

    coords.forEach((_:coordinatePair,i:number) => {
      this.vertexDisplay.set(i,{
        label: i,
        coordinates: coords[i],
        focus: [0,0] //temporary, will be calculated in drawVertex
      });
    });

    const adjusted_vertex_prob = vertex_probability/100;
    const adjusted_edge_prob = edge_probability/100;
    
    for (let i = 0; i < max_vertices; i++) {
      if (this.includeFromProbability(adjusted_vertex_prob,Math.random())) {
        this.currVertices.add(i);
        this.drawVertex(i,util,true); //third param will cause focus to be calculated and stored
        this.G.addVertex(i);
      }
    }

    const currVerticesArray = Array.from(this.currVertices.values());

    this.currVertices.forEach(v => {
      const indexInCurrV = currVerticesArray.indexOf(v);
      for (let i = indexInCurrV + 1; i < currVerticesArray.length; i++) {
        if (this.includeFromProbability(adjusted_edge_prob, Math.random())) {
          this.addEdge(v,currVerticesArray[i],util,true);
        }
      }
    })

    this.lastWasComplete = true;
    this.updateDisplay(util);
  }

  /**
   * Gets @param num_points coordinates evenly spaced around a circle
   * of radius 130 and center (0,20).
   * @param num_points 
   * @returns the array of coordinates
   */
  private pointsAroundCircle(num_points:number) : coordinatePair[] {
    if (num_points <= 0) return [];
    const x0 = 0;
    const y0 = 20;
    const radius = 130;
    const theta = (2 * Math.PI) / num_points;
    let res : coordinatePair[] = [];
    for (let i = 1; i < num_points + 1; i++) {
      const x = radius * Math.cos(theta * i) + x0;
      const y = radius * Math.sin(theta * i) + y0;
      res.push([x,y]);
    }
    return res;
  }

  /**
   * Generates the complete graph on @param n vertices.
   * @param n - number of vertices
   * @param util 
   */
  Kn(n:number,util:BlockUtility) {
    if (this.prev_k_n_size === n) return;
    this.prev_k_n_size = n;
    this.lastWasComplete = false;
    if (n < 0 || n > 13) {
      alert(`maximum complete graph size is 13 vertices`);
    } else {
      this.clearEdges(util);
      if (n === 0) { 
        this.clear(util); 
        return; 
      }

      const coords = this.pointsAroundCircle(n);
      this.vertexDisplay = new Map();
      this.currVertices = new Set();
      for (let i = 0; i < this.G.size(); i++) {
        this.G.removeVertex(i); //will also remove all edges in this.G
      }

      coords.forEach((_:coordinatePair,i:number) => {
        this.vertexDisplay.set(i,{
          label: i,
          coordinates: coords[i],
          focus: [0,0] //temporary, will be calculated in drawVertex
        });

        this.currVertices.add(i);
        this.drawVertex(i,util,true); //third param will cause focus to be calculated and stored
        this.G.addVertex(i);
        
      });

      //add edges
      for (let i = 0; i < coords.length; i++) {
        for (let j = 0; j < coords.length; j++) {
          this.addEdge(i,j,util,true);
        }
      }
      this.updateDisplay(util);
      this.lastWasComplete = true;
    }
  }

  private checkLastWasComplete() {
    if (this.lastWasComplete) {
      alert("You can't add to complete/random graphs. Reset graph to continue");
    }
    return this.lastWasComplete;
  }

  shortestPath(src:vertex,dest:vertex,util:BlockUtility) {
    this.updateDisplay(util);
    const [path,found] = this.G.bfs(src,dest);
    if (found && path.length > 1) {
      let edgePath : edge[] = [];
      for (let i = 0; i < path.length - 1; i++) {
        edgePath.push([path[i],path[i+1]]);
      }
      this.d.setPenColorToColor('0xff0000',util);
      edgePath.forEach(e => this.drawEdge(e,util));
      this.d.setPenColorToColor('0x0000ff',util);

    } else {
      this.updateDisplay(util);
    }
  }

  clear(util:BlockUtility) {
    this.prev_k_n_size = -1;
    this.lastWasComplete = false;
    this.vertexDisplay = this.originialVertexDisplay; //revert to original vertex display settings
    this.currVertices = new Set();
    this.forEachCurrEdge(([v1,v2]) => this.removeEdge(v1,v2,util,true));
    this.updateDisplay(util);
  }

  clearEdges(util:BlockUtility) {
    this.forEachCurrEdge(([v1,v2]) => this.removeEdge(v1,v2,util,true));
    this.updateDisplay(util);
  }

  private inRange(v:vertex) : boolean {
    return v >= this.range.min && v <= this.range.max;
  }

  private drawEdge([v1,v2]:edge,util) {
    const vertexDispInfo1 = this.vertexDisplay.get(v1);
    const vertexDispInfo2 = this.vertexDisplay.get(v2);
    const focus1 = vertexDispInfo1.focus;
    const focus2 = vertexDispInfo2.focus;
    this.d.drawLineBetweenCircles(focus1,focus2,23.868,util);
  }

  /**
   * 
   * @param v vertex to draw
   * @param util 
   * @param calculateFocus optional boolean. If set to true, {@link this.d.drawLetter} 
   * will calculate the foci for each circle and return it, and this will be set as the focus 
   * in {@link this.vertexDisplay}.
   */
  private drawVertex(v:vertex,util:BlockUtility,calculateFocus?:boolean) {
      const vertexDispInfo = this.vertexDisplay.get(v);
      const [x,y] = vertexDispInfo.coordinates;
      let focus_x: number;
      let focus_y: number;
      if (!calculateFocus) {
        [focus_x,focus_y] = vertexDispInfo.focus;
        this.d.drawLetter('circle', x,y, 3, [], util);
      } else {
        [focus_x,focus_y] = this.d.drawLetter('circle', x,y, 3, [], util,true);
        vertexDispInfo.focus = [focus_x,focus_y];
      }
      const prevDiameter = this.d.getCurrentDiameter(util);
      this.d.setPenDiameter(1.0,util);
      this.d.drawString(`${v}`,focus_x-7,focus_y,.5,[],util);
      this.d.setPenDiameter(prevDiameter,util);
  }

  private updateDisplay(util : BlockUtility,calculateFocus?:boolean) {
    this.d.clear();
    this.currVertices.forEach(v => this.drawVertex(v,util,calculateFocus));
    this.forEachCurrEdge(e => this.drawEdge(e,util));
  }


  addVertex(v: vertex,util : BlockUtility,dontupdate?:boolean) {
    if (!(this.inRange(v))) {
      alert(`vertex values in the range ${this.range.min}-${this.range.max}, inclusive, are accepted`);
    } else if (this.checkLastWasComplete()) {} 
      else {
      const len = this.currVertices.size;
      if (len < this.G.max_size) {
        this.G.addVertex(v);
        this.currVertices.add(v);
      } else {
        alert(`Max graph size is ${this.G.max_size}`);
      }
    }
    if (!dontupdate) this.updateDisplay(util);
  }

  addEdge(v1:vertex,v2:vertex,util:BlockUtility,dontupdate?:boolean) {
    if (!(this.inRange(v1) && this.inRange(v2))) {
      console.log(v1,v2, ':(');
      alert(`vertex values in the range ${this.range.min}-${this.range.max}, inclusive, are accepted`);
    } else if (this.lastWasComplete && !(this.currVertices.has(v1) && this.currVertices.has(v2))) {
      alert('you can only add edges between existing vertices in (previously) complete/random graphs. Reset graph to continue');
    } else if (this.G.addEdge([v1,v2]) && !this.hasCurrEdge([v2,v1])) {
      this.addCurrEdge([v1,v2]);
      this.currVertices.add(v1);
      this.currVertices.add(v2);
    }
    if (!dontupdate) this.updateDisplay(util);
  }

  removeEdge(v1:vertex,v2:vertex,util:BlockUtility,dontupdate?:boolean) {
    if (this.G.removeEdge([v1,v2])) {
      if (!this.removeCurrEdge([v1,v2])) {
        this.removeCurrEdge([v2,v1]);
      }
    }
    if (!dontupdate) this.updateDisplay(util);
  }


  removeVertex(v : vertex,util:BlockUtility,dontupdate?:boolean) {
    if (this.G.removeVertex(v)) {
      this.currVertices.delete(v);
      const newEdges = Array.from(this.valuesCurrEdges()).filter(([v1,v2]) => {console.log([v1,v2],v); return v !== v1 && v !== v2});
      this.currEdges.clear();
      newEdges.forEach(e => this.addCurrEdge(e));
    }
    if (!dontupdate) this.updateDisplay(util);
  }
}

export = GraphExtension;