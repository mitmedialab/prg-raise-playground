var doodlebot=function(e,t){"use strict";function n(){}function i(e){return e()}function o(){return Object.create(null)}function r(e){e.forEach(i)}function s(e){return"function"==typeof e}function a(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function c(e,t){e.appendChild(t)}function d(e,t,n){const i=function(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;if(t&&t.host)return t;return e.ownerDocument}(e);if(!i.getElementById(t)){const e=h("style");e.id=t,e.textContent=n,function(e,t){c(e.head||e,t),t.sheet}(i,e)}}function l(e,t,n){e.insertBefore(t,n||null)}function u(e){e.parentNode&&e.parentNode.removeChild(e)}function h(e){return document.createElement(e)}function p(e){return document.createTextNode(e)}function f(){return p(" ")}function v(e,t,n,i){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}function m(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function g(e,t){t=""+t,e.data!==t&&(e.data=t)}function y(e,t){e.value=null==t?"":t}function b(e,t,n,i){null==n?e.style.removeProperty(t):e.style.setProperty(t,n,i?"important":"")}let w;function k(e){w=e}const x=[],S=[];let C=[];const E=[],L=Promise.resolve();let $=!1;function _(e){C.push(e)}const P=new Set;let T=0;function B(){if(0!==T)return;const e=w;do{try{for(;T<x.length;){const e=x[T];T++,k(e),O(e.$$)}}catch(e){throw x.length=0,T=0,e}for(k(null),x.length=0,T=0;S.length;)S.pop()();for(let e=0;e<C.length;e+=1){const t=C[e];P.has(t)||(P.add(t),t())}C.length=0}while(x.length);for(;E.length;)E.pop()();$=!1,P.clear(),k(e)}function O(e){if(null!==e.fragment){e.update(),r(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(_)}}const I=new Set;function N(e,t){const n=e.$$;null!==n.fragment&&(!function(e){const t=[],n=[];C.forEach((i=>-1===e.indexOf(i)?t.push(i):n.push(i))),n.forEach((e=>e())),C=t}(n.after_update),r(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function A(e,t){-1===e.$$.dirty[0]&&(x.push(e),$||($=!0,L.then(B)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function D(e,t,a,c,d,l,h=null,p=[-1]){const f=w;k(e);const v=e.$$={fragment:null,ctx:[],props:l,update:n,not_equal:d,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(f?f.$$.context:[])),callbacks:o(),dirty:p,skip_bound:!1,root:t.target||f.$$.root};h&&h(v.root);let m=!1;if(v.ctx=a?a(e,t.props||{},((t,n,...i)=>{const o=i.length?i[0]:n;return v.ctx&&d(v.ctx[t],v.ctx[t]=o)&&(!v.skip_bound&&v.bound[t]&&v.bound[t](o),m&&A(e,t)),n})):[],v.update(),m=!0,r(v.before_update),v.fragment=!!c&&c(v.ctx),t.target){if(t.hydrate){const e=function(e){return Array.from(e.childNodes)}(t.target);v.fragment&&v.fragment.l(e),e.forEach(u)}else v.fragment&&v.fragment.c();t.intro&&((g=e.$$.fragment)&&g.i&&(I.delete(g),g.i(y))),function(e,t,n){const{fragment:o,after_update:a}=e.$$;o&&o.m(t,n),_((()=>{const t=e.$$.on_mount.map(i).filter(s);e.$$.on_destroy?e.$$.on_destroy.push(...t):r(t),e.$$.on_mount=[]})),a.forEach(_)}(e,t.target,t.anchor),B()}var g,y;k(f)}class V{$$=void 0;$$set=void 0;$destroy(){N(this,1),this.$destroy=n}$on(e,t){if(!s(t))return n;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(t),()=>{const e=i.indexOf(t);-1!==e&&i.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function j(e,t,n,i,o,r){function s(e){if(void 0!==e&&"function"!=typeof e)throw new TypeError("Function expected");return e}for(var a,c=i.kind,d="getter"===c?"get":"setter"===c?"set":"value",l=!t&&e?i.static?e:e.prototype:null,u=t||(l?Object.getOwnPropertyDescriptor(l,i.name):{}),h=!1,p=n.length-1;p>=0;p--){var f={};for(var v in i)f[v]="access"===v?{}:i[v];for(var v in i.access)f.access[v]=i.access[v];f.addInitializer=function(e){if(h)throw new TypeError("Cannot add initializers after decoration has completed");r.push(s(e||null))};var m=(0,n[p])("accessor"===c?{get:u.get,set:u.set}:u[d],f);if("accessor"===c){if(void 0===m)continue;if(null===m||"object"!=typeof m)throw new TypeError("Object expected");(a=s(m.get))&&(u.get=a),(a=s(m.set))&&(u.set=a),(a=s(m.init))&&o.unshift(a)}else(a=s(m))&&("field"===c?o.unshift(a):u[d]=a)}l&&Object.defineProperty(l,i.name,u),h=!0}function M(e,t,n,i){return new(n||(n=Promise))((function(o,r){function s(e){try{c(i.next(e))}catch(e){r(e)}}function a(e){try{c(i.throw(e))}catch(e){r(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}c((i=i.apply(e,t||[])).next())}))}function R(){}function W(){W.init.call(this)}function U(e){return void 0===e._maxListeners?W.defaultMaxListeners:e._maxListeners}function q(e,t,n,i){var o,r,s,a;if("function"!=typeof n)throw new TypeError('"listener" argument must be a function');if((r=e._events)?(r.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),r=e._events),s=r[t]):(r=e._events=new R,e._eventsCount=0),s){if("function"==typeof s?s=r[t]=i?[n,s]:[s,n]:i?s.unshift(n):s.push(n),!s.warned&&(o=U(e))&&o>0&&s.length>o){s.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+s.length+" "+t+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=e,c.type=t,c.count=s.length,a=c,"function"==typeof console.warn?console.warn(a):console.log(a)}}else s=r[t]=n,++e._eventsCount;return e}function F(e,t,n){var i=!1;function o(){e.removeListener(t,o),i||(i=!0,n.apply(e,arguments))}return o.listener=n,o}function H(e){var t=this._events;if(t){var n=t[e];if("function"==typeof n)return 1;if(n)return n.length}return 0}function z(e,t){for(var n=new Array(t);t--;)n[t]=e[t];return n}"undefined"!=typeof window&&(window.__svelte||(window.__svelte={v:new Set})).v.add("4"),"function"==typeof SuppressedError&&SuppressedError,R.prototype=Object.create(null),W.EventEmitter=W,W.usingDomains=!1,W.prototype.domain=void 0,W.prototype._events=void 0,W.prototype._maxListeners=void 0,W.defaultMaxListeners=10,W.init=function(){this.domain=null,W.usingDomains&&undefined.active,this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=new R,this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},W.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||isNaN(e))throw new TypeError('"n" argument must be a positive number');return this._maxListeners=e,this},W.prototype.getMaxListeners=function(){return U(this)},W.prototype.emit=function(e){var t,n,i,o,r,s,a,c="error"===e;if(s=this._events)c=c&&null==s.error;else if(!c)return!1;if(a=this.domain,c){if(t=arguments[1],!a){if(t instanceof Error)throw t;var d=new Error('Uncaught, unspecified "error" event. ('+t+")");throw d.context=t,d}return t||(t=new Error('Uncaught, unspecified "error" event')),t.domainEmitter=this,t.domain=a,t.domainThrown=!1,a.emit("error",t),!1}if(!(n=s[e]))return!1;var l="function"==typeof n;switch(i=arguments.length){case 1:!function(e,t,n){if(t)e.call(n);else for(var i=e.length,o=z(e,i),r=0;r<i;++r)o[r].call(n)}(n,l,this);break;case 2:!function(e,t,n,i){if(t)e.call(n,i);else for(var o=e.length,r=z(e,o),s=0;s<o;++s)r[s].call(n,i)}(n,l,this,arguments[1]);break;case 3:!function(e,t,n,i,o){if(t)e.call(n,i,o);else for(var r=e.length,s=z(e,r),a=0;a<r;++a)s[a].call(n,i,o)}(n,l,this,arguments[1],arguments[2]);break;case 4:!function(e,t,n,i,o,r){if(t)e.call(n,i,o,r);else for(var s=e.length,a=z(e,s),c=0;c<s;++c)a[c].call(n,i,o,r)}(n,l,this,arguments[1],arguments[2],arguments[3]);break;default:for(o=new Array(i-1),r=1;r<i;r++)o[r-1]=arguments[r];!function(e,t,n,i){if(t)e.apply(n,i);else for(var o=e.length,r=z(e,o),s=0;s<o;++s)r[s].apply(n,i)}(n,l,this,o)}return!0},W.prototype.addListener=function(e,t){return q(this,e,t,!1)},W.prototype.on=W.prototype.addListener,W.prototype.prependListener=function(e,t){return q(this,e,t,!0)},W.prototype.once=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.on(e,F(this,e,t)),this},W.prototype.prependOnceListener=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.prependListener(e,F(this,e,t)),this},W.prototype.removeListener=function(e,t){var n,i,o,r,s;if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');if(!(i=this._events))return this;if(!(n=i[e]))return this;if(n===t||n.listener&&n.listener===t)0==--this._eventsCount?this._events=new R:(delete i[e],i.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(o=-1,r=n.length;r-- >0;)if(n[r]===t||n[r].listener&&n[r].listener===t){s=n[r].listener,o=r;break}if(o<0)return this;if(1===n.length){if(n[0]=void 0,0==--this._eventsCount)return this._events=new R,this;delete i[e]}else!function(e,t){for(var n=t,i=n+1,o=e.length;i<o;n+=1,i+=1)e[n]=e[i];e.pop()}(n,o);i.removeListener&&this.emit("removeListener",e,s||t)}return this},W.prototype.off=function(e,t){return this.removeListener(e,t)},W.prototype.removeAllListeners=function(e){var t,n;if(!(n=this._events))return this;if(!n.removeListener)return 0===arguments.length?(this._events=new R,this._eventsCount=0):n[e]&&(0==--this._eventsCount?this._events=new R:delete n[e]),this;if(0===arguments.length){for(var i,o=Object.keys(n),r=0;r<o.length;++r)"removeListener"!==(i=o[r])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=new R,this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(t)do{this.removeListener(e,t[t.length-1])}while(t[0]);return this},W.prototype.listeners=function(e){var t,n=this._events;return n&&(t=n[e])?"function"==typeof t?[t.listener||t]:function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(t):[]},W.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):H.call(e,t)},W.prototype.listenerCount=H,W.prototype.eventNames=function(){return this._eventsCount>0?Reflect.ownKeys(this._events):[]};class Y extends W{isEventListenerObject(e){return void 0!==e.handleEvent}addEventListener(e,t){if(t){const n=this.isEventListenerObject(t)?t.handleEvent:t;super.addListener(e,n)}}removeEventListener(e,t){if(t){const n=this.isEventListenerObject(t)?t.handleEvent:t;super.removeListener(e,n)}}dispatchEvent(e,t){const n="string"==typeof e?new CustomEvent(e,{detail:t}):e;return super.emit(n.type,n)}}class G{constructor(e=1){this.concurrent=e,this.queue=[],this.running=0}pump(){return M(this,void 0,void 0,(function*(){if(this.running>=this.concurrent)return;const e=this.queue.shift();if(e){this.running++;try{const t=yield e.fn();e.resolve(t)}catch(t){e.reject(t)}return this.running--,this.pump()}}))}add(e){return new Promise(((t,n)=>(this.queue.push({fn:e,resolve:t,reject:n}),this.pump())))}}class J{constructor(e,t){this.service=e,this.emitter=t,this.queue=new G}getCharacteristic(e){var t;return M(this,void 0,void 0,(function*(){return null!==(t=this.characteristics)&&void 0!==t||(this.characteristics=yield this.service.getCharacteristics()),this.characteristics.find((t=>t.uuid===e))}))}getCharacteristicValue(e){return M(this,void 0,void 0,(function*(){const t=yield this.getCharacteristic(e);if(!t)throw new Error("Unable to locate characteristic");return yield this.queue.add((()=>M(this,void 0,void 0,(function*(){return t.readValue()}))))}))}setCharacteristicValue(e,t){return M(this,void 0,void 0,(function*(){const n=yield this.getCharacteristic(e);if(!n)throw new Error("Unable to locate characteristic");yield this.queue.add((()=>M(this,void 0,void 0,(function*(){return n.writeValueWithoutResponse(t)}))))}))}handleListener(e,t,n){return M(this,void 0,void 0,(function*(){const i=yield this.getCharacteristic(t);i&&(yield this.queue.add((()=>M(this,void 0,void 0,(function*(){return i.startNotifications()})))),this.emitter.on("newListener",(t=>{if(!(t!==e||this.emitter.listenerCount(e)>0))return this.queue.add((()=>M(this,void 0,void 0,(function*(){return i.addEventListener("characteristicvaluechanged",n)}))))})),this.emitter.on("removeListener",(t=>{if(!(t!==e||this.emitter.listenerCount(e)>0))return this.queue.add((()=>M(this,void 0,void 0,(function*(){return i.removeEventListener("characteristicvaluechanged",n)}))))})))}))}}class K extends Y{static create(e){return M(this,void 0,void 0,(function*(){const t=new K(e);return yield t.init(),t}))}constructor(e){super(),this.helper=new J(e,this)}init(){return M(this,void 0,void 0,(function*(){const{tx_uuid:e}=K;yield this.helper.handleListener("receive",e,this.receiveHandler.bind(this)),yield this.helper.handleListener("receiveText",e,this.receiveTextHandler.bind(this))}))}send(e){return M(this,void 0,void 0,(function*(){return this.helper.setCharacteristicValue(K.rx_uuid,e)}))}sendText(e){return M(this,void 0,void 0,(function*(){console.log("sending text",e);const t=e.split("").map((e=>e.charCodeAt(0)));return this.helper.setCharacteristicValue(K.rx_uuid,new Uint8Array(t).buffer)}))}receiveHandler(e){const t=e.target.value,n=new Uint8Array(t.buffer);this.dispatchEvent("receive",n)}receiveTextHandler(e){const t=e.target.value,n=new Uint8Array(t.buffer).slice(),i=String.fromCharCode.apply(null,n);console.log("received text",i),this.dispatchEvent("receiveText",i)}}K.uuid="6e400001-b5a3-f393-e0a9-e50e24dcca9e",K.rx_uuid="6e400002-b5a3-f393-e0a9-e50e24dcca9e",K.tx_uuid="6e400003-b5a3-f393-e0a9-e50e24dcca9e";const Q={enable:"e",disable:"x",motor:"m",arc:"t",wifi:"k",lowPower:"q",display:"d",pen:"u",network:"g"},X={battery:"f",bumper:"b",humidity:"h",pressure:"p",distance:"d",altimeter:"u",magnometer:"o",temperature:"t",accelerometer:"a",gyroscope:"g",light:"l"},Z=Object.keys(X),ee={clear:"c",sad:"s",happy:"T",child:"H"},te=Object.keys(ee),ne=Object.fromEntries(Object.entries(X).map((([e,t])=>[t,e]))),ie="RPI ipaddr:",oe="hname:",re="8765",se="8000",ae="8771",ce="video_feed",de=e=>{if(!e)return[];return e.split(/,\s*|\s+/)},le=(e,t)=>new WebSocket(`ws://${e}:${t}`),ue=(e,t)=>{const n=le(e,t);return new Promise((e=>{n.onopen=()=>n.close(),n.onclose=t=>e(t.wasClean)}))},he=(e,t)=>e.replace(t,"").trim(),pe="127.0.0.1",fe="motor",ve="connect",me="disconnect";class ge{static tryCreateService(e,t){return M(this,void 0,void 0,(function*(){const n=e.find((e=>e.uuid===t.uuid));return n?yield t.create(n):void 0}))}static requestRobot(e,...t){return M(this,void 0,void 0,(function*(){return yield e.requestDevice({filters:[...null!=t?t:[],{services:[K.uuid]}]})}))}static getServices(e){return M(this,void 0,void 0,(function*(){if(!e||!e.gatt)return null;e.gatt.connected||(yield e.gatt.connect());const t=yield e.gatt.getPrimaryServices();return{uartService:yield ge.tryCreateService(t,K)}}))}static tryCreate({ssid:e,password:t,ipOverride:n},i,...o){return M(this,void 0,void 0,(function*(){const r=yield ge.requestRobot(i,...o),s=yield ge.getServices(r);if(!s)throw new Error("Unable to connect to doodlebot's UART service");return new ge(r,s,e,t,n)}))}constructor(e,t,n,i,o=void 0){this.device=e,this.services=t,this.ssid=n,this.wifiPassword=i,this.ip=o,this.pending={motor:void 0,wifi:void 0,websocket:void 0,ip:void 0},this.onMotor=new W,this.onSensor=new W,this.onNetwork=new W,this.disconnectCallbacks=new Set,this.subscriptions=new Array,this.encoder=new TextEncoder,this.isStopped=!0,this.sensorData={bumper:{front:0,back:0},altimeter:0,battery:0,distance:0,humidity:0,temperature:0,pressure:0,gyroscope:{x:0,y:0,z:0},magnometer:{x:0,y:0,z:0},accelerometer:{x:0,y:0,z:0},light:{red:0,green:0,blue:0,alpha:0}},this.sensorState={bumper:!1,altimeter:!1,battery:!1,distance:!1,humidity:!1,temperature:!1,pressure:!1,gyroscope:!1,magnometer:!1,accelerometer:!1,light:!1},this.subscribe(t.uartService,"receiveText",this.receiveTextBLE.bind(this)),this.subscribe(e,"gattserverdisconnected",this.handleBleDisconnect.bind(this)),this.connectionWorkflow({ssid:n,password:i,ipOverride:o})}subscribe(e,t,n){e.addEventListener(t,n),this.subscriptions.push({target:e,event:t,listener:n})}formCommand(...e){return`(${e.join(",")})`}parseCommand(e){return e.split("(").map((e=>e.replace(")",""))).splice(1).map((e=>{const[t,...n]=e.split(",").map((e=>e.trim()));return{command:t,parameters:n}}))}updateSensor(e,t){this.onSensor.emit(e,t),this.sensorData[e]=t,this.sensorState[e]=!0}updateNetworkStatus(e,t){const n=he(e,ie),i=he(t,oe);if(n===pe)return this.onNetwork.emit(me);this.connection={ip:n,hostname:i},this.onNetwork.emit(ve,this.connection)}receiveTextBLE(e){const{detail:t}=e;if(t.startsWith(ie)){const e=t.split(",");this.updateNetworkStatus(e[0],e[1])}else for(const{command:e,parameters:n}of this.parseCommand(t))switch(console.log({command:e,parameters:n}),e){case"ms":this.isStopped=!0,this.onMotor.emit(fe);break;case X.bumper:{const[t,i]=n.map((e=>Number.parseFloat(e)));this.updateSensor(ne[e],{front:t,back:i});break}case X.distance:case X.battery:case X.altimeter:case X.humidity:case X.temperature:case X.pressure:{const t=Number.parseFloat(n[0]);this.updateSensor(ne[e],t);break}case X.gyroscope:case X.magnometer:case X.accelerometer:{const[t,i,o]=n.map((e=>Number.parseFloat(e)));this.updateSensor(ne[e],{x:t,y:i,z:o});break}case X.light:{const[t,i,o,r]=n.map((e=>Number.parseFloat(e)));this.updateSensor(ne[e],{red:t,green:i,blue:o,alpha:r});break}default:throw new Error(`Not implemented: ${e}`)}}onWebsocketMessage(e){return M(this,void 0,void 0,(function*(){console.log("websocket message",{event:e});const t=yield e.data.text();console.log(t)}))}invalidateWifiConnection(){var e;this.connection=void 0,this.pending.wifi=void 0,this.pending.websocket=void 0,null===(e=this.websocket)||void 0===e||e.close(),this.websocket=void 0}handleBleDisconnect(){console.log("disconnected!!!");for(const e of this.disconnectCallbacks)e();for(const{target:e,event:t,listener:n}of this.subscriptions)e.removeEventListener(t,n)}onDisconnect(...e){for(const t of e)this.disconnectCallbacks.add(t)}enableSensor(e){return M(this,void 0,void 0,(function*(){this.sensorState[e]||(yield this.sendBLECommand(Q.enable,X[e]),yield new Promise((t=>this.onSensor.once(e,t))),this.sensorState[e]=!0)}))}disableSensor(e){return M(this,void 0,void 0,(function*(){this.sensorState[e]&&(yield this.sendBLECommand(Q.disable,X[e]),this.sensorState[e]=!1)}))}getSensorReading(e){return M(this,void 0,void 0,(function*(){return yield this.enableSensor(e),this.sensorData[e]}))}getSensorReadingImmediately(e){return this.enableSensor(e),this.sensorData[e]}motorCommand(e,...t){return M(this,void 0,void 0,(function*(){const{pending:{motor:n}}=this;switch(e){case"steps":{n&&(yield n);const[e,i]=t;return yield this.untilFinishedPending("motor",new Promise((t=>M(this,void 0,void 0,(function*(){this.isStopped=!1,yield this.sendBLECommand(Q.motor,e.steps,i.steps,e.stepsPerSecond,i.stepsPerSecond),this.onMotor.once(fe,t)})))))}case"arc":{n&&(yield n);const[e,i]=t;return yield this.untilFinishedPending("motor",new Promise((t=>M(this,void 0,void 0,(function*(){this.isStopped=!1,yield this.sendBLECommand(Q.arc,e,i),this.onMotor.once(fe,t)})))))}case"stop":if(this.isStopped)return;return yield this.untilFinishedPending("motor",new Promise((e=>M(this,void 0,void 0,(function*(){yield this.sendBLECommand(Q.motor,"s"),this.onMotor.once(fe,e)})))))}}))}penCommand(e){return M(this,void 0,void 0,(function*(){yield this.sendBLECommand(Q.pen,"up"===e?0:45)}))}lowPowerMode(){return M(this,void 0,void 0,(function*(){yield this.sendBLECommand(Q.lowPower)}))}getIPAddress(){var e;return M(this,void 0,void 0,(function*(){const t=this;return yield null!==(e=this.pending.ip)&&void 0!==e?e:this.untilFinishedPending("ip",new Promise((e=>M(this,void 0,void 0,(function*(){this.sendBLECommand(Q.network),this.onNetwork.once(ve,(()=>e(t.connection.ip))),this.onNetwork.once(me,(()=>e("invalid")))})))))}))}connectToWifi(e){return M(this,void 0,void 0,(function*(){if(e.ipOverride){if(yield ue(e.ipOverride,re))return this.connection.ip=e.ipOverride}const t=yield this.getIPAddress();if(t!==pe){if(yield ue(t,re))return this.connection.ip=t}yield this.untilFinishedPending("wifi",new Promise((e=>M(this,void 0,void 0,(function*(){yield this.sendBLECommand(Q.wifi,this.ssid,this.wifiPassword),yield this.sendBLECommand(Q.network),this.onNetwork.once(ve,(()=>{console.log("connected to wifi"),e()}))})))))}))}connectToWebsocket(e){return M(this,void 0,void 0,(function*(){this.websocket=le(e,re),yield this.untilFinishedPending("websocket",new Promise((e=>{const t=()=>{console.log("Connected to websocket"),this.websocket.removeEventListener("open",t),e()};this.websocket.addEventListener("open",t),this.websocket.addEventListener("message",this.onWebsocketMessage.bind(this))})))}))}connectionWorkflow(e){return M(this,void 0,void 0,(function*(){yield this.connectToWifi(e),yield this.connectToWebsocket(this.connection.ip)}))}getImageStream(e){return M(this,void 0,void 0,(function*(){const t=document.createElement("img");return t.src=`http://${e}:${se}/${ce}`,t.crossOrigin="anonymous",yield new Promise((e=>t.addEventListener("load",e))),t}))}getAudioStream(e,t=1){return M(this,void 0,void 0,(function*(){const n=new WebSocket(`ws://${e}:${ae}`),i=new(window.AudioContext||window.webkitAudioContext),o=i.createBuffer(1,48e3*t,48e3);let r=0;n.onmessage=function(e){return M(this,void 0,void 0,(function*(){const t=r++,n=JSON.parse(e.data),i=yield(s=n.audio_data,M(void 0,void 0,void 0,(function*(){const e=yield fetch(`data:application/octet-stream;base64,${s}`),t=yield e.blob(),n=yield t.arrayBuffer();return new Float32Array(n)})));var s;console.log(i.length),o.copyToChannel(i,0,t*i.length)}))},n.onerror=function(e){console.error("WebSocket Error:",e)};const s=this.encoder.encode("(1)");return n.onopen=function(e){console.log("WebSocket connection established"),n.send(s)},n.onclose=function(){console.log("WebSocket connection closed");const e=i.createBufferSource();e.buffer=o,e.connect(i.destination),e.start()},n}))}display(e){return M(this,void 0,void 0,(function*(){const t=ee[e];yield this.sendWebsocketCommand(Q.display,t)}))}getNetworkCredentials(){return{ssid:this.ssid,password:this.wifiPassword}}sendBLECommand(e,...t){const{uartService:n}=this.services;return n.sendText(this.formCommand(e,...t))}sendWebsocketCommand(e,...t){const n=this.formCommand(e,...t);this.websocket.send(this.encoder.encode(n))}untilFinishedPending(e,t){return M(this,void 0,void 0,(function*(){this.pending[e]=t;const n=yield t;return this.pending[e]=void 0,n}))}}function ye(e){d(e,"svelte-18iuvm7",".container.svelte-18iuvm7{text-align:center;padding:30px}.error.svelte-18iuvm7{background-color:red;color:white;padding:4px 8px;text-align:center;border-radius:5px}.collapser.svelte-18iuvm7{background-color:inherit;cursor:pointer;border:none;text-align:left;outline:none}")}function be(e){let t,n;return{c(){t=h("div"),n=p(e[1]),m(t,"class","error svelte-18iuvm7")},m(e,i){l(e,t,i),c(t,n)},p(e,t){2&t&&g(n,e[1])},d(e){e&&u(t)}}}function we(e){let t;return{c(){t=p("Uh oh! Your browser does not support bluetooth. Here's how to fix that...\n    TBD")},m(e,n){l(e,t,n)},p:n,d(e){e&&u(t)}}}function ke(e){let t;function n(e,t){return e[0].doodlebot?xe:Se}function i(e,t){return t===xe?function(e){const t=e.slice(),n=t[0].doodlebot.getNetworkCredentials();return t[25]=n,t}(e):e}let o=n(e),r=o(i(e,o));return{c(){r.c(),t=p("")},m(e,n){r.m(e,n),l(e,t,n)},p(e,s){o===(o=n(e))&&r?r.p(i(e,o),s):(r.d(1),r=o(i(e,o)),r&&(r.c(),r.m(t.parentNode,t)))},d(e){e&&u(t),r.d(e)}}}function xe(e){let t,n,i,o,r,s,a,d,g,y,b,w,k,x,S,C,E,L;return{c(){t=h("h1"),t.textContent="Connected to doodlebot",n=f(),i=h("div"),o=h("h3"),o.textContent="Update network credentials:",r=p("\n        SSID (Network Name):\n        "),s=h("input"),d=p("\n        Password:\n        "),g=h("input"),b=f(),w=h("button"),k=p("Update"),S=f(),C=h("div"),C.innerHTML="<button>Disconnect</button>",m(s,"type","text"),s.value=a=e[25].ssid,m(g,"type","text"),g.value=y=e[25].password,w.disabled=x=e[25].ssid===e[2]&&e[25].password===e[3]||!e[4]},m(a,u){l(a,t,u),l(a,n,u),l(a,i,u),c(i,o),c(i,r),c(i,s),e[18](s),c(i,d),c(i,g),e[19](g),c(i,b),c(i,w),c(w,k),l(a,S,u),l(a,C,u),E||(L=v(w,"click",e[9]),E=!0)},p(e,t){1&t&&a!==(a=e[25].ssid)&&s.value!==a&&(s.value=a),1&t&&y!==(y=e[25].password)&&g.value!==y&&(g.value=y),29&t&&x!==(x=e[25].ssid===e[2]&&e[25].password===e[3]||!e[4])&&(w.disabled=x)},d(o){o&&(u(t),u(n),u(i),u(S),u(C)),e[18](null),e[19](null),E=!1,L()}}}function Se(e){let t,n,i,o,s,a,d,w,k,x,S,C,E,L,$,_,P,T,B,O,I,N,A,D,V,j,M,R,W,U,q,F,H=e[6]?"▴":"▾";return{c(){t=h("h1"),t.textContent="How to connect to doodlebot",n=f(),i=h("div"),o=h("h3"),o.textContent="1. Set network credentials:",s=f(),a=h("p"),d=p("SSID (Network Name):\n          "),w=h("input"),k=f(),x=h("p"),S=p("Password:\n          "),C=h("input"),E=f(),L=h("div"),$=h("button"),_=p(H),P=p(" Advanced"),T=f(),B=h("div"),O=h("p"),I=p("IP: "),N=p(Ee),A=h("input"),D=f(),V=h("div"),j=h("h3"),j.textContent="2. Select bluetooth device",M=f(),R=h("button"),W=p("Open Bluetooth Menu"),m(w,"type","text"),m(w,"placeholder","e.g. my_wifi"),m(C,"type","password"),m(C,"placeholder","e.g. 12345"),m($,"class","collapser svelte-18iuvm7"),m(A,"type","text"),m(A,"placeholder","e.g. 12345"),b(B,"overflow","hidden"),b(B,"max-height",e[6]?"fit-content":"0"),R.disabled=U=!e[3]||!e[2]},m(r,u){l(r,t,u),l(r,n,u),l(r,i,u),c(i,o),c(i,s),c(i,a),c(a,d),c(a,w),e[11](w),y(w,e[2]),c(i,k),c(i,x),c(x,S),c(x,C),e[13](C),y(C,e[3]),c(i,E),c(i,L),c(L,$),c($,_),c($,P),c(L,T),c(L,B),c(B,O),c(O,I),c(O,N),c(O,A),e[16](A),y(A,e[4]),l(r,D,u),l(r,V,u),c(V,j),c(V,M),c(V,R),c(R,W),q||(F=[v(w,"input",e[12]),v(C,"input",e[14]),v($,"click",e[15]),v(A,"input",e[17]),v(R,"click",e[8])],q=!0)},p(e,t){4&t&&w.value!==e[2]&&y(w,e[2]),8&t&&C.value!==e[3]&&y(C,e[3]),64&t&&H!==(H=e[6]?"▴":"▾")&&g(_,H),16&t&&A.value!==e[4]&&y(A,e[4]),64&t&&b(B,"max-height",e[6]?"fit-content":"0"),12&t&&U!==(U=!e[3]||!e[2])&&(R.disabled=U)},d(o){o&&(u(t),u(n),u(i),u(D),u(V)),e[11](null),e[13](null),e[16](null),q=!1,r(F)}}}function Ce(e){let i,o,r=e[1]&&be(e);let s=function(e,t){return e[7]?ke:we}(e),a=s(e);return{c(){i=h("div"),r&&r.c(),o=f(),a.c(),m(i,"class","container svelte-18iuvm7"),b(i,"width","100%"),b(i,"background-color",t.color.ui.white),b(i,"color",t.color.text.primary)},m(e,t){l(e,i,t),r&&r.m(i,null),c(i,o),a.m(i,null)},p(e,[t]){e[1]?r?r.p(e,t):(r=be(e),r.c(),r.m(i,o)):r&&(r.d(1),r=null),a.p(e,t)},i:n,o:n,d(e){e&&u(i),r&&r.d(),a.d()}}}const Ee="192.168.0.";function Le(e,n,i){var o,r,s=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(o,r){function s(e){try{c(i.next(e))}catch(e){r(e)}}function a(e){try{c(i.throw(e))}catch(e){r(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}c((i=i.apply(e,t||[])).next())}))};let{extension:a}=n,{close:c}=n;const{bluetooth:d}=window.navigator,l=(e,...n)=>t.reactiveInvoke(i(0,a),e,n),u="doodlebot-ssid",h="doodlebot-password";let p,f=null!==(o=localStorage.getItem(u))&&void 0!==o?o:"",v=null!==(r=localStorage.getItem(h))&&void 0!==r?r:"",m="";const g={ssid:null,password:null};let y=!1;return e.$$set=e=>{"extension"in e&&i(0,a=e.extension),"close"in e&&i(10,c=e.close)},[a,p,f,v,m,g,y,d,()=>s(void 0,void 0,void 0,(function*(){try{const e=yield ge.tryCreate({ssid:f,password:v,ipOverride:m?Ee+m:void 0},d);l("setDoodlebot",e),localStorage.setItem(u,f),localStorage.setItem(h,v),c()}catch(e){l("setIndicator","disconnected"),console.error(e),i(1,p="Bluetooth adapter not available."===e.message?"Your device does not support BLE connections.":"User cancelled the requestDevice() chooser."==e.message?"You must select a device to connect to. Please try again.":"User cancelled the requestDevice() chooser."!==e.message?"There was a problem connecting your device, please try again or request assistance.":e.message)}})),()=>a.doodlebot.connectToWebsocket({ssid:f,password:v,ipOverride:m}),c,function(e){S[e?"unshift":"push"]((()=>{g.ssid=e,i(5,g)}))},function(){f=this.value,i(2,f)},function(e){S[e?"unshift":"push"]((()=>{g.password=e,i(5,g)}))},function(){v=this.value,i(3,v)},()=>i(6,y=!y),function(e){S[e?"unshift":"push"]((()=>{g.password=e,i(5,g)}))},function(){m=this.value,i(4,m)},function(e){S[e?"unshift":"push"]((()=>{g.ssid=e,i(5,g)}))},function(e){S[e?"unshift":"push"]((()=>{g.password=e,i(5,g)}))}]}const $e={name:"Doodlebot",description:"Program a doodlebot robot",iconURL:"Replace with the name of your icon image file (which should be placed in the same directory as this file)",insetIconURL:"Replace with the name of your inset icon image file (which should be placed in the same directory as this file)",tags:["Made by PRG"]},_e=["front","back","front or back","front and back","neither"];let Pe=(()=>{var e;let n,i,o,r,s,a,c,d,l,u,h,p,f,v,m,g=t.extension($e,"ui","indicators","video","drawable"),y=[];return e=class extends g{constructor(){super(...arguments),this.doodlebot=void function(e,t,n){for(var i=arguments.length>2,o=0;o<t.length;o++)n=i?t[o].call(e,n):t[o].call(e)}(this,y)}init(e){this.openUI("Connect"),this.setIndicator("disconnected")}setDoodlebot(e){this.doodlebot=e,this.setIndicator("connected")}setIndicator(e){var t;return M(this,void 0,void 0,(function*(){this.indicator&&(null===(t=yield this.indicator)||void 0===t||t.close()),this.indicator="connected"==e?this.indicate({position:"category",msg:"Connected to robot",type:"success",retry:!0}):this.indicate({position:"category",msg:"Not connected to robot",type:"warning",retry:!0})}))}connect(){this.openUI("Connect")}drive(e,t){var n;return M(this,void 0,void 0,(function*(){const i="left"==e||"backward"==e?-t:t,o="right"==e||"backward"==e?-t:t;yield null===(n=this.doodlebot)||void 0===n?void 0:n.motorCommand("steps",{steps:i,stepsPerSecond:2e3},{steps:o,stepsPerSecond:2e3})}))}arc(e,t,n){var i;return M(this,void 0,void 0,(function*(){"right"==e&&(n*=-1),yield null===(i=this.doodlebot)||void 0===i?void 0:i.motorCommand("arc",t,n)}))}stop(){var e;return M(this,void 0,void 0,(function*(){yield null===(e=this.doodlebot)||void 0===e?void 0:e.motorCommand("stop")}))}movePen(e){var t;return M(this,void 0,void 0,(function*(){yield null===(t=this.doodlebot)||void 0===t?void 0:t.penCommand(e)}))}isBumperPressed(e){var t;return M(this,void 0,void 0,(function*(){const n=yield null===(t=this.doodlebot)||void 0===t?void 0:t.getSensorReading("bumper");switch(e){case"back":return n.back>0;case"front":return n.front>0;case"front or back":return n.front>0||n.back>0;case"front and back":return n.front>0&&n.back>0;case"neither":return 0===n.front&&0===n.back}}))}whenBumperPressed(e,t){var n;const i=null===(n=this.doodlebot)||void 0===n?void 0:n.getSensorReadingImmediately("bumper"),o="pressed"===t;switch(e){case"back":return o?i.back>0:0===i.back;case"front":return o?i.front>0:0===i.front;case"front or back":return o?i.front>0||i.back>0:0===i.front&&0===i.back;case"front and back":return o?i.front>0&&i.back>0:0===i.front||0===i.back;case"neither":return o?0===i.front&&0===i.back:i.front>0&&i.back>0}}getSingleSensorReading(e){var t;return M(this,void 0,void 0,(function*(){return yield null===(t=this.doodlebot)||void 0===t?void 0:t.getSensorReading(e)}))}disableSensor(e){var t;return M(this,void 0,void 0,(function*(){yield null===(t=this.doodlebot)||void 0===t?void 0:t.disableSensor(e)}))}clearDisplay(){var e;return M(this,void 0,void 0,(function*(){yield null===(e=this.doodlebot)||void 0===e?void 0:e.display("clear")}))}setDisplay(e){var t,n;return M(this,void 0,void 0,(function*(){yield null===(t=this.doodlebot)||void 0===t?void 0:t.connectToWebsocket("192.168.0.103"),yield null===(n=this.doodlebot)||void 0===n?void 0:n.display(e)}))}getIP(){var e;return M(this,void 0,void 0,(function*(){return null===(e=this.doodlebot)||void 0===e?void 0:e.getIPAddress()}))}connectToVideo(){var e,t;return M(this,void 0,void 0,(function*(){const n=yield null===(e=this.doodlebot)||void 0===e?void 0:e.getIPAddress(),i=yield null===(t=this.doodlebot)||void 0===t?void 0:t.getImageStream(n),o=this.createDrawable(i);o.setVisible(!0),setInterval((()=>o.update(i)),100)}))}connectToAudio(){var e,t;return M(this,void 0,void 0,(function*(){const n=yield null===(e=this.doodlebot)||void 0===e?void 0:e.getIPAddress(),i=yield null===(t=this.doodlebot)||void 0===t?void 0:t.getAudioStream(n,10);yield new Promise((e=>setTimeout(e,9e3))),i.close()}))}sendMessage(e,t,n){var i,o;return M(this,void 0,void 0,(function*(){const r=Object.values(Q).filter((t=>t===e));if(0===r.length)return console.error(`Command ${Q} not found`);"BLE"===n?yield null===(i=this.doodlebot)||void 0===i?void 0:i.sendBLECommand(r[0],...de(t)):yield null===(o=this.doodlebot)||void 0===o?void 0:o.sendWebsocketCommand(r[0],...de(t))}))}},(()=>{var b;const w="function"==typeof Symbol&&Symbol.metadata?Object.create(null!==(b=g[Symbol.metadata])&&void 0!==b?b:null):void 0;n=[t.buttonBlock("Connect Robot")],i=[t.block({type:"command",text:(e,t)=>`drive ${e} for ${t} steps`,args:[{type:"string",options:["forward","backward","left","right"],defaultValue:"forward"},{type:"number",defaultValue:2e3}]})],o=[t.block({type:"command",text:(e,t,n)=>`arc ${e} with radius ${t} for ${n} degrees`,args:[{type:"string",options:["left","right"],defaultValue:"left"},{type:"number",defaultValue:2},{type:"number",defaultValue:90}]})],r=[t.block({type:"command",text:"Stop"})],s=[t.block({type:"command",text:e=>`move pen ${e}`,arg:{type:"string",options:["up","down"],defaultValue:"up"}})],a=[t.block({type:"Boolean",text:e=>`is ${e} bumper pressed`,arg:{type:"string",options:_e,defaultValue:_e[0]}})],c=[t.block({type:"hat",text:(e,t)=>`when ${e} bumper ${t}`,args:[{type:"string",options:_e,defaultValue:_e[0]},{type:"string",options:["release","pressed"],defaultValue:"pressed"}]})],d=[t.block({type:"reporter",text:e=>`${e} sensor`,arg:{type:"string",options:["battery","temperature","humidity","pressure","distance"],defaultValue:"battery"}})],l=[t.block({type:"command",text:e=>`disable ${e}`,arg:{type:"string",options:Z,defaultValue:Z[0]}})],u=[t.block({type:"command",text:"clear display"})],h=[t.block({type:"command",text:e=>`display ${e}`,arg:{type:"string",options:te.filter((e=>"clear"!==e)),defaultValue:"happy"}})],p=[t.block({type:"reporter",text:"get IP address"})],f=[t.block({type:"command",text:"connect video"})],v=[t.block({type:"command",text:"connect audio"})],m=[t.block({type:"command",text:(e,t,n)=>`send (${e}, ${t}) over ${n}`,args:[{type:"string",defaultValue:"u"},{type:"string",defaultValue:"0"},{type:"string",options:["BLE","Websocket"],defaultValue:"BLE"}]})],j(e,null,n,{kind:"method",name:"connect",static:!1,private:!1,access:{has:e=>"connect"in e,get:e=>e.connect},metadata:w},null,y),j(e,null,i,{kind:"method",name:"drive",static:!1,private:!1,access:{has:e=>"drive"in e,get:e=>e.drive},metadata:w},null,y),j(e,null,o,{kind:"method",name:"arc",static:!1,private:!1,access:{has:e=>"arc"in e,get:e=>e.arc},metadata:w},null,y),j(e,null,r,{kind:"method",name:"stop",static:!1,private:!1,access:{has:e=>"stop"in e,get:e=>e.stop},metadata:w},null,y),j(e,null,s,{kind:"method",name:"movePen",static:!1,private:!1,access:{has:e=>"movePen"in e,get:e=>e.movePen},metadata:w},null,y),j(e,null,a,{kind:"method",name:"isBumperPressed",static:!1,private:!1,access:{has:e=>"isBumperPressed"in e,get:e=>e.isBumperPressed},metadata:w},null,y),j(e,null,c,{kind:"method",name:"whenBumperPressed",static:!1,private:!1,access:{has:e=>"whenBumperPressed"in e,get:e=>e.whenBumperPressed},metadata:w},null,y),j(e,null,d,{kind:"method",name:"getSingleSensorReading",static:!1,private:!1,access:{has:e=>"getSingleSensorReading"in e,get:e=>e.getSingleSensorReading},metadata:w},null,y),j(e,null,l,{kind:"method",name:"disableSensor",static:!1,private:!1,access:{has:e=>"disableSensor"in e,get:e=>e.disableSensor},metadata:w},null,y),j(e,null,u,{kind:"method",name:"clearDisplay",static:!1,private:!1,access:{has:e=>"clearDisplay"in e,get:e=>e.clearDisplay},metadata:w},null,y),j(e,null,h,{kind:"method",name:"setDisplay",static:!1,private:!1,access:{has:e=>"setDisplay"in e,get:e=>e.setDisplay},metadata:w},null,y),j(e,null,p,{kind:"method",name:"getIP",static:!1,private:!1,access:{has:e=>"getIP"in e,get:e=>e.getIP},metadata:w},null,y),j(e,null,f,{kind:"method",name:"connectToVideo",static:!1,private:!1,access:{has:e=>"connectToVideo"in e,get:e=>e.connectToVideo},metadata:w},null,y),j(e,null,v,{kind:"method",name:"connectToAudio",static:!1,private:!1,access:{has:e=>"connectToAudio"in e,get:e=>e.connectToAudio},metadata:w},null,y),j(e,null,m,{kind:"method",name:"sendMessage",static:!1,private:!1,access:{has:e=>"sendMessage"in e,get:e=>e.sendMessage},metadata:w},null,y),w&&Object.defineProperty(e,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:w})})(),e})();return e.Connect=class extends V{constructor(e){super(),D(this,e,Le,Ce,a,{extension:0,close:10},ye)}},e.Extension=Pe,Object.defineProperty(e,"__esModule",{value:!0}),e}({},ExtensionFramework);//# sourceMappingURL=doodlebot.js.map
