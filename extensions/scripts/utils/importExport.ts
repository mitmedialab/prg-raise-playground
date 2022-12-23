export const toNamedDefaultExport = (details: { path: string, name: string }) =>
  `export { default as ${details.name} } from '${details.path}';`;

export const exportAllFromModule = (path: string) => `export * from '${path}';`;

export const importStatement = (what: string, where: string) => `import ${what} from '${where}';`;