import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Block } from "../../typescript-support/types";
import { Graph, vertex, edge } from './graph';
import { Draw } from './draw';
import { NumTupSet } from './numtuple';

type DisplayDetails = {
  title: "Basic Graph Theory",
  description: "Visualize some basic properties of graphs and graph algorithms",
  iconURL: "graph.png",
  insetIconURL: "typescript-logo.svg"
};

type Blocks = {
  // playNote: (a: number) => void;
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
    console.log(this.runtime);

    this.G = new Graph(20,false);

    this.toStr = NumTupSet.toStr;
    this.fromStr = NumTupSet.fromStr;
    this.add = NumTupSet.add(this.currEdges);
    this.has = NumTupSet.has(this.currEdges);
    this.remove = NumTupSet.delete_(this.currEdges);
    this.values = () => NumTupSet.values(this.currEdges);
    this.forEach = NumTupSet.forEach(this.currEdges);
  }

  blockBuilders() {
    return ({
    'addVertex': (self: GraphExtension): Block<(v:vertex) => void> => {
      return {
        type: BlockType.Command,
        args: [ {type: ArgumentType.Number, defaultValue: 0}],
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



  addVertex(v: vertex) {
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

  }

  addEdge(v1:vertex,v2:vertex) {
    if (!(this.inRange(v1) && this.inRange(v2))) {
      alert(`vertex values in the range ${this.range.min}-${this.range.max}, inclusive, are accepted`);
    } else if (this.G.addEdge([v1,v2]) && !this.has([v2,v1])) {
      console.log('here');
      this.add([v1,v2]);
      this.currVertices.add(v1);
      this.currVertices.add(v2);
    }
    this.print();

  }

  removeEdge(v1:vertex,v2:vertex) {
    if (this.G.removeEdge([v1,v2])) {
      console.log('a');
      if (!this.remove([v1,v2])) {
        console.log('b');
        console.log(this.remove([v2,v1]));
      }
    }
    this.print();

  }

  print() {
    console.log('graph',this.G);
    console.log('verts',this.currVertices);
    console.log('edges',this.currEdges);
  }

  removeVertex(v : vertex) {
    if (this.G.removeVertex(v)) {
      this.currVertices.delete(v);
      const newEdges = Array.from(this.values()).filter(([v1,v2]) => {console.log([v1,v2],v); return v !== v1 && v !== v2});
      this.currEdges.clear();
      newEdges.forEach(e => this.add(e));
      // let foo = Array.from(this.currVertices.values());
    }
    this.print();

    // const index = this.currVertices.indexOf()

  }

  buildDisplay(slf): Block<() => void> {

    const getFive = () => console.log(5);

    const display = (blockUtility) => {
      console.log(blockUtility);
      console.log(slf.runtime)
      console.log(this.d,slf.d);

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
      const curr_with_idx : [number[],number][] = curr.map((x,i) => [x,i]);
      
      // curr_with_idx.forEach(([[x,y],i]) => {
      //   const [a2,b2] = slf.d.drawLetter('circle', x,y, 3, [], blockUtility);
      //   // foci.push([a2,b2]);
      //   slf.d.drawString(`${i}`, a2-7, b2, .5, [], blockUtility);
      //   // i++;
      // })
      let foci = [];

      coords.forEach(([x,y],i) => {
        const [a2,b2] = slf.d.drawLetter('circle', x,y, 3, [], blockUtility);
        foci.push([a2,b2]);
        slf.d.drawString(`${i}`, a2-7, b2, .5, [], blockUtility);
        // i++;
      })
      console.log('foci',foci,foci.length);



      // for (let i = 0; i < foo.length; i++) {
      //   blockUtility.target.setXY(foo[i][0],foo[i][1]);
      //   setTimeout(() => {},1500);
      // }


      
      // const timer = ms => new Promise(res => setTimeout(res, ms))

      // async function load () { // We need to wrap the loop into an async function for this to work
      //   // const foo = [[99.26,-26],[7.26,-49],[-31.74,32],[16.26,87],[118.26,42],[130.26,125],[196.26,42],[-164.73,9],[-175.74,-84],[-125.73,97],[-187.74,127],[-182.73,-150],[-113.73,-124],[-27.73,122],[-91.73,-48],[-1.74,-147],[41.26,-98],[94.26,-144],[207.26,-54],[135.26,-94]];
      //   for (var i = 0; i < 20; i++) {
      //     blockUtility.target.setXY(foo[i][0],foo[i][1]);
      //     await timer(1500); // then the created Promise can be awaited
      //   }
      // }
      // load();
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