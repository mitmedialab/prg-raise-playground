var poseBody=function(e,t){"use strict";function n(e,t,n,a){return new(n||(n=Promise))((function(r,s){function o(e){try{u(a.next(e))}catch(e){s(e)}}function i(e){try{u(a.throw(e))}catch(e){s(e)}}function u(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,i)}u((a=a.apply(e,t||[])).next())}))}"function"==typeof SuppressedError&&SuppressedError;class a{constructor(e,t){this.backend=e,this.dataMover=t,this.data=new WeakMap,this.dataIdsCount=0}get(e){return this.data.has(e)||this.dataMover.moveData(this.backend,e),this.data.get(e)}set(e,t){this.dataIdsCount++,this.data.set(e,t)}has(e){return this.data.has(e)}delete(e){return this.dataIdsCount--,this.data.delete(e)}numDataIds(){return this.dataIdsCount}}class r{time(e){return s("time")}read(e){return s("read")}readSync(e){return s("readSync")}numDataIds(){return s("numDataIds")}disposeData(e){return s("disposeData")}write(e,t,n){return s("write")}move(e,t,n,a){return s("move")}memory(){return s("memory")}floatPrecision(){return s("floatPrecision")}epsilon(){return 32===this.floatPrecision()?1e-7:1e-4}dispose(){return s("dispose")}}function s(e){throw new Error(`'${e}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function o(e){let t=e.length,n=0,a=0;for(;t>0;)a=Math.random()*t|0,t--,n=e[t],e[t]=e[a],e[a]=n}function i(e,t,n){return Math.max(e,Math.min(t,n))}function u(e,t){if(!e)throw new Error("string"==typeof t?t:t())}function l(e,t,n=""){u(h(e,t),(()=>n+` Shapes ${e} and ${t} must match`))}function c(e){u(null!=e,(()=>"The input to the tensor constructor must be a non-null value."))}function p(e,t=[],n=!1){if(null==t&&(t=[]),Array.isArray(e)||T(e)&&!n)for(let a=0;a<e.length;++a)p(e[a],t,n);else t.push(e);return t}function d(e){if(0===e.length)return 1;let t=e[0];for(let n=1;n<e.length;n++)t*=e[n];return t}function h(e,t){if(e===t)return!0;if(null==e||null==t)return!1;if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}function m(e){return e%1==0}function f(e,t){return t<=e.length?e:e+" ".repeat(t-e.length)}function g(e,t){let n=1,a=-1;for(let t=0;t<e.length;++t)if(e[t]>=0)n*=e[t];else if(-1===e[t]){if(-1!==a)throw Error(`Shapes can only have 1 implicit size. Found -1 at dim ${a} and dim ${t}`);a=t}else if(e[t]<0)throw Error(`Shapes can not be < 0. Found ${e[t]} at dim ${t}`);if(-1===a){if(t>0&&t!==n)throw Error(`Size(${t}) must match the product of shape ${e}`);return e}if(0===n)throw Error(`Cannot infer the missing size in [${e}] when there are 0 elements`);if(t%n!=0)throw Error(`The implicit shape can't be a fractional number. Got ${t} / ${n}`);const r=e.slice();return r[a]=t/n,r}function y(e,t){const n=t.length;return u((e=null==e?t.map(((e,t)=>t)):[].concat(e)).every((e=>e>=-n&&e<n)),(()=>`All values in axis param must be in range [-${n}, ${n}) but got axis ${e}`)),u(e.every((e=>m(e))),(()=>`All values in axis param must be integers but got axis ${e}`)),e.map((e=>e<0?n+e:e))}function b(e,t){const n=[],a=[],r=null!=t&&Array.isArray(t)&&0===t.length,s=null==t||r?null:y(t,e).sort();let o=0;for(let t=0;t<e.length;++t){if(null!=s){if(s[o]===t&&1!==e[t])throw new Error(`Can't squeeze axis ${t} since its dim '${e[t]}' is not 1`);(null==s[o]||s[o]>t)&&1===e[t]&&(n.push(e[t]),a.push(t)),s[o]<=t&&o++}1!==e[t]&&(n.push(e[t]),a.push(t))}return{newShape:n,keptDims:a}}function k(e,t){let n=null;if(null==e||"float32"===e)n=new Float32Array(t);else if("int32"===e)n=new Int32Array(t);else{if("bool"!==e)throw new Error(`Unknown data type ${e}`);n=new Uint8Array(t)}return n}function x(e,t){let n=null;if(null==e||"float32"===e)n=new Float32Array(t);else if("int32"===e)n=new Int32Array(t);else if("bool"===e)n=new Uint8Array(t);else{if("string"!==e)throw new Error(`Unknown data type ${e}`);n=new Array(t)}return n}function w(e,t){for(let n=0;n<e.length;n++){const a=e[n];if(isNaN(a)||!isFinite(a))throw Error(`A tensor of type ${t} being uploaded contains ${a}.`)}}function N(e){return"bool"===e||"complex64"===e||"float32"===e||"int32"===e||"string"===e}function v(e,t){return"complex64"!==t&&(("float32"!==t||"complex64"===e)&&(("int32"!==t||"float32"===e||"complex64"===e)&&("bool"!==t||"bool"!==e)))}function T(e){return e instanceof Float32Array||e instanceof Int32Array||e instanceof Uint8Array}function I(e){if("float32"===e||"int32"===e)return 4;if("complex64"===e)return 8;if("bool"===e)return 1;throw new Error(`Unknown dtype ${e}`)}function S(e){if(null==e)return 0;let t=0;return e.forEach((e=>t+=e.length)),t}function E(e){return"string"==typeof e||e instanceof String}function _(e){return"boolean"==typeof e}function M(e){return"number"==typeof e}function A(e){return Array.isArray(e)?A(e[0]):e instanceof Float32Array?"float32":e instanceof Int32Array||e instanceof Uint8Array?"int32":M(e)?"float32":E(e)?"string":_(e)?"bool":"float32"}function $(e){return!!(e&&e.constructor&&e.call&&e.apply)}function D(e,t){for(let n=t;n<e;++n)if(e%n==0)return n;return e}function F(e){const t=e.length;if(t<2)return[];const n=new Array(t-1);n[t-2]=e[t-1];for(let a=t-3;a>=0;--a)n[a]=n[a+1]*e[a+1];return n}function O(e,t,n){const a=new Array;if(1===t.length){const r=t[0];for(let t=0;t<r;t++)a[t]=n[e+t]}else{const r=t[0],s=t.slice(1),o=s.reduce(((e,t)=>e*t));for(let t=0;t<r;t++)a[t]=O(e+t*o,s,n)}return a}function C(e,t){if(0===e.length)return t[0];const n=e.reduce(((e,t)=>e*t));if(0===n)return[];if(n!==t.length)throw new Error(`[${e}] does not match the input size ${t.length}.`);return O(0,e,t)}function R(e,t){const n=z(e,t);for(let e=0;e<n.length;e++)n[e]=1;return n}function z(e,t){if(null==t||"float32"===t||"complex64"===t)return new Float32Array(e);if("int32"===t)return new Int32Array(e);if("bool"===t)return new Uint8Array(e);throw new Error(`Unknown data type ${t}`)}function B(e,t){const n=e.reduce(((e,t)=>e*t),1);if(null==t||"float32"===t)return C(e,new Float32Array(n));if("int32"===t)return C(e,new Int32Array(n));if("bool"===t)return C(e,new Uint8Array(n));throw new Error(`Unknown data type ${t}`)}function L(e){e.forEach((t=>{u(Number.isInteger(t)&&t>=0,(()=>`Tensor must have a shape comprised of positive integers but got shape [${e}].`))}))}function P(e,t,n){if(0===t)return 0;if(1===t)return e[0];let a=e[e.length-1];for(let t=0;t<e.length-1;++t)a+=n[t]*e[t];return a}function V(e,t,n){if(0===t)return[];if(1===t)return[e];const a=new Array(t);for(let t=0;t<a.length-1;++t)a[t]=Math.floor(e/n[t]),e-=a[t]*n[t];return a[a.length-1]=e,a}function W(e){return e&&e.then&&"function"==typeof e.then}
/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const H="tfjsflags";class q{constructor(e){this.global=e,this.flags={},this.flagRegistry={},this.urlFlags={},this.populateURLFlags()}setPlatform(e,t){null!=this.platform&&console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${t}.`),this.platformName=e,this.platform=t}registerFlag(e,t,n){if(this.flagRegistry[e]={evaluationFn:t,setHook:n},null!=this.urlFlags[e]){const t=this.urlFlags[e];console.warn(`Setting feature override from URL ${e}: ${t}.`),this.set(e,t)}}async getAsync(e){return e in this.flags||(this.flags[e]=await this.evaluateFlag(e)),this.flags[e]}get(e){if(e in this.flags)return this.flags[e];const t=this.evaluateFlag(e);if(W(t))throw new Error(`Flag ${e} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[e]=t,this.flags[e]}getNumber(e){return this.get(e)}getBool(e){return this.get(e)}getFlags(){return this.flags}get features(){return this.flags}set(e,t){if(null==this.flagRegistry[e])throw new Error(`Cannot set flag ${e} as it has not been registered.`);this.flags[e]=t,null!=this.flagRegistry[e].setHook&&this.flagRegistry[e].setHook(t)}evaluateFlag(e){if(null==this.flagRegistry[e])throw new Error(`Cannot evaluate flag '${e}': no evaluation function found.`);return this.flagRegistry[e].evaluationFn()}setFlags(e){this.flags=Object.assign({},e)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(void 0===this.global||void 0===this.global.location||void 0===this.global.location.search)return;const e=function(e){const t={};return e.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,((e,...n)=>(function(e,t,n){e[decodeURIComponent(t)]=decodeURIComponent(n||"")}(t,n[0],n[1]),n.join("=")))),t}(this.global.location.search);if(H in e){e[H].split(",").forEach((e=>{const[t,n]=e.split(":");this.urlFlags[t]=function(e,t){if("true"===(t=t.toLowerCase())||"false"===t)return"true"===t;if(""+ +t===t)return+t;throw new Error(`Could not parse value flag value ${t} for flag ${e}.`)}(t,n)}))}}}function j(){return K}let U,K=null;function G(){if(null==U){let e;if("undefined"!=typeof window)e=window;else if("undefined"!=typeof global)e=global;else if("undefined"!=typeof process)e=process;else{if("undefined"==typeof self)throw new Error("Could not find a global object");e=self}U=e}return U}function Y(e,t){const n=function(){const e=G();return null==e._tfGlobals&&(e._tfGlobals=new Map),e._tfGlobals}();if(n.has(e))return n.get(e);{const a=t();return n.set(e,a),n.get(e)}}const Q="Abs",X="Acos",J="Acosh",Z="Add",ee="AddN",te="All",ne="Any",ae="ArgMax",re="ArgMin",se="Asin",oe="Asinh",ie="Atan",ue="Atanh",le="Atan2",ce="AvgPool",pe="AvgPoolGrad",de="AvgPool3D",he="AvgPool3DGrad",me="BatchMatMul",fe="BatchToSpaceND",ge="Bincount",ye="Cast",be="Ceil",ke="ClipByValue",xe="Complex",we="ComplexAbs",Ne="Concat",ve="Conv2D",Te="Conv2DBackpropFilter",Ie="Conv2DBackpropInput",Se="Conv3D",Ee="Conv3DBackpropFilterV2",_e="Conv3DBackpropInputV2",Me="Cos",Ae="Cosh",$e="Cumsum",De="CropAndResize",Fe="DenseBincount",Oe="DepthToSpace",Ce="DepthwiseConv2dNative",Re="DepthwiseConv2dNativeBackpropFilter",ze="DepthwiseConv2dNativeBackpropInput",Be="Diag",Le="Dilation2D",Pe="Dilation2DBackpropInput",Ve="Dilation2DBackpropFilter",We="RealDiv",He="Elu",qe="EluGrad",je="Erf",Ue="Equal",Ke="Exp",Ge="ExpandDims",Ye="Expm1",Qe="FFT",Xe="Fill",Je="FlipLeftRight",Ze="Floor",et="FloorDiv",tt="FusedBatchNorm",nt="GatherV2",at="GatherNd",rt="Greater",st="GreaterEqual",ot="Identity",it="IFFT",ut="Imag",lt="IsFinite",ct="IsInf",pt="IsNan",dt="LeakyRelu",ht="Less",mt="LessEqual",ft="LinSpace",gt="Log",yt="Log1p",bt="LogicalAnd",kt="LogicalNot",xt="LogicalOr",wt="LRN",Nt="LRNGrad",vt="Max",Tt="Maximum",It="MaxPool",St="MaxPoolGrad",Et="MaxPool3D",_t="MaxPool3DGrad",Mt="MaxPoolWithArgmax",At="Mean",$t="Min",Dt="Minimum",Ft="MirrorPad",Ot="Mod",Ct="Multinomial",Rt="Multiply",zt="Neg",Bt="NotEqual",Lt="NonMaxSuppressionV3",Pt="NonMaxSuppressionV4",Vt="NonMaxSuppressionV5",Wt="OnesLike",Ht="OneHot",qt="Pack",jt="PadV2",Ut="Pow",Kt="Prelu",Gt="Prod",Yt="Range",Qt="Real",Xt="Reciprocal",Jt="Relu",Zt="Reshape",en="ResizeNearestNeighbor",tn="ResizeNearestNeighborGrad",nn="ResizeBilinear",an="ResizeBilinearGrad",rn="Relu6",sn="Reverse",on="Round",un="Rsqrt",ln="ScatterNd",cn="Select",pn="Selu",dn="Slice",hn="Sin",mn="Sinh",fn="Sign",gn="Sigmoid",yn="Softplus",bn="Sqrt",kn="Sum",xn="SpaceToBatchND",wn="SplitV",Nn="Softmax",vn="SquaredDifference",Tn="Square",In="Sub",Sn="SparseToDense",En="StridedSlice",_n="Tan",Mn="Tanh",An="Tile",$n="TopK",Dn="Transpose",Fn="Unique",On="Unpack",Cn="UnsortedSegmentSum",Rn="ZerosLike",zn="Step",Bn="FromPixels",Ln="RotateWithOffset",Pn="_FusedMatMul",Vn="FusedConv2D",Wn="FusedDepthwiseConv2D",Hn=Y("kernelRegistry",(()=>new Map)),qn=Y("gradRegistry",(()=>new Map));function jn(e,t){const n=Yn(e,t);return Hn.get(n)}function Un(e){return qn.get(e)}function Kn(e){const t=Hn.entries(),n=[];for(;;){const{done:a,value:r}=t.next();if(a)break;const[s,o]=r,[i]=s.split("_");i===e&&n.push(o)}return n}function Gn(e){const{kernelName:t,backendName:n}=e,a=Yn(t,n);Hn.has(a)&&console.warn(`The kernel '${t}' for backend '${n}' is already registered`),Hn.set(a,e)}function Yn(e,t){return`${t}_${e}`}
/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qn(e,t){return"string"===t?Zn(e):Xn([e],t)}function Xn(e,t){if("string"===t)throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(e)&&(e=p(e)),j().getBool("DEBUG")&&w(e,t),function(e,t){return e instanceof Float32Array&&"float32"===t||e instanceof Int32Array&&"int32"===t||e instanceof Uint8Array&&"bool"===t}(e,t))return e;if(null==t||"float32"===t||"complex64"===t)return new Float32Array(e);if("int32"===t)return new Int32Array(e);if("bool"===t){const t=new Uint8Array(e.length);for(let n=0;n<t.length;++n)0!==Math.round(e[n])&&(t[n]=1);return t}throw new Error(`Unknown data type ${t}`)}function Jn(){return j().platform.now()}function Zn(e,t="utf-8"){return t=t||"utf-8",j().platform.encode(e,t)}function ea(e,t="utf-8"){return t=t||"utf-8",j().platform.decode(e,t)}var ta=Object.freeze({__proto__:null,arraysEqual:h,assert:u,assertNonNegativeIntegerDimensions:L,assertNonNull:c,assertShapesMatch:l,bytesFromStringArray:S,bytesPerElement:I,checkConversionForErrors:w,clamp:i,computeStrides:F,createScalarValue:Qn,createShuffledIndices:function(e){const t=new Uint32Array(e);for(let n=0;n<e;++n)t[n]=n;return o(t),t},decodeString:ea,distSquared:function(e,t){let n=0;for(let a=0;a<e.length;a++){const r=Number(e[a])-Number(t[a]);n+=r*r}return n},encodeString:Zn,fetch:function(e,t){return j().platform.fetch(e,t)},flatten:p,getArrayFromDType:x,getTypedArrayFromDType:k,hasEncodingLoss:v,indexToLoc:V,inferDtype:A,inferFromImplicitShape:g,isBoolean:_,isFunction:$,isInt:m,isNumber:M,isPromise:W,isScalarShape:function(e){return 0===e.length},isString:E,isTypedArray:T,isValidDtype:N,locToIndex:P,makeOnesTypedArray:R,makeZerosNestedTypedArray:B,makeZerosTypedArray:z,nearestDivisor:D,nearestLargerEven:function(e){return e%2==0?e:e+1},now:Jn,parseAxisParam:y,randUniform:function(e,t){const n=Math.random();return t*n+(1-n)*e},repeatedTry:function(e,t=(e=>0),n){return new Promise(((a,r)=>{let s=0;const o=()=>{if(e())return void a();s++;const i=t(s);null!=n&&s>=n?r():setTimeout(o,i)};o()}))},rightPad:f,shuffle:o,sizeFromShape:d,sizeToSquarishShape:function(e){const t=Math.ceil(Math.sqrt(e));return[t,Math.ceil(e/t)]},squeezeShape:b,sum:function(e){let t=0;for(let n=0;n<e.length;n++)t+=e[n];return t},tanh:function(e){if(null!=Math.tanh)return Math.tanh(e);if(e===1/0)return 1;if(e===-1/0)return-1;{const t=Math.exp(2*e);return(t-1)/(t+1)}},toNestedArray:C,toTypedArray:Xn});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class na{constructor(e,t){this.backendTimer=e,this.logger=t,null==t&&(this.logger=new ra)}profileKernel(e,t,n){let a;const r=this.backendTimer.time((()=>{a=n()}));if(j().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let t=0;t<a.length;t++){const n=a[t];n.data().then((t=>{aa(t,n.dtype,e)}))}return{kernelName:e,outputs:a,inputs:t,timeMs:r.then((e=>e.kernelMs)),extraInfo:r.then((e=>null!=e.getExtraProfileInfo?e.getExtraProfileInfo():""))}}logKernelProfile(e){const{kernelName:t,outputs:n,timeMs:a,inputs:r,extraInfo:s}=e;n.forEach((e=>{Promise.all([e.data(),a,s]).then((n=>{this.logger.logKernelProfile(t,e,n[0],n[1],r,n[2])}))}))}}function aa(e,t,n){if("float32"!==t)return!1;for(let t=0;t<e.length;t++){const a=e[t];if(isNaN(a)||!isFinite(a))return console.warn(`Found ${a} in the result of '${n}'`),!0}return!1}class ra{logKernelProfile(e,t,n,a,r,s){const o="number"==typeof a?f(`${a}ms`,9):a.error,i=f(e,25),u=t.rank,l=t.size,c=f(t.shape.toString(),14);let p="";for(const e in r){const n=r[e];if(null!=n){const a=n.shape||t.shape,r=a.length;p+=`${e}: ${r}D ${r>0?a:""} `}}console.log(`%c${i}\t%c${o}\t%c${u}D ${c}\t%c${l}\t%c${p}\t%c${s}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}}
/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const sa=20,oa=3,ia=7;function ua(e,t,n,a){const r=F(t),s=function(e,t,n,a){const r=d(t),s=a[a.length-1],o=new Array(s).fill(0),i=t.length,u="complex64"===n?da(e):e;if(i>1)for(let e=0;e<r/s;e++){const t=e*s;for(let e=0;e<s;e++)o[e]=Math.max(o[e],la(u[t+e],0,n).length)}return o}(e,t,n,r),o=t.length,i=pa(e,t,n,r,s),u=["Tensor"];return a&&(u.push(`  dtype: ${n}`),u.push(`  rank: ${o}`),u.push(`  shape: [${t}]`),u.push("  values:")),u.push(i.map((e=>"    "+e)).join("\n")),u.join("\n")}function la(e,t,n){let a;return a=Array.isArray(e)?`${parseFloat(e[0].toFixed(ia))} + ${parseFloat(e[1].toFixed(ia))}j`:E(e)?`'${e}'`:"bool"===n?ca(e):parseFloat(e.toFixed(ia)).toString(),f(a,t)}function ca(e){return 0===e?"false":"true"}function pa(e,t,n,a,r,s=!0){const o="complex64"===n?2:1,i=t[0],u=t.length;if(0===u){if("complex64"===n){return[la(da(e)[0],0,n)]}return"bool"===n?[ca(e[0])]:[e[0].toString()]}if(1===u){if(i>sa){const t=oa*o;let a=Array.from(e.slice(0,t)),s=Array.from(e.slice((i-oa)*o,i*o));return"complex64"===n&&(a=da(a),s=da(s)),["["+a.map(((e,t)=>la(e,r[t],n))).join(", ")+", ..., "+s.map(((e,t)=>la(e,r[i-oa+t],n))).join(", ")+"]"]}return["["+("complex64"===n?da(e):Array.from(e)).map(((e,t)=>la(e,r[t],n))).join(", ")+"]"]}const l=t.slice(1),c=a.slice(1),p=a[0]*o,d=[];if(i>sa){for(let t=0;t<oa;t++){const a=t*p,s=a+p;d.push(...pa(e.slice(a,s),l,n,c,r,!1))}d.push("...");for(let t=i-oa;t<i;t++){const a=t*p,s=a+p;d.push(...pa(e.slice(a,s),l,n,c,r,t===i-1))}}else for(let t=0;t<i;t++){const a=t*p,s=a+p;d.push(...pa(e.slice(a,s),l,n,c,r,t===i-1))}const h=2===u?",":"";d[0]="["+d[0]+h;for(let e=1;e<d.length-1;e++)d[e]=" "+d[e]+h;let m=",\n";for(let e=2;e<u;e++)m+="\n";return d[d.length-1]=" "+d[d.length-1]+"]"+(s?"":m),d}function da(e){const t=[];for(let n=0;n<e.length;n+=2)t.push([e[n],e[n+1]]);return t}
/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class ha{constructor(e,t,n){if(this.dtype=t,this.shape=e.slice(),this.size=d(e),null!=n){const e=n.length;u(e===this.size,(()=>`Length of values '${e}' does not match the size inferred by the shape '${this.size}'.`))}if("complex64"===t)throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=n||x(t,this.size),this.strides=F(e)}set(e,...t){0===t.length&&(t=[0]),u(t.length===this.rank,(()=>`The number of provided coordinates (${t.length}) must match the rank (${this.rank})`));const n=this.locToIndex(t);this.values[n]=e}get(...e){0===e.length&&(e=[0]);let t=0;for(const n of e){if(n<0||n>=this.shape[t]){const t=`Requested out of range element at ${e}.   Buffer shape=${this.shape}`;throw new Error(t)}t++}let n=e[e.length-1];for(let t=0;t<e.length-1;++t)n+=this.strides[t]*e[t];return this.values[n]}locToIndex(e){if(0===this.rank)return 0;if(1===this.rank)return e[0];let t=e[e.length-1];for(let n=0;n<e.length-1;++n)t+=this.strides[n]*e[n];return t}indexToLoc(e){if(0===this.rank)return[];if(1===this.rank)return[e];const t=new Array(this.shape.length);for(let n=0;n<t.length-1;++n)t[n]=Math.floor(e/this.strides[n]),e-=t[n]*this.strides[n];return t[t.length-1]=e,t}get rank(){return this.shape.length}toTensor(){return ma().makeTensor(this.values,this.shape,this.dtype)}}let ma=null,fa=null;class ga{constructor(e,t,n,a){this.kept=!1,this.isDisposedInternal=!1,this.shape=e.slice(),this.dtype=t||"float32",this.size=d(e),this.strides=F(e),this.dataId=n,this.id=a,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){const e=await this.data();return fa.buffer(this.shape,this.dtype,e)}bufferSync(){return fa.buffer(this.shape,this.dtype,this.dataSync())}async array(){const e=await this.data();return C(this.shape,e)}arraySync(){return C(this.shape,this.dataSync())}async data(){this.throwIfDisposed();const e=ma().read(this.dataId);if("string"===this.dtype){const t=await e;try{return t.map((e=>ea(e)))}catch(e){throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return e}dataSync(){this.throwIfDisposed();const e=ma().readSync(this.dataId);if("string"===this.dtype)try{return e.map((e=>ea(e)))}catch(e){throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return e}async bytes(){this.throwIfDisposed();const e=await ma().read(this.dataId);return"string"===this.dtype?e:new Uint8Array(e.buffer)}dispose(){this.isDisposed||(ma().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(e=!1){return fa.print(this,e)}clone(){return this.throwIfDisposed(),fa.clone(this)}toString(e=!1){return ua(this.dataSync(),this.shape,this.dtype,e)}cast(e){return this.throwIfDisposed(),fa.cast(this,e)}variable(e=!0,t,n){return this.throwIfDisposed(),ma().makeVariable(this,e,t,n)}}Object.defineProperty(ga,Symbol.hasInstance,{value:e=>!!e&&null!=e.data&&null!=e.dataSync&&null!=e.throwIfDisposed}),Y("Tensor",(()=>ga));class ya extends ga{constructor(e,t,n,a){super(e.shape,e.dtype,e.dataId,a),this.trainable=t,this.name=n}assign(e){if(e.dtype!==this.dtype)throw new Error(`dtype of the new value (${e.dtype}) and previous value (${this.dtype}) must match`);if(!h(e.shape,this.shape))throw new Error(`shape of the new value (${e.shape}) and previous value (${this.shape}) must match`);ma().disposeTensor(this),this.dataId=e.dataId,ma().incRef(this,null)}dispose(){ma().disposeVariable(this),this.isDisposedInternal=!0}}
/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var ba,ka,xa,wa,Na;Object.defineProperty(ya,Symbol.hasInstance,{value:e=>e instanceof ga&&null!=e.assign&&e.assign instanceof Function}),function(e){e.R0="R0",e.R1="R1",e.R2="R2",e.R3="R3",e.R4="R4",e.R5="R5",e.R6="R6"}(ba||(ba={})),function(e){e.float32="float32",e.int32="int32",e.bool="int32",e.complex64="complex64"}(ka||(ka={})),function(e){e.float32="float32",e.int32="int32",e.bool="bool",e.complex64="complex64"}(xa||(xa={})),function(e){e.float32="float32",e.int32="float32",e.bool="float32",e.complex64="complex64"}(wa||(wa={})),function(e){e.float32="complex64",e.int32="complex64",e.bool="complex64",e.complex64="complex64"}(Na||(Na={}));const va={float32:wa,int32:ka,bool:xa,complex64:Na};function Ta(e,t){if("string"===e||"string"===t){if("string"===e&&"string"===t)return"string";throw new Error(`Can not upcast ${e} with ${t}`)}return va[e][t]}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function Ia(e,t){if(e.dtype===t.dtype)return[e,t];const n=Ta(e.dtype,t.dtype);return[e.cast(n),t.cast(n)]}function Sa(e,t){u(e.dtype===t.dtype,(()=>`The dtypes of the first(${e.dtype}) and second(${t.dtype}) input must match`))}function Ea(e){const t=[];return _a(e,t,new Set),t}function _a(e,t,n){if(null==e)return;if(e instanceof ga)return void t.push(e);if(a=e,!Array.isArray(a)&&"object"!=typeof a)return;var a;const r=e;for(const e in r){const a=r[e];n.has(a)||(n.add(a),_a(a,t,n))}}var Ma=Object.freeze({__proto__:null,assertTypesMatch:Sa,getTensorsInContainer:Ea,isTensorInList:function(e,t){return t.some((t=>t.id===e.id))},makeTypesMatch:Ia});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Aa(e){return null!=e.kernelName}class $a{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map((e=>e.name))))}}}dispose(){for(const e in this.registeredVariables)this.registeredVariables[e].dispose()}}class Da{constructor(e){this.ENV=e,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new $a}async ready(){if(null!=this.pendingBackendInit)return this.pendingBackendInit.then((()=>{}));if(null!=this.backendInstance)return;const e=this.getSortedBackends();for(let t=0;t<e.length;t++){const n=e[t];if(await this.initializeBackend(n).success)return void await this.setBackend(n)}throw new Error("Could not initialize any backends, all backend initializations failed.")}get backend(){if(null!=this.pendingBackendInit)throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(null==this.backendInstance){const{name:e,asyncInit:t}=this.initializeBackendsAndReturnBest();if(t)throw new Error(`The highest priority backend '${e}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(e)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(e){if(!(e in this.registry)){if(!(e in this.registryFactory))return null;{const{asyncInit:t}=this.initializeBackend(e);if(t)return null}}return this.registry[e]}findBackendFactory(e){return e in this.registryFactory?this.registryFactory[e].factory:null}registerBackend(e,t,n=1){return e in this.registryFactory?(console.warn(`${e} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[e]={factory:t,priority:n},!0)}async setBackend(e){if(null==this.registryFactory[e])throw new Error(`Backend name '${e}' not found in registry`);if(this.backendName=e,null==this.registry[e]){this.backendInstance=null;const{success:t,asyncInit:n}=this.initializeBackend(e);if(!(n?await t:t))return!1}return this.backendInstance=this.registry[e],this.setupRegisteredKernels(),this.profiler=new na(this.backendInstance),!0}setupRegisteredKernels(){Kn(this.backendName).forEach((e=>{null!=e.setupFunc&&e.setupFunc(this.backendInstance)}))}disposeRegisteredKernels(e){Kn(e).forEach((t=>{null!=t.disposeFunc&&t.disposeFunc(this.registry[e])}))}initializeBackend(e){const t=this.registryFactory[e];if(null==t)throw new Error(`Cannot initialize backend ${e}, no registration found.`);try{const n=t.factory();if(!n||n instanceof r||"function"!=typeof n.then)return this.registry[e]=n,{success:!0,asyncInit:!1};{const t=++this.pendingBackendInitId,a=n.then((n=>!(t<this.pendingBackendInitId)&&(this.registry[e]=n,this.pendingBackendInit=null,!0))).catch((n=>(t<this.pendingBackendInitId||(this.pendingBackendInit=null,console.warn(`Initialization of backend ${e} failed`),console.warn(n.stack||n.message)),!1)));return this.pendingBackendInit=a,{success:a,asyncInit:!0}}}catch(t){return console.warn(`Initialization of backend ${e} failed`),console.warn(t.stack||t.message),{success:!1,asyncInit:!1}}}removeBackend(e){if(!(e in this.registryFactory))throw new Error(`${e} backend not found in registry`);this.backendName===e&&null!=this.pendingBackendInit&&this.pendingBackendInitId++,e in this.registry&&(this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e]),delete this.registryFactory[e],this.backendName===e&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(0===Object.keys(this.registryFactory).length)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort(((e,t)=>this.registryFactory[t].priority-this.registryFactory[e].priority))}initializeBackendsAndReturnBest(){const e=this.getSortedBackends();for(let t=0;t<e.length;t++){const n=e[t],{success:a,asyncInit:r}=this.initializeBackend(n);if(r||a)return{name:n,asyncInit:r}}throw new Error("Could not initialize any backends, all backend initializations failed.")}moveData(e,t){const n=this.state.tensorInfo.get(t),a=n.backend,r=this.readSync(t);a.disposeData(t),n.backend=e,e.move(t,r,n.shape,n.dtype),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(e,t){let n,a=null;if(null==t){if("function"!=typeof e)throw new Error("Please provide a function to tidy()");t=e}else{if("string"!=typeof e&&!(e instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if("function"!=typeof t)throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");a=e}return this.scopedRun((()=>this.startScope(a)),(()=>this.endScope(n)),(()=>(n=t(),n instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),n)))}scopedRun(e,t,n){e();try{const e=n();return t(),e}catch(e){throw t(),e}}nextTensorId(){return Da.nextTensorId++}nextVariableId(){return Da.nextVariableId++}clone(e){const t=this.makeTensorFromDataId(e.dataId,e.shape,e.dtype),n={x:e};return this.addTapeNode(this.state.activeScope.name,n,[t],(e=>({x:()=>{const t={x:e},n={dtype:"float32"};return Oa.runKernel(ye,t,n)}})),[],{}),t}runKernel(e,t,n){if(!(null!=jn(e,this.backendName)))throw new Error(`Kernel '${e}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:e,inputs:t,attrs:n})}shouldCheckForMemLeaks(){return this.ENV.getBool("IS_TEST")}checkKernelForMemLeak(e,t,n){const a=this.backend.numDataIds();let r=0;n.forEach((e=>{r+="complex64"===e.dtype?3:1}));const s=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],o=a-t-r-s;if(o>0)throw new Error(`Backend '${this.backendName}' has an internal memory leak (${o} data ids) after running '${e}'`)}runKernelFunc(e){let t,n=[];const a=this.isTapeOn(),r=this.state.numBytes,s=this.state.numTensors;let o,i;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0),null==this.backendName&&this.backend;const l=Aa(e)?e.kernelName:null!=this.state.activeScope?this.state.activeScope.name:"";if(Aa(e)){const{kernelName:t,inputs:r,attrs:s}=e;null==this.backendName&&this.backend;const l=jn(t,this.backendName);u(null!=l,(()=>`Cannot find registered kernel '${t}' for backend '${this.backendName}'`)),o=()=>{const e=this.backend.numDataIds();i=l.kernelFunc({inputs:r,attrs:s,backend:this.backend});const o=Array.isArray(i)?i:[i];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(t,e,o);const u=o.map((e=>{if(null!=e.rank)return e;const{dataId:t,shape:n,dtype:a}=e;return this.makeTensorFromDataId(t,n,a)}));if(a){const e=this.getTensorsForGradient(t,r,u);n=this.saveTensorsForBackwardMode(e)}return u}}else{const{forwardFunc:t}=e,r=e=>{a&&(n=e.map((e=>this.keep(this.clone(e)))))};o=()=>{const e=this.backend.numDataIds();i=this.tidy((()=>t(this.backend,r)));const n=Array.isArray(i)?i:[i];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(l,e,n),n}}const{inputs:c,attrs:p}=e,d=Aa(e)?null:e.backwardsFunc;let h;return this.scopedRun((()=>this.state.kernelDepth++),(()=>this.state.kernelDepth--),(()=>{this.ENV.getBool("DEBUG")||this.state.profiling?(h=this.profiler.profileKernel(l,c,(()=>o())),this.ENV.getBool("DEBUG")&&this.profiler.logKernelProfile(h),t=h.outputs):t=o()})),a&&this.addTapeNode(l,c,t,d,n,p),this.state.profiling&&this.state.activeProfile.kernels.push({name:l,bytesAdded:this.state.numBytes-r,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-s,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(c).map((e=>null!=c[e]?c[e].shape:null)),outputShapes:t.map((e=>e.shape)),kernelTimeMs:h.timeMs,extraInfo:h.extraInfo}),Array.isArray(i)?t:t[0]}saveTensorsForBackwardMode(e){const t=e.map((e=>this.keep(this.clone(e))));return t}getTensorsForGradient(e,t,n){const a=Un(e);if(null!=a){const e=a.inputsToSave||[],r=a.outputsToSave||[];let s;a.saveAllInputs?(u(Array.isArray(t),(()=>"saveAllInputs is true, expected inputs to be an array.")),s=Object.keys(t).map((e=>t[e]))):s=e.map((e=>t[e]));const o=n.filter(((e,t)=>r[t]));return s.concat(o)}return[]}makeTensor(e,t,n,a){if(null==e)throw new Error("Values passed to engine.makeTensor() are null");n=n||"float32",a=a||this.backend;let r=e;"string"===n&&E(e[0])&&(r=e.map((e=>Zn(e))));const s=a.write(r,t,n),o=new ga(t,n,s,this.nextTensorId());if(this.incRef(o,a),"string"===n){const e=this.state.tensorInfo.get(s),t=S(r);this.state.numBytes+=t-e.bytes,e.bytes=t}return o}makeTensorFromDataId(e,t,n,a){const r=new ga(t,n=n||"float32",e,this.nextTensorId());return this.incRef(r,a),r}makeVariable(e,t=!0,n,a){n=n||this.nextVariableId().toString(),null!=a&&a!==e.dtype&&(e=e.cast(a));const r=new ya(e,t,n,this.nextTensorId());if(null!=this.state.registeredVariables[r.name])throw new Error(`Variable with name ${r.name} was already registered`);return this.state.registeredVariables[r.name]=r,this.incRef(r,this.backend),r}incRef(e,t){const n=this.state.tensorInfo.has(e.dataId)?this.state.tensorInfo.get(e.dataId).refCount:0;if(this.state.numTensors++,"string"===e.dtype&&this.state.numStringTensors++,0===n){this.state.numDataBuffers++;let n=0;"complex64"!==e.dtype&&"string"!==e.dtype&&(n=e.size*I(e.dtype)),this.state.tensorInfo.set(e.dataId,{backend:t||this.backend,dtype:e.dtype,shape:e.shape,bytes:n,refCount:0}),this.state.numBytes+=n}this.state.tensorInfo.get(e.dataId).refCount++,e instanceof ya||this.track(e)}disposeTensor(e){if(!this.state.tensorInfo.has(e.dataId))return;this.state.numTensors--,"string"===e.dtype&&this.state.numStringTensors--;const t=this.state.tensorInfo.get(e.dataId);t.refCount<=1?("complex64"!==e.dtype&&(this.state.numBytes-=t.bytes),this.state.numDataBuffers--,t.backend.disposeData(e.dataId),this.state.tensorInfo.delete(e.dataId)):this.state.tensorInfo.get(e.dataId).refCount--}disposeVariables(){for(const e in this.state.registeredVariables){const t=this.state.registeredVariables[e];this.disposeVariable(t)}}disposeVariable(e){this.disposeTensor(e),null!=this.state.registeredVariables[e.name]&&delete this.state.registeredVariables[e.name]}memory(){const e=this.backend.memory();return e.numTensors=this.state.numTensors,e.numDataBuffers=this.state.numDataBuffers,e.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(e.unreliable=!0,null==e.reasons&&(e.reasons=[]),e.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),e}async profile(e){this.state.profiling=!0;const t=this.state.numBytes,n=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await e(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map((e=>e.totalBytesSnapshot))),this.state.activeProfile.newBytes=this.state.numBytes-t,this.state.activeProfile.newTensors=this.state.numTensors-n;for(const e of this.state.activeProfile.kernels)e.kernelTimeMs=await e.kernelTimeMs,e.extraInfo=await e.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&0===this.state.kernelDepth}addTapeNode(e,t,n,a,r,s){const o={id:this.state.nextTapeNodeId++,kernelName:e,inputs:t,outputs:n,saved:r},i=Un(e);null!=i&&(a=i.gradFunc),null!=a&&(o.gradient=e=>(e=e.map(((e,t)=>{if(null==e){const e=n[t],a=z(e.size,e.dtype);return this.makeTensor(a,e.shape,e.dtype)}return e})),a(e.length>1?e:e[0],r,s))),this.state.activeTape.push(o)}keep(e){return e.kept=!0,e}startTape(){0===this.state.gradientDepth&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(e){const t={track:[],name:"unnamed scope",id:this.state.nextScopeId++};e&&(t.name=e),this.state.scopeStack.push(t),this.state.activeScope=t}endScope(e){const t=Ea(e),n=new Set(t.map((e=>e.id)));for(let e=0;e<this.state.activeScope.track.length;e++){const t=this.state.activeScope.track[e];t.kept||n.has(t.id)||t.dispose()}const a=this.state.scopeStack.pop();this.state.activeScope=0===this.state.scopeStack.length?null:this.state.scopeStack[this.state.scopeStack.length-1],t.forEach((e=>{e.kept||e.scopeId!==a.id||this.track(e)}))}gradients(e,t,n,a=!1){if(u(t.length>0,(()=>"gradients() received an empty list of xs.")),null!=n&&"float32"!==n.dtype)throw new Error(`dy must have 'float32' dtype, but has '${n.dtype}'`);const r=this.scopedRun((()=>this.startTape()),(()=>this.endTape()),(()=>this.tidy("forward",e)));u(r instanceof ga,(()=>"The result y returned by f() must be a tensor."));const s=function(e,t,n){const a={},r={};for(let e=0;e<t.length;e++)a[t[e].id]=!0;for(let n=0;n<e.length;n++){const s=e[n],o=s.inputs;for(const e in o){const n=o[e];let i=!1;for(let e=0;e<t.length;e++)if(a[n.id]){s.outputs.forEach((e=>a[e.id]=!0)),i=!0,r[s.id]=!0;break}if(i)break}}const s={};s[n.id]=!0;const o={};for(let t=e.length-1;t>=0;t--){const n=e[t],a=n.inputs;for(let e=0;e<n.outputs.length;e++)if(s[n.outputs[e].id]){for(const e in a)s[a[e].id]=!0,o[n.id]=!0;break}}const i=[];for(let t=0;t<e.length;t++){const n=e[t];if(r[n.id]&&o[n.id]){const e={};for(const t in n.inputs){const r=n.inputs[t];a[r.id]&&(e[t]=r)}const t=Object.assign({},n);t.inputs=e,t.outputs=n.outputs,i.push(t)}}return i}(this.state.activeTape,t,r);if(!a&&0===s.length&&t.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",(()=>{const e={};e[r.id]=null==n?function(e){const t=R(d(e),"float32");return Oa.makeTensor(t,e,"float32")}(r.shape):n,function(e,t,n,a){for(let r=t.length-1;r>=0;r--){const s=t[r],o=[];if(s.outputs.forEach((t=>{const n=e[t.id];null!=n?o.push(n):o.push(null)})),null==s.gradient)throw new Error(`Cannot compute gradient: gradient function not found for ${s.kernelName}.`);const i=s.gradient(o);for(const t in s.inputs){if(!(t in i))throw new Error(`Cannot backprop through input ${t}. Available gradients found: ${Object.keys(i)}.`);const r=n((()=>i[t]()));if("float32"!==r.dtype)throw new Error(`Error in gradient for op ${s.kernelName}. The gradient of input ${t} must have 'float32' dtype, but has '${r.dtype}'`);const o=s.inputs[t];if(!h(r.shape,o.shape))throw new Error(`Error in gradient for op ${s.kernelName}. The gradient of input '${t}' has shape '${r.shape}', which does not match the shape of the input '${o.shape}'`);if(null==e[o.id])e[o.id]=r;else{const t=e[o.id];e[o.id]=a(t,r),t.dispose()}}}}(e,s,(e=>this.tidy(e)),Ca);const a=t.map((t=>e[t.id]));return 0===this.state.gradientDepth&&(this.state.activeTape.forEach((e=>{for(const t of e.saved)t.dispose()})),this.state.activeTape=null),{value:r,grads:a}}))}customGrad(e){return u($(e),(()=>"The f passed in customGrad(f) must be a function.")),(...t)=>{let n;u(t.every((e=>e instanceof ga)),(()=>"The args passed in customGrad(f)(x1, x2,...) must all be tensors"));const a={};t.forEach(((e,t)=>{a[t]=e}));return this.runKernelFunc({forwardFunc:(a,r)=>(n=e(...t,r),u(n.value instanceof ga,(()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor")),u($(n.gradFunc),(()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function.")),n.value),backwardsFunc:(e,a)=>{const r=n.gradFunc(e,a),s=Array.isArray(r)?r:[r];u(s.length===t.length,(()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...).")),u(s.every((e=>e instanceof ga)),(()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors."));const o={};return s.forEach(((e,t)=>{o[t]=()=>e})),o},inputs:a})}}readSync(e){return this.state.tensorInfo.get(e).backend.readSync(e)}read(e){return this.state.tensorInfo.get(e).backend.read(e)}async time(e){const t=Jn(),n=await this.backend.time(e);return n.wallMs=Jn()-t,n}track(e){return null!=this.state.activeScope&&(e.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(e)),e}get registeredVariables(){return this.state.registeredVariables}reset(){this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new $a;for(const e in this.registry)this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}}function Fa(){const e=G();if(null==e._tfengine){const t=new q(e);e._tfengine=new Da(t)}var t;
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */return t=e._tfengine.ENV,K=t,ma=()=>e._tfengine,e._tfengine}Da.nextTensorId=0,Da.nextVariableId=0;const Oa=Fa();function Ca(e,t){const n={a:e,b:t};return Oa.runKernel(Z,n)}
/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ra(){return"undefined"!=typeof window&&null!=window.document||"undefined"!=typeof WorkerGlobalScope}var za=Object.freeze({__proto__:null,isBrowser:Ra,isMobile:function(){if("undefined"!=typeof navigator&&null!=navigator){const e=navigator.userAgent||navigator.vendor||window.opera;return/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4))}return!1}});
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ba=j();
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function La(e,t){let n=e;if(T(e))return"string"===t?[]:[e.length];if(!Array.isArray(e))return[];const a=[];for(;Array.isArray(n)||T(n)&&"string"!==t;)a.push(n.length),n=n[0];return Array.isArray(e)&&j().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&Pa(e,a,[]),a}function Pa(e,t,n){if(n=n||[],!Array.isArray(e)&&!T(e))return void u(0===t.length,(()=>`Element arr[${n.join("][")}] is a primitive, but should be an array/TypedArray of ${t[0]} elements`));u(t.length>0,(()=>`Element arr[${n.join("][")}] should be a primitive, but is an array of ${e.length} elements`)),u(e.length===t[0],(()=>`Element arr[${n.join("][")}] should have ${t[0]} elements, but has ${e.length} elements`));const a=t.slice(1);for(let t=0;t<e.length;++t)Pa(e[t],a,n.concat(t))}function Va(e,t,n,a){if("string_or_numeric"!==e){if(null==e)throw new Error("Expected dtype cannot be null.");if("numeric"!==e&&e!==t||"numeric"===e&&"string"===t)throw new Error(`Argument '${n}' passed to '${a}' must be ${e} tensor, but got ${t} tensor`)}}function Wa(e,t,n,a="numeric"){if(e instanceof ga)return Va(a,e.dtype,t,n),e;let r=A(e);if("string"!==r&&["bool","int32","float32"].indexOf(a)>=0&&(r=a),Va(a,r,t,n),null==e||!T(e)&&!Array.isArray(e)&&"number"!=typeof e&&"boolean"!=typeof e&&"string"!=typeof e){const a=null==e?"null":e.constructor.name;throw new Error(`Argument '${t}' passed to '${n}' must be a Tensor or TensorLike, but got '${a}'`)}const s=La(e,r);T(e)||Array.isArray(e)||(e=[e]);const o="string"!==r?Xn(e,r):p(e,[],!0);return Oa.makeTensor(o,s,r)}function Ha(e,t,n,a="numeric"){if(!Array.isArray(e))throw new Error(`Argument ${t} passed to ${n} must be a \`Tensor[]\` or \`TensorLike[]\``);return e.map(((e,r)=>Wa(e,`${t}[${r}]`,n,a)))}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Ba.registerFlag("DEBUG",(()=>!1),(e=>{e&&console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.")})),Ba.registerFlag("IS_BROWSER",(()=>Ra())),Ba.registerFlag("IS_NODE",(()=>"undefined"!=typeof process&&void 0!==process.versions&&void 0!==process.versions.node)),Ba.registerFlag("IS_CHROME",(()=>"undefined"!=typeof navigator&&null!=navigator&&null!=navigator.userAgent&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor))),Ba.registerFlag("PROD",(()=>!1)),Ba.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY",(()=>Ba.getBool("DEBUG"))),Ba.registerFlag("DEPRECATION_WARNINGS_ENABLED",(()=>!0)),Ba.registerFlag("IS_TEST",(()=>!1)),Ba.registerFlag("CHECK_COMPUTATION_FOR_ERRORS",(()=>!0));const qa="__op";function ja(e){const t=Object.keys(e);if(1!==t.length)throw new Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${t.length} keys.`);let n=t[0];const a=e[n];n.endsWith("_")&&(n=n.substring(0,n.length-1)),n+=qa;const r=(...e)=>{Oa.startScope(n);try{const t=a(...e);return W(t)&&console.error("Cannot return a Promise inside of tidy."),Oa.endScope(t),t}catch(e){throw Oa.endScope(null),e}};return Object.defineProperty(r,"name",{value:n,configurable:!0}),r}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ua=ja({complex_:function(e,t){const n=Wa(e,"real","complex"),a=Wa(t,"imag","complex");l(n.shape,a.shape,`real and imag shapes, ${n.shape} and ${a.shape}, must match in call to tf.complex().`);const r={real:n,imag:a};return Oa.runKernel(xe,r)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ka(e,t,n,a){if(null==a&&(a=A(e)),"complex64"===a)throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(!T(e)&&!Array.isArray(e)&&"number"!=typeof e&&"boolean"!=typeof e&&"string"!=typeof e)throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(null!=t){L(t);const e=d(t),a=d(n);u(e===a,(()=>`Based on the provided shape, [${t}], the tensor should have ${e} values but has ${a}`));for(let e=0;e<n.length;++e){const a=n[e],r=e!==n.length-1||a!==d(t.slice(e));u(n[e]===t[e]||!r,(()=>`Error creating a new Tensor. Inferred shape (${n}) does not match the provided shape (${t}). `))}}return T(e)||Array.isArray(e)||(e=[e]),t=t||n,e="string"!==a?Xn(e,a):p(e,[],!0),Oa.makeTensor(e,t,a)}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ga(e,t,n){return Ka(e,t,La(e,n),n)}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ya={float32:4,float16:2,int32:4,uint16:2,uint8:1,bool:1,complex64:8},Qa=4;
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xa(e,t){const n={};let a,r=0;for(const s of t){const t=s.name,o=s.dtype,i=s.shape,u=d(i);let l;if("quantization"in s){const n=s.quantization;if("uint8"===n.dtype||"uint16"===n.dtype){if(!("min"in n)||!("scale"in n))throw new Error(`Weight ${s.name} with quantization ${n.dtype} doesn't have corresponding metadata min and scale.`)}else{if("float16"!==n.dtype)throw new Error(`Weight ${s.name} has unknown quantization dtype ${n.dtype}. Supported quantization dtypes are: 'uint8', 'uint16', and 'float16'.`);if("float32"!==o)throw new Error(`Weight ${s.name} is quantized with ${n.dtype} which only supports weights of type float32 not ${o}.`)}const i=Ya[n.dtype],c=e.slice(r,r+u*i),p="uint8"===n.dtype?new Uint8Array(c):new Uint16Array(c);if("float32"===o)if("uint8"===n.dtype||"uint16"===n.dtype){l=new Float32Array(p.length);for(let e=0;e<p.length;e++){const t=p[e];l[e]=t*n.scale+n.min}}else{if("float16"!==n.dtype)throw new Error(`Unsupported quantization type ${n.dtype} for weight type float32.`);void 0===a&&(a=rr()),l=a(p)}else{if("int32"!==o)throw new Error(`Unsupported dtype in weight '${t}': ${o}`);if("uint8"!==n.dtype&&"uint16"!==n.dtype)throw new Error(`Unsupported quantization type ${n.dtype} for weight type int32.`);l=new Int32Array(p.length);for(let e=0;e<p.length;e++){const t=p[e];l[e]=Math.round(t*n.scale+n.min)}}r+=u*i}else if("string"===o){const t=d(s.shape);l=[];for(let n=0;n<t;n++){const t=new Uint32Array(e.slice(r,r+Qa))[0];r+=Qa;const n=new Uint8Array(e.slice(r,r+t));l.push(n),r+=t}}else{const a=Ya[o],s=e.slice(r,r+u*a);if("float32"===o)l=new Float32Array(s);else if("int32"===o)l=new Int32Array(s);else if("bool"===o)l=new Uint8Array(s);else{if("complex64"!==o)throw new Error(`Unsupported dtype in weight '${t}': ${o}`);{l=new Float32Array(s);const e=new Float32Array(l.length/2),a=new Float32Array(l.length/2);for(let t=0;t<e.length;t++)e[t]=l[2*t],a[t]=l[2*t+1];const r=Ga(e,i,"float32"),o=Ga(a,i,"float32");n[t]=Ua(r,o),r.dispose(),o.dispose()}}r+=u*a}"complex64"!==o&&(n[t]=Ga(l,i,o))}return n}function Ja(e){if(null===e)throw new Error(`Invalid input value: ${JSON.stringify(e)}`);let t=0;const n=[];e.forEach((e=>{if(t+=e.byteLength,n.push(e.byteLength===e.buffer.byteLength?e:new e.constructor(e)),!(e instanceof Float32Array||e instanceof Int32Array||e instanceof Uint8Array))throw new Error(`Unsupported TypedArray subtype: ${e.constructor.name}`)}));const a=new Uint8Array(t);let r=0;return n.forEach((e=>{a.set(new Uint8Array(e.buffer),r),r+=e.byteLength})),a.buffer}const Za="undefined"!=typeof Buffer&&("undefined"==typeof Blob||"undefined"==typeof atob||"undefined"==typeof btoa);function er(e){return Za?Buffer.byteLength(e):new Blob([e]).size}function tr(e){if(1===e.length)return e[0];let t=0;e.forEach((e=>{t+=e.byteLength}));const n=new Uint8Array(t);let a=0;return e.forEach((e=>{n.set(new Uint8Array(e),a),a+=e.byteLength})),n.buffer}function nr(e){for(e=e.trim();e.endsWith("/");)e=e.slice(0,e.length-1);const t=e.split("/");return t[t.length-1]}function ar(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("Expected JSON model topology, received ArrayBuffer.");return{dateSaved:new Date,modelTopologyType:"JSON",modelTopologyBytes:null==e.modelTopology?0:er(JSON.stringify(e.modelTopology)),weightSpecsBytes:null==e.weightSpecs?0:er(JSON.stringify(e.weightSpecs)),weightDataBytes:null==e.weightData?0:e.weightData.byteLength}}function rr(){const e=function(){const e=e=>{let t=e<<13,n=0;for(;!(8388608&t);)n-=8388608,t<<=1;return t&=-8388609,n+=947912704,t|n},t=new Uint32Array(2048);t[0]=0;for(let n=1;n<1024;n++)t[n]=e(n);for(let e=1024;e<2048;e++)t[e]=939524096+(e-1024<<13);return t}(),t=function(){const e=new Uint32Array(64);e[0]=0,e[31]=1199570944,e[32]=2147483648,e[63]=3347054592;for(let t=1;t<31;t++)e[t]=t<<23;for(let t=33;t<63;t++)e[t]=2147483648+(t-32<<23);return e}(),n=function(){const e=new Uint32Array(64);for(let t=0;t<64;t++)e[t]=1024;return e[0]=e[32]=0,e}();return a=>{const r=new ArrayBuffer(4*a.length),s=new Uint32Array(r);for(let r=0;r<a.length;r++){const o=a[r],i=e[n[o>>10]+(1023&o)]+t[o>>10];s[r]=i}return new Float32Array(r)}}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class sr{constructor(){this.saveRouters=[],this.loadRouters=[]}static getInstance(){return null==sr.instance&&(sr.instance=new sr),sr.instance}static registerSaveRouter(e){sr.getInstance().saveRouters.push(e)}static registerLoadRouter(e){sr.getInstance().loadRouters.push(e)}static getSaveHandlers(e){return sr.getHandlers(e,"save")}static getLoadHandlers(e,t){return sr.getHandlers(e,"load",t)}static getHandlers(e,t,n){const a=[];return("load"===t?sr.getInstance().loadRouters:sr.getInstance().saveRouters).forEach((t=>{const r=t(e,n);null!==r&&a.push(r)})),a}}const or="tensorflowjs",ir="models_store",ur="model_info_store";function lr(){if(!j().getBool("IS_BROWSER"))throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");const e="undefined"==typeof window?self:window,t=e.indexedDB||e.mozIndexedDB||e.webkitIndexedDB||e.msIndexedDB||e.shimIndexedDB;if(null==t)throw new Error("The current browser does not appear to support IndexedDB.");return t}function cr(e){const t=e.result;t.createObjectStore(ir,{keyPath:"modelPath"}),t.createObjectStore(ur,{keyPath:"modelPath"})}class pr{constructor(e){if(this.indexedDB=lr(),null==e||!e)throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");this.modelPath=e}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");return this.databaseAction(this.modelPath,e)}async load(){return this.databaseAction(this.modelPath)}databaseAction(e,t){return new Promise(((e,n)=>{const a=this.indexedDB.open(or,1);a.onupgradeneeded=()=>cr(a),a.onsuccess=()=>{const r=a.result;if(null==t){const t=r.transaction(ir,"readonly"),a=t.objectStore(ir).get(this.modelPath);a.onsuccess=()=>{if(null==a.result)return r.close(),n(new Error(`Cannot find model with path '${this.modelPath}' in IndexedDB.`));e(a.result.modelArtifacts)},a.onerror=e=>(r.close(),n(a.error)),t.oncomplete=()=>r.close()}else{const a=ar(t),s=r.transaction(ur,"readwrite");let o=s.objectStore(ur);const i=o.put({modelPath:this.modelPath,modelArtifactsInfo:a});let u;i.onsuccess=()=>{u=r.transaction(ir,"readwrite");const i=u.objectStore(ir).put({modelPath:this.modelPath,modelArtifacts:t,modelArtifactsInfo:a});i.onsuccess=()=>e({modelArtifactsInfo:a}),i.onerror=e=>{o=s.objectStore(ur);const t=o.delete(this.modelPath);t.onsuccess=()=>(r.close(),n(i.error)),t.onerror=e=>(r.close(),n(i.error))}},i.onerror=e=>(r.close(),n(i.error)),s.oncomplete=()=>{null==u?r.close():u.oncomplete=()=>r.close()}}},a.onerror=e=>n(a.error)}))}}pr.URL_SCHEME="indexeddb://";const dr=e=>{return j().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(pr.URL_SCHEME)?(t=e.slice(pr.URL_SCHEME.length),new pr(t)):null;var t};sr.registerSaveRouter(dr),sr.registerLoadRouter(dr);class hr{constructor(){this.indexedDB=lr()}async listModels(){return new Promise(((e,t)=>{const n=this.indexedDB.open(or,1);n.onupgradeneeded=()=>cr(n),n.onsuccess=()=>{const a=n.result,r=a.transaction(ur,"readonly"),s=r.objectStore(ur).getAll();s.onsuccess=()=>{const t={};for(const e of s.result)t[e.modelPath]=e.modelArtifactsInfo;e(t)},s.onerror=e=>(a.close(),t(s.error)),r.oncomplete=()=>a.close()},n.onerror=e=>t(n.error)}))}async removeModel(e){var t;return e=(t=e).startsWith(pr.URL_SCHEME)?t.slice(pr.URL_SCHEME.length):t,new Promise(((t,n)=>{const a=this.indexedDB.open(or,1);a.onupgradeneeded=()=>cr(a),a.onsuccess=()=>{const r=a.result,s=r.transaction(ur,"readwrite"),o=s.objectStore(ur),i=o.get(e);let u;i.onsuccess=()=>{if(null==i.result)return r.close(),n(new Error(`Cannot find model with path '${e}' in IndexedDB.`));{const a=o.delete(e),s=()=>{u=r.transaction(ir,"readwrite");const a=u.objectStore(ir).delete(e);a.onsuccess=()=>t(i.result.modelArtifactsInfo),a.onerror=e=>n(i.error)};a.onsuccess=s,a.onerror=e=>(s(),r.close(),n(i.error))}},i.onerror=e=>(r.close(),n(i.error)),s.oncomplete=()=>{null==u?r.close():u.oncomplete=()=>r.close()}},a.onerror=e=>n(a.error)}))}}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const mr="/",fr="tensorflowjs_models",gr="info",yr="model_topology",br="weight_specs",kr="weight_data",xr="model_metadata";function wr(e){return{info:[fr,e,gr].join(mr),topology:[fr,e,yr].join(mr),weightSpecs:[fr,e,br].join(mr),weightData:[fr,e,kr].join(mr),modelMetadata:[fr,e,xr].join(mr)}}function Nr(e){const t=e.split(mr);if(t.length<3)throw new Error(`Invalid key format: ${e}`);return t.slice(1,t.length-1).join(mr)}class vr{constructor(e){if(!j().getBool("IS_BROWSER")||"undefined"==typeof window||void 0===window.localStorage)throw new Error("The current environment does not support local storage.");if(this.LS=window.localStorage,null==e||!e)throw new Error("For local storage, modelPath must not be null, undefined or empty.");this.modelPath=e,this.keys=wr(this.modelPath)}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");{const t=JSON.stringify(e.modelTopology),n=JSON.stringify(e.weightSpecs),a=ar(e);try{this.LS.setItem(this.keys.info,JSON.stringify(a)),this.LS.setItem(this.keys.topology,t),this.LS.setItem(this.keys.weightSpecs,n),this.LS.setItem(this.keys.weightData,function(e){if(Za)return Buffer.from(e).toString("base64");const t=new Uint8Array(e);let n="";for(let e=0,a=t.length;e<a;e++)n+=String.fromCharCode(t[e]);return btoa(n)}(e.weightData));const r={format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy};return null!=e.signature&&(r.signature=e.signature),null!=e.userDefinedMetadata&&(r.userDefinedMetadata=e.userDefinedMetadata),null!=e.modelInitializer&&(r.modelInitializer=e.modelInitializer),this.LS.setItem(this.keys.modelMetadata,JSON.stringify(r)),{modelArtifactsInfo:a}}catch(e){throw this.LS.removeItem(this.keys.info),this.LS.removeItem(this.keys.topology),this.LS.removeItem(this.keys.weightSpecs),this.LS.removeItem(this.keys.weightData),this.LS.removeItem(this.keys.modelMetadata),new Error(`Failed to save model '${this.modelPath}' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=${a.modelTopologyBytes}, weightSpecsBytes=${a.weightSpecsBytes}, weightDataBytes=${a.weightDataBytes}.`)}}}async load(){const e=JSON.parse(this.LS.getItem(this.keys.info));if(null==e)throw new Error(`In local storage, there is no model with name '${this.modelPath}'`);if("JSON"!==e.modelTopologyType)throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");const t={},n=JSON.parse(this.LS.getItem(this.keys.topology));if(null==n)throw new Error(`In local storage, the topology of model '${this.modelPath}' is missing.`);t.modelTopology=n;const a=JSON.parse(this.LS.getItem(this.keys.weightSpecs));if(null==a)throw new Error(`In local storage, the weight specs of model '${this.modelPath}' are missing.`);t.weightSpecs=a;const r=this.LS.getItem(this.keys.modelMetadata);if(null!=r){const e=JSON.parse(r);t.format=e.format,t.generatedBy=e.generatedBy,t.convertedBy=e.convertedBy,null!=e.signature&&(t.signature=e.signature),null!=e.userDefinedMetadata&&(t.userDefinedMetadata=e.userDefinedMetadata),null!=e.modelInitializer&&(t.modelInitializer=e.modelInitializer)}const s=this.LS.getItem(this.keys.weightData);if(null==s)throw new Error(`In local storage, the binary weight values of model '${this.modelPath}' are missing.`);return t.weightData=function(e){if(Za){const t=Buffer.from(e,"base64");return t.buffer.slice(t.byteOffset,t.byteOffset+t.byteLength)}const t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;++e)n.set([t.charCodeAt(e)],e);return n.buffer}(s),t}}vr.URL_SCHEME="localstorage://";const Tr=e=>{return j().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(vr.URL_SCHEME)?(t=e.slice(vr.URL_SCHEME.length),new vr(t)):null;var t};sr.registerSaveRouter(Tr),sr.registerLoadRouter(Tr);class Ir{constructor(){u(j().getBool("IS_BROWSER"),(()=>"Current environment is not a web browser")),u("undefined"==typeof window||void 0!==window.localStorage,(()=>"Current browser does not appear to support localStorage")),this.LS=window.localStorage}async listModels(){const e={},t=fr+mr,n=mr+gr;for(let a=0;a<this.LS.length;++a){const r=this.LS.key(a);if(r.startsWith(t)&&r.endsWith(n)){e[Nr(r)]=JSON.parse(this.LS.getItem(r))}}return e}async removeModel(e){var t;const n=wr(e=(t=e).startsWith(vr.URL_SCHEME)?t.slice(vr.URL_SCHEME.length):t);if(null==this.LS.getItem(n.info))throw new Error(`Cannot find model at path '${e}'`);const a=JSON.parse(this.LS.getItem(n.info));return this.LS.removeItem(n.info),this.LS.removeItem(n.topology),this.LS.removeItem(n.weightSpecs),this.LS.removeItem(n.weightData),a}}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Sr="://";class Er{constructor(){this.managers={}}static getInstance(){return null==Er.instance&&(Er.instance=new Er),Er.instance}static registerManager(e,t){u(null!=e,(()=>"scheme must not be undefined or null.")),e.endsWith(Sr)&&(e=e.slice(0,e.indexOf(Sr))),u(e.length>0,(()=>"scheme must not be an empty string."));const n=Er.getInstance();u(null==n.managers[e],(()=>`A model store manager is already registered for scheme '${e}'.`)),n.managers[e]=t}static getManager(e){const t=this.getInstance().managers[e];if(null==t)throw new Error(`Cannot find model manager for scheme '${e}'`);return t}static getSchemes(){return Object.keys(this.getInstance().managers)}}function _r(e){if(-1===e.indexOf(Sr))throw new Error(`The url string provided does not contain a scheme. Supported schemes are: ${Er.getSchemes().join(",")}`);return{scheme:e.split(Sr)[0],path:e.split(Sr)[1]}}async function Mr(e,t,n=!1){u(e!==t,(()=>`Old path and new path are the same: '${e}'`));const a=sr.getLoadHandlers(e);u(a.length>0,(()=>`Copying failed because no load handler is found for source URL ${e}.`)),u(a.length<2,(()=>`Copying failed because more than one (${a.length}) load handlers for source URL ${e}.`));const r=a[0],s=sr.getSaveHandlers(t);u(s.length>0,(()=>`Copying failed because no save handler is found for destination URL ${t}.`)),u(s.length<2,(()=>`Copying failed because more than one (${a.length}) save handlers for destination URL ${t}.`));const o=s[0],i=_r(e).scheme,l=_r(e).path,c=i===_r(e).scheme,p=await r.load();n&&c&&await Er.getManager(i).removeModel(l);const d=await o.save(p);return n&&!c&&await Er.getManager(i).removeModel(l),d.modelArtifactsInfo}
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class Ar{fetch(e,t){return fetch(e,t)}now(){return performance.now()}encode(e,t){if("utf-8"!==t&&"utf8"!==t)throw new Error(`Browser's encoder only supports utf-8, but got ${t}`);return null==this.textEncoder&&(this.textEncoder=new TextEncoder),this.textEncoder.encode(e)}decode(e,t){return new TextDecoder(t).decode(e)}}if(j().get("IS_BROWSER")){j().setPlatform("browser",new Ar);try{Er.registerManager(vr.URL_SCHEME,new Ir)}catch(e){}try{Er.registerManager(pr.URL_SCHEME,new hr)}catch(e){}}
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const $r=()=>require("node-fetch");let Dr;class Fr{constructor(){this.util=require("util"),this.textEncoder=new this.util.TextEncoder}fetch(e,t){return null!=j().global.fetch?j().global.fetch(e,t):(null==Dr&&(Dr=$r()),Dr(e,t))}now(){const e=process.hrtime();return 1e3*e[0]+e[1]/1e6}encode(e,t){if("utf-8"!==t&&"utf8"!==t)throw new Error(`Node built-in encoder only supports utf-8, but got ${t}`);return this.textEncoder.encode(e)}decode(e,t){return 0===e.length?"":new this.util.TextDecoder(t).decode(e)}}
/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function Or(e,t="float32",n){return t=t||"float32",L(e),new ha(e,t,n)}
/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */j().get("IS_NODE")&&j().setPlatform("node",new Fr);const Cr=ja({cast_:function(e,t){const n=Wa(e,"x","cast");if(!N(t))throw new Error(`Failed to cast to unknown dtype ${t}`);if("string"===t&&"string"!==n.dtype||"string"!==t&&"string"===n.dtype)throw new Error("Only strings can be casted to strings");const a={x:n},r={dtype:t};return Oa.runKernel(ye,a,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Rr=ja({clone_:function(e){const t={x:Wa(e,"x","clone","string_or_numeric")};return Oa.runKernel(ot,t)}});
/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zr(e,t=!1){console.log(e.toString(t))}
/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */Fa();fa={buffer:Or,cast:Cr,clone:Rr,print:zr};function Br(e){return new Promise((e=>setTimeout(e))).then(e)}class Lr{constructor(e){if(!j().getBool("IS_BROWSER"))throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");e.startsWith(Lr.URL_SCHEME)&&(e=e.slice(Lr.URL_SCHEME.length)),null!=e&&0!==e.length||(e="model"),this.modelTopologyFileName=e+".json",this.weightDataFileName=e+".weights.bin"}async save(e){if("undefined"==typeof document)throw new Error("Browser downloads are not supported in this environment since `document` is not present");const t=window.URL.createObjectURL(new Blob([e.weightData],{type:"application/octet-stream"}));if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");{const n=[{paths:["./"+this.weightDataFileName],weights:e.weightSpecs}],a={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,weightsManifest:n};null!=e.signature&&(a.signature=e.signature),null!=e.userDefinedMetadata&&(a.userDefinedMetadata=e.userDefinedMetadata),null!=e.modelInitializer&&(a.modelInitializer=e.modelInitializer);const r=window.URL.createObjectURL(new Blob([JSON.stringify(a)],{type:"application/json"})),s=null==this.jsonAnchor?document.createElement("a"):this.jsonAnchor;if(s.download=this.modelTopologyFileName,s.href=r,await Br((()=>s.dispatchEvent(new MouseEvent("click")))),null!=e.weightData){const e=null==this.weightDataAnchor?document.createElement("a"):this.weightDataAnchor;e.download=this.weightDataFileName,e.href=t,await Br((()=>e.dispatchEvent(new MouseEvent("click"))))}return{modelArtifactsInfo:ar(e)}}}}Lr.URL_SCHEME="downloads://";class Pr{constructor(e){if(null==e||e.length<1)throw new Error(`When calling browserFiles, at least 1 file is required, but received ${e}`);this.files=e}async load(){const e=this.files[0],t=this.files.slice(1);return new Promise(((n,a)=>{const r=new FileReader;r.onload=r=>{const s=JSON.parse(r.target.result),o=s.modelTopology;if(null==o)return void a(new Error(`modelTopology field is missing from file ${e.name}`));0===t.length&&n({modelTopology:o});const i=s.weightsManifest;if(null==i)return void a(new Error(`weightManifest field is missing from file ${e.name}`));let u;try{u=this.checkManifestAndWeightFiles(i,t)}catch(e){return void a(e)}const l=[],c=[],p=[];i.forEach((e=>{e.paths.forEach((e=>{c.push(e),p.push(null)})),l.push(...e.weights)})),i.forEach((e=>{e.paths.forEach((e=>{const t=new FileReader;t.onload=t=>{const a=t.target.result,r=c.indexOf(e);if(p[r]=a,-1===p.indexOf(null)){const e={modelTopology:o,weightSpecs:l,weightData:tr(p),format:s.format,generatedBy:s.generatedBy,convertedBy:s.convertedBy};null!=s.signature&&(e.signature=s.signature),null!=s.userDefinedMetadata&&(e.userDefinedMetadata=s.userDefinedMetadata),null!=s.modelInitializer&&(e.modelInitializer=s.modelInitializer),n(e)}},t.onerror=t=>a(`Failed to weights data from file of path '${e}'.`),t.readAsArrayBuffer(u[e])}))}))},r.onerror=t=>a(`Failed to read model topology and weights manifest JSON from file '${e.name}'. BrowserFiles supports loading Keras-style tf.Model artifacts only.`),r.readAsText(e)}))}checkManifestAndWeightFiles(e,t){const n=[],a=t.map((e=>nr(e.name))),r={};for(const s of e)s.paths.forEach((e=>{const s=nr(e);if(-1!==n.indexOf(s))throw new Error(`Duplicate file basename found in weights manifest: '${s}'`);if(n.push(s),-1===a.indexOf(s))throw new Error(`Weight file with basename '${s}' is not provided.`);r[e]=t[a.indexOf(s)]}));if(n.length!==t.length)throw new Error(`Mismatch in the number of files in weights manifest (${n.length}) and the number of weight files provided (${t.length}).`);return r}}
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function Vr(e,t,n,a){!function(e){u(null!=e&&Array.isArray(e)&&e.length>0,(()=>"promises must be a none empty array"))}(e),function(e,t){u(e>=0&&e<=1,(()=>`Progress fraction must be in range [0, 1], but got startFraction ${e}`)),u(t>=0&&t<=1,(()=>`Progress fraction must be in range [0, 1], but got endFraction ${t}`)),u(t>=e,(()=>`startFraction must be no more than endFraction, but got startFraction ${e} and endFraction ${t}`))}(n=null==n?0:n,a=null==a?1:a);let r=0;return Promise.all(e.map((s=>(s.then((s=>{const o=n+ ++r/e.length*(a-n);return t(o),s})),s))))}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function Wr(e,t){null==t&&(t={});const n=null==t.fetchFunc?j().platform.fetch:t.fetchFunc,a=e.map((e=>n(e,t.requestInit,{isBinary:!0}))),r=(null==t.onProgress?await Promise.all(a):await Vr(a,t.onProgress,0,.5)).map((e=>e.arrayBuffer()));return null==t.onProgress?await Promise.all(r):await Vr(r,t.onProgress,.5,1)}function Hr(e){return async(t,n="",a)=>{const r=t.map((()=>!1)),s={},o=null!=a?a.map((()=>!1)):[],i=[];if(t.forEach(((e,t)=>{let n=0;e.weights.forEach((e=>{const u="quantization"in e?e.quantization.dtype:e.dtype,l=Ya[u]*d(e.shape),c=()=>{r[t]=!0,null==s[t]&&(s[t]=[]),s[t].push({manifestEntry:e,groupOffset:n,sizeBytes:l})};null!=a?a.forEach(((t,n)=>{t===e.name&&(c(),o[n]=!0)})):c(),i.push(e.name),n+=l}))})),!o.every((e=>e))){const e=a.filter(((e,t)=>!o[t]));throw new Error(`Could not find weights in manifest with names: ${e.join(", ")}. \nManifest JSON has weights with names: ${i.join(", ")}.`)}const u=r.reduce(((e,t,n)=>(t&&e.push(n),e)),[]),l=[];u.forEach((e=>{t[e].paths.forEach((e=>{const t=n+(n.endsWith("/")?"":"/")+e;l.push(t)}))}));const c=await e(l),p={};let h=0;return u.forEach((e=>{const n=t[e].paths.length;let a=0;for(let e=0;e<n;e++)a+=c[h+e].byteLength;const r=new ArrayBuffer(a),o=new Uint8Array(r);let i=0;for(let e=0;e<n;e++){const t=new Uint8Array(c[h+e]);o.set(t,i),i+=t.byteLength}s[e].forEach((e=>{const t=Xa(r.slice(e.groupOffset,e.groupOffset+e.sizeBytes),[e.manifestEntry]);for(const e in t)p[e]=t[e]})),h+=n})),p}}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */sr.registerSaveRouter((e=>j().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(Lr.URL_SCHEME)?function(e="model"){return new Lr(e)}(e.slice(Lr.URL_SCHEME.length)):null));class qr{constructor(e,t){if(this.DEFAULT_METHOD="POST",null==t&&(t={}),this.weightPathPrefix=t.weightPathPrefix,this.onProgress=t.onProgress,this.weightUrlConverter=t.weightUrlConverter,null!=t.fetchFunc?(u("function"==typeof t.fetchFunc,(()=>"Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)")),this.fetch=t.fetchFunc):this.fetch=j().platform.fetch,u(null!=e&&e.length>0,(()=>"URL path for http must not be null, undefined or empty.")),Array.isArray(e)&&u(2===e.length,(()=>`URL paths for http must have a length of 2, (actual length is ${e.length}).`)),this.path=e,null!=t.requestInit&&null!=t.requestInit.body)throw new Error("requestInit is expected to have no pre-existing body, but has one.");this.requestInit=t.requestInit||{}}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");const t=Object.assign({method:this.DEFAULT_METHOD},this.requestInit);t.body=new FormData;const n=[{paths:["./model.weights.bin"],weights:e.weightSpecs}],a={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,weightsManifest:n};null!=e.signature&&(a.signature=e.signature),null!=e.userDefinedMetadata&&(a.userDefinedMetadata=e.userDefinedMetadata),null!=e.modelInitializer&&(a.modelInitializer=e.modelInitializer),t.body.append("model.json",new Blob([JSON.stringify(a)],{type:"application/json"}),"model.json"),null!=e.weightData&&t.body.append("model.weights.bin",new Blob([e.weightData],{type:"application/octet-stream"}),"model.weights.bin");const r=await this.fetch(this.path,t);if(r.ok)return{modelArtifactsInfo:ar(e),responses:[r]};throw new Error(`BrowserHTTPRequest.save() failed due to HTTP response status ${r.status}.`)}async load(){const e=await this.fetch(this.path,this.requestInit);if(!e.ok)throw new Error(`Request to ${this.path} failed with status code ${e.status}. Please verify this URL points to the model JSON of the model to load.`);let t;try{t=await e.json()}catch(e){let t=`Failed to parse model JSON of response from ${this.path}.`;throw this.path.endsWith(".pb")?t+=" Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository.":t+=" Please make sure the server is serving valid JSON for this request.",new Error(t)}const n=t.modelTopology,a=t.weightsManifest,r=t.generatedBy,s=t.convertedBy,o=t.format,i=t.signature,u=t.userDefinedMetadata;if(null==n&&null==a)throw new Error(`The JSON from HTTP path ${this.path} contains neither model topology or manifest for weights.`);let l,c;if(null!=a){const e=await this.loadWeights(a);[l,c]=e}const p={modelTopology:n,weightSpecs:l,weightData:c,generatedBy:r,convertedBy:s,format:o};null!=i&&(p.signature=i),null!=u&&(p.userDefinedMetadata=u);const d=t.modelInitializer;return d&&(p.modelInitializer=d),p}async loadWeights(e){const t=Array.isArray(this.path)?this.path[1]:this.path,[n,a]=function(e){const t=e.lastIndexOf("/"),n=e.lastIndexOf("?"),a=e.substring(0,t),r=n>t?e.substring(n):"";return[a+"/",r]}(t),r=this.weightPathPrefix||n,s=[];for(const t of e)s.push(...t.weights);const o=[],i=[];for(const t of e)for(const e of t.paths)null!=this.weightUrlConverter?i.push(this.weightUrlConverter(e)):o.push(r+e+a);this.weightUrlConverter&&o.push(...await Promise.all(i));return[s,tr(await Wr(o,{requestInit:this.requestInit,fetchFunc:this.fetch,onProgress:this.onProgress}))]}}function jr(e){return null!=e.match(qr.URL_SCHEME_REGEX)}qr.URL_SCHEME_REGEX=/^https?:\/\//;const Ur=(e,t)=>{if("undefined"==typeof fetch&&(null==t||null==t.fetchFunc))return null;{let n=!0;if(n=Array.isArray(e)?e.every((e=>jr(e))):jr(e),n)return Kr(e,t)}return null};function Kr(e,t){return new qr(e,t)}sr.registerSaveRouter(Ur),sr.registerLoadRouter(Ur);
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class Gr{constructor(e){this.modelArtifacts=e}async load(){return this.modelArtifacts}}class Yr{constructor(e){this.saveHandler=e}async save(e){return this.saveHandler(e)}}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var Qr=Object.freeze({__proto__:null,browserFiles:function(e){return new Pr(e)},browserHTTPRequest:function(e,t){return Kr(e,t)},concatenateArrayBuffers:tr,copyModel:async function(e,t){return Mr(e,t,!1)},decodeWeights:Xa,encodeWeights:async function(e,t){const n=[],a=[],r=Array.isArray(e)?e.map((e=>e.name)):Object.keys(e);for(let s=0;s<r.length;++s){const o=r[s],i=Array.isArray(e)?e[s].tensor:e[o];if("float32"!==i.dtype&&"int32"!==i.dtype&&"bool"!==i.dtype&&"string"!==i.dtype&&"complex64"!==i.dtype)throw new Error(`Unsupported dtype in weight '${o}': ${i.dtype}`);const u={name:o,shape:i.shape,dtype:i.dtype};if("string"===i.dtype){const e=new Promise((async e=>{const t=await i.bytes(),n=t.reduce(((e,t)=>e+t.length),0)+Qa*t.length,a=new Uint8Array(n);let r=0;for(let e=0;e<t.length;e++){const n=t[e],s=new Uint8Array(new Uint32Array([n.length]).buffer);a.set(s,r),r+=Qa,a.set(n,r),r+=n.length}e(a)}));a.push(e)}else a.push(i.data());null!=t&&(u.group=t),n.push(u)}return{data:Ja(await Promise.all(a)),specs:n}},fromMemory:function(e,t,n,a){if(1===arguments.length){return null!=e.modelTopology||null!=e.weightSpecs?new Gr(e):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new Gr({modelTopology:e}))}return console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new Gr({modelTopology:e,weightSpecs:t,weightData:n,trainingConfig:a})},getLoadHandlers:(e,t)=>sr.getLoadHandlers(e,t)
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */,getModelArtifactsInfoForJSON:ar,getSaveHandlers:e=>sr.getSaveHandlers(e),http:Kr,isHTTPScheme:jr,listModels:async function(){const e=Er.getSchemes(),t={};for(const n of e){const e=await Er.getManager(n).listModels();for(const a in e){t[n+Sr+a]=e[a]}}return t},loadWeights:async function(e,t="",n,a){return Hr((e=>Wr(e,{requestInit:a})))(e,t,n)},moveModel:async function(e,t){return Mr(e,t,!0)},registerLoadRouter:e=>sr.registerLoadRouter(e),registerSaveRouter:e=>sr.registerSaveRouter(e),removeModel:async function(e){const t=_r(e);return Er.getManager(t.scheme).removeModel(t.path)},weightsLoaderFactory:Hr,withSaveHandler:function(e){return new Yr(e)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Xr=ja({matMul_:function(e,t,n=!1,a=!1){let r=Wa(e,"a","matMul"),s=Wa(t,"b","matMul");[r,s]=Ia(r,s);const o={a:r,b:s},i={transposeA:n,transposeB:a};return Oa.runKernel(me,o,i)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Jr=ja({oneHot_:function(e,t,n=1,a=0){if(t<2)throw new Error(`Error in oneHot: depth must be >=2, but it is ${t}`);const r={indices:Wa(e,"indices","oneHot","int32")},s={depth:t,onValue:n,offValue:a};return Oa.runKernel(Ht,r,s)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Zr=ja({transpose_:function(e,t){const n=Wa(e,"x","transpose");if(null==t&&(t=n.shape.map(((e,t)=>t)).reverse()),u(n.rank===t.length,(()=>`Error in transpose: rank of input ${n.rank} must match length of perm ${t}.`)),t.forEach((e=>{u(e>=0&&e<n.rank,(()=>"All entries in 'perm' must be between 0 and "+(n.rank-1)+` but got ${t}`))})),n.rank<=1)return n.clone();const a={x:n},r={perm:t};return Oa.runKernel(Dn,a,r)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const es=ja({confusionMatrix_:function(e,t,n){const a=Wa(e,"labels","confusionMatrix"),r=Wa(t,"predictions","confusionMatrix");u(null==n||n>0&&Number.isInteger(n),(()=>`If provided, numClasses must be a positive integer, but got ${n}`)),u(1===a.rank,(()=>`Expected the rank of labels to be 1, but got ${a.rank}`)),u(1===r.rank,(()=>`Expected the rank of predictions to be 1, but got ${r.rank}`)),u(a.shape[0]===r.shape[0],(()=>`Mismatch in the number of examples: ${a.shape[0]} vs. ${r.shape[0]}. Labels and predictions should have the same number of elements.`)),u(n>0&&Number.isInteger(n),(()=>`numClasses is required to be a positive integer, but got ${n}`));const s=Jr(Cr(a,"int32"),n),o=Jr(Cr(r,"int32"),n),i=Zr(s),l=Xr(i,o);return Cr(l,"int32")}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var ts=Object.freeze({__proto__:null,confusionMatrix:es});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ns(e,t,n){if(c(e),null!=t&&3!==t.length)throw new Error("tensor3d() requires shape to have three numbers");const a=La(e,n);if(3!==a.length&&1!==a.length)throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");if(1===a.length&&null==t)throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");return Ka(e,t,a,n)}
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */let as;const rs=ja({fromPixels_:function(e,t=3){if(t>4)throw new Error("Cannot construct Tensor with more than 4 channels from pixels.");if(null==e)throw new Error("pixels passed to tf.browser.fromPixels() can not be null");let n=!1,a=!1,r=!1,s=!1,o=!1,i=!1;if(e.data instanceof Uint8Array)n=!0;else if("undefined"!=typeof ImageData&&e instanceof ImageData)a=!0;else if("undefined"!=typeof HTMLVideoElement&&e instanceof HTMLVideoElement)r=!0;else if("undefined"!=typeof HTMLImageElement&&e instanceof HTMLImageElement)s=!0;else if(null!=e.getContext)o=!0;else{if(!("undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap))throw new Error(`pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData in browser, or OffscreenCanvas, ImageData in webworker or {data: Uint32Array, width: number, height: number}, but was ${e.constructor.name}`);i=!0}if(r){const t=2;if(r&&e.readyState<t)throw new Error("The video element has not loaded data yet. Please wait for `loadeddata` event on the <video> element.")}if(null!=jn(Bn,Oa.backendName)){const n={pixels:e},a={numChannels:t};return Oa.runKernel(Bn,n,a)}const[u,l]=r?[e.videoWidth,e.videoHeight]:[e.width,e.height];let c,p;if(o?c=e.getContext("2d").getImageData(0,0,u,l).data:a||n?c=e.data:(s||r||i)&&(null==as&&(as=document.createElement("canvas").getContext("2d")),as.canvas.width=u,as.canvas.height=l,as.drawImage(e,0,0,u,l),c=as.getImageData(0,0,u,l).data),4===t)p=new Int32Array(c);else{const e=u*l;p=new Int32Array(e*t);for(let n=0;n<e;n++)for(let e=0;e<t;++e)p[n*t+e]=c[4*n+e]}return ns(p,[l,u,t],"int32")}});var ss=Object.freeze({__proto__:null,fromPixels:rs,toPixels:async function(e,t){let n=Wa(e,"img","toPixels");if(!(e instanceof ga)){const e=n;n=Cr(e,"int32"),e.dispose()}if(2!==n.rank&&3!==n.rank)throw new Error(`toPixels only supports rank 2 or 3 tensors, got rank ${n.rank}.`);const[a,r]=n.shape.slice(0,2),s=2===n.rank?1:n.shape[2];if(s>4||2===s)throw new Error(`toPixels only supports depth of size 1, 3 or 4 but got ${s}`);if("float32"!==n.dtype&&"int32"!==n.dtype)throw new Error(`Unsupported type for toPixels: ${n.dtype}. Please use float32 or int32 tensors.`);const o=await n.data(),i="float32"===n.dtype?255:1,u=new Uint8ClampedArray(r*a*4);for(let e=0;e<a*r;++e){const t=[0,0,0,255];for(let a=0;a<s;a++){const r=o[e*s+a];if("float32"===n.dtype){if(r<0||r>1)throw new Error(`Tensor values for a float32 Tensor must be in the range [0 - 1] but encountered ${r}.`)}else if("int32"===n.dtype&&(r<0||r>255))throw new Error(`Tensor values for a int32 Tensor must be in the range [0 - 255] but encountered ${r}.`);1===s?(t[0]=r*i,t[1]=r*i,t[2]=r*i):t[a]=r*i}const a=4*e;u[a+0]=Math.round(t[0]),u[a+1]=Math.round(t[1]),u[a+2]=Math.round(t[2]),u[a+3]=Math.round(t[3])}if(null!=t){t.width=r,t.height=a;const e=t.getContext("2d"),n=new ImageData(u,r,a);e.putImageData(n,0,0)}return n!==e&&n.dispose(),u}});function os(e,t){const n=e.shape.length,a=t.shape.length;if(n<1)throw new Error(`tf.gatherND() expects the input to be rank 1 or higher, but the rank was ${n}.`);if(a<1)throw new Error(`tf.gatherND() expects the indices to be rank 1 or higher, but the rank was ${a}.`);if("int32"!==t.dtype)throw new Error(`tf.gatherND() expects the indices to be int32 type, but the dtype was ${t.dtype}.`);if(t.shape[a-1]>n)throw new Error(`index innermost dimension length must be <= tensor rank; saw: ${t.shape[a-1]} vs. ${n}`);if(0===d(e.shape))throw new Error(`Requested more than 0 entries, but input is empty. Input shape: ${e.shape}.`);const r=t.shape,s=r[r.length-1];let o=1;for(let e=0;e<r.length-1;++e)o*=r[e];const i=e.shape,u=r.slice();u.pop();let l=1;for(let e=s;e<n;++e)l*=i[e],u.push(i[e]);const c=[...F(e.shape).map((e=>e/l)),1].slice(0,s);return[u,o,l,c]}var is=Object.freeze({__proto__:null,prepareAndValidate:os});function us(e,t,n){const a=t.rank>1?t.shape[t.rank-1]:1,r=t.rank>1?t.rank-1:1,s=`Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: ${n.shape}, indices.shape: ${t.shape}, shape: ${e}, sliceDim: ${a}, and batchDim: ${r}.`;if(n.rank<r)throw new Error(s+` update.rank < ${r}. `);if(e.length<a+(n.rank-r))throw new Error(s+` Output shape length < ${a+(n.rank-r)}`);if(n.rank!==r+e.length-a)throw new Error(s+" update.rank != "+(r+e.length-a));for(let e=0;e<r;++e)if(n.shape[e]!==t.shape[e])throw new Error(s+` updates.shape[${e}] (${n.shape[e]}) != indices.shape[${e}] (${t.shape[e]}).`);for(let t=0;t<n.rank-r;++t)if(n.shape[t+r]!==e[t+a])throw new Error(s+` updates.shape[${t+r}] (${n.shape[t+r]}) != shape[${t+r}] (${e[t+r]})`)}function ls(e,t,n){if(t.rank<1)throw new Error(`tf.scatterND() expects the indices to be rank 1 or higher, but the rank was ${t.rank}.`);if(e.rank<1)throw new Error(`tf.scatterND() expects the updates to be rank 1 or higher, but the rank was ${e.rank}.`);if("int32"!==t.dtype)throw new Error(`The dtype of 'indices' should be int32, but got dtype: ${t.dtype}`);if(n.length<1)throw new Error(`Output rank must be greater or equal to 1, but got shape: ${n}`);if(0===n.length){if(0===t.size)throw new Error(`Indices specified for empty output. indices shape: ${t.shape}`);if(0===e.size)throw new Error(`Updates specified for empty output. updates shape: ${e.shape}`)}us(n,t,e)}function cs(e,t,n){const a=t.shape.length,r=a>1?t.shape[a-1]:1,s=n.length;let o=1;for(let e=r;e<s;++e)o*=n[e];const i=r<1?1:r;return{sliceRank:r,numUpdates:d(t.shape)/i,sliceSize:o,strides:[...F(n.slice(0,r)),1],outputSize:d(n)}}var ps=Object.freeze({__proto__:null,calculateShapes:cs,validateInput:ls,validateUpdateShape:us});
/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ds(e,t,n){const a=e.shape.length;u(a===t.length,(()=>`Error in slice${a}D: Length of begin ${t} must match the rank of the array (${a}).`)),u(a===n.length,(()=>`Error in slice${a}D: Length of size ${n} must match the rank of the array (${a}).`));for(let r=0;r<a;++r)u(t[r]+n[r]<=e.shape[r],(()=>`Error in slice${a}D: begin[${r}] + size[${r}] (${t[r]+n[r]}) would overflow input.shape[${r}] (${e.shape[r]})`))}function hs(e){const t=[];let n=0;for(;e>0;)1&e&&t.push(n),e/=2,n++;return t}function ms(e,t,n){const a=[];for(let r=0;r<e.length;r++)a[r]=Math.ceil((t[r]-e[r])/n[r]);return a}function fs(e,t,n,a){const r=[...e];for(let e=r.length;e<a.length;e++)r.push(1);for(let e=0;e<n;e++)0===e?r[t]=1:(r.splice(t,0,1),r.pop());return r}function gs(e,t,n){return n<=e?n:n-(t-1)}function ys(e,t){const n=[];for(let a=0;a<e;a++)n.push(t+a);return n}function bs(e,t,n,a,r,s,o,i,u){const l=e.length;let c=new Array(l),p=new Array(l),d=new Array(l);if(t.length&&n>0){const u=t[0],l=n+1;c=ks(o,u,l,a,e),p=xs(i,u,l,r,e),d=fs(s,u,l,e)}else for(let t=0;t<l;t++)c[t]=Ns(o,a,s,e,t,u),p[t]=vs(i,r,s,e,t,u),d[t]=ws(s,t,u);return{begin:c,end:p,strides:d}}function ks(e,t,n,a,r){const s=[...r],o=ys(n,t);for(let r=0;r<s.length;r++)if(o.indexOf(r)>-1)s[r]=0;else{const o=gs(t,n,r);let i=a[o];e&1<<o&&(i=0),s[r]=i}return s}function xs(e,t,n,a,r){const s=[...r],o=ys(n,t);for(let r=0;r<s.length;r++)if(o.indexOf(r)>-1)s[r]=Number.MAX_SAFE_INTEGER;else{const o=gs(t,n,r);let i=a[o];e&1<<o&&(i=Number.MAX_SAFE_INTEGER),s[r]=i}for(let e=0;e<s.length;e++){const t=r[e];s[e]<0&&(s[e]+=t),s[e]=i(0,s[e],r[e])}return s}function ws(e,t,n){let a=e[t];return(n&1<<t||null==a)&&(a=1),a}function Ns(e,t,n,a,r,s){let o=t[r];const u=n[r]||1;(e&1<<r||s&1<<r||null==o)&&(o=u>0?Number.MIN_SAFE_INTEGER:Number.MAX_SAFE_INTEGER);const l=a[r];return o<0&&(o+=l),o=i(0,o,l-1),o}function vs(e,t,n,a,r,s){let o=t[r];const u=n[r]||1;(e&1<<r||s&1<<r||null==o)&&(o=u>0?Number.MAX_SAFE_INTEGER:Number.MIN_SAFE_INTEGER);const l=a[r];return o<0&&(o+=l),o=u>0?i(0,o,l):i(-1,o,l-1),o}function Ts(e,t,n){let a=n.length;for(let e=0;e<n.length;e++)if(n[e]>1){a=e;break}for(let r=a+1;r<n.length;r++)if(t[r]>0||n[r]!==e[r])return!1;return!0}function Is(e,t){let n=e.length>0?e[e.length-1]:1;for(let a=0;a<e.length-1;a++)n+=e[a]*t[a];return n}function Ss(e,t,n){let a;const r=e.shape.length;let s;return a="number"==typeof t?[t,...new Array(r-1).fill(0)]:t.length<r?t.concat(new Array(r-t.length).fill(0)):t.slice(),a.forEach((e=>{u(-1!==e,(()=>"slice() does not support negative begin indexing."))})),s=null==n?new Array(r).fill(-1):"number"==typeof n?[n,...new Array(r-1).fill(-1)]:n.length<r?n.concat(new Array(r-n.length).fill(-1)):n,s=s.map(((t,n)=>t>=0?t:(u(-1===t,(()=>`Negative size values should be exactly -1 but got ${t} for the slice() size at index ${n}.`)),e.shape[n]-a[n]))),[a,s]}function Es(e,t,n,a,r,s,o,i,u){let l=t.slice(),c=n.slice(),p=a;null==a&&(p=new Array(l.length));const d=hs(o);if(d.length>1)throw new Error("Multiple ellipses in slice is not allowed.");if(0!==o&&0!==i)throw new Error("Using both ellipsisMask and newAxisMask is not yet supported.");if(0!==o&&0!==u)throw new Error("Using both ellipsisMask and shrinkAxisMask is not yet supported.");const h=e.length-l.length,m=hs(i),f=e.slice();m.forEach((e=>{l[e]=0,c[e]=1,f.splice(e,0,1)}));const{begin:g,end:y,strides:b}=bs(f,d,h,l,c,p,r,s,o);l=g,c=y,p=b;const k=hs(u);k.forEach((e=>{c[e]=l[e]+1,p[e]=1}));const x=ms(l,c,p),w=x.filter(((e,t)=>-1===k.indexOf(t)));return{nonStrided:p.every((e=>1===e)),$begin:l,$end:c,$strides:p,size:x,newShape:f,outShape:w}}var _s=Object.freeze({__proto__:null,assertParamsValid:ds,computeFlatOffset:Is,computeOutShape:ms,getNormalizedAxes:bs,isSliceContinous:Ts,maskToAxes:hs,parseSliceParams:Ss,sliceInfo:Es,startForAxis:Ns,startIndicesWithElidedDims:ks,stopForAxis:vs,stopIndicesWithElidedDims:xs,stridesForAxis:ws,stridesWithElidedDims:fs});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Ms{getClassName(){return this.constructor.className}static fromConfig(e,t){return new e(t)}}class As{constructor(){this.classNameMap={}}static getMap(){return null==As.instance&&(As.instance=new As),As.instance}static register(e){As.getMap().classNameMap[e.className]=[e,e.fromConfig]}}function $s(e){u(null!=e.className,(()=>"Class being registered does not have the static className property defined.")),u("string"==typeof e.className,(()=>"className is required to be a string, but got type "+typeof e.className)),u(e.className.length>0,(()=>"Class being registered has an empty-string as its className, which is disallowed.")),As.register(e)}var Ds=Object.freeze({__proto__:null,Serializable:Ms,SerializationMap:As,registerClass:$s});
/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Fs=.001,Os=.1;function Cs(){return 32===Oa.backend.floatPrecision()?Fs:Os}function Rs(e,t,n){let a=!0;if((T(e)||T(t))&&(a=!1),T(e)&&T(t)&&(a=!0),a){const n=e.constructor.name,a=t.constructor.name;if(n!==a)throw new Error(`Arrays are of different type. Actual: ${n}. Expected: ${a}`)}if(Array.isArray(e)&&Array.isArray(t)){const n=La(e),a=La(t);if(!h(n,a))throw new Error(`Arrays have different shapes. Actual: [${n}]. Expected: [${a}]`)}const r=T(e)?e:p(e),s=T(t)?t:p(t);if(r.length!==s.length)throw new Error(`Arrays have different lengths actual: ${r.length} vs expected: ${s.length}.\nActual:   ${r}.\nExpected: ${s}.`);for(let e=0;e<s.length;++e){const t=r[e],a=s[e];if(!n(t,a))throw new Error(`Arrays differ: actual[${e}] = ${t}, expected[${e}] = ${a}.\nActual:   ${r}.\nExpected: ${s}.`)}}function zs(e,t,n){return!isFinite(e)&&!isFinite(t)||!(isNaN(e)||isNaN(t)||Math.abs(e-t)>n)}var Bs=Object.freeze({__proto__:null,TEST_EPSILON_FLOAT16:Os,encodeStrings:function e(t){for(let n=0;n<t.length;n++){const a=t[n];Array.isArray(a)?e(a):t[n]=Zn(a)}return t},expectArrayBuffersEqual:function(e,t){expect(new Float32Array(e)).toEqual(new Float32Array(t))},expectArraysClose:function(e,t,n){return null==n&&(n=Cs()),Rs(e,t,((e,t)=>zs(e,t,n)))},expectArraysEqual:function(e,t){const n="string"==typeof t||"number"==typeof t||"boolean"==typeof t?[t]:t;return E(e)||E(e[0])||E(t)||E(t[0])?Rs(e,n,((e,t)=>e==t)):Rs(e,t,((e,t)=>zs(e,t,0)))},expectNumbersClose:function(e,t,n){if(null==n&&(n=Cs()),!zs(e,t,n))throw new Error(`Numbers differ: actual === ${e}, expected === ${t}`)},expectPromiseToFail:function(e,t){e().then((()=>t.fail()),(()=>t()))},expectValuesInRange:function(e,t,n){for(let a=0;a<e.length;a++)if(e[a]<t||e[a]>n)throw new Error(`Value out of range:${e[a]} low: ${t}, high: ${n}`)},testEpsilon:Cs});/** @license See the LICENSE file. */function Ls(){return Oa}function Ps(e,t){return Oa.tidy(e,t)}function Vs(e){Ea(e).forEach((e=>e.dispose()))}function Ws(e){return Oa.keep(e)}function Hs(e,t,n=1){return Oa.registerBackend(e,t,n)}const qs=ja({add_:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e,t){let n=Wa(e,"a","add"),a=Wa(t,"b","add");[n,a]=Ia(n,a);const r={a:n,b:a};return Oa.runKernel(Z,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const js=ja({floorDiv_:function(e,t){let n=Wa(e,"a","floorDiv"),a=Wa(t,"b","floorDiv");[n,a]=Ia(n,a);const r={a:n,b:a};return Oa.runKernel(et,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Us=ja({div_:function(e,t){let n=Wa(e,"a","div"),a=Wa(t,"b","div");if([n,a]=Ia(n,a),"int32"===n.dtype&&"int32"===a.dtype)return js(n,a);const r={a:n,b:a};return Oa.runKernel(We,r,{})}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ks=ja({mul_:function(e,t){let n=Wa(e,"a","mul"),a=Wa(t,"b","mul");[n,a]=Ia(n,a);const r={a:n,b:a};return Oa.runKernel(Rt,r)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Gs=ja({abs_:function(e){const t=Wa(e,"x","abs");if("complex64"===t.dtype){const e={x:t};return Oa.runKernel(we,e)}{const e={x:t};return Oa.runKernel(Q,e)}}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ys=ja({acos_:function(e){const t={x:Wa(e,"x","acos")};return Oa.runKernel(X,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Qs=ja({acosh_:function(e){const t={x:Wa(e,"x","acosh")};return Oa.runKernel(J,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Xs=ja({addN_:function(e){u(Array.isArray(e),(()=>"The argument passed to tf.addN() must be a list of tensors")),u(e.length>=1,(()=>`Must pass at least one tensor to tf.addN(), but got ${e.length}`));const t=e.map(((e,t)=>Wa(e,`tensors${t}`,"addN"))),n=t[0];t.forEach((e=>{if(e.dtype!==n.dtype)throw new Error("All tensors passed to tf.addN() must have the same dtype")})),t.forEach((e=>{if(!h(e.shape,n.shape))throw new Error("All tensors passed to tf.addN() must have the same shape")}));const a=t;return Oa.runKernel(ee,a)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Js=ja({all_:function(e,t=null,n=!1){const a={x:Wa(e,"x","all","bool")},r={axis:t,keepDims:n};return Oa.runKernel(te,a,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Zs=ja({any_:function(e,t=null,n=!1){const a={x:Wa(e,"x","any","bool")},r={axis:t,keepDims:n};return Oa.runKernel(ne,a,r)}});
/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const eo=ja({argMax_:function(e,t=0){const n={x:Wa(e,"x","argMax")},a={axis:t};return Oa.runKernel(ae,n,a)}});
/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const to=ja({argMin_:function(e,t=0){const n={x:Wa(e,"x","argMin")},a={axis:t};return Oa.runKernel(re,n,a)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const no=ja({asin_:function(e){const t={x:Wa(e,"x","asin")};return Oa.runKernel(se,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ao=ja({asinh_:function(e){const t={x:Wa(e,"x","asinh")};return Oa.runKernel(oe,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ro=ja({atan_:function(e){const t={x:Wa(e,"x","atan")};return Oa.runKernel(ie,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const so=ja({atan2_:function(e,t){let n=Wa(e,"a","atan2"),a=Wa(t,"b","atan2");[n,a]=Ia(n,a);const r={a:n,b:a};return Oa.runKernel(le,r)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const oo=ja({atanh_:function(e){const t={x:Wa(e,"x","atanh")};return Oa.runKernel(ue,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function io(e,t,n,a,r="NHWC",s){return co(e,[...t,e[3]],n,s,a,null,null,xo(r))}function uo(e,t,n,a,r,s,o="channelsLast"){const[i,u]=mo(t);let l;if("channelsLast"===o)l=[i,u,e[3],e[3]];else{if("channelsFirst"!==o)throw new Error(`Unknown dataFormat ${o}`);l=[i,u,e[1],e[1]]}return co(e,l,n,a,r,s,!1,o)}function lo(e,t,n,a,r,s,o="NDHWC"){const[i,u,l]=fo(t);let c,p;if("NDHWC"===o)p="channelsLast",c=[i,u,l,e[4],e[4]];else{if("NCDHW"!==o)throw new Error(`Unknown dataFormat ${o}`);p="channelsFirst",c=[i,u,l,e[1],e[1]]}return po(e,c,n,a,r,!1,p,s)}function co(e,t,n,a,r,s,o=!1,i="channelsLast"){let[u,l,c,p]=[-1,-1,-1,-1];if("channelsLast"===i)[u,l,c,p]=e;else{if("channelsFirst"!==i)throw new Error(`Unknown dataFormat ${i}`);[u,p,l,c]=e}const[d,h,,m]=t,[f,g]=mo(n),[y,b]=mo(a),k=go(d,y),x=go(h,b),{padInfo:w,outHeight:N,outWidth:v}=function(e,t,n,a,r,s,o,i,u){let l,c,p;if("number"==typeof e){l={top:e,bottom:e,left:e,right:e,type:0===e?"VALID":"NUMBER"};const r=function(e,t,n,a,r){null==a&&(a=ho(e,t,n));const s=e[0],o=e[1],i=yo((s-t+2*a)/n+1,r),u=yo((o-t+2*a)/n+1,r);return[i,u]}([t,n],s,a,e,i);c=r[0],p=r[1]}else if("same"===e){c=Math.ceil(t/a),p=Math.ceil(n/r);const e=Math.max(0,(c-1)*a+s-t),i=Math.max(0,(p-1)*r+o-n),u=Math.floor(e/2),d=e-u,h=Math.floor(i/2);l={top:u,bottom:d,left:h,right:i-h,type:"SAME"}}else if("valid"===e)l={top:0,bottom:0,left:0,right:0,type:"VALID"},c=Math.ceil((t-s+1)/a),p=Math.ceil((n-o+1)/r);else{if("object"!=typeof e)throw Error(`Unknown padding parameter: ${e}`);{const d="channelsLast"===u?e[1][0]:e[2][0],h="channelsLast"===u?e[1][1]:e[2][1],m="channelsLast"===u?e[2][0]:e[3][0],f="channelsLast"===u?e[2][1]:e[3][1];l={top:d,bottom:h,left:m,right:f,type:0===d&&0===h&&0===m&&0===f?"VALID":"EXPLICIT"},c=yo((t-s+d+h)/a+1,i),p=yo((n-o+m+f)/r+1,i)}}return{padInfo:l,outHeight:c,outWidth:p}}(r,l,c,f,g,k,x,s,i),T=o?m*p:m;let I;return"channelsFirst"===i?I=[u,T,N,v]:"channelsLast"===i&&(I=[u,N,v,T]),{batchSize:u,dataFormat:i,inHeight:l,inWidth:c,inChannels:p,outHeight:N,outWidth:v,outChannels:T,padInfo:w,strideHeight:f,strideWidth:g,filterHeight:d,filterWidth:h,effectiveFilterHeight:k,effectiveFilterWidth:x,dilationHeight:y,dilationWidth:b,inShape:e,outShape:I,filterShape:t}}function po(e,t,n,a,r,s=!1,o="channelsLast",i){let[u,l,c,p,d]=[-1,-1,-1,-1,-1];if("channelsLast"===o)[u,l,c,p,d]=e;else{if("channelsFirst"!==o)throw new Error(`Unknown dataFormat ${o}`);[u,d,l,c,p]=e}const[h,m,f,,g]=t,[y,b,k]=fo(n),[x,w,N]=fo(a),v=go(h,x),T=go(m,w),I=go(f,N),{padInfo:S,outDepth:E,outHeight:_,outWidth:M}=function(e,t,n,a,r,s,o,i,u,l,c){let p,d,h,m;if("number"==typeof e){p={top:e,bottom:e,left:e,right:e,front:e,back:e,type:0===e?"VALID":"NUMBER"};const s=function(e,t,n,a,r,s){null==r&&(r=ho(e,t,a));const o=e[0],i=e[1],u=e[2],l=yo((o-t+2*r)/a+1,s),c=yo((i-t+2*r)/a+1,s),p=yo((u-t+2*r)/a+1,s);return[l,c,p,n]}([t,n,a,1],i,1,r,e,c);d=s[0],h=s[1],m=s[2]}else if("same"===e){d=Math.ceil(t/r),h=Math.ceil(n/s),m=Math.ceil(a/o);const e=(d-1)*r+i-t,c=(h-1)*s+u-n,f=(m-1)*o+l-a,g=Math.floor(e/2),y=e-g,b=Math.floor(c/2),k=c-b,x=Math.floor(f/2);p={top:b,bottom:k,left:x,right:f-x,front:g,back:y,type:"SAME"}}else{if("valid"!==e)throw Error(`Unknown padding parameter: ${e}`);p={top:0,bottom:0,left:0,right:0,front:0,back:0,type:"VALID"},d=Math.ceil((t-i+1)/r),h=Math.ceil((n-u+1)/s),m=Math.ceil((a-l+1)/o)}return{padInfo:p,outDepth:d,outHeight:h,outWidth:m}}(r,l,c,p,y,b,k,v,T,I,i),A=s?g*d:g;let $;return"channelsFirst"===o?$=[u,A,E,_,M]:"channelsLast"===o&&($=[u,E,_,M,A]),{batchSize:u,dataFormat:o,inDepth:l,inHeight:c,inWidth:p,inChannels:d,outDepth:E,outHeight:_,outWidth:M,outChannels:A,padInfo:S,strideDepth:y,strideHeight:b,strideWidth:k,filterDepth:h,filterHeight:m,filterWidth:f,effectiveFilterDepth:v,effectiveFilterHeight:T,effectiveFilterWidth:I,dilationDepth:x,dilationHeight:w,dilationWidth:N,inShape:e,outShape:$,filterShape:t}}function ho(e,t,n,a=1){const r=go(t,a);return Math.floor((e[0]*(n-1)-n+r)/2)}function mo(e){return"number"==typeof e?[e,e,e]:2===e.length?[e[0],e[1],1]:e}function fo(e){return"number"==typeof e?[e,e,e]:e}function go(e,t){return t<=1?e:e+(e-1)*(t-1)}function yo(e,t){if(!t)return Math.trunc(e);switch(t){case"round":return Math.round(e);case"ceil":return Math.ceil(e);case"floor":return Math.floor(e);default:throw new Error(`Unknown roundingMode ${t}`)}}function bo(e){const[t,n,a]=mo(e);return 1===t&&1===n&&1===a}function ko(e,t){return bo(e)||bo(t)}function xo(e){if("NHWC"===e)return"channelsLast";if("NCHW"===e)return"channelsFirst";throw new Error(`Unknown dataFormat ${e}`)}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const wo=ja({reshape_:function(e,t){const n={x:Wa(e,"x","reshape","string_or_numeric")},a={shape:t};return Oa.runKernel(Zt,n,a)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const No=ja({avgPool_:function(e,t,n,a,r){const s=Wa(e,"x","avgPool","float32");u(ko(n,1),(()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${n} and dilations '1'`));let o=s,i=!1;3===s.rank&&(i=!0,o=wo(s,[1,s.shape[0],s.shape[1],s.shape[2]])),u(4===o.rank,(()=>`Error in avgPool: x must be rank 4 but got rank ${o.rank}.`)),null!=r&&u(m(a),(()=>`Error in avgPool: pad must be an integer when using, dimRoundingMode ${r} but got pad ${a}.`));const l={x:o},c={filterSize:t,strides:n,pad:a,dimRoundingMode:r};let p=Oa.runKernel(ce,l,c);return p=Cr(p,s.dtype),i?wo(p,[p.shape[1],p.shape[2],p.shape[3]]):p}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const vo=ja({avgPool3d_:function(e,t,n,a,r,s="NDHWC"){const o=Wa(e,"x","avgPool3d","float32");let i=o,l=!1;4===o.rank&&(l=!0,i=wo(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),u(5===i.rank,(()=>`Error in avgPool3d: x must be rank 5 but got rank ${i.rank}.`)),u("NDHWC"===s,(()=>`Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of ${s}`)),null!=r&&u(m(a),(()=>`Error in avgPool3d: pad must be an integer when using, dimRoundingMode ${r} but got pad ${a}.`));const c={x:i},p={filterSize:t,strides:n,pad:a,dimRoundingMode:r,dataFormat:s};let d=Oa.runKernel(de,c,p);return d=Cr(d,i.dtype),l?wo(d,[d.shape[1],d.shape[2],d.shape[3],d.shape[4]]):d}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const To=ja({concat_:function(e,t=0){u(e.length>=1,(()=>"Pass at least one tensor to concat"));const n=Ha(e,"tensors","concat","string_or_numeric");if("complex64"===n[0].dtype&&n.forEach((e=>{if("complex64"!==e.dtype)throw new Error(`Cannot concatenate complex64 tensors with a tensor\n          with dtype ${e.dtype}. `)})),1===n.length)return Rr(n[0]);const a=n,r={axis:t};return Oa.runKernel(Ne,a,r)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Io=ja({sigmoid_:function(e){const t={x:Wa(e,"x","sigmoid")};return Oa.runKernel(gn,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const So=ja({slice_:function(e,t,n){const a=Wa(e,"x","slice","string_or_numeric");if(0===a.rank)throw new Error("Slicing scalar is not possible");const r={x:a},s={begin:t,size:n};return Oa.runKernel(dn,r,s)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Eo=ja({tanh_:function(e){const t={x:Wa(e,"x","tanh")};return Oa.runKernel(Mn,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const _o=ja({basicLSTMCell_:function(e,t,n,a,r,s){const o=Wa(e,"forgetBias","basicLSTMCell"),i=Wa(t,"lstmKernel","basicLSTMCell"),u=Wa(n,"lstmBias","basicLSTMCell"),l=Wa(a,"data","basicLSTMCell"),c=Wa(r,"c","basicLSTMCell"),p=Wa(s,"h","basicLSTMCell"),d=To([l,p],1),h=Xr(d,i),m=qs(h,u),f=m.shape[0],g=m.shape[1]/4,y=[f,g],b=So(m,[0,0],y),k=So(m,[0,g],y),x=So(m,[0,2*g],y),w=So(m,[0,3*g],y),N=qs(Ks(Io(b),Eo(k)),Ks(c,Io(qs(o,x))));return[N,Ks(Eo(N),Io(w))]}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Mo=ja({batchToSpaceND_:function(e,t,n){const a=Wa(e,"x","batchToSpaceND"),r=t.reduce(((e,t)=>e*t));u(a.rank>=1+t.length,(()=>`input rank is ${a.rank} but should be > than blockShape.length ${t.length}`)),u(n.length===t.length,(()=>`crops.length is ${n.length} but should be equal to blockShape.length  ${t.length}`)),u(a.shape[0]%r==0,(()=>`input tensor batch is ${a.shape[0]} but is not divisible by the product of the elements of blockShape ${t.join(" * ")} === ${r}`));const s={x:a},o={blockShape:t,crops:n};return Oa.runKernel(fe,s,o)}});const Ao=ja({batchNorm_:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e,t,n,a,r,s){null==s&&(s=.001);const o=Wa(e,"x","batchNorm"),i=Wa(t,"mean","batchNorm"),l=Wa(n,"variance","batchNorm");let c,p;null!=r&&(c=Wa(r,"scale","batchNorm")),null!=a&&(p=Wa(a,"offset","batchNorm")),u(i.rank===l.rank,(()=>"Batch normalization gradient requires mean and variance to have equal ranks.")),u(null==p||i.rank===p.rank,(()=>"Batch normalization gradient requires mean and offset to have equal ranks.")),u(null==c||i.rank===c.rank,(()=>"Batch normalization gradient requires mean and scale to have equal ranks."));const d={x:function(e){let t;return t=0===e.rank||1===e.rank?wo(e,[1,1,1,e.size]):2===e.rank?wo(e,[1,1,e.shape[0],e.shape[1]]):3===e.rank?wo(e,[1,e.shape[0],e.shape[1],e.shape[2]]):e,t}(o),scale:c,offset:p,mean:i,variance:l},h={varianceEpsilon:s},m=Oa.runKernel(tt,d,h);return wo(m,o.shape)}});const $o=ja({batchNorm2d_:function(e,t,n,a,r,s){const o=Wa(e,"x","batchNorm"),i=Wa(t,"mean","batchNorm"),l=Wa(n,"variance","batchNorm");let c,p;return null!=r&&(c=Wa(r,"scale","batchNorm")),null!=a&&(p=Wa(a,"offset","batchNorm")),u(2===o.rank,(()=>`Error in batchNorm2D: x must be rank 2 but got rank ${o.rank}.`)),u(2===i.rank||1===i.rank,(()=>`Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank ${i.rank}.`)),u(2===l.rank||1===l.rank,(()=>`Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank ${l.rank}.`)),null!=c&&u(2===c.rank||1===c.rank,(()=>`Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank ${c.rank}.`)),null!=p&&u(2===p.rank||1===p.rank,(()=>`Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank ${p.rank}.`)),Ao(o,i,l,p,c,s)}});const Do=ja({batchNorm3d_:function(e,t,n,a,r,s){const o=Wa(e,"x","batchNorm"),i=Wa(t,"mean","batchNorm"),l=Wa(n,"variance","batchNorm");let c,p;return null!=r&&(c=Wa(r,"scale","batchNorm")),null!=a&&(p=Wa(a,"offset","batchNorm")),u(3===o.rank,(()=>`Error in batchNorm3D: x must be rank 3 but got rank ${o.rank}.`)),u(3===i.rank||1===i.rank,(()=>`Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank ${i.rank}.`)),u(3===l.rank||1===l.rank,(()=>`Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank ${l.rank}.`)),null!=c&&u(3===c.rank||1===c.rank,(()=>`Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank ${c.rank}.`)),null!=p&&u(3===p.rank||1===p.rank,(()=>`Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank ${p.rank}.`)),Ao(o,i,l,p,c,s)}});const Fo=ja({batchNorm4d_:function(e,t,n,a,r,s){const o=Wa(e,"x","batchNorm"),i=Wa(t,"mean","batchNorm"),l=Wa(n,"variance","batchNorm");let c,p;return null!=r&&(c=Wa(r,"scale","batchNorm")),null!=a&&(p=Wa(a,"offset","batchNorm")),u(4===o.rank,(()=>`Error in batchNorm4D: x must be rank 4 but got rank ${o.rank}.`)),u(4===i.rank||1===i.rank,(()=>`Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank ${i.rank}.`)),u(4===l.rank||1===l.rank,(()=>`Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank ${l.rank}.`)),null!=c&&u(4===c.rank||1===c.rank,(()=>`Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank ${c.rank}.`)),null!=p&&u(4===p.rank||1===p.rank,(()=>`Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank ${p.rank}.`)),Ao(o,i,l,p,c,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Oo=ja({bincount_:function(e,t,n){const a=Wa(e,"x","bincount"),r=Wa(t,"weights","bincount");u("int32"===a.dtype,(()=>`Error in bincount: input dtype must be int32, but got ${a.dtype}`)),u(n>=0,(()=>`size must be non-negative, but got ${n}.`)),u(r.size===a.size||0===r.size,(()=>`Error in bincount: weights must have the same size as input or0-length, but got input shape: ${a.shape}, weights shape: ${r.shape}.`));const s={x:a,weights:r},o={size:n};return Oa.runKernel(ge,s,o)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Co=ja({broadcastTo_:function(e,t){let n=Wa(e,"broadcastTo","x");const a=n.shape;if(t.some((e=>!(e>0)||e%1!=0)))throw new Error(`broadcastTo(): Invalid broadcast shape [${t}].`);if(t.length<n.rank)throw new Error(`broadcastTo(): shape.length=${t.length} < input.rank=${n.rank}.`);if(t.length>n.rank){const e=n.shape.slice();for(;e.length<t.length;)e.unshift(1);n=wo(n,e)}const r=n.shape,s=Array.from(t);for(let e=t.length-1;e>=0;e--)if(r[e]===t[e])s[e]=1;else if(1!==n.shape[e])throw new Error(`broadcastTo(): [${a}] cannot be broadcast to [${t}].`);if(0===s.map(((e,t)=>e>1?t:-1)).filter((e=>e>=0)).length)return Rr(n);const o={x:n},i={reps:s};return Oa.runKernel(An,o,i)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ro=ja({ceil_:function(e){const t={x:Wa(e,"x","ceil")};return Oa.runKernel(be,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const zo=ja({clipByValue_:function(e,t,n){const a=Wa(e,"x","clipByValue");u(t<=n,(()=>`Error in clip: min (${t}) must be less than or equal to max (${n}).`));const r={x:a},s={clipValueMin:t,clipValueMax:n};return Oa.runKernel(ke,r,s)}});const Bo=ja({concat1d_:function(e){return To(e,0)}});const Lo=ja({concat2d_:function(e,t){return To(e,t)}});const Po=ja({concat3d_:function(e,t){return To(e,t)}});const Vo=ja({concat4d_:function(e,t){return To(e,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Wo=ja({conv2d_:function(e,t,n,a,r="NHWC",s=[1,1],o){const i=Wa(e,"x","conv2d"),l=Wa(t,"filter","conv2d");let c=i,p=!1;3===i.rank&&(p=!0,c=wo(i,[1,i.shape[0],i.shape[1],i.shape[2]])),u(4===c.rank,(()=>`Error in conv2d: input must be rank 4, but got rank ${c.rank}.`)),u(4===l.rank,(()=>`Error in conv2d: filter must be rank 4, but got rank ${l.rank}.`)),null!=o&&u(m(a),(()=>`Error in conv2d: pad must be an integer when using, dimRoundingMode ${o} but got pad ${a}.`));const d="NHWC"===r?c.shape[3]:c.shape[1];u(d===l.shape[2],(()=>`Error in conv2d: depth of input (${d}) must match input depth for filter ${l.shape[2]}.`)),u(ko(n,s),(()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${s}'`));const h={x:c,filter:l},f={strides:n,pad:a,dataFormat:r,dilations:s,dimRoundingMode:o},g=Oa.runKernel(ve,h,f);return p?wo(g,[g.shape[1],g.shape[2],g.shape[3]]):g}});const Ho=ja({conv1d_:function(e,t,n,a,r="NWC",s=1,o){const i=Wa(e,"x","conv1d"),l=Wa(t,"filter","conv1d");let c=i,p=!1;2===i.rank&&(p=!0,c=wo(i,[1,i.shape[0],i.shape[1]])),u(3===c.rank,(()=>`Error in conv1d: input must be rank 3, but got rank ${c.rank}.`)),u(3===l.rank,(()=>`Error in conv1d: filter must be rank 3, but got rank ${l.rank}.`)),null!=o&&u(m(a),(()=>`Error in conv1d: pad must be an integer when using, dimRoundingMode ${o} but got pad ${a}.`)),u(c.shape[2]===l.shape[1],(()=>`Error in conv1d: depth of input (${c.shape[2]}) must match input depth for filter ${l.shape[1]}.`)),u(ko(n,s),(()=>`Error in conv1D: Either stride or dilation must be 1. Got stride ${n} and dilation '${s}'`)),u("NWC"===r,(()=>`Error in conv1d: got dataFormat of ${r} but only NWC is currently supported.`));const d=wo(l,[1,l.shape[0],l.shape[1],l.shape[2]]),h=wo(c,[c.shape[0],1,c.shape[1],c.shape[2]]),f=Wo(h,d,[1,n],a,"NHWC",[1,s],o);return wo(f,p?[f.shape[2],f.shape[3]]:[f.shape[0],f.shape[2],f.shape[3]])}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const qo=ja({conv2DBackpropInput_:function(e,t,n,a,r,s="NHWC",o){u(e.length===t.rank,(()=>`Length of inShape (${e.length}) and rank of dy (${t.rank}) must match`));let i=e,l=t,c=!1;3===t.rank&&(c=!0,l=wo(t,[1,t.shape[0],t.shape[1],t.shape[2]]),i=[1,e[0],e[1],e[2]]),u(4===i.length,(()=>`Error in conv2dDerInput: inShape must be length 4, but got length ${i.length}.`)),u(4===l.rank,(()=>`Error in conv2dDerInput: dy must be rank 4, but got rank ${l.rank}`)),u(4===n.rank,(()=>`Error in conv2dDerInput: filter must be rank 4, but got rank ${n.rank}`));const p="NHWC"===s?i[3]:i[1],d="NHWC"===s?l.shape[3]:l.shape[1];u(p===n.shape[2],(()=>`Error in conv2dDerInput: depth of input (${p}) must match input depth for filter ${n.shape[2]}.`)),u(d===n.shape[3],(()=>`Error in conv2dDerInput: depth of output (${d}) must match output depth for filter ${n.shape[3]}.`)),null!=o&&u(m(r),(()=>`Error in conv2dDerInput: pad must be an integer when using, dimRoundingMode ${o} but got pad ${r}.`));const h={dy:l,filter:n},f={strides:a,pad:r,dataFormat:s,dimRoundingMode:o,inputShape:i},g=Oa.runKernel(Ie,h,f);return c?wo(g,[g.shape[1],g.shape[2],g.shape[3]]):g}});const jo=ja({conv2dTranspose_:function(e,t,n,a,r,s){const o=Wa(e,"x","conv2dTranspose"),i=Wa(t,"filter","conv2dTranspose");return qo(n,o,i,a,r,"NHWC",s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Uo=ja({conv3d_:function(e,t,n,a,r="NDHWC",s=[1,1,1]){const o=Wa(e,"x","conv3d"),i=Wa(t,"filter","conv3d");let l=o,c=!1;4===o.rank&&(c=!0,l=wo(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),u(5===l.rank,(()=>`Error in conv3d: input must be rank 5, but got rank ${l.rank}.`)),u(5===i.rank,(()=>`Error in conv3d: filter must be rank 5, but got rank ${i.rank}.`)),u(l.shape[4]===i.shape[3],(()=>`Error in conv3d: depth of input (${l.shape[4]}) must match input depth for filter ${i.shape[3]}.`)),u(ko(n,s),(()=>`Error in conv3D: Either strides or dilations must be 1. Got strides ${n} and dilations '${s}'`)),u("NDHWC"===r,(()=>`Error in conv3d: got dataFormat of ${r} but only NDHWC is currently supported.`));const p={x:l,filter:i},d={strides:n,pad:a,dataFormat:r,dilations:s},h=Oa.runKernel(Se,p,d);return c?wo(h,[h.shape[1],h.shape[2],h.shape[3],h.shape[4]]):h}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ko=ja({conv3DBackpropInput_:function(e,t,n,a,r){u(e.length===t.rank,(()=>`Length of inShape (${e.length}) and rank of dy (${t.rank}) must match`));let s=e,o=t,i=!1;4===t.rank&&(i=!0,o=wo(t,[1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]]),s=[1,e[0],e[1],e[2],e[3]]);const l=s[4],c=o.shape[4];u(5===s.length,(()=>`Error in conv3dDerInput: inShape must be length 5, but got length ${s.length}.`)),u(5===o.rank,(()=>`Error in conv3dDerInput: dy must be rank 5, but got rank ${o.rank}`)),u(5===n.rank,(()=>`Error in conv3dDerInput: filter must be rank 5, but got rank ${n.rank}`)),u(l===n.shape[3],(()=>`Error in conv3dDerInput: depth of input (${l}) must match input depth for filter ${n.shape[3]}.`)),u(c===n.shape[4],(()=>`Error in conv3dDerInput: depth of output (${c}) must match output depth for filter ${n.shape[4]}.`));const p={dy:o,filter:n},d={pad:r,strides:a,inputShape:s},h=Oa.runKernel(_e,p,d);return i?wo(h,[h.shape[1],h.shape[2],h.shape[3],h.shape[4]]):h}});const Go=ja({conv3dTranspose_:function(e,t,n,a,r){const s=Wa(e,"x","conv3dTranspose"),o=Wa(t,"filter","conv3dTranspose");return Ko(n,s,o,a,r)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Yo=ja({cos_:function(e){const t={x:Wa(e,"x","cos")};return Oa.runKernel(Me,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Qo=ja({cosh_:function(e){const t={x:Wa(e,"x","cosh")};return Oa.runKernel(Ae,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Xo=ja({cumsum_:function(e,t=0,n=!1,a=!1){const r={x:Wa(e,"x","cumsum")},s={axis:t,exclusive:n,reverse:a};return Oa.runKernel($e,r,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Jo=ja({denseBincount_:function(e,t,n,a=!1){const r=Wa(e,"x","denseBincount"),s=Wa(t,"weights","denseBincount");u("int32"===r.dtype,(()=>`Error in denseBincount: input dtype must be int32, but got ${r.dtype}`)),u(r.rank<=2,(()=>`Error in denseBincount: input must be at most rank 2, but got rank ${r.rank}.`)),u(n>=0,(()=>`size must be non-negative, but got ${n}.`)),u(s.size===r.size||0===s.size,(()=>`Error in denseBincount: weights must have the same shape as x or 0-length, but got x shape: ${r.shape}, weights shape: ${s.shape}.`));const o={x:r,weights:s},i={size:n,binaryOutput:a};return Oa.runKernel(Fe,o,i)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Zo=ja({depthToSpace_:function(e,t,n="NHWC"){const a=Wa(e,"x","depthToSpace"),r="NHWC"===n?a.shape[1]:a.shape[2],s="NHWC"===n?a.shape[2]:a.shape[3],o="NHWC"===n?a.shape[3]:a.shape[1];u(r*t>=0,(()=>`Negative dimension size caused by overflow when multiplying\n    ${r} and ${t}  for depthToSpace with input shape\n    ${a.shape}`)),u(s*t>=0,(()=>`Negative dimension size caused by overflow when multiplying\n    ${s} and ${t} for depthToSpace with input shape\n        ${a.shape}`)),u(o%(t*t)==0,(()=>`Dimension size must be evenly divisible by ${t*t} but is ${o} for depthToSpace with input shape ${a.shape}`));const i={x:a},l={blockSize:t,dataFormat:n};return Oa.runKernel(Oe,i,l)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ei=ja({depthwiseConv2d_:function(e,t,n,a,r="NHWC",s=[1,1],o){const i=Wa(e,"x","depthwiseConv2d"),l=Wa(t,"filter","depthwiseConv2d");let c=i,p=!1;3===i.rank&&(p=!0,c=wo(i,[1,i.shape[0],i.shape[1],i.shape[2]])),u(4===c.rank,(()=>`Error in depthwiseConv2d: input must be rank 4, but got rank ${c.rank}.`)),u(4===l.rank,(()=>`Error in depthwiseConv2d: filter must be rank 4, but got rank ${l.rank}.`)),u(c.shape[3]===l.shape[2],(()=>`Error in depthwiseConv2d: number of input channels (${c.shape[3]}) must match the inChannels dimension in filter ${l.shape[2]}.`)),null!=o&&u(m(a),(()=>`Error in depthwiseConv2d: pad must be an integer when using, dimRoundingMode ${o} but got pad ${a}.`));const d={x:c,filter:l},h={strides:n,pad:a,dataFormat:r,dilations:s,dimRoundingMode:o},f=Oa.runKernel(Ce,d,h);return p?wo(f,[f.shape[1],f.shape[2],f.shape[3]]):f}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ti=ja({diag_:function(e){const t={x:Wa(e,"x","diag")};return Oa.runKernel(Be,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ni=ja({dilation2d_:function(e,t,n,a,r=[1,1],s="NHWC"){const o=Wa(e,"x","dilation2d"),i=Wa(t,"filter","dilation2d");u(3===o.rank||4===o.rank,(()=>`Error in dilation2d: input must be rank 3 or 4, but got rank ${o.rank}.`)),u(3===i.rank,(()=>`Error in dilation2d: filter must be rank 3, but got rank ${i.rank}.`)),u("NHWC"===s,(()=>`Error in dilation2d: Only NHWC is currently supported, but got dataFormat of ${s}`));let l=o,c=!1;3===o.rank&&(l=wo(o,[1,o.shape[0],o.shape[1],o.shape[2]]),c=!0);const p={x:l,filter:i},d={strides:n,pad:a,dilations:r},h=Oa.runKernel(Le,p,d);return c?wo(h,[h.shape[1],h.shape[2],h.shape[3]]):h}});
/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ai(e,t){const n=e.length,a=[];for(let r=0;r<n;r++){const s=n-1-r,o=e[s]||1;(t[t.length-1-r]||1)>1&&1===o&&a.unshift(s)}return a}function ri(e,t){const n=[];for(let a=0;a<t.length;a++){const r=e[e.length-a-1],s=t.length-a-1,o=t[s];(null==r||1===r&&o>1)&&n.unshift(s)}return n}function si(e,t){const n=[],a=Math.max(e.length,t.length);for(let r=0;r<a;r++){let a=e[e.length-r-1];null==a&&(a=1);let s=t[t.length-r-1];if(null==s&&(s=1),1===a)n.unshift(s);else if(1===s)n.unshift(a);else{if(a!==s){throw Error(`Operands could not be broadcast together with shapes ${e} and ${t}.`)}n.unshift(a)}}return n}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const oi=ja({equal_:function(e,t){let n=Wa(e,"a","equal"),a=Wa(t,"b","equal");[n,a]=Ia(n,a),si(n.shape,a.shape);const r={a:n,b:a};return Oa.runKernel(Ue,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ii=ja({where_:function(e,t,n){const a=Wa(t,"a","where"),r=Wa(n,"b","where"),s=Wa(e,"condition","where","bool"),o=si(a.shape,r.shape),i=Co(a,o),c=Co(r,o);1===s.rank&&u(s.shape[0]===a.shape[0],(()=>"The first dimension of `a` must match the size of `condition`.")),1!==s.rank&&l(s.shape,c.shape,"Error in where: ");const p={condition:s,t:i,e:c};return Oa.runKernel(cn,p)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ui=ja({zerosLike_:function(e){const t={x:Wa(e,"x","zerosLike")};return Oa.runKernel(Rn,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const li=ja({divNoNan_:function(e,t){let n=Wa(e,"a","div"),a=Wa(t,"b","div");[n,a]=Ia(n,a);const r=Us(n,a),s=ui(r),o=oi(a,s);return ii(o,s,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ci=ja({dot_:function(e,t){const n=Wa(e,"t1","dot"),a=Wa(t,"t2","dot");u(!(1!==n.rank&&2!==n.rank||1!==a.rank&&2!==a.rank),(()=>`Error in dot: inputs must all be rank 1 or 2, but got ranks ${n.rank} and ${a.rank}.`));const r=1===n.rank?n.size:n.shape[1],s=1===a.rank?a.size:a.shape[0];if(u(r===s,(()=>`Error in dot: inner dimensions of inputs must match, but got ${r} and ${s}.`)),1===n.rank&&1===a.rank){const e=wo(n,[1,-1]),t=wo(a,[-1,1]),r=Xr(e,t);return wo(r,[])}if(1===n.rank&&2===a.rank){const e=wo(n,[1,-1]),t=wo(a,[a.shape[0],a.shape[1]]),r=Xr(e,t);return wo(r,[r.size])}if(2===n.rank&&1===a.rank){const e=wo(a,[-1,1]),t=Xr(n,e);return wo(t,[t.size])}{const e=wo(a,[a.shape[0],a.shape[1]]);return Xr(n,e)}}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const pi=ja({elu_:function(e){const t={x:Wa(e,"x","elu")};return Oa.runKernel(He,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const di=ja({erf_:function(e){let t=Wa(e,"x","erf");u("int32"===t.dtype||"float32"===t.dtype,(()=>"Input dtype must be `int32` or `float32`.")),"int32"===t.dtype&&(t=Cr(t,"float32"));const n={x:t};return Oa.runKernel(je,n)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const hi=ja({exp_:function(e){const t={x:Wa(e,"x","exp")};return Oa.runKernel(Ke,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const mi=ja({expandDims_:function(e,t=0){const n=Wa(e,"x","expandDims","string_or_numeric");u(t<=n.rank,(()=>"Axis must be <= rank of the tensor"));const a={input:n},r={dim:t};return Oa.runKernel(Ge,a,r)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const fi=ja({expm1_:function(e){const t={x:Wa(e,"x","expm1")};return Oa.runKernel(Ye,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const gi=ja({tile_:function(e,t){const n=Wa(e,"x","tile","string_or_numeric");u(n.rank===t.length,(()=>`Error in transpose: rank of input ${n.rank} must match length of reps ${t}.`));const a={x:n},r={reps:t};return Oa.runKernel(An,a,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const yi=ja({eye_:function(e,t,n,a="float32"){null==t&&(t=e);const r=Or([e,t],a),s=e<=t?e:t;for(let e=0;e<s;++e)r.set(1,e,e);const o=wo(r.toTensor(),[e,t]);if(null==n)return o;if(1===n.length)return gi(mi(o,0),[n[0],1,1]);if(2===n.length)return gi(mi(mi(o,0),0),[n[0],n[1],1,1]);if(3===n.length)return gi(mi(mi(mi(o,0),0),0),[n[0],n[1],n[2],1,1]);throw new Error(`eye() currently supports only 1D and 2D batchShapes, but received ${n.length}D.`)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bi(e,t,n){const a={shape:e,value:t,dtype:n};return Oa.runKernel(Xe,{},a)}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ki=ja({floor_:function(e){const t={x:Wa(e,"x","floor")};return Oa.runKernel(Ze,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const xi=ja({gather_:function(e,t,n=0,a=0){const r={x:Wa(e,"x","gather"),indices:Wa(t,"indices","gather","int32")},s={axis:n,batchDims:a};return Oa.runKernel(nt,r,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const wi=ja({greater_:function(e,t){let n=Wa(e,"a","greater"),a=Wa(t,"b","greater");[n,a]=Ia(n,a),si(n.shape,a.shape);const r={a:n,b:a};return Oa.runKernel(rt,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ni=ja({greaterEqual_:function(e,t){let n=Wa(e,"a","greaterEqual"),a=Wa(t,"b","greaterEqual");[n,a]=Ia(n,a),si(n.shape,a.shape);const r={a:n,b:a};return Oa.runKernel(st,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const vi=ja({imag_:function(e){const t={input:Wa(e,"input","imag")};return Oa.runKernel(ut,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ti=ja({isFinite_:function(e){const t={x:Wa(e,"x","isFinite")};return Oa.runKernel(lt,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ii=ja({isInf_:function(e){const t={x:Wa(e,"x","isInf")};return Oa.runKernel(ct,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Si=ja({isNaN_:function(e){const t={x:Wa(e,"x","isNaN")};return Oa.runKernel(pt,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ei=ja({leakyRelu_:function(e,t=.2){const n={x:Wa(e,"x","leakyRelu")},a={alpha:t};return Oa.runKernel(dt,n,a)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const _i=ja({less_:function(e,t){let n=Wa(e,"a","less"),a=Wa(t,"b","less");[n,a]=Ia(n,a),si(n.shape,a.shape);const r={a:n,b:a};return Oa.runKernel(ht,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Mi=ja({lessEqual_:function(e,t){let n=Wa(e,"a","lessEqual"),a=Wa(t,"b","lessEqual");[n,a]=Ia(n,a),si(n.shape,a.shape);const r={a:n,b:a};return Oa.runKernel(mt,r)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ai(e,t,n){if(n<=0)throw new Error("The number of values should be positive.");const a={start:e,stop:t,num:n};return Oa.runKernel(ft,{},a)}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const $i=ja({localResponseNormalization_:function(e,t=5,n=1,a=1,r=.5){const s=Wa(e,"x","localResponseNormalization");u(4===s.rank||3===s.rank,(()=>`Error in localResponseNormalization: x must be rank 3 or 4 but got\n               rank ${s.rank}.`)),u(m(t),(()=>`Error in localResponseNormalization: depthRadius must be an integer but got depthRadius ${t}.`));let o=s,i=!1;3===s.rank&&(i=!0,o=wo(s,[1,s.shape[0],s.shape[1],s.shape[2]]));const l={x:o},c={depthRadius:t,bias:n,alpha:a,beta:r},p=Oa.runKernel(wt,l,c);return i?wo(p,[p.shape[1],p.shape[2],p.shape[3]]):p}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Di=ja({log_:function(e){const t={x:Wa(e,"x","log")};return Oa.runKernel(gt,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Fi=ja({log1p_:function(e){const t={x:Wa(e,"x","log1p")};return Oa.runKernel(yt,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Oi(e,t){u($(e),(()=>"The f passed in variableGrads(f) must be a function")),u(null==t||Array.isArray(t)&&t.every((e=>e instanceof ya)),(()=>"The varList passed in variableGrads(f, varList) must be an array of variables"));const n=null!=t;if(!n){t=[];for(const e in Oa.registeredVariables)t.push(Oa.registeredVariables[e])}const a=n?t.filter((e=>!e.trainable)):null,r=t.length;t=t.filter((e=>e.trainable)),u(t.length>0,(()=>`variableGrads() expects at least one of the input variables to be trainable, but none of the ${r} variables is trainable.`));const{value:s,grads:o}=Oa.gradients(e,t,null,!0);u(o.some((e=>null!=e)),(()=>"Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize().")),u(0===s.rank,(()=>`The f passed in variableGrads(f) must return a scalar, but it returned a rank-${s.rank} tensor`));const i={};return t.forEach(((e,t)=>{null!=o[t]&&(i[e.name]=o[t])})),null!=a&&a.forEach((e=>i[e.name]=null)),{value:s,grads:i}}function Ci(e){return Oa.customGrad(e)}function Ri(e){if(e.filter((e=>null==e)).length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that\n    the f you passed encloses all operations that lead from x to y.")}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const zi=ja({neg_:function(e){const t={x:Wa(e,"x","neg")};return Oa.runKernel(zt,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Bi=ja({softplus_:function(e){const t={x:Wa(e,"x","softplus")};return Oa.runKernel(yn,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Li=ja({logSigmoid_:function(e){const t=Wa(e,"x","logSigmoid");return Ci((e=>({value:zi(Bi(zi(e))),gradFunc:t=>Ks(t,Io(zi(e)))})))(t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Pi=ja({max_:function(e,t=null,n=!1){const a={x:Wa(e,"x","max")},r={reductionIndices:t,keepDims:n};return Oa.runKernel(vt,a,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Vi=ja({sub_:function(e,t){let n=Wa(e,"a","sub"),a=Wa(t,"b","sub");[n,a]=Ia(n,a);const r={a:n,b:a};return Oa.runKernel(In,r)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Wi=ja({sum_:function(e,t=null,n=!1){let a=Wa(e,"x","sum");"bool"===a.dtype&&(a=Cr(a,"int32"));const r={x:a},s={axis:t,keepDims:n};return Oa.runKernel(kn,r,s)}});
/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Hi=ja({logSoftmax_:function(e,t=-1){const n=Wa(e,"logits","logSoftmax");if(-1===t&&(t=n.rank-1),t!==n.rank-1)throw Error(`Log Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and axis was ${t}`);const a=Ci(((e,n)=>{const a=Pi(e,t,!0),r=Vi(e,a),s=Vi(Cr(r,"float32"),Di(Wi(hi(r),t,!0)));n([s]);return{value:s,gradFunc:(e,n)=>{const[a]=n,r=hi(a);return Vi(e,Ks(Wi(e,t,!0),r))}}}));return a(n)}});
/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qi(e,t){for(let n=0;n<e.length;++n)if(e[e.length-n-1]!==t-1-n)return!1;return!0}function ji(e,t,n){const a=e.length+t.length,r=[];let s=0,o=0;for(let i=0;i<a;i++)-1===n.indexOf(i)?r.push(e[s++]):r.push(t[o++]);return r}function Ui(e,t){const n=[],a=e.length;for(let r=0;r<a;r++)-1===t.indexOf(r)&&n.push(e[r]);return[n,t.map((t=>e[t]))]}function Ki(e,t){return ji(e,t.map((e=>1)),t)}function Gi(e,t,n){u(qi(t,n),(()=>`${e} supports only inner-most axes for now. Got axes ${t} and rank-${n} input.`))}function Yi(e,t){if(qi(e,t))return null;const n=[];for(let a=0;a<t;++a)-1===e.indexOf(a)&&n.push(a);return e.forEach((e=>n.push(e))),n}function Qi(e){return e.map(((e,t)=>[t,e])).sort(((e,t)=>e[1]-t[1])).map((e=>e[0]))}function Xi(e,t){const n=[];for(let a=t-e;a<t;++a)n.push(a);return n}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ji=ja({logSumExp_:function(e,t=null,n=!1){const a=Wa(e,"x","logSumExp"),r=y(t,a.shape),s=Pi(a,r,!0),o=Vi(a,s),i=hi(o),u=Wi(i,r),l=Di(u),c=qs(wo(s,l.shape),l);if(n){const e=Ki(c.shape,r);return wo(c,e)}return c}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Zi=ja({logicalAnd_:function(e,t){const n=Wa(e,"a","logicalAnd","bool"),a=Wa(t,"b","logicalAnd","bool");si(n.shape,a.shape);const r={a:n,b:a};return Oa.runKernel(bt,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const eu=ja({logicalNot_:function(e){const t={x:Wa(e,"x","logicalNot","bool")};return Oa.runKernel(kt,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const tu=ja({logicalOr_:function(e,t){const n=Wa(e,"a","logicalOr","bool"),a=Wa(t,"b","logicalOr","bool");si(n.shape,a.shape);const r={a:n,b:a};return Oa.runKernel(xt,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const nu=ja({logicalXor_:function(e,t){const n=Wa(e,"a","logicalXor","bool"),a=Wa(t,"b","logicalXor","bool");return si(n.shape,a.shape),Zi(tu(e,t),eu(Zi(e,t)))}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const au=ja({maxPool_:function(e,t,n,a,r){const s=Wa(e,"x","maxPool");let o=s,i=!1;3===s.rank&&(i=!0,o=wo(s,[1,s.shape[0],s.shape[1],s.shape[2]])),u(4===o.rank,(()=>`Error in maxPool: input must be rank 4 but got rank ${o.rank}.`)),u(ko(n,1),(()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${n} and dilations '1'`)),null!=r&&u(m(a),(()=>`Error in maxPool: pad must be an integer when using, dimRoundingMode ${r} but got pad ${a}.`));const l={x:o},c={filterSize:t,strides:n,pad:a,dimRoundingMode:r},p=Oa.runKernel(It,l,c);return i?wo(p,[p.shape[1],p.shape[2],p.shape[3]]):p}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ru=ja({maxPool3d_:function(e,t=[1,1,1],n,a,r,s="NDHWC"){const o=Wa(e,"x","maxPool3d");let i=o,l=!1;4===o.rank&&(l=!0,i=wo(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),u(5===i.rank,(()=>`Error in maxPool3d: x must be rank 5 but got rank ${i.rank}.`)),u("NDHWC"===s,(()=>`Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of ${s}`)),null!=r&&u(m(a),(()=>`Error in maxPool3d: pad must be an integer when using, dimRoundingMode ${r} but got pad ${a}.`));const c={x:i},p={filterSize:t,strides:n,pad:a,dimRoundingMode:r,dataFormat:s},d=Oa.runKernel(Et,c,p);return l?wo(d,[d.shape[1],d.shape[2],d.shape[3],d.shape[4]]):d}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const su=ja({maxPoolWithArgmax_:function(e,t,n,a,r=!1){const s={x:Wa(e,"x","maxPoolWithArgmax")},o={filterSize:t,strides:n,pad:a,includeBatchInIndex:r},i=Oa.runKernel(Mt,s,o);return{result:i[0],indexes:i[1]}}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ou=ja({maximum_:function(e,t){let n=Wa(e,"a","maximum"),a=Wa(t,"b","maximum");[n,a]=Ia(n,a),"bool"===n.dtype&&(n=Cr(n,"int32"),a=Cr(a,"int32")),si(n.shape,a.shape);const r={a:n,b:a};return Oa.runKernel(Tt,r)}});
/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const iu=ja({mean_:function(e,t=null,n=!1){const a={x:Wa(e,"x","mean")},r={axis:t,keepDims:n};return Oa.runKernel(At,a,r)}});
/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const uu=ja({min_:function(e,t=null,n=!1){const a={x:Wa(e,"x","min")},r={axis:t,keepDims:n};return Oa.runKernel($t,a,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const lu=ja({minimum_:function(e,t){let n=Wa(e,"a","minimum"),a=Wa(t,"b","minimum");[n,a]=Ia(n,a),"bool"===n.dtype&&(n=Cr(n,"int32"),a=Cr(a,"int32")),si(n.shape,a.shape);const r={a:n,b:a};return Oa.runKernel(Dt,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const cu=ja({mirrorPad_:function(e,t,n){u("reflect"===n||"symmetric"===n,(()=>`Invalid mode. Mode must be either reflect or symmetric. Got ${n}.`));const a=Wa(e,"x","mirrorPad");if(0===a.rank)throw new Error("mirrorPad(scalar) is not defined. Pass non-scalar to mirrorPad");u(t.length===a.rank,(()=>`Padding doesn't match input. Must be ${a.rank}. Got ${t.length}.`));const r="reflect"===n?1:0;for(let e=0;e<a.rank;e++)u(2===t[e].length,(()=>"Invalid number of paddings. Must be length of 2 each.")),u(t[e][0]>=0&&t[e][0]<=a.shape[e]-r&&t[e][1]>=0&&t[e][1]<=a.shape[e]-r,(()=>`Padding in dimension ${e} cannot be greater than or equal to ${a.shape[e]-r} or less than 0 for input of shape ${a.shape}`));const s={paddings:t,mode:n},o={x:a};return Oa.runKernel(Ft,o,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const pu=ja({mod_:function(e,t){let n=Wa(e,"a","mod"),a=Wa(t,"b","mod");[n,a]=Ia(n,a);const r={a:n,b:a};return Oa.runKernel(Ot,r)}});
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const du=ja({square_:function(e){const t=Wa(e,"x","square");return Oa.runKernel("Square",{x:t},{})}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const hu=ja({moments_:function(e,t=null,n=!1){const a=y(t,(e=Wa(e,"x","moments")).shape),r=iu(e,a,n);let s=r.shape;n||(s=Ki(r.shape,a));const o=du(Vi(Cr(e,"float32"),wo(r,s)));return{mean:r,variance:iu(o,a,n)}}});const mu=ja({multiRNNCell_:function(e,t,n,a){const r=Wa(t,"data","multiRNNCell"),s=Ha(n,"c","multiRNNCell"),o=Ha(a,"h","multiRNNCell");let i=r;const u=[];for(let t=0;t<e.length;t++){const n=e[t](i,s[t],o[t]);u.push(n[0]),u.push(n[1]),i=n[1]}const l=[],c=[];for(let e=0;e<u.length;e+=2)l.push(u[e]),c.push(u[e+1]);return[l,c]}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const fu=ja({multinomial_:function(e,t,n,a=!1){const r=Wa(e,"logits","multinomial"),s=r.size,o=r.rank;if(s<2)throw new Error(`Error in multinomial: you need at least 2 outcomes, but got ${s}.`);if(o>2)throw new Error(`Rank of probabilities must be 1 or 2, but is ${o}`);n=n||Math.random();const i={logits:1===o?wo(r,[1,-1]):r},u={numSamples:t,seed:n,normalized:a},l=Oa.runKernel(Ct,i,u);return 1===o?wo(l,[l.size]):l}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const gu=ja({notEqual_:function(e,t){let n=Wa(e,"a","notEqual"),a=Wa(t,"b","notEqual");[n,a]=Ia(n,a),si(n.shape,a.shape);const r={a:n,b:a};return Oa.runKernel(Bt,r)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function yu(e,t="float32"){if("complex64"===t){const t=yu(e,"float32"),n=yu(e,"float32");return Ua(t,n)}const n=z(d(e),t);return Oa.makeTensor(n,e,t)}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bu(e,t="float32"){if("complex64"===t){const t=bu(e,"float32"),n=yu(e,"float32");return Ua(t,n)}const n=R(d(e),t);return Oa.makeTensor(n,e,t)}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ku=ja({onesLike_:function(e){const t={x:Wa(e,"x","onesLike")};return Oa.runKernel(Wt,t)}});const xu=ja({outerProduct_:function(e,t){const n=Wa(e,"v1","outerProduct"),a=Wa(t,"v2","outerProduct");u(1===n.rank&&1===a.rank,(()=>`Error in outerProduct: inputs must be rank 1, but got ranks ${n.rank} and ${a.rank}.`));const r=wo(n,[-1,1]),s=wo(a,[1,-1]);return Xr(r,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const wu=ja({pad_:function(e,t,n=0){const a=Wa(e,"x","pad");if(0===a.rank)throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");const r={paddings:t,constantValue:n},s={x:a};return Oa.runKernel(jt,s,r)}});const Nu=ja({pad1d_:function(e,t,n=0){return u(2===t.length,(()=>"Invalid number of paddings. Must be length of 2.")),wu(e,[t],n)}});const vu=ja({pad2d_:function(e,t,n=0){return u(2===t.length&&2===t[0].length&&2===t[1].length,(()=>"Invalid number of paddings. Must be length of 2 each.")),wu(e,t,n)}});const Tu=ja({pad3d_:function(e,t,n=0){return u(3===t.length&&2===t[0].length&&2===t[1].length&&2===t[2].length,(()=>"Invalid number of paddings. Must be length of 2 each.")),wu(e,t,n)}});const Iu=ja({pad4d_:function(e,t,n=0){return u(4===t.length&&2===t[0].length&&2===t[1].length&&2===t[2].length&&2===t[3].length,(()=>"Invalid number of paddings. Must be length of 2 each.")),wu(e,t,n)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Su=ja({spaceToBatchND_:function(e,t,n){const a=Wa(e,"x","spaceToBatchND");u(a.rank>=1+t.length,(()=>`input rank ${a.rank} should be > than [blockShape] ${t.length}`)),u(n.length===t.length,(()=>`paddings.shape[0] ${n.length} must be equal to [blockShape] ${t.length}`)),u(a.shape.reduce(((e,a,r)=>r>0&&r<=t.length?e&&(a+n[r-1][0]+n[r-1][1])%t[r-1]==0:e),!0),(()=>`input spatial dimensions ${a.shape.slice(1)} with paddings ${n.toString()} must be divisible by blockShapes ${t.toString()}`));const r={x:a},s={blockShape:t,paddings:n};return Oa.runKernel(xn,r,s)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Eu=ja({pool_:function(e,t,n,a,r,s){null==r&&(r=[1,1]),null==s&&(s=1),0===a&&(a="valid");const o=Wa(e,"x","maxPool");let i=o,l=!1;3===o.rank&&(l=!0,i=wo(o,[1,o.shape[0],o.shape[1],o.shape[2]])),u(ko(s,r),(()=>`Error in pool: Either strides or dilations must be 1. Got strides ${s} and dilations '${r}'`));const c=uo(i.shape,t,s,r,a),p=[c.dilationHeight,c.dilationWidth];let d;d="same"===a?function(e,t){const n=e.map(((e,n)=>e+(e-1)*(t[n]-1))),a=n.map((e=>e-1)),r=a.map((e=>Math.floor(e/2))),s=a.map(((e,t)=>e-r[t]));return a.map(((e,t)=>[r[t],s[t]]))}([c.filterHeight,c.filterWidth],p):[[0,0],[0,0]];const h=1===p[0]&&1===p[1],[m,f]=function(e,t,n){const a=n.map((e=>e[0])),r=n.map((e=>e[1])),s=e.concat(a,r),o=t.map(((e,t)=>(e-s[t]%e)%e)),i=r.map(((e,t)=>e+o[t])),u=t.map(((e,t)=>[a[t],i[t]])),l=t.map(((e,t)=>[0,o[t]]));return[u,l]}([c.inHeight,c.inWidth],p,d),g=h?a:"valid",y=h?i:Su(i,p,m),b=("avg"===n?()=>No(y,t,s,g):()=>au(y,t,s,g))(),k=h?b:Mo(b,p,f);return l?wo(k,[k.shape[1],k.shape[2],k.shape[3]]):k}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const _u=ja({pow_:function(e,t){let n=Wa(e,"base","pow"),a=Wa(t,"exp","pow");[n,a]=Ia(n,a);const r={a:n,b:a};return Oa.runKernel(Ut,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Mu=ja({prelu_:function(e,t){const n={x:Wa(e,"x","prelu"),alpha:Wa(t,"alpha","prelu")};return Oa.runKernel(Kt,n)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Au=ja({prod_:function(e,t=null,n=!1){let a=Wa(e,"x","prod");"bool"===a.dtype&&(a=Cr(a,"int32"));const r={x:a},s={axis:t,keepDims:n};return Oa.runKernel(Gt,r,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const $u=ja({rand_:function(e,t,n){const a=d(e);let r=null;if(null==n||"float32"===n)r=new Float32Array(a);else if("int32"===n)r=new Int32Array(a);else{if("bool"!==n)throw new Error(`Unknown data type ${n}`);r=new Uint8Array(a)}for(let e=0;e<a;e++)r[e]=t();return Oa.makeTensor(r,e,n)}});"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;function Du(e){if(e.__esModule)return e;var t=e.default;if("function"==typeof t){var n=function e(){return this instanceof e?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};n.prototype=t.prototype}else n={};return Object.defineProperty(n,"__esModule",{value:!0}),Object.keys(e).forEach((function(t){var a=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(n,t,a.get?a:{enumerable:!0,get:function(){return e[t]}})})),n}var Fu={exports:{}};(function(e,t,n){function a(e){var t=this,n=function(){var e=4022871197,t=function(t){t=t.toString();for(var n=0;n<t.length;n++){var a=.02519603282416938*(e+=t.charCodeAt(n));a-=e=a>>>0,e=(a*=e)>>>0,e+=4294967296*(a-=e)}return 2.3283064365386963e-10*(e>>>0)};return t}();t.next=function(){var e=2091639*t.s0+2.3283064365386963e-10*t.c;return t.s0=t.s1,t.s1=t.s2,t.s2=e-(t.c=0|e)},t.c=1,t.s0=n(" "),t.s1=n(" "),t.s2=n(" "),t.s0-=n(e),t.s0<0&&(t.s0+=1),t.s1-=n(e),t.s1<0&&(t.s1+=1),t.s2-=n(e),t.s2<0&&(t.s2+=1),n=null}function r(e,t){return t.c=e.c,t.s0=e.s0,t.s1=e.s1,t.s2=e.s2,t}function s(e,t){var n=new a(e),s=t&&t.state,o=n.next;return o.int32=function(){return 4294967296*n.next()|0},o.double=function(){return o()+11102230246251565e-32*(2097152*o()|0)},o.quick=o,s&&("object"==typeof s&&r(s,n),o.state=function(){return r(n,{})}),o}t&&t.exports?t.exports=s:this.alea=s})(0,Fu);var Ou=Fu.exports,Cu={exports:{}};!function(e){!function(e,t,n){function a(e){var t=this,n="";t.x=0,t.y=0,t.z=0,t.w=0,t.next=function(){var e=t.x^t.x<<11;return t.x=t.y,t.y=t.z,t.z=t.w,t.w^=t.w>>>19^e^e>>>8},e===(0|e)?t.x=e:n+=e;for(var a=0;a<n.length+64;a++)t.x^=0|n.charCodeAt(a),t.next()}function r(e,t){return t.x=e.x,t.y=e.y,t.z=e.z,t.w=e.w,t}function s(e,t){var n=new a(e),s=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do{var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21)}while(0===e);return e},o.int32=n.next,o.quick=o,s&&("object"==typeof s&&r(s,n),o.state=function(){return r(n,{})}),o}t&&t.exports?t.exports=s:this.xor128=s}(0,e)}(Cu);var Ru=Cu.exports,zu={exports:{}};!function(e){!function(e,t,n){function a(e){var t=this,n="";t.next=function(){var e=t.x^t.x>>>2;return t.x=t.y,t.y=t.z,t.z=t.w,t.w=t.v,(t.d=t.d+362437|0)+(t.v=t.v^t.v<<4^e^e<<1)|0},t.x=0,t.y=0,t.z=0,t.w=0,t.v=0,e===(0|e)?t.x=e:n+=e;for(var a=0;a<n.length+64;a++)t.x^=0|n.charCodeAt(a),a==n.length&&(t.d=t.x<<10^t.x>>>4),t.next()}function r(e,t){return t.x=e.x,t.y=e.y,t.z=e.z,t.w=e.w,t.v=e.v,t.d=e.d,t}function s(e,t){var n=new a(e),s=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do{var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21)}while(0===e);return e},o.int32=n.next,o.quick=o,s&&("object"==typeof s&&r(s,n),o.state=function(){return r(n,{})}),o}t&&t.exports?t.exports=s:this.xorwow=s}(0,e)}(zu);var Bu=zu.exports,Lu={exports:{}};!function(e){!function(e,t,n){function a(e){var t=this;t.next=function(){var e,n,a=t.x,r=t.i;return e=a[r],n=(e^=e>>>7)^e<<24,n^=(e=a[r+1&7])^e>>>10,n^=(e=a[r+3&7])^e>>>3,n^=(e=a[r+4&7])^e<<7,e=a[r+7&7],n^=(e^=e<<13)^e<<9,a[r]=n,t.i=r+1&7,n},function(e,t){var n,a=[];if(t===(0|t))a[0]=t;else for(t=""+t,n=0;n<t.length;++n)a[7&n]=a[7&n]<<15^t.charCodeAt(n)+a[n+1&7]<<13;for(;a.length<8;)a.push(0);for(n=0;n<8&&0===a[n];++n);for(8==n?a[7]=-1:a[n],e.x=a,e.i=0,n=256;n>0;--n)e.next()}(t,e)}function r(e,t){return t.x=e.x.slice(),t.i=e.i,t}function s(e,t){null==e&&(e=+new Date);var n=new a(e),s=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do{var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21)}while(0===e);return e},o.int32=n.next,o.quick=o,s&&(s.x&&r(s,n),o.state=function(){return r(n,{})}),o}t&&t.exports?t.exports=s:this.xorshift7=s}(0,e)}(Lu);var Pu=Lu.exports,Vu={exports:{}};!function(e){!function(e,t,n){function a(e){var t=this;t.next=function(){var e,n,a=t.w,r=t.X,s=t.i;return t.w=a=a+1640531527|0,n=r[s+34&127],e=r[s=s+1&127],n^=n<<13,e^=e<<17,n^=n>>>15,e^=e>>>12,n=r[s]=n^e,t.i=s,n+(a^a>>>16)|0},function(e,t){var n,a,r,s,o,i=[],u=128;for(t===(0|t)?(a=t,t=null):(t+="\0",a=0,u=Math.max(u,t.length)),r=0,s=-32;s<u;++s)t&&(a^=t.charCodeAt((s+32)%t.length)),0===s&&(o=a),a^=a<<10,a^=a>>>15,a^=a<<4,a^=a>>>13,s>=0&&(o=o+1640531527|0,r=0==(n=i[127&s]^=a+o)?r+1:0);for(r>=128&&(i[127&(t&&t.length||0)]=-1),r=127,s=512;s>0;--s)a=i[r+34&127],n=i[r=r+1&127],a^=a<<13,n^=n<<17,a^=a>>>15,n^=n>>>12,i[r]=a^n;e.w=o,e.X=i,e.i=r}(t,e)}function r(e,t){return t.i=e.i,t.w=e.w,t.X=e.X.slice(),t}function s(e,t){null==e&&(e=+new Date);var n=new a(e),s=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do{var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21)}while(0===e);return e},o.int32=n.next,o.quick=o,s&&(s.X&&r(s,n),o.state=function(){return r(n,{})}),o}t&&t.exports?t.exports=s:this.xor4096=s}(0,e)}(Vu);var Wu=Vu.exports,Hu={exports:{}};!function(e){!function(e,t,n){function a(e){var t=this,n="";t.next=function(){var e=t.b,n=t.c,a=t.d,r=t.a;return e=e<<25^e>>>7^n,n=n-a|0,a=a<<24^a>>>8^r,r=r-e|0,t.b=e=e<<20^e>>>12^n,t.c=n=n-a|0,t.d=a<<16^n>>>16^r,t.a=r-e|0},t.a=0,t.b=0,t.c=-1640531527,t.d=1367130551,e===Math.floor(e)?(t.a=e/4294967296|0,t.b=0|e):n+=e;for(var a=0;a<n.length+20;a++)t.b^=0|n.charCodeAt(a),t.next()}function r(e,t){return t.a=e.a,t.b=e.b,t.c=e.c,t.d=e.d,t}function s(e,t){var n=new a(e),s=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do{var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21)}while(0===e);return e},o.int32=n.next,o.quick=o,s&&("object"==typeof s&&r(s,n),o.state=function(){return r(n,{})}),o}t&&t.exports?t.exports=s:this.tychei=s}(0,e)}(Hu);var qu=Hu.exports,ju={exports:{}},Uu=Du(Object.freeze({__proto__:null,default:{}}));!function(e){!function(t,n){var a,r=this,s=256,o="random",i=n.pow(s,6),u=n.pow(2,52),l=2*u,c=s-1;function p(e,c,p){var y=[],b=f(m((c=1==c?{entropy:!0}:c||{}).entropy?[e,g(t)]:null==e?function(){try{var e;return a&&(e=a.randomBytes)?e=e(s):(e=new Uint8Array(s),(r.crypto||r.msCrypto).getRandomValues(e)),g(e)}catch(e){var n=r.navigator,o=n&&n.plugins;return[+new Date,r,o,r.screen,g(t)]}}():e,3),y),k=new d(y),x=function(){for(var e=k.g(6),t=i,n=0;e<u;)e=(e+n)*s,t*=s,n=k.g(1);for(;e>=l;)e/=2,t/=2,n>>>=1;return(e+n)/t};return x.int32=function(){return 0|k.g(4)},x.quick=function(){return k.g(4)/4294967296},x.double=x,f(g(k.S),t),(c.pass||p||function(e,t,a,r){return r&&(r.S&&h(r,k),e.state=function(){return h(k,{})}),a?(n[o]=e,t):e})(x,b,"global"in c?c.global:this==n,c.state)}function d(e){var t,n=e.length,a=this,r=0,o=a.i=a.j=0,i=a.S=[];for(n||(e=[n++]);r<s;)i[r]=r++;for(r=0;r<s;r++)i[r]=i[o=c&o+e[r%n]+(t=i[r])],i[o]=t;(a.g=function(e){for(var t,n=0,r=a.i,o=a.j,i=a.S;e--;)t=i[r=c&r+1],n=n*s+i[c&(i[r]=i[o=c&o+t])+(i[o]=t)];return a.i=r,a.j=o,n})(s)}function h(e,t){return t.i=e.i,t.j=e.j,t.S=e.S.slice(),t}function m(e,t){var n,a=[],r=typeof e;if(t&&"object"==r)for(n in e)try{a.push(m(e[n],t-1))}catch(e){}return a.length?a:"string"==r?e:e+"\0"}function f(e,t){for(var n,a=e+"",r=0;r<a.length;)t[c&r]=c&(n^=19*t[c&r])+a.charCodeAt(r++);return g(t)}function g(e){return String.fromCharCode.apply(0,e)}if(n["seed"+o]=p,f(n.random(),t),e.exports){e.exports=p;try{a=Uu}catch(e){}}}([],Math)}(ju);var Ku=Ou,Gu=Ru,Yu=Bu,Qu=Pu,Xu=Wu,Ju=qu,Zu=ju.exports;Zu.alea=Ku,Zu.xor128=Gu,Zu.xorwow=Yu,Zu.xorshift7=Qu,Zu.xor4096=Xu,Zu.tychei=Ju;var el=Zu;
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class tl{constructor(e,t,n,a,r){this.mean=e,this.stdDev=t,this.dtype=n,this.nextVal=NaN,this.truncated=a,this.truncated&&(this.upper=this.mean+2*this.stdDev,this.lower=this.mean-2*this.stdDev);const s=r||Math.random();this.random=el.alea(s.toString())}nextValue(){if(!isNaN(this.nextVal)){const e=this.nextVal;return this.nextVal=NaN,e}let e,t,n=!1;for(;!n;){let a,r,s;do{a=2*this.random()-1,r=2*this.random()-1,s=a*a+r*r}while(s>=1||0===s);const o=Math.sqrt(-2*Math.log(s)/s);e=this.mean+this.stdDev*a*o,t=this.mean+this.stdDev*r*o,this.truncated&&!this.isValidTruncated(e)||(n=!0)}return this.truncated&&!this.isValidTruncated(t)||(this.nextVal=this.convertValue(t)),this.convertValue(e)}convertValue(e){return null==this.dtype||"float32"===this.dtype?e:Math.round(e)}isValidTruncated(e){return e<=this.upper&&e>=this.lower}}class nl{constructor(e,t,n,a){this.alpha=e,this.beta=1/t,this.dtype=n;const r=a||Math.random();this.randu=el.alea(r.toString()),this.randn=new tl(0,1,n,!1,this.randu()),this.d=e<1?e+2/3:e-1/3,this.c=1/Math.sqrt(9*this.d)}nextValue(){let e,t,n,a,r,s;for(;;){do{a=this.randn.nextValue(),s=1+this.c*a}while(s<=0);if(s*=s*s,e=a*a,t=1-.331*e*e,n=.5*e+this.d*(1-s+Math.log(s)),r=this.randu(),r<t||Math.log(r)<n)break}return s=1/this.beta*this.d*s,this.alpha<1&&(s*=Math.pow(this.randu(),1/this.alpha)),this.convertValue(s)}convertValue(e){return"float32"===this.dtype?e:Math.round(e)}}class al{constructor(e=0,t=1,n,a){if(this.canReturnFloat=()=>null==this.dtype||"float32"===this.dtype,this.min=e,this.range=t-e,this.dtype=n,null==a&&(a=Math.random()),"number"==typeof a&&(a=a.toString()),!this.canReturnFloat()&&this.range<=1)throw new Error(`The difference between ${e} - ${t} <= 1 and dtype is not float`);this.random=el.alea(a)}convertValue(e){return this.canReturnFloat()?e:Math.round(e)}nextValue(){return this.convertValue(this.min+this.range*this.random())}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const rl=ja({randomGamma_:function(e,t,n=1,a="float32",r){if(null==n&&(n=1),null==a&&(a="float32"),"float32"!==a&&"int32"!==a)throw new Error(`Unsupported data type ${a}`);const s=new nl(t,n,a,r),o=Or(e,a);for(let e=0;e<o.values.length;e++)o.values[e]=s.nextValue();return o.toTensor()}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const sl=ja({randomNormal_:function(e,t=0,n=1,a,r){if(null!=a&&"bool"===a)throw new Error(`Unsupported data type ${a}`);const s=new tl(t,n,a,!1,r),o=Or(e,a);for(let e=0;e<o.values.length;e++)o.values[e]=s.nextValue();return o.toTensor()}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ol=ja({randomUniform_:function(e,t=0,n=1,a="float32",r){const s=Or(e,a),o=new al(t,n,null,r);for(let e=0;e<s.values.length;e++)s.values[e]=o.nextValue();return s.toTensor()}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function il(e,t,n=1,a="float32"){if(0===n)throw new Error("Cannot have a step of zero");const r={start:e,stop:t,step:n,dtype:a};return Oa.runKernel(Yt,{},r)}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ul=ja({real_:function(e){const t={input:Wa(e,"input","real")};return Oa.runKernel(Qt,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ll=ja({reciprocal_:function(e){const t={x:Wa(e,"x","reciprocal")};return Oa.runKernel(Xt,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const cl=ja({relu_:function(e){const t={x:Wa(e,"x","relu")};return Oa.runKernel(Jt,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const pl=ja({relu6_:function(e){const t={x:Wa(e,"x","relu6")};return Oa.runKernel(rn,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const dl=ja({reverse_:function(e,t){const n={x:Wa(e,"x","reverse")},a={dims:t};return Oa.runKernel(sn,n,a)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const hl=ja({reverse1d_:function(e){const t=Wa(e,"x","reverse");return u(1===t.rank,(()=>`Error in reverse1D: x must be rank 1 but got rank ${t.rank}.`)),dl(t,0)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ml=ja({reverse2d_:function(e,t){const n=Wa(e,"x","reverse");return u(2===n.rank,(()=>`Error in reverse2D: x must be rank 2 but got rank ${n.rank}.`)),dl(n,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const fl=ja({reverse3d_:function(e,t){const n=Wa(e,"x","reverse");return u(3===n.rank,(()=>`Error in reverse3D: x must be rank 3 but got rank ${n.rank}.`)),dl(n,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const gl=ja({reverse4d_:function(e,t){const n=Wa(e,"x","reverse");return u(4===n.rank,(()=>`Error in reverse4D: x must be rank 4 but got rank ${n.rank}.`)),dl(n,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const yl=ja({round_:function(e){const t={x:Wa(e,"x","round")};return Oa.runKernel(on,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const bl=ja({rsqrt_:function(e){const t={x:Wa(e,"x","rsqrt")};return Oa.runKernel(un,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function kl(e,t){if((T(e)&&"string"!==t||Array.isArray(e))&&"complex64"!==t)throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if("string"===t&&T(e)&&!(e instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return Ka(e,[],[],t)}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const xl=ja({selu_:function(e){const t={x:Wa(e,"x","selu")};return Oa.runKernel(pn,t)}});const wl=ja({separableConv2d_:function(e,t,n,a,r,s=[1,1],o="NHWC"){const i=Wa(e,"x","separableConv2d"),l=Wa(t,"depthwiseFilter","separableConv2d"),c=Wa(n,"pointwiseFilter","separableConv2d");let p=i,d=!1;if(3===i.rank&&(d=!0,p=wo(i,[1,i.shape[0],i.shape[1],i.shape[2]])),"NCHW"===o)throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");u(4===p.rank,(()=>`Error in separableConv2d: input must be rank 4, but got rank ${p.rank}.`)),u(4===l.rank,(()=>`Error in separableConv2d: depthwise filter must be rank 4, but got rank ${l.rank}.`)),u(4===c.rank,(()=>`Error in separableConv2d: pointwise filter must be rank 4, but got rank ${l.rank}.`)),u(1===c.shape[0],(()=>`Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got ${c.shape[0]}.`)),u(1===c.shape[1],(()=>`Error in separableConv2d: the second dimension of pointwise filter must be 1, but got ${c.shape[1]}.`));const h=l.shape[2],m=l.shape[3];u(c.shape[2]===h*m,(()=>`Error in separableConv2d: the third dimension of pointwise filter must be ${h*m}, but got ${c.shape[2]}.`));const f=ei(p,l,a,r,o,s),g=Wo(f,c,1,"valid",o);return d?wo(g,[g.shape[1],g.shape[2],g.shape[3]]):g}});
/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Nl=async function(e,t){const n=Wa(e,"x","setdiff1d"),a=Wa(t,"y","setdiff1d");u(n.dtype===a.dtype,(()=>`x and y should have the same dtype, but got x (${n.dtype}) and y (${a.dtype}).`)),u(1===n.rank,(()=>`x should be 1D tensor, but got x (${n.shape}).`)),u(1===a.rank,(()=>`y should be 1D tensor, but got y (${a.shape}).`));const r=await n.data(),s=await a.data(),o=new Set(s);let i=0;for(let e=0;e<r.length;e++)o.has(r[e])||i++;const l=new ha([i],n.dtype),c=new ha([i],"int32");for(let e=0,t=0;e<r.length;e++)o.has(r[e])||(l.values[t]=r[e],c.values[t]=e,t++);return[l.toTensor(),c.toTensor()]};
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const vl=ja({sign_:function(e){const t={x:Wa(e,"x","sign")};return Oa.runKernel(fn,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Tl=ja({sin_:function(e){const t={x:Wa(e,"x","sin")};return Oa.runKernel(hn,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Il=ja({sinh_:function(e){const t={x:Wa(e,"x","sinh")};return Oa.runKernel(mn,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Sl=ja({slice1d_:function(e,t,n){const a=Wa(e,"x","slice1d");return u(1===a.rank,(()=>`slice1d expects a rank-1 tensor, but got a rank-${a.rank} tensor`)),So(a,[t],[n])}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const El=ja({slice2d_:function(e,t,n){const a=Wa(e,"x","slice2d");return u(2===a.rank,(()=>`slice2d expects a rank-2 tensor, but got a rank-${a.rank} tensor`)),So(a,t,n)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const _l=ja({slice3d_:function(e,t,n){const a=Wa(e,"x","slice3d");return u(3===a.rank,(()=>`slice3d expects a rank-3 tensor, but got a rank-${a.rank} tensor`)),So(a,t,n)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ml=ja({slice4d_:function(e,t,n){const a=Wa(e,"x","slice4d");return u(4===a.rank,(()=>`slice4d expects a rank-4 tensor, but got a rank-${a.rank} tensor`)),So(a,t,n)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Al=ja({softmax_:function(e,t=-1){const n=Wa(e,"logits","softmax","float32");if(-1===t&&(t=n.rank-1),t!==n.rank-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and dim was ${t}`);const a={logits:n},r={dim:t};return Oa.runKernel(Nn,a,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const $l=ja({fft_:function(e){u("complex64"===e.dtype,(()=>`The dtype for tf.spectral.fft() must be complex64 but got ${e.dtype}.`));const t={input:e};return Oa.runKernel(Qe,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Dl=ja({ifft_:function(e){u("complex64"===e.dtype,(()=>`The dtype for tf.spectral.ifft() must be complex64 but got ${e.dtype}.`));const t={input:e};return Oa.runKernel(it,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Fl=ja({irfft_:function(e){const t=e.shape[e.shape.length-1],n=e.size/t;let a;if(t<=2){const r=wo(e,[n,t]);a=Dl(r)}else{const r=[n,2*(t-1)],s=wo(ul(e),[n,t]),o=wo(vi(e),[n,t]),i=dl(So(s,[0,1],[n,t-2]),1),u=Ks(dl(So(o,[0,1],[n,t-2]),1),kl(-1)),l=To([s,i],1),c=To([o,u],1),p=wo(Ua(l,c),[r[0],r[1]]);a=Dl(p)}if(a=ul(a),3===e.rank&&0!==e.shape[0]){const t=a,n=e.shape[0];a=wo(a,[n,a.shape[0]/n,a.shape[1]]),t.dispose()}return a}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ol=ja({split_:function(e,t,n=0){const a={x:Wa(e,"x","split")},r={numOrSizeSplits:t,axis:n};return Oa.runKernel(wn,a,r)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Cl=ja({rfft_:function(e,t){u("float32"===e.dtype,(()=>`The dtype for rfft() must be real value but got ${e.dtype}`));let n=e.shape[e.shape.length-1];const a=e.size/n;let r;if(null!=t&&t<n){const a=e.shape.map((e=>0)),s=e.shape.map((e=>e));s[e.shape.length-1]=t,r=So(e,a,s),n=t}else if(null!=t&&t>n){const a=e.shape.map((e=>e));a[e.shape.length-1]=t-n,r=To([e,yu(a)],e.shape.length-1),n=t}else r=e;const s=ui(r),o=wo(Ua(r,s),[a,n]),i=$l(o),l=Math.floor(n/2)+1,c=ul(i),p=vi(i),d=Ol(c,[l,n-l],c.shape.length-1),h=Ol(p,[l,n-l],p.shape.length-1),m=r.shape.slice();return m[r.shape.length-1]=l,wo(Ua(d[0],h[0]),m)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Rl=ja({sqrt_:function(e){const t={x:Wa(e,"x","sqrt")};return Oa.runKernel(bn,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const zl=ja({squaredDifference_:function(e,t){let n=Wa(e,"a","squaredDifference"),a=Wa(t,"b","squaredDifference");[n,a]=Ia(n,a),si(n.shape,a.shape);const r={a:n,b:a};return Oa.runKernel(vn,r,{})}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Bl=ja({squeeze_:function(e,t){const n=Wa(e,"x","squeeze");return wo(n,b(n.shape,t).newShape)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ll=ja({stack_:function(e,t=0){const n=Ha(e,"tensors","stack","string_or_numeric");u(n.length>=1,(()=>"Pass at least one tensor to tf.stack")),n.length>0&&u(t<=n[0].rank,(()=>"Axis must be <= rank of the tensor"));const a=n,r={axis:t};return Oa.runKernel(qt,a,r)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Pl=ja({step_:function(e,t=0){const n={x:Wa(e,"x","step")},a={alpha:t};return Oa.runKernel(zn,n,a)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Vl=ja({stridedSlice_:function(e,t,n,a,r=0,s=0,o=0,i=0,u=0){const l={x:Wa(e,"x","stridedSlice")},c={begin:t,end:n,strides:a,beginMask:r,endMask:s,ellipsisMask:o,newAxisMask:i,shrinkAxisMask:u};return Oa.runKernel(En,l,c)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Wl=ja({tan_:function(e){const t={x:Wa(e,"x","tan")};return Oa.runKernel(_n,t)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hl(e,t){c(e);const n=La(e,t);if(1!==n.length)throw new Error("tensor1d() requires values to be a flat/TypedArray");return Ka(e,null,n,t)}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ql(e,t,n){if(c(e),null!=t&&2!==t.length)throw new Error("tensor2d() requires shape to have two numbers");const a=La(e,n);if(2!==a.length&&1!==a.length)throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");if(1===a.length&&null==t)throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");return Ka(e,t,a,n)}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jl(e,t,n){if(c(e),null!=t&&4!==t.length)throw new Error("tensor4d() requires shape to have four numbers");const a=La(e,n);if(4!==a.length&&1!==a.length)throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");if(1===a.length&&null==t)throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");return Ka(e,t,a,n)}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ul(e,t,n){if(c(e),null!=t&&5!==t.length)throw new Error("tensor5d() requires shape to have five numbers");const a=La(e,n);if(5!==a.length&&1!==a.length)throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");if(1===a.length&&null==t)throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");return Ka(e,t,a,n)}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kl(e,t,n){if(c(e),null!=t&&6!==t.length)throw new Error("tensor6d() requires shape to have six numbers");const a=La(e,n);if(6!==a.length&&1!==a.length)throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");if(1===a.length&&null==t)throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");return Ka(e,t=t||a,a,n)}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Gl=ja({topk_:function(e,t=1,n=!0){const a=Wa(e,"x","topk");if(0===a.rank)throw new Error("topk() expects the input to be of rank 1 or higher");const r=a.shape[a.shape.length-1];if(t>r)throw new Error(`'k' passed to topk() must be <= the last dimension (${r}) but got ${t}`);const s={x:a},o={k:t,sorted:n},[i,u]=Oa.runKernel($n,s,o);return{values:i,indices:u}}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Yl=ja({truncatedNormal_:function(e,t=0,n=1,a,r){if(null!=a&&"bool"===a)throw new Error("Unsupported data type $ { dtype }");const s=new tl(t,n,a,!0,r),o=Or(e,a);for(let e=0;e<o.values.length;e++)o.values[e]=s.nextValue();return o.toTensor()}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ql=ja({unique_:function(e,t=0){const n=Wa(e,"x","unique","string_or_numeric");u(n.rank>0,(()=>"The input tensor must be at least 1D"));const a={x:n},r={axis:t},[s,o]=Oa.runKernel(Fn,a,r);return{values:s,indices:o}}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Xl=ja({unsortedSegmentSum_:function(e,t,n){const a=Wa(e,"x","unsortedSegmentSum"),r=Wa(t,"segmentIds","unsortedSegmentSum","int32");u(m(n),(()=>"numSegments must be of dtype int"));const s={x:a,segmentIds:r},o={numSegments:n};return Oa.runKernel(Cn,s,o)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Jl=ja({unstack_:function(e,t=0){const n=Wa(e,"x","unstack","string_or_numeric");u(t>=-n.shape.length&&t<n.shape.length,(()=>`Axis = ${t} is not in [-${n.shape.length}, ${n.shape.length})`));const a={value:n},r={axis:t};return Oa.runKernel(On,a,r)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zl(e,t=!0,n,a){return Oa.makeVariable(e,t,n,a)}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ec(e,t){const n=[];for(let e=0;e<t.length;e++)t[e]&&n.push(e);const a=Or(e,"int32"),r=Or([n.length,e.length],"int32");for(let t=0;t<n.length;t++){const s=a.indexToLoc(n[t]),o=t*e.length;r.values.set(s,o)}return r.toTensor()}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const tc=async function(e){const t=Wa(e,"condition","whereAsync","bool"),n=await t.data(),a=ec(t.shape,n);return e!==t&&t.dispose(),a};
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const nc=async function(e,t,n){const a=Wa(e,"tensor","boolMask"),r=Wa(t,"mask","boolMask","bool"),s=null==n?0:n,o=r.rank,i=a.shape;u(o>0,(()=>"mask cannot be scalar")),l(i.slice(s,s+o),r.shape,"mask's shape must match the first K dimensions of tensor's shape,");let c=1;for(let e=s;e<s+o;e++)c*=i[e];const p=i.slice(0,s).concat([c],i.slice(s+o)),d=wo(a,p),h=wo(r,[-1]),m=await tc(h),f=Bl(m,[1]),g=xi(d,f,s);return e!==a&&a.dispose(),t!==r&&r.dispose(),f.dispose(),d.dispose(),h.dispose(),m.dispose(),g};
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ac(e,t,n=null){if(0===e.rank)return Gs(e);if(1!==e.rank&&null===n)return ac(wo(e,[-1]),t,n);if(1===e.rank||"number"==typeof n||Array.isArray(n)&&1===n.length){if(1===t)return Wi(Gs(e),n);if(t===1/0)return Pi(Gs(e),n);if(t===-1/0)return uu(Gs(e),n);if("euclidean"===t||2===t)return Rl(Wi(_u(Gs(e),kl(2,"int32")),n));throw new Error(`Error in norm: invalid ord value: ${t}`)}if(Array.isArray(n)&&2===n.length){if(1===t)return Pi(Wi(Gs(e),n[0]),n[1]-1);if(t===1/0)return Pi(Wi(Gs(e),n[1]),n[0]);if(t===-1/0)return uu(Wi(Gs(e),n[1]),n[0]);if("fro"===t||"euclidean"===t)return Rl(Wi(du(e),n));throw new Error(`Error in norm: invalid ord value: ${t}`)}throw new Error(`Error in norm: invalid axis: ${n}`)}const rc=ja({norm_:function(e,t="euclidean",n=null,a=!1){const r=ac(e=Wa(e,"x","norm"),t,n);let s=r.shape;if(a){const t=y(n,e.shape);s=Ki(r.shape,t)}return wo(r,s)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const sc=ja({movingAverage_:function(e,t,n,a,r=!0){const s=Wa(e,"v","movingAverage"),o=Wa(t,"x","movingAverage"),i=Wa(n,"decay","movingAverage");Sa(s,o),u(h(s.shape,o.shape),(()=>"Shape mismatch in v and x"));const l=kl(1),c=Vi(l,i);let p=Ks(Vi(o,s),c);if(r){u(null!=a,(()=>"When using zeroDebias: true, step is required."));const e=Wa(a,"step","movingAverage");p=Us(p,Vi(l,_u(i,e)))}return qs(s,p)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const oc=ja({scatterND_:function(e,t,n){const a=Wa(e,"indices","scatterND","int32"),r=Wa(t,"updates","scatterND");ls(r,a,n);const s={indices:a,updates:r},o={shape:n};return Oa.runKernel(ln,s,o)}});const ic=ja({sparseToDense_:
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e,t,n,a=0){const r=Wa(e,"sparseIndices","sparseToDense","int32"),s=Wa(t,"sparseValues","sparseToDense"),o=Wa(a,"defaultValue","sparseToDense",s.dtype);!function(e,t,n,a){if("int32"!==e.dtype)throw new Error(`tf.sparseToDense() expects the indices to be int32 type, but the dtype was ${e.dtype}.`);if(e.rank>2)throw new Error(`sparseIndices should be a scalar, vector, or matrix, but got shape ${e.shape}.`);const r=e.rank>0?e.shape[0]:1,s=e.rank>1?e.shape[1]:1;if(n.length!==s)throw new Error(`outputShape has incorrect number of elements:, ${n.length}, should be: ${s}.`);const o=t.size;if(0!==t.rank&&(1!==t.rank||o!==r))throw new Error(`sparseValues has incorrect shape ${t.shape}, should be [] or [${r}]`);if(t.dtype!==a.dtype)throw new Error("sparseValues.dtype must match defaultValues.dtype")}(r,s,n,o);const i={sparseIndices:r,sparseValues:s,defaultValue:o},u={outputShape:n};return Oa.runKernel(Sn,i,u)}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const uc=ja({gatherND_:function(e,t){const n=Wa(t,"indices","gatherND","int32"),a={params:Wa(e,"x","gatherND"),indices:n};return Oa.runKernel(at,a)}});
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const lc=ja({dropout_:
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e,t,n,a){const r=Wa(e,"x","dropout");if(u("float32"===r.dtype,(()=>`x has to be a floating point tensor since it's going to be scaled, but got a ${r.dtype} tensor instead.`)),u(t>=0&&t<1,(()=>`rate must be a float in the range [0, 1), but got ${t}.`)),0===t)return e instanceof ga?r.clone():r;const s=function(e,t){if(null==t)return e.shape.slice();if(h(e.shape,t))return t;if(e.shape.length===t.length){const n=[];for(let a=0;a<e.shape.length;a++)null==t[a]&&null!=e.shape[a]?n.push(e.shape[a]):n.push(t[a]);return n}return t}(r,n),o=1-t,i=Us(ki(qs(ol(s,0,1,"float32",a),o)),o);return Ks(r,i)}});
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cc(e){return Math.floor(Math.pow(2,Math.ceil(Math.log(e)/Math.log(2))))}function pc(e,t,n){const a=1-e%2,r=new Float32Array(e);for(let s=0;s<e;++s){const o=2*Math.PI*s/(e+a-1);r[s]=t-n*Math.cos(o)}return Hl(r,"float32")}
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const dc=async function(e,t,n=1){const a=Wa(e,"predictions","inTopK"),r=Wa(t,"targets","inTopK");u(a.rank>1,(()=>`inTopK() expects the predictions to be of rank 2 or higher, but got ${a.rank}`)),u(a.rank-1===r.rank,(()=>`predictions rank should be 1 larger than targets rank, but got predictions rank ${a.rank} and targets rank ${r.rank}`)),l(a.shape.slice(0,a.shape.length-1),r.shape,"predictions's shape should be align with the targets' shape, except the last dimension.");const s=a.shape[a.shape.length-1];u(n>0&&n<=s,(()=>`'k' passed to inTopK() must be > 0 && <= the predictions last dimension (${s}), but got ${n}`));const o=await a.data(),i=await r.data(),[c,p]=[o.length/s,s],d=k("bool",c);for(let e=0;e<c;e++){const t=e*p,a=o.subarray(t,t+p),r=[];for(let e=0;e<a.length;e++)r.push({value:a[e],index:e});r.sort(((e,t)=>t.value-e.value)),d[e]=0;for(let t=0;t<n;t++)if(r[t].index===i[e]){d[e]=1;break}}return e!==a&&a.dispose(),t!==r&&r.dispose(),Ga(d,r.shape,"bool")};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const hc=ja({conv2DBackpropFilter_:function(e,t,n,a,r,s="NHWC",o){let i=e;3===e.rank&&(i=wo(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let l=t;3===l.rank&&(l=wo(t,[1,t.shape[0],t.shape[1],t.shape[2]])),u(4===i.rank,(()=>`Error in conv2dDerFilter: input must be rank 4, but got shape ${i.shape}.`)),u(4===l.rank,(()=>`Error in conv2dDerFilter: dy must be rank 4, but got shape ${l.shape}.`)),u(4===n.length,(()=>`Error in conv2dDerFilter: filterShape must be length 4, but got ${n}.`));const c="NHWC"===s?i.shape[3]:i.shape[1],p="NHWC"===s?l.shape[3]:l.shape[1];u(c===n[2],(()=>`Error in conv2dDerFilter: depth of input ${c}) must match input depth in filter (${n[2]}.`)),u(p===n[3],(()=>`Error in conv2dDerFilter: depth of dy (${p}) must match output depth for filter (${n[3]}).`)),null!=o&&u(m(r),(()=>`Error in conv2dDerFilter: pad must be an integer when using, dimRoundingMode ${o} but got pad ${r}.`));const d={x:i,dy:l},h={strides:a,pad:r,dataFormat:s,dimRoundingMode:o,filterShape:n};return Oa.runKernel(Te,d,h)}});
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mc(e,t,n){if(null==n||"linear"===n)return e;if("relu"===n)return Ks(e,Pl(t));throw new Error(`Cannot compute gradient for fused activation ${n}.`)}function fc(e,t){let n=t;const a=ri(e.shape,t.shape);return a.length>0&&(n=Wi(n,a)),wo(n,e.shape)}function gc(e,t,n,a){if("linear"===t)return e;if("relu"===t)return cl(e);if("elu"===t)return pi(e);if("relu6"===t)return pl(e);if("prelu"===t)return Mu(e,n);if("leakyrelu"===t)return Ei(e,a);throw new Error(`Unknown fused activation ${t}.`)}const yc=(e,t)=>!(e>0)||"linear"===t;
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const bc=ja({fusedConv2d_:function({x:e,filter:t,strides:n,pad:a,dataFormat:r="NHWC",dilations:s=[1,1],dimRoundingMode:o,bias:i,activation:l="linear",preluActivationWeights:c,leakyreluAlpha:p}){if(l=l||"linear",!1===yc(Oa.state.gradientDepth,l)){let u=Wo(e,t,n,a,r,s,o);return null!=i&&(u=qs(u,i)),gc(u,l,c,p)}const d=Wa(e,"x","conv2d"),h=Wa(t,"filter","conv2d");let f=d,g=!1;3===d.rank&&(g=!0,f=wo(d,[1,d.shape[0],d.shape[1],d.shape[2]])),u(4===f.rank,(()=>`Error in fused conv2d: input must be rank 4, but got rank ${f.rank}.`)),u(4===h.rank,(()=>`Error in fused conv2d: filter must be rank 4, but got rank ${h.rank}.`)),null!=o&&u(m(a),(()=>`Error in fused conv2d: pad must be an integer when using, dimRoundingMode ${o} but got pad ${a}.`)),u(f.shape[3]===h.shape[2],(()=>`Error in conv2d: depth of input (${f.shape[3]}) must match input depth for filter ${h.shape[2]}.`)),u(ko(n,s),(()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${s}'`)),u("NHWC"===r,(()=>`Error in conv2d: got dataFormat of ${r} but only NHWC is currently supported.`));const y=co(f.shape,h.shape,n,s,a,o);let b,k;null!=i&&(b=Wa(i,"bias","fused conv2d"),[b]=Ia(b,d),si(y.outShape,b.shape)),null!=c&&(k=Wa(c,"prelu weights","fused conv2d"));const x=(e,t)=>{const[r,o,i,c]=t,p=mc(e,i,l);u(bo(s),(()=>`Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${s}'`));const d=[qo(o.shape,p,r,n,a),hc(o,p,r.shape,n,a)];if(null!=c){const e=fc(c,p);d.push(e)}return d},w={x:f,filter:h,bias:b,preluActivationWeights:k},N={strides:n,pad:a,dataFormat:r,dilations:s,dimRoundingMode:o,activation:l,leakyreluAlpha:p};if(null==i){const e=Ci(((e,t,n)=>{let a=Oa.runKernel(Vn,w,N);return n([t,e,a]),g&&(a=wo(a,[a.shape[1],a.shape[2],a.shape[3]])),{value:a,gradFunc:x}}));return e(f,h)}{const e=Ci(((e,t,n,a)=>{let r=Oa.runKernel(Vn,w,N);return a([t,e,r,n]),g&&(r=wo(r,[r.shape[1],r.shape[2],r.shape[3]])),{value:r,gradFunc:x}}));return e(f,h,b)}}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const kc=ja({depthwiseConv2dNativeBackpropFilter_:function(e,t,n,a,r,s=[1,1],o){let i=e;3===e.rank&&(i=wo(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let u=t;3===u.rank&&(u=wo(t,[1,t.shape[0],t.shape[1],t.shape[2]]));const l={x:i,dy:u},c={strides:a,pad:r,dimRoundingMode:o,dilations:s,filterShape:n};return Oa.runKernel(Re,l,c)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const xc=ja({depthwiseConv2dNativeBackpropInput_:function(e,t,n,a,r,s=[1,1],o){let i=t,u=!1;3===t.rank&&(u=!0,i=wo(t,[1,t.shape[0],t.shape[1],t.shape[2]]));const l={dy:i,filter:n},c={strides:a,pad:r,dimRoundingMode:o,dilations:s,inputShape:e},p=Oa.runKernel(ze,l,c);return u?wo(p,[p.shape[1],p.shape[2],p.shape[3]]):p}});
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const wc=ja({fusedDepthwiseConv2d_:function({x:e,filter:t,strides:n,pad:a,dataFormat:r="NHWC",dilations:s=[1,1],dimRoundingMode:o,bias:i,activation:l="linear",preluActivationWeights:c,leakyreluAlpha:p}){if(!1===yc(Oa.state.gradientDepth,l)){let u=ei(e,t,n,a,r,s,o);return null!=i&&(u=qs(u,i)),gc(u,l,c,p)}const d=Wa(e,"x","depthwiseConv2d"),h=Wa(t,"filter","depthwiseConv2d");let f=d,g=!1;3===d.rank&&(g=!0,f=wo(d,[1,d.shape[0],d.shape[1],d.shape[2]])),u(4===f.rank,(()=>`Error in fused depthwiseConv2d: input must be rank 4, but got rank ${f.rank}.`)),u(4===h.rank,(()=>`Error in fused depthwiseConv2d: filter must be rank 4, but got rank ${h.rank}.`)),u(f.shape[3]===h.shape[2],(()=>`Error in fused depthwiseConv2d: number of input channels (${f.shape[3]}) must match the inChannels dimension in filter ${h.shape[2]}.`)),null==s&&(s=[1,1]),u(ko(n,s),(()=>`Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides ${n} and dilations '${s}'`)),null!=o&&u(m(a),(()=>`Error in fused depthwiseConv2d: pad must be an integer when using dimRoundingMode ${o} but got pad ${a}.`));const y=co(f.shape,h.shape,n,s,a,o,!0);let b,k;null!=i&&(b=Wa(i,"bias","fused conv2d"),[b]=Ia(b,d),si(y.outShape,b.shape)),null!=c&&(k=Wa(c,"prelu weights","fused depthwiseConv2d"));const x=(e,t)=>{u(bo(s),(()=>`Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '${s}'`));const[r,i,c,p]=t,d=mc(e,c,l),h=xc(i.shape,d,r,n,a,s,o),m=kc(i,d,r.shape,n,a,s,o);if(null!=p){return[h,m,fc(b,d)]}return[h,m]},w={x:f,filter:h,bias:b,preluActivationWeights:k},N={strides:n,pad:a,dataFormat:r,dilations:s,dimRoundingMode:o,activation:l,leakyreluAlpha:p};if(null==i){const e=Ci(((e,t,n)=>{let a=Oa.runKernel(Wn,w,N);return n([t,e,a]),g&&(a=wo(a,[a.shape[1],a.shape[2],a.shape[3]])),{value:a,gradFunc:x}}));return e(f,h)}{const e=Ci(((e,t,n,a)=>{let r=Oa.runKernel(Wn,w,N);return a([t,e,r,n]),g&&(r=wo(r,[r.shape[1],r.shape[2],r.shape[3]])),{value:r,gradFunc:x}}));return e(f,h,b)}}});
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Nc=ja({fusedMatMul_:function({a:e,b:t,transposeA:n=!1,transposeB:a=!1,bias:r,activation:s="linear",preluActivationWeights:o,leakyreluAlpha:i}){if(!1===yc(Oa.state.gradientDepth,s)){let u=Xr(e,t,n,a);return null!=r&&(u=qs(u,r)),gc(u,s,o,i)}let l=Wa(e,"a","fused matMul"),c=Wa(t,"b","fused matMul");[l,c]=Ia(l,c);const p=n?l.shape[l.rank-2]:l.shape[l.rank-1],m=a?c.shape[c.rank-1]:c.shape[c.rank-2],f=n?l.shape[l.rank-1]:l.shape[l.rank-2],g=a?c.shape[c.rank-2]:c.shape[c.rank-1],y=l.shape.slice(0,-2),b=c.shape.slice(0,-2),k=d(y),x=d(b);u(l.rank>=2&&c.rank>=2&&l.rank===c.rank,(()=>`Error in fused matMul: inputs must have the same rank of at least 2, got ranks ${l.rank} and ${c.rank}.`)),u(h(y,b),(()=>`Error in fused matMul: outer dimensions (${y}) and (${b}) of Tensors with shapes ${l.shape} and ${c.shape} must match.`)),u(p===m,(()=>`Error in fused matMul: inner shapes (${p}) and (${m}) of Tensors with shapes ${l.shape} and ${c.shape} and transposeA=${n} and transposeB=${a} must match.`));const w=l.shape.slice(0,-2).concat([f,g]),N=wo(l,n?[k,p,f]:[k,f,p]),v=wo(c,a?[x,g,m]:[x,m,g]);let T,I;null!=r&&(T=Wa(r,"bias","fused matMul"),[T]=Ia(T,l),si(w,T.shape)),null!=o&&(I=Wa(o,"prelu weights","fused matMul"));const S=(e,t)=>{const[o,i,u,l]=t,c=mc(wo(e,u.shape),u,s);let p,d;if(n||a?!n&&a?(p=Xr(c,i,!1,!1),d=Xr(c,o,!0,!1)):n&&!a?(p=Xr(i,c,!1,!0),d=Xr(o,c,!1,!1)):(p=Xr(i,c,!0,!0),d=Xr(c,o,!0,!0)):(p=Xr(c,i,!1,!0),d=Xr(o,c,!0,!1)),null!=r){return[p,d,fc(l,c)]}return[p,d]},E={a:N,b:v,bias:T,preluActivationWeights:I},_={transposeA:n,transposeB:a,activation:s,leakyreluAlpha:i};if(null==r){const e=Ci(((e,t,n)=>{const a=Oa.runKernel(Pn,E,_);return n([e,t,a]),{value:wo(a,w),gradFunc:S}}));return e(N,v)}{const e=Ci(((e,t,n,a)=>{const r=Oa.runKernel(Pn,E,_);return a([e,t,r,n]),{value:wo(r,w),gradFunc:S}}));return e(N,v,T)}}});
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var vc=Object.freeze({__proto__:null,conv2d:bc,depthwiseConv2d:wc,matMul:Nc});
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Tc=ja({hammingWindow_:function(e){return pc(e,.54,.46)}});
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ic=ja({hannWindow_:function(e){return pc(e,.5,.5)}});
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Sc=ja({frame_:function(e,t,n,a=!1,r=0){let s=0;const o=[];for(;s+t<=e.size;)o.push(So(e,s,t)),s+=n;if(a)for(;s<e.size;){const a=s+t-e.size,i=To([So(e,s,t-a),bi([a],r)]);o.push(i),s+=n}return 0===o.length?ql([],[0,t]):wo(To(o),[o.length,t])}});
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ec=ja({stft_:function(e,t,n,a,r=Ic){null==a&&(a=cc(t));const s=Sc(e,t,n),o=Ks(s,r(t)),i=[];for(let e=0;e<s.shape[0];e++)i.push(Cl(So(o,[e,0],[1,t]),a));return To(i)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const _c=ja({cropAndResize_:function(e,t,n,a,r="bilinear",s=0){const o=Wa(e,"image","cropAndResize"),i=Wa(t,"boxes","cropAndResize","float32"),l=Wa(n,"boxInd","cropAndResize","int32"),c=i.shape[0];u(4===o.rank,(()=>`Error in cropAndResize: image must be rank 4,but got rank ${o.rank}.`)),u(2===i.rank&&4===i.shape[1],(()=>`Error in cropAndResize: boxes must be have size [${c},4] but had shape ${i.shape}.`)),u(1===l.rank&&l.shape[0]===c,(()=>`Error in cropAndResize: boxInd must be have size [${c}] but had shape ${i.shape}.`)),u(2===a.length,(()=>`Error in cropAndResize: cropSize must be of length 2, but got length ${a.length}.`)),u(a[0]>=1&&a[1]>=1,(()=>`cropSize must be atleast [1,1], but was ${a}`)),u("bilinear"===r||"nearest"===r,(()=>`method must be bilinear or nearest, but was ${r}`));const p={image:o,boxes:i,boxInd:l},d={method:r,extrapolationValue:s,cropSize:a};return Oa.runKernel(De,p,d)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Mc=ja({flipLeftRight_:function(e){const t=Wa(e,"image","flipLeftRight","float32");u(4===t.rank,(()=>`Error in flipLeftRight: image must be rank 4,but got rank ${t.rank}.`));const n={image:t};return Oa.runKernel(Je,n,{})}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ac=ja({rotateWithOffset_:function(e,t,n=0,a=.5){const r=Wa(e,"image","rotateWithOffset","float32");u(4===r.rank,(()=>`Error in rotateWithOffset: image must be rank 4,but got rank ${r.rank}.`));const s={image:r},o={radians:t,fillValue:n,center:a};return Oa.runKernel(Ln,s,o)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $c(e,t,n,a,r,s){null==a&&(a=.5),null==r&&(r=Number.NEGATIVE_INFINITY),null==s&&(s=0);const o=e.shape[0];return n=Math.min(n,o),u(0<=a&&a<=1,(()=>`iouThreshold must be in [0, 1], but was '${a}'`)),u(2===e.rank,(()=>`boxes must be a 2D tensor, but was of rank '${e.rank}'`)),u(4===e.shape[1],(()=>`boxes must have 4 columns, but 2nd dimension was ${e.shape[1]}`)),u(1===t.rank,(()=>"scores must be a 1D tensor")),u(t.shape[0]===o,(()=>`scores has incompatible shape with boxes. Expected ${o}, but was ${t.shape[0]}`)),u(0<=s&&s<=1,(()=>`softNmsSigma must be in [0, 1], but was '${s}'`)),{maxOutputSize:n,iouThreshold:a,scoreThreshold:r,softNmsSigma:s}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Dc=ja({nonMaxSuppression_:function(e,t,n,a=.5,r=Number.NEGATIVE_INFINITY){const s=Wa(e,"boxes","nonMaxSuppression"),o=Wa(t,"scores","nonMaxSuppression"),i=$c(s,o,n,a,r),u={maxOutputSize:n=i.maxOutputSize,iouThreshold:a=i.iouThreshold,scoreThreshold:r=i.scoreThreshold};return Oa.runKernel(Lt,{boxes:s,scores:o},u)}});
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fc(e,t,n){const a=function(e,t,n){return function(e,t,n){let a=0,r=e.length,s=0,o=!1;for(;a<r;){s=a+(r-a>>>1);const i=n(t,e[s]);i>0?a=s+1:(r=s,o=!i)}return o?a:-a-1}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */(e,t,n||Oc)}(e,t,n),r=a<0?-(a+1):a;e.splice(r,0,t)}function Oc(e,t){return e>t?1:e<t?-1:0}function Cc(e,t,n,a,r){return Bc(e,t,n,a,r,0)}function Rc(e,t,n,a,r,s){return Bc(e,t,n,a,r,0,!1,s,!0)}function zc(e,t,n,a,r,s){return Bc(e,t,n,a,r,s,!0)}function Bc(e,t,n,a,r,s,o=!1,i=!1,u=!1){const l=[];for(let e=0;e<t.length;e++)t[e]>r&&l.push({score:t[e],boxIndex:e,suppressBeginIndex:0});l.sort(Vc);const c=s>0?-.5/s:0,p=[],d=[];for(;p.length<n&&l.length>0;){const t=l.pop(),{score:n,boxIndex:s,suppressBeginIndex:o}=t;if(n<r)break;let i=!1;for(let n=p.length-1;n>=o;--n){const o=Lc(e,s,p[n]);if(o>=a){i=!0;break}if(t.score=t.score*Pc(a,c,o),t.score<=r)break}t.suppressBeginIndex=p.length,i||(t.score===n?(p.push(s),d.push(t.score)):t.score>r&&Fc(l,t,Vc))}const h=p.length,m=n-h;i&&m>0&&(p.push(...new Array(m).fill(0)),d.push(...new Array(m).fill(0)));const f={selectedIndices:p};return o&&(f.selectedScores=d),u&&(f.validOutputs=h),f}function Lc(e,t,n){const a=e.subarray(4*t,4*t+4),r=e.subarray(4*n,4*n+4),s=Math.min(a[0],a[2]),o=Math.min(a[1],a[3]),i=Math.max(a[0],a[2]),u=Math.max(a[1],a[3]),l=Math.min(r[0],r[2]),c=Math.min(r[1],r[3]),p=Math.max(r[0],r[2]),d=Math.max(r[1],r[3]),h=(i-s)*(u-o),m=(p-l)*(d-c);if(h<=0||m<=0)return 0;const f=Math.max(s,l),g=Math.max(o,c),y=Math.min(i,p),b=Math.min(u,d),k=Math.max(y-f,0)*Math.max(b-g,0);return k/(h+m-k)}function Pc(e,t,n){const a=Math.exp(t*n*n);return n<=e?a:0}function Vc(e,t){return e.score-t.score||e.score===t.score&&t.boxIndex-e.boxIndex}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Wc=async function(e,t,n,a=.5,r=Number.NEGATIVE_INFINITY){const s=Wa(e,"boxes","nonMaxSuppressionAsync"),o=Wa(t,"scores","nonMaxSuppressionAsync"),i=$c(s,o,n,a,r);n=i.maxOutputSize,a=i.iouThreshold,r=i.scoreThreshold;const u=await Promise.all([s.data(),o.data()]),l=u[0],c=u[1],{selectedIndices:p}=Cc(l,c,n,a,r);return s!==e&&s.dispose(),o!==t&&o.dispose(),Hl(p,"int32")};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Hc=ja({nonMaxSuppressionWithScore_:function(e,t,n,a=.5,r=Number.NEGATIVE_INFINITY,s=0){const o=Wa(e,"boxes","nonMaxSuppression"),i=Wa(t,"scores","nonMaxSuppression"),u=$c(o,i,n,a,r,s),l={boxes:o,scores:i},c={maxOutputSize:n=u.maxOutputSize,iouThreshold:a=u.iouThreshold,scoreThreshold:r=u.scoreThreshold,softNmsSigma:s=u.softNmsSigma},p=Oa.runKernel(Vt,l,c);return{selectedIndices:p[0],selectedScores:p[1]}}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const qc=async function(e,t,n,a=.5,r=Number.NEGATIVE_INFINITY,s=0){const o=Wa(e,"boxes","nonMaxSuppressionAsync"),i=Wa(t,"scores","nonMaxSuppressionAsync"),u=$c(o,i,n,a,r,s);n=u.maxOutputSize,a=u.iouThreshold,r=u.scoreThreshold,s=u.softNmsSigma;const l=await Promise.all([o.data(),i.data()]),c=l[0],p=l[1],{selectedIndices:d,selectedScores:h}=zc(c,p,n,a,r,s);return o!==e&&o.dispose(),i!==t&&i.dispose(),{selectedIndices:Hl(d,"int32"),selectedScores:Hl(h)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const jc=ja({nonMaxSuppressionPadded_:function(e,t,n,a=.5,r=Number.NEGATIVE_INFINITY,s=!1){const o=Wa(e,"boxes","nonMaxSuppression"),i=Wa(t,"scores","nonMaxSuppression"),u=$c(o,i,n,a,r,null),l={boxes:o,scores:i},c={maxOutputSize:u.maxOutputSize,iouThreshold:u.iouThreshold,scoreThreshold:u.scoreThreshold,padToMaxOutputSize:s},p=Oa.runKernel(Pt,l,c);return{selectedIndices:p[0],validOutputs:p[1]}}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Uc=async function(e,t,n,a=.5,r=Number.NEGATIVE_INFINITY,s=!1){const o=Wa(e,"boxes","nonMaxSuppressionAsync"),i=Wa(t,"scores","nonMaxSuppressionAsync"),u=$c(o,i,n,a,r,null),l=u.maxOutputSize,c=u.iouThreshold,p=u.scoreThreshold,[d,h]=await Promise.all([o.data(),i.data()]),{selectedIndices:m,validOutputs:f}=Rc(d,h,l,c,p,s);return o!==e&&o.dispose(),i!==t&&i.dispose(),{selectedIndices:Hl(m,"int32"),validOutputs:kl(f,"int32")}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Kc=ja({resizeBilinear_:function(e,t,n=!1,a=!1){const r=Wa(e,"images","resizeBilinear");u(3===r.rank||4===r.rank,(()=>`Error in resizeBilinear: x must be rank 3 or 4, but got rank ${r.rank}.`)),u(2===t.length,(()=>`Error in resizeBilinear: new shape must 2D, but got shape ${t}.`)),u(!1===a||!1===n,(()=>"Error in resizeBilinear: If halfPixelCenters is true, alignCorners must be false."));let s=r,o=!1;3===r.rank&&(o=!0,s=wo(r,[1,r.shape[0],r.shape[1],r.shape[2]]));const i={images:s},l={alignCorners:n,halfPixelCenters:a,size:t},c=Oa.runKernel(nn,i,l);return o?wo(c,[c.shape[1],c.shape[2],c.shape[3]]):c}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Gc=ja({resizeNearestNeighbor_:function(e,t,n=!1,a=!1){const r=Wa(e,"images","resizeNearestNeighbor");u(3===r.rank||4===r.rank,(()=>`Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank ${r.rank}.`)),u(2===t.length,(()=>`Error in resizeNearestNeighbor: new shape must 2D, but got shape ${t}.`)),u("float32"===r.dtype||"int32"===r.dtype,(()=>"`images` must have `int32` or `float32` as dtype")),u(!1===a||!1===n,(()=>"Error in resizeNearestNeighbor: If halfPixelCenters is true, alignCorners must be false."));let s=r,o=!1;3===r.rank&&(o=!0,s=wo(r,[1,r.shape[0],r.shape[1],r.shape[2]]));const i={images:s},l={alignCorners:n,halfPixelCenters:a,size:t},c=Oa.runKernel(en,i,l);return o?wo(c,[c.shape[1],c.shape[2],c.shape[3]]):c}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Yc=ja({bandPart_:function(e,t,n){u(t%1==0,(()=>`bandPart(): numLower must be an integer, got ${t}.`)),u(n%1==0,(()=>`bandPart(): numUpper must be an integer, got ${n}.`));const a=Wa(e,"a","bandPart");u(a.rank>=2,(()=>`bandPart(): Rank must be at least 2, got ${a.rank}.`));const r=a.shape,[s,o]=a.shape.slice(-2);if(!(t<=s))throw new Error(`bandPart(): numLower (${t}) must not be greater than the number of rows (${s}).`);if(!(n<=o))throw new Error(`bandPart(): numUpper (${n}) must not be greater than the number of columns (${o}).`);t<0&&(t=s),n<0&&(n=o);const i=wo(il(0,s,1,"int32"),[-1,1]),l=il(0,o,1,"int32"),c=Vi(i,l),p=Zi(Mi(c,kl(+t,"int32")),Ni(c,kl(-n,"int32"))),d=yu([s,o],a.dtype);return wo(Ll(Jl(wo(a,[-1,s,o])).map((e=>ii(p,e,d)))),r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Qc=ja({gramSchmidt_:function(e){let t;if(Array.isArray(e)){t=!1,u(null!=e&&e.length>0,(()=>"Gram-Schmidt process: input must not be null, undefined, or empty"));const n=e[0].shape[0];for(let t=1;t<e.length;++t)u(e[t].shape[0]===n,(()=>`Gram-Schmidt: Non-unique lengths found in the input vectors: (${e[t].shape[0]} vs. ${n})`))}else t=!0,e=Ol(e,e.shape[0],0).map((e=>Bl(e,[0])));u(e.length<=e[0].shape[0],(()=>`Gram-Schmidt: Number of vectors (${e.length}) exceeds number of dimensions (${e[0].shape[0]}).`));const n=[],a=e;for(let t=0;t<e.length;++t)n.push(Oa.tidy((()=>{let e=a[t];if(t>0)for(let a=0;a<t;++a){const t=Ks(Wi(Ks(n[a],e)),n[a]);e=Vi(e,t)}return Us(e,rc(e,"euclidean"))})));return t?Ll(n,0):n}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xc(e,t=!1){return Oa.tidy((()=>{u(2===e.shape.length,(()=>`qr2d() requires a 2D Tensor, but got a ${e.shape.length}D Tensor.`));const n=e.shape[0],a=e.shape[1];let r=yi(n),s=Rr(e);const o=ql([[1]],[1,1]);let i=Rr(o);const l=n>=a?a:n;for(let e=0;e<l;++e){const t=s,u=i,l=r;[i,s,r]=Oa.tidy((()=>{const t=So(s,[e,e],[n-e,1]),u=rc(t),l=So(s,[e,e],[1,1]),c=ii(wi(l,0),ql([[-1]]),ql([[1]])),p=Vi(l,Ks(c,u)),d=Us(t,p);i=1===d.shape[0]?Rr(o):To([o,So(d,[1,0],[d.shape[0]-1,d.shape[1]])],0);const h=zi(Us(Xr(c,p),u)),m=So(s,[e,0],[n-e,a]),f=Ks(h,i),g=Zr(i);if(0===e)s=Vi(m,Xr(f,Xr(g,m)));else{const t=Vi(m,Xr(f,Xr(g,m)));s=To([So(s,[0,0],[e,a]),t],0)}const y=Zr(f),b=So(r,[0,e],[n,r.shape[1]-e]);if(0===e)r=Vi(b,Xr(Xr(b,i),y));else{const t=Vi(b,Xr(Xr(b,i),y));r=To([So(r,[0,0],[n,e]),t],1)}return[i,s,r]})),Vs([t,u,l])}return!t&&n>a&&(r=So(r,[0,0],[n,a]),s=So(s,[0,0],[a,a])),[r,s]}))}const Jc=ja({qr_:function(e,t=!1){if(u(e.rank>=2,(()=>`qr() requires input tensor to have a rank >= 2, but got rank ${e.rank}`)),2===e.rank)return Xc(e,t);{const n=e.shape.slice(0,e.shape.length-2).reduce(((e,t)=>e*t)),a=Jl(wo(e,[n,e.shape[e.shape.length-2],e.shape[e.shape.length-1]]),0),r=[],s=[];a.forEach((e=>{const[n,a]=Xc(e,t);r.push(n),s.push(a)}));return[wo(Ll(r,0),e.shape),wo(Ll(s,0),e.shape)]}}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Zc;!function(e){e[e.NONE=0]="NONE",e[e.MEAN=1]="MEAN",e[e.SUM=2]="SUM",e[e.SUM_BY_NONZERO_WEIGHTS=3]="SUM_BY_NONZERO_WEIGHTS"}(Zc||(Zc={}));const ep=ja({computeWeightedLoss_:function(e,t,n=Zc.SUM_BY_NONZERO_WEIGHTS){const a=Wa(e,"losses","computeWeightedLoss");let r=null;null!=t&&(r=Wa(t,"weights","computeWeightedLoss"));const s=null==r?a:Ks(a,r);if(n===Zc.NONE)return s;if(n===Zc.SUM)return Wi(s);if(n===Zc.MEAN){if(null==r)return iu(s);{const e=a.size/r.size,t=Us(Wi(s),Wi(r));return e>1?Us(t,kl(e)):t}}if(n===Zc.SUM_BY_NONZERO_WEIGHTS){if(null==r)return Us(Wi(s),kl(a.size));{const e=Ks(r,bu(a.shape)),t=Cr(Wi(gu(e,kl(0))),"float32");return Us(Wi(s),t)}}throw Error(`Unknown reduction: ${n}`)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const tp=ja({absoluteDifference_:function(e,t,n,a=Zc.SUM_BY_NONZERO_WEIGHTS){const r=Wa(e,"labels","absoluteDifference"),s=Wa(t,"predictions","absoluteDifference");let o=null;null!=n&&(o=Wa(n,"weights","absoluteDifference")),l(r.shape,s.shape,"Error in absoluteDifference: ");const i=Gs(Vi(r,s));return ep(i,o,a)}});const np=ja({cosineDistance_:function(e,t,n,a,r=Zc.SUM_BY_NONZERO_WEIGHTS){const s=Wa(e,"labels","cosineDistance"),o=Wa(t,"predictions","cosineDistance");let i=null;null!=a&&(i=Wa(a,"weights","cosineDistance")),l(s.shape,o.shape,"Error in cosineDistance: ");const u=kl(1),c=Vi(u,Wi(Ks(s,o),n,!0));return ep(c,i,r)}});const ap=ja({hingeLoss_:function(e,t,n,a=Zc.SUM_BY_NONZERO_WEIGHTS){let r=Wa(e,"labels","hingeLoss");const s=Wa(t,"predictions","hingeLoss");let o=null;null!=n&&(o=Wa(n,"weights","hingeLoss")),l(r.shape,s.shape,"Error in hingeLoss: ");const i=kl(1);r=Vi(Ks(kl(2),r),i);const u=cl(Vi(i,Ks(r,s)));return ep(u,o,a)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const rp=ja({huberLoss_:function(e,t,n,a=1,r=Zc.SUM_BY_NONZERO_WEIGHTS){const s=Wa(e,"labels","huberLoss"),o=Wa(t,"predictions","huberLoss");let i=null;null!=n&&(i=Wa(n,"weights","huberLoss")),l(s.shape,o.shape,"Error in huberLoss: ");const u=kl(a),c=Gs(Vi(o,s)),p=lu(c,u),d=Vi(c,p),h=qs(Ks(kl(.5),du(p)),Ks(u,d));return ep(h,i,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const sp=ja({logLoss_:function(e,t,n,a=1e-7,r=Zc.SUM_BY_NONZERO_WEIGHTS){const s=Wa(e,"labels","logLoss"),o=Wa(t,"predictions","logLoss");let i=null;null!=n&&(i=Wa(n,"weights","logLoss")),l(s.shape,o.shape,"Error in logLoss: ");const u=kl(1),c=kl(a),p=zi(Ks(s,Di(qs(o,c)))),d=Ks(Vi(u,s),Di(qs(Vi(u,o),c))),h=Vi(p,d);return ep(h,i,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const op=ja({meanSquaredError_:function(e,t,n,a=Zc.SUM_BY_NONZERO_WEIGHTS){const r=Wa(e,"labels","meanSquaredError"),s=Wa(t,"predictions","meanSquaredError");let o=null;null!=n&&(o=Wa(n,"weights","meanSquaredError")),l(r.shape,s.shape,"Error in meanSquaredError: ");const i=zl(r,s);return ep(i,o,a)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ip=ja({sigmoidCrossEntropy_:function(e,t,n,a=0,r=Zc.SUM_BY_NONZERO_WEIGHTS){let s=Wa(e,"multiClassLabels","sigmoidCrossEntropy");const o=Wa(t,"logits","sigmoidCrossEntropy");let i=null;if(null!=n&&(i=Wa(n,"weights","sigmoidCrossEntropy")),l(s.shape,o.shape,"Error in sigmoidCrossEntropy: "),a>0){const e=kl(a),t=kl(1),n=kl(.5);s=qs(Ks(s,Vi(t,e)),Ks(n,e))}const u=function(e,t){const n=Wa(e,"labels","sigmoidCrossEntropyWithLogits"),a=Wa(t,"logits","sigmoidCrossEntropyWithLogits");l(n.shape,a.shape,"Error in sigmoidCrossEntropyWithLogits: ");const r=cl(a),s=Ks(a,n),o=Fi(hi(zi(Gs(a))));return qs(Vi(r,s),o)}(s,o);return ep(u,i,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const up=ja({softmaxCrossEntropy_:function(e,t,n,a=0,r=Zc.SUM_BY_NONZERO_WEIGHTS){let s=Wa(e,"onehotLabels","softmaxCrossEntropy");const o=Wa(t,"logits","softmaxCrossEntropy");let i=null;if(null!=n&&(i=Wa(n,"weights","softmaxCrossEntropy")),l(s.shape,o.shape,"Error in softmaxCrossEntropy: "),a>0){const e=kl(a),t=kl(1),n=kl(s.shape[1]);s=qs(Ks(s,Vi(t,e)),Us(e,n))}const u=function(e,t,n=-1){if(-1===n&&(n=t.rank-1),n!==t.rank-1)throw Error(`Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank ${t.rank} and dim was ${n}`);const a=Ci(((e,t,a)=>{const r=Ji(t,[n],!0),s=Vi(Cr(t,"float32"),r);a([e,s]);const o=zi(Ks(s,e));return{value:Wi(o,[n]),gradFunc:(e,t)=>{const[a,r]=t,s=Ki(e.shape,[n]);return[Ks(wo(e,s),Vi(Cr(a,"float32"),hi(r))),Ks(wo(e,s),Vi(hi(r),Cr(a,"float32")))]}}}));return a(e,t)}(s,o);return ep(u,i,r)}}),lp={fft:$l,ifft:Dl,rfft:Cl,irfft:Fl},cp={hammingWindow:Tc,hannWindow:Ic,frame:Sc,stft:Ec},pp={flipLeftRight:Mc,resizeNearestNeighbor:Gc,resizeBilinear:Kc,rotateWithOffset:Ac,cropAndResize:_c,nonMaxSuppression:Dc,nonMaxSuppressionAsync:Wc,nonMaxSuppressionWithScore:Hc,nonMaxSuppressionWithScoreAsync:qc,nonMaxSuppressionPadded:jc,nonMaxSuppressionPaddedAsync:Uc},dp={bandPart:Yc,gramSchmidt:Qc,qr:Jc},hp={absoluteDifference:tp,computeWeightedLoss:ep,cosineDistance:np,hingeLoss:ap,huberLoss:rp,logLoss:sp,meanSquaredError:op,sigmoidCrossEntropy:ip,softmaxCrossEntropy:up};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class mp extends Ms{minimize(e,t=!1,n){const{value:a,grads:r}=this.computeGradients(e,n);if(null!=n){const e=n.map((e=>({name:e.name,tensor:r[e.name]})));this.applyGradients(e)}else this.applyGradients(r);return Vs(r),t?a:(a.dispose(),null)}get iterations(){return null==this.iterations_&&(this.iterations_=0),this.iterations_}incrementIterations(){this.iterations_=this.iterations+1}computeGradients(e,t){return Oi(e,t)}dispose(){null!=this.iterations_&&Vs(this.iterations_)}async saveIterations(){return null==this.iterations_&&(this.iterations_=0),{name:"iter",tensor:kl(this.iterations_,"int32")}}async getWeights(){throw new Error("getWeights() is not implemented for this optimizer yet.")}async setWeights(e){throw new Error(`setWeights() is not implemented for this optimizer class ${this.getClassName()}`)}async extractIterations(e){return this.iterations_=(await e[0].tensor.data())[0],e.slice(1)}}Object.defineProperty(mp,Symbol.hasInstance,{value:e=>null!=e.minimize&&null!=e.computeGradients&&null!=e.applyGradients});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class fp extends mp{constructor(e,t,n=null){super(),this.learningRate=e,this.rho=t,this.epsilon=n,this.accumulatedGrads=[],this.accumulatedUpdates=[],null==n&&(this.epsilon=Oa.backend.epsilon())}applyGradients(e){(Array.isArray(e)?e.map((e=>e.name)):Object.keys(e)).forEach(((t,n)=>{const a=Oa.registeredVariables[t],r=!1;null==this.accumulatedGrads[n]&&(this.accumulatedGrads[n]={originalName:`${t}/accum_grad`,variable:Ps((()=>ui(a).variable(r)))}),null==this.accumulatedUpdates[n]&&(this.accumulatedUpdates[n]={originalName:`${t}/accum_var`,variable:Ps((()=>ui(a).variable(r)))});const s=Array.isArray(e)?e[n].tensor:e[t];if(null==s)return;const o=this.accumulatedGrads[n].variable,i=this.accumulatedUpdates[n].variable;Ps((()=>{const e=qs(Ks(o,this.rho),Ks(du(s),1-this.rho)),t=Ks(Us(Rl(qs(i,this.epsilon)),Rl(qs(o,this.epsilon))),s),n=qs(Ks(i,this.rho),Ks(du(t),1-this.rho));o.assign(e),i.assign(n);const r=qs(Ks(t,-this.learningRate),a);a.assign(r)}))})),this.incrementIterations()}dispose(){null!=this.accumulatedUpdates&&(Vs(this.accumulatedGrads.map((e=>e.variable))),Vs(this.accumulatedUpdates.map((e=>e.variable))))}async getWeights(){const e=[...this.accumulatedGrads,...this.accumulatedUpdates];return[await this.saveIterations()].concat(e.map((e=>({name:e.originalName,tensor:e.variable}))))}async setWeights(e){const t=(e=await this.extractIterations(e)).length/2,n=!1;this.accumulatedGrads=e.slice(0,t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)}))),this.accumulatedUpdates=e.slice(t,2*t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)})))}getConfig(){return{learningRate:this.learningRate,rho:this.rho,epsilon:this.epsilon}}static fromConfig(e,t){return new e(t.learningRate,t.rho,t.epsilon)}}fp.className="Adadelta",$s(fp);
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class gp extends mp{constructor(e,t=.1){super(),this.learningRate=e,this.initialAccumulatorValue=t,this.accumulatedGrads=[]}applyGradients(e){(Array.isArray(e)?e.map((e=>e.name)):Object.keys(e)).forEach(((t,n)=>{const a=Oa.registeredVariables[t];if(null==this.accumulatedGrads[n]){const e=!1;this.accumulatedGrads[n]={originalName:`${t}/accumulator`,variable:Ps((()=>bi(a.shape,this.initialAccumulatorValue).variable(e)))}}const r=Array.isArray(e)?e[n].tensor:e[t];if(null==r)return;const s=this.accumulatedGrads[n].variable;Ps((()=>{const e=qs(s,du(r));s.assign(e);const t=qs(Ks(Us(r,Rl(qs(e,Oa.backend.epsilon()))),-this.learningRate),a);a.assign(t)}))})),this.incrementIterations()}dispose(){null!=this.accumulatedGrads&&Vs(this.accumulatedGrads.map((e=>e.variable)))}async getWeights(){return[await this.saveIterations()].concat(this.accumulatedGrads.map((e=>({name:e.originalName,tensor:e.variable}))))}async setWeights(e){e=await this.extractIterations(e);this.accumulatedGrads=e.map((e=>({originalName:e.name,variable:e.tensor.variable(false)})))}getConfig(){return{learningRate:this.learningRate,initialAccumulatorValue:this.initialAccumulatorValue}}static fromConfig(e,t){return new e(t.learningRate,t.initialAccumulatorValue)}}gp.className="Adagrad",$s(gp);
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class yp extends mp{constructor(e,t,n,a=null){super(),this.learningRate=e,this.beta1=t,this.beta2=n,this.epsilon=a,this.accumulatedFirstMoment=[],this.accumulatedSecondMoment=[],Ps((()=>{this.accBeta1=kl(t).variable(),this.accBeta2=kl(n).variable()})),null==a&&(this.epsilon=Oa.backend.epsilon())}applyGradients(e){const t=Array.isArray(e)?e.map((e=>e.name)):Object.keys(e);Ps((()=>{const n=Vi(1,this.accBeta1),a=Vi(1,this.accBeta2);t.forEach(((t,r)=>{const s=Oa.registeredVariables[t],o=!1;null==this.accumulatedFirstMoment[r]&&(this.accumulatedFirstMoment[r]={originalName:`${t}/m`,variable:Ps((()=>ui(s).variable(o)))}),null==this.accumulatedSecondMoment[r]&&(this.accumulatedSecondMoment[r]={originalName:`${t}/v`,variable:Ps((()=>ui(s).variable(o)))});const i=Array.isArray(e)?e[r].tensor:e[t];if(null==i)return;const u=this.accumulatedFirstMoment[r].variable,l=this.accumulatedSecondMoment[r].variable,c=qs(Ks(u,this.beta1),Ks(i,1-this.beta1)),p=qs(Ks(l,this.beta2),Ks(du(i),1-this.beta2)),d=Us(c,n),h=Us(p,a);u.assign(c),l.assign(p);const m=qs(Ks(Us(d,qs(Rl(h),this.epsilon)),-this.learningRate),s);s.assign(m)})),this.accBeta1.assign(Ks(this.accBeta1,this.beta1)),this.accBeta2.assign(Ks(this.accBeta2,this.beta2))})),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.accBeta2.dispose(),null!=this.accumulatedFirstMoment&&Vs(this.accumulatedFirstMoment.map((e=>e.variable))),null!=this.accumulatedSecondMoment&&Vs(this.accumulatedSecondMoment.map((e=>e.variable)))}async getWeights(){const e=[...this.accumulatedFirstMoment,...this.accumulatedSecondMoment];return[await this.saveIterations()].concat(e.map((e=>({name:e.originalName,tensor:e.variable}))))}async setWeights(e){e=await this.extractIterations(e),Ps((()=>{this.accBeta1.assign(_u(this.beta1,this.iterations_+1)),this.accBeta2.assign(_u(this.beta2,this.iterations_+1))}));const t=e.length/2,n=!1;this.accumulatedFirstMoment=e.slice(0,t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)}))),this.accumulatedSecondMoment=e.slice(t,2*t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)})))}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon}}static fromConfig(e,t){return new e(t.learningRate,t.beta1,t.beta2,t.epsilon)}}yp.className="Adam",$s(yp);
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class bp extends mp{constructor(e,t,n,a=null,r=0){super(),this.learningRate=e,this.beta1=t,this.beta2=n,this.epsilon=a,this.decay=r,this.accumulatedFirstMoment=[],this.accumulatedWeightedInfNorm=[],Ps((()=>{this.iteration=kl(0).variable(),this.accBeta1=kl(t).variable()})),null==a&&(this.epsilon=Oa.backend.epsilon())}applyGradients(e){const t=Array.isArray(e)?e.map((e=>e.name)):Object.keys(e);Ps((()=>{const n=Vi(1,this.accBeta1),a=Us(-this.learningRate,qs(Ks(this.iteration,this.decay),1));t.forEach(((t,r)=>{const s=Oa.registeredVariables[t],o=!1;null==this.accumulatedFirstMoment[r]&&(this.accumulatedFirstMoment[r]={originalName:`${t}/m`,variable:ui(s).variable(o)}),null==this.accumulatedWeightedInfNorm[r]&&(this.accumulatedWeightedInfNorm[r]={originalName:`${t}/v`,variable:ui(s).variable(o)});const i=Array.isArray(e)?e[r].tensor:e[t];if(null==i)return;const u=this.accumulatedFirstMoment[r].variable,l=this.accumulatedWeightedInfNorm[r].variable,c=qs(Ks(u,this.beta1),Ks(i,1-this.beta1)),p=Ks(l,this.beta2),d=Gs(i),h=ou(p,d);u.assign(c),l.assign(h);const m=qs(Ks(Us(a,n),Us(c,qs(h,this.epsilon))),s);s.assign(m)})),this.iteration.assign(qs(this.iteration,1)),this.accBeta1.assign(Ks(this.accBeta1,this.beta1))})),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.iteration.dispose(),null!=this.accumulatedFirstMoment&&Vs(this.accumulatedFirstMoment.map((e=>e.variable))),null!=this.accumulatedWeightedInfNorm&&Vs(this.accumulatedWeightedInfNorm.map((e=>e.variable)))}async getWeights(){throw new Error("getWeights() is not implemented for Adamax yet.")}async setWeights(e){throw new Error("setWeights() is not implemented for Adamax yet.")}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon,decay:this.decay}}static fromConfig(e,t){return new e(t.learningRate,t.beta1,t.beta2,t.epsilon,t.decay)}}bp.className="Adamax",$s(bp);
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class kp extends mp{constructor(e){super(),this.learningRate=e,this.setLearningRate(e)}applyGradients(e){(Array.isArray(e)?e.map((e=>e.name)):Object.keys(e)).forEach(((t,n)=>{const a=Array.isArray(e)?e[n].tensor:e[t];if(null==a)return;const r=Oa.registeredVariables[t];Ps((()=>{const e=qs(Ks(this.c,a),r);r.assign(e)}))})),this.incrementIterations()}setLearningRate(e){this.learningRate=e,null!=this.c&&this.c.dispose(),this.c=Ws(kl(-e))}dispose(){this.c.dispose()}async getWeights(){return[await this.saveIterations()]}async setWeights(e){if(0!==(e=await this.extractIterations(e)).length)throw new Error("SGD optimizer does not have settable weights.")}getConfig(){return{learningRate:this.learningRate}}static fromConfig(e,t){return new e(t.learningRate)}}kp.className="SGD",$s(kp);
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class xp extends kp{constructor(e,t,n=!1){super(e),this.learningRate=e,this.momentum=t,this.useNesterov=n,this.accumulations=[],this.m=kl(this.momentum)}applyGradients(e){(Array.isArray(e)?e.map((e=>e.name)):Object.keys(e)).forEach(((t,n)=>{const a=Oa.registeredVariables[t];if(null==this.accumulations[n]){const e=!1;this.accumulations[n]={originalName:`${t}/momentum`,variable:Ps((()=>ui(a).variable(e)))}}const r=this.accumulations[n].variable,s=Array.isArray(e)?e[n].tensor:e[t];null!=s&&Ps((()=>{let e;const t=qs(Ks(this.m,r),s);e=this.useNesterov?qs(Ks(this.c,qs(s,Ks(t,this.m))),a):qs(Ks(this.c,t),a),r.assign(t),a.assign(e)}))})),this.incrementIterations()}dispose(){this.m.dispose(),null!=this.accumulations&&Vs(this.accumulations.map((e=>e.variable)))}setMomentum(e){this.momentum=e}async getWeights(){return[await this.saveIterations()].concat(this.accumulations.map((e=>({name:e.originalName,tensor:e.variable}))))}async setWeights(e){e=await this.extractIterations(e);this.accumulations=e.map((e=>({originalName:e.name,variable:e.tensor.variable(false)})))}getConfig(){return{learningRate:this.learningRate,momentum:this.momentum,useNesterov:this.useNesterov}}static fromConfig(e,t){return new e(t.learningRate,t.momentum,t.useNesterov)}}xp.className="Momentum",$s(xp);
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class wp extends mp{constructor(e,t=.9,n=0,a=null,r=!1){if(super(),this.learningRate=e,this.decay=t,this.momentum=n,this.epsilon=a,this.accumulatedMeanSquares=[],this.accumulatedMoments=[],this.accumulatedMeanGrads=[],this.centered=r,null==a&&(this.epsilon=Oa.backend.epsilon()),null==e)throw new Error("learningRate for RMSPropOptimizer must be defined.")}applyGradients(e){(Array.isArray(e)?e.map((e=>e.name)):Object.keys(e)).forEach(((t,n)=>{const a=Oa.registeredVariables[t],r=!1;null==this.accumulatedMeanSquares[n]&&(this.accumulatedMeanSquares[n]={originalName:`${t}/rms`,variable:Ps((()=>ui(a).variable(r)))}),null==this.accumulatedMoments[n]&&(this.accumulatedMoments[n]={originalName:`${t}/momentum`,variable:Ps((()=>ui(a).variable(r)))}),null==this.accumulatedMeanGrads[n]&&this.centered&&(this.accumulatedMeanGrads[n]={originalName:`${t}/mg`,variable:Ps((()=>ui(a).variable(r)))});const s=Array.isArray(e)?e[n].tensor:e[t];if(null==s)return;const o=this.accumulatedMeanSquares[n].variable,i=this.accumulatedMoments[n].variable;Ps((()=>{const e=qs(Ks(o,this.decay),Ks(du(s),1-this.decay));if(this.centered){const t=this.accumulatedMeanGrads[n].variable,r=qs(Ks(t,this.decay),Ks(s,1-this.decay)),u=Us(Ks(s,this.learningRate),Rl(Vi(e,qs(du(r),this.epsilon)))),l=qs(Ks(i,this.momentum),u);o.assign(e),t.assign(r),i.assign(l);const c=Vi(a,l);a.assign(c)}else{const e=qs(Ks(o,this.decay),Ks(du(s),1-this.decay)),t=qs(Ks(i,this.momentum),Us(Ks(s,this.learningRate),Rl(qs(e,this.epsilon))));o.assign(e),i.assign(t);const n=Vi(a,t);a.assign(n)}}))})),this.incrementIterations()}dispose(){null!=this.accumulatedMeanSquares&&Vs(this.accumulatedMeanSquares.map((e=>e.variable))),null!=this.accumulatedMeanGrads&&this.centered&&Vs(this.accumulatedMeanGrads.map((e=>e.variable))),null!=this.accumulatedMoments&&Vs(this.accumulatedMoments.map((e=>e.variable)))}async getWeights(){const e=[...this.accumulatedMeanSquares,...this.accumulatedMoments];return this.centered&&e.push(...this.accumulatedMeanGrads),[await this.saveIterations()].concat(e.map((e=>({name:e.originalName,tensor:e.variable}))))}async setWeights(e){e=await this.extractIterations(e);const t=this.centered?e.length/3:e.length/2,n=!1;this.accumulatedMeanSquares=e.slice(0,t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)}))),this.accumulatedMoments=e.slice(t,2*t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)}))),this.centered&&(this.accumulatedMeanGrads=e.slice(2*t,3*t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)}))))}getConfig(){return{learningRate:this.learningRate,decay:this.decay,momentum:this.momentum,epsilon:this.epsilon,centered:this.centered}}static fromConfig(e,t){return new e(t.learningRate,t.decay,t.momentum,t.epsilon,t.centered)}}wp.className="RMSProp",$s(wp);
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class Np{static sgd(e){return new kp(e)}static momentum(e,t,n=!1){return new xp(e,t,n)}static rmsprop(e,t=.9,n=0,a=null,r=!1){return new wp(e,t,n,a,r)}static adam(e=.001,t=.9,n=.999,a=null){return new yp(e,t,n,a)}static adadelta(e=.001,t=.95,n=null){return new fp(e,t,n)}static adamax(e=.002,t=.9,n=.999,a=null,r=0){return new bp(e,t,n,a,r)}static adagrad(e,t=.1){return new gp(e,t)}}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const vp={sgd:Np.sgd,momentum:Np.momentum,adadelta:Np.adadelta,adagrad:Np.adagrad,rmsprop:Np.rmsprop,adamax:Np.adamax,adam:Np.adam},Tp="undefined"!=typeof requestAnimationFrame?requestAnimationFrame:"undefined"!=typeof setImmediate?setImmediate:e=>e();
/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function Ip(e,t){const n=e[0].length;e.forEach(((e,t)=>{u(e.length===n,(()=>`Error in concat${n}D: rank of tensors[${t}] must be the same as the rank of the rest (${n})`))})),u(t>=0&&t<n,(()=>`Error in concat${n}D: axis must be between 0 and ${n-1}.`));const a=e[0];e.forEach(((e,r)=>{for(let s=0;s<n;s++)u(s===t||e[s]===a[s],(()=>`Error in concat${n}D: Shape of tensors[${r}] (${e}) does not match the shape of the rest (${a}) along the non-concatenated axis ${r}.`))}))}function Sp(e,t){const n=e[0].slice();for(let a=1;a<e.length;a++)n[t]+=e[a][t];return n}
/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function Ep(e,t,n){return[n*("number"==typeof e?e:e[0]),t*("number"==typeof e?e:e[1])]}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _p(e,t,n,a=!0){let r=[];if(a)r=r.concat(t.slice(0)),r.push(e[0]/n),r=r.concat(e.slice(1));else{r=r.concat(e[0]);const n=t.length;for(let a=0;a<n;++a)r=r.concat([e[a+1]/t[a],t[a]]);r=r.concat(e.slice(n+1))}return r}function Mp(e,t,n=!0){const a=[];if(n){a.push(t);for(let n=t+1;n<e;++n)n<=2*t?(a.push(n),a.push(n-(t+1))):a.push(n)}else{const n=[],r=[];for(let a=1;a<e;++a)a>=2*t+1||a%2==1?r.push(a):n.push(a);a.push(...n),a.push(0),a.push(...r)}return a}function Ap(e,t,n,a=!0){const r=[];a?r.push(e[0]/n):r.push(e[0]*n);for(let n=1;n<e.length;++n)n<=t.length?a?r.push(t[n-1]*e[n]):r.push(e[n]/t[n-1]):r.push(e[n]);return r}function $p(e,t){const n=[0];for(let a=0;a<t;++a)n.push(e[a][0]);return n}function Dp(e,t,n){const a=e.slice(0,1);for(let r=0;r<n;++r)a.push(e[r+1]-t[r][0]-t[r][1]);return a}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Fp=1.7580993408473768,Op=1.0507009873554805,Cp=.3275911,Rp=.254829592,zp=-.284496736,Bp=1.421413741,Lp=-1.453152027,Pp=1.061405429;
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function Vp(...e){j().getBool("IS_TEST")||console.warn(...e)}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function Wp(e,t){if(e.length!==t.length)throw new Error(`Cannot merge real and imag arrays of different lengths. real:${e.length}, imag: ${t.length}.`);const n=new Float32Array(2*e.length);for(let a=0;a<n.length;a+=2)n[a]=e[a/2],n[a+1]=t[a/2];return n}function Hp(e){const t=new Float32Array(e.length/2),n=new Float32Array(e.length/2);for(let a=0;a<e.length;a+=2)t[a/2]=e[a],n[a/2]=e[a+1];return{real:t,imag:n}}function qp(e){const t=Math.ceil(e.length/4),n=new Float32Array(t),a=new Float32Array(t);for(let t=0;t<e.length;t+=4)n[Math.floor(t/4)]=e[t],a[Math.floor(t/4)]=e[t+1];return{real:n,imag:a}}function jp(e){const t=Math.floor(e.length/4),n=new Float32Array(t),a=new Float32Array(t);for(let t=2;t<e.length;t+=4)n[Math.floor(t/4)]=e[t],a[Math.floor(t/4)]=e[t+1];return{real:n,imag:a}}function Up(e,t){return{real:e[2*t],imag:e[2*t+1]}}function Kp(e,t,n,a){e[2*a]=t,e[2*a+1]=n}function Gp(e,t){const n=new Float32Array(e/2),a=new Float32Array(e/2);for(let r=0;r<Math.ceil(e/2);r++){const s=(t?2:-2)*Math.PI*(r/e);n[r]=Math.cos(s),a[r]=Math.sin(s)}return{real:n,imag:a}}function Yp(e,t,n){const a=(n?2:-2)*Math.PI*(e/t);return{real:Math.cos(a),imag:Math.sin(a)}}function Qp(e,t,n=0){let a=[];if("number"==typeof t)u(e.shape[n]%t==0,(()=>"Number of splits must evenly divide the axis.")),a=new Array(t).fill(e.shape[n]/t);else{u(t.reduce(((e,t)=>(-1===t&&(e+=1),e)),0)<=1,(()=>"There should be only one negative value in split array."));const r=t.indexOf(-1);if(-1!==r){const a=t.reduce(((e,t)=>t>0?e+t:e));t[r]=e.shape[n]-a}u(e.shape[n]===t.reduce(((e,t)=>e+t)),(()=>"The sum of sizes must match the size of the axis dimension.")),a=t}return a}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xp(e,t,n,a){const r=t.shape.length,s=e.shape.length;if(0!==a&&(a<-r||a>r))throw new Error(`Expect batchDims in the range of [-${r}, ${r}], but got ${a}`);if(a<0&&(a+=r),a>s)throw new Error(`batchDims (${a}) must be less than rank(x) (\n    ${s}).`);if(n<a)throw new Error(`batchDims (${a}) must be less than or equal to axis (${n}).`);for(let n=0;n<a;++n)if(e.shape[n]!==t.shape[n])throw new Error(`x.shape[${n}]: ${e.shape[n]} should be equal to indices.shape[${n}]: ${t.shape[n]}.`);const o=e.shape[n],i=[];let u=1,l=1,c=1;for(let t=0;t<a;++t)i.push(e.shape[t]),u*=e.shape[t];for(let t=a;t<n;t++)i.push(e.shape[t]),l*=e.shape[t];for(let e=a;e<r;e++)i.push(t.shape[e]);for(let t=n+1;t<s;t++)i.push(e.shape[t]),c*=e.shape[t];return{batchSize:u,sliceSize:c,outerSize:l,dimSize:o,outputShape:i}}var Jp=Object.freeze({__proto__:null,collectGatherOpShapeInfo:Xp,computeOutShape:function(e,t,n){const a=[],r=e.length;for(let s=0;s<r;s++)s!==t?a.push(e[s]):a.push(n);return a},segOpComputeOptimalWindowSize:function(e,t){let n,a=!1;for(e<=30?(n=e,a=!0):n=D(e,Math.floor(Math.sqrt(e)));!a;)n>t||n===e?a=!0:n=D(e,n+1);return n}});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zp(e){try{return e.map((e=>ea(e)))}catch(e){throw new Error(`Failed to decode encoded string bytes into utf-8, error: ${e}`)}}function ed(e){return e.map((e=>Zn(e)))}var td=Object.freeze({__proto__:null,ERF_A1:Rp,ERF_A2:zp,ERF_A3:Bp,ERF_A4:Lp,ERF_A5:Pp,ERF_P:Cp,PARALLELIZE_THRESHOLD:30,SELU_SCALE:Op,SELU_SCALEALPHA:Fp,applyActivation:gc,assertAndGetBroadcastShape:si,assertAxesAreInnerMostDims:Gi,assertParamsConsistent:Ip,assignToTypedArray:Kp,axesAreInnerMostDims:qi,calculateShapes:cs,combineLocations:ji,complexWithEvenIndex:qp,complexWithOddIndex:jp,computeConv2DInfo:co,computeConv3DInfo:po,computeDefaultPad:ho,computeDilation2DInfo:io,computeOptimalWindowSize:function(e){return e<=30?e:D(e,Math.floor(Math.sqrt(e)))},computeOutAndReduceShapes:Ui,computeOutShape:Sp,computePool2DInfo:uo,computePool3DInfo:lo,convertConv2DDataFormat:xo,eitherStridesOrDilationsAreOne:ko,expandShapeToKeepDim:Ki,exponent:Yp,exponents:Gp,fromStringArrayToUint8:ed,fromUint8ToStringArray:Zp,getAxesPermutation:Yi,getBroadcastDims:ai,getComplexWithIndex:Up,getFusedBiasGradient:fc,getFusedDyActivation:mc,getImageCenter:Ep,getInnerMostAxes:Xi,getPermuted:Mp,getReductionAxes:ri,getReshaped:_p,getReshapedPermuted:Ap,getSliceBeginCoords:$p,getSliceSize:Dp,getUndoAxesPermutation:Qi,log:function(...e){j().getBool("IS_TEST")||console.log(...e)},mergeRealAndImagArrays:Wp,prepareAndValidate:os,prepareSplitSize:Qp,segment_util:Jp,shouldFuse:yc,slice_util:_s,splitRealAndImagArrays:Hp,tupleValuesAreOne:bo,upcastType:Ta,validateInput:ls,validateUpdateShape:us,warn:Vp}),nd=Object.freeze({__proto__:null,nonMaxSuppressionV3Impl:Cc,nonMaxSuppressionV4Impl:Rc,nonMaxSuppressionV5Impl:zc,whereImpl:ec}),ad=Object.freeze({__proto__:null,Abs:Q,Acos:X,Acosh:J,AdadeltaOptimizer:fp,AdagradOptimizer:gp,AdamOptimizer:yp,AdamaxOptimizer:bp,Add:Z,AddN:ee,All:te,Any:ne,ArgMax:ae,ArgMin:re,Asin:se,Asinh:oe,Atan:ie,Atan2:le,Atanh:ue,AvgPool:ce,AvgPool3D:de,AvgPool3DGrad:he,AvgPoolGrad:pe,BatchMatMul:me,BatchToSpaceND:fe,Bincount:ge,BroadcastTo:"BroadcastTo",Cast:ye,Ceil:be,ClipByValue:ke,Complex:xe,ComplexAbs:we,Concat:Ne,Conv2D:ve,Conv2DBackpropFilter:Te,Conv2DBackpropInput:Ie,Conv3D:Se,Conv3DBackpropFilterV2:Ee,Conv3DBackpropInputV2:_e,Cos:Me,Cosh:Ae,CropAndResize:De,Cumsum:$e,DataStorage:a,DenseBincount:Fe,DepthToSpace:Oe,DepthwiseConv2dNative:Ce,DepthwiseConv2dNativeBackpropFilter:Re,DepthwiseConv2dNativeBackpropInput:ze,Diag:Be,Dilation2D:Le,Dilation2DBackpropFilter:Ve,Dilation2DBackpropInput:Pe,get ENV(){return K},Elu:He,EluGrad:qe,Environment:q,Equal:Ue,Erf:je,Exp:Ke,ExpandDims:Ge,Expm1:Ye,FFT:Qe,Fill:Xe,FlipLeftRight:Je,Floor:Ze,FloorDiv:et,FromPixels:Bn,FusedBatchNorm:tt,FusedConv2D:Vn,FusedDepthwiseConv2D:Wn,GatherNd:at,GatherV2:nt,Greater:rt,GreaterEqual:st,IFFT:it,Identity:ot,Imag:ut,IsFinite:lt,IsInf:ct,IsNan:pt,KernelBackend:r,LRN:wt,LRNGrad:Nt,LeakyRelu:dt,Less:ht,LessEqual:mt,LinSpace:ft,Log:gt,Log1p:yt,LogSoftmax:"LogSoftmax",LogicalAnd:bt,LogicalNot:kt,LogicalOr:xt,Max:vt,MaxPool:It,MaxPool3D:Et,MaxPool3DGrad:_t,MaxPoolGrad:St,MaxPoolWithArgmax:Mt,Maximum:Tt,Mean:At,Min:$t,Minimum:Dt,MirrorPad:Ft,Mod:Ot,MomentumOptimizer:xp,Multinomial:Ct,Multiply:Rt,Neg:zt,NonMaxSuppressionV3:Lt,NonMaxSuppressionV4:Pt,NonMaxSuppressionV5:Vt,NotEqual:Bt,OP_SCOPE_SUFFIX:qa,OneHot:Ht,OnesLike:Wt,Optimizer:mp,Pack:qt,PadV2:jt,Pool:"Pool",Pow:Ut,Prelu:Kt,Prod:Gt,RMSPropOptimizer:wp,Range:Yt,get Rank(){return ba},Real:Qt,RealDiv:We,Reciprocal:Xt,get Reduction(){return Zc},Relu:Jt,Relu6:rn,Reshape:Zt,ResizeBilinear:nn,ResizeBilinearGrad:an,ResizeNearestNeighbor:en,ResizeNearestNeighborGrad:tn,Reverse:sn,RotateWithOffset:Ln,Round:on,Rsqrt:un,SGDOptimizer:kp,ScatterNd:ln,Select:cn,Selu:pn,Sigmoid:gn,Sign:fn,Sin:hn,Sinh:mn,Slice:dn,Softmax:Nn,Softplus:yn,SpaceToBatchND:xn,SparseToDense:Sn,SplitV:wn,Sqrt:bn,Square:Tn,SquaredDifference:vn,Step:zn,StridedSlice:En,Sub:In,Sum:kn,Tan:_n,Tanh:Mn,Tensor:ga,TensorBuffer:ha,Tile:An,TopK:$n,Transpose:Dn,Unique:Fn,Unpack:On,UnsortedSegmentSum:Cn,Variable:ya,ZerosLike:Rn,_FusedMatMul:Pn,abs:Gs,acos:Ys,acosh:Qs,add:qs,addN:Xs,all:Js,any:Zs,argMax:eo,argMin:to,asin:no,asinh:ao,atan:ro,atan2:so,atanh:oo,avgPool:No,avgPool3d:vo,backend:function(){return Oa.backend},backend_util:td,basicLSTMCell:_o,batchNorm:Ao,batchNorm2d:$o,batchNorm3d:Do,batchNorm4d:Fo,batchToSpaceND:Mo,bincount:Oo,booleanMaskAsync:nc,broadcastTo:Co,browser:ss,buffer:Or,cast:Cr,ceil:Ro,clipByValue:zo,clone:Rr,complex:Ua,concat:To,concat1d:Bo,concat2d:Lo,concat3d:Po,concat4d:Vo,conv1d:Ho,conv2d:Wo,conv2dTranspose:jo,conv3d:Uo,conv3dTranspose:Go,copyRegisteredKernels:function(e,t){Kn(e).forEach((e=>{Gn(Object.assign({},e,{backendName:t}))}))},cos:Yo,cosh:Qo,cosineWindow:pc,cumsum:Xo,customGrad:Ci,denseBincount:Jo,deprecationWarn:function(e){j().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(e+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")},depthToSpace:Zo,depthwiseConv2d:ei,device_util:za,diag:ti,dilation2d:ni,disableDeprecationWarnings:function(){j().set("DEPRECATION_WARNINGS_ENABLED",!1),console.warn("TensorFlow.js deprecation warnings have been disabled.")},dispose:Vs,disposeVariables:function(){Oa.disposeVariables()},div:Us,divNoNan:li,dot:ci,dropout:lc,elu:pi,enableDebugMode:function(){j().set("DEBUG",!0)},enableProdMode:
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(){j().set("PROD",!0)},enclosingPowerOfTwo:cc,engine:Ls,env:j,equal:oi,erf:di,exp:hi,expandDims:mi,expm1:fi,eye:yi,fft:$l,fill:bi,findBackend:function(e){return Oa.findBackend(e)},findBackendFactory:function(e){return Oa.findBackendFactory(e)},floor:ki,floorDiv:js,fused:vc,gather:xi,gatherND:uc,gather_util:is,getBackend:function(){return Oa.backendName},getGradient:Un,getKernel:jn,getKernelsForBackend:Kn,grad:function(e){return u($(e),(()=>"The f passed in grad(f) must be a function")),(t,n)=>{const a=Wa(t,"x","tf.grad","string_or_numeric"),r=null!=n?Wa(n,"dy","tf.grad"):null;return Oa.tidy((()=>{const{value:t,grads:n}=Oa.gradients((()=>e(a)),[a],r);return null!=r&&l(t.shape,r.shape,"The shape of dy passed in grad(f)(x, dy) must match the shape returned by f(x)"),Ri(n),n[0]}))}},grads:function(e){return u($(e),(()=>"The f passed in grads(f) must be a function")),(t,n)=>{u(Array.isArray(t),(()=>"The args passed in grads(f)(args) must be an array of `Tensor`s or `TensorLike`s"));const a=Ha(t,"args","tf.grads","string_or_numeric"),r=null!=n?Wa(n,"dy","tf.grads"):null;return Oa.tidy((()=>{const{value:t,grads:n}=Oa.gradients((()=>e(...a)),a,r);return null!=r&&l(t.shape,r.shape,"The shape of dy passed in grads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),Ri(n),n}))}},greater:wi,greaterEqual:Ni,ifft:Dl,imag:vi,image:pp,inTopKAsync:dc,io:Qr,irfft:Fl,isFinite:Ti,isInf:Ii,isNaN:Si,keep:Ws,kernel_impls:nd,leakyRelu:Ei,less:_i,lessEqual:Mi,linalg:dp,linspace:Ai,localResponseNormalization:$i,log:Di,log1p:Fi,logSigmoid:Li,logSoftmax:Hi,logSumExp:Ji,logicalAnd:Zi,logicalNot:eu,logicalOr:tu,logicalXor:nu,losses:hp,matMul:Xr,math:ts,max:Pi,maxPool:au,maxPool3d:ru,maxPoolWithArgmax:su,maximum:ou,mean:iu,memory:function(){return Oa.memory()},min:uu,minimum:lu,mirrorPad:cu,mod:pu,moments:hu,movingAverage:sc,mul:Ks,multiRNNCell:mu,multinomial:fu,neg:zi,nextFrame:function(){return new Promise((e=>Tp((()=>e()))))},norm:rc,notEqual:gu,oneHot:Jr,ones:bu,onesLike:ku,op:ja,outerProduct:xu,pad:wu,pad1d:Nu,pad2d:vu,pad3d:Tu,pad4d:Iu,pool:Eu,pow:_u,prelu:Mu,print:zr,prod:Au,profile:function(e){return Oa.profile(e)},rand:$u,randomGamma:rl,randomNormal:sl,randomUniform:ol,range:il,ready:function(){return Oa.ready()},real:ul,reciprocal:ll,registerBackend:Hs,registerGradient:function(e){const{kernelName:t}=e;qn.has(t)&&j().getBool("DEBUG")&&console.warn(`Overriding the gradient for '${t}'`),qn.set(t,e)},registerKernel:Gn,relu:cl,relu6:pl,removeBackend:function(e){Oa.removeBackend(e)},reshape:wo,reverse:dl,reverse1d:hl,reverse2d:ml,reverse3d:fl,reverse4d:gl,rfft:Cl,round:yl,rsqrt:bl,scalar:kl,scatterND:oc,scatter_util:ps,selu:xl,separableConv2d:wl,serialization:Ds,setBackend:function(e){return Oa.setBackend(e)},setPlatform:function(e,t){j().setPlatform(e,t)},setdiff1dAsync:Nl,sigmoid:Io,sign:vl,signal:cp,sin:Tl,sinh:Il,slice:So,slice1d:Sl,slice2d:El,slice3d:_l,slice4d:Ml,slice_util:_s,softmax:Al,softplus:Bi,spaceToBatchND:Su,sparseToDense:ic,spectral:lp,split:Ol,sqrt:Rl,square:du,squaredDifference:zl,squeeze:Bl,stack:Ll,step:Pl,stridedSlice:Vl,sub:Vi,sum:Wi,sumOutType:function(e){return Ta(e,"int32")},tan:Wl,tanh:Eo,tensor:Ga,tensor1d:Hl,tensor2d:ql,tensor3d:ns,tensor4d:jl,tensor5d:Ul,tensor6d:Kl,tensor_util:Ma,test_util:Bs,tidy:Ps,tile:gi,time:function(e){return Oa.time(e)},topk:Gl,train:vp,transpose:Zr,truncatedNormal:Yl,unique:Ql,unregisterGradient:function(e){if(!qn.has(e))throw new Error(`The gradient '${e}' for backend is not registered`);qn.delete(e)},unregisterKernel:function(e,t){const n=Yn(e,t);if(!Hn.has(n))throw new Error(`The kernel '${e}' for backend '${t}' is not registered`);Hn.delete(n)},unsortedSegmentSum:Xl,unstack:Jl,upcastType:Ta,util:ta,valueAndGrad:function(e){return u($(e),(()=>"The f passed in valueAndGrad(f) must be a function")),(t,n)=>{u(t instanceof ga,(()=>"The x passed in valueAndGrad(f)(x) must be a tensor")),u(null==n||n instanceof ga,(()=>"The dy passed in valueAndGrad(f)(x, dy) must be a tensor"));const{grads:a,value:r}=Oa.gradients((()=>e(t)),[t],n);return Ri(a),{grad:a[0],value:r}}},valueAndGrads:function(e){return u($(e),(()=>"The f passed in valueAndGrads(f) must be a function")),(t,n)=>{u(Array.isArray(t)&&t.every((e=>e instanceof ga)),(()=>"The args passed in valueAndGrads(f)(args) must be array of tensors")),u(null==n||n instanceof ga,(()=>"The dy passed in valueAndGrads(f)(args, dy) must be a tensor"));const a=Oa.gradients((()=>e(...t)),t,n);return null!=n&&l(a.value.shape,n.shape,"The shape of dy passed in valueAndGrads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),Ri(a.grads),a}},variable:Zl,variableGrads:Oi,version_core:"3.0.0-rc.1",where:ii,whereAsync:tc,zeros:yu,zerosLike:ui});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function rd(e,t){Array.isArray(e)||(e=[e]),e.forEach((e=>{null!=e&&u("complex64"!==e.dtype,(()=>`${t} does not support complex64 tensors in the CPU backend.`))}))}
/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const sd=ec;class od extends r{constructor(){super(),this.blockSize=48,this.firstUse=!0,this.data=new a(this,Ls())}write(e,t,n){this.firstUse&&(this.firstUse=!1,j().get("IS_NODE")&&Vp("\n============================\nHi there 👋. Looks like you are running TensorFlow.js in Node.js. To speed things up dramatically, install our node backend, which binds to TensorFlow C++, by running npm i @tensorflow/tfjs-node, or npm i @tensorflow/tfjs-node-gpu if you have CUDA. Then call require('@tensorflow/tfjs-node'); (-gpu suffix for CUDA) at the start of your program. Visit https://github.com/tensorflow/tfjs-node for more details.\n============================"));const a={};return this.data.set(a,{values:e,dtype:n,refCount:1}),a}makeTensorInfo(e,t,n){let a;if("string"===t&&null!=n&&n.length>0&&E(n[0])){const r=n.map((e=>Zn(e)));a=this.write(r,e,t)}else a=this.write(n,e,t);return{dataId:a,shape:e,dtype:t}}incRef(e){this.data.get(e).refCount++}decRef(e){if(this.data.has(e)){this.data.get(e).refCount--}}move(e,t,n,a){this.data.set(e,{values:t,dtype:a,refCount:1})}numDataIds(){return this.data.numDataIds()}async read(e){return this.readSync(e)}readSync(e){const{dtype:t,complexTensorInfos:n}=this.data.get(e);if("complex64"===t){return Wp(this.readSync(n.real.dataId),this.readSync(n.imag.dataId))}return this.data.get(e).values}bufferSync(e){const t=this.readSync(e.dataId);let n=t;if("string"===e.dtype)try{n=t.map((e=>ea(e)))}catch(e){throw new Error("Failed to decode encoded string bytes into utf-8")}return Or(e.shape,e.dtype,n)}makeOutput(e,t,n){const a=this.write(e,t,n);return Ls().makeTensorFromDataId(a,t,n,this)}disposeData(e){if(this.data.has(e)){const{complexTensorInfos:t}=this.data.get(e);null!=t&&(this.disposeData(t.real.dataId),this.disposeData(t.imag.dataId)),this.data.delete(e)}}disposeIntermediateTensorInfo(e){const t=e.dataId;if(this.data.has(t)){const e=this.data.get(t);e.refCount--,e.refCount<1&&this.disposeData(t)}}async time(e){const t=Jn();e();return{kernelMs:Jn()-t}}memory(){return{unreliable:!0,reasons:["The reported memory is an upper bound. Due to automatic garbage collection, the true allocated memory may be less."]}}where(e){rd([e],"where");const t=this.readSync(e.dataId);return sd(e.shape,t)}dispose(){}floatPrecision(){return 32}epsilon(){return super.epsilon()}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const id={kernelName:Q,backendName:"cpu",kernelFunc:e=>{const{x:t}=e.inputs,n=e.backend;rd(t,"abs");let a=new Float32Array(d(t.shape));return a=function(e){const t=new Float32Array(e.length);for(let n=0;n<e.length;++n)t[n]=Math.abs(e[n]);return t}(n.data.get(t.dataId).values),n.makeOutput(a,t.shape,"float32")}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function ud(e){return(t,n,a,r,s)=>{const o=si(t,n),i=o.length,u=F(o),l=k(s,d(o)),c=t.length,p=n.length,h=F(t),m=F(n),f=ai(t,o),g=ai(n,o);if(f.length+g.length===0)for(let t=0;t<l.length;++t)l[t]=e(a[t%a.length],r[t%r.length]);else for(let t=0;t<l.length;++t){const n=V(t,i,u),s=n.slice(-c);f.forEach((e=>s[e]=0));const o=P(s,c,h),d=n.slice(-p);g.forEach((e=>d[e]=0));const y=P(d,p,m);l[t]=e(a[o],r[y])}return[l,o]}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ld(e){const{inputs:t,backend:n}=e,{real:a,imag:r}=t,s=n.data.get(a.dataId).values,o=n.data.get(r.dataId).values,i=n.makeTensorInfo(a.shape,"complex64");return n.data.get(i.dataId).complexTensorInfos={real:n.makeTensorInfo(a.shape,"float32",s),imag:n.makeTensorInfo(r.shape,"float32",o)},i}const cd={kernelName:xe,backendName:"cpu",kernelFunc:ld};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pd(e,t,n="float32"){if("complex64"===n){return ld({inputs:{real:pd(e,t,"float32"),imag:pd(e,t,"float32")},backend:e})}const a=z(d(t),n);return e.makeTensorInfo(t,n,a)}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function dd(e){const{inputs:t,backend:n}=e,{x:a}=t;return n.incRef(a.dataId),{dataId:a.dataId,shape:a.shape,dtype:a.dtype}}const hd={kernelName:ot,backendName:"cpu",kernelFunc:dd};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function md(e){const{inputs:t,backend:n}=e,{input:a}=t,r=n.data.get(a.dataId).complexTensorInfos.real,s=n.data.get(r.dataId).values;return n.makeTensorInfo(r.shape,r.dtype,s)}const fd={kernelName:Qt,backendName:"cpu",kernelFunc:md};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gd(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{dtype:s}=a;if("complex64"===s){if("complex64"===r.dtype)return dd({inputs:{x:r},backend:n});const e=pd(n,r.shape,r.dtype),t=gd({inputs:{x:r},backend:n,attrs:{dtype:"float32"}}),a=ld({inputs:{real:t,imag:e},backend:n});return n.disposeIntermediateTensorInfo(e),n.disposeIntermediateTensorInfo(t),a}if("complex64"===r.dtype){const e=md({inputs:{input:r},backend:n}),t=gd({inputs:{x:e},backend:n,attrs:{dtype:s}});return n.disposeIntermediateTensorInfo(e),t}if(!v(r.dtype,s)){const e=dd({inputs:{x:r},backend:n});return{dataId:e.dataId,shape:e.shape,dtype:s}}if("int32"===s){const e=n.data.get(r.dataId).values,t=Int32Array.from(e);return n.makeTensorInfo(r.shape,"int32",t)}if("bool"===s){const e=n.data.get(r.dataId).values,t=Xn([0],r.dtype),[a,s]=ud(((e,t)=>e!==t?1:0))(r.shape,[],e,t,"bool");return n.makeTensorInfo(s,"bool",a)}throw new Error(`Error in Cast: failed to cast ${r.dtype} to ${s}`)}const yd={kernelName:ye,backendName:"cpu",kernelFunc:gd};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bd(e,t,n,a){return null==n?({inputs:n,backend:r})=>{const{a:s,b:o}=n,i=r;rd([s,o],e);const u=i.data.get(s.dataId).values,l=i.data.get(o.dataId).values,c=a||s.dtype,[p,d]=t(s.shape,o.shape,u,l,c);return i.makeTensorInfo(d,c,p)}:({inputs:e,backend:r})=>{const{a:s,b:o}=e,i=r;if("complex64"===s.dtype||"complex64"===o.dtype){const e=gd({inputs:{x:s},backend:i,attrs:{dtype:"complex64"}}),t=i.data.get(e.dataId),a=t.complexTensorInfos.real,r=t.complexTensorInfos.imag,u=i.data.get(a.dataId).values,l=i.data.get(r.dataId).values,c=gd({inputs:{x:o},backend:i,attrs:{dtype:"complex64"}}),p=i.data.get(c.dataId),d=p.complexTensorInfos.real,h=p.complexTensorInfos.imag,m=i.data.get(d.dataId).values,f=i.data.get(h.dataId).values,[g,y,b]=n(s.shape,o.shape,u,l,m,f),k=i.makeTensorInfo(b,"float32",g),x=i.makeTensorInfo(b,"float32",y),w=ld({inputs:{real:k,imag:x},backend:i});return i.disposeIntermediateTensorInfo(e),i.disposeIntermediateTensorInfo(c),i.disposeIntermediateTensorInfo(k),i.disposeIntermediateTensorInfo(x),w}{const e=i.data.get(s.dataId).values,n=i.data.get(o.dataId).values,r=a||s.dtype,[u,l]=t(s.shape,o.shape,e,n,r);return i.makeTensorInfo(l,r,u)}}}function kd(e){return(t,n,a,r,s,o)=>{const i=si(t,n),u=d(i),l=i.length,c=F(i),p=k("float32",u),h=k("float32",u),m=ai(t,i),f=ai(n,i),g=Wp(a,r),y=Wp(s,o),b=t.length,x=F(t),w=n.length,N=F(n);if(m.length+f.length===0)for(let t=0;t<p.length;t++){const n=t%g.length,a=t%y.length,r=e(g[2*n],g[2*n+1],y[2*a],y[2*a+1]);p[t]=r.real,h[t]=r.imag}else for(let t=0;t<p.length;t++){const n=V(t,l,c),a=n.slice(-b);m.forEach((e=>a[e]=0));const r=P(a,b,x),s=n.slice(-w);f.forEach((e=>s[e]=0));const o=P(s,w,N),i=e(g[2*r],g[2*r+1],y[2*o],y[2*o+1]);p[t]=i.real,h[t]=i.imag}return[p,h,i]}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const xd=ud(((e,t)=>e+t)),wd=kd(((e,t,n,a)=>({real:e+n,imag:t+a}))),Nd=bd(Z,xd,wd),vd={kernelName:Z,backendName:"cpu",kernelFunc:Nd};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function Td(e,t,n,a,r){const s=d(a),o=z(r,n);for(let n=0;n<e.length;n++){const a=e[n];if(a<0)throw new Error("Input x must be non-negative!");a>=r||(o[a]+=s>0?t[n]:1)}return o}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function Id(e){return(t,n,a)=>{const r=k(n,t.length);for(let n=0;n<t.length;++n)r[n]=e(t[n],a);return r}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sd(e,t,n){return({inputs:a,attrs:r,backend:s})=>{const{x:o}=a;if(rd(o,e),"string"===o.dtype||"string"===n)throw new Error("unaryKernelFunc does not support string input/output");const i=s,u=i.data.get(o.dataId).values,l=d(o.shape),c=n||o.dtype,p=x(c,l);for(let e=0;e<l;++e)p[e]=t(u[e],r);return i.makeTensorInfo(o.shape,c,p)}}function Ed(e,t,n){return({inputs:a,attrs:r,backend:s})=>{const{x:o}=a;if(rd(o,e),"string"===o.dtype||"string"===n)throw new Error("unaryKernelFunc does not support string input/output");const i=s,u=i.data.get(o.dataId).values,l=o.dtype,c=t(u,l,r);return i.makeTensorInfo(o.shape,l,c)}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const _d=Id((e=>Math.ceil(e))),Md=Ed(be,_d),Ad={kernelName:be,backendName:"cpu",kernelFunc:Md};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const $d=Id((e=>Math.exp(e))),Dd=Ed(Ke,$d),Fd={kernelName:Ke,backendName:"cpu",kernelFunc:Dd},Od=Id((e=>Math.expm1(e))),Cd=Ed(Ye,Od),Rd={kernelName:Ye,backendName:"cpu",kernelFunc:Cd},zd=Id((e=>Math.floor(e))),Bd=Ed(Ze,zd),Ld={kernelName:Ze,backendName:"cpu",kernelFunc:Bd};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const Pd=ud(((e,t)=>e>t?1:0)),Vd=bd(rt,Pd,null,"bool"),Wd={kernelName:rt,backendName:"cpu",kernelFunc:Vd},Hd=ud(((e,t)=>e<t?1:0)),qd=bd(ht,Hd,null,"bool"),jd={kernelName:ht,backendName:"cpu",kernelFunc:qd};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const Ud=Id((e=>Math.log(e))),Kd=Ed(gt,Ud),Gd={kernelName:gt,backendName:"cpu",kernelFunc:Kd};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const Yd=ud(((e,t)=>Math.max(e,t))),Qd=bd(Tt,Yd),Xd={kernelName:Tt,backendName:"cpu",kernelFunc:Qd},Jd=ud(((e,t)=>Math.min(e,t))),Zd=bd(Dt,Jd),eh={kernelName:Dt,backendName:"cpu",kernelFunc:Zd},th=ud(((e,t)=>e*t)),nh=kd(((e,t,n,a)=>({real:e*n-t*a,imag:e*a+t*n}))),ah=bd(Rt,th,nh),rh={kernelName:Rt,backendName:"cpu",kernelFunc:ah};const sh={kernelName:zt,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n}=e,{x:a}=t;rd(a,"neg");const r=n.data.get(a.dataId).values,[s,o]=
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e,t,n){const a=Qn(-1,n);return th([],t,a,e,n)}(r,a.shape,a.dtype);return n.makeTensorInfo(o,a.dtype,s)}},oh=ud(((e,t)=>e!==t?1:0)),ih=bd(Bt,oh,null,"bool"),uh={kernelName:Bt,backendName:"cpu",kernelFunc:ih};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function lh(e,t,n,a,r){const s=t.length,o=d(t),i=F(t),u=F(r),l=k(n,d(r));for(let t=0;t<o;++t){const n=V(t,s,i),r=new Array(n.length);for(let e=0;e<r.length;e++)r[e]=n[a[e]];l[P(r,s,u)]=e[t]}return l}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ch(e){const{inputs:t,attrs:n,backend:a}=e,{x:r}=t,{perm:s}=n;rd(r,"transpose");const o=r.shape.length,i=new Array(o);for(let e=0;e<i.length;e++)i[e]=r.shape[s[e]];const u=lh(a.data.get(r.dataId).values,r.shape,r.dtype,s,i);return{dataId:a.write(u,i,r.dtype),shape:i,dtype:r.dtype}}const ph={kernelName:Dn,backendName:"cpu",kernelFunc:ch};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const dh={kernelName:Gt,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{axis:s,keepDims:o}=a;rd(r,"prod");const i=r.shape.length,u=y(s,r.shape),l=Yi(u,i);let c=u,p=r;const h=[];null!=l&&(p=ch({inputs:{x:r},backend:n,attrs:{perm:l}}),h.push(p),c=Xi(c.length,i));const m=n.data.get(p.dataId).values,{outVals:f,outShape:g,outDtype:b}=function(e,t,n,a){const[r,s]=Ui(e,a),o=Ta(t,"int32"),i=z(d(r),o),u=d(s);for(let e=0;e<i.length;++e){const t=e*u;let a=1;for(let e=0;e<u;++e)a*=n[t+e];i[e]=a}return{outVals:i,outShape:r,outDtype:o}}(p.shape,p.dtype,m,c);let k=g;return o&&(k=Ki(g,u)),h.forEach((e=>n.disposeIntermediateTensorInfo(e))),n.makeTensorInfo(k,b,f)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const hh=Id((e=>1/Math.sqrt(e))),mh=Ed(un,hh),fh={kernelName:un,backendName:"cpu",kernelFunc:mh};function gh(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{begin:s,size:o}=a;rd(r,"slice");const[i,u]=Ss(r,s,o);ds(r,i,u);const l=
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e,t,n,a,r){const s=Ts(a,t,n),o=d(n),i=F(a);if(s){const n=Is(t,i);return"string"===r?e.slice(n,n+o):e.subarray(n,n+o)}const u=Or(a,r,"string"===r?Zp(e):e),l=Or(n,r);for(let e=0;e<l.size;++e){const n=l.indexToLoc(e),a=n.map(((e,n)=>e+t[n]));l.set(u.get(...a),...n)}return"string"===r?ed(l.values):l.values}(n.data.get(r.dataId).values,i,u,r.shape,r.dtype);return n.makeTensorInfo(u,r.dtype,l)}const yh={kernelName:dn,backendName:"cpu",kernelFunc:gh},bh=ud(((e,t)=>{const n=e-t;return n*n})),kh=bd(vn,bh),xh={kernelName:vn,backendName:"cpu",kernelFunc:kh};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const wh=ud(((e,t)=>e-t)),Nh=kd(((e,t,n,a)=>({real:e-n,imag:t-a}))),vh=bd(In,wh,Nh),Th={kernelName:In,backendName:"cpu",kernelFunc:vh};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
Hs("cpu",(()=>new od),1);
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const Ih=Sd(He,(e=>e>=0?e:Math.exp(e)-1)),Sh={kernelName:He,backendName:"cpu",kernelFunc:Ih};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function Eh(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{alpha:s}=a;rd([r],"leakyRelu");const o=d(r.shape),i=n.data.get(r.dataId).values,u=k("float32",o);for(let e=0;e<i.length;e++)u[e]=i[e]<0?s*i[e]:i[e];return n.makeTensorInfo(r.shape,"float32",u)}const _h={kernelName:dt,backendName:"cpu",kernelFunc:Eh},Mh=ud(((e,t)=>e<0?t*e:e));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ah(e){const{inputs:t,backend:n}=e,{x:a,alpha:r}=t;rd([a,r],"prelu");const s=n.data.get(a.dataId).values,o=n.data.get(r.dataId).values,[i,u]=Mh(a.shape,r.shape,s,o,a.dtype);return n.makeTensorInfo(u,a.dtype,i)}const $h={kernelName:Kt,backendName:"cpu",kernelFunc:Ah},Dh=Sd(Jt,(e=>Math.max(0,e))),Fh={kernelName:Jt,backendName:"cpu",kernelFunc:Dh},Oh=Sd(rn,(e=>Math.min(Math.max(0,e),6))),Ch={kernelName:rn,backendName:"cpu",kernelFunc:Oh};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function Rh(e,t,n,a,r){if("linear"===n)return dd({inputs:{x:t},backend:e});if("relu"===n)return Dh({inputs:{x:t},backend:e});if("elu"===n)return Ih({inputs:{x:t},backend:e});if("relu6"===n)return Oh({inputs:{x:t},backend:e});if("prelu"===n)return Ah({inputs:{x:t,alpha:a},backend:e});if("leakyrelu"===n)return Eh({inputs:{x:t},backend:e,attrs:{alpha:r}});throw new Error(`Activation ${n} has not been implemented for the CPU backend.`)}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zh(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{shape:s}=a,o=d(r.shape),i=g(s,o),l=d(i);u(o===l,(()=>`The new shape (${i}) has ${l} elements and the old shape (${r.shape}) has ${o} elements. The new shape and old shape must have the same number of elements.`)),n.incRef(r.dataId);const c=n.data.get(r.dataId);if(null!=c.complexTensorInfos){const e=c.complexTensorInfos.real,t=c.complexTensorInfos.imag;e.shape=i,t.shape=i}return{dataId:r.dataId,shape:i,dtype:r.dtype}}const Bh={kernelName:Zt,backendName:"cpu",kernelFunc:zh};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lh(e){const{inputs:t,backend:n,attrs:a}=e,{a:r,b:s}=t,{transposeA:o,transposeB:i}=a;rd([r,s],"matMul");const l=r.shape.length,c=s.shape.length,p=o?r.shape[l-2]:r.shape[l-1],h=i?s.shape[c-1]:s.shape[c-2],m=o?r.shape[l-1]:r.shape[l-2],f=i?s.shape[c-2]:s.shape[c-1],g=r.shape.slice(0,-2),y=s.shape.slice(0,-2),b=d(g),k=d(y);u(l>=2&&c>=2&&(b===k||1===b||1===k),(()=>`Error in matMul: the input batch dimensions must either be the same or at least one input batch dimension must be 1. Got input batch dimensions of (${g}) and (${y}).`));const x=(b>k?r.shape.slice(0,-2):s.shape.slice(0,-2)).concat([m,f]);u(p===h,(()=>`Error in matMul: inner shapes (${p}) and (${h}) of Tensors with shapes ${r.shape} and ${s.shape} and transposeA=${o} and transposeB=${i} must match.`));const w=i?[k,f,h]:[k,h,f],N=zh({inputs:{x:r},backend:n,attrs:{shape:o?[b,p,m]:[b,m,p]}}),v=zh({inputs:{x:s},backend:n,attrs:{shape:w}}),T=o?N.shape[1]:N.shape[2],I=o?N.shape[2]:N.shape[1],S=i?v.shape[1]:v.shape[2],E=Math.max(b,k),_=n.data.get(N.dataId).values,M=n.data.get(v.dataId).values,A=F(N.shape),$=F(v.shape),[D,O,C]=o?[A[0],1,A[1]]:[A[0],A[1],1],[R,z,B]=i?[1,$[1],$[0]]:[$[1],1,$[0]],L=I*S,P=Or([E,I,S],N.dtype),V=P.values,W=n.blockSize;for(let e=0;e<E;e++)for(let t=0;t<I;t+=W)for(let n=0;n<S;n+=W)for(let a=0;a<T;a+=W){const r=Math.min(t+W,I),s=Math.min(n+W,S),o=Math.min(a+W,T);for(let i=t;i<r;i++)for(let t=n;t<s;t++){let n=0;for(let r=a;r<o;r++){const a=Math.min(e,b-1)*D,s=Math.min(e,k-1)*B;n+=_[a+i*O+r*C]*M[r*R+t*z+s]}V[e*L+(i*S+t)]+=n}}return n.disposeIntermediateTensorInfo(N),n.disposeIntermediateTensorInfo(v),n.makeTensorInfo(x,P.dtype,P.values)}const Ph={kernelName:me,backendName:"cpu",kernelFunc:Lh};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Vh={kernelName:Pn,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{a:r,b:s,bias:o,preluActivationWeights:i}=t,{transposeA:u,transposeB:l,activation:c,leakyreluAlpha:p}=a;let d,h,m;const f=[];d=Lh({inputs:{a:r,b:s},attrs:{transposeA:u,transposeB:l},backend:n}),o&&(h=Nd({inputs:{a:d,b:o},backend:n}),f.push(d),d=h),c&&(m=Rh(n,d,c,i,p),f.push(d),d=m);for(const e of f)n.disposeIntermediateTensorInfo(e);return d}},Wh=Sd(X,(e=>Math.acos(e))),Hh={kernelName:X,backendName:"cpu",kernelFunc:Wh},qh=Sd(J,(e=>Math.acosh(e))),jh={kernelName:J,backendName:"cpu",kernelFunc:qh};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Uh={kernelName:ee,backendName:"cpu",kernelFunc:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e){const{inputs:t,backend:n}=e,a=t;rd(t,"addN");const r=a.map((e=>n.data.get(e.dataId).values)),s=Or(a[0].shape,a[0].dtype),o=s.values;for(let e=0;e<a.length;e++){const t=r[e];for(let e=0;e<o.length;e++)o[e]+=t[e]}return n.makeTensorInfo(s.shape,s.dtype,s.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Kh={kernelName:te,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{axis:s,keepDims:o}=a;rd(r,"all");const i=y(s,r.shape);let u=i;const l=Yi(u,r.shape.length);let c=r;null!=l&&(c=ch({inputs:{x:r},backend:n,attrs:{perm:l}}),u=Xi(u.length,r.shape.length)),Gi("all",u,c.shape.length);const[p,h]=Ui(c.shape,u),m=d(h),f=z(d(p),c.dtype),g=n.data.get(c.dataId).values;for(let e=0;e<f.length;++e){const t=e*m;let n=g[t];for(let e=0;e<m;++e){const a=g[t+e];n=n&&a}f[e]=n}null!=l&&n.disposeIntermediateTensorInfo(c);const b=n.makeTensorInfo(p,c.dtype,f);if(o){const e=zh({inputs:{x:b},backend:n,attrs:{shape:Ki(p,i)}});return n.disposeIntermediateTensorInfo(b),e}return b}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Gh={kernelName:ne,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{axis:s,keepDims:o}=a;rd(r,"any");const i=y(s,r.shape);let u=i;const l=Yi(u,r.shape.length);let c=r;null!=l&&(c=ch({inputs:{x:r},backend:n,attrs:{perm:l}}),u=Xi(u.length,r.shape.length)),Gi("any",u,c.shape.length);const[p,h]=Ui(c.shape,u),m=d(h),f=z(d(p),c.dtype),g=n.data.get(c.dataId).values;for(let e=0;e<f.length;++e){const t=e*m;let n=g[t];for(let e=0;e<m;++e){const a=g[t+e];n=n||a}f[e]=n}null!=l&&n.disposeIntermediateTensorInfo(c);const b=n.makeTensorInfo(p,c.dtype,f);if(o){const e=zh({inputs:{x:b},backend:n,attrs:{shape:Ki(p,i)}});return n.disposeIntermediateTensorInfo(b),e}return b}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Yh={kernelName:ae,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{axis:s}=a;rd(r,"argMax");let o=y(s,r.shape);const i=Yi(o,r.shape.length);let u=r;const l=[];null!=i&&(u=ch({inputs:{x:r},backend:n,attrs:{perm:i}}),l.push(u),o=Xi(o.length,u.shape.length)),o=[o[0]],Gi("argMax",o,u.shape.length);const[c,p]=Ui(u.shape,o),h=z(d(c),"int32"),m=d(p),f=n.data.get(u.dataId).values;for(let e=0;e<h.length;++e){const t=e*m;let n=f[t],a=0;for(let e=0;e<m;++e){const r=f[t+e];r>n&&(n=r,a=e)}h[e]=a}return l.forEach((e=>n.disposeIntermediateTensorInfo(e))),n.makeTensorInfo(c,"int32",h)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Qh={kernelName:re,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{axis:s}=a;rd(r,"argMin");let o=y(s,r.shape);const i=Yi(o,r.shape.length);let u=r;const l=[];null!=i&&(u=ch({inputs:{x:r},backend:n,attrs:{perm:i}}),l.push(u),o=Xi(o.length,u.shape.length)),o=[o[0]],Gi("argMin",o,u.shape.length);const[c,p]=Ui(u.shape,o),h=z(d(c),"int32"),m=d(p),f=n.data.get(u.dataId).values;for(let e=0;e<h.length;++e){const t=e*m;let n=f[t],a=0;for(let e=0;e<m;++e){const r=f[t+e];r<n&&(n=r,a=e)}h[e]=a}return l.forEach((e=>n.disposeIntermediateTensorInfo(e))),n.makeTensorInfo(c,"int32",h)}},Xh=Sd(se,(e=>Math.asin(e))),Jh={kernelName:se,backendName:"cpu",kernelFunc:Xh},Zh=Sd(oe,(e=>Math.asinh(e))),em={kernelName:oe,backendName:"cpu",kernelFunc:Zh},tm=Sd(ie,(e=>Math.atan(e))),nm={kernelName:ie,backendName:"cpu",kernelFunc:tm},am=ud(((e,t)=>Math.atan2(e,t))),rm=bd(le,am),sm={kernelName:le,backendName:"cpu",kernelFunc:rm},om=Sd(ue,(e=>Math.atanh(e))),im={kernelName:ue,backendName:"cpu",kernelFunc:om};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function um(e,t,n,a,r,s){const o=r.strideHeight,i=r.strideWidth,u=r.dilationHeight,l=r.dilationWidth,c=r.effectiveFilterHeight,p=r.effectiveFilterWidth,d=r.padInfo.top,h=r.padInfo.left,m="max"===s?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY,f=Or(r.outShape,n),g=f.values,y=r.outShape[1]*r.outShape[2]*r.outShape[3],b=r.outShape[2]*r.outShape[3],k=r.outShape[3];for(let t=0;t<r.batchSize;++t){const n=t*y,f=t*a[0];for(let t=0;t<r.inChannels;++t)for(let y=0;y<r.outHeight;++y){const x=y*o-d,w=Math.max(0,x),N=Math.min(r.inHeight,c+x),v=n+y*b;for(let n=0;n<r.outWidth;++n){const o=n*i-h,c=Math.max(0,o),d=Math.min(r.inWidth,p+o);let y=m,b=0,x=0;for(let n=w;n<N;n+=u){const r=f+n*a[1];for(let n=c;n<d;n+=l){const o=e[r+n*a[2]+t];"max"===s&&o>y?y=o:"avg"===s&&(b+=o,x++)}if(isNaN(y))break}g[v+n*k+t]="avg"===s?b/x:y}}}return f}function lm(e,t,n,a,r=!1,s=!1){const o=Or(a.outShape,"int32"),i=a.strideHeight,u=a.strideWidth,l=a.dilationHeight,c=a.dilationWidth,p=a.effectiveFilterHeight,d=a.effectiveFilterWidth,h=a.padInfo.top,m=a.padInfo.left,f=Or(t,n,e);for(let e=0;e<a.batchSize;++e)for(let t=0;t<a.inChannels;++t)for(let n=0;n<a.outHeight;++n){const g=n*i-h;let y=g;for(;y<0;)y+=l;const b=Math.min(a.inHeight,p+g);for(let i=0;i<a.outWidth;++i){const p=i*u-m;let h=p;for(;h<0;)h+=c;const k=Math.min(a.inWidth,d+p);let x=Number.NEGATIVE_INFINITY,w=-1;for(let n=y;n<b;n+=l){const o=n-g;for(let i=h;i<k;i+=c){const u=i-p,l=f.get(e,n,i,t);l>x&&(x=l,w=r?s?((e*a.inHeight+n)*a.inWidth+i)*a.inChannels+t:(n*a.inWidth+i)*a.inChannels+t:o*d+u)}}o.set(w,e,n,i,t)}}return o}function cm(e,t,n,a,r,s){const o=r.strideDepth,i=r.strideHeight,u=r.strideWidth,l=r.dilationDepth,c=r.dilationHeight,p=r.dilationWidth,d=r.effectiveFilterDepth,h=r.effectiveFilterHeight,m=r.effectiveFilterWidth,f=r.padInfo.front,g=r.padInfo.top,y=r.padInfo.left,b="max"===s?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY,k=Or(r.outShape,n),x=k.values,w=r.outShape[1]*r.outShape[2]*r.outShape[3]*r.outShape[4],N=r.outShape[2]*r.outShape[3]*r.outShape[4],v=r.outShape[3]*r.outShape[4],T=r.outShape[4];for(let t=0;t<r.batchSize;++t){const n=t*w,k=t*a[0];for(let t=0;t<r.inChannels;++t)for(let w=0;w<r.outDepth;++w){const I=w*o-f;let S=I;for(;S<0;)S+=l;const E=Math.min(r.inDepth,d+I),_=n+w*N;for(let n=0;n<r.outHeight;++n){const o=n*i-g;let d=o;for(;d<0;)d+=c;const f=Math.min(r.inHeight,h+o),w=_+n*v;for(let n=0;n<r.outWidth;++n){const o=n*u-y;let i=o;for(;i<0;)i+=p;const h=Math.min(r.inWidth,m+o),g=w+n*T;let N=b,v=0,I=0;for(let n=S;n<E;n+=l){const r=k+n*a[1];for(let n=d;n<f;n+=c){const o=r+n*a[2];for(let n=i;n<h;n+=p){const r=e[o+n*a[3]+t];if("max"===s&&r>N?N=r:"avg"===s&&(v+=r,I++),isNaN(N))break}if(isNaN(N))break}if(isNaN(N))break}x[g+t]="avg"===s?v/I:N}}}}return k}const pm={kernelName:ce,backendName:"cpu",kernelFunc:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t;rd(r,"avgPool");const{filterSize:s,strides:o,pad:i,dimRoundingMode:l}=a;u(ko(o,1),(()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${o} and dilations '1'`));const c=uo(r.shape,s,o,1,i,l);let p;if(1===c.filterWidth&&1===c.filterHeight&&h(c.inShape,c.outShape))p=dd({inputs:{x:r},backend:n});else{const e=n.data.get(r.dataId).values,t=F(r.shape),a=um(e,r.shape,r.dtype,t,c,"avg");p=n.makeTensorInfo(c.outShape,r.dtype,a.values)}return p}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const dm={kernelName:de,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{filterSize:s,strides:o,pad:i,dimRoundingMode:u,dataFormat:l}=a;rd(r,"avgPool3d");const c=lo(r.shape,s,o,1,i,u,l),p=cm(n.data.get(r.dataId).values,r.shape,r.dtype,F(r.shape),c,"avg");return n.makeTensorInfo(p.shape,"float32",p.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const hm={kernelName:he,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{dy:r,input:s}=t,{filterSize:o,strides:i,pad:u,dimRoundingMode:l}=a;rd([r,s],"avgPool3DGrad");const c=lo(s.shape,o,i,1,u,l),p=c.strideDepth,d=c.strideHeight,h=c.strideWidth,m=c.filterDepth,f=c.filterHeight,g=c.filterWidth,y=c.dilationDepth,b=c.dilationHeight,k=c.dilationWidth,x=c.effectiveFilterDepth,w=c.effectiveFilterHeight,N=c.effectiveFilterWidth,v=x-1-c.padInfo.front,T=N-1-c.padInfo.left,I=w-1-c.padInfo.top,S=Or(s.shape,"float32"),E=1/(m*f*g),_=n.bufferSync(r);for(let e=0;e<c.batchSize;++e)for(let t=0;t<c.inChannels;++t)for(let n=0;n<c.inDepth;++n)for(let a=0;a<c.inHeight;++a)for(let r=0;r<c.inWidth;++r){const s=n-v,o=a-I,i=r-T;let u=0;for(let n=0;n<x;n+=y){const a=(s+n)/p;if(!(a<0||a>=c.outDepth||Math.floor(a)!==a))for(let n=0;n<w;n+=b){const r=(o+n)/d;if(!(r<0||r>=c.outHeight||Math.floor(r)!==r))for(let n=0;n<N;n+=k){const s=(i+n)/h;if(s<0||s>=c.outWidth||Math.floor(s)!==s)continue;u+=_.get(e,a,r,s,t)}}}S.set(u*E,e,n,a,r,t)}return n.makeTensorInfo(S.shape,S.dtype,S.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const mm={kernelName:pe,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{dy:r,input:s}=t,o=s;rd([r,s],"avgPoolGrad");const{filterSize:i,strides:u,pad:l}=a,c=uo(o.shape,i,u,1,l),p=c.strideHeight,d=c.strideWidth,h=c.filterHeight,m=c.filterWidth,f=c.dilationHeight,g=c.dilationWidth,y=c.effectiveFilterHeight,b=c.effectiveFilterWidth,k=b-1-c.padInfo.left,x=y-1-c.padInfo.top,w=Or(o.shape,"float32"),N=1/(h*m),v=n.data.get(r.dataId).values,T=Or(r.shape,"float32",v);for(let e=0;e<c.batchSize;++e)for(let t=0;t<c.inChannels;++t)for(let n=0;n<c.inHeight;++n)for(let a=0;a<c.inWidth;++a){const r=n-x,s=a-k;let o=0;for(let n=0;n<y;n+=f){const a=(r+n)/p;if(!(a<0||a>=c.outHeight||Math.floor(a)!==a))for(let n=0;n<b;n+=g){const r=(s+n)/d;if(r<0||r>=c.outWidth||Math.floor(r)!==r)continue;o+=T.get(e,a,r,t)}}w.set(o*N,e,n,a,t)}return n.makeTensorInfo(w.shape,w.dtype,w.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const fm={kernelName:tt,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r,scale:s,offset:o,mean:i,variance:l}=t;u(i.shape.length===l.shape.length,(()=>"Batch normalization gradient requires mean and variance to have equal ranks.")),u(null==o||i.shape.length===o.shape.length,(()=>"Batch normalization gradient requires mean and offset to have equal ranks.")),u(null==s||i.shape.length===s.shape.length,(()=>"Batch normalization gradient requires mean and scale to have equal ranks.")),rd([r,i,l,s,o],"batchNorm");let{varianceEpsilon:c}=a;null==c&&(c=.001);const p=n.data.get(r.dataId).values,d=n.data.get(i.dataId).values,h=n.data.get(l.dataId).values,m=s?n.data.get(s.dataId).values:new Float32Array([1]),f=o?n.data.get(o.dataId).values:new Float32Array([0]),g=new Float32Array(p.length),y=f.length,b=m.length,k=h.length,x=d.length;let w=0,N=0,v=0,T=0;for(let e=0;e<p.length;++e)g[e]=f[w++]+(p[e]-d[N++])*m[v++]/Math.sqrt(h[T++]+c),w>=y&&(w=0),N>=x&&(N=0),v>=b&&(v=0),T>=k&&(T=0);return n.makeTensorInfo(r.shape,r.dtype,g)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const gm={kernelName:fe,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{blockShape:s,crops:o}=a;rd([r],"batchToSpaceND");const i=s.reduce(((e,t)=>e*t)),u=_p(r.shape,s,i),l=Mp(u.length,s.length),c=Ap(r.shape,s,i),p=$p(o,s.length),d=Dp(c,o,s.length),h=zh({inputs:{x:r},backend:n,attrs:{shape:u}}),m=ch({inputs:{x:h},backend:n,attrs:{perm:l}}),f=zh({inputs:{x:m},backend:n,attrs:{shape:c}}),g=gh({inputs:{x:f},backend:n,attrs:{begin:p,size:d}});return n.disposeIntermediateTensorInfo(h),n.disposeIntermediateTensorInfo(m),n.disposeIntermediateTensorInfo(f),g}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ym={kernelName:ge,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r,weights:s}=t,{size:o}=a,i=Td(n.data.get(r.dataId).values,n.data.get(s.dataId).values,s.dtype,s.shape,o);return n.makeTensorInfo([o],s.dtype,i)}},bm=Sd(ke,((e,t)=>{const n=t;return e>n.clipValueMax?n.clipValueMax:e<n.clipValueMin?n.clipValueMin:e})),km={kernelName:ke,backendName:"cpu",kernelFunc:bm},xm={kernelName:we,backendName:"cpu",kernelFunc:e=>{const{x:t}=e.inputs,n=e.backend,a=new Float32Array(d(t.shape)),r=n.data.get(t.dataId),s=r.complexTensorInfos.real,o=r.complexTensorInfos.imag,i=n.data.get(s.dataId).values,u=n.data.get(o.dataId).values;for(let e=0;e<i.length;e++){const t=i[e],n=u[e];a[e]=Math.hypot(t,n)}return n.makeOutput(a,t.shape,"float32")}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function wm(e){const{inputs:t,backend:n}=e,{input:a}=t,r=n.data.get(a.dataId).complexTensorInfos.imag,s=n.data.get(r.dataId).values;return n.makeTensorInfo(r.shape,r.dtype,s)}const Nm={kernelName:ut,backendName:"cpu",kernelFunc:wm};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function vm(e){const{inputs:t,backend:n,attrs:a}=e,{axis:r}=a,s=y(r,t[0].shape)[0];let o=Sp(t.map((e=>e.shape)),s);if(0===d(o))return n.makeTensorInfo(o,t[0].dtype,[]);const i=t.filter((e=>d(e.shape)>0));if(1===i.length)return dd({inputs:{x:i[0]},backend:n});if(Ip(i.map((e=>e.shape)),s),"complex64"===i[0].dtype){const e=i.map((e=>md({inputs:{input:e},backend:n}))),t=i.map((e=>wm({inputs:{input:e},backend:n}))),a=vm({inputs:e,backend:n,attrs:{axis:s}}),r=vm({inputs:t,backend:n,attrs:{axis:s}}),o=ld({inputs:{real:a,imag:r},backend:n});return e.forEach((e=>n.disposeIntermediateTensorInfo(e))),t.forEach((e=>n.disposeIntermediateTensorInfo(e))),n.disposeIntermediateTensorInfo(a),n.disposeIntermediateTensorInfo(r),o}const u=i.map((e=>{const t=d(e.shape.slice(s));return zh({inputs:{x:e},backend:n,attrs:{shape:[-1,t]}})})),l=u.map((e=>({vals:n.data.get(e.dataId).values,shape:e.shape})));o=Sp(u.map((e=>e.shape)),1);const c=1===u[0].shape[0],p=
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e,t,n,a){const r=x(n,d(t));if(a&&"string"!==n){let t=0;e.forEach((e=>{const n=d(e.shape);r.set(e.vals,t),t+=n}))}else{let a=0;e.forEach((e=>{const s="string"===n?Zp(e.vals):e.vals;let o=0;for(let n=0;n<e.shape[0];++n){const i=n*t[1]+a;for(let t=0;t<e.shape[1];++t)r[i+t]=s[o++]}a+=e.shape[1]}))}return r}(l,o,t[0].dtype,c),h=Sp(i.map((e=>e.shape)),s),m=n.makeTensorInfo(h,t[0].dtype,p);return u.forEach((e=>n.disposeIntermediateTensorInfo(e))),m}const Tm={kernelName:Ne,backendName:"cpu",kernelFunc:vm};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Im(e){const{inputs:t,backend:n,attrs:a}=e,{x:r,filter:s}=t,{strides:o,pad:i,dataFormat:u,dilations:l,dimRoundingMode:c}=a;rd([r,s],"conv2d");const p=xo(u),d=co(r.shape,s.shape,o,l,i,c,!1,p),h=d.filterHeight,m=d.filterWidth,f=d.dilationHeight,g=d.dilationWidth,y=d.padInfo.left,b=d.padInfo.top,k="channelsLast"===d.dataFormat,x=new ha(d.outShape,r.dtype),w=F(r.shape),N=F(s.shape),v=w[0],T=k?w[1]:w[2],I=k?w[2]:1,S=k?1:w[1],E=x.strides[0],_=k?x.strides[1]:x.strides[2],M=k?x.strides[2]:1,A=k?1:x.strides[1],$=n.data.get(r.dataId).values,D=n.data.get(s.dataId).values,O=x.values;for(let e=0;e<d.batchSize;++e){const t=e*v,n=e*E;for(let e=0;e<d.outHeight;++e){const a=n+e*_,r=e*d.strideHeight-b;for(let e=0;e<h;++e){const n=r+e*f;if(n<0||n>=d.inHeight)continue;const s=e*N[0],o=t+n*T;for(let e=0;e<d.outWidth;++e){const t=a+e*M,n=e*d.strideWidth-y;for(let e=0;e<m;++e){const a=n+e*g;if(a<0||a>=d.inWidth)continue;const r=o+a*I;let i=s+e*N[1];for(let e=0;e<d.inChannels;++e){const n=$[r+e*S];for(let e=0;e<d.outChannels;++e)O[t+e*A]+=n*D[i+e];i+=d.outChannels}}}}}}return n.makeTensorInfo(x.shape,x.dtype,O)}const Sm={kernelName:ve,backendName:"cpu",kernelFunc:Im};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Em={kernelName:Te,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r,dy:s}=t,{strides:o,pad:i,dataFormat:u,dimRoundingMode:l,filterShape:c}=a;rd([r,s],"conv2dBackpropFilter");const p=xo(u),d=co(r.shape,c,o,1,i,l,!1,p),{strideHeight:h,strideWidth:m,filterHeight:f,filterWidth:g}=d,y="channelsLast"===d.dataFormat,b=new ha(d.filterShape,"float32"),k=d.padInfo.left,x=d.padInfo.top,w=n.data.get(r.dataId).values,N=n.data.get(s.dataId).values,v=new ha(r.shape,r.dtype,w),T=new ha(s.shape,s.dtype,N);for(let e=0;e<f;++e){const t=Math.max(0,Math.ceil((x-e)/h)),n=Math.min(d.outHeight,(d.inHeight+x-e)/h);for(let a=0;a<g;++a){const r=Math.max(0,Math.ceil((k-a)/m)),s=Math.min(d.outWidth,(d.inWidth+k-a)/m);for(let o=0;o<d.inChannels;++o)for(let i=0;i<d.outChannels;++i){let u=0;for(let l=0;l<d.batchSize;++l)for(let c=t;c<n;++c){const t=e+c*h-x;for(let e=r;e<s;++e){const n=a+e*m-k;u+=y?v.get(l,t,n,o)*T.get(l,c,e,i):v.get(l,o,t,n)*T.get(l,i,c,e)}}b.set(u,e,a,o,i)}}}return n.makeTensorInfo(b.shape,b.dtype,b.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const _m={kernelName:Ie,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{dy:r,filter:s}=t,{inputShape:o,strides:i,pad:u,dataFormat:l,dimRoundingMode:c}=a;rd([r,s],"conv2dBackpropInput");const p=F(s.shape),d=F(r.shape);let h=xo(l);const m=co(o,s.shape,i,1,u,c,!1,h),f=new ha(m.inShape,"float32"),g=f.values,y=n.data.get(r.dataId).values,b=n.data.get(s.dataId).values,[k,x,w]=p,{batchSize:N,filterHeight:v,filterWidth:T,inChannels:I,inHeight:S,inWidth:E,outChannels:_,outHeight:M,outWidth:A,strideHeight:$,strideWidth:D}=m;h=m.dataFormat;const O=v-1-m.padInfo.top,C=T-1-m.padInfo.left,R="channelsLast"===h,z=f.strides[0],B=R?f.strides[1]:f.strides[2],L=R?f.strides[2]:1,P=R?1:f.strides[1],V=d[0],W=R?d[1]:d[2],H=R?d[2]:1,q=R?1:d[1];for(let e=0;e<N;++e)for(let t=0;t<I;++t)for(let n=0;n<S;++n){const a=n-O,r=Math.max(0,Math.ceil(a/$)),s=Math.min(M,(v+a)/$);for(let o=0;o<E;++o){const i=o-C,u=Math.max(0,Math.ceil(i/D)),l=Math.min(A,(T+i)/D);let c=0;for(let n=r;n<s;++n){const r=n*$-a;for(let a=u;a<l;++a){const s=V*e+W*n+H*a,o=k*(v-1-r)+x*(T-1-(a*D-i))+w*t;for(let e=0;e<_;++e){c+=y[s+q*e]*b[o+e]}}}g[z*e+B*n+L*o+P*t]=c}}return n.makeTensorInfo(f.shape,f.dtype,f.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Mm={kernelName:Se,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r,filter:s}=t,{strides:o,pad:i,dilations:u}=a;rd([r,s],"conv3d");const l=po(r.shape,s.shape,o,u,i),{filterDepth:c,filterHeight:p,filterWidth:d,dilationDepth:h,dilationHeight:m,dilationWidth:f,padInfo:g}=l,y=g.front,b=g.left,k=g.top,x=new ha(l.outShape,r.dtype),w=n.data.get(r.dataId).values,N=n.data.get(s.dataId).values,v=x.values,T=F(r.shape),I=F(s.shape);for(let e=0;e<l.batchSize;++e){const t=e*T[0],n=e*x.strides[0];for(let e=0;e<l.outDepth;++e){const a=n+e*x.strides[1],r=e*l.strideDepth-y;for(let e=0;e<c;++e){const n=r+e*h;if(n<0||n>=l.inDepth)continue;const s=e*I[0],o=t+n*T[1];for(let e=0;e<l.outHeight;++e){const t=a+e*x.strides[2],n=e*l.strideHeight-k;for(let e=0;e<p;++e){const a=n+e*m;if(a<0||a>=l.inHeight)continue;const r=s+e*I[1],i=o+a*T[2];for(let e=0;e<l.outWidth;++e){const n=t+e*l.outChannels,a=e*l.strideWidth-b;for(let e=0;e<d;++e){const t=a+e*f;if(t<0||t>=l.inWidth)continue;const s=r+e*I[2],o=i+t*l.inChannels;let u=s;for(let e=0;e<l.inChannels;++e){const t=w[o+e];for(let e=0;e<l.outChannels;++e)v[n+e]+=t*N[u+e];u+=l.outChannels}}}}}}}}return n.makeTensorInfo(x.shape,x.dtype,x.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Am={kernelName:Ee,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r,dy:s}=t,{strides:o,pad:i,filterShape:u}=a;rd([r,s],"conv3dBackpropFilterV2");const l=F(r.shape),c=F(s.shape),p=po(r.shape,u,o,1,i),d=p.strideDepth,h=p.strideHeight,m=p.strideWidth,f=p.filterDepth,g=p.filterHeight,y=p.filterWidth,b=new ha(p.filterShape,"float32"),k=b.values,[x,w,N,v]=b.strides,T=n.data.get(s.dataId).values,[I,S,E,_]=c,M=n.data.get(r.dataId).values,[A,$,D,O]=l,C=p.padInfo.front,R=p.padInfo.left,z=p.padInfo.top;for(let e=0;e<f;++e){const t=Math.max(0,Math.ceil((C-e)/d)),n=Math.min(p.outDepth,(p.inDepth+C-e)/d),a=e*x;for(let r=0;r<g;++r){const s=Math.max(0,Math.ceil((z-r)/h)),o=Math.min(p.outHeight,(p.inHeight+z-r)/h),i=r*w+a;for(let a=0;a<y;++a){const u=Math.max(0,Math.ceil((R-a)/m)),l=Math.min(p.outWidth,(p.inWidth+R-a)/m),c=a*N+i;for(let i=0;i<p.inChannels;++i){const f=i*v+c;for(let c=0;c<p.outChannels;++c){let g=0;for(let f=0;f<p.batchSize;++f){const p=f*A,y=f*I;for(let f=t;f<n;++f){const t=(e+f*d-C)*$+p,n=f*S+y;for(let e=s;e<o;++e){const s=(r+e*h-z)*D+t,o=e*E+n;for(let e=u;e<l;++e){const t=e*_+o;g+=M[(a+e*m-R)*O+s+i]*T[t+c]}}}}k[f+c]=g}}}}}return n.makeTensorInfo(b.shape,b.dtype,b.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const $m={kernelName:_e,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{dy:r,filter:s}=t,{pad:o,strides:i,inputShape:u}=a;rd([r],"conv3dBackpropInputV2");const l=F(r.shape),c=F(s.shape),p=po(u,s.shape,i,1,o),d=new ha(p.inShape,"float32"),h=d.values,[m,f,g,y]=d.strides,b=n.data.get(r.dataId).values,[k,x,w,N]=l,v=n.data.get(s.dataId).values,[T,I,S,E]=c,{batchSize:_,filterDepth:M,filterHeight:A,filterWidth:$,inChannels:D,inDepth:O,inHeight:C,inWidth:R,outChannels:z,outDepth:B,outHeight:L,outWidth:P,strideDepth:V,strideHeight:W,strideWidth:H}=p,q=M-1-p.padInfo.front,j=A-1-p.padInfo.top,U=$-1-p.padInfo.left;for(let e=0;e<_;++e)for(let t=0;t<D;++t)for(let n=0;n<O;++n){const a=n-q,r=Math.max(0,Math.ceil(a/V)),s=Math.min(B,(M+a)/V);for(let o=0;o<C;++o){const i=o-j,u=Math.max(0,Math.ceil(i/W)),l=Math.min(L,(A+i)/W);for(let c=0;c<R;++c){const p=c-U,d=Math.max(0,Math.ceil(p/H)),_=Math.min(P,($+p)/H);let D=0;for(let n=r;n<s;++n){const r=n*V-a;for(let a=u;a<l;++a){const s=a*W-i;for(let o=d;o<_;++o){const i=k*e+x*n+w*a+N*o,u=T*(M-1-r)+I*(A-1-s)+S*($-1-(o*H-p))+E*t;for(let e=0;e<z;++e){D+=b[i+e]*v[u+e]}}}}h[m*e+f*n+g*o+y*c+t]=D}}}return n.makeTensorInfo(d.shape,d.dtype,d.values)}},Dm=Sd(Me,(e=>Math.cos(e))),Fm={kernelName:Me,backendName:"cpu",kernelFunc:Dm},Om=Sd(Ae,(e=>Math.cosh(e))),Cm={kernelName:Ae,backendName:"cpu",kernelFunc:Om};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Rm={kernelName:De,backendName:"cpu",kernelFunc:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e){const{inputs:t,backend:n,attrs:a}=e,{image:r,boxes:s,boxInd:o}=t,{cropSize:i,method:u,extrapolationValue:l}=a,[c,p,d,h]=r.shape,m=s.shape[0],[f,g]=i,y=Or([m,f,g,h],"float32"),b=n.data.get(s.dataId).values,k=n.data.get(o.dataId).values,x=n.data.get(r.dataId).values,w=F(r.shape),N=F(y.shape);for(let e=0;e<m;e++){const t=4*e,n=b[t],a=b[t+1],r=b[t+2],s=b[t+3],o=k[e];if(o>=c)continue;const i=f>1?(r-n)*(p-1)/(f-1):0,m=g>1?(s-a)*(d-1)/(g-1):0;for(let t=0;t<f;t++){const c=f>1?n*(p-1)+t*i:.5*(n+r)*(p-1);if(c<0||c>p-1)for(let n=0;n<g;n++)for(let a=0;a<h;a++){const r=a+n*N[2]+t*N[1]+e*N[0];y.values[r]=l}else if("bilinear"===u){const n=Math.floor(c),r=Math.ceil(c),i=c-n;for(let u=0;u<g;u++){const c=g>1?a*(d-1)+u*m:.5*(a+s)*(d-1);if(c<0||c>d-1){for(let n=0;n<h;n++){const a=n+u*N[2]+t*N[1]+e*N[0];y.values[a]=l}continue}const p=Math.floor(c),f=Math.ceil(c),b=c-p;for(let a=0;a<h;a++){let s=a+p*w[2]+n*w[1]+o*w[0];const l=x[s];s=a+f*w[2]+n*w[1]+o*w[0];const c=x[s];s=a+p*w[2]+r*w[1]+o*w[0];const d=x[s];s=a+f*w[2]+r*w[1]+o*w[0];const h=l+(c-l)*b,m=d+(x[s]-d)*b;s=a+u*N[2]+t*N[1]+e*N[0],y.values[s]=h+(m-h)*i}}}else for(let n=0;n<g;++n){const r=g>1?a*(d-1)+n*m:.5*(a+s)*(d-1);if(r<0||r>d-1){for(let a=0;a<h;a++){const r=a+n*N[2]+t*N[1]+e*N[0];y.values[r]=l}continue}const i=Math.round(r),u=Math.round(c);for(let a=0;a<h;a++){const r=a+i*w[2]+u*w[1]+o*w[0],s=a+n*N[2]+t*N[1]+e*N[0];y.values[s]=x[r]}}}}return n.makeTensorInfo(y.shape,y.dtype,y.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const zm={kernelName:$e,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{axis:s,exclusive:o,reverse:i}=a;rd(r,"cumsum");const u=Yi([s],r.shape.length);let l=r;null!=u&&(l=ch({inputs:{x:r},backend:n,attrs:{perm:u}}));const c=Xi(1,r.shape.length)[0];if(c!==l.shape.length-1)throw new Error(`backend.cumsum in CPU expects an inner-most axis=${l.shape.length-1} but got axis=${c}`);const p=Ta(l.dtype,"int32"),h=z(d(l.shape),p),m=n.data.get(l.dataId).values,f=l.shape[l.shape.length-1],g=i?(e,t)=>e+f-t-1:(e,t)=>e+t;for(let e=0;e<m.length;e+=f)for(let t=0;t<f;t++){const n=g(e,t);if(0===t)h[n]=o?0:m[n];else{const a=g(e,t-1);h[n]=o?m[a]+h[a]:m[n]+h[a]}}const y=n.makeTensorInfo(l.shape,p,h);if(null!=u){const e=ch({inputs:{x:y},backend:n,attrs:{perm:Qi(u)}});return n.disposeIntermediateTensorInfo(y),n.disposeIntermediateTensorInfo(l),e}return y}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Bm={kernelName:Fe,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r,weights:s}=t,{size:o,binaryOutput:i}=a;if(1===r.shape.length){const e=Td(n.data.get(r.dataId).values,n.data.get(s.dataId).values,s.dtype,s.shape,o);return n.makeTensorInfo([o],s.dtype,e)}if(2===r.shape.length){const e=function(e,t,n,a=!1){const r=e.shape[0],s=e.shape[1],o=Or([r,n],t.dtype);for(let i=0;i<r;i++)for(let r=0;r<s;r++){const s=e.get(i,r);if(s<0)throw new Error("Input x must be non-negative!");s>=n||(a?o.set(1,i,s):t.size>0?o.set(o.get(i,s)+t.get(i,r),i,s):o.set(o.get(i,s)+1,i,s))}return o}(n.bufferSync(r),n.bufferSync(s),o,i);return n.makeTensorInfo(e.shape,s.dtype,e.values)}throw new Error(`Error in denseBincount: input must be at most rank 2, but got rank${r.shape.length}.`)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Lm={kernelName:Oe,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{blockSize:s,dataFormat:o}=a;u("NHWC"===o,(()=>`Only NHWC dataFormat supported on CPU for depthToSpace. Got ${o}`)),u(s>1,(()=>`blockSize should be > 1 for depthToSpace, but was: ${s}`));const i=r.shape[0],l=r.shape[1],c=r.shape[2],p=r.shape[3],d=l*s,h=c*s,m=p/(s*s),f=n.data.get(r.dataId).values,g=new Float32Array(i*d*h*m);let y=0;for(let e=0;e<i;++e)for(let t=0;t<d;++t){const n=Math.floor(t/s),a=t%s;for(let t=0;t<h;++t){const r=Math.floor(t/s),o=(a*s+t%s)*m;for(let t=0;t<m;++t){const a=t+o+p*(r+c*(n+l*e));g[y++]=f[a]}}}return n.makeTensorInfo([i,d,h,m],r.dtype,g)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pm(e){const{inputs:t,backend:n,attrs:a}=e,{x:r,filter:s}=t,{strides:o,pad:i,dilations:l,dimRoundingMode:c}=a;rd([r,s],"depthwiseConv2DNative");const p=F(r.shape),d=F(s.shape);let h=l;null==h&&(h=[1,1]),u(ko(o,h),(()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${o} and dilations '${h}'`));const m=co(r.shape,s.shape,o,h,i,c,!0),{filterHeight:f,filterWidth:g,dilationHeight:y,dilationWidth:b,padInfo:k}=m,x=k.left,w=k.top,N=m.outChannels/m.inChannels,v=new ha(m.outShape,r.dtype),T=n.data.get(r.dataId).values,I=n.data.get(s.dataId).values,S=v.values;for(let e=0;e<m.batchSize;++e){const t=e*p[0],n=e*v.strides[0];for(let e=0;e<m.outHeight;++e){const a=n+e*v.strides[1],r=e*m.strideHeight-x;for(let e=0;e<f;++e){const n=r+e*y;if(n<0||n>=m.inHeight)continue;const s=e*d[0],o=t+n*p[1];for(let e=0;e<m.outWidth;++e){const t=a+e*v.strides[2],n=e*m.strideWidth-w;for(let e=0;e<g;++e){const a=n+e*b;if(a<0||a>=m.inWidth)continue;const r=s+e*d[1],i=o+a*m.inChannels;let u=t,l=r;for(let e=0;e<m.inChannels;++e){const t=T[i+e];for(let e=0;e<N;++e)S[u+e]+=t*I[l+e];u+=N,l+=N}}}}}}return n.makeTensorInfo(v.shape,v.dtype,v.values)}const Vm={kernelName:Ce,backendName:"cpu",kernelFunc:Pm};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Wm={kernelName:Re,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r,dy:s}=t,{strides:o,dilations:i,pad:u,dimRoundingMode:l,filterShape:c}=a;rd([r,s],"depthwiseConv2dNativeBackpropFilter");const p=co(r.shape,c,o,i,u,l,!0),{strideHeight:d,strideWidth:h,filterHeight:m,filterWidth:f}=p,g=new ha(p.filterShape,"float32"),y=p.padInfo.left,b=p.padInfo.top,k=p.outChannels/p.inChannels,x=n.data.get(r.dataId).values,w=new ha(r.shape,r.dtype,x),N=n.data.get(s.dataId).values,v=new ha(s.shape,s.dtype,N);for(let e=0;e<m;++e){const t=Math.max(0,Math.ceil((b-e)/d)),n=Math.min(p.outHeight,(p.inHeight+b-e)/d);for(let a=0;a<f;++a){const r=Math.max(0,Math.ceil((y-a)/h)),s=Math.min(p.outWidth,(p.inWidth+y-a)/h);for(let o=0;o<p.outChannels;++o){const i=Math.trunc(o/k),u=o%k;let l=0;for(let u=0;u<p.batchSize;++u)for(let c=t;c<n;++c){const t=e+c*d-b;for(let e=r;e<s;++e){const n=a+e*h-y;l+=w.get(u,t,n,i)*v.get(u,c,e,o)}}g.set(l,e,a,i,u)}}}return n.makeTensorInfo(g.shape,g.dtype,g.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Hm={kernelName:ze,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{dy:r,filter:s}=t,{strides:o,dilations:i,pad:u,dimRoundingMode:l,inputShape:c}=a;rd([r,s],"depthwiseConv2DNativeBackpropInput");const p=F(r.shape),d=F(s.shape),h=co(c,s.shape,o,i,u,l,!0),m=new ha(h.inShape,"float32"),f=m.values,[g,y,b]=m.strides,k=n.data.get(r.dataId).values,[x,w,N]=p,v=n.data.get(s.dataId).values,[T,I,S]=d,{batchSize:E,filterHeight:_,filterWidth:M,inChannels:A,inHeight:$,inWidth:D,outChannels:O,outHeight:C,outWidth:R,strideHeight:z,strideWidth:B}=h,L=_-1-h.padInfo.top,P=M-1-h.padInfo.left,V=O/A;for(let e=0;e<E;++e)for(let t=0;t<A;++t)for(let n=0;n<$;++n){const a=n-L,r=Math.max(0,Math.ceil(a/z)),s=Math.min(C,(_+a)/z);for(let o=0;o<D;++o){const i=o-P,u=Math.max(0,Math.ceil(i/B)),l=Math.min(R,(M+i)/B);let c=0;for(let n=r;n<s;++n){const r=n*z-a;for(let a=u;a<l;++a){const s=x*e+w*n+N*a,o=T*(_-1-r)+I*(M-1-(a*B-i))+S*t;for(let e=0;e<V;++e){c+=k[s+(t*V+e)]*v[o+e]}}}f[g*e+y*n+b*o+t]=c}}return n.makeTensorInfo(m.shape,m.dtype,m.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const qm={kernelName:Be,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n}=e,{x:a}=t,r=d(a.shape),s=n.data.get(a.dataId).values,o=Or([r,r],a.dtype),i=o.values;for(let e=0;e<s.length;e++)i[e*r+e]=s[e];const u=[...a.shape,...a.shape];return n.makeTensorInfo(u,o.dtype,o.values)}},jm={kernelName:Le,backendName:"cpu",kernelFunc:({inputs:e,backend:t,attrs:n})=>{const{x:a,filter:r}=e,{strides:s,pad:o,dilations:i}=n,u=t,l=u.data.get(a.dataId).values,c=a.shape.length,p=u.data.get(r.dataId).values,h=r.shape.length,{batchSize:m,inHeight:f,inWidth:g,inChannels:y,outHeight:b,outWidth:k,padInfo:w,strideHeight:N,strideWidth:v,filterHeight:T,filterWidth:I,dilationHeight:S,dilationWidth:E,outShape:_}=io(a.shape,r.shape,s,o,"NHWC",i),M=d(_),A=_.length,$=x(a.dtype,M);for(let e=0;e<m;++e)for(let t=0;t<b;++t){const n=t*N-w.top;for(let s=0;s<k;++s){const o=s*v-w.left;for(let i=0;i<y;++i){let u=Number.MIN_SAFE_INTEGER;for(let t=0;t<T;++t){const s=n+t*S;if(s>=0&&s<f)for(let n=0;n<I;++n){const d=o+n*E;if(d>=0&&d<g){const o=P([e,s,d,i],c,F(a.shape)),m=P([t,n,i],h,F(r.shape)),f=l[o]+p[m];f>u&&(u=f)}}}$[P([e,t,s,i],A,F(_))]=u}}}return{dataId:u.write(Xn($,a.dtype),_,a.dtype),shape:_,dtype:a.dtype}}},Um={kernelName:Ve,backendName:"cpu",kernelFunc:({inputs:e,backend:t,attrs:n})=>{const{x:a,filter:r,dy:s}=e,{strides:o,pad:i,dilations:l}=n,c=t,p=C(a.shape,c.data.get(a.dataId).values),d=C(r.shape,c.data.get(r.dataId).values),{batchSize:h,inHeight:m,inWidth:f,inChannels:g,outHeight:y,outWidth:b,padInfo:k,strideHeight:x,strideWidth:w,filterHeight:N,filterWidth:v,dilationHeight:T,dilationWidth:I,outShape:S}=io(a.shape,r.shape,o,i,"NHWC",l);u(s.rank===S.length,(()=>`Error in ${Ve}, dy must have the same rank as output ${S.length}, but got ${s.rank}`));const E=C(S,c.data.get(s.dataId).values),_=B(r.shape,r.dtype);for(let e=0;e<h;++e)for(let t=0;t<y;++t){const n=t*x-k.top;for(let a=0;a<b;++a){const r=a*w-k.left;for(let s=0;s<g;++s){let o=Number.MIN_SAFE_INTEGER,i=0,u=0;for(let t=0;t<N;++t){const a=n+t*T;if(a>=0&&a<m)for(let n=0;n<v;++n){const l=r+n*I;if(l>=0&&l<f){const r=p[e][a][l][s]+d[t][n][s];r>o&&(o=r,i=t,u=n)}}}_[i][u][s]+=E[e][t][a][s]}}}return{dataId:c.write(Xn(_,a.dtype),r.shape,r.dtype),shape:r.shape,dtype:r.dtype}}},Km={kernelName:Pe,backendName:"cpu",kernelFunc:({inputs:e,backend:t,attrs:n})=>{const{x:a,filter:r,dy:s}=e,{strides:o,pad:i,dilations:l}=n,c=t,p=C(a.shape,c.data.get(a.dataId).values),d=C(r.shape,c.data.get(r.dataId).values),{batchSize:h,inHeight:m,inWidth:f,inChannels:g,outHeight:y,outWidth:b,padInfo:k,strideHeight:x,strideWidth:w,filterHeight:N,filterWidth:v,dilationHeight:T,dilationWidth:I,outShape:S}=io(a.shape,r.shape,o,i,"NHWC",l);u(s.rank===S.length,(()=>`Error in ${Pe}, dy must have the same rank as output ${S.length}, but got ${s.rank}`));const E=C(S,c.data.get(s.dataId).values),_=B(a.shape,a.dtype);for(let e=0;e<h;++e)for(let t=0;t<y;++t){const n=t*x-k.top;for(let a=0;a<b;++a){const r=a*w-k.left;for(let s=0;s<g;++s){let o=Number.MIN_SAFE_INTEGER,i=n<0?0:n,u=r<0?0:r;for(let t=0;t<N;++t){const a=n+t*T;if(a>=0&&a<m)for(let n=0;n<v;++n){const l=r+n*I;if(l>=0&&l<f){const r=p[e][a][l][s]+d[t][n][s];r>o&&(o=r,i=a,u=l)}}}_[e][i][u][s]+=E[e][t][a][s]}}}return{dataId:c.write(Xn(_,a.dtype),a.shape,a.dtype),shape:a.shape,dtype:a.dtype}}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Gm={kernelName:qe,backendName:"cpu",kernelFunc:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e){const{inputs:t,backend:n}=e,{dy:a,y:r}=t;rd([a,r],"eluGrad");const s=new Float32Array(d(r.shape)),o=n.data.get(r.dataId).values,i=n.data.get(a.dataId).values;for(let e=0;e<o.length;++e){const t=o[e];s[e]=t>=1?i[e]:i[e]*(t+1)}return n.makeTensorInfo(r.shape,"float32",s)}},Ym=ud(((e,t)=>e===t?1:0)),Qm=bd(Ue,Ym,null,"bool"),Xm={kernelName:Ue,backendName:"cpu",kernelFunc:Qm},Jm=Cp,Zm=Rp,ef=zp,tf=Bp,nf=Lp,af=Pp,rf=Sd(je,(e=>{const t=Math.sign(e),n=Math.abs(e),a=1/(1+Jm*n);return t*(1-((((af*a+nf)*a+tf)*a+ef)*a+Zm)*a*Math.exp(-n*n))})),sf={kernelName:je,backendName:"cpu",kernelFunc:rf};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function of(e){const{inputs:t,backend:n,attrs:a}=e,{input:r}=t,{dim:s}=a,o=r.shape.length,i=r.shape.slice();let l=s;return s<0&&(u(-(o+1)<=s,(()=>`Axis must be in the interval [${-(o+1)}, ${o}]`)),l=o+s+1),i.splice(l,0,1),zh({inputs:{x:r},backend:n,attrs:{shape:i}})}const uf={kernelName:Ge,backendName:"cpu",kernelFunc:of},lf=ud(((e,t)=>e/t)),cf=bd(We,lf),pf={kernelName:We,backendName:"cpu",kernelFunc:cf};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function df(e,t,n){const a=e.shape,r=a[0],s=a[1],o=n.data.get(e.dataId),i=o.complexTensorInfos.real,u=o.complexTensorInfos.imag,l=[r,s],c=d(l),p=k("float32",c),h=k("float32",c);for(let e=0;e<r;e++){const a=gh({inputs:{x:i},backend:n,attrs:{begin:[e,0],size:[1,s]}}),r=gh({inputs:{x:u},backend:n,attrs:{begin:[e,0],size:[1,s]}}),o=ld({inputs:{real:a,imag:r},backend:n}),{real:l,imag:c}=hf(o,t,n),d=Wp(l,c);for(let t=0;t<s;t++){const n=Up(d,t);p[e*s+t]=n.real,h[e*s+t]=n.imag}n.disposeIntermediateTensorInfo(a),n.disposeIntermediateTensorInfo(r),n.disposeIntermediateTensorInfo(o)}const m=n.makeTensorInfo(l,"float32",p),f=n.makeTensorInfo(l,"float32",h),g=ld({inputs:{real:m,imag:f},backend:n});return n.disposeIntermediateTensorInfo(m),n.disposeIntermediateTensorInfo(f),g}function hf(e,t,n){const a=d(e.shape),r=n.data.get(e.dataId),s=n.data.get(r.complexTensorInfos.real.dataId).values,o=n.data.get(r.complexTensorInfos.imag.dataId).values;if((i=a)&i-1){const e=function(e,t,n){const a=new Float32Array(2*t);for(let r=0;r<t;r++){let s=0,o=0;for(let a=0;a<t;a++){const i=Yp(r*a,t,n),u=Up(e,a);s+=u.real*i.real-u.imag*i.imag,o+=u.real*i.imag+u.imag*i.real}n&&(s/=t,o/=t),Kp(a,s,o,r)}return a}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */(Wp(s,o),a,t);return Hp(e)}{const r=mf(s,o,a,t,n),i=[e.shape[0],e.shape[1]];if(t){const e=n.makeTensorInfo(i,"float32",r.real),t=n.makeTensorInfo(i,"float32",r.imag),s=n.makeTensorInfo([],"float32",Qn(a,"float32")),o=dd({inputs:{x:s},backend:n}),u=pf.kernelFunc({inputs:{a:e,b:s},backend:n}),l=pf.kernelFunc({inputs:{a:t,b:o},backend:n}),c=n.data.get(u.dataId).values,p=n.data.get(l.dataId).values;return n.disposeIntermediateTensorInfo(e),n.disposeIntermediateTensorInfo(t),n.disposeIntermediateTensorInfo(s),n.disposeIntermediateTensorInfo(o),n.disposeIntermediateTensorInfo(u),n.disposeIntermediateTensorInfo(l),{real:c,imag:p}}return r}var i}function mf(e,t,n,a,r){if(1===n)return{real:e,imag:t};const s=Wp(e,t),o=n/2,i=qp(s),u=i.real,l=i.imag,c=[u.length],p=r.makeTensorInfo(c,"float32",u),d=r.makeTensorInfo(c,"float32",l),h=ld({inputs:{real:p,imag:d},backend:r}),m=jp(s),f=m.real,g=m.imag,y=[f.length],b=r.makeTensorInfo(y,"float32",f),k=r.makeTensorInfo(y,"float32",g),x=ld({inputs:{real:b,imag:k},backend:r}),w=mf(u,l,o,a,r),N=w.real,v=w.imag,T=[N.length],I=r.makeTensorInfo(T,"float32",N),S=r.makeTensorInfo(T,"float32",v),E=ld({inputs:{real:I,imag:S},backend:r}),_=mf(f,g,o,a,r),M=_.real,A=_.imag,$=[M.length],D=r.makeTensorInfo($,"float32",M),F=r.makeTensorInfo($,"float32",A),O=ld({inputs:{real:D,imag:F},backend:r}),C=Gp(n,a),R=[C.real.length],z=r.makeTensorInfo(R,"float32",C.real),B=r.makeTensorInfo(R,"float32",C.imag),L=ld({inputs:{real:z,imag:B},backend:r}),P=ah({inputs:{a:L,b:O},backend:r}),V=Nd({inputs:{a:E,b:P},backend:r}),W=vh({inputs:{a:E,b:P},backend:r}),H=md({inputs:{input:V},backend:r}),q=md({inputs:{input:W},backend:r}),j=wm({inputs:{input:V},backend:r}),U=wm({inputs:{input:W},backend:r}),K=vm({inputs:[H,q],backend:r,attrs:{axis:0}}),G=vm({inputs:[j,U],backend:r,attrs:{axis:0}}),Y=r.data.get(K.dataId).values,Q=r.data.get(G.dataId).values;return r.disposeIntermediateTensorInfo(p),r.disposeIntermediateTensorInfo(d),r.disposeIntermediateTensorInfo(h),r.disposeIntermediateTensorInfo(b),r.disposeIntermediateTensorInfo(k),r.disposeIntermediateTensorInfo(x),r.disposeIntermediateTensorInfo(I),r.disposeIntermediateTensorInfo(S),r.disposeIntermediateTensorInfo(E),r.disposeIntermediateTensorInfo(D),r.disposeIntermediateTensorInfo(F),r.disposeIntermediateTensorInfo(O),r.disposeIntermediateTensorInfo(z),r.disposeIntermediateTensorInfo(B),r.disposeIntermediateTensorInfo(L),r.disposeIntermediateTensorInfo(P),r.disposeIntermediateTensorInfo(V),r.disposeIntermediateTensorInfo(W),r.disposeIntermediateTensorInfo(H),r.disposeIntermediateTensorInfo(j),r.disposeIntermediateTensorInfo(q),r.disposeIntermediateTensorInfo(U),r.disposeIntermediateTensorInfo(K),r.disposeIntermediateTensorInfo(G),{real:Y,imag:Q}}const ff={kernelName:Qe,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n}=e,{input:a}=t,r=d(a.shape),s=a.shape[a.shape.length-1],o=zh({inputs:{x:a},backend:n,attrs:{shape:[r/s,s]}}),i=df(o,!1,n),u=zh({inputs:{x:i},backend:n,attrs:{shape:a.shape}});return n.disposeIntermediateTensorInfo(o),n.disposeIntermediateTensorInfo(i),u}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gf(e){const{backend:t,attrs:n}=e,{shape:a,value:r,dtype:s}=n,o=s||A(r),i=x(o,d(a));return function(e,t,n){e.fill(t)}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */(i,r),t.makeTensorInfo(a,o,i)}const yf={kernelName:Xe,backendName:"cpu",kernelFunc:gf};const bf={kernelName:Je,backendName:"cpu",kernelFunc:({inputs:e,attrs:t,backend:n})=>{const{image:a}=e,r=n,s=k(a.dtype,d(a.shape)),[o,i,u,l]=a.shape,c=r.data.get(a.dataId).values;for(let e=0;e<o;e++){const t=e*u*i*l;for(let e=0;e<i;e++){const n=e*(u*l);for(let a=0;a<u;a++){const r=a*l;for(let i=0;i<l;i++){const p=[o,e,a,i][2],d=Math.round(u-p),h=t+n+r+i;let m=c[h];if(d>=0&&d<u){m=c[t+n+d*l+i]}s[h]=m}}}}return{dataId:r.write(s,a.shape,a.dtype),shape:a.shape,dtype:a.dtype}}},kf=ud(((e,t)=>Math.floor(e/t))),xf=bd(et,kf,null,"int32"),wf={kernelName:et,backendName:"cpu",kernelFunc:xf};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Nf={kernelName:Vn,backendName:"cpu",kernelFunc:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r,filter:s,bias:o,preluActivationWeights:i}=t,{strides:u,pad:l,dataFormat:c,dilations:p,dimRoundingMode:d,activation:h,leakyreluAlpha:m}=a;let f=Im({inputs:{x:r,filter:s},backend:n,attrs:{strides:u,pad:l,dataFormat:c,dilations:p,dimRoundingMode:d}});if(o){const e=f;f=Nd({inputs:{a:f,b:o},backend:n}),n.disposeIntermediateTensorInfo(e)}if(h){const e=f;f=Rh(n,f,h,i,m),n.disposeIntermediateTensorInfo(e)}return f}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const vf={kernelName:Wn,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r,filter:s,bias:o,preluActivationWeights:i}=t,{strides:u,pad:l,dataFormat:c,dilations:p,dimRoundingMode:d,activation:h,leakyreluAlpha:m}=a;let f=Pm({inputs:{x:r,filter:s},backend:n,attrs:{strides:u,pad:l,dataFormat:c,dilations:p,dimRoundingMode:d}});if(o){const e=f;f=Nd({inputs:{a:f,b:o},backend:n}),n.disposeIntermediateTensorInfo(e)}if(h){const e=f;f=Rh(n,f,h,i,m),n.disposeIntermediateTensorInfo(e)}return f}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Tf={kernelName:at,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n}=e,{params:a,indices:r}=t,s=d(a.shape),o=r.shape,i=o[o.length-1],[u,l,c,p]=os(a,r);if(0===l)return n.makeTensorInfo(u,a.dtype,[]);const h=Or([l,c],a.dtype),m=n.data.get(r.dataId).values,f=n.data.get(a.dataId).values;for(let e=0;e<l;e++){const t=[];let n=0;for(let a=0;a<i;a++){const r=m[e*i+a];n+=r*p[a],t.push(r)}if(n<0||n>=s/c)throw new Error(`Invalid indices: ${t} does not index into ${a.shape}`);for(let t=0;t<c;t++)h.values[e*c+t]=f[n*c+t]}return n.makeTensorInfo(u,h.dtype,h.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const If={kernelName:nt,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r,indices:s}=t,{axis:o,batchDims:i}=a;rd([r,s],"gatherV2");let u=i;null==i&&(u=0);const l=d(s.shape),c=Xp(r,s,y(o,r.shape)[0],u),p=zh({inputs:{x:r},backend:n,attrs:{shape:[c.batchSize,c.outerSize,c.dimSize,c.sliceSize]}}),h=zh({inputs:{x:s},backend:n,attrs:{shape:[c.batchSize,l/c.batchSize]}}),m=[c.batchSize,c.outerSize,l/c.batchSize,c.sliceSize],f=n.bufferSync(h),g=
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e,t,n){const a=Or(n,e.dtype);for(let n=0;n<a.size;++n){const r=a.indexToLoc(n).slice(),s=r[0],o=r[2],i=t.locToIndex([s,o]);r[2]=t.values[i];const u=e.locToIndex(r);a.values[n]=e.values[u]}return a}(n.bufferSync(p),f,m);return n.disposeIntermediateTensorInfo(p),n.disposeIntermediateTensorInfo(h),n.makeTensorInfo(c.outputShape,g.dtype,g.values)}},Sf=ud(((e,t)=>e>=t?1:0)),Ef=bd(st,Sf,null,"bool"),_f={kernelName:st,backendName:"cpu",kernelFunc:Ef};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Mf={kernelName:it,backendName:"cpu",kernelFunc:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e){const{inputs:t,backend:n}=e,{input:a}=t,r=d(a.shape),s=a.shape[a.shape.length-1],o=zh({inputs:{x:a},backend:n,attrs:{shape:[r/s,s]}}),i=df(o,!0,n),u=zh({inputs:{x:i},backend:n,attrs:{shape:a.shape}});return n.disposeIntermediateTensorInfo(o),n.disposeIntermediateTensorInfo(i),u}},Af=Sd(lt,(e=>Number.isFinite(e)?1:0),"bool"),$f={kernelName:lt,backendName:"cpu",kernelFunc:Af},Df=Sd(ct,(e=>Math.abs(e)===1/0?1:0),"bool"),Ff={kernelName:ct,backendName:"cpu",kernelFunc:Df},Of=Sd(pt,(e=>Number.isNaN(e)?1:0),"bool"),Cf={kernelName:pt,backendName:"cpu",kernelFunc:Of},Rf=ud(((e,t)=>e<=t?1:0)),zf=bd(mt,Rf,null,"bool"),Bf={kernelName:mt,backendName:"cpu",kernelFunc:zf};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Lf={kernelName:ft,backendName:"cpu",kernelFunc:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e){const{backend:t,attrs:n}=e,{start:a,stop:r,num:s}=n,o=
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e,t,n){const a=(t-e)/(n-1),r=z(n,"float32");r[0]=e;for(let e=1;e<r.length;e++)r[e]=r[e-1]+a;return r}(a,r,s);return t.makeTensorInfo([o.length],"float32",o)}},Pf=Sd(yt,(e=>Math.log1p(e))),Vf={kernelName:yt,backendName:"cpu",kernelFunc:Pf},Wf=ud(((e,t)=>e&&t)),Hf=bd(bt,Wf,null,"bool"),qf={kernelName:bt,backendName:"cpu",kernelFunc:Hf},jf=Sd(kt,(e=>e?0:1),"bool"),Uf={kernelName:kt,backendName:"cpu",kernelFunc:jf},Kf=ud(((e,t)=>e||t)),Gf=bd(xt,Kf,null,"bool"),Yf={kernelName:xt,backendName:"cpu",kernelFunc:Gf};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Qf={kernelName:wt,backendName:"cpu",kernelFunc:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{depthRadius:s,bias:o,alpha:i,beta:u}=a;rd(r,"LRN");const l=r.shape[3],c=l-1,p=n.data.get(r.dataId).values,h=d(r.shape),m=new Float32Array(h);function f(e){const t=e%l;let n=e-t+Math.max(0,t-s);const a=e-t+Math.min(t+s,c);let r=0;for(;n<=a;n++){const e=p[n];r+=e*e}return r}for(let e=0;e<h;e++){const t=f(e),n=p[e]*Math.pow(o+i*t,-u);m[e]=n}return n.makeTensorInfo(r.shape,r.dtype,m)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Xf={kernelName:Nt,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r,y:s,dy:o}=t,{depthRadius:i,bias:u,alpha:l,beta:c}=a;rd(o,"LRNGrad");const p=d(o.shape),h=o.shape[3],m=n.data.get(o.dataId).values,f=n.data.get(r.dataId).values,g=n.data.get(s.dataId).values,y=new Float32Array(p),b=p;for(let e=0;e<b;e++){const t=e%h,n=e-t+Math.max(0,t-i),a=e-t+Math.min(h,t+i+1);let r=0;for(let e=n;e<a;e++)r+=Math.pow(f[e],2);r=l*r+u;for(let t=n;t<a;t++){let n=-2*l*c*f[t]*g[e]/r;e===t&&(n+=Math.pow(r,-c)),n*=m[e],y[t]+=n}}return n.makeTensorInfo(o.shape,r.dtype,y)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jf(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{reductionIndices:s,keepDims:o}=a,i=n;let u=r.shape;const l=u.length,c=y(s,u);let p=c;const h=Yi(p,l);let m=i.data.get(r.dataId).values;if(null!=h){const e=new Array(l);for(let t=0;t<e.length;t++)e[t]=u[h[t]];m=lh(m,u,r.dtype,h,e),p=Xi(p.length,l),u=e}rd(r,"max"),Gi("max",p,l);const[f,g]=Ui(u,p),b=
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e,t,n,a){const r=k(a,d(n));for(let n=0;n<r.length;++n){const a=n*t;let s=e[a];for(let n=0;n<t;++n){const t=e[a+n];t>s&&(s=t)}r[n]=s}return r}(m,d(g),f,r.dtype),x=i.write(b,f,r.dtype);let w=f;if(o){w=Ki(f,c)}return{dataId:x,shape:w,dtype:r.dtype}}const Zf={kernelName:vt,backendName:"cpu",kernelFunc:Jf};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const eg={kernelName:It,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t;rd(r,"maxPool");const{filterSize:s,strides:o,pad:i,dimRoundingMode:l}=a;u(ko(o,1),(()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${o} and dilations '1'`));const c=uo(r.shape,s,o,1,i,l);let p;if(1===c.filterWidth&&1===c.filterHeight&&h(c.inShape,c.outShape))p=dd({inputs:{x:r},backend:n});else{const e=n.data.get(r.dataId).values,t=F(r.shape),a=um(e,r.shape,r.dtype,t,c,"max");p=n.makeTensorInfo(c.outShape,r.dtype,a.values)}return p}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const tg={kernelName:Et,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{filterSize:s,strides:o,pad:i,dimRoundingMode:u,dataFormat:l}=a;rd(r,"maxPool3d");const c=lo(r.shape,s,o,1,i,u,l),p=cm(n.data.get(r.dataId).values,r.shape,r.dtype,F(r.shape),c,"max");return n.makeTensorInfo(p.shape,"float32",p.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ng={kernelName:_t,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{dy:r,input:s}=t,{filterSize:o,strides:i,pad:u,dimRoundingMode:l}=a;rd([r,s],"maxPool3DGrad");const c=lo(s.shape,o,i,1,u,l),p=function(e,t){const n=Or(t.outShape,"int32"),a=t.strideDepth,r=t.strideHeight,s=t.strideWidth,o=t.dilationDepth,i=t.dilationHeight,u=t.dilationWidth,l=t.effectiveFilterDepth,c=t.effectiveFilterHeight,p=t.effectiveFilterWidth,d=t.padInfo.front,h=t.padInfo.top,m=t.padInfo.left;for(let f=0;f<t.batchSize;++f)for(let g=0;g<t.inChannels;++g)for(let y=0;y<t.outDepth;++y){const b=y*a-d;let k=b;for(;k<0;)k+=o;const x=Math.min(t.inDepth,l+b);for(let a=0;a<t.outHeight;++a){const l=a*r-h;let d=l;for(;d<0;)d+=i;const w=Math.min(t.inHeight,c+l);for(let r=0;r<t.outWidth;++r){const h=r*s-m;let N=h;for(;N<0;)N+=u;const v=Math.min(t.inWidth,p+h);let T=Number.NEGATIVE_INFINITY,I=-1;for(let t=k;t<x;t+=o){const n=t-b;for(let a=d;a<w;a+=i){const r=a-l;for(let s=N;s<v;s+=u){const o=s-h,i=e.get(f,t,a,s,g);i>=T&&(T=i,I=n*c*p+r*c+o)}}}n.set(I,f,y,a,r,g)}}}return n}(n.bufferSync(s),c),d=c.strideDepth,h=c.strideHeight,m=c.strideWidth,f=c.dilationDepth,g=c.dilationHeight,y=c.dilationWidth,b=c.effectiveFilterDepth,k=c.effectiveFilterHeight,x=c.effectiveFilterWidth,w=b-1-c.padInfo.front,N=x-1-c.padInfo.left,v=k-1-c.padInfo.top,T=Or(s.shape,"float32"),I=n.bufferSync(r);for(let e=0;e<c.batchSize;++e)for(let t=0;t<c.inChannels;++t)for(let n=0;n<c.inDepth;++n)for(let a=0;a<c.inHeight;++a)for(let r=0;r<c.inWidth;++r){const s=n-w,o=a-v,i=r-N;let u=0;for(let n=0;n<b;n+=f){const a=(s+n)/d;if(!(a<0||a>=c.outDepth||Math.floor(a)!==a))for(let r=0;r<k;r+=g){const s=(o+r)/h;if(!(s<0||s>=c.outHeight||Math.floor(s)!==s))for(let o=0;o<x;o+=y){const l=(i+o)/m;if(l<0||l>=c.outWidth||Math.floor(l)!==l)continue;const d=b*k*x-1-p.get(e,a,s,l,t)===n*k*x+r*x+o?1:0;if(0===d)continue;u+=I.get(e,a,s,l,t)*d}}}T.set(u,e,n,a,r,t)}return n.makeTensorInfo(T.shape,T.dtype,T.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ag={kernelName:St,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{dy:r,input:s,output:o}=t,i=s;rd([s,o],"maxPoolGrad");const{filterSize:u,strides:l,pad:c,dimRoundingMode:p}=a,d=uo(i.shape,u,l,1,c,p),h=n.data.get(i.dataId).values,m=Or(d.outShape,i.dtype,lm(h,i.shape,i.dtype,d).values),f=d.strideHeight,g=d.strideWidth,y=d.dilationHeight,b=d.dilationWidth,k=d.effectiveFilterHeight,x=d.effectiveFilterWidth,w=x-1-d.padInfo.left,N=k-1-d.padInfo.top,v=Or(i.shape,"float32"),T=n.data.get(r.dataId).values,I=Or(r.shape,"float32",T);for(let e=0;e<d.batchSize;++e)for(let t=0;t<d.inChannels;++t)for(let n=0;n<d.inHeight;++n)for(let a=0;a<d.inWidth;++a){const r=n-N,s=a-w;let o=0;for(let n=0;n<k;n+=y){const a=(r+n)/f;if(!(a<0||a>=d.outHeight||Math.floor(a)!==a))for(let r=0;r<x;r+=b){const i=(s+r)/g;if(i<0||i>=d.outWidth||Math.floor(i)!==i)continue;const u=k*x-1-m.get(e,a,i,t)===n*x+r?1:0;if(0===u)continue;o+=I.get(e,a,i,t)*u}}v.set(o,e,n,a,t)}return n.makeTensorInfo(v.shape,v.dtype,v.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const rg={kernelName:Mt,backendName:"cpu",kernelFunc:({inputs:e,attrs:t,backend:n})=>{const{x:a}=e,{filterSize:r,strides:s,pad:o,includeBatchInIndex:i}=t,u=n;rd(a,"MaxPoolWithArgmax");const l=u.data.get(a.dataId).values,c=uo(a.shape,r,s,[1,1],o),[p,d]=function(e,t,n,a,r){const s=um(e,0,n,F(t),r,"max"),o=lm(e,t,n,r,!0,a);return[s.values,o.values]}(l,a.shape,a.dtype,i,c),h=u.write(p,c.outShape,a.dtype),m=u.write(d,c.outShape,a.dtype);return[{dataId:h,shape:c.outShape,dtype:a.dtype},{dataId:m,shape:c.outShape,dtype:"int32"}]}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sg(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{axis:s,keepDims:o}=a;let i;rd(r,"sum"),i="bool"===r.dtype?gd({inputs:{x:r},backend:n,attrs:{dtype:"int32"}}):dd({inputs:{x:r},backend:n});const u=i.shape.length,l=y(s,i.shape),c=Yi(l,u);let p=l,h=i;null!=c&&(h=ch({inputs:{x:i},backend:n,attrs:{perm:c}}),p=Xi(p.length,u)),Gi("sum",p,h.shape.length);const[m,f]=Ui(h.shape,p);let g=pd(n,m,Ta(h.dtype,"int32"));const b=d(f),k=n.data.get(g.dataId).values,x=n.data.get(h.dataId).values;for(let e=0;e<k.length;++e){const t=e*b;let n=0;for(let e=0;e<b;++e)n+=x[t+e];k[e]=n}if(o){const e=g;g=zh({inputs:{x:g},backend:n,attrs:{shape:Ki(g.shape,l)}}),n.disposeIntermediateTensorInfo(e)}return n.disposeIntermediateTensorInfo(i),null!=c&&n.disposeIntermediateTensorInfo(h),g}const og={kernelName:kn,backendName:"cpu",kernelFunc:sg};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ig={kernelName:At,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{axis:s,keepDims:o}=a,i=y(s,r.shape),u=d(Ui(r.shape,i)[1]),l=[],c=n.makeTensorInfo([],"float32",new Float32Array([u]));l.push(c);const p=gd({inputs:{x:r},backend:n,attrs:{dtype:"float32"}});l.push(p);const h=cf({inputs:{a:p,b:c},backend:n});l.push(h);const m=sg({inputs:{x:h},backend:n,attrs:{axis:s,keepDims:o}});return l.forEach((e=>n.disposeIntermediateTensorInfo(e))),m}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ug={kernelName:$t,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{axis:s,keepDims:o}=a;rd(r,"min");const i=y(s,r.shape);let u=i;const l=Yi(u,r.shape.length);let c=r;null!=l&&(c=ch({inputs:{x:r},backend:n,attrs:{perm:l}}),u=Xi(u.length,r.shape.length)),Gi("min",u,c.shape.length);const[p,h]=Ui(c.shape,u),m=d(h),f=z(d(p),c.dtype),g=n.data.get(c.dataId).values;for(let e=0;e<f.length;++e){const t=e*m;let n=g[t];for(let e=0;e<m;++e){const a=g[t+e];a<n&&(n=a)}f[e]=n}null!=l&&n.disposeIntermediateTensorInfo(c);const b=n.makeTensorInfo(p,c.dtype,f);if(o){const e=zh({inputs:{x:b},backend:n,attrs:{shape:Ki(p,i)}});return n.disposeIntermediateTensorInfo(b),e}return b}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const lg={kernelName:Ft,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{paddings:s,mode:o}=a;rd(r,"mirrorPad");const i=s.map(((e,t)=>e[0]+r.shape[t]+e[1])),u=s.map((e=>e[0])),l=s.map(((e,t)=>e[0]+r.shape[t])),c="reflect"===o?0:1,p=n.data.get(r.dataId).values,h=r.shape.length,m=F(r.shape),f=d(i),g=i.length,y=F(i),b=k(r.dtype,f);for(let e=0;e<f;e++){let t=V(e,g,y);for(let e=0;e<g;e++)t[e]<u[e]?t[e]=2*u[e]-t[e]-c:t[e]>=l[e]&&(t[e]=2*(l[e]-1)-t[e]+c);t=t.map(((e,t)=>e-u[t]));const n=P(t,h,m);b[e]=p[n]}return{dataId:n.write(b,i,r.dtype),shape:i,dtype:r.dtype}}},cg=ud(((e,t)=>{const n=e%t;return e<0&&t<0||e>=0&&t>=0?n:(n+t)%t})),pg=bd(Ot,cg),dg={kernelName:Ot,backendName:"cpu",kernelFunc:pg};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function hg(e){const{inputs:t,backend:n,attrs:a}=e,{logits:r}=t,{dim:s}=a,o=r.shape.length;let i=s;if(-1===i&&(i=o-1),i!==o-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${o} and dim was ${i}`);const u=y([i],r.shape),l=Jf({inputs:{x:r},backend:n,attrs:{reductionIndices:u,keepDims:!1}}),c=Ki(l.shape,u),p=zh({inputs:{x:l},backend:n,attrs:{shape:c}}),d=vh({inputs:{a:r,b:p},backend:n}),h=Dd({inputs:{x:d},backend:n}),m=sg({inputs:{x:h},backend:n,attrs:{axis:u,keepDims:!1}}),f=zh({inputs:{x:m},backend:n,attrs:{shape:c}}),g=cf({inputs:{a:h,b:f},backend:n});return n.disposeIntermediateTensorInfo(l),n.disposeIntermediateTensorInfo(p),n.disposeIntermediateTensorInfo(d),n.disposeIntermediateTensorInfo(h),n.disposeIntermediateTensorInfo(m),n.disposeIntermediateTensorInfo(f),g}const mg={kernelName:Nn,backendName:"cpu",kernelFunc:hg};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const fg={kernelName:Ct,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{logits:r}=t,{numSamples:s,seed:o,normalized:i}=a;rd(r,"multinomial");const u=i?r:hg({inputs:{logits:r},backend:n,attrs:{dim:-1}}),l=u.shape[0],c=u.shape[1],p=n.data.get(u.dataId).values,h=[l,s],m=z(d(h),"int32");for(let e=0;e<l;++e){const t=e*c,n=new Float32Array(c-1);n[0]=p[t];for(let e=1;e<n.length;++e)n[e]=n[e-1]+p[t+e];const a=el.alea(o.toString()),r=e*s;for(let e=0;e<s;++e){const t=a();m[r+e]=n.length;for(let a=0;a<n.length;a++)if(t<n[a]){m[r+e]=a;break}}}return i||n.disposeIntermediateTensorInfo(u),n.makeTensorInfo(h,"int32",m)}},gg=Cc;
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const yg={kernelName:Lt,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{boxes:r,scores:s}=t,{maxOutputSize:o,iouThreshold:i,scoreThreshold:u}=a;rd(r,"NonMaxSuppression");const l=n.data.get(r.dataId).values,c=n.data.get(s.dataId).values,{selectedIndices:p}=gg(l,c,o,i,u);return n.makeTensorInfo([p.length],"int32",new Int32Array(p))}},bg=Rc;
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const kg={kernelName:Pt,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{boxes:r,scores:s}=t,{maxOutputSize:o,iouThreshold:i,scoreThreshold:u,padToMaxOutputSize:l}=a;rd(r,"NonMaxSuppressionPadded");const c=n.data.get(r.dataId).values,p=n.data.get(s.dataId).values,{selectedIndices:d,validOutputs:h}=bg(c,p,o,i,u,l);return[n.makeTensorInfo([d.length],"int32",new Int32Array(d)),n.makeTensorInfo([],"int32",new Int32Array([h]))]}},xg=zc;
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const wg={kernelName:Vt,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{boxes:r,scores:s}=t,{maxOutputSize:o,iouThreshold:i,scoreThreshold:u,softNmsSigma:l}=a;rd(r,"NonMaxSuppressionWithScore");const c=n.data.get(r.dataId).values,p=n.data.get(s.dataId).values,d=o,h=i,m=u,f=l,{selectedIndices:g,selectedScores:y}=xg(c,p,d,h,m,f);return[n.makeTensorInfo([g.length],"int32",new Int32Array(g)),n.makeTensorInfo([y.length],"float32",new Float32Array(y))]}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ng={kernelName:Ht,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{indices:r}=t,{depth:s,onValue:o,offValue:i}=a;rd(r,"oneHot");const u=d(r.shape),l=new Float32Array(u*s);l.fill(i);const c=n.data.get(r.dataId).values;for(let e=0;e<u;++e)c[e]>=0&&c[e]<s&&(l[e*s+c[e]]=o);return n.makeTensorInfo([...r.shape,s],"int32",l)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function vg(e){const{inputs:t,backend:n}=e,{x:a}=t;if("string"===a.dtype)throw new Error("zerosLike is not supported for string tensors");if("complex64"===a.dtype){const e=md({inputs:{input:a},backend:n}),t=vg({inputs:{x:e},backend:n}),r=wm({inputs:{input:a},backend:n}),s=vg({inputs:{x:r},backend:n}),o=ld({inputs:{real:t,imag:s},backend:n});return n.disposeIntermediateTensorInfo(e),n.disposeIntermediateTensorInfo(t),n.disposeIntermediateTensorInfo(r),n.disposeIntermediateTensorInfo(s),o}return gf({backend:n,attrs:{shape:a.shape,value:0,dtype:a.dtype}})}const Tg={kernelName:Rn,backendName:"cpu",kernelFunc:vg};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ig={kernelName:Wt,backendName:"cpu",kernelFunc:function e(t){const{inputs:n,backend:a}=t,{x:r}=n;if("string"===r.dtype)throw new Error("onesLike is not supported for string tensors");if("complex64"===r.dtype){const t=md({inputs:{input:r},backend:a}),n=e({inputs:{x:t},backend:a}),s=wm({inputs:{input:r},backend:a}),o=vg({inputs:{x:s},backend:a}),i=ld({inputs:{real:n,imag:o},backend:a});return a.disposeIntermediateTensorInfo(t),a.disposeIntermediateTensorInfo(n),a.disposeIntermediateTensorInfo(s),a.disposeIntermediateTensorInfo(o),i}return gf({backend:a,attrs:{shape:r.shape,value:1,dtype:r.dtype}})}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sg(e){const{inputs:t,backend:n,attrs:a}=e,{axis:r}=a;if(1===t.length)return of({inputs:{input:t[0]},backend:n,attrs:{dim:r}});const s=t[0].shape,o=t[0].dtype;t.forEach((e=>{l(s,e.shape,"All tensors passed to stack must have matching shapes"),u(o===e.dtype,(()=>"All tensors passed to stack must have matching dtypes"))}));const i=[],c=vm({inputs:t.map((e=>{const t=of({inputs:{input:e},backend:n,attrs:{dim:r}});return i.push(t),t})),backend:n,attrs:{axis:r}});return i.forEach((e=>n.disposeIntermediateTensorInfo(e))),c}const Eg={kernelName:qt,backendName:"cpu",kernelFunc:Sg};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const _g={kernelName:jt,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{paddings:s,constantValue:o}=a;rd(r,"pad");const i=s.map(((e,t)=>e[0]+r.shape[t]+e[1])),u=s.map((e=>e[0])),l=n.data.get(r.dataId).values,c=d(r.shape),p=r.shape.length,h=F(r.shape),m=d(i),f=i.length,g=F(i),y=k(r.dtype,m);0!==o&&y.fill(o);for(let e=0;e<c;e++){y[P(V(e,p,h).map(((e,t)=>e+u[t])),f,g)]=l[e]}return{dataId:n.write(y,i,r.dtype),shape:i,dtype:r.dtype}}},Mg=ud(((e,t)=>Math.pow(e,t))),Ag=bd(Ut,Mg),$g={kernelName:Ut,backendName:"cpu",kernelFunc:Ag};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Dg={kernelName:Yt,backendName:"cpu",kernelFunc:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e){const{backend:t,attrs:n}=e,{start:a,stop:r,dtype:s,step:o}=n,i=function(e,t,n,a){if(e===t||e<t&&n<0||t<e&&n>1)return z(0,a);const r=z(Math.abs(Math.ceil((t-e)/n)),a);t<e&&1===n&&(n=-1),r[0]=e;for(let e=1;e<r.length;e++)r[e]=r[e-1]+n;return r}(a,r,o,s);return t.makeTensorInfo([i.length],s,i)}},Fg=Sd(Xt,(e=>1/e)),Og={kernelName:Xt,backendName:"cpu",kernelFunc:Fg};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Cg={kernelName:nn,backendName:"cpu",kernelFunc:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e){const{inputs:t,backend:n,attrs:a}=e,{images:r}=t,{alignCorners:s,halfPixelCenters:o,size:i}=a;rd(r,"resizeBilinear");const u=F(r.shape),[l,c]=i,[p,h,m,f]=r.shape,g=n.data.get(r.dataId).values,y=new Float32Array(d([p,l,c,f])),b=[s&&l>1?h-1:h,s&&c>1?m-1:m],k=[s&&l>1?l-1:l,s&&c>1?c-1:c];let x=0;const w=b[0]/k[0],N=b[1]/k[1];for(let e=0;e<p;e++)for(let t=0;t<l;t++){let n;n=o?w*(t+.5)-.5:w*t;const a=Math.max(0,Math.floor(n)),r=n-a,s=Math.min(h-1,Math.ceil(n)),i=e*u[0]+a*u[1],l=e*u[0]+s*u[1];for(let e=0;e<c;e++){let t;t=o?N*(e+.5)-.5:N*e;const n=Math.max(0,Math.floor(t)),a=t-n,s=Math.min(m-1,Math.ceil(t)),c=i+n*u[2],p=l+n*u[2],d=i+s*u[2],h=l+s*u[2];for(let e=0;e<f;e++){const t=g[c+e],n=g[p+e],s=t+(g[d+e]-t)*a,o=s+(n+(g[h+e]-n)*a-s)*r;y[x++]=o}}}return n.makeTensorInfo([p,l,c,f],"float32",y)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Rg={kernelName:an,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{images:r,dy:s}=t,{alignCorners:o}=a;rd([s,r],"resizeBilinearGrad");const i=F(r.shape),[u,l,c,p]=r.shape,[,d,h]=s.shape,m=new Float32Array(u*l*c*p),f=[o&&d>1?l-1:l,o&&h>1?c-1:c],g=[o&&d>1?d-1:d,o&&h>1?h-1:h],y=f[0]/g[0],b=f[1]/g[1],k=n.data.get(s.dataId).values;let x=0;for(let e=0;e<u;e++){const t=e*i[0];for(let e=0;e<d;e++){const n=e*y,a=Math.floor(n),r=Math.min(Math.ceil(n),l-1),s=t+a*i[1],o=t+r*i[1],u=n-a,d=1-u;for(let e=0;e<h;e++){const t=e*b,n=Math.floor(t),a=Math.min(Math.ceil(t),c-1),r=t-n,l=1-r,h=s+n*i[2],f=s+a*i[2],g=o+n*i[2],y=o+a*i[2],w=d*l,N=d*r,v=u*l,T=u*r;for(let e=0;e<p;e++){const t=k[x++];m[h+e]+=t*w,m[f+e]+=t*N,m[g+e]+=t*v,m[y+e]+=t*T}}}}return n.makeTensorInfo([u,c,l,p],"float32",m)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const zg={kernelName:en,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{images:r}=t,{alignCorners:s,halfPixelCenters:o,size:i}=a;rd(r,"resizeNearestNeighbor");const u=F(r.shape),[l,c]=i,[p,d,h,m]=r.shape,f=n.data.get(r.dataId).values,g=new Float32Array(p*l*c*m),y=[s&&l>1?d-1:d,s&&c>1?h-1:h],b=[s&&l>1?l-1:l,s&&c>1?c-1:c],k=y[0]/b[0],x=y[1]/b[1];let w=0;for(let e=0;e<p;e++){const t=e*u[0];for(let e=0;e<l;e++){const n=o?k*(e+.5):k*e;let a=Math.min(d-1,s?Math.round(n):Math.floor(n));o&&(a=Math.max(0,a));const r=t+a*u[1];for(let e=0;e<c;e++){const t=o?x*(e+.5):x*e;let n=Math.min(h-1,s?Math.round(t):Math.floor(t));o&&(n=Math.max(0,n));const a=r+n*u[2];for(let e=0;e<m;e++){const t=f[a+e];g[w++]=t}}}}return n.makeTensorInfo([p,l,c,m],r.dtype,g)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Bg={kernelName:tn,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{images:r,dy:s}=t,{alignCorners:o}=a;rd([s,r],"resizeNearestNeighborGrad");const i=F(r.shape),u=F(s.shape),[l,c,p,d]=r.shape,[,h,m]=s.shape,f=new Float32Array(l*c*p*d),g=n.data.get(s.dataId).values,y=[o&&h>1?c-1:c,o&&m>1?p-1:p],b=[o&&h>1?h-1:h,o&&m>1?m-1:m],k=y[0]/b[0],x=y[1]/b[1],w=1/k,N=1/x,v=2*Math.ceil(w)+2,T=2*Math.ceil(N)+2;for(let e=0;e<l;e++){const t=e*i[0];for(let e=0;e<c;e++){const n=t+e*i[1],a=Math.floor(e*w),r=Math.floor(a-v/2);for(let a=0;a<p;a++){const s=n+a*i[2],l=Math.floor(a*N),y=Math.floor(l-T/2);for(let n=0;n<d;n++){let i=0;for(let s=0;s<v;s++){const l=s+r;if(l<0||l>=h)continue;const d=t+l*u[1],f=l*k;if(e===Math.min(c-1,o?Math.round(f):Math.floor(f)))for(let e=0;e<T;e++){const t=e+y;if(t<0||t>=m)continue;const r=d+t*u[2],s=t*x;a===Math.min(p-1,o?Math.round(s):Math.floor(s))&&(i+=g[r+n])}}f[s+n]=i}}}}return n.makeTensorInfo(r.shape,r.dtype,f)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Lg={kernelName:sn,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{dims:s}=a;rd(r,"reverse");const o=r.shape.length,i=y(s,r.shape);if(0===o)return dd({inputs:{x:r},backend:n});const u=new ha(r.shape,r.dtype),l=n.bufferSync(r);for(let e=0;e<u.size;e++){const t=u.indexToLoc(e),n=t.slice();i.forEach((e=>n[e]=r.shape[e]-1-n[e])),u.set(l.get(...n),...t)}return n.makeTensorInfo(u.shape,u.dtype,u.values)}},Pg={kernelName:Ln,backendName:"cpu",kernelFunc:({inputs:e,attrs:t,backend:n})=>{const{image:a}=e,{radians:r,fillValue:s,center:o}=t,i=n,u=k(a.dtype,d(a.shape)),[l,c,p,h]=a.shape,[m,f]=Ep(o,c,p),g=Math.sin(r),y=Math.cos(r),b=i.data.get(a.dataId).values;for(let e=0;e<l;e++){const t=e*p*c*h;for(let e=0;e<c;e++){const n=e*(p*h);for(let a=0;a<p;a++){const r=a*h;for(let o=0;o<h;o++){const i=[l,e,a,o],d=i[2],k=i[1];let x=(d-m)*y-(k-f)*g,w=(d-m)*g+(k-f)*y;x=Math.round(x+m),w=Math.round(w+f);let N=s;if("number"!=typeof s&&(N=3===o?255:s[o]),x>=0&&x<p&&w>=0&&w<c){N=b[t+w*(p*h)+x*h+o]}u[t+n+r+o]=N}}}}return{dataId:i.write(u,a.shape,a.dtype),shape:a.shape,dtype:a.dtype}}},Vg=Sd(on,(e=>{const t=Math.floor(e);return e-t<.5?Math.floor(e):e-t>.5?Math.ceil(e):t%2==0?t:t+1})),Wg={kernelName:on,backendName:"cpu",kernelFunc:Vg};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function Hg(e,t,n,a,r,s,o,i,u,l){const c=[a/r,r],p=e.values,d=t.values;if(0===a)return Or(n,t.dtype);const h=Or(c,t.dtype);h.values.fill(u);for(let e=0;e<s;e++){const s=[];let u=0;for(let t=0;t<o;t++){const n=p[e*o+t];s.push(n),u+=n*i[t]}if(u<0||u>=a/r)throw new Error(`Invalid indices: ${s} does not index into ${n}`);for(let n=0;n<r;n++)l?h.values[u*r+n]+=d[e*r+n]:h.values[u*r+n]=0===t.rank?d[0]:d[e*r+n]}return h}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const qg={kernelName:ln,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{indices:r,updates:s}=t,{shape:o}=a,{sliceRank:i,numUpdates:u,sliceSize:l,strides:c,outputSize:p}=cs(0,r,o),d=Hg(n.bufferSync(r),n.bufferSync(s),o,p,l,u,i,c,0,!0);return n.makeTensorInfo(o,d.dtype,d.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const jg={kernelName:cn,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n}=e,{condition:a,t:r,e:s}=t;rd([a,r,s],"select");const o=a.shape.length,i=n.data.get(a.dataId).values,u=n.data.get(r.dataId).values,l=n.data.get(s.dataId).values,c=Ta(r.dtype,s.dtype),p=z(d(r.shape),c);let h=0;const m=0===o||o>1||1===r.shape.length?1:d(r.shape.slice(1));for(let e=0;e<i.length;e++)for(let t=0;t<m;t++)1===i[e]?p[h++]=u[e]:p[h++]=l[e];return n.makeTensorInfo(r.shape,c,p)}},Ug=Fp,Kg=Op,Gg=Sd(pn,(e=>e>=0?Kg*e:Ug*(Math.exp(e)-1))),Yg={kernelName:pn,backendName:"cpu",kernelFunc:Gg},Qg=Sd(gn,(e=>1/(1+Math.exp(-e)))),Xg={kernelName:gn,backendName:"cpu",kernelFunc:Qg},Jg=Sd(fn,(e=>e<0?-1:e>0?1:0)),Zg={kernelName:fn,backendName:"cpu",kernelFunc:Jg},ey=Sd(hn,(e=>Math.sin(e))),ty={kernelName:hn,backendName:"cpu",kernelFunc:ey},ny=Sd(mn,(e=>Math.sinh(e))),ay={kernelName:mn,backendName:"cpu",kernelFunc:ny},ry=Math.log(1.1920928955078125e-7)+2,sy=Sd(yn,(e=>{const t=e>-ry,n=e<ry,a=Math.exp(e);let r;return r=n?a:t?e:Math.log(1+a),r})),oy={kernelName:yn,backendName:"cpu",kernelFunc:sy};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const iy={kernelName:xn,backendName:"cpu",kernelFunc:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{blockShape:s,paddings:o}=a;rd([r],"spaceToBatchND");const i=d(s),u=[[0,0]];u.push(...o);for(let e=1+s.length;e<r.shape.length;++e)u.push([0,0]);const l=_g.kernelFunc({inputs:{x:r},backend:n,attrs:{paddings:u,constantValue:0}}),c=_p(l.shape,s,i,!1),p=Mp(c.length,s.length,!1),h=Ap(l.shape,s,i,!1),m=zh({inputs:{x:l},backend:n,attrs:{shape:c}}),f=ch({inputs:{x:m},backend:n,attrs:{perm:p}}),g=zh({inputs:{x:f},backend:n,attrs:{shape:h}});return n.disposeIntermediateTensorInfo(l),n.disposeIntermediateTensorInfo(m),n.disposeIntermediateTensorInfo(f),g}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const uy={kernelName:Sn,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{sparseIndices:r,sparseValues:s,defaultValue:o}=t,{outputShape:i}=a,{sliceRank:u,numUpdates:l,sliceSize:c,strides:p,outputSize:d}=cs(0,r,i),h=Hg(n.bufferSync(r),n.bufferSync(s),i,d,c,l,u,p,n.data.get(o.dataId).values[0],!1);return n.makeTensorInfo(i,h.dtype,h.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ly={kernelName:wn,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{numOrSizeSplits:s,axis:o}=a,i=y(o,r.shape)[0],u=Qp(r,s,i),l=new Array(r.shape.length).fill(0),c=r.shape.slice();return u.map((e=>{const t=[...c];t[i]=e;const a=gh({inputs:{x:r},backend:n,attrs:{begin:l,size:t}});return l[i]+=e,a}))}},cy=Sd(bn,(e=>Math.sqrt(e))),py={kernelName:bn,backendName:"cpu",kernelFunc:cy},dy={kernelName:Tn,backendName:"cpu",kernelFunc:({inputs:e,backend:t})=>{const{x:n}=e,a=t;rd(n,"square");const r=a.data.get(n.dataId).values,s=new Float32Array(r.length);for(let e=0;e<r.length;++e){const t=r[e];s[e]=t*t}return{dataId:a.write(s,n.shape,n.dtype),shape:n.shape,dtype:n.dtype}}},hy=Sd(zn,((e,t)=>{const n=t;return isNaN(e)?NaN:e>0?1:n.alpha})),my={kernelName:zn,backendName:"cpu",kernelFunc:hy};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const fy={kernelName:En,backendName:"cpu",kernelFunc:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{begin:s,end:o,strides:i,beginMask:u,endMask:l,ellipsisMask:c,newAxisMask:p,shrinkAxisMask:d}=a;rd(r,"stridedSlice");const{nonStrided:h,$begin:m,$strides:f,size:g,newShape:y,outShape:b}=Es(r.shape,s,o,i,u,l,c,p,d),k=zh({inputs:{x:r},backend:n,attrs:{shape:y}});let x;if(h){const e=gh({inputs:{x:k},backend:n,attrs:{begin:m,size:g}});x=zh({inputs:{x:e},backend:n,attrs:{shape:b}}),n.disposeIntermediateTensorInfo(e)}else if(b.some((e=>0===e)))x=n.makeTensorInfo(b,r.dtype,[]);else{const e=
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e,t,n,a){const r=Or(e,t.dtype);for(let e=0;e<r.size;e++){const s=r.indexToLoc(e),o=new Array(s.length);for(let e=0;e<o.length;e++)o[e]=s[e]*n[e]+a[e];r.set(t.get(...o),...s)}return r}(b,n.bufferSync(k),f,m);x=n.makeTensorInfo(e.shape,e.dtype,e.values)}const w=zh({inputs:{x:x},backend:n,attrs:{shape:b}});return n.disposeIntermediateTensorInfo(k),n.disposeIntermediateTensorInfo(x),w}},gy=Sd(_n,(e=>Math.tan(e))),yy={kernelName:_n,backendName:"cpu",kernelFunc:gy},by=Sd(Mn,(e=>Math.tanh(e)));
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ky={kernelName:An,backendName:"cpu",kernelFunc:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{reps:s}=a;rd(r,"tile");const o=
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function(e,t){const n=new Array(e.rank);for(let a=0;a<n.length;a++)n[a]=e.shape[a]*t[a];const a=Or(n,e.dtype);for(let t=0;t<a.values.length;++t){const n=a.indexToLoc(t),r=new Array(e.rank);for(let t=0;t<r.length;t++)r[t]=n[t]%e.shape[t];const s=e.locToIndex(r);a.values[t]=e.values[s]}return a}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */(n.bufferSync(r),s);return n.makeTensorInfo(o.shape,o.dtype,o.values)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const xy={kernelName:$n,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r}=t,{k:s,sorted:o}=a;rd(r,"topk");const i=n.data.get(r.dataId).values,[u,l]=function(e,t,n,a,r){const s=t[t.length-1],[o,i]=[e.length/s,s],u=k(n,o*a),l=k("int32",o*a);for(let t=0;t<o;t++){const n=t*i,r=e.subarray(n,n+i),s=[];for(let e=0;e<r.length;e++)s.push({value:r[e],index:e});s.sort(((e,t)=>t.value-e.value));const o=t*a,c=u.subarray(o,o+a),p=l.subarray(o,o+a);for(let e=0;e<a;e++)c[e]=s[e].value,p[e]=s[e].index}const c=t.slice();return c[c.length-1]=a,[Or(c,n,u),Or(c,"int32",l)]}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */(i,r.shape,r.dtype,s);return[n.makeTensorInfo(u.shape,u.dtype,u.values),n.makeTensorInfo(l.shape,l.dtype,l.values)]}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const wy={kernelName:Fn,backendName:"cpu",kernelFunc:function(e){const{inputs:t,attrs:n,backend:a}=e,{axis:r}=n,{x:s}=t;rd(s,"unique");const o=a.data.get(s.dataId).values,{outputValues:i,outputShape:u,indices:l}=function(e,t,n,a){const r=y(t,n)[0],s=[1,n[0],1];for(let e=0;e<r;e++)s[0]*=n[e];s[1]=n[r];for(let e=r+1;e<n.length;e++)s[2]*=n[e];const o={},i=new Int32Array(n[r]),u=new ha(s,a,e),l=[],c=1===s[0]&&1===s[2];for(let t=0;t<n[r];t++){let n;if(c)n=e[t].toString();else{const e=[];for(let n=0;n<s[0];n++)for(let a=0;a<s[2];a++)e.push(u.get(n,t,a));n=e.join(",")}if(void 0!==o[n])i[t]=o[n];else{const e=Object.keys(o).length;o[n]=e,i[t]=e,l.push(t)}}const p=s.slice();p[1]=Object.keys(o).length;const d=new ha(p,a);l.forEach(((e,t)=>{for(let n=0;n<s[0];n++)for(let a=0;a<s[2];a++)d.set(u.get(n,e,a),n,t,a)}));const h=n.slice();return h[r]=p[1],{outputValues:d.values,outputShape:h,indices:i}}(o,r,s.shape,s.dtype);return[a.makeTensorInfo(u,s.dtype,i),a.makeTensorInfo([l.length],"int32",l)]}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ny={kernelName:On,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{value:r}=t;let{axis:s}=a;s<0&&(s+=r.shape.length);const o=r.shape.length,i=r.shape[s],u=new Array(o-1);let l=0;for(let e=0;e<o;e++)e!==s&&(u[l++]=r.shape[e]);const c=new Array(o).fill(0),p=r.shape.slice();p[s]=1;const d=new Array(i);for(let e=0;e<d.length;e++){c[s]=e;const t=gh({inputs:{x:r},backend:n,attrs:{begin:c,size:p}});d[e]=zh({inputs:{x:t},backend:n,attrs:{shape:u}}),n.disposeIntermediateTensorInfo(t)}return d}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const vy={kernelName:Cn,backendName:"cpu",kernelFunc:function(e){const{inputs:t,backend:n,attrs:a}=e,{x:r,segmentIds:s}=t,{numSegments:o}=a;rd(r,"unsortedSegmentSum");const i=[],u=[],l=r.shape.length-s.shape.length;let c=s;for(let e=0;e<l;++e){const t=of({inputs:{input:c},backend:n,attrs:{dim:e+1}});c=t,u.push(t)}for(let e=0;e<o;++e){const t=Qn(e,"int32"),a=n.makeTensorInfo([],"int32",t),s=Qm({inputs:{a:a,b:c},backend:n}),o=gd({inputs:{x:s},backend:n,attrs:{dtype:"float32"}}),l=ah({inputs:{a:o,b:r},backend:n}),p=sg({inputs:{x:l},backend:n,attrs:{axis:0,keepDims:!1}});i.push(p),u.push(a),u.push(s),u.push(o),u.push(l),u.push(p)}const p=Sg({inputs:i,backend:n,attrs:{axis:0}});return u.forEach((e=>n.disposeIntermediateTensorInfo(e))),p}},Ty=[Vh,id,Hh,jh,vd,Uh,Kh,Gh,Yh,Qh,Jh,em,nm,sm,im,pm,dm,hm,mm,Ph,fm,gm,ym,yd,Ad,km,cd,xm,Tm,Em,_m,Sm,Am,$m,Mm,Fm,Cm,Rm,zm,Bm,Lm,Vm,Wm,Hm,qm,jm,Km,Um,pf,Sh,Gm,Xm,sf,Fd,uf,Rd,ff,yf,bf,Ld,wf,Nf,vf,Tf,If,Wd,_f,hd,Mf,Nm,$f,Ff,Cf,_h,jd,Bf,Lf,Gd,Vf,qf,Uf,Yf,Qf,Xf,Xd,eg,tg,ng,ag,rg,Zf,ig,ug,eh,lg,dg,fg,rh,sh,yg,kg,wg,uh,Ng,Ig,Eg,_g,$g,$h,dh,Dg,fd,Og,Fh,Ch,Bh,Cg,Rg,zg,Bg,Lg,Pg,Wg,fh,qg,jg,Yg,Xg,Zg,ty,ay,yh,mg,oy,iy,uy,ly,py,dy,xh,my,fy,Th,og,yy,{kernelName:Mn,backendName:"cpu",kernelFunc:by},ky,xy,ph,wy,Ny,vy,Tg];
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */for(const e of Ty)Gn(e);
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * =============================================================================
 */
var Iy,Sy;j().registerFlag("KEEP_INTERMEDIATE_TENSORS",(()=>!1),(e=>{e&&console.warn("Keep intermediate tensors is ON. This will print the values of all intermediate tensors during model inference. Not all models support this mode. For details, check e2e/benchmarks/ model_config.js. This significantly impacts performance.")})),function(e){e[e.DT_INVALID=0]="DT_INVALID",e[e.DT_FLOAT=1]="DT_FLOAT",e[e.DT_DOUBLE=2]="DT_DOUBLE",e[e.DT_INT32=3]="DT_INT32",e[e.DT_UINT8=4]="DT_UINT8",e[e.DT_INT16=5]="DT_INT16",e[e.DT_INT8=6]="DT_INT8",e[e.DT_STRING=7]="DT_STRING",e[e.DT_COMPLEX64=8]="DT_COMPLEX64",e[e.DT_INT64=9]="DT_INT64",e[e.DT_BOOL=10]="DT_BOOL",e[e.DT_QINT8=11]="DT_QINT8",e[e.DT_QUINT8=12]="DT_QUINT8",e[e.DT_QINT32=13]="DT_QINT32",e[e.DT_BFLOAT16=14]="DT_BFLOAT16",e[e.DT_QINT16=15]="DT_QINT16",e[e.DT_QUINT16=16]="DT_QUINT16",e[e.DT_UINT16=17]="DT_UINT16",e[e.DT_COMPLEX128=18]="DT_COMPLEX128",e[e.DT_HALF=19]="DT_HALF",e[e.DT_RESOURCE=20]="DT_RESOURCE",e[e.DT_VARIANT=21]="DT_VARIANT",e[e.DT_UINT32=22]="DT_UINT32",e[e.DT_UINT64=23]="DT_UINT64",e[e.DT_FLOAT_REF=101]="DT_FLOAT_REF",e[e.DT_DOUBLE_REF=102]="DT_DOUBLE_REF",e[e.DT_INT32_REF=103]="DT_INT32_REF",e[e.DT_UINT8_REF=104]="DT_UINT8_REF",e[e.DT_INT16_REF=105]="DT_INT16_REF",e[e.DT_INT8_REF=106]="DT_INT8_REF",e[e.DT_STRING_REF=107]="DT_STRING_REF",e[e.DT_COMPLEX64_REF=108]="DT_COMPLEX64_REF",e[e.DT_INT64_REF=109]="DT_INT64_REF",e[e.DT_BOOL_REF=110]="DT_BOOL_REF",e[e.DT_QINT8_REF=111]="DT_QINT8_REF",e[e.DT_QUINT8_REF=112]="DT_QUINT8_REF",e[e.DT_QINT32_REF=113]="DT_QINT32_REF",e[e.DT_BFLOAT16_REF=114]="DT_BFLOAT16_REF",e[e.DT_QINT16_REF=115]="DT_QINT16_REF",e[e.DT_QUINT16_REF=116]="DT_QUINT16_REF",e[e.DT_UINT16_REF=117]="DT_UINT16_REF",e[e.DT_COMPLEX128_REF=118]="DT_COMPLEX128_REF",e[e.DT_HALF_REF=119]="DT_HALF_REF",e[e.DT_RESOURCE_REF=120]="DT_RESOURCE_REF",e[e.DT_VARIANT_REF=121]="DT_VARIANT_REF",e[e.DT_UINT32_REF=122]="DT_UINT32_REF",e[e.DT_UINT64_REF=123]="DT_UINT64_REF"}(Iy||(Iy={})),function(e){var t;(t=e.CheckpointFormatVersion||(e.CheckpointFormatVersion={}))[t.LEGACY=0]="LEGACY",t[t.V1=1]="V1",t[t.V2=2]="V2"}(Sy||(Sy={}));
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const Ey={};function _y(e){return Ey[e]}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function My(e,t,n,a,r){const s=t.inputParams[e];if(s&&void 0!==s.inputIndexStart){const e=s.inputIndexStart,o=0===s.inputIndexEnd?void 0:void 0===s.inputIndexEnd?e+1:s.inputIndexEnd;if("tensor"===s.type)return Ay(t.inputNames[s.inputIndexStart],n,a,r);if("tensors"===s.type){return t.inputNames.slice(e,o).map((e=>Ay(e,n,a,r)))}const i=Ay(t.inputNames.slice(e)[0],n,a,r),u=i.dataSync();return"number"===s.type?u[0]:C(i.shape,u)}const o=t.attrParams[e];return o&&o.value}function Ay(e,t,n,a){const[r,s]=Fy(e);if(null!=a){const e=a.getHashTableHandleByName(r);if(null!=e)return e}const o=n.currentContextIds.find((e=>!!t[Dy(r,e)]));return void 0!==o?t[Dy(r,o)][s]:void 0}function $y(e,t){const[n,a,r]=Fy(e);return[Dy(n,t&&t.currentContextId),a,r]}function Dy(e,t){return t?`${e}-${t}`:e}function Fy(e){const t=e.split(":");if(1===t.length)return[e,0,void 0];const n=t[0],a=3===t.length?t[1]:void 0;return[n,Number(t[t.length-1]),a]}function Oy(e,t,n){let a=My("pad",e,t,n);if("explicit"===a){a=My("explicitPaddings",e,t,n);const r=[[0,0],[0,0],[0,0],[0,0]];for(let e=0;e<4;e++)r[e][0]=a[2*e],r[e][1]=a[2*e+1];return r}return a}function Cy(e){return e.kept?e:Rr(e)}
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Ry=Object.freeze({__proto__:null,json:[{tfOpName:"Add",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AddV2",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AddN",category:"arithmetic",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}]},{tfOpName:"BiasAdd",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"Sub",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"RealDiv",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Div",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"DivNoNan",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"FloorDiv",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Mul",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Maximum",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Minimum",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Pow",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SquaredDifference",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Mod",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"FloorMod",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var zy=Object.freeze({__proto__:null,json:[{tfOpName:"Abs",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Acos",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Asin",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atan2",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Ceil",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ClipByValue",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"clipValueMin",type:"number"},{start:2,name:"clipValueMax",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Complex",category:"basic_math",inputs:[{start:0,name:"real",type:"tensor"},{start:1,name:"imag",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ComplexAbs",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cos",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cosh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Elu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Exp",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Floor",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Log",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Imag",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"Tout",name:"outputType",type:"dtype",notSupported:!0}]},{tfOpName:"Neg",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Real",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"Tout",name:"outputType",type:"dtype",notSupported:!0}]},{tfOpName:"Prelu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"alpha",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Relu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Relu6",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Selu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sigmoid",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sin",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sinh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sqrt",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Rsqrt",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Square",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Tan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Tanh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sign",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Round",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Expm1",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Log1p",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Reciprocal",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Softplus",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Asinh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Acosh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atanh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Erf",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Prod",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axes",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool",notSupported:!0},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LeakyRelu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"alpha",name:"alpha",type:"number",defaultValue:.2},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"IsNan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var By=Object.freeze({__proto__:null,json:[{tfOpName:"EmptyTensorList",category:"control",inputs:[{start:0,name:"elementShape",type:"shape"},{start:1,name:"maxNumElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"LoopCond",category:"control",inputs:[{start:0,name:"pred",type:"tensor"}]},{tfOpName:"Switch",category:"control",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"pred",type:"tensor"}]},{tfOpName:"Merge",category:"control",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}]},{tfOpName:"Enter",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"frame_name",name:"frameName",type:"string"},{tfName:"is_constant",name:"isConstant",type:"bool"}]},{tfOpName:"Exit",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"NextIteration",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayV3",category:"control",inputs:[{start:0,name:"size",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"dynamic_size",name:"dynamicSize",type:"bool"},{tfName:"clear_after_read",name:"clearAfterRead",type:"bool"},{tfName:"identical_element_shapes",name:"identicalElementShapes",type:"bool"},{tfName:"tensor_array_name",name:"name",type:"string"}]},{tfOpName:"TensorArrayWriteV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"tensor",type:"tensor"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayReadV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayGatherV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape",name:"elementShape",type:"shape"}]},{tfOpName:"TensorArrayScatterV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"tensor",type:"tensor"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"TensorArrayConcatV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape_except0",name:"elementShapeExcept0",type:"shape",notSupported:!0}]},{tfOpName:"TensorArraySplitV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"tensor",type:"tensor"},{start:2,name:"lengths",type:"number[]"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"TensorArraySizeV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"flowIn",type:"number"}]},{tfOpName:"TensorArrayCloseV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"}]},{tfOpName:"StatelessIf",category:"control",inputs:[{start:0,name:"cond",type:"tensor"},{start:1,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"then_branch",name:"thenBranch",type:"func"},{tfName:"else_branch",name:"elseBranch",type:"func"}]},{tfOpName:"If",category:"control",inputs:[{start:0,name:"cond",type:"tensor"},{start:1,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"then_branch",name:"thenBranch",type:"func"},{tfName:"else_branch",name:"elseBranch",type:"func"}]},{tfOpName:"StatelessWhile",category:"control",inputs:[{start:0,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"cond",name:"cond",type:"func"},{tfName:"body",name:"body",type:"func"}]},{tfOpName:"While",category:"control",inputs:[{start:0,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"cond",name:"cond",type:"func"},{tfName:"body",name:"body",type:"func"}]},{tfOpName:"TensorListScatter",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListScatterV2",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"},{start:3,name:"numElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListGather",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListGetItem",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListSetItem",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"tensor",type:"tensor"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListReserve",category:"control",inputs:[{start:0,name:"elementShape",type:"shape"},{start:1,name:"numElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListFromTensor",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListStack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"},{tfName:"num_elements",name:"numElements",type:"dtype"}]},{tfOpName:"TensorListSplit",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"elementShape",type:"shape"},{start:2,name:"lengths",type:"number[]"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListConcat",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}],attrs:[{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListConcatV2",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}],attrs:[{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListPopBack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListPushBack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"tensor",type:"tensor"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListLength",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}]},{tfOpName:"TensorListResize",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"size",type:"number"}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Ly=Object.freeze({__proto__:null,json:[{tfOpName:"AvgPool",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPool",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[],notSupported:!0},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPoolWithArgmax",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"include_batch_in_index",name:"includeBatchInIndex",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AvgPool3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPool3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Conv1D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"stride",name:"stride",type:"number"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NWC"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"dilation",name:"dilation",type:"number",defaultValue:1}]},{tfOpName:"Conv2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"useCudnnOnGpu",name:"useCudnnOnGpu",type:"bool"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"_FusedConv2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"use_cudnn_on_gpu",name:"useCudnnOnGpu",type:"bool",defaultValue:!0},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]",defaultValue:[1,1,1,1]},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:1e-4},{tfName:"leakyrelu_alpha",name:"leakyreluAlpha",type:"number",defaultValue:.2}]},{tfOpName:"Conv2DBackpropInput",category:"convolution",inputs:[{start:2,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:0,name:"outputShape",type:"number[]"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]",notSupported:!0}]},{tfOpName:"DepthwiseConv2d",category:"convolution",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"DepthwiseConv2dNative",category:"convolution",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"FusedDepthwiseConv2dNative",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]",defaultValue:[1,1,1,1]},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]}]},{tfOpName:"Conv3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"Dilation2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"rates",name:"dilations",type:"number[]"},{tfName:"padding",name:"pad",type:"string"}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Py=Object.freeze({__proto__:null,json:[{tfOpName:"Fill",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"},{start:1,name:"value",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"LinSpace",category:"creation",inputs:[{start:0,name:"start",type:"number"},{start:1,name:"stop",type:"number"},{start:2,name:"num",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"OneHot",category:"creation",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"depth",type:"number"},{start:2,name:"onValue",type:"number",defaultValue:1},{start:3,name:"offValue",type:"number",defaultValue:0}],attrs:[{tfName:"axis",name:"axis",type:"number",notSupported:!0},{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"Ones",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"OnesLike",category:"creation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"RandomStandardNormal",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"RandomUniform",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"minval",name:"minval",type:"number",defaultValue:0},{tfName:"maxval",name:"maxval",type:"number",defaultValue:1},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"Range",category:"creation",inputs:[{start:0,name:"start",type:"number"},{start:1,name:"stop",type:"number"},{start:2,name:"step",type:"number",defaultValue:0}],attrs:[{tfName:"Tidx",name:"dtype",type:"dtype"}]},{tfOpName:"TruncatedNormal",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"means",name:"mean",type:"number",defaultValue:0},{tfName:"stddev",name:"stdDev",type:"number",defaultValue:1},{tfName:"seed",name:"seed",type:"number"},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"Zeros",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"ZerosLike",category:"creation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"Multinomial",category:"creation",inputs:[{start:0,name:"logits",type:"tensor"},{start:1,name:"numSamples",type:"number"}],attrs:[{tfName:"seed",name:"seed",type:"number"},{tfName:"seed2",name:"seed2",type:"number"},{tfName:"T",name:"dtype",type:"dtype"},{tfName:"output_dtype",name:"output_dtype",type:"dtype"}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Vy=Object.freeze({__proto__:null,json:[{tfOpName:"NonMaxSuppressionV2",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"}]},{tfOpName:"NonMaxSuppressionV3",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"}]},{tfOpName:"NonMaxSuppressionV4",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"T_threshold",name:"threshold",type:"dtype",notSupported:!0},{tfName:"pad_to_max_output_size",name:"padToMaxOutputSize",type:"bool"}]},{tfOpName:"NonMaxSuppressionV5",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"},{start:5,name:"softNmsSigma",type:"number"}]},{tfOpName:"Where",category:"dynamic",inputs:[{start:0,name:"condition",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ListDiff",category:"dynamic",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Wy=Object.freeze({__proto__:null,json:[{tfOpName:"LowerBound",category:"evaluation",inputs:[{start:0,name:"sortedSequence",type:"tensor"},{start:1,name:"values",type:"tensor"}]},{tfOpName:"TopKV2",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"k",type:"number"}],attrs:[{tfName:"sorted",name:"sorted",type:"bool"}]},{tfOpName:"UpperBound",category:"evaluation",inputs:[{start:0,name:"sortedSequence",type:"tensor"},{start:1,name:"values",type:"tensor"}]},{tfOpName:"Unique",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"UniqueV2",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Hy=Object.freeze({__proto__:null,json:[{tfOpName:"PlaceholderWithDefault",category:"graph",inputs:[{start:0,name:"default",type:"tensor"}],attrs:[{tfName:"shape",name:"shape",type:"shape"},{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"Placeholder",category:"graph",attrs:[{tfName:"shape",name:"shape",type:"shape"},{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"Const",category:"graph"},{tfOpName:"Identity",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"IdentityN",category:"graph",inputs:[{start:0,end:0,name:"x",type:"tensors"}]},{tfOpName:"Snapshot",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Rank",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Size",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Shape",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"ShapeN",category:"graph",inputs:[{start:0,end:0,name:"x",type:"tensors"}]},{tfOpName:"Print",category:"graph",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"data",type:"tensors"}],attrs:[{tfName:"message",name:"message",type:"string"},{tfName:"first_n",name:"firstN",type:"number",notSupported:!0},{tfName:"summarize",name:"summarize",type:"number",defaultValue:3}]},{tfOpName:"NoOp",category:"graph",inputs:[]},{tfOpName:"StopGradient",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"FakeQuantWithMinMaxVars",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"min",name:"min",type:"number"},{tfName:"max",name:"max",type:"number"}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var qy=Object.freeze({__proto__:null,json:[{tfOpName:"HashTable",category:"hash_table",inputs:[],attrs:[{tfName:"shared_name",name:"sharedName",type:"string"},{tfName:"use_node_name_sharing",name:"useNodeNameSharing",type:"bool"},{tfName:"key_dtype",name:"keyDType",type:"dtype"},{tfName:"value_dtype",name:"valueDType",type:"dtype"}]},{tfOpName:"HashTableV2",category:"hash_table",inputs:[],attrs:[{tfName:"shared_name",name:"sharedName",type:"string"},{tfName:"use_node_name_sharing",name:"useNodeNameSharing",type:"bool"},{tfName:"key_dtype",name:"keyDType",type:"dtype"},{tfName:"value_dtype",name:"valueDType",type:"dtype"}]},{tfOpName:"LookupTableImport",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableImportV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableFind",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableFindV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableSize",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"}]},{tfOpName:"LookupTableSizeV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var jy=Object.freeze({__proto__:null,json:[{tfOpName:"ResizeBilinear",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"size",type:"number[]"}],attrs:[{tfName:"align_corners",name:"alignCorners",type:"bool"},{tfName:"half_pixel_centers",name:"halfPixelCenters",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ResizeNearestNeighbor",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"size",type:"number[]"}],attrs:[{tfName:"align_corners",name:"alignCorners",type:"bool"},{tfName:"half_pixel_centers",name:"halfPixelCenters",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"CropAndResize",category:"image",inputs:[{start:0,name:"image",type:"tensor"},{start:1,name:"boxes",type:"tensor"},{start:2,name:"boxInd",type:"tensor"},{start:3,name:"cropSize",type:"number[]"}],attrs:[{tfName:"method",name:"method",type:"string"},{tfName:"extrapolation_value",name:"extrapolationValue",type:"number"}]},{tfOpName:"ImageProjectiveTransformV3",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"transforms",type:"tensor"},{start:2,name:"outputShape",type:"number[]"},{start:3,name:"fillValue",type:"number"}],attrs:[{tfName:"interpolation",name:"interpolation",type:"string"},{tfName:"fill_mode",name:"fillMode",type:"string"}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Uy=Object.freeze({__proto__:null,json:[{tfOpName:"Equal",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"NotEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Greater",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"GreaterEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Less",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LessEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalAnd",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalNot",category:"logical",inputs:[{start:0,name:"a",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalOr",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Select",category:"logical",inputs:[{start:0,name:"condition",type:"tensor"},{start:1,name:"a",type:"tensor"},{start:2,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SelectV2",category:"logical",inputs:[{start:0,name:"condition",type:"tensor"},{start:1,name:"a",type:"tensor"},{start:2,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Ky=Object.freeze({__proto__:null,json:[{tfOpName:"_FusedMatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:1e-4},{tfName:"transpose_a",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"transpose_b",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"leakyrelu_alpha",name:"leakyreluAlpha",type:"number",defaultValue:.2},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"transpose_a",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"transpose_b",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BatchMatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"adj_x",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"adj_y",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BatchMatMulV2",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"adj_x",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"adj_y",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Transpose",category:"matrices",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"perm",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Einsum",category:"matrices",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}],attrs:[{tfName:"equation",name:"equation",type:"string"},{tfName:"N",name:"n",type:"number",defaultValue:2},{tfName:"T",name:"dtype",type:"dtype"}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Gy=Object.freeze({__proto__:null,json:[{tfOpName:"EuclideanNorm",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool",defaultValue:!1}]},{tfOpName:"FusedBatchNorm",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"FusedBatchNormV2",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"FusedBatchNormV3",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"LRN",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"depth_radius",name:"radius",type:"number",defaultValue:5},{tfName:"bias",name:"bias",type:"number",defaultValue:1},{tfName:"alpha",name:"alpha",type:"number",defaultValue:1},{tfName:"beta",name:"beta",type:"number",defaultValue:.5}]},{tfOpName:"Softmax",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"LogSoftmax",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"SparseToDense",category:"normalization",inputs:[{start:0,name:"sparseIndices",type:"tensor"},{start:1,name:"outputShape",type:"number[]"},{start:2,name:"sparseValues",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",defaultValue:!0,notSupported:!0}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Yy=Object.freeze({__proto__:null,json:[{tfOpName:"Bincount",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"size",type:"number"},{start:2,name:"weights",type:"tensor"}]},{tfOpName:"DenseBincount",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"size",type:"number"},{start:2,name:"weights",type:"tensor"}],attrs:[{tfName:"binary_output",name:"binaryOutput",type:"bool"}]},{tfOpName:"Max",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Mean",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Min",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Sum",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"All",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Any",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"ArgMax",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"ArgMin",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"Prod",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Cumprod",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}],attrs:[{tfName:"exclusive",name:"exclusive",type:"bool"},{tfName:"reverse",name:"reverse",type:"bool"}]},{tfOpName:"Cumsum",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}],attrs:[{tfName:"exclusive",name:"exclusive",type:"bool"},{tfName:"reverse",name:"reverse",type:"bool"}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Qy=Object.freeze({__proto__:null,json:[{tfOpName:"ConcatV2",category:"slice_join",inputs:[{start:0,end:-1,name:"tensors",type:"tensors"},{start:-1,name:"axis",type:"number"}],attrs:[{tfName:"N",name:"n",type:"number",defaultValue:2}]},{tfOpName:"Concat",category:"slice_join",inputs:[{start:1,end:0,name:"tensors",type:"tensors"},{start:0,name:"axis",type:"number"}],attrs:[{tfName:"N",name:"n",type:"number",defaultValue:2}]},{tfOpName:"GatherV2",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"axis",type:"number",defaultValue:0}],attrs:[{tfName:"batch_dims",name:"batchDims",type:"number",defaultValue:0}]},{tfOpName:"Gather",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",notSupported:!0}]},{tfOpName:"Reverse",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"dims",type:"bool[]"}]},{tfOpName:"ReverseV2",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}]},{tfOpName:"Slice",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"begin",type:"number[]"},{start:2,name:"size",type:"number[]"}]},{tfOpName:"StridedSlice",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"begin",type:"number[]"},{start:2,name:"end",type:"number[]"},{start:3,name:"strides",type:"number[]"}],attrs:[{tfName:"begin_mask",name:"beginMask",type:"number",defaultValue:0},{tfName:"end_mask",name:"endMask",type:"number",defaultValue:0},{tfName:"new_axis_mask",name:"newAxisMask",type:"number",defaultValue:0},{tfName:"ellipsis_mask",name:"ellipsisMask",type:"number",defaultValue:0},{tfName:"shrink_axis_mask",name:"shrinkAxisMask",type:"number",defaultValue:0}]},{tfOpName:"Pack",category:"slice_join",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}],attrs:[{tfName:"axis",name:"axis",type:"number",defaultValue:0}]},{tfOpName:"Unpack",category:"slice_join",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"axis",name:"axis",type:"number",defaultValue:0},{tfName:"num",name:"num",type:"number",defaultValue:0,notSupported:!0}]},{tfOpName:"Tile",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"reps",type:"number[]"}]},{tfOpName:"Split",category:"slice_join",inputs:[{start:0,name:"axis",type:"number",defaultValue:0},{start:1,name:"x",type:"tensor"}],attrs:[{tfName:"num_split",name:"numOrSizeSplits",type:"number",defaultValue:1}]},{tfOpName:"SplitV",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"numOrSizeSplits",type:"number[]"},{start:2,name:"axis",type:"number",defaultValue:0}]},{tfOpName:"ScatterNd",category:"slice_join",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"values",type:"tensor"},{start:2,name:"shape",type:"number[]"}]},{tfOpName:"GatherNd",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"}]},{tfOpName:"SparseToDense",category:"slice_join",inputs:[{start:0,name:"sparseIndices",type:"tensor"},{start:1,name:"outputShape",type:"number[]"},{start:2,name:"sparseValues",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",defaultValue:!1,notSupported:!0}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Xy=Object.freeze({__proto__:null,json:[{tfOpName:"SparseFillEmptyRows",category:"sparse",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"values",type:"tensor"},{start:2,name:"denseShape",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}]},{tfOpName:"SparseReshape",category:"sparse",inputs:[{start:0,name:"inputIndices",type:"tensor"},{start:1,name:"inputShape",type:"tensor"},{start:2,name:"newShape",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SparseSegmentMean",category:"sparse",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"segmentIds",type:"tensor"}]},{tfOpName:"SparseSegmentSum",category:"sparse",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"segmentIds",type:"tensor"}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Jy=Object.freeze({__proto__:null,json:[{tfOpName:"FFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"IFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"RFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"fft_length",type:"number",notSupported:!0}]},{tfOpName:"IRFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"fft_length",type:"number",notSupported:!0}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Zy=Object.freeze({__proto__:null,json:[{tfOpName:"StringNGrams",category:"string",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"dataSplits",type:"tensor"}],attrs:[{tfName:"separator",name:"separator",type:"string"},{tfName:"ngram_widths",name:"nGramWidths",type:"number[]"},{tfName:"left_pad",name:"leftPad",type:"string"},{tfName:"right_pad",name:"rightPad",type:"string"},{tfName:"pad_width",name:"padWidth",type:"number"},{tfName:"preserve_short_sequences",name:"preserveShortSequences",type:"bool"}],outputs:["ngrams","ngrams_splits"]},{tfOpName:"StringSplit",category:"string",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"delimiter",type:"tensor"}],attrs:[{tfName:"skip_empty",name:"skipEmpty",type:"bool"}],outputs:["indices","values","shape"]},{tfOpName:"StringToHashBucketFast",category:"string",inputs:[{start:0,name:"input",type:"tensor"}],attrs:[{tfName:"num_buckets",name:"numBuckets",type:"number"}]}]});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var eb=Object.freeze({__proto__:null,json:[{tfOpName:"Cast",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"SrcT",name:"sdtype",type:"dtype",notSupported:!0},{tfName:"DstT",name:"dtype",type:"dtype"}]},{tfOpName:"ExpandDims",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"MirrorPad",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"}],attrs:[{tfName:"mode",name:"mode",type:"string"}]},{tfOpName:"Pad",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"}],attrs:[{tfName:"constant_value",name:"constantValue",type:"number",defaultValue:0}]},{tfOpName:"PadV2",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"},{start:2,name:"constantValue",type:"number",defaultValue:0}]},{tfOpName:"Reshape",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}]},{tfOpName:"Squeeze",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"axis",tfDeprecatedName:"squeeze_dims",name:"axis",type:"number[]"}]},{tfOpName:"SpaceToBatchND",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"blockShape",type:"number[]"},{start:2,name:"paddings",type:"number[]"}]},{tfOpName:"BatchToSpaceND",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"blockShape",type:"number[]"},{start:2,name:"crops",type:"number[]"}]},{tfOpName:"DepthToSpace",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"block_size",name:"blockSize",type:"number"},{tfName:"data_format",name:"dataFormat",type:"string"}]},{tfOpName:"BroadcastTo",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}],attrs:[]},{tfOpName:"BroadcastArgs",category:"transformation",inputs:[{start:0,name:"s0",type:"tensor"},{start:1,name:"s1",type:"tensor"}],attrs:[]}]});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class tb{static get Instance(){return this._instance||(this._instance=new this)}constructor(){const e=[].concat(...[Ry,zy,By,Ly,Py,Vy,Wy,Hy,qy,jy,Uy,Ky,Gy,Yy,Qy,Xy,Jy,Zy,eb].map((e=>e.json)));this.opMappers=e.reduce(((e,t)=>(e[t.tfOpName]=t,e)),{})}transformGraph(e,t={}){const n=e.node,a=[],r=[],s=[],o=n.reduce(((e,t)=>(e[t.name]=this.mapNode(t),t.op.startsWith("Placeholder")?a.push(e[t.name]):"Const"===t.op?r.push(e[t.name]):null!=t.input&&0!==t.input.length||s.push(e[t.name]),e)),{});let i=[];const u=[];let l={},c={};null!=t&&(l=this.mapSignatureEntries(t.inputs),c=this.mapSignatureEntries(t.outputs));const p=Object.keys(o);p.forEach((e=>{const t=o[e];t.inputNames.forEach(((e,n)=>{const[a,,r]=$y(e),s=o[a];if(null!=s.outputs){const e=s.outputs.indexOf(r);if(-1!==e){const r=`${a}:${e}`;t.inputNames[n]=r}}t.inputs.push(s),s.children.push(t)}))})),0===Object.keys(c).length?p.forEach((e=>{const t=o[e];0===t.children.length&&u.push(t)})):Object.keys(c).forEach((e=>{const[t]=$y(e),n=o[t];null!=n&&(n.signatureKey=c[e],u.push(n))})),Object.keys(l).length>0?Object.keys(l).forEach((e=>{const[t]=$y(e),n=o[t];n&&(n.signatureKey=l[e],i.push(n))})):i=a;let d={};null!=e.library&&null!=e.library.function&&(d=e.library.function.reduce(((e,t)=>(e[t.signature.name]=this.mapFunction(t),e)),{}));const h={nodes:o,inputs:i,outputs:u,weights:r,placeholders:a,signature:t,functions:d};return s.length>0&&(h.initNodes=s),h}mapSignatureEntries(e){return Object.keys(e||{}).reduce(((t,n)=>(t[e[n].name]=n,t)),{})}mapNode(e){const t=_y(e.op)||this.opMappers[e.op]||{};null==e.attr&&(e.attr={});const n={name:e.name,op:e.op,category:t.category,inputNames:(e.input||[]).map((e=>e.startsWith("^")?e.slice(1):e)),inputs:[],children:[],inputParams:{},attrParams:{},rawAttrs:e.attr,outputs:t.outputs};return null!=t.inputs&&(n.inputParams=t.inputs.reduce(((e,t)=>(e[t.name]={type:t.type,inputIndexStart:t.start,inputIndexEnd:t.end},e)),{})),null!=t.attrs&&(n.attrParams=t.attrs.reduce(((t,n)=>{const a=n.type;let r;switch(n.type){case"string":r=ab(e.attr,n.tfName,n.defaultValue),void 0===r&&n.tfDeprecatedName&&(r=ab(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"string[]":r=hb(e.attr,n.tfName,n.defaultValue),void 0===r&&n.tfDeprecatedName&&(r=hb(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"number":r=sb(e.attr,n.tfName,n.defaultValue||0),void 0===r&&n.tfDeprecatedName&&(r=sb(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"number[]":r=db(e.attr,n.tfName,n.defaultValue),void 0===r&&n.tfDeprecatedName&&(r=db(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"bool":r=rb(e.attr,n.tfName,n.defaultValue),void 0===r&&n.tfDeprecatedName&&(r=rb(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"bool[]":r=fb(e.attr,n.tfName,n.defaultValue),void 0===r&&n.tfDeprecatedName&&(r=fb(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"shape":r=pb(e.attr,n.tfName,n.defaultValue),void 0===r&&n.tfDeprecatedName&&(r=pb(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"shape[]":r=mb(e.attr,n.tfName,n.defaultValue),void 0===r&&n.tfDeprecatedName&&(r=mb(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"dtype":r=ub(e.attr,n.tfName,n.defaultValue),void 0===r&&n.tfDeprecatedName&&(r=ub(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"dtype[]":r=lb(e.attr,n.tfName,n.defaultValue),void 0===r&&n.tfDeprecatedName&&(r=lb(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"func":r=ib(e.attr,n.tfName,n.defaultValue),void 0===r&&n.tfDeprecatedName&&(r=ib(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"tensor":case"tensors":break;default:throw new Error(`Unsupported param type: ${n.type} for op: ${e.op}`)}return t[n.name]={value:r,type:a},t}),{})),n}mapFunction(e){const t=e.nodeDef,n=[];let a={};null!=t&&(a=t.reduce(((e,t)=>(e[t.name]=this.mapNode(t),"Const"===t.op&&n.push(e[t.name]),e)),{}));const r=[],s=[];e.signature.inputArg.forEach((e=>{const[t]=$y(e.name),n={name:t,op:"Placeholder",inputs:[],inputNames:[],category:"graph",inputParams:{},attrParams:{dtype:{value:ob(e.type),type:"dtype"}},children:[]};n.signatureKey=e.name,r.push(n),a[t]=n}));Object.keys(a).forEach((e=>{const t=a[e];t.inputNames.forEach(((e,n)=>{const[r,,s]=$y(e),o=a[r];if(null!=o.outputs){const e=o.outputs.indexOf(s);if(-1!==e){const a=`${r}:${e}`;t.inputNames[n]=a}}t.inputs.push(o),o.children.push(t)}))}));const o=e.ret;e.signature.outputArg.forEach((e=>{const[t,n]=$y(o[e.name]),r=a[t];null!=r&&(r.defaultOutput=n,s.push(r))}));const i=this.mapArgsToSignature(e);return{nodes:a,inputs:r,outputs:s,weights:n,placeholders:[],signature:i}}mapArgsToSignature(e){return{methodName:e.signature.name,inputs:e.signature.inputArg.reduce(((e,t)=>(e[t.name]=this.mapArgToTensorInfo(t),e)),{}),outputs:e.signature.outputArg.reduce(((t,n)=>(t[n.name]=this.mapArgToTensorInfo(n,e.ret),t)),{})}}mapArgToTensorInfo(e,t){let n=e.name;return null!=t&&(n=t[n]),{name:n,dtype:e.type}}}function nb(e,t){const n=Array.isArray(e)?String.fromCharCode.apply(null,e):function(e){const t=j().global;if(void 0!==t.atob)return t.atob(e);if("undefined"!=typeof Buffer)return new Buffer(e,"base64").toString();throw new Error("Unable to decode base64 in this environment. Missing built-in atob() or Buffer()")}(e);return t?n:n.toLowerCase()}function ab(e,t,n,a=!1){const r=e[t];return null!=r?nb(r.s,a):n}function rb(e,t,n){const a=e[t];return a?a.b:n}function sb(e,t,n){const a=e[t]||{},r=null!=a.i?a.i:null!=a.f?a.f:n;return"number"==typeof r?r:parseInt(r,10)}function ob(e){switch("string"==typeof e&&(e=Iy[e]),e){case Iy.DT_FLOAT:case Iy.DT_HALF:return"float32";case Iy.DT_INT32:case Iy.DT_INT64:case Iy.DT_INT8:case Iy.DT_UINT8:return"int32";case Iy.DT_BOOL:return"bool";case Iy.DT_DOUBLE:return"float32";case Iy.DT_STRING:return"string";default:return null}}function ib(e,t,n){const a=e[t];return a&&a.func?a.func.name:n}function ub(e,t,n){const a=e[t];return a&&a.type?ob(a.type):n}function lb(e,t,n){const a=e[t];return a&&a.list&&a.list.type?a.list.type.map((e=>ob(e))):n}function cb(e){if(!e.unknownRank)return null!=e.dim?e.dim.map((e=>"number"==typeof e.size?e.size:parseInt(e.size,10))):[]}function pb(e,t,n){const a=e[t];return a&&a.shape?cb(a.shape):n}function db(e,t,n){const a=e[t];return a?((a.list.f&&a.list.f.length?a.list.f:a.list.i)||[]).map((e=>"number"==typeof e?e:parseInt(e,10))):n}function hb(e,t,n,a=!1){const r=e[t];return r&&r.list&&r.list.s?r.list.s.map((e=>nb(e,a))):n}function mb(e,t,n){const a=e[t];return a&&a.list&&a.list.shape?a.list.shape.map((e=>cb(e))):n}function fb(e,t,n){const a=e[t];return a&&a.list&&a.list.b?a.list.b:n}
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class gb{constructor(e,t,n){this.node=e,this.tensorMap=t,this.context=n,this.inputs=[],this.attrs={},this.inputs=e.inputNames.map((e=>this.getInput(e))),null!=e.rawAttrs&&(this.attrs=Object.keys(e.rawAttrs).reduce(((e,t)=>(e[t]=this.getAttr(t),e)),{}))}getInput(e){return Ay(e,this.tensorMap,this.context)}getAttr(e,t){const n=this.node.rawAttrs[e];if(null!=n.tensor)return Ay(e,this.tensorMap,this.context);if(null!=n.i||null!=n.f)return sb(this.node.rawAttrs,e,t);if(null!=n.s)return ab(this.node.rawAttrs,e,t);if(null!=n.b)return rb(this.node.rawAttrs,e,t);if(null!=n.shape)return pb(this.node.rawAttrs,e,t);if(null!=n.type)return ub(this.node.rawAttrs,e,t);if(null!=n.list){if(null!=n.list.i||null!=n.list.f)return db(this.node.rawAttrs,e,t);if(null!=n.list.s)return hb(this.node.rawAttrs,e,t);if(null!=n.list.shape)return mb(this.node.rawAttrs,e,t);if(null!=n.list.b)return fb(this.node.rawAttrs,e,t);if(null!=n.list.type)return lb(this.node.rawAttrs,e,t)}return t}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var yb=Object.freeze({__proto__:null,OP_SCOPE_SUFFIX:qa,abs:Gs,acos:Ys,acosh:Qs,add:qs,addN:Xs,all:Js,any:Zs,argMax:eo,argMin:to,asin:no,asinh:ao,atan:ro,atan2:so,atanh:oo,avgPool:No,avgPool3d:vo,basicLSTMCell:_o,batchNorm:Ao,batchNorm2d:$o,batchNorm3d:Do,batchNorm4d:Fo,batchToSpaceND:Mo,bincount:Oo,booleanMaskAsync:nc,broadcastTo:Co,buffer:Or,cast:Cr,ceil:Ro,clipByValue:zo,clone:Rr,complex:Ua,concat:To,concat1d:Bo,concat2d:Lo,concat3d:Po,concat4d:Vo,conv1d:Ho,conv2d:Wo,conv2dTranspose:jo,conv3d:Uo,conv3dTranspose:Go,cos:Yo,cosh:Qo,cosineWindow:pc,cumsum:Xo,denseBincount:Jo,depthToSpace:Zo,depthwiseConv2d:ei,diag:ti,dilation2d:ni,div:Us,divNoNan:li,dot:ci,dropout:lc,elu:pi,enclosingPowerOfTwo:cc,equal:oi,erf:di,exp:hi,expandDims:mi,expm1:fi,eye:yi,fft:$l,fill:bi,floor:ki,floorDiv:js,fused:vc,gather:xi,gatherND:uc,greater:wi,greaterEqual:Ni,ifft:Dl,imag:vi,image:pp,inTopKAsync:dc,irfft:Fl,isFinite:Ti,isInf:Ii,isNaN:Si,leakyRelu:Ei,less:_i,lessEqual:Mi,linalg:dp,linspace:Ai,localResponseNormalization:$i,log:Di,log1p:Fi,logSigmoid:Li,logSoftmax:Hi,logSumExp:Ji,logicalAnd:Zi,logicalNot:eu,logicalOr:tu,logicalXor:nu,losses:hp,matMul:Xr,max:Pi,maxPool:au,maxPool3d:ru,maxPoolWithArgmax:su,maximum:ou,mean:iu,min:uu,minimum:lu,mirrorPad:cu,mod:pu,moments:hu,movingAverage:sc,mul:Ks,multiRNNCell:mu,multinomial:fu,neg:zi,norm:rc,notEqual:gu,oneHot:Jr,ones:bu,onesLike:ku,op:ja,outerProduct:xu,pad:wu,pad1d:Nu,pad2d:vu,pad3d:Tu,pad4d:Iu,pool:Eu,pow:_u,prelu:Mu,print:zr,prod:Au,rand:$u,randomGamma:rl,randomNormal:sl,randomUniform:ol,range:il,real:ul,reciprocal:ll,relu:cl,relu6:pl,reshape:wo,reverse:dl,reverse1d:hl,reverse2d:ml,reverse3d:fl,reverse4d:gl,rfft:Cl,round:yl,rsqrt:bl,scalar:kl,scatterND:oc,selu:xl,separableConv2d:wl,setdiff1dAsync:Nl,sigmoid:Io,sign:vl,signal:cp,sin:Tl,sinh:Il,slice:So,slice1d:Sl,slice2d:El,slice3d:_l,slice4d:Ml,softmax:Al,softplus:Bi,spaceToBatchND:Su,sparseToDense:ic,spectral:lp,split:Ol,sqrt:Rl,square:du,squaredDifference:zl,squeeze:Bl,stack:Ll,step:Pl,stridedSlice:Vl,sub:Vi,sum:Wi,tan:Wl,tanh:Eo,tensor:Ga,tensor1d:Hl,tensor2d:ql,tensor3d:ns,tensor4d:jl,tensor5d:Ul,tensor6d:Kl,tile:gi,topk:Gl,transpose:Zr,truncatedNormal:Yl,unique:Ql,unsortedSegmentSum:Xl,unstack:Jl,variable:Zl,where:ii,whereAsync:tc,zeros:yu,zerosLike:ui});
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function bb(e,t,n=""){if("number"!=typeof e&&"number"!=typeof t){u(e.length===t.length,(()=>n+` Shapes ${e} and ${t} must match`));for(let a=0;a<e.length;a++){const r=e[a],s=t[a];u(r<0||s<0||r===s,(()=>n+` Shapes ${e} and ${t} must match`))}}}function kb(e){return"number"!=typeof e&&!e.some((e=>e<0))}function xb(e,t,n){let a=wb(e,n);const r=!kb(a);if(r&&0===t.length)throw new Error(`Tried to calculate elements of an empty list with non-fully-defined elementShape: ${a}`);if(r&&t.forEach((e=>{a=wb(e.shape,a)})),!kb(a))throw new Error(`Non-fully-defined elementShape: ${a}`);return a}function wb(e,t){if("number"==typeof e)return t;if("number"==typeof t)return e;if(e.length!==t.length)throw new Error(`Incompatible ranks during merge: ${e} vs. ${t}`);const n=[];for(let a=0;a<e.length;++a){const r=e[a],s=t[a];if(r>=0&&s>=0&&r!==s)throw new Error(`Incompatible shape during merge: ${e} vs. ${t}`);n[a]=r>=0?r:s}return n}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Nb{constructor(e,t,n,a,r,s,o){this.name=e,this.dtype=t,this.maxSize=n,this.elementShape=a,this.identicalElementShapes=r,this.dynamicSize=s,this.clearAfterRead=o,this.tensors=[],this.closed_=!1,this.idTensor=kl(0),Ws(this.idTensor)}get id(){return this.idTensor.id}get closed(){return this.closed_}clearAndClose(e){this.tensors.forEach((t=>{null!=e&&e.has(t.tensor.id)||t.tensor.dispose()})),this.tensors=[],this.closed_=!0,this.idTensor.dispose()}size(){return this.tensors.length}read(e){if(this.closed_)throw new Error(`TensorArray ${this.name} has already been closed.`);if(e<0||e>=this.size())throw new Error(`Tried to read from index ${e}, but array size is: ${this.size()}`);const t=this.tensors[e];if(t.cleared)throw new Error(`TensorArray ${this.name}: Could not read index ${e} twice because it was cleared after a previous read (perhaps try setting clear_after_read = false?).`);return this.clearAfterRead&&(t.cleared=!0),t.read=!0,t.tensor}readMany(e){return e.map((e=>this.read(e)))}write(e,t){if(this.closed_)throw new Error(`TensorArray ${this.name} has already been closed.`);if(e<0||!this.dynamicSize&&e>=this.maxSize)throw new Error(`Tried to write to index ${e}, but array is not resizeable and size is: ${this.maxSize}`);const n=this.tensors[e]||{};if(t.dtype!==this.dtype)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e},\n          because the value dtype is ${t.dtype}, but TensorArray dtype is ${this.dtype}.`);if(0!==this.size()||null!=this.elementShape&&0!==this.elementShape.length||(this.elementShape=t.shape),bb(this.elementShape,t.shape,`TensorArray ${this.name}: Could not write to TensorArray index ${e}.`),n.read)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been read.`);if(n.written)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been written.`);n.tensor=t,Ws(t),n.written=!0,this.tensors[e]=n}writeMany(e,t){if(e.length!==t.length)throw new Error(`TensorArray ${this.name}: could not write multiple tensors,because the index size: ${e.length} is not the same as tensors size: ${t.length}.`);e.forEach(((e,n)=>this.write(e,t[n])))}gather(e,t){if(t&&t!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but gather requested dtype ${t}`);if(e)e=e.slice(0,this.size());else{e=[];for(let t=0;t<this.size();t++)e.push(t)}if(0===e.length)return Ga([],[0].concat(this.elementShape));const n=this.readMany(e);return bb(this.elementShape,n[0].shape,"TensorArray shape mismatch: "),Ll(n,0)}concat(e){if(e&&e!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but concat requested dtype ${e}`);if(0===this.size())return Ga([],[0].concat(this.elementShape));const t=[];for(let e=0;e<this.size();e++)t.push(e);const n=this.readMany(t);return bb(this.elementShape,n[0].shape,`TensorArray shape mismatch: tensor array shape (${this.elementShape}) vs first tensor shape (${n[0].shape})`),To(n,0)}scatter(e,t){if(t.dtype!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${t.dtype}`);if(e.length!==t.shape[0])throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${e.length} vs. ${t.shape[0]}`);const n=Math.max(...e);if(!this.dynamicSize&&n>=this.maxSize)throw new Error(`Max index must be < array size (${n}  vs. ${this.maxSize})`);this.writeMany(e,Jl(t,0))}split(e,t){if(t.dtype!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${t.dtype}`);let n=0;const a=e.map((e=>(n+=e,n)));if(n!==t.shape[0])throw new Error(`Expected sum of lengths to be equal to\n          tensor.shape[0], but sum of lengths is\n        ${n}, and tensor's shape is: ${t.shape}`);if(!this.dynamicSize&&e.length!==this.maxSize)throw new Error(`TensorArray's size is not equal to the size of lengths (${this.maxSize} vs. ${e.length}), and the TensorArray is not marked as dynamically resizeable`);const r=0===n?0:t.size/n,s=[];Ps((()=>{t=wo(t,[1,n,r]);for(let n=0;n<e.length;++n){const o=[0,0===n?0:a[n-1],0],i=[1,e[n],r];s[n]=wo(So(t,o,i),this.elementShape)}return s}));const o=[];for(let t=0;t<e.length;t++)o[t]=t;this.writeMany(o,s)}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class vb{constructor(e,t,n,a=-1){this.tensors=e,this.elementShape=t,this.elementDtype=n,null!=e&&e.forEach((e=>{if(n!==e.dtype)throw new Error(`Invalid data types; op elements ${n}, but list elements ${e.dtype}`);bb(t,e.shape,"TensorList shape mismatch: "),Ws(e)})),this.idTensor=kl(0),this.maxNumElements=a,Ws(this.idTensor)}get id(){return this.idTensor.id}copy(){return new vb([...this.tensors],this.elementShape,this.elementDtype)}clearAndClose(e){this.tensors.forEach((t=>{null!=e&&e.has(t.id)||t.dispose()})),this.tensors.length=0,this.idTensor.dispose()}size(){return this.tensors.length}stack(e,t,n=-1){if(t!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);if(-1!==n&&this.tensors.length!==n)throw new Error(`Operation expected a list with ${n} elements but got a list with ${this.tensors.length} elements.`);bb(e,this.elementShape,"TensorList shape mismatch: ");const a=xb(this.elementShape,this.tensors,e);return Ps((()=>{const e=this.tensors.map((e=>wo(e,a)));return Ll(e,0)}))}popBack(e,t){if(t!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);if(0===this.size())throw new Error("Trying to pop from an empty list.");const n=xb(this.elementShape,this.tensors,e),a=this.tensors.pop();return a.kept=!1,bb(a.shape,e,"TensorList shape mismatch: "),wo(a,n)}pushBack(e){if(e.dtype!==this.elementDtype)throw new Error(`Invalid data types; op elements ${e.dtype}, but list elements ${this.elementDtype}`);if(bb(e.shape,this.elementShape,"TensorList shape mismatch: "),this.maxNumElements===this.size())throw new Error("Trying to push element into a full list.");Ws(e),this.tensors.push(e)}resize(e){if(e<0)throw new Error(`TensorListResize expects size to be non-negative. Got: ${e}`);if(-1!==this.maxNumElements&&e>this.maxNumElements)throw new Error(`TensorListResize input size ${e} is greater maxNumElement ${this.maxNumElements}.`);const t=new vb([],this.elementShape,this.elementDtype,this.maxNumElements);t.tensors.length=e;for(let n=0;n<Math.min(this.tensors.length,e);++n)t.tensors[n]=this.tensors[n];return t}getItem(e,t,n){if(n!==this.elementDtype)throw new Error(`Invalid data types; op elements ${n}, but list elements ${this.elementDtype}`);if(e<0||e>this.tensors.length)throw new Error(`Trying to access element ${e} in a list with ${this.tensors.length} elements.`);if(null==this.tensors[e])throw new Error(`element at index ${e} is null.`);bb(this.tensors[e].shape,t,"TensorList shape mismatch: ");const a=xb(this.elementShape,this.tensors,t);return wo(this.tensors[e],a)}setItem(e,t){if(t.dtype!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t.dtype}, but list elements ${this.elementDtype}`);if(e<0||-1!==this.maxNumElements&&e>=this.maxNumElements)throw new Error(`Trying to set element ${e} in a list with max ${this.maxNumElements} elements.`);bb(this.elementShape,t.shape,"TensorList shape mismatch: "),Ws(t),null!=this.tensors[e]&&(this.tensors[e].kept=!1),this.tensors[e]=t}gather(e,t,n){if(t!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);bb(this.elementShape,n,"TensorList shape mismatch: "),e=e.slice(0,this.size());const a=xb(this.elementShape,this.tensors,n);return 0===e.length?Ga([],[0].concat(a)):Ps((()=>{const t=e.map((e=>wo(this.tensors[e],a)));return Ll(t,0)}))}concat(e,t){if(e&&e!==this.elementDtype)throw new Error(`TensorList dtype is ${this.elementDtype} but concat requested dtype ${e}`);bb(this.elementShape,t,"TensorList shape mismatch: ");const n=xb(this.elementShape,this.tensors,t);return 0===this.size()?Ga([],[0].concat(n)):Ps((()=>{const e=this.tensors.map((e=>wo(e,n)));return To(e,0)}))}}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const Tb=async(e,t,n)=>{switch(e.op){case"If":case"StatelessIf":{const a=My("thenBranch",e,t,n),r=My("elseBranch",e,t,n),s=My("cond",e,t,n),o=My("args",e,t,n);return(await s.data())[0]?n.functionMap[a].executeFunctionAsync(o,n.tensorArrayMap,n.tensorListMap):n.functionMap[r].executeFunctionAsync(o,n.tensorArrayMap,n.tensorListMap)}case"While":case"StatelessWhile":{const a=My("body",e,t,n),r=My("cond",e,t,n),s=My("args",e,t,n),o=await n.functionMap[r].executeFunctionAsync(s,n.tensorArrayMap,n.tensorListMap),i=s.map((e=>e.id));let u=await o[0].data();o.forEach((e=>{e.kept||-1!==i.indexOf(e.id)||e.dispose()}));let l=s;for(;u[0];){const e=l;l=await n.functionMap[a].executeFunctionAsync(l,n.tensorArrayMap,n.tensorListMap);const t=l.map((e=>e.id));e.forEach((e=>{e.kept||-1!==i.indexOf(e.id)||-1!==t.indexOf(e.id)||e.dispose()}));const s=await n.functionMap[r].executeFunctionAsync(l,n.tensorArrayMap,n.tensorListMap);u=await s[0].data(),s.forEach((e=>{e.kept||-1!==i.indexOf(e.id)||-1!==t.indexOf(e.id)||e.dispose()}))}return l}case"LoopCond":return[Cy(My("pred",e,t,n))];case"Switch":{const a=My("pred",e,t,n);let r=My("data",e,t,n);return r.kept||(r=Cy(r)),(await a.data())[0]?[void 0,r]:[r,void 0]}case"Merge":{const a=e.inputNames.find((e=>void 0!==Ay(e,t,n)));if(a){return[Cy(Ay(a,t,n))]}return}case"Enter":{const a=My("frameName",e,t,n),r=My("tensor",e,t,n);return n.enterFrame(a),[Cy(r)]}case"Exit":{const a=My("tensor",e,t,n);return n.exitFrame(),[Cy(a)]}case"NextIteration":{const a=My("tensor",e,t,n);return n.nextIteration(),[Cy(a)]}case"TensorArrayV3":{const a=My("size",e,t,n),r=My("dtype",e,t,n),s=My("elementShape",e,t,n),o=My("dynamicSize",e,t,n),i=My("clearAfterRead",e,t,n),u=My("identicalElementShapes",e,t,n),l=My("name",e,t,n),c=new Nb(l,r,a,s,u,o,i);return n.addTensorArray(c),[c.idTensor,kl(1)]}case"TensorArrayWriteV3":{const a=My("tensorArrayId",e,t,n),r=My("index",e,t,n),s=My("tensor",e,t,n),o=n.getTensorArray(a.id);return o.write(r,s),[o.idTensor]}case"TensorArrayReadV3":{const a=My("tensorArrayId",e,t,n),r=My("index",e,t,n);return[n.getTensorArray(a.id).read(r)]}case"TensorArrayGatherV3":{const a=My("tensorArrayId",e,t,n),r=My("indices",e,t,n),s=My("dtype",e,t,n);return[n.getTensorArray(a.id).gather(r,s)]}case"TensorArrayScatterV3":{const a=My("tensorArrayId",e,t,n),r=My("indices",e,t,n),s=My("tensor",e,t,n),o=n.getTensorArray(a.id);return o.scatter(r,s),[o.idTensor]}case"TensorArrayConcatV3":{const a=My("tensorArrayId",e,t,n),r=n.getTensorArray(a.id),s=My("dtype",e,t,n);return[r.concat(s)]}case"TensorArraySplitV3":{const a=My("tensorArrayId",e,t,n),r=My("tensor",e,t,n),s=My("lengths",e,t,n),o=n.getTensorArray(a.id);return o.split(s,r),[o.idTensor]}case"TensorArraySizeV3":{const a=My("tensorArrayId",e,t,n);return[kl(n.getTensorArray(a.id).size(),"int32")]}case"TensorArrayCloseV3":{const a=My("tensorArrayId",e,t,n),r=n.getTensorArray(a.id);return r.clearAndClose(),[r.idTensor]}case"TensorListSetItem":{const a=My("tensorListId",e,t,n),r=My("index",e,t,n),s=My("tensor",e,t,n),o=n.getTensorList(a.id);return o.setItem(r,s),[o.idTensor]}case"TensorListGetItem":{const a=My("tensorListId",e,t,n),r=My("index",e,t,n),s=My("elementShape",e,t,n),o=My("elementDType",e,t,n);return[n.getTensorList(a.id).getItem(r,s,o)]}case"TensorListScatterV2":case"TensorListScatter":{const a=My("indices",e,t,n),r=function(e,t,n,a){if(t.length!==e.shape[0])throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${t.length} vs. ${e.shape[0]}`);const r=Math.max(...t);if(null!=a&&-1!==a&&r>=a)throw new Error(`Max index must be < array size (${r}  vs. ${a})`);const s=new vb([],n,e.dtype,a),o=Jl(e,0);return t.forEach(((e,t)=>{s.setItem(e,o[t])})),s}(My("tensor",e,t,n),a,My("elementShape",e,t,n),My("numElements",e,t,n));return n.addTensorList(r),[r.idTensor]}case"TensorListReserve":case"EmptyTensorList":{const a=My("elementShape",e,t,n),r=My("elementDType",e,t,n);let s;s="TensorListReserve"===e.op?"numElements":"maxNumElements";const o=My(s,e,t,n),i=function(e,t,n,a){return new vb([],e,t,a)}(a,r,0,"TensorListReserve"===e.op?-1:o);return n.addTensorList(i),[i.idTensor]}case"TensorListGather":{const a=My("tensorListId",e,t,n),r=My("indices",e,t,n),s=My("elementShape",e,t,n),o=My("elementDType",e,t,n);return[n.getTensorList(a.id).gather(r,o,s)]}case"TensorListStack":{const a=My("tensorListId",e,t,n),r=My("elementShape",e,t,n),s=My("elementDType",e,t,n),o=My("numElements",e,t,n);return[n.getTensorList(a.id).stack(r,s,o)]}case"TensorListFromTensor":{const a=function(e,t,n){const a=e.dtype;if(e.shape.length<1)throw new Error(`Tensor must be at least a vector, but saw shape: ${e.shape}`);if(e.dtype!==n)throw new Error(`Invalid data types; op elements ${e.dtype}, but list elements ${n}`);bb(e.shape.slice(1),t,"TensorList shape mismatch: ");const r=Jl(e);return new vb(r,t,a)}(My("tensor",e,t,n),My("elementShape",e,t,n),My("elementDType",e,t,n));return n.addTensorList(a),[a.idTensor]}case"TensorListConcat":case"TensorListConcatV2":{const a=My("tensorListId",e,t,n),r=n.getTensorList(a.id),s=My("dtype",e,t,n),o=My("elementShape",e,t,n);return[r.concat(s,o)]}case"TensorListPushBack":{const a=My("tensorListId",e,t,n),r=My("tensor",e,t,n),s=n.getTensorList(a.id);return s.pushBack(r),[s.idTensor]}case"TensorListPopBack":{const a=My("tensorListId",e,t,n),r=My("elementShape",e,t,n),s=My("elementDType",e,t,n);return[n.getTensorList(a.id).popBack(r,s)]}case"TensorListSplit":{const a=My("tensor",e,t,n),r=My("elementShape",e,t,n),s=function(e,t,n){let a=0;const r=t.map((e=>(a+=e,a)));if(a!==e.shape[0])throw new Error(`Expected sum of lengths to be equal to\n          tensor.shape[0], but sum of lengths is\n        ${a}, and tensor's shape is: ${e.shape}`);const s=wb(e.shape.slice(1),n),o=0===a?0:e.size/a,i=Ps((()=>{const n=[];e=wo(e,[1,a,o]);for(let a=0;a<t.length;++a){const i=[0,0===a?0:r[a-1],0],u=[1,t[a],o];n[a]=wo(So(e,i,u),s)}return e.dispose(),n})),u=new vb([],n,e.dtype,t.length);for(let e=0;e<i.length;e++)u.setItem(e,i[e]);return u}(a,My("lengths",e,t,n),r);return n.addTensorList(s),[s.idTensor]}case"TensorListLength":{const a=My("tensorListId",e,t,n);return[kl(n.getTensorList(a.id).size(),"int32")]}case"TensorListResize":{const a=My("tensorListId",e,t,n),r=My("size",e,t,n),s=n.getTensorList(a.id).resize(r);return n.addTensorList(s),[s.idTensor]}default:throw TypeError(`Node type ${e.op} is not implemented`)}};
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ib(e,t,n){const[a,r]=My("fusedOps",e,t,n),s="biasadd"===a,o=!s,i="prelu"===r,u="fusedbatchnorm"===a,l=My("numArgs",e,t,n);if(s){if(i&&2!==l)throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd and Prelu must have two extra arguments: bias and alpha.");if(!i&&s&&1!==l)throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd must have one extra argument: bias.")}if(u)throw new Error("FusedConv2d and DepthwiseConv2d with FusedBatchNorm is not supported");const c=My("strides",e,t,n),p=Oy(e,t,n),d=My("dataFormat",e,t,n).toUpperCase(),h=My("dilations",e,t,n);let[m,f]=My("args",e,t,n);o&&(f=m,m=void 0);return{stride:c,pad:p,dataFormat:d,dilations:h,biasArg:m,preluArg:f,activationFunc:r,leakyreluAlpha:My("leakyreluAlpha",e,t,n)}}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function Sb(e,t,n){return{boxes:My("boxes",e,t,n),scores:My("scores",e,t,n),maxOutputSize:My("maxOutputSize",e,t,n),iouThreshold:My("iouThreshold",e,t,n),scoreThreshold:My("scoreThreshold",e,t,n),softNmsSigma:My("softNmsSigma",e,t,n)}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class Eb{constructor(e,t){this.keyDType=e,this.valueDType=t,this.handle=kl(0),this.tensorMap=new Map,Ws(this.handle)}get id(){return this.handle.id}clearAndClose(){this.tensorMap.forEach((e=>e.dispose())),this.tensorMap.clear(),this.handle.dispose()}size(){return this.tensorMap.size}tensorSize(){return kl(this.size(),"int32")}async import(e,t){this.checkKeyAndValueTensor(e,t);const n=await e.data();return this.tensorMap.forEach((e=>e.dispose())),this.tensorMap.clear(),Ps((()=>{const e=Jl(t),a=n.length,r=e.length;u(a===r,(()=>`The number of elements doesn't match, keys has ${a} elements, the values has ${r} elements.`));for(let t=0;t<a;t++){const a=n[t],r=e[t];Ws(r),this.tensorMap.set(a,r)}return this.handle}))}async find(e,t){this.checkKeyAndValueTensor(e,t);const n=await e.data();return Ps((()=>{const e=[];for(let a=0;a<n.length;a++){const r=n[a],s=this.findWithDefault(r,t);e.push(s)}return Ll(e)}))}findWithDefault(e,t){const n=this.tensorMap.get(e);return null!=n?n:t}checkKeyAndValueTensor(e,t){if(e.dtype!==this.keyDType)throw new Error(`Expect key dtype ${this.keyDType}, but got ${e.dtype}`);if(t.dtype!==this.valueDType)throw new Error(`Expect value dtype ${this.valueDType}, but got ${t.dtype}`)}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function _b(e,t,n,a,r=Ps){const s=((e,t,n)=>{switch(e.category){case"arithmetic":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"BiasAdd":case"AddV2":case"Add":return[a.add(My("a",e,t,n),My("b",e,t,n))];case"AddN":return[a.addN(My("tensors",e,t,n))];case"FloorMod":case"Mod":return[a.mod(My("a",e,t,n),My("b",e,t,n))];case"Mul":return[a.mul(My("a",e,t,n),My("b",e,t,n))];case"RealDiv":case"Div":return[a.div(My("a",e,t,n),My("b",e,t,n))];case"DivNoNan":return[a.divNoNan(My("a",e,t,n),My("b",e,t,n))];case"FloorDiv":return[a.floorDiv(My("a",e,t,n),My("b",e,t,n))];case"Sub":return[a.sub(My("a",e,t,n),My("b",e,t,n))];case"Minimum":return[a.minimum(My("a",e,t,n),My("b",e,t,n))];case"Maximum":return[a.maximum(My("a",e,t,n),My("b",e,t,n))];case"Pow":return[a.pow(My("a",e,t,n),My("b",e,t,n))];case"SquaredDifference":return[a.squaredDifference(My("a",e,t,n),My("b",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"basic_math":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"Abs":case"ComplexAbs":return[a.abs(My("x",e,t,n))];case"Acos":return[a.acos(My("x",e,t,n))];case"Acosh":return[a.acosh(My("x",e,t,n))];case"Asin":return[a.asin(My("x",e,t,n))];case"Asinh":return[a.asinh(My("x",e,t,n))];case"Atan":return[a.atan(My("x",e,t,n))];case"Atan2":return[a.atan2(My("x",e,t,n),My("y",e,t,n))];case"Atanh":return[a.atanh(My("x",e,t,n))];case"Ceil":return[a.ceil(My("x",e,t,n))];case"Complex":return[a.complex(My("real",e,t,n),My("imag",e,t,n))];case"Cos":return[a.cos(My("x",e,t,n))];case"Cosh":return[a.cosh(My("x",e,t,n))];case"Elu":return[a.elu(My("x",e,t,n))];case"Erf":return[a.erf(My("x",e,t,n))];case"Exp":return[a.exp(My("x",e,t,n))];case"Expm1":return[a.expm1(My("x",e,t,n))];case"Floor":return[a.floor(My("x",e,t,n))];case"Log":return[a.log(My("x",e,t,n))];case"Log1p":return[a.log1p(My("x",e,t,n))];case"Imag":return[a.imag(My("x",e,t,n))];case"Neg":return[a.neg(My("x",e,t,n))];case"Reciprocal":return[a.reciprocal(My("x",e,t,n))];case"Real":return[a.real(My("x",e,t,n))];case"Relu":return[a.relu(My("x",e,t,n))];case"Round":return[a.round(My("x",e,t,n))];case"Selu":return[a.selu(My("x",e,t,n))];case"Sigmoid":return[a.sigmoid(My("x",e,t,n))];case"Sin":return[a.sin(My("x",e,t,n))];case"Sign":return[a.sign(My("x",e,t,n))];case"Sinh":return[a.sinh(My("x",e,t,n))];case"Softplus":return[a.softplus(My("x",e,t,n))];case"Sqrt":return[a.sqrt(My("x",e,t,n))];case"Square":return[a.square(My("x",e,t,n))];case"Tanh":return[a.tanh(My("x",e,t,n))];case"Tan":return[a.tan(My("x",e,t,n))];case"ClipByValue":return[a.clipByValue(My("x",e,t,n),My("clipValueMin",e,t,n),My("clipValueMax",e,t,n))];case"Relu6":return[a.relu6(My("x",e,t,n))];case"Rsqrt":return[a.rsqrt(Ay(e.inputNames[0],t,n))];case"Prod":return[a.prod(My("x",e,t,n),My("axes",e,t,n))];case"LeakyRelu":return[a.leakyRelu(My("x",e,t,n),My("alpha",e,t,n))];case"Prelu":return[a.prelu(My("x",e,t,n),My("alpha",e,t,n))];case"IsNan":return[a.isNaN(Ay(e.inputNames[0],t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"control":return Tb(e,t,n);case"convolution":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"Conv1D":{const r=My("stride",e,t,n),s=My("pad",e,t,n),o=My("dataFormat",e,t,n).toUpperCase(),i=My("dilation",e,t,n);return[a.conv1d(My("x",e,t,n),My("filter",e,t,n),r,s,o,i)]}case"Conv2D":{const r=My("strides",e,t,n),s=Oy(e,t,n),o=My("dataFormat",e,t,n).toUpperCase(),i=My("dilations",e,t,n);return[a.conv2d(My("x",e,t,n),My("filter",e,t,n),[r[1],r[2]],s,o,[i[1],i[2]])]}case"_FusedConv2D":{const{stride:r,pad:s,dataFormat:o,dilations:i,biasArg:u,preluArg:l,activationFunc:c,leakyreluAlpha:p}=Ib(e,t,n);return[a.fused.conv2d({x:My("x",e,t,n),filter:My("filter",e,t,n),strides:[r[1],r[2]],pad:s,dataFormat:o,dilations:[i[1],i[2]],bias:u,activation:c,preluActivationWeights:l,leakyreluAlpha:p})]}case"FusedDepthwiseConv2dNative":{const{stride:r,pad:s,dataFormat:o,dilations:i,biasArg:u,preluArg:l,activationFunc:c,leakyreluAlpha:p}=Ib(e,t,n);return[a.fused.depthwiseConv2d({x:My("x",e,t,n),filter:My("filter",e,t,n),strides:[r[1],r[2]],pad:s,dataFormat:o,dilations:[i[1],i[2]],bias:u,activation:c,preluActivationWeights:l,leakyreluAlpha:p})]}case"Conv2DBackpropInput":case"Conv2dTranspose":{const r=My("outputShape",e,t,n),s=My("strides",e,t,n),o=Oy(e,t,n);return[a.conv2dTranspose(My("x",e,t,n),My("filter",e,t,n),r,[s[1],s[2]],o)]}case"DepthwiseConv2dNative":case"DepthwiseConv2d":{const r=My("strides",e,t,n),s=Oy(e,t,n),o=My("dilations",e,t,n),i=My("dataFormat",e,t,n).toUpperCase();return[a.depthwiseConv2d(My("input",e,t,n),My("filter",e,t,n),[r[1],r[2]],s,i,[o[1],o[2]])]}case"Conv3D":{const r=My("strides",e,t,n),s=My("pad",e,t,n),o=My("dataFormat",e,t,n).toUpperCase(),i=My("dilations",e,t,n);return[a.conv3d(My("x",e,t,n),My("filter",e,t,n),[r[1],r[2],r[3]],s,o,[i[1],i[2],i[3]])]}case"AvgPool":{const r=My("strides",e,t,n),s=My("pad",e,t,n),o=My("kernelSize",e,t,n);return[a.avgPool(My("x",e,t,n),[o[1],o[2]],[r[1],r[2]],s)]}case"MaxPool":{const r=My("strides",e,t,n),s=My("pad",e,t,n),o=My("kernelSize",e,t,n);return[a.maxPool(My("x",e,t,n),[o[1],o[2]],[r[1],r[2]],s)]}case"MaxPoolWithArgmax":{const r=My("strides",e,t,n),s=My("pad",e,t,n),o=My("kernelSize",e,t,n),i=My("includeBatchInIndex",e,t,n),{result:u,indexes:l}=a.maxPoolWithArgmax(My("x",e,t,n),[o[1],o[2]],[r[1],r[2]],s,i);return[u,l]}case"AvgPool3D":{const r=My("strides",e,t,n),s=My("pad",e,t,n),o=My("kernelSize",e,t,n);return[a.avgPool3d(My("x",e,t,n),[o[1],o[2],o[3]],[r[1],r[2],r[3]],s)]}case"MaxPool3D":{const r=My("strides",e,t,n),s=My("pad",e,t,n),o=My("kernelSize",e,t,n);return[a.maxPool3d(My("x",e,t,n),[o[1],o[2],o[3]],[r[1],r[2],r[3]],s)]}case"Dilation2D":{const r=My("strides",e,t,n),s=My("pad",e,t,n),o=My("dilations",e,t,n),i=r[1],u=r[2],l=o[1],c=o[2];return[a.dilation2d(My("x",e,t,n),My("filter",e,t,n),[i,u],s,[l,c],"NHWC")]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"creation":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"Fill":{const r=My("shape",e,t,n),s=My("dtype",e,t,n),o=My("value",e,t,n);return[a.fill(r,o,s)]}case"LinSpace":{const r=My("start",e,t,n),s=My("stop",e,t,n),o=My("num",e,t,n);return[a.linspace(r,s,o)]}case"Multinomial":{const r=My("logits",e,t,n),s=My("numSamples",e,t,n),o=My("seed",e,t,n);return[a.multinomial(r,s,o)]}case"OneHot":{const r=My("indices",e,t,n),s=My("depth",e,t,n),o=My("onValue",e,t,n),i=My("offValue",e,t,n),u=My("dtype",e,t,n);return[a.oneHot(r,s,o,i,u)]}case"Ones":return[a.ones(My("shape",e,t,n),My("dtype",e,t,n))];case"OnesLike":return[a.onesLike(My("x",e,t,n))];case"RandomStandardNormal":return[a.randomStandardNormal(My("shape",e,t,n),My("dtype",e,t,n),My("seed",e,t,n))];case"RandomUniform":return[a.randomUniform(My("shape",e,t,n),My("minval",e,t,n),My("maxval",e,t,n),My("dtype",e,t,n))];case"Range":{const r=My("start",e,t,n),s=My("stop",e,t,n),o=My("step",e,t,n);return[a.range(r,s,o,My("dtype",e,t,n))]}case"TruncatedNormal":{const r=My("shape",e,t,n),s=My("mean",e,t,n),o=My("stdDev",e,t,n),i=My("seed",e,t,n);return[a.truncatedNormal(r,s,o,My("dtype",e,t,n),i)]}case"Zeros":return[a.zeros(My("shape",e,t,n),My("dtype",e,t,n))];case"ZerosLike":return[a.zerosLike(My("x",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"dynamic":return(async(e,t,n,a,r=yb)=>{switch(e.op){case"NonMaxSuppressionV5":{const{boxes:a,scores:s,maxOutputSize:o,iouThreshold:i,scoreThreshold:u,softNmsSigma:l}=Sb(e,t,n),c=await r.image.nonMaxSuppressionWithScoreAsync(a,s,o,i,u,l);return[c.selectedIndices,c.selectedScores]}case"NonMaxSuppressionV4":{const{boxes:a,scores:s,maxOutputSize:o,iouThreshold:i,scoreThreshold:u}=Sb(e,t,n),l=My("padToMaxOutputSize",e,t,n),c=await r.image.nonMaxSuppressionPaddedAsync(a,s,o,i,u,l);return[c.selectedIndices,c.validOutputs]}case"NonMaxSuppressionV3":case"NonMaxSuppressionV2":{const{boxes:a,scores:s,maxOutputSize:o,iouThreshold:i,scoreThreshold:u}=Sb(e,t,n);return[await r.image.nonMaxSuppressionAsync(a,s,o,i,u)]}case"Where":{const a=r.cast(My("condition",e,t,n),"bool"),s=[await r.whereAsync(a)];return a.dispose(),s}case"ListDiff":return r.setdiff1dAsync(My("x",e,t,n),My("y",e,t,n));default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n);case"evaluation":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"LowerBound":{const r=My("sortedSequence",e,t,n),s=My("values",e,t,n);return[a.lowerBound(r,s)]}case"TopKV2":{const r=My("x",e,t,n),s=My("k",e,t,n),o=My("sorted",e,t,n),i=a.topk(r,s,o);return[i.values,i.indices]}case"UpperBound":{const r=My("sortedSequence",e,t,n),s=My("values",e,t,n);return[a.upperBound(r,s)]}case"Unique":{const r=My("x",e,t,n),s=a.unique(r);return[s.values,s.indices]}case"UniqueV2":{const r=My("x",e,t,n),s=My("axis",e,t,n),o=a.unique(r,s);return[o.values,o.indices]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"image":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"ResizeBilinear":{const r=My("images",e,t,n),s=My("size",e,t,n),o=My("alignCorners",e,t,n),i=My("halfPixelCenters",e,t,n);return[a.image.resizeBilinear(r,[s[0],s[1]],o,i)]}case"ResizeNearestNeighbor":{const r=My("images",e,t,n),s=My("size",e,t,n),o=My("alignCorners",e,t,n),i=My("halfPixelCenters",e,t,n);return[a.image.resizeNearestNeighbor(r,[s[0],s[1]],o,i)]}case"CropAndResize":{const r=My("image",e,t,n),s=My("boxes",e,t,n),o=My("boxInd",e,t,n),i=My("cropSize",e,t,n),u=My("method",e,t,n),l=My("extrapolationValue",e,t,n);return[a.image.cropAndResize(r,s,o,i,u,l)]}case"ImageProjectiveTransformV3":{const r=My("images",e,t,n),s=My("transforms",e,t,n),o=My("outputShape",e,t,n),i=My("fillValue",e,t,n),u=My("interpolation",e,t,n),l=My("fillMode",e,t,n);return[a.image.transform(r,s,u.toLowerCase(),l.toLowerCase(),i,o)]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"graph":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"Const":return t[e.name];case"PlaceholderWithDefault":const r=My("default",e,t,n);return[Ay(e.name,t,n)||r];case"Placeholder":return[Ay(e.name,t,n)];case"Identity":case"StopGradient":case"FakeQuantWithMinMaxVars":case"Snapshot":return[Cy(My("x",e,t,n))];case"IdentityN":return My("x",e,t,n).map((e=>Cy(e)));case"Shape":return[a.tensor1d(My("x",e,t,n).shape,"int32")];case"ShapeN":return My("x",e,t,n).map((e=>a.tensor1d(e.shape)));case"Size":return[a.scalar(My("x",e,t,n).size,"int32")];case"Rank":return[a.scalar(My("x",e,t,n).rank,"int32")];case"NoOp":return[a.scalar(1)];case"Print":const s=My("x",e,t,n),o=My("data",e,t,n),i=My("message",e,t,n),u=My("summarize",e,t,n);console.warn("The graph has a tf.print() operation,usually used for debugging, which slows down performance."),console.log(i);for(let e=0;e<o.length;e++)console.log(Array.prototype.slice.call(o[e].dataSync()).slice(0,u));return[s];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"logical":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"Equal":return[a.equal(My("a",e,t,n),My("b",e,t,n))];case"NotEqual":return[a.notEqual(My("a",e,t,n),My("b",e,t,n))];case"Greater":return[a.greater(My("a",e,t,n),My("b",e,t,n))];case"GreaterEqual":return[a.greaterEqual(My("a",e,t,n),My("b",e,t,n))];case"Less":return[a.less(My("a",e,t,n),My("b",e,t,n))];case"LessEqual":return[a.lessEqual(My("a",e,t,n),My("b",e,t,n))];case"LogicalAnd":return[a.logicalAnd(My("a",e,t,n),My("b",e,t,n))];case"LogicalNot":return[a.logicalNot(My("a",e,t,n))];case"LogicalOr":return[a.logicalOr(My("a",e,t,n),My("b",e,t,n))];case"Select":case"SelectV2":return[a.where(My("condition",e,t,n),My("a",e,t,n),My("b",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"matrices":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"BatchMatMul":case"BatchMatMulV2":case"MatMul":return[a.matMul(My("a",e,t,n),My("b",e,t,n),My("transposeA",e,t,n),My("transposeB",e,t,n))];case"Einsum":return[a.einsum(My("equation",e,t,n),...My("tensors",e,t,n))];case"Transpose":return[a.transpose(My("x",e,t,n),My("perm",e,t,n))];case"_FusedMatMul":const[r,s]=My("fusedOps",e,t,n),o="biasadd"===r,i="prelu"===s,u=My("numArgs",e,t,n),l=My("leakyreluAlpha",e,t,n);if(o){if(i&&2!==u)throw new Error("Fused MatMul with BiasAdd and Prelu must have two extra arguments: bias and alpha.");if(!i&&1!==u)throw new Error("Fused MatMul with BiasAdd must have one extra argument: bias.")}const[c,p]=My("args",e,t,n);return[a.fused.matMul({a:My("a",e,t,n),b:My("b",e,t,n),transposeA:My("transposeA",e,t,n),transposeB:My("transposeB",e,t,n),bias:c,activation:s,preluActivationWeights:p,leakyreluAlpha:l})];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"normalization":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"EuclideanNorm":return[a.euclideanNorm(My("x",e,t,n),My("axis",e,t,n),My("keepDims",e,t,n))];case"FusedBatchNorm":case"FusedBatchNormV2":case"FusedBatchNormV3":return[a.batchNorm(My("x",e,t,n),My("mean",e,t,n),My("variance",e,t,n),My("offset",e,t,n),My("scale",e,t,n),My("epsilon",e,t,n))];case"LRN":return[a.localResponseNormalization(My("x",e,t,n),My("radius",e,t,n),My("bias",e,t,n),My("alpha",e,t,n),My("beta",e,t,n))];case"Softmax":return[a.softmax(My("x",e,t,n))];case"LogSoftmax":return[a.logSoftmax(My("x",e,t,n))];case"SparseToDense":return[a.sparseToDense(My("sparseIndices",e,t,n),My("outputShape",e,t,n),My("sparseValues",e,t,n),My("defaultValue",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"reduction":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"Max":{const r=My("axis",e,t,n),s=My("keepDims",e,t,n);return[a.max(My("x",e,t,n),r,s)]}case"Mean":{const r=My("axis",e,t,n),s=My("keepDims",e,t,n);return[a.mean(My("x",e,t,n),r,s)]}case"Min":{const r=My("axis",e,t,n),s=My("keepDims",e,t,n);return[a.min(My("x",e,t,n),r,s)]}case"Sum":{const r=My("axis",e,t,n),s=My("keepDims",e,t,n);return[a.sum(My("x",e,t,n),r,s)]}case"All":{const r=My("axis",e,t,n),s=My("keepDims",e,t,n);return[a.all(My("x",e,t,n),r,s)]}case"Any":{const r=My("axis",e,t,n),s=My("keepDims",e,t,n);return[a.any(My("x",e,t,n),r,s)]}case"ArgMax":{const r=My("axis",e,t,n);return[a.argMax(My("x",e,t,n),r)]}case"ArgMin":{const r=My("axis",e,t,n);return[a.argMin(My("x",e,t,n),r)]}case"Prod":{const r=My("axis",e,t,n),s=My("keepDims",e,t,n);return[a.prod(My("x",e,t,n),r,s)]}case"Cumprod":{const r=My("axis",e,t,n),s=My("exclusive",e,t,n),o=My("reverse",e,t,n);return[a.cumprod(My("x",e,t,n),r,s,o)]}case"Cumsum":{const r=My("axis",e,t,n),s=My("exclusive",e,t,n),o=My("reverse",e,t,n);return[a.cumsum(My("x",e,t,n),r,s,o)]}case"Bincount":const r=My("x",e,t,n),s=My("weights",e,t,n),o=My("size",e,t,n);return[a.bincount(r,s,o)];case"DenseBincount":{const r=My("x",e,t,n),s=My("weights",e,t,n),o=My("size",e,t,n),i=My("binaryOutput",e,t,n);return[a.denseBincount(r,s,o,i)]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"slice_join":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"ConcatV2":case"Concat":{const r=My("n",e,t,n),s=My("axis",e,t,n);let o=My("tensors",e,t,n);return o=o.slice(0,r),[a.concat(o,s)]}case"Gather":{const r=My("x",e,t,n),s=My("indices",e,t,n);return[a.gather(r,a.cast(s,"int32"),0)]}case"GatherV2":{const r=My("axis",e,t,n),s=My("batchDims",e,t,n),o=My("x",e,t,n),i=My("indices",e,t,n);return[a.gather(o,a.cast(i,"int32"),r,s)]}case"Reverse":{const r=My("dims",e,t,n),s=[];for(let e=0;e<r.length;e++)r[e]&&s.push(e);const o=My("x",e,t,n);return[a.reverse(o,s)]}case"ReverseV2":{const r=My("axis",e,t,n),s=My("x",e,t,n);return[a.reverse(s,r)]}case"Slice":{const r=My("begin",e,t,n),s=My("size",e,t,n);return[a.slice(My("x",e,t,n),r,s)]}case"StridedSlice":{const r=My("begin",e,t,n),s=My("end",e,t,n),o=My("strides",e,t,n),i=My("beginMask",e,t,n),u=My("endMask",e,t,n),l=My("ellipsisMask",e,t,n),c=My("newAxisMask",e,t,n),p=My("shrinkAxisMask",e,t,n),d=My("x",e,t,n);return[a.stridedSlice(d,r,s,o,i,u,l,c,p)]}case"Pack":return Ps((()=>{const r=My("axis",e,t,n),s=My("tensors",e,t,n),o=s[0].shape,i=a.squeeze(s[0]).shape,u=s.map((e=>{const t=h(e.shape,o);if(!t&&!h(a.squeeze(e).shape,i))throw new Error("the input tensors shape does not match");return t?e:a.reshape(e,o)}));return[a.stack(u,r)]}));case"Unpack":{const r=My("axis",e,t,n),s=My("tensor",e,t,n);return a.unstack(s,r)}case"Tile":{const r=My("reps",e,t,n);return[a.tile(My("x",e,t,n),r)]}case"Split":case"SplitV":{const r=My("axis",e,t,n),s=My("numOrSizeSplits",e,t,n),o=My("x",e,t,n);return a.split(o,s,r)}case"ScatterNd":{const r=My("indices",e,t,n),s=My("values",e,t,n),o=My("shape",e,t,n);return[a.scatterND(r,s,o)]}case"GatherNd":{const r=My("x",e,t,n),s=My("indices",e,t,n);return[a.gatherND(r,s)]}case"SparseToDense":{const r=My("sparseIndices",e,t,n),s=My("outputShape",e,t,n),o=My("sparseValues",e,t,n),i=My("defaultValue",e,t,n);return[a.sparseToDense(r,o,s,o.dtype===i.dtype?i:a.cast(i,o.dtype))]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"sparse":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"SparseFillEmptyRows":{const{outputIndices:r,outputValues:s,emptyRowIndicator:o,reverseIndexMap:i}=a.sparse.sparseFillEmptyRows(My("indices",e,t,n),My("values",e,t,n),My("denseShape",e,t,n),My("defaultValue",e,t,n));return[r,s,o,i]}case"SparseReshape":{const{outputIndices:r,outputShape:s}=a.sparse.sparseReshape(My("inputIndices",e,t,n),My("inputShape",e,t,n),My("newShape",e,t,n));return[r,s]}case"SparseSegmentMean":return[a.sparse.sparseSegmentMean(My("data",e,t,n),My("indices",e,t,n),My("segmentIds",e,t,n))];case"SparseSegmentSum":return[a.sparse.sparseSegmentSum(My("data",e,t,n),My("indices",e,t,n),My("segmentIds",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"spectral":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"FFT":return[a.fft(My("x",e,t,n))];case"IFFT":return[a.ifft(My("x",e,t,n))];case"RFFT":return[a.rfft(My("x",e,t,n))];case"IRFFT":return[a.irfft(My("x",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"string":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"StringNGrams":{const{nGrams:r,nGramsSplits:s}=a.string.stringNGrams(My("data",e,t,n),My("dataSplits",e,t,n),My("separator",e,t,n),My("nGramWidths",e,t,n),My("leftPad",e,t,n),My("rightPad",e,t,n),My("padWidth",e,t,n),My("preserveShortSequences",e,t,n));return[r,s]}case"StringSplit":{const{indices:r,values:s,shape:o}=a.string.stringSplit(My("input",e,t,n),My("delimiter",e,t,n),My("skipEmpty",e,t,n));return[r,s,o]}case"StringToHashBucketFast":return[a.string.stringToHashBucketFast(My("input",e,t,n),My("numBuckets",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"transformation":return r((()=>((e,t,n,a=yb)=>{switch(e.op){case"Cast":return[a.cast(My("x",e,t,n),My("dtype",e,t,n))];case"ExpandDims":{const r=My("axis",e,t,n);return[a.expandDims(My("x",e,t,n),r)]}case"Squeeze":{const r=My("axis",e,t,n);return[a.squeeze(My("x",e,t,n),r)]}case"Reshape":return[a.reshape(My("x",e,t,n),My("shape",e,t,n))];case"MirrorPad":return[a.mirrorPad(My("x",e,t,n),My("padding",e,t,n),My("mode",e,t,n))];case"PadV2":case"Pad":return[a.pad(My("x",e,t,n),My("padding",e,t,n),My("constantValue",e,t,n))];case"SpaceToBatchND":{const r=My("blockShape",e,t,n),s=My("paddings",e,t,n);return[a.spaceToBatchND(My("x",e,t,n),r,s)]}case"BatchToSpaceND":{const r=My("blockShape",e,t,n),s=My("crops",e,t,n);return[a.batchToSpaceND(My("x",e,t,n),r,s)]}case"DepthToSpace":{const r=My("blockSize",e,t,n),s=My("dataFormat",e,t,n).toUpperCase();return[a.depthToSpace(My("x",e,t,n),r,s)]}case"BroadcastTo":return[a.broadcastTo(My("x",e,t,n),My("shape",e,t,n))];case"BroadcastArgs":return[a.broadcastArgs(My("s0",e,t,n),My("s1",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"hash_table":return(async(e,t,n,a)=>{switch(e.op){case"HashTable":case"HashTableV2":{const r=My("keyDType",e,t,n),s=My("valueDType",e,t,n),o=new Eb(r,s);return a.addHashTable(e.name,o),[o.handle]}case"LookupTableImport":case"LookupTableImportV2":{const r=My("tableHandle",e,t,n,a),s=My("keys",e,t,n),o=My("values",e,t,n),i=a.getHashTableById(r.id);return[await i.import(s,o)]}case"LookupTableFind":case"LookupTableFindV2":{const r=My("tableHandle",e,t,n,a),s=My("keys",e,t,n),o=My("defaultValue",e,t,n),i=a.getHashTableById(r.id);return[await i.find(s,o)]}case"LookupTableSize":case"LookupTableSizeV2":{const r=My("tableHandle",e,t,n,a);return[a.getHashTableById(r.id).tensorSize()]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n,a);case"custom":const s=_y(e.op);if(s&&s.customExecutor)return s.customExecutor(new gb(e,t,n));throw TypeError(`Custom op ${e.op} is not registered.`);default:throw TypeError(`Unknown op '${e.op}'. File an issue at https://github.com/tensorflow/tfjs/issues so we can add it, or register a custom execution with tf.registerOp()`)}})(e,t,n);return W(s)?s.then((e=>[].concat(e))):[].concat(s)}class Mb{constructor(e={},t={},n={},a={}){this.weightMap=e,this.tensorArrayMap=t,this.tensorListMap=n,this.functionMap=a,this.rootContext={id:0,frameName:"",iterationId:0},this.contexts=[this.rootContext],this.lastId=0,this.generateCurrentContextIds()}newFrame(e,t){return{id:e,frameName:t,iterationId:0}}set currentContext(e){this.contexts!==e&&(this.contexts=e,this.generateCurrentContextIds())}get currentContext(){return this.contexts}get currentContextId(){return this._currentContextIds[0]}get currentContextIds(){return this._currentContextIds}generateCurrentContextIds(){const e=[];for(let t=0;t<this.contexts.length-1;t++){const n=this.contexts.slice(0,this.contexts.length-t);e.push(this.contextIdforContexts(n))}e.push(""),this._currentContextIds=e}contextIdforContexts(e){return e?e.map((e=>0===e.id&&0===e.iterationId?"":`${e.frameName}-${e.iterationId}`)).join("/"):""}enterFrame(e){this.contexts&&(this.lastId++,this.contexts=this.contexts.slice(),this.contexts.push(this.newFrame(this.lastId,e)),this._currentContextIds.unshift(this.contextIdforContexts(this.contexts)))}exitFrame(){if(!(this.contexts&&this.contexts.length>1))throw new Error("Cannot exit frame, the context is empty");this.contexts=this.contexts.slice(),this.contexts.splice(-1),this.currentContextIds.shift()}nextIteration(){if(!(this.contexts&&this.contexts.length>0))throw new Error("Cannot increase frame iteration, the context is empty");{this.contexts=this.contexts.slice(),this.lastId++;const e=Object.assign({},this.contexts[this.contexts.length-1]);e.iterationId+=1,e.id=this.lastId,this.contexts.splice(-1,1,e),this._currentContextIds.splice(0,1,this.contextIdforContexts(this.contexts))}}getWeight(e){return this.weightMap[e]}addTensorArray(e){this.tensorArrayMap[e.id]=e}getTensorArray(e){return this.tensorArrayMap[e]}addTensorList(e){this.tensorListMap[e.id]=e}getTensorList(e){return this.tensorListMap[e]}dispose(e){for(const t in this.tensorArrayMap)this.tensorArrayMap[t].clearAndClose(e);for(const t in this.tensorListMap)this.tensorListMap[t].clearAndClose(e)}}
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ab(e,t,n,a){const r=new Set,s=[];let o=null,i=null;const u=new Set,l=Object.keys(e).map((e=>Fy(e)[0]));let c=[];null!=a&&(c=a.map((e=>Fy(e.name)[0])));const p=[...t];for(;p.length>0;){const e=p.pop();(Ob(e)||Cb(e)||Rb(e))&&null==o&&(o=e,i=o.children.map((e=>e.name)).filter((e=>r.has(e)))),r.add(e.name),null==n[e.name]&&(-1===l.indexOf(e.name)&&-1===c.indexOf(e.name)&&(0!==e.inputs.length?e.inputs.forEach((e=>{u.has(e.name)||(u.add(e.name),p.push(e))})):s.push(e.name)))}return{inputs:e,outputs:t,usedNodes:r,missingInputs:s,dynamicNode:o,syncInputs:i}}const $b=["Switch","Merge","Enter","Exit","NextIteration","StatelessIf","StatelessWhile","if","While"],Db=["NonMaxSuppressionV2","NonMaxSuppressionV3","NonMaxSuppressionV5","Where"],Fb=["HashTable","HashTableV2","LookupTableImport","LookupTableImportV2","LookupTableFind","LookupTableFindV2","LookupTableSize","LookupTableSizeV2"];function Ob(e){return $b.indexOf(e.op)>=0}function Cb(e){return Db.indexOf(e.op)>=0}function Rb(e){return Fb.indexOf(e.op)>=0}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class zb{constructor(e,t){this.graph=e,this.parent=t,this.compiledMap=new Map,this._weightMap={},this.SEPERATOR=",",this._functions={},this._functionExecutorMap={},this.intermediateTensors={},this.keepTensorForDebug=!1,this._outputs=e.outputs,this._inputs=e.inputs,this._initNodes=e.initNodes,this._signature=e.signature,this._functions=e.functions,null!=e.functions&&Object.keys(e.functions).forEach((t=>{this._functionExecutorMap[t]=new zb(e.functions[t],this)}))}get weightIds(){return this.parent?this.parent.weightIds:this._weightIds}get functionExecutorMap(){return this.parent?this.parent.functionExecutorMap:this._functionExecutorMap}get weightMap(){return this.parent?this.parent.weightMap:this._weightMap}set weightMap(e){const t=Object.keys(e).map((t=>e[t].map((e=>e.id))));this._weightIds=[].concat(...t),this._weightMap=e}set resourceManager(e){this._resourceManager=e}get inputs(){return this._inputs.map((e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0})))}get outputs(){return this._outputs.map((e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0})))}get inputNodes(){return this._inputs.map((e=>e.signatureKey||e.name))}get outputNodes(){return this._outputs.map((e=>{const t=e.signatureKey||e.name;return e.defaultOutput?`${t}:${e.defaultOutput}`:t}))}get functions(){return Object.keys(this._functions).reduce(((e,t)=>(e[t]=this._functions[t].signature,e)),{})}getCompilationKey(e,t){const n=e.map((e=>e.name)).sort(),a=t.map((e=>e.name)).sort();return n.join(this.SEPERATOR)+"--"+a.join(this.SEPERATOR)}compile(e,t){const n=Ab(e,t,this.weightMap,this._initNodes),{missingInputs:a,dynamicNode:r,syncInputs:s}=n;if(null!=r)throw new Error(`This execution contains the node '${r.name}', which has the dynamic op '${r.op}'. Please use model.executeAsync() instead. Alternatively, to avoid the dynamic ops, specify the inputs [${s}]`);if(a.length>0){const n=t.map((e=>e.name)),r=Object.keys(e);throw new Error(`Cannot compute the outputs [${n}] from the provided inputs [${r}]. Missing the following inputs: [${a}]`)}return function(e,t,n){const{usedNodes:a,inputs:r}=n,s=[],o=Object.keys(r).map((e=>Fy(e)[0])).map((t=>e.nodes[t])),i=e.initNodes;o.forEach((e=>{a.has(e.name)&&s.push(e)})),e.weights.forEach((e=>{a.has(e.name)&&s.push(e)})),null!=i&&i.forEach((e=>{a.has(e.name)&&s.push(e)}));const u=new Set,l=[];for(;s.length>0;){const e=s.pop();u.add(e.name),t[e.name]||l.push(e),e.children.forEach((e=>{!u.has(e.name)&&a.has(e.name)&&e.inputs.every((e=>u.has(e.name)))&&s.push(e)}))}return l}(this.graph,this.weightMap,n)}execute(e,t){e=this.mapInputs(e);const n=Object.keys(e).sort();this.checkInputs(e),this.checkInputShapeAndType(e),t=this.mapOutputs(t),this.checkOutputs(t);const a=n.map((e=>this.graph.nodes[Fy(e)[0]])),r=t.map((e=>Fy(e)[0]));let s=r.map((e=>this.graph.nodes[e]));this.resetIntermediateTensors(),0===s.length&&(s=this._outputs);const o=this.getCompilationKey(a,s);let i=this.compiledMap.get(o);null==i&&(i=this.compile(e,s),this.compiledMap.set(o,i));const u={},l={};return Ps((()=>{const n=new Mb(this.weightMap,u,l,this.functionExecutorMap),a=Object.assign({},this.weightMap);Object.keys(e).forEach((t=>{const[n,r]=Fy(t),s=[];s[r]=e[t],a[n]=s}));const s=this.getFrozenTensorIds(a),o={};for(let e=0;e<i.length;e++){const t=i[e];if(!a[t.name]){const e=_b(t,a,n,this._resourceManager);if(W(e))throw new Error(`The execution of the op '${t.op}' returned a promise. Please use model.executeAsync() instead.`);a[t.name]=e,this.checkTensorForDisposal(t.name,t,a,n,s,r,o)}}return null==this.parent&&n.dispose(s),t.map((e=>Ay(e,a,n)))}))}getFrozenTensorIds(e){const t=[].concat.apply([],Object.keys(e).map((t=>e[t])).map((e=>e.map((e=>e.id)))));return new Set(t)}checkTensorForDisposal(e,t,n,a,r,s,o){"control"!==t.category&&-1===s.indexOf(e)&&(n[e].forEach((e=>{null!=e&&(o[e.id]=(o[e.id]||0)+t.children.length)})),t.inputs.forEach((e=>{if("control"!==e.category){const s=function(e,t,n){return t[Dy(e,n.currentContextId)]}(e.name,n,a);null!=s&&s.forEach((e=>{if(e&&!e.kept&&!r.has(e.id)){const n=o[e.id];if(1===n){if(this.keepTensorForDebug){const[n,r]=$y(t.name,a);this.intermediateTensors[n]||(this.intermediateTensors[n]=[]),this.intermediateTensors[n][r]=e}else e.dispose();delete o[e.id]}else null!=n&&o[e.id]--}}))}})))}async executeAsync(e,t){return this._executeAsync(e,t)}disposeIntermediateTensors(){this.intermediateTensors&&(Object.keys(this.intermediateTensors).forEach((e=>this.intermediateTensors[e].forEach((e=>e.dispose())))),this.disposeTensorsMap())}disposeTensorsMap(){this.tensorsMap&&Object.keys(this.tensorsMap).forEach((e=>{this.tensorsMap[e].forEach((e=>{!e||e.kept||e.isDisposed||this.keepIds.has(e.id)||e.dispose()}))}))}getIntermediateTensors(){return this.tensorsMap}resetIntermediateTensors(){for(const e in this.intermediateTensors)this.intermediateTensors[e].forEach((e=>e.dispose())),delete this.intermediateTensors[e]}async _executeAsync(e,t,n=!1,a={},r={}){n||(e=this.mapInputs(e),this.checkInputs(e),this.checkInputShapeAndType(e),t=this.mapOutputs(t),this.checkOutputs(t));try{this.keepTensorForDebug=j().getBool("KEEP_INTERMEDIATE_TENSORS")}catch(e){console.warn(e.message)}this.resetIntermediateTensors();const s=new Mb(this.weightMap,a,r,this.functionExecutorMap);this.tensorsMap=await this.executeWithControlFlow(e,s,t,n);const o=t.map((e=>Ay(e,this.tensorsMap,s))),i=o.map((e=>e.id)),u=Object.keys(e).map((t=>e[t].id));return this.keepIds=new Set([...i,...u,...this.weightIds]),this.keepTensorForDebug||this.disposeTensorsMap(),null==this.parent&&s.dispose(this.keepIds),o}async executeFunctionAsync(e,t,n){const a=e.reduce(((e,t,n)=>(e[this.inputs[n].name]=t,e)),{});return this._executeAsync(a,this.outputNodes,!0,t,n)}async executeWithControlFlow(e,t,n,a){const r=Object.keys(e),s=r.map((e=>this.graph.nodes[Fy(e)[0]])),o=n.map((e=>Fy(e)[0]));let i=o.map((e=>this.graph.nodes[e]));0===i.length&&(i=this._outputs);const{usedNodes:u,missingInputs:l,dynamicNode:c,syncInputs:p}=Ab(e,i,this.weightMap,this._initNodes),d=[...s,...this.graph.weights,...this._initNodes||[]].map((e=>({node:e,contexts:t.currentContext}))),h=Object.assign({},this.weightMap);Object.keys(e).forEach((t=>{const[n,a]=Fy(t),r=[];r[a]=e[t],h[n]=r}));const m={},f=this.getFrozenTensorIds(h),g={};for(;d.length>0;){const e=this.processStack(s,d,t,h,g,f,o,m,u);await Promise.all(e)}null!=c||a||console.warn("This model execution did not contain any nodes with control flow or dynamic output shapes. You can use model.execute() instead.");const y=i.filter((e=>!Ob(e)&&!Ay(e.name,h,t))).map((e=>e.name));if(y.length>0){let e="";throw null!=c&&(e=`Alternatively, to avoid the dynamic ops, use model.execute() and specify the inputs [${p}]`),new Error(`Cannot compute the outputs [${y}] from the provided inputs [${r}]. Consider providing the following inputs: [${l}]. ${e}`)}return h}processStack(e,t,n,a,r,s,o,i,u){const l=[];for(;t.length>0;){const e=t.pop();n.currentContext=e.contexts;let c="";if("Enter"===e.node.op&&My("isConstant",e.node,a,n)&&([c]=$y(e.node.name,n)),null==a[e.node.name]){const p=_b(e.node,a,n,this._resourceManager);c||([c]=$y(e.node.name,n));const d=n.currentContext;W(p)?l.push(p.then((l=>(a[c]=l,n.currentContext=d,this.checkTensorForDisposal(c,e.node,a,n,s,o,i),this.processChildNodes(e.node,t,n,a,r,u),l)))):(a[c]=p,this.checkTensorForDisposal(c,e.node,a,n,s,o,i),this.processChildNodes(e.node,t,n,a,r,u))}else this.processChildNodes(e.node,t,n,a,r,u)}return l}processChildNodes(e,t,n,a,r,s){e.children.forEach((e=>{const[o]=$y(e.name,n);!r[o]&&s.has(e.name)&&("Merge"===e.op?e.inputNames.some((e=>!!Ay(e,a,n)))&&(r[o]=!0,t.push({contexts:n.currentContext,node:e})):e.inputNames.every((e=>!!Ay(e,a,n)))&&(r[o]=!0,t.push({contexts:n.currentContext,node:e})))}))}dispose(){Object.keys(this.weightMap).forEach((e=>this.weightMap[e].forEach((e=>e.dispose()))))}checkInputShapeAndType(e){Object.keys(e).forEach((t=>{const n=e[t],[a]=Fy(t),r=this.graph.nodes[a];if(r.attrParams.shape&&r.attrParams.shape.value){const e=r.attrParams.shape.value;u(e.length===n.shape.length&&n.shape.every(((t,n)=>-1===e[n]||e[n]===t)),(()=>`The shape of dict['${r.name}'] provided in model.execute(dict) must be [${e}], but was [${n.shape}]`))}r.attrParams.dtype&&r.attrParams.dtype.value&&u(n.dtype===r.attrParams.dtype.value,(()=>`The dtype of dict['${r.name}'] provided in model.execute(dict) must be ${r.attrParams.dtype.value}, but was ${n.dtype}`))}))}mapInputs(e){const t={};for(const n in e)if(null!=this._signature&&null!=this._signature.inputs&&null!=this._signature.inputs[n]){t[this._signature.inputs[n].name]=e[n]}else t[n]=e[n];return t}checkInputs(e){const t=Object.keys(e).filter((e=>{const[t]=Fy(e);return null==this.graph.nodes[t]}));if(t.length>0)throw new Error(`The dict provided in model.execute(dict) has keys: [${t}] that are not part of graph`)}mapOutputs(e){return e.map((e=>{if(null!=this._signature&&null!=this._signature.outputs&&null!=this._signature.outputs[e]){return this._signature.outputs[e].name}return e}),{})}checkOutputs(e){e.forEach((e=>{const[t]=Fy(e);if(!this.graph.nodes[t])throw new Error(`The output '${e}' is not found in the graph`)}))}}class Bb{constructor(e={},t={}){this.hashTableNameToHandle=e,this.hashTableMap=t}addHashTable(e,t){this.hashTableNameToHandle[e]=t.handle,this.hashTableMap[t.id]=t}getHashTableHandleByName(e){return this.hashTableNameToHandle[e]}getHashTableById(e){return this.hashTableMap[e]}dispose(){for(const e in this.hashTableMap)this.hashTableMap[e].clearAndClose(),delete this.hashTableMap[e];for(const e in this.hashTableNameToHandle)this.hashTableNameToHandle[e].dispose(),delete this.hashTableNameToHandle[e]}}
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Lb="?tfjs-format=file",Pb="model.json";class Vb{constructor(e,t={},n=Qr){this.modelUrl=e,this.loadOptions=t,this.version="n/a",this.io=n,null==t&&(this.loadOptions={}),this.resourceManager=new Bb}get modelVersion(){return this.version}get inputNodes(){return this.executor.inputNodes}get outputNodes(){return this.executor.outputNodes}get inputs(){return this.executor.inputs}get outputs(){return this.executor.outputs}get weights(){return this.executor.weightMap}get metadata(){return this.artifacts.userDefinedMetadata}get modelSignature(){return this.signature}get modelStructuredOutputKeys(){return this.structuredOutputKeys}findIOHandler(){const e=this.modelUrl;if(null!=e.load)this.handler=e;else if(null!=this.loadOptions.requestInit)this.handler=this.io.browserHTTPRequest(e,this.loadOptions);else{const t=this.io.getLoadHandlers(e,this.loadOptions);if(0===t.length)t.push(this.io.browserHTTPRequest(e,this.loadOptions));else if(t.length>1)throw new Error(`Found more than one (${t.length}) load handlers for URL '${[e]}'`);this.handler=t[0]}}load(){if(this.findIOHandler(),null==this.handler.load)throw new Error("Cannot proceed with model loading because the IOHandler provided does not have the `load` method implemented.");const e=this.handler.load();return W(e)?e.then((e=>this.loadSync(e))):this.loadSync(e)}loadSync(e){this.artifacts=e;const t=this.artifacts.modelTopology;let n=this.artifacts.signature;if(null!=this.artifacts.userDefinedMetadata){const e=this.artifacts.userDefinedMetadata;null!=e.signature&&(n=e.signature),null!=e.structuredOutputKeys&&(this.structuredOutputKeys=e.structuredOutputKeys)}this.signature=n,this.version=`${t.versions.producer}.${t.versions.minConsumer}`;const a=this.io.decodeWeights(this.artifacts.weightData,this.artifacts.weightSpecs);if(this.executor=new zb(tb.Instance.transformGraph(t,this.signature)),this.executor.weightMap=this.convertTensorMapToTensorsMap(a),this.executor.resourceManager=this.resourceManager,null!=e.modelInitializer&&null!=e.modelInitializer.node){const t=tb.Instance.transformGraph(e.modelInitializer);this.initializer=new zb(t),this.initializer.weightMap=this.executor.weightMap,this.initializer.resourceManager=this.resourceManager,this.initializer.executeAsync({},[])}return!0}async save(e,t){if("string"==typeof e){const t=this.io.getSaveHandlers(e);if(0===t.length)throw new Error(`Cannot find any save handlers for URL '${e}'`);if(t.length>1)throw new Error(`Found more than one (${t.length}) save handlers for URL '${e}'`);e=t[0]}if(null==e.save)throw new Error("GraphModel.save() cannot proceed because the IOHandler provided does not have the `save` attribute defined.");return e.save(this.artifacts)}predict(e,t){const n=this.execute(e,this.outputNodes);if(this.structuredOutputKeys){const e={};return(n instanceof ga?[n]:n).forEach(((t,n)=>e[this.structuredOutputKeys[n]]=t)),e}return n}normalizeInputs(e){if(!(e instanceof ga||Array.isArray(e)))return e;if((e=Array.isArray(e)?e:[e]).length!==this.inputNodes.length)throw new Error(`Input tensor count mismatch,the graph model has ${this.inputNodes.length} placeholders, while there are ${e.length} input tensors.`);return this.inputNodes.reduce(((t,n,a)=>(t[n]=e[a],t)),{})}normalizeOutputs(e){return e=e||this.outputNodes,Array.isArray(e)?e:[e]}execute(e,t){e=this.normalizeInputs(e),t=this.normalizeOutputs(t);const n=this.executor.execute(e,t);return n.length>1?n:n[0]}async executeAsync(e,t){e=this.normalizeInputs(e),t=this.normalizeOutputs(t);const n=await this.executor.executeAsync(e,t);return n.length>1?n:n[0]}getIntermediateTensors(){return this.executor.getIntermediateTensors()}disposeIntermediateTensors(){this.executor.disposeIntermediateTensors()}convertTensorMapToTensorsMap(e){return Object.keys(e).reduce(((t,n)=>(t[n]=[e[n]],t)),{})}dispose(){this.executor.dispose(),this.initializer&&this.initializer.dispose(),this.resourceManager.dispose()}}async function Wb(e,t={},n=Qr){if(null==e)throw new Error("modelUrl in loadGraphModel() cannot be null. Please provide a url or an IOHandler that loads the model");null==t&&(t={}),t.fromTFHub&&"string"==typeof e&&(e=function(e){e.endsWith("/")||(e+="/");return`${e}${Pb}${Lb}`}
/**
    * @license
    * Copyright 2021 Google LLC. All Rights Reserved.
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    * http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    * =============================================================================
    */(e));const a=new Vb(e,t,n);return await a.load(),a}var Hb=function(e,t){return(Hb=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)};function qb(e,t){function n(){this.constructor=e}Hb(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}var jb=function(){return(jb=Object.assign||function(e){for(var t,n=1,a=arguments.length;n<a;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}).apply(this,arguments)};function Ub(e,t,n,a){return new(n||(n=Promise))((function(t,r){function s(e){try{i(a.next(e))}catch(e){r(e)}}function o(e){try{i(a.throw(e))}catch(e){r(e)}}function i(e){e.done?t(e.value):new n((function(t){t(e.value)})).then(s,o)}i((a=a.apply(e,[])).next())}))}function Kb(e,t){var n,a,r,s,o={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return s={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function i(s){return function(i){return function(s){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,a&&(r=2&s[0]?a.return:s[0]?a.throw||((r=a.return)&&r.call(a),0):a.next)&&!(r=r.call(a,s[1])).done)return r;switch(a=0,r&&(s=[2&s[0],r.value]),s[0]){case 0:case 1:r=s;break;case 4:return o.label++,{value:s[1],done:!1};case 5:o.label++,a=s[1],s=[0];continue;case 7:s=o.ops.pop(),o.trys.pop();continue;default:if(!(r=(r=o.trys).length>0&&r[r.length-1])&&(6===s[0]||2===s[0])){o=0;continue}if(3===s[0]&&(!r||s[1]>r[0]&&s[1]<r[3])){o.label=s[1];break}if(6===s[0]&&o.label<r[1]){o.label=r[1],r=s;break}if(r&&o.label<r[2]){o.label=r[2],o.ops.push(s);break}r[2]&&o.ops.pop(),o.trys.pop();continue}s=t.call(e,o)}catch(e){s=[6,e],a=0}finally{n=r=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,i])}}}var Gb=function(){function e(e,t){this.model=e,this.outputStride=t;var n=this.model.inputs[0].shape;u(-1===n[1]&&-1===n[2],(function(){return"Input shape ["+n[1]+", "+n[2]+"] must both be equal to or -1"}))}return e.prototype.predict=function(e){var t=this;return Ps((function(){var n=t.preprocessInput(Cr(e,"float32")),a=mi(n,0),r=t.model.predict(a).map((function(e){return Bl(e,[0])})),s=t.nameOutputResults(r);return{heatmapScores:Io(s.heatmap),offsets:s.offsets,displacementFwd:s.displacementFwd,displacementBwd:s.displacementBwd}}))},e.prototype.dispose=function(){this.model.dispose()},e}(),Yb=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return qb(t,e),t.prototype.preprocessInput=function(e){return Ps((function(){return Vi(Us(e,127.5),1)}))},t.prototype.nameOutputResults=function(e){return{offsets:e[0],heatmap:e[1],displacementFwd:e[2],displacementBwd:e[3]}},t}(Gb);function Qb(e){return Math.floor(e/2)}var Xb=function(){function e(e,t){this.priorityQueue=new Array(e),this.numberOfElements=-1,this.getElementValue=t}return e.prototype.enqueue=function(e){this.priorityQueue[++this.numberOfElements]=e,this.swim(this.numberOfElements)},e.prototype.dequeue=function(){var e=this.priorityQueue[0];return this.exchange(0,this.numberOfElements--),this.sink(0),this.priorityQueue[this.numberOfElements+1]=null,e},e.prototype.empty=function(){return-1===this.numberOfElements},e.prototype.size=function(){return this.numberOfElements+1},e.prototype.all=function(){return this.priorityQueue.slice(0,this.numberOfElements+1)},e.prototype.max=function(){return this.priorityQueue[0]},e.prototype.swim=function(e){for(;e>0&&this.less(Qb(e),e);)this.exchange(e,Qb(e)),e=Qb(e)},e.prototype.sink=function(e){for(;2*e<=this.numberOfElements;){var t=2*e;if(t<this.numberOfElements&&this.less(t,t+1)&&t++,!this.less(e,t))break;this.exchange(e,t),e=t}},e.prototype.getValueAt=function(e){return this.getElementValue(this.priorityQueue[e])},e.prototype.less=function(e,t){return this.getValueAt(e)<this.getValueAt(t)},e.prototype.exchange=function(e,t){var n=this.priorityQueue[e];this.priorityQueue[e]=this.priorityQueue[t],this.priorityQueue[t]=n},e}();function Jb(e,t,n,a,r,s){for(var o=s.shape,i=o[0],u=o[1],l=!0,c=Math.max(n-r,0),p=Math.min(n+r+1,i),d=c;d<p;++d){for(var h=Math.max(a-r,0),m=Math.min(a+r+1,u),f=h;f<m;++f)if(s.get(d,f,e)>t){l=!1;break}if(!l)break}return l}var Zb=["nose","leftEye","rightEye","leftEar","rightEar","leftShoulder","rightShoulder","leftElbow","rightElbow","leftWrist","rightWrist","leftHip","rightHip","leftKnee","rightKnee","leftAnkle","rightAnkle"],ek=Zb.length,tk=Zb.reduce((function(e,t,n){return e[t]=n,e}),{});function nk(e,t,n,a){return{y:a.get(e,t,n),x:a.get(e,t,n+ek)}}function ak(e,t,n){var a=nk(e.heatmapY,e.heatmapX,e.id,n),r=a.y,s=a.x;return{x:e.heatmapX*t+s,y:e.heatmapY*t+r}}function rk(e,t,n){return e<t?t:e>n?n:e}function sk(e,t){return{x:e.x+t.x,y:e.y+t.y}}[["leftHip","leftShoulder"],["leftElbow","leftShoulder"],["leftElbow","leftWrist"],["leftHip","leftKnee"],["leftKnee","leftAnkle"],["rightHip","rightShoulder"],["rightElbow","rightShoulder"],["rightElbow","rightWrist"],["rightHip","rightKnee"],["rightKnee","rightAnkle"],["leftShoulder","rightShoulder"],["leftHip","rightHip"]].map((function(e){var t=e[0],n=e[1];return[tk[t],tk[n]]}));var ok=[["nose","leftEye"],["leftEye","leftEar"],["nose","rightEye"],["rightEye","rightEar"],["nose","leftShoulder"],["leftShoulder","leftElbow"],["leftElbow","leftWrist"],["leftShoulder","leftHip"],["leftHip","leftKnee"],["leftKnee","leftAnkle"],["nose","rightShoulder"],["rightShoulder","rightElbow"],["rightElbow","rightWrist"],["rightShoulder","rightHip"],["rightHip","rightKnee"],["rightKnee","rightAnkle"]].map((function(e){var t=e[0],n=e[1];return[tk[t],tk[n]]})),ik=ok.map((function(e){return e[1]})),uk=ok.map((function(e){return e[0]}));function lk(e,t,n,a){return{y:rk(Math.round(e.y/t),0,n-1),x:rk(Math.round(e.x/t),0,a-1)}}function ck(e,t,n,a,r,s,o,i){void 0===i&&(i=2);for(var u=a.shape,l=u[0],c=u[1],p=function(e,t,n){var a=n.shape[2]/2;return{y:n.get(t.y,t.x,e),x:n.get(t.y,t.x,a+e)}}(e,lk(t.position,s,l,c),o),d=sk(t.position,p),h=0;h<i;h++){var m=lk(d,s,l,c),f=nk(m.y,m.x,n,r);d=sk({x:m.x*s,y:m.y*s},{x:f.x,y:f.y})}var g=lk(d,s,l,c),y=a.get(g.y,g.x,n);return{position:d,part:Zb[n],score:y}}function pk(e,t,n,a,r,s){var o=t.shape[2],i=ik.length,u=new Array(o),l=e.part,c=e.score,p=ak(l,a,n);u[l.id]={score:c,part:Zb[l.id],position:p};for(var d=i-1;d>=0;--d){var h=ik[d],m=uk[d];u[h]&&!u[m]&&(u[m]=ck(d,u[h],m,t,n,a,s))}for(d=0;d<i;++d)h=uk[d],m=ik[d],u[h]&&!u[m]&&(u[m]=ck(d,u[h],m,t,n,a,r));return u}function dk(e,t,n,a){var r=n.x,s=n.y;return e.some((function(e){var n=e.keypoints[a].position;return function(e,t,n,a){var r=n-e,s=a-t;return r*r+s*s}(s,r,n.y,n.x)<=t}))}function hk(e,t,n){return n.reduce((function(n,a,r){var s=a.position,o=a.score;return dk(e,t,s,r)||(n+=o),n}),0)/n.length}function mk(e,t,n,a,r,s,o,i){void 0===o&&(o=.5),void 0===i&&(i=20);for(var u=[],l=function(e,t,n){for(var a=n.shape,r=a[0],s=a[1],o=a[2],i=new Xb(r*s*o,(function(e){return e.score})),u=0;u<r;++u)for(var l=0;l<s;++l)for(var c=0;c<o;++c){var p=n.get(u,l,c);p<e||Jb(c,p,u,l,t,n)&&i.enqueue({score:p,part:{heatmapY:u,heatmapX:l,id:c}})}return i}(o,1,e),c=i*i;u.length<s&&!l.empty();){var p=l.dequeue();if(!dk(u,c,ak(p.part,r,t),p.part.id)){var d=pk(p,e,t,r,n,a),h=hk(u,c,d);u.push({keypoints:d,score:h})}}return u}function fk(e){var t=e.shape,n=t[0],a=t[1],r=t[2];return Ps((function(){var t=wo(e,[n*a,r]),s=eo(t,0),o=mi(Us(s,kl(a,"int32")),1),i=mi(function(e,t){return Ps((function(){var n=Us(e,kl(t,"int32"));return Vi(e,Ks(n,kl(t,"int32")))}))}(s,a),1);return To([o,i],1)}))}function gk(e,t,n,a){return{y:a.get(e,t,n),x:a.get(e,t,n+ek)}}function yk(e,t,n){return Ps((function(){var a=function(e,t){for(var n=[],a=0;a<ek;a++){var r=gk(e.get(a,0).valueOf(),e.get(a,1).valueOf(),a,t),s=r.x,o=r.y;n.push(o),n.push(s)}return ql(n,[ek,2])}(e,n);return qs(Cr(Ks(e.toTensor(),kl(t,"int32")),"float32"),a)}))}function bk(e,t,n){return Ub(this,0,void 0,(function(){var a,r,s,o,i,u,l,c,p,d;return Kb(this,(function(h){switch(h.label){case 0:return a=0,r=fk(e),[4,Promise.all([e.buffer(),t.buffer(),r.buffer()])];case 1:return s=h.sent(),o=s[0],i=s[1],u=s[2],[4,(l=yk(u,n,i)).buffer()];case 2:return c=h.sent(),p=Array.from(function(e,t){for(var n=t.shape[0],a=new Float32Array(n),r=0;r<n;r++){var s=t.get(r,0),o=t.get(r,1);a[r]=e.get(s,o,r)}return a}(o,u)),d=p.map((function(e,t){return a+=e,{position:{y:c.get(t,0),x:c.get(t,1)},part:Zb[t],score:e}})),r.dispose(),l.dispose(),[2,{keypoints:d,score:a/d.length}]}}))}))}var kk="https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/",xk="https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/";var wk=[-123.15,-115.9,-103.06],Nk=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return qb(t,e),t.prototype.preprocessInput=function(e){return qs(e,wk)},t.prototype.nameOutputResults=function(e){var t=e[0],n=e[1];return{offsets:e[2],heatmap:e[3],displacementFwd:t,displacementBwd:n}},t}(Gb);function vk(e){return Ub(this,0,void 0,(function(){return Kb(this,(function(t){return[2,Promise.all(e.map((function(e){return e.buffer()})))]}))}))}function Tk(e,t){return _k(e,t)?e:Math.floor(e/t)*t+1}function Ik(e){u("number"==typeof e||"object"==typeof e,(function(){return"Invalid inputResolution "+e+". Should be a number or an object with width and height"})),"object"==typeof e&&(u("number"==typeof e.width,(function(){return"inputResolution.width has a value of "+e.width+" which is invalid; it must be a number"})),u("number"==typeof e.height,(function(){return"inputResolution.height has a value of "+e.height+" which is invalid; it must be a number"})))}function Sk(e,t){return Ik(e),"object"==typeof e?[Tk(e.height,t),Tk(e.width,t)]:[Tk(e,t),Tk(e,t)]}var Ek=[8,16,32];function _k(e,t){return(e-1)%t==0}function Mk(e){return e instanceof ga?[e.shape[0],e.shape[1]]:[e.height,e.width]}function Ak(e,t){var n=t[0],a=t[1],r=Mk(e),s=r[0],o=r[1],i=a/n,u=[0,0,0,0],l=u[0],c=u[1],p=u[2],d=u[3];return o/s<i?(l=0,c=0,p=Math.round(.5*(i*s-o)),d=Math.round(.5*(i*s-o))):(l=Math.round(.5*(1/i*o-s)),c=Math.round(.5*(1/i*o-s)),p=0,d=0),{resized:Ps((function(){var t=function(e){return e instanceof ga?e:rs(e)}(e);return t=Tu(t,[[l,c],[p,d],[0,0]]),pp.resizeBilinear(t,[n,a])})),padding:{top:l,left:p,right:d,bottom:c}}}function $k(e,t,n,a,r){var s=t[0],o=t[1],i=n[0],u=n[1],l=function(e,t,n,a,r){return void 0===a&&(a=0),void 0===r&&(r=0),1===n&&1===t&&0===a&&0===r?e:e.map((function(e){return function(e,t,n,a,r){return void 0===a&&(a=0),void 0===r&&(r=0),{score:e.score,keypoints:e.keypoints.map((function(e){var s=e.score,o=e.part,i=e.position;return{score:s,part:o,position:{x:i.x*n+r,y:i.y*t+a}}}))}}(e,t,n,a,r)}))}(e,(s+a.top+a.bottom)/i,(o+a.left+a.right)/u,-a.top,-a.left);return r?function(e,t){return t<=0?e:e.map((function(e){return function(e,t){return{score:e.score,keypoints:e.keypoints.map((function(e){var n=e.score,a=e.part,r=e.position;return{score:n,part:a,position:{x:t-1-r.x,y:r.y}}}))}}(e,t)}))}(l,o):l}var Dk={architecture:"MobileNetV1",outputStride:16,multiplier:.75,inputResolution:257},Fk=["MobileNetV1","ResNet50"],Ok={MobileNetV1:[8,16,32],ResNet50:[32,16]},Ck={MobileNetV1:[.5,.75,1],ResNet50:[1]},Rk=[1,2,4];var zk={flipHorizontal:!1},Bk={flipHorizontal:!1,maxDetections:5,scoreThreshold:.5,nmsRadius:20};var Lk=function(){function e(e,t){(function(e){u("number"==typeof e,(function(){return"outputStride is not a number"})),u(Ek.indexOf(e)>=0,(function(){return"outputStride of "+e+" is invalid. It must be either 8, 16, or 32"}))})(e.outputStride),function(e,t){u("number"==typeof e[0]&&"number"==typeof e[1],(function(){return"both resolution values must be a number but had values "+e})),u(_k(e[0],t),(function(){return"height of "+e[0]+" is invalid for output stride "+t+"."})),u(_k(e[1],t),(function(){return"width of "+e[1]+" is invalid for output stride "+t+"."}))}(t,e.outputStride),this.baseModel=e,this.inputResolution=t}return e.prototype.estimateMultiplePoses=function(e,t){return void 0===t&&(t=Bk),Ub(this,0,void 0,(function(){var n,a,r,s,o,i,u,l,c,p,d,h,m,f,g,y,b,k,x,w,N;return Kb(this,(function(v){switch(v.label){case 0:return n=jb({},Bk,t),function(e){var t=e.maxDetections,n=e.scoreThreshold,a=e.nmsRadius;if(t<=0)throw new Error("Invalid maxDetections "+t+". Should be > 0");if(n<0||n>1)throw new Error("Invalid scoreThreshold "+n+". Should be in range [0.0, 1.0]");if(a<=0)throw new Error("Invalid nmsRadius "+a+".")}(t),a=this.baseModel.outputStride,r=this.inputResolution,s=Mk(e),o=s[0],i=s[1],u=Ak(e,r),l=u.resized,c=u.padding,p=this.baseModel.predict(l),d=p.heatmapScores,h=p.offsets,m=p.displacementFwd,f=p.displacementBwd,[4,vk([d,h,m,f])];case 1:return g=v.sent(),y=g[0],b=g[1],k=g[2],x=g[3],[4,mk(y,b,k,x,a,n.maxDetections,n.scoreThreshold,n.nmsRadius)];case 2:return w=v.sent(),N=$k(w,[o,i],r,c,n.flipHorizontal),d.dispose(),h.dispose(),m.dispose(),f.dispose(),l.dispose(),[2,N]}}))}))},e.prototype.estimateSinglePose=function(e,t){return void 0===t&&(t=zk),Ub(this,0,void 0,(function(){var n,a,r,s,o,i,u,l,c,p,d,h,m,f,g,y;return Kb(this,(function(b){switch(b.label){case 0:return n=jb({},zk,t),a=this.baseModel.outputStride,r=this.inputResolution,s=Mk(e),o=s[0],i=s[1],u=Ak(e,r),l=u.resized,c=u.padding,p=this.baseModel.predict(l),d=p.heatmapScores,h=p.offsets,m=p.displacementFwd,f=p.displacementBwd,[4,bk(d,h,a)];case 1:return g=b.sent(),y=$k([g],[o,i],r,c,n.flipHorizontal),d.dispose(),h.dispose(),m.dispose(),f.dispose(),l.dispose(),[2,y[0]]}}))}))},e.prototype.estimatePoses=function(e,t){return Ub(this,0,void 0,(function(){return Kb(this,(function(n){switch(n.label){case 0:return"single-person"!==t.decodingMethod?[3,2]:[4,this.estimateSinglePose(e,t)];case 1:return[2,[n.sent()]];case 2:return[2,this.estimateMultiplePoses(e,t)]}}))}))},e.prototype.dispose=function(){this.baseModel.dispose()},e}();function Pk(e){return Ub(this,0,void 0,(function(){var t,n,a,r,s,o,i;return Kb(this,(function(u){switch(u.label){case 0:if(t=e.outputStride,n=e.quantBytes,a=e.multiplier,null==ad)throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please also include @tensorflow/tfjs on the page before using this\n        model.");return r=function(e,t,n){var a={1:"100",.75:"075",.5:"050"},r="model-stride"+e+".json";return 4===n?kk+"float/"+a[t]+"/"+r:kk+"quant"+n+"/"+a[t]+"/"+r}(t,a,n),[4,Wb(e.modelUrl||r)];case 1:return s=u.sent(),o=new Yb(s,t),i=Sk(e.inputResolution,o.outputStride),[2,new Lk(o,i)]}}))}))}function Vk(e){return Ub(this,0,void 0,(function(){var t,n,a,r,s,o;return Kb(this,(function(i){switch(i.label){case 0:if(t=e.outputStride,n=e.quantBytes,null==ad)throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please also include @tensorflow/tfjs on the page before using this\n        model.");return a=function(e,t){var n="model-stride"+e+".json";return 4===t?xk+"float/"+n:xk+"quant"+t+"/"+n}(t,n),[4,Wb(e.modelUrl||a)];case 1:return r=i.sent(),s=new Nk(r,t),o=Sk(e.inputResolution,s.outputStride),[2,new Lk(s,o)]}}))}))}function Wk(e){return void 0===e&&(e=Dk),Ub(this,0,void 0,(function(){return Kb(this,(function(t){return"ResNet50"===(e=function(e){if(null==(e=e||Dk).architecture&&(e.architecture="MobileNetV1"),Fk.indexOf(e.architecture)<0)throw new Error("Invalid architecture "+e.architecture+". Should be one of "+Fk);if(null==e.inputResolution&&(e.inputResolution=257),Ik(e.inputResolution),null==e.outputStride&&(e.outputStride=16),Ok[e.architecture].indexOf(e.outputStride)<0)throw new Error("Invalid outputStride "+e.outputStride+". Should be one of "+Ok[e.architecture]+" for architecture "+e.architecture+".");if(null==e.multiplier&&(e.multiplier=1),Ck[e.architecture].indexOf(e.multiplier)<0)throw new Error("Invalid multiplier "+e.multiplier+". Should be one of "+Ck[e.architecture]+" for architecture "+e.architecture+".");if(null==e.quantBytes&&(e.quantBytes=4),Rk.indexOf(e.quantBytes)<0)throw new Error("Invalid quantBytes "+e.quantBytes+". Should be one of "+Rk+" for architecture "+e.architecture+".");if("MobileNetV1"===e.architecture&&32===e.outputStride&&1!==e.multiplier)throw new Error("When using an output stride of 32, you must select 1 as the multiplier.");return e}(e)).architecture?[2,Vk(e)]:"MobileNetV1"===e.architecture?[2,Pk(e)]:[2,null]}))}))}const Hk={id:"poseBody",name:"Body Pose Sensing",showStatusButton:!0,blocks:[{opcode:"goToPart",text:"go to [PART]",blockType:"command",isTerminal:!1,arguments:{PART:{type:"string",defaultValue:"rightShoulder",menu:"PART"}}},{opcode:"videoToggle",text:"turn video [VIDEO_STATE]",arguments:{VIDEO_STATE:{type:"string",menu:"VIDEO_STATE",defaultValue:"off"}},blockType:"command"},{opcode:"setVideoTransparency",text:"set video transparency to [TRANSPARENCY]",arguments:{TRANSPARENCY:{type:"number",defaultValue:50}},blockType:"command"}],menus:{PART:{acceptReporters:!0,items:[{text:"nose",value:"nose"},{text:"right eye",value:"leftEye"},{text:"left eye",value:"rightEye"},{text:"right ear",value:"leftEar"},{text:"left ear",value:"rightEar"},{text:"right shoulder",value:"leftShoulder"},{text:"left shoulder",value:"rightShoulder"},{text:"right elbow",value:"leftElbow"},{text:"left elbow",value:"rightElbow"},{text:"right wrist",value:"leftWrist"},{text:"left wrist",value:"rightWrist"},{text:"right hip",value:"leftHip"},{text:"left hip",value:"rightHip"},{text:"right knee",value:"leftKnee"},{text:"left knee",value:"rightKnee"},{text:"right ankle",value:"leftAnkle"},{text:"left ankle",value:"rightAnkle"}]},ATTRIBUTE:{acceptReporters:!0,items:[{text:"motion",value:"motion"},{text:"direction",value:"direction"}]},SUBJECT:{acceptReporters:!0,items:[{text:"sprite",value:"this sprite"},{text:"stage",value:"Stage"}]},VIDEO_STATE:{acceptReporters:!0,items:[{text:"off",value:"off"},{text:"on",value:"on"},{text:"on flipped",value:"on-flipped"}]}}},qk=t.legacy(Hk);t.legacy(Hk,{incrementalDevelopment:!0});const{legacyExtension:jk,legacyDefinition:Uk}=qk.for(),Kk="off",Gk="on";let Yk=(()=>{let e,a,r=[jk()],s=[],o=t.Extension;var i,u;return a=class extends o{constructor(){super(...arguments),this.DIMENSIONS=[480,360],this.bodyOptions=Hk.menus.PART.items}init(e){return n(this,void 0,void 0,(function*(){this.runtime.ioDevices&&this._loop()}))}tfCoordsToScratch({x:e,y:t}){return{x:e-250,y:200-t}}projectStarted(){this.setTransparency(this.globalVideoTransparency),this.toggleVideo(this.globalVideoState)}hasPose(){return this.poseState&&this.poseState.keypoints&&this.poseState.score>.01}_loop(){return n(this,void 0,void 0,(function*(){for(;;){const e=this.runtime.ioDevices.video.getFrame({format:"image-data",dimensions:this.DIMENSIONS}),t=+new Date;e&&(this.poseState=yield this.estimatePoseOnImage(e));const n=(+new Date-t)/4;yield new Promise((e=>setTimeout(e,n)))}}))}estimatePoseOnImage(e){return n(this,void 0,void 0,(function*(){const t=yield this.ensureBodyModelLoaded();return yield t.estimateSinglePose(e,{flipHorizontal:!1})}))}ensureBodyModelLoaded(){return n(this,void 0,void 0,(function*(){var e;return null!==(e=this.bodyModel)&&void 0!==e||(this.bodyModel=yield Wk()),this.bodyModel}))}toggleVideo(e){if(e===Kk)return this.runtime.ioDevices.video.disableVideo();this.runtime.ioDevices.video.enableVideo(),this.runtime.ioDevices.video.mirror=e===Gk}setTransparency(e){const t=Math.max(Math.min(e,100),0);this.runtime.ioDevices.video.setPreviewGhost(t)}defineBlocks(){this.globalVideoState=Gk,this.globalVideoTransparency=50,this.projectStarted(),this.bodyModel=null;const e=this.bodyOptions.map((e=>e.value)),t=Uk.goToPart({operation:(e,t)=>{if(this.hasPose()){const{x:n,y:a}=this.tfCoordsToScratch(this.poseState.keypoints.find((t=>t.part===e)).position);t.target.setXY(n,a,!1)}},argumentMethods:{0:{handler:t=>e.includes(t)?t:"nose"}}});return{goToPart:t,videoToggle:Uk.videoToggle({operation:e=>{this.toggleVideo(e)},argumentMethods:{0:{handler:e=>["on","off","on-flipped"].includes(e)?e:Gk}}}),setVideoTransparency:Uk.setVideoTransparency({operation:e=>{this.setTransparency(e)}})}}},i=a,u="PoseBody",Object.defineProperty(i,"name",{configurable:!0,value:u}),(()=>{var t;const n="function"==typeof Symbol&&Symbol.metadata?Object.create(null!==(t=o[Symbol.metadata])&&void 0!==t?t:null):void 0;!function(e,t,n,a,r,s){function o(e){if(void 0!==e&&"function"!=typeof e)throw new TypeError("Function expected");return e}for(var i,u=a.kind,l="getter"===u?"get":"setter"===u?"set":"value",c=!t&&e?a.static?e:e.prototype:null,p=t||(c?Object.getOwnPropertyDescriptor(c,a.name):{}),d=!1,h=n.length-1;h>=0;h--){var m={};for(var f in a)m[f]="access"===f?{}:a[f];for(var f in a.access)m.access[f]=a.access[f];m.addInitializer=function(e){if(d)throw new TypeError("Cannot add initializers after decoration has completed");s.push(o(e||null))};var g=(0,n[h])("accessor"===u?{get:p.get,set:p.set}:p[l],m);if("accessor"===u){if(void 0===g)continue;if(null===g||"object"!=typeof g)throw new TypeError("Object expected");(i=o(g.get))&&(p.get=i),(i=o(g.set))&&(p.set=i),(i=o(g.init))&&r.unshift(i)}else(i=o(g))&&("field"===u?r.unshift(i):p[l]=i)}c&&Object.defineProperty(c,a.name,p),d=!0}(null,e={value:a},r,{kind:"class",name:a.name,metadata:n},null,s),a=e.value,n&&Object.defineProperty(a,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:n}),function(e,t,n){for(var a=arguments.length>2,r=0;r<t.length;r++)n=a?t[r].call(e,n):t[r].call(e)}(a,s)})(),a})();return e.Extension=Yk,e}({},ExtensionFramework);//# sourceMappingURL=poseBody.js.map
