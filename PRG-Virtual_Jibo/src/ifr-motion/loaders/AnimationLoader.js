import TimestampedBuffer from "../base/TimestampedBuffer.js";
import MotionTrack from "../base/MotionTrack.js";
import Motion from "../base/Motion.js";
import MotionEvent from "../base/MotionEvent.js";
import FileTools from "../../ifr-core/FileTools.js";
import slog from "../../ifr-core/SLog.js";

const channel = "MODEL_LOADING";

/**
 * Simple result object for animation loading
 */
export function AnimationLoadResult() {
  this.url = null;
  this.success = false;
  this.message = "";
  this.motion = null;
  this.defaultDOFNames = null;
  this.enumMaps = null;
  this.events = null;
}

/**
 * Animation loader, exactly matching original Node.js behavior
 */
export default function AnimationLoader() {
  this._result = null;
  this.flattenEnums = true;
  this.resolvePaths = true;
}

AnimationLoader.prototype.getResult = function() {
  return this._result;
};

/**
 * Load a .anim file via FileTools, then parse (matches original exactly)
 * @param {string} url 
 * @param {function} callback 
 */
AnimationLoader.prototype.load = function(url, callback) {
  const self = this;
  FileTools.loadJSON(url, function(error, data) {
    if (error === null) {
      self.parseData(data, url);
      if (callback) {
        callback();
      }
    } else {
      const result = new AnimationLoadResult();
      result.url = url;
      result.success = false;
      result.message = error;
      self._result = result;
      if (callback) {
        callback();
      }
    }
  });
};

/**
 * Parse animation data (matches original logic exactly)
 * @param {Object} jsonData 
 * @param {string} dataUrl 
 */
AnimationLoader.prototype.parseData = function(jsonData, dataUrl) {
  this._result = new AnimationLoadResult();
  this._result.url = dataUrl;

  // Match original file type checking exactly - support both formats
  if (!jsonData.header || 
      (jsonData.header.fileType !== "DOFAnimation" && 
       jsonData.header.fileType !== "Animation")) {
    this._result.success = false;
    this._result.message = "don't know how to handle file type: " + (jsonData.header ? jsonData.header.fileType : "undefined");
    return;
  }

  const animContent = jsonData.content;

  const motion = new Motion(animContent.name);
  for (let channelIndex = 0; channelIndex < animContent.channels.length; channelIndex++) {
    const channelData = animContent.channels[channelIndex];

    const sampleBuffer = new TimestampedBuffer();
    sampleBuffer.timestampList = channelData.times;
    sampleBuffer.dataList = channelData.values;

    const track = new MotionTrack(channelData.dofName, sampleBuffer, channelData.length);
    motion.addTrack(track);
  }
  this._result.motion = motion;

  if (animContent.defaultDOFs) {
    this._result.defaultDOFNames = animContent.defaultDOFs;
  }

  if (animContent.enumMaps) {
    this._result.enumMaps = {};
    for (let mapIndex = 0; mapIndex < animContent.enumMaps.length; mapIndex++) {
      const enumMapData = animContent.enumMaps[mapIndex];
      this._result.enumMaps[enumMapData.dofName] = enumMapData.values;
    }

    if (this.flattenEnums) {
      flattenEnums(this._result.motion, this._result.enumMaps);
    }
  }

  if (this.resolvePaths) {
    resolvePaths(this._result.motion, dataUrl);
  }

  if (animContent.events) {
    this._result.events = [];
    for (let eventIndex = 0; eventIndex < animContent.events.length; eventIndex++) {
      const eventData = animContent.events[eventIndex];
      if (eventData.time === undefined || eventData.time === null) {
        slog(channel, "AnimationLoader: skipping event with null or undefined time property");
      } else if (eventData.time < 0 || eventData.time > motion.getDuration()) {
        slog(channel, "AnimationLoader: skipping event with time property: " + eventData.time + " outside of animation bounds, animation duration = " + motion.getDuration());
      } else if (eventData.eventName === undefined || eventData.eventName === null || eventData.eventName === "") {
        slog(channel, "AnimationLoader: skipping event with empty, null, or undefined eventName property");
      } else if (typeof(eventData.eventName) !== "string") {
        slog(channel, "AnimationLoader: skipping event with non-string eventName property: " + eventData.eventName);
      } else {
        // event data ok!
        const payload = (eventData.payload !== undefined) ? eventData.payload : null;
        this._result.events.push(new MotionEvent(eventData.time, eventData.eventName, payload));
      }
    }

    // sort events by timestamp
    this._result.events.sort(function(eventA, eventB) {
      return eventA.getTimestamp() - eventB.getTimestamp();
    });
  }

  this._result.success = true;
};

