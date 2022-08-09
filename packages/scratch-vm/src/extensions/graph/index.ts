import { ArgumentType, BlockType } from "../../typescript-support/enums";
import { Extension } from "../../typescript-support/Extension";
import { Block } from "../../typescript-support/types";
import { Graph } from './graph';
import { Draw } from './draw';

type DisplayDetails = {
  title: "Basic Graph Theory",
  description: "Visualize some basic properties of graphs and graph algorithms",
  iconURL: "graph.png",
  insetIconURL: "typescript-logo.svg"
};

type Blocks = {
  playNote: (a: number) => void;
  // report: () => number;
  report: () => number;
  // display: () => void;
  // add: (left: number, right: number) => number;
}

type coordinatePair = [x:number,y:number];

type VertexDisplayInfo = {
  coordinates: coordinatePair;
  focus: coordinatePair;
}

class GraphExtension extends Extension<DisplayDetails, Blocks> {
  options: number[];
  name = () => "ScratchGraph";
  d : Draw;
  // runtime
  runtime;
  blockUtility;

  init(runtime) { 
    console.log('Get ready to graph it up.');
    this.d = new Draw(this.runtime);
    console.log(this.runtime);
    // this.runtime = runtime;
    // console.log(this.runtime);
    // this.blockUtility = this.blockUtility;
    // this.d.scaledVector
  }

  blockBuilders() {
    return ({

    // Example of an external 'builder' function
    // 'add': addBuilder,

    // Example of a method 'builder' function
    // 'report': this.buildDisplay,

    // Example of an arrow 'builder' function 
    'playNote': (self: GraphExtension): Block<(a: number) => void> => {
      return {
        type: BlockType.Command,
        args: [{ type: ArgumentType.Number }],
        text: (a) => `Play note: ${a}`,
        operation: (a) => { console.log(`Playing ${a}`); let foo = new Graph(); foo.addVertex('a'); foo.addVertex('b'); foo.removeVertex('a')},
      }
    },

    'report': this.buildDisplay//.bind(this)

    // 'display': (self: GraphExtension): Block< () => void> => {
    //   return {
    //     type: BlockType.Command,
    //     args: [],
    //     text: () => `display`,
    //     operation: () => this.display
    //   }
    // }
  })};

  // display(slf) {



  //   // console.log(b);
  // }

  // buildDisplay(): Block<() => void> {

  //   const getFive = () => console.log(5);

  //   const display = (blockUtility) => getFive();

  //   return {
  //     type: BlockType.Command,
  //     args: [],
  //     text: () => "display",
  //     operation: this.display,
  //   }
  // }

  buildDisplay(slf): Block<() => void> {

    const getFive = () => console.log(5);

    const display = (blockUtility) => {
      console.log(blockUtility);
      console.log(slf.runtime)
      console.log(this.d,slf.d);

      const coords = [[81,-8],[-11,-31],[-50,50],[-2,105],[100,60],[112,143],[178,60],[-183,27],[-194,-66],[-144,115],[-206,145],[-201,-132],[-132,-106],[-46,140],[-110,-30],[-20,-129],[23,-80],[76,-126],[189,-36],[117,-76]];
      let G = new Graph();
      G.addEdge(['0','1']);
      G.addEdge(['0','6']);
      G.addEdge(['0','4']);
      G.addEdge(['4','5']);
      G.addEdge(['2','4']);
      G.addEdge(['2','3']);
      // console.log(slf.d);
      // console.log(slf.runtime);
      // console.log(blockUtility);
      const verts = [0,1,2,3,4,5,6];
      const curr = coords.filter((x:number[],i:number) => {
        return verts.indexOf(i) >= 0;
      })
      const curr_with_idx : [number[],number][] = curr.map((x,i) => [x,i]);
      // console.log(curr_with_idx);
      // slf.d.drawLetter('circle', 0,0, 3, [], blockUtility);
      
      curr_with_idx.forEach(([[x,y],i]) => {
        // if (i >= 2) return;
        // const [a,b] = this.drawLetter('o', x,y, 3, args, util);
        // const drawL = slf.d.drawLetter.bind(slf.d);
        // const drawS = slf.d.drawString.bind(slf.d);
        const [a2,b2] = slf.d.drawLetter('circle', x,y, 3, [], blockUtility);
        // foci.push([a2,b2]);
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