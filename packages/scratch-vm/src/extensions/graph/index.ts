import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Block } from "../../typescript-support/types";
import { Graph, vertex, edge } from './graph';
import { Draw } from './draw';

type DisplayDetails = {
  title: "Basic Graph Theory",
  description: "Visualize some basic properties of graphs and graph algorithms",
  iconURL: "graph.png",
  insetIconURL: "typescript-logo.svg"
};

type Blocks = {
  // playNote: (a: number) => void;
  report: () => number;
  addVertex: () => void;
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
  // runtime
  // runtime;
  // private blockUtility;
  private vertexDisplay: Map<number,VertexDisplayInfo>;
  private currVertices : vertex[];
  private G : Graph;

  init() { 
    console.log('Get ready to graph it up.');
    this.d = new Draw(this.runtime);
    this.vertexDisplay = new Map();
    this.currVertices = [];
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
  }

  blockBuilders() {
    return ({
    // 'playNote': (self: GraphExtension): Block<(a: number) => void> => {
    //   return {
    //     type: BlockType.Command,
    //     args: [{ type: ArgumentType.Number }],
    //     text: (a) => `Play note: ${a}`,
    //     operation: (a) => { console.log(`Playing ${a}`); /*let foo = new Graph(); foo.addVertex('a'); foo.addVertex('b'); foo.removeVertex('a')*/},
    //   }
    // },
    'addVertex': (self: GraphExtension): Block<() => void> => {
      return {
        type: BlockType.Command,
        args: [],
        text: () => 'addVertex',
        operation: this.addVertex.bind(self)
      }
    },

    'report': this.buildDisplay

  })};

  addVertex() {
    const len = this.currVertices.length;
    if (len < this.G.max_size) {
      this.G.addVertex(len);
      this.currVertices.push(len);
    } else {
      alert(`Max graph size is ${this.G.max_size}`);
    }
    console.log(this.G);
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