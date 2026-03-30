import { eslintConfigScratch } from 'eslint-config-scratch'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'

export default eslintConfigScratch.defineConfig(
  eslintConfigScratch.recommended,
  {
    files: ['src/**'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['*'], // files in the root of the package (not subdirectories)
    languageOptions: {
      globals: globals.node,
    },
  },
  globalIgnores(['coverage/**', 'dist/**', 'node_modules/**']),
)
