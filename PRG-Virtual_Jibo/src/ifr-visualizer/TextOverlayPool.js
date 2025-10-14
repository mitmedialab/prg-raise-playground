"use strict";

/**
 * @type {number}
 */
let idCounter = 0;

/**
 *
 * @param {?string} [text]
 * @param {?string} [colorString]
 * @param {?number} [fontSize]
 * @constructor
 */
const TextElement = function(text, colorString, fontSize){
	this.div = document.createElement('div');
	this.div.id = 'text-display:'+(idCounter++);
	this.div.style.cssText = 'padding:0 0 0px 0px;text-align:left;position:absolute';
	if(colorString!=null){
		this.setColor(colorString);
	}
	if(fontSize!=null){
		this.setSize(fontSize);
	}
	if(text!=null) {
		this.setText(text);
	}
};

/**
 * @param {number} x
 * @param {number} y
 */
TextElement.prototype.setPosition2D = function(x,y){
	this.div.style.top = y+"px";
	this.div.style.left = x+"px";
};

/**
 * @param {string} colorString
 */
TextElement.prototype.setColor = function(colorString){
	this.div.style.color = colorString;
};

/**
 * @param {string} text
 */
TextElement.prototype.setText = function(text){
	this.div.innerHTML = text;
};

/**
 * @param {number} fontSize
 */
TextElement.prototype.setSize = function(fontSize){
	this.div.style.fontSize = fontSize;
};

/**
 *
 * @param {Element} onElement
 * @constructor
 */
const TextOverlayPool = function(onElement){

	/**
	 * @type {Element}
	 */
	this.onElement = onElement;

	/**
	 * @type {TextElement[]}
	 */
	this.drawOnceElements = [];

	/**
	 * @type {TextElement[]}
	 */
	this.leasedElements = [];
};

/**
 *
 * @param {string} text
 * @param {number} pixelX
 * @param {number} pixelY
 * @param {?string} [color]
 * @param {?number} [size]
 */
TextOverlayPool.prototype.drawOnce2D = function(text, pixelX, pixelY, color, size){
	const te = new TextElement(text, color, size);
	te.setPosition2D(pixelX,pixelY);
	this.drawOnceElements.push(te);
	this.onElement.appendChild(te.div);
};

/**
 *
 * @param {string} text
 * @param {number} pixelX
 * @param {number} pixelY
 * @param {?string} [color]
 * @param {?number} [size]
 * @return {TextElement}
 */
TextOverlayPool.prototype.lease2D = function(text, pixelX, pixelY, color, size){
	const te = new TextElement(text, color, size);
	te.setPosition2D(pixelX,pixelY);
	this.leasedElements.push(te);
	this.onElement.appendChild(te.div);
	return te;
};

/**
 * @param {TextElement} element
 */
TextOverlayPool.prototype.returnLeased = function(element){
	const matchingIndex = this.leasedElements.indexOf(element);
	if(matchingIndex >= 0){
		this.onElement.removeChild(element.div);
		this.leasedElements.splice(matchingIndex, 1);
	}else{
		console.log("Error, cannot return leased text element that is not been leased!("+(element==null?"null":element.div.innerHTML)+")");
	}
};

TextOverlayPool.prototype.returnAllLeased = function(){
	while(this.leasedElements.length > 0){
		const te = this.leasedElements.pop();
		this.onElement.removeChild(te.div);
	}
};


TextOverlayPool.prototype.postRenderCleanup = function(){
	while(this.drawOnceElements.length > 0){
		const te = this.drawOnceElements.pop();
		this.onElement.removeChild(te.div);
	}
};

export default TextOverlayPool;
export { TextElement };
