const sveltePreprocess = require("svelte-preprocess");

const createSveltePreprocessor = () => {
  return sveltePreprocess({
    aliases: [["scratch-vm", "../scratch-vm", "scratch-blocks", "../scratch-blocks"]],
    typescript: {
      tsconfigFile: "./tsconfig.json",
    }
  });
};

module.exports = {
  preprocess: createSveltePreprocessor(),
  createSveltePreprocessor,
};