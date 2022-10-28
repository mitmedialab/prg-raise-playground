const sveltePreprocess = require("svelte-preprocess");

const createSveltePreprocessor = () => {
  return sveltePreprocess({
    tsconfigFile: "tsconfig.svelte.json",
  });
};

module.exports = {
  preprocess: createSveltePreprocessor(),
  createSveltePreprocessor,
};