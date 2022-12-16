import fs from "fs";
import path from "path";
import { debug } from "./debug";

const extractMenuDetailsFromType = () => {
  return {
    name: 'extract-menu-details-from-extension-type',
    transform: {
      order: 'pre',
      handler: (code: string, id: string) => {
        debug(code, id);
      }
    }
  }
}