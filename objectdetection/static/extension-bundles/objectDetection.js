var objectDetection=function(e,t){"use strict";function n(e,t,n,o,i,s){function c(e){if(void 0!==e&&"function"!=typeof e)throw new TypeError("Function expected");return e}for(var r,a=o.kind,d="getter"===a?"get":"setter"===a?"set":"value",l=!t&&e?o.static?e:e.prototype:null,u=t||(l?Object.getOwnPropertyDescriptor(l,o.name):{}),p=!1,h=n.length-1;h>=0;h--){var g={};for(var f in o)g[f]="access"===f?{}:o[f];for(var f in o.access)g.access[f]=o.access[f];g.addInitializer=function(e){if(p)throw new TypeError("Cannot add initializers after decoration has completed");s.push(c(e||null))};var m=(0,n[h])("accessor"===a?{get:u.get,set:u.set}:u[d],g);if("accessor"===a){if(void 0===m)continue;if(null===m||"object"!=typeof m)throw new TypeError("Object expected");(r=c(m.get))&&(u.get=r),(r=c(m.set))&&(u.set=r),(r=c(m.init))&&i.push(r)}else(r=c(m))&&("field"===a?i.push(r):u[d]=r)}l&&Object.defineProperty(l,o.name,u),p=!0}function o(e,t,n,o){return new(n||(n=Promise))((function(i,s){function c(e){try{a(o.next(e))}catch(e){s(e)}}function r(e){try{a(o.throw(e))}catch(e){s(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,r)}a((o=o.apply(e,t||[])).next())}))}const i={name:"Object Detection",description:"Detects and identifies the object shown!",iconURL:"Typescript_logo.png",insetIconURL:"typescript-logo.svg"};var s=(()=>{var e;let s,c,r,a=[];return e=class extends(t.extension(i,"video","toggleVideoBlock","setTransparencyBlock")){constructor(){super(...arguments),this.objectDetector=void function(e,t,n){for(var o=arguments.length>2,i=0;i<t.length;i++)n=o?t[i].call(e,n):t[i].call(e)}(this,a),this.DIMENSIONS=[480,360],this.processFreq=100}init(e){this.enableVideo(),this.runningMode="IMAGE",this.continuous=!1,this.initializeObjectDetector()}initializeObjectDetector(){return o(this,void 0,void 0,(function*(){const e=yield import("https://cdn.skypack.dev/@mediapipe/tasks-vision@0.1.0-alpha-11"),t=e.ObjectDetector,{ObjectDectector:n,FilesetResolver:o}=e,i=yield o.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.1.0-alpha-11/wasm");this.detector=yield t.createFromOptions(i,{baseOptions:{modelAssetPath:"https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite"},scoreThreshold:.5,runningMode:this.runningMode})}))}detectionLoop(){return o(this,void 0,void 0,(function*(){for(;this.continuous;){const e=this.getVideoFrame("canvas"),n=Date.now();if(e){const t=yield this.detector.detect(e);this.displayImageDetections(t,e)}const o=Date.now()-n;yield t.untilTimePassed(this.processFreq-o)}}))}displayImageDetections(e,t){this.continuous&&this.processFreq;const n=t.height/t.naturalHeight;for(let o of e.detections){const e=document.createElement("p");e.setAttribute("class","info"),e.innerText=o.categories[0].categoryName+" - with "+Math.round(100*parseFloat(o.categories[0].score))+"% confidence.",e.style="left: "+o.boundingBox.originX*n+"px;top: "+o.boundingBox.originY*n+"px; width: "+(o.boundingBox.width*n-10)+"px;";const i=document.createElement("div");i.setAttribute("class","highlighter"),i.style="left: "+o.boundingBox.originX*n+"px;top: "+o.boundingBox.originY*n+"px;width: "+o.boundingBox.width*n+"px;height: "+o.boundingBox.height*n+"px;",t.parentNode.appendChild(i),t.parentNode.appendChild(e)}}setFrameRate(e){this.processFreq=1e3/e}detectObject(){return o(this,void 0,void 0,(function*(){const e=this.getVideoFrame("canvas"),t=yield this.detector.detect(e);this.displayImageDetections(t,e)}))}continuouslyDetectObjects(e){return o(this,void 0,void 0,(function*(){this.continuous=e,this.detectionLoop()}))}},s=[t.block({type:"command",text:e=>`Set cont-detect delay ${e}`,arg:{type:"number",options:[60,30,10,2,1],defaultValue:10}})],c=[t.block({type:t.BlockType.Command,text:"Detect objects"})],r=[t.block({type:t.BlockType.Command,text:e=>`Toggle continuous detection ${e}`,arg:{type:t.ArgumentType.Boolean,options:[{text:"on",value:!0},{text:"off",value:!1}]}})],n(e,null,s,{kind:"method",name:"setFrameRate",static:!1,private:!1,access:{has:e=>"setFrameRate"in e,get:e=>e.setFrameRate}},null,a),n(e,null,c,{kind:"method",name:"detectObject",static:!1,private:!1,access:{has:e=>"detectObject"in e,get:e=>e.detectObject}},null,a),n(e,null,r,{kind:"method",name:"continuouslyDetectObjects",static:!1,private:!1,access:{has:e=>"continuouslyDetectObjects"in e,get:e=>e.continuouslyDetectObjects}},null,a),e})();return e.Extension=s,Object.defineProperty(e,"__esModule",{value:!0}),e}({},ExtensionFramework);//# sourceMappingURL=objectDetection.js.map