/**
 * Flatten enumerated DOF values
 * @param {Motion} motion
 * @param {Object.<string, Object.<number, string>>} enumMaps
 */
function flattenEnums(motion, enumMaps) {
  const tracks = motion.getTracks();
  const dofs = Object.keys(tracks);
  for (let dofIndex = 0; dofIndex < dofs.length; dofIndex++) {
    const dofName = dofs[dofIndex];
    if (enumMaps.hasOwnProperty(dofName)) {
      const samples = tracks[dofName].getMotionData().dataList;
      const enumMap = enumMaps[dofName];

      for (let sampleIndex = 0; sampleIndex < samples.length; sampleIndex++) {
        let sample = samples[sampleIndex];
        if (sample instanceof Array) {
          sample = sample[0];
        }

        if (typeof(sample) === "number") {
          const enumKey = Math.round(sample);
          samples[sampleIndex] = [enumMap[enumKey]];
          if (!enumMap.hasOwnProperty(enumKey)) {
            slog(channel, "AnimationLoader: no enum value specified for key: " + enumKey + ", DOF = " + dofName);
          }
        } else {
          slog(channel, "AnimationLoader: DOF " + dofName + " has an enum map, but found non-numerical value: " + sample);
        }
      }
    }
  }
}

/**
 * Resolve relative paths in animation data
 * @param {Motion} motion
 * @param {string} dataUrl
 */
function resolvePaths(motion, dataUrl) {
  let parentDir = "";
  const slashIndex = dataUrl.lastIndexOf('/');
  const backslashIndex = dataUrl.lastIndexOf('\\');
  if (slashIndex !== -1 || backslashIndex !== -1) {
    const lastIndex = Math.max(slashIndex, backslashIndex);
    parentDir = dataUrl.substring(0, lastIndex + 1);
  }

  const tracks = motion.getTracks();
  const dofs = Object.keys(tracks);
  for (let dofIndex = 0; dofIndex < dofs.length; dofIndex++) {
    const dofName = dofs[dofIndex];
    const samples = tracks[dofName].getMotionData().dataList;
    const alreadyProcessedObjects = [];

    let firstSample = samples[0];
    
    if (firstSample instanceof Array) {
      firstSample = firstSample[0];
    }

    // Handle null samples (from JSON.parse)
    if (firstSample === null) {
      firstSample = NaN;
    }

    if (typeof(firstSample) === "string" || typeof(firstSample) === "object") {
      // string/object valued samples!
      for (let sampleIndex = 0; sampleIndex < samples.length; sampleIndex++) {
        let sample = samples[sampleIndex];
        
        if (sample instanceof Array) {
          sample = sample[0];
        }

        if (typeof(sample) === "string") {
          try {
            if (sample.startsWith("project://")) {
              const absolutePath = "/static/" + sample.substring("project://".length);
              samples[sampleIndex] = [absolutePath];
            } else {
              // Browser version: use simple path resolution for regular relative paths
              samples[sampleIndex] = [parentDir + sample];
            }
          } catch(e) {
            console.error('Could not resolve path for sample ' + sample + ' : ' + parentDir);
          }
        } else if (typeof(sample) === "object") {
          // only object we have is a texture+normal object
          if (alreadyProcessedObjects.indexOf(sample) < 0) {
            if (typeof(sample.textureURL) === "string") {
              if (sample.textureURL.startsWith("project://")) {
                sample.textureURL = "/static/" + sample.textureURL.substring("project://".length);
              } else {
                sample.textureURL = parentDir + sample.textureURL;
              }
              
              if (typeof(sample.normalURL) === "string") {
                if (sample.normalURL.startsWith("project://")) {
                  sample.normalURL = "/static/" + sample.normalURL.substring("project://".length);
                } else {
                  sample.normalURL = parentDir + sample.normalURL;
                }
              }
              alreadyProcessedObjects.push(sample);
            } else {
              slog(channel, "AnimationLoader: DOF " + dofName + " had object-valued samples, but at least one (" + sampleIndex + ") is missing \"textureURL\" field");
            }
          }
        } else {
          slog(channel, "AnimationLoader: DOF " + dofName + " had string-valued samples, but also found non-string value: " + sample);
        }
      }
    }
  }
}
