export const Conditon = {
  ExtensionsSuccesfullyBundled: "extensions complete",
  ErrorBundlingExtensions: "extensions error"
} as const;

type ValueOf<T> = T[keyof T];

export type Message = {
  condition: ValueOf<typeof Conditon>
}

export const sendToParent = (child: NodeJS.Process, message: Message) => {
  if (!child || !('send' in child)) return;
  child?.send(message);
}