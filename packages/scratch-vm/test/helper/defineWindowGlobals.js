const jsdom = require("jsdom");

/**
 * 
 * @param {Document} document 
 */
function fillStylePointerEvents(document) {
  const actualCreateElement = document.createElement;

  return function fillIn() {
    const element = actualCreateElement.apply(document, arguments);

    element.style = {
      ...(element.style ?? {}),
      pointerEvents: undefined,
    }

    return element;
  };
}

function addMediaSource() {
  global.MediaSource = class MediaSource {
    addEventListener() {
      
    } 
  }  
}

module.exports = (function() {
  const dom = new jsdom.JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
  const { document } = dom.window;
  global.document = document
  global.document.createElement = fillStylePointerEvents(document);
  addMediaSource();
})();   


