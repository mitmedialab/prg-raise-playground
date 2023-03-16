var selfieSegmentation=function(e,t){"use strict";function s(e,t,s,a,o,n){function i(e){if(void 0!==e&&"function"!=typeof e)throw new TypeError("Function expected");return e}for(var r,c=a.kind,l="getter"===c?"get":"setter"===c?"set":"value",d=!t&&e?a.static?e:e.prototype:null,h=t||(d?Object.getOwnPropertyDescriptor(d,a.name):{}),m=!1,p=s.length-1;p>=0;p--){var g={};for(var u in a)g[u]="access"===u?{}:a[u];for(var u in a.access)g.access[u]=a.access[u];g.addInitializer=function(e){if(m)throw new TypeError("Cannot add initializers after decoration has completed");n.push(i(e||null))};var f=(0,s[p])("accessor"===c?{get:h.get,set:h.set}:h[l],g);if("accessor"===c){if(void 0===f)continue;if(null===f||"object"!=typeof f)throw new TypeError("Object expected");(r=i(f.get))&&(h.get=r),(r=i(f.set))&&(h.set=r),(r=i(f.init))&&o.push(r)}else(r=i(f))&&("field"===c?o.push(r):h[l]=r)}d&&Object.defineProperty(d,a.name,h),m=!0}const a={name:"Selfie Detector"};var o=(()=>{var e;let o,n,i,r,c,l,d,h=[];return e=class extends(t.extension(a,"video","drawable","addCostumes")){constructor(){super(...arguments,...["Selfie Detector","selfieSegmentation","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB8CAYAAABE3L+AAAAACXBIWXMAAAsTAAALEwEAmpwYAAADQElEQVR4nO3dMWsUQRyG8edyZyEqqBgVJHiaUvA76CcQK3sbsbJVv0AquxSKjaWlpBS0thDBwkpFLTQgQRQtTIxnsVdJsnO3c//du3nfH1x1Ozube8JuYLJ7vdFohGlZ6voArH2OLsjRBTm6IEcXNKh7893HD+vARWC7ncOxTAeB+6tnh4/qNqqNDlwFTs/skKwNL4Ha6KnT+6fZHYu1ZCu1ga/pghxdkKMLcnRBji7I0QU5uiBHF+ToghxdkKMLcnRBqVW2HLvAZuD+SzUATkVPEGUTGFLFt8mdB95GThAZ/S/wJ3D/pfoRPUHkNX0J6Afuv1RHoifwH3KCHF2QowtydEGOLsjRBTm6IEcX5OiCHF2QowuKjL6DV9iaeB89QeQq21HgJtVqm01uOXqC6Ojrgfu3hnxNF+ToghxdkKMLcnRBji7I0QU5uiBHF+ToghxdkKMLcvTyJJs6enmS98JFLq1uAdfxenqbBsCbSTaK8hN4Erh/ayjy9D7AtyrPJV/TBTm6IEcX5OiCHF2QowtydEGOLsjRBTm6IEcX5OiCIlfZcq0AJzua+zt5T2I+Bxyf0bFM6wvwuW6DeY5+B7jR0dzPgcsZ4+8BV2ZzKFNbA27XbTDPp/cun2KRO3eXjzxP/tPKPEff6XDu35njt2dyFM0kP7d5jm5BHF2QowtydEGOLsjRBTm6IEcX5OiCHF2Qowty9L0dyxx/eCZH0UzyG5nneWk110OqteUmv9g94G7N+yPgwPj1/6rWEtXtwq/H+2lTH3ia2qjk6LeAXw3HXgKeZcx9DXicMT5Uyaf31Yyxuaf3Q5njQ5Ucve1T68IoObrtw9EFObogRxfk6IIcXZCjC3J0QY4uyNEFlRw959ak3NuSurwlK8nR95Ybvct72ZJKXlrdoHoS9bQPJd4FTmTOvUa1tNv259sDHoxf+yo5+oUO5x6OX11I/twln95VfUtt4OiCHF2QowtydEGOLsjRBTm6IEcX5OiCHF2QowtKRV/J2PeZjLEAy5njVSWfPp1aZdugWrWZ9puRe8BXqlt6m3pB9QjtLh8MvGj6wKvURr3RKKeLLSJf0wU5uiBHF+ToghxdkKMLcnRB/wBIt0+4Irv7NwAAAABJRU5ErkJggg=="]),this.model=void function(e,t,s){for(var a=arguments.length>2,o=0;o<t.length;o++)s=a?t[o].call(e,s):t[o].call(e)}(this,h),this.drawables=[],this.mode="mask",this.echoLength=0,this.processFrequencyMs=100}async init(){this.enableVideo(),this.model=await(async e=>{const s=new(await t.untilExternalGlobalVariableLoaded("https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js","SelfieSegmentation"))({locateFile:e=>`https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${e}`});return s.setOptions({modelSelection:1}),s.onResults(e),await s.initialize(),s})((e=>this.processResults(e))),this.start()}processResults(e){const t=e.image,s=e.segmentationMask,{width:a,height:o}=s;this.imageHelper??(this.imageHelper=((e,t)=>{const s=document.body.appendChild(document.createElement("canvas"));s.hidden=!0,s.width=e,s.height=t;const a=s.getContext("2d");return{colorIn:(o,n)=>(a.save(),a.clearRect(0,0,e,t),a.drawImage(o,0,0),a.globalCompositeOperation="source-in",a.fillStyle=n,a.fillRect(0,0,s.width,s.height),a.restore(),a.getImageData(0,0,e,t)),getMasked:(o,n)=>(a.save(),a.clearRect(0,0,e,t),a.drawImage(n,0,0),a.globalCompositeOperation="source-in",a.fillStyle="white",a.fillRect(0,0,s.width,s.height),a.drawImage(o,0,0),a.restore(),a.getImageData(0,0,e,t)),getDataURL(o){a.save(),a.clearRect(0,0,e,t),a.putImageData(o,0,0);const n=s.toDataURL("image/png");return a.restore(),n}}})(a,o));const{drawables:n,mode:i,imageHelper:r,color:c}=this,l="color"===i?r.colorIn(s,c):r.getMasked(t,s);if(this.lastProcessedImage=l,this.echoLength<=0)0===n.length?n.push(this.createDrawable(l)):n[0].update(l);else{for(;n.length>this.echoLength;)n.shift().destroy();n.forEach(((e,t,{length:s})=>e.setTransparency((s-t)/s*100))),n.push(this.createDrawable(l))}}start(){this.processing||(this.processing=!0,this.loop())}stop(){this.processing=!1,this.clearDrawables()}async loop(){for(;this.processing;){const e=this.getVideoFrame("canvas"),s=Date.now();e&&await this.model.send({image:e});const a=Date.now()-s;await t.untilTimePassed(this.processFrequencyMs-a)}}clearDrawables(){this.drawables.forEach((e=>e.destroy())),this.drawables=[]}async setCostume(e){this.addCostume(e.target,this.lastProcessedImage,"generate and set")}setVideoFeedTransparency(e){this.setVideoTransparency(e)}setDisplayMode(e){this.clearDrawables(),this.mode=e}setNumberOfEchos(e){this.echoLength=Math.min(100,Math.max(e,1))}setColor(e){this.color=t.rgbToHex(e)}setFrameRate(e){this.processFrequencyMs=1e3/e}setProcessingState(e){"on"===e?this.start():this.stop()}},m=e,"symbol"==typeof(p="default")&&(p=p.description?"[".concat(p.description,"]"):""),Object.defineProperty(m,"name",{configurable:!0,value:g?"".concat(g," ",p):p}),o=[t.block({type:"command",text:"Set selfie image as costume"})],n=[t.block({type:"command",text:e=>`Set video feed transparency to ${e}%`,arg:"number"})],i=[t.block({type:"command",text:e=>`Set mode to ${e}`,arg:{type:"string",options:["color","mask"],defaultValue:"mask"}})],r=[t.block({type:"command",text:e=>`Set echo count to ${e}`,arg:{type:"number",defaultValue:0,options:{items:[0,1,2,4,8,10,25,50,100],acceptsReporters:!0,handler:e=>{const t=parseInt(`${e}`);return isNaN(t)?1:t}}}})],c=[t.block({type:"command",text:e=>`Set fill color to ${e}`,arg:"color"})],l=[t.block((e=>({type:"command",text:e=>`Set processing rate to ${e} fps`,arg:{type:"number",options:[60,30,10,2,1],defaultValue:1e3/e.processFrequencyMs}})))],d=[t.block({type:"command",text:e=>`Turn processing ${e}`,arg:{type:"string",options:["on","off"]}})],s(e,null,o,{kind:"method",name:"setCostume",static:!1,private:!1,access:{has:e=>"setCostume"in e,get:e=>e.setCostume}},null,h),s(e,null,n,{kind:"method",name:"setVideoFeedTransparency",static:!1,private:!1,access:{has:e=>"setVideoFeedTransparency"in e,get:e=>e.setVideoFeedTransparency}},null,h),s(e,null,i,{kind:"method",name:"setDisplayMode",static:!1,private:!1,access:{has:e=>"setDisplayMode"in e,get:e=>e.setDisplayMode}},null,h),s(e,null,r,{kind:"method",name:"setNumberOfEchos",static:!1,private:!1,access:{has:e=>"setNumberOfEchos"in e,get:e=>e.setNumberOfEchos}},null,h),s(e,null,c,{kind:"method",name:"setColor",static:!1,private:!1,access:{has:e=>"setColor"in e,get:e=>e.setColor}},null,h),s(e,null,l,{kind:"method",name:"setFrameRate",static:!1,private:!1,access:{has:e=>"setFrameRate"in e,get:e=>e.setFrameRate}},null,h),s(e,null,d,{kind:"method",name:"setProcessingState",static:!1,private:!1,access:{has:e=>"setProcessingState"in e,get:e=>e.setProcessingState}},null,h),e;var m,p,g})();return e.Extension=o,Object.defineProperty(e,"__esModule",{value:!0}),e}({},ExtensionFramework);//# sourceMappingURL=selfieSegmentation.js.map
