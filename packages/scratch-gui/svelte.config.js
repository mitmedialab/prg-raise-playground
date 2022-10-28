const sveltePreprocess = require("svelte-preprocess");

const createSveltePreprocessor = () => {
  return sveltePreprocess({
    tsconfigFile: "tsconfig.json",
    sourceMap: true,
  });
};

module.exports = {
  preprocess: createSveltePreprocessor(),
  createSveltePreprocessor,
};