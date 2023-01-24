export const output = "";

export default (details: {
  id: string,
  default: string,
  description: string
}) => ({
  format: (details: Record<string, any>): string => output
});