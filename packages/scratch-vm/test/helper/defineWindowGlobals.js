const jsdom = require("jsdom");

/**
 * 
 * @param {Document} document
 * @param {(element: HTMLElement) => HTMLElement} modifier
 */
function mockCreateElement(document, modifier) {
  const previousCreateElement = document.createElement;
  document.createElement = function fillIn() {
    const element = previousCreateElement.apply(document, arguments);
    return modifier(element);
  };
}

/**
 * 
 * @param {Document} document 
 */
function mockPointerEvents(document) {
  mockCreateElement(document, (element) => {
      element.style = {
        ...(element.style ?? {}),
        pointerEvents: undefined,
      }
      return element;
    }
  );
}

/**
 * 
 * @param {Document} document 
 */
function mockCanvas(document) {
  mockCreateElement(document, (element) => {
      element.getContext = () => ({
        drawImage: () => ({})
      });
      return element;
    }
  );
} 

function addMediaSource() {
  global.MediaSource = class MediaSource {
    addEventListener() {
      
    } 
  }  
}

module.exports = (function() {
  addMediaSource();
  const dom = new jsdom.JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
  const { document } = dom.window;
  mockPointerEvents(document);
  mockCanvas(document);
  global.document = document
})();   


