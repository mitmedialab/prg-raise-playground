export const codeSnippet = () => ({ end: null as symbol });
export const endSnippetCall: keyof ReturnType<typeof codeSnippet> = "end";
export const notRelevantToExample = (...args: any[]): any => { };