const sveltePreprocess = require("svelte-preprocess");

const createSveltePreprocessor = () => {
  return sveltePreprocess({});
};

module.exports = {
  preprocess: createSveltePreprocessor(),
  createSveltePreprocessor,
};