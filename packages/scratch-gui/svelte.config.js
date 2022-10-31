const sveltePreprocess = require("svelte-preprocess");

const createSveltePreprocessor = () => {
  return sveltePreprocess({
    aliases: [["scratch-vm", "../scratch-vm"]],
    typescript: {
      tsconfigFile: "./tsconfig.json",
    }
  });
};

module.exports = {
  preprocess: createSveltePreprocessor(),
  createSveltePreprocessor,
};