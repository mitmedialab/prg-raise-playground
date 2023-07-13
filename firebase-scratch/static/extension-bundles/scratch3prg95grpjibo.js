var scratch3prg95grpjibo=function(e,t){"use strict";function n(){}function i(e){return e()}function r(){return Object.create(null)}function s(e){e.forEach(i)}function o(e){return"function"==typeof e}function a(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let l,c;function h(e,t){return l||(l=document.createElement("a")),l.href=t,e===l.href}function u(e,t){e.appendChild(t)}function d(e,t,n){const i=function(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;if(t&&t.host)return t;return e.ownerDocument}(e);if(!i.getElementById(t)){const e=m("style");e.id=t,e.textContent=n,function(e,t){u(e.head||e,t),t.sheet}(i,e)}}function p(e,t,n){e.insertBefore(t,n||null)}function f(e){e.parentNode&&e.parentNode.removeChild(e)}function _(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function m(e){return document.createElement(e)}function g(e){return document.createTextNode(e)}function y(){return g(" ")}function v(e,t,n,i){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}function b(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function w(e,t){e.value=null==t?"":t}function C(e,t,n,i){null==n?e.style.removeProperty(t):e.style.setProperty(t,n,i?"important":"")}function k(e){c=e}const T=[],E=[];let S=[];const x=[],I=Promise.resolve();let N=!1;function P(e){S.push(e)}const R=new Set;let A=0;function D(){if(0!==A)return;const e=c;do{try{for(;A<T.length;){const e=T[A];A++,k(e),L(e.$$)}}catch(e){throw T.length=0,A=0,e}for(k(null),T.length=0,A=0;E.length;)E.pop()();for(let e=0;e<S.length;e+=1){const t=S[e];R.has(t)||(R.add(t),t())}S.length=0}while(T.length);for(;x.length;)x.pop()();N=!1,R.clear(),k(e)}function L(e){if(null!==e.fragment){e.update(),s(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(P)}}const O=new Set;function F(e,t){const n=e.$$;null!==n.fragment&&(!function(e){const t=[],n=[];S.forEach((i=>-1===e.indexOf(i)?t.push(i):n.push(i))),n.forEach((e=>e())),S=t}(n.after_update),s(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function M(e,t){-1===e.$$.dirty[0]&&(T.push(e),N||(N=!0,I.then(D)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function j(e,t,a,l,h,u,d,p=[-1]){const _=c;k(e);const m=e.$$={fragment:null,ctx:[],props:u,update:n,not_equal:h,bound:r(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(_?_.$$.context:[])),callbacks:r(),dirty:p,skip_bound:!1,root:t.target||_.$$.root};d&&d(m.root);let g=!1;if(m.ctx=a?a(e,t.props||{},((t,n,...i)=>{const r=i.length?i[0]:n;return m.ctx&&h(m.ctx[t],m.ctx[t]=r)&&(!m.skip_bound&&m.bound[t]&&m.bound[t](r),g&&M(e,t)),n})):[],m.update(),g=!0,s(m.before_update),m.fragment=!!l&&l(m.ctx),t.target){if(t.hydrate){const e=function(e){return Array.from(e.childNodes)}(t.target);m.fragment&&m.fragment.l(e),e.forEach(f)}else m.fragment&&m.fragment.c();t.intro&&((y=e.$$.fragment)&&y.i&&(O.delete(y),y.i(v))),function(e,t,n,r){const{fragment:a,after_update:l}=e.$$;a&&a.m(t,n),r||P((()=>{const t=e.$$.on_mount.map(i).filter(o);e.$$.on_destroy?e.$$.on_destroy.push(...t):s(t),e.$$.on_mount=[]})),l.forEach(P)}(e,t.target,t.anchor,t.customElement),D()}var y,v;k(_)}class B{$destroy(){F(this,1),this.$destroy=n}$on(e,t){if(!o(t))return n;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(t),()=>{const e=i.indexOf(t);-1!==e&&i.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function q(e,t,n,i){return new(n||(n=Promise))((function(r,s){function o(e){try{l(i.next(e))}catch(e){s(e)}}function a(e){try{l(i.throw(e))}catch(e){s(e)}}function l(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,a)}l((i=i.apply(e,t||[])).next())}))}function z(){}function U(){U.init.call(this)}function W(e){return void 0===e._maxListeners?U.defaultMaxListeners:e._maxListeners}function $(e,t,n,i){var r,s,o,a;if("function"!=typeof n)throw new TypeError('"listener" argument must be a function');if((s=e._events)?(s.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),s=e._events),o=s[t]):(s=e._events=new z,e._eventsCount=0),o){if("function"==typeof o?o=s[t]=i?[n,o]:[o,n]:i?o.unshift(n):o.push(n),!o.warned&&(r=W(e))&&r>0&&o.length>r){o.warned=!0;var l=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+t+" listeners added. Use emitter.setMaxListeners() to increase limit");l.name="MaxListenersExceededWarning",l.emitter=e,l.type=t,l.count=o.length,a=l,"function"==typeof console.warn?console.warn(a):console.log(a)}}else o=s[t]=n,++e._eventsCount;return e}function H(e,t,n){var i=!1;function r(){e.removeListener(t,r),i||(i=!0,n.apply(e,arguments))}return r.listener=n,r}function V(e){var t=this._events;if(t){var n=t[e];if("function"==typeof n)return 1;if(n)return n.length}return 0}function G(e,t){for(var n=new Array(t);t--;)n[t]=e[t];return n}z.prototype=Object.create(null),U.EventEmitter=U,U.usingDomains=!1,U.prototype.domain=void 0,U.prototype._events=void 0,U.prototype._maxListeners=void 0,U.defaultMaxListeners=10,U.init=function(){this.domain=null,U.usingDomains&&undefined.active,this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=new z,this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},U.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||isNaN(e))throw new TypeError('"n" argument must be a positive number');return this._maxListeners=e,this},U.prototype.getMaxListeners=function(){return W(this)},U.prototype.emit=function(e){var t,n,i,r,s,o,a,l="error"===e;if(o=this._events)l=l&&null==o.error;else if(!l)return!1;if(a=this.domain,l){if(t=arguments[1],!a){if(t instanceof Error)throw t;var c=new Error('Uncaught, unspecified "error" event. ('+t+")");throw c.context=t,c}return t||(t=new Error('Uncaught, unspecified "error" event')),t.domainEmitter=this,t.domain=a,t.domainThrown=!1,a.emit("error",t),!1}if(!(n=o[e]))return!1;var h="function"==typeof n;switch(i=arguments.length){case 1:!function(e,t,n){if(t)e.call(n);else for(var i=e.length,r=G(e,i),s=0;s<i;++s)r[s].call(n)}(n,h,this);break;case 2:!function(e,t,n,i){if(t)e.call(n,i);else for(var r=e.length,s=G(e,r),o=0;o<r;++o)s[o].call(n,i)}(n,h,this,arguments[1]);break;case 3:!function(e,t,n,i,r){if(t)e.call(n,i,r);else for(var s=e.length,o=G(e,s),a=0;a<s;++a)o[a].call(n,i,r)}(n,h,this,arguments[1],arguments[2]);break;case 4:!function(e,t,n,i,r,s){if(t)e.call(n,i,r,s);else for(var o=e.length,a=G(e,o),l=0;l<o;++l)a[l].call(n,i,r,s)}(n,h,this,arguments[1],arguments[2],arguments[3]);break;default:for(r=new Array(i-1),s=1;s<i;s++)r[s-1]=arguments[s];!function(e,t,n,i){if(t)e.apply(n,i);else for(var r=e.length,s=G(e,r),o=0;o<r;++o)s[o].apply(n,i)}(n,h,this,r)}return!0},U.prototype.addListener=function(e,t){return $(this,e,t,!1)},U.prototype.on=U.prototype.addListener,U.prototype.prependListener=function(e,t){return $(this,e,t,!0)},U.prototype.once=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.on(e,H(this,e,t)),this},U.prototype.prependOnceListener=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.prependListener(e,H(this,e,t)),this},U.prototype.removeListener=function(e,t){var n,i,r,s,o;if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');if(!(i=this._events))return this;if(!(n=i[e]))return this;if(n===t||n.listener&&n.listener===t)0==--this._eventsCount?this._events=new z:(delete i[e],i.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(r=-1,s=n.length;s-- >0;)if(n[s]===t||n[s].listener&&n[s].listener===t){o=n[s].listener,r=s;break}if(r<0)return this;if(1===n.length){if(n[0]=void 0,0==--this._eventsCount)return this._events=new z,this;delete i[e]}else!function(e,t){for(var n=t,i=n+1,r=e.length;i<r;n+=1,i+=1)e[n]=e[i];e.pop()}(n,r);i.removeListener&&this.emit("removeListener",e,o||t)}return this},U.prototype.off=function(e,t){return this.removeListener(e,t)},U.prototype.removeAllListeners=function(e){var t,n;if(!(n=this._events))return this;if(!n.removeListener)return 0===arguments.length?(this._events=new z,this._eventsCount=0):n[e]&&(0==--this._eventsCount?this._events=new z:delete n[e]),this;if(0===arguments.length){for(var i,r=Object.keys(n),s=0;s<r.length;++s)"removeListener"!==(i=r[s])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=new z,this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(t)do{this.removeListener(e,t[t.length-1])}while(t[0]);return this},U.prototype.listeners=function(e){var t,n=this._events;return n&&(t=n[e])?"function"==typeof t?[t.listener||t]:function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t):[]},U.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):V.call(e,t)},U.prototype.listenerCount=V,U.prototype.eventNames=function(){return this._eventsCount>0?Reflect.ownKeys(this._events):[]};const J=!1,Q="${JSCORE_VERSION}",Y=function(e,t){if(!e)throw K(t)},K=function(e){return new Error("Firebase Database ("+Q+") INTERNAL ASSERT FAILED: "+e)},X=function(e){const t=[];let n=0;for(let i=0;i<e.length;i++){let r=e.charCodeAt(i);r<128?t[n++]=r:r<2048?(t[n++]=r>>6|192,t[n++]=63&r|128):55296==(64512&r)&&i+1<e.length&&56320==(64512&e.charCodeAt(i+1))?(r=65536+((1023&r)<<10)+(1023&e.charCodeAt(++i)),t[n++]=r>>18|240,t[n++]=r>>12&63|128,t[n++]=r>>6&63|128,t[n++]=63&r|128):(t[n++]=r>>12|224,t[n++]=r>>6&63|128,t[n++]=63&r|128)}return t},Z={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let t=0;t<e.length;t+=3){const r=e[t],s=t+1<e.length,o=s?e[t+1]:0,a=t+2<e.length,l=a?e[t+2]:0,c=r>>2,h=(3&r)<<4|o>>4;let u=(15&o)<<2|l>>6,d=63&l;a||(d=64,s||(u=64)),i.push(n[c],n[h],n[u],n[d])}return i.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(X(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):function(e){const t=[];let n=0,i=0;for(;n<e.length;){const r=e[n++];if(r<128)t[i++]=String.fromCharCode(r);else if(r>191&&r<224){const s=e[n++];t[i++]=String.fromCharCode((31&r)<<6|63&s)}else if(r>239&&r<365){const s=((7&r)<<18|(63&e[n++])<<12|(63&e[n++])<<6|63&e[n++])-65536;t[i++]=String.fromCharCode(55296+(s>>10)),t[i++]=String.fromCharCode(56320+(1023&s))}else{const s=e[n++],o=e[n++];t[i++]=String.fromCharCode((15&r)<<12|(63&s)<<6|63&o)}}return t.join("")}(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let t=0;t<e.length;){const r=n[e.charAt(t++)],s=t<e.length?n[e.charAt(t)]:0;++t;const o=t<e.length?n[e.charAt(t)]:64;++t;const a=t<e.length?n[e.charAt(t)]:64;if(++t,null==r||null==s||null==o||null==a)throw new ee;const l=r<<2|s>>4;if(i.push(l),64!==o){const e=s<<4&240|o>>2;if(i.push(e),64!==a){const e=o<<6&192|a;i.push(e)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const te=function(e){const t=X(e);return Z.encodeByteArray(t,!0)},ne=function(e){return te(e).replace(/\./g,"")},ie=function(e){try{return Z.decodeString(e,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};function re(e,t){if(!(t instanceof Object))return t;switch(t.constructor){case Date:return new Date(t.getTime());case Object:void 0===e&&(e={});break;case Array:e=[];break;default:return t}for(const n in t)t.hasOwnProperty(n)&&"__proto__"!==n&&(e[n]=re(e[n],t[n]));return e}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const se=()=>
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("Unable to locate global object.")}().__FIREBASE_DEFAULTS__,oe=()=>{try{return se()||(()=>{if("undefined"==typeof process||void 0===process.env)return;const e=process.env.__FIREBASE_DEFAULTS__;return e?JSON.parse(e):void 0})()||(()=>{if("undefined"==typeof document)return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(e){return}const t=e&&ie(e[1]);return t&&JSON.parse(t)})()}catch(e){return void console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`)}},ae=()=>{var e;return null===(e=oe())||void 0===e?void 0:e.config};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class le{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),"function"==typeof e&&(this.promise.catch((()=>{})),1===e.length?e(t):e(t,n))}}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ce(){return"undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test("undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:"")}function he(){return!0===J}class ue extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,ue.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,de.prototype.create)}}class de{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},i=`${this.service}/${e}`,r=this.errors[e],s=r?function(e,t){return e.replace(pe,((e,n)=>{const i=t[n];return null!=i?String(i):`<${n}?>`}))}(r,n):"Error",o=`${this.serviceName}: ${s} (${i}).`;return new ue(i,o,n)}}const pe=/\{\$([^}]+)}/g;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fe(e){return JSON.parse(e)}function _e(e){return JSON.stringify(e)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const me=function(e){let t={},n={},i={},r="";try{const s=e.split(".");t=fe(ie(s[0])||""),n=fe(ie(s[1])||""),r=s[2],i=n.d||{},delete n.d}catch(e){}return{header:t,claims:n,data:i,signature:r}};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ge(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function ye(e,t){return Object.prototype.hasOwnProperty.call(e,t)?e[t]:void 0}function ve(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}function be(e,t,n){const i={};for(const r in e)Object.prototype.hasOwnProperty.call(e,r)&&(i[r]=t.call(n,e[r],r,e));return i}function we(e,t){if(e===t)return!0;const n=Object.keys(e),i=Object.keys(t);for(const r of n){if(!i.includes(r))return!1;const n=e[r],s=t[r];if(Ce(n)&&Ce(s)){if(!we(n,s))return!1}else if(n!==s)return!1}for(const e of i)if(!n.includes(e))return!1;return!0}function Ce(e){return null!==e&&"object"==typeof e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ke{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=64,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const n=this.W_;if("string"==typeof e)for(let i=0;i<16;i++)n[i]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let i=0;i<16;i++)n[i]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let e=16;e<80;e++){const t=n[e-3]^n[e-8]^n[e-14]^n[e-16];n[e]=4294967295&(t<<1|t>>>31)}let i,r,s=this.chain_[0],o=this.chain_[1],a=this.chain_[2],l=this.chain_[3],c=this.chain_[4];for(let e=0;e<80;e++){e<40?e<20?(i=l^o&(a^l),r=1518500249):(i=o^a^l,r=1859775393):e<60?(i=o&a|l&(o|a),r=2400959708):(i=o^a^l,r=3395469782);const t=(s<<5|s>>>27)+i+c+r+n[e]&4294967295;c=l,l=a,a=4294967295&(o<<30|o>>>2),o=s,s=t}this.chain_[0]=this.chain_[0]+s&4294967295,this.chain_[1]=this.chain_[1]+o&4294967295,this.chain_[2]=this.chain_[2]+a&4294967295,this.chain_[3]=this.chain_[3]+l&4294967295,this.chain_[4]=this.chain_[4]+c&4294967295}update(e,t){if(null==e)return;void 0===t&&(t=e.length);const n=t-this.blockSize;let i=0;const r=this.buf_;let s=this.inbuf_;for(;i<t;){if(0===s)for(;i<=n;)this.compress_(e,i),i+=this.blockSize;if("string"==typeof e){for(;i<t;)if(r[s]=e.charCodeAt(i),++s,++i,s===this.blockSize){this.compress_(r),s=0;break}}else for(;i<t;)if(r[s]=e[i],++s,++i,s===this.blockSize){this.compress_(r),s=0;break}}this.inbuf_=s,this.total_+=t}digest(){const e=[];let t=8*this.total_;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let e=this.blockSize-1;e>=56;e--)this.buf_[e]=255&t,t/=256;this.compress_(this.buf_);let n=0;for(let t=0;t<5;t++)for(let i=24;i>=0;i-=8)e[n]=this.chain_[t]>>i&255,++n;return e}}function Te(e,t){const n=new Ee(e,t);return n.subscribe.bind(n)}class Ee{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then((()=>{e(this)})).catch((e=>{this.error(e)}))}next(e){this.forEachObserver((t=>{t.next(e)}))}error(e){this.forEachObserver((t=>{t.error(e)})),this.close(e)}complete(){this.forEachObserver((e=>{e.complete()})),this.close()}subscribe(e,t,n){let i;if(void 0===e&&void 0===t&&void 0===n)throw new Error("Missing Observer.");i=function(e,t){if("object"!=typeof e||null===e)return!1;for(const n of t)if(n in e&&"function"==typeof e[n])return!0;return!1}(e,["next","error","complete"])?e:{next:e,error:t,complete:n},void 0===i.next&&(i.next=Se),void 0===i.error&&(i.error=Se),void 0===i.complete&&(i.complete=Se);const r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then((()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch(e){}})),this.observers.push(i),r}unsubscribeOne(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then((()=>{if(void 0!==this.observers&&void 0!==this.observers[e])try{t(this.observers[e])}catch(e){"undefined"!=typeof console&&console.error&&console.error(e)}}))}close(e){this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then((()=>{this.observers=void 0,this.onNoObservers=void 0})))}}function Se(){}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xe=function(e,t,n,i){let r;if(i<t?r="at least "+t:i>n&&(r=0===n?"none":"no more than "+n),r){throw new Error(e+" failed: Was called with "+i+(1===i?" argument.":" arguments.")+" Expects "+r+".")}};function Ie(e,t){return`${e} failed: ${t} argument `}function Ne(e,t,n,i){if((!i||n)&&"function"!=typeof n)throw new Error(Ie(e,t)+"must be a valid function.")}function Pe(e,t,n,i){if((!i||n)&&("object"!=typeof n||null===n))throw new Error(Ie(e,t)+"must be a valid context object.")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Re=function(e){let t=0;for(let n=0;n<e.length;n++){const i=e.charCodeAt(n);i<128?t++:i<2048?t+=2:i>=55296&&i<=56319?(t+=4,n++):t+=3}return t};
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Ae(e){return e&&e._delegate?e._delegate:e}class De{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Le="[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oe{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new le;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch(e){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),i=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(!this.isInitialized(n)&&!this.shouldAutoInitialize()){if(i)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:n})}catch(e){if(i)return null;throw e}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(function(e){return"EAGER"===e.instantiationMode}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e))try{this.getOrInitializeService({instanceIdentifier:Le})}catch(e){}for(const[e,t]of this.instancesDeferred.entries()){const n=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:n});t.resolve(e)}catch(e){}}}}clearInstance(e=Le){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter((e=>"INTERNAL"in e)).map((e=>e.INTERNAL.delete())),...e.filter((e=>"_delete"in e)).map((e=>e._delete()))])}isComponentSet(){return null!=this.component}isInitialized(e=Le){return this.instances.has(e)}getOptions(e=Le){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[e,t]of this.instancesDeferred.entries()){n===this.normalizeInstanceIdentifier(e)&&t.resolve(i)}return i}onInit(e,t){var n;const i=this.normalizeInstanceIdentifier(t),r=null!==(n=this.onInitCallbacks.get(i))&&void 0!==n?n:new Set;r.add(e),this.onInitCallbacks.set(i,r);const s=this.instances.get(i);return s&&e(s,i),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const i of n)try{i(e,t)}catch(e){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:(i=e,i===Le?void 0:i),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch(e){}var i;return n||null}normalizeInstanceIdentifier(e=Le){return this.component?this.component.multipleInstances?e:Le:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}class Fe{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Oe(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Me=[];var je;!function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"}(je||(je={}));const Be={debug:je.DEBUG,verbose:je.VERBOSE,info:je.INFO,warn:je.WARN,error:je.ERROR,silent:je.SILENT},qe=je.INFO,ze={[je.DEBUG]:"log",[je.VERBOSE]:"log",[je.INFO]:"info",[je.WARN]:"warn",[je.ERROR]:"error"},Ue=(e,t,...n)=>{if(t<e.logLevel)return;const i=(new Date).toISOString(),r=ze[t];if(!r)throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`);console[r](`[${i}]  ${e.name}:`,...n)};class We{constructor(e){this.name=e,this._logLevel=qe,this._logHandler=Ue,this._userLogHandler=null,Me.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in je))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?Be[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,je.DEBUG,...e),this._logHandler(this,je.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,je.VERBOSE,...e),this._logHandler(this,je.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,je.INFO,...e),this._logHandler(this,je.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,je.WARN,...e),this._logHandler(this,je.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,je.ERROR,...e),this._logHandler(this,je.ERROR,...e)}}const $e=(e,t)=>t.some((t=>e instanceof t));let He,Ve;const Ge=new WeakMap,Je=new WeakMap,Qe=new WeakMap,Ye=new WeakMap,Ke=new WeakMap;let Xe={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return Je.get(e);if("objectStoreNames"===t)return e.objectStoreNames||Qe.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return tt(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function Ze(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(Ve||(Ve=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(nt(this),t),tt(Ge.get(this))}:function(...t){return tt(e.apply(nt(this),t))}:function(t,...n){const i=e.call(nt(this),t,...n);return Qe.set(i,t.sort?t.sort():[t]),tt(i)}}function et(e){return"function"==typeof e?Ze(e):(e instanceof IDBTransaction&&function(e){if(Je.has(e))return;const t=new Promise(((t,n)=>{const i=()=>{e.removeEventListener("complete",r),e.removeEventListener("error",s),e.removeEventListener("abort",s)},r=()=>{t(),i()},s=()=>{n(e.error||new DOMException("AbortError","AbortError")),i()};e.addEventListener("complete",r),e.addEventListener("error",s),e.addEventListener("abort",s)}));Je.set(e,t)}(e),$e(e,He||(He=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction]))?new Proxy(e,Xe):e)}function tt(e){if(e instanceof IDBRequest)return function(e){const t=new Promise(((t,n)=>{const i=()=>{e.removeEventListener("success",r),e.removeEventListener("error",s)},r=()=>{t(tt(e.result)),i()},s=()=>{n(e.error),i()};e.addEventListener("success",r),e.addEventListener("error",s)}));return t.then((t=>{t instanceof IDBCursor&&Ge.set(t,e)})).catch((()=>{})),Ke.set(t,e),t}(e);if(Ye.has(e))return Ye.get(e);const t=et(e);return t!==e&&(Ye.set(e,t),Ke.set(t,e)),t}const nt=e=>Ke.get(e);const it=["get","getKey","getAll","getAllKeys","count"],rt=["put","add","delete","clear"],st=new Map;function ot(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(st.get(t))return st.get(t);const n=t.replace(/FromIndex$/,""),i=t!==n,r=rt.includes(n);if(!(n in(i?IDBIndex:IDBObjectStore).prototype)||!r&&!it.includes(n))return;const s=async function(e,...t){const s=this.transaction(e,r?"readwrite":"readonly");let o=s.store;return i&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),r&&s.done]))[0]};return st.set(t,s),s}Xe=(e=>({...e,get:(t,n,i)=>ot(t,n)||e.get(t,n,i),has:(t,n)=>!!ot(t,n)||e.has(t,n)}))(Xe);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class at{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map((e=>{if(function(e){const t=e.getComponent();return"VERSION"===(null==t?void 0:t.type)}(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null})).filter((e=>e)).join(" ")}}const lt="@firebase/app",ct="0.9.12",ht=new We("@firebase/app"),ut="[DEFAULT]",dt={[lt]:"fire-core","@firebase/app-compat":"fire-core-compat","@firebase/analytics":"fire-analytics","@firebase/analytics-compat":"fire-analytics-compat","@firebase/app-check":"fire-app-check","@firebase/app-check-compat":"fire-app-check-compat","@firebase/auth":"fire-auth","@firebase/auth-compat":"fire-auth-compat","@firebase/database":"fire-rtdb","@firebase/database-compat":"fire-rtdb-compat","@firebase/functions":"fire-fn","@firebase/functions-compat":"fire-fn-compat","@firebase/installations":"fire-iid","@firebase/installations-compat":"fire-iid-compat","@firebase/messaging":"fire-fcm","@firebase/messaging-compat":"fire-fcm-compat","@firebase/performance":"fire-perf","@firebase/performance-compat":"fire-perf-compat","@firebase/remote-config":"fire-rc","@firebase/remote-config-compat":"fire-rc-compat","@firebase/storage":"fire-gcs","@firebase/storage-compat":"fire-gcs-compat","@firebase/firestore":"fire-fst","@firebase/firestore-compat":"fire-fst-compat","fire-js":"fire-js",firebase:"fire-js-all"},pt=new Map,ft=new Map;function _t(e,t){try{e.container.addComponent(t)}catch(n){ht.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function mt(e,t){e.container.addOrOverwriteComponent(t)}function gt(e){const t=e.name;if(ft.has(t))return ht.debug(`There were multiple attempts to register component ${t}.`),!1;ft.set(t,e);for(const t of pt.values())_t(t,e);return!0}function yt(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const vt=new de("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."});
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class bt{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new De("app",(()=>this),"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw vt.create("app-deleted",{appName:this._name})}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wt="9.22.2";function Ct(e,t={}){let n=e;if("object"!=typeof t){t={name:t}}const i=Object.assign({name:ut,automaticDataCollectionEnabled:!1},t),r=i.name;if("string"!=typeof r||!r)throw vt.create("bad-app-name",{appName:String(r)});if(n||(n=ae()),!n)throw vt.create("no-options");const s=pt.get(r);if(s){if(we(n,s.options)&&we(i,s.config))return s;throw vt.create("duplicate-app",{appName:r})}const o=new Fe(r);for(const e of ft.values())o.addComponent(e);const a=new bt(n,i,o);return pt.set(r,a),a}async function kt(e){const t=e.name;pt.has(t)&&(pt.delete(t),await Promise.all(e.container.getProviders().map((e=>e.delete()))),e.isDeleted=!0)}function Tt(e,t,n){var i;let r=null!==(i=dt[e])&&void 0!==i?i:e;n&&(r+=`-${n}`);const s=r.match(/\s|\//),o=t.match(/\s|\//);if(s||o){const e=[`Unable to register library "${r}" with version "${t}":`];return s&&e.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&e.push("and"),o&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void ht.warn(e.join(" "))}gt(new De(`${r}-version`,(()=>({library:r,version:t})),"VERSION"))}function Et(e,t){if(null!==e&&"function"!=typeof e)throw vt.create("invalid-log-argument");!function(e,t){for(const n of Me){let i=null;t&&t.level&&(i=Be[t.level]),n.userLogHandler=null===e?null:(t,n,...r)=>{const s=r.map((e=>{if(null==e)return null;if("string"==typeof e)return e;if("number"==typeof e||"boolean"==typeof e)return e.toString();if(e instanceof Error)return e.message;try{return JSON.stringify(e)}catch(e){return null}})).filter((e=>e)).join(" ");n>=(null!=i?i:t.logLevel)&&e({level:je[n].toLowerCase(),message:s,args:r,type:t.name})}}}(e,t)}function St(e){var t;t=e,Me.forEach((e=>{e.setLogLevel(t)}))}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xt="firebase-heartbeat-database",It=1,Nt="firebase-heartbeat-store";let Pt=null;function Rt(){return Pt||(Pt=function(e,t,{blocked:n,upgrade:i,blocking:r,terminated:s}={}){const o=indexedDB.open(e,t),a=tt(o);return i&&o.addEventListener("upgradeneeded",(e=>{i(tt(o.result),e.oldVersion,e.newVersion,tt(o.transaction),e)})),n&&o.addEventListener("blocked",(e=>n(e.oldVersion,e.newVersion,e))),a.then((e=>{s&&e.addEventListener("close",(()=>s())),r&&e.addEventListener("versionchange",(e=>r(e.oldVersion,e.newVersion,e)))})).catch((()=>{})),a}(xt,It,{upgrade:(e,t)=>{if(0===t)e.createObjectStore(Nt)}}).catch((e=>{throw vt.create("idb-open",{originalErrorMessage:e.message})}))),Pt}async function At(e,t){try{const n=(await Rt()).transaction(Nt,"readwrite"),i=n.objectStore(Nt);await i.put(t,Dt(e)),await n.done}catch(e){if(e instanceof ue)ht.warn(e.message);else{const t=vt.create("idb-set",{originalErrorMessage:null==e?void 0:e.message});ht.warn(t.message)}}}function Dt(e){return`${e.name}!${e.options.appId}`}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Ft(t),this._heartbeatsCachePromise=this._storage.read().then((e=>(this._heartbeatsCache=e,e)))}async triggerHeartbeat(){const e=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),t=Ot();if(null===this._heartbeatsCache&&(this._heartbeatsCache=await this._heartbeatsCachePromise),this._heartbeatsCache.lastSentHeartbeatDate!==t&&!this._heartbeatsCache.heartbeats.some((e=>e.date===t)))return this._heartbeatsCache.heartbeats.push({date:t,agent:e}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter((e=>{const t=new Date(e.date).valueOf();return Date.now()-t<=2592e6})),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null===this._heartbeatsCache||0===this._heartbeatsCache.heartbeats.length)return"";const e=Ot(),{heartbeatsToSend:t,unsentEntries:n}=function(e,t=1024){const n=[];let i=e.slice();for(const r of e){const e=n.find((e=>e.agent===r.agent));if(e){if(e.dates.push(r.date),Mt(n)>t){e.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),Mt(n)>t){n.pop();break}i=i.slice(1)}return{heartbeatsToSend:n,unsentEntries:i}}(this._heartbeatsCache.heartbeats),i=ne(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,n.length>0?(this._heartbeatsCache.heartbeats=n,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}}function Ot(){return(new Date).toISOString().substring(0,10)}class Ft{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!function(){try{return"object"==typeof indexedDB}catch(e){return!1}}()&&new Promise(((e,t)=>{try{let n=!0;const i="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(i);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(i),e(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var e;t((null===(e=r.error)||void 0===e?void 0:e.message)||"")}}catch(e){t(e)}})).then((()=>!0)).catch((()=>!1))}async read(){if(await this._canUseIndexedDBPromise){return await async function(e){try{const t=await Rt();return await t.transaction(Nt).objectStore(Nt).get(Dt(e))}catch(e){if(e instanceof ue)ht.warn(e.message);else{const t=vt.create("idb-get",{originalErrorMessage:null==e?void 0:e.message});ht.warn(t.message)}}}(this.app)||{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const n=await this.read();return At(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;if(await this._canUseIndexedDBPromise){const n=await this.read();return At(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}}}function Mt(e){return ne(JSON.stringify({version:2,heartbeats:e})).length}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var jt;jt="",gt(new De("platform-logger",(e=>new at(e)),"PRIVATE")),gt(new De("heartbeat",(e=>new Lt(e)),"PRIVATE")),Tt(lt,ct,jt),Tt(lt,ct,"esm2017"),Tt("fire-js","");var Bt=Object.freeze({__proto__:null,SDK_VERSION:wt,_DEFAULT_ENTRY_NAME:ut,_addComponent:_t,_addOrOverwriteComponent:mt,_apps:pt,_clearComponents:function(){ft.clear()},_components:ft,_getProvider:yt,_registerComponent:gt,_removeServiceInstance:function(e,t,n=ut){yt(e,t).clearInstance(n)},deleteApp:kt,getApp:function(e=ut){const t=pt.get(e);if(!t&&e===ut&&ae())return Ct();if(!t)throw vt.create("no-app",{appName:e});return t},getApps:function(){return Array.from(pt.values())},initializeApp:Ct,onLog:Et,registerVersion:Tt,setLogLevel:St,FirebaseError:ue});
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(e,t){this._delegate=e,this.firebase=t,_t(e,new De("app-compat",(()=>this),"PUBLIC")),this.container=e.container}get automaticDataCollectionEnabled(){return this._delegate.automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this._delegate.automaticDataCollectionEnabled=e}get name(){return this._delegate.name}get options(){return this._delegate.options}delete(){return new Promise((e=>{this._delegate.checkDestroyed(),e()})).then((()=>(this.firebase.INTERNAL.removeApp(this.name),kt(this._delegate))))}_getService(e,t=ut){var n;this._delegate.checkDestroyed();const i=this._delegate.container.getProvider(e);return i.isInitialized()||"EXPLICIT"!==(null===(n=i.getComponent())||void 0===n?void 0:n.instantiationMode)||i.initialize(),i.getImmediate({identifier:t})}_removeServiceInstance(e,t=ut){this._delegate.container.getProvider(e).clearInstance(t)}_addComponent(e){_t(this._delegate,e)}_addOrOverwriteComponent(e){mt(this._delegate,e)}toJSON(){return{name:this.name,automaticDataCollectionEnabled:this.automaticDataCollectionEnabled,options:this.options}}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zt=new de("app-compat","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance."});const Ut=
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function e(){const t=
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e){const t={},n={__esModule:!0,initializeApp:function(i,r={}){const s=Ct(i,r);if(ge(t,s.name))return t[s.name];const o=new e(s,n);return t[s.name]=o,o},app:i,registerVersion:Tt,setLogLevel:St,onLog:Et,apps:null,SDK_VERSION:wt,INTERNAL:{registerComponent:function(t){const r=t.name,s=r.replace("-compat","");if(gt(t)&&"PUBLIC"===t.type){const o=(e=i())=>{if("function"!=typeof e[s])throw zt.create("invalid-app-argument",{appName:r});return e[s]()};void 0!==t.serviceProps&&re(o,t.serviceProps),n[s]=o,e.prototype[s]=function(...e){return this._getService.bind(this,r).apply(this,t.multipleInstances?e:[])}}return"PUBLIC"===t.type?n[s]:null},removeApp:function(e){delete t[e]},useAsService:function(e,t){if("serverAuth"===t)return null;return t},modularAPIs:Bt}};function i(e){if(!ge(t,e=e||ut))throw zt.create("no-app",{appName:e});return t[e]}return n.default=n,Object.defineProperty(n,"apps",{get:function(){return Object.keys(t).map((e=>t[e]))}}),i.App=e,n}(qt);return t.INTERNAL=Object.assign(Object.assign({},t.INTERNAL),{createFirebaseNamespace:e,extendNamespace:function(e){re(t,e)},createSubscribe:Te,ErrorFactory:de,deepExtend:re}),t}(),Wt=new We("@firebase/app-compat");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
if("object"==typeof self&&self.self===self&&void 0!==self.firebase){Wt.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");const e=self.firebase.SDK_VERSION;e&&e.indexOf("LITE")>=0&&Wt.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ")}const $t=Ut;!
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e){Tt("@firebase/app-compat","0.2.12",e)}();const Ht="@firebase/database",Vt="0.14.4";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Gt="";function Jt(e){Gt=e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qt{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){null==t?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),_e(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return null==t?null:fe(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){null==t?delete this.cache_[e]:this.cache_[e]=t}get(e){return ge(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kt=function(e){try{if("undefined"!=typeof window&&void 0!==window[e]){const t=window[e];return t.setItem("firebase:sentinel","cache"),t.removeItem("firebase:sentinel"),new Qt(t)}}catch(e){}return new Yt},Xt=Kt("localStorage"),Zt=Kt("sessionStorage"),en=new We("@firebase/database"),tn=function(){let e=1;return function(){return e++}}(),nn=function(e){const t=function(e){const t=[];let n=0;for(let i=0;i<e.length;i++){let r=e.charCodeAt(i);if(r>=55296&&r<=56319){const t=r-55296;i++,Y(i<e.length,"Surrogate pair missing trail surrogate."),r=65536+(t<<10)+(e.charCodeAt(i)-56320)}r<128?t[n++]=r:r<2048?(t[n++]=r>>6|192,t[n++]=63&r|128):r<65536?(t[n++]=r>>12|224,t[n++]=r>>6&63|128,t[n++]=63&r|128):(t[n++]=r>>18|240,t[n++]=r>>12&63|128,t[n++]=r>>6&63|128,t[n++]=63&r|128)}return t}(e),n=new ke;n.update(t);const i=n.digest();return Z.encodeByteArray(i)},rn=function(...e){let t="";for(let n=0;n<e.length;n++){const i=e[n];Array.isArray(i)||i&&"object"==typeof i&&"number"==typeof i.length?t+=rn.apply(null,i):t+="object"==typeof i?_e(i):i,t+=" "}return t};let sn=null,on=!0;const an=function(e,t){Y(!t||!0===e||!1===e,"Can't turn on custom loggers persistently."),!0===e?(en.logLevel=je.VERBOSE,sn=en.log.bind(en),t&&Zt.set("logging_enabled",!0)):"function"==typeof e?sn=e:(sn=null,Zt.remove("logging_enabled"))},ln=function(...e){if(!0===on&&(on=!1,null===sn&&!0===Zt.get("logging_enabled")&&an(!0)),sn){const t=rn.apply(null,e);sn(t)}},cn=function(e){return function(...t){ln(e,...t)}},hn=function(...e){const t="FIREBASE INTERNAL ERROR: "+rn(...e);en.error(t)},un=function(...e){const t=`FIREBASE FATAL ERROR: ${rn(...e)}`;throw en.error(t),new Error(t)},dn=function(...e){const t="FIREBASE WARNING: "+rn(...e);en.warn(t)},pn=function(e){return"number"==typeof e&&(e!=e||e===Number.POSITIVE_INFINITY||e===Number.NEGATIVE_INFINITY)},fn="[MIN_NAME]",_n="[MAX_NAME]",mn=function(e,t){if(e===t)return 0;if(e===fn||t===_n)return-1;if(t===fn||e===_n)return 1;{const n=Tn(e),i=Tn(t);return null!==n?null!==i?n-i==0?e.length-t.length:n-i:-1:null!==i?1:e<t?-1:1}},gn=function(e,t){return e===t?0:e<t?-1:1},yn=function(e,t){if(t&&e in t)return t[e];throw new Error("Missing required key ("+e+") in object: "+_e(t))},vn=function(e){if("object"!=typeof e||null===e)return _e(e);const t=[];for(const n in e)t.push(n);t.sort();let n="{";for(let i=0;i<t.length;i++)0!==i&&(n+=","),n+=_e(t[i]),n+=":",n+=vn(e[t[i]]);return n+="}",n},bn=function(e,t){const n=e.length;if(n<=t)return[e];const i=[];for(let r=0;r<n;r+=t)r+t>n?i.push(e.substring(r,n)):i.push(e.substring(r,r+t));return i};function wn(e,t){for(const n in e)e.hasOwnProperty(n)&&t(n,e[n])}const Cn=function(e){Y(!pn(e),"Invalid JSON number");const t=1023;let n,i,r,s,o;0===e?(i=0,r=0,n=1/e==-1/0?1:0):(n=e<0,(e=Math.abs(e))>=Math.pow(2,-1022)?(s=Math.min(Math.floor(Math.log(e)/Math.LN2),t),i=s+t,r=Math.round(e*Math.pow(2,52-s)-Math.pow(2,52))):(i=0,r=Math.round(e/Math.pow(2,-1074))));const a=[];for(o=52;o;o-=1)a.push(r%2?1:0),r=Math.floor(r/2);for(o=11;o;o-=1)a.push(i%2?1:0),i=Math.floor(i/2);a.push(n?1:0),a.reverse();const l=a.join("");let c="";for(o=0;o<64;o+=8){let e=parseInt(l.substr(o,8),2).toString(16);1===e.length&&(e="0"+e),c+=e}return c.toLowerCase()};const kn=new RegExp("^-?(0*)\\d{1,10}$"),Tn=function(e){if(kn.test(e)){const t=Number(e);if(t>=-2147483648&&t<=2147483647)return t}return null},En=function(e){try{e()}catch(e){setTimeout((()=>{const t=e.stack||"";throw dn("Exception was thrown by user callback.",t),e}),Math.floor(0))}},Sn=function(e,t){const n=setTimeout(e,t);return"number"==typeof n&&"undefined"!=typeof Deno&&Deno.unrefTimer?Deno.unrefTimer(n):"object"==typeof n&&n.unref&&n.unref(),n};
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class xn{constructor(e,t){this.appName_=e,this.appCheckProvider=t,this.appCheck=null==t?void 0:t.getImmediate({optional:!0}),this.appCheck||null==t||t.get().then((e=>this.appCheck=e))}getToken(e){return this.appCheck?this.appCheck.getToken(e):new Promise(((t,n)=>{setTimeout((()=>{this.appCheck?this.getToken(e).then(t,n):t(null)}),0)}))}addTokenChangeListener(e){var t;null===(t=this.appCheckProvider)||void 0===t||t.get().then((t=>t.addTokenListener(e)))}notifyForInvalidToken(){dn(`Provided AppCheck credentials for the app named "${this.appName_}" are invalid. This usually indicates your app was not initialized correctly.`)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In{constructor(e,t,n){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=n,this.auth_=null,this.auth_=n.getImmediate({optional:!0}),this.auth_||n.onInit((e=>this.auth_=e))}getToken(e){return this.auth_?this.auth_.getToken(e).catch((e=>e&&"auth/token-not-initialized"===e.code?(ln("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(e))):new Promise(((t,n)=>{setTimeout((()=>{this.auth_?this.getToken(e).then(t,n):t(null)}),0)}))}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then((t=>t.addAuthTokenListener(e)))}removeTokenChangeListener(e){this.authProvider_.get().then((t=>t.removeAuthTokenListener(e)))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',dn(e)}}class Nn{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Nn.OWNER="owner";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Pn=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,Rn="ac",An="websocket",Dn="long_polling";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ln{constructor(e,t,n,i,r=!1,s="",o=!1,a=!1){this.secure=t,this.namespace=n,this.webSocketOnly=i,this.nodeAdmin=r,this.persistenceKey=s,this.includeNamespaceInQueryParams=o,this.isUsingEmulator=a,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=Xt.get("host:"+e)||this._host}isCacheableHost(){return"s-"===this.internalHost.substr(0,2)}isCustomHost(){return"firebaseio.com"!==this._domain&&"firebaseio-demo.com"!==this._domain}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&Xt.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function On(e,t,n){let i;if(Y("string"==typeof t,"typeof type must == string"),Y("object"==typeof n,"typeof params must == object"),t===An)i=(e.secure?"wss://":"ws://")+e.internalHost+"/.ws?";else{if(t!==Dn)throw new Error("Unknown connection type: "+t);i=(e.secure?"https://":"http://")+e.internalHost+"/.lp?"}(function(e){return e.host!==e.internalHost||e.isCustomHost()||e.includeNamespaceInQueryParams})(e)&&(n.ns=e.namespace);const r=[];return wn(n,((e,t)=>{r.push(e+"="+t)})),i+r.join("&")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(){this.counters_={}}incrementCounter(e,t=1){ge(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return re(void 0,this.counters_)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mn={},jn={};function Bn(e){const t=e.toString();return Mn[t]||(Mn[t]=new Fn),Mn[t]}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class qn{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const e=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let t=0;t<e.length;++t)e[t]&&En((()=>{this.onMessage_(e[t])}));if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zn="start";class Un{constructor(e,t,n,i,r,s,o){this.connId=e,this.repoInfo=t,this.applicationId=n,this.appCheckToken=i,this.authToken=r,this.transportSessionId=s,this.lastSessionId=o,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=cn(e),this.stats_=Bn(t),this.urlFn=e=>(this.appCheckToken&&(e[Rn]=this.appCheckToken),On(t,Dn,e))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new qn(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout((()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null}),Math.floor(3e4)),function(e){if("complete"===document.readyState)e();else{let t=!1;const n=function(){document.body?t||(t=!0,e()):setTimeout(n,Math.floor(10))};document.addEventListener?(document.addEventListener("DOMContentLoaded",n,!1),window.addEventListener("load",n,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",(()=>{"complete"===document.readyState&&n()})),window.attachEvent("onload",n))}}((()=>{if(this.isClosed_)return;this.scriptTagHolder=new Wn(((...e)=>{const[t,n,i,r,s]=e;if(this.incrementIncomingBytes_(e),this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,t===zn)this.id=n,this.password=i;else{if("close"!==t)throw new Error("Unrecognized command received: "+t);n?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(n,(()=>{this.onClosed_()}))):this.onClosed_()}}),((...e)=>{const[t,n]=e;this.incrementIncomingBytes_(e),this.myPacketOrderer.handleResponse(t,n)}),(()=>{this.onClosed_()}),this.urlFn);const e={};e[zn]="t",e.ser=Math.floor(1e8*Math.random()),this.scriptTagHolder.uniqueCallbackIdentifier&&(e.cb=this.scriptTagHolder.uniqueCallbackIdentifier),e.v="5",this.transportSessionId&&(e.s=this.transportSessionId),this.lastSessionId&&(e.ls=this.lastSessionId),this.applicationId&&(e.p=this.applicationId),this.appCheckToken&&(e[Rn]=this.appCheckToken),"undefined"!=typeof location&&location.hostname&&Pn.test(location.hostname)&&(e.r="f");const t=this.urlFn(e);this.log_("Connecting via long-poll to "+t),this.scriptTagHolder.addTag(t,(()=>{}))}))}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){Un.forceAllow_=!0}static forceDisallow(){Un.forceDisallow_=!0}static isAvailable(){return!!Un.forceAllow_||!(Un.forceDisallow_||"undefined"==typeof document||null==document.createElement||"object"==typeof window&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href)||"object"==typeof Windows&&"object"==typeof Windows.UI)}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=_e(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const n=te(t),i=bn(n,1840);for(let e=0;e<i.length;e++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,i.length,i[e]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const n={dframe:"t"};n.id=e,n.pw=t,this.myDisconnFrame.src=this.urlFn(n),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=_e(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class Wn{constructor(e,t,n,i){this.onDisconnect=n,this.urlFn=i,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(1e8*Math.random()),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=tn(),window["pLPCommand"+this.uniqueCallbackIdentifier]=e,window["pRTLPCB"+this.uniqueCallbackIdentifier]=t,this.myIFrame=Wn.createIFrame_();let n="";if(this.myIFrame.src&&"javascript:"===this.myIFrame.src.substr(0,11)){n='<script>document.domain="'+document.domain+'";<\/script>'}const i="<html><body>"+n+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(i),this.myIFrame.doc.close()}catch(e){ln("frame writing exception"),e.stack&&ln(e.stack),ln(e)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",!document.body)throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";document.body.appendChild(e);try{e.contentWindow.document||ln("No IE domain setting required")}catch(t){const n=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+n+"';document.close();})())"}return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout((()=>{null!==this.myIFrame&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)}),Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e.id=this.myID,e.pw=this.myPW,e.ser=this.currentSerial;let t=this.urlFn(e),n="",i=0;for(;this.pendingSegs.length>0;){if(!(this.pendingSegs[0].d.length+30+n.length<=1870))break;{const e=this.pendingSegs.shift();n=n+"&seg"+i+"="+e.seg+"&ts"+i+"="+e.ts+"&d"+i+"="+e.d,i++}}return t+=n,this.addLongPollTag_(t,this.currentSerial),!0}return!1}enqueueSegment(e,t,n){this.pendingSegs.push({seg:e,ts:t,d:n}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const n=()=>{this.outstandingRequests.delete(t),this.newRequest_()},i=setTimeout(n,Math.floor(25e3));this.addTag(e,(()=>{clearTimeout(i),n()}))}addTag(e,t){setTimeout((()=>{try{if(!this.sendNewPolls)return;const n=this.myIFrame.doc.createElement("script");n.type="text/javascript",n.async=!0,n.src=e,n.onload=n.onreadystatechange=function(){const e=n.readyState;e&&"loaded"!==e&&"complete"!==e||(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),t())},n.onerror=()=>{ln("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(n)}catch(e){}}),Math.floor(1))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let $n=null;"undefined"!=typeof MozWebSocket?$n=MozWebSocket:"undefined"!=typeof WebSocket&&($n=WebSocket);class Hn{constructor(e,t,n,i,r,s,o){this.connId=e,this.applicationId=n,this.appCheckToken=i,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=cn(this.connId),this.stats_=Bn(t),this.connURL=Hn.connectionURL_(t,s,o,i,n),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,n,i,r){const s={v:"5"};return"undefined"!=typeof location&&location.hostname&&Pn.test(location.hostname)&&(s.r="f"),t&&(s.s=t),n&&(s.ls=n),i&&(s[Rn]=i),r&&(s.p=r),On(e,An,s)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,Xt.set("previous_websocket_failure",!0);try{let e;he(),this.mySock=new $n(this.connURL,[],e)}catch(e){this.log_("Error instantiating WebSocket.");const t=e.message||e.data;return t&&this.log_(t),void this.onClosed_()}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=e=>{this.handleIncomingFrame(e)},this.mySock.onerror=e=>{this.log_("WebSocket error.  Closing connection.");const t=e.message||e.data;t&&this.log_(t),this.onClosed_()}}start(){}static forceDisallow(){Hn.forceDisallow_=!0}static isAvailable(){let e=!1;if("undefined"!=typeof navigator&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,n=navigator.userAgent.match(t);n&&n.length>1&&parseFloat(n[1])<4.4&&(e=!0)}return!e&&null!==$n&&!Hn.forceDisallow_}static previouslyFailed(){return Xt.isInMemoryStorage||!0===Xt.get("previous_websocket_failure")}markConnectionHealthy(){Xt.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const e=this.frames.join("");this.frames=null;const t=fe(e);this.onMessage(t)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(Y(null===this.frames,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(null===this.mySock)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),null!==this.frames)this.appendFrame_(t);else{const e=this.extractFrameCount_(t);null!==e&&this.appendFrame_(e)}}send(e){this.resetKeepAlive();const t=_e(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const n=bn(t,16384);n.length>1&&this.sendString_(String(n.length));for(let e=0;e<n.length;e++)this.sendString_(n[e])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval((()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()}),Math.floor(45e3))}sendString_(e){try{this.mySock.send(e)}catch(e){this.log_("Exception thrown from WebSocket.send():",e.message||e.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}Hn.responsesRequiredToBeHealthy=2,Hn.healthyTimeout=3e4;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Vn{constructor(e){this.initTransports_(e)}static get ALL_TRANSPORTS(){return[Un,Hn]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}initTransports_(e){const t=Hn&&Hn.isAvailable();let n=t&&!Hn.previouslyFailed();if(e.webSocketOnly&&(t||dn("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),n=!0),n)this.transports_=[Hn];else{const e=this.transports_=[];for(const t of Vn.ALL_TRANSPORTS)t&&t.isAvailable()&&e.push(t);Vn.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}Vn.globalTransportInitialized_=!1;class Gn{constructor(e,t,n,i,r,s,o,a,l,c){this.id=e,this.repoInfo_=t,this.applicationId_=n,this.appCheckToken_=i,this.authToken_=r,this.onMessage_=s,this.onReady_=o,this.onDisconnect_=a,this.onKill_=l,this.lastSessionId=c,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=cn("c:"+this.id+":"),this.transportManager_=new Vn(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),n=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout((()=>{this.conn_&&this.conn_.open(t,n)}),Math.floor(0));const i=e.healthyTimeout||0;i>0&&(this.healthyTimeout_=Sn((()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>102400?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>10240?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))}),Math.floor(i)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{2!==this.state_&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if("t"in e){const t=e.t;"a"===t?this.upgradeIfSecondaryHealthy_():"r"===t?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),this.tx_!==this.secondaryConn_&&this.rx_!==this.secondaryConn_||this.close()):"o"===t&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=yn("t",e),n=yn("d",e);if("c"===t)this.onSecondaryControl_(n);else{if("d"!==t)throw new Error("Unknown protocol layer: "+t);this.pendingDataMessages.push(n)}}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:"p",d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:"a",d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:"n",d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=yn("t",e),n=yn("d",e);"c"===t?this.onControl_(n):"d"===t&&this.onDataMessage_(n)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=yn("t",e);if("d"in e){const n=e.d;if("h"===t){const e=Object.assign({},n);this.repoInfo_.isUsingEmulator&&(e.h=this.repoInfo_.host),this.onHandshake_(e)}else if("n"===t){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let e=0;e<this.pendingDataMessages.length;++e)this.onDataMessage_(this.pendingDataMessages[e]);this.pendingDataMessages=[],this.tryCleanupConnection()}else"s"===t?this.onConnectionShutdown_(n):"r"===t?this.onReset_(n):"e"===t?hn("Server Error: "+n):"o"===t?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):hn("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,n=e.v,i=e.h;this.sessionId=e.s,this.repoInfo_.host=i,0===this.state_&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),"5"!==n&&dn("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),n=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,n),Sn((()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())}),Math.floor(6e4))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,1===this.state_?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),0===this.primaryResponsesRequired_?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):Sn((()=>{this.sendPingOnPrimaryIfNecessary_()}),Math.floor(5e3))}sendPingOnPrimaryIfNecessary_(){this.isHealthy_||1!==this.state_||(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:"p",d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,this.tx_!==e&&this.rx_!==e||this.close()}onConnectionLost_(e){this.conn_=null,e||0!==this.state_?1===this.state_&&this.log_("Realtime connection lost."):(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(Xt.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(1!==this.state_)throw"Connection is not connected";this.tx_.send(e)}close(){2!==this.state_&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jn{put(e,t,n,i){}merge(e,t,n,i){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,n){}onDisconnectMerge(e,t,n){}onDisconnectCancel(e,t){}reportStats(e){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qn{constructor(e){this.allowedEvents_=e,this.listeners_={},Y(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const n=[...this.listeners_[e]];for(let e=0;e<n.length;e++)n[e].callback.apply(n[e].context,t)}}on(e,t,n){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:n});const i=this.getInitialEvent(e);i&&t.apply(n,i)}off(e,t,n){this.validateEventType_(e);const i=this.listeners_[e]||[];for(let e=0;e<i.length;e++)if(i[e].callback===t&&(!n||n===i[e].context))return void i.splice(e,1)}validateEventType_(e){Y(this.allowedEvents_.find((t=>t===e)),"Unknown event: "+e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yn extends Qn{constructor(){super(["online"]),this.online_=!0,"undefined"==typeof window||void 0===window.addEventListener||ce()||(window.addEventListener("online",(()=>{this.online_||(this.online_=!0,this.trigger("online",!0))}),!1),window.addEventListener("offline",(()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))}),!1))}static getInstance(){return new Yn}getInitialEvent(e){return Y("online"===e,"Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kn=32,Xn=768;class Zn{constructor(e,t){if(void 0===t){this.pieces_=e.split("/");let t=0;for(let e=0;e<this.pieces_.length;e++)this.pieces_[e].length>0&&(this.pieces_[t]=this.pieces_[e],t++);this.pieces_.length=t,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)""!==this.pieces_[t]&&(e+="/"+this.pieces_[t]);return e||"/"}}function ei(){return new Zn("")}function ti(e){return e.pieceNum_>=e.pieces_.length?null:e.pieces_[e.pieceNum_]}function ni(e){return e.pieces_.length-e.pieceNum_}function ii(e){let t=e.pieceNum_;return t<e.pieces_.length&&t++,new Zn(e.pieces_,t)}function ri(e){return e.pieceNum_<e.pieces_.length?e.pieces_[e.pieces_.length-1]:null}function si(e,t=0){return e.pieces_.slice(e.pieceNum_+t)}function oi(e){if(e.pieceNum_>=e.pieces_.length)return null;const t=[];for(let n=e.pieceNum_;n<e.pieces_.length-1;n++)t.push(e.pieces_[n]);return new Zn(t,0)}function ai(e,t){const n=[];for(let t=e.pieceNum_;t<e.pieces_.length;t++)n.push(e.pieces_[t]);if(t instanceof Zn)for(let e=t.pieceNum_;e<t.pieces_.length;e++)n.push(t.pieces_[e]);else{const e=t.split("/");for(let t=0;t<e.length;t++)e[t].length>0&&n.push(e[t])}return new Zn(n,0)}function li(e){return e.pieceNum_>=e.pieces_.length}function ci(e,t){const n=ti(e),i=ti(t);if(null===n)return t;if(n===i)return ci(ii(e),ii(t));throw new Error("INTERNAL ERROR: innerPath ("+t+") is not within outerPath ("+e+")")}function hi(e,t){const n=si(e,0),i=si(t,0);for(let e=0;e<n.length&&e<i.length;e++){const t=mn(n[e],i[e]);if(0!==t)return t}return n.length===i.length?0:n.length<i.length?-1:1}function ui(e,t){if(ni(e)!==ni(t))return!1;for(let n=e.pieceNum_,i=t.pieceNum_;n<=e.pieces_.length;n++,i++)if(e.pieces_[n]!==t.pieces_[i])return!1;return!0}function di(e,t){let n=e.pieceNum_,i=t.pieceNum_;if(ni(e)>ni(t))return!1;for(;n<e.pieces_.length;){if(e.pieces_[n]!==t.pieces_[i])return!1;++n,++i}return!0}class pi{constructor(e,t){this.errorPrefix_=t,this.parts_=si(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let e=0;e<this.parts_.length;e++)this.byteLength_+=Re(this.parts_[e]);fi(this)}}function fi(e){if(e.byteLength_>Xn)throw new Error(e.errorPrefix_+"has a key path longer than "+Xn+" bytes ("+e.byteLength_+").");if(e.parts_.length>Kn)throw new Error(e.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+Kn+") or object contains a cycle "+_i(e))}function _i(e){return 0===e.parts_.length?"":"in property '"+e.parts_.join(".")+"'"}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mi extends Qn{constructor(){let e,t;super(["visible"]),"undefined"!=typeof document&&void 0!==document.addEventListener&&(void 0!==document.hidden?(t="visibilitychange",e="hidden"):void 0!==document.mozHidden?(t="mozvisibilitychange",e="mozHidden"):void 0!==document.msHidden?(t="msvisibilitychange",e="msHidden"):void 0!==document.webkitHidden&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,(()=>{const t=!document[e];t!==this.visible_&&(this.visible_=t,this.trigger("visible",t))}),!1)}static getInstance(){return new mi}getInitialEvent(e){return Y("visible"===e,"Unknown event type: "+e),[this.visible_]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gi=1e3;class yi extends Jn{constructor(e,t,n,i,r,s,o,a){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=n,this.onConnectStatus_=i,this.onServerInfoUpdate_=r,this.authTokenProvider_=s,this.appCheckTokenProvider_=o,this.authOverride_=a,this.id=yi.nextPersistentConnectionId_++,this.log_=cn("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=gi,this.maxReconnectDelay_=3e5,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,a&&!he())throw new Error("Auth override specified in options, but not supported on non Node.js platforms");mi.getInstance().on("visible",this.onVisible_,this),-1===e.host.indexOf("fblocal")&&Yn.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,n){const i=++this.requestNumber_,r={r:i,a:e,b:t};this.log_(_e(r)),Y(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),n&&(this.requestCBHash_[i]=n)}get(e){this.initConnection_();const t=new le,n={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:e=>{const n=e.d;"ok"===e.s?t.resolve(n):t.reject(n)}};this.outstandingGets_.push(n),this.outstandingGetCount_++;const i=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(i),t.promise}listen(e,t,n,i){this.initConnection_();const r=e._queryIdentifier,s=e._path.toString();this.log_("Listen called for "+s+" "+r),this.listens.has(s)||this.listens.set(s,new Map),Y(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),Y(!this.listens.get(s).has(r),"listen() called twice for same path/queryId.");const o={onComplete:i,hashFn:t,query:e,tag:n};this.listens.get(s).set(r,o),this.connected_&&this.sendListen_(o)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,(n=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,0===this.outstandingGetCount_&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(n)}))}sendListen_(e){const t=e.query,n=t._path.toString(),i=t._queryIdentifier;this.log_("Listen on "+n+" for "+i);const r={p:n};e.tag&&(r.q=t._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest("q",r,(r=>{const s=r.d,o=r.s;yi.warnOnListenWarnings_(s,t);(this.listens.get(n)&&this.listens.get(n).get(i))===e&&(this.log_("listen response",r),"ok"!==o&&this.removeListen_(n,i),e.onComplete&&e.onComplete(o,s))}))}static warnOnListenWarnings_(e,t){if(e&&"object"==typeof e&&ge(e,"w")){const n=ye(e,"w");if(Array.isArray(n)&&~n.indexOf("no_index")){const e='".indexOn": "'+t._queryParams.getIndex().toString()+'"',n=t._path.toString();dn(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${e} at ${n} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},(()=>{})),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&40===e.length||function(e){const t=me(e).claims;return"object"==typeof t&&!0===t.admin}(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=3e4)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},(()=>{}))}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=function(e){const t=me(e).claims;return!!t&&"object"==typeof t&&t.hasOwnProperty("iat")}(e)?"auth":"gauth",n={cred:e};null===this.authOverride_?n.noauth=!0:"object"==typeof this.authOverride_&&(n.authvar=this.authOverride_),this.sendRequest(t,n,(t=>{const n=t.s,i=t.d||"error";this.authToken_===e&&("ok"===n?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(n,i))}))}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},(e=>{const t=e.s,n=e.d||"error";"ok"===t?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,n)}))}unlisten(e,t){const n=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+n+" "+i),Y(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query");this.removeListen_(n,i)&&this.connected_&&this.sendUnlisten_(n,i,e._queryObject,t)}sendUnlisten_(e,t,n,i){this.log_("Unlisten on "+e+" for "+t);const r={p:e};i&&(r.q=n,r.t=i),this.sendRequest("n",r)}onDisconnectPut(e,t,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:n})}onDisconnectMerge(e,t,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:n})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,n,i){const r={p:t,d:n};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,(e=>{i&&setTimeout((()=>{i(e.s,e.d)}),Math.floor(0))}))}put(e,t,n,i){this.putInternal("p",e,t,n,i)}merge(e,t,n,i){this.putInternal("m",e,t,n,i)}putInternal(e,t,n,i,r){this.initConnection_();const s={p:t,d:n};void 0!==r&&(s.h=r),this.outstandingPuts_.push({action:e,request:s,onComplete:i}),this.outstandingPutCount_++;const o=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(o):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,n=this.outstandingPuts_[e].request,i=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,n,(n=>{this.log_(t+" response",n),delete this.outstandingPuts_[e],this.outstandingPutCount_--,0===this.outstandingPutCount_&&(this.outstandingPuts_=[]),i&&i(n.s,n.d)}))}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,(e=>{if("ok"!==e.s){const t=e.d;this.log_("reportStats","Error sending stats: "+t)}}))}}onDataMessage_(e){if("r"in e){this.log_("from server: "+_e(e));const t=e.r,n=this.requestCBHash_[t];n&&(delete this.requestCBHash_[t],n(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),"d"===e?this.onDataUpdate_(t.p,t.d,!1,t.t):"m"===e?this.onDataUpdate_(t.p,t.d,!0,t.t):"c"===e?this.onListenRevoked_(t.p,t.q):"ac"===e?this.onAuthRevoked_(t.s,t.d):"apc"===e?this.onAppCheckRevoked_(t.s,t.d):"sd"===e?this.onSecurityDebugPacket_(t):hn("Unrecognized action received from server: "+_e(e)+"\nAre you using the latest client?")}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=(new Date).getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){Y(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout((()=>{this.establishConnectionTimer_=null,this.establishConnection_()}),Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=gi,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=gi,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){if(this.visible_){if(this.lastConnectionEstablishedTime_){(new Date).getTime()-this.lastConnectionEstablishedTime_>3e4&&(this.reconnectDelay_=gi),this.lastConnectionEstablishedTime_=null}}else this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=(new Date).getTime();const e=(new Date).getTime()-this.lastConnectionAttemptTime_;let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,1.3*this.reconnectDelay_)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=(new Date).getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),n=this.onRealtimeDisconnect_.bind(this),i=this.id+":"+yi.nextConnectionId_++,r=this.lastSessionId;let s=!1,o=null;const a=function(){o?o.close():(s=!0,n())},l=function(e){Y(o,"sendRequest call when we're not connected not allowed."),o.sendRequest(e)};this.realtime_={close:a,sendRequest:l};const c=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[a,l]=await Promise.all([this.authTokenProvider_.getToken(c),this.appCheckTokenProvider_.getToken(c)]);s?ln("getToken() completed but was canceled"):(ln("getToken() completed. Creating connection."),this.authToken_=a&&a.accessToken,this.appCheckToken_=l&&l.token,o=new Gn(i,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,n,(e=>{dn(e+" ("+this.repoInfo_.toString()+")"),this.interrupt("server_kill")}),r))}catch(e){this.log_("Failed to get token: "+e),s||(this.repoInfo_.nodeAdmin&&dn(e),a())}}}interrupt(e){ln("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){ln("Resuming connection for reason: "+e),delete this.interruptReasons_[e],ve(this.interruptReasons_)&&(this.reconnectDelay_=gi,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-(new Date).getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}0===this.outstandingPutCount_&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let n;n=t?t.map((e=>vn(e))).join("$"):"default";const i=this.removeListen_(e,n);i&&i.onComplete&&i.onComplete("permission_denied")}removeListen_(e,t){const n=new Zn(e).toString();let i;if(this.listens.has(n)){const e=this.listens.get(n);i=e.get(t),e.delete(t),0===e.size&&this.listens.delete(n)}else i=void 0;return i}onAuthRevoked_(e,t){ln("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),"invalid_token"!==e&&"permission_denied"!==e||(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=3&&(this.reconnectDelay_=3e4,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){ln("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,"invalid_token"!==e&&"permission_denied"!==e||(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=3&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace("\n","\nFIREBASE: "))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};e["sdk.js."+Gt.replace(/\./g,"-")]=1,ce()?e["framework.cordova"]=1:"object"==typeof navigator&&"ReactNative"===navigator.product&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=Yn.getInstance().currentlyOnline();return ve(this.interruptReasons_)&&e}}yi.nextPersistentConnectionId_=0,yi.nextConnectionId_=0;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class vi{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new vi(e,t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bi{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const n=new vi(fn,e),i=new vi(fn,t);return 0!==this.compare(n,i)}minPost(){return vi.MIN}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let wi;class Ci extends bi{static get __EMPTY_NODE(){return wi}static set __EMPTY_NODE(e){wi=e}compare(e,t){return mn(e.name,t.name)}isDefinedOn(e){throw K("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return vi.MIN}maxPost(){return new vi(_n,wi)}makePost(e,t){return Y("string"==typeof e,"KeyIndex indexValue must always be a string."),new vi(e,wi)}toString(){return".key"}}const ki=new Ci;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ti{constructor(e,t,n,i,r=null){this.isReverse_=i,this.resultGenerator_=r,this.nodeStack_=[];let s=1;for(;!e.isEmpty();)if(s=t?n(e.key,t):1,i&&(s*=-1),s<0)e=this.isReverse_?e.left:e.right;else{if(0===s){this.nodeStack_.push(e);break}this.nodeStack_.push(e),e=this.isReverse_?e.right:e.left}}getNext(){if(0===this.nodeStack_.length)return null;let e,t=this.nodeStack_.pop();if(e=this.resultGenerator_?this.resultGenerator_(t.key,t.value):{key:t.key,value:t.value},this.isReverse_)for(t=t.left;!t.isEmpty();)this.nodeStack_.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack_.push(t),t=t.left;return e}hasNext(){return this.nodeStack_.length>0}peek(){if(0===this.nodeStack_.length)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class Ei{constructor(e,t,n,i,r){this.key=e,this.value=t,this.color=null!=n?n:Ei.RED,this.left=null!=i?i:Si.EMPTY_NODE,this.right=null!=r?r:Si.EMPTY_NODE}copy(e,t,n,i,r){return new Ei(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=i?i:this.left,null!=r?r:this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let i=this;const r=n(e,i.key);return i=r<0?i.copy(null,null,null,i.left.insert(e,t,n),null):0===r?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,n)),i.fixUp_()}removeMin_(){if(this.left.isEmpty())return Si.EMPTY_NODE;let e=this;return e.left.isRed_()||e.left.left.isRed_()||(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let n,i;if(n=this,t(e,n.key)<0)n.left.isEmpty()||n.left.isRed_()||n.left.left.isRed_()||(n=n.moveRedLeft_()),n=n.copy(null,null,null,n.left.remove(e,t),null);else{if(n.left.isRed_()&&(n=n.rotateRight_()),n.right.isEmpty()||n.right.isRed_()||n.right.left.isRed_()||(n=n.moveRedRight_()),0===t(e,n.key)){if(n.right.isEmpty())return Si.EMPTY_NODE;i=n.right.min_(),n=n.copy(i.key,i.value,null,null,n.right.removeMin_())}n=n.copy(null,null,null,null,n.right.remove(e,t))}return n.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,Ei.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,Ei.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}Ei.RED=!0,Ei.BLACK=!1;class Si{constructor(e,t=Si.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new Si(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,Ei.BLACK,null,null))}remove(e){return new Si(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,Ei.BLACK,null,null))}get(e){let t,n=this.root_;for(;!n.isEmpty();){if(t=this.comparator_(e,n.key),0===t)return n.value;t<0?n=n.left:t>0&&(n=n.right)}return null}getPredecessorKey(e){let t,n=this.root_,i=null;for(;!n.isEmpty();){if(t=this.comparator_(e,n.key),0===t){if(n.left.isEmpty())return i?i.key:null;for(n=n.left;!n.right.isEmpty();)n=n.right;return n.key}t<0?n=n.left:t>0&&(i=n,n=n.right)}throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new Ti(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new Ti(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new Ti(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new Ti(this.root_,null,this.comparator_,!0,e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function xi(e,t){return mn(e.name,t.name)}function Ii(e,t){return mn(e,t)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ni;Si.EMPTY_NODE=new class{copy(e,t,n,i,r){return this}insert(e,t,n){return new Ei(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}};const Pi=function(e){return"number"==typeof e?"number:"+Cn(e):"string:"+e},Ri=function(e){if(e.isLeafNode()){const t=e.val();Y("string"==typeof t||"number"==typeof t||"object"==typeof t&&ge(t,".sv"),"Priority must be a string or number.")}else Y(e===Ni||e.isEmpty(),"priority of unexpected type.");Y(e===Ni||e.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let Ai,Di,Li;class Oi{constructor(e,t=Oi.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,Y(void 0!==this.value_&&null!==this.value_,"LeafNode shouldn't be created with null/undefined value."),Ri(this.priorityNode_)}static set __childrenNodeConstructor(e){Ai=e}static get __childrenNodeConstructor(){return Ai}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new Oi(this.value_,e)}getImmediateChild(e){return".priority"===e?this.priorityNode_:Oi.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return li(e)?this:".priority"===ti(e)?this.priorityNode_:Oi.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return".priority"===e?this.updatePriority(t):t.isEmpty()&&".priority"!==e?this:Oi.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const n=ti(e);return null===n?t:t.isEmpty()&&".priority"!==n?this:(Y(".priority"!==n||1===ni(e),".priority must be the last token in a path"),this.updateImmediateChild(n,Oi.__childrenNodeConstructor.EMPTY_NODE.updateChild(ii(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(null===this.lazyHash_){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+Pi(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",e+="number"===t?Cn(this.value_):this.value_,this.lazyHash_=nn(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===Oi.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof Oi.__childrenNodeConstructor?-1:(Y(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,n=typeof this.value_,i=Oi.VALUE_TYPE_ORDER.indexOf(t),r=Oi.VALUE_TYPE_ORDER.indexOf(n);return Y(i>=0,"Unknown leaf type: "+t),Y(r>=0,"Unknown leaf type: "+n),i===r?"object"===n?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}return!1}}Oi.VALUE_TYPE_ORDER=["object","boolean","number","string"];const Fi=new class extends bi{compare(e,t){const n=e.node.getPriority(),i=t.node.getPriority(),r=n.compareTo(i);return 0===r?mn(e.name,t.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return vi.MIN}maxPost(){return new vi(_n,new Oi("[PRIORITY-POST]",Li))}makePost(e,t){const n=Di(e);return new vi(t,new Oi("[PRIORITY-POST]",n))}toString(){return".priority"}},Mi=Math.log(2);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ji{constructor(e){var t;this.count=(t=e+1,parseInt(Math.log(t)/Mi,10)),this.current_=this.count-1;const n=(i=this.count,parseInt(Array(i+1).join("1"),2));var i;this.bits_=e+1&n}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const Bi=function(e,t,n,i){e.sort(t);const r=function(t,i){const s=i-t;let o,a;if(0===s)return null;if(1===s)return o=e[t],a=n?n(o):o,new Ei(a,o.node,Ei.BLACK,null,null);{const l=parseInt(s/2,10)+t,c=r(t,l),h=r(l+1,i);return o=e[l],a=n?n(o):o,new Ei(a,o.node,Ei.BLACK,c,h)}},s=function(t){let i=null,s=null,o=e.length;const a=function(t,i){const s=o-t,a=o;o-=t;const c=r(s+1,a),h=e[s],u=n?n(h):h;l(new Ei(u,h.node,i,null,c))},l=function(e){i?(i.left=e,i=e):(s=e,i=e)};for(let e=0;e<t.count;++e){const n=t.nextBitIsOne(),i=Math.pow(2,t.count-(e+1));n?a(i,Ei.BLACK):(a(i,Ei.BLACK),a(i,Ei.RED))}return s}(new ji(e.length));return new Si(i||t,s)};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let qi;const zi={};class Ui{constructor(e,t){this.indexes_=e,this.indexSet_=t}static get Default(){return Y(zi&&Fi,"ChildrenNode.ts has not been loaded"),qi=qi||new Ui({".priority":zi},{".priority":Fi}),qi}get(e){const t=ye(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof Si?t:null}hasIndex(e){return ge(this.indexSet_,e.toString())}addIndex(e,t){Y(e!==ki,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const n=[];let i=!1;const r=t.getIterator(vi.Wrap);let s,o=r.getNext();for(;o;)i=i||e.isDefinedOn(o.node),n.push(o),o=r.getNext();s=i?Bi(n,e.getCompare()):zi;const a=e.toString(),l=Object.assign({},this.indexSet_);l[a]=e;const c=Object.assign({},this.indexes_);return c[a]=s,new Ui(c,l)}addToIndexes(e,t){const n=be(this.indexes_,((n,i)=>{const r=ye(this.indexSet_,i);if(Y(r,"Missing index implementation for "+i),n===zi){if(r.isDefinedOn(e.node)){const n=[],i=t.getIterator(vi.Wrap);let s=i.getNext();for(;s;)s.name!==e.name&&n.push(s),s=i.getNext();return n.push(e),Bi(n,r.getCompare())}return zi}{const i=t.get(e.name);let r=n;return i&&(r=r.remove(new vi(e.name,i))),r.insert(e,e.node)}}));return new Ui(n,this.indexSet_)}removeFromIndexes(e,t){const n=be(this.indexes_,(n=>{if(n===zi)return n;{const i=t.get(e.name);return i?n.remove(new vi(e.name,i)):n}}));return new Ui(n,this.indexSet_)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Wi;class $i{constructor(e,t,n){this.children_=e,this.priorityNode_=t,this.indexMap_=n,this.lazyHash_=null,this.priorityNode_&&Ri(this.priorityNode_),this.children_.isEmpty()&&Y(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}static get EMPTY_NODE(){return Wi||(Wi=new $i(new Si(Ii),null,Ui.Default))}isLeafNode(){return!1}getPriority(){return this.priorityNode_||Wi}updatePriority(e){return this.children_.isEmpty()?this:new $i(this.children_,e,this.indexMap_)}getImmediateChild(e){if(".priority"===e)return this.getPriority();{const t=this.children_.get(e);return null===t?Wi:t}}getChild(e){const t=ti(e);return null===t?this:this.getImmediateChild(t).getChild(ii(e))}hasChild(e){return null!==this.children_.get(e)}updateImmediateChild(e,t){if(Y(t,"We should always be passing snapshot nodes"),".priority"===e)return this.updatePriority(t);{const n=new vi(e,t);let i,r;t.isEmpty()?(i=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(n,this.children_)):(i=this.children_.insert(e,t),r=this.indexMap_.addToIndexes(n,this.children_));const s=i.isEmpty()?Wi:this.priorityNode_;return new $i(i,s,r)}}updateChild(e,t){const n=ti(e);if(null===n)return t;{Y(".priority"!==ti(e)||1===ni(e),".priority must be the last token in a path");const i=this.getImmediateChild(n).updateChild(ii(e),t);return this.updateImmediateChild(n,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let n=0,i=0,r=!0;if(this.forEachChild(Fi,((s,o)=>{t[s]=o.val(e),n++,r&&$i.INTEGER_REGEXP_.test(s)?i=Math.max(i,Number(s)):r=!1})),!e&&r&&i<2*n){const e=[];for(const n in t)e[n]=t[n];return e}return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(null===this.lazyHash_){let e="";this.getPriority().isEmpty()||(e+="priority:"+Pi(this.getPriority().val())+":"),this.forEachChild(Fi,((t,n)=>{const i=n.hash();""!==i&&(e+=":"+t+":"+i)})),this.lazyHash_=""===e?"":nn(e)}return this.lazyHash_}getPredecessorChildName(e,t,n){const i=this.resolveIndex_(n);if(i){const n=i.getPredecessorKey(new vi(e,t));return n?n.name:null}return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const e=t.minKey();return e&&e.name}return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new vi(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const e=t.maxKey();return e&&e.name}return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new vi(t,this.children_.get(t)):null}forEachChild(e,t){const n=this.resolveIndex_(e);return n?n.inorderTraversal((e=>t(e.name,e.node))):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const n=this.resolveIndex_(t);if(n)return n.getIteratorFrom(e,(e=>e));{const n=this.children_.getIteratorFrom(e.name,vi.Wrap);let i=n.peek();for(;null!=i&&t.compare(i,e)<0;)n.getNext(),i=n.peek();return n}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const n=this.resolveIndex_(t);if(n)return n.getReverseIteratorFrom(e,(e=>e));{const n=this.children_.getReverseIteratorFrom(e.name,vi.Wrap);let i=n.peek();for(;null!=i&&t.compare(i,e)>0;)n.getNext(),i=n.peek();return n}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===Hi?-1:0}withIndex(e){if(e===ki||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new $i(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===ki||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority())){if(this.children_.count()===t.children_.count()){const e=this.getIterator(Fi),n=t.getIterator(Fi);let i=e.getNext(),r=n.getNext();for(;i&&r;){if(i.name!==r.name||!i.node.equals(r.node))return!1;i=e.getNext(),r=n.getNext()}return null===i&&null===r}return!1}return!1}}resolveIndex_(e){return e===ki?null:this.indexMap_.get(e.toString())}}$i.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;const Hi=new class extends $i{constructor(){super(new Si(Ii),$i.EMPTY_NODE,Ui.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return $i.EMPTY_NODE}isEmpty(){return!1}};Object.defineProperties(vi,{MIN:{value:new vi(fn,$i.EMPTY_NODE)},MAX:{value:new vi(_n,Hi)}}),Ci.__EMPTY_NODE=$i.EMPTY_NODE,Oi.__childrenNodeConstructor=$i,Ni=Hi,function(e){Li=e}(Hi);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Vi=!0;function Gi(e,t=null){if(null===e)return $i.EMPTY_NODE;if("object"==typeof e&&".priority"in e&&(t=e[".priority"]),Y(null===t||"string"==typeof t||"number"==typeof t||"object"==typeof t&&".sv"in t,"Invalid priority type found: "+typeof t),"object"==typeof e&&".value"in e&&null!==e[".value"]&&(e=e[".value"]),"object"!=typeof e||".sv"in e){return new Oi(e,Gi(t))}if(e instanceof Array||!Vi){let n=$i.EMPTY_NODE;return wn(e,((t,i)=>{if(ge(e,t)&&"."!==t.substring(0,1)){const e=Gi(i);!e.isLeafNode()&&e.isEmpty()||(n=n.updateImmediateChild(t,e))}})),n.updatePriority(Gi(t))}{const n=[];let i=!1;if(wn(e,((e,t)=>{if("."!==e.substring(0,1)){const r=Gi(t);r.isEmpty()||(i=i||!r.getPriority().isEmpty(),n.push(new vi(e,r)))}})),0===n.length)return $i.EMPTY_NODE;const r=Bi(n,xi,(e=>e.name),Ii);if(i){const e=Bi(n,Fi.getCompare());return new $i(r,Gi(t),new Ui({".priority":e},{".priority":Fi}))}return new $i(r,Gi(t),Ui.Default)}}!function(e){Di=e}(Gi);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ji extends bi{constructor(e){super(),this.indexPath_=e,Y(!li(e)&&".priority"!==ti(e),"Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const n=this.extractChild(e.node),i=this.extractChild(t.node),r=n.compareTo(i);return 0===r?mn(e.name,t.name):r}makePost(e,t){const n=Gi(e),i=$i.EMPTY_NODE.updateChild(this.indexPath_,n);return new vi(t,i)}maxPost(){const e=$i.EMPTY_NODE.updateChild(this.indexPath_,Hi);return new vi(_n,e)}toString(){return si(this.indexPath_,0).join("/")}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qi=new class extends bi{compare(e,t){const n=e.node.compareTo(t.node);return 0===n?mn(e.name,t.name):n}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return vi.MIN}maxPost(){return vi.MAX}makePost(e,t){const n=Gi(e);return new vi(t,n)}toString(){return".value"}};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yi(e){return{type:"value",snapshotNode:e}}function Ki(e,t){return{type:"child_added",snapshotNode:t,childName:e}}function Xi(e,t){return{type:"child_removed",snapshotNode:t,childName:e}}function Zi(e,t,n){return{type:"child_changed",snapshotNode:t,childName:e,oldSnap:n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class er{constructor(e){this.index_=e}updateChild(e,t,n,i,r,s){Y(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const o=e.getImmediateChild(t);return o.getChild(i).equals(n.getChild(i))&&o.isEmpty()===n.isEmpty()?e:(null!=s&&(n.isEmpty()?e.hasChild(t)?s.trackChildChange(Xi(t,o)):Y(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):o.isEmpty()?s.trackChildChange(Ki(t,n)):s.trackChildChange(Zi(t,n,o))),e.isLeafNode()&&n.isEmpty()?e:e.updateImmediateChild(t,n).withIndex(this.index_))}updateFullNode(e,t,n){return null!=n&&(e.isLeafNode()||e.forEachChild(Fi,((e,i)=>{t.hasChild(e)||n.trackChildChange(Xi(e,i))})),t.isLeafNode()||t.forEachChild(Fi,((t,i)=>{if(e.hasChild(t)){const r=e.getImmediateChild(t);r.equals(i)||n.trackChildChange(Zi(t,i,r))}else n.trackChildChange(Ki(t,i))}))),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?$i.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tr{constructor(e){this.indexedFilter_=new er(e.getIndex()),this.index_=e.getIndex(),this.startPost_=tr.getStartPost_(e),this.endPost_=tr.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,n=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&n}updateChild(e,t,n,i,r,s){return this.matches(new vi(t,n))||(n=$i.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,n,i,r,s)}updateFullNode(e,t,n){t.isLeafNode()&&(t=$i.EMPTY_NODE);let i=t.withIndex(this.index_);i=i.updatePriority($i.EMPTY_NODE);const r=this;return t.forEachChild(Fi,((e,t)=>{r.matches(new vi(e,t))||(i=i.updateImmediateChild(e,$i.EMPTY_NODE))})),this.indexedFilter_.updateFullNode(e,i,n)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}return e.getIndex().maxPost()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nr{constructor(e){this.withinDirectionalStart=e=>this.reverse_?this.withinEndPost(e):this.withinStartPost(e),this.withinDirectionalEnd=e=>this.reverse_?this.withinStartPost(e):this.withinEndPost(e),this.withinStartPost=e=>{const t=this.index_.compare(this.rangedFilter_.getStartPost(),e);return this.startIsInclusive_?t<=0:t<0},this.withinEndPost=e=>{const t=this.index_.compare(e,this.rangedFilter_.getEndPost());return this.endIsInclusive_?t<=0:t<0},this.rangedFilter_=new tr(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,n,i,r,s){return this.rangedFilter_.matches(new vi(t,n))||(n=$i.EMPTY_NODE),e.getImmediateChild(t).equals(n)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,n,i,r,s):this.fullLimitUpdateChild_(e,t,n,r,s)}updateFullNode(e,t,n){let i;if(t.isLeafNode()||t.isEmpty())i=$i.EMPTY_NODE.withIndex(this.index_);else if(2*this.limit_<t.numChildren()&&t.isIndexed(this.index_)){let e;i=$i.EMPTY_NODE.withIndex(this.index_),e=this.reverse_?t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let n=0;for(;e.hasNext()&&n<this.limit_;){const t=e.getNext();if(this.withinDirectionalStart(t)){if(!this.withinDirectionalEnd(t))break;i=i.updateImmediateChild(t.name,t.node),n++}}}else{let e;i=t.withIndex(this.index_),i=i.updatePriority($i.EMPTY_NODE),e=this.reverse_?i.getReverseIterator(this.index_):i.getIterator(this.index_);let n=0;for(;e.hasNext();){const t=e.getNext();n<this.limit_&&this.withinDirectionalStart(t)&&this.withinDirectionalEnd(t)?n++:i=i.updateImmediateChild(t.name,$i.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,i,n)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,n,i,r){let s;if(this.reverse_){const e=this.index_.getCompare();s=(t,n)=>e(n,t)}else s=this.index_.getCompare();const o=e;Y(o.numChildren()===this.limit_,"");const a=new vi(t,n),l=this.reverse_?o.getFirstChild(this.index_):o.getLastChild(this.index_),c=this.rangedFilter_.matches(a);if(o.hasChild(t)){const e=o.getImmediateChild(t);let h=i.getChildAfterChild(this.index_,l,this.reverse_);for(;null!=h&&(h.name===t||o.hasChild(h.name));)h=i.getChildAfterChild(this.index_,h,this.reverse_);const u=null==h?1:s(h,a);if(c&&!n.isEmpty()&&u>=0)return null!=r&&r.trackChildChange(Zi(t,n,e)),o.updateImmediateChild(t,n);{null!=r&&r.trackChildChange(Xi(t,e));const n=o.updateImmediateChild(t,$i.EMPTY_NODE);return null!=h&&this.rangedFilter_.matches(h)?(null!=r&&r.trackChildChange(Ki(h.name,h.node)),n.updateImmediateChild(h.name,h.node)):n}}return n.isEmpty()?e:c&&s(l,a)>=0?(null!=r&&(r.trackChildChange(Xi(l.name,l.node)),r.trackChildChange(Ki(t,n))),o.updateImmediateChild(t,n).updateImmediateChild(l.name,$i.EMPTY_NODE)):e}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ir{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=Fi}hasStart(){return this.startSet_}isViewFromLeft(){return""===this.viewFrom_?this.startSet_:"l"===this.viewFrom_}getIndexStartValue(){return Y(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return Y(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:fn}hasEnd(){return this.endSet_}getIndexEndValue(){return Y(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return Y(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:_n}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&""!==this.viewFrom_}getLimit(){return Y(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===Fi}copy(){const e=new ir;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function rr(e,t,n){const i=e.copy();return i.startSet_=!0,void 0===t&&(t=null),i.indexStartValue_=t,null!=n?(i.startNameSet_=!0,i.indexStartName_=n):(i.startNameSet_=!1,i.indexStartName_=""),i}function sr(e,t,n){const i=e.copy();return i.endSet_=!0,void 0===t&&(t=null),i.indexEndValue_=t,void 0!==n?(i.endNameSet_=!0,i.indexEndName_=n):(i.endNameSet_=!1,i.indexEndName_=""),i}function or(e,t){const n=e.copy();return n.index_=t,n}function ar(e){const t={};if(e.isDefault())return t;let n;if(e.index_===Fi?n="$priority":e.index_===Qi?n="$value":e.index_===ki?n="$key":(Y(e.index_ instanceof Ji,"Unrecognized index type!"),n=e.index_.toString()),t.orderBy=_e(n),e.startSet_){const n=e.startAfterSet_?"startAfter":"startAt";t[n]=_e(e.indexStartValue_),e.startNameSet_&&(t[n]+=","+_e(e.indexStartName_))}if(e.endSet_){const n=e.endBeforeSet_?"endBefore":"endAt";t[n]=_e(e.indexEndValue_),e.endNameSet_&&(t[n]+=","+_e(e.indexEndName_))}return e.limitSet_&&(e.isViewFromLeft()?t.limitToFirst=e.limit_:t.limitToLast=e.limit_),t}function lr(e){const t={};if(e.startSet_&&(t.sp=e.indexStartValue_,e.startNameSet_&&(t.sn=e.indexStartName_),t.sin=!e.startAfterSet_),e.endSet_&&(t.ep=e.indexEndValue_,e.endNameSet_&&(t.en=e.indexEndName_),t.ein=!e.endBeforeSet_),e.limitSet_){t.l=e.limit_;let n=e.viewFrom_;""===n&&(n=e.isViewFromLeft()?"l":"r"),t.vf=n}return e.index_!==Fi&&(t.i=e.index_.toString()),t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cr extends Jn{constructor(e,t,n,i){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=n,this.appCheckTokenProvider_=i,this.log_=cn("p:rest:"),this.listens_={}}reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return void 0!==t?"tag$"+t:(Y(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}listen(e,t,n,i){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const s=cr.getListenId_(e,n),o={};this.listens_[s]=o;const a=ar(e._queryParams);this.restRequest_(r+".json",a,((e,t)=>{let a=t;if(404===e&&(a=null,e=null),null===e&&this.onDataUpdate_(r,a,!1,n),ye(this.listens_,s)===o){let t;t=e?401===e?"permission_denied":"rest_error:"+e:"ok",i(t,null)}}))}unlisten(e,t){const n=cr.getListenId_(e,t);delete this.listens_[n]}get(e){const t=ar(e._queryParams),n=e._path.toString(),i=new le;return this.restRequest_(n+".json",t,((e,t)=>{let r=t;404===e&&(r=null,e=null),null===e?(this.onDataUpdate_(n,r,!1,null),i.resolve(r)):i.reject(new Error(r))})),i.promise}refreshAuthToken(e){}restRequest_(e,t={},n){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then((([i,r])=>{i&&i.accessToken&&(t.auth=i.accessToken),r&&r.token&&(t.ac=r.token);const s=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+function(e){const t=[];for(const[n,i]of Object.entries(e))Array.isArray(i)?i.forEach((e=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(e))})):t.push(encodeURIComponent(n)+"="+encodeURIComponent(i));return t.length?"&"+t.join("&"):""}(t);this.log_("Sending REST request for "+s);const o=new XMLHttpRequest;o.onreadystatechange=()=>{if(n&&4===o.readyState){this.log_("REST Response for "+s+" received. status:",o.status,"response:",o.responseText);let e=null;if(o.status>=200&&o.status<300){try{e=fe(o.responseText)}catch(e){dn("Failed to parse JSON response for "+s+": "+o.responseText)}n(null,e)}else 401!==o.status&&404!==o.status&&dn("Got unsuccessful REST response for "+s+" Status: "+o.status),n(o.status);n=null}},o.open("GET",s,!0),o.send()}))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hr{constructor(){this.rootNode_=$i.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ur(){return{value:null,children:new Map}}function dr(e,t,n){if(li(t))e.value=n,e.children.clear();else if(null!==e.value)e.value=e.value.updateChild(t,n);else{const i=ti(t);e.children.has(i)||e.children.set(i,ur());dr(e.children.get(i),t=ii(t),n)}}function pr(e,t){if(li(t))return e.value=null,e.children.clear(),!0;if(null!==e.value){if(e.value.isLeafNode())return!1;{const n=e.value;return e.value=null,n.forEachChild(Fi,((t,n)=>{dr(e,new Zn(t),n)})),pr(e,t)}}if(e.children.size>0){const n=ti(t);if(t=ii(t),e.children.has(n)){pr(e.children.get(n),t)&&e.children.delete(n)}return 0===e.children.size}return!0}function fr(e,t,n){null!==e.value?n(t,e.value):function(e,t){e.children.forEach(((e,n)=>{t(n,e)}))}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,((e,i)=>{fr(i,new Zn(t.toString()+"/"+e),n)}))}class _r{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t=Object.assign({},e);return this.last_&&wn(this.last_,((e,n)=>{t[e]=t[e]-n})),this.last_=e,t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new _r(e);const n=1e4+2e4*Math.random();Sn(this.reportStats_.bind(this),Math.floor(n))}reportStats_(){const e=this.statsListener_.get(),t={};let n=!1;wn(e,((e,i)=>{i>0&&ge(this.statsToReport_,e)&&(t[e]=i,n=!0)})),n&&this.server_.reportStats(t),Sn(this.reportStats_.bind(this),Math.floor(2*Math.random()*3e5))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var gr;function yr(e){return{fromUser:!1,fromServer:!0,queryId:e,tagged:!0}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */!function(e){e[e.OVERWRITE=0]="OVERWRITE",e[e.MERGE=1]="MERGE",e[e.ACK_USER_WRITE=2]="ACK_USER_WRITE",e[e.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"}(gr||(gr={}));class vr{constructor(e,t,n){this.path=e,this.affectedTree=t,this.revert=n,this.type=gr.ACK_USER_WRITE,this.source={fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}operationForChild(e){if(li(this.path)){if(null!=this.affectedTree.value)return Y(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new Zn(e));return new vr(ei(),t,this.revert)}}return Y(ti(this.path)===e,"operationForChild called for unrelated child."),new vr(ii(this.path),this.affectedTree,this.revert)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class br{constructor(e,t){this.source=e,this.path=t,this.type=gr.LISTEN_COMPLETE}operationForChild(e){return li(this.path)?new br(this.source,ei()):new br(this.source,ii(this.path))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wr{constructor(e,t,n){this.source=e,this.path=t,this.snap=n,this.type=gr.OVERWRITE}operationForChild(e){return li(this.path)?new wr(this.source,ei(),this.snap.getImmediateChild(e)):new wr(this.source,ii(this.path),this.snap)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cr{constructor(e,t,n){this.source=e,this.path=t,this.children=n,this.type=gr.MERGE}operationForChild(e){if(li(this.path)){const t=this.children.subtree(new Zn(e));return t.isEmpty()?null:t.value?new wr(this.source,ei(),t.value):new Cr(this.source,ei(),t)}return Y(ti(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new Cr(this.source,ii(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kr{constructor(e,t,n){this.node_=e,this.fullyInitialized_=t,this.filtered_=n}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(li(e))return this.isFullyInitialized()&&!this.filtered_;const t=ti(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tr{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function Er(e,t,n,i,r,s){const o=i.filter((e=>e.type===n));o.sort(((t,n)=>function(e,t,n){if(null==t.childName||null==n.childName)throw K("Should only compare child_ events.");const i=new vi(t.childName,t.snapshotNode),r=new vi(n.childName,n.snapshotNode);return e.index_.compare(i,r)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,t,n))),o.forEach((n=>{const i=function(e,t,n){return"value"===t.type||"child_removed"===t.type||(t.prevName=n.getPredecessorChildName(t.childName,t.snapshotNode,e.index_)),t}(e,n,s);r.forEach((r=>{r.respondsTo(n.type)&&t.push(r.createEvent(i,e.query_))}))}))}function Sr(e,t){return{eventCache:e,serverCache:t}}function xr(e,t,n,i){return Sr(new kr(t,n,i),e.serverCache)}function Ir(e,t,n,i){return Sr(e.eventCache,new kr(t,n,i))}function Nr(e){return e.eventCache.isFullyInitialized()?e.eventCache.getNode():null}function Pr(e){return e.serverCache.isFullyInitialized()?e.serverCache.getNode():null}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Rr;class Ar{constructor(e,t=(()=>(Rr||(Rr=new Si(gn)),Rr))()){this.value=e,this.children=t}static fromObject(e){let t=new Ar(null);return wn(e,((e,n)=>{t=t.set(new Zn(e),n)})),t}isEmpty(){return null===this.value&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(null!=this.value&&t(this.value))return{path:ei(),value:this.value};if(li(e))return null;{const n=ti(e),i=this.children.get(n);if(null!==i){const r=i.findRootMostMatchingPathAndValue(ii(e),t);if(null!=r){return{path:ai(new Zn(n),r.path),value:r.value}}return null}return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,(()=>!0))}subtree(e){if(li(e))return this;{const t=ti(e),n=this.children.get(t);return null!==n?n.subtree(ii(e)):new Ar(null)}}set(e,t){if(li(e))return new Ar(t,this.children);{const n=ti(e),i=(this.children.get(n)||new Ar(null)).set(ii(e),t),r=this.children.insert(n,i);return new Ar(this.value,r)}}remove(e){if(li(e))return this.children.isEmpty()?new Ar(null):new Ar(null,this.children);{const t=ti(e),n=this.children.get(t);if(n){const i=n.remove(ii(e));let r;return r=i.isEmpty()?this.children.remove(t):this.children.insert(t,i),null===this.value&&r.isEmpty()?new Ar(null):new Ar(this.value,r)}return this}}get(e){if(li(e))return this.value;{const t=ti(e),n=this.children.get(t);return n?n.get(ii(e)):null}}setTree(e,t){if(li(e))return t;{const n=ti(e),i=(this.children.get(n)||new Ar(null)).setTree(ii(e),t);let r;return r=i.isEmpty()?this.children.remove(n):this.children.insert(n,i),new Ar(this.value,r)}}fold(e){return this.fold_(ei(),e)}fold_(e,t){const n={};return this.children.inorderTraversal(((i,r)=>{n[i]=r.fold_(ai(e,i),t)})),t(e,this.value,n)}findOnPath(e,t){return this.findOnPath_(e,ei(),t)}findOnPath_(e,t,n){const i=!!this.value&&n(t,this.value);if(i)return i;if(li(e))return null;{const i=ti(e),r=this.children.get(i);return r?r.findOnPath_(ii(e),ai(t,i),n):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,ei(),t)}foreachOnPath_(e,t,n){if(li(e))return this;{this.value&&n(t,this.value);const i=ti(e),r=this.children.get(i);return r?r.foreachOnPath_(ii(e),ai(t,i),n):new Ar(null)}}foreach(e){this.foreach_(ei(),e)}foreach_(e,t){this.children.inorderTraversal(((n,i)=>{i.foreach_(ai(e,n),t)})),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal(((t,n)=>{n.value&&e(t,n.value)}))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dr{constructor(e){this.writeTree_=e}static empty(){return new Dr(new Ar(null))}}function Lr(e,t,n){if(li(t))return new Dr(new Ar(n));{const i=e.writeTree_.findRootMostValueAndPath(t);if(null!=i){const r=i.path;let s=i.value;const o=ci(r,t);return s=s.updateChild(o,n),new Dr(e.writeTree_.set(r,s))}{const i=new Ar(n),r=e.writeTree_.setTree(t,i);return new Dr(r)}}}function Or(e,t,n){let i=e;return wn(n,((e,n)=>{i=Lr(i,ai(t,e),n)})),i}function Fr(e,t){if(li(t))return Dr.empty();{const n=e.writeTree_.setTree(t,new Ar(null));return new Dr(n)}}function Mr(e,t){return null!=jr(e,t)}function jr(e,t){const n=e.writeTree_.findRootMostValueAndPath(t);return null!=n?e.writeTree_.get(n.path).getChild(ci(n.path,t)):null}function Br(e){const t=[],n=e.writeTree_.value;return null!=n?n.isLeafNode()||n.forEachChild(Fi,((e,n)=>{t.push(new vi(e,n))})):e.writeTree_.children.inorderTraversal(((e,n)=>{null!=n.value&&t.push(new vi(e,n.value))})),t}function qr(e,t){if(li(t))return e;{const n=jr(e,t);return new Dr(null!=n?new Ar(n):e.writeTree_.subtree(t))}}function zr(e){return e.writeTree_.isEmpty()}function Ur(e,t){return Wr(ei(),e.writeTree_,t)}function Wr(e,t,n){if(null!=t.value)return n.updateChild(e,t.value);{let i=null;return t.children.inorderTraversal(((t,r)=>{".priority"===t?(Y(null!==r.value,"Priority writes must always be leaf nodes"),i=r.value):n=Wr(ai(e,t),r,n)})),n.getChild(e).isEmpty()||null===i||(n=n.updateChild(ai(e,".priority"),i)),n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $r(e,t){return is(t,e)}function Hr(e,t){const n=e.allWrites.findIndex((e=>e.writeId===t));Y(n>=0,"removeWrite called with nonexistent writeId.");const i=e.allWrites[n];e.allWrites.splice(n,1);let r=i.visible,s=!1,o=e.allWrites.length-1;for(;r&&o>=0;){const t=e.allWrites[o];t.visible&&(o>=n&&Vr(t,i.path)?r=!1:di(i.path,t.path)&&(s=!0)),o--}if(r){if(s)return function(e){e.visibleWrites=Jr(e.allWrites,Gr,ei()),e.allWrites.length>0?e.lastWriteId=e.allWrites[e.allWrites.length-1].writeId:e.lastWriteId=-1}(e),!0;if(i.snap)e.visibleWrites=Fr(e.visibleWrites,i.path);else{wn(i.children,(t=>{e.visibleWrites=Fr(e.visibleWrites,ai(i.path,t))}))}return!0}return!1}function Vr(e,t){if(e.snap)return di(e.path,t);for(const n in e.children)if(e.children.hasOwnProperty(n)&&di(ai(e.path,n),t))return!0;return!1}function Gr(e){return e.visible}function Jr(e,t,n){let i=Dr.empty();for(let r=0;r<e.length;++r){const s=e[r];if(t(s)){const e=s.path;let t;if(s.snap)di(n,e)?(t=ci(n,e),i=Lr(i,t,s.snap)):di(e,n)&&(t=ci(e,n),i=Lr(i,ei(),s.snap.getChild(t)));else{if(!s.children)throw K("WriteRecord should have .snap or .children");if(di(n,e))t=ci(n,e),i=Or(i,t,s.children);else if(di(e,n))if(t=ci(e,n),li(t))i=Or(i,ei(),s.children);else{const e=ye(s.children,ti(t));if(e){const n=e.getChild(ii(t));i=Lr(i,ei(),n)}}}}}return i}function Qr(e,t,n,i,r){if(i||r){const s=qr(e.visibleWrites,t);if(!r&&zr(s))return n;if(r||null!=n||Mr(s,ei())){const s=function(e){return(e.visible||r)&&(!i||!~i.indexOf(e.writeId))&&(di(e.path,t)||di(t,e.path))};return Ur(Jr(e.allWrites,s,t),n||$i.EMPTY_NODE)}return null}{const i=jr(e.visibleWrites,t);if(null!=i)return i;{const i=qr(e.visibleWrites,t);if(zr(i))return n;if(null!=n||Mr(i,ei())){return Ur(i,n||$i.EMPTY_NODE)}return null}}}function Yr(e,t,n,i){return Qr(e.writeTree,e.treePath,t,n,i)}function Kr(e,t){return function(e,t,n){let i=$i.EMPTY_NODE;const r=jr(e.visibleWrites,t);if(r)return r.isLeafNode()||r.forEachChild(Fi,((e,t)=>{i=i.updateImmediateChild(e,t)})),i;if(n){const r=qr(e.visibleWrites,t);return n.forEachChild(Fi,((e,t)=>{const n=Ur(qr(r,new Zn(e)),t);i=i.updateImmediateChild(e,n)})),Br(r).forEach((e=>{i=i.updateImmediateChild(e.name,e.node)})),i}return Br(qr(e.visibleWrites,t)).forEach((e=>{i=i.updateImmediateChild(e.name,e.node)})),i}(e.writeTree,e.treePath,t)}function Xr(e,t,n,i){return function(e,t,n,i,r){Y(i||r,"Either existingEventSnap or existingServerSnap must exist");const s=ai(t,n);if(Mr(e.visibleWrites,s))return null;{const t=qr(e.visibleWrites,s);return zr(t)?r.getChild(n):Ur(t,r.getChild(n))}}(e.writeTree,e.treePath,t,n,i)}function Zr(e,t){return function(e,t){return jr(e.visibleWrites,t)}(e.writeTree,ai(e.treePath,t))}function es(e,t,n,i,r,s){return function(e,t,n,i,r,s,o){let a;const l=qr(e.visibleWrites,t),c=jr(l,ei());if(null!=c)a=c;else{if(null==n)return[];a=Ur(l,n)}if(a=a.withIndex(o),a.isEmpty()||a.isLeafNode())return[];{const e=[],t=o.getCompare(),n=s?a.getReverseIteratorFrom(i,o):a.getIteratorFrom(i,o);let l=n.getNext();for(;l&&e.length<r;)0!==t(l,i)&&e.push(l),l=n.getNext();return e}}(e.writeTree,e.treePath,t,n,i,r,s)}function ts(e,t,n){return function(e,t,n,i){const r=ai(t,n),s=jr(e.visibleWrites,r);if(null!=s)return s;if(i.isCompleteForChild(n))return Ur(qr(e.visibleWrites,r),i.getNode().getImmediateChild(n));return null}(e.writeTree,e.treePath,t,n)}function ns(e,t){return is(ai(e.treePath,t),e.writeTree)}function is(e,t){return{treePath:e,writeTree:t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,n=e.childName;Y("child_added"===t||"child_changed"===t||"child_removed"===t,"Only child changes supported for tracking"),Y(".priority"!==n,"Only non-priority child changes can be tracked.");const i=this.changeMap.get(n);if(i){const r=i.type;if("child_added"===t&&"child_removed"===r)this.changeMap.set(n,Zi(n,e.snapshotNode,i.snapshotNode));else if("child_removed"===t&&"child_added"===r)this.changeMap.delete(n);else if("child_removed"===t&&"child_changed"===r)this.changeMap.set(n,Xi(n,i.oldSnap));else if("child_changed"===t&&"child_added"===r)this.changeMap.set(n,Ki(n,e.snapshotNode));else{if("child_changed"!==t||"child_changed"!==r)throw K("Illegal combination of changes: "+e+" occurred after "+i);this.changeMap.set(n,Zi(n,e.snapshotNode,i.oldSnap))}}else this.changeMap.set(n,e)}getChanges(){return Array.from(this.changeMap.values())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ss=new class{getCompleteChild(e){return null}getChildAfterChild(e,t,n){return null}};class os{constructor(e,t,n=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=n}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const t=null!=this.optCompleteServerCache_?new kr(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return ts(this.writes_,e,t)}}getChildAfterChild(e,t,n){const i=null!=this.optCompleteServerCache_?this.optCompleteServerCache_:Pr(this.viewCache_),r=es(this.writes_,i,t,1,n,e);return 0===r.length?null:r[0]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function as(e,t,n,i,r){const s=new rs;let o,a;if(n.type===gr.OVERWRITE){const l=n;l.source.fromUser?o=hs(e,t,l.path,l.snap,i,r,s):(Y(l.source.fromServer,"Unknown source."),a=l.source.tagged||t.serverCache.isFiltered()&&!li(l.path),o=cs(e,t,l.path,l.snap,i,r,a,s))}else if(n.type===gr.MERGE){const l=n;l.source.fromUser?o=function(e,t,n,i,r,s,o){let a=t;return i.foreach(((i,l)=>{const c=ai(n,i);us(t,ti(c))&&(a=hs(e,a,c,l,r,s,o))})),i.foreach(((i,l)=>{const c=ai(n,i);us(t,ti(c))||(a=hs(e,a,c,l,r,s,o))})),a}(e,t,l.path,l.children,i,r,s):(Y(l.source.fromServer,"Unknown source."),a=l.source.tagged||t.serverCache.isFiltered(),o=ps(e,t,l.path,l.children,i,r,a,s))}else if(n.type===gr.ACK_USER_WRITE){const a=n;o=a.revert?function(e,t,n,i,r,s){let o;if(null!=Zr(i,n))return t;{const a=new os(i,t,r),l=t.eventCache.getNode();let c;if(li(n)||".priority"===ti(n)){let n;if(t.serverCache.isFullyInitialized())n=Yr(i,Pr(t));else{const e=t.serverCache.getNode();Y(e instanceof $i,"serverChildren would be complete if leaf node"),n=Kr(i,e)}c=e.filter.updateFullNode(l,n,s)}else{const r=ti(n);let h=ts(i,r,t.serverCache);null==h&&t.serverCache.isCompleteForChild(r)&&(h=l.getImmediateChild(r)),c=null!=h?e.filter.updateChild(l,r,h,ii(n),a,s):t.eventCache.getNode().hasChild(r)?e.filter.updateChild(l,r,$i.EMPTY_NODE,ii(n),a,s):l,c.isEmpty()&&t.serverCache.isFullyInitialized()&&(o=Yr(i,Pr(t)),o.isLeafNode()&&(c=e.filter.updateFullNode(c,o,s)))}return o=t.serverCache.isFullyInitialized()||null!=Zr(i,ei()),xr(t,c,o,e.filter.filtersNodes())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,t,a.path,i,r,s):function(e,t,n,i,r,s,o){if(null!=Zr(r,n))return t;const a=t.serverCache.isFiltered(),l=t.serverCache;if(null!=i.value){if(li(n)&&l.isFullyInitialized()||l.isCompleteForPath(n))return cs(e,t,n,l.getNode().getChild(n),r,s,a,o);if(li(n)){let i=new Ar(null);return l.getNode().forEachChild(ki,((e,t)=>{i=i.set(new Zn(e),t)})),ps(e,t,n,i,r,s,a,o)}return t}{let c=new Ar(null);return i.foreach(((e,t)=>{const i=ai(n,e);l.isCompleteForPath(i)&&(c=c.set(e,l.getNode().getChild(i)))})),ps(e,t,n,c,r,s,a,o)}}(e,t,a.path,a.affectedTree,i,r,s)}else{if(n.type!==gr.LISTEN_COMPLETE)throw K("Unknown operation type: "+n.type);o=function(e,t,n,i,r){const s=t.serverCache,o=Ir(t,s.getNode(),s.isFullyInitialized()||li(n),s.isFiltered());return ls(e,o,n,i,ss,r)}(e,t,n.path,i,s)}const l=s.getChanges();return function(e,t,n){const i=t.eventCache;if(i.isFullyInitialized()){const r=i.getNode().isLeafNode()||i.getNode().isEmpty(),s=Nr(e);(n.length>0||!e.eventCache.isFullyInitialized()||r&&!i.getNode().equals(s)||!i.getNode().getPriority().equals(s.getPriority()))&&n.push(Yi(Nr(t)))}}(t,o,l),{viewCache:o,changes:l}}function ls(e,t,n,i,r,s){const o=t.eventCache;if(null!=Zr(i,n))return t;{let a,l;if(li(n))if(Y(t.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),t.serverCache.isFiltered()){const n=Pr(t),r=Kr(i,n instanceof $i?n:$i.EMPTY_NODE);a=e.filter.updateFullNode(t.eventCache.getNode(),r,s)}else{const n=Yr(i,Pr(t));a=e.filter.updateFullNode(t.eventCache.getNode(),n,s)}else{const c=ti(n);if(".priority"===c){Y(1===ni(n),"Can't have a priority with additional path components");const r=o.getNode();l=t.serverCache.getNode();const s=Xr(i,n,r,l);a=null!=s?e.filter.updatePriority(r,s):o.getNode()}else{const h=ii(n);let u;if(o.isCompleteForChild(c)){l=t.serverCache.getNode();const e=Xr(i,n,o.getNode(),l);u=null!=e?o.getNode().getImmediateChild(c).updateChild(h,e):o.getNode().getImmediateChild(c)}else u=ts(i,c,t.serverCache);a=null!=u?e.filter.updateChild(o.getNode(),c,u,h,r,s):o.getNode()}}return xr(t,a,o.isFullyInitialized()||li(n),e.filter.filtersNodes())}}function cs(e,t,n,i,r,s,o,a){const l=t.serverCache;let c;const h=o?e.filter:e.filter.getIndexedFilter();if(li(n))c=h.updateFullNode(l.getNode(),i,null);else if(h.filtersNodes()&&!l.isFiltered()){const e=l.getNode().updateChild(n,i);c=h.updateFullNode(l.getNode(),e,null)}else{const e=ti(n);if(!l.isCompleteForPath(n)&&ni(n)>1)return t;const r=ii(n),s=l.getNode().getImmediateChild(e).updateChild(r,i);c=".priority"===e?h.updatePriority(l.getNode(),s):h.updateChild(l.getNode(),e,s,r,ss,null)}const u=Ir(t,c,l.isFullyInitialized()||li(n),h.filtersNodes());return ls(e,u,n,r,new os(r,u,s),a)}function hs(e,t,n,i,r,s,o){const a=t.eventCache;let l,c;const h=new os(r,t,s);if(li(n))c=e.filter.updateFullNode(t.eventCache.getNode(),i,o),l=xr(t,c,!0,e.filter.filtersNodes());else{const r=ti(n);if(".priority"===r)c=e.filter.updatePriority(t.eventCache.getNode(),i),l=xr(t,c,a.isFullyInitialized(),a.isFiltered());else{const s=ii(n),c=a.getNode().getImmediateChild(r);let u;if(li(s))u=i;else{const e=h.getCompleteChild(r);u=null!=e?".priority"===ri(s)&&e.getChild(oi(s)).isEmpty()?e:e.updateChild(s,i):$i.EMPTY_NODE}if(c.equals(u))l=t;else{l=xr(t,e.filter.updateChild(a.getNode(),r,u,s,h,o),a.isFullyInitialized(),e.filter.filtersNodes())}}}return l}function us(e,t){return e.eventCache.isCompleteForChild(t)}function ds(e,t,n){return n.foreach(((e,n)=>{t=t.updateChild(e,n)})),t}function ps(e,t,n,i,r,s,o,a){if(t.serverCache.getNode().isEmpty()&&!t.serverCache.isFullyInitialized())return t;let l,c=t;l=li(n)?i:new Ar(null).setTree(n,i);const h=t.serverCache.getNode();return l.children.inorderTraversal(((n,i)=>{if(h.hasChild(n)){const l=ds(0,t.serverCache.getNode().getImmediateChild(n),i);c=cs(e,c,new Zn(n),l,r,s,o,a)}})),l.children.inorderTraversal(((n,i)=>{const l=!t.serverCache.isCompleteForChild(n)&&null===i.value;if(!h.hasChild(n)&&!l){const l=ds(0,t.serverCache.getNode().getImmediateChild(n),i);c=cs(e,c,new Zn(n),l,r,s,o,a)}})),c}class fs{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const n=this.query_._queryParams,i=new er(n.getIndex()),r=(s=n).loadsAllData()?new er(s.getIndex()):s.hasLimit()?new nr(s):new tr(s);var s;this.processor_=function(e){return{filter:e}}(r);const o=t.serverCache,a=t.eventCache,l=i.updateFullNode($i.EMPTY_NODE,o.getNode(),null),c=r.updateFullNode($i.EMPTY_NODE,a.getNode(),null),h=new kr(l,o.isFullyInitialized(),i.filtersNodes()),u=new kr(c,a.isFullyInitialized(),r.filtersNodes());this.viewCache_=Sr(u,h),this.eventGenerator_=new Tr(this.query_)}get query(){return this.query_}}function _s(e,t){const n=Pr(e.viewCache_);return n&&(e.query._queryParams.loadsAllData()||!li(t)&&!n.getImmediateChild(ti(t)).isEmpty())?n.getChild(t):null}function ms(e){return 0===e.eventRegistrations_.length}function gs(e,t,n){const i=[];if(n){Y(null==t,"A cancel should cancel all event registrations.");const r=e.query._path;e.eventRegistrations_.forEach((e=>{const t=e.createCancelEvent(n,r);t&&i.push(t)}))}if(t){let n=[];for(let i=0;i<e.eventRegistrations_.length;++i){const r=e.eventRegistrations_[i];if(r.matches(t)){if(t.hasAnyCallback()){n=n.concat(e.eventRegistrations_.slice(i+1));break}}else n.push(r)}e.eventRegistrations_=n}else e.eventRegistrations_=[];return i}function ys(e,t,n,i){t.type===gr.MERGE&&null!==t.source.queryId&&(Y(Pr(e.viewCache_),"We should always have a full cache before handling merges"),Y(Nr(e.viewCache_),"Missing event cache, even though we have a server cache"));const r=e.viewCache_,s=as(e.processor_,r,t,n,i);var o,a;return o=e.processor_,a=s.viewCache,Y(a.eventCache.getNode().isIndexed(o.filter.getIndex()),"Event snap not indexed"),Y(a.serverCache.getNode().isIndexed(o.filter.getIndex()),"Server snap not indexed"),Y(s.viewCache.serverCache.isFullyInitialized()||!r.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),e.viewCache_=s.viewCache,vs(e,s.changes,s.viewCache.eventCache.getNode(),null)}function vs(e,t,n,i){const r=i?[i]:e.eventRegistrations_;return function(e,t,n,i){const r=[],s=[];return t.forEach((t=>{var n;"child_changed"===t.type&&e.index_.indexedValueChanged(t.oldSnap,t.snapshotNode)&&s.push((n=t.childName,{type:"child_moved",snapshotNode:t.snapshotNode,childName:n}))})),Er(e,r,"child_removed",t,i,n),Er(e,r,"child_added",t,i,n),Er(e,r,"child_moved",s,i,n),Er(e,r,"child_changed",t,i,n),Er(e,r,"value",t,i,n),r}(e.eventGenerator_,t,n,r)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let bs,ws;class Cs{constructor(){this.views=new Map}}function ks(e,t,n,i){const r=t.source.queryId;if(null!==r){const s=e.views.get(r);return Y(null!=s,"SyncTree gave us an op for an invalid query."),ys(s,t,n,i)}{let r=[];for(const s of e.views.values())r=r.concat(ys(s,t,n,i));return r}}function Ts(e,t,n,i,r){const s=t._queryIdentifier,o=e.views.get(s);if(!o){let e=Yr(n,r?i:null),s=!1;e?s=!0:i instanceof $i?(e=Kr(n,i),s=!1):(e=$i.EMPTY_NODE,s=!1);const o=Sr(new kr(e,s,!1),new kr(i,r,!1));return new fs(t,o)}return o}function Es(e,t,n,i,r,s){const o=Ts(e,t,i,r,s);return e.views.has(t._queryIdentifier)||e.views.set(t._queryIdentifier,o),function(e,t){e.eventRegistrations_.push(t)}(o,n),function(e,t){const n=e.viewCache_.eventCache,i=[];n.getNode().isLeafNode()||n.getNode().forEachChild(Fi,((e,t)=>{i.push(Ki(e,t))}));return n.isFullyInitialized()&&i.push(Yi(n.getNode())),vs(e,i,n.getNode(),t)}(o,n)}function Ss(e,t,n,i){const r=t._queryIdentifier,s=[];let o=[];const a=Rs(e);if("default"===r)for(const[t,r]of e.views.entries())o=o.concat(gs(r,n,i)),ms(r)&&(e.views.delete(t),r.query._queryParams.loadsAllData()||s.push(r.query));else{const t=e.views.get(r);t&&(o=o.concat(gs(t,n,i)),ms(t)&&(e.views.delete(r),t.query._queryParams.loadsAllData()||s.push(t.query)))}return a&&!Rs(e)&&s.push(new(Y(bs,"Reference.ts has not been loaded"),bs)(t._repo,t._path)),{removed:s,events:o}}function xs(e){const t=[];for(const n of e.views.values())n.query._queryParams.loadsAllData()||t.push(n);return t}function Is(e,t){let n=null;for(const i of e.views.values())n=n||_s(i,t);return n}function Ns(e,t){if(t._queryParams.loadsAllData())return As(e);{const n=t._queryIdentifier;return e.views.get(n)}}function Ps(e,t){return null!=Ns(e,t)}function Rs(e){return null!=As(e)}function As(e){for(const t of e.views.values())if(t.query._queryParams.loadsAllData())return t;return null}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ds=1;class Ls{constructor(e){this.listenProvider_=e,this.syncPointTree_=new Ar(null),this.pendingWriteTree_={visibleWrites:Dr.empty(),allWrites:[],lastWriteId:-1},this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function Os(e,t,n,i,r){return function(e,t,n,i,r){Y(i>e.lastWriteId,"Stacking an older write on top of newer ones"),void 0===r&&(r=!0),e.allWrites.push({path:t,snap:n,writeId:i,visible:r}),r&&(e.visibleWrites=Lr(e.visibleWrites,t,n)),e.lastWriteId=i}(e.pendingWriteTree_,t,n,i,r),r?$s(e,new wr({fromUser:!0,fromServer:!1,queryId:null,tagged:!1},t,n)):[]}function Fs(e,t,n,i){!function(e,t,n,i){Y(i>e.lastWriteId,"Stacking an older merge on top of newer ones"),e.allWrites.push({path:t,children:n,writeId:i,visible:!0}),e.visibleWrites=Or(e.visibleWrites,t,n),e.lastWriteId=i}(e.pendingWriteTree_,t,n,i);const r=Ar.fromObject(n);return $s(e,new Cr({fromUser:!0,fromServer:!1,queryId:null,tagged:!1},t,r))}function Ms(e,t,n=!1){const i=function(e,t){for(let n=0;n<e.allWrites.length;n++){const i=e.allWrites[n];if(i.writeId===t)return i}return null}(e.pendingWriteTree_,t);if(Hr(e.pendingWriteTree_,t)){let t=new Ar(null);return null!=i.snap?t=t.set(ei(),!0):wn(i.children,(e=>{t=t.set(new Zn(e),!0)})),$s(e,new vr(i.path,t,n))}return[]}function js(e,t,n){return $s(e,new wr({fromUser:!1,fromServer:!0,queryId:null,tagged:!1},t,n))}function Bs(e,t,n,i,r=!1){const s=t._path,o=e.syncPointTree_.get(s);let a=[];if(o&&("default"===t._queryIdentifier||Ps(o,t))){const l=Ss(o,t,n,i);0===o.views.size&&(e.syncPointTree_=e.syncPointTree_.remove(s));const c=l.removed;if(a=l.events,!r){const n=-1!==c.findIndex((e=>e._queryParams.loadsAllData())),r=e.syncPointTree_.findOnPath(s,((e,t)=>Rs(t)));if(n&&!r){const t=e.syncPointTree_.subtree(s);if(!t.isEmpty()){const n=function(e){return e.fold(((e,t,n)=>{if(t&&Rs(t)){return[As(t)]}{let e=[];return t&&(e=xs(t)),wn(n,((t,n)=>{e=e.concat(n)})),e}}))}(t);for(let t=0;t<n.length;++t){const i=n[t],r=i.query,s=Gs(e,i);e.listenProvider_.startListening(Zs(r),Js(e,r),s.hashFn,s.onComplete)}}}if(!r&&c.length>0&&!i)if(n){const n=null;e.listenProvider_.stopListening(Zs(t),n)}else c.forEach((t=>{const n=e.queryToTagMap.get(Qs(t));e.listenProvider_.stopListening(Zs(t),n)}))}!function(e,t){for(let n=0;n<t.length;++n){const i=t[n];if(!i._queryParams.loadsAllData()){const t=Qs(i),n=e.queryToTagMap.get(t);e.queryToTagMap.delete(t),e.tagToQueryMap.delete(n)}}}(e,c)}return a}function qs(e,t,n,i){const r=Ys(e,i);if(null!=r){const i=Ks(r),s=i.path,o=i.queryId,a=ci(s,t);return Xs(e,s,new wr(yr(o),a,n))}return[]}function zs(e,t,n,i=!1){const r=t._path;let s=null,o=!1;e.syncPointTree_.foreachOnPath(r,((e,t)=>{const n=ci(e,r);s=s||Is(t,n),o=o||Rs(t)}));let a,l=e.syncPointTree_.get(r);if(l?(o=o||Rs(l),s=s||Is(l,ei())):(l=new Cs,e.syncPointTree_=e.syncPointTree_.set(r,l)),null!=s)a=!0;else{a=!1,s=$i.EMPTY_NODE;e.syncPointTree_.subtree(r).foreachChild(((e,t)=>{const n=Is(t,ei());n&&(s=s.updateImmediateChild(e,n))}))}const c=Ps(l,t);if(!c&&!t._queryParams.loadsAllData()){const n=Qs(t);Y(!e.queryToTagMap.has(n),"View does not exist, but we have a tag");const i=Ds++;e.queryToTagMap.set(n,i),e.tagToQueryMap.set(i,n)}let h=Es(l,t,n,$r(e.pendingWriteTree_,r),s,a);if(!c&&!o&&!i){const n=Ns(l,t);h=h.concat(function(e,t,n){const i=t._path,r=Js(e,t),s=Gs(e,n),o=e.listenProvider_.startListening(Zs(t),r,s.hashFn,s.onComplete),a=e.syncPointTree_.subtree(i);if(r)Y(!Rs(a.value),"If we're adding a query, it shouldn't be shadowed");else{const t=a.fold(((e,t,n)=>{if(!li(e)&&t&&Rs(t))return[As(t).query];{let e=[];return t&&(e=e.concat(xs(t).map((e=>e.query)))),wn(n,((t,n)=>{e=e.concat(n)})),e}}));for(let n=0;n<t.length;++n){const i=t[n];e.listenProvider_.stopListening(Zs(i),Js(e,i))}}return o}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,t,n))}return h}function Us(e,t,n){const i=e.pendingWriteTree_,r=e.syncPointTree_.findOnPath(t,((e,n)=>{const i=Is(n,ci(e,t));if(i)return i}));return Qr(i,t,r,n,!0)}function Ws(e,t){const n=t._path;let i=null;e.syncPointTree_.foreachOnPath(n,((e,t)=>{const r=ci(e,n);i=i||Is(t,r)}));let r=e.syncPointTree_.get(n);r?i=i||Is(r,ei()):(r=new Cs,e.syncPointTree_=e.syncPointTree_.set(n,r));const s=null!=i,o=s?new kr(i,!0,!1):null;return function(e){return Nr(e.viewCache_)}(Ts(r,t,$r(e.pendingWriteTree_,t._path),s?o.getNode():$i.EMPTY_NODE,s))}function $s(e,t){return Hs(t,e.syncPointTree_,null,$r(e.pendingWriteTree_,ei()))}function Hs(e,t,n,i){if(li(e.path))return Vs(e,t,n,i);{const r=t.get(ei());null==n&&null!=r&&(n=Is(r,ei()));let s=[];const o=ti(e.path),a=e.operationForChild(o),l=t.children.get(o);if(l&&a){const e=n?n.getImmediateChild(o):null,t=ns(i,o);s=s.concat(Hs(a,l,e,t))}return r&&(s=s.concat(ks(r,e,i,n))),s}}function Vs(e,t,n,i){const r=t.get(ei());null==n&&null!=r&&(n=Is(r,ei()));let s=[];return t.children.inorderTraversal(((t,r)=>{const o=n?n.getImmediateChild(t):null,a=ns(i,t),l=e.operationForChild(t);l&&(s=s.concat(Vs(l,r,o,a)))})),r&&(s=s.concat(ks(r,e,i,n))),s}function Gs(e,t){const n=t.query,i=Js(e,n);return{hashFn:()=>{const e=function(e){return e.viewCache_.serverCache.getNode()}(t)||$i.EMPTY_NODE;return e.hash()},onComplete:t=>{if("ok"===t)return i?function(e,t,n){const i=Ys(e,n);if(i){const n=Ks(i),r=n.path,s=n.queryId,o=ci(r,t);return Xs(e,r,new br(yr(s),o))}return[]}(e,n._path,i):function(e,t){return $s(e,new br({fromUser:!1,fromServer:!0,queryId:null,tagged:!1},t))}(e,n._path);{const i=function(e,t){let n="Unknown Error";"too_big"===e?n="The data requested exceeds the maximum size that can be accessed with a single request.":"permission_denied"===e?n="Client doesn't have permission to access the desired data.":"unavailable"===e&&(n="The service is unavailable");const i=new Error(e+" at "+t._path.toString()+": "+n);return i.code=e.toUpperCase(),i}(t,n);return Bs(e,n,null,i)}}}}function Js(e,t){const n=Qs(t);return e.queryToTagMap.get(n)}function Qs(e){return e._path.toString()+"$"+e._queryIdentifier}function Ys(e,t){return e.tagToQueryMap.get(t)}function Ks(e){const t=e.indexOf("$");return Y(-1!==t&&t<e.length-1,"Bad queryKey."),{queryId:e.substr(t+1),path:new Zn(e.substr(0,t))}}function Xs(e,t,n){const i=e.syncPointTree_.get(t);Y(i,"Missing sync point for query tag that we're tracking");return ks(i,n,$r(e.pendingWriteTree_,t),null)}function Zs(e){return e._queryParams.loadsAllData()&&!e._queryParams.isDefault()?new(Y(ws,"Reference.ts has not been loaded"),ws)(e._repo,e._path):e}class eo{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new eo(t)}node(){return this.node_}}class to{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=ai(this.path_,e);return new to(this.syncTree_,t)}node(){return Us(this.syncTree_,this.path_)}}const no=function(e){return(e=e||{}).timestamp=e.timestamp||(new Date).getTime(),e},ro=function(e,t,n){return e&&"object"==typeof e?(Y(".sv"in e,"Unexpected leaf node or priority contents"),"string"==typeof e[".sv"]?so(e[".sv"],t,n):"object"==typeof e[".sv"]?oo(e[".sv"],t):void Y(!1,"Unexpected server value: "+JSON.stringify(e,null,2))):e},so=function(e,t,n){if("timestamp"===e)return n.timestamp;Y(!1,"Unexpected server value: "+e)},oo=function(e,t,n){e.hasOwnProperty("increment")||Y(!1,"Unexpected server value: "+JSON.stringify(e,null,2));const i=e.increment;"number"!=typeof i&&Y(!1,"Unexpected increment value: "+i);const r=t.node();if(Y(null!=r,"Expected ChildrenNode.EMPTY_NODE for nulls"),!r.isLeafNode())return i;const s=r.getValue();return"number"!=typeof s?i:s+i},ao=function(e,t,n,i){return co(t,new to(n,e),i)},lo=function(e,t,n){return co(e,new eo(t),n)};function co(e,t,n){const i=e.getPriority().val(),r=ro(i,t.getImmediateChild(".priority"),n);let s;if(e.isLeafNode()){const i=e,s=ro(i.getValue(),t,n);return s!==i.getValue()||r!==i.getPriority().val()?new Oi(s,Gi(r)):e}{const i=e;return s=i,r!==i.getPriority().val()&&(s=s.updatePriority(new Oi(r))),i.forEachChild(Fi,((e,i)=>{const r=co(i,t.getImmediateChild(e),n);r!==i&&(s=s.updateImmediateChild(e,r))})),s}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ho{constructor(e="",t=null,n={children:{},childCount:0}){this.name=e,this.parent=t,this.node=n}}function uo(e,t){let n=t instanceof Zn?t:new Zn(t),i=e,r=ti(n);for(;null!==r;){const e=ye(i.node.children,r)||{children:{},childCount:0};i=new ho(r,i,e),n=ii(n),r=ti(n)}return i}function po(e){return e.node.value}function fo(e,t){e.node.value=t,vo(e)}function _o(e){return e.node.childCount>0}function mo(e,t){wn(e.node.children,((n,i)=>{t(new ho(n,e,i))}))}function go(e,t,n,i){n&&!i&&t(e),mo(e,(e=>{go(e,t,!0,i)})),n&&i&&t(e)}function yo(e){return new Zn(null===e.parent?e.name:yo(e.parent)+"/"+e.name)}function vo(e){null!==e.parent&&function(e,t,n){const i=function(e){return void 0===po(e)&&!_o(e)}(n),r=ge(e.node.children,t);i&&r?(delete e.node.children[t],e.node.childCount--,vo(e)):i||r||(e.node.children[t]=n.node,e.node.childCount++,vo(e))}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e.parent,e.name,e)}const bo=/[\[\].#$\/\u0000-\u001F\u007F]/,wo=/[\[\].#$\u0000-\u001F\u007F]/,Co=10485760,ko=function(e){return"string"==typeof e&&0!==e.length&&!bo.test(e)},To=function(e){return"string"==typeof e&&0!==e.length&&!wo.test(e)},Eo=function(e){return null===e||"string"==typeof e||"number"==typeof e&&!pn(e)||e&&"object"==typeof e&&ge(e,".sv")},So=function(e,t,n,i){i&&void 0===t||xo(Ie(e,"value"),t,n)},xo=function(e,t,n){const i=n instanceof Zn?new pi(n,e):n;if(void 0===t)throw new Error(e+"contains undefined "+_i(i));if("function"==typeof t)throw new Error(e+"contains a function "+_i(i)+" with contents = "+t.toString());if(pn(t))throw new Error(e+"contains "+t.toString()+" "+_i(i));if("string"==typeof t&&t.length>Co/3&&Re(t)>Co)throw new Error(e+"contains a string greater than "+Co+" utf8 bytes "+_i(i)+" ('"+t.substring(0,50)+"...')");if(t&&"object"==typeof t){let n=!1,r=!1;if(wn(t,((t,s)=>{if(".value"===t)n=!0;else if(".priority"!==t&&".sv"!==t&&(r=!0,!ko(t)))throw new Error(e+" contains an invalid key ("+t+") "+_i(i)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');!function(e,t){e.parts_.length>0&&(e.byteLength_+=1),e.parts_.push(t),e.byteLength_+=Re(t),fi(e)}(i,t),xo(e,s,i),function(e){const t=e.parts_.pop();e.byteLength_-=Re(t),e.parts_.length>0&&(e.byteLength_-=1)}(i)})),n&&r)throw new Error(e+' contains ".value" child '+_i(i)+" in addition to actual children.")}},Io=function(e,t,n,i){if(i&&void 0===t)return;const r=Ie(e,"values");if(!t||"object"!=typeof t||Array.isArray(t))throw new Error(r+" must be an object containing the children to replace.");const s=[];wn(t,((e,t)=>{const i=new Zn(e);if(xo(r,t,ai(n,i)),".priority"===ri(i)&&!Eo(t))throw new Error(r+"contains an invalid value for '"+i.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");s.push(i)})),function(e,t){let n,i;for(n=0;n<t.length;n++){i=t[n];const r=si(i);for(let t=0;t<r.length;t++)if(".priority"===r[t]&&t===r.length-1);else if(!ko(r[t]))throw new Error(e+"contains an invalid key ("+r[t]+") in path "+i.toString()+'. Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"')}t.sort(hi);let r=null;for(n=0;n<t.length;n++){if(i=t[n],null!==r&&di(r,i))throw new Error(e+"contains a path "+r.toString()+" that is ancestor of another path "+i.toString());r=i}}(r,s)},No=function(e,t,n){if(!n||void 0!==t){if(pn(t))throw new Error(Ie(e,"priority")+"is "+t.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!Eo(t))throw new Error(Ie(e,"priority")+"must be a valid Firebase priority (a string, finite number, server value, or null).")}},Po=function(e,t,n,i){if(!(i&&void 0===n||ko(n)))throw new Error(Ie(e,t)+'was an invalid key = "'+n+'".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").')},Ro=function(e,t,n,i){if(!(i&&void 0===n||To(n)))throw new Error(Ie(e,t)+'was an invalid path = "'+n+'". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"')},Ao=function(e,t,n,i){n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),Ro(e,t,n,i)},Do=function(e,t){if(".info"===ti(t))throw new Error(e+" failed = Can't modify data under /.info/")},Lo=function(e,t){const n=t.path.toString();if("string"!=typeof t.repoInfo.host||0===t.repoInfo.host.length||!ko(t.repoInfo.namespace)&&"localhost"!==t.repoInfo.host.split(":")[0]||0!==n.length&&!function(e){return e&&(e=e.replace(/^\/*\.info(\/|$)/,"/")),To(e)}(n))throw new Error(Ie(e,"url")+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".')};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Oo{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function Fo(e,t){let n=null;for(let i=0;i<t.length;i++){const r=t[i],s=r.getPath();null===n||ui(s,n.path)||(e.eventLists_.push(n),n=null),null===n&&(n={events:[],path:s}),n.events.push(r)}n&&e.eventLists_.push(n)}function Mo(e,t,n){Fo(e,n),Bo(e,(e=>ui(e,t)))}function jo(e,t,n){Fo(e,n),Bo(e,(e=>di(e,t)||di(t,e)))}function Bo(e,t){e.recursionDepth_++;let n=!0;for(let i=0;i<e.eventLists_.length;i++){const r=e.eventLists_[i];if(r){t(r.path)?(qo(e.eventLists_[i]),e.eventLists_[i]=null):n=!1}}n&&(e.eventLists_=[]),e.recursionDepth_--}function qo(e){for(let t=0;t<e.events.length;t++){const n=e.events[t];if(null!==n){e.events[t]=null;const i=n.getEventRunner();sn&&ln("event: "+n.toString()),En(i)}}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zo="repo_interrupt",Uo=25;class Wo{constructor(e,t,n,i){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=n,this.appCheckProvider_=i,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new Oo,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=ur(),this.transactionQueueTree_=new ho,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function $o(e,t,n){if(e.stats_=Bn(e.repoInfo_),e.forceRestClient_||("object"==typeof window&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0)e.server_=new cr(e.repoInfo_,((t,n,i,r)=>{Go(e,t,n,i,r)}),e.authTokenProvider_,e.appCheckProvider_),setTimeout((()=>Jo(e,!0)),0);else{if(null!=n){if("object"!=typeof n)throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{_e(n)}catch(e){throw new Error("Invalid authOverride provided: "+e)}}e.persistentConnection_=new yi(e.repoInfo_,t,((t,n,i,r)=>{Go(e,t,n,i,r)}),(t=>{Jo(e,t)}),(t=>{!function(e,t){wn(t,((t,n)=>{Qo(e,t,n)}))}(e,t)}),e.authTokenProvider_,e.appCheckProvider_,n),e.server_=e.persistentConnection_}e.authTokenProvider_.addTokenChangeListener((t=>{e.server_.refreshAuthToken(t)})),e.appCheckProvider_.addTokenChangeListener((t=>{e.server_.refreshAppCheckToken(t.token)})),e.statsReporter_=function(e,t){const n=e.toString();return jn[n]||(jn[n]=t()),jn[n]}(e.repoInfo_,(()=>new mr(e.stats_,e.server_))),e.infoData_=new hr,e.infoSyncTree_=new Ls({startListening:(t,n,i,r)=>{let s=[];const o=e.infoData_.getNode(t._path);return o.isEmpty()||(s=js(e.infoSyncTree_,t._path,o),setTimeout((()=>{r("ok")}),0)),s},stopListening:()=>{}}),Qo(e,"connected",!1),e.serverSyncTree_=new Ls({startListening:(t,n,i,r)=>(e.server_.listen(t,i,n,((n,i)=>{const s=r(n,i);jo(e.eventQueue_,t._path,s)})),[]),stopListening:(t,n)=>{e.server_.unlisten(t,n)}})}function Ho(e){const t=e.infoData_.getNode(new Zn(".info/serverTimeOffset")).val()||0;return(new Date).getTime()+t}function Vo(e){return no({timestamp:Ho(e)})}function Go(e,t,n,i,r){e.dataUpdateCount++;const s=new Zn(t);n=e.interceptServerDataCallback_?e.interceptServerDataCallback_(t,n):n;let o=[];if(r)if(i){const t=be(n,(e=>Gi(e)));o=function(e,t,n,i){const r=Ys(e,i);if(r){const i=Ks(r),s=i.path,o=i.queryId,a=ci(s,t),l=Ar.fromObject(n);return Xs(e,s,new Cr(yr(o),a,l))}return[]}(e.serverSyncTree_,s,t,r)}else{const t=Gi(n);o=qs(e.serverSyncTree_,s,t,r)}else if(i){const t=be(n,(e=>Gi(e)));o=function(e,t,n){const i=Ar.fromObject(n);return $s(e,new Cr({fromUser:!1,fromServer:!0,queryId:null,tagged:!1},t,i))}(e.serverSyncTree_,s,t)}else{const t=Gi(n);o=js(e.serverSyncTree_,s,t)}let a=s;o.length>0&&(a=oa(e,s)),jo(e.eventQueue_,a,o)}function Jo(e,t){Qo(e,"connected",t),!1===t&&function(e){na(e,"onDisconnectEvents");const t=Vo(e),n=ur();fr(e.onDisconnect_,ei(),((i,r)=>{const s=ao(i,r,e.serverSyncTree_,t);dr(n,i,s)}));let i=[];fr(n,ei(),((t,n)=>{i=i.concat(js(e.serverSyncTree_,t,n));const r=ua(e,t);oa(e,r)})),e.onDisconnect_=ur(),jo(e.eventQueue_,ei(),i)}(e)}function Qo(e,t,n){const i=new Zn("/.info/"+t),r=Gi(n);e.infoData_.updateSnapshot(i,r);const s=js(e.infoSyncTree_,i,r);jo(e.eventQueue_,i,s)}function Yo(e){return e.nextWriteId_++}function Ko(e,t,n,i,r){na(e,"set",{path:t.toString(),value:n,priority:i});const s=Vo(e),o=Gi(n,i),a=Us(e.serverSyncTree_,t),l=lo(o,a,s),c=Yo(e),h=Os(e.serverSyncTree_,t,l,c,!0);Fo(e.eventQueue_,h),e.server_.put(t.toString(),o.val(!0),((n,i)=>{const s="ok"===n;s||dn("set at "+t+" failed: "+n);const o=Ms(e.serverSyncTree_,c,!s);jo(e.eventQueue_,t,o),ia(e,r,n,i)}));const u=ua(e,t);oa(e,u),jo(e.eventQueue_,u,[])}function Xo(e,t,n){e.server_.onDisconnectCancel(t.toString(),((i,r)=>{"ok"===i&&pr(e.onDisconnect_,t),ia(e,n,i,r)}))}function Zo(e,t,n,i){const r=Gi(n);e.server_.onDisconnectPut(t.toString(),r.val(!0),((n,s)=>{"ok"===n&&dr(e.onDisconnect_,t,r),ia(e,i,n,s)}))}function ea(e,t,n){let i;i=".info"===ti(t._path)?Bs(e.infoSyncTree_,t,n):Bs(e.serverSyncTree_,t,n),Mo(e.eventQueue_,t._path,i)}function ta(e){e.persistentConnection_&&e.persistentConnection_.interrupt(zo)}function na(e,...t){let n="";e.persistentConnection_&&(n=e.persistentConnection_.id+":"),ln(n,...t)}function ia(e,t,n,i){t&&En((()=>{if("ok"===n)t(null);else{const e=(n||"error").toUpperCase();let r=e;i&&(r+=": "+i);const s=new Error(r);s.code=e,t(s)}}))}function ra(e,t,n){return Us(e.serverSyncTree_,t,n)||$i.EMPTY_NODE}function sa(e,t=e.transactionQueueTree_){if(t||ha(e,t),po(t)){const n=la(e,t);Y(n.length>0,"Sending zero length transaction queue");n.every((e=>0===e.status))&&function(e,t,n){const i=n.map((e=>e.currentWriteId)),r=ra(e,t,i);let s=r;const o=r.hash();for(let e=0;e<n.length;e++){const i=n[e];Y(0===i.status,"tryToSendTransactionQueue_: items in queue should all be run."),i.status=1,i.retryCount++;const r=ci(t,i.path);s=s.updateChild(r,i.currentOutputSnapshotRaw)}const a=s.val(!0),l=t;e.server_.put(l.toString(),a,(i=>{na(e,"transaction put response",{path:l.toString(),status:i});let r=[];if("ok"===i){const i=[];for(let t=0;t<n.length;t++)n[t].status=2,r=r.concat(Ms(e.serverSyncTree_,n[t].currentWriteId)),n[t].onComplete&&i.push((()=>n[t].onComplete(null,!0,n[t].currentOutputSnapshotResolved))),n[t].unwatcher();ha(e,uo(e.transactionQueueTree_,t)),sa(e,e.transactionQueueTree_),jo(e.eventQueue_,t,r);for(let e=0;e<i.length;e++)En(i[e])}else{if("datastale"===i)for(let e=0;e<n.length;e++)3===n[e].status?n[e].status=4:n[e].status=0;else{dn("transaction at "+l.toString()+" failed: "+i);for(let e=0;e<n.length;e++)n[e].status=4,n[e].abortReason=i}oa(e,t)}}),o)}(e,yo(t),n)}else _o(t)&&mo(t,(t=>{sa(e,t)}))}function oa(e,t){const n=aa(e,t),i=yo(n);return function(e,t,n){if(0===t.length)return;const i=[];let r=[];const s=t.filter((e=>0===e.status)),o=s.map((e=>e.currentWriteId));for(let s=0;s<t.length;s++){const l=t[s],c=ci(n,l.path);let h,u=!1;if(Y(null!==c,"rerunTransactionsUnderNode_: relativePath should not be null."),4===l.status)u=!0,h=l.abortReason,r=r.concat(Ms(e.serverSyncTree_,l.currentWriteId,!0));else if(0===l.status)if(l.retryCount>=Uo)u=!0,h="maxretry",r=r.concat(Ms(e.serverSyncTree_,l.currentWriteId,!0));else{const n=ra(e,l.path,o);l.currentInputSnapshot=n;const i=t[s].update(n.val());if(void 0!==i){xo("transaction failed: Data returned ",i,l.path);let t=Gi(i);"object"==typeof i&&null!=i&&ge(i,".priority")||(t=t.updatePriority(n.getPriority()));const s=l.currentWriteId,a=Vo(e),c=lo(t,n,a);l.currentOutputSnapshotRaw=t,l.currentOutputSnapshotResolved=c,l.currentWriteId=Yo(e),o.splice(o.indexOf(s),1),r=r.concat(Os(e.serverSyncTree_,l.path,c,l.currentWriteId,l.applyLocally)),r=r.concat(Ms(e.serverSyncTree_,s,!0))}else u=!0,h="nodata",r=r.concat(Ms(e.serverSyncTree_,l.currentWriteId,!0))}jo(e.eventQueue_,n,r),r=[],u&&(t[s].status=2,a=t[s].unwatcher,setTimeout(a,Math.floor(0)),t[s].onComplete&&("nodata"===h?i.push((()=>t[s].onComplete(null,!1,t[s].currentInputSnapshot))):i.push((()=>t[s].onComplete(new Error(h),!1,null)))))}var a;ha(e,e.transactionQueueTree_);for(let e=0;e<i.length;e++)En(i[e]);sa(e,e.transactionQueueTree_)}(e,la(e,n),i),i}function aa(e,t){let n,i=e.transactionQueueTree_;for(n=ti(t);null!==n&&void 0===po(i);)i=uo(i,n),n=ti(t=ii(t));return i}function la(e,t){const n=[];return ca(e,t,n),n.sort(((e,t)=>e.order-t.order)),n}function ca(e,t,n){const i=po(t);if(i)for(let e=0;e<i.length;e++)n.push(i[e]);mo(t,(t=>{ca(e,t,n)}))}function ha(e,t){const n=po(t);if(n){let e=0;for(let t=0;t<n.length;t++)2!==n[t].status&&(n[e]=n[t],e++);n.length=e,fo(t,n.length>0?n:void 0)}mo(t,(t=>{ha(e,t)}))}function ua(e,t){const n=yo(aa(e,t)),i=uo(e.transactionQueueTree_,t);return function(e,t,n){let i=n?e:e.parent;for(;null!==i;){if(t(i))return!0;i=i.parent}}(i,(t=>{da(e,t)})),da(e,i),go(i,(t=>{da(e,t)})),n}function da(e,t){const n=po(t);if(n){const i=[];let r=[],s=-1;for(let t=0;t<n.length;t++)3===n[t].status||(1===n[t].status?(Y(s===t-1,"All SENT items should be at beginning of queue."),s=t,n[t].status=3,n[t].abortReason="set"):(Y(0===n[t].status,"Unexpected transaction status in abort"),n[t].unwatcher(),r=r.concat(Ms(e.serverSyncTree_,n[t].currentWriteId,!0)),n[t].onComplete&&i.push(n[t].onComplete.bind(null,new Error("set"),!1,null))));-1===s?fo(t,void 0):n.length=s+1,jo(e.eventQueue_,yo(t),r);for(let e=0;e<i.length;e++)En(i[e])}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pa=function(e,t){const n=fa(e),i=n.namespace;"firebase.com"===n.domain&&un(n.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),i&&"undefined"!==i||"localhost"===n.domain||un("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),n.secure||"undefined"!=typeof window&&window.location&&window.location.protocol&&-1!==window.location.protocol.indexOf("https:")&&dn("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");const r="ws"===n.scheme||"wss"===n.scheme;return{repoInfo:new Ln(n.host,n.secure,i,r,t,"",i!==n.subdomain),path:new Zn(n.pathString)}},fa=function(e){let t="",n="",i="",r="",s="",o=!0,a="https",l=443;if("string"==typeof e){let c=e.indexOf("//");c>=0&&(a=e.substring(0,c-1),e=e.substring(c+2));let h=e.indexOf("/");-1===h&&(h=e.length);let u=e.indexOf("?");-1===u&&(u=e.length),t=e.substring(0,Math.min(h,u)),h<u&&(r=function(e){let t="";const n=e.split("/");for(let e=0;e<n.length;e++)if(n[e].length>0){let i=n[e];try{i=decodeURIComponent(i.replace(/\+/g," "))}catch(e){}t+="/"+i}return t}(e.substring(h,u)));const d=function(e){const t={};"?"===e.charAt(0)&&(e=e.substring(1));for(const n of e.split("&")){if(0===n.length)continue;const i=n.split("=");2===i.length?t[decodeURIComponent(i[0])]=decodeURIComponent(i[1]):dn(`Invalid query segment '${n}' in query '${e}'`)}return t}(e.substring(Math.min(e.length,u)));c=t.indexOf(":"),c>=0?(o="https"===a||"wss"===a,l=parseInt(t.substring(c+1),10)):c=t.length;const p=t.slice(0,c);if("localhost"===p.toLowerCase())n="localhost";else if(p.split(".").length<=2)n=p;else{const e=t.indexOf(".");i=t.substring(0,e).toLowerCase(),n=t.substring(e+1),s=i}"ns"in d&&(s=d.ns)}return{host:t,port:l,domain:n,subdomain:i,secure:o,scheme:a,pathString:r,namespace:s}},_a="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",ma=function(){let e=0;const t=[];return function(n){const i=n===e;let r;e=n;const s=new Array(8);for(r=7;r>=0;r--)s[r]=_a.charAt(n%64),n=Math.floor(n/64);Y(0===n,"Cannot push at time == 0");let o=s.join("");if(i){for(r=11;r>=0&&63===t[r];r--)t[r]=0;t[r]++}else for(r=0;r<12;r++)t[r]=Math.floor(64*Math.random());for(r=0;r<12;r++)o+=_a.charAt(t[r]);return Y(20===o.length,"nextPushId: Length should be 20."),o}}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ga{constructor(e,t,n,i){this.eventType=e,this.eventRegistration=t,this.snapshot=n,this.prevName=i}getPath(){const e=this.snapshot.ref;return"value"===this.eventType?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+_e(this.snapshot.exportVal())}}class ya{constructor(e,t,n){this.eventRegistration=e,this.error=t,this.path=n}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class va{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return Y(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||void 0!==this.snapshotCallback.userCallback&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ba{constructor(e,t){this._repo=e,this._path=t}cancel(){const e=new le;return Xo(this._repo,this._path,e.wrapCallback((()=>{}))),e.promise}remove(){Do("OnDisconnect.remove",this._path);const e=new le;return Zo(this._repo,this._path,null,e.wrapCallback((()=>{}))),e.promise}set(e){Do("OnDisconnect.set",this._path),So("OnDisconnect.set",e,this._path,!1);const t=new le;return Zo(this._repo,this._path,e,t.wrapCallback((()=>{}))),t.promise}setWithPriority(e,t){Do("OnDisconnect.setWithPriority",this._path),So("OnDisconnect.setWithPriority",e,this._path,!1),No("OnDisconnect.setWithPriority",t,!1);const n=new le;return function(e,t,n,i,r){const s=Gi(n,i);e.server_.onDisconnectPut(t.toString(),s.val(!0),((n,i)=>{"ok"===n&&dr(e.onDisconnect_,t,s),ia(0,r,n,i)}))}(this._repo,this._path,e,t,n.wrapCallback((()=>{}))),n.promise}update(e){Do("OnDisconnect.update",this._path),Io("OnDisconnect.update",e,this._path,!1);const t=new le;return function(e,t,n,i){if(ve(n))return ln("onDisconnect().update() called with empty data.  Don't do anything."),void ia(0,i,"ok",void 0);e.server_.onDisconnectMerge(t.toString(),n,((r,s)=>{"ok"===r&&wn(n,((n,i)=>{const r=Gi(i);dr(e.onDisconnect_,ai(t,n),r)})),ia(0,i,r,s)}))}(this._repo,this._path,e,t.wrapCallback((()=>{}))),t.promise}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wa{constructor(e,t,n,i){this._repo=e,this._path=t,this._queryParams=n,this._orderByCalled=i}get key(){return li(this._path)?null:ri(this._path)}get ref(){return new Ea(this._repo,this._path)}get _queryIdentifier(){const e=lr(this._queryParams),t=vn(e);return"{}"===t?"default":t}get _queryObject(){return lr(this._queryParams)}isEqual(e){if(!((e=Ae(e))instanceof wa))return!1;const t=this._repo===e._repo,n=ui(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return t&&n&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+function(e){let t="";for(let n=e.pieceNum_;n<e.pieces_.length;n++)""!==e.pieces_[n]&&(t+="/"+encodeURIComponent(String(e.pieces_[n])));return t||"/"}(this._path)}}function Ca(e,t){if(!0===e._orderByCalled)throw new Error(t+": You can't combine multiple orderBy calls.")}function ka(e){let t=null,n=null;if(e.hasStart()&&(t=e.getIndexStartValue()),e.hasEnd()&&(n=e.getIndexEndValue()),e.getIndex()===ki){const i="Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().",r="Query: When ordering by key, the argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() must be a string.";if(e.hasStart()){if(e.getIndexStartName()!==fn)throw new Error(i);if("string"!=typeof t)throw new Error(r)}if(e.hasEnd()){if(e.getIndexEndName()!==_n)throw new Error(i);if("string"!=typeof n)throw new Error(r)}}else if(e.getIndex()===Fi){if(null!=t&&!Eo(t)||null!=n&&!Eo(n))throw new Error("Query: When ordering by priority, the first argument passed to startAt(), startAfter() endAt(), endBefore(), or equalTo() must be a valid priority value (null, a number, or a string).")}else if(Y(e.getIndex()instanceof Ji||e.getIndex()===Qi,"unknown index type."),null!=t&&"object"==typeof t||null!=n&&"object"==typeof n)throw new Error("Query: First argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() cannot be an object.")}function Ta(e){if(e.hasStart()&&e.hasEnd()&&e.hasLimit()&&!e.hasAnchoredLimit())throw new Error("Query: Can't combine startAt(), startAfter(), endAt(), endBefore(), and limit(). Use limitToFirst() or limitToLast() instead.")}class Ea extends wa{constructor(e,t){super(e,t,new ir,!1)}get parent(){const e=oi(this._path);return null===e?null:new Ea(this._repo,e)}get root(){let e=this;for(;null!==e.parent;)e=e.parent;return e}}class Sa{constructor(e,t,n){this._node=e,this.ref=t,this._index=n}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new Zn(e),n=Na(this.ref,e);return new Sa(this._node.getChild(t),n,Fi)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){if(this._node.isLeafNode())return!1;return!!this._node.forEachChild(this._index,((t,n)=>e(new Sa(n,Na(this.ref,t),Fi))))}hasChild(e){const t=new Zn(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return!this._node.isLeafNode()&&!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function xa(e,t){return(e=Ae(e))._checkNotDeleted("ref"),void 0!==t?Na(e._root,t):e._root}function Ia(e,t){(e=Ae(e))._checkNotDeleted("refFromURL");const n=pa(t,e._repo.repoInfo_.nodeAdmin);Lo("refFromURL",n);const i=n.repoInfo;return e._repo.repoInfo_.isCustomHost()||i.host===e._repo.repoInfo_.host||un("refFromURL: Host name does not match the current database: (found "+i.host+" but expected "+e._repo.repoInfo_.host+")"),xa(e,n.path.toString())}function Na(e,t){return null===ti((e=Ae(e))._path)?Ao("child","path",t,!1):Ro("child","path",t,!1),new Ea(e._repo,ai(e._path,t))}function Pa(e,t){e=Ae(e),Do("set",e._path),So("set",t,e._path,!1);const n=new le;return Ko(e._repo,e._path,t,null,n.wrapCallback((()=>{}))),n.promise}function Ra(e,t){Io("update",t,e._path,!1);const n=new le;return function(e,t,n,i){na(e,"update",{path:t.toString(),value:n});let r=!0;const s=Vo(e),o={};if(wn(n,((n,i)=>{r=!1,o[n]=ao(ai(t,n),Gi(i),e.serverSyncTree_,s)})),r)ln("update() called with empty data.  Don't do anything."),ia(0,i,"ok",void 0);else{const r=Yo(e),s=Fs(e.serverSyncTree_,t,o,r);Fo(e.eventQueue_,s),e.server_.merge(t.toString(),n,((n,s)=>{const o="ok"===n;o||dn("update at "+t+" failed: "+n);const a=Ms(e.serverSyncTree_,r,!o),l=a.length>0?oa(e,t):t;jo(e.eventQueue_,l,a),ia(0,i,n,s)})),wn(n,(n=>{const i=ua(e,ai(t,n));oa(e,i)})),jo(e.eventQueue_,t,[])}}(e._repo,e._path,t,n.wrapCallback((()=>{}))),n.promise}function Aa(e){e=Ae(e);const t=new va((()=>{})),n=new Da(t);return function(e,t,n){const i=Ws(e.serverSyncTree_,t);return null!=i?Promise.resolve(i):e.server_.get(t).then((i=>{const r=Gi(i).withIndex(t._queryParams.getIndex());let s;if(zs(e.serverSyncTree_,t,n,!0),t._queryParams.loadsAllData())s=js(e.serverSyncTree_,t._path,r);else{const n=Js(e.serverSyncTree_,t);s=qs(e.serverSyncTree_,t._path,r,n)}return jo(e.eventQueue_,t._path,s),Bs(e.serverSyncTree_,t,n,null,!0),r}),(n=>(na(e,"get for query "+_e(t)+" failed: "+n),Promise.reject(new Error(n)))))}(e._repo,e,n).then((t=>new Sa(t,new Ea(e._repo,e._path),e._queryParams.getIndex())))}class Da{constructor(e){this.callbackContext=e}respondsTo(e){return"value"===e}createEvent(e,t){const n=t._queryParams.getIndex();return new ga("value",this,new Sa(e.snapshotNode,new Ea(t._repo,t._path),n))}getEventRunner(e){return"cancel"===e.getEventType()?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new ya(this,e,t):null}matches(e){return e instanceof Da&&(!e.callbackContext||!this.callbackContext||e.callbackContext.matches(this.callbackContext))}hasAnyCallback(){return null!==this.callbackContext}}class La{constructor(e,t){this.eventType=e,this.callbackContext=t}respondsTo(e){let t="children_added"===e?"child_added":e;return t="children_removed"===t?"child_removed":t,this.eventType===t}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new ya(this,e,t):null}createEvent(e,t){Y(null!=e.childName,"Child events should have a childName.");const n=Na(new Ea(t._repo,t._path),e.childName),i=t._queryParams.getIndex();return new ga(e.type,this,new Sa(e.snapshotNode,n,i),e.prevName)}getEventRunner(e){return"cancel"===e.getEventType()?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,e.prevName)}matches(e){return e instanceof La&&(this.eventType===e.eventType&&(!this.callbackContext||!e.callbackContext||this.callbackContext.matches(e.callbackContext)))}hasAnyCallback(){return!!this.callbackContext}}function Oa(e,t,n,i,r){let s;if("object"==typeof i&&(s=void 0,r=i),"function"==typeof i&&(s=i),r&&r.onlyOnce){const t=n,i=(n,i)=>{ea(e._repo,e,a),t(n,i)};i.userCallback=n.userCallback,i.context=n.context,n=i}const o=new va(n,s||void 0),a="value"===t?new Da(o):new La(t,o);return function(e,t,n){let i;i=".info"===ti(t._path)?zs(e.infoSyncTree_,t,n):zs(e.serverSyncTree_,t,n),Mo(e.eventQueue_,t._path,i)}(e._repo,e,a),()=>ea(e._repo,e,a)}function Fa(e,t,n,i){return Oa(e,"value",t,n,i)}function Ma(e,t,n,i){return Oa(e,"child_added",t,n,i)}function ja(e,t,n,i){return Oa(e,"child_changed",t,n,i)}function Ba(e,t,n,i){return Oa(e,"child_moved",t,n,i)}function qa(e,t,n,i){return Oa(e,"child_removed",t,n,i)}function za(e,t,n){let i=null;const r=n?new va(n):null;"value"===t?i=new Da(r):t&&(i=new La(t,r)),ea(e._repo,e,i)}class Ua{}class Wa extends Ua{constructor(e,t){super(),this._value=e,this._key=t}_apply(e){So("endAt",this._value,e._path,!0);const t=sr(e._queryParams,this._value,this._key);if(Ta(t),ka(t),e._queryParams.hasEnd())throw new Error("endAt: Starting point was already set (by another call to endAt, endBefore or equalTo).");return new wa(e._repo,e._path,t,e._orderByCalled)}}class $a extends Ua{constructor(e,t){super(),this._value=e,this._key=t}_apply(e){So("endBefore",this._value,e._path,!1);const t=function(e,t,n){let i;return i=e.index_===ki||n?sr(e,t,n):sr(e,t,fn),i.endBeforeSet_=!0,i}(e._queryParams,this._value,this._key);if(Ta(t),ka(t),e._queryParams.hasEnd())throw new Error("endBefore: Starting point was already set (by another call to endAt, endBefore or equalTo).");return new wa(e._repo,e._path,t,e._orderByCalled)}}class Ha extends Ua{constructor(e,t){super(),this._value=e,this._key=t}_apply(e){So("startAt",this._value,e._path,!0);const t=rr(e._queryParams,this._value,this._key);if(Ta(t),ka(t),e._queryParams.hasStart())throw new Error("startAt: Starting point was already set (by another call to startAt, startBefore or equalTo).");return new wa(e._repo,e._path,t,e._orderByCalled)}}class Va extends Ua{constructor(e,t){super(),this._value=e,this._key=t}_apply(e){So("startAfter",this._value,e._path,!1);const t=function(e,t,n){let i;return i=e.index_===ki||n?rr(e,t,n):rr(e,t,_n),i.startAfterSet_=!0,i}(e._queryParams,this._value,this._key);if(Ta(t),ka(t),e._queryParams.hasStart())throw new Error("startAfter: Starting point was already set (by another call to startAt, startAfter, or equalTo).");return new wa(e._repo,e._path,t,e._orderByCalled)}}class Ga extends Ua{constructor(e){super(),this._limit=e}_apply(e){if(e._queryParams.hasLimit())throw new Error("limitToFirst: Limit was already set (by another call to limitToFirst or limitToLast).");return new wa(e._repo,e._path,function(e,t){const n=e.copy();return n.limitSet_=!0,n.limit_=t,n.viewFrom_="l",n}(e._queryParams,this._limit),e._orderByCalled)}}class Ja extends Ua{constructor(e){super(),this._limit=e}_apply(e){if(e._queryParams.hasLimit())throw new Error("limitToLast: Limit was already set (by another call to limitToFirst or limitToLast).");return new wa(e._repo,e._path,function(e,t){const n=e.copy();return n.limitSet_=!0,n.limit_=t,n.viewFrom_="r",n}(e._queryParams,this._limit),e._orderByCalled)}}class Qa extends Ua{constructor(e){super(),this._path=e}_apply(e){Ca(e,"orderByChild");const t=new Zn(this._path);if(li(t))throw new Error("orderByChild: cannot pass in empty path. Use orderByValue() instead.");const n=new Ji(t),i=or(e._queryParams,n);return ka(i),new wa(e._repo,e._path,i,!0)}}class Ya extends Ua{_apply(e){Ca(e,"orderByKey");const t=or(e._queryParams,ki);return ka(t),new wa(e._repo,e._path,t,!0)}}class Ka extends Ua{_apply(e){Ca(e,"orderByPriority");const t=or(e._queryParams,Fi);return ka(t),new wa(e._repo,e._path,t,!0)}}class Xa extends Ua{_apply(e){Ca(e,"orderByValue");const t=or(e._queryParams,Qi);return ka(t),new wa(e._repo,e._path,t,!0)}}class Za extends Ua{constructor(e,t){super(),this._value=e,this._key=t}_apply(e){if(So("equalTo",this._value,e._path,!1),e._queryParams.hasStart())throw new Error("equalTo: Starting point was already set (by another call to startAt/startAfter or equalTo).");if(e._queryParams.hasEnd())throw new Error("equalTo: Ending point was already set (by another call to endAt/endBefore or equalTo).");return new Wa(this._value,this._key)._apply(new Ha(this._value,this._key)._apply(e))}}function el(e,...t){let n=Ae(e);for(const e of t)n=e._apply(n);return n}!function(e){Y(!bs,"__referenceConstructor has already been defined"),bs=e}(Ea),function(e){Y(!ws,"__referenceConstructor has already been defined"),ws=e}(Ea);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const tl="FIREBASE_DATABASE_EMULATOR_HOST",nl={};let il=!1;function rl(e,t,n,i,r){let s=i||e.options.databaseURL;void 0===s&&(e.options.projectId||un("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),ln("Using default host for project ",e.options.projectId),s=`${e.options.projectId}-default-rtdb.firebaseio.com`);let o,a,l=pa(s,r),c=l.repoInfo;"undefined"!=typeof process&&process.env&&(a=process.env[tl]),a?(o=!0,s=`http://${a}?ns=${c.namespace}`,l=pa(s,r),c=l.repoInfo):o=!l.repoInfo.secure;const h=r&&o?new Nn(Nn.OWNER):new In(e.name,e.options,t);Lo("Invalid Firebase Database URL",l),li(l.path)||un("Database URL must point to the root of a Firebase Database (not including a child path).");const u=function(e,t,n,i){let r=nl[t.name];r||(r={},nl[t.name]=r);let s=r[e.toURLString()];s&&un("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call.");return s=new Wo(e,il,n,i),r[e.toURLString()]=s,s}(c,e,h,new xn(e.name,n));return new sl(u,e)}class sl{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||($o(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new Ea(this._repo,ei())),this._rootInternal}_delete(){return null!==this._rootInternal&&(!function(e,t){const n=nl[t];n&&n[e.key]===e||un(`Database ${t}(${e.repoInfo_}) has already been deleted.`),ta(e),delete n[e.key]}(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){null===this._rootInternal&&un("Cannot call "+e+" on a deleted database.")}}function ol(){Vn.IS_TRANSPORT_INITIALIZED&&dn("Transport has already been initialized. Please call this function before calling ref or setting up a listener")}function al(){ol(),Un.forceDisallow()}function ll(){ol(),Hn.forceDisallow(),Un.forceAllow()}function cl(e,t,n,i={}){(e=Ae(e))._checkNotDeleted("useEmulator"),e._instanceStarted&&un("Cannot call useEmulator() after instance has already been initialized.");const r=e._repoInternal;let s;if(r.repoInfo_.nodeAdmin)i.mockUserToken&&un('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),s=new Nn(Nn.OWNER);else if(i.mockUserToken){const t="string"==typeof i.mockUserToken?i.mockUserToken:function(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n=t||"demo-project",i=e.iat||0,r=e.sub||e.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const s=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:i,exp:i+3600,auth_time:i,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},e);return[ne(JSON.stringify({alg:"none",type:"JWT"})),ne(JSON.stringify(s)),""].join(".")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(i.mockUserToken,e.app.options.projectId);s=new Nn(t)}!function(e,t,n,i){e.repoInfo_=new Ln(`${t}:${n}`,!1,e.repoInfo_.namespace,e.repoInfo_.webSocketOnly,e.repoInfo_.nodeAdmin,e.repoInfo_.persistenceKey,e.repoInfo_.includeNamespaceInQueryParams,!0),i&&(e.authTokenProvider_=i)}(r,t,n,s)}function hl(e){var t;(e=Ae(e))._checkNotDeleted("goOnline"),(t=e._repo).persistentConnection_&&t.persistentConnection_.resume(zo)}function ul(e,t){an(e,t)}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const dl={".sv":"timestamp"};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class pl{constructor(e,t){this.committed=e,this.snapshot=t}toJSON(){return{committed:this.committed,snapshot:this.snapshot.toJSON()}}}function fl(e,t,n){var i;if(e=Ae(e),Do("Reference.transaction",e._path),".length"===e.key||".keys"===e.key)throw"Reference.transaction failed: "+e.key+" is a read-only object.";const r=null===(i=null==n?void 0:n.applyLocally)||void 0===i||i,s=new le,o=Fa(e,(()=>{}));return function(e,t,n,i,r,s){na(e,"transaction on "+t);const o={path:t,update:n,onComplete:i,status:null,order:tn(),applyLocally:s,retryCount:0,unwatcher:r,abortReason:null,currentWriteId:null,currentInputSnapshot:null,currentOutputSnapshotRaw:null,currentOutputSnapshotResolved:null},a=ra(e,t,void 0);o.currentInputSnapshot=a;const l=o.update(a.val());if(void 0===l)o.unwatcher(),o.currentOutputSnapshotRaw=null,o.currentOutputSnapshotResolved=null,o.onComplete&&o.onComplete(null,!1,o.currentInputSnapshot);else{xo("transaction failed: Data returned ",l,o.path),o.status=0;const n=uo(e.transactionQueueTree_,t),i=po(n)||[];let r;i.push(o),fo(n,i),"object"==typeof l&&null!==l&&ge(l,".priority")?(r=ye(l,".priority"),Y(Eo(r),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):r=(Us(e.serverSyncTree_,t)||$i.EMPTY_NODE).getPriority().val();const s=Vo(e),c=Gi(l,r),h=lo(c,a,s);o.currentOutputSnapshotRaw=c,o.currentOutputSnapshotResolved=h,o.currentWriteId=Yo(e);const u=Os(e.serverSyncTree_,t,h,o.currentWriteId,o.applyLocally);jo(e.eventQueue_,t,u),sa(e,e.transactionQueueTree_)}}(e._repo,e._path,t,((t,n,i)=>{let r=null;t?s.reject(t):(r=new Sa(i,new Ea(e._repo,e._path),Fi),s.resolve(new pl(n,r)))}),o,r),s.promise}yi.prototype.simpleListen=function(e,t){this.sendRequest("q",{p:e},t)},yi.prototype.echo=function(e,t){this.sendRequest("echo",{d:e},t)},function(e){Jt(wt),gt(new De("database",((e,{instanceIdentifier:t})=>rl(e.getProvider("app").getImmediate(),e.getProvider("auth-internal"),e.getProvider("app-check-internal"),t)),"PUBLIC").setMultipleInstances(!0)),Tt(Ht,Vt,e),Tt(Ht,Vt,"esm2017")}();const _l=new We("@firebase/database-compat"),ml=function(e){const t="FIREBASE WARNING: "+e;_l.warn(t)};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class gl{constructor(e){this._delegate=e}cancel(e){xe("OnDisconnect.cancel",0,1,arguments.length),Ne("OnDisconnect.cancel","onComplete",e,!0);const t=this._delegate.cancel();return e&&t.then((()=>e(null)),(t=>e(t))),t}remove(e){xe("OnDisconnect.remove",0,1,arguments.length),Ne("OnDisconnect.remove","onComplete",e,!0);const t=this._delegate.remove();return e&&t.then((()=>e(null)),(t=>e(t))),t}set(e,t){xe("OnDisconnect.set",1,2,arguments.length),Ne("OnDisconnect.set","onComplete",t,!0);const n=this._delegate.set(e);return t&&n.then((()=>t(null)),(e=>t(e))),n}setWithPriority(e,t,n){xe("OnDisconnect.setWithPriority",2,3,arguments.length),Ne("OnDisconnect.setWithPriority","onComplete",n,!0);const i=this._delegate.setWithPriority(e,t);return n&&i.then((()=>n(null)),(e=>n(e))),i}update(e,t){if(xe("OnDisconnect.update",1,2,arguments.length),Array.isArray(e)){const t={};for(let n=0;n<e.length;++n)t[""+n]=e[n];e=t,ml("Passing an Array to firebase.database.onDisconnect().update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Ne("OnDisconnect.update","onComplete",t,!0);const n=this._delegate.update(e);return t&&n.then((()=>t(null)),(e=>t(e))),n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yl{constructor(e,t){this.committed=e,this.snapshot=t}toJSON(){return xe("TransactionResult.toJSON",0,1,arguments.length),{committed:this.committed,snapshot:this.snapshot.toJSON()}}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vl{constructor(e,t){this._database=e,this._delegate=t}val(){return xe("DataSnapshot.val",0,0,arguments.length),this._delegate.val()}exportVal(){return xe("DataSnapshot.exportVal",0,0,arguments.length),this._delegate.exportVal()}toJSON(){return xe("DataSnapshot.toJSON",0,1,arguments.length),this._delegate.toJSON()}exists(){return xe("DataSnapshot.exists",0,0,arguments.length),this._delegate.exists()}child(e){return xe("DataSnapshot.child",0,1,arguments.length),e=String(e),Ro("DataSnapshot.child","path",e,!1),new vl(this._database,this._delegate.child(e))}hasChild(e){return xe("DataSnapshot.hasChild",1,1,arguments.length),Ro("DataSnapshot.hasChild","path",e,!1),this._delegate.hasChild(e)}getPriority(){return xe("DataSnapshot.getPriority",0,0,arguments.length),this._delegate.priority}forEach(e){return xe("DataSnapshot.forEach",1,1,arguments.length),Ne("DataSnapshot.forEach","action",e,!1),this._delegate.forEach((t=>e(new vl(this._database,t))))}hasChildren(){return xe("DataSnapshot.hasChildren",0,0,arguments.length),this._delegate.hasChildren()}get key(){return this._delegate.key}numChildren(){return xe("DataSnapshot.numChildren",0,0,arguments.length),this._delegate.size}getRef(){return xe("DataSnapshot.ref",0,0,arguments.length),new wl(this._database,this._delegate.ref)}get ref(){return this.getRef()}}class bl{constructor(e,t){this.database=e,this._delegate=t}on(e,t,n,i){var r;xe("Query.on",2,4,arguments.length),Ne("Query.on","callback",t,!1);const s=bl.getCancelAndContextArgs_("Query.on",n,i),o=(e,n)=>{t.call(s.context,new vl(this.database,e),n)};o.userCallback=t,o.context=s.context;const a=null===(r=s.cancel)||void 0===r?void 0:r.bind(s.context);switch(e){case"value":return Fa(this._delegate,o,a),t;case"child_added":return Ma(this._delegate,o,a),t;case"child_removed":return qa(this._delegate,o,a),t;case"child_changed":return ja(this._delegate,o,a),t;case"child_moved":return Ba(this._delegate,o,a),t;default:throw new Error(Ie("Query.on","eventType")+'must be a valid event type = "value", "child_added", "child_removed", "child_changed", or "child_moved".')}}off(e,t,n){if(xe("Query.off",0,3,arguments.length),function(e,t,n){if(!n||void 0!==t)switch(t){case"value":case"child_added":case"child_removed":case"child_changed":case"child_moved":break;default:throw new Error(Ie(e,"eventType")+'must be a valid event type = "value", "child_added", "child_removed", "child_changed", or "child_moved".')}}("Query.off",e,!0),Ne("Query.off","callback",t,!0),Pe("Query.off","context",n,!0),t){const i=()=>{};i.userCallback=t,i.context=n,za(this._delegate,e,i)}else za(this._delegate,e)}get(){return Aa(this._delegate).then((e=>new vl(this.database,e)))}once(e,t,n,i){xe("Query.once",1,4,arguments.length),Ne("Query.once","callback",t,!0);const r=bl.getCancelAndContextArgs_("Query.once",n,i),s=new le,o=(e,n)=>{const i=new vl(this.database,e);t&&t.call(r.context,i,n),s.resolve(i)};o.userCallback=t,o.context=r.context;const a=e=>{r.cancel&&r.cancel.call(r.context,e),s.reject(e)};switch(e){case"value":Fa(this._delegate,o,a,{onlyOnce:!0});break;case"child_added":Ma(this._delegate,o,a,{onlyOnce:!0});break;case"child_removed":qa(this._delegate,o,a,{onlyOnce:!0});break;case"child_changed":ja(this._delegate,o,a,{onlyOnce:!0});break;case"child_moved":Ba(this._delegate,o,a,{onlyOnce:!0});break;default:throw new Error(Ie("Query.once","eventType")+'must be a valid event type = "value", "child_added", "child_removed", "child_changed", or "child_moved".')}return s.promise}limitToFirst(e){return xe("Query.limitToFirst",1,1,arguments.length),new bl(this.database,el(this._delegate,function(e){if("number"!=typeof e||Math.floor(e)!==e||e<=0)throw new Error("limitToFirst: First argument must be a positive integer.");return new Ga(e)}(e)))}limitToLast(e){return xe("Query.limitToLast",1,1,arguments.length),new bl(this.database,el(this._delegate,function(e){if("number"!=typeof e||Math.floor(e)!==e||e<=0)throw new Error("limitToLast: First argument must be a positive integer.");return new Ja(e)}(e)))}orderByChild(e){return xe("Query.orderByChild",1,1,arguments.length),new bl(this.database,el(this._delegate,function(e){if("$key"===e)throw new Error('orderByChild: "$key" is invalid.  Use orderByKey() instead.');if("$priority"===e)throw new Error('orderByChild: "$priority" is invalid.  Use orderByPriority() instead.');if("$value"===e)throw new Error('orderByChild: "$value" is invalid.  Use orderByValue() instead.');return Ro("orderByChild","path",e,!1),new Qa(e)}(e)))}orderByKey(){return xe("Query.orderByKey",0,0,arguments.length),new bl(this.database,el(this._delegate,new Ya))}orderByPriority(){return xe("Query.orderByPriority",0,0,arguments.length),new bl(this.database,el(this._delegate,new Ka))}orderByValue(){return xe("Query.orderByValue",0,0,arguments.length),new bl(this.database,el(this._delegate,new Xa))}startAt(e=null,t){return xe("Query.startAt",0,2,arguments.length),new bl(this.database,el(this._delegate,function(e=null,t){return Po("startAt","key",t,!0),new Ha(e,t)}(e,t)))}startAfter(e=null,t){return xe("Query.startAfter",0,2,arguments.length),new bl(this.database,el(this._delegate,function(e,t){return Po("startAfter","key",t,!0),new Va(e,t)}(e,t)))}endAt(e=null,t){return xe("Query.endAt",0,2,arguments.length),new bl(this.database,el(this._delegate,function(e,t){return Po("endAt","key",t,!0),new Wa(e,t)}(e,t)))}endBefore(e=null,t){return xe("Query.endBefore",0,2,arguments.length),new bl(this.database,el(this._delegate,function(e,t){return Po("endBefore","key",t,!0),new $a(e,t)}(e,t)))}equalTo(e,t){return xe("Query.equalTo",1,2,arguments.length),new bl(this.database,el(this._delegate,function(e,t){return Po("equalTo","key",t,!0),new Za(e,t)}(e,t)))}toString(){return xe("Query.toString",0,0,arguments.length),this._delegate.toString()}toJSON(){return xe("Query.toJSON",0,1,arguments.length),this._delegate.toJSON()}isEqual(e){if(xe("Query.isEqual",1,1,arguments.length),!(e instanceof bl)){throw new Error("Query.isEqual failed: First argument must be an instance of firebase.database.Query.")}return this._delegate.isEqual(e._delegate)}static getCancelAndContextArgs_(e,t,n){const i={cancel:void 0,context:void 0};if(t&&n)i.cancel=t,Ne(e,"cancel",i.cancel,!0),i.context=n,Pe(e,"context",i.context,!0);else if(t)if("object"==typeof t&&null!==t)i.context=t;else{if("function"!=typeof t)throw new Error(Ie(e,"cancelOrContext")+" must either be a cancel callback or a context object.");i.cancel=t}return i}get ref(){return new wl(this.database,new Ea(this._delegate._repo,this._delegate._path))}}class wl extends bl{constructor(e,t){super(e,new wa(t._repo,t._path,new ir,!1)),this.database=e,this._delegate=t}getKey(){return xe("Reference.key",0,0,arguments.length),this._delegate.key}child(e){return xe("Reference.child",1,1,arguments.length),"number"==typeof e&&(e=String(e)),new wl(this.database,Na(this._delegate,e))}getParent(){xe("Reference.parent",0,0,arguments.length);const e=this._delegate.parent;return e?new wl(this.database,e):null}getRoot(){return xe("Reference.root",0,0,arguments.length),new wl(this.database,this._delegate.root)}set(e,t){xe("Reference.set",1,2,arguments.length),Ne("Reference.set","onComplete",t,!0);const n=Pa(this._delegate,e);return t&&n.then((()=>t(null)),(e=>t(e))),n}update(e,t){if(xe("Reference.update",1,2,arguments.length),Array.isArray(e)){const t={};for(let n=0;n<e.length;++n)t[""+n]=e[n];e=t,ml("Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Do("Reference.update",this._delegate._path),Ne("Reference.update","onComplete",t,!0);const n=Ra(this._delegate,e);return t&&n.then((()=>t(null)),(e=>t(e))),n}setWithPriority(e,t,n){xe("Reference.setWithPriority",2,3,arguments.length),Ne("Reference.setWithPriority","onComplete",n,!0);const i=function(e,t,n){if(Do("setWithPriority",e._path),So("setWithPriority",t,e._path,!1),No("setWithPriority",n,!1),".length"===e.key||".keys"===e.key)throw"setWithPriority failed: "+e.key+" is a read-only object.";const i=new le;return Ko(e._repo,e._path,t,n,i.wrapCallback((()=>{}))),i.promise}(this._delegate,e,t);return n&&i.then((()=>n(null)),(e=>n(e))),i}remove(e){xe("Reference.remove",0,1,arguments.length),Ne("Reference.remove","onComplete",e,!0);const t=function(e){return Do("remove",e._path),Pa(e,null)}(this._delegate);return e&&t.then((()=>e(null)),(t=>e(t))),t}transaction(e,t,n){xe("Reference.transaction",1,3,arguments.length),Ne("Reference.transaction","transactionUpdate",e,!1),Ne("Reference.transaction","onComplete",t,!0),function(e,t,n,i){if((!i||void 0!==n)&&"boolean"!=typeof n)throw new Error(Ie(e,t)+"must be a boolean.")}("Reference.transaction","applyLocally",n,!0);const i=fl(this._delegate,e,{applyLocally:n}).then((e=>new yl(e.committed,new vl(this.database,e.snapshot))));return t&&i.then((e=>t(null,e.committed,e.snapshot)),(e=>t(e,!1,null))),i}setPriority(e,t){xe("Reference.setPriority",1,2,arguments.length),Ne("Reference.setPriority","onComplete",t,!0);const n=function(e,t){e=Ae(e),Do("setPriority",e._path),No("setPriority",t,!1);const n=new le;return Ko(e._repo,ai(e._path,".priority"),t,null,n.wrapCallback((()=>{}))),n.promise}(this._delegate,e);return t&&n.then((()=>t(null)),(e=>t(e))),n}push(e,t){xe("Reference.push",0,2,arguments.length),Ne("Reference.push","onComplete",t,!0);const n=function(e,t){e=Ae(e),Do("push",e._path),So("push",t,e._path,!0);const n=Ho(e._repo),i=ma(n),r=Na(e,i),s=Na(e,i);let o;return o=null!=t?Pa(s,t).then((()=>s)):Promise.resolve(s),r.then=o.then.bind(o),r.catch=o.then.bind(o,void 0),r}(this._delegate,e),i=n.then((e=>new wl(this.database,e)));t&&i.then((()=>t(null)),(e=>t(e)));const r=new wl(this.database,n);return r.then=i.then.bind(i),r.catch=i.catch.bind(i,void 0),r}onDisconnect(){return Do("Reference.onDisconnect",this._delegate._path),new gl(new ba(this._delegate._repo,this._delegate._path))}get key(){return this.getKey()}get parent(){return this.getParent()}get root(){return this.getRoot()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cl{constructor(e,t){this._delegate=e,this.app=t,this.INTERNAL={delete:()=>this._delegate._delete(),forceWebSockets:al,forceLongPolling:ll}}useEmulator(e,t,n={}){cl(this._delegate,e,t,n)}ref(e){if(xe("database.ref",0,1,arguments.length),e instanceof wl){const t=Ia(this._delegate,e.toString());return new wl(this,t)}{const t=xa(this._delegate,e);return new wl(this,t)}}refFromURL(e){xe("database.refFromURL",1,1,arguments.length);const t=Ia(this._delegate,e);return new wl(this,t)}goOffline(){return xe("database.goOffline",0,0,arguments.length),(e=Ae(e=this._delegate))._checkNotDeleted("goOffline"),void ta(e._repo);var e}goOnline(){return xe("database.goOnline",0,0,arguments.length),hl(this._delegate)}}Cl.ServerValue={TIMESTAMP:dl,increment:e=>function(e){return{".sv":{increment:e}}}(e)};var kl=Object.freeze({__proto__:null,initStandalone:
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function({app:e,url:t,version:n,customAuthImpl:i,namespace:r,nodeAdmin:s=!1}){Jt(n);const o=new Oe("auth-internal",new Fe("database-standalone"));return o.setComponent(new De("auth-internal",(()=>i),"PRIVATE")),{instance:new Cl(rl(e,o,void 0,t,s),e),namespace:r}}});
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tl=Cl.ServerValue;!function(e){e.INTERNAL.registerComponent(new De("database-compat",((e,{instanceIdentifier:t})=>{const n=e.getProvider("app-compat").getImmediate(),i=e.getProvider("database").getImmediate({identifier:t});return new Cl(i,n)}),"PUBLIC").setServiceProps({Reference:wl,Query:bl,Database:Cl,DataSnapshot:vl,enableLogging:ul,INTERNAL:kl,ServerValue:Tl}).setMultipleInstances(!0)),e.registerVersion("@firebase/database-compat","0.3.4")}($t);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
$t.registerVersion("firebase","9.22.2","app-compat");$t.initializeApp({apiKey:"AIzaSyBRRWCIBplurimT9S2h0ikia3zJtH8GGz4",authDomain:"jibobecoding.firebaseapp.com",databaseURL:"https://jibobecoding-default-rtdb.firebaseio.com",projectId:"jibobecoding",storageBucket:"jibobecoding.appspot.com",messagingSenderId:"190480712101",appId:"1:190480712101:web:d2177edff3db7b63f5284c",measurementId:"G-251EZ4YTJF"});var El=$t.database(),Sl="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},xl=Object.getOwnPropertySymbols,Il=Object.prototype.hasOwnProperty,Nl=Object.prototype.propertyIsEnumerable;var Pl,Rl,Al,Dl,Ll,Ol,Fl=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map((function(e){return t[e]})).join(""))return!1;var i={};return"abcdefghijklmnopqrst".split("").forEach((function(e){i[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},i)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var n,i,r=function(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}(e),s=1;s<arguments.length;s++){for(var o in n=Object(arguments[s]))Il.call(n,o)&&(r[o]=n[o]);if(xl){i=xl(n);for(var a=0;a<i.length;a++)Nl.call(n,i[a])&&(r[i[a]]=n[i[a]])}}return r},Ml={},jl={get exports(){return Ml},set exports(e){Ml=e}};function Bl(){return Rl?Pl:(Rl=1,Pl=function(e,t,n){t.forEach((function(t){var i=n[t];e.prototype[t]=function(e){return e.ros=this,new i(e)}}))})}function ql(){return Dl?Al:(Dl=1,Al="undefined"!=typeof window?window.WebSocket:WebSocket)}var zl,Ul,Wl,$l,Hl,Vl,Gl,Jl,Ql,Yl={},Kl={get exports(){return Yl},set exports(e){Yl=e}};function Xl(){return zl||(zl=1,function(e){function t(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.i=function(e){return e},n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n.oe=function(e){throw console.error(e),e};var i=n(n.s=ENTRY_MODULE);return i.default||i}var n="[\\.|\\-|\\+|\\w|/|@]+",i="\\(\\s*(/\\*.*?\\*/)?\\s*.*?("+n+").*?\\)";function r(e){return(e+"").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&")}function s(e,t,s){var o={};o[s]=[];var a=t.toString(),l=a.match(/^function\s?\w*\(\w+,\s*\w+,\s*(\w+)\)/);if(!l)return o;for(var c,h=l[1],u=new RegExp("(\\\\n|\\W)"+r(h)+i,"g");c=u.exec(a);)"dll-reference"!==c[3]&&o[s].push(c[3]);for(u=new RegExp("\\("+r(h)+'\\("(dll-reference\\s('+n+'))"\\)\\)'+i,"g");c=u.exec(a);)e[c[2]]||(o[s].push(c[1]),e[c[2]]=__webpack_require__(c[1]).m),o[c[2]]=o[c[2]]||[],o[c[2]].push(c[4]);for(var d,p=Object.keys(o),f=0;f<p.length;f++)for(var _=0;_<o[p[f]].length;_++)d=o[p[f]][_],isNaN(1*d)||(o[p[f]][_]=1*o[p[f]][_]);return o}function o(e){return Object.keys(e).reduce((function(t,n){return t||e[n].length>0}),!1)}e.exports=function(e,n){n=n||{};var i={main:__webpack_modules__},r=n.all?{main:Object.keys(i.main)}:function(e,t){for(var n={main:[t]},i={main:[]},r={main:{}};o(n);)for(var a=Object.keys(n),l=0;l<a.length;l++){var c=a[l],h=n[c].pop();if(r[c]=r[c]||{},!r[c][h]&&e[c][h]){r[c][h]=!0,i[c]=i[c]||[],i[c].push(h);for(var u=s(e,e[c][h],c),d=Object.keys(u),p=0;p<d.length;p++)n[d[p]]=n[d[p]]||[],n[d[p]]=n[d[p]].concat(u[d[p]])}}return i}(i,e),a="";Object.keys(r).filter((function(e){return"main"!==e})).forEach((function(e){for(var n=0;r[e][n];)n++;r[e].push(n),i[e][n]="(function(module, exports, __webpack_require__) { module.exports = __webpack_require__; })",a=a+"var "+e+" = ("+t.toString().replace("ENTRY_MODULE",JSON.stringify(n))+")({"+r[e].map((function(t){return JSON.stringify(t)+": "+i[e][t].toString()})).join(",")+"});\n"})),a=a+"new (("+t.toString().replace("ENTRY_MODULE",JSON.stringify(e))+")({"+r.main.map((function(e){return JSON.stringify(e)+": "+i.main[e].toString()})).join(",")+"}))(self);";var l=new window.Blob([a],{type:"text/javascript"});if(n.bare)return l;var c=(window.URL||window.webkitURL||window.mozURL||window.msURL).createObjectURL(l),h=new window.Worker(c);return h.objectURL=c,h}}(Kl)),Yl}function Zl(){if(Wl)return Ul;Wl=1;var e=e||ql();return Ul=function(t){var n=null;function i(e){var n=e.data;n instanceof ArrayBuffer?t.postMessage(n,[n]):t.postMessage(n)}function r(e){t.postMessage({type:e.type})}t.addEventListener("message",(function(t){var s=t.data;if("string"==typeof s)n.send(s);else if(s.hasOwnProperty("close"))n.close(),n=null;else{if(!s.hasOwnProperty("uri"))throw"Unknown message to WorkerSocket";var o=s.uri;(n=new e(o)).binaryType="arraybuffer",n.onmessage=i,n.onclose=r,n.onopen=r,n.onerror=r}}))}}function ec(){if(Hl)return $l;Hl=1;try{var e=function(){if(Ol)return Ll;Ol=1;var e=arguments[3],t=arguments[4],n=arguments[5],i=JSON.stringify;return Ll=function(r,s){for(var o,a=Object.keys(n),l=0,c=a.length;l<c;l++){var h=a[l],u=n[h].exports;if(u===r||u&&u.default===r){o=h;break}}if(!o){o=Math.floor(Math.pow(16,8)*Math.random()).toString(16);var d={};for(l=0,c=a.length;l<c;l++)d[h=a[l]]=h;t[o]=["function(require,module,exports){"+r+"(self); }",d]}var p=Math.floor(Math.pow(16,8)*Math.random()).toString(16),f={};f[o]=o,t[p]=["function(require,module,exports){var f = require("+i(o)+");(f.default ? f.default : f)(self);}",f];var _={};!function e(n){for(var i in _[n]=!0,t[n][1]){var r=t[n][1][i];_[r]||e(r)}}(p);var m="("+e+")({"+Object.keys(_).map((function(e){return i(e)+":["+t[e][0]+","+i(t[e][1])+"]"})).join(",")+"},{},["+i(p)+"])",g=window.URL||window.webkitURL||window.mozURL||window.msURL,y=new Blob([m],{type:"text/javascript"});if(s&&s.bare)return y;var v=g.createObjectURL(y),b=new Worker(v);return b.objectURL=v,b}}()}catch(t){e=Xl()}var t=Zl();function n(n){this.socket_=e(t),this.socket_.addEventListener("message",this.handleWorkerMessage_.bind(this)),this.socket_.postMessage({uri:n})}return n.prototype.handleWorkerMessage_=function(e){var t=e.data;if(t instanceof ArrayBuffer||"string"==typeof t)this.onmessage(e);else{var n=t.type;if("close"===n)this.onclose(null);else if("open"===n)this.onopen(null);else{if("error"!==n)throw"Unknown message from workersocket";this.onerror(null)}}},n.prototype.send=function(e){this.socket_.postMessage(e)},n.prototype.close=function(){this.socket_.postMessage({close:!0})},$l=n}function tc(){if(Ql)return Jl;Ql=1;var e=Gl?Vl:(Gl=1,Vl=function(){return document.createElement("canvas")}),t=e.Image||window.Image;return Jl=function(n,i){var r=new t;r.onload=function(){var t=new e,n=t.getContext("2d");t.width=r.width,t.height=r.height,n.imageSmoothingEnabled=!1,n.webkitImageSmoothingEnabled=!1,n.mozImageSmoothingEnabled=!1,n.drawImage(r,0,0);for(var s=n.getImageData(0,0,r.width,r.height).data,o="",a=0;a<s.length;a+=4)o+=String.fromCharCode(s[a],s[a+1],s[a+2]);i(JSON.parse(o))},r.src="data:image/png;base64,"+n},Jl}var nc,ic={},rc={get exports(){return ic},set exports(e){ic=e}};function sc(){return nc||(nc=1,e=rc,function(t,n){var i=Math.pow(2,-24),r=Math.pow(2,32),s=Math.pow(2,53),o={encode:function(e){var t,i=new ArrayBuffer(256),o=new DataView(i),a=0;function l(e){for(var n=i.byteLength,r=a+e;n<r;)n*=2;if(n!==i.byteLength){var s=o;i=new ArrayBuffer(n),o=new DataView(i);for(var l=a+3>>2,c=0;c<l;++c)o.setUint32(4*c,s.getUint32(4*c))}return t=e,o}function c(){a+=t}function h(e){c(l(1).setUint8(a,e))}function u(e){for(var t=l(e.length),n=0;n<e.length;++n)t.setUint8(a+n,e[n]);c()}function d(e,t){t<24?h(e<<5|t):t<256?(h(e<<5|24),h(t)):t<65536?(h(e<<5|25),function(e){c(l(2).setUint16(a,e))}(t)):t<4294967296?(h(e<<5|26),function(e){c(l(4).setUint32(a,e))}(t)):(h(e<<5|27),function(e){var t=e%r,n=(e-t)/r,i=l(8);i.setUint32(a,n),i.setUint32(a+4,t),c()}(t))}if(function e(t){var i;if(!1===t)return h(244);if(!0===t)return h(245);if(null===t)return h(246);if(t===n)return h(247);switch(typeof t){case"number":if(Math.floor(t)===t){if(0<=t&&t<=s)return d(0,t);if(-s<=t&&t<0)return d(1,-(t+1))}return h(251),function(e){c(l(8).setFloat64(a,e))}(t);case"string":var r=[];for(i=0;i<t.length;++i){var o=t.charCodeAt(i);o<128?r.push(o):o<2048?(r.push(192|o>>6),r.push(128|63&o)):o<55296?(r.push(224|o>>12),r.push(128|o>>6&63),r.push(128|63&o)):(o=(1023&o)<<10,o|=1023&t.charCodeAt(++i),o+=65536,r.push(240|o>>18),r.push(128|o>>12&63),r.push(128|o>>6&63),r.push(128|63&o))}return d(3,r.length),u(r);default:var p;if(Array.isArray(t))for(d(4,p=t.length),i=0;i<p;++i)e(t[i]);else if(t instanceof Uint8Array)d(2,t.length),u(t);else{var f=Object.keys(t);for(d(5,p=f.length),i=0;i<p;++i){var _=f[i];e(_),e(t[_])}}}}(e),"slice"in i)return i.slice(0,a);for(var p=new ArrayBuffer(a),f=new DataView(p),_=0;_<a;++_)f.setUint8(_,o.getUint8(_));return p},decode:function(e,t,s){var o=new DataView(e),a=0;function l(e,t){return a+=t,e}function c(t){return l(new Uint8Array(e,a,t),t)}function h(){return l(o.getUint8(a),1)}function u(){return l(o.getUint16(a),2)}function d(){return l(o.getUint32(a),4)}function p(){return 255===o.getUint8(a)&&(a+=1,!0)}function f(e){if(e<24)return e;if(24===e)return h();if(25===e)return u();if(26===e)return d();if(27===e)return d()*r+d();if(31===e)return-1;throw"Invalid length encoding"}function _(e){var t=h();if(255===t)return-1;var n=f(31&t);if(n<0||t>>5!==e)throw"Invalid indefinite length element";return n}function m(e,t){for(var n=0;n<t;++n){var i=h();128&i&&(i<224?(i=(31&i)<<6|63&h(),t-=1):i<240?(i=(15&i)<<12|(63&h())<<6|63&h(),t-=2):(i=(15&i)<<18|(63&h())<<12|(63&h())<<6|63&h(),t-=3)),i<65536?e.push(i):(i-=65536,e.push(55296|i>>10),e.push(56320|1023&i))}}"function"!=typeof t&&(t=function(e){return e}),"function"!=typeof s&&(s=function(){return n});var g=function e(){var r,d,g=h(),y=g>>5,v=31&g;if(7===y)switch(v){case 25:return function(){var e=new ArrayBuffer(4),t=new DataView(e),n=u(),r=32768&n,s=31744&n,o=1023&n;if(31744===s)s=261120;else if(0!==s)s+=114688;else if(0!==o)return o*i;return t.setUint32(0,r<<16|s<<13|o<<13),t.getFloat32(0)}();case 26:return l(o.getFloat32(a),4);case 27:return l(o.getFloat64(a),8)}if((d=f(v))<0&&(y<2||6<y))throw"Invalid length";switch(y){case 0:return d;case 1:return-1-d;case 2:if(d<0){for(var b=[],w=0;(d=_(y))>=0;)w+=d,b.push(c(d));var C=new Uint8Array(w),k=0;for(r=0;r<b.length;++r)C.set(b[r],k),k+=b[r].length;return C}return c(d);case 3:var T=[];if(d<0)for(;(d=_(y))>=0;)m(T,d);else m(T,d);return String.fromCharCode.apply(null,T);case 4:var E;if(d<0)for(E=[];!p();)E.push(e());else for(E=new Array(d),r=0;r<d;++r)E[r]=e();return E;case 5:var S={};for(r=0;r<d||d<0&&!p();++r)S[e()]=e();return S;case 6:return t(e(),d);case 7:switch(d){case 20:return!1;case 21:return!0;case 22:return null;case 23:return n;default:return s(d)}}}();if(a!==e.byteLength)throw"Remaining bytes";return g}};e.exports?e.exports=o:t.CBOR||(t.CBOR=o)}(Sl)),ic;var e}var oc,ac,lc,cc,hc,uc,dc,pc={},fc={get exports(){return pc},set exports(e){pc=e}};function _c(){if(lc)return ac;lc=1;var e=tc(),t=sc(),n=(oc||(oc=1,function(e){var t=Math.pow(2,32),n=!1;function i(){n||(n=!0,console.warn("CBOR 64-bit integer array values may lose precision. No further warnings."))}var r={64:Uint8Array,69:Uint16Array,70:Uint32Array,72:Int8Array,77:Int16Array,78:Int32Array,85:Float32Array,86:Float64Array},s={71:function(e){i();for(var n=e.byteLength,r=e.byteOffset,s=n/8,o=e.buffer.slice(r,r+n),a=new Uint32Array(o),l=new Array(s),c=0;c<s;c++){var h=2*c,u=a[h],d=a[h+1];l[c]=u+t*d}return l},79:function(e){i();for(var n=e.byteLength,r=e.byteOffset,s=n/8,o=e.buffer.slice(r,r+n),a=new Uint32Array(o),l=new Int32Array(o),c=new Array(s),h=0;h<s;h++){var u=2*h,d=a[u],p=l[u+1];c[h]=d+t*p}return c}};e.exports&&(e.exports=function(e,t){var n,i,o,a;return t in r?(i=r[t],o=(n=e).byteLength,a=n.byteOffset,new i(n.buffer.slice(a,a+o))):t in s?s[t](e):e})}(fc)),pc),i=null;return"undefined"!=typeof bson&&(i=bson().BSON),ac=function(r){var s=null;function o(e){"publish"===e.op?r.emit(e.topic,e.msg):"service_response"===e.op?r.emit(e.id,e):"call_service"===e.op?r.emit(e.service,e):"status"===e.op&&(e.id?r.emit("status:"+e.id,e):r.emit("status",e))}function a(t,n){"png"===t.op?e(t.data,n):n(t)}return r.transportOptions.decoder&&(s=r.transportOptions.decoder),{onopen:function(e){r.isConnected=!0,r.emit("connection",e)},onclose:function(e){r.isConnected=!1,r.emit("close",e)},onerror:function(e){r.emit("error",e)},onmessage:function(e){if(s)s(e.data,(function(e){o(e)}));else if("undefined"!=typeof Blob&&e.data instanceof Blob)!function(e,t){if(!i)throw"Cannot process BSON encoded message without BSON header.";var n=new FileReader;n.onload=function(){var e=new Uint8Array(this.result),n=i.deserialize(e);t(n)},n.readAsArrayBuffer(e)}(e.data,(function(e){a(e,o)}));else if(e.data instanceof ArrayBuffer){o(t.decode(e.data,n))}else{a(JSON.parse("string"==typeof e?e:e.data),o)}}}},ac}function mc(){if(hc)return cc;hc=1;var e=Fl;return cc=function(t){e(this,t)}}function gc(){if(dc)return uc;dc=1;var e=Fl;return uc=function(t){e(this,t)}}var yc,vc,bc,wc,Cc,kc,Tc,Ec,Sc,xc,Ic,Nc,Pc={},Rc={get exports(){return Pc},set exports(e){Pc=e}};function Ac(){return yc||(yc=1,e=Rc,function(t){var n=Object.hasOwnProperty,i=Array.isArray?Array.isArray:function(e){return"[object Array]"===Object.prototype.toString.call(e)},r="object"==typeof process&&"function"==typeof process.nextTick,s="function"==typeof Symbol,o="object"==typeof Reflect,a="function"==typeof setImmediate?setImmediate:setTimeout,l=s?o&&"function"==typeof Reflect.ownKeys?Reflect.ownKeys:function(e){var t=Object.getOwnPropertyNames(e);return t.push.apply(t,Object.getOwnPropertySymbols(e)),t}:Object.keys;function c(){this._events={},this._conf&&h.call(this,this._conf)}function h(e){e&&(this._conf=e,e.delimiter&&(this.delimiter=e.delimiter),e.maxListeners!==t&&(this._maxListeners=e.maxListeners),e.wildcard&&(this.wildcard=e.wildcard),e.newListener&&(this._newListener=e.newListener),e.removeListener&&(this._removeListener=e.removeListener),e.verboseMemoryLeak&&(this.verboseMemoryLeak=e.verboseMemoryLeak),e.ignoreErrors&&(this.ignoreErrors=e.ignoreErrors),this.wildcard&&(this.listenerTree={}))}function u(e,t){var n="(node) warning: possible EventEmitter memory leak detected. "+e+" listeners added. Use emitter.setMaxListeners() to increase limit.";if(this.verboseMemoryLeak&&(n+=" Event name: "+t+"."),"undefined"!=typeof process&&process.emitWarning){var i=new Error(n);i.name="MaxListenersExceededWarning",i.emitter=this,i.count=e,process.emitWarning(i)}else console.error(n),console.trace&&console.trace()}var d=function(e,t,n){var i=arguments.length;switch(i){case 0:return[];case 1:return[e];case 2:return[e,t];case 3:return[e,t,n];default:for(var r=new Array(i);i--;)r[i]=arguments[i];return r}};function p(e,n){for(var i={},r=e.length,s=n?n.length:0,o=0;o<r;o++)i[e[o]]=o<s?n[o]:t;return i}function f(e,t,n){var i,r;if(this._emitter=e,this._target=t,this._listeners={},this._listenersCount=0,(n.on||n.off)&&(i=n.on,r=n.off),t.addEventListener?(i=t.addEventListener,r=t.removeEventListener):t.addListener?(i=t.addListener,r=t.removeListener):t.on&&(i=t.on,r=t.off),!i&&!r)throw Error("target does not implement any known event API");if("function"!=typeof i)throw TypeError("on method must be a function");if("function"!=typeof r)throw TypeError("off method must be a function");this._on=i,this._off=r;var s=e._observers;s?s.push(this):e._observers=[this]}function _(e,i,r,s){var o=Object.assign({},i);if(!e)return o;if("object"!=typeof e)throw TypeError("options must be an object");var a,l,c,h=Object.keys(e),u=h.length;function d(e){throw Error('Invalid "'+a+'" option value'+(e?". Reason: "+e:""))}for(var p=0;p<u;p++){if(a=h[p],!s&&!n.call(i,a))throw Error('Unknown "'+a+'" option');(l=e[a])!==t&&(c=r[a],o[a]=c?c(l,d):l)}return o}function m(e,t){return"function"==typeof e&&e.hasOwnProperty("prototype")||t("value must be a constructor"),e}function g(e){var t="value must be type of "+e.join("|"),n=e.length,i=e[0],r=e[1];return 1===n?function(e,n){if(typeof e===i)return e;n(t)}:2===n?function(e,n){var s=typeof e;if(s===i||s===r)return e;n(t)}:function(i,r){for(var s=typeof i,o=n;o-- >0;)if(s===e[o])return i;r(t)}}Object.assign(f.prototype,{subscribe:function(e,t,n){var i=this,r=this._target,s=this._emitter,o=this._listeners,a=function(){var i=d.apply(null,arguments),o={data:i,name:t,original:e};n?!1!==n.call(r,o)&&s.emit.apply(s,[o.name].concat(i)):s.emit.apply(s,[t].concat(i))};if(o[e])throw Error("Event '"+e+"' is already listening");this._listenersCount++,s._newListener&&s._removeListener&&!i._onNewListener?(this._onNewListener=function(n){n===t&&null===o[e]&&(o[e]=a,i._on.call(r,e,a))},s.on("newListener",this._onNewListener),this._onRemoveListener=function(n){n===t&&!s.hasListeners(n)&&o[e]&&(o[e]=null,i._off.call(r,e,a))},o[e]=null,s.on("removeListener",this._onRemoveListener)):(o[e]=a,i._on.call(r,e,a))},unsubscribe:function(e){var t,n,i,r=this,s=this._listeners,o=this._emitter,a=this._off,c=this._target;if(e&&"string"!=typeof e)throw TypeError("event must be a string");function h(){r._onNewListener&&(o.off("newListener",r._onNewListener),o.off("removeListener",r._onRemoveListener),r._onNewListener=null,r._onRemoveListener=null);var e=w.call(o,r);o._observers.splice(e,1)}if(e){if(!(t=s[e]))return;a.call(c,e,t),delete s[e],--this._listenersCount||h()}else{for(i=(n=l(s)).length;i-- >0;)e=n[i],a.call(c,e,s[e]);this._listeners={},this._listenersCount=0,h()}}});var y=g(["function"]),v=g(["object","function"]);function b(e,t,n){var i,r,s,o=0,a=new e((function(l,c,h){function u(){r&&(r=null),o&&(clearTimeout(o),o=0)}n=_(n,{timeout:0,overload:!1},{timeout:function(e,t){return("number"!=typeof(e*=1)||e<0||!Number.isFinite(e))&&t("timeout must be a positive number"),e}}),i=!n.overload&&"function"==typeof e.prototype.cancel&&"function"==typeof h;var d=function(e){u(),l(e)},p=function(e){u(),c(e)};i?t(d,p,h):(r=[function(e){p(e||Error("canceled"))}],t(d,p,(function(e){if(s)throw Error("Unable to subscribe on cancel event asynchronously");if("function"!=typeof e)throw TypeError("onCancel callback must be a function");r.push(e)})),s=!0),n.timeout>0&&(o=setTimeout((function(){var e=Error("timeout");e.code="ETIMEDOUT",o=0,a.cancel(e),c(e)}),n.timeout))}));return i||(a.cancel=function(e){if(r){for(var t=r.length,n=1;n<t;n++)r[n](e);r[0](e),r=null}}),a}function w(e){var t=this._observers;if(!t)return-1;for(var n=t.length,i=0;i<n;i++)if(t[i]._target===e)return i;return-1}function C(e,t,n,i,r){if(!n)return null;if(0===i){var s=typeof t;if("string"===s){var o,a,c=0,h=0,u=this.delimiter,d=u.length;if(-1!==(a=t.indexOf(u))){o=new Array(5);do{o[c++]=t.slice(h,a),h=a+d}while(-1!==(a=t.indexOf(u,h)));o[c++]=t.slice(h),t=o,r=c}else t=[t],r=1}else"object"===s?r=t.length:(t=[t],r=1)}var p,f,_,m,g,y,v,b=null,w=t[i],k=t[i+1];if(i===r)n._listeners&&("function"==typeof n._listeners?(e&&e.push(n._listeners),b=[n]):(e&&e.push.apply(e,n._listeners),b=[n]));else{if("*"===w){for(a=(y=l(n)).length;a-- >0;)"_listeners"!==(p=y[a])&&(v=C(e,t,n[p],i+1,r))&&(b?b.push.apply(b,v):b=v);return b}if("**"===w){for((g=i+1===r||i+2===r&&"*"===k)&&n._listeners&&(b=C(e,t,n,r,r)),a=(y=l(n)).length;a-- >0;)"_listeners"!==(p=y[a])&&("*"===p||"**"===p?(n[p]._listeners&&!g&&(v=C(e,t,n[p],r,r))&&(b?b.push.apply(b,v):b=v),v=C(e,t,n[p],i,r)):v=C(e,t,n[p],p===k?i+2:i,r),v&&(b?b.push.apply(b,v):b=v));return b}n[w]&&(b=C(e,t,n[w],i+1,r))}if((f=n["*"])&&C(e,t,f,i+1,r),_=n["**"])if(i<r)for(_._listeners&&C(e,t,_,r,r),a=(y=l(_)).length;a-- >0;)"_listeners"!==(p=y[a])&&(p===k?C(e,t,_[p],i+2,r):p===w?C(e,t,_[p],i+1,r):((m={})[p]=_[p],C(e,t,{"**":m},i+1,r)));else _._listeners?C(e,t,_,r,r):_["*"]&&_["*"]._listeners&&C(e,t,_["*"],r,r);return b}function k(e,t,n){var i,r,s=0,o=0,a=this.delimiter,l=a.length;if("string"==typeof e)if(-1!==(i=e.indexOf(a))){r=new Array(5);do{r[s++]=e.slice(o,i),o=i+l}while(-1!==(i=e.indexOf(a,o)));r[s++]=e.slice(o)}else r=[e],s=1;else r=e,s=e.length;if(s>1)for(i=0;i+1<s;i++)if("**"===r[i]&&"**"===r[i+1])return;var c,h=this.listenerTree;for(i=0;i<s;i++)if(h=h[c=r[i]]||(h[c]={}),i===s-1)return h._listeners?("function"==typeof h._listeners&&(h._listeners=[h._listeners]),n?h._listeners.unshift(t):h._listeners.push(t),!h._listeners.warned&&this._maxListeners>0&&h._listeners.length>this._maxListeners&&(h._listeners.warned=!0,u.call(this,h._listeners.length,c))):h._listeners=t,!0;return!0}function T(e,t,n,i){for(var r,s,o,a,c=l(e),h=c.length,u=e._listeners;h-- >0;)r=e[s=c[h]],o="_listeners"===s?n:n?n.concat(s):[s],a=i||"symbol"==typeof s,u&&t.push(a?o:o.join(this.delimiter)),"object"==typeof r&&T.call(this,r,t,o,a);return t}function E(e){for(var t,n,i,r=l(e),s=r.length;s-- >0;)(t=e[n=r[s]])&&(i=!0,"_listeners"===n||E(t)||delete e[n]);return i}function S(e,t,n){this.emitter=e,this.event=t,this.listener=n}function x(e,n,i){if(!0===i)o=!0;else if(!1===i)s=!0;else{if(!i||"object"!=typeof i)throw TypeError("options should be an object or true");var s=i.async,o=i.promisify,l=i.nextTick,c=i.objectify}if(s||l||o){var h=n,u=n._origin||n;if(l&&!r)throw Error("process.nextTick is not supported");o===t&&(o="AsyncFunction"===n.constructor.name),n=function(){var e=arguments,t=this,n=this.event;return o?l?Promise.resolve():new Promise((function(e){a(e)})).then((function(){return t.event=n,h.apply(t,e)})):(l?process.nextTick:a)((function(){t.event=n,h.apply(t,e)}))},n._async=!0,n._origin=u}return[n,c?new S(this,e,n):this]}function I(e){this._events={},this._newListener=!1,this._removeListener=!1,this.verboseMemoryLeak=!1,h.call(this,e)}S.prototype.off=function(){return this.emitter.off(this.event,this.listener),this},I.EventEmitter2=I,I.prototype.listenTo=function(e,n,r){if("object"!=typeof e)throw TypeError("target musts be an object");var s=this;function o(t){if("object"!=typeof t)throw TypeError("events must be an object");var n,i=r.reducers,o=w.call(s,e);n=-1===o?new f(s,e,r):s._observers[o];for(var a,c=l(t),h=c.length,u="function"==typeof i,d=0;d<h;d++)a=c[d],n.subscribe(a,t[a]||a,u?i:i&&i[a])}return r=_(r,{on:t,off:t,reducers:t},{on:y,off:y,reducers:v}),i(n)?o(p(n)):o("string"==typeof n?p(n.split(/\s+/)):n),this},I.prototype.stopListeningTo=function(e,t){var n=this._observers;if(!n)return!1;var i,r=n.length,s=!1;if(e&&"object"!=typeof e)throw TypeError("target should be an object");for(;r-- >0;)i=n[r],e&&i._target!==e||(i.unsubscribe(t),s=!0);return s},I.prototype.delimiter=".",I.prototype.setMaxListeners=function(e){e!==t&&(this._maxListeners=e,this._conf||(this._conf={}),this._conf.maxListeners=e)},I.prototype.getMaxListeners=function(){return this._maxListeners},I.prototype.event="",I.prototype.once=function(e,t,n){return this._once(e,t,!1,n)},I.prototype.prependOnceListener=function(e,t,n){return this._once(e,t,!0,n)},I.prototype._once=function(e,t,n,i){return this._many(e,1,t,n,i)},I.prototype.many=function(e,t,n,i){return this._many(e,t,n,!1,i)},I.prototype.prependMany=function(e,t,n,i){return this._many(e,t,n,!0,i)},I.prototype._many=function(e,t,n,i,r){var s=this;if("function"!=typeof n)throw new Error("many only accepts instances of Function");function o(){return 0==--t&&s.off(e,o),n.apply(this,arguments)}return o._origin=n,this._on(e,o,i,r)},I.prototype.emit=function(){if(!this._events&&!this._all)return!1;this._events||c.call(this);var e,t,n,i,r,o,a=arguments[0],l=this.wildcard;if("newListener"===a&&!this._newListener&&!this._events.newListener)return!1;if(l&&(e=a,"newListener"!==a&&"removeListener"!==a&&"object"==typeof a)){if(n=a.length,s)for(i=0;i<n;i++)if("symbol"==typeof a[i]){o=!0;break}o||(a=a.join(this.delimiter))}var h,u=arguments.length;if(this._all&&this._all.length)for(i=0,n=(h=this._all.slice()).length;i<n;i++)switch(this.event=a,u){case 1:h[i].call(this,a);break;case 2:h[i].call(this,a,arguments[1]);break;case 3:h[i].call(this,a,arguments[1],arguments[2]);break;default:h[i].apply(this,arguments)}if(l)h=[],C.call(this,h,e,this.listenerTree,0,n);else{if("function"==typeof(h=this._events[a])){switch(this.event=a,u){case 1:h.call(this);break;case 2:h.call(this,arguments[1]);break;case 3:h.call(this,arguments[1],arguments[2]);break;default:for(t=new Array(u-1),r=1;r<u;r++)t[r-1]=arguments[r];h.apply(this,t)}return!0}h&&(h=h.slice())}if(h&&h.length){if(u>3)for(t=new Array(u-1),r=1;r<u;r++)t[r-1]=arguments[r];for(i=0,n=h.length;i<n;i++)switch(this.event=a,u){case 1:h[i].call(this);break;case 2:h[i].call(this,arguments[1]);break;case 3:h[i].call(this,arguments[1],arguments[2]);break;default:h[i].apply(this,t)}return!0}if(!this.ignoreErrors&&!this._all&&"error"===a)throw arguments[1]instanceof Error?arguments[1]:new Error("Uncaught, unspecified 'error' event.");return!!this._all},I.prototype.emitAsync=function(){if(!this._events&&!this._all)return!1;this._events||c.call(this);var e,t,n,i,r,o,a=arguments[0],l=this.wildcard;if("newListener"===a&&!this._newListener&&!this._events.newListener)return Promise.resolve([!1]);if(l&&(e=a,"newListener"!==a&&"removeListener"!==a&&"object"==typeof a)){if(i=a.length,s)for(r=0;r<i;r++)if("symbol"==typeof a[r]){t=!0;break}t||(a=a.join(this.delimiter))}var h,u=[],d=arguments.length;if(this._all)for(r=0,i=this._all.length;r<i;r++)switch(this.event=a,d){case 1:u.push(this._all[r].call(this,a));break;case 2:u.push(this._all[r].call(this,a,arguments[1]));break;case 3:u.push(this._all[r].call(this,a,arguments[1],arguments[2]));break;default:u.push(this._all[r].apply(this,arguments))}if(l?(h=[],C.call(this,h,e,this.listenerTree,0)):h=this._events[a],"function"==typeof h)switch(this.event=a,d){case 1:u.push(h.call(this));break;case 2:u.push(h.call(this,arguments[1]));break;case 3:u.push(h.call(this,arguments[1],arguments[2]));break;default:for(n=new Array(d-1),o=1;o<d;o++)n[o-1]=arguments[o];u.push(h.apply(this,n))}else if(h&&h.length){if(h=h.slice(),d>3)for(n=new Array(d-1),o=1;o<d;o++)n[o-1]=arguments[o];for(r=0,i=h.length;r<i;r++)switch(this.event=a,d){case 1:u.push(h[r].call(this));break;case 2:u.push(h[r].call(this,arguments[1]));break;case 3:u.push(h[r].call(this,arguments[1],arguments[2]));break;default:u.push(h[r].apply(this,n))}}else if(!this.ignoreErrors&&!this._all&&"error"===a)return arguments[1]instanceof Error?Promise.reject(arguments[1]):Promise.reject("Uncaught, unspecified 'error' event.");return Promise.all(u)},I.prototype.on=function(e,t,n){return this._on(e,t,!1,n)},I.prototype.prependListener=function(e,t,n){return this._on(e,t,!0,n)},I.prototype.onAny=function(e){return this._onAny(e,!1)},I.prototype.prependAny=function(e){return this._onAny(e,!0)},I.prototype.addListener=I.prototype.on,I.prototype._onAny=function(e,t){if("function"!=typeof e)throw new Error("onAny only accepts instances of Function");return this._all||(this._all=[]),t?this._all.unshift(e):this._all.push(e),this},I.prototype._on=function(e,n,i,r){if("function"==typeof e)return this._onAny(e,n),this;if("function"!=typeof n)throw new Error("on only accepts instances of Function");this._events||c.call(this);var s,o=this;return r!==t&&(n=(s=x.call(this,e,n,r))[0],o=s[1]),this._newListener&&this.emit("newListener",e,n),this.wildcard?(k.call(this,e,n,i),o):(this._events[e]?("function"==typeof this._events[e]&&(this._events[e]=[this._events[e]]),i?this._events[e].unshift(n):this._events[e].push(n),!this._events[e].warned&&this._maxListeners>0&&this._events[e].length>this._maxListeners&&(this._events[e].warned=!0,u.call(this,this._events[e].length,e))):this._events[e]=n,o)},I.prototype.off=function(e,t){if("function"!=typeof t)throw new Error("removeListener only takes instances of Function");var n,r=[];if(this.wildcard){var s="string"==typeof e?e.split(this.delimiter):e.slice();if(!(r=C.call(this,null,s,this.listenerTree,0)))return this}else{if(!this._events[e])return this;n=this._events[e],r.push({_listeners:n})}for(var o=0;o<r.length;o++){var a=r[o];if(n=a._listeners,i(n)){for(var l=-1,c=0,h=n.length;c<h;c++)if(n[c]===t||n[c].listener&&n[c].listener===t||n[c]._origin&&n[c]._origin===t){l=c;break}if(l<0)continue;return this.wildcard?a._listeners.splice(l,1):this._events[e].splice(l,1),0===n.length&&(this.wildcard?delete a._listeners:delete this._events[e]),this._removeListener&&this.emit("removeListener",e,t),this}(n===t||n.listener&&n.listener===t||n._origin&&n._origin===t)&&(this.wildcard?delete a._listeners:delete this._events[e],this._removeListener&&this.emit("removeListener",e,t))}return this.listenerTree&&E(this.listenerTree),this},I.prototype.offAny=function(e){var t,n=0,i=0;if(e&&this._all&&this._all.length>0){for(n=0,i=(t=this._all).length;n<i;n++)if(e===t[n])return t.splice(n,1),this._removeListener&&this.emit("removeListenerAny",e),this}else{if(t=this._all,this._removeListener)for(n=0,i=t.length;n<i;n++)this.emit("removeListenerAny",t[n]);this._all=[]}return this},I.prototype.removeListener=I.prototype.off,I.prototype.removeAllListeners=function(e){if(e===t)return!this._events||c.call(this),this;if(this.wildcard){var n,i=C.call(this,null,e,this.listenerTree,0);if(!i)return this;for(n=0;n<i.length;n++)i[n]._listeners=null;this.listenerTree&&E(this.listenerTree)}else this._events&&(this._events[e]=null);return this},I.prototype.listeners=function(e){var n,i,r,s,o,a=this._events;if(e===t){if(this.wildcard)throw Error("event name required for wildcard emitter");if(!a)return[];for(s=(n=l(a)).length,r=[];s-- >0;)"function"==typeof(i=a[n[s]])?r.push(i):r.push.apply(r,i);return r}if(this.wildcard){if(!(o=this.listenerTree))return[];var c=[],h="string"==typeof e?e.split(this.delimiter):e.slice();return C.call(this,c,h,o,0),c}return a&&(i=a[e])?"function"==typeof i?[i]:i:[]},I.prototype.eventNames=function(e){var t=this._events;return this.wildcard?T.call(this,this.listenerTree,[],null,e):t?l(t):[]},I.prototype.listenerCount=function(e){return this.listeners(e).length},I.prototype.hasListeners=function(e){if(this.wildcard){var n=[],i="string"==typeof e?e.split(this.delimiter):e.slice();return C.call(this,n,i,this.listenerTree,0),n.length>0}var r=this._events,s=this._all;return!!(s&&s.length||r&&(e===t?l(r).length:r[e]))},I.prototype.listenersAny=function(){return this._all?this._all:[]},I.prototype.waitFor=function(e,n){var i=this,r=typeof n;return"number"===r?n={timeout:n}:"function"===r&&(n={filter:n}),b((n=_(n,{timeout:0,filter:t,handleError:!1,Promise:Promise,overload:!1},{filter:y,Promise:m})).Promise,(function(t,r,s){function o(){var s=n.filter;if(!s||s.apply(i,arguments))if(i.off(e,o),n.handleError){var a=arguments[0];a?r(a):t(d.apply(null,arguments).slice(1))}else t(d.apply(null,arguments))}s((function(){i.off(e,o)})),i._on(e,o,!1)}),{timeout:n.timeout,overload:n.overload})};var N=I.prototype;Object.defineProperties(I,{defaultMaxListeners:{get:function(){return N._maxListeners},set:function(e){if("number"!=typeof e||e<0||Number.isNaN(e))throw TypeError("n must be a non-negative number");N._maxListeners=e},enumerable:!0},once:{value:function(e,t,n){return b((n=_(n,{Promise:Promise,timeout:0,overload:!1},{Promise:m})).Promise,(function(n,i,r){var s;if("function"==typeof e.addEventListener)return s=function(){n(d.apply(null,arguments))},r((function(){e.removeEventListener(t,s)})),void e.addEventListener(t,s,{once:!0});var o,a=function(){o&&e.removeListener("error",o),n(d.apply(null,arguments))};"error"!==t&&(o=function(n){e.removeListener(t,a),i(n)},e.once("error",o)),r((function(){o&&e.removeListener("error",o),e.removeListener(t,a)})),e.once(t,a)}),{timeout:n.timeout,overload:n.overload})},writable:!0,configurable:!0}}),Object.defineProperties(N,{_maxListeners:{value:10,writable:!0,configurable:!0},_observers:{value:null,writable:!0,configurable:!0}}),"function"==typeof t&&t.amd?t((function(){return I})):e.exports=I}()),Pc;var e}function Dc(){if(bc)return vc;bc=1;var e=mc();gc();var t=Ac().EventEmitter2;function n(e){e=e||{},this.ros=e.ros,this.name=e.name,this.serviceType=e.serviceType,this.isAdvertised=!1,this._serviceCallback=null}return n.prototype.__proto__=t.prototype,n.prototype.callService=function(t,n,i){if(!this.isAdvertised){var r="call_service:"+this.name+":"+ ++this.ros.idCounter;(n||i)&&this.ros.once(r,(function(t){void 0!==t.result&&!1===t.result?"function"==typeof i&&i(t.values):"function"==typeof n&&n(new e(t.values))}));var s={op:"call_service",id:r,service:this.name,type:this.serviceType,args:t};this.ros.callOnConnection(s)}},n.prototype.advertise=function(e){this.isAdvertised||"function"!=typeof e||(this._serviceCallback=e,this.ros.on(this.name,this._serviceResponse.bind(this)),this.ros.callOnConnection({op:"advertise_service",type:this.serviceType,service:this.name}),this.isAdvertised=!0)},n.prototype.unadvertise=function(){this.isAdvertised&&(this.ros.callOnConnection({op:"unadvertise_service",service:this.name}),this.isAdvertised=!1)},n.prototype._serviceResponse=function(t){var n={},i=this._serviceCallback(t.args,n),r={op:"service_response",service:this.name,values:new e(n),result:i};t.id&&(r.id=t.id),this.ros.callOnConnection(r)},vc=n}function Lc(){if(Cc)return wc;Cc=1;var e=ql(),t=ec(),n=_c(),i=Dc(),r=gc(),s=Fl,o=Ac().EventEmitter2;function a(e){e=e||{};var t=this;this.socket=null,this.idCounter=0,this.isConnected=!1,this.transportLibrary=e.transportLibrary||"websocket",this.transportOptions=e.transportOptions||{},this._sendFunc=function(e){t.sendEncodedMessage(e)},void 0===e.groovyCompatibility?this.groovyCompatibility=!0:this.groovyCompatibility=e.groovyCompatibility,this.setMaxListeners(0),e.url&&this.connect(e.url)}return a.prototype.__proto__=o.prototype,a.prototype.connect=function(i){if("socket.io"===this.transportLibrary)this.socket=s(io(i,{"force new connection":!0}),n(this)),this.socket.on("connect",this.socket.onopen),this.socket.on("data",this.socket.onmessage),this.socket.on("close",this.socket.onclose),this.socket.on("error",this.socket.onerror);else if("RTCPeerConnection"===this.transportLibrary.constructor.name)this.socket=s(this.transportLibrary.createDataChannel(i,this.transportOptions),n(this));else if("websocket"===this.transportLibrary){if(!this.socket||this.socket.readyState===e.CLOSED){var r=new e(i);r.binaryType="arraybuffer",this.socket=s(r,n(this))}}else{if("workersocket"!==this.transportLibrary)throw"Unknown transportLibrary: "+this.transportLibrary.toString();this.socket=s(new t(i),n(this))}},a.prototype.close=function(){this.socket&&this.socket.close()},a.prototype.authenticate=function(e,t,n,i,r,s,o){var a={op:"auth",mac:e,client:t,dest:n,rand:i,t:r,level:s,end:o};this.callOnConnection(a)},a.prototype.sendEncodedMessage=function(e){var t=null,n=this;t="socket.io"===this.transportLibrary?function(e){n.socket.emit("operation",e)}:function(e){n.socket.send(e)},this.isConnected?t(e):n.once("connection",(function(){t(e)}))},a.prototype.callOnConnection=function(e){this.transportOptions.encoder?this.transportOptions.encoder(e,this._sendFunc):this._sendFunc(JSON.stringify(e))},a.prototype.setStatusLevel=function(e,t){var n={op:"set_level",level:e,id:t};this.callOnConnection(n)},a.prototype.getActionServers=function(e,t){var n=new i({ros:this,name:"/rosapi/action_servers",serviceType:"rosapi/GetActionServers"}),s=new r({});"function"==typeof t?n.callService(s,(function(t){e(t.action_servers)}),(function(e){t(e)})):n.callService(s,(function(t){e(t.action_servers)}))},a.prototype.getTopics=function(e,t){var n=new i({ros:this,name:"/rosapi/topics",serviceType:"rosapi/Topics"}),s=new r;"function"==typeof t?n.callService(s,(function(t){e(t)}),(function(e){t(e)})):n.callService(s,(function(t){e(t)}))},a.prototype.getTopicsForType=function(e,t,n){var s=new i({ros:this,name:"/rosapi/topics_for_type",serviceType:"rosapi/TopicsForType"}),o=new r({type:e});"function"==typeof n?s.callService(o,(function(e){t(e.topics)}),(function(e){n(e)})):s.callService(o,(function(e){t(e.topics)}))},a.prototype.getServices=function(e,t){var n=new i({ros:this,name:"/rosapi/services",serviceType:"rosapi/Services"}),s=new r;"function"==typeof t?n.callService(s,(function(t){e(t.services)}),(function(e){t(e)})):n.callService(s,(function(t){e(t.services)}))},a.prototype.getServicesForType=function(e,t,n){var s=new i({ros:this,name:"/rosapi/services_for_type",serviceType:"rosapi/ServicesForType"}),o=new r({type:e});"function"==typeof n?s.callService(o,(function(e){t(e.services)}),(function(e){n(e)})):s.callService(o,(function(e){t(e.services)}))},a.prototype.getServiceRequestDetails=function(e,t,n){var s=new i({ros:this,name:"/rosapi/service_request_details",serviceType:"rosapi/ServiceRequestDetails"}),o=new r({type:e});"function"==typeof n?s.callService(o,(function(e){t(e)}),(function(e){n(e)})):s.callService(o,(function(e){t(e)}))},a.prototype.getServiceResponseDetails=function(e,t,n){var s=new i({ros:this,name:"/rosapi/service_response_details",serviceType:"rosapi/ServiceResponseDetails"}),o=new r({type:e});"function"==typeof n?s.callService(o,(function(e){t(e)}),(function(e){n(e)})):s.callService(o,(function(e){t(e)}))},a.prototype.getNodes=function(e,t){var n=new i({ros:this,name:"/rosapi/nodes",serviceType:"rosapi/Nodes"}),s=new r;"function"==typeof t?n.callService(s,(function(t){e(t.nodes)}),(function(e){t(e)})):n.callService(s,(function(t){e(t.nodes)}))},a.prototype.getNodeDetails=function(e,t,n){var s=new i({ros:this,name:"/rosapi/node_details",serviceType:"rosapi/NodeDetails"}),o=new r({node:e});"function"==typeof n?s.callService(o,(function(e){t(e.subscribing,e.publishing,e.services)}),(function(e){n(e)})):s.callService(o,(function(e){t(e)}))},a.prototype.getParams=function(e,t){var n=new i({ros:this,name:"/rosapi/get_param_names",serviceType:"rosapi/GetParamNames"}),s=new r;"function"==typeof t?n.callService(s,(function(t){e(t.names)}),(function(e){t(e)})):n.callService(s,(function(t){e(t.names)}))},a.prototype.getTopicType=function(e,t,n){var s=new i({ros:this,name:"/rosapi/topic_type",serviceType:"rosapi/TopicType"}),o=new r({topic:e});"function"==typeof n?s.callService(o,(function(e){t(e.type)}),(function(e){n(e)})):s.callService(o,(function(e){t(e.type)}))},a.prototype.getServiceType=function(e,t,n){var s=new i({ros:this,name:"/rosapi/service_type",serviceType:"rosapi/ServiceType"}),o=new r({service:e});"function"==typeof n?s.callService(o,(function(e){t(e.type)}),(function(e){n(e)})):s.callService(o,(function(e){t(e.type)}))},a.prototype.getMessageDetails=function(e,t,n){var s=new i({ros:this,name:"/rosapi/message_details",serviceType:"rosapi/MessageDetails"}),o=new r({type:e});"function"==typeof n?s.callService(o,(function(e){t(e.typedefs)}),(function(e){n(e)})):s.callService(o,(function(e){t(e.typedefs)}))},a.prototype.decodeTypeDefs=function(e){var t=this,n=function(e,i){for(var r={},s=0;s<e.fieldnames.length;s++){var o=e.fieldarraylen[s],a=e.fieldnames[s],l=e.fieldtypes[s];if(-1===l.indexOf("/"))r[a]=-1===o?l:[l];else{for(var c=!1,h=0;h<i.length;h++)if(i[h].type.toString()===l.toString()){c=i[h];break}if(c){var u=n(c,i);-1===o||(r[a]=[u])}else t.emit("error","Cannot find "+l+" in decodeTypeDefs")}}return r};return n(e[0],e)},a.prototype.getTopicsAndRawTypes=function(e,t){var n=new i({ros:this,name:"/rosapi/topics_and_raw_types",serviceType:"rosapi/TopicsAndRawTypes"}),s=new r;"function"==typeof t?n.callService(s,(function(t){e(t)}),(function(e){t(e)})):n.callService(s,(function(t){e(t)}))},wc=a}function Oc(){if(Tc)return kc;Tc=1;var e=Fl;return kc=function(t){e(this,t)}}function Fc(){if(Sc)return Ec;Sc=1;var e=Ac().EventEmitter2,t=Oc();function n(e){e=e||{},this.ros=e.ros,this.name=e.name,this.messageType=e.messageType,this.isAdvertised=!1,this.compression=e.compression||"none",this.throttle_rate=e.throttle_rate||0,this.latch=e.latch||!1,this.queue_size=e.queue_size||100,this.queue_length=e.queue_length||0,this.reconnect_on_close=void 0===e.reconnect_on_close||e.reconnect_on_close,this.compression&&"png"!==this.compression&&"cbor"!==this.compression&&"cbor-raw"!==this.compression&&"none"!==this.compression&&(this.emit("warning",this.compression+" compression is not supported. No compression will be used."),this.compression="none"),this.throttle_rate<0&&(this.emit("warning",this.throttle_rate+" is not allowed. Set to 0"),this.throttle_rate=0);var n=this;this.reconnect_on_close?this.callForSubscribeAndAdvertise=function(e){n.ros.callOnConnection(e),n.waitForReconnect=!1,n.reconnectFunc=function(){n.waitForReconnect||(n.waitForReconnect=!0,n.ros.callOnConnection(e),n.ros.once("connection",(function(){n.waitForReconnect=!1})))},n.ros.on("close",n.reconnectFunc)}:this.callForSubscribeAndAdvertise=this.ros.callOnConnection,this._messageCallback=function(e){n.emit("message",new t(e))}}return n.prototype.__proto__=e.prototype,n.prototype.subscribe=function(e){"function"==typeof e&&this.on("message",e),this.subscribeId||(this.ros.on(this.name,this._messageCallback),this.subscribeId="subscribe:"+this.name+":"+ ++this.ros.idCounter,this.callForSubscribeAndAdvertise({op:"subscribe",id:this.subscribeId,type:this.messageType,topic:this.name,compression:this.compression,throttle_rate:this.throttle_rate,queue_length:this.queue_length}))},n.prototype.unsubscribe=function(e){e&&(this.off("message",e),this.listeners("message").length)||this.subscribeId&&(this.ros.off(this.name,this._messageCallback),this.reconnect_on_close&&this.ros.off("close",this.reconnectFunc),this.emit("unsubscribe"),this.ros.callOnConnection({op:"unsubscribe",id:this.subscribeId,topic:this.name}),this.subscribeId=null)},n.prototype.advertise=function(){if(!this.isAdvertised&&(this.advertiseId="advertise:"+this.name+":"+ ++this.ros.idCounter,this.callForSubscribeAndAdvertise({op:"advertise",id:this.advertiseId,type:this.messageType,topic:this.name,latch:this.latch,queue_size:this.queue_size}),this.isAdvertised=!0,!this.reconnect_on_close)){var e=this;this.ros.on("close",(function(){e.isAdvertised=!1}))}},n.prototype.unadvertise=function(){this.isAdvertised&&(this.reconnect_on_close&&this.ros.off("close",this.reconnectFunc),this.emit("unadvertise"),this.ros.callOnConnection({op:"unadvertise",id:this.advertiseId,topic:this.name}),this.isAdvertised=!1)},n.prototype.publish=function(e){this.isAdvertised||this.advertise(),this.ros.idCounter++;var t={op:"publish",id:"publish:"+this.name+":"+this.ros.idCounter,topic:this.name,msg:e,latch:this.latch};this.ros.callOnConnection(t)},Ec=n}function Mc(){if(Ic)return xc;Ic=1;var e=Dc(),t=gc();function n(e){e=e||{},this.ros=e.ros,this.name=e.name}return n.prototype.get=function(n){var i=new e({ros:this.ros,name:"/rosapi/get_param",serviceType:"rosapi/GetParam"}),r=new t({name:this.name});i.callService(r,(function(e){var t=JSON.parse(e.value);n(t)}))},n.prototype.set=function(n,i){var r=new e({ros:this.ros,name:"/rosapi/set_param",serviceType:"rosapi/SetParam"}),s=new t({name:this.name,value:JSON.stringify(n)});r.callService(s,i)},n.prototype.delete=function(n){var i=new e({ros:this.ros,name:"/rosapi/delete_param",serviceType:"rosapi/DeleteParam"}),r=new t({name:this.name});i.callService(r,n)},xc=n}var jc,Bc,qc,zc,Uc,Wc,$c,Hc,Vc,Gc,Jc,Qc,Yc,Kc,Xc,Zc,eh,th,nh,ih={},rh={get exports(){return ih},set exports(e){ih=e}};function sh(){if(Bc)return jc;Bc=1;var e=Fc(),t=Oc(),n=Ac().EventEmitter2;function i(t){var n=this;t=t||{},this.ros=t.ros,this.serverName=t.serverName,this.actionName=t.actionName,this.timeout=t.timeout,this.omitFeedback=t.omitFeedback,this.omitStatus=t.omitStatus,this.omitResult=t.omitResult,this.goals={};var i=!1;this.feedbackListener=new e({ros:this.ros,name:this.serverName+"/feedback",messageType:this.actionName+"Feedback"}),this.statusListener=new e({ros:this.ros,name:this.serverName+"/status",messageType:"actionlib_msgs/GoalStatusArray"}),this.resultListener=new e({ros:this.ros,name:this.serverName+"/result",messageType:this.actionName+"Result"}),this.goalTopic=new e({ros:this.ros,name:this.serverName+"/goal",messageType:this.actionName+"Goal"}),this.cancelTopic=new e({ros:this.ros,name:this.serverName+"/cancel",messageType:"actionlib_msgs/GoalID"}),this.goalTopic.advertise(),this.cancelTopic.advertise(),this.omitStatus||this.statusListener.subscribe((function(e){i=!0,e.status_list.forEach((function(e){var t=n.goals[e.goal_id.id];t&&t.emit("status",e)}))})),this.omitFeedback||this.feedbackListener.subscribe((function(e){var t=n.goals[e.status.goal_id.id];t&&(t.emit("status",e.status),t.emit("feedback",e.feedback))})),this.omitResult||this.resultListener.subscribe((function(e){var t=n.goals[e.status.goal_id.id];t&&(t.emit("status",e.status),t.emit("result",e.result))})),this.timeout&&setTimeout((function(){i||n.emit("timeout")}),this.timeout)}return i.prototype.__proto__=n.prototype,i.prototype.cancel=function(){var e=new t;this.cancelTopic.publish(e)},i.prototype.dispose=function(){this.goalTopic.unadvertise(),this.cancelTopic.unadvertise(),this.omitStatus||this.statusListener.unsubscribe(),this.omitFeedback||this.feedbackListener.unsubscribe(),this.omitResult||this.resultListener.unsubscribe()},jc=i}function oh(){if(zc)return qc;zc=1;var e=Fc();Oc();var t=Ac().EventEmitter2;function n(t){var n=this;t=t||{},this.ros=t.ros,this.serverName=t.serverName,this.actionName=t.actionName,this.timeout=t.timeout,this.omitFeedback=t.omitFeedback,this.omitStatus=t.omitStatus,this.omitResult=t.omitResult;var i=new e({ros:this.ros,name:this.serverName+"/goal",messageType:this.actionName+"Goal"}),r=new e({ros:this.ros,name:this.serverName+"/feedback",messageType:this.actionName+"Feedback"}),s=new e({ros:this.ros,name:this.serverName+"/status",messageType:"actionlib_msgs/GoalStatusArray"}),o=new e({ros:this.ros,name:this.serverName+"/result",messageType:this.actionName+"Result"});i.subscribe((function(e){n.emit("goal",e)})),s.subscribe((function(e){e.status_list.forEach((function(e){n.emit("status",e)}))})),r.subscribe((function(e){n.emit("status",e.status),n.emit("feedback",e.feedback)})),o.subscribe((function(e){n.emit("status",e.status),n.emit("result",e.result)}))}return n.prototype.__proto__=t.prototype,qc=n}function ah(){if(Wc)return Uc;Wc=1;var e=Oc(),t=Ac().EventEmitter2;function n(t){var n=this;this.actionClient=t.actionClient,this.goalMessage=t.goalMessage,this.isFinished=!1;var i=new Date;this.goalID="goal_"+Math.random()+"_"+i.getTime(),this.goalMessage=new e({goal_id:{stamp:{secs:0,nsecs:0},id:this.goalID},goal:this.goalMessage}),this.on("status",(function(e){n.status=e})),this.on("result",(function(e){n.isFinished=!0,n.result=e})),this.on("feedback",(function(e){n.feedback=e})),this.actionClient.goals[this.goalID]=this}return n.prototype.__proto__=t.prototype,n.prototype.send=function(e){var t=this;t.actionClient.goalTopic.publish(t.goalMessage),e&&setTimeout((function(){t.isFinished||t.emit("timeout")}),e)},n.prototype.cancel=function(){var t=new e({id:this.goalID});this.actionClient.cancelTopic.publish(t)},Uc=n}function lh(){if(Hc)return $c;Hc=1;var e=Fc(),t=Oc(),n=Ac().EventEmitter2;function i(n){var i=this;n=n||{},this.ros=n.ros,this.serverName=n.serverName,this.actionName=n.actionName,this.feedbackPublisher=new e({ros:this.ros,name:this.serverName+"/feedback",messageType:this.actionName+"Feedback"}),this.feedbackPublisher.advertise();var r=new e({ros:this.ros,name:this.serverName+"/status",messageType:"actionlib_msgs/GoalStatusArray"});r.advertise(),this.resultPublisher=new e({ros:this.ros,name:this.serverName+"/result",messageType:this.actionName+"Result"}),this.resultPublisher.advertise();var s=new e({ros:this.ros,name:this.serverName+"/goal",messageType:this.actionName+"Goal"}),o=new e({ros:this.ros,name:this.serverName+"/cancel",messageType:"actionlib_msgs/GoalID"});this.statusMessage=new t({header:{stamp:{secs:0,nsecs:100},frame_id:""},status_list:[]}),this.currentGoal=null,this.nextGoal=null,s.subscribe((function(e){i.currentGoal?(i.nextGoal=e,i.emit("cancel")):(i.statusMessage.status_list=[{goal_id:e.goal_id,status:1}],i.currentGoal=e,i.emit("goal",e.goal))}));var a=function(e,t){return!(e.secs>t.secs)&&(e.secs<t.secs||e.nsecs<t.nsecs)};o.subscribe((function(e){0===e.stamp.secs&&0===e.stamp.secs&&""===e.id?(i.nextGoal=null,i.currentGoal&&i.emit("cancel")):(i.currentGoal&&e.id===i.currentGoal.goal_id.id?i.emit("cancel"):i.nextGoal&&e.id===i.nextGoal.goal_id.id&&(i.nextGoal=null),i.nextGoal&&a(i.nextGoal.goal_id.stamp,e.stamp)&&(i.nextGoal=null),i.currentGoal&&a(i.currentGoal.goal_id.stamp,e.stamp)&&i.emit("cancel"))})),setInterval((function(){var e=new Date,t=Math.floor(e.getTime()/1e3),n=Math.round(1e9*(e.getTime()/1e3-t));i.statusMessage.header.stamp.secs=t,i.statusMessage.header.stamp.nsecs=n,r.publish(i.statusMessage)}),500)}return i.prototype.__proto__=n.prototype,i.prototype.setSucceeded=function(e){var n=new t({status:{goal_id:this.currentGoal.goal_id,status:3},result:e});this.resultPublisher.publish(n),this.statusMessage.status_list=[],this.nextGoal?(this.currentGoal=this.nextGoal,this.nextGoal=null,this.emit("goal",this.currentGoal.goal)):this.currentGoal=null},i.prototype.setAborted=function(e){var n=new t({status:{goal_id:this.currentGoal.goal_id,status:4},result:e});this.resultPublisher.publish(n),this.statusMessage.status_list=[],this.nextGoal?(this.currentGoal=this.nextGoal,this.nextGoal=null,this.emit("goal",this.currentGoal.goal)):this.currentGoal=null},i.prototype.sendFeedback=function(e){var n=new t({status:{goal_id:this.currentGoal.goal_id,status:1},feedback:e});this.feedbackPublisher.publish(n)},i.prototype.setPreempted=function(){this.statusMessage.status_list=[];var e=new t({status:{goal_id:this.currentGoal.goal_id,status:2}});this.resultPublisher.publish(e),this.nextGoal?(this.currentGoal=this.nextGoal,this.nextGoal=null,this.emit("goal",this.currentGoal.goal)):this.currentGoal=null},$c=i}function ch(){if(Jc)return Gc;function e(e){e=e||{},this.x=e.x||0,this.y=e.y||0,this.z=e.z||0}return Jc=1,e.prototype.add=function(e){this.x+=e.x,this.y+=e.y,this.z+=e.z},e.prototype.subtract=function(e){this.x-=e.x,this.y-=e.y,this.z-=e.z},e.prototype.multiplyQuaternion=function(e){var t=e.w*this.x+e.y*this.z-e.z*this.y,n=e.w*this.y+e.z*this.x-e.x*this.z,i=e.w*this.z+e.x*this.y-e.y*this.x,r=-e.x*this.x-e.y*this.y-e.z*this.z;this.x=t*e.w+r*-e.x+n*-e.z-i*-e.y,this.y=n*e.w+r*-e.y+i*-e.x-t*-e.z,this.z=i*e.w+r*-e.z+t*-e.y-n*-e.x},e.prototype.clone=function(){return new e(this)},Gc=e}function hh(){if(Yc)return Qc;function e(e){e=e||{},this.x=e.x||0,this.y=e.y||0,this.z=e.z||0,this.w="number"==typeof e.w?e.w:1}return Yc=1,e.prototype.conjugate=function(){this.x*=-1,this.y*=-1,this.z*=-1},e.prototype.norm=function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)},e.prototype.normalize=function(){var e=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);0===e?(this.x=0,this.y=0,this.z=0,this.w=1):(e=1/e,this.x=this.x*e,this.y=this.y*e,this.z=this.z*e,this.w=this.w*e)},e.prototype.invert=function(){this.conjugate(),this.normalize()},e.prototype.multiply=function(e){var t=this.x*e.w+this.y*e.z-this.z*e.y+this.w*e.x,n=-this.x*e.z+this.y*e.w+this.z*e.x+this.w*e.y,i=this.x*e.y-this.y*e.x+this.z*e.w+this.w*e.z,r=-this.x*e.x-this.y*e.y-this.z*e.z+this.w*e.w;this.x=t,this.y=n,this.z=i,this.w=r},e.prototype.clone=function(){return new e(this)},Qc=e}function uh(){if(Xc)return Kc;Xc=1;var e=ch(),t=hh();function n(n){n=n||{},this.position=new e(n.position),this.orientation=new t(n.orientation)}return n.prototype.applyTransform=function(e){this.position.multiplyQuaternion(e.rotation),this.position.add(e.translation);var t=e.rotation.clone();t.multiply(this.orientation),this.orientation=t},n.prototype.clone=function(){return new n(this)},n.prototype.multiply=function(e){var t=e.clone();return t.applyTransform({rotation:this.orientation,translation:this.position}),t},n.prototype.getInverse=function(){var e=this.clone();return e.orientation.invert(),e.position.multiplyQuaternion(e.orientation),e.position.x*=-1,e.position.y*=-1,e.position.z*=-1,e},Kc=n}function dh(){if(eh)return Zc;eh=1;var e=ch(),t=hh();function n(n){n=n||{},this.translation=new e(n.translation),this.rotation=new t(n.rotation)}return n.prototype.clone=function(){return new n(this)},Zc=n}var ph,fh,_h,mh,gh,yh,vh,bh,wh,Ch,kh,Th,Eh,Sh,xh,Ih,Nh,Ph,Rh,Ah,Dh,Lh,Oh,Fh={},Mh={get exports(){return Fh},set exports(e){Fh=e}};function jh(){if(fh)return ph;fh=1;var e=sh(),t=ah(),n=Dc(),i=gc(),r=Fc(),s=dh();function o(t){t=t||{},this.ros=t.ros,this.fixedFrame=t.fixedFrame||"/base_link",this.angularThres=t.angularThres||2,this.transThres=t.transThres||.01,this.rate=t.rate||10,this.updateDelay=t.updateDelay||50;var i=t.topicTimeout||2,r=Math.floor(i),s=Math.floor(1e9*(i-r));this.topicTimeout={secs:r,nsecs:s},this.serverName=t.serverName||"/tf2_web_republisher",this.repubServiceName=t.repubServiceName||"/republish_tfs",this.currentGoal=!1,this.currentTopic=!1,this.frameInfos={},this.republisherUpdateRequested=!1,this._subscribeCB=null,this._isDisposed=!1,this.actionClient=new e({ros:t.ros,serverName:this.serverName,actionName:"tf2_web_republisher/TFSubscriptionAction",omitStatus:!0,omitResult:!0}),this.serviceClient=new n({ros:t.ros,name:this.repubServiceName,serviceType:"tf2_web_republisher/RepublishTFs"})}return o.prototype.processTFArray=function(e){e.transforms.forEach((function(e){var t=e.child_frame_id;"/"===t[0]&&(t=t.substring(1));var n=this.frameInfos[t];n&&(n.transform=new s({translation:e.transform.translation,rotation:e.transform.rotation}),n.cbs.forEach((function(e){e(n.transform)})))}),this)},o.prototype.updateGoal=function(){var e={source_frames:Object.keys(this.frameInfos),target_frame:this.fixedFrame,angular_thres:this.angularThres,trans_thres:this.transThres,rate:this.rate};if(this.ros.groovyCompatibility)this.currentGoal&&this.currentGoal.cancel(),this.currentGoal=new t({actionClient:this.actionClient,goalMessage:e}),this.currentGoal.on("feedback",this.processTFArray.bind(this)),this.currentGoal.send();else{e.timeout=this.topicTimeout;var n=new i(e);this.serviceClient.callService(n,this.processResponse.bind(this))}this.republisherUpdateRequested=!1},o.prototype.processResponse=function(e){this._isDisposed||(this.currentTopic&&this.currentTopic.unsubscribe(this._subscribeCB),this.currentTopic=new r({ros:this.ros,name:e.topic_name,messageType:"tf2_web_republisher/TFArray"}),this._subscribeCB=this.processTFArray.bind(this),this.currentTopic.subscribe(this._subscribeCB))},o.prototype.subscribe=function(e,t){"/"===e[0]&&(e=e.substring(1)),this.frameInfos[e]?this.frameInfos[e].transform&&t(this.frameInfos[e].transform):(this.frameInfos[e]={cbs:[]},this.republisherUpdateRequested||(setTimeout(this.updateGoal.bind(this),this.updateDelay),this.republisherUpdateRequested=!0)),this.frameInfos[e].cbs.push(t)},o.prototype.unsubscribe=function(e,t){"/"===e[0]&&(e=e.substring(1));for(var n=this.frameInfos[e],i=n&&n.cbs||[],r=i.length;r--;)i[r]===t&&i.splice(r,1);t&&0!==i.length||delete this.frameInfos[e]},o.prototype.dispose=function(){this._isDisposed=!0,this.actionClient.dispose(),this.currentTopic&&this.currentTopic.unsubscribe(this._subscribeCB)},ph=o}function Bh(){return gh?mh:(gh=1,mh={URDF_SPHERE:0,URDF_BOX:1,URDF_CYLINDER:2,URDF_MESH:3})}function qh(){if(vh)return yh;vh=1;var e=ch(),t=Bh();return yh=function(n){this.dimension=null,this.type=t.URDF_BOX;var i=n.xml.getAttribute("size").split(" ");this.dimension=new e({x:parseFloat(i[0]),y:parseFloat(i[1]),z:parseFloat(i[2])})}}function zh(){if(wh)return bh;return wh=1,bh=function(e){var t=e.xml.getAttribute("rgba").split(" ");this.r=parseFloat(t[0]),this.g=parseFloat(t[1]),this.b=parseFloat(t[2]),this.a=parseFloat(t[3])}}function Uh(){if(kh)return Ch;kh=1;var e=Bh();return Ch=function(t){this.type=e.URDF_CYLINDER,this.length=parseFloat(t.xml.getAttribute("length")),this.radius=parseFloat(t.xml.getAttribute("radius"))}}function Wh(){if(Eh)return Th;Eh=1;var e=zh();function t(t){this.textureFilename=null,this.color=null,this.name=t.xml.getAttribute("name");var n=t.xml.getElementsByTagName("texture");n.length>0&&(this.textureFilename=n[0].getAttribute("filename"));var i=t.xml.getElementsByTagName("color");i.length>0&&(this.color=new e({xml:i[0]}))}t.prototype.isLink=function(){return null===this.color&&null===this.textureFilename};var n=Fl;return t.prototype.assign=function(e){return n(this,e)},Th=t}function $h(){if(xh)return Sh;xh=1;var e=ch(),t=Bh();return Sh=function(n){this.scale=null,this.type=t.URDF_MESH,this.filename=n.xml.getAttribute("filename");var i=n.xml.getAttribute("scale");if(i){var r=i.split(" ");this.scale=new e({x:parseFloat(r[0]),y:parseFloat(r[1]),z:parseFloat(r[2])})}}}function Hh(){if(Nh)return Ih;Nh=1;var e=Bh();return Ih=function(t){this.type=e.URDF_SPHERE,this.radius=parseFloat(t.xml.getAttribute("radius"))}}function Vh(){if(Rh)return Ph;Rh=1;var e=uh(),t=ch(),n=hh(),i=Uh(),r=qh(),s=Wh(),o=$h(),a=Hh();return Ph=function(l){var c=l.xml;this.origin=null,this.geometry=null,this.material=null,this.name=l.xml.getAttribute("name");var h=c.getElementsByTagName("origin");if(0===h.length)this.origin=new e;else{var u=h[0].getAttribute("xyz"),d=new t;u&&(u=u.split(" "),d=new t({x:parseFloat(u[0]),y:parseFloat(u[1]),z:parseFloat(u[2])}));var p=h[0].getAttribute("rpy"),f=new n;if(p){p=p.split(" ");var _=parseFloat(p[0])/2,m=parseFloat(p[1])/2,g=parseFloat(p[2])/2,y=Math.sin(_)*Math.cos(m)*Math.cos(g)-Math.cos(_)*Math.sin(m)*Math.sin(g),v=Math.cos(_)*Math.sin(m)*Math.cos(g)+Math.sin(_)*Math.cos(m)*Math.sin(g),b=Math.cos(_)*Math.cos(m)*Math.sin(g)-Math.sin(_)*Math.sin(m)*Math.cos(g),w=Math.cos(_)*Math.cos(m)*Math.cos(g)+Math.sin(_)*Math.sin(m)*Math.sin(g);(f=new n({x:y,y:v,z:b,w:w})).normalize()}this.origin=new e({position:d,orientation:f})}var C=c.getElementsByTagName("geometry");if(C.length>0){for(var k=C[0],T=null,E=0;E<k.childNodes.length;E++){var S=k.childNodes[E];if(1===S.nodeType){T=S;break}}var x=T.nodeName;"sphere"===x?this.geometry=new a({xml:T}):"box"===x?this.geometry=new r({xml:T}):"cylinder"===x?this.geometry=new i({xml:T}):"mesh"===x?this.geometry=new o({xml:T}):console.warn("Unknown geometry type "+x)}var I=c.getElementsByTagName("material");I.length>0&&(this.material=new s({xml:I[0]}))}}function Gh(){if(Dh)return Ah;Dh=1;var e=Vh();return Ah=function(t){this.name=t.xml.getAttribute("name"),this.visuals=[];for(var n=t.xml.getElementsByTagName("visual"),i=0;i<n.length;i++)this.visuals.push(new e({xml:n[i]}))}}var Jh,Qh,Yh,Kh,Xh,Zh={};function eu(){if(Yh)return Qh;Yh=1;var e=Wh(),t=Gh(),n=function(){if(Oh)return Lh;Oh=1;var e=uh(),t=ch(),n=hh();return Lh=function(i){this.name=i.xml.getAttribute("name"),this.type=i.xml.getAttribute("type");var r=i.xml.getElementsByTagName("parent");r.length>0&&(this.parent=r[0].getAttribute("link"));var s=i.xml.getElementsByTagName("child");s.length>0&&(this.child=s[0].getAttribute("link"));var o=i.xml.getElementsByTagName("limit");o.length>0&&(this.minval=parseFloat(o[0].getAttribute("lower")),this.maxval=parseFloat(o[0].getAttribute("upper")));var a=i.xml.getElementsByTagName("origin");if(0===a.length)this.origin=new e;else{var l=a[0].getAttribute("xyz"),c=new t;l&&(l=l.split(" "),c=new t({x:parseFloat(l[0]),y:parseFloat(l[1]),z:parseFloat(l[2])}));var h=a[0].getAttribute("rpy"),u=new n;if(h){h=h.split(" ");var d=parseFloat(h[0])/2,p=parseFloat(h[1])/2,f=parseFloat(h[2])/2,_=Math.sin(d)*Math.cos(p)*Math.cos(f)-Math.cos(d)*Math.sin(p)*Math.sin(f),m=Math.cos(d)*Math.sin(p)*Math.cos(f)+Math.sin(d)*Math.cos(p)*Math.sin(f),g=Math.cos(d)*Math.cos(p)*Math.sin(f)-Math.sin(d)*Math.sin(p)*Math.cos(f),y=Math.cos(d)*Math.cos(p)*Math.cos(f)+Math.sin(d)*Math.sin(p)*Math.sin(f);(u=new n({x:_,y:m,z:g,w:y})).normalize()}this.origin=new e({position:c,orientation:u})}},Lh}(),i=(Jh||(Jh=1,Zh.DOMImplementation=window.DOMImplementation,Zh.XMLSerializer=window.XMLSerializer,Zh.DOMParser=window.DOMParser),Zh).DOMParser;return Qh=function(r){var s=(r=r||{}).xml,o=r.string;this.materials={},this.links={},this.joints={},o&&(s=(new i).parseFromString(o,"text/xml"));var a=s.documentElement;this.name=a.getAttribute("name");for(var l=a.childNodes,c=0;c<l.length;c++){var h=l[c];if("material"===h.tagName){var u=new e({xml:h});void 0!==this.materials[u.name]?this.materials[u.name].isLink()?this.materials[u.name].assign(u):console.warn("Material "+u.name+"is not unique."):this.materials[u.name]=u}else if("link"===h.tagName){var d=new t({xml:h});if(void 0!==this.links[d.name])console.warn("Link "+d.name+" is not unique.");else{for(var p=0;p<d.visuals.length;p++){var f=d.visuals[p].material;null!==f&&f.name&&(void 0!==this.materials[f.name]?d.visuals[p].material=this.materials[f.name]:this.materials[f.name]=f)}this.links[d.name]=d}}else if("joint"===h.tagName){var _=new n({xml:h});this.joints[_.name]=_}}}}var tu=Sl.ROSLIB||{REVISION:"1.3.0"},nu=Fl;nu(tu,function(){if(Nc)return Ml;Nc=1;var e=Bl(),t=jl.exports={Ros:Lc(),Topic:Fc(),Message:Oc(),Param:Mc(),Service:Dc(),ServiceRequest:gc(),ServiceResponse:mc()};return e(t.Ros,["Param","Service","Topic"],t),Ml}()),nu(tu,function(){if(Vc)return ih;Vc=1;var e=Lc();return Bl()(e,["ActionClient","SimpleActionServer"],rh.exports={ActionClient:sh(),ActionListener:oh(),Goal:ah(),SimpleActionServer:lh()}),ih}()),nu(tu,nh?th:(nh=1,th={Pose:uh(),Quaternion:hh(),Transform:dh(),Vector3:ch()})),nu(tu,function(){if(_h)return Fh;_h=1;var e=Lc();return Bl()(e,["TFClient"],Mh.exports={TFClient:jh()}),Fh}()),nu(tu,Xh?Kh:(Xh=1,Kh=Fl({UrdfBox:qh(),UrdfColor:zh(),UrdfCylinder:Uh(),UrdfLink:Gh(),UrdfMaterial:Wh(),UrdfMesh:$h(),UrdfModel:eu(),UrdfSphere:Hh(),UrdfVisual:Vh()},Bh())));var iu=tu;const ru="jibo";var su="";const ou={Red:"Red",Yellow:"Yellow",Green:"Green",Cyan:"Cyan",Blue:"Blue",Magenta:"Magenta",White:"White",Random:"Random",Off:"Off"},au={[ou.Red]:{value:{x:255,y:0,z:0}},[ou.Yellow]:{value:{x:255,y:69,z:0}},[ou.Green]:{value:{x:0,y:167,z:0}},[ou.Cyan]:{value:{x:0,y:167,z:48}},[ou.Blue]:{value:{x:0,y:0,z:255}},[ou.Magenta]:{value:{x:255,y:0,z:163}},[ou.White]:{value:{x:255,y:255,z:255}},[ou.Random]:{value:{x:-1,y:-1,z:-1}},[ou.Off]:{value:{x:0,y:0,z:0}}},lu={BackStep:"BackStep",Carlton:"Carlton",Celebrate:"Celebrate",Clockworker:"Clockworker",Doughkneader:"Doughkneader",Footstomper:"Footstomper",HappyDance:"HappyDance",Headbanger:"Headbanger",Headdipper:"Headdipper",Pigeon:"Pigeon",SlowDance:"SlowDance",RobotDance:"RobotDance",RockingChair:"RockingChair",Roxbury:"Roxbury",Samba:"Samba",Seaweed:"Seaweed",Slideshow:"Slideshow",Waltz:"Waltz",Disco:"Disco"},cu={Bawhoop:"Bawhoop",Bleep:"Bleep",Blip:"Blip",Bloop:"Bloop",BootUp:"BootUp",Disgusted_01:"Disgusted_01",Disgusted_02:"Disgusted_02",Disgusted_03:"Disgusted_03",DoYouWantToPlay:"DoYouWantToPlay",FillingUp:"FillingUp",GoodJob:"GoodJob",Holyhappiness:"Holyhappiness",ImBroken:"ImBroken",PeekABoo:"PeekABoo",Whistle:"Whistle",CheckmarkButton:"CheckmarkButton"},hu={[cu.Bawhoop]:{file:"FX_Bawhoop.mp3"},[cu.Bleep]:{file:"FX_Bleep.mp3"},[cu.Blip]:{file:"FX_Blip.mp3"},[cu.Bloop]:{file:"FX_Bloop.mp3"},[cu.BootUp]:{file:"FX_BootUp.mp3"},[cu.Disgusted_01]:{file:"FX_Disgusted_01.mp3"},[cu.Disgusted_02]:{file:"FX_Disgusted_02.mp3"},[cu.Disgusted_03]:{file:"FX_Disgusted_03.mp3"},[cu.DoYouWantToPlay]:{file:"FX_DoYouWantToPlay_01.mp3"},[cu.FillingUp]:{file:"FX_FillingUp_01.mp3"},[cu.GoodJob]:{file:"FX_GoodJob_01.mp3"},[cu.Holyhappiness]:{file:"FX_Holyhappiness.mp3"},[cu.ImBroken]:{file:"FX_ImBroken_01.mp3"},[cu.PeekABoo]:{file:"FX_PeekABoo_01.mp3"},[cu.Whistle]:{file:"FX_Whistle.mp3"},[cu.CheckmarkButton]:{file:"SFX_Global_CheckmarkButton.m4a"}},uu={[lu.BackStep]:{file:"Dances/Back_Stepper_01_01.keys"},[lu.Carlton]:{file:"Dances/Carlton_01_01.keys"},[lu.Celebrate]:{file:"Dances/Celebrate_01.keys"},[lu.Clockworker]:{file:"Dances/Clockworker_01_01.keys"},[lu.Doughkneader]:{file:"Dances/Doughkneader_01_01.keys"},[lu.Footstomper]:{file:"Dances/Footstomper_01_01.keys"},[lu.HappyDance]:{file:"Dances/Happy_Lucky_01_01.keys"},[lu.Headbanger]:{file:"Dances/Headbanger_01_01.keys"},[lu.Headdipper]:{file:"Dances/Headdipper_01_01.keys"},[lu.Pigeon]:{file:"Dances/Pigeon_01_01.keys"},[lu.SlowDance]:{file:"Dances/Prom_Night_01_01.keys"},[lu.RobotDance]:{file:"Dances/Robotic_01_01.keys"},[lu.RockingChair]:{file:"Dances/Rocking_Chair_01.keys"},[lu.Roxbury]:{file:"Dances/Roxbury_01_01.keys"},[lu.Samba]:{file:"Dances/Samba_01_01.keys"},[lu.Seaweed]:{file:"Dances/Seaweed_01_01.keys"},[lu.Slideshow]:{file:"Dances/SlideshowDance_01_01.keys"},[lu.Waltz]:{file:"Dances/Waltz_01_01.keys"},[lu.Disco]:{file:"Dances/dance_disco_00.keys"}},du={Embarassed:"Embarassed",Frustrated:"Frustrated",Laugh:"Laugh",Sad:"Sad",Thinking:"Thinking",Happy:"Happy",SadEyes:"SadEyes",Interested:"Interested",Curious:"Curious",No:"No",Yes:"Yes",Puzzled:"Puzzled",Relieved:"Relieved",Success:"Success"},pu={[du.Embarassed]:{file:"Misc/embarassed_01_02.keys"},[du.Frustrated]:{file:"Misc/Frustrated_01_04.keys"},[du.Laugh]:{file:"Misc/Laughter_01_03.keys"},[du.Sad]:{file:"Misc/Sad_03.keys"},[du.Thinking]:{file:"Misc/thinking_08.keys"},[du.Happy]:{file:"Misc/Eye_to_Happy_02.keys"},[du.SadEyes]:{file:"Misc/Eye_Sad_03_02.keys"},[du.Interested]:{file:"Misc/interested_01.keys"},[du.Curious]:{file:"Misc/Question_01_02.keys"},[du.No]:{file:"Misc/no_4.keys"},[du.Yes]:{file:"Misc/yep_02.keys"},[du.Puzzled]:{file:"Misc/puzzled_01_02.keys"},[du.Relieved]:{file:"Misc/relieved_01.keys"},[du.Success]:{file:"Misc/success_02.keys"}},fu={Airplane:"Airplane",Apple:"Apple",Art:"Art",Bowling:"Bowling",Checkmark:"Checkmark",ExclamationPoint:"ExclamationPoint",Football:"Football",Heart:"Heart",Magic:"Magic",Ocean:"Ocean",Penguin:"Penguin",Rainbow:"Rainbow",Robot:"Robot",Rocket:"Rocket",Snowflake:"Snowflake",Taco:"Taco",VideoGame:"VideoGame"},_u={[fu.Airplane]:{file:"Emoji/Emoji_Airplane_01_01.keys"},[fu.Apple]:{file:"Emoji/Emoji_AppleRed_01_01.keys"},[fu.Art]:{file:"Emoji/Emoji_Art_01_01.keys"},[fu.Bowling]:{file:"Emoji/Emoji_Bowling.keys"},[fu.Checkmark]:{file:"Emoji/Emoji_Checkmark_01_01.keys"},[fu.ExclamationPoint]:{file:"Emoji/Emoji_ExclamationYellow.keys"},[fu.Football]:{file:"Emoji/Emoji_Football_01_01.keys"},[fu.Heart]:{file:"Emoji/Emoji_HeartArrow_01_01.keys"},[fu.Magic]:{file:"Emoji/Emoji_Magic_01_02.keys"},[fu.Ocean]:{file:"Emoji/Emoji_Ocean_01_01.keys"},[fu.Penguin]:{file:"Emoji/Emoji_Penguin_01_01.keys"},[fu.Rainbow]:{file:"Emoji/Emoji_Rainbow_01_01.keys"},[fu.Robot]:{file:"Emoji/Emoji_Robot_01_01.keys"},[fu.Rocket]:{file:"Emoji/Emoji_Rocket_01_01.keys"},[fu.Snowflake]:{file:"Emoji/Emoji_Snowflake_01_01.keys"},[fu.Taco]:{file:"Emoji/Emoji_Taco_01_01.keys"},[fu.VideoGame]:{file:"Emoji/Emoji_VideoGame_01_01.keys"}};var mu={msg_type:"",anim_transition:0,attention_mode:1,audio_filename:"",do_anim_transition:!1,do_attention_mode:!1,do_led:!1,do_lookat:!1,do_motion:!1,do_sound_playback:!1,do_tts:!1,do_volume:!1,led_color:[0,100,0],lookat:[0,0,0],motion:"",tts_duration_stretch:0,tts_pitch:0,tts_text:"",volume:0};const gu=new class{constructor(){this.queue=[],this.isProcessing=!1}addToQueue(e){this.queue.push(e),this.isProcessing||this.processQueue()}processQueue(){return q(this,void 0,void 0,(function*(){for(this.isProcessing=!0;this.queue.length>0;){const e=this.queue[0];try{yield this.pushToFirebase(e),this.queue.shift()}catch(e){console.error("Error pushing data to Firebase:",e);break}}this.isProcessing=!1}))}pushToFirebase(e){return q(this,void 0,void 0,(function*(){return new Promise(((t,n)=>{setTimeout((()=>{""!=su?(El.ref("Jibo-Name/"+su).push(Object.assign({},e)).then((function(){console.log("New record for '"+su+"' created successfully as: "+e.msg_type)})).catch((function(t){console.error("Error creating new record for '"+su+"' as: "+ +e.msg_type,t)})),t(e)):console.log("No Jibo Name added.")}))}))}))}};class yu extends t.Extension{init(e){this.text="Hello! I'm Jibo!",this.animName="My Animation",this.multitask=!1,this.prevTasks=[],this.multitask_msg={},this.busy=!1,this.dances=Object.entries(lu).map((([e,t])=>({value:e,text:lu[e]}))),this.audios=Object.entries(cu).map((([e,t])=>({value:e,text:cu[e]}))),this.runtime.registerPeripheralExtension(ru,this),this.runtime.connectPeripheral(ru,0),this.ros=null,this.connected=!1,this.failed=!1,this.rosbridgeIP="ws://localhost:9090",this.jbVolume="60",this.asr_out="",this.jiboEvent=new U,this.tts=[],this.RosConnect({rosIP:"localhost"}),this.getAnimationList=()=>this.animation_list.map((e=>({text:e,value:e})))}checkBusy(e){var t=new iu.Topic({ros:this.ros,name:"/jibo_state",messageType:"jibo_msgs/JiboState"});t.subscribe((function(n){e.busy=n.is_playing_sound,t.unsubscribe()}))}defineTranslations(){}defineBlocks(){return{JiboButton:e=>({type:t.BlockType.Button,arg:{type:t.ArgumentType.String,defaultValue:"Jibo's name here"},text:()=>"Enter Jibo's name",operation:()=>e.openUI("jiboNameModal","My Jibo")}),JiboTTS:e=>({type:t.BlockType.Command,arg:{type:t.ArgumentType.String,defaultValue:"Hello, I am Jibo"},text:e=>`say ${e}`,operation:t=>e.jiboTTSFn(t)}),JiboAsk:e=>({type:t.BlockType.Command,arg:{type:t.ArgumentType.String,defaultValue:"How are you?"},text:e=>`ask ${e} and wait`,operation:t=>e.jiboAskFn(t)}),JiboListen:e=>({type:t.BlockType.Reporter,text:"answer",operation:()=>e.jiboListenFn()}),JiboDance:e=>({type:t.BlockType.Command,arg:{type:t.ArgumentType.String,options:e.dances},text:e=>`play ${e} dance`,operation:t=>q(this,void 0,void 0,(function*(){console.log("line 610 to know the dance file: "+t),console.log(JSON.stringify(uu[t]));const n=uu[t].file;yield e.jiboAnimFn(n)}))}),JiboAudio:e=>({type:t.BlockType.Command,arg:{type:t.ArgumentType.String,options:e.audios},text:e=>`play ${e} audio`,operation:t=>q(this,void 0,void 0,(function*(){console.log("The audio file: "+t),console.log(JSON.stringify(hu[t]));const n=hu[t].file;yield e.jiboAnimFn(n)}))}),JiboVolume:e=>({type:t.BlockType.Command,arg:{type:t.ArgumentType.String,defaultValue:"60"},text:e=>`set volume to ${e}`,operation:t=>e.jiboVolumeFn(t)}),JiboEmote:e=>({type:t.BlockType.Command,arg:this.makeCustomArgument({component:"EmojiArgument",initial:{value:du.Happy,text:"happy"}}),text:e=>`play ${e} emotion`,operation:t=>q(this,void 0,void 0,(function*(){console.log("line 610 to know the dance file: "+t);const n=pu[t].file;yield e.jiboAnimFn(n)}))}),JiboIcon:e=>({type:t.BlockType.Command,arg:this.makeCustomArgument({component:"IconArgument",initial:{value:fu.Taco,text:"taco"}}),text:e=>`show ${e} icon`,operation:t=>q(this,void 0,void 0,(function*(){const n=_u[t].file;yield e.jiboAnimFn(n)}))}),JiboLED:e=>({type:t.BlockType.Command,arg:this.makeCustomArgument({component:"ColorArgument",initial:{value:ou.Blue,text:"blue"}}),text:e=>`set LED ring to ${e}`,operation:t=>(()=>q(this,void 0,void 0,(function*(){yield e.jiboLEDFn(t)})))()}),JiboLook:e=>({type:t.BlockType.Command,args:[{type:t.ArgumentType.String,defaultValue:"0"},{type:t.ArgumentType.String,defaultValue:"0"},{type:t.ArgumentType.String,defaultValue:"0"}],text:(e,t,n)=>`look at ${e}, ${t}, ${n}`,operation:(t,n,i)=>e.jiboLookFn(t,n,i)}),JiboMultitask:e=>({type:t.BlockType.Command,text:"start multitask",operation:()=>{e.multitask=!0,console.log("starting multitask")}}),JiboEnd:e=>({type:t.BlockType.Command,text:"end multitask",operation:()=>{e.JiboPublish(e.multitask_msg),e.multitask=!1,e.multitask_msg={},e.prevTasks.length=0,console.log("ending multitask")}})}}connect(){console.log("this.connect")}disconnect(){}scan(){}isConnected(){return console.log("isConnected status: "+this.connected),this.connected}RosConnect(e){const t=e.rosIP.toString();if(this.rosbridgeIP="ws://"+t+":9090",!this.connected){this.ros=new iu.Ros({url:this.rosbridgeIP});let e=function(e){return function(){e.connected=!0;e.jiboTTSFn("Hello there. I am ready for you to program me.")}}(this);this.ros.on("connection",(function(){e()}));let t=function(e){return function(){e.failed=!0}}(this);this.ros.on("error",(function(e){t()}));let n=function(e){return function(){e.connected=!1}}(this);this.ros.on("close",(function(){n()}))}return this.JiboState(),this.JiboPublish({do_attention_mode:!0,attention_mode:1,do_anim_transition:!0,anim_transition:0,do_led:!0,led_color:{x:0,y:0,z:0}}),this.JiboASR_receive(),this.connected}jiboTTSFn(e){return q(this,void 0,void 0,(function*(){if(console.log("multitask: "+this.multitask),this.multitask){if(console.log(this.prevTasks),this.prevTasks.includes("tts")||this.prevTasks.includes("emote")){for(this.prevTasks.length=0,console.log("performing"),console.log(this.multitask_msg);this.busy;)console.log("hello");this.busy=!0,yield this.JiboPublish(this.multitask_msg),this.busy=!1,this.multitask_msg={}}return this.multitask_msg.do_tts=!1,this.multitask_msg.tts_text=e,this.multitask_msg.volume=parseFloat(this.jbVolume),this.prevTasks.push("tts"),void console.log(this.multitask_msg)}for(;this.busy;)console.log(this.busy),this.checkBusy(this);var t={msg_type:"JiboAction",do_tts:!0,tts_text:e,do_lookat:!1,do_motion:!1,volume:parseFloat(this.jbVolume)};gu.addToQueue(t),yield this.JiboPublish(t)}))}jiboVolumeFn(e){return q(this,void 0,void 0,(function*(){if(this.multitask)return this.prevTasks.includes("volume")&&(this.prevTasks.length=0,console.log("performing"),console.log(this.multitask_msg),this.JiboPublish(this.multitask_msg),this.multitask_msg={}),this.multitask_msg.do_volume=!0,this.multitask_msg.volume=parseFloat(e),void this.prevTasks.push("volume");this.jbVolume=e;var t={msg_type:"JiboAction",do_volume:!0,volume:parseFloat(e)};gu.addToQueue(t),this.JiboPublish(t)}))}jiboAskFn(e){return q(this,void 0,void 0,(function*(){yield this.jiboTTSFn(e).then((()=>{setTimeout((()=>{this.JiboASR_request()}),2e3)})).catch((e=>{console.error(e)}))}))}jiboListenFn(){return q(this,void 0,void 0,(function*(){try{return this.asr_out=yield this.getDataFromFirebase(),this.asr_out}catch(e){return console.error("Error:",e),!1}}))}jiboLEDFn(e){console.dir("The color from inside JiboLEDFn function is: "+e);let t=au[e].name,n=au[e].value;if(console.log("The color name is: "+JSON.stringify(n)),"Random"==t){const e=Math.floor(Math.random()*(Object.keys(au).length-2)),t=Object.keys(au)[e];n=au[t].value}if(this.multitask)return this.prevTasks.includes("led")&&(this.prevTasks.length=0,console.log("performing"),console.log(this.multitask_msg),this.JiboPublish(this.multitask_msg),this.multitask_msg={}),this.multitask_msg.do_led=!0,this.multitask_msg.led_color=n,void this.prevTasks.push("led");var i={msg_type:"JiboAction",do_led:!0,led_color:n};gu.addToQueue(i),this.JiboPublish(i)}jiboLookFn(e,t,n){return q(this,void 0,void 0,(function*(){if(this.multitask)return(this.prevTasks.includes("look")||this.prevTasks.includes("emote")||this.prevTasks.includes("emoji"))&&(console.log("performing"),console.log(this.multitask_msg),this.JiboPublish(this.multitask_msg),this.prevTasks.length=0,this.multitask_msg={}),this.multitask_msg.do_lookat=!0,this.multitask.lookat={x:parseFloat(e),y:parseFloat(t),z:parseFloat(n)},void this.prevTasks.push("look");var i={msg_type:"JiboAction",do_lookat:!0,lookat:{x:parseFloat(e),y:parseFloat(t),z:parseFloat(n)}};gu.addToQueue(i),this.JiboPublish(i)}))}jiboAnimFn(e){return q(this,void 0,void 0,(function*(){console.log("the animation file is: "+e);var t={msg_type:"JiboAction",do_motion:!0,do_tts:!1,do_lookat:!1,motion:e};gu.addToQueue(t),yield this.JiboPublish(t),yield this.JiboPublish({do_anim_transition:!0,anim_transition:0})}))}JiboPublish(e){return q(this,void 0,void 0,(function*(){if(!this.connected)return console.log("ROS is not connetced"),!1;var t=new iu.Topic({ros:this.ros,name:"/jibo",messageType:"jibo_msgs/JiboAction"}),n=new iu.Message(e);t.publish(n),yield new Promise((e=>setTimeout(e,500)))}))}JiboState(){console.log("listening...");var e=new iu.Topic({ros:this.ros,name:"/jibo_state",messageType:"jibo_msgs/JiboState"});e.subscribe((function(t){console.log("Received message on "+e.name+": "),console.log(t),e.unsubscribe()}))}JiboASR_request(){return q(this,void 0,void 0,(function*(){gu.addToQueue({msg_type:"JiboAsrCommand",command:1,heyjibo:!1,detectend:!1,continuous:!1,incremental:!1,alternatives:!1,rule:""}),console.log("Sent JiboAsrCommand to firebase")}))}JiboASR_receive(){return q(this,void 0,void 0,(function*(){return new Promise((e=>{var t=new iu.Topic({ros:this.ros,name:"/jibo_asr_result",messageType:"jibo_msgs/JiboAsrResult"});t.subscribe((function(n){console.log("Received message on "+t.name+": "),console.log(n),t.unsubscribe(),e(n.transcription)}))}))}))}readAsrAnswer(){return q(this,void 0,void 0,(function*(){return new Promise(((e,t)=>{console.log("Now reading the answer from the database: ");var n;El.ref("Jibo-Name/"+su).once("value").then((t=>{if(t.forEach((e=>{e.key,n=e.val()})),"JiboAsrResult"===n.msg_type){var i=n.transcription;console.log("The last entered answer is: "+i),e(i)}})).catch((e=>{t(e),console.error("Error retrieving data: ",e)}))}))}))}getDataFromFirebase(){return q(this,void 0,void 0,(function*(){try{return yield this.readAsrAnswer()}catch(e){throw console.error("Error:",e),e}}))}addAnimationToList(e){return this.animation_list.push(e)}}function vu(e){d(e,"svelte-uz8kwz",".colorButton.svelte-uz8kwz{border-radius:32px;height:64px;width:64px}.color.svelte-uz8kwz{background-color:var(--color)}#grid.svelte-uz8kwz{display:grid;grid-template-columns:auto auto auto;grid-gap:10px}@media screen and (max-width: 768px){#grid.svelte-uz8kwz{grid-template-columns:auto}}")}function bu(e,t,n){const i=e.slice();return i[6]=t[n],i}function wu(e){let t,n,i,r,s,o,a=ou[e[6]]+"";function l(){return e[5](e[6])}return{c(){t=m("button"),n=g(a),i=y(),b(t,"class","colorButton color svelte-uz8kwz"),C(t,"--color",ou[e[6]]),t.disabled=r=e[0]==e[6]},m(e,r){p(e,t,r),u(t,n),u(t,i),s||(o=v(t,"click",l),s=!0)},p(n,i){e=n,1&i&&r!==(r=e[0]==e[6])&&(t.disabled=r)},d(e){e&&f(t),s=!1,o()}}}function Cu(e){let t,i=Object.keys(ou),r=[];for(let t=0;t<i.length;t+=1)r[t]=wu(bu(e,i,t));return{c(){t=m("div");for(let e=0;e<r.length;e+=1)r[e].c();b(t,"id","grid"),b(t,"class","svelte-uz8kwz")},m(e,n){p(e,t,n);for(let e=0;e<r.length;e+=1)r[e]&&r[e].m(t,null)},p(e,[n]){if(1&n){let s;for(i=Object.keys(ou),s=0;s<i.length;s+=1){const o=bu(e,i,s);r[s]?r[s].p(o,n):(r[s]=wu(o),r[s].c(),r[s].m(t,null))}for(;s<r.length;s+=1)r[s].d(1);r.length=i.length}},i:n,o:n,d(e){e&&f(t),_(r,e)}}}function ku(e,t,n){let i,{setter:r}=t,{current:s}=t,{extension:o}=t,a=s.value;return e.$$set=e=>{"setter"in e&&n(1,r=e.setter),"current"in e&&n(2,s=e.current),"extension"in e&&n(3,o=e.extension)},e.$$.update=()=>{1&e.$$.dirty&&n(4,i=ou[a]),19&e.$$.dirty&&r({value:a,text:i})},[a,r,s,o,i,e=>n(0,a=e)]}function Tu(e){d(e,"svelte-13t3kpx","#grid.svelte-13t3kpx{display:grid;grid-template-columns:auto auto auto auto auto;grid-gap:10px}@media screen and (max-width: 768px){#grid.svelte-13t3kpx{grid-template-columns:auto}}.emoji.svelte-13t3kpx{width:50px}")}function Eu(e,t,n){const i=e.slice();return i[7]=t[n],i}function Su(e){let t,n,i,r,s,o,a,l;function c(){return e[6](e[7])}return{c(){t=m("button"),n=m("div"),i=m("img"),s=y(),b(i,"class","emoji svelte-13t3kpx"),h(i.src,r=e[1][du[e[7]]])||b(i,"src",r),b(i,"alt",du[e[7]]),b(n,"class","cell"),t.disabled=o=e[0]==e[7]},m(e,r){p(e,t,r),u(t,n),u(n,i),u(t,s),a||(l=v(t,"click",c),a=!0)},p(n,i){e=n,1&i&&o!==(o=e[0]==e[7])&&(t.disabled=o)},d(e){e&&f(t),a=!1,l()}}}function xu(e){let t,i=Object.keys(du),r=[];for(let t=0;t<i.length;t+=1)r[t]=Su(Eu(e,i,t));return{c(){t=m("div");for(let e=0;e<r.length;e+=1)r[e].c();b(t,"id","grid"),b(t,"class","svelte-13t3kpx")},m(e,n){p(e,t,n);for(let e=0;e<r.length;e+=1)r[e]&&r[e].m(t,null)},p(e,[n]){if(3&n){let s;for(i=Object.keys(du),s=0;s<i.length;s+=1){const o=Eu(e,i,s);r[s]?r[s].p(o,n):(r[s]=Su(o),r[s].c(),r[s].m(t,null))}for(;s<r.length;s+=1)r[s].d(1);r.length=i.length}},i:n,o:n,d(e){e&&f(t),_(r,e)}}}function Iu(e,t,n){let i;const r={[du.Curious]:"https://em-content.zobj.net/thumbs/144/apple/325/face-with-raised-eyebrow_1f928.png",[du.Embarassed]:"https://em-content.zobj.net/thumbs/144/apple/325/face-with-hand-over-mouth_1f92d.png",[du.Frustrated]:"https://em-content.zobj.net/thumbs/144/apple/325/confounded-face_1f616.png",[du.Happy]:"https://em-content.zobj.net/thumbs/144/apple/325/grinning-face_1f600.png",[du.Interested]:"https://em-content.zobj.net/thumbs/144/apple/325/star-struck_1f929.png",[du.Laugh]:"https://em-content.zobj.net/thumbs/144/apple/325/face-with-tears-of-joy_1f602.png",[du.No]:"https://em-content.zobj.net/thumbs/144/apple/325/thumbs-down_1f44e.png",[du.Puzzled]:"https://em-content.zobj.net/thumbs/144/apple/325/face-with-diagonal-mouth_1fae4.png",[du.Relieved]:"https://em-content.zobj.net/thumbs/144/apple/325/relieved-face_1f60c.png",[du.Sad]:"https://em-content.zobj.net/thumbs/144/apple/325/slightly-frowning-face_1f641.png",[du.SadEyes]:"https://em-content.zobj.net/thumbs/144/apple/325/pleading-face_1f97a.png",[du.Success]:"https://em-content.zobj.net/thumbs/240/apple/325/check-mark-button_2705.png",[du.Thinking]:"https://em-content.zobj.net/thumbs/144/apple/325/thinking-face_1f914.png",[du.Yes]:"https://em-content.zobj.net/thumbs/144/apple/325/thumbs-up_1f44d.png"};let{setter:s}=t,{current:o}=t,{extension:a}=t,l=o.value;return e.$$set=e=>{"setter"in e&&n(2,s=e.setter),"current"in e&&n(3,o=e.current),"extension"in e&&n(4,a=e.extension)},e.$$.update=()=>{1&e.$$.dirty&&n(5,i=du[l]),37&e.$$.dirty&&s({value:l,text:i})},[l,r,s,o,a,i,e=>n(0,l=e)]}function Nu(e){d(e,"svelte-17r18fo","#grid.svelte-17r18fo{display:grid;grid-template-columns:auto auto auto auto auto;grid-gap:10px}@media screen and (max-width: 768px){#grid.svelte-17r18fo{grid-template-columns:auto}}.icon.svelte-17r18fo{width:50px}")}function Pu(e,t,n){const i=e.slice();return i[7]=t[n],i}function Ru(e){let t,n,i,r,s,o,a,l;function c(){return e[6](e[7])}return{c(){t=m("button"),n=m("div"),i=m("img"),s=y(),b(i,"class","icon svelte-17r18fo"),h(i.src,r=e[1][fu[e[7]]])||b(i,"src",r),b(i,"alt",e[7]),b(n,"class","cell"),t.disabled=o=e[0]==e[7]},m(e,r){p(e,t,r),u(t,n),u(n,i),u(t,s),a||(l=v(t,"click",c),a=!0)},p(n,i){e=n,1&i&&o!==(o=e[0]==e[7])&&(t.disabled=o)},d(e){e&&f(t),a=!1,l()}}}function Au(e){let t,i=Object.keys(fu),r=[];for(let t=0;t<i.length;t+=1)r[t]=Ru(Pu(e,i,t));return{c(){t=m("div");for(let e=0;e<r.length;e+=1)r[e].c();b(t,"id","grid"),b(t,"class","svelte-17r18fo")},m(e,n){p(e,t,n);for(let e=0;e<r.length;e+=1)r[e]&&r[e].m(t,null)},p(e,[n]){if(3&n){let s;for(i=Object.keys(fu),s=0;s<i.length;s+=1){const o=Pu(e,i,s);r[s]?r[s].p(o,n):(r[s]=Ru(o),r[s].c(),r[s].m(t,null))}for(;s<r.length;s+=1)r[s].d(1);r.length=i.length}},i:n,o:n,d(e){e&&f(t),_(r,e)}}}function Du(e,t,n){let i;const r={[fu.Airplane]:"https://cdn.emojidex.com/emoji/seal/airplane.png?1499688727",[fu.Apple]:"https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f34e.png",[fu.Art]:"https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f3a8.png",[fu.Bowling]:"https://images.emojiterra.com/google/android-pie/512px/1f3b3.png",[fu.Checkmark]:"https://images.emojiterra.com/openmoji/v13.1/512px/2705.png",[fu.ExclamationPoint]:"https://emojis.wiki/emoji-pics/messenger/exclamation-mark-messenger.png",[fu.Football]:"https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f3c8.png",[fu.Heart]:"https://images.emojiterra.com/openmoji/v13.1/512px/1f498.png",[fu.Magic]:"https://images.emojiterra.com/google/android-11/512px/1fa84.png",[fu.Ocean]:"https://emojipedia-us.s3.amazonaws.com/source/skype/289/water-wave_1f30a.png",[fu.Penguin]:"https://emojipedia-us.s3.amazonaws.com/source/skype/289/penguin_1f427.png",[fu.Rainbow]:"https://emojipedia-us.s3.amazonaws.com/source/skype/289/rainbow_1f308.png",[fu.Robot]:"https://images.emojiterra.com/google/android-10/512px/1f916.png",[fu.Rocket]:"https://images.emojiterra.com/openmoji/v13.1/512px/1f680.png",[fu.Snowflake]:"https://emojipedia-us.s3.amazonaws.com/source/skype/289/snowflake_2744-fe0f.png",[fu.Taco]:"https://cdn0.iconfinder.com/data/icons/junk-food-emoji-set/100/Taco_2-512.png",[fu.VideoGame]:"https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f3ae.png"};let{setter:s}=t,{current:o}=t,{extension:a}=t,l=o.value;return e.$$set=e=>{"setter"in e&&n(2,s=e.setter),"current"in e&&n(3,o=e.current),"extension"in e&&n(4,a=e.extension)},e.$$.update=()=>{1&e.$$.dirty&&n(5,i=fu[l]),37&e.$$.dirty&&s({value:l,text:i})},[l,r,s,o,a,i,e=>n(0,l=e)]}function Lu(e){d(e,"svelte-1z0o0so",".container.svelte-1z0o0so{text-align:center;padding:30px}")}function Ou(e){let i,r,o,a,l,c,h,d;return{c(){i=m("div"),r=m("h5"),r.textContent="Please enter Jibo's name below:",o=y(),a=m("input"),l=y(),c=m("button"),c.textContent="Submit",b(a,"type","text"),b(a,"placeholder","jibo..."),b(i,"class","svelte-1z0o0so"),function(e,t,n){e.classList[n?"add":"remove"](t)}(i,"container",e[2]),C(i,"width","360px"),C(i,"background-color",t.color.ui.white),C(i,"color",t.color.text.primary)},m(t,n){p(t,i,n),u(i,r),u(i,o),u(i,a),w(a,e[0]),u(i,l),u(i,c),h||(d=[v(a,"input",e[5]),v(c,"click",e[1])],h=!0)},p(e,[t]){1&t&&a.value!==e[0]&&w(a,e[0])},i:n,o:n,d(e){e&&f(i),h=!1,s(d)}}}function Fu(e,n,i){let{extension:r}=n,s="",{close:o}=n;const a=t.activeClass;return e.$$set=e=>{"extension"in e&&i(3,r=e.extension),"close"in e&&i(4,o=e.close)},[s,function(){i(0,s=s.toLowerCase()),function(e){El.ref("Jibo-Name").once("value").then((t=>{t.hasChild(e)?(console.log("'"+e+"' exists."),su=e):(El.ref("Jibo-Name/"+e).push(mu),su=e,console.log("'"+e+"' did not exist, and has now been created."))})).catch((e=>{console.error(e)}))}(s),o()},a,r,o,function(){s=this.value,i(0,s)}]}return e.ColorArgument=class extends B{constructor(e){super(),j(this,e,ku,Cu,a,{setter:1,current:2,extension:3},vu)}},e.EmojiArgument=class extends B{constructor(e){super(),j(this,e,Iu,xu,a,{setter:2,current:3,extension:4},Tu)}},e.Extension=yu,e.IconArgument=class extends B{constructor(e){super(),j(this,e,Du,Au,a,{setter:2,current:3,extension:4},Nu)}},e.jiboNameModal=class extends B{constructor(e){super(),j(this,e,Fu,Ou,a,{extension:3,close:4},Lu)}},Object.defineProperty(e,"__esModule",{value:!0}),e}({},ExtensionFramework);//# sourceMappingURL=scratch3prg95grpjibo.js.map
