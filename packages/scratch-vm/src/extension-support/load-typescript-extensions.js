const getPathToExtension = (extensionId) => `../extensions/${decode(extensionId)}`;
const serveExtension = (extensionId) => require(getPathToExtension(extensionId));

const tryLoadAnonymousExtension = (extensionId) => {
  try { return serveExtension(extensionId); }
  catch(e) { return console.error(e) }
}
