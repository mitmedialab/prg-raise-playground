export const toNamedDefaultExport = (details: { path: string, name: string }) =>
  `export { default as ${details.name} } from '${details.path}';`;

export const importStatement = (what: string, where: string) => `import ${what} from '${where}';`;