import path = require("path");
import assert = require("assert");
import fs = require("fs");
import { extensionsFolder } from "./paths";

const template = path.join(extensionsFolder, "typescript_templates", "default.ts");
assert(fs.existsSync(template));

