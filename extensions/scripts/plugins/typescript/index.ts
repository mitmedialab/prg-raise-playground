import type { Plugin, RollupOptions, SourceDescription } from 'rollup';
import Transpiler from './Transpiler';
import { retrieveExtensionDetails } from './typeProbing';

/*
const announceError = (semanticProgram: ts.EmitAndSemanticDiagnosticsBuilderProgram) => {
  console.log("here");
  printDiagnostics(semanticProgram.getProgram(), semanticProgram.getSemanticDiagnostics());
  sendToParent(process, { condition: "typescript error" });
}

const announceTranspilation = () => sendToParent(process, { condition: "transpile complete" });
*/

export default function ({ entry }: { entry: string }): Plugin {
  let ts: Transpiler;

  return {
    name: 'custom',

    buildStart() {
      ts ??= Transpiler.Make(
        [entry],
        (t) => {
          console.log(retrieveExtensionDetails(t.program));
        },
        () => this.error("uh oh!")
      );
    },

    buildEnd() {
      if (this.meta.watchMode !== true) ts?.close();
    },
  }
}
