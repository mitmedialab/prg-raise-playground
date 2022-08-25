import { fork } from 'child_process';
import path = require("path");
import { Message, Flag } from './devComms';
import { packages } from './paths';

const { vm, gui } = packages;

const webpack = path.join(gui, "node_modules", ".bin", "webpack-dev-server");
const config = path.join(gui, "webpack.config.js");
const transpile = path.join(vm, "scripts", "transpile.ts");

const transpilation = fork(transpile, ["watch=true", "cache=true"]);
const children = [transpilation];

transpilation.on("message", (msg: Message) => {
  const { flag } = msg;
  switch (flag) {
    case Flag.TsError:
      children.forEach(child => child.kill());
      break;
    case Flag.InitialTranspileComplete:
      const bundle = fork(webpack, ["--config", config], { cwd: gui });
      children.push(bundle);
      break;
  }
});