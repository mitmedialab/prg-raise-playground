import THREE from "@jibo/three";

/**
 * @constructor
 */
const ImageLoadResult = function()
{
	/** @type {string} */
	this.url = null;
	/** @type {!boolean} */
	this.success = false;
	/** @type {THREE.Object3D} */
	this.image = null;
};

/**
 * @constructor
 */
const CachedImageLoader = function()
{
	/** @type {THREE.ImageLoader} */
	this._loader = new THREE.ImageLoader();
	
	// Configure for CORS if needed
	this._loader.setCrossOrigin('anonymous');
	
	/** @type {Map<string, Promise>} */
	this._loadingPromises = new Map();
	
	/** @type {ImageLoadResult} */
	this._result = null;
};

/**
 * @return {ImageLoadResult}
 */
CachedImageLoader.prototype.getResult = function()
{
	return this._result;
};

/**
 * @param {string} url
 * @param callback
 */
CachedImageLoader.prototype.loadImage = function(url, callback)
{
	// Implement caching to avoid duplicate requests
	if (this._loadingPromises.has(url)) {
		this._loadingPromises.get(url).then(() => {
			if (callback) callback();
		});
		return;
	}
	
	const self = this;
	const loadPromise = new Promise((resolve, reject) => {
		this._loader.load(url, function(image)
		{
			// done
			const result = new ImageLoadResult();
			result.url = url;
			result.success = true;
			result.image = image;
			self._result = result;
			resolve();
			if (callback)
			{
				callback();
			}
		}, undefined, function(event) // eslint-disable-line no-unused-vars
		{
			// error
			const result = new ImageLoadResult();
			result.url = url;
			result.success = false;
			self._result = result;
			reject(event);
			if (callback)
			{
				callback();
			}
		});
	});
	
	this._loadingPromises.set(url, loadPromise);
};

export default CachedImageLoader;
export { ImageLoadResult };