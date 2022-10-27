export enum Flag {
  InitialTranspileComplete,
  TsError
}

export type Message = {
  flag: Flag
}

export const sendToParent = (child: NodeJS.Process, message: Message) => {
  if (!child || !('send' in child)) return;
  child?.send(message);
}