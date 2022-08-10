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
  report: () => number;
  addVertex: (v:vertex) => void;
  addEdge: (v1:vertex,v2:vertex) => void;
  removeVertex: (v:vertex) => void;
  removeEdge: (v1:vertex,v2:vertex) => void;
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
  private currVertices: Set<vertex>;
  private currEdges: Set<string>; //do not reassign currEdges
  private G: Graph;
  private toStr : (e:edge) => string;
  private fromStr : (str:string) => edge;
  private add: (e:edge) => void;
  private has: (e:edge) => boolean;
  private remove: (e:edge) => boolean;
  private values: () => Set<edge>;
  private forEach: (f:((e:edge) => any)) => void;
  private range = {min:0,max:19};

  init() { 
    console.log('Get ready to graph it up.');
    this.d = new Draw(this.runtime);
    this.vertexDisplay = new Map();

    this.currVertices = new Set();
    this.currEdges = new Set();

    const coords : coordinatePair[] = [[81,-8],[-11,-31],[-50,50],[-2,105],[100,60],[112,143],[178,60],[-183,27],[-194,-66],[-144,115],[-206,145],[-201,-132],[-132,-106],[-46,140],[-110,-30],[-20,-129],[23,-80],[76,-126],[189,-36],[117,-76]];
    const foci : coordinatePair[] = [[99.26,-26],[7.26,-49],[-31.74,32],[16.26,87],[118.26,42],[130.26,125],[196.26,42],[-164.73,9],[-175.74,-84],[-125.73,97],[-187.74,127],[-182.73,-150],[-113.73,-124],[-27.73,122],[-91.73,-48],[-1.74,-147],[41.26,-98],[94.26,-144],[207.26,-54],[135.26,-94]];
    coords.forEach((_:coordinatePair,i:number) => {
      this.vertexDisplay.set(i,{
        label: i,
        coordinates: coords[i],
        focus: foci[i]
      })
    })
    // console.log(this.runtime);

    this.G = new Graph(20,false);

    this.toStr = NumTupSet.toStr;
    this.fromStr = NumTupSet.fromStr;
    this.add = NumTupSet.add(this.currEdges);
    this.has = NumTupSet.has(this.currEdges);
    this.remove = NumTupSet.delete_(this.currEdges);
    this.values = () => NumTupSet.values(this.currEdges);
    this.forEach = NumTupSet.forEach(this.currEdges);
    // console.log(this.vertexDisplay);
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

    'report': this.buildDisplay,

    'removeVertex': (self: GraphExtension): Block<(v:vertex) => void> => {
      return {
        type: BlockType.Command,
        args: [{ type: ArgumentType.Number }],
        text: (v:vertex) => `remove vertex ${v}`,
        operation: this.removeVertex.bind(self)
      }
    },

    'removeEdge': (self: GraphExtension): Block<(v1:vertex,v2:vertex) => void> => {
      return {
        type: BlockType.Command,
        args: [{ type: ArgumentType.Number, defaultValue: 0 }, { type: ArgumentType.Number, defaultValue: 1 }],
        text: (v1:vertex,v2:vertex) => `remove edge (${v1},${v2})`,
        operation: this.removeEdge.bind(self)
      }
    },

  })};

  private inRange(v:vertex) : boolean {
    return v >= this.range.min && v <= this.range.max;
  }

  private drawEdge([v1,v2]:edge,util) {
    // this.d.setPenDiameter(5,util);
    const vertexDispInfo1 = this.vertexDisplay.get(v1);
    const vertexDispInfo2 = this.vertexDisplay.get(v2);
    const focus1 = vertexDispInfo1.focus;
    const focus2 = vertexDispInfo2.focus;
    this.d.drawLineBetweenCircles(focus1,focus2,23.868,util);
  }

  private drawVertex(v:vertex,util:BlockUtility) {
      // console.log('in draw ');
      const vertexDispInfo = this.vertexDisplay.get(v);
      const [x,y] = vertexDispInfo.coordinates;
      const [focus_x,focus_y] = vertexDispInfo.focus;
      this.d.drawLetter('circle', x,y, 3, [], util);
      const prevDiameter = this.d.getCurrentDiameter(util);
      // console.log('prev diameter',prevDiameter);
      this.d.setPenDiameter(1.0,util);
      this.d.drawString(`${v}`,focus_x-7,focus_y,.5,[],util);
      this.d.setPenDiameter(prevDiameter,util);
  }

  private updateDisplay(util : BlockUtility) {
    this.d.clear();
    this.currVertices.forEach(v => this.drawVertex(v,util));
    this.forEach(e => this.drawEdge(e,util));
  }


  addVertex(v: vertex,util : BlockUtility) {
    // console.log('DOLEV1', util);
    if (!(this.inRange(v))) {
      alert(`vertex values in the range ${this.range.min}-${this.range.max}, inclusive, are accepted`);
    } else {
      const len = this.currVertices.size;
      if (len < this.G.max_size) {
        this.G.addVertex(v);
        this.currVertices.add(v);
      } else {
        alert(`Max graph size is ${this.G.max_size}`);
      }
    }
    this.print();
    this.updateDisplay(util);
  }

  addEdge(v1:vertex,v2:vertex,util:BlockUtility) {
  // console.log('DOLEV3', util);
    if (!(this.inRange(v1) && this.inRange(v2))) {
      alert(`vertex values in the range ${this.range.min}-${this.range.max}, inclusive, are accepted`);
    } else if (this.G.addEdge([v1,v2]) && !this.has([v2,v1])) {
    // console.log('here');
      this.add([v1,v2]);
      this.currVertices.add(v1);
      this.currVertices.add(v2);
    }
    this.print();
    this.updateDisplay(util);
  }

  removeEdge(v1:vertex,v2:vertex,util:BlockUtility) {
  // console.log('DOLEV2', util);
    if (this.G.removeEdge([v1,v2])) {
    // console.log('a');
      if (!this.remove([v1,v2])) {
      // console.log('b');
        this.remove([v2,v1]);
      }
    }
    this.print();
    this.updateDisplay(util);
  }

  print() {
    console.log('graph',this.G);
    console.log('verts',this.currVertices);
    console.log('edges',this.currEdges);
  }

  removeVertex(v : vertex,util:BlockUtility) {
  // console.log('DOLEV4', util);
    if (this.G.removeVertex(v)) {
      this.currVertices.delete(v);
      const newEdges = Array.from(this.values()).filter(([v1,v2]) => {console.log([v1,v2],v); return v !== v1 && v !== v2});
      this.currEdges.clear();
      newEdges.forEach(e => this.add(e));
    }
    this.print();
    this.updateDisplay(util);
  }

  buildDisplay(slf): Block<() => void> {

    const getFive = () => console.log(5);

    const display = (blockUtility) => {
    // console.log(blockUtility);
    // console.log(slf.runtime)
    // console.log(this.d,slf.d);

      const coords = [[81,-8],[-11,-31],[-50,50],[-2,105],[100,60],[112,143],[178,60],[-183,27],[-194,-66],[-144,115],[-206,145],[-201,-132],[-132,-106],[-46,140],[-110,-30],[-20,-129],[23,-80],[76,-126],[189,-36],[117,-76]];
      let _G = new Graph();
      _G.addEdge([0,1]);
      _G.addEdge([0,6]);
      _G.addEdge([0,4]);
      _G.addEdge([4,5]);
      _G.addEdge([2,4]);
      _G.addEdge([2,3]);
      const verts = [0,1,2,3,4,5,6];
      const curr = coords.filter((x:number[],i:number) => {
        return verts.indexOf(i) >= 0;
      })
      let foci = [];

      coords.forEach(([x,y],i) => {
        const [a2,b2] = slf.d.drawLetter('circle', x,y, 3, [], blockUtility);
        foci.push([a2,b2]);
        slf.d.drawString(`${i}`, a2-7, b2, .5, [], blockUtility);
        // i++;
      })
    };


    return {
      type: BlockType.Command,
      args: [],
      text: () => "display graph",
      operation: display,
    }
  }
}

export = GraphExtension;