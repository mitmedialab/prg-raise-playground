var poseBody=function(e,t){"use strict";function n(e,t){return t.forEach((function(t){t&&"string"!=typeof t&&!Array.isArray(t)&&Object.keys(t).forEach((function(n){if("default"!==n&&!(n in e)){var r=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(e,n,r.get?r:{enumerable:!0,get:function(){return t[n]}})}}))})),Object.freeze(e)}function r(e,t,n,r){return new(n||(n=Promise))((function(s,a){function o(e){try{u(r.next(e))}catch(e){a(e)}}function i(e){try{u(r.throw(e))}catch(e){a(e)}}function u(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,i)}u((r=r.apply(e,t||[])).next())}))}"function"==typeof SuppressedError&&SuppressedError;class s{refCount(e){return a("refCount")}incRef(e){return a("incRef")}timerAvailable(){return!0}time(e){return a("time")}read(e){return a("read")}readSync(e){return a("readSync")}readToGPU(e,t){return a("readToGPU")}numDataIds(){return a("numDataIds")}disposeData(e,t){return a("disposeData")}write(e,t,n){return a("write")}move(e,t,n,r,s){return a("move")}memory(){return a("memory")}floatPrecision(){return a("floatPrecision")}epsilon(){return 32===this.floatPrecision()?1e-7:1e-4}dispose(){return a("dispose")}}function a(e){throw new Error(`'${e}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}
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
 */function o(e){let t=e.length,n=0;for(;t>0;)n=Math.random()*t|0,t--,u(e,t,n)}function i(e,t,n){return Math.max(e,Math.min(t,n))}function u(e,t,n){const r=e[t];e[t]=e[n],e[n]=r}function l(e,t){if(!e)throw new Error("string"==typeof t?t:t())}function c(e,t,n=""){l(m(e,t),(()=>n+` Shapes ${e} and ${t} must match`))}function p(e){l(null!=e,(()=>"The input to the tensor constructor must be a non-null value."))}function h(e,t=[],n=!1){if(null==t&&(t=[]),Array.isArray(e)||S(e)&&!n)for(let r=0;r<e.length;++r)h(e[r],t,n);else t.push(e);return t}function d(e){if(0===e.length)return 1;let t=e[0];for(let n=1;n<e.length;n++)t*=e[n];return t}function m(e,t){if(e===t)return!0;if(null==e||null==t)return!1;if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}function f(e){return e%1==0}function g(e,t){return t<=e.length?e:e+" ".repeat(t-e.length)}function y(e,t){const n=t.length;return l((e=null==e?t.map(((e,t)=>t)):[].concat(e)).every((e=>e>=-n&&e<n)),(()=>`All values in axis param must be in range [-${n}, ${n}) but got axis ${e}`)),l(e.every((e=>f(e))),(()=>`All values in axis param must be integers but got axis ${e}`)),e.map((e=>e<0?n+e:e))}function b(e,t){const n=[],r=[],s=null!=t&&Array.isArray(t)&&0===t.length,a=null==t||s?null:y(t,e).sort();let o=0;for(let t=0;t<e.length;++t){if(null!=a){if(a[o]===t&&1!==e[t])throw new Error(`Can't squeeze axis ${t} since its dim '${e[t]}' is not 1`);(null==a[o]||a[o]>t)&&1===e[t]&&(n.push(e[t]),r.push(t)),a[o]<=t&&o++}1!==e[t]&&(n.push(e[t]),r.push(t))}return{newShape:n,keptDims:r}}function w(e,t){let n=null;if(null==e||"float32"===e)n=new Float32Array(t);else if("int32"===e)n=new Int32Array(t);else{if("bool"!==e)throw new Error(`Unknown data type ${e}`);n=new Uint8Array(t)}return n}function x(e,t){let n=null;if(null==e||"float32"===e)n=new Float32Array(t);else if("int32"===e)n=new Int32Array(t);else if("bool"===e)n=new Uint8Array(t);else{if("string"!==e)throw new Error(`Unknown data type ${e}`);n=new Array(t)}return n}function v(e,t){for(let n=0;n<e.length;n++){const r=e[n];if(isNaN(r)||!isFinite(r))throw Error(`A tensor of type ${t} being uploaded contains ${r}.`)}}function N(e){return"bool"===e||"complex64"===e||"float32"===e||"int32"===e||"string"===e}function S(e){return e instanceof Float32Array||e instanceof Int32Array||e instanceof Uint8Array||e instanceof Uint8ClampedArray}function k(e){if("float32"===e||"int32"===e)return 4;if("complex64"===e)return 8;if("bool"===e)return 1;throw new Error(`Unknown dtype ${e}`)}function T(e){if(null==e)return 0;let t=0;return e.forEach((e=>t+=e.length)),t}function E(e){return"string"==typeof e||e instanceof String}function _(e){return"boolean"==typeof e}function I(e){return"number"==typeof e}function A(e){return Array.isArray(e)?A(e[0]):e instanceof Float32Array?"float32":e instanceof Int32Array||e instanceof Uint8Array||e instanceof Uint8ClampedArray?"int32":I(e)?"float32":E(e)?"string":_(e)?"bool":"float32"}function $(e){return!!(e&&e.constructor&&e.call&&e.apply)}function M(e,t){for(let n=t;n<e;++n)if(e%n==0)return n;return e}function O(e){const t=e.length;if(t<2)return[];const n=new Array(t-1);n[t-2]=e[t-1];for(let r=t-3;r>=0;--r)n[r]=n[r+1]*e[r+1];return n}function D(e,t,n,r=!1){const s=new Array;if(1===t.length){const a=t[0]*(r?2:1);for(let t=0;t<a;t++)s[t]=n[e+t]}else{const a=t[0],o=t.slice(1),i=o.reduce(((e,t)=>e*t))*(r?2:1);for(let t=0;t<a;t++)s[t]=D(e+t*i,o,n,r)}return s}function R(e,t,n=!1){if(0===e.length)return t[0];const r=e.reduce(((e,t)=>e*t))*(n?2:1);if(0===r)return[];if(r!==t.length)throw new Error(`[${e}] does not match the input size ${t.length}${n?" for a complex tensor":""}.`);return D(0,e,t,n)}function F(e,t){const n=C(e,t);for(let e=0;e<n.length;e++)n[e]=1;return n}function C(e,t){if(null==t||"float32"===t||"complex64"===t)return new Float32Array(e);if("int32"===t)return new Int32Array(e);if("bool"===t)return new Uint8Array(e);throw new Error(`Unknown data type ${t}`)}function B(e){e.forEach((t=>{l(Number.isInteger(t)&&t>=0,(()=>`Tensor must have a shape comprised of positive integers but got shape [${e}].`))}))}function L(e){return e&&e.then&&"function"==typeof e.then}
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
 */const z="tfjsflags";class P{constructor(e){this.global=e,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=V,this.populateURLFlags()}setPlatform(e,t){null!=this.platform&&(q().getBool("IS_TEST")||q().getBool("PROD")||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${e}.`)),this.platformName=e,this.platform=t}registerFlag(e,t,n){if(this.flagRegistry[e]={evaluationFn:t,setHook:n},null!=this.urlFlags[e]){const t=this.urlFlags[e];q().getBool("IS_TEST")||q().getBool("PROD")||console.warn(`Setting feature override from URL ${e}: ${t}.`),this.set(e,t)}}async getAsync(e){return e in this.flags||(this.flags[e]=await this.evaluateFlag(e)),this.flags[e]}get(e){if(e in this.flags)return this.flags[e];const t=this.evaluateFlag(e);if(L(t))throw new Error(`Flag ${e} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[e]=t,this.flags[e]}getNumber(e){return this.get(e)}getBool(e){return this.get(e)}getFlags(){return this.flags}get features(){return this.flags}set(e,t){if(null==this.flagRegistry[e])throw new Error(`Cannot set flag ${e} as it has not been registered.`);this.flags[e]=t,null!=this.flagRegistry[e].setHook&&this.flagRegistry[e].setHook(t)}evaluateFlag(e){if(null==this.flagRegistry[e])throw new Error(`Cannot evaluate flag '${e}': no evaluation function found.`);return this.flagRegistry[e].evaluationFn()}setFlags(e){this.flags=Object.assign({},e)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(void 0===this.global||void 0===this.global.location||void 0===this.global.location.search)return;const e=this.getQueryParams(this.global.location.search);if(z in e){e[z].split(",").forEach((e=>{const[t,n]=e.split(":");this.urlFlags[t]=function(e,t){if("true"===(t=t.toLowerCase())||"false"===t)return"true"===t;if(""+ +t===t)return+t;throw new Error(`Could not parse value flag value ${t} for flag ${e}.`)}(t,n)}))}}}function V(e){const t={};return e.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,((e,...n)=>(function(e,t,n){e[decodeURIComponent(t)]=decodeURIComponent(n||"")}(t,n[0],n[1]),n.join("=")))),t}function q(){return U}let W,U=null;function j(){if(null==W){let e;if("undefined"!=typeof window)e=window;else if("undefined"!=typeof global)e=global;else if("undefined"!=typeof process)e=process;else{if("undefined"==typeof self)throw new Error("Could not find a global object");e=self}W=e}return W}function G(e,t){const n=function(){const e=j();return null==e._tfGlobals&&(e._tfGlobals=new Map),e._tfGlobals}();if(n.has(e))return n.get(e);{const r=t();return n.set(e,r),n.get(e)}}const K="Acos",H="Acosh",Z="Add",J="AddN",Q="ArgMax",X="ArgMin",Y="Asin",ee="Asinh",te="Atan",ne="Atanh",re="Atan2",se="AvgPool",ae="AvgPool3D",oe="BatchMatMul",ie="BatchToSpaceND",ue="Bincount",le="BroadcastArgs",ce="Cast",pe="Ceil",he="ClipByValue",de="Complex",me="ComplexAbs",fe="Concat",ge="Conv2D",ye="Conv2DBackpropFilter",be="Conv2DBackpropInput",we="Conv3D",xe="Conv3DBackpropInputV2",ve="Cosh",Ne="Cumprod",Se="Cumsum",ke="CropAndResize",Te="DenseBincount",Ee="DepthToSpace",_e="DepthwiseConv2dNative",Ie="DepthwiseConv2dNativeBackpropFilter",Ae="DepthwiseConv2dNativeBackpropInput",$e="Diag",Me="Dilation2D",Oe="RealDiv",De="Einsum",Re="Equal",Fe="ExpandDims",Ce="Expm1",Be="Fill",Le="FlipLeftRight",ze="Floor",Pe="FloorDiv",Ve="FusedBatchNorm",qe="GatherV2",We="GatherNd",Ue="Greater",je="GreaterEqual",Ge="Identity",Ke="IFFT",He="Imag",Ze="IsFinite",Je="IsInf",Qe="IsNan",Xe="LeakyRelu",Ye="Less",et="LessEqual",tt="LinSpace",nt="Log1p",rt="LogicalAnd",st="LogicalNot",at="LogicalOr",ot="Maximum",it="MaxPool",ut="MaxPool3D",lt="MaxPoolWithArgmax",ct="Mean",pt="Minimum",ht="MirrorPad",dt="Multinomial",mt="Multiply",ft="NotEqual",gt="NonMaxSuppressionV3",yt="NonMaxSuppressionV4",bt="NonMaxSuppressionV5",wt="OnesLike",xt="OneHot",vt="Pack",Nt="PadV2",St="Prelu",kt="Prod",Tt="RaggedGather",Et="RaggedTensorToTensor",_t="Range",It="Real",At="Reciprocal",$t="Relu",Mt="Reshape",Ot="ResizeNearestNeighbor",Dt="ResizeBilinear",Rt="Relu6",Ft="Reverse",Ct="Round",Bt="Rsqrt",Lt="ScatterNd",zt="SearchSorted",Pt="Select",Vt="Selu",qt="Slice",Wt="Sinh",Ut="Sign",jt="Sigmoid",Gt="Softplus",Kt="Sqrt",Ht="SpaceToBatchND",Zt="SplitV",Jt="Softmax",Qt="SparseFillEmptyRows",Xt="SparseReshape",Yt="SparseSegmentMean",en="SparseSegmentSum",tn="SparseToDense",nn="SquaredDifference",rn="StridedSlice",sn="StringNGrams",an="StringSplit",on="StringToHashBucketFast",un="Tanh",ln="Tile",cn="TopK",pn="Transform",hn="Transpose",dn="Unique",mn="Unpack",fn="UnsortedSegmentSum",gn="ZerosLike",yn="Step",bn="FromPixels",wn="RotateWithOffset",xn="_FusedMatMul",vn="FusedConv2D",Nn="FusedDepthwiseConv2D";
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
function Sn(...e){q().getBool("IS_TEST")||q().getBool("PROD")||console.warn(...e)}
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
const kn=G("kernelRegistry",(()=>new Map)),Tn=G("gradRegistry",(()=>new Map));function En(e,t){const n=$n(e,t);return kn.get(n)}function _n(e){return Tn.get(e)}function In(e){const t=kn.entries(),n=[];for(;;){const{done:r,value:s}=t.next();if(r)break;const[a,o]=s,[i]=a.split("_");i===e&&n.push(o)}return n}function An(e){const{kernelName:t,backendName:n}=e,r=$n(t,n);kn.has(r)&&Sn(`The kernel '${t}' for backend '${n}' is already registered`),kn.set(r,e)}function $n(e,t){return`${t}_${e}`}var Mn="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function On(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function Dn(e){if(e.__esModule)return e;var t=e.default;if("function"==typeof t){var n=function e(){return this instanceof e?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};n.prototype=t.prototype}else n={};return Object.defineProperty(n,"__esModule",{value:!0}),Object.keys(e).forEach((function(t){var r=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(n,t,r.get?r:{enumerable:!0,get:function(){return e[t]}})})),n}var Rn=Cn,Fn=null;try{Fn=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch(e){}function Cn(e,t,n){this.low=0|e,this.high=0|t,this.unsigned=!!n}function Bn(e){return!0===(e&&e.__isLong__)}Cn.prototype.__isLong__,Object.defineProperty(Cn.prototype,"__isLong__",{value:!0}),Cn.isLong=Bn;var Ln={},zn={};function Pn(e,t){var n,r,s;return t?(s=0<=(e>>>=0)&&e<256)&&(r=zn[e])?r:(n=qn(e,(0|e)<0?-1:0,!0),s&&(zn[e]=n),n):(s=-128<=(e|=0)&&e<128)&&(r=Ln[e])?r:(n=qn(e,e<0?-1:0,!1),s&&(Ln[e]=n),n)}function Vn(e,t){if(isNaN(e))return t?Qn:Jn;if(t){if(e<0)return Qn;if(e>=Kn)return nr}else{if(e<=-Hn)return rr;if(e+1>=Hn)return tr}return e<0?Vn(-e,t).neg():qn(e%Gn|0,e/Gn|0,t)}function qn(e,t,n){return new Cn(e,t,n)}Cn.fromInt=Pn,Cn.fromNumber=Vn,Cn.fromBits=qn;var Wn=Math.pow;function Un(e,t,n){if(0===e.length)throw Error("empty string");if("NaN"===e||"Infinity"===e||"+Infinity"===e||"-Infinity"===e)return Jn;if("number"==typeof t?(n=t,t=!1):t=!!t,(n=n||10)<2||36<n)throw RangeError("radix");var r;if((r=e.indexOf("-"))>0)throw Error("interior hyphen");if(0===r)return Un(e.substring(1),t,n).neg();for(var s=Vn(Wn(n,8)),a=Jn,o=0;o<e.length;o+=8){var i=Math.min(8,e.length-o),u=parseInt(e.substring(o,o+i),n);if(i<8){var l=Vn(Wn(n,i));a=a.mul(l).add(Vn(u))}else a=(a=a.mul(s)).add(Vn(u))}return a.unsigned=t,a}function jn(e,t){return"number"==typeof e?Vn(e,t):"string"==typeof e?Un(e,t):qn(e.low,e.high,"boolean"==typeof t?t:e.unsigned)}Cn.fromString=Un,Cn.fromValue=jn;var Gn=4294967296,Kn=Gn*Gn,Hn=Kn/2,Zn=Pn(1<<24),Jn=Pn(0);Cn.ZERO=Jn;var Qn=Pn(0,!0);Cn.UZERO=Qn;var Xn=Pn(1);Cn.ONE=Xn;var Yn=Pn(1,!0);Cn.UONE=Yn;var er=Pn(-1);Cn.NEG_ONE=er;var tr=qn(-1,2147483647,!1);Cn.MAX_VALUE=tr;var nr=qn(-1,-1,!0);Cn.MAX_UNSIGNED_VALUE=nr;var rr=qn(0,-2147483648,!1);Cn.MIN_VALUE=rr;var sr=Cn.prototype;sr.toInt=function(){return this.unsigned?this.low>>>0:this.low},sr.toNumber=function(){return this.unsigned?(this.high>>>0)*Gn+(this.low>>>0):this.high*Gn+(this.low>>>0)},sr.toString=function(e){if((e=e||10)<2||36<e)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative()){if(this.eq(rr)){var t=Vn(e),n=this.div(t),r=n.mul(t).sub(this);return n.toString(e)+r.toInt().toString(e)}return"-"+this.neg().toString(e)}for(var s=Vn(Wn(e,6),this.unsigned),a=this,o="";;){var i=a.div(s),u=(a.sub(i.mul(s)).toInt()>>>0).toString(e);if((a=i).isZero())return u+o;for(;u.length<6;)u="0"+u;o=""+u+o}},sr.getHighBits=function(){return this.high},sr.getHighBitsUnsigned=function(){return this.high>>>0},sr.getLowBits=function(){return this.low},sr.getLowBitsUnsigned=function(){return this.low>>>0},sr.getNumBitsAbs=function(){if(this.isNegative())return this.eq(rr)?64:this.neg().getNumBitsAbs();for(var e=0!=this.high?this.high:this.low,t=31;t>0&&!(e&1<<t);t--);return 0!=this.high?t+33:t+1},sr.isZero=function(){return 0===this.high&&0===this.low},sr.eqz=sr.isZero,sr.isNegative=function(){return!this.unsigned&&this.high<0},sr.isPositive=function(){return this.unsigned||this.high>=0},sr.isOdd=function(){return!(1&~this.low)},sr.isEven=function(){return!(1&this.low)},sr.equals=function(e){return Bn(e)||(e=jn(e)),(this.unsigned===e.unsigned||this.high>>>31!=1||e.high>>>31!=1)&&(this.high===e.high&&this.low===e.low)},sr.eq=sr.equals,sr.notEquals=function(e){return!this.eq(e)},sr.neq=sr.notEquals,sr.ne=sr.notEquals,sr.lessThan=function(e){return this.comp(e)<0},sr.lt=sr.lessThan,sr.lessThanOrEqual=function(e){return this.comp(e)<=0},sr.lte=sr.lessThanOrEqual,sr.le=sr.lessThanOrEqual,sr.greaterThan=function(e){return this.comp(e)>0},sr.gt=sr.greaterThan,sr.greaterThanOrEqual=function(e){return this.comp(e)>=0},sr.gte=sr.greaterThanOrEqual,sr.ge=sr.greaterThanOrEqual,sr.compare=function(e){if(Bn(e)||(e=jn(e)),this.eq(e))return 0;var t=this.isNegative(),n=e.isNegative();return t&&!n?-1:!t&&n?1:this.unsigned?e.high>>>0>this.high>>>0||e.high===this.high&&e.low>>>0>this.low>>>0?-1:1:this.sub(e).isNegative()?-1:1},sr.comp=sr.compare,sr.negate=function(){return!this.unsigned&&this.eq(rr)?rr:this.not().add(Xn)},sr.neg=sr.negate,sr.add=function(e){Bn(e)||(e=jn(e));var t=this.high>>>16,n=65535&this.high,r=this.low>>>16,s=65535&this.low,a=e.high>>>16,o=65535&e.high,i=e.low>>>16,u=0,l=0,c=0,p=0;return c+=(p+=s+(65535&e.low))>>>16,l+=(c+=r+i)>>>16,u+=(l+=n+o)>>>16,u+=t+a,qn((c&=65535)<<16|(p&=65535),(u&=65535)<<16|(l&=65535),this.unsigned)},sr.subtract=function(e){return Bn(e)||(e=jn(e)),this.add(e.neg())},sr.sub=sr.subtract,sr.multiply=function(e){if(this.isZero())return Jn;if(Bn(e)||(e=jn(e)),Fn)return qn(Fn.mul(this.low,this.high,e.low,e.high),Fn.get_high(),this.unsigned);if(e.isZero())return Jn;if(this.eq(rr))return e.isOdd()?rr:Jn;if(e.eq(rr))return this.isOdd()?rr:Jn;if(this.isNegative())return e.isNegative()?this.neg().mul(e.neg()):this.neg().mul(e).neg();if(e.isNegative())return this.mul(e.neg()).neg();if(this.lt(Zn)&&e.lt(Zn))return Vn(this.toNumber()*e.toNumber(),this.unsigned);var t=this.high>>>16,n=65535&this.high,r=this.low>>>16,s=65535&this.low,a=e.high>>>16,o=65535&e.high,i=e.low>>>16,u=65535&e.low,l=0,c=0,p=0,h=0;return p+=(h+=s*u)>>>16,c+=(p+=r*u)>>>16,p&=65535,c+=(p+=s*i)>>>16,l+=(c+=n*u)>>>16,c&=65535,l+=(c+=r*i)>>>16,c&=65535,l+=(c+=s*o)>>>16,l+=t*u+n*i+r*o+s*a,qn((p&=65535)<<16|(h&=65535),(l&=65535)<<16|(c&=65535),this.unsigned)},sr.mul=sr.multiply,sr.divide=function(e){if(Bn(e)||(e=jn(e)),e.isZero())throw Error("division by zero");var t,n,r;if(Fn)return this.unsigned||-2147483648!==this.high||-1!==e.low||-1!==e.high?qn((this.unsigned?Fn.div_u:Fn.div_s)(this.low,this.high,e.low,e.high),Fn.get_high(),this.unsigned):this;if(this.isZero())return this.unsigned?Qn:Jn;if(this.unsigned){if(e.unsigned||(e=e.toUnsigned()),e.gt(this))return Qn;if(e.gt(this.shru(1)))return Yn;r=Qn}else{if(this.eq(rr))return e.eq(Xn)||e.eq(er)?rr:e.eq(rr)?Xn:(t=this.shr(1).div(e).shl(1)).eq(Jn)?e.isNegative()?Xn:er:(n=this.sub(e.mul(t)),r=t.add(n.div(e)));if(e.eq(rr))return this.unsigned?Qn:Jn;if(this.isNegative())return e.isNegative()?this.neg().div(e.neg()):this.neg().div(e).neg();if(e.isNegative())return this.div(e.neg()).neg();r=Jn}for(n=this;n.gte(e);){t=Math.max(1,Math.floor(n.toNumber()/e.toNumber()));for(var s=Math.ceil(Math.log(t)/Math.LN2),a=s<=48?1:Wn(2,s-48),o=Vn(t),i=o.mul(e);i.isNegative()||i.gt(n);)i=(o=Vn(t-=a,this.unsigned)).mul(e);o.isZero()&&(o=Xn),r=r.add(o),n=n.sub(i)}return r},sr.div=sr.divide,sr.modulo=function(e){return Bn(e)||(e=jn(e)),Fn?qn((this.unsigned?Fn.rem_u:Fn.rem_s)(this.low,this.high,e.low,e.high),Fn.get_high(),this.unsigned):this.sub(this.div(e).mul(e))},sr.mod=sr.modulo,sr.rem=sr.modulo,sr.not=function(){return qn(~this.low,~this.high,this.unsigned)},sr.and=function(e){return Bn(e)||(e=jn(e)),qn(this.low&e.low,this.high&e.high,this.unsigned)},sr.or=function(e){return Bn(e)||(e=jn(e)),qn(this.low|e.low,this.high|e.high,this.unsigned)},sr.xor=function(e){return Bn(e)||(e=jn(e)),qn(this.low^e.low,this.high^e.high,this.unsigned)},sr.shiftLeft=function(e){return Bn(e)&&(e=e.toInt()),0==(e&=63)?this:e<32?qn(this.low<<e,this.high<<e|this.low>>>32-e,this.unsigned):qn(0,this.low<<e-32,this.unsigned)},sr.shl=sr.shiftLeft,sr.shiftRight=function(e){return Bn(e)&&(e=e.toInt()),0==(e&=63)?this:e<32?qn(this.low>>>e|this.high<<32-e,this.high>>e,this.unsigned):qn(this.high>>e-32,this.high>=0?0:-1,this.unsigned)},sr.shr=sr.shiftRight,sr.shiftRightUnsigned=function(e){if(Bn(e)&&(e=e.toInt()),0===(e&=63))return this;var t=this.high;return e<32?qn(this.low>>>e|t<<32-e,t>>>e,this.unsigned):qn(32===e?t:t>>>e-32,0,this.unsigned)},sr.shru=sr.shiftRightUnsigned,sr.shr_u=sr.shiftRightUnsigned,sr.toSigned=function(){return this.unsigned?qn(this.low,this.high,!1):this},sr.toUnsigned=function(){return this.unsigned?this:qn(this.low,this.high,!0)},sr.toBytes=function(e){return e?this.toBytesLE():this.toBytesBE()},sr.toBytesLE=function(){var e=this.high,t=this.low;return[255&t,t>>>8&255,t>>>16&255,t>>>24,255&e,e>>>8&255,e>>>16&255,e>>>24]},sr.toBytesBE=function(){var e=this.high,t=this.low;return[e>>>24,e>>>16&255,e>>>8&255,255&e,t>>>24,t>>>16&255,t>>>8&255,255&t]},Cn.fromBytes=function(e,t,n){return n?Cn.fromBytesLE(e,t):Cn.fromBytesBE(e,t)},Cn.fromBytesLE=function(e,t){return new Cn(e[0]|e[1]<<8|e[2]<<16|e[3]<<24,e[4]|e[5]<<8|e[6]<<16|e[7]<<24,t)},Cn.fromBytesBE=function(e,t){return new Cn(e[4]<<24|e[5]<<16|e[6]<<8|e[7],e[0]<<24|e[1]<<16|e[2]<<8|e[3],t)};var ar=On(Rn);
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
const or=ar||n({__proto__:null,default:ar},[Rn]);function ir(e){return or.fromString(e,!0,16)}const ur=ir("c3a5c85c97cb3127"),lr=ir("b492b66fbe98f273"),cr=ir("9ae16a3b2f90404f");function pr(e){return e.xor(e.shru(47))}function hr(e,t,n){const r=e.slice(t,t+n);return or.fromBytes(Array.from(r),!0,!0)}function dr(e,t){return hr(e,t,8)}function mr(e,t){return hr(e,t,4)}function fr(e,t){return 0===t?e:e.shru(t).or(e.shl(64-t))}function gr(e,t,n=ir("9ddfea08eb382d69")){let r=e.xor(t).mul(n);r=r.xor(r.shru(47));let s=t.xor(r).mul(n);return s=s.xor(s.shru(47)),s=s.mul(n),s}function yr(e,t,n,r){return function(e,t,n,r,s,a){s=s.add(e),a=fr(a.add(s).add(r),21);const o=s;return s=(s=s.add(t)).add(n),a=a.add(fr(s,44)),[s.add(r),a.add(o)]}(dr(e,t),dr(e,t+8),dr(e,t+16),dr(e,t+24),n,r)}function br(e,t){if("string"===t)throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(e)&&(e=h(e)),q().getBool("DEBUG")&&v(e,t),function(e,t){return e instanceof Float32Array&&"float32"===t||e instanceof Int32Array&&"int32"===t||e instanceof Uint8Array&&"bool"===t}(e,t))return e;if(null==t||"float32"===t||"complex64"===t)return new Float32Array(e);if("int32"===t)return new Int32Array(e);if("bool"===t){const t=new Uint8Array(e.length);for(let n=0;n<t.length;++n)0!==Math.round(e[n])&&(t[n]=1);return t}throw new Error(`Unknown data type ${t}`)}function wr(){return q().platform.now()}function xr(e,t="utf-8"){return t=t||"utf-8",q().platform.encode(e,t)}function vr(e,t="utf-8"){return t=t||"utf-8",q().platform.decode(e,t)}var Nr=Object.freeze({__proto__:null,arraysEqual:m,assert:l,assertNonNegativeIntegerDimensions:B,assertNonNull:p,assertShapesMatch:c,bytesFromStringArray:T,bytesPerElement:k,checkConversionForErrors:v,clamp:i,computeStrides:O,createScalarValue:
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
function(e,t){return"string"===t?xr(e):br([e],t)},createShuffledIndices:function(e){const t=new Uint32Array(e);for(let n=0;n<e;++n)t[n]=n;return o(t),t},decodeString:vr,distSquared:function(e,t){let n=0;for(let r=0;r<e.length;r++){const s=Number(e[r])-Number(t[r]);n+=s*s}return n},encodeString:xr,fetch:function(e,t){return q().platform.fetch(e,t)},fingerPrint64:function(e,t=e.length){const n=or.fromNumber(81,!0);if(t<=32)return t<=16?function(e,t=e.length){if(t>=8){const n=cr.add(2*t),r=dr(e,0).add(cr),s=dr(e,t-8);return gr(fr(s,37).mul(n).add(r),fr(r,25).add(s).mul(n),n)}if(t>=4){const n=cr.add(2*t);return gr(mr(e,0).shl(3).add(t),mr(e,t-4),n)}if(t>0){const n=e[0]+(e[t>>1]<<8),r=t+(e[t-1]<<2);return pr(cr.mul(n).xor(ur.mul(r))).mul(cr)}return cr}(e,t):function(e,t=e.length){const n=cr.add(2*t),r=dr(e,0).mul(lr),s=dr(e,8),a=dr(e,t-8).mul(n),o=dr(e,t-16).mul(cr);return gr(fr(r.add(s),43).add(fr(a,30)).add(o),r.add(fr(s.add(cr),18)).add(a),n)}(e,t);if(t<=64)return function(e,t=e.length){const n=cr.add(2*t),r=dr(e,0).mul(cr),s=dr(e,8),a=dr(e,t-8).mul(n),o=dr(e,t-16).mul(cr),i=fr(r.add(s),43).add(fr(a,30)).add(o),u=gr(i,r.add(fr(s.add(cr),18)).add(a),n),l=dr(e,16).mul(n),c=dr(e,24),p=i.add(dr(e,t-32)).mul(n),h=u.add(dr(e,t-24)).mul(n);return gr(fr(l.add(c),43).add(fr(p,30)).add(h),l.add(fr(c.add(r),18)).add(p),n)}(e,t);let r=n,s=n.mul(lr).add(113),a=pr(s.mul(cr).add(113)).mul(cr),o=[or.UZERO,or.UZERO],i=[or.UZERO,or.UZERO];r=r.mul(cr).add(dr(e,0));let u=0;const l=64*(t-1>>6),c=l+(t-1&63)-63;do{r=fr(r.add(s).add(o[0]).add(dr(e,u+8)),37).mul(lr),s=fr(s.add(o[1]).add(dr(e,u+48)),42).mul(lr),r=r.xor(i[1]),s=s.add(o[0]).add(dr(e,u+40)),a=fr(a.add(i[0]),33).mul(lr),o=yr(e,u,o[1].mul(lr),r.add(i[0])),i=yr(e,u+32,a.add(i[1]),s.add(dr(e,u+16))),[a,r]=[r,a],u+=64}while(u!==l);const p=lr.add(a.and(255).shl(1));return u=c,i[0]=i[0].add(t-1&63),o[0]=o[0].add(i[0]),i[0]=i[0].add(o[0]),r=fr(r.add(s).add(o[0]).add(dr(e,u+8)),37).mul(p),s=fr(s.add(o[1]).add(dr(e,u+48)),42).mul(p),r=r.xor(i[1].mul(9)),s=s.add(o[0].mul(9).add(dr(e,u+40))),a=fr(a.add(i[0]),33).mul(p),o=yr(e,u,o[1].mul(p),r.add(i[0])),i=yr(e,u+32,a.add(i[1]),s.add(dr(e,u+16))),[a,r]=[r,a],gr(gr(o[0],i[0],p).add(pr(s).mul(ur)).add(a),gr(o[1],i[1],p).add(r),p)},flatten:h,getArrayFromDType:x,getTypedArrayFromDType:w,hasEncodingLoss:function(e,t){return"complex64"!==t&&(("float32"!==t||"complex64"===e)&&(("int32"!==t||"float32"===e||"complex64"===e)&&("bool"!==t||"bool"!==e)))},hexToLong:ir,indexToLoc:function(e,t,n){if(0===t)return[];if(1===t)return[e];const r=new Array(t);for(let t=0;t<r.length-1;++t)r[t]=Math.floor(e/n[t]),e-=r[t]*n[t];return r[r.length-1]=e,r},inferDtype:A,inferFromImplicitShape:function(e,t){let n=1,r=-1;for(let t=0;t<e.length;++t)if(e[t]>=0)n*=e[t];else if(-1===e[t]){if(-1!==r)throw Error(`Shapes can only have 1 implicit size. Found -1 at dim ${r} and dim ${t}`);r=t}else if(e[t]<0)throw Error(`Shapes can not be < 0. Found ${e[t]} at dim ${t}`);if(-1===r){if(t>0&&t!==n)throw Error(`Size(${t}) must match the product of shape ${e}`);return e}if(0===n)throw Error(`Cannot infer the missing size in [${e}] when there are 0 elements`);if(t%n!=0)throw Error(`The implicit shape can't be a fractional number. Got ${t} / ${n}`);const s=e.slice();return s[r]=t/n,s},isBoolean:_,isFunction:$,isInt:f,isNumber:I,isPromise:L,isScalarShape:function(e){return 0===e.length},isString:E,isTypedArray:S,isValidDtype:N,locToIndex:function(e,t,n){if(0===t)return 0;if(1===t)return e[0];let r=e[e.length-1];for(let t=0;t<e.length-1;++t)r+=n[t]*e[t];return r},makeOnesTypedArray:F,makeZerosNestedTypedArray:function(e,t){const n=e.reduce(((e,t)=>e*t),1);if(null==t||"float32"===t)return R(e,new Float32Array(n));if("int32"===t)return R(e,new Int32Array(n));if("bool"===t)return R(e,new Uint8Array(n));throw new Error(`Unknown data type ${t}`)},makeZerosTypedArray:C,nearestDivisor:M,nearestLargerEven:function(e){return e%2==0?e:e+1},now:wr,parseAxisParam:y,randUniform:function(e,t){const n=Math.random();return t*n+(1-n)*e},repeatedTry:function(e,t=(e=>0),n,r=setTimeout){return new Promise(((s,a)=>{let o=0;const i=()=>{if(e())return void s();o++;const u=t(o);null!=n&&o>=n?a():r(i,u)};i()}))},rightPad:g,shuffle:o,shuffleCombo:function(e,t){if(e.length!==t.length)throw new Error(`Array sizes must match to be shuffled together First array length was ${e.length}Second array length was ${t.length}`);let n=e.length,r=0;for(;n>0;)r=Math.random()*n|0,n--,u(e,n,r),u(t,n,r)},sizeFromShape:d,sizeToSquarishShape:function(e){const t=Math.ceil(Math.sqrt(e));return[t,Math.ceil(e/t)]},squeezeShape:b,sum:function(e){let t=0;for(let n=0;n<e.length;n++)t+=e[n];return t},swap:u,tanh:function(e){if(null!=Math.tanh)return Math.tanh(e);if(e===1/0)return 1;if(e===-1/0)return-1;{const t=Math.exp(2*e);return(t-1)/(t+1)}},toNestedArray:R,toTypedArray:br});
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
 */class Sr{constructor(e,t){this.backendTimer=e,this.logger=t,null==t&&(this.logger=new Tr)}profileKernel(e,t,n){let r;const s=()=>{r=n()};let a;const o=wr();if(this.backendTimer.timerAvailable())a=this.backendTimer.time(s);else{s();for(const e of r)e.dataSync();a=Promise.resolve({kernelMs:wr()-o})}if(q().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let t=0;t<r.length;t++){const n=r[t];n.data().then((t=>{kr(t,n.dtype,e)}))}return{kernelName:e,outputs:r,inputs:t,timeMs:a.then((e=>e.kernelMs)),extraInfo:a.then((e=>null!=e.getExtraProfileInfo?e.getExtraProfileInfo():""))}}logKernelProfile(e){const{kernelName:t,outputs:n,timeMs:r,inputs:s,extraInfo:a}=e;n.forEach((e=>{Promise.all([e.data(),r,a]).then((n=>{this.logger.logKernelProfile(t,e,n[0],n[1],s,n[2])}))}))}}function kr(e,t,n){if("float32"!==t)return!1;for(let t=0;t<e.length;t++){const r=e[t];if(isNaN(r)||!isFinite(r))return console.warn(`Found ${r} in the result of '${n}'`),!0}return!1}class Tr{logKernelProfile(e,t,n,r,s,a){const o="number"==typeof r?g(`${r}ms`,9):r.error,i=g(e,25),u=t.rank,l=t.size,c=g(t.shape.toString(),14);let p="";for(const e in s){const n=s[e];if(null!=n){const r=n.shape||t.shape,s=r.length;p+=`${e}: ${s}D ${s>0?r:""} `}}console.log(`%c${i}\t%c${o}\t%c${u}D ${c}\t%c${l}\t%c${p}\t%c${a}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}}
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
const Er=20,_r=3,Ir=7;function Ar(e,t,n,r){const s=O(t),a=function(e,t,n,r){const s=d(t),a=r[r.length-1],o=new Array(a).fill(0),i=t.length,u="complex64"===n?Dr(e):e;if(i>1)for(let e=0;e<s/a;e++){const t=e*a;for(let e=0;e<a;e++)o[e]=Math.max(o[e],$r(u[t+e],0,n).length)}return o}(e,t,n,s),o=t.length,i=Or(e,t,n,s,a),u=["Tensor"];return r&&(u.push(`  dtype: ${n}`),u.push(`  rank: ${o}`),u.push(`  shape: [${t}]`),u.push("  values:")),u.push(i.map((e=>"    "+e)).join("\n")),u.join("\n")}function $r(e,t,n){let r;return r=Array.isArray(e)?`${parseFloat(e[0].toFixed(Ir))} + ${parseFloat(e[1].toFixed(Ir))}j`:E(e)?`'${e}'`:"bool"===n?Mr(e):parseFloat(e.toFixed(Ir)).toString(),g(r,t)}function Mr(e){return 0===e?"false":"true"}function Or(e,t,n,r,s,a=!0){const o="complex64"===n?2:1,i=t[0],u=t.length;if(0===u){if("complex64"===n){return[$r(Dr(e)[0],0,n)]}return"bool"===n?[Mr(e[0])]:[e[0].toString()]}if(1===u){if(i>Er){const t=_r*o;let r=Array.from(e.slice(0,t)),a=Array.from(e.slice((i-_r)*o,i*o));return"complex64"===n&&(r=Dr(r),a=Dr(a)),["["+r.map(((e,t)=>$r(e,s[t],n))).join(", ")+", ..., "+a.map(((e,t)=>$r(e,s[i-_r+t],n))).join(", ")+"]"]}return["["+("complex64"===n?Dr(e):Array.from(e)).map(((e,t)=>$r(e,s[t],n))).join(", ")+"]"]}const l=t.slice(1),c=r.slice(1),p=r[0]*o,h=[];if(i>Er){for(let t=0;t<_r;t++){const r=t*p,a=r+p;h.push(...Or(e.slice(r,a),l,n,c,s,!1))}h.push("...");for(let t=i-_r;t<i;t++){const r=t*p,a=r+p;h.push(...Or(e.slice(r,a),l,n,c,s,t===i-1))}}else for(let t=0;t<i;t++){const r=t*p,a=r+p;h.push(...Or(e.slice(r,a),l,n,c,s,t===i-1))}const d=2===u?",":"";h[0]="["+h[0]+d;for(let e=1;e<h.length-1;e++)h[e]=" "+h[e]+d;let m=",\n";for(let e=2;e<u;e++)m+="\n";return h[h.length-1]=" "+h[h.length-1]+"]"+(a?"":m),h}function Dr(e){const t=[];for(let n=0;n<e.length;n+=2)t.push([e[n],e[n+1]]);return t}
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
 */class Rr{constructor(e,t,n){if(this.dtype=t,this.shape=e.slice(),this.size=d(e),null!=n){const e=n.length;l(e===this.size,(()=>`Length of values '${e}' does not match the size inferred by the shape '${this.size}'.`))}if("complex64"===t)throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=n||x(t,this.size),this.strides=O(e)}set(e,...t){0===t.length&&(t=[0]),l(t.length===this.rank,(()=>`The number of provided coordinates (${t.length}) must match the rank (${this.rank})`));const n=this.locToIndex(t);this.values[n]=e}get(...e){0===e.length&&(e=[0]);let t=0;for(const n of e){if(n<0||n>=this.shape[t]){const t=`Requested out of range element at ${e}.   Buffer shape=${this.shape}`;throw new Error(t)}t++}let n=e[e.length-1];for(let t=0;t<e.length-1;++t)n+=this.strides[t]*e[t];return this.values[n]}locToIndex(e){if(0===this.rank)return 0;if(1===this.rank)return e[0];let t=e[e.length-1];for(let n=0;n<e.length-1;++n)t+=this.strides[n]*e[n];return t}indexToLoc(e){if(0===this.rank)return[];if(1===this.rank)return[e];const t=new Array(this.shape.length);for(let n=0;n<t.length-1;++n)t[n]=Math.floor(e/this.strides[n]),e-=t[n]*this.strides[n];return t[t.length-1]=e,t}get rank(){return this.shape.length}toTensor(){return Fr().makeTensor(this.values,this.shape,this.dtype)}}let Fr=null,Cr=null;class Br{constructor(e,t,n,r){this.kept=!1,this.isDisposedInternal=!1,this.shape=e.slice(),this.dtype=t||"float32",this.size=d(e),this.strides=O(e),this.dataId=n,this.id=r,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){const e=await this.data();return Cr.buffer(this.shape,this.dtype,e)}bufferSync(){return Cr.buffer(this.shape,this.dtype,this.dataSync())}async array(){const e=await this.data();return R(this.shape,e,"complex64"===this.dtype)}arraySync(){return R(this.shape,this.dataSync(),"complex64"===this.dtype)}async data(){this.throwIfDisposed();const e=Fr().read(this.dataId);if("string"===this.dtype){const t=await e;try{return t.map((e=>vr(e)))}catch(e){throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return e}dataToGPU(e){return this.throwIfDisposed(),Fr().readToGPU(this.dataId,e)}dataSync(){this.throwIfDisposed();const e=Fr().readSync(this.dataId);if("string"===this.dtype)try{return e.map((e=>vr(e)))}catch(e){throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return e}async bytes(){this.throwIfDisposed();const e=await Fr().read(this.dataId);return"string"===this.dtype?e:new Uint8Array(e.buffer)}dispose(){this.isDisposed||(Fr().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(e=!1){return Cr.print(this,e)}clone(){return this.throwIfDisposed(),Cr.clone(this)}toString(e=!1){return Ar(this.dataSync(),this.shape,this.dtype,e)}cast(e){return this.throwIfDisposed(),Cr.cast(this,e)}variable(e=!0,t,n){return this.throwIfDisposed(),Fr().makeVariable(this,e,t,n)}}Object.defineProperty(Br,Symbol.hasInstance,{value:e=>!!e&&null!=e.data&&null!=e.dataSync&&null!=e.throwIfDisposed}),G("Tensor",(()=>Br));class Lr extends Br{constructor(e,t,n,r){super(e.shape,e.dtype,e.dataId,r),this.trainable=t,this.name=n}assign(e){if(e.dtype!==this.dtype)throw new Error(`dtype of the new value (${e.dtype}) and previous value (${this.dtype}) must match`);if(!m(e.shape,this.shape))throw new Error(`shape of the new value (${e.shape}) and previous value (${this.shape}) must match`);Fr().disposeTensor(this),this.dataId=e.dataId,Fr().incRef(this,null)}dispose(){Fr().disposeVariable(this),this.isDisposedInternal=!0}}
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
var zr,Pr,Vr,qr,Wr;Object.defineProperty(Lr,Symbol.hasInstance,{value:e=>e instanceof Br&&null!=e.assign&&e.assign instanceof Function}),function(e){e.R0="R0",e.R1="R1",e.R2="R2",e.R3="R3",e.R4="R4",e.R5="R5",e.R6="R6"}(zr||(zr={})),function(e){e.float32="float32",e.int32="int32",e.bool="int32",e.complex64="complex64"}(Pr||(Pr={})),function(e){e.float32="float32",e.int32="int32",e.bool="bool",e.complex64="complex64"}(Vr||(Vr={})),function(e){e.float32="float32",e.int32="float32",e.bool="float32",e.complex64="complex64"}(qr||(qr={})),function(e){e.float32="complex64",e.int32="complex64",e.bool="complex64",e.complex64="complex64"}(Wr||(Wr={}));const Ur={float32:qr,int32:Pr,bool:Vr,complex64:Wr};function jr(e,t){if("string"===e||"string"===t){if("string"===e&&"string"===t)return"string";throw new Error(`Can not upcast ${e} with ${t}`)}return Ur[e][t]}
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
function Gr(e,t){if(e.dtype===t.dtype)return[e,t];const n=jr(e.dtype,t.dtype);return[e.cast(n),t.cast(n)]}function Kr(e,t){l(e.dtype===t.dtype,(()=>`The dtypes of the first(${e.dtype}) and second(${t.dtype}) input must match`))}function Hr(e){const t=[];return Zr(e,t,new Set),t}function Zr(e,t,n){if(null==e)return;if(e instanceof Br)return void t.push(e);if(r=e,!Array.isArray(r)&&"object"!=typeof r)return;var r;const s=e;for(const e in s){const r=s[e];n.has(r)||(n.add(r),Zr(r,t,n))}}var Jr=Object.freeze({__proto__:null,assertTypesMatch:Kr,getTensorsInContainer:Hr,isTensorInList:function(e,t){return t.some((t=>t.id===e.id))},makeTypesMatch:Gr});
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
 */function Qr(e){return null!=e.kernelName}class Xr{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map((e=>e.name))))}}}dispose(){for(const e in this.registeredVariables)this.registeredVariables[e].dispose()}}class Yr{constructor(e){this.ENV=e,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new Xr}async ready(){if(null!=this.pendingBackendInit)return this.pendingBackendInit.then((()=>{}));if(null!=this.backendInstance)return;const e=this.getSortedBackends();for(let t=0;t<e.length;t++){const n=e[t];if(await this.initializeBackend(n).success)return void await this.setBackend(n)}throw new Error("Could not initialize any backends, all backend initializations failed.")}get backend(){if(null!=this.pendingBackendInit)throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(null==this.backendInstance){const{name:e,asyncInit:t}=this.initializeBackendsAndReturnBest();if(t)throw new Error(`The highest priority backend '${e}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(e)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(e){if(!(e in this.registry)){if(!(e in this.registryFactory))return null;{const{asyncInit:t}=this.initializeBackend(e);if(t)return null}}return this.registry[e]}findBackendFactory(e){return e in this.registryFactory?this.registryFactory[e].factory:null}registerBackend(e,t,n=1){return e in this.registryFactory?(Sn(`${e} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[e]={factory:t,priority:n},!0)}async setBackend(e){if(null==this.registryFactory[e])throw new Error(`Backend name '${e}' not found in registry`);if(this.backendName=e,null==this.registry[e]){this.backendInstance=null;const{success:t,asyncInit:n}=this.initializeBackend(e);if(!(n?await t:t))return!1}return this.backendInstance=this.registry[e],this.setupRegisteredKernels(),this.profiler=new Sr(this.backendInstance),!0}setupRegisteredKernels(){In(this.backendName).forEach((e=>{null!=e.setupFunc&&e.setupFunc(this.backendInstance)}))}disposeRegisteredKernels(e){In(e).forEach((t=>{null!=t.disposeFunc&&t.disposeFunc(this.registry[e])}))}initializeBackend(e){const t=this.registryFactory[e];if(null==t)throw new Error(`Cannot initialize backend ${e}, no registration found.`);try{const n=t.factory();if(!n||n instanceof s||"function"!=typeof n.then)return this.registry[e]=n,{success:!0,asyncInit:!1};{const t=++this.pendingBackendInitId,r=n.then((n=>!(t<this.pendingBackendInitId)&&(this.registry[e]=n,this.pendingBackendInit=null,!0))).catch((n=>(t<this.pendingBackendInitId||(this.pendingBackendInit=null,Sn(`Initialization of backend ${e} failed`),Sn(n.stack||n.message)),!1)));return this.pendingBackendInit=r,{success:r,asyncInit:!0}}}catch(t){return Sn(`Initialization of backend ${e} failed`),Sn(t.stack||t.message),{success:!1,asyncInit:!1}}}removeBackend(e){if(!(e in this.registryFactory))throw new Error(`${e} backend not found in registry`);this.backendName===e&&null!=this.pendingBackendInit&&this.pendingBackendInitId++,e in this.registry&&(this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e]),delete this.registryFactory[e],this.backendName===e&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(0===Object.keys(this.registryFactory).length)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort(((e,t)=>this.registryFactory[t].priority-this.registryFactory[e].priority))}initializeBackendsAndReturnBest(){const e=this.getSortedBackends();for(let t=0;t<e.length;t++){const n=e[t],{success:r,asyncInit:s}=this.initializeBackend(n);if(s||r)return{name:n,asyncInit:s}}throw new Error("Could not initialize any backends, all backend initializations failed.")}moveData(e,t){const n=this.state.tensorInfo.get(t),r=n.backend,s=this.readSync(t),a=r.refCount(t);r.disposeData(t,!0),n.backend=e,e.move(t,s,n.shape,n.dtype,a),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(e,t){let n,r=null;if(null==t){if("function"!=typeof e)throw new Error("Please provide a function to tidy()");t=e}else{if("string"!=typeof e&&!(e instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if("function"!=typeof t)throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");r=e}return this.scopedRun((()=>this.startScope(r)),(()=>this.endScope(n)),(()=>(n=t(),n instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),n)))}scopedRun(e,t,n){e();try{const e=n();return t(),e}catch(e){throw t(),e}}nextTensorId(){return Yr.nextTensorId++}nextVariableId(){return Yr.nextVariableId++}clone(e){const t=ts.runKernel(Ge,{x:e}),n={x:e};return this.addTapeNode(this.state.activeScope.name,n,[t],(e=>({x:()=>{const t={x:e},n={dtype:"float32"};return ts.runKernel(ce,t,n)}})),[],{}),t}runKernel(e,t,n){null==this.backendName&&this.backend;if(!(null!=En(e,this.backendName)))throw new Error(`Kernel '${e}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:e,inputs:t,attrs:n})}shouldCheckForMemLeaks(){return this.ENV.getBool("IS_TEST")}checkKernelForMemLeak(e,t,n){const r=this.backend.numDataIds();let s=0;n.forEach((e=>{s+="complex64"===e.dtype?3:1}));const a=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],o=r-t-s-a;if(o>0)throw new Error(`Backend '${this.backendName}' has an internal memory leak (${o} data ids) after running '${e}'`)}runKernelFunc(e){let t,n=[];const r=this.isTapeOn(),s=this.state.numBytes,a=this.state.numTensors;let o,i;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0),null==this.backendName&&this.backend;const u=Qr(e)?e.kernelName:null!=this.state.activeScope?this.state.activeScope.name:"";if(Qr(e)){const{kernelName:t,inputs:s,attrs:a}=e;null==this.backendName&&this.backend;const u=En(t,this.backendName);l(null!=u,(()=>`Cannot find registered kernel '${t}' for backend '${this.backendName}'`)),o=()=>{const e=this.backend.numDataIds();i=u.kernelFunc({inputs:s,attrs:a,backend:this.backend});const o=Array.isArray(i)?i:[i];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(t,e,o);const l=o.map((e=>null!=e.rank?e:this.makeTensorFromTensorInfo(e)));if(r){const e=this.getTensorsForGradient(t,s,l);n=this.saveTensorsForBackwardMode(e)}return l}}else{const{forwardFunc:t}=e,s=e=>{r&&(n=e.map((e=>this.keep(this.clone(e)))))};o=()=>{const e=this.backend.numDataIds();i=this.tidy((()=>t(this.backend,s)));const n=Array.isArray(i)?i:[i];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(u,e,n),n}}const{inputs:c,attrs:p}=e,h=Qr(e)?null:e.backwardsFunc;let d;return this.scopedRun((()=>this.state.kernelDepth++),(()=>this.state.kernelDepth--),(()=>{this.ENV.getBool("DEBUG")||this.state.profiling?(d=this.profiler.profileKernel(u,c,(()=>o())),this.ENV.getBool("DEBUG")&&this.profiler.logKernelProfile(d),t=d.outputs):t=o()})),r&&this.addTapeNode(u,c,t,h,n,p),this.state.profiling&&this.state.activeProfile.kernels.push({name:u,bytesAdded:this.state.numBytes-s,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-a,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(c).map((e=>null!=c[e]?c[e].shape:null)),outputShapes:t.map((e=>e.shape)),kernelTimeMs:d.timeMs,extraInfo:d.extraInfo}),Array.isArray(i)?t:t[0]}saveTensorsForBackwardMode(e){const t=e.map((e=>this.keep(this.clone(e))));return t}getTensorsForGradient(e,t,n){const r=_n(e);if(null!=r){const e=r.inputsToSave||[],s=r.outputsToSave||[];let a;r.saveAllInputs?(l(Array.isArray(t),(()=>"saveAllInputs is true, expected inputs to be an array.")),a=Object.keys(t).map((e=>t[e]))):a=e.map((e=>t[e]));const o=n.filter(((e,t)=>s[t]));return a.concat(o)}return[]}makeTensor(e,t,n,r){if(null==e)throw new Error("Values passed to engine.makeTensor() are null");n=n||"float32",r=r||this.backend;let s=e;"string"===n&&E(e[0])&&(s=e.map((e=>xr(e))));const a=r.write(s,t,n),o=new Br(t,n,a,this.nextTensorId());if(this.trackTensor(o,r),"string"===n){const e=this.state.tensorInfo.get(a),t=T(s);this.state.numBytes+=t-e.bytes,e.bytes=t}return o}makeTensorFromDataId(e,t,n,r){const s={dataId:e,shape:t,dtype:n=n||"float32"};return this.makeTensorFromTensorInfo(s,r)}makeTensorFromTensorInfo(e,t){const{dataId:n,shape:r,dtype:s}=e,a=new Br(r,s,n,this.nextTensorId());return this.trackTensor(a,t),a}makeVariable(e,t=!0,n,r){n=n||this.nextVariableId().toString(),null!=r&&r!==e.dtype&&(e=e.cast(r));const s=new Lr(e,t,n,this.nextTensorId());if(null!=this.state.registeredVariables[s.name])throw new Error(`Variable with name ${s.name} was already registered`);return this.state.registeredVariables[s.name]=s,this.incRef(s,this.backend),s}trackTensor(e,t){this.state.numTensors++,"string"===e.dtype&&this.state.numStringTensors++;let n=0;"complex64"!==e.dtype&&"string"!==e.dtype&&(n=e.size*k(e.dtype)),this.state.numBytes+=n,this.state.tensorInfo.has(e.dataId)||(this.state.numDataBuffers++,this.state.tensorInfo.set(e.dataId,{backend:t||this.backend,dtype:e.dtype,shape:e.shape,bytes:n})),e instanceof Lr||this.track(e)}incRef(e,t){this.trackTensor(e,t),this.backend.incRef(e.dataId)}removeDataId(e,t){this.state.tensorInfo.has(e)&&this.state.tensorInfo.get(e).backend===t&&(this.state.tensorInfo.delete(e),this.state.numDataBuffers--)}disposeTensor(e){if(!this.state.tensorInfo.has(e.dataId))return;const t=this.state.tensorInfo.get(e.dataId);if(this.state.numTensors--,"string"===e.dtype&&(this.state.numStringTensors--,this.state.numBytes-=t.bytes),"complex64"!==e.dtype&&"string"!==e.dtype){const t=e.size*k(e.dtype);this.state.numBytes-=t}t.backend.disposeData(e.dataId)&&this.removeDataId(e.dataId,t.backend)}disposeVariables(){for(const e in this.state.registeredVariables){const t=this.state.registeredVariables[e];this.disposeVariable(t)}}disposeVariable(e){this.disposeTensor(e),null!=this.state.registeredVariables[e.name]&&delete this.state.registeredVariables[e.name]}memory(){const e=this.backend.memory();return e.numTensors=this.state.numTensors,e.numDataBuffers=this.state.numDataBuffers,e.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(e.unreliable=!0,null==e.reasons&&(e.reasons=[]),e.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),e}async profile(e){this.state.profiling=!0;const t=this.state.numBytes,n=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await e(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map((e=>e.totalBytesSnapshot))),this.state.activeProfile.newBytes=this.state.numBytes-t,this.state.activeProfile.newTensors=this.state.numTensors-n;for(const e of this.state.activeProfile.kernels)e.kernelTimeMs=await e.kernelTimeMs,e.extraInfo=await e.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&0===this.state.kernelDepth}addTapeNode(e,t,n,r,s,a){const o={id:this.state.nextTapeNodeId++,kernelName:e,inputs:t,outputs:n,saved:s},i=_n(e);null!=i&&(r=i.gradFunc),null!=r&&(o.gradient=e=>(e=e.map(((e,t)=>{if(null==e){const e=n[t],r=C(e.size,e.dtype);return this.makeTensor(r,e.shape,e.dtype)}return e})),r(e.length>1?e:e[0],s,a))),this.state.activeTape.push(o)}keep(e){return e.kept=!0,e}startTape(){0===this.state.gradientDepth&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(e){const t={track:[],name:"unnamed scope",id:this.state.nextScopeId++};e&&(t.name=e),this.state.scopeStack.push(t),this.state.activeScope=t}endScope(e){const t=Hr(e),n=new Set(t.map((e=>e.id)));for(let e=0;e<this.state.activeScope.track.length;e++){const t=this.state.activeScope.track[e];t.kept||n.has(t.id)||t.dispose()}const r=this.state.scopeStack.pop();this.state.activeScope=0===this.state.scopeStack.length?null:this.state.scopeStack[this.state.scopeStack.length-1],t.forEach((e=>{e.kept||e.scopeId!==r.id||this.track(e)}))}gradients(e,t,n,r=!1){if(l(t.length>0,(()=>"gradients() received an empty list of xs.")),null!=n&&"float32"!==n.dtype)throw new Error(`dy must have 'float32' dtype, but has '${n.dtype}'`);const s=this.scopedRun((()=>this.startTape()),(()=>this.endTape()),(()=>this.tidy("forward",e)));l(s instanceof Br,(()=>"The result y returned by f() must be a tensor."));const a=function(e,t,n){const r={},s={};for(let e=0;e<t.length;e++)r[t[e].id]=!0;for(let n=0;n<e.length;n++){const a=e[n],o=a.inputs;for(const e in o){const n=o[e];let i=!1;for(let e=0;e<t.length;e++)if(r[n.id]){a.outputs.forEach((e=>r[e.id]=!0)),i=!0,s[a.id]=!0;break}if(i)break}}const a={};a[n.id]=!0;const o={};for(let t=e.length-1;t>=0;t--){const n=e[t],r=n.inputs;for(let e=0;e<n.outputs.length;e++)if(a[n.outputs[e].id]){for(const e in r)a[r[e].id]=!0,o[n.id]=!0;break}}const i=[];for(let t=0;t<e.length;t++){const n=e[t];if(s[n.id]&&o[n.id]){const e={};for(const t in n.inputs){const s=n.inputs[t];r[s.id]&&(e[t]=s)}const t=Object.assign({},n);t.inputs=e,t.outputs=n.outputs,i.push(t)}}return i}(this.state.activeTape,t,s);if(!r&&0===a.length&&t.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",(()=>{const e={};e[s.id]=null==n?function(e){const t=F(d(e),"float32");return ts.makeTensor(t,e,"float32")}(s.shape):n,function(e,t,n,r){for(let s=t.length-1;s>=0;s--){const a=t[s],o=[];if(a.outputs.forEach((t=>{const n=e[t.id];null!=n?o.push(n):o.push(null)})),null==a.gradient)throw new Error(`Cannot compute gradient: gradient function not found for ${a.kernelName}.`);const i=a.gradient(o);for(const t in a.inputs){if(!(t in i))throw new Error(`Cannot backprop through input ${t}. Available gradients found: ${Object.keys(i)}.`);const s=n((()=>i[t]()));if("float32"!==s.dtype)throw new Error(`Error in gradient for op ${a.kernelName}. The gradient of input ${t} must have 'float32' dtype, but has '${s.dtype}'`);const o=a.inputs[t];if(!m(s.shape,o.shape))throw new Error(`Error in gradient for op ${a.kernelName}. The gradient of input '${t}' has shape '${s.shape}', which does not match the shape of the input '${o.shape}'`);if(null==e[o.id])e[o.id]=s;else{const t=e[o.id];e[o.id]=r(t,s),t.dispose()}}}}(e,a,(e=>this.tidy(e)),ns);const r=t.map((t=>e[t.id]));return 0===this.state.gradientDepth&&(this.state.activeTape.forEach((e=>{for(const t of e.saved)t.dispose()})),this.state.activeTape=null),{value:s,grads:r}}))}customGrad(e){return l($(e),(()=>"The f passed in customGrad(f) must be a function.")),(...t)=>{let n;l(t.every((e=>e instanceof Br)),(()=>"The args passed in customGrad(f)(x1, x2,...) must all be tensors"));const r={};t.forEach(((e,t)=>{r[t]=e}));return this.runKernelFunc({forwardFunc:(r,s)=>(n=e(...t,s),l(n.value instanceof Br,(()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor")),l($(n.gradFunc),(()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function.")),n.value),backwardsFunc:(e,r)=>{const s=n.gradFunc(e,r),a=Array.isArray(s)?s:[s];l(a.length===t.length,(()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...).")),l(a.every((e=>e instanceof Br)),(()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors."));const o={};return a.forEach(((e,t)=>{o[t]=()=>e})),o},inputs:r})}}readSync(e){return this.state.tensorInfo.get(e).backend.readSync(e)}read(e){return this.state.tensorInfo.get(e).backend.read(e)}readToGPU(e,t){return this.state.tensorInfo.get(e).backend.readToGPU(e,t)}async time(e){const t=wr(),n=await this.backend.time(e);return n.wallMs=wr()-t,n}track(e){return null!=this.state.activeScope&&(e.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(e)),e}get registeredVariables(){return this.state.registeredVariables}reset(){this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new Xr;for(const e in this.registry)this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}}function es(){const e=j();if(null==e._tfengine){const t=new P(e);e._tfengine=new Yr(t)}var t;
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
 */return t=e._tfengine.ENV,U=t,Fr=()=>e._tfengine,e._tfengine}Yr.nextTensorId=0,Yr.nextVariableId=0;const ts=es();function ns(e,t){const n={a:e,b:t};return ts.runKernel(Z,n)}
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
 */let rs;function ss(){return"undefined"!=typeof window&&null!=window.document||"undefined"!=typeof WorkerGlobalScope}var as=Object.freeze({__proto__:null,isBrowser:ss,isMobile:function(e){if(void 0!==rs)return rs;if(e||"undefined"!=typeof navigator&&null!=navigator){if(e||(e=navigator),"ReactNative"===e.product)return!0;const t=e.userAgent||e.vendor||("undefined"!=typeof window?window.opera:"");if(!t){const t=e;return t.userAgentData&&t.userAgentData.mobile}return/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4))}return!1},mockIsMobile:function(e){rs=e}});
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
 */const os=q();
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
function is(e,t){let n=e;if(S(e))return"string"===t?[]:[e.length];if(!Array.isArray(e))return[];const r=[];for(;Array.isArray(n)||S(n)&&"string"!==t;)r.push(n.length),n=n[0];return Array.isArray(e)&&q().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&us(e,r,[]),r}function us(e,t,n){if(n=n||[],!Array.isArray(e)&&!S(e))return void l(0===t.length,(()=>`Element arr[${n.join("][")}] is a primitive, but should be an array/TypedArray of ${t[0]} elements`));l(t.length>0,(()=>`Element arr[${n.join("][")}] should be a primitive, but is an array of ${e.length} elements`)),l(e.length===t[0],(()=>`Element arr[${n.join("][")}] should have ${t[0]} elements, but has ${e.length} elements`));const r=t.slice(1);for(let t=0;t<e.length;++t)us(e[t],r,n.concat(t))}function ls(e,t,n,r){if("string_or_numeric"!==e){if(null==e)throw new Error("Expected dtype cannot be null.");if("numeric"!==e&&e!==t||"numeric"===e&&"string"===t)throw new Error(`Argument '${n}' passed to '${r}' must be ${e} tensor, but got ${t} tensor`)}}function cs(e,t,n,r="numeric"){if(e instanceof Br)return ls(r,e.dtype,t,n),e;let s=A(e);if("string"!==s&&["bool","int32","float32"].indexOf(r)>=0&&(s=r),ls(r,s,t,n),null==e||!S(e)&&!Array.isArray(e)&&"number"!=typeof e&&"boolean"!=typeof e&&"string"!=typeof e){const r=null==e?"null":e.constructor.name;throw new Error(`Argument '${t}' passed to '${n}' must be a Tensor or TensorLike, but got '${r}'`)}const a=is(e,s);S(e)||Array.isArray(e)||(e=[e]);const o="string"!==s?br(e,s):h(e,[],!0);return ts.makeTensor(o,a,s)}function ps(e,t,n,r="numeric"){if(!Array.isArray(e))throw new Error(`Argument ${t} passed to ${n} must be a \`Tensor[]\` or \`TensorLike[]\``);return e.map(((e,s)=>cs(e,`${t}[${s}]`,n,r)))}
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
 */os.registerFlag("DEBUG",(()=>!1),(e=>{e&&console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.")})),os.registerFlag("IS_BROWSER",(()=>ss())),os.registerFlag("IS_NODE",(()=>"undefined"!=typeof process&&void 0!==process.versions&&void 0!==process.versions.node)),os.registerFlag("IS_CHROME",(()=>"undefined"!=typeof navigator&&null!=navigator&&null!=navigator.userAgent&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor))),os.registerFlag("PROD",(()=>!1)),os.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY",(()=>os.getBool("DEBUG"))),os.registerFlag("DEPRECATION_WARNINGS_ENABLED",(()=>!0)),os.registerFlag("IS_TEST",(()=>!1)),os.registerFlag("CHECK_COMPUTATION_FOR_ERRORS",(()=>!0)),os.registerFlag("WRAP_TO_IMAGEBITMAP",(()=>!1)),os.registerFlag("ENGINE_COMPILE_ONLY",(()=>!1)),os.registerFlag("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU",(()=>!1)),os.registerFlag("USE_SETTIMEOUTCUSTOM",(()=>!1));const hs="__op";function ds(e){const t=Object.keys(e);if(1!==t.length)throw new Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${t.length} keys.`);let n=t[0];const r=e[n];n.endsWith("_")&&(n=n.substring(0,n.length-1)),n+=hs;const s=(...e)=>{ts.startScope(n);try{const t=r(...e);return L(t)&&console.error("Cannot return a Promise inside of tidy."),ts.endScope(t),t}catch(e){throw ts.endScope(null),e}};return Object.defineProperty(s,"name",{value:n,configurable:!0}),s}
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
 */const ms=ds({complex_:function(e,t){const n=cs(e,"real","complex"),r=cs(t,"imag","complex");c(n.shape,r.shape,`real and imag shapes, ${n.shape} and ${r.shape}, must match in call to tf.complex().`);const s={real:n,imag:r};return ts.runKernel(de,s)}});
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
 */function fs(e,t,n,r){if(null==r&&(r=A(e)),"complex64"===r)throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(!S(e)&&!Array.isArray(e)&&"number"!=typeof e&&"boolean"!=typeof e&&"string"!=typeof e)throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(null!=t){B(t);const e=d(t),r=d(n);l(e===r,(()=>`Based on the provided shape, [${t}], the tensor should have ${e} values but has ${r}`));for(let e=0;e<n.length;++e){const r=n[e],s=e!==n.length-1||r!==d(t.slice(e));l(n[e]===t[e]||!s,(()=>`Error creating a new Tensor. Inferred shape (${n}) does not match the provided shape (${t}). `))}}return S(e)||Array.isArray(e)||(e=[e]),t=t||n,e="string"!==r?br(e,r):h(e,[],!0),ts.makeTensor(e,t,r)}
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
 */function gs(e,t,n){return fs(e,t,is(e,n),n)}
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
 */const ys={float32:4,float16:2,int32:4,uint16:2,uint8:1,bool:1,complex64:8},bs=4;
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
 */function ws(e,t){const n={};let r,s=0;for(const a of t){const t=a.name,o=a.dtype,i=a.shape,u=d(i);let l;if("quantization"in a){const n=a.quantization;if("uint8"===n.dtype||"uint16"===n.dtype){if(!("min"in n)||!("scale"in n))throw new Error(`Weight ${a.name} with quantization ${n.dtype} doesn't have corresponding metadata min and scale.`)}else{if("float16"!==n.dtype)throw new Error(`Weight ${a.name} has unknown quantization dtype ${n.dtype}. Supported quantization dtypes are: 'uint8', 'uint16', and 'float16'.`);if("float32"!==o)throw new Error(`Weight ${a.name} is quantized with ${n.dtype} which only supports weights of type float32 not ${o}.`)}const i=ys[n.dtype],c=e.slice(s,s+u*i),p="uint8"===n.dtype?new Uint8Array(c):new Uint16Array(c);if("float32"===o)if("uint8"===n.dtype||"uint16"===n.dtype){l=new Float32Array(p.length);for(let e=0;e<p.length;e++){const t=p[e];l[e]=t*n.scale+n.min}}else{if("float16"!==n.dtype)throw new Error(`Unsupported quantization type ${n.dtype} for weight type float32.`);void 0===r&&(r=$s()),l=r(p)}else{if("int32"!==o)throw new Error(`Unsupported dtype in weight '${t}': ${o}`);if("uint8"!==n.dtype&&"uint16"!==n.dtype)throw new Error(`Unsupported quantization type ${n.dtype} for weight type int32.`);l=new Int32Array(p.length);for(let e=0;e<p.length;e++){const t=p[e];l[e]=Math.round(t*n.scale+n.min)}}s+=u*i}else if("string"===o){const t=d(a.shape);l=[];for(let n=0;n<t;n++){const t=new Uint32Array(e.slice(s,s+bs))[0];s+=bs;const n=new Uint8Array(e.slice(s,s+t));l.push(n),s+=t}}else{const r=ys[o],a=e.slice(s,s+u*r);if("float32"===o)l=new Float32Array(a);else if("int32"===o)l=new Int32Array(a);else if("bool"===o)l=new Uint8Array(a);else{if("complex64"!==o)throw new Error(`Unsupported dtype in weight '${t}': ${o}`);{l=new Float32Array(a);const e=new Float32Array(l.length/2),r=new Float32Array(l.length/2);for(let t=0;t<e.length;t++)e[t]=l[2*t],r[t]=l[2*t+1];const s=gs(e,i,"float32"),o=gs(r,i,"float32");n[t]=ms(s,o),s.dispose(),o.dispose()}}s+=u*r}"complex64"!==o&&(n[t]=gs(l,i,o))}return n}function xs(e){if(null===e)throw new Error(`Invalid input value: ${JSON.stringify(e)}`);let t=0;const n=[];e.forEach((e=>{if(t+=e.byteLength,n.push(e.byteLength===e.buffer.byteLength?e:new e.constructor(e)),!(e instanceof Float32Array||e instanceof Int32Array||e instanceof Uint8Array))throw new Error(`Unsupported TypedArray subtype: ${e.constructor.name}`)}));const r=new Uint8Array(t);let s=0;return n.forEach((e=>{r.set(new Uint8Array(e.buffer),s),s+=e.byteLength})),r.buffer}const vs="undefined"!=typeof Buffer&&("undefined"==typeof Blob||"undefined"==typeof atob||"undefined"==typeof btoa);function Ns(e){return vs?Buffer.byteLength(e):new Blob([e]).size}function Ss(e){if(1===e.length)return e[0];let t=0;e.forEach((e=>{t+=e.byteLength}));const n=new Uint8Array(t);let r=0;return e.forEach((e=>{n.set(new Uint8Array(e),r),r+=e.byteLength})),n.buffer}function ks(e){for(e=e.trim();e.endsWith("/");)e=e.slice(0,e.length-1);const t=e.split("/");return t[t.length-1]}function Ts(e,t){const n={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,weightsManifest:t};return null!=e.signature&&(n.signature=e.signature),null!=e.userDefinedMetadata&&(n.userDefinedMetadata=e.userDefinedMetadata),null!=e.modelInitializer&&(n.modelInitializer=e.modelInitializer),null!=e.trainingConfig&&(n.trainingConfig=e.trainingConfig),n}function Es(e,t,n){const r={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy};if(null!=e.trainingConfig&&(r.trainingConfig=e.trainingConfig),null!=e.weightsManifest){if(!t)throw new Error("modelJSON has weightsManifest but weightSpecs is null");if(!n)throw new Error("modelJSON has weightsManifest but weightData is null");r.weightSpecs=t,r.weightData=n}return null!=e.signature&&(r.signature=e.signature),null!=e.userDefinedMetadata&&(r.userDefinedMetadata=e.userDefinedMetadata),null!=e.modelInitializer&&(r.modelInitializer=e.modelInitializer),r}async function _s(e,t){let n,r;return null!=e.weightsManifest&&([n,r]=await t(e.weightsManifest)),Es(e,n,r)}function Is(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("Expected JSON model topology, received ArrayBuffer.");return{dateSaved:new Date,modelTopologyType:"JSON",modelTopologyBytes:null==e.modelTopology?0:Ns(JSON.stringify(e.modelTopology)),weightSpecsBytes:null==e.weightSpecs?0:Ns(JSON.stringify(e.weightSpecs)),weightDataBytes:null==e.weightData?0:e.weightData.byteLength}}function As(e){const t=[];for(const n of e)t.push(...n.weights);return t}function $s(){const e=function(){const e=e=>{let t=e<<13,n=0;for(;!(8388608&t);)n-=8388608,t<<=1;return t&=-8388609,n+=947912704,t|n},t=new Uint32Array(2048);t[0]=0;for(let n=1;n<1024;n++)t[n]=e(n);for(let e=1024;e<2048;e++)t[e]=939524096+(e-1024<<13);return t}(),t=function(){const e=new Uint32Array(64);e[0]=0,e[31]=1199570944,e[32]=2147483648,e[63]=3347054592;for(let t=1;t<31;t++)e[t]=t<<23;for(let t=33;t<63;t++)e[t]=2147483648+(t-32<<23);return e}(),n=function(){const e=new Uint32Array(64);for(let t=0;t<64;t++)e[t]=1024;return e[0]=e[32]=0,e}();return r=>{const s=new ArrayBuffer(4*r.length),a=new Uint32Array(s);for(let s=0;s<r.length;s++){const o=r[s],i=e[n[o>>10]+(1023&o)]+t[o>>10];a[s]=i}return new Float32Array(s)}}
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
 */class Ms{constructor(){this.saveRouters=[],this.loadRouters=[]}static getInstance(){return null==Ms.instance&&(Ms.instance=new Ms),Ms.instance}static registerSaveRouter(e){Ms.getInstance().saveRouters.push(e)}static registerLoadRouter(e){Ms.getInstance().loadRouters.push(e)}static getSaveHandlers(e){return Ms.getHandlers(e,"save")}static getLoadHandlers(e,t){return Ms.getHandlers(e,"load",t)}static getHandlers(e,t,n){const r=[];return("load"===t?Ms.getInstance().loadRouters:Ms.getInstance().saveRouters).forEach((t=>{const s=t(e,n);null!==s&&r.push(s)})),r}}const Os="tensorflowjs",Ds="models_store",Rs="model_info_store";function Fs(){if(!q().getBool("IS_BROWSER"))throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");const e="undefined"==typeof window?self:window,t=e.indexedDB||e.mozIndexedDB||e.webkitIndexedDB||e.msIndexedDB||e.shimIndexedDB;if(null==t)throw new Error("The current browser does not appear to support IndexedDB.");return t}function Cs(e){const t=e.result;t.createObjectStore(Ds,{keyPath:"modelPath"}),t.createObjectStore(Rs,{keyPath:"modelPath"})}class Bs{constructor(e){if(this.indexedDB=Fs(),null==e||!e)throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");this.modelPath=e}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");return this.databaseAction(this.modelPath,e)}async load(){return this.databaseAction(this.modelPath)}databaseAction(e,t){return new Promise(((e,n)=>{const r=this.indexedDB.open(Os,1);r.onupgradeneeded=()=>Cs(r),r.onsuccess=()=>{const s=r.result;if(null==t){const t=s.transaction(Ds,"readonly"),r=t.objectStore(Ds).get(this.modelPath);r.onsuccess=()=>{if(null==r.result)return s.close(),n(new Error(`Cannot find model with path '${this.modelPath}' in IndexedDB.`));e(r.result.modelArtifacts)},r.onerror=e=>(s.close(),n(r.error)),t.oncomplete=()=>s.close()}else{const r=Is(t),a=s.transaction(Rs,"readwrite");let o=a.objectStore(Rs);const i=o.put({modelPath:this.modelPath,modelArtifactsInfo:r});let u;i.onsuccess=()=>{u=s.transaction(Ds,"readwrite");const i=u.objectStore(Ds).put({modelPath:this.modelPath,modelArtifacts:t,modelArtifactsInfo:r});i.onsuccess=()=>e({modelArtifactsInfo:r}),i.onerror=e=>{o=a.objectStore(Rs);const t=o.delete(this.modelPath);t.onsuccess=()=>(s.close(),n(i.error)),t.onerror=e=>(s.close(),n(i.error))}},i.onerror=e=>(s.close(),n(i.error)),a.oncomplete=()=>{null==u?s.close():u.oncomplete=()=>s.close()}}},r.onerror=e=>n(r.error)}))}}Bs.URL_SCHEME="indexeddb://";const Ls=e=>{return q().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(Bs.URL_SCHEME)?(t=e.slice(Bs.URL_SCHEME.length),new Bs(t)):null;var t};Ms.registerSaveRouter(Ls),Ms.registerLoadRouter(Ls);class zs{constructor(){this.indexedDB=Fs()}async listModels(){return new Promise(((e,t)=>{const n=this.indexedDB.open(Os,1);n.onupgradeneeded=()=>Cs(n),n.onsuccess=()=>{const r=n.result,s=r.transaction(Rs,"readonly"),a=s.objectStore(Rs).getAll();a.onsuccess=()=>{const t={};for(const e of a.result)t[e.modelPath]=e.modelArtifactsInfo;e(t)},a.onerror=e=>(r.close(),t(a.error)),s.oncomplete=()=>r.close()},n.onerror=e=>t(n.error)}))}async removeModel(e){var t;return e=(t=e).startsWith(Bs.URL_SCHEME)?t.slice(Bs.URL_SCHEME.length):t,new Promise(((t,n)=>{const r=this.indexedDB.open(Os,1);r.onupgradeneeded=()=>Cs(r),r.onsuccess=()=>{const s=r.result,a=s.transaction(Rs,"readwrite"),o=a.objectStore(Rs),i=o.get(e);let u;i.onsuccess=()=>{if(null==i.result)return s.close(),n(new Error(`Cannot find model with path '${e}' in IndexedDB.`));{const r=o.delete(e),a=()=>{u=s.transaction(Ds,"readwrite");const r=u.objectStore(Ds).delete(e);r.onsuccess=()=>t(i.result.modelArtifactsInfo),r.onerror=e=>n(i.error)};r.onsuccess=a,r.onerror=e=>(a(),s.close(),n(i.error))}},i.onerror=e=>(s.close(),n(i.error)),a.oncomplete=()=>{null==u?s.close():u.oncomplete=()=>s.close()}},r.onerror=e=>n(r.error)}))}}
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
 */const Ps="/",Vs="tensorflowjs_models",qs="info",Ws="model_topology",Us="weight_specs",js="weight_data",Gs="model_metadata";function Ks(e){return{info:[Vs,e,qs].join(Ps),topology:[Vs,e,Ws].join(Ps),weightSpecs:[Vs,e,Us].join(Ps),weightData:[Vs,e,js].join(Ps),modelMetadata:[Vs,e,Gs].join(Ps)}}function Hs(e){for(const t of Object.values(e))window.localStorage.removeItem(t)}function Zs(e){const t=e.split(Ps);if(t.length<3)throw new Error(`Invalid key format: ${e}`);return t.slice(1,t.length-1).join(Ps)}class Js{constructor(e){if(!q().getBool("IS_BROWSER")||"undefined"==typeof window||void 0===window.localStorage)throw new Error("The current environment does not support local storage.");if(this.LS=window.localStorage,null==e||!e)throw new Error("For local storage, modelPath must not be null, undefined or empty.");this.modelPath=e,this.keys=Ks(this.modelPath)}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");{const t=JSON.stringify(e.modelTopology),n=JSON.stringify(e.weightSpecs),r=Is(e);try{this.LS.setItem(this.keys.info,JSON.stringify(r)),this.LS.setItem(this.keys.topology,t),this.LS.setItem(this.keys.weightSpecs,n),this.LS.setItem(this.keys.weightData,function(e){if(vs)return Buffer.from(e).toString("base64");const t=new Uint8Array(e);let n="";for(let e=0,r=t.length;e<r;e++)n+=String.fromCharCode(t[e]);return btoa(n)}(e.weightData));const s={format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,signature:null!=e.signature?e.signature:void 0,userDefinedMetadata:null!=e.userDefinedMetadata?e.userDefinedMetadata:void 0,modelInitializer:null!=e.modelInitializer?e.modelInitializer:void 0,trainingConfig:null!=e.trainingConfig?e.trainingConfig:void 0};return this.LS.setItem(this.keys.modelMetadata,JSON.stringify(s)),{modelArtifactsInfo:r}}catch(e){throw Hs(this.keys),new Error(`Failed to save model '${this.modelPath}' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=${r.modelTopologyBytes}, weightSpecsBytes=${r.weightSpecsBytes}, weightDataBytes=${r.weightDataBytes}.`)}}}async load(){const e=JSON.parse(this.LS.getItem(this.keys.info));if(null==e)throw new Error(`In local storage, there is no model with name '${this.modelPath}'`);if("JSON"!==e.modelTopologyType)throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");const t={},n=JSON.parse(this.LS.getItem(this.keys.topology));if(null==n)throw new Error(`In local storage, the topology of model '${this.modelPath}' is missing.`);t.modelTopology=n;const r=JSON.parse(this.LS.getItem(this.keys.weightSpecs));if(null==r)throw new Error(`In local storage, the weight specs of model '${this.modelPath}' are missing.`);t.weightSpecs=r;const s=this.LS.getItem(this.keys.modelMetadata);if(null!=s){const e=JSON.parse(s);t.format=e.format,t.generatedBy=e.generatedBy,t.convertedBy=e.convertedBy,null!=e.signature&&(t.signature=e.signature),null!=e.userDefinedMetadata&&(t.userDefinedMetadata=e.userDefinedMetadata),null!=e.modelInitializer&&(t.modelInitializer=e.modelInitializer),null!=e.trainingConfig&&(t.trainingConfig=e.trainingConfig)}const a=this.LS.getItem(this.keys.weightData);if(null==a)throw new Error(`In local storage, the binary weight values of model '${this.modelPath}' are missing.`);return t.weightData=function(e){if(vs){const t=Buffer.from(e,"base64");return t.buffer.slice(t.byteOffset,t.byteOffset+t.byteLength)}const t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;++e)n.set([t.charCodeAt(e)],e);return n.buffer}(a),t}}Js.URL_SCHEME="localstorage://";const Qs=e=>{return q().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(Js.URL_SCHEME)?(t=e.slice(Js.URL_SCHEME.length),new Js(t)):null;var t};Ms.registerSaveRouter(Qs),Ms.registerLoadRouter(Qs);class Xs{constructor(){l(q().getBool("IS_BROWSER"),(()=>"Current environment is not a web browser")),l("undefined"==typeof window||void 0!==window.localStorage,(()=>"Current browser does not appear to support localStorage")),this.LS=window.localStorage}async listModels(){const e={},t=Vs+Ps,n=Ps+qs;for(let r=0;r<this.LS.length;++r){const s=this.LS.key(r);if(s.startsWith(t)&&s.endsWith(n)){e[Zs(s)]=JSON.parse(this.LS.getItem(s))}}return e}async removeModel(e){var t;const n=Ks(e=(t=e).startsWith(Js.URL_SCHEME)?t.slice(Js.URL_SCHEME.length):t);if(null==this.LS.getItem(n.info))throw new Error(`Cannot find model at path '${e}'`);const r=JSON.parse(this.LS.getItem(n.info));return Hs(n),r}}
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
 */const Ys="://";class ea{constructor(){this.managers={}}static getInstance(){return null==ea.instance&&(ea.instance=new ea),ea.instance}static registerManager(e,t){l(null!=e,(()=>"scheme must not be undefined or null.")),e.endsWith(Ys)&&(e=e.slice(0,e.indexOf(Ys))),l(e.length>0,(()=>"scheme must not be an empty string."));const n=ea.getInstance();l(null==n.managers[e],(()=>`A model store manager is already registered for scheme '${e}'.`)),n.managers[e]=t}static getManager(e){const t=ea.getInstance().managers[e];if(null==t)throw new Error(`Cannot find model manager for scheme '${e}'`);return t}static getSchemes(){return Object.keys(ea.getInstance().managers)}}function ta(e){if(-1===e.indexOf(Ys))throw new Error(`The url string provided does not contain a scheme. Supported schemes are: ${ea.getSchemes().join(",")}`);return{scheme:e.split(Ys)[0],path:e.split(Ys)[1]}}async function na(e,t,n=!1){l(e!==t,(()=>`Old path and new path are the same: '${e}'`));const r=Ms.getLoadHandlers(e);l(r.length>0,(()=>`Copying failed because no load handler is found for source URL ${e}.`)),l(r.length<2,(()=>`Copying failed because more than one (${r.length}) load handlers for source URL ${e}.`));const s=r[0],a=Ms.getSaveHandlers(t);l(a.length>0,(()=>`Copying failed because no save handler is found for destination URL ${t}.`)),l(a.length<2,(()=>`Copying failed because more than one (${r.length}) save handlers for destination URL ${t}.`));const o=a[0],i=ta(e).scheme,u=ta(e).path,c=i===ta(e).scheme,p=await s.load();n&&c&&await ea.getManager(i).removeModel(u);const h=await o.save(p);return n&&!c&&await ea.getManager(i).removeModel(u),h.modelArtifactsInfo}
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
class ra{constructor(){this.messageName="setTimeoutCustom",this.functionRefs=[],this.handledMessageCount=0,this.hasEventListener=!1}fetch(e,t){return fetch(e,t)}now(){return performance.now()}encode(e,t){if("utf-8"!==t&&"utf8"!==t)throw new Error(`Browser's encoder only supports utf-8, but got ${t}`);return null==this.textEncoder&&(this.textEncoder=new TextEncoder),this.textEncoder.encode(e)}decode(e,t){return new TextDecoder(t).decode(e)}setTimeoutCustom(e,t){window&&q().getBool("USE_SETTIMEOUTCUSTOM")?(this.functionRefs.push(e),setTimeout((()=>{window.postMessage({name:this.messageName,index:this.functionRefs.length-1},"*")}),t),this.hasEventListener||(this.hasEventListener=!0,window.addEventListener("message",(e=>{if(e.source===window&&e.data.name===this.messageName){e.stopPropagation();(0,this.functionRefs[e.data.index])(),this.handledMessageCount++,this.handledMessageCount===this.functionRefs.length&&(this.functionRefs=[],this.handledMessageCount=0)}}),!0))):setTimeout(e,t)}}if(q().get("IS_BROWSER")){q().setPlatform("browser",new ra);try{ea.registerManager(Js.URL_SCHEME,new Xs)}catch(e){}try{ea.registerManager(Bs.URL_SCHEME,new zs)}catch(e){}}
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
 */const sa=()=>require("node-fetch");let aa;class oa{constructor(){this.util=require("util"),this.textEncoder=new this.util.TextEncoder}fetch(e,t){return null!=q().global.fetch?q().global.fetch(e,t):(null==aa&&(aa=sa()),aa(e,t))}now(){const e=process.hrtime();return 1e3*e[0]+e[1]/1e6}encode(e,t){if("utf-8"!==t&&"utf8"!==t)throw new Error(`Node built-in encoder only supports utf-8, but got ${t}`);return this.textEncoder.encode(e)}decode(e,t){return 0===e.length?"":new this.util.TextDecoder(t).decode(e)}}
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
function ia(e,t="float32",n){return t=t||"float32",B(e),new Rr(e,t,n)}
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
 */q().get("IS_NODE")&&!q().get("IS_BROWSER")&&q().setPlatform("node",new oa);const ua=ds({cast_:function(e,t){const n=cs(e,"x","cast");if(!N(t))throw new Error(`Failed to cast to unknown dtype ${t}`);if("string"===t&&"string"!==n.dtype||"string"!==t&&"string"===n.dtype)throw new Error("Only strings can be casted to strings");const r={x:n},s={dtype:t};return ts.runKernel(ce,r,s)}});
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
 */const la=ds({clone_:function(e){const t={x:cs(e,"x","clone","string_or_numeric")};return ts.runKernel(Ge,t)}});
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
 */function ca(e,t=!1){console.log(e.toString(t))}
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
 */es();Cr={buffer:ia,cast:ua,clone:la,print:ca};function pa(e){return new Promise((e=>setTimeout(e))).then(e)}class ha{constructor(e){if(!q().getBool("IS_BROWSER"))throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");e.startsWith(ha.URL_SCHEME)&&(e=e.slice(ha.URL_SCHEME.length)),null!=e&&0!==e.length||(e="model"),this.modelJsonFileName=e+".json",this.weightDataFileName=e+".weights.bin"}async save(e){if("undefined"==typeof document)throw new Error("Browser downloads are not supported in this environment since `document` is not present");const t=window.URL.createObjectURL(new Blob([e.weightData],{type:"application/octet-stream"}));if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");{const n=Ts(e,[{paths:["./"+this.weightDataFileName],weights:e.weightSpecs}]),r=window.URL.createObjectURL(new Blob([JSON.stringify(n)],{type:"application/json"})),s=null==this.modelJsonAnchor?document.createElement("a"):this.modelJsonAnchor;if(s.download=this.modelJsonFileName,s.href=r,await pa((()=>s.dispatchEvent(new MouseEvent("click")))),null!=e.weightData){const e=null==this.weightDataAnchor?document.createElement("a"):this.weightDataAnchor;e.download=this.weightDataFileName,e.href=t,await pa((()=>e.dispatchEvent(new MouseEvent("click"))))}return{modelArtifactsInfo:Is(e)}}}}ha.URL_SCHEME="downloads://";class da{constructor(e){if(null==e||e.length<1)throw new Error(`When calling browserFiles, at least 1 file is required, but received ${e}`);this.jsonFile=e[0],this.weightsFiles=e.slice(1)}async load(){return new Promise(((e,t)=>{const n=new FileReader;n.onload=n=>{const r=JSON.parse(n.target.result),s=r.modelTopology;if(null==s)return void t(new Error(`modelTopology field is missing from file ${this.jsonFile.name}`));if(null==r.weightsManifest)return void t(new Error(`weightManifest field is missing from file ${this.jsonFile.name}`));if(0===this.weightsFiles.length)return void e({modelTopology:s});const a=_s(r,(e=>this.loadWeights(e)));e(a)},n.onerror=e=>t(`Failed to read model topology and weights manifest JSON from file '${this.jsonFile.name}'. BrowserFiles supports loading Keras-style tf.Model artifacts only.`),n.readAsText(this.jsonFile)}))}loadWeights(e){const t=[],n=[];for(const r of e)t.push(...r.weights),n.push(...r.paths);const r=this.checkManifestAndWeightFiles(e),s=n.map((e=>this.loadWeightsFile(e,r[e])));return Promise.all(s).then((e=>[t,Ss(e)]))}loadWeightsFile(e,t){return new Promise(((n,r)=>{const s=new FileReader;s.onload=e=>{const t=e.target.result;n(t)},s.onerror=t=>r(`Failed to weights data from file of path '${e}'.`),s.readAsArrayBuffer(t)}))}checkManifestAndWeightFiles(e){const t=[],n=this.weightsFiles.map((e=>ks(e.name))),r={};for(const s of e)s.paths.forEach((e=>{const s=ks(e);if(-1!==t.indexOf(s))throw new Error(`Duplicate file basename found in weights manifest: '${s}'`);if(t.push(s),-1===n.indexOf(s))throw new Error(`Weight file with basename '${s}' is not provided.`);r[e]=this.weightsFiles[n.indexOf(s)]}));if(t.length!==this.weightsFiles.length)throw new Error(`Mismatch in the number of files in weights manifest (${t.length}) and the number of weight files provided (${this.weightsFiles.length}).`);return r}}
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
function ma(e,t,n,r){!function(e){l(null!=e&&Array.isArray(e)&&e.length>0,(()=>"promises must be a none empty array"))}(e),function(e,t){l(e>=0&&e<=1,(()=>`Progress fraction must be in range [0, 1], but got startFraction ${e}`)),l(t>=0&&t<=1,(()=>`Progress fraction must be in range [0, 1], but got endFraction ${t}`)),l(t>=e,(()=>`startFraction must be no more than endFraction, but got startFraction ${e} and endFraction ${t}`))}(n=null==n?0:n,r=null==r?1:r);let s=0;return Promise.all(e.map((a=>(a.then((a=>{const o=n+ ++s/e.length*(r-n);return t(o),a})),a))))}
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
 */async function fa(e,t){null==t&&(t={});const n=null==t.fetchFunc?q().platform.fetch:t.fetchFunc,r=e.map((e=>n(e,t.requestInit,{isBinary:!0}))),s=(null==t.onProgress?await Promise.all(r):await ma(r,t.onProgress,0,.5)).map((e=>e.arrayBuffer()));return null==t.onProgress?await Promise.all(s):await ma(s,t.onProgress,.5,1)}function ga(e){return async(t,n="",r)=>{const s=t.map((()=>!1)),a={},o=null!=r?r.map((()=>!1)):[],i=[];if(t.forEach(((e,t)=>{let n=0;e.weights.forEach((e=>{const u="quantization"in e?e.quantization.dtype:e.dtype,l=ys[u]*d(e.shape),c=()=>{s[t]=!0,null==a[t]&&(a[t]=[]),a[t].push({manifestEntry:e,groupOffset:n,sizeBytes:l})};null!=r?r.forEach(((t,n)=>{t===e.name&&(c(),o[n]=!0)})):c(),i.push(e.name),n+=l}))})),!o.every((e=>e))){const e=r.filter(((e,t)=>!o[t]));throw new Error(`Could not find weights in manifest with names: ${e.join(", ")}. \nManifest JSON has weights with names: ${i.join(", ")}.`)}const u=s.reduce(((e,t,n)=>(t&&e.push(n),e)),[]),l=[];u.forEach((e=>{t[e].paths.forEach((e=>{const t=n+(n.endsWith("/")?"":"/")+e;l.push(t)}))}));const c=await e(l),p={};let h=0;return u.forEach((e=>{const n=t[e].paths.length;let r=0;for(let e=0;e<n;e++)r+=c[h+e].byteLength;const s=new ArrayBuffer(r),o=new Uint8Array(s);let i=0;for(let e=0;e<n;e++){const t=new Uint8Array(c[h+e]);o.set(t,i),i+=t.byteLength}a[e].forEach((e=>{const t=ws(s.slice(e.groupOffset,e.groupOffset+e.sizeBytes),[e.manifestEntry]);for(const e in t)p[e]=t[e]})),h+=n})),p}}
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
 */Ms.registerSaveRouter((e=>q().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(ha.URL_SCHEME)?function(e="model"){return new ha(e)}(e.slice(ha.URL_SCHEME.length)):null));class ya{constructor(e,t){if(this.DEFAULT_METHOD="POST",null==t&&(t={}),this.weightPathPrefix=t.weightPathPrefix,this.onProgress=t.onProgress,this.weightUrlConverter=t.weightUrlConverter,null!=t.fetchFunc?(l("function"==typeof t.fetchFunc,(()=>"Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)")),this.fetch=t.fetchFunc):this.fetch=q().platform.fetch,l(null!=e&&e.length>0,(()=>"URL path for http must not be null, undefined or empty.")),Array.isArray(e)&&l(2===e.length,(()=>`URL paths for http must have a length of 2, (actual length is ${e.length}).`)),this.path=e,null!=t.requestInit&&null!=t.requestInit.body)throw new Error("requestInit is expected to have no pre-existing body, but has one.");this.requestInit=t.requestInit||{}}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");const t=Object.assign({method:this.DEFAULT_METHOD},this.requestInit);t.body=new FormData;const n=Ts(e,[{paths:["./model.weights.bin"],weights:e.weightSpecs}]);t.body.append("model.json",new Blob([JSON.stringify(n)],{type:"application/json"}),"model.json"),null!=e.weightData&&t.body.append("model.weights.bin",new Blob([e.weightData],{type:"application/octet-stream"}),"model.weights.bin");const r=await this.fetch(this.path,t);if(r.ok)return{modelArtifactsInfo:Is(e),responses:[r]};throw new Error(`BrowserHTTPRequest.save() failed due to HTTP response status ${r.status}.`)}async load(){const e=await this.fetch(this.path,this.requestInit);if(!e.ok)throw new Error(`Request to ${this.path} failed with status code ${e.status}. Please verify this URL points to the model JSON of the model to load.`);let t;try{t=await e.json()}catch(e){let t=`Failed to parse model JSON of response from ${this.path}.`;throw this.path.endsWith(".pb")?t+=" Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository.":t+=" Please make sure the server is serving valid JSON for this request.",new Error(t)}const n=t.modelTopology,r=t.weightsManifest;if(null==n&&null==r)throw new Error(`The JSON from HTTP path ${this.path} contains neither model topology or manifest for weights.`);return _s(t,(e=>this.loadWeights(e)))}async loadWeights(e){const t=Array.isArray(this.path)?this.path[1]:this.path,[n,r]=function(e){const t=e.lastIndexOf("/"),n=e.lastIndexOf("?"),r=e.substring(0,t),s=n>t?e.substring(n):"";return[r+"/",s]}(t),s=this.weightPathPrefix||n,a=As(e),o=[],i=[];for(const t of e)for(const e of t.paths)null!=this.weightUrlConverter?i.push(this.weightUrlConverter(e)):o.push(s+e+r);this.weightUrlConverter&&o.push(...await Promise.all(i));return[a,Ss(await fa(o,{requestInit:this.requestInit,fetchFunc:this.fetch,onProgress:this.onProgress}))]}}function ba(e){return null!=e.match(ya.URL_SCHEME_REGEX)}ya.URL_SCHEME_REGEX=/^https?:\/\//;const wa=(e,t)=>{if("undefined"==typeof fetch&&(null==t||null==t.fetchFunc))return null;{let n=!0;if(n=Array.isArray(e)?e.every((e=>ba(e))):ba(e),n)return xa(e,t)}return null};function xa(e,t){return new ya(e,t)}Ms.registerSaveRouter(wa),Ms.registerLoadRouter(wa);
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
class va{constructor(e){this.modelArtifacts=e}load(){return this.modelArtifacts}}class Na{constructor(e){this.saveHandler=e}save(e){return this.saveHandler(e)}}class Sa{constructor(e){e.load&&(this.load=()=>Promise.resolve(e.load())),e.save&&(this.save=t=>Promise.resolve(e.save(t)))}}function ka(e,t,n,r){if(1===arguments.length){return null!=e.modelTopology||null!=e.weightSpecs?new va(e):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new va({modelTopology:e}))}return console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new va({modelTopology:e,weightSpecs:t,weightData:n,trainingConfig:r})}
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
var Ta=Object.freeze({__proto__:null,browserFiles:function(e){return new da(e)},browserHTTPRequest:function(e,t){return xa(e,t)},concatenateArrayBuffers:Ss,copyModel:async function(e,t){return na(e,t,!1)},decodeWeights:ws,encodeWeights:async function(e,t){const n=[],r=[],s=Array.isArray(e)?e.map((e=>e.name)):Object.keys(e);for(let a=0;a<s.length;++a){const o=s[a],i=Array.isArray(e)?e[a].tensor:e[o];if("float32"!==i.dtype&&"int32"!==i.dtype&&"bool"!==i.dtype&&"string"!==i.dtype&&"complex64"!==i.dtype)throw new Error(`Unsupported dtype in weight '${o}': ${i.dtype}`);const u={name:o,shape:i.shape,dtype:i.dtype};if("string"===i.dtype){const e=new Promise((async e=>{const t=await i.bytes(),n=t.reduce(((e,t)=>e+t.length),0)+bs*t.length,r=new Uint8Array(n);let s=0;for(let e=0;e<t.length;e++){const n=t[e],a=new Uint8Array(new Uint32Array([n.length]).buffer);r.set(a,s),s+=bs,r.set(n,s),s+=n.length}e(r)}));r.push(e)}else r.push(i.data());null!=t&&(u.group=t),n.push(u)}return{data:xs(await Promise.all(r)),specs:n}},fromMemory:function(e,t,n,r){return new Sa(ka(...arguments))},fromMemorySync:ka,getLoadHandlers:(e,t)=>Ms.getLoadHandlers(e,t)
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
 */,getModelArtifactsForJSON:_s,getModelArtifactsForJSONSync:Es,getModelArtifactsInfoForJSON:Is,getSaveHandlers:e=>Ms.getSaveHandlers(e),getWeightSpecs:As,http:xa,isHTTPScheme:ba,listModels:async function(){const e=ea.getSchemes(),t={};for(const n of e){const e=await ea.getManager(n).listModels();for(const r in e){t[n+Ys+r]=e[r]}}return t},loadWeights:async function(e,t="",n,r){return ga((e=>fa(e,{requestInit:r})))(e,t,n)},moveModel:async function(e,t){return na(e,t,!0)},registerLoadRouter:e=>Ms.registerLoadRouter(e),registerSaveRouter:e=>Ms.registerSaveRouter(e),removeModel:async function(e){const t=ta(e);return ea.getManager(t.scheme).removeModel(t.path)},weightsLoaderFactory:ga,withSaveHandler:function(e){return new Na(e)},withSaveHandlerSync:function(e){return new Na(e)}});
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
 */const Ea=ds({matMul_:function(e,t,n=!1,r=!1){let s=cs(e,"a","matMul"),a=cs(t,"b","matMul");[s,a]=Gr(s,a);const o={a:s,b:a},i={transposeA:n,transposeB:r};return ts.runKernel(oe,o,i)}});
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
 */const _a=ds({oneHot_:function(e,t,n=1,r=0,s="int32"){if(t<2)throw new Error(`Error in oneHot: depth must be >=2, but it is ${t}`);const a={indices:cs(e,"indices","oneHot","int32")},o={dtype:s,depth:t,onValue:n,offValue:r};return ts.runKernel(xt,a,o)}});
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
 */function Ia(e,t){return ts.tidy(e,t)}function Aa(e){Hr(e).forEach((e=>e.dispose()))}function $a(e){return ts.keep(e)}const Ma=ds({imag_:
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
function(e){const t={input:cs(e,"input","imag")};return ts.runKernel(He,t)}});
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
 */const Oa=ds({neg_:function(e){const t={x:cs(e,"x","neg")};return ts.runKernel("Neg",t)}});
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
 */const Da=ds({real_:function(e){const t={input:cs(e,"input","real")};return ts.runKernel(It,t)}});
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
 */const Ra=ds({transpose_:function(e,t,n){const r=cs(e,"x","transpose");if(null==t&&(t=r.shape.map(((e,t)=>t)).reverse()),l(r.rank===t.length,(()=>`Error in transpose: rank of input ${r.rank} must match length of perm ${t}.`)),t.forEach((e=>{l(e>=0&&e<r.rank,(()=>"All entries in 'perm' must be between 0 and "+(r.rank-1)+` but got ${t}`))})),r.rank<=1)return r.clone();const s={x:r},a={perm:t};return"complex64"===r.dtype?Ia((()=>{let e=Da(r),t=Ma(r);return e=ts.runKernel(hn,{x:e},a),t=ts.runKernel(hn,{x:t},a),n&&(t=Oa(t)),ms(e,t)})):ts.runKernel(hn,s,a)}});
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
 */const Fa=ds({confusionMatrix_:function(e,t,n){const r=cs(e,"labels","confusionMatrix"),s=cs(t,"predictions","confusionMatrix");l(null==n||n>0&&Number.isInteger(n),(()=>`If provided, numClasses must be a positive integer, but got ${n}`)),l(1===r.rank,(()=>`Expected the rank of labels to be 1, but got ${r.rank}`)),l(1===s.rank,(()=>`Expected the rank of predictions to be 1, but got ${s.rank}`)),l(r.shape[0]===s.shape[0],(()=>`Mismatch in the number of examples: ${r.shape[0]} vs. ${s.shape[0]}. Labels and predictions should have the same number of elements.`)),l(n>0&&Number.isInteger(n),(()=>`numClasses is required to be a positive integer, but got ${n}`));const a=_a(ua(r,"int32"),n),o=_a(ua(s,"int32"),n),i=Ra(a),u=Ea(i,o);return ua(u,"int32")}});
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
 */var Ca=Object.freeze({__proto__:null,confusionMatrix:Fa});
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
 */function Ba(e,t){const n=e.length,r=[];for(let s=0;s<n;s++){const a=n-1-s,o=e[a]||1;(t[t.length-1-s]||1)>1&&1===o&&r.unshift(a)}return r}function La(e,t){const n=[];for(let r=0;r<t.length;r++){const s=e[e.length-r-1],a=t.length-r-1,o=t[a];(null==s||1===s&&o>1)&&n.unshift(a)}return n}function za(e,t){const n=[],r=Math.max(e.length,t.length);for(let s=0;s<r;s++){let r=e[e.length-s-1];null==r&&(r=1);let a=t[t.length-s-1];if(null==a&&(a=1),1===r)n.unshift(a);else if(1===a)n.unshift(r);else{if(r!==a){throw Error(`Operands could not be broadcast together with shapes ${e} and ${t}.`)}n.unshift(r)}}return n}var Pa=Object.freeze({__proto__:null,assertAndGetBroadcastShape:za,getBroadcastDims:Ba,getReductionAxes:La});
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
 */function Va(e,t,n){if(p(e),null!=t&&3!==t.length)throw new Error("tensor3d() requires shape to have three numbers");const r=is(e,n);if(3!==r.length&&1!==r.length)throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");if(1===r.length&&null==t)throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");return fs(e,t,r,n)}
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
 */let qa;function Wa(e,t=3){if(t>4)throw new Error("Cannot construct Tensor with more than 4 channels from pixels.");if(null==e)throw new Error("pixels passed to tf.browser.fromPixels() can not be null");let n=!1,r=!1,s=!1,a=!1,o=!1,i=!1;if(e.data instanceof Uint8Array)n=!0;else if("undefined"!=typeof ImageData&&e instanceof ImageData)r=!0;else if("undefined"!=typeof HTMLVideoElement&&e instanceof HTMLVideoElement)s=!0;else if("undefined"!=typeof HTMLImageElement&&e instanceof HTMLImageElement)a=!0;else if(null!=e.getContext)o=!0;else{if(!("undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap))throw new Error(`pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData in browser, or OffscreenCanvas, ImageData in webworker or {data: Uint32Array, width: number, height: number}, but was ${e.constructor.name}`);i=!0}if(null!=En(bn,ts.backendName)){const n={pixels:e},r={numChannels:t};return ts.runKernel(bn,n,r)}const[u,l]=s?[e.videoWidth,e.videoHeight]:[e.width,e.height];let c,p;if(o)c=e.getContext("2d").getImageData(0,0,u,l).data;else if(r||n)c=e.data;else if(a||s||i){if(null==qa)if("undefined"==typeof document){if("undefined"==typeof OffscreenCanvas||"undefined"==typeof OffscreenCanvasRenderingContext2D)throw new Error("Cannot parse input in current context. Reason: OffscreenCanvas Context2D rendering is not supported.");qa=new OffscreenCanvas(1,1).getContext("2d")}else qa=document.createElement("canvas").getContext("2d",{willReadFrequently:!0});qa.canvas.width=u,qa.canvas.height=l,qa.drawImage(e,0,0,u,l),c=qa.getImageData(0,0,u,l).data}if(4===t)p=new Int32Array(c);else{const e=u*l;p=new Int32Array(e*t);for(let n=0;n<e;n++)for(let e=0;e<t;++e)p[n*t+e]=c[4*n+e]}return Va(p,[l,u,t],"int32")}function Ua(e){return"undefined"!=typeof window&&"undefined"!=typeof ImageBitmap&&window.hasOwnProperty("createImageBitmap")&&!(e instanceof ImageBitmap)&&function(e){return null!=e&&0!==e.width&&0!==e.height}(e)&&!function(e){return null!=e&&e.data instanceof Uint8Array}(e)}const ja=ds({fromPixels_:Wa});var Ga=Object.freeze({__proto__:null,fromPixels:ja,fromPixelsAsync:async function(e,t=3){let n=null;if(q().getBool("WRAP_TO_IMAGEBITMAP")&&Ua(e)){let t;try{t=await createImageBitmap(e,{premultiplyAlpha:"none"})}catch(e){t=null}n=null!=t&&t.width===e.width&&t.height===e.height?t:e}else n=e;return Wa(n,t)},toPixels:async function(e,t){let n=cs(e,"img","toPixels");if(!(e instanceof Br)){const e=n;n=ua(e,"int32"),e.dispose()}if(2!==n.rank&&3!==n.rank)throw new Error(`toPixels only supports rank 2 or 3 tensors, got rank ${n.rank}.`);const[r,s]=n.shape.slice(0,2),a=2===n.rank?1:n.shape[2];if(a>4||2===a)throw new Error(`toPixels only supports depth of size 1, 3 or 4 but got ${a}`);if("float32"!==n.dtype&&"int32"!==n.dtype)throw new Error(`Unsupported type for toPixels: ${n.dtype}. Please use float32 or int32 tensors.`);const o=await n.data(),i="float32"===n.dtype?255:1,u=new Uint8ClampedArray(s*r*4);for(let e=0;e<r*s;++e){const t=[0,0,0,255];for(let r=0;r<a;r++){const s=o[e*a+r];if("float32"===n.dtype){if(s<0||s>1)throw new Error(`Tensor values for a float32 Tensor must be in the range [0 - 1] but encountered ${s}.`)}else if("int32"===n.dtype&&(s<0||s>255))throw new Error(`Tensor values for a int32 Tensor must be in the range [0 - 255] but encountered ${s}.`);1===a?(t[0]=s*i,t[1]=s*i,t[2]=s*i):t[r]=s*i}const r=4*e;u[r+0]=Math.round(t[0]),u[r+1]=Math.round(t[1]),u[r+2]=Math.round(t[2]),u[r+3]=Math.round(t[3])}if(null!=t){t.width=s,t.height=r;const e=t.getContext("2d"),n=new ImageData(u,s,r);e.putImageData(n,0,0)}return n!==e&&n.dispose(),u}});function Ka(e,t){const n=e.shape.length,r=t.shape.length;if(n<1)throw new Error(`tf.gatherND() expects the input to be rank 1 or higher, but the rank was ${n}.`);if(r<1)throw new Error(`tf.gatherND() expects the indices to be rank 1 or higher, but the rank was ${r}.`);if("int32"!==t.dtype)throw new Error(`tf.gatherND() expects the indices to be int32 type, but the dtype was ${t.dtype}.`);if(t.shape[r-1]>n)throw new Error(`index innermost dimension length must be <= tensor rank; saw: ${t.shape[r-1]} vs. ${n}`);if(0===d(e.shape))throw new Error(`Requested more than 0 entries, but input is empty. Input shape: ${e.shape}.`);const s=t.shape,a=s[s.length-1];let o=1;for(let e=0;e<s.length-1;++e)o*=s[e];const i=e.shape,u=s.slice();u.pop();let l=1;for(let e=a;e<n;++e)l*=i[e],u.push(i[e]);const c=[...O(e.shape).map((e=>e/l)),1].slice(0,a);return[u,o,l,c]}var Ha=Object.freeze({__proto__:null,prepareAndValidate:Ka});function Za(e,t,n){const r=t.rank>1?t.shape[t.rank-1]:1,s=t.rank>1?t.rank-1:1,a=`Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: ${n.shape}, indices.shape: ${t.shape}, shape: ${e}, sliceDim: ${r}, and batchDim: ${s}.`;if(n.rank<s)throw new Error(a+` update.rank < ${s}. `);if(e.length<r+(n.rank-s))throw new Error(a+` Output shape length < ${r+(n.rank-s)}`);if(n.rank!==s+e.length-r)throw new Error(a+" update.rank != "+(s+e.length-r));for(let e=0;e<s;++e)if(n.shape[e]!==t.shape[e])throw new Error(a+` updates.shape[${e}] (${n.shape[e]}) != indices.shape[${e}] (${t.shape[e]}).`);for(let t=0;t<n.rank-s;++t)if(n.shape[t+s]!==e[t+r])throw new Error(a+` updates.shape[${t+s}] (${n.shape[t+s]}) != shape[${t+s}] (${e[t+s]})`)}function Ja(e,t,n){if(t.rank<1)throw new Error(`tf.scatterND() expects the indices to be rank 1 or higher, but the rank was ${t.rank}.`);if(e.rank<1)throw new Error(`tf.scatterND() expects the updates to be rank 1 or higher, but the rank was ${e.rank}.`);if("int32"!==t.dtype)throw new Error(`The dtype of 'indices' should be int32, but got dtype: ${t.dtype}`);if(n.length<1)throw new Error(`Output rank must be greater or equal to 1, but got shape: ${n}`);if(0===n.length){if(0===t.size)throw new Error(`Indices specified for empty output. indices shape: ${t.shape}`);if(0===e.size)throw new Error(`Updates specified for empty output. updates shape: ${e.shape}`)}Za(n,t,e)}function Qa(e,t,n){const r=t.shape.length,s=r>1?t.shape[r-1]:1,a=n.length;let o=1;for(let e=s;e<a;++e)o*=n[e];const i=s<1?1:s;return{sliceRank:s,numUpdates:d(t.shape)/i,sliceSize:o,strides:[...O(n.slice(0,s)),1],outputSize:d(n)}}var Xa=Object.freeze({__proto__:null,calculateShapes:Qa,validateInput:Ja,validateUpdateShape:Za});
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
 */const Ya=-2,eo=-1;function to(e,t,n,r){const s=[...e];for(let e=s.length;e<r.length;e++)s.push(1);for(let e=0;e<n;e++)0===e?s[t]=1:(s.splice(t,0,1),s.pop());return s}function no(e,t,n){return n<=e?n:n-(t-1)}function ro(e,t){const n=[];for(let r=0;r<e;r++)n.push(t+r);return n}function so(e,t,n,r,s){const a=[...s],o=ro(n,t);for(let s=0;s<a.length;s++)if(o.indexOf(s)>-1)a[s]=0;else{const o=no(t,n,s);let i=r[o];e&1<<o&&(i=0),a[s]=i}return a}function ao(e,t,n,r,s){const a=[...s],o=ro(n,t);for(let s=0;s<a.length;s++)if(o.indexOf(s)>-1)a[s]=Number.MAX_SAFE_INTEGER;else{const o=no(t,n,s);let i=r[o];e&1<<o&&(i=Number.MAX_SAFE_INTEGER),a[s]=i}for(let e=0;e<a.length;e++){const t=s[e];a[e]<0&&(a[e]+=t),a[e]=i(0,a[e],s[e])}return a}function oo(e,t,n){let r=e[t];return(n&1<<t||null==r)&&(r=1),r}function io(e,t,n,r,s,a){let o=t[s];const u=n[s]||1;(e&1<<s||a&1<<s||null==o)&&(o=u>0?Number.MIN_SAFE_INTEGER:Number.MAX_SAFE_INTEGER);const l=r[s];return o<0&&(o+=l),o=i(0,o,l-1),o}function uo(e,t,n,r,s,a){let o=t[s];const u=n[s]||1;(e&1<<s||a&1<<s||null==o)&&(o=u>0?Number.MAX_SAFE_INTEGER:Number.MIN_SAFE_INTEGER);const l=r[s];return o<0&&(o+=l),o=u>0?i(0,o,l):i(-1,o,l-1),o}function lo(e,t,n,r,s,a){if(s[t])return n>0?a[t]:a[t+1&1];{const t=e<0?r+e:e;return t<a[0]?a[0]:t>a[1]?a[1]:t}}var co=Object.freeze({__proto__:null,assertParamsValid:function(e,t,n){const r=e.shape.length;l(r===t.length,(()=>`Error in slice${r}D: Length of begin ${t} must match the rank of the array (${r}).`)),l(r===n.length,(()=>`Error in slice${r}D: Length of size ${n} must match the rank of the array (${r}).`));for(let s=0;s<r;++s)l(t[s]+n[s]<=e.shape[s],(()=>`Error in slice${r}D: begin[${s}] + size[${s}] (${t[s]+n[s]}) would overflow input.shape[${s}] (${e.shape[s]})`))},computeFlatOffset:function(e,t){let n=e.length>0?e[e.length-1]:1;for(let r=0;r<e.length-1;r++)n+=e[r]*t[r];return n},computeOutShape:function(e,t,n){const r=[];for(let s=0;s<e.length;s++)r[s]=Math.ceil((t[s]-e[s])/n[s]);return r},getNormalizedAxes:function(e,t,n,r,s,a,o,i,u){const l=e.length;let c=new Array(l),p=new Array(l),h=new Array(l);if(t.length&&n>0){const u=t[0],l=n+1;c=so(o,u,l,r,e),p=ao(i,u,l,s,e),h=to(a,u,l,e)}else for(let t=0;t<l;t++)c[t]=io(o,r,a,e,t,u),p[t]=uo(i,s,a,e,t,u),h[t]=oo(a,t,u);return{begin:c,end:p,strides:h}},isSliceContinous:function(e,t,n){let r=n.length;for(let e=0;e<n.length;e++)if(n[e]>1){r=e;break}for(let s=r+1;s<n.length;s++)if(t[s]>0||n[s]!==e[s])return!1;return!0},maskToAxes:function(e){const t=[];let n=0;for(;e>0;)1&e&&t.push(n),e/=2,n++;return t},parseSliceParams:function(e,t,n){let r;const s=e.shape.length;let a;return r="number"==typeof t?[t,...new Array(s-1).fill(0)]:t.length<s?t.concat(new Array(s-t.length).fill(0)):t.slice(),r.forEach((e=>{l(-1!==e,(()=>"slice() does not support negative begin indexing."))})),a=null==n?new Array(s).fill(-1):"number"==typeof n?[n,...new Array(s-1).fill(-1)]:n.length<s?n.concat(new Array(s-n.length).fill(-1)):n,a=a.map(((t,n)=>t>=0?t:(l(-1===t,(()=>`Negative size values should be exactly -1 but got ${t} for the slice() size at index ${n}.`)),e.shape[n]-r[n]))),[r,a]},sliceInfo:function(e,t,n,r,s,a,o,i,u){let l;if(null==r?(l=new Array(t.length),l.fill(1)):l=r,null!=o&&o&o-1)throw new Error("Multiple ellipses in slice is not allowed.");let c=!1;const p={dims:l.length,numAddAxisAfterEllipsis:0,begin:t.slice(),end:n.slice(),strides:l.slice(),beginMask:s,endMask:a,ellipsisMask:o,newAxisMask:i,shrinkAxisMask:u};for(let e=0;e<p.dims;e++)c&&1<<e&i&&p.numAddAxisAfterEllipsis++,1<<e&o&&(c=!0);c||(p.ellipsisMask|=1<<p.dims,p.dims++);const h={dims:e.length,beginMask:0,endMask:0,beginValid:!1,endValid:!1};!function(e,t){t.beginMask=0,t.endMask=0,t.shrinkAxisMask=0;let n=0;t.beginValid=null!=e.begin,t.endValid=null!=e.end,t.begin=new Array(t.dims),t.end=new Array(t.dims),t.strides=new Array(t.dims),t.finalShapeGatherIndices=[],t.finalShapeGatherIndicesSparse=[],t.inputShapeGatherIndicesSparse=new Array(t.dims);for(let r=0;r<e.dims;r++)if(1<<r&e.ellipsisMask){const s=Math.min(t.dims-(e.dims-r)+1+e.numAddAxisAfterEllipsis,t.dims);for(;n<s;n++)t.begin[n]=0,t.end[n]=0,t.strides[n]=1,t.beginMask|=1<<n,t.endMask|=1<<n,t.finalShapeGatherIndices.push(n),t.finalShapeGatherIndicesSparse.push(-1),t.inputShapeGatherIndicesSparse[n]=r}else if(1<<r&e.newAxisMask)t.finalShapeGatherIndices.push(Ya),t.finalShapeGatherIndicesSparse.push(-1);else{if(n===t.begin.length)throw Error(`Index out of range using input dim ${n}; input has only ${t.dims} dims, ${t.begin.length}.`);null!=e.begin&&(t.begin[n]=e.begin[r]),null!=e.end&&(t.end[n]=e.end[r]),t.strides[n]=e.strides[r],e.beginMask&1<<r&&(t.beginMask|=1<<n),e.endMask&1<<r&&(t.endMask|=1<<n),e.shrinkAxisMask&1<<r?(t.finalShapeGatherIndices.push(eo),t.finalShapeGatherIndicesSparse.push(-1),t.shrinkAxisMask|=1<<n):(t.finalShapeGatherIndices.push(n),t.finalShapeGatherIndicesSparse.push(r)),t.inputShapeGatherIndicesSparse[n]=r,n++}}(p,h);let d=!0,m=!0,f=!0;const g=[],y=[];for(let t=0;t<e.length;++t){if(0===h.strides[t])throw Error(`strides[${t}] must be non-zero`);const n=!!(h.shrinkAxisMask&1<<t),r=e[t];if(-1===r){g.push(n?1:-1);continue}const s=[h.beginMask&1<<t,h.endMask&1<<t],a=[h.strides[t]>0?0:-1,h.strides[t]>0?r:r-1];if(n&&h.strides[t]<=0)throw Error("only stride 1 allowed on non-range indexing.");f=f&&1===h.strides[t];const o=!!(h.beginMask&1<<t&&h.endMask&1<<t);if(h.beginValid&&h.endValid){if(n){const e=h.begin[t]<0?r+h.begin[t]:h.begin[t];if(h.begin[t]=e,h.end[t]=h.begin[t]+1,e<0||e>=r)throw Error(`slice index ${h.begin[t]} of dimension ${t} out of bounds.`)}else h.begin[t]=lo(h.begin[t],0,h.strides[t],r,s,a),h.end[t]=lo(h.end[t],1,h.strides[t],r,s,a);const e=1===h.strides[t]&&0===h.begin[t]&&h.end[t]===r;d=d&&e,m=m&&(0===t&&1===h.strides[t]||e)}else d=d&&1===h.strides[t]&&o,m=m&&(0===t&&1===h.strides[t]||o);let i,u=!1;if(h.beginValid&&h.endValid?(i=h.end[t]-h.begin[t],u=!0):n?(i=1,u=!0):o&&r>=0&&(i=h.strides[t]<0?-r:r,u=!0),u){let e;e=0===i||i<0!=h.strides[t]<0?0:Math.trunc(i/h.strides[t])+(i%h.strides[t]!=0?1:0),g.push(e)}else g.push(-1)}for(let e=0;e<h.finalShapeGatherIndices.length;++e){const t=h.finalShapeGatherIndices[e];t>=0?y.push(g[t]):t===Ya&&y.push(1)}return{finalShapeSparse:y.filter(((e,t)=>h.finalShapeGatherIndices[t]!==Ya)),finalShape:y,isIdentity:d,sliceDim0:m,isSimpleSlice:f,begin:h.begin,end:h.end,strides:h.strides}},startForAxis:io,startIndicesWithElidedDims:so,stopForAxis:uo,stopIndicesWithElidedDims:ao,stridesForAxis:oo,stridesWithElidedDims:to});
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
 */class po{getClassName(){return this.constructor.className}static fromConfig(e,t){return new e(t)}}class ho{constructor(){this.classNameMap={}}static getMap(){return null==ho.instance&&(ho.instance=new ho),ho.instance}static register(e){ho.getMap().classNameMap[e.className]=[e,e.fromConfig]}}function mo(e){l(null!=e.className,(()=>"Class being registered does not have the static className property defined.")),l("string"==typeof e.className,(()=>"className is required to be a string, but got type "+typeof e.className)),l(e.className.length>0,(()=>"Class being registered has an empty-string as its className, which is disallowed.")),ho.register(e)}var fo=Object.freeze({__proto__:null,Serializable:po,SerializationMap:ho,registerClass:mo});
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
 */const go=.001,yo=.1;function bo(){return 32===ts.backend.floatPrecision()?go:yo}function wo(e,t,n){let r=!0;if((S(e)||S(t))&&(r=!1),S(e)&&S(t)&&(r=!0),r){const n=e.constructor.name,r=t.constructor.name;if(n!==r)throw new Error(`Arrays are of different type. Actual: ${n}. Expected: ${r}`)}if(Array.isArray(e)&&Array.isArray(t)){const n=is(e),r=is(t);if(!m(n,r))throw new Error(`Arrays have different shapes. Actual: [${n}]. Expected: [${r}]`)}const s=S(e)?e:h(e),a=S(t)?t:h(t);if(s.length!==a.length)throw new Error(`Arrays have different lengths actual: ${s.length} vs expected: ${a.length}.\nActual:   ${s}.\nExpected: ${a}.`);for(let e=0;e<a.length;++e){const t=s[e],r=a[e];if(!n(t,r))throw new Error(`Arrays differ: actual[${e}] = ${t}, expected[${e}] = ${r}.\nActual:   ${s}.\nExpected: ${a}.`)}"undefined"!=typeof expect&&expect().nothing()}function xo(e,t,n){return!isFinite(e)&&!isFinite(t)||!(isNaN(e)||isNaN(t)||Math.abs(e-t)>n)}var vo=Object.freeze({__proto__:null,TEST_EPSILON_FLOAT16:yo,createVideoElement:function(e){const t=document.createElement("video");return"playsInline"in t&&(t.playsInline=!0),t.muted=!0,t.loop=!0,t.style.position="fixed",t.style.left="0px",t.style.top="0px",t.preload="auto",t.appendChild(e),new Promise((e=>{t.addEventListener("loadeddata",(n=>e(t))),t.load()}))},encodeStrings:function e(t){for(let n=0;n<t.length;n++){const r=t[n];Array.isArray(r)?e(r):t[n]=xr(r)}return t},expectArrayBuffersEqual:function(e,t){const n=new Float32Array(e),r=new Float32Array(t);if(n.length!==r.length)throw new Error(`Expected ArrayBuffer to be of length ${r.length}, but it was ${n.length}`);for(let e=0;e<r.length;e++)if(n[e]!==r[e])throw new Error(`Expected ArrayBuffer value at ${e} to be ${r[e]} but got ${n[e]} instead`)},expectArraysClose:function(e,t,n){return null==n&&(n=bo()),wo(e,t,((e,t)=>xo(e,t,n)))},expectArraysEqual:function(e,t){const n="string"==typeof t||"number"==typeof t||"boolean"==typeof t?[t]:t;return E(e)||E(e[0])||E(t)||E(t[0])?wo(e,n,((e,t)=>e==t)):wo(e,t,((e,t)=>xo(e,t,0)))},expectNumbersClose:function(e,t,n){if(null==n&&(n=bo()),!xo(e,t,n))throw new Error(`Numbers differ: actual === ${e}, expected === ${t}`);"undefined"!=typeof expect&&expect().nothing()},expectPromiseToFail:function(e,t){e().then((()=>t.fail()),(()=>t())),"undefined"!=typeof expect&&expect().nothing()},expectValuesInRange:function(e,t,n){for(let r=0;r<e.length;r++)if(e[r]<t||e[r]>n)throw new Error(`Value out of range:${e[r]} low: ${t}, high: ${n}`)},play:async function(e){await e.play(),"requestVideoFrameCallback"in e&&await new Promise((t=>{e.requestVideoFrameCallback(t)}))},testEpsilon:bo});/** @license See the LICENSE file. */const No=ds({add_:
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
function(e,t){let n=cs(e,"a","add"),r=cs(t,"b","add");[n,r]=Gr(n,r);const s={a:n,b:r};return ts.runKernel(Z,s)}});
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
 */const So=ds({floorDiv_:function(e,t){let n=cs(e,"a","floorDiv"),r=cs(t,"b","floorDiv");[n,r]=Gr(n,r);const s={a:n,b:r};return ts.runKernel(Pe,s)}});
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
 */const ko=ds({div_:function(e,t){let n=cs(e,"a","div"),r=cs(t,"b","div");if([n,r]=Gr(n,r),"int32"===n.dtype&&"int32"===r.dtype)return So(n,r);const s={a:n,b:r};return ts.runKernel(Oe,s,{})}});
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
 */const To=ds({mul_:function(e,t){let n=cs(e,"a","mul"),r=cs(t,"b","mul");[n,r]=Gr(n,r);const s={a:n,b:r};return ts.runKernel(mt,s)}});
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
 */const Eo=ds({abs_:function(e){const t=cs(e,"x","abs");if("complex64"===t.dtype){const e={x:t};return ts.runKernel(me,e)}{const e={x:t};return ts.runKernel("Abs",e)}}});
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
 */const _o=ds({acos_:function(e){const t={x:cs(e,"x","acos")};return ts.runKernel(K,t)}});
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
 */const Io=ds({acosh_:function(e){const t={x:cs(e,"x","acosh")};return ts.runKernel(H,t)}});
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
 */const Ao=ds({addN_:function(e){l(Array.isArray(e),(()=>"The argument passed to tf.addN() must be a list of tensors")),l(e.length>=1,(()=>`Must pass at least one tensor to tf.addN(), but got ${e.length}`));const t=e.map(((e,t)=>cs(e,`tensors${t}`,"addN"))),n=t[0];t.forEach((e=>{if(e.dtype!==n.dtype)throw new Error("All tensors passed to tf.addN() must have the same dtype")})),t.forEach((e=>{if(!m(e.shape,n.shape))throw new Error("All tensors passed to tf.addN() must have the same shape")}));const r=t;return ts.runKernel(J,r)}});
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
 */const $o=ds({all_:function(e,t=null,n=!1){const r={x:cs(e,"x","all","bool")},s={axis:t,keepDims:n};return ts.runKernel("All",r,s)}});
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
 */const Mo=ds({any_:function(e,t=null,n=!1){const r={x:cs(e,"x","any","bool")},s={axis:t,keepDims:n};return ts.runKernel("Any",r,s)}});
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
 */const Oo=ds({argMax_:function(e,t=0){const n={x:cs(e,"x","argMax")},r={axis:t};return ts.runKernel(Q,n,r)}});
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
 */const Do=ds({argMin_:function(e,t=0){const n={x:cs(e,"x","argMin")},r={axis:t};return ts.runKernel(X,n,r)}});
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
 */const Ro=ds({asin_:function(e){const t={x:cs(e,"x","asin")};return ts.runKernel(Y,t)}});
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
 */const Fo=ds({asinh_:function(e){const t={x:cs(e,"x","asinh")};return ts.runKernel(ee,t)}});
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
 */const Co=ds({atan_:function(e){const t={x:cs(e,"x","atan")};return ts.runKernel(te,t)}});
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
 */const Bo=ds({atan2_:function(e,t){let n=cs(e,"a","atan2"),r=cs(t,"b","atan2");[n,r]=Gr(n,r);const s={a:n,b:r};return ts.runKernel(re,s)}});
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
 */const Lo=ds({atanh_:function(e){const t={x:cs(e,"x","atanh")};return ts.runKernel(ne,t)}});
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
 */function zo(e,t,n,r,s,a,o="channelsLast"){const[i,u]=Wo(t);let l;if("channelsLast"===o)l=[i,u,e[3],e[3]];else{if("channelsFirst"!==o)throw new Error(`Unknown dataFormat ${o}`);l=[i,u,e[1],e[1]]}return Po(e,l,n,r,s,a,!1,o)}function Po(e,t,n,r,s,a,o=!1,i="channelsLast"){let[u,l,c,p]=[-1,-1,-1,-1];if("channelsLast"===i)[u,l,c,p]=e;else{if("channelsFirst"!==i)throw new Error(`Unknown dataFormat ${i}`);[u,p,l,c]=e}const[h,d,,m]=t,[f,g]=Wo(n),[y,b]=Wo(r),w=jo(h,y),x=jo(d,b),{padInfo:v,outHeight:N,outWidth:S}=function(e,t,n,r,s,a,o,i,u){let l,c,p;if("number"==typeof e){l={top:e,bottom:e,left:e,right:e,type:0===e?"VALID":"NUMBER"};const s=function(e,t,n,r,s){null==r&&(r=qo(e,t,n));const a=e[0],o=e[1],i=Go((a-t+2*r)/n+1,s),u=Go((o-t+2*r)/n+1,s);return[i,u]}([t,n],a,r,e,i);c=s[0],p=s[1]}else if("same"===e){c=Math.ceil(t/r),p=Math.ceil(n/s);const e=Math.max(0,(c-1)*r+a-t),i=Math.max(0,(p-1)*s+o-n),u=Math.floor(e/2),h=e-u,d=Math.floor(i/2);l={top:u,bottom:h,left:d,right:i-d,type:"SAME"}}else if("valid"===e)l={top:0,bottom:0,left:0,right:0,type:"VALID"},c=Math.ceil((t-a+1)/r),p=Math.ceil((n-o+1)/s);else{if("object"!=typeof e)throw Error(`Unknown padding parameter: ${e}`);{const h="channelsLast"===u?e[1][0]:e[2][0],d="channelsLast"===u?e[1][1]:e[2][1],m="channelsLast"===u?e[2][0]:e[3][0],f="channelsLast"===u?e[2][1]:e[3][1];l={top:h,bottom:d,left:m,right:f,type:0===h&&0===d&&0===m&&0===f?"VALID":"EXPLICIT"},c=Go((t-a+h+d)/r+1,i),p=Go((n-o+m+f)/s+1,i)}}return{padInfo:l,outHeight:c,outWidth:p}}(s,l,c,f,g,w,x,a,i),k=o?m*p:m;let T;return"channelsFirst"===i?T=[u,k,N,S]:"channelsLast"===i&&(T=[u,N,S,k]),{batchSize:u,dataFormat:i,inHeight:l,inWidth:c,inChannels:p,outHeight:N,outWidth:S,outChannels:k,padInfo:v,strideHeight:f,strideWidth:g,filterHeight:h,filterWidth:d,effectiveFilterHeight:w,effectiveFilterWidth:x,dilationHeight:y,dilationWidth:b,inShape:e,outShape:T,filterShape:t}}function Vo(e,t,n,r,s,a=!1,o="channelsLast",i){let[u,l,c,p,h]=[-1,-1,-1,-1,-1];if("channelsLast"===o)[u,l,c,p,h]=e;else{if("channelsFirst"!==o)throw new Error(`Unknown dataFormat ${o}`);[u,h,l,c,p]=e}const[d,m,f,,g]=t,[y,b,w]=Uo(n),[x,v,N]=Uo(r),S=jo(d,x),k=jo(m,v),T=jo(f,N),{padInfo:E,outDepth:_,outHeight:I,outWidth:A}=function(e,t,n,r,s,a,o,i,u,l,c){let p,h,d,m;if("number"==typeof e){p={top:e,bottom:e,left:e,right:e,front:e,back:e,type:0===e?"VALID":"NUMBER"};const a=function(e,t,n,r,s,a){null==s&&(s=qo(e,t,r));const o=e[0],i=e[1],u=e[2],l=Go((o-t+2*s)/r+1,a),c=Go((i-t+2*s)/r+1,a),p=Go((u-t+2*s)/r+1,a);return[l,c,p,n]}([t,n,r,1],i,1,s,e,c);h=a[0],d=a[1],m=a[2]}else if("same"===e){h=Math.ceil(t/s),d=Math.ceil(n/a),m=Math.ceil(r/o);const e=(h-1)*s+i-t,c=(d-1)*a+u-n,f=(m-1)*o+l-r,g=Math.floor(e/2),y=e-g,b=Math.floor(c/2),w=c-b,x=Math.floor(f/2);p={top:b,bottom:w,left:x,right:f-x,front:g,back:y,type:"SAME"}}else{if("valid"!==e)throw Error(`Unknown padding parameter: ${e}`);p={top:0,bottom:0,left:0,right:0,front:0,back:0,type:"VALID"},h=Math.ceil((t-i+1)/s),d=Math.ceil((n-u+1)/a),m=Math.ceil((r-l+1)/o)}return{padInfo:p,outDepth:h,outHeight:d,outWidth:m}}(s,l,c,p,y,b,w,S,k,T,i),$=a?g*h:g;let M;return"channelsFirst"===o?M=[u,$,_,I,A]:"channelsLast"===o&&(M=[u,_,I,A,$]),{batchSize:u,dataFormat:o,inDepth:l,inHeight:c,inWidth:p,inChannels:h,outDepth:_,outHeight:I,outWidth:A,outChannels:$,padInfo:E,strideDepth:y,strideHeight:b,strideWidth:w,filterDepth:d,filterHeight:m,filterWidth:f,effectiveFilterDepth:S,effectiveFilterHeight:k,effectiveFilterWidth:T,dilationDepth:x,dilationHeight:v,dilationWidth:N,inShape:e,outShape:M,filterShape:t}}function qo(e,t,n,r=1){const s=jo(t,r);return Math.floor((e[0]*(n-1)-n+s)/2)}function Wo(e){return"number"==typeof e?[e,e,e]:2===e.length?[e[0],e[1],1]:e}function Uo(e){return"number"==typeof e?[e,e,e]:e}function jo(e,t){return t<=1?e:e+(e-1)*(t-1)}function Go(e,t){if(!t)return Math.trunc(e);switch(t){case"round":return Math.round(e);case"ceil":return Math.ceil(e);case"floor":return Math.floor(e);default:throw new Error(`Unknown roundingMode ${t}`)}}function Ko(e){const[t,n,r]=Wo(e);return 1===t&&1===n&&1===r}function Ho(e,t){return Ko(e)||Ko(t)}function Zo(e){if("NHWC"===e)return"channelsLast";if("NCHW"===e)return"channelsFirst";throw new Error(`Unknown dataFormat ${e}`)}function Jo(e,t,n){if(null!=n){if("string"==typeof t)throw Error(`Error in ${e}: pad must be an integer when using dimRoundingMode ${n} but got pad ${t}.`);if("number"==typeof t)l(f(t),(()=>`Error in ${e}: pad must be an integer when using dimRoundingMode ${n} but got pad ${t}.`));else{if("object"!=typeof t)throw Error(`Error in ${e}: Unknown padding parameter: ${t}`);t.forEach((t=>{t.forEach((t=>{l(f(t),(()=>`Error in ${e}: pad must be an integer when using dimRoundingMode ${n} but got pad ${t}.`))}))}))}}}
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
 */const Qo=ds({reshape_:function(e,t){const n={x:cs(e,"x","reshape","string_or_numeric")},r={shape:t};return ts.runKernel(Mt,n,r)}});
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
 */const Xo=ds({avgPool_:function(e,t,n,r,s){const a=cs(e,"x","avgPool","float32");l(Ho(n,1),(()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${n} and dilations '1'`));let o=a,i=!1;3===a.rank&&(i=!0,o=Qo(a,[1,a.shape[0],a.shape[1],a.shape[2]])),l(4===o.rank,(()=>`Error in avgPool: x must be rank 4 but got rank ${o.rank}.`)),Jo("avgPool",r,s);const u={x:o},c={filterSize:t,strides:n,pad:r,dimRoundingMode:s};let p=ts.runKernel(se,u,c);return p=ua(p,a.dtype),i?Qo(p,[p.shape[1],p.shape[2],p.shape[3]]):p}});
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
 */const Yo=ds({avgPool3d_:function(e,t,n,r,s,a="NDHWC"){const o=cs(e,"x","avgPool3d","float32");let i=o,u=!1;4===o.rank&&(u=!0,i=Qo(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),l(5===i.rank,(()=>`Error in avgPool3d: x must be rank 5 but got rank ${i.rank}.`)),l("NDHWC"===a,(()=>`Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of ${a}`)),Jo("avgPool3d",r,s);const c={x:i},p={filterSize:t,strides:n,pad:r,dimRoundingMode:s,dataFormat:a};let h=ts.runKernel(ae,c,p);return h=ua(h,i.dtype),u?Qo(h,[h.shape[1],h.shape[2],h.shape[3],h.shape[4]]):h}});
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
 */const ei=ds({concat_:function(e,t=0){l(e.length>=1,(()=>"Pass at least one tensor to concat"));const n=ps(e,"tensors","concat","string_or_numeric");if("complex64"===n[0].dtype&&n.forEach((e=>{if("complex64"!==e.dtype)throw new Error(`Cannot concatenate complex64 tensors with a tensor\n          with dtype ${e.dtype}. `)})),1===n.length)return la(n[0]);const r=n,s={axis:t};return ts.runKernel(fe,r,s)}});
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
 */const ti=ds({sigmoid_:function(e){const t={x:cs(e,"x","sigmoid","float32")};return ts.runKernel(jt,t)}});
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
 */const ni=ds({slice_:function(e,t,n){const r=cs(e,"x","slice","string_or_numeric");if(0===r.rank)throw new Error("Slicing scalar is not possible");const s={x:r},a={begin:t,size:n};return ts.runKernel(qt,s,a)}});
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
 */const ri=ds({tanh_:function(e){const t={x:cs(e,"x","tanh","float32")};return ts.runKernel(un,t)}});
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
 */const si=ds({basicLSTMCell_:function(e,t,n,r,s,a){const o=cs(e,"forgetBias","basicLSTMCell"),i=cs(t,"lstmKernel","basicLSTMCell"),u=cs(n,"lstmBias","basicLSTMCell"),l=cs(r,"data","basicLSTMCell"),c=cs(s,"c","basicLSTMCell"),p=cs(a,"h","basicLSTMCell"),h=ei([l,p],1),d=Ea(h,i),m=No(d,u),f=m.shape[0],g=m.shape[1]/4,y=[f,g],b=ni(m,[0,0],y),w=ni(m,[0,g],y),x=ni(m,[0,2*g],y),v=ni(m,[0,3*g],y),N=No(To(ti(b),ri(w)),To(c,ti(No(o,x))));return[N,To(ri(N),ti(v))]}});
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
 */const ai=ds({batchToSpaceND_:function(e,t,n){const r=cs(e,"x","batchToSpaceND"),s=t.reduce(((e,t)=>e*t));l(r.rank>=1+t.length,(()=>`input rank is ${r.rank} but should be > than blockShape.length ${t.length}`)),l(n.length===t.length,(()=>`crops.length is ${n.length} but should be equal to blockShape.length  ${t.length}`)),l(r.shape[0]%s==0,(()=>`input tensor batch is ${r.shape[0]} but is not divisible by the product of the elements of blockShape ${t.join(" * ")} === ${s}`));const a={x:r},o={blockShape:t,crops:n};return ts.runKernel(ie,a,o)}});const oi=ds({batchNorm_:
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
function(e,t,n,r,s,a){null==a&&(a=.001);const o=cs(e,"x","batchNorm"),i=cs(t,"mean","batchNorm"),u=cs(n,"variance","batchNorm");let c,p;null!=s&&(c=cs(s,"scale","batchNorm")),null!=r&&(p=cs(r,"offset","batchNorm")),l(i.rank===u.rank,(()=>"Batch normalization gradient requires mean and variance to have equal ranks.")),l(null==p||i.rank===p.rank,(()=>"Batch normalization gradient requires mean and offset to have equal ranks.")),l(null==c||i.rank===c.rank,(()=>"Batch normalization gradient requires mean and scale to have equal ranks."));const h={x:function(e){let t;return t=0===e.rank||1===e.rank?Qo(e,[1,1,1,e.size]):2===e.rank?Qo(e,[1,1,e.shape[0],e.shape[1]]):3===e.rank?Qo(e,[1,e.shape[0],e.shape[1],e.shape[2]]):e,t}(o),scale:c,offset:p,mean:i,variance:u},d={varianceEpsilon:a},m=ts.runKernel(Ve,h,d);return Qo(m,o.shape)}});const ii=ds({batchNorm2d_:function(e,t,n,r,s,a){const o=cs(e,"x","batchNorm"),i=cs(t,"mean","batchNorm"),u=cs(n,"variance","batchNorm");let c,p;return null!=s&&(c=cs(s,"scale","batchNorm")),null!=r&&(p=cs(r,"offset","batchNorm")),l(2===o.rank,(()=>`Error in batchNorm2D: x must be rank 2 but got rank ${o.rank}.`)),l(2===i.rank||1===i.rank,(()=>`Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank ${i.rank}.`)),l(2===u.rank||1===u.rank,(()=>`Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank ${u.rank}.`)),null!=c&&l(2===c.rank||1===c.rank,(()=>`Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank ${c.rank}.`)),null!=p&&l(2===p.rank||1===p.rank,(()=>`Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank ${p.rank}.`)),oi(o,i,u,p,c,a)}});const ui=ds({batchNorm3d_:function(e,t,n,r,s,a){const o=cs(e,"x","batchNorm"),i=cs(t,"mean","batchNorm"),u=cs(n,"variance","batchNorm");let c,p;return null!=s&&(c=cs(s,"scale","batchNorm")),null!=r&&(p=cs(r,"offset","batchNorm")),l(3===o.rank,(()=>`Error in batchNorm3D: x must be rank 3 but got rank ${o.rank}.`)),l(3===i.rank||1===i.rank,(()=>`Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank ${i.rank}.`)),l(3===u.rank||1===u.rank,(()=>`Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank ${u.rank}.`)),null!=c&&l(3===c.rank||1===c.rank,(()=>`Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank ${c.rank}.`)),null!=p&&l(3===p.rank||1===p.rank,(()=>`Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank ${p.rank}.`)),oi(o,i,u,p,c,a)}});const li=ds({batchNorm4d_:function(e,t,n,r,s,a){const o=cs(e,"x","batchNorm"),i=cs(t,"mean","batchNorm"),u=cs(n,"variance","batchNorm");let c,p;return null!=s&&(c=cs(s,"scale","batchNorm")),null!=r&&(p=cs(r,"offset","batchNorm")),l(4===o.rank,(()=>`Error in batchNorm4D: x must be rank 4 but got rank ${o.rank}.`)),l(4===i.rank||1===i.rank,(()=>`Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank ${i.rank}.`)),l(4===u.rank||1===u.rank,(()=>`Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank ${u.rank}.`)),null!=c&&l(4===c.rank||1===c.rank,(()=>`Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank ${c.rank}.`)),null!=p&&l(4===p.rank||1===p.rank,(()=>`Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank ${p.rank}.`)),oi(o,i,u,p,c,a)}});
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
 */const ci=ds({bincount_:function(e,t,n){const r=cs(e,"x","bincount"),s=cs(t,"weights","bincount");l("int32"===r.dtype,(()=>`Error in bincount: input dtype must be int32, but got ${r.dtype}`)),l(n>=0,(()=>`size must be non-negative, but got ${n}.`)),l(s.size===r.size||0===s.size,(()=>`Error in bincount: weights must have the same size as input or0-length, but got input shape: ${r.shape}, weights shape: ${s.shape}.`));const a={x:r,weights:s},o={size:n};return ts.runKernel(ue,a,o)}});
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
 */const pi=ds({broadcastArgs_:function(e,t){const n=cs(e,"s0","broadcastArgs","int32"),r=cs(t,"s1","broadcastArgs","int32");if(1!==n.rank)throw new Error(`broadcastArgs(): first input must be a vector (rank=1). Has rank ${n.rank}`);if(1!==r.rank)throw new Error(`broadcastArgs(): second input must be a vector (rank=1). Has rank ${r.rank}`);const s={s0:n,s1:r};return ts.runKernel(le,s)}});
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
 */const hi=ds({broadcastTo_:function(e,t){let n=cs(e,"broadcastTo","x");const r=n.shape;if(t.some((e=>!(e>0)||e%1!=0)))throw new Error(`broadcastTo(): Invalid broadcast shape [${t}].`);if(t.length<n.rank)throw new Error(`broadcastTo(): shape.length=${t.length} < input.rank=${n.rank}.`);if(t.length>n.rank){const e=n.shape.slice();for(;e.length<t.length;)e.unshift(1);n=Qo(n,e)}const s=n.shape,a=Array.from(t);for(let e=t.length-1;e>=0;e--)if(s[e]===t[e])a[e]=1;else if(1!==n.shape[e])throw new Error(`broadcastTo(): [${r}] cannot be broadcast to [${t}].`);if(0===a.map(((e,t)=>e>1?t:-1)).filter((e=>e>=0)).length)return la(n);const o={x:n},i={reps:a};return ts.runKernel(ln,o,i)}});
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
 */const di=ds({ceil_:function(e){const t={x:cs(e,"x","ceil","float32")};return ts.runKernel(pe,t)}});
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
 */function mi(e,t,n){const r={shape:e,value:t,dtype:n};return ts.runKernel(Be,{},r)}
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
 */const fi=ds({clipByValue_:function(e,t,n){const r=cs(e,"x","clipByValue");if(l(t<=n,(()=>`Error in clip: min (${t}) must be less than or equal to max (${n}).`)),t===n)return mi(r.shape,t,r.dtype);const s={x:r},a={clipValueMin:t,clipValueMax:n};return ts.runKernel(he,s,a)}});const gi=ds({concat1d_:function(e){return ei(e,0)}});const yi=ds({concat2d_:function(e,t){return ei(e,t)}});const bi=ds({concat3d_:function(e,t){return ei(e,t)}});const wi=ds({concat4d_:function(e,t){return ei(e,t)}});
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
 */const xi=ds({conv2d_:function(e,t,n,r,s="NHWC",a=[1,1],o){const i=cs(e,"x","conv2d","float32"),u=cs(t,"filter","conv2d","float32");let c=i,p=!1;3===i.rank&&(p=!0,c=Qo(i,[1,i.shape[0],i.shape[1],i.shape[2]])),l(4===c.rank,(()=>`Error in conv2d: input must be rank 4, but got rank ${c.rank}.`)),l(4===u.rank,(()=>`Error in conv2d: filter must be rank 4, but got rank ${u.rank}.`)),Jo("conv2d",r,o);const h="NHWC"===s?c.shape[3]:c.shape[1];l(h===u.shape[2],(()=>`Error in conv2d: depth of input (${h}) must match input depth for filter ${u.shape[2]}.`)),l(Ho(n,a),(()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`));const d={x:c,filter:u},m={strides:n,pad:r,dataFormat:s,dilations:a,dimRoundingMode:o},f=ts.runKernel(ge,d,m);return p?Qo(f,[f.shape[1],f.shape[2],f.shape[3]]):f}});const vi=ds({conv1d_:function(e,t,n,r,s="NWC",a=1,o){const i=cs(e,"x","conv1d"),u=cs(t,"filter","conv1d");let c=i,p=!1;2===i.rank&&(p=!0,c=Qo(i,[1,i.shape[0],i.shape[1]])),l(3===c.rank,(()=>`Error in conv1d: input must be rank 3, but got rank ${c.rank}.`)),l(3===u.rank,(()=>`Error in conv1d: filter must be rank 3, but got rank ${u.rank}.`)),Jo("conv1d",r,o),l(c.shape[2]===u.shape[1],(()=>`Error in conv1d: depth of input (${c.shape[2]}) must match input depth for filter ${u.shape[1]}.`)),l(Ho(n,a),(()=>`Error in conv1D: Either stride or dilation must be 1. Got stride ${n} and dilation '${a}'`)),l("NWC"===s,(()=>`Error in conv1d: got dataFormat of ${s} but only NWC is currently supported.`));const h=Qo(u,[1,u.shape[0],u.shape[1],u.shape[2]]),d=Qo(c,[c.shape[0],1,c.shape[1],c.shape[2]]),m=xi(d,h,[1,n],r,"NHWC",[1,a],o);return Qo(m,p?[m.shape[2],m.shape[3]]:[m.shape[0],m.shape[2],m.shape[3]])}});
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
 */const Ni=ds({conv2DBackpropInput_:function(e,t,n,r,s,a="NHWC",o){l(e.length===t.rank,(()=>`Length of inShape (${e.length}) and rank of dy (${t.rank}) must match`));let i=e,u=t,c=!1;3===t.rank&&(c=!0,u=Qo(t,[1,t.shape[0],t.shape[1],t.shape[2]]),i=[1,e[0],e[1],e[2]]),l(4===i.length,(()=>`Error in conv2dDerInput: inShape must be length 4, but got length ${i.length}.`)),l(4===u.rank,(()=>`Error in conv2dDerInput: dy must be rank 4, but got rank ${u.rank}`)),l(4===n.rank,(()=>`Error in conv2dDerInput: filter must be rank 4, but got rank ${n.rank}`));const p="NHWC"===a?i[3]:i[1],h="NHWC"===a?u.shape[3]:u.shape[1];l(p===n.shape[2],(()=>`Error in conv2dDerInput: depth of input (${p}) must match input depth for filter ${n.shape[2]}.`)),l(h===n.shape[3],(()=>`Error in conv2dDerInput: depth of output (${h}) must match output depth for filter ${n.shape[3]}.`)),Jo("conv2dDerInput",s,o);const d={dy:u,filter:n},m={strides:r,pad:s,dataFormat:a,dimRoundingMode:o,inputShape:i},f=ts.runKernel(be,d,m);return c?Qo(f,[f.shape[1],f.shape[2],f.shape[3]]):f}});const Si=ds({conv2dTranspose_:function(e,t,n,r,s,a){const o=cs(e,"x","conv2dTranspose"),i=cs(t,"filter","conv2dTranspose");return Ni(n,o,i,r,s,"NHWC",a)}});
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
 */const ki=ds({conv3d_:function(e,t,n,r,s="NDHWC",a=[1,1,1]){const o=cs(e,"x","conv3d"),i=cs(t,"filter","conv3d");let u=o,c=!1;4===o.rank&&(c=!0,u=Qo(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),l(5===u.rank,(()=>`Error in conv3d: input must be rank 5, but got rank ${u.rank}.`)),l(5===i.rank,(()=>`Error in conv3d: filter must be rank 5, but got rank ${i.rank}.`)),l(u.shape[4]===i.shape[3],(()=>`Error in conv3d: depth of input (${u.shape[4]}) must match input depth for filter ${i.shape[3]}.`)),l(Ho(n,a),(()=>`Error in conv3D: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`)),l("NDHWC"===s,(()=>`Error in conv3d: got dataFormat of ${s} but only NDHWC is currently supported.`));const p={x:u,filter:i},h={strides:n,pad:r,dataFormat:s,dilations:a},d=ts.runKernel(we,p,h);return c?Qo(d,[d.shape[1],d.shape[2],d.shape[3],d.shape[4]]):d}});
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
 */const Ti=ds({conv3DBackpropInput_:function(e,t,n,r,s){l(e.length===t.rank,(()=>`Length of inShape (${e.length}) and rank of dy (${t.rank}) must match`));let a=e,o=t,i=!1;4===t.rank&&(i=!0,o=Qo(t,[1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]]),a=[1,e[0],e[1],e[2],e[3]]);const u=a[4],c=o.shape[4];l(5===a.length,(()=>`Error in conv3dDerInput: inShape must be length 5, but got length ${a.length}.`)),l(5===o.rank,(()=>`Error in conv3dDerInput: dy must be rank 5, but got rank ${o.rank}`)),l(5===n.rank,(()=>`Error in conv3dDerInput: filter must be rank 5, but got rank ${n.rank}`)),l(u===n.shape[3],(()=>`Error in conv3dDerInput: depth of input (${u}) must match input depth for filter ${n.shape[3]}.`)),l(c===n.shape[4],(()=>`Error in conv3dDerInput: depth of output (${c}) must match output depth for filter ${n.shape[4]}.`));const p={dy:o,filter:n},h={pad:s,strides:r,inputShape:a},d=ts.runKernel(xe,p,h);return i?Qo(d,[d.shape[1],d.shape[2],d.shape[3],d.shape[4]]):d}});const Ei=ds({conv3dTranspose_:function(e,t,n,r,s){const a=cs(e,"x","conv3dTranspose"),o=cs(t,"filter","conv3dTranspose");return Ti(n,a,o,r,s)}});
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
 */const _i=ds({cos_:function(e){const t={x:cs(e,"x","cos","float32")};return ts.runKernel("Cos",t)}});
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
 */const Ii=ds({cosh_:function(e){const t={x:cs(e,"x","cosh","float32")};return ts.runKernel(ve,t)}});
/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ai=ds({cumprod_:function(e,t=0,n=!1,r=!1){const s={x:cs(e,"x","cumprod")},a={axis:t,exclusive:n,reverse:r};return ts.runKernel(Ne,s,a)}});
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
 */const $i=ds({cumsum_:function(e,t=0,n=!1,r=!1){const s={x:cs(e,"x","cumsum")},a={axis:t,exclusive:n,reverse:r};return ts.runKernel(Se,s,a)}});
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
 */const Mi=ds({denseBincount_:function(e,t,n,r=!1){const s=cs(e,"x","denseBincount"),a=cs(t,"weights","denseBincount");l("int32"===s.dtype,(()=>`Error in denseBincount: input dtype must be int32, but got ${s.dtype}`)),l(s.rank<=2,(()=>`Error in denseBincount: input must be at most rank 2, but got rank ${s.rank}.`)),l(n>=0,(()=>`size must be non-negative, but got ${n}.`)),l(a.size===s.size||0===a.size,(()=>`Error in denseBincount: weights must have the same shape as x or 0-length, but got x shape: ${s.shape}, weights shape: ${a.shape}.`));const o={x:s,weights:a},i={size:n,binaryOutput:r};return ts.runKernel(Te,o,i)}});
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
 */const Oi=ds({depthToSpace_:function(e,t,n="NHWC"){const r=cs(e,"x","depthToSpace","float32"),s="NHWC"===n?r.shape[1]:r.shape[2],a="NHWC"===n?r.shape[2]:r.shape[3],o="NHWC"===n?r.shape[3]:r.shape[1];l(t>1,(()=>`blockSize should be > 1 for depthToSpace, but was: ${t}`)),l(s*t>=0,(()=>`Negative dimension size caused by overflow when multiplying\n    ${s} and ${t}  for depthToSpace with input shape\n    ${r.shape}`)),l(a*t>=0,(()=>`Negative dimension size caused by overflow when multiplying\n    ${a} and ${t} for depthToSpace with input shape\n        ${r.shape}`)),l(o%(t*t)==0,(()=>`Dimension size must be evenly divisible by ${t*t} but is ${o} for depthToSpace with input shape ${r.shape}`));const i={x:r},u={blockSize:t,dataFormat:n};return ts.runKernel(Ee,i,u)}});
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
 */const Di=ds({depthwiseConv2d_:function(e,t,n,r,s="NHWC",a=[1,1],o){const i=cs(e,"x","depthwiseConv2d","float32"),u=cs(t,"filter","depthwiseConv2d","float32");let c=i,p=!1;3===i.rank&&(p=!0,c=Qo(i,[1,i.shape[0],i.shape[1],i.shape[2]])),l(4===c.rank,(()=>`Error in depthwiseConv2d: input must be rank 4, but got rank ${c.rank}.`)),l(4===u.rank,(()=>`Error in depthwiseConv2d: filter must be rank 4, but got rank ${u.rank}.`));const h="NHWC"===s?c.shape[3]:c.shape[1];l(h===u.shape[2],(()=>`Error in depthwiseConv2d: number of input channels (${h}) must match the inChannels dimension in filter ${u.shape[2]}.`)),Jo("depthwiseConv2d",r,o);const d={x:c,filter:u},m={strides:n,pad:r,dataFormat:s,dilations:a,dimRoundingMode:o},f=ts.runKernel(_e,d,m);return p?Qo(f,[f.shape[1],f.shape[2],f.shape[3]]):f}});
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
 */const Ri=ds({diag_:function(e){const t={x:cs(e,"x","diag")};return ts.runKernel($e,t)}});
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
 */const Fi=ds({dilation2d_:function(e,t,n,r,s=[1,1],a="NHWC"){const o=cs(e,"x","dilation2d"),i=cs(t,"filter","dilation2d");l(3===o.rank||4===o.rank,(()=>`Error in dilation2d: input must be rank 3 or 4, but got rank ${o.rank}.`)),l(3===i.rank,(()=>`Error in dilation2d: filter must be rank 3, but got rank ${i.rank}.`)),l("NHWC"===a,(()=>`Error in dilation2d: Only NHWC is currently supported, but got dataFormat of ${a}`));let u=o,c=!1;3===o.rank&&(u=Qo(o,[1,o.shape[0],o.shape[1],o.shape[2]]),c=!0);const p={x:u,filter:i},h={strides:n,pad:r,dilations:s},d=ts.runKernel(Me,p,h);return c?Qo(d,[d.shape[1],d.shape[2],d.shape[3]]):d}});
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
 */const Ci=ds({equal_:function(e,t){let n=cs(e,"a","equal","string_or_numeric"),r=cs(t,"b","equal","string_or_numeric");[n,r]=Gr(n,r),za(n.shape,r.shape);const s={a:n,b:r};return ts.runKernel(Re,s)}});
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
 */const Bi=ds({where_:function(e,t,n){const r=cs(t,"a","where"),s=cs(n,"b","where"),a=cs(e,"condition","where","bool"),o=za(za(a.shape,r.shape),s.shape),i={condition:hi(a,o),t:hi(r,o),e:hi(s,o)};return ts.runKernel(Pt,i)}});
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
 */const Li=ds({zerosLike_:function(e){const t={x:cs(e,"x","zerosLike")};return ts.runKernel(gn,t)}});
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
 */const zi=ds({divNoNan_:function(e,t){let n=cs(e,"a","div"),r=cs(t,"b","div");[n,r]=Gr(n,r);const s=ko(n,r),a=Li(s),o=Ci(r,a);return Bi(o,a,s)}});
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
 */const Pi=ds({dot_:function(e,t){const n=cs(e,"t1","dot"),r=cs(t,"t2","dot");l(!(1!==n.rank&&2!==n.rank||1!==r.rank&&2!==r.rank),(()=>`Error in dot: inputs must all be rank 1 or 2, but got ranks ${n.rank} and ${r.rank}.`));const s=1===n.rank?n.size:n.shape[1],a=1===r.rank?r.size:r.shape[0];if(l(s===a,(()=>`Error in dot: inner dimensions of inputs must match, but got ${s} and ${a}.`)),1===n.rank&&1===r.rank){const e=Qo(n,[1,-1]),t=Qo(r,[-1,1]),s=Ea(e,t);return Qo(s,[])}if(1===n.rank&&2===r.rank){const e=Qo(n,[1,-1]),t=Qo(r,[r.shape[0],r.shape[1]]),s=Ea(e,t);return Qo(s,[s.size])}if(2===n.rank&&1===r.rank){const e=Qo(r,[-1,1]),t=Ea(n,e);return Qo(t,[t.size])}{const e=Qo(r,[r.shape[0],r.shape[1]]);return Ea(n,e)}}});
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
 */const Vi=ds({einsum_:function(e,...t){const n=t.map(((e,t)=>cs(e,`tensors${t}`,"einsum"))),r={equation:e};return ts.runKernel(De,n,r)}});
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
 */const qi=ds({elu_:function(e){const t={x:cs(e,"x","elu","float32")};return ts.runKernel("Elu",t)}});
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
 */const Wi=ds({erf_:function(e){let t=cs(e,"x","erf");l("int32"===t.dtype||"float32"===t.dtype,(()=>"Input dtype must be `int32` or `float32`.")),"int32"===t.dtype&&(t=ua(t,"float32"));const n={x:t};return ts.runKernel("Erf",n)}});
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
 */function Ui(e,t){for(let n=0;n<e.length;++n)if(e[e.length-n-1]!==t-1-n)return!1;return!0}function ji(e,t,n){const r=e.length+t.length,s=[];let a=0,o=0;for(let i=0;i<r;i++)-1===n.indexOf(i)?s.push(e[a++]):s.push(t[o++]);return s}function Gi(e,t){return ji(e,t.map((e=>1)),t)}const Ki=ds({max_:
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
function(e,t=null,n=!1){const r={x:cs(e,"x","max")},s={reductionIndices:t,keepDims:n};return ts.runKernel("Max",r,s)}});
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
 */const Hi=ds({min_:function(e,t=null,n=!1){const r={x:cs(e,"x","min")},s={axis:t,keepDims:n};return ts.runKernel("Min",r,s)}});
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
 */const Zi=ds({pow_:function(e,t){let n=cs(e,"base","pow"),r=cs(t,"exp","pow");[n,r]=Gr(n,r);const s={a:n,b:r};return ts.runKernel("Pow",s)}});
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
 */function Ji(e,t){if((S(e)&&"string"!==t||Array.isArray(e))&&"complex64"!==t)throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if("string"===t&&S(e)&&!(e instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return fs(e,[],[],t)}
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
 */const Qi=ds({sqrt_:function(e){const t={x:cs(e,"x","sqrt","float32")};return ts.runKernel(Kt,t)}});
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
 */const Xi=ds({square_:function(e){const t=cs(e,"x","square");return ts.runKernel("Square",{x:t},{})}});
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
 */const Yi=ds({sum_:function(e,t=null,n=!1){let r=cs(e,"x","sum");"bool"===r.dtype&&(r=ua(r,"int32"));const s={x:r},a={axis:t,keepDims:n};return ts.runKernel("Sum",s,a)}});
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
 */function eu(e,t,n=null){if(0===e.rank)return Eo(e);if(1!==e.rank&&null===n)return eu(Qo(e,[-1]),t,n);if(1===e.rank||"number"==typeof n||Array.isArray(n)&&1===n.length){if(1===t)return Yi(Eo(e),n);if(t===1/0)return Ki(Eo(e),n);if(t===-1/0)return Hi(Eo(e),n);if("euclidean"===t||2===t)return Qi(Yi(Zi(Eo(e),Ji(2,"int32")),n));throw new Error(`Error in norm: invalid ord value: ${t}`)}if(Array.isArray(n)&&2===n.length){if(1===t)return Ki(Yi(Eo(e),n[0]),n[1]-1);if(t===1/0)return Ki(Yi(Eo(e),n[1]),n[0]);if(t===-1/0)return Hi(Yi(Eo(e),n[1]),n[0]);if("fro"===t||"euclidean"===t)return Qi(Yi(Xi(e),n));throw new Error(`Error in norm: invalid ord value: ${t}`)}throw new Error(`Error in norm: invalid axis: ${n}`)}const tu=ds({norm_:function(e,t="euclidean",n=null,r=!1){const s=eu(e=cs(e,"x","norm"),t,n);let a=s.shape;if(r){const t=y(n,e.shape);a=Gi(s.shape,t)}return Qo(s,a)}});
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
 */const nu=ds({euclideanNorm_:function(e,t=null,n=!1){return tu(e,"euclidean",t,n)}});
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
 */const ru=ds({exp_:function(e){const t={x:cs(e,"x","exp")};return ts.runKernel("Exp",t)}});
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
 */const su=ds({expandDims_:function(e,t=0){const n=cs(e,"x","expandDims","string_or_numeric");l(t<=n.rank,(()=>"Axis must be <= rank of the tensor"));const r={input:n},s={dim:t};return ts.runKernel(Fe,r,s)}});
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
 */const au=ds({expm1_:function(e){const t={x:cs(e,"x","expm1")};return ts.runKernel(Ce,t)}});
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
 */const ou=ds({tile_:function(e,t){const n=cs(e,"x","tile","string_or_numeric");l(n.rank===t.length,(()=>`Error in transpose: rank of input ${n.rank} must match length of reps ${t}.`));const r={x:n},s={reps:t};return ts.runKernel(ln,r,s)}});
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
 */const iu=ds({eye_:function(e,t,n,r="float32"){null==t&&(t=e);const s=ia([e,t],r),a=e<=t?e:t;for(let e=0;e<a;++e)s.set(1,e,e);const o=Qo(s.toTensor(),[e,t]);if(null==n)return o;if(1===n.length)return ou(su(o,0),[n[0],1,1]);if(2===n.length)return ou(su(su(o,0),0),[n[0],n[1],1,1]);if(3===n.length)return ou(su(su(su(o,0),0),0),[n[0],n[1],n[2],1,1]);throw new Error(`eye() currently supports only 1D and 2D batchShapes, but received ${n.length}D.`)}});
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
 */const uu=ds({floor_:function(e){const t={x:cs(e,"x","floor","float32")};return ts.runKernel(ze,t)}});
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
 */const lu=ds({gather_:function(e,t,n=0,r=0){const s={x:cs(e,"x","gather"),indices:cs(t,"indices","gather","int32")},a={axis:n,batchDims:r};return ts.runKernel(qe,s,a)}});
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
 */const cu=ds({greater_:function(e,t){let n=cs(e,"a","greater","string_or_numeric"),r=cs(t,"b","greater","string_or_numeric");[n,r]=Gr(n,r),za(n.shape,r.shape);const s={a:n,b:r};return ts.runKernel(Ue,s)}});
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
 */const pu=ds({greaterEqual_:function(e,t){let n=cs(e,"a","greaterEqual","string_or_numeric"),r=cs(t,"b","greaterEqual","string_or_numeric");[n,r]=Gr(n,r),za(n.shape,r.shape);const s={a:n,b:r};return ts.runKernel(je,s)}});
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
 */const hu=ds({isFinite_:function(e){const t={x:cs(e,"x","isFinite")};return ts.runKernel(Ze,t)}});
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
 */const du=ds({isInf_:function(e){const t={x:cs(e,"x","isInf")};return ts.runKernel(Je,t)}});
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
 */const mu=ds({isNaN_:function(e){const t={x:cs(e,"x","isNaN")};return ts.runKernel(Qe,t)}});
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
 */const fu=ds({leakyRelu_:function(e,t=.2){const n={x:cs(e,"x","leakyRelu")},r={alpha:t};return ts.runKernel(Xe,n,r)}});
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
 */const gu=ds({less_:function(e,t){let n=cs(e,"a","less","string_or_numeric"),r=cs(t,"b","less","string_or_numeric");[n,r]=Gr(n,r),za(n.shape,r.shape);const s={a:n,b:r};return ts.runKernel(Ye,s)}});
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
 */const yu=ds({lessEqual_:function(e,t){let n=cs(e,"a","lessEqual","string_or_numeric"),r=cs(t,"b","lessEqual","string_or_numeric");[n,r]=Gr(n,r),za(n.shape,r.shape);const s={a:n,b:r};return ts.runKernel(et,s)}});
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
 */function bu(e,t,n){if(n<=0)throw new Error("The number of values should be positive.");const r={start:e,stop:t,num:n};return ts.runKernel(tt,{},r)}
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
 */const wu=ds({localResponseNormalization_:function(e,t=5,n=1,r=1,s=.5){const a=cs(e,"x","localResponseNormalization");l(4===a.rank||3===a.rank,(()=>`Error in localResponseNormalization: x must be rank 3 or 4 but got\n               rank ${a.rank}.`)),l(f(t),(()=>`Error in localResponseNormalization: depthRadius must be an integer but got depthRadius ${t}.`));let o=a,i=!1;3===a.rank&&(i=!0,o=Qo(a,[1,a.shape[0],a.shape[1],a.shape[2]]));const u={x:o},c={depthRadius:t,bias:n,alpha:r,beta:s},p=ts.runKernel("LRN",u,c);return i?Qo(p,[p.shape[1],p.shape[2],p.shape[3]]):p}});
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
 */const xu=ds({log_:function(e){const t={x:cs(e,"x","log","float32")};return ts.runKernel("Log",t)}});
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
 */const vu=ds({log1p_:function(e){const t={x:cs(e,"x","log1p")};return ts.runKernel(nt,t)}});
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
 */function Nu(e,t){l($(e),(()=>"The f passed in variableGrads(f) must be a function")),l(null==t||Array.isArray(t)&&t.every((e=>e instanceof Lr)),(()=>"The varList passed in variableGrads(f, varList) must be an array of variables"));const n=null!=t;if(!n){t=[];for(const e in ts.registeredVariables)t.push(ts.registeredVariables[e])}const r=n?t.filter((e=>!e.trainable)):null,s=t.length;t=t.filter((e=>e.trainable)),l(t.length>0,(()=>`variableGrads() expects at least one of the input variables to be trainable, but none of the ${s} variables is trainable.`));const{value:a,grads:o}=ts.gradients(e,t,null,!0);l(o.some((e=>null!=e)),(()=>"Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize().")),l(0===a.rank,(()=>`The f passed in variableGrads(f) must return a scalar, but it returned a rank-${a.rank} tensor`));const i={};return t.forEach(((e,t)=>{null!=o[t]&&(i[e.name]=o[t])})),null!=r&&r.forEach((e=>i[e.name]=null)),{value:a,grads:i}}function Su(e){return ts.customGrad(e)}function ku(e){if(e.filter((e=>null==e)).length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that\n    the f you passed encloses all operations that lead from x to y.")}
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
 */const Tu=ds({softplus_:function(e){const t={x:cs(e,"x","softplus")};return ts.runKernel(Gt,t)}});
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
 */const Eu=ds({logSigmoid_:function(e){const t=cs(e,"x","logSigmoid");return Su((e=>({value:Oa(Tu(Oa(e))),gradFunc:t=>To(t,ti(Oa(e)))})))(t)}});
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
 */const _u=ds({sub_:function(e,t){let n=cs(e,"a","sub"),r=cs(t,"b","sub");[n,r]=Gr(n,r);const s={a:n,b:r};return ts.runKernel("Sub",s)}});
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
 */const Iu=ds({logSoftmax_:function(e,t=-1){const n=cs(e,"logits","logSoftmax");if(-1===t&&(t=n.rank-1),t!==n.rank-1)throw Error(`Log Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and axis was ${t}`);const r=Su(((e,n)=>{const r=Ki(e,t,!0),s=_u(e,r),a=_u(ua(s,"float32"),xu(Yi(ru(s),t,!0)));n([a]);return{value:a,gradFunc:(e,n)=>{const[r]=n,s=ru(r);return _u(e,To(Yi(e,t,!0),s))}}}));return r(n)}});
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
 */const Au=ds({logSumExp_:function(e,t=null,n=!1){const r=cs(e,"x","logSumExp"),s=y(t,r.shape),a=Ki(r,s,!0),o=_u(r,a),i=ru(o),u=Yi(i,s),l=xu(u),c=No(Qo(a,l.shape),l);if(n){const e=Gi(c.shape,s);return Qo(c,e)}return c}});
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
 */const $u=ds({logicalAnd_:function(e,t){const n=cs(e,"a","logicalAnd","bool"),r=cs(t,"b","logicalAnd","bool");za(n.shape,r.shape);const s={a:n,b:r};return ts.runKernel(rt,s)}});
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
 */const Mu=ds({logicalNot_:function(e){const t={x:cs(e,"x","logicalNot","bool")};return ts.runKernel(st,t)}});
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
 */const Ou=ds({logicalOr_:function(e,t){const n=cs(e,"a","logicalOr","bool"),r=cs(t,"b","logicalOr","bool");za(n.shape,r.shape);const s={a:n,b:r};return ts.runKernel(at,s)}});
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
 */const Du=ds({logicalXor_:function(e,t){const n=cs(e,"a","logicalXor","bool"),r=cs(t,"b","logicalXor","bool");return za(n.shape,r.shape),$u(Ou(e,t),Mu($u(e,t)))}}),Ru=2147483648;
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
 */const Fu=ds({searchSorted_:function(e,t,n="left"){const r=cs(e,"sortedSequence","searchSorted"),s=cs(t,"values","searchSorted"),a=r.shape[r.shape.length-1],o=s.shape[s.shape.length-1],i=Qo(r,[-1,a]),u=Qo(s,[-1,o]);if(i.rank<2)throw new Error("Sorted input argument must be at least 2-dimensional");if(i.shape[0]!==u.shape[0])throw new Error("Leading dimension of 'sortedSequence' and 'values' must match.");if(d(u.shape)>=Ru)throw new Error("values tensor size must less than 2147483648");if(i.shape[1]>=Ru)throw new Error(`trailing dim_size must less than 2147483648 for int32 output type, was ${i.shape[1]}`);const l={sortedSequence:i,values:u},c={side:n};return ts.runKernel(zt,l,c)}});
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
 */function Cu(e,t){return Fu(e,t,"left")}
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
 */const Bu=ds({maxPool_:function(e,t,n,r,s){const a=cs(e,"x","maxPool");let o=a,i=!1;3===a.rank&&(i=!0,o=Qo(a,[1,a.shape[0],a.shape[1],a.shape[2]])),l(4===o.rank,(()=>`Error in maxPool: input must be rank 4 but got rank ${o.rank}.`)),l(Ho(n,1),(()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${n} and dilations '1'`)),Jo("maxPool",r,s);const u={x:o},c={filterSize:t,strides:n,pad:r,dimRoundingMode:s},p=ts.runKernel(it,u,c);return i?Qo(p,[p.shape[1],p.shape[2],p.shape[3]]):p}});
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
 */const Lu=ds({maxPool3d_:function(e,t=[1,1,1],n,r,s,a="NDHWC"){const o=cs(e,"x","maxPool3d");let i=o,u=!1;4===o.rank&&(u=!0,i=Qo(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),l(5===i.rank,(()=>`Error in maxPool3d: x must be rank 5 but got rank ${i.rank}.`)),l("NDHWC"===a,(()=>`Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of ${a}`)),Jo("maxPool3d",r,s);const c={x:i},p={filterSize:t,strides:n,pad:r,dimRoundingMode:s,dataFormat:a},h=ts.runKernel(ut,c,p);return u?Qo(h,[h.shape[1],h.shape[2],h.shape[3],h.shape[4]]):h}});
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
 */const zu=ds({maxPoolWithArgmax_:function(e,t,n,r,s=!1){const a={x:cs(e,"x","maxPoolWithArgmax")},o={filterSize:t,strides:n,pad:r,includeBatchInIndex:s},i=ts.runKernel(lt,a,o);return{result:i[0],indexes:i[1]}}});
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
 */const Pu=ds({maximum_:function(e,t){let n=cs(e,"a","maximum"),r=cs(t,"b","maximum");[n,r]=Gr(n,r),"bool"===n.dtype&&(n=ua(n,"int32"),r=ua(r,"int32")),za(n.shape,r.shape);const s={a:n,b:r};return ts.runKernel(ot,s)}});
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
 */const Vu=ds({mean_:function(e,t=null,n=!1){const r={x:cs(e,"x","mean")},s={axis:t,keepDims:n};return ts.runKernel(ct,r,s)}});
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
 */function qu(e,t="float32"){if("complex64"===t){const t=qu(e,"float32"),n=qu(e,"float32");return ms(t,n)}const n=C(d(e),t);return ts.makeTensor(n,e,t)}
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
 */function Wu(e,t="float32"){if("complex64"===t){const t=Wu(e,"float32"),n=qu(e,"float32");return ms(t,n)}const n=F(d(e),t);return ts.makeTensor(n,e,t)}
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
 */function Uu(e,t,{indexing:n="xy"}={}){if("xy"!==n&&"ij"!==n)throw new TypeError(`${n} is not a valid third argument to meshgrid`);if(void 0===e)return[];let r=cs(e,"x","meshgrid",e instanceof Br?e.dtype:"float32");if(void 0===t)return[r];let s=cs(t,"y","meshgrid",t instanceof Br?t.dtype:"float32");const a=d(r.shape),o=d(s.shape);return"xy"===n?(r=Qo(r,[1,-1]),s=Qo(s,[-1,1]),[Ea(Wu([o,1],r.dtype),r),Ea(s,Wu([1,a],s.dtype))]):(r=Qo(r,[-1,1]),s=Qo(s,[1,-1]),[Ea(r,Wu([1,o],r.dtype)),Ea(Wu([a,1],s.dtype),s)])}
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
 */const ju=ds({minimum_:function(e,t){let n=cs(e,"a","minimum"),r=cs(t,"b","minimum");[n,r]=Gr(n,r),"bool"===n.dtype&&(n=ua(n,"int32"),r=ua(r,"int32")),za(n.shape,r.shape);const s={a:n,b:r};return ts.runKernel(pt,s)}});
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
 */const Gu=ds({mirrorPad_:function(e,t,n){l("reflect"===n||"symmetric"===n,(()=>`Invalid mode. Mode must be either reflect or symmetric. Got ${n}.`));const r=cs(e,"x","mirrorPad");if(0===r.rank)throw new Error("mirrorPad(scalar) is not defined. Pass non-scalar to mirrorPad");l(t.length===r.rank,(()=>`Padding doesn't match input. Must be ${r.rank}. Got ${t.length}.`));const s="reflect"===n?1:0;for(let e=0;e<r.rank;e++)l(2===t[e].length,(()=>"Invalid number of paddings. Must be length of 2 each.")),l(t[e][0]>=0&&t[e][0]<=r.shape[e]-s&&t[e][1]>=0&&t[e][1]<=r.shape[e]-s,(()=>`Padding in dimension ${e} cannot be greater than or equal to ${r.shape[e]-s} or less than 0 for input of shape ${r.shape}`));const a={paddings:t,mode:n},o={x:r};return ts.runKernel(ht,o,a)}});
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
 */const Ku=ds({mod_:function(e,t){let n=cs(e,"a","mod"),r=cs(t,"b","mod");[n,r]=Gr(n,r);const s={a:n,b:r};return ts.runKernel("Mod",s)}});
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
 */const Hu=ds({moments_:function(e,t=null,n=!1){const r=y(t,(e=cs(e,"x","moments")).shape),s=Vu(e,r,n);let a=s.shape;n||(a=Gi(s.shape,r));const o=Xi(_u(ua(e,"float32"),Qo(s,a)));return{mean:s,variance:Vu(o,r,n)}}});const Zu=ds({multiRNNCell_:function(e,t,n,r){const s=cs(t,"data","multiRNNCell"),a=ps(n,"c","multiRNNCell"),o=ps(r,"h","multiRNNCell");let i=s;const u=[];for(let t=0;t<e.length;t++){const n=e[t](i,a[t],o[t]);u.push(n[0]),u.push(n[1]),i=n[1]}const l=[],c=[];for(let e=0;e<u.length;e+=2)l.push(u[e]),c.push(u[e+1]);return[l,c]}});
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
 */const Ju=ds({multinomial_:function(e,t,n,r=!1){const s=cs(e,"logits","multinomial"),a=s.size,o=s.rank;if(a<2)throw new Error(`Error in multinomial: you need at least 2 outcomes, but got ${a}.`);if(o>2)throw new Error(`Rank of probabilities must be 1 or 2, but is ${o}`);n=n||Math.random();const i={logits:1===o?Qo(s,[1,-1]):s},u={numSamples:t,seed:n,normalized:r},l=ts.runKernel(dt,i,u);return 1===o?Qo(l,[l.size]):l}});
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
 */const Qu=ds({notEqual_:function(e,t){let n=cs(e,"a","notEqual","string_or_numeric"),r=cs(t,"b","notEqual","string_or_numeric");[n,r]=Gr(n,r),za(n.shape,r.shape);const s={a:n,b:r};return ts.runKernel(ft,s)}});
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
 */const Xu=ds({onesLike_:function(e){const t={x:cs(e,"x","onesLike")};return ts.runKernel(wt,t)}});const Yu=ds({outerProduct_:function(e,t){const n=cs(e,"v1","outerProduct"),r=cs(t,"v2","outerProduct");l(1===n.rank&&1===r.rank,(()=>`Error in outerProduct: inputs must be rank 1, but got ranks ${n.rank} and ${r.rank}.`));const s=Qo(n,[-1,1]),a=Qo(r,[1,-1]);return Ea(s,a)}});
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
 */const el=ds({pad_:function(e,t,n=0){const r=cs(e,"x","pad");if(0===r.rank)throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");const s={paddings:t,constantValue:n},a={x:r};return ts.runKernel(Nt,a,s)}});const tl=ds({pad1d_:function(e,t,n=0){return l(2===t.length,(()=>"Invalid number of paddings. Must be length of 2.")),el(e,[t],n)}});const nl=ds({pad2d_:function(e,t,n=0){return l(2===t.length&&2===t[0].length&&2===t[1].length,(()=>"Invalid number of paddings. Must be length of 2 each.")),el(e,t,n)}});const rl=ds({pad3d_:function(e,t,n=0){return l(3===t.length&&2===t[0].length&&2===t[1].length&&2===t[2].length,(()=>"Invalid number of paddings. Must be length of 2 each.")),el(e,t,n)}});const sl=ds({pad4d_:function(e,t,n=0){return l(4===t.length&&2===t[0].length&&2===t[1].length&&2===t[2].length&&2===t[3].length,(()=>"Invalid number of paddings. Must be length of 2 each.")),el(e,t,n)}});
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
 */const al=ds({spaceToBatchND_:function(e,t,n){const r=cs(e,"x","spaceToBatchND");l(r.rank>=1+t.length,(()=>`input rank ${r.rank} should be > than [blockShape] ${t.length}`)),l(n.length===t.length,(()=>`paddings.shape[0] ${n.length} must be equal to [blockShape] ${t.length}`)),l(r.shape.reduce(((e,r,s)=>s>0&&s<=t.length?e&&(r+n[s-1][0]+n[s-1][1])%t[s-1]==0:e),!0),(()=>`input spatial dimensions ${r.shape.slice(1)} with paddings ${n.toString()} must be divisible by blockShapes ${t.toString()}`));const s={x:r},a={blockShape:t,paddings:n};return ts.runKernel(Ht,s,a)}});
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
 */const ol=ds({pool_:function(e,t,n,r,s,a,o){null==s&&(s=[1,1]),null==a&&(a=1),0===r&&(r="valid");const i=cs(e,"x","maxPool");let u=i,c=!1;3===i.rank&&(c=!0,u=Qo(i,[1,i.shape[0],i.shape[1],i.shape[2]])),l(Ho(a,s),(()=>`Error in pool: Either strides or dilations must be 1. Got strides ${a} and dilations '${s}'`));const p=zo(u.shape,t,a,s,r),h=[p.dilationHeight,p.dilationWidth];let d;d="same"===r?function(e,t){const n=e.map(((e,n)=>e+(e-1)*(t[n]-1))),r=n.map((e=>e-1)),s=r.map((e=>Math.floor(e/2))),a=r.map(((e,t)=>e-s[t]));return r.map(((e,t)=>[s[t],a[t]]))}([p.filterHeight,p.filterWidth],h):[[0,0],[0,0]];const m=1===h[0]&&1===h[1],[f,g]=function(e,t,n){const r=n.map((e=>e[0])),s=n.map((e=>e[1])),a=e.concat(r,s),o=t.map(((e,t)=>(e-a[t]%e)%e)),i=s.map(((e,t)=>e+o[t])),u=t.map(((e,t)=>[r[t],i[t]])),l=t.map(((e,t)=>[0,o[t]]));return[u,l]}([p.inHeight,p.inWidth],h,d),y=m?r:"valid",b=m?u:al(u,h,f),w=("avg"===n?()=>Xo(b,t,a,y,o):()=>Bu(b,t,a,y,o))(),x=m?w:ai(w,h,g);return c?Qo(x,[x.shape[1],x.shape[2],x.shape[3]]):x}});
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
 */const il=ds({prelu_:function(e,t){const n={x:cs(e,"x","prelu"),alpha:cs(t,"alpha","prelu")};return ts.runKernel(St,n)}});
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
 */const ul=ds({prod_:function(e,t=null,n=!1){let r=cs(e,"x","prod");"bool"===r.dtype&&(r=ua(r,"int32"));const s={x:r},a={axis:t,keepDims:n};return ts.runKernel(kt,s,a)}});
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
 */const ll=ds({raggedGather_:function(e,t,n,r){const s={paramsNestedSplits:e.map(((e,t)=>cs(e,`tensors${t}`,"raggedGather","int32"))),paramsDenseValues:cs(t,"paramsDenseValues","raggedGather"),indices:cs(n,"indices","raggedGather","int32")},a={outputRaggedRank:r},o=ts.runKernel(Tt,s,a);return{outputNestedSplits:o.slice(0,o.length-1),outputDenseValues:o[o.length-1]}}});
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
 */const cl=ds({raggedTensorToTensor_:function(e,t,n,r,s){const a=cs(e,"shape","raggedTensorToTensor","int32"),o=cs(t,"values","raggedTensorToTensor"),i={shape:a,values:o,defaultValue:cs(n,"defaultValue","raggedTensorToTensor",o.dtype),rowPartitionTensors:r.map(((e,t)=>cs(e,`tensors${t}`,"raggedTensorToTensor","int32")))},u={rowPartitionTypes:s};return ts.runKernel(Et,i,u)}});
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
 */const pl=ds({rand_:function(e,t,n){const r=d(e);let s=null;if(null==n||"float32"===n)s=new Float32Array(r);else if("int32"===n)s=new Int32Array(r);else{if("bool"!==n)throw new Error(`Unknown data type ${n}`);s=new Uint8Array(r)}for(let e=0;e<r;e++)s[e]=t();return ts.makeTensor(s,e,n)}});var hl={exports:{}};(function(e,t,n){function r(e){var t=this,n=function(){var e=4022871197,t=function(t){t=String(t);for(var n=0;n<t.length;n++){var r=.02519603282416938*(e+=t.charCodeAt(n));r-=e=r>>>0,e=(r*=e)>>>0,e+=4294967296*(r-=e)}return 2.3283064365386963e-10*(e>>>0)};return t}();t.next=function(){var e=2091639*t.s0+2.3283064365386963e-10*t.c;return t.s0=t.s1,t.s1=t.s2,t.s2=e-(t.c=0|e)},t.c=1,t.s0=n(" "),t.s1=n(" "),t.s2=n(" "),t.s0-=n(e),t.s0<0&&(t.s0+=1),t.s1-=n(e),t.s1<0&&(t.s1+=1),t.s2-=n(e),t.s2<0&&(t.s2+=1),n=null}function s(e,t){return t.c=e.c,t.s0=e.s0,t.s1=e.s1,t.s2=e.s2,t}function a(e,t){var n=new r(e),a=t&&t.state,o=n.next;return o.int32=function(){return 4294967296*n.next()|0},o.double=function(){return o()+11102230246251565e-32*(2097152*o()|0)},o.quick=o,a&&("object"==typeof a&&s(a,n),o.state=function(){return s(n,{})}),o}t&&t.exports?t.exports=a:this.alea=a})(0,hl);var dl=hl.exports,ml={exports:{}};!function(e){!function(e,t,n){function r(e){var t=this,n="";t.x=0,t.y=0,t.z=0,t.w=0,t.next=function(){var e=t.x^t.x<<11;return t.x=t.y,t.y=t.z,t.z=t.w,t.w^=t.w>>>19^e^e>>>8},e===(0|e)?t.x=e:n+=e;for(var r=0;r<n.length+64;r++)t.x^=0|n.charCodeAt(r),t.next()}function s(e,t){return t.x=e.x,t.y=e.y,t.z=e.z,t.w=e.w,t}function a(e,t){var n=new r(e),a=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do{var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21)}while(0===e);return e},o.int32=n.next,o.quick=o,a&&("object"==typeof a&&s(a,n),o.state=function(){return s(n,{})}),o}t&&t.exports?t.exports=a:this.xor128=a}(0,e)}(ml);var fl=ml.exports,gl={exports:{}};!function(e){!function(e,t,n){function r(e){var t=this,n="";t.next=function(){var e=t.x^t.x>>>2;return t.x=t.y,t.y=t.z,t.z=t.w,t.w=t.v,(t.d=t.d+362437|0)+(t.v=t.v^t.v<<4^e^e<<1)|0},t.x=0,t.y=0,t.z=0,t.w=0,t.v=0,e===(0|e)?t.x=e:n+=e;for(var r=0;r<n.length+64;r++)t.x^=0|n.charCodeAt(r),r==n.length&&(t.d=t.x<<10^t.x>>>4),t.next()}function s(e,t){return t.x=e.x,t.y=e.y,t.z=e.z,t.w=e.w,t.v=e.v,t.d=e.d,t}function a(e,t){var n=new r(e),a=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do{var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21)}while(0===e);return e},o.int32=n.next,o.quick=o,a&&("object"==typeof a&&s(a,n),o.state=function(){return s(n,{})}),o}t&&t.exports?t.exports=a:this.xorwow=a}(0,e)}(gl);var yl=gl.exports,bl={exports:{}};!function(e){!function(e,t,n){function r(e){var t=this;t.next=function(){var e,n,r=t.x,s=t.i;return e=r[s],n=(e^=e>>>7)^e<<24,n^=(e=r[s+1&7])^e>>>10,n^=(e=r[s+3&7])^e>>>3,n^=(e=r[s+4&7])^e<<7,e=r[s+7&7],n^=(e^=e<<13)^e<<9,r[s]=n,t.i=s+1&7,n},function(e,t){var n,r=[];if(t===(0|t))r[0]=t;else for(t=""+t,n=0;n<t.length;++n)r[7&n]=r[7&n]<<15^t.charCodeAt(n)+r[n+1&7]<<13;for(;r.length<8;)r.push(0);for(n=0;n<8&&0===r[n];++n);for(8==n?r[7]=-1:r[n],e.x=r,e.i=0,n=256;n>0;--n)e.next()}(t,e)}function s(e,t){return t.x=e.x.slice(),t.i=e.i,t}function a(e,t){null==e&&(e=+new Date);var n=new r(e),a=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do{var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21)}while(0===e);return e},o.int32=n.next,o.quick=o,a&&(a.x&&s(a,n),o.state=function(){return s(n,{})}),o}t&&t.exports?t.exports=a:this.xorshift7=a}(0,e)}(bl);var wl=bl.exports,xl={exports:{}};!function(e){!function(e,t,n){function r(e){var t=this;t.next=function(){var e,n,r=t.w,s=t.X,a=t.i;return t.w=r=r+1640531527|0,n=s[a+34&127],e=s[a=a+1&127],n^=n<<13,e^=e<<17,n^=n>>>15,e^=e>>>12,n=s[a]=n^e,t.i=a,n+(r^r>>>16)|0},function(e,t){var n,r,s,a,o,i=[],u=128;for(t===(0|t)?(r=t,t=null):(t+="\0",r=0,u=Math.max(u,t.length)),s=0,a=-32;a<u;++a)t&&(r^=t.charCodeAt((a+32)%t.length)),0===a&&(o=r),r^=r<<10,r^=r>>>15,r^=r<<4,r^=r>>>13,a>=0&&(o=o+1640531527|0,s=0==(n=i[127&a]^=r+o)?s+1:0);for(s>=128&&(i[127&(t&&t.length||0)]=-1),s=127,a=512;a>0;--a)r=i[s+34&127],n=i[s=s+1&127],r^=r<<13,n^=n<<17,r^=r>>>15,n^=n>>>12,i[s]=r^n;e.w=o,e.X=i,e.i=s}(t,e)}function s(e,t){return t.i=e.i,t.w=e.w,t.X=e.X.slice(),t}function a(e,t){null==e&&(e=+new Date);var n=new r(e),a=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do{var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21)}while(0===e);return e},o.int32=n.next,o.quick=o,a&&(a.X&&s(a,n),o.state=function(){return s(n,{})}),o}t&&t.exports?t.exports=a:this.xor4096=a}(0,e)}(xl);var vl=xl.exports,Nl={exports:{}};!function(e){!function(e,t,n){function r(e){var t=this,n="";t.next=function(){var e=t.b,n=t.c,r=t.d,s=t.a;return e=e<<25^e>>>7^n,n=n-r|0,r=r<<24^r>>>8^s,s=s-e|0,t.b=e=e<<20^e>>>12^n,t.c=n=n-r|0,t.d=r<<16^n>>>16^s,t.a=s-e|0},t.a=0,t.b=0,t.c=-1640531527,t.d=1367130551,e===Math.floor(e)?(t.a=e/4294967296|0,t.b=0|e):n+=e;for(var r=0;r<n.length+20;r++)t.b^=0|n.charCodeAt(r),t.next()}function s(e,t){return t.a=e.a,t.b=e.b,t.c=e.c,t.d=e.d,t}function a(e,t){var n=new r(e),a=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do{var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21)}while(0===e);return e},o.int32=n.next,o.quick=o,a&&("object"==typeof a&&s(a,n),o.state=function(){return s(n,{})}),o}t&&t.exports?t.exports=a:this.tychei=a}(0,e)}(Nl);var Sl=Nl.exports,kl={exports:{}},Tl=Dn(Object.freeze({__proto__:null,default:{}}));!function(e){!function(t,n,r){var s,a=256,o="random",i=r.pow(a,6),u=r.pow(2,52),l=2*u,c=a-1;function p(e,c,p){var y=[],b=f(m((c=1==c?{entropy:!0}:c||{}).entropy?[e,g(n)]:null==e?function(){try{var e;return s&&(e=s.randomBytes)?e=e(a):(e=new Uint8Array(a),(t.crypto||t.msCrypto).getRandomValues(e)),g(e)}catch(e){var r=t.navigator,o=r&&r.plugins;return[+new Date,t,o,t.screen,g(n)]}}():e,3),y),w=new h(y),x=function(){for(var e=w.g(6),t=i,n=0;e<u;)e=(e+n)*a,t*=a,n=w.g(1);for(;e>=l;)e/=2,t/=2,n>>>=1;return(e+n)/t};return x.int32=function(){return 0|w.g(4)},x.quick=function(){return w.g(4)/4294967296},x.double=x,f(g(w.S),n),(c.pass||p||function(e,t,n,s){return s&&(s.S&&d(s,w),e.state=function(){return d(w,{})}),n?(r[o]=e,t):e})(x,b,"global"in c?c.global:this==r,c.state)}function h(e){var t,n=e.length,r=this,s=0,o=r.i=r.j=0,i=r.S=[];for(n||(e=[n++]);s<a;)i[s]=s++;for(s=0;s<a;s++)i[s]=i[o=c&o+e[s%n]+(t=i[s])],i[o]=t;(r.g=function(e){for(var t,n=0,s=r.i,o=r.j,i=r.S;e--;)t=i[s=c&s+1],n=n*a+i[c&(i[s]=i[o=c&o+t])+(i[o]=t)];return r.i=s,r.j=o,n})(a)}function d(e,t){return t.i=e.i,t.j=e.j,t.S=e.S.slice(),t}function m(e,t){var n,r=[],s=typeof e;if(t&&"object"==s)for(n in e)try{r.push(m(e[n],t-1))}catch(e){}return r.length?r:"string"==s?e:e+"\0"}function f(e,t){for(var n,r=e+"",s=0;s<r.length;)t[c&s]=c&(n^=19*t[c&s])+r.charCodeAt(s++);return g(t)}function g(e){return String.fromCharCode.apply(0,e)}if(f(r.random(),n),e.exports){e.exports=p;try{s=Tl}catch(e){}}else r["seed"+o]=p}("undefined"!=typeof self?self:Mn,[],Math)}(kl);var El=dl,_l=fl,Il=yl,Al=wl,$l=vl,Ml=Sl,Ol=kl.exports;Ol.alea=El,Ol.xor128=_l,Ol.xorwow=Il,Ol.xorshift7=Al,Ol.xor4096=$l,Ol.tychei=Ml;var Dl=Ol;
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
 */class Rl{constructor(e,t,n,r,s){this.mean=e,this.stdDev=t,this.dtype=n,this.nextVal=NaN,this.truncated=r,this.truncated&&(this.upper=this.mean+2*this.stdDev,this.lower=this.mean-2*this.stdDev);const a=s||Math.random();this.random=Dl.alea(a.toString())}nextValue(){if(!isNaN(this.nextVal)){const e=this.nextVal;return this.nextVal=NaN,e}let e,t,n=!1;for(;!n;){let r,s,a;do{r=2*this.random()-1,s=2*this.random()-1,a=r*r+s*s}while(a>=1||0===a);const o=Math.sqrt(-2*Math.log(a)/a);e=this.mean+this.stdDev*r*o,t=this.mean+this.stdDev*s*o,this.truncated&&!this.isValidTruncated(e)||(n=!0)}return this.truncated&&!this.isValidTruncated(t)||(this.nextVal=this.convertValue(t)),this.convertValue(e)}convertValue(e){return null==this.dtype||"float32"===this.dtype?e:Math.round(e)}isValidTruncated(e){return e<=this.upper&&e>=this.lower}}class Fl{constructor(e,t,n,r){this.alpha=e,this.beta=1/t,this.dtype=n;const s=r||Math.random();this.randu=Dl.alea(s.toString()),this.randn=new Rl(0,1,n,!1,this.randu()),this.d=e<1?e+2/3:e-1/3,this.c=1/Math.sqrt(9*this.d)}nextValue(){let e,t,n,r,s,a;for(;;){do{r=this.randn.nextValue(),a=1+this.c*r}while(a<=0);if(a*=a*a,e=r*r,t=1-.331*e*e,n=.5*e+this.d*(1-a+Math.log(a)),s=this.randu(),s<t||Math.log(s)<n)break}return a=1/this.beta*this.d*a,this.alpha<1&&(a*=Math.pow(this.randu(),1/this.alpha)),this.convertValue(a)}convertValue(e){return"float32"===this.dtype?e:Math.round(e)}}class Cl{constructor(e=0,t=1,n,r){if(this.canReturnFloat=()=>null==this.dtype||"float32"===this.dtype,this.min=e,this.range=t-e,this.dtype=n,null==r&&(r=Math.random()),"number"==typeof r&&(r=r.toString()),!this.canReturnFloat()&&this.range<=1)throw new Error(`The difference between ${e} - ${t} <= 1 and dtype is not float`);this.random=Dl.alea(r)}convertValue(e){return this.canReturnFloat()?e:Math.round(e)}nextValue(){return this.convertValue(this.min+this.range*this.random())}}
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
 */const Bl=ds({randomGamma_:function(e,t,n=1,r="float32",s){if(null==n&&(n=1),null==r&&(r="float32"),"float32"!==r&&"int32"!==r)throw new Error(`Unsupported data type ${r}`);const a=new Fl(t,n,r,s),o=ia(e,r);for(let e=0;e<o.values.length;e++)o.values[e]=a.nextValue();return o.toTensor()}});
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
 */const Ll=ds({randomNormal_:function(e,t=0,n=1,r,s){if(null!=r&&"bool"===r)throw new Error(`Unsupported data type ${r}`);const a=new Rl(t,n,r,!1,s),o=ia(e,r);for(let e=0;e<o.values.length;e++)o.values[e]=a.nextValue();return o.toTensor()}});
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
 */const zl=ds({randomStandardNormal_:function(e,t,n){if(null!=t&&"bool"===t)throw new Error(`Unsupported data type ${t}`);return Ll(e,0,1,t,n)}});
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
 */const Pl=ds({randomUniform_:function(e,t=0,n=1,r="float32",s){const a=ia(e,r),o=new Cl(t,n,null,s);for(let e=0;e<a.values.length;e++)a.values[e]=o.nextValue();return a.toTensor()}});
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
 */function Vl(e,t,n=1,r="float32"){if(0===n)throw new Error("Cannot have a step of zero");const s={start:e,stop:t,step:n,dtype:r};return ts.runKernel(_t,{},s)}
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
 */const ql=ds({reciprocal_:function(e){const t={x:cs(e,"x","reciprocal")};return ts.runKernel(At,t)}});
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
 */const Wl=ds({relu_:function(e){const t={x:cs(e,"x","relu")};return ts.runKernel($t,t)}});
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
 */const Ul=ds({relu6_:function(e){const t={x:cs(e,"x","relu6")};return ts.runKernel(Rt,t)}});
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
 */const jl=ds({reverse_:function(e,t){const n={x:cs(e,"x","reverse")},r={dims:t};return ts.runKernel(Ft,n,r)}});
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
 */const Gl=ds({reverse1d_:function(e){const t=cs(e,"x","reverse");return l(1===t.rank,(()=>`Error in reverse1D: x must be rank 1 but got rank ${t.rank}.`)),jl(t,0)}});
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
 */const Kl=ds({reverse2d_:function(e,t){const n=cs(e,"x","reverse");return l(2===n.rank,(()=>`Error in reverse2D: x must be rank 2 but got rank ${n.rank}.`)),jl(n,t)}});
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
 */const Hl=ds({reverse3d_:function(e,t){const n=cs(e,"x","reverse");return l(3===n.rank,(()=>`Error in reverse3D: x must be rank 3 but got rank ${n.rank}.`)),jl(n,t)}});
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
 */const Zl=ds({reverse4d_:function(e,t){const n=cs(e,"x","reverse");return l(4===n.rank,(()=>`Error in reverse4D: x must be rank 4 but got rank ${n.rank}.`)),jl(n,t)}});
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
 */const Jl=ds({round_:function(e){const t={x:cs(e,"x","round")};return ts.runKernel(Ct,t)}});
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
 */const Ql=ds({rsqrt_:function(e){const t={x:cs(e,"x","rsqrt","float32")};return ts.runKernel(Bt,t)}});
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
 */const Xl=ds({selu_:function(e){const t={x:cs(e,"x","selu")};return ts.runKernel(Vt,t)}});const Yl=ds({separableConv2d_:function(e,t,n,r,s,a=[1,1],o="NHWC"){const i=cs(e,"x","separableConv2d"),u=cs(t,"depthwiseFilter","separableConv2d"),c=cs(n,"pointwiseFilter","separableConv2d");let p=i,h=!1;if(3===i.rank&&(h=!0,p=Qo(i,[1,i.shape[0],i.shape[1],i.shape[2]])),"NCHW"===o)throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");l(4===p.rank,(()=>`Error in separableConv2d: input must be rank 4, but got rank ${p.rank}.`)),l(4===u.rank,(()=>`Error in separableConv2d: depthwise filter must be rank 4, but got rank ${u.rank}.`)),l(4===c.rank,(()=>`Error in separableConv2d: pointwise filter must be rank 4, but got rank ${u.rank}.`)),l(1===c.shape[0],(()=>`Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got ${c.shape[0]}.`)),l(1===c.shape[1],(()=>`Error in separableConv2d: the second dimension of pointwise filter must be 1, but got ${c.shape[1]}.`));const d=u.shape[2],m=u.shape[3];l(c.shape[2]===d*m,(()=>`Error in separableConv2d: the third dimension of pointwise filter must be ${d*m}, but got ${c.shape[2]}.`));const f=Di(p,u,r,s,o,a),g=xi(f,c,1,"valid",o);return h?Qo(g,[g.shape[1],g.shape[2],g.shape[3]]):g}});
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
 */const ec=async function(e,t){const n=cs(e,"x","setdiff1d"),r=cs(t,"y","setdiff1d");l(n.dtype===r.dtype,(()=>`x and y should have the same dtype, but got x (${n.dtype}) and y (${r.dtype}).`)),l(1===n.rank,(()=>`x should be 1D tensor, but got x (${n.shape}).`)),l(1===r.rank,(()=>`y should be 1D tensor, but got y (${r.shape}).`));const s=await n.data(),a=await r.data(),o=new Set(a);let i=0;for(let e=0;e<s.length;e++)o.has(s[e])||i++;const u=new Rr([i],n.dtype),c=new Rr([i],"int32");for(let e=0,t=0;e<s.length;e++)o.has(s[e])||(u.values[t]=s[e],c.values[t]=e,t++);return[u.toTensor(),c.toTensor()]};
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
 */const tc=ds({sign_:function(e){const t={x:cs(e,"x","sign")};return ts.runKernel(Ut,t)}});
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
 */const nc=ds({sin_:function(e){const t={x:cs(e,"x","sin","float32")};return ts.runKernel("Sin",t)}});
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
 */const rc=ds({sinh_:function(e){const t={x:cs(e,"x","sinh")};return ts.runKernel(Wt,t)}});
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
 */const sc=ds({slice1d_:function(e,t,n){const r=cs(e,"x","slice1d");return l(1===r.rank,(()=>`slice1d expects a rank-1 tensor, but got a rank-${r.rank} tensor`)),ni(r,[t],[n])}});
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
 */const ac=ds({slice2d_:function(e,t,n){const r=cs(e,"x","slice2d");return l(2===r.rank,(()=>`slice2d expects a rank-2 tensor, but got a rank-${r.rank} tensor`)),ni(r,t,n)}});
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
 */const oc=ds({slice3d_:function(e,t,n){const r=cs(e,"x","slice3d");return l(3===r.rank,(()=>`slice3d expects a rank-3 tensor, but got a rank-${r.rank} tensor`)),ni(r,t,n)}});
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
 */const ic=ds({slice4d_:function(e,t,n){const r=cs(e,"x","slice4d");return l(4===r.rank,(()=>`slice4d expects a rank-4 tensor, but got a rank-${r.rank} tensor`)),ni(r,t,n)}});
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
 */const uc=ds({softmax_:function(e,t=-1){const n=cs(e,"logits","softmax","float32");if(-1===t&&(t=n.rank-1),t!==n.rank-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and dim was ${t}`);const r={logits:n},s={dim:t};return ts.runKernel(Jt,r,s)}});
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
 */const lc=ds({fft_:function(e){l("complex64"===e.dtype,(()=>`The dtype for tf.spectral.fft() must be complex64 but got ${e.dtype}.`));const t={input:e};return ts.runKernel("FFT",t)}});
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
 */const cc=ds({ifft_:function(e){l("complex64"===e.dtype,(()=>`The dtype for tf.spectral.ifft() must be complex64 but got ${e.dtype}.`));const t={input:e};return ts.runKernel(Ke,t)}});
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
 */const pc=ds({irfft_:function(e){const t=e.shape[e.shape.length-1],n=e.size/t;let r;if(t<=2){const s=Qo(e,[n,t]);r=cc(s)}else{const s=[n,2*(t-1)],a=Qo(Da(e),[n,t]),o=Qo(Ma(e),[n,t]),i=jl(ni(a,[0,1],[n,t-2]),1),u=To(jl(ni(o,[0,1],[n,t-2]),1),Ji(-1)),l=ei([a,i],1),c=ei([o,u],1),p=Qo(ms(l,c),[s[0],s[1]]);r=cc(p)}if(r=Da(r),3===e.rank&&0!==e.shape[0]){const t=r,n=e.shape[0];r=Qo(r,[n,r.shape[0]/n,r.shape[1]]),t.dispose()}return r}});
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
 */const hc=ds({split_:function(e,t,n=0){const r={x:cs(e,"x","split")},s={numOrSizeSplits:t,axis:n};return ts.runKernel(Zt,r,s)}});
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
 */const dc=ds({rfft_:function(e,t){l("float32"===e.dtype,(()=>`The dtype for rfft() must be real value but got ${e.dtype}`));let n=e.shape[e.shape.length-1];const r=e.size/n;let s;if(null!=t&&t<n){const r=e.shape.map((e=>0)),a=e.shape.map((e=>e));a[e.shape.length-1]=t,s=ni(e,r,a),n=t}else if(null!=t&&t>n){const r=e.shape.map((e=>e));r[e.shape.length-1]=t-n,s=ei([e,qu(r)],e.shape.length-1),n=t}else s=e;const a=Li(s),o=Qo(ms(s,a),[r,n]),i=lc(o),u=Math.floor(n/2)+1,c=Da(i),p=Ma(i),h=hc(c,[u,n-u],c.shape.length-1),d=hc(p,[u,n-u],p.shape.length-1),m=s.shape.slice();return m[s.shape.length-1]=u,Qo(ms(h[0],d[0]),m)}});
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
 */const mc=ds({squaredDifference_:function(e,t){let n=cs(e,"a","squaredDifference"),r=cs(t,"b","squaredDifference");[n,r]=Gr(n,r),za(n.shape,r.shape);const s={a:n,b:r};return ts.runKernel(nn,s,{})}});
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
 */const fc=ds({squeeze_:function(e,t){const n=cs(e,"x","squeeze","string_or_numeric");return Qo(n,b(n.shape,t).newShape)}});
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
 */const gc=ds({stack_:function(e,t=0){const n=ps(e,"tensors","stack","string_or_numeric");l(n.length>=1,(()=>"Pass at least one tensor to tf.stack")),n.length>0&&l(t<=n[0].rank,(()=>"Axis must be <= rank of the tensor"));const r=n,s={axis:t};return ts.runKernel(vt,r,s)}});
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
 */const yc=ds({step_:function(e,t=0){const n={x:cs(e,"x","step")},r={alpha:t};return ts.runKernel(yn,n,r)}});
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
 */const bc=ds({stridedSlice_:function(e,t,n,r,s=0,a=0,o=0,i=0,u=0){const l={x:cs(e,"x","stridedSlice","string_or_numeric")},c={begin:t,end:n,strides:r,beginMask:s,endMask:a,ellipsisMask:o,newAxisMask:i,shrinkAxisMask:u};return ts.runKernel(rn,l,c)}});
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
 */const wc=ds({tan_:function(e){const t={x:cs(e,"x","tan","float32")};return ts.runKernel("Tan",t)}});
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
 */function xc(e,t){p(e);const n=is(e,t);if(1!==n.length)throw new Error("tensor1d() requires values to be a flat/TypedArray");return fs(e,null,n,t)}
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
 */function vc(e,t,n){if(p(e),null!=t&&2!==t.length)throw new Error("tensor2d() requires shape to have two numbers");const r=is(e,n);if(2!==r.length&&1!==r.length)throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");if(1===r.length&&null==t)throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");return fs(e,t,r,n)}
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
 */function Nc(e,t,n){if(p(e),null!=t&&4!==t.length)throw new Error("tensor4d() requires shape to have four numbers");const r=is(e,n);if(4!==r.length&&1!==r.length)throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");if(1===r.length&&null==t)throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");return fs(e,t,r,n)}
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
 */function Sc(e,t,n){if(p(e),null!=t&&5!==t.length)throw new Error("tensor5d() requires shape to have five numbers");const r=is(e,n);if(5!==r.length&&1!==r.length)throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");if(1===r.length&&null==t)throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");return fs(e,t,r,n)}
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
 */function kc(e,t,n){if(p(e),null!=t&&6!==t.length)throw new Error("tensor6d() requires shape to have six numbers");const r=is(e,n);if(6!==r.length&&1!==r.length)throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");if(1===r.length&&null==t)throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");return fs(e,t=t||r,r,n)}
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
 */const Tc=ds({topk_:function(e,t=1,n=!0){const r=cs(e,"x","topk");if(0===r.rank)throw new Error("topk() expects the input to be of rank 1 or higher");const s=r.shape[r.shape.length-1];if(t<0)throw new Error(`'k' passed to topk() must be >= 0 but got ${t}`);if(t>s)throw new Error(`'k' passed to topk() must be <= the last dimension (${s}) but got ${t}`);const a={x:r},o={k:t,sorted:n},[i,u]=ts.runKernel(cn,a,o);return{values:i,indices:u}}});
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
 */const Ec=ds({truncatedNormal_:function(e,t=0,n=1,r,s){if(null!=r&&"bool"===r)throw new Error("Unsupported data type $ { dtype }");const a=new Rl(t,n,r,!0,s),o=ia(e,r);for(let e=0;e<o.values.length;e++)o.values[e]=a.nextValue();return o.toTensor()}});
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
 */const _c=ds({unique_:function(e,t=0){const n=cs(e,"x","unique","string_or_numeric");l(n.rank>0,(()=>"The input tensor must be at least 1D"));const r={x:n},s={axis:t},[a,o]=ts.runKernel(dn,r,s);return{values:a,indices:o}}});
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
 */const Ic=ds({unsortedSegmentSum_:function(e,t,n){const r=cs(e,"x","unsortedSegmentSum"),s=cs(t,"segmentIds","unsortedSegmentSum","int32");l(f(n),(()=>"numSegments must be of dtype int"));const a={x:r,segmentIds:s},o={numSegments:n};return ts.runKernel(fn,a,o)}});
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
 */const Ac=ds({unstack_:function(e,t=0){const n=cs(e,"x","unstack","string_or_numeric");l(t>=-n.shape.length&&t<n.shape.length,(()=>`Axis = ${t} is not in [-${n.shape.length}, ${n.shape.length})`));const r={value:n},s={axis:t};return ts.runKernel(mn,r,s)}});
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
 */function $c(e,t){return Fu(e,t,"right")}
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
 */function Mc(e,t=!0,n,r){return ts.makeVariable(e,t,n,r)}
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
 */function Oc(e,t){const n=[];for(let e=0;e<t.length;e++)t[e]&&n.push(e);const r=ia(e,"int32"),s=ia([n.length,e.length],"int32");for(let t=0;t<n.length;t++){const a=r.indexToLoc(n[t]),o=t*e.length;s.values.set(a,o)}return s.toTensor()}
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
 */const Dc=async function(e){const t=cs(e,"condition","whereAsync","bool"),n=await t.data(),r=Oc(t.shape,n);return e!==t&&t.dispose(),r};
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
 */const Rc=async function(e,t,n){const r=cs(e,"tensor","boolMask"),s=cs(t,"mask","boolMask","bool"),a=null==n?0:n,o=s.rank,i=r.shape;l(o>0,(()=>"mask cannot be scalar")),c(i.slice(a,a+o),s.shape,"mask's shape must match the first K dimensions of tensor's shape,");let u=1;for(let e=a;e<a+o;e++)u*=i[e];const p=i.slice(0,a).concat([u],i.slice(a+o)),h=Qo(r,p),d=Qo(s,[-1]),m=await Dc(d),f=fc(m,[1]),g=lu(h,f,a);return e!==r&&r.dispose(),t!==s&&s.dispose(),f.dispose(),h.dispose(),d.dispose(),m.dispose(),g};
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
 */const Fc=ds({movingAverage_:function(e,t,n,r,s=!0){const a=cs(e,"v","movingAverage"),o=cs(t,"x","movingAverage"),i=cs(n,"decay","movingAverage");Kr(a,o),l(m(a.shape,o.shape),(()=>"Shape mismatch in v and x"));const u=Ji(1),c=_u(u,i);let p=To(_u(o,a),c);if(s){l(null!=r,(()=>"When using zeroDebias: true, step is required."));const e=cs(r,"step","movingAverage");p=ko(p,_u(u,Zi(i,e)))}return No(a,p)}});
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
 */const Cc=ds({scatterND_:function(e,t,n){const r=cs(e,"indices","scatterND","int32"),s=cs(t,"updates","scatterND");Ja(s,r,n);const a={indices:r,updates:s},o={shape:n};return ts.runKernel(Lt,a,o)}});const Bc=ds({sparseToDense_:
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
function(e,t,n,r=0){const s=cs(e,"sparseIndices","sparseToDense","int32"),a=cs(t,"sparseValues","sparseToDense","string_or_numeric"),o=cs(r,"defaultValue","sparseToDense",a.dtype);!function(e,t,n,r){if("int32"!==e.dtype)throw new Error(`tf.sparseToDense() expects the indices to be int32 type, but the dtype was ${e.dtype}.`);if(e.rank>2)throw new Error(`sparseIndices should be a scalar, vector, or matrix, but got shape ${e.shape}.`);const s=e.rank>0?e.shape[0]:1,a=e.rank>1?e.shape[1]:1;if(n.length!==a)throw new Error(`outputShape has incorrect number of elements:, ${n.length}, should be: ${a}.`);const o=t.size;if(0!==t.rank&&(1!==t.rank||o!==s))throw new Error(`sparseValues has incorrect shape ${t.shape}, should be [] or [${s}]`);if(t.dtype!==r.dtype)throw new Error("sparseValues.dtype must match defaultValues.dtype")}(s,a,n,o);const i={sparseIndices:s,sparseValues:a,defaultValue:o},u={outputShape:n};return ts.runKernel(tn,i,u)}});
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
 */const Lc=ds({gatherND_:function(e,t){const n=cs(t,"indices","gatherND","int32"),r={params:cs(e,"x","gatherND","string_or_numeric"),indices:n};return ts.runKernel(We,r)}});
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
 */const zc=ds({dropout_:
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
function(e,t,n,r){const s=cs(e,"x","dropout");if(l("float32"===s.dtype,(()=>`x has to be a floating point tensor since it's going to be scaled, but got a ${s.dtype} tensor instead.`)),l(t>=0&&t<1,(()=>`rate must be a float in the range [0, 1), but got ${t}.`)),0===t)return e instanceof Br?s.clone():s;const a=function(e,t){if(null==t)return e.shape.slice();if(m(e.shape,t))return t;if(e.shape.length===t.length){const n=[];for(let r=0;r<e.shape.length;r++)null==t[r]&&null!=e.shape[r]?n.push(e.shape[r]):n.push(t[r]);return n}return t}(s,n),o=1-t,i=ko(uu(No(Pl(a,0,1,"float32",r),o)),o);return To(s,i)}});
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
 */function Pc(e){return Math.floor(Math.pow(2,Math.ceil(Math.log(e)/Math.log(2))))}function Vc(e,t,n){const r=1-e%2,s=new Float32Array(e);for(let a=0;a<e;++a){const o=2*Math.PI*a/(e+r-1);s[a]=t-n*Math.cos(o)}return xc(s,"float32")}
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
 */const qc=async function(e,t,n=1){const r=cs(e,"predictions","inTopK"),s=cs(t,"targets","inTopK");l(r.rank>1,(()=>`inTopK() expects the predictions to be of rank 2 or higher, but got ${r.rank}`)),l(r.rank-1===s.rank,(()=>`predictions rank should be 1 larger than targets rank, but got predictions rank ${r.rank} and targets rank ${s.rank}`)),c(r.shape.slice(0,r.shape.length-1),s.shape,"predictions's shape should be align with the targets' shape, except the last dimension.");const a=r.shape[r.shape.length-1];l(n>0&&n<=a,(()=>`'k' passed to inTopK() must be > 0 && <= the predictions last dimension (${a}), but got ${n}`));const o=await r.data(),i=await s.data(),[u,p]=[o.length/a,a],h=w("bool",u);for(let e=0;e<u;e++){const t=e*p,r=o.subarray(t,t+p),s=[];for(let e=0;e<r.length;e++)s.push({value:r[e],index:e});s.sort(((e,t)=>t.value-e.value)),h[e]=0;for(let t=0;t<n;t++)if(s[t].index===i[e]){h[e]=1;break}}return e!==r&&r.dispose(),t!==s&&s.dispose(),gs(h,s.shape,"bool")};
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
 */const Wc=ds({conv2DBackpropFilter_:function(e,t,n,r,s,a="NHWC",o){let i=e;3===e.rank&&(i=Qo(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let u=t;3===u.rank&&(u=Qo(t,[1,t.shape[0],t.shape[1],t.shape[2]])),l(4===i.rank,(()=>`Error in conv2dDerFilter: input must be rank 4, but got shape ${i.shape}.`)),l(4===u.rank,(()=>`Error in conv2dDerFilter: dy must be rank 4, but got shape ${u.shape}.`)),l(4===n.length,(()=>`Error in conv2dDerFilter: filterShape must be length 4, but got ${n}.`));const c="NHWC"===a?i.shape[3]:i.shape[1],p="NHWC"===a?u.shape[3]:u.shape[1];l(c===n[2],(()=>`Error in conv2dDerFilter: depth of input ${c}) must match input depth in filter (${n[2]}.`)),l(p===n[3],(()=>`Error in conv2dDerFilter: depth of dy (${p}) must match output depth for filter (${n[3]}).`)),Jo("conv2dDerFilter",s,o);const h={x:i,dy:u},d={strides:r,pad:s,dataFormat:a,dimRoundingMode:o,filterShape:n};return ts.runKernel(ye,h,d)}});
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
 */function Uc(e,t,n){if(null==n||"linear"===n)return e;if("relu"===n)return To(e,yc(t));throw new Error(`Cannot compute gradient for fused activation ${n}.`)}function jc(e,t){let n=t;const r=La(e.shape,t.shape);return r.length>0&&(n=Yi(n,r)),Qo(n,e.shape)}function Gc(e,t,n,r){if("linear"===t)return e;if("relu"===t)return Wl(e);if("elu"===t)return qi(e);if("relu6"===t)return Ul(e);if("prelu"===t)return il(e,n);if("leakyrelu"===t)return fu(e,r);if("sigmoid"===t)return ti(e);throw new Error(`Unknown fused activation ${t}.`)}const Kc=(e,t)=>!(e>0)||"linear"===t;
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
 */const Hc=ds({fusedConv2d_:function({x:e,filter:t,strides:n,pad:r,dataFormat:s="NHWC",dilations:a=[1,1],dimRoundingMode:o,bias:i,activation:u="linear",preluActivationWeights:c,leakyreluAlpha:p}){if(u=u||"linear",!1===Kc(ts.state.gradientDepth,u)){l("NHWC"===s,(()=>`Error in fused conv2d: got dataFormat of ${s} but only NHWC is currently supported for the case of gradient depth is 0 and the activation is not linear.`));let h=xi(e,t,n,r,s,a,o);return null!=i&&(h=No(h,i)),Gc(h,u,c,p)}const h=cs(e,"x","conv2d","float32"),d=cs(t,"filter","conv2d","float32");let m=h,f=!1;3===h.rank&&(f=!0,m=Qo(h,[1,h.shape[0],h.shape[1],h.shape[2]])),l(4===m.rank,(()=>`Error in fused conv2d: input must be rank 4, but got rank ${m.rank}.`)),l(4===d.rank,(()=>`Error in fused conv2d: filter must be rank 4, but got rank ${d.rank}.`)),Jo("fused conv2d",r,o);const g="NHWC"===s?m.shape[3]:m.shape[1];l(d.shape[2]===g,(()=>`Error in conv2d: depth of input (${g}) must match input depth for filter ${d.shape[2]}.`)),l(Ho(n,a),(()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`));const y=Po(m.shape,d.shape,n,a,r,o);let b,w;if(null!=i&&(b=cs(i,"bias","fused conv2d"),[b]=Gr(b,h),"NHWC"===s?za(y.outShape,b.shape):(l(b.shape.length<=1,(()=>`Error in fused conv2d: only supports scalar or 1-D Tensor bias for NCHW format but got the bias of rank-${b.shape.length}.`)),l(0===b.shape.length||b.shape[0]===y.outChannels||1===b.shape[0],(()=>`Error in fused conv2d: bias shape (${b.shape}) is not compatible with the number of output channels (${y.outChannels})`)))),null!=c){const e=c.shape;if(l(e.length<=1||3===e.length,(()=>`Error in fused conv2d: only supports scalar, 1-D Tensor or 3-D Tensor PReLU activation weights but got a tensor of rank-${e.length}.`)),1===e.length)l(1===e[0]||e[0]===y.outChannels,(()=>`Error in fused conv2d: PReLU activation weights (${e}) is not compatible with the number of output channels (${y.outChannels}).`));else if(3===e.length)try{za(e,y.outShape)}catch(t){const n=`Error in fused conv2d: PReLU activation weights (${e}) is not compatible with the output shape of the conv2d (${y.outShape}).`;throw Error(n)}w=cs(c,"prelu weights","fused conv2d")}const x=(e,t)=>{l("NHWC"===s,(()=>`Error in gradient of fused conv2D: got dataFormat of ${s} but only NHWC is currently supported.`));const[o,i,c,p]=t,h=Uc(e,c,u);l(Ko(a),(()=>`Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${a}'`));const d=[Ni(i.shape,h,o,n,r),Wc(i,h,o.shape,n,r)];if(null!=p){const e=jc(p,h);d.push(e)}return d},v={x:m,filter:d,bias:b,preluActivationWeights:w},N={strides:n,pad:r,dataFormat:s,dilations:a,dimRoundingMode:o,activation:u,leakyreluAlpha:p};if(null==i){const e=Su(((e,t,n)=>{let r=ts.runKernel(vn,v,N);return n([t,e,r]),f&&(r=Qo(r,[r.shape[1],r.shape[2],r.shape[3]])),{value:r,gradFunc:x}}));return e(m,d)}{const e=Su(((e,t,n,r)=>{let s=ts.runKernel(vn,v,N);return r([t,e,s,n]),f&&(s=Qo(s,[s.shape[1],s.shape[2],s.shape[3]])),{value:s,gradFunc:x}}));return e(m,d,b)}}});
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
 */const Zc=ds({depthwiseConv2dNativeBackpropFilter_:function(e,t,n,r,s,a=[1,1],o){let i=e;3===e.rank&&(i=Qo(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let u=t;3===u.rank&&(u=Qo(t,[1,t.shape[0],t.shape[1],t.shape[2]]));const l={x:i,dy:u},c={strides:r,pad:s,dimRoundingMode:o,dilations:a,filterShape:n};return ts.runKernel(Ie,l,c)}});
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
 */const Jc=ds({depthwiseConv2dNativeBackpropInput_:function(e,t,n,r,s,a=[1,1],o){let i=t,u=!1;3===t.rank&&(u=!0,i=Qo(t,[1,t.shape[0],t.shape[1],t.shape[2]]));const l={dy:i,filter:n},c={strides:r,pad:s,dimRoundingMode:o,dilations:a,inputShape:e},p=ts.runKernel(Ae,l,c);return u?Qo(p,[p.shape[1],p.shape[2],p.shape[3]]):p}});
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
 */const Qc=ds({fusedDepthwiseConv2d_:function({x:e,filter:t,strides:n,pad:r,dataFormat:s="NHWC",dilations:a=[1,1],dimRoundingMode:o,bias:i,activation:u="linear",preluActivationWeights:c,leakyreluAlpha:p}){if(!1===Kc(ts.state.gradientDepth,u)){let l=Di(e,t,n,r,s,a,o);return null!=i&&(l=No(l,i)),Gc(l,u,c,p)}const h=cs(e,"x","depthwiseConv2d","float32"),d=cs(t,"filter","depthwiseConv2d","float32");let m=h,f=!1;3===h.rank&&(f=!0,m=Qo(h,[1,h.shape[0],h.shape[1],h.shape[2]])),l(4===m.rank,(()=>`Error in fused depthwiseConv2d: input must be rank 4, but got rank ${m.rank}.`)),l(4===d.rank,(()=>`Error in fused depthwiseConv2d: filter must be rank 4, but got rank ${d.rank}.`)),l(m.shape[3]===d.shape[2],(()=>`Error in fused depthwiseConv2d: number of input channels (${m.shape[3]}) must match the inChannels dimension in filter ${d.shape[2]}.`)),null==a&&(a=[1,1]),l(Ho(n,a),(()=>`Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`)),Jo("fused depthwiseConv2d",r,o);const g=Po(m.shape,d.shape,n,a,r,o,!0);let y,b;null!=i&&(y=cs(i,"bias","fused conv2d"),[y]=Gr(y,h),za(g.outShape,y.shape)),null!=c&&(b=cs(c,"prelu weights","fused depthwiseConv2d"));const w=(e,t)=>{l(Ko(a),(()=>`Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '${a}'`));const[s,i,c,p]=t,h=Uc(e,c,u),d=Jc(i.shape,h,s,n,r,a,o),m=Zc(i,h,s.shape,n,r,a,o);if(null!=p){return[d,m,jc(y,h)]}return[d,m]},x={x:m,filter:d,bias:y,preluActivationWeights:b},v={strides:n,pad:r,dataFormat:s,dilations:a,dimRoundingMode:o,activation:u,leakyreluAlpha:p};if(null==i){const e=Su(((e,t,n)=>{let r=ts.runKernel(Nn,x,v);return n([t,e,r]),f&&(r=Qo(r,[r.shape[1],r.shape[2],r.shape[3]])),{value:r,gradFunc:w}}));return e(m,d)}{const e=Su(((e,t,n,r)=>{let s=ts.runKernel(Nn,x,v);return r([t,e,s,n]),f&&(s=Qo(s,[s.shape[1],s.shape[2],s.shape[3]])),{value:s,gradFunc:w}}));return e(m,d,y)}}});
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
 */const Xc=ds({fusedMatMul_:function({a:e,b:t,transposeA:n=!1,transposeB:r=!1,bias:s,activation:a="linear",preluActivationWeights:o,leakyreluAlpha:i=.2}){if(!1===Kc(ts.state.gradientDepth,a)){let u=Ea(e,t,n,r);return null!=s&&(u=No(u,s)),Gc(u,a,o,i)}let u=cs(e,"a","fused matMul"),c=cs(t,"b","fused matMul");[u,c]=Gr(u,c);const p=n?u.shape[u.rank-2]:u.shape[u.rank-1],h=r?c.shape[c.rank-1]:c.shape[c.rank-2],m=n?u.shape[u.rank-1]:u.shape[u.rank-2],f=r?c.shape[c.rank-2]:c.shape[c.rank-1],g=u.shape.slice(0,-2),y=c.shape.slice(0,-2),b=d(g),w=d(y);l(p===h,(()=>`Error in fused matMul: inner shapes (${p}) and (${h}) of Tensors with shapes ${u.shape} and ${c.shape} and transposeA=${n} and transposeB=${r} must match.`));const x=za(u.shape.slice(0,-2),c.shape.slice(0,-2)).concat([m,f]),v=Qo(u,n?[b,p,m]:[b,m,p]),N=Qo(c,r?[w,f,h]:[w,h,f]);let S,k;null!=s&&(S=cs(s,"bias","fused matMul"),[S]=Gr(S,u),za(x,S.shape)),null!=o&&(k=cs(o,"prelu weights","fused matMul"));const T=(e,t)=>{const[o,i,u,l]=t,c=Uc(Qo(e,u.shape),u,a);let p,h;if(n||r?!n&&r?(p=Ea(c,i,!1,!1),h=Ea(c,o,!0,!1)):n&&!r?(p=Ea(i,c,!1,!0),h=Ea(o,c,!1,!1)):(p=Ea(i,c,!0,!0),h=Ea(c,o,!0,!0)):(p=Ea(c,i,!1,!0),h=Ea(o,c,!0,!1)),null!=s){return[p,h,jc(l,c)]}return[p,h]},E={a:v,b:N,bias:S,preluActivationWeights:k},_={transposeA:n,transposeB:r,activation:a,leakyreluAlpha:i};if(null==s){const e=Su(((e,t,n)=>{const r=ts.runKernel(xn,E,_);return n([e,t,r]),{value:Qo(r,x),gradFunc:T}}));return e(v,N)}{const e=Su(((e,t,n,r)=>{const s=ts.runKernel(xn,E,_);return r([e,t,s,n]),{value:Qo(s,x),gradFunc:T}}));return e(v,N,S)}}});
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
 */var Yc=Object.freeze({__proto__:null,conv2d:Hc,depthwiseConv2d:Qc,matMul:Xc});
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
 */const ep=ds({hammingWindow_:function(e){return Vc(e,.54,.46)}});
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
 */const tp=ds({hannWindow_:function(e){return Vc(e,.5,.5)}});
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
 */const np=ds({frame_:function(e,t,n,r=!1,s=0){let a=0;const o=[];for(;a+t<=e.size;)o.push(ni(e,a,t)),a+=n;if(r)for(;a<e.size;){const r=a+t-e.size,i=ei([ni(e,a,t-r),mi([r],s)]);o.push(i),a+=n}return 0===o.length?vc([],[0,t]):Qo(ei(o),[o.length,t])}});
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
 */const rp=ds({stft_:function(e,t,n,r,s=tp){null==r&&(r=Pc(t));const a=np(e,t,n),o=To(a,s(t));return dc(o,r)}});
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
 */const sp=ds({cropAndResize_:function(e,t,n,r,s="bilinear",a=0){const o=cs(e,"image","cropAndResize"),i=cs(t,"boxes","cropAndResize","float32"),u=cs(n,"boxInd","cropAndResize","int32"),c=i.shape[0];l(4===o.rank,(()=>`Error in cropAndResize: image must be rank 4,but got rank ${o.rank}.`)),l(2===i.rank&&4===i.shape[1],(()=>`Error in cropAndResize: boxes must be have size [${c},4] but had shape ${i.shape}.`)),l(1===u.rank&&u.shape[0]===c,(()=>`Error in cropAndResize: boxInd must be have size [${c}] but had shape ${i.shape}.`)),l(2===r.length,(()=>`Error in cropAndResize: cropSize must be of length 2, but got length ${r.length}.`)),l(r[0]>=1&&r[1]>=1,(()=>`cropSize must be atleast [1,1], but was ${r}`)),l("bilinear"===s||"nearest"===s,(()=>`method must be bilinear or nearest, but was ${s}`));const p={image:o,boxes:i,boxInd:u},h={method:s,extrapolationValue:a,cropSize:r};return ts.runKernel(ke,p,h)}});
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
 */const ap=ds({flipLeftRight_:function(e){const t=cs(e,"image","flipLeftRight","float32");l(4===t.rank,(()=>`Error in flipLeftRight: image must be rank 4,but got rank ${t.rank}.`));const n={image:t};return ts.runKernel(Le,n,{})}});
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
 */const op=ds({grayscaleToRGB_:function(e){const t=cs(e,"image","grayscaleToRGB"),n=t.rank-1,r=t.shape[n];l(t.rank>=2,(()=>`Error in grayscaleToRGB: images must be at least rank 2, but got rank ${t.rank}.`)),l(1===r,(()=>`Error in grayscaleToRGB: last dimension of a grayscale image should be size 1, but got size ${r}.`));const s=new Array(t.rank);return s.fill(1,0,n),s[n]=3,ou(t,s)}});
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
 */const ip=ds({rotateWithOffset_:function(e,t,n=0,r=.5){const s=cs(e,"image","rotateWithOffset","float32");l(4===s.rank,(()=>`Error in rotateWithOffset: image must be rank 4,but got rank ${s.rank}.`));const a={image:s},o={radians:t,fillValue:n,center:r};return ts.runKernel(wn,a,o)}});
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
 */function up(e,t,n,r,s,a){null==r&&(r=.5),null==s&&(s=Number.NEGATIVE_INFINITY),null==a&&(a=0);const o=e.shape[0];return n=Math.min(n,o),l(0<=r&&r<=1,(()=>`iouThreshold must be in [0, 1], but was '${r}'`)),l(2===e.rank,(()=>`boxes must be a 2D tensor, but was of rank '${e.rank}'`)),l(4===e.shape[1],(()=>`boxes must have 4 columns, but 2nd dimension was ${e.shape[1]}`)),l(1===t.rank,(()=>"scores must be a 1D tensor")),l(t.shape[0]===o,(()=>`scores has incompatible shape with boxes. Expected ${o}, but was ${t.shape[0]}`)),l(0<=a&&a<=1,(()=>`softNmsSigma must be in [0, 1], but was '${a}'`)),{maxOutputSize:n,iouThreshold:r,scoreThreshold:s,softNmsSigma:a}}
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
 */const lp=ds({nonMaxSuppression_:function(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY){const a=cs(e,"boxes","nonMaxSuppression","float32"),o=cs(t,"scores","nonMaxSuppression","float32"),i=up(a,o,n,r,s),u={maxOutputSize:n=i.maxOutputSize,iouThreshold:r=i.iouThreshold,scoreThreshold:s=i.scoreThreshold};return ts.runKernel(gt,{boxes:a,scores:o},u)}});
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
 */function cp(e,t,n){const r=function(e,t,n){return function(e,t,n){let r=0,s=e.length,a=0,o=!1;for(;r<s;){a=r+(s-r>>>1);const i=n(t,e[a]);i>0?r=a+1:(s=a,o=!i)}return o?r:-r-1}
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
 */(e,t,n||pp)}(e,t,n),s=r<0?-(r+1):r;e.splice(s,0,t)}function pp(e,t){return e>t?1:e<t?-1:0}function hp(e,t,n,r,s){return fp(e,t,n,r,s,0)}function dp(e,t,n,r,s,a){return fp(e,t,n,r,s,0,!1,a,!0)}function mp(e,t,n,r,s,a){return fp(e,t,n,r,s,a,!0)}function fp(e,t,n,r,s,a,o=!1,i=!1,u=!1){const l=[];for(let e=0;e<t.length;e++)t[e]>s&&l.push({score:t[e],boxIndex:e,suppressBeginIndex:0});l.sort(bp);const c=a>0?-.5/a:0,p=[],h=[];for(;p.length<n&&l.length>0;){const t=l.pop(),{score:n,boxIndex:a,suppressBeginIndex:o}=t;if(n<s)break;let i=!1;for(let n=p.length-1;n>=o;--n){const o=gp(e,a,p[n]);if(o>=r){i=!0;break}if(t.score=t.score*yp(r,c,o),t.score<=s)break}t.suppressBeginIndex=p.length,i||(t.score===n?(p.push(a),h.push(t.score)):t.score>s&&cp(l,t,bp))}const d=p.length,m=n-d;i&&m>0&&(p.push(...new Array(m).fill(0)),h.push(...new Array(m).fill(0)));const f={selectedIndices:p};return o&&(f.selectedScores=h),u&&(f.validOutputs=d),f}function gp(e,t,n){const r=e.subarray(4*t,4*t+4),s=e.subarray(4*n,4*n+4),a=Math.min(r[0],r[2]),o=Math.min(r[1],r[3]),i=Math.max(r[0],r[2]),u=Math.max(r[1],r[3]),l=Math.min(s[0],s[2]),c=Math.min(s[1],s[3]),p=Math.max(s[0],s[2]),h=Math.max(s[1],s[3]),d=(i-a)*(u-o),m=(p-l)*(h-c);if(d<=0||m<=0)return 0;const f=Math.max(a,l),g=Math.max(o,c),y=Math.min(i,p),b=Math.min(u,h),w=Math.max(y-f,0)*Math.max(b-g,0);return w/(d+m-w)}function yp(e,t,n){const r=Math.exp(t*n*n);return n<=e?r:0}function bp(e,t){return e.score-t.score||e.score===t.score&&t.boxIndex-e.boxIndex}
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
 */const wp=async function(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY){const a=cs(e,"boxes","nonMaxSuppressionAsync"),o=cs(t,"scores","nonMaxSuppressionAsync"),i=up(a,o,n,r,s);n=i.maxOutputSize,r=i.iouThreshold,s=i.scoreThreshold;const u=await Promise.all([a.data(),o.data()]),l=u[0],c=u[1],{selectedIndices:p}=hp(l,c,n,r,s);return a!==e&&a.dispose(),o!==t&&o.dispose(),xc(p,"int32")};
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
 */const xp=ds({nonMaxSuppressionWithScore_:function(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,a=0){const o=cs(e,"boxes","nonMaxSuppression"),i=cs(t,"scores","nonMaxSuppression"),u=up(o,i,n,r,s,a),l={boxes:o,scores:i},c={maxOutputSize:n=u.maxOutputSize,iouThreshold:r=u.iouThreshold,scoreThreshold:s=u.scoreThreshold,softNmsSigma:a=u.softNmsSigma},p=ts.runKernel(bt,l,c);return{selectedIndices:p[0],selectedScores:p[1]}}});
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
 */const vp=async function(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,a=0){const o=cs(e,"boxes","nonMaxSuppressionAsync"),i=cs(t,"scores","nonMaxSuppressionAsync"),u=up(o,i,n,r,s,a);n=u.maxOutputSize,r=u.iouThreshold,s=u.scoreThreshold,a=u.softNmsSigma;const l=await Promise.all([o.data(),i.data()]),c=l[0],p=l[1],{selectedIndices:h,selectedScores:d}=mp(c,p,n,r,s,a);return o!==e&&o.dispose(),i!==t&&i.dispose(),{selectedIndices:xc(h,"int32"),selectedScores:xc(d)}};
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
 */const Np=ds({nonMaxSuppressionPadded_:function(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,a=!1){const o=cs(e,"boxes","nonMaxSuppression"),i=cs(t,"scores","nonMaxSuppression"),u=up(o,i,n,r,s,null),l={boxes:o,scores:i},c={maxOutputSize:u.maxOutputSize,iouThreshold:u.iouThreshold,scoreThreshold:u.scoreThreshold,padToMaxOutputSize:a},p=ts.runKernel(yt,l,c);return{selectedIndices:p[0],validOutputs:p[1]}}});
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
 */const Sp=async function(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,a=!1){const o=cs(e,"boxes","nonMaxSuppressionAsync"),i=cs(t,"scores","nonMaxSuppressionAsync"),u=up(o,i,n,r,s,null),l=u.maxOutputSize,c=u.iouThreshold,p=u.scoreThreshold,[h,d]=await Promise.all([o.data(),i.data()]),{selectedIndices:m,validOutputs:f}=dp(h,d,l,c,p,a);return o!==e&&o.dispose(),i!==t&&i.dispose(),{selectedIndices:xc(m,"int32"),validOutputs:Ji(f,"int32")}};
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
 */const kp=ds({resizeBilinear_:function(e,t,n=!1,r=!1){const s=cs(e,"images","resizeBilinear");l(3===s.rank||4===s.rank,(()=>`Error in resizeBilinear: x must be rank 3 or 4, but got rank ${s.rank}.`)),l(2===t.length,(()=>`Error in resizeBilinear: new shape must 2D, but got shape ${t}.`)),l(!1===r||!1===n,(()=>"Error in resizeBilinear: If halfPixelCenters is true, alignCorners must be false."));let a=s,o=!1;3===s.rank&&(o=!0,a=Qo(s,[1,s.shape[0],s.shape[1],s.shape[2]]));const i={images:a},u={alignCorners:n,halfPixelCenters:r,size:t},c=ts.runKernel(Dt,i,u);return o?Qo(c,[c.shape[1],c.shape[2],c.shape[3]]):c}});
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
 */const Tp=ds({resizeNearestNeighbor_:function(e,t,n=!1,r=!1){const s=cs(e,"images","resizeNearestNeighbor");l(3===s.rank||4===s.rank,(()=>`Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank ${s.rank}.`)),l(2===t.length,(()=>`Error in resizeNearestNeighbor: new shape must 2D, but got shape ${t}.`)),l("float32"===s.dtype||"int32"===s.dtype,(()=>"`images` must have `int32` or `float32` as dtype")),l(!1===r||!1===n,(()=>"Error in resizeNearestNeighbor: If halfPixelCenters is true, alignCorners must be false."));let a=s,o=!1;3===s.rank&&(o=!0,a=Qo(s,[1,s.shape[0],s.shape[1],s.shape[2]]));const i={images:a},u={alignCorners:n,halfPixelCenters:r,size:t},c=ts.runKernel(Ot,i,u);return o?Qo(c,[c.shape[1],c.shape[2],c.shape[3]]):c}});
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ep=ds({threshold_:function(e,t="binary",n=!1,r=.5){const s=cs(e,"image","threshold"),a=s.shape[0]*s.shape[1];let o,i,u,c,p=To(xc([r]),255);if(l(3===s.rank,(()=>`Error in threshold: image must be rank 3,but got rank ${s.rank}.`)),l(3===s.shape[2]||1===s.shape[2],(()=>`Error in threshold: image color channel must be equal to 3 or 1but got ${s.shape[2]}.`)),l("int32"===s.dtype||"float32"===s.dtype,(()=>`Error in dtype: image dtype must be int32 or float32,but got dtype ${s.dtype}.`)),l("otsu"===t||"binary"===t,(()=>`Method must be binary or otsu, but was ${t}`)),3===s.shape[2]){[o,i,u]=hc(s,[1,1,1],-1);const e=To(o,.2989),t=To(i,.587),n=To(u,.114);c=No(No(e,t),n)}else c=e;if("otsu"===t){p=function(e,t){let n,r,s,a,o,i,u=xc([-1]),l=xc([0]),c=xc([0]);for(let p=0;p<e.size-1;p++){n=ni(e,0,p+1),r=ni(e,p+1),o=ko(Yi(n),t),i=ko(Yi(r),t);const h=Yi(To(n,Vl(0,n.size)));s=ko(h,Yi(n));const d=mi(r.shape,n.size),m=No(Vl(0,r.size),d),f=To(r,m);a=ko(Yi(f),Yi(r));const g=_u(s,a),y=_u(s,a),b=To(o,i);c=To(To(b,g),y);const w=cu(c,l);l=Bi(w,c,l),u=Bi(w,xc([p]),u)}return u}(ci(ua(Jl(c),"int32"),gs([]),256),a)}const h=n?yu(c,p):cu(c,p);return ua(To(h,255),"int32")}});
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
 */const _p=ds({transform_:function(e,t,n="nearest",r="constant",s=0,a){const o=cs(e,"image","transform","float32"),i=cs(t,"transforms","transform","float32");l(4===o.rank,(()=>`Error in transform: image must be rank 4,but got rank ${o.rank}.`)),l(2===i.rank&&(i.shape[0]===o.shape[0]||1===i.shape[0])&&8===i.shape[1],(()=>"Error in transform: Input transform should be batch x 8 or 1 x 8")),l(null==a||2===a.length,(()=>`Error in transform: outputShape must be [height, width] or null, but got ${a}.`));const u={image:o,transforms:i},c={interpolation:n,fillMode:r,fillValue:s,outputShape:a};return ts.runKernel(pn,u,c)}});
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
 */const Ip=ds({bandPart_:function(e,t,n){l(t%1==0,(()=>`bandPart(): numLower must be an integer, got ${t}.`)),l(n%1==0,(()=>`bandPart(): numUpper must be an integer, got ${n}.`));const r=cs(e,"a","bandPart");l(r.rank>=2,(()=>`bandPart(): Rank must be at least 2, got ${r.rank}.`));const s=r.shape,[a,o]=r.shape.slice(-2);if(!(t<=a))throw new Error(`bandPart(): numLower (${t}) must not be greater than the number of rows (${a}).`);if(!(n<=o))throw new Error(`bandPart(): numUpper (${n}) must not be greater than the number of columns (${o}).`);t<0&&(t=a),n<0&&(n=o);const i=Qo(Vl(0,a,1,"int32"),[-1,1]),u=Vl(0,o,1,"int32"),c=_u(i,u),p=$u(yu(c,Ji(+t,"int32")),pu(c,Ji(-n,"int32"))),h=qu([a,o],r.dtype);return Qo(gc(Ac(Qo(r,[-1,a,o])).map((e=>Bi(p,e,h)))),s)}});
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
 */const Ap=ds({gramSchmidt_:function(e){let t;if(Array.isArray(e)){t=!1,l(null!=e&&e.length>0,(()=>"Gram-Schmidt process: input must not be null, undefined, or empty"));const n=e[0].shape[0];for(let t=1;t<e.length;++t)l(e[t].shape[0]===n,(()=>`Gram-Schmidt: Non-unique lengths found in the input vectors: (${e[t].shape[0]} vs. ${n})`))}else t=!0,e=hc(e,e.shape[0],0).map((e=>fc(e,[0])));l(e.length<=e[0].shape[0],(()=>`Gram-Schmidt: Number of vectors (${e.length}) exceeds number of dimensions (${e[0].shape[0]}).`));const n=[],r=e;for(let t=0;t<e.length;++t)n.push(ts.tidy((()=>{let e=r[t];if(t>0)for(let r=0;r<t;++r){const t=To(Yi(To(n[r],e)),n[r]);e=_u(e,t)}return ko(e,tu(e,"euclidean"))})));return t?gc(n,0):n}});
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
 */function $p(e,t=!1){return ts.tidy((()=>{l(2===e.shape.length,(()=>`qr2d() requires a 2D Tensor, but got a ${e.shape.length}D Tensor.`));const n=e.shape[0],r=e.shape[1];let s=iu(n),a=la(e);const o=vc([[1]],[1,1]);let i=la(o);const u=n>=r?r:n;for(let e=0;e<u;++e){const t=a,u=i,l=s;[i,a,s]=ts.tidy((()=>{const t=ni(a,[e,e],[n-e,1]),u=tu(t),l=ni(a,[e,e],[1,1]),c=Bi(cu(l,0),vc([[-1]]),vc([[1]])),p=_u(l,To(c,u)),h=ko(t,p);i=1===h.shape[0]?la(o):ei([o,ni(h,[1,0],[h.shape[0]-1,h.shape[1]])],0);const d=Oa(ko(Ea(c,p),u)),m=ni(a,[e,0],[n-e,r]),f=To(d,i),g=Ra(i);if(0===e)a=_u(m,Ea(f,Ea(g,m)));else{const t=_u(m,Ea(f,Ea(g,m)));a=ei([ni(a,[0,0],[e,r]),t],0)}const y=Ra(f),b=ni(s,[0,e],[n,s.shape[1]-e]);if(0===e)s=_u(b,Ea(Ea(b,i),y));else{const t=_u(b,Ea(Ea(b,i),y));s=ei([ni(s,[0,0],[n,e]),t],1)}return[i,a,s]})),Aa([t,u,l])}return!t&&n>r&&(s=ni(s,[0,0],[n,r]),a=ni(a,[0,0],[r,r])),[s,a]}))}const Mp=ds({qr_:function(e,t=!1){if(l(e.rank>=2,(()=>`qr() requires input tensor to have a rank >= 2, but got rank ${e.rank}`)),2===e.rank)return $p(e,t);{const n=e.shape.slice(0,e.shape.length-2).reduce(((e,t)=>e*t)),r=Ac(Qo(e,[n,e.shape[e.shape.length-2],e.shape[e.shape.length-1]]),0),s=[],a=[];r.forEach((e=>{const[n,r]=$p(e,t);s.push(n),a.push(r)}));return[Qo(gc(s,0),e.shape),Qo(gc(a,0),e.shape)]}}});
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
 */var Op;!function(e){e[e.NONE=0]="NONE",e[e.MEAN=1]="MEAN",e[e.SUM=2]="SUM",e[e.SUM_BY_NONZERO_WEIGHTS=3]="SUM_BY_NONZERO_WEIGHTS"}(Op||(Op={}));const Dp=ds({computeWeightedLoss_:function(e,t,n=Op.SUM_BY_NONZERO_WEIGHTS){const r=cs(e,"losses","computeWeightedLoss");let s=null;null!=t&&(s=cs(t,"weights","computeWeightedLoss"));const a=null==s?r:To(r,s);if(n===Op.NONE)return a;if(n===Op.SUM)return Yi(a);if(n===Op.MEAN){if(null==s)return Vu(a);{const e=r.size/s.size,t=ko(Yi(a),Yi(s));return e>1?ko(t,Ji(e)):t}}if(n===Op.SUM_BY_NONZERO_WEIGHTS){if(null==s)return ko(Yi(a),Ji(r.size));{const e=To(s,Wu(r.shape)),t=ua(Yi(Qu(e,Ji(0))),"float32");return ko(Yi(a),t)}}throw Error(`Unknown reduction: ${n}`)}});
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
 */const Rp=ds({absoluteDifference_:function(e,t,n,r=Op.SUM_BY_NONZERO_WEIGHTS){const s=cs(e,"labels","absoluteDifference"),a=cs(t,"predictions","absoluteDifference");let o=null;null!=n&&(o=cs(n,"weights","absoluteDifference")),c(s.shape,a.shape,"Error in absoluteDifference: ");const i=Eo(_u(s,a));return Dp(i,o,r)}});const Fp=ds({cosineDistance_:function(e,t,n,r,s=Op.SUM_BY_NONZERO_WEIGHTS){const a=cs(e,"labels","cosineDistance"),o=cs(t,"predictions","cosineDistance");let i=null;null!=r&&(i=cs(r,"weights","cosineDistance")),c(a.shape,o.shape,"Error in cosineDistance: ");const u=Ji(1),l=_u(u,Yi(To(a,o),n,!0));return Dp(l,i,s)}});const Cp=ds({hingeLoss_:function(e,t,n,r=Op.SUM_BY_NONZERO_WEIGHTS){let s=cs(e,"labels","hingeLoss");const a=cs(t,"predictions","hingeLoss");let o=null;null!=n&&(o=cs(n,"weights","hingeLoss")),c(s.shape,a.shape,"Error in hingeLoss: ");const i=Ji(1);s=_u(To(Ji(2),s),i);const u=Wl(_u(i,To(s,a)));return Dp(u,o,r)}});
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
 */const Bp=ds({huberLoss_:function(e,t,n,r=1,s=Op.SUM_BY_NONZERO_WEIGHTS){const a=cs(e,"labels","huberLoss"),o=cs(t,"predictions","huberLoss");let i=null;null!=n&&(i=cs(n,"weights","huberLoss")),c(a.shape,o.shape,"Error in huberLoss: ");const u=Ji(r),l=Eo(_u(o,a)),p=ju(l,u),h=_u(l,p),d=No(To(Ji(.5),Xi(p)),To(u,h));return Dp(d,i,s)}});
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
 */const Lp=ds({logLoss_:function(e,t,n,r=1e-7,s=Op.SUM_BY_NONZERO_WEIGHTS){const a=cs(e,"labels","logLoss"),o=cs(t,"predictions","logLoss");let i=null;null!=n&&(i=cs(n,"weights","logLoss")),c(a.shape,o.shape,"Error in logLoss: ");const u=Ji(1),l=Ji(r),p=Oa(To(a,xu(No(o,l)))),h=To(_u(u,a),xu(No(_u(u,o),l))),d=_u(p,h);return Dp(d,i,s)}});
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
 */const zp=ds({meanSquaredError_:function(e,t,n,r=Op.SUM_BY_NONZERO_WEIGHTS){const s=cs(e,"labels","meanSquaredError"),a=cs(t,"predictions","meanSquaredError");let o=null;null!=n&&(o=cs(n,"weights","meanSquaredError")),c(s.shape,a.shape,"Error in meanSquaredError: ");const i=mc(s,a);return Dp(i,o,r)}});
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
 */const Pp=ds({sigmoidCrossEntropy_:function(e,t,n,r=0,s=Op.SUM_BY_NONZERO_WEIGHTS){let a=cs(e,"multiClassLabels","sigmoidCrossEntropy");const o=cs(t,"logits","sigmoidCrossEntropy");let i=null;if(null!=n&&(i=cs(n,"weights","sigmoidCrossEntropy")),c(a.shape,o.shape,"Error in sigmoidCrossEntropy: "),r>0){const e=Ji(r),t=Ji(1),n=Ji(.5);a=No(To(a,_u(t,e)),To(n,e))}const u=function(e,t){const n=cs(e,"labels","sigmoidCrossEntropyWithLogits"),r=cs(t,"logits","sigmoidCrossEntropyWithLogits");c(n.shape,r.shape,"Error in sigmoidCrossEntropyWithLogits: ");const s=Wl(r),a=To(r,n),o=vu(ru(Oa(Eo(r))));return No(_u(s,a),o)}(a,o);return Dp(u,i,s)}});
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
 */const Vp=ds({softmaxCrossEntropy_:function(e,t,n,r=0,s=Op.SUM_BY_NONZERO_WEIGHTS){let a=cs(e,"onehotLabels","softmaxCrossEntropy");const o=cs(t,"logits","softmaxCrossEntropy");let i=null;if(null!=n&&(i=cs(n,"weights","softmaxCrossEntropy")),c(a.shape,o.shape,"Error in softmaxCrossEntropy: "),r>0){const e=Ji(r),t=Ji(1),n=Ji(a.shape[1]);a=No(To(a,_u(t,e)),ko(e,n))}const u=function(e,t,n=-1){if(-1===n&&(n=t.rank-1),n!==t.rank-1)throw Error(`Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank ${t.rank} and dim was ${n}`);const r=Su(((e,t,r)=>{const s=Au(t,[n],!0),a=_u(ua(t,"float32"),s);r([e,a]);const o=Oa(To(a,e));return{value:Yi(o,[n]),gradFunc:(e,t)=>{const[r,s]=t,a=Gi(e.shape,[n]);return[To(Qo(e,a),_u(ua(r,"float32"),ru(s))),To(Qo(e,a),_u(ru(s),ua(r,"float32")))]}}}));return r(e,t)}(a,o);return Dp(u,i,s)}});
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
 */const qp=ds({sparseFillEmptyRows_:function(e,t,n,r){const s=cs(e,"indices","sparseFillEmptyRows","int32"),a=cs(t,"values","sparseFillEmptyRows"),o=cs(n,"denseShape","sparseFillEmptyRows","int32"),i=cs(r,"defaultValue","sparseFillEmptyRows",a.dtype);if(2!==s.rank)throw new Error(`Indices should be Tensor2D but received shape\n        ${s.shape}`);if(1!==a.rank)throw new Error(`Values should be Tensor1D but received shape ${a.shape}`);if(1!==o.rank)throw new Error(`Dense shape should be Tensor1D but received shape ${o.shape}`);if(0!==i.rank)throw new Error(`Default value should be a scalar but received shape ${i.shape}`);const u={indices:s,values:a,denseShape:o,defaultValue:i},l=ts.runKernel(Qt,u);return{outputIndices:l[0],outputValues:l[1],emptyRowIndicator:l[2],reverseIndexMap:l[3]}}});
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
 */const Wp=ds({sparseReshape_:function(e,t,n){const r=cs(e,"inputIndices","sparseReshape","int32"),s=cs(t,"inputShape","sparseReshape","int32"),a=cs(n,"newShape","sparseReshape","int32");if(2!==r.rank)throw new Error(`Input indices should be Tensor2D but received shape\n        ${r.shape}`);if(1!==s.rank)throw new Error(`Input shape should be Tensor1D but received shape ${s.shape}`);if(1!==a.rank)throw new Error(`New shape should be Tensor1D but received shape ${a.shape}`);const o={inputIndices:r,inputShape:s,newShape:a},i=ts.runKernel(Xt,o);return{outputIndices:i[0],outputShape:i[1]}}});
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
 */const Up=ds({sparseSegmentMean_:function(e,t,n){const r=cs(e,"data","sparseSegmentMean"),s=cs(t,"indices","sparseSegmentMean","int32"),a=cs(n,"segmentIds","sparseSegmentMean","int32");if(r.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(1!==s.rank)throw new Error(`Indices should be Tensor1D but received shape\n          ${s.shape}`);if(1!==a.rank)throw new Error(`Segment ids should be Tensor1D but received shape\n          ${a.shape}`);const o={data:r,indices:s,segmentIds:a};return ts.runKernel(Yt,o)}});
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
 */const jp=ds({sparseSegmentSum_:function(e,t,n){const r=cs(e,"data","sparseSegmentSum"),s=cs(t,"indices","sparseSegmentSum","int32"),a=cs(n,"segmentIds","sparseSegmentSum","int32");if(r.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(1!==s.rank)throw new Error(`Indices should be Tensor1D but received shape\n         ${s.shape}`);if(1!==a.rank)throw new Error(`Segment ids should be Tensor1D but received shape\n         ${a.shape}`);const o={data:r,indices:s,segmentIds:a};return ts.runKernel(en,o)}});
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
 */const Gp=ds({stringNGrams_:function(e,t,n,r,s,a,o,i){const u=cs(e,"data","stringNGrams","string");if("string"!==u.dtype)throw new Error("Data must be of datatype string");if(1!==u.shape.length)throw new Error(`Data must be a vector, saw: ${u.shape}`);const l=cs(t,"dataSplits","stringNGrams");if("int32"!==l.dtype)throw new Error("Data splits must be of datatype int32");const c={separator:n,nGramWidths:r,leftPad:s,rightPad:a,padWidth:o,preserveShortSequences:i},p={data:u,dataSplits:l},h=ts.runKernel(sn,p,c);return{nGrams:h[0],nGramsSplits:h[1]}}});
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
 */const Kp=ds({stringSplit_:function(e,t,n=!0){const r=cs(e,"input","stringSplit","string"),s=cs(t,"delimiter","stringSplit","string");if(1!==r.rank)throw new Error(`Input should be Tensor1D but received shape ${r.shape}`);if(0!==s.rank)throw new Error(`Delimiter should be a scalar but received shape ${s.shape}`);const a={skipEmpty:n},o={input:r,delimiter:s},i=ts.runKernel(an,o,a);return{indices:i[0],values:i[1],shape:i[2]}}});
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
 */const Hp=ds({stringToHashBucketFast_:function(e,t){const n=cs(e,"input","stringToHashBucketFast","string"),r={numBuckets:t};if(t<=0)throw new Error("Number of buckets must be at least 1");const s={input:n};return ts.runKernel(on,s,r)}}),Zp={fft:lc,ifft:cc,rfft:dc,irfft:pc},Jp={hammingWindow:ep,hannWindow:tp,frame:np,stft:rp},Qp={flipLeftRight:ap,grayscaleToRGB:op,resizeNearestNeighbor:Tp,resizeBilinear:kp,rotateWithOffset:ip,cropAndResize:sp,nonMaxSuppression:lp,nonMaxSuppressionAsync:wp,nonMaxSuppressionWithScore:xp,nonMaxSuppressionWithScoreAsync:vp,nonMaxSuppressionPadded:Np,nonMaxSuppressionPaddedAsync:Sp,threshold:Ep,transform:_p},Xp={bandPart:Ip,gramSchmidt:Ap,qr:Mp},Yp={absoluteDifference:Rp,computeWeightedLoss:Dp,cosineDistance:Fp,hingeLoss:Cp,huberLoss:Bp,logLoss:Lp,meanSquaredError:zp,sigmoidCrossEntropy:Pp,softmaxCrossEntropy:Vp},eh={sparseFillEmptyRows:qp,sparseReshape:Wp,sparseSegmentMean:Up,sparseSegmentSum:jp},th={stringNGrams:Gp,stringSplit:Kp,stringToHashBucketFast:Hp};
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
class nh extends po{minimize(e,t=!1,n){const{value:r,grads:s}=this.computeGradients(e,n);if(null!=n){const e=n.map((e=>({name:e.name,tensor:s[e.name]})));this.applyGradients(e)}else this.applyGradients(s);return Aa(s),t?r:(r.dispose(),null)}get iterations(){return null==this.iterations_&&(this.iterations_=0),this.iterations_}incrementIterations(){this.iterations_=this.iterations+1}computeGradients(e,t){return Nu(e,t)}dispose(){null!=this.iterations_&&Aa(this.iterations_)}async saveIterations(){return null==this.iterations_&&(this.iterations_=0),{name:"iter",tensor:Ji(this.iterations_,"int32")}}async getWeights(){throw new Error("getWeights() is not implemented for this optimizer yet.")}async setWeights(e){throw new Error(`setWeights() is not implemented for this optimizer class ${this.getClassName()}`)}async extractIterations(e){return this.iterations_=(await e[0].tensor.data())[0],e.slice(1)}}Object.defineProperty(nh,Symbol.hasInstance,{value:e=>null!=e.minimize&&null!=e.computeGradients&&null!=e.applyGradients});
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
class rh extends nh{constructor(e,t,n=null){super(),this.learningRate=e,this.rho=t,this.epsilon=n,this.accumulatedGrads=[],this.accumulatedUpdates=[],null==n&&(this.epsilon=ts.backend.epsilon())}applyGradients(e){(Array.isArray(e)?e.map((e=>e.name)):Object.keys(e)).forEach(((t,n)=>{const r=ts.registeredVariables[t],s=!1;null==this.accumulatedGrads[n]&&(this.accumulatedGrads[n]={originalName:`${t}/accum_grad`,variable:Ia((()=>Li(r).variable(s)))}),null==this.accumulatedUpdates[n]&&(this.accumulatedUpdates[n]={originalName:`${t}/accum_var`,variable:Ia((()=>Li(r).variable(s)))});const a=Array.isArray(e)?e[n].tensor:e[t];if(null==a)return;const o=this.accumulatedGrads[n].variable,i=this.accumulatedUpdates[n].variable;Ia((()=>{const e=No(To(o,this.rho),To(Xi(a),1-this.rho)),t=To(ko(Qi(No(i,this.epsilon)),Qi(No(o,this.epsilon))),a),n=No(To(i,this.rho),To(Xi(t),1-this.rho));o.assign(e),i.assign(n);const s=No(To(t,-this.learningRate),r);r.assign(s)}))})),this.incrementIterations()}dispose(){null!=this.accumulatedUpdates&&(Aa(this.accumulatedGrads.map((e=>e.variable))),Aa(this.accumulatedUpdates.map((e=>e.variable))))}async getWeights(){const e=[...this.accumulatedGrads,...this.accumulatedUpdates];return[await this.saveIterations()].concat(e.map((e=>({name:e.originalName,tensor:e.variable}))))}async setWeights(e){const t=(e=await this.extractIterations(e)).length/2,n=!1;this.accumulatedGrads=e.slice(0,t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)}))),this.accumulatedUpdates=e.slice(t,2*t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)})))}getConfig(){return{learningRate:this.learningRate,rho:this.rho,epsilon:this.epsilon}}static fromConfig(e,t){return new e(t.learningRate,t.rho,t.epsilon)}}rh.className="Adadelta",mo(rh);
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
class sh extends nh{constructor(e,t=.1){super(),this.learningRate=e,this.initialAccumulatorValue=t,this.accumulatedGrads=[]}applyGradients(e){(Array.isArray(e)?e.map((e=>e.name)):Object.keys(e)).forEach(((t,n)=>{const r=ts.registeredVariables[t];if(null==this.accumulatedGrads[n]){const e=!1;this.accumulatedGrads[n]={originalName:`${t}/accumulator`,variable:Ia((()=>mi(r.shape,this.initialAccumulatorValue).variable(e)))}}const s=Array.isArray(e)?e[n].tensor:e[t];if(null==s)return;const a=this.accumulatedGrads[n].variable;Ia((()=>{const e=No(a,Xi(s));a.assign(e);const t=No(To(ko(s,Qi(No(e,ts.backend.epsilon()))),-this.learningRate),r);r.assign(t)}))})),this.incrementIterations()}dispose(){null!=this.accumulatedGrads&&Aa(this.accumulatedGrads.map((e=>e.variable)))}async getWeights(){return[await this.saveIterations()].concat(this.accumulatedGrads.map((e=>({name:e.originalName,tensor:e.variable}))))}async setWeights(e){e=await this.extractIterations(e);this.accumulatedGrads=e.map((e=>({originalName:e.name,variable:e.tensor.variable(false)})))}getConfig(){return{learningRate:this.learningRate,initialAccumulatorValue:this.initialAccumulatorValue}}static fromConfig(e,t){return new e(t.learningRate,t.initialAccumulatorValue)}}sh.className="Adagrad",mo(sh);
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
class ah extends nh{constructor(e,t,n,r=null){super(),this.learningRate=e,this.beta1=t,this.beta2=n,this.epsilon=r,this.accumulatedFirstMoment=[],this.accumulatedSecondMoment=[],Ia((()=>{this.accBeta1=Ji(t).variable(),this.accBeta2=Ji(n).variable()})),null==r&&(this.epsilon=ts.backend.epsilon())}applyGradients(e){const t=Array.isArray(e)?e.map((e=>e.name)):Object.keys(e);Ia((()=>{const n=_u(1,this.accBeta1),r=_u(1,this.accBeta2);t.forEach(((t,s)=>{const a=ts.registeredVariables[t],o=!1;null==this.accumulatedFirstMoment[s]&&(this.accumulatedFirstMoment[s]={originalName:`${t}/m`,variable:Ia((()=>Li(a).variable(o)))}),null==this.accumulatedSecondMoment[s]&&(this.accumulatedSecondMoment[s]={originalName:`${t}/v`,variable:Ia((()=>Li(a).variable(o)))});const i=Array.isArray(e)?e[s].tensor:e[t];if(null==i)return;const u=this.accumulatedFirstMoment[s].variable,l=this.accumulatedSecondMoment[s].variable,c=No(To(u,this.beta1),To(i,1-this.beta1)),p=No(To(l,this.beta2),To(Xi(i),1-this.beta2)),h=ko(c,n),d=ko(p,r);u.assign(c),l.assign(p);const m=No(To(ko(h,No(Qi(d),this.epsilon)),-this.learningRate),a);a.assign(m)})),this.accBeta1.assign(To(this.accBeta1,this.beta1)),this.accBeta2.assign(To(this.accBeta2,this.beta2))})),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.accBeta2.dispose(),null!=this.accumulatedFirstMoment&&Aa(this.accumulatedFirstMoment.map((e=>e.variable))),null!=this.accumulatedSecondMoment&&Aa(this.accumulatedSecondMoment.map((e=>e.variable)))}async getWeights(){const e=[...this.accumulatedFirstMoment,...this.accumulatedSecondMoment];return[await this.saveIterations()].concat(e.map((e=>({name:e.originalName,tensor:e.variable}))))}async setWeights(e){e=await this.extractIterations(e),Ia((()=>{this.accBeta1.assign(Zi(this.beta1,this.iterations_+1)),this.accBeta2.assign(Zi(this.beta2,this.iterations_+1))}));const t=e.length/2,n=!1;this.accumulatedFirstMoment=e.slice(0,t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)}))),this.accumulatedSecondMoment=e.slice(t,2*t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)})))}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon}}static fromConfig(e,t){return new e(t.learningRate,t.beta1,t.beta2,t.epsilon)}}ah.className="Adam",mo(ah);
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
class oh extends nh{constructor(e,t,n,r=null,s=0){super(),this.learningRate=e,this.beta1=t,this.beta2=n,this.epsilon=r,this.decay=s,this.accumulatedFirstMoment=[],this.accumulatedWeightedInfNorm=[],Ia((()=>{this.iteration=Ji(0).variable(),this.accBeta1=Ji(t).variable()})),null==r&&(this.epsilon=ts.backend.epsilon())}applyGradients(e){const t=Array.isArray(e)?e.map((e=>e.name)):Object.keys(e);Ia((()=>{const n=_u(1,this.accBeta1),r=ko(-this.learningRate,No(To(this.iteration,this.decay),1));t.forEach(((t,s)=>{const a=ts.registeredVariables[t],o=!1;null==this.accumulatedFirstMoment[s]&&(this.accumulatedFirstMoment[s]={originalName:`${t}/m`,variable:Li(a).variable(o)}),null==this.accumulatedWeightedInfNorm[s]&&(this.accumulatedWeightedInfNorm[s]={originalName:`${t}/v`,variable:Li(a).variable(o)});const i=Array.isArray(e)?e[s].tensor:e[t];if(null==i)return;const u=this.accumulatedFirstMoment[s].variable,l=this.accumulatedWeightedInfNorm[s].variable,c=No(To(u,this.beta1),To(i,1-this.beta1)),p=To(l,this.beta2),h=Eo(i),d=Pu(p,h);u.assign(c),l.assign(d);const m=No(To(ko(r,n),ko(c,No(d,this.epsilon))),a);a.assign(m)})),this.iteration.assign(No(this.iteration,1)),this.accBeta1.assign(To(this.accBeta1,this.beta1))})),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.iteration.dispose(),null!=this.accumulatedFirstMoment&&Aa(this.accumulatedFirstMoment.map((e=>e.variable))),null!=this.accumulatedWeightedInfNorm&&Aa(this.accumulatedWeightedInfNorm.map((e=>e.variable)))}async getWeights(){throw new Error("getWeights() is not implemented for Adamax yet.")}async setWeights(e){throw new Error("setWeights() is not implemented for Adamax yet.")}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon,decay:this.decay}}static fromConfig(e,t){return new e(t.learningRate,t.beta1,t.beta2,t.epsilon,t.decay)}}oh.className="Adamax",mo(oh);
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
class ih extends nh{constructor(e){super(),this.learningRate=e,this.setLearningRate(e)}applyGradients(e){(Array.isArray(e)?e.map((e=>e.name)):Object.keys(e)).forEach(((t,n)=>{const r=Array.isArray(e)?e[n].tensor:e[t];if(null==r)return;const s=ts.registeredVariables[t];Ia((()=>{const e=No(To(this.c,r),s);s.assign(e)}))})),this.incrementIterations()}setLearningRate(e){this.learningRate=e,null!=this.c&&this.c.dispose(),this.c=$a(Ji(-e))}dispose(){this.c.dispose()}async getWeights(){return[await this.saveIterations()]}async setWeights(e){if(0!==(e=await this.extractIterations(e)).length)throw new Error("SGD optimizer does not have settable weights.")}getConfig(){return{learningRate:this.learningRate}}static fromConfig(e,t){return new e(t.learningRate)}}ih.className="SGD",mo(ih);
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
class uh extends ih{constructor(e,t,n=!1){super(e),this.learningRate=e,this.momentum=t,this.useNesterov=n,this.accumulations=[],this.m=Ji(this.momentum)}applyGradients(e){(Array.isArray(e)?e.map((e=>e.name)):Object.keys(e)).forEach(((t,n)=>{const r=ts.registeredVariables[t];if(null==this.accumulations[n]){const e=!1;this.accumulations[n]={originalName:`${t}/momentum`,variable:Ia((()=>Li(r).variable(e)))}}const s=this.accumulations[n].variable,a=Array.isArray(e)?e[n].tensor:e[t];null!=a&&Ia((()=>{let e;const t=No(To(this.m,s),a);e=this.useNesterov?No(To(this.c,No(a,To(t,this.m))),r):No(To(this.c,t),r),s.assign(t),r.assign(e)}))})),this.incrementIterations()}dispose(){this.m.dispose(),null!=this.accumulations&&Aa(this.accumulations.map((e=>e.variable)))}setMomentum(e){this.momentum=e}async getWeights(){return[await this.saveIterations()].concat(this.accumulations.map((e=>({name:e.originalName,tensor:e.variable}))))}async setWeights(e){e=await this.extractIterations(e);this.accumulations=e.map((e=>({originalName:e.name,variable:e.tensor.variable(false)})))}getConfig(){return{learningRate:this.learningRate,momentum:this.momentum,useNesterov:this.useNesterov}}static fromConfig(e,t){return new e(t.learningRate,t.momentum,t.useNesterov)}}uh.className="Momentum",mo(uh);
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
class lh extends nh{constructor(e,t=.9,n=0,r=null,s=!1){if(super(),this.learningRate=e,this.decay=t,this.momentum=n,this.epsilon=r,this.accumulatedMeanSquares=[],this.accumulatedMoments=[],this.accumulatedMeanGrads=[],this.centered=s,null==r&&(this.epsilon=ts.backend.epsilon()),null==e)throw new Error("learningRate for RMSPropOptimizer must be defined.")}applyGradients(e){(Array.isArray(e)?e.map((e=>e.name)):Object.keys(e)).forEach(((t,n)=>{const r=ts.registeredVariables[t],s=!1;null==this.accumulatedMeanSquares[n]&&(this.accumulatedMeanSquares[n]={originalName:`${t}/rms`,variable:Ia((()=>Li(r).variable(s)))}),null==this.accumulatedMoments[n]&&(this.accumulatedMoments[n]={originalName:`${t}/momentum`,variable:Ia((()=>Li(r).variable(s)))}),null==this.accumulatedMeanGrads[n]&&this.centered&&(this.accumulatedMeanGrads[n]={originalName:`${t}/mg`,variable:Ia((()=>Li(r).variable(s)))});const a=Array.isArray(e)?e[n].tensor:e[t];if(null==a)return;const o=this.accumulatedMeanSquares[n].variable,i=this.accumulatedMoments[n].variable;Ia((()=>{const e=No(To(o,this.decay),To(Xi(a),1-this.decay));if(this.centered){const t=this.accumulatedMeanGrads[n].variable,s=No(To(t,this.decay),To(a,1-this.decay)),u=ko(To(a,this.learningRate),Qi(_u(e,No(Xi(s),this.epsilon)))),l=No(To(i,this.momentum),u);o.assign(e),t.assign(s),i.assign(l);const c=_u(r,l);r.assign(c)}else{const e=No(To(o,this.decay),To(Xi(a),1-this.decay)),t=No(To(i,this.momentum),ko(To(a,this.learningRate),Qi(No(e,this.epsilon))));o.assign(e),i.assign(t);const n=_u(r,t);r.assign(n)}}))})),this.incrementIterations()}dispose(){null!=this.accumulatedMeanSquares&&Aa(this.accumulatedMeanSquares.map((e=>e.variable))),null!=this.accumulatedMeanGrads&&this.centered&&Aa(this.accumulatedMeanGrads.map((e=>e.variable))),null!=this.accumulatedMoments&&Aa(this.accumulatedMoments.map((e=>e.variable)))}async getWeights(){const e=[...this.accumulatedMeanSquares,...this.accumulatedMoments];return this.centered&&e.push(...this.accumulatedMeanGrads),[await this.saveIterations()].concat(e.map((e=>({name:e.originalName,tensor:e.variable}))))}async setWeights(e){e=await this.extractIterations(e);const t=this.centered?e.length/3:e.length/2,n=!1;this.accumulatedMeanSquares=e.slice(0,t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)}))),this.accumulatedMoments=e.slice(t,2*t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)}))),this.centered&&(this.accumulatedMeanGrads=e.slice(2*t,3*t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)}))))}getConfig(){return{learningRate:this.learningRate,decay:this.decay,momentum:this.momentum,epsilon:this.epsilon,centered:this.centered}}static fromConfig(e,t){return new e(t.learningRate,t.decay,t.momentum,t.epsilon,t.centered)}}lh.className="RMSProp",mo(lh);
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
class ch{static sgd(e){return new ih(e)}static momentum(e,t,n=!1){return new uh(e,t,n)}static rmsprop(e,t=.9,n=0,r=null,s=!1){return new lh(e,t,n,r,s)}static adam(e=.001,t=.9,n=.999,r=null){return new ah(e,t,n,r)}static adadelta(e=.001,t=.95,n=null){return new rh(e,t,n)}static adamax(e=.002,t=.9,n=.999,r=null,s=0){return new oh(e,t,n,r,s)}static adagrad(e,t=.1){return new sh(e,t)}}
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
 */const ph={sgd:ch.sgd,momentum:ch.momentum,adadelta:ch.adadelta,adagrad:ch.adagrad,rmsprop:ch.rmsprop,adamax:ch.adamax,adam:ch.adam},hh="undefined"!=typeof requestAnimationFrame?requestAnimationFrame:"undefined"!=typeof setImmediate?setImmediate:e=>e();
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
 */
var dh;!function(e){e[e.FIRST_DIM_SIZE=0]="FIRST_DIM_SIZE",e[e.VALUE_ROWIDS=1]="VALUE_ROWIDS",e[e.ROW_LENGTHS=2]="ROW_LENGTHS",e[e.ROW_SPLITS=3]="ROW_SPLITS",e[e.ROW_LIMITS=4]="ROW_LIMITS",e[e.ROW_STARTS=5]="ROW_STARTS"}(dh||(dh={}));
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
const mh="->",fh=/->/g;function gh(e,t){const n=[];for(let r=0;r<e.length;++r)0!==e[r].length&&-1===e[r].indexOf(t)&&-1!==t||n.push(r);return n}var yh=Object.freeze({__proto__:null,collectGatherOpShapeInfo:function(e,t,n,r){const s=t.shape.length,a=e.shape.length;if(0!==r&&(r<-s||r>s))throw new Error(`Expect batchDims in the range of [-${s}, ${s}], but got ${r}`);if(r<0&&(r+=s),r>a)throw new Error(`batchDims (${r}) must be less than rank(x) (\n    ${a}).`);if(n<r)throw new Error(`batchDims (${r}) must be less than or equal to axis (${n}).`);for(let n=0;n<r;++n)if(e.shape[n]!==t.shape[n])throw new Error(`x.shape[${n}]: ${e.shape[n]} should be equal to indices.shape[${n}]: ${t.shape[n]}.`);const o=e.shape[n],i=[];let u=1,l=1,c=1;for(let t=0;t<r;++t)i.push(e.shape[t]),u*=e.shape[t];for(let t=r;t<n;t++)i.push(e.shape[t]),l*=e.shape[t];for(let e=r;e<s;e++)i.push(t.shape[e]);for(let t=n+1;t<a;t++)i.push(e.shape[t]),c*=e.shape[t];return{batchSize:u,sliceSize:c,outerSize:l,dimSize:o,outputShape:i}},computeOutShape:function(e,t,n){const r=[],s=e.length;for(let a=0;a<s;a++)a!==t?r.push(e[a]):r.push(n);return r},segOpComputeOptimalWindowSize:
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
function(e,t){let n,r=!1;for(e<=30?(n=e,r=!0):n=M(e,Math.floor(Math.sqrt(e)));!r;)n>t||n===e?r=!0:n=M(e,n+1);return n}});
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
 */var bh=Object.freeze({__proto__:null,ERF_A1:.254829592,ERF_A2:-.284496736,ERF_A3:1.421413741,ERF_A4:-1.453152027,ERF_A5:1.061405429,ERF_P:.3275911,PARALLELIZE_THRESHOLD:30,get RowPartitionType(){return dh},SELU_SCALE:1.0507009873554805,SELU_SCALEALPHA:1.7580993408473768,applyActivation:Gc,assertAndGetBroadcastShape:za,assertAxesAreInnerMostDims:function(e,t,n){l(Ui(t,n),(()=>`${e} supports only inner-most axes for now. Got axes ${t} and rank-${n} input.`))},assertParamsConsistent:
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
function(e,t){const n=e[0].length;e.forEach(((e,t)=>{l(e.length===n,(()=>`Error in concat${n}D: rank of tensors[${t}] must be the same as the rank of the rest (${n})`))})),l(t>=0&&t<n,(()=>`Error in concat${n}D: axis must be between 0 and ${n-1}.`));const r=e[0];e.forEach(((e,s)=>{for(let a=0;a<n;a++)l(a===t||e[a]===r[a],(()=>`Error in concat${n}D: Shape of tensors[${s}] (${e}) does not match the shape of the rest (${r}) along the non-concatenated axis ${s}.`))}))},assignToTypedArray:function(e,t,n,r){e[2*r]=t,e[2*r+1]=n},axesAreInnerMostDims:Ui,calculateShapes:Qa,checkEinsumDimSizes:function(e,t,n){const r=new Array(e);for(let e=0;e<n.length;++e){const s=n[e].shape;for(let n=0;n<t[e].length;++n)void 0===r[t[e][n]]?r[t[e][n]]=s[n]:l(r[t[e][n]]===s[n],(()=>`Expected dimension ${r[t[e][n]]} at axis ${n} of input shaped ${JSON.stringify(s)}, but got dimension ${s[n]}`))}},checkPadOnDimRoundingMode:Jo,combineLocations:ji,combineRaggedTensorToTensorShapes:function(e,t,n){let r=new Array;if(null==n&&null==t)return r;if(null==t)for(;r.length<e+n.length;)r.push(-1);else r=t.slice();if(null==n)return r;if(e+n.length!==r.length)throw new Error(`rt input.shape and shape=${t} are incompatible: rt input.rank = ${e+n.length}, but shape.rank = ${r.length}`);for(let s=1;s<n.length;++s){const a=n[s],o=r[r.length-n.length+s],i=r[o];if(a>=0)if(i>=0){if(i!==a)throw new Error(`rt input.shape and shape=${t} are incompatible: rt input.shape[${s+e}] = ${a} but shape[${s+e}] = ${i}`)}else r[o]=a}return r},complexWithEvenIndex:function(e){const t=Math.ceil(e.length/4),n=new Float32Array(t),r=new Float32Array(t);for(let t=0;t<e.length;t+=4)n[Math.floor(t/4)]=e[t],r[Math.floor(t/4)]=e[t+1];return{real:n,imag:r}},complexWithOddIndex:function(e){const t=Math.floor(e.length/4),n=new Float32Array(t),r=new Float32Array(t);for(let t=2;t<e.length;t+=4)n[Math.floor(t/4)]=e[t],r[Math.floor(t/4)]=e[t+1];return{real:n,imag:r}},computeConv2DInfo:Po,computeConv3DInfo:Vo,computeDefaultPad:qo,computeDilation2DInfo:function(e,t,n,r,s="NHWC",a){return Po(e,[...t,e[3]],n,a,r,null,null,Zo(s))},computeOptimalWindowSize:function(e){return e<=30?e:M(e,Math.floor(Math.sqrt(e)))}
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
 */,computeOutAndReduceShapes:function(e,t){const n=[],r=e.length;for(let s=0;s<r;s++)-1===t.indexOf(s)&&n.push(e[s]);return[n,t.map((t=>e[t]))]},computeOutShape:function(e,t){const n=e[0].slice();for(let r=1;r<e.length;r++)n[t]+=e[r][t];return n},computePool2DInfo:zo,computePool3DInfo:function(e,t,n,r,s,a,o="NDHWC"){const[i,u,l]=Uo(t);let c,p;if("NDHWC"===o)p="channelsLast",c=[i,u,l,e[4],e[4]];else{if("NCDHW"!==o)throw new Error(`Unknown dataFormat ${o}`);p="channelsFirst",c=[i,u,l,e[1],e[1]]}return Vo(e,c,n,r,s,!1,p,a)},convertConv2DDataFormat:Zo,decodeEinsumEquation:function(e,t){const n=((e=e.replace(/\s/g,"")).length-e.replace(fh,"").length)/2;if(n<1)throw new Error("Equations without an arrow are not supported.");if(n>1)throw new Error(`Equation must contain exactly one arrow ("${mh}").`);const[r,s]=e.split(mh);l(-1===r.indexOf("..."),(()=>'The ellipsis notation ("...") is not supported yet.'));const a=r.split(","),o=a.length;if(t!==o)throw new Error(`Expected ${o} input tensors, received ${t}`);if(o>2)throw new Error("Support for more than 2 input tensors is not implemented yet.");const i=[];for(let e=0;e<s.length;++e){const t=s[e];if(!a.some((e=>-1!==e.indexOf(t))))throw new Error(`Output subscripts contain the label ${t} not present in the input subscripts.`);-1===i.indexOf(t)&&i.push(t)}for(let e=0;e<r.length;++e){const t=r[e];-1===i.indexOf(t)&&","!==t&&i.push(t)}const u=new Array(a.length);for(let e=0;e<o;++e){if(new Set(a[e].split("")).size!==a[e].length)throw new Error(`Found duplicate axes in input component ${a[e]}. Support for duplicate axes in input is not implemented yet.`);u[e]=[];for(let t=0;t<a[e].length;++t)u[e].push(i.indexOf(a[e][t]))}const c=i.length,p=[];for(let e=s.length;e<c;++e)p.push(e);return{allDims:i,summedDims:p,idDims:u}},eitherStridesOrDilationsAreOne:Ho,expandShapeToKeepDim:Gi,exponent:function(e,t,n){const r=(n?2:-2)*Math.PI*(e/t);return{real:Math.cos(r),imag:Math.sin(r)}},exponents:function(e,t){const n=new Float32Array(e/2),r=new Float32Array(e/2);for(let s=0;s<Math.ceil(e/2);s++){const a=(t?2:-2)*Math.PI*(s/e);n[s]=Math.cos(a),r[s]=Math.sin(a)}return{real:n,imag:r}},fromStringArrayToUint8:function(e){return e.map((e=>xr(e)))},fromUint8ToStringArray:function(e){try{return e.map((e=>vr(e)))}catch(e){throw new Error(`Failed to decode encoded string bytes into utf-8, error: ${e}`)}},getAxesPermutation:function(e,t){if(Ui(e,t))return null;const n=[];for(let r=0;r<t;++r)-1===e.indexOf(r)&&n.push(r);return e.forEach((e=>n.push(e))),n},getBroadcastDims:Ba,getComplexWithIndex:function(e,t){return{real:e[2*t],imag:e[2*t+1]}},getEinsumComputePath:function(e,t){const n=e,r=[];let s=0;0===e.length&&n.push(-1),s=e.length+1;for(let e=0;e<s;++e)r.push([]);const a=[];for(let e=0;e<n.length;++e){const s=gh(t,n[e]);for(const t of s)-1===a.indexOf(t)&&(r[e].push(t),a.push(t))}return{path:n,steps:r}},getEinsumPermutation:function(e,t){let n=new Array(e);n.fill(-1);for(let e=0;e<t.length;++e)n[t[e]]=e;const r=[];for(let t=0;t<e;++t)-1===n[t]&&r.push(t);return n=n.filter((e=>-1!==e)),{permutationIndices:n,expandDims:r}},getFusedBiasGradient:jc,getFusedDyActivation:Uc,getImageCenter:function(e,t,n){return[n*("number"==typeof e?e:e[0]),t*("number"==typeof e?e:e[1])]}
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
 */,getInnerMostAxes:function(e,t){const n=[];for(let r=t-e;r<t;++r)n.push(r);return n},getPermuted:function(e,t,n=!0){const r=[];if(n){r.push(t);for(let n=t+1;n<e;++n)n<=2*t?(r.push(n),r.push(n-(t+1))):r.push(n)}else{const n=[],s=[];for(let r=1;r<e;++r)r>=2*t+1||r%2==1?s.push(r):n.push(r);r.push(...n),r.push(0),r.push(...s)}return r},getRaggedRank:function(e){return 0===e.length?0:e[0]===dh.FIRST_DIM_SIZE?e.length-1:e.length},getReductionAxes:La,getReshaped:function(e,t,n,r=!0){let s=[];if(r)s=s.concat(t.slice(0)),s.push(e[0]/n),s=s.concat(e.slice(1));else{s=s.concat(e[0]);const n=t.length;for(let r=0;r<n;++r)s=s.concat([e[r+1]/t[r],t[r]]);s=s.concat(e.slice(n+1))}return s},getReshapedPermuted:function(e,t,n,r=!0){const s=[];r?s.push(e[0]/n):s.push(e[0]*n);for(let n=1;n<e.length;++n)n<=t.length?r?s.push(t[n-1]*e[n]):s.push(e[n]/t[n-1]):s.push(e[n]);return s},getRowPartitionTypesHelper:function(e){const t={FIRST_DIM_SIZE:dh.FIRST_DIM_SIZE,VALUE_ROWIDS:dh.VALUE_ROWIDS,ROW_LENGTHS:dh.ROW_LENGTHS,ROW_SPLITS:dh.ROW_SPLITS,ROW_LIMITS:dh.ROW_LIMITS,ROW_STARTS:dh.ROW_STARTS},n=[];for(const r of e){if(!(r in t))break;n.push(t[r])}return n},getSliceBeginCoords:function(e,t){const n=[0];for(let r=0;r<t;++r)n.push(e[r][0]);return n},getSliceSize:function(e,t,n){const r=e.slice(0,1);for(let s=0;s<n;++s)r.push(e[s+1]-t[s][0]-t[s][1]);return r}
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
 */,getSparseFillEmptyRowsIndicesDenseShapeMismatch:
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
function(e){return`Received SparseTensor with denseShape[0] = 0 but\n  indices.shape[0] = ${e}`},getSparseFillEmptyRowsNegativeIndexErrorMessage:function(e,t){return`indices(${e}, 0) is invalid: ${t} < 0`},getSparseFillEmptyRowsOutOfRangeIndexErrorMessage:function(e,t,n){return`indices(${e}, 0) is invalid: ${t} >= ${n}`}
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
 */,getSparseReshapeEmptyTensorZeroOutputDimErrorMessage:function(){return"reshape cannot infer the missing input size for an empty tensor unless all specified input sizes are non-zero"},getSparseReshapeInputOutputMismatchErrorMessage:function(e,t){return`Input to reshape is a tensor with ${d(e)} dense values, but the requested shape has ${d(t)}. inputShape=${e} outputShape=${t}`}
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
 */,getSparseReshapeInputOutputMultipleErrorMessage:function(e,t){return`Input to reshape is a SparseTensor with ${d(e)}\n  dense values, but the requested shape requires a multiple of ${d(t)}. inputShape=${e} outputShape= ${t}`},getSparseReshapeMultipleNegativeOneOutputDimErrorMessage:function(e,t){return`only one output dimension may be -1, not both ${e} and ${t}`},getSparseReshapeNegativeOutputDimErrorMessage:function(e,t){return`size ${e} must be non-negative, not ${t}`},getSparseSegmentReductionIndicesOutOfRangeErrorMessage:function(e,t,n){return`Bad: indices[${e}] == ${t} out of range [0, ${n})`},getSparseSegmentReductionNegativeSegmentIdsErrorMessage:function(){return"segment ids must be >= 0"},getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage:function(){return"segment ids are not increasing"},getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage:function(e,t){return`Segment id ${e} out of range [0, ${t}), possibly because segmentIds input is not sorted.`},getUndoAxesPermutation:function(e){return e.map(((e,t)=>[t,e])).sort(((e,t)=>e[1]-t[1])).map((e=>e[0]))},isIdentityPermutation:function(e){return e.every(((e,t)=>e===t))},log:function(...e){q().getBool("IS_TEST")||q().getBool("PROD")||console.log(...e)},mergeRealAndImagArrays:
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
function(e,t){if(e.length!==t.length)throw new Error(`Cannot merge real and imag arrays of different lengths. real:${e.length}, imag: ${t.length}.`);const n=new Float32Array(2*e.length);for(let r=0;r<n.length;r+=2)n[r]=e[r/2],n[r+1]=t[r/2];return n},prepareAndValidate:Ka,prepareSplitSize:function(e,t,n=0){let r=[];if("number"==typeof t)l(e.shape[n]%t==0,(()=>"Number of splits must evenly divide the axis.")),r=new Array(t).fill(e.shape[n]/t);else{l(t.reduce(((e,t)=>(-1===t&&(e+=1),e)),0)<=1,(()=>"There should be only one negative value in split array."));const s=t.indexOf(-1);if(-1!==s){const r=t.reduce(((e,t)=>t>0?e+t:e));t[s]=e.shape[n]-r}l(e.shape[n]===t.reduce(((e,t)=>e+t)),(()=>"The sum of sizes must match the size of the axis dimension.")),r=t}return r},segment_util:yh,shouldFuse:Kc,slice_util:co,splitRealAndImagArrays:function(e){const t=new Float32Array(e.length/2),n=new Float32Array(e.length/2);for(let r=0;r<e.length;r+=2)t[r/2]=e[r],n[r/2]=e[r+1];return{real:t,imag:n}},tupleValuesAreOne:Ko,upcastType:jr,validateDefaultValueShape:function(e,t){if(null==e||null==t)return;const n=e.length,r=t.length;if(n>=r)throw new Error(`defaultValue.shape=${e} and ragged tensor flatValues.shape=${t}, are incompatible: defaultValue.rank = ${n} must be less than ragged tensor input flatValues.rank = ${r})`);for(let s=0;s<Math.min(n,r-1);++s){const n=e[s],r=t[s+1];if(n>=0&&r>=0&&1!==n&&n!==r)throw new Error(`defaultValue.shape=${e}, and ragged tensor input flatValues.shape=${t} are incompatible: defaultValue.shape[${s-e.length}] = ${n} but ragged tensor input.flatValues.shape[${s-e.length}] = ${r}`)}}
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
 */,validateInput:Ja,validateUpdateShape:Za,warn:Sn}),wh=Object.freeze({__proto__:null,nonMaxSuppressionV3Impl:hp,nonMaxSuppressionV4Impl:dp,nonMaxSuppressionV5Impl:mp,whereImpl:Oc}),xh=Object.freeze({__proto__:null,Abs:"Abs",Acos:K,Acosh:H,AdadeltaOptimizer:rh,AdagradOptimizer:sh,AdamOptimizer:ah,AdamaxOptimizer:oh,Add:Z,AddN:J,All:"All",Any:"Any",ArgMax:Q,ArgMin:X,Asin:Y,Asinh:ee,Atan:te,Atan2:re,Atanh:ne,AvgPool:se,AvgPool3D:ae,AvgPool3DGrad:"AvgPool3DGrad",AvgPoolGrad:"AvgPoolGrad",BatchMatMul:oe,BatchToSpaceND:ie,Bincount:ue,BroadcastArgs:le,BroadcastTo:"BroadcastTo",Cast:ce,Ceil:pe,ClipByValue:he,Complex:de,ComplexAbs:me,Concat:fe,Conv2D:ge,Conv2DBackpropFilter:ye,Conv2DBackpropInput:be,Conv3D:we,Conv3DBackpropFilterV2:"Conv3DBackpropFilterV2",Conv3DBackpropInputV2:xe,Cos:"Cos",Cosh:ve,CropAndResize:ke,Cumprod:Ne,Cumsum:Se,DataStorage:class{constructor(e,t){this.backend=e,this.dataMover=t,this.data=new WeakMap,this.dataIdsCount=0}get(e){return this.data.has(e)||this.dataMover.moveData(this.backend,e),this.data.get(e)}set(e,t){this.dataIdsCount++,this.data.set(e,t)}has(e){return this.data.has(e)}delete(e){return this.dataIdsCount--,this.data.delete(e)}numDataIds(){return this.dataIdsCount}},DenseBincount:Te,DepthToSpace:Ee,DepthwiseConv2dNative:_e,DepthwiseConv2dNativeBackpropFilter:Ie,DepthwiseConv2dNativeBackpropInput:Ae,Diag:$e,Dilation2D:Me,Dilation2DBackpropFilter:"Dilation2DBackpropFilter",Dilation2DBackpropInput:"Dilation2DBackpropInput",get ENV(){return U},Einsum:De,Elu:"Elu",EluGrad:"EluGrad",Environment:P,Equal:Re,Erf:"Erf",Exp:"Exp",ExpandDims:Fe,Expm1:Ce,FFT:"FFT",Fill:Be,FlipLeftRight:Le,Floor:ze,FloorDiv:Pe,FromPixels:bn,FusedBatchNorm:Ve,FusedConv2D:vn,FusedDepthwiseConv2D:Nn,GatherNd:We,GatherV2:qe,Greater:Ue,GreaterEqual:je,IFFT:Ke,Identity:Ge,Imag:He,IsFinite:Ze,IsInf:Je,IsNan:Qe,KernelBackend:s,LRN:"LRN",LRNGrad:"LRNGrad",LeakyRelu:Xe,Less:Ye,LessEqual:et,LinSpace:tt,Log:"Log",Log1p:nt,LogSoftmax:"LogSoftmax",LogicalAnd:rt,LogicalNot:st,LogicalOr:at,LogicalXor:"LogicalXor",LowerBound:"LowerBound",Max:"Max",MaxPool:it,MaxPool3D:ut,MaxPool3DGrad:"MaxPool3DGrad",MaxPoolGrad:"MaxPoolGrad",MaxPoolWithArgmax:lt,Maximum:ot,Mean:ct,Min:"Min",Minimum:pt,MirrorPad:ht,Mod:"Mod",MomentumOptimizer:uh,Multinomial:dt,Multiply:mt,Neg:"Neg",NonMaxSuppressionV3:gt,NonMaxSuppressionV4:yt,NonMaxSuppressionV5:bt,NotEqual:ft,OP_SCOPE_SUFFIX:hs,OneHot:xt,OnesLike:wt,Optimizer:nh,OptimizerConstructors:ch,Pack:vt,PadV2:Nt,Pool:"Pool",Pow:"Pow",Prelu:St,Prod:kt,RMSPropOptimizer:lh,RaggedGather:Tt,RaggedTensorToTensor:Et,Range:_t,get Rank(){return zr},Real:It,RealDiv:Oe,Reciprocal:At,get Reduction(){return Op},Relu:$t,Relu6:Rt,Reshape:Mt,ResizeBilinear:Dt,ResizeBilinearGrad:"ResizeBilinearGrad",ResizeNearestNeighbor:Ot,ResizeNearestNeighborGrad:"ResizeNearestNeighborGrad",Reverse:Ft,RotateWithOffset:wn,Round:Ct,Rsqrt:Bt,SGDOptimizer:ih,ScatterNd:Lt,SearchSorted:zt,Select:Pt,Selu:Vt,Sigmoid:jt,Sign:Ut,Sin:"Sin",Sinh:Wt,Slice:qt,Softmax:Jt,Softplus:Gt,SpaceToBatchND:Ht,SparseFillEmptyRows:Qt,SparseReshape:Xt,SparseSegmentMean:Yt,SparseSegmentSum:en,SparseToDense:tn,SplitV:Zt,Sqrt:Kt,Square:"Square",SquaredDifference:nn,Step:yn,StridedSlice:rn,StringNGrams:sn,StringSplit:an,StringToHashBucketFast:on,Sub:"Sub",Sum:"Sum",Tan:"Tan",Tanh:un,Tensor:Br,TensorBuffer:Rr,Tile:ln,TopK:cn,Transform:pn,Transpose:hn,Unique:dn,Unpack:mn,UnsortedSegmentSum:fn,UpperBound:"UpperBound",Variable:Lr,ZerosLike:gn,_FusedMatMul:xn,abs:Eo,acos:_o,acosh:Io,add:No,addN:Ao,all:$o,any:Mo,argMax:Oo,argMin:Do,asin:Ro,asinh:Fo,atan:Co,atan2:Bo,atanh:Lo,avgPool:Xo,avgPool3d:Yo,backend:function(){return ts.backend},backend_util:bh,basicLSTMCell:si,batchNorm:oi,batchNorm2d:ii,batchNorm3d:ui,batchNorm4d:li,batchToSpaceND:ai,bincount:ci,booleanMaskAsync:Rc,broadcastArgs:pi,broadcastTo:hi,broadcast_util:Pa,browser:Ga,buffer:ia,cast:ua,ceil:di,clipByValue:fi,clone:la,complex:ms,concat:ei,concat1d:gi,concat2d:yi,concat3d:bi,concat4d:wi,conv1d:vi,conv2d:xi,conv2dTranspose:Si,conv3d:ki,conv3dTranspose:Ei,copyRegisteredKernels:function(e,t){In(e).forEach((e=>{An(Object.assign({},e,{backendName:t}))}))},cos:_i,cosh:Ii,cosineWindow:Vc,cumprod:Ai,cumsum:$i,customGrad:Su,denseBincount:Mi,deprecationWarn:function(e){q().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(e+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")},depthToSpace:Oi,depthwiseConv2d:Di,device_util:as,diag:Ri,dilation2d:Fi,disableDeprecationWarnings:function(){q().set("DEPRECATION_WARNINGS_ENABLED",!1),console.warn("TensorFlow.js deprecation warnings have been disabled.")},dispose:Aa,disposeVariables:function(){ts.disposeVariables()},div:ko,divNoNan:zi,dot:Pi,dropout:zc,einsum:Vi,elu:qi,enableDebugMode:function(){q().set("DEBUG",!0)},enableProdMode:function(){q().set("PROD",!0)},enclosingPowerOfTwo:Pc,engine:function(){return ts},env:q,equal:Ci,erf:Wi,euclideanNorm:nu,exp:ru,expandDims:su,expm1:au,eye:iu,fft:lc,fill:mi,findBackend:function(e){return ts.findBackend(e)},findBackendFactory:function(e){return ts.findBackendFactory(e)},floor:uu,floorDiv:So,fused:Yc,gather:lu,gatherND:Lc,gather_util:Ha,getBackend:function(){return ts.backendName},getGradient:_n,getKernel:En,getKernelsForBackend:In,grad:function(e){return l($(e),(()=>"The f passed in grad(f) must be a function")),(t,n)=>{const r=cs(t,"x","tf.grad","string_or_numeric"),s=null!=n?cs(n,"dy","tf.grad"):null;return ts.tidy((()=>{const{value:t,grads:n}=ts.gradients((()=>e(r)),[r],s);return null!=s&&c(t.shape,s.shape,"The shape of dy passed in grad(f)(x, dy) must match the shape returned by f(x)"),ku(n),n[0]}))}},grads:function(e){return l($(e),(()=>"The f passed in grads(f) must be a function")),(t,n)=>{l(Array.isArray(t),(()=>"The args passed in grads(f)(args) must be an array of `Tensor`s or `TensorLike`s"));const r=ps(t,"args","tf.grads","string_or_numeric"),s=null!=n?cs(n,"dy","tf.grads"):null;return ts.tidy((()=>{const{value:t,grads:n}=ts.gradients((()=>e(...r)),r,s);return null!=s&&c(t.shape,s.shape,"The shape of dy passed in grads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),ku(n),n}))}},greater:cu,greaterEqual:pu,ifft:cc,imag:Ma,image:Qp,inTopKAsync:qc,io:Ta,irfft:pc,isFinite:hu,isInf:du,isNaN:mu,keep:$a,kernel_impls:wh,leakyRelu:fu,less:gu,lessEqual:yu,linalg:Xp,linspace:bu,localResponseNormalization:wu,log:xu,log1p:vu,logSigmoid:Eu,logSoftmax:Iu,logSumExp:Au,logicalAnd:$u,logicalNot:Mu,logicalOr:Ou,logicalXor:Du,losses:Yp,lowerBound:Cu,matMul:Ea,math:Ca,max:Ki,maxPool:Bu,maxPool3d:Lu,maxPoolWithArgmax:zu,maximum:Pu,mean:Vu,memory:function(){return ts.memory()},meshgrid:Uu,min:Hi,minimum:ju,mirrorPad:Gu,mod:Ku,moments:Hu,movingAverage:Fc,mul:To,multiRNNCell:Zu,multinomial:Ju,neg:Oa,nextFrame:function(){return new Promise((e=>hh((()=>e()))))},norm:tu,notEqual:Qu,oneHot:_a,ones:Wu,onesLike:Xu,op:ds,outerProduct:Yu,pad:el,pad1d:tl,pad2d:nl,pad3d:rl,pad4d:sl,pool:ol,pow:Zi,prelu:il,print:ca,prod:ul,profile:function(e){return ts.profile(e)},raggedGather:ll,raggedTensorToTensor:cl,rand:pl,randomGamma:Bl,randomNormal:Ll,randomStandardNormal:zl,randomUniform:Pl,range:Vl,ready:function(){return ts.ready()},real:Da,reciprocal:ql,registerBackend:function(e,t,n=1){return ts.registerBackend(e,t,n)},registerGradient:function(e){const{kernelName:t}=e;Tn.has(t)&&q().getBool("DEBUG")&&Sn(`Overriding the gradient for '${t}'`),Tn.set(t,e)},registerKernel:An,relu:Wl,relu6:Ul,removeBackend:function(e){ts.removeBackend(e)},reshape:Qo,reverse:jl,reverse1d:Gl,reverse2d:Kl,reverse3d:Hl,reverse4d:Zl,rfft:dc,round:Jl,rsqrt:Ql,scalar:Ji,scatterND:Cc,scatter_util:Xa,searchSorted:Fu,selu:Xl,separableConv2d:Yl,serialization:fo,setBackend:function(e){return ts.setBackend(e)},setPlatform:function(e,t){q().setPlatform(e,t)},setdiff1dAsync:ec,sigmoid:ti,sign:tc,signal:Jp,sin:nc,sinh:rc,slice:ni,slice1d:sc,slice2d:ac,slice3d:oc,slice4d:ic,slice_util:co,softmax:uc,softplus:Tu,spaceToBatchND:al,sparse:eh,sparseToDense:Bc,spectral:Zp,split:hc,sqrt:Qi,square:Xi,squaredDifference:mc,squeeze:fc,stack:gc,step:yc,stridedSlice:bc,string:th,sub:_u,sum:Yi,sumOutType:function(e){return jr(e,"int32")},tan:wc,tanh:ri,tensor:gs,tensor1d:xc,tensor2d:vc,tensor3d:Va,tensor4d:Nc,tensor5d:Sc,tensor6d:kc,tensor_util:Jr,test_util:vo,tidy:Ia,tile:ou,time:function(e){return ts.time(e)},topk:Tc,train:ph,transpose:Ra,truncatedNormal:Ec,unique:_c,unregisterGradient:function(e){if(!Tn.has(e))throw new Error(`The gradient '${e}' for backend is not registered`);Tn.delete(e)},unregisterKernel:function(e,t){const n=$n(e,t);if(!kn.has(n))throw new Error(`The kernel '${e}' for backend '${t}' is not registered`);kn.delete(n)},unsortedSegmentSum:Ic,unstack:Ac,upcastType:jr,upperBound:$c,util:Nr,valueAndGrad:function(e){return l($(e),(()=>"The f passed in valueAndGrad(f) must be a function")),(t,n)=>{l(t instanceof Br,(()=>"The x passed in valueAndGrad(f)(x) must be a tensor")),l(null==n||n instanceof Br,(()=>"The dy passed in valueAndGrad(f)(x, dy) must be a tensor"));const{grads:r,value:s}=ts.gradients((()=>e(t)),[t],n);return ku(r),{grad:r[0],value:s}}},valueAndGrads:function(e){return l($(e),(()=>"The f passed in valueAndGrads(f) must be a function")),(t,n)=>{l(Array.isArray(t)&&t.every((e=>e instanceof Br)),(()=>"The args passed in valueAndGrads(f)(args) must be array of tensors")),l(null==n||n instanceof Br,(()=>"The dy passed in valueAndGrads(f)(args, dy) must be a tensor"));const r=ts.gradients((()=>e(...t)),t,n);return null!=n&&c(r.value.shape,n.shape,"The shape of dy passed in valueAndGrads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),ku(r.grads),r}},variable:Mc,variableGrads:Nu,version_core:"3.21.0",where:Bi,whereAsync:Dc,zeros:qu,zerosLike:Li});
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
 *
 * =============================================================================
 */
var vh,Nh;q().registerFlag("KEEP_INTERMEDIATE_TENSORS",(()=>!1),(e=>{e&&console.warn("Keep intermediate tensors is ON. This will print the values of all intermediate tensors during model inference. Not all models support this mode. For details, check e2e/benchmarks/ model_config.js. This significantly impacts performance.")})),function(e){e[e.DT_INVALID=0]="DT_INVALID",e[e.DT_FLOAT=1]="DT_FLOAT",e[e.DT_DOUBLE=2]="DT_DOUBLE",e[e.DT_INT32=3]="DT_INT32",e[e.DT_UINT8=4]="DT_UINT8",e[e.DT_INT16=5]="DT_INT16",e[e.DT_INT8=6]="DT_INT8",e[e.DT_STRING=7]="DT_STRING",e[e.DT_COMPLEX64=8]="DT_COMPLEX64",e[e.DT_INT64=9]="DT_INT64",e[e.DT_BOOL=10]="DT_BOOL",e[e.DT_QINT8=11]="DT_QINT8",e[e.DT_QUINT8=12]="DT_QUINT8",e[e.DT_QINT32=13]="DT_QINT32",e[e.DT_BFLOAT16=14]="DT_BFLOAT16",e[e.DT_QINT16=15]="DT_QINT16",e[e.DT_QUINT16=16]="DT_QUINT16",e[e.DT_UINT16=17]="DT_UINT16",e[e.DT_COMPLEX128=18]="DT_COMPLEX128",e[e.DT_HALF=19]="DT_HALF",e[e.DT_RESOURCE=20]="DT_RESOURCE",e[e.DT_VARIANT=21]="DT_VARIANT",e[e.DT_UINT32=22]="DT_UINT32",e[e.DT_UINT64=23]="DT_UINT64",e[e.DT_FLOAT_REF=101]="DT_FLOAT_REF",e[e.DT_DOUBLE_REF=102]="DT_DOUBLE_REF",e[e.DT_INT32_REF=103]="DT_INT32_REF",e[e.DT_UINT8_REF=104]="DT_UINT8_REF",e[e.DT_INT16_REF=105]="DT_INT16_REF",e[e.DT_INT8_REF=106]="DT_INT8_REF",e[e.DT_STRING_REF=107]="DT_STRING_REF",e[e.DT_COMPLEX64_REF=108]="DT_COMPLEX64_REF",e[e.DT_INT64_REF=109]="DT_INT64_REF",e[e.DT_BOOL_REF=110]="DT_BOOL_REF",e[e.DT_QINT8_REF=111]="DT_QINT8_REF",e[e.DT_QUINT8_REF=112]="DT_QUINT8_REF",e[e.DT_QINT32_REF=113]="DT_QINT32_REF",e[e.DT_BFLOAT16_REF=114]="DT_BFLOAT16_REF",e[e.DT_QINT16_REF=115]="DT_QINT16_REF",e[e.DT_QUINT16_REF=116]="DT_QUINT16_REF",e[e.DT_UINT16_REF=117]="DT_UINT16_REF",e[e.DT_COMPLEX128_REF=118]="DT_COMPLEX128_REF",e[e.DT_HALF_REF=119]="DT_HALF_REF",e[e.DT_RESOURCE_REF=120]="DT_RESOURCE_REF",e[e.DT_VARIANT_REF=121]="DT_VARIANT_REF",e[e.DT_UINT32_REF=122]="DT_UINT32_REF",e[e.DT_UINT64_REF=123]="DT_UINT64_REF"}(vh||(vh={})),function(e){var t;(t=e.CheckpointFormatVersion||(e.CheckpointFormatVersion={}))[t.LEGACY=0]="LEGACY",t[t.V1=1]="V1",t[t.V2=2]="V2"}(Nh||(Nh={}));
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
const Sh={};function kh(e){return Sh[e]}
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
 */function Th(e,t,n,r,s){const a=t.inputParams[e];if(a&&void 0!==a.inputIndexStart){const e=a.inputIndexStart,o=0===a.inputIndexEnd?void 0:void 0===a.inputIndexEnd?e+1:a.inputIndexEnd;if("tensor"===a.type)return Eh(t.inputNames[a.inputIndexStart],n,r,s);if("tensors"===a.type){return t.inputNames.slice(e,o).map((e=>Eh(e,n,r,s)))}const i=Eh(t.inputNames.slice(e)[0],n,r,s),u=i.dataSync();return"number"===a.type?u[0]:R(i.shape,u)}const o=t.attrParams[e];return o&&o.value}function Eh(e,t,n,r){const[s,a]=Ah(e);if(null!=r){const e=r.getHashTableHandleByName(s);if(null!=e)return e}const o=n.currentContextIds.find((e=>!!t[Ih(s,e)]));return void 0!==o?t[Ih(s,o)][a]:void 0}function _h(e,t){const[n,r,s]=Ah(e);return[Ih(n,t&&t.currentContextId),r,s]}function Ih(e,t){return t?`${e}-${t}`:e}function Ah(e){const t=e.split(":");if(1===t.length)return[e,0,void 0];const n=t[0],r=3===t.length?t[1]:void 0;return[n,Number(t[t.length-1]),r]}function $h(e,t,n){let r=Th("pad",e,t,n);if("explicit"===r){r=Th("explicitPaddings",e,t,n);const s=[[0,0],[0,0],[0,0],[0,0]];for(let e=0;e<4;e++)s[e][0]=r[2*e],s[e][1]=r[2*e+1];return s}return r}function Mh(e){return e.kept?e:la(e)}
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
 */var Oh=Object.freeze({__proto__:null,json:[{tfOpName:"Add",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AddV2",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AddN",category:"arithmetic",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}]},{tfOpName:"BiasAdd",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"Sub",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"RealDiv",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Div",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"DivNoNan",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"FloorDiv",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Mul",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Maximum",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Minimum",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Pow",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SquaredDifference",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Mod",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"FloorMod",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}]});
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
 */var Dh=Object.freeze({__proto__:null,json:[{tfOpName:"Abs",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Acos",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Asin",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atan2",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Ceil",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ClipByValue",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"clipValueMin",type:"number"},{start:2,name:"clipValueMax",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Complex",category:"basic_math",inputs:[{start:0,name:"real",type:"tensor"},{start:1,name:"imag",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ComplexAbs",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cos",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cosh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Elu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Exp",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Floor",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Log",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Imag",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"Tout",name:"outputType",type:"dtype",notSupported:!0}]},{tfOpName:"Neg",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Real",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"Tout",name:"outputType",type:"dtype",notSupported:!0}]},{tfOpName:"Prelu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"alpha",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Relu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Relu6",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Selu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sigmoid",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sin",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sinh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sqrt",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Rsqrt",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Square",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Tan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Tanh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sign",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Round",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Expm1",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Log1p",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Reciprocal",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Softplus",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Asinh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Acosh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atanh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Erf",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Prod",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axes",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool",notSupported:!0},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LeakyRelu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"alpha",name:"alpha",type:"number",defaultValue:.2},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"IsNan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}]});
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
 */var Rh=Object.freeze({__proto__:null,json:[{tfOpName:"EmptyTensorList",category:"control",inputs:[{start:0,name:"elementShape",type:"shape"},{start:1,name:"maxNumElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"LoopCond",category:"control",inputs:[{start:0,name:"pred",type:"tensor"}]},{tfOpName:"Switch",category:"control",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"pred",type:"tensor"}]},{tfOpName:"Merge",category:"control",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}]},{tfOpName:"Enter",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"frame_name",name:"frameName",type:"string"},{tfName:"is_constant",name:"isConstant",type:"bool"}]},{tfOpName:"Exit",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"NextIteration",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayV3",category:"control",inputs:[{start:0,name:"size",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"dynamic_size",name:"dynamicSize",type:"bool"},{tfName:"clear_after_read",name:"clearAfterRead",type:"bool"},{tfName:"identical_element_shapes",name:"identicalElementShapes",type:"bool"},{tfName:"tensor_array_name",name:"name",type:"string"}]},{tfOpName:"TensorArrayWriteV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"tensor",type:"tensor"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayReadV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayGatherV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape",name:"elementShape",type:"shape"}]},{tfOpName:"TensorArrayScatterV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"tensor",type:"tensor"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"TensorArrayConcatV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape_except0",name:"elementShapeExcept0",type:"shape",notSupported:!0}]},{tfOpName:"TensorArraySplitV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"tensor",type:"tensor"},{start:2,name:"lengths",type:"number[]"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"TensorArraySizeV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"flowIn",type:"number"}]},{tfOpName:"TensorArrayCloseV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"}]},{tfOpName:"StatelessIf",category:"control",inputs:[{start:0,name:"cond",type:"tensor"},{start:1,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"then_branch",name:"thenBranch",type:"func"},{tfName:"else_branch",name:"elseBranch",type:"func"}]},{tfOpName:"If",category:"control",inputs:[{start:0,name:"cond",type:"tensor"},{start:1,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"then_branch",name:"thenBranch",type:"func"},{tfName:"else_branch",name:"elseBranch",type:"func"}]},{tfOpName:"StatelessWhile",category:"control",inputs:[{start:0,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"cond",name:"cond",type:"func"},{tfName:"body",name:"body",type:"func"}]},{tfOpName:"While",category:"control",inputs:[{start:0,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"cond",name:"cond",type:"func"},{tfName:"body",name:"body",type:"func"}]},{tfOpName:"TensorListScatter",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListScatterV2",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"},{start:3,name:"numElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListGather",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListGetItem",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListSetItem",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"tensor",type:"tensor"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListReserve",category:"control",inputs:[{start:0,name:"elementShape",type:"shape"},{start:1,name:"numElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListFromTensor",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListStack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"},{tfName:"num_elements",name:"numElements",type:"dtype"}]},{tfOpName:"TensorListSplit",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"elementShape",type:"shape"},{start:2,name:"lengths",type:"number[]"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListConcat",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}],attrs:[{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListConcatV2",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}],attrs:[{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListPopBack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListPushBack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"tensor",type:"tensor"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListLength",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}]},{tfOpName:"TensorListResize",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"size",type:"number"}]}]});
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
 */var Fh=Object.freeze({__proto__:null,json:[{tfOpName:"AvgPool",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPool",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[],notSupported:!0},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPoolWithArgmax",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"include_batch_in_index",name:"includeBatchInIndex",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AvgPool3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPool3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Conv1D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"stride",name:"stride",type:"number"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NWC"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"dilation",name:"dilation",type:"number",defaultValue:1}]},{tfOpName:"Conv2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"useCudnnOnGpu",name:"useCudnnOnGpu",type:"bool"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"_FusedConv2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"use_cudnn_on_gpu",name:"useCudnnOnGpu",type:"bool",defaultValue:!0},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]",defaultValue:[1,1,1,1]},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:1e-4},{tfName:"leakyrelu_alpha",name:"leakyreluAlpha",type:"number",defaultValue:.2}]},{tfOpName:"Conv2DBackpropInput",category:"convolution",inputs:[{start:2,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:0,name:"outputShape",type:"number[]"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]",notSupported:!0}]},{tfOpName:"DepthwiseConv2d",category:"convolution",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"DepthwiseConv2dNative",category:"convolution",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"FusedDepthwiseConv2dNative",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]",defaultValue:[1,1,1,1]},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]}]},{tfOpName:"Conv3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"Dilation2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"rates",name:"dilations",type:"number[]"},{tfName:"padding",name:"pad",type:"string"}]}]});
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
 */var Ch=Object.freeze({__proto__:null,json:[{tfOpName:"Fill",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"},{start:1,name:"value",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"LinSpace",category:"creation",inputs:[{start:0,name:"start",type:"number"},{start:1,name:"stop",type:"number"},{start:2,name:"num",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"OneHot",category:"creation",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"depth",type:"number"},{start:2,name:"onValue",type:"number",defaultValue:1},{start:3,name:"offValue",type:"number",defaultValue:0}],attrs:[{tfName:"axis",name:"axis",type:"number",notSupported:!0},{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"Ones",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"OnesLike",category:"creation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"RandomStandardNormal",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"RandomUniform",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"minval",name:"minval",type:"number",defaultValue:0},{tfName:"maxval",name:"maxval",type:"number",defaultValue:1},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"Range",category:"creation",inputs:[{start:0,name:"start",type:"number"},{start:1,name:"stop",type:"number"},{start:2,name:"step",type:"number",defaultValue:0}],attrs:[{tfName:"Tidx",name:"dtype",type:"dtype"}]},{tfOpName:"TruncatedNormal",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"means",name:"mean",type:"number",defaultValue:0},{tfName:"stddev",name:"stdDev",type:"number",defaultValue:1},{tfName:"seed",name:"seed",type:"number"},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"Zeros",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"ZerosLike",category:"creation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"Multinomial",category:"creation",inputs:[{start:0,name:"logits",type:"tensor"},{start:1,name:"numSamples",type:"number"}],attrs:[{tfName:"seed",name:"seed",type:"number"},{tfName:"seed2",name:"seed2",type:"number"},{tfName:"T",name:"dtype",type:"dtype"},{tfName:"output_dtype",name:"output_dtype",type:"dtype"}]}]});
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
 */var Bh=Object.freeze({__proto__:null,json:[{tfOpName:"NonMaxSuppressionV2",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"}]},{tfOpName:"NonMaxSuppressionV3",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"}]},{tfOpName:"NonMaxSuppressionV4",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"T_threshold",name:"threshold",type:"dtype",notSupported:!0},{tfName:"pad_to_max_output_size",name:"padToMaxOutputSize",type:"bool"}]},{tfOpName:"NonMaxSuppressionV5",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"},{start:5,name:"softNmsSigma",type:"number"}]},{tfOpName:"Where",category:"dynamic",inputs:[{start:0,name:"condition",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ListDiff",category:"dynamic",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}]});
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
 */var Lh=Object.freeze({__proto__:null,json:[{tfOpName:"LowerBound",category:"evaluation",inputs:[{start:0,name:"sortedSequence",type:"tensor"},{start:1,name:"values",type:"tensor"}]},{tfOpName:"TopKV2",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"k",type:"number"}],attrs:[{tfName:"sorted",name:"sorted",type:"bool"}]},{tfOpName:"UpperBound",category:"evaluation",inputs:[{start:0,name:"sortedSequence",type:"tensor"},{start:1,name:"values",type:"tensor"}]},{tfOpName:"Unique",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"UniqueV2",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]}]});
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
 */var zh=Object.freeze({__proto__:null,json:[{tfOpName:"PlaceholderWithDefault",category:"graph",inputs:[{start:0,name:"default",type:"tensor"}],attrs:[{tfName:"shape",name:"shape",type:"shape"},{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"Placeholder",category:"graph",attrs:[{tfName:"shape",name:"shape",type:"shape"},{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"Const",category:"graph"},{tfOpName:"Identity",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"IdentityN",category:"graph",inputs:[{start:0,end:0,name:"x",type:"tensors"}]},{tfOpName:"Snapshot",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Rank",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Size",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Shape",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"ShapeN",category:"graph",inputs:[{start:0,end:0,name:"x",type:"tensors"}]},{tfOpName:"Print",category:"graph",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"data",type:"tensors"}],attrs:[{tfName:"message",name:"message",type:"string"},{tfName:"first_n",name:"firstN",type:"number",notSupported:!0},{tfName:"summarize",name:"summarize",type:"number",defaultValue:3}]},{tfOpName:"NoOp",category:"graph",inputs:[]},{tfOpName:"StopGradient",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"FakeQuantWithMinMaxVars",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"min",name:"min",type:"number"},{tfName:"max",name:"max",type:"number"}]}]});
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
 */var Ph=Object.freeze({__proto__:null,json:[{tfOpName:"HashTable",category:"hash_table",inputs:[],attrs:[{tfName:"shared_name",name:"sharedName",type:"string"},{tfName:"use_node_name_sharing",name:"useNodeNameSharing",type:"bool"},{tfName:"key_dtype",name:"keyDType",type:"dtype"},{tfName:"value_dtype",name:"valueDType",type:"dtype"}]},{tfOpName:"HashTableV2",category:"hash_table",inputs:[],attrs:[{tfName:"shared_name",name:"sharedName",type:"string"},{tfName:"use_node_name_sharing",name:"useNodeNameSharing",type:"bool"},{tfName:"key_dtype",name:"keyDType",type:"dtype"},{tfName:"value_dtype",name:"valueDType",type:"dtype"}]},{tfOpName:"LookupTableImport",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableImportV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableFind",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableFindV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableSize",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"}]},{tfOpName:"LookupTableSizeV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"}]}]});
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
 */var Vh=Object.freeze({__proto__:null,json:[{tfOpName:"ResizeBilinear",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"size",type:"number[]"}],attrs:[{tfName:"align_corners",name:"alignCorners",type:"bool"},{tfName:"half_pixel_centers",name:"halfPixelCenters",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ResizeNearestNeighbor",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"size",type:"number[]"}],attrs:[{tfName:"align_corners",name:"alignCorners",type:"bool"},{tfName:"half_pixel_centers",name:"halfPixelCenters",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"CropAndResize",category:"image",inputs:[{start:0,name:"image",type:"tensor"},{start:1,name:"boxes",type:"tensor"},{start:2,name:"boxInd",type:"tensor"},{start:3,name:"cropSize",type:"number[]"}],attrs:[{tfName:"method",name:"method",type:"string"},{tfName:"extrapolation_value",name:"extrapolationValue",type:"number"}]},{tfOpName:"ImageProjectiveTransformV3",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"transforms",type:"tensor"},{start:2,name:"outputShape",type:"number[]"},{start:3,name:"fillValue",type:"number"}],attrs:[{tfName:"interpolation",name:"interpolation",type:"string"},{tfName:"fill_mode",name:"fillMode",type:"string"}]}]});
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
 */var qh=Object.freeze({__proto__:null,json:[{tfOpName:"Equal",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"NotEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Greater",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"GreaterEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Less",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LessEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalAnd",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalNot",category:"logical",inputs:[{start:0,name:"a",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalOr",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Select",category:"logical",inputs:[{start:0,name:"condition",type:"tensor"},{start:1,name:"a",type:"tensor"},{start:2,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SelectV2",category:"logical",inputs:[{start:0,name:"condition",type:"tensor"},{start:1,name:"a",type:"tensor"},{start:2,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}]});
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
 */var Wh=Object.freeze({__proto__:null,json:[{tfOpName:"_FusedMatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:1e-4},{tfName:"transpose_a",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"transpose_b",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"leakyrelu_alpha",name:"leakyreluAlpha",type:"number",defaultValue:.2},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"transpose_a",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"transpose_b",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BatchMatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"adj_x",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"adj_y",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BatchMatMulV2",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"adj_x",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"adj_y",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Transpose",category:"matrices",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"perm",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Einsum",category:"matrices",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}],attrs:[{tfName:"equation",name:"equation",type:"string"},{tfName:"N",name:"n",type:"number",defaultValue:2},{tfName:"T",name:"dtype",type:"dtype"}]}]});
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
 */var Uh=Object.freeze({__proto__:null,json:[{tfOpName:"EuclideanNorm",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool",defaultValue:!1}]},{tfOpName:"FusedBatchNorm",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"FusedBatchNormV2",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"FusedBatchNormV3",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"LRN",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"depth_radius",name:"radius",type:"number",defaultValue:5},{tfName:"bias",name:"bias",type:"number",defaultValue:1},{tfName:"alpha",name:"alpha",type:"number",defaultValue:1},{tfName:"beta",name:"beta",type:"number",defaultValue:.5}]},{tfOpName:"Softmax",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"LogSoftmax",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"SparseToDense",category:"normalization",inputs:[{start:0,name:"sparseIndices",type:"tensor"},{start:1,name:"outputShape",type:"number[]"},{start:2,name:"sparseValues",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",defaultValue:!0,notSupported:!0}]}]});
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
 */var jh=Object.freeze({__proto__:null,json:[{tfOpName:"Bincount",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"size",type:"number"},{start:2,name:"weights",type:"tensor"}]},{tfOpName:"DenseBincount",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"size",type:"number"},{start:2,name:"weights",type:"tensor"}],attrs:[{tfName:"binary_output",name:"binaryOutput",type:"bool"}]},{tfOpName:"Max",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Mean",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Min",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Sum",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"All",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Any",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"ArgMax",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"ArgMin",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"Prod",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Cumprod",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}],attrs:[{tfName:"exclusive",name:"exclusive",type:"bool"},{tfName:"reverse",name:"reverse",type:"bool"}]},{tfOpName:"Cumsum",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}],attrs:[{tfName:"exclusive",name:"exclusive",type:"bool"},{tfName:"reverse",name:"reverse",type:"bool"}]}]});
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
 */var Gh=Object.freeze({__proto__:null,json:[{tfOpName:"ConcatV2",category:"slice_join",inputs:[{start:0,end:-1,name:"tensors",type:"tensors"},{start:-1,name:"axis",type:"number"}],attrs:[{tfName:"N",name:"n",type:"number",defaultValue:2}]},{tfOpName:"Concat",category:"slice_join",inputs:[{start:1,end:0,name:"tensors",type:"tensors"},{start:0,name:"axis",type:"number"}],attrs:[{tfName:"N",name:"n",type:"number",defaultValue:2}]},{tfOpName:"GatherV2",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"axis",type:"number",defaultValue:0}],attrs:[{tfName:"batch_dims",name:"batchDims",type:"number",defaultValue:0}]},{tfOpName:"Gather",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",notSupported:!0}]},{tfOpName:"Reverse",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"dims",type:"bool[]"}]},{tfOpName:"ReverseV2",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}]},{tfOpName:"Slice",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"begin",type:"number[]"},{start:2,name:"size",type:"number[]"}]},{tfOpName:"StridedSlice",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"begin",type:"number[]"},{start:2,name:"end",type:"number[]"},{start:3,name:"strides",type:"number[]"}],attrs:[{tfName:"begin_mask",name:"beginMask",type:"number",defaultValue:0},{tfName:"end_mask",name:"endMask",type:"number",defaultValue:0},{tfName:"new_axis_mask",name:"newAxisMask",type:"number",defaultValue:0},{tfName:"ellipsis_mask",name:"ellipsisMask",type:"number",defaultValue:0},{tfName:"shrink_axis_mask",name:"shrinkAxisMask",type:"number",defaultValue:0}]},{tfOpName:"Pack",category:"slice_join",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}],attrs:[{tfName:"axis",name:"axis",type:"number",defaultValue:0}]},{tfOpName:"Unpack",category:"slice_join",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"axis",name:"axis",type:"number",defaultValue:0},{tfName:"num",name:"num",type:"number",defaultValue:0,notSupported:!0}]},{tfOpName:"Tile",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"reps",type:"number[]"}]},{tfOpName:"Split",category:"slice_join",inputs:[{start:0,name:"axis",type:"number",defaultValue:0},{start:1,name:"x",type:"tensor"}],attrs:[{tfName:"num_split",name:"numOrSizeSplits",type:"number",defaultValue:1}]},{tfOpName:"SplitV",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"numOrSizeSplits",type:"number[]"},{start:2,name:"axis",type:"number",defaultValue:0}]},{tfOpName:"ScatterNd",category:"slice_join",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"values",type:"tensor"},{start:2,name:"shape",type:"number[]"}]},{tfOpName:"GatherNd",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"}]},{tfOpName:"SparseToDense",category:"slice_join",inputs:[{start:0,name:"sparseIndices",type:"tensor"},{start:1,name:"outputShape",type:"number[]"},{start:2,name:"sparseValues",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",defaultValue:!1,notSupported:!0}]}]});
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
 */var Kh=Object.freeze({__proto__:null,json:[{tfOpName:"SparseFillEmptyRows",category:"sparse",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"values",type:"tensor"},{start:2,name:"denseShape",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}]},{tfOpName:"SparseReshape",category:"sparse",inputs:[{start:0,name:"inputIndices",type:"tensor"},{start:1,name:"inputShape",type:"tensor"},{start:2,name:"newShape",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SparseSegmentMean",category:"sparse",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"segmentIds",type:"tensor"}]},{tfOpName:"SparseSegmentSum",category:"sparse",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"segmentIds",type:"tensor"}]}]});
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
 */var Hh=Object.freeze({__proto__:null,json:[{tfOpName:"FFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"IFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"RFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"fft_length",type:"number",notSupported:!0}]},{tfOpName:"IRFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"fft_length",type:"number",notSupported:!0}]}]});
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
 */var Zh=Object.freeze({__proto__:null,json:[{tfOpName:"StringNGrams",category:"string",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"dataSplits",type:"tensor"}],attrs:[{tfName:"separator",name:"separator",type:"string"},{tfName:"ngram_widths",name:"nGramWidths",type:"number[]"},{tfName:"left_pad",name:"leftPad",type:"string"},{tfName:"right_pad",name:"rightPad",type:"string"},{tfName:"pad_width",name:"padWidth",type:"number"},{tfName:"preserve_short_sequences",name:"preserveShortSequences",type:"bool"}],outputs:["ngrams","ngrams_splits"]},{tfOpName:"StringSplit",category:"string",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"delimiter",type:"tensor"}],attrs:[{tfName:"skip_empty",name:"skipEmpty",type:"bool"}],outputs:["indices","values","shape"]},{tfOpName:"StringToHashBucketFast",category:"string",inputs:[{start:0,name:"input",type:"tensor"}],attrs:[{tfName:"num_buckets",name:"numBuckets",type:"number"}]}]});
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
 */var Jh=Object.freeze({__proto__:null,json:[{tfOpName:"Cast",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"SrcT",name:"sdtype",type:"dtype",notSupported:!0},{tfName:"DstT",name:"dtype",type:"dtype"}]},{tfOpName:"ExpandDims",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"MirrorPad",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"}],attrs:[{tfName:"mode",name:"mode",type:"string"}]},{tfOpName:"Pad",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"}],attrs:[{tfName:"constant_value",name:"constantValue",type:"number",defaultValue:0}]},{tfOpName:"PadV2",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"},{start:2,name:"constantValue",type:"number",defaultValue:0}]},{tfOpName:"Reshape",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}]},{tfOpName:"Squeeze",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"axis",tfDeprecatedName:"squeeze_dims",name:"axis",type:"number[]"}]},{tfOpName:"SpaceToBatchND",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"blockShape",type:"number[]"},{start:2,name:"paddings",type:"number[]"}]},{tfOpName:"BatchToSpaceND",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"blockShape",type:"number[]"},{start:2,name:"crops",type:"number[]"}]},{tfOpName:"DepthToSpace",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"block_size",name:"blockSize",type:"number"},{tfName:"data_format",name:"dataFormat",type:"string"}]},{tfOpName:"BroadcastTo",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}],attrs:[]},{tfOpName:"BroadcastArgs",category:"transformation",inputs:[{start:0,name:"s0",type:"tensor"},{start:1,name:"s1",type:"tensor"}],attrs:[]}]});
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
 */class Qh{static get Instance(){return this._instance||(this._instance=new this)}constructor(){const e=[].concat(...[Oh,Dh,Rh,Fh,Ch,Bh,Lh,zh,Ph,Vh,qh,Wh,Uh,jh,Gh,Kh,Hh,Zh,Jh].map((e=>e.json)));this.opMappers=e.reduce(((e,t)=>(e[t.tfOpName]=t,e)),{})}transformGraph(e,t={}){const n=e.node,r=[],s=[],a=[],o=n.reduce(((e,t)=>(e[t.name]=this.mapNode(t),t.op.startsWith("Placeholder")?r.push(e[t.name]):"Const"===t.op?s.push(e[t.name]):null!=t.input&&0!==t.input.length||a.push(e[t.name]),e)),{});let i=[];const u=[];let l={},c={};null!=t&&(l=this.mapSignatureEntries(t.inputs),c=this.mapSignatureEntries(t.outputs));const p=Object.keys(o);p.forEach((e=>{const t=o[e];t.inputNames.forEach(((e,n)=>{const[r,,s]=_h(e),a=o[r];if(null!=a.outputs){const e=a.outputs.indexOf(s);if(-1!==e){const s=`${r}:${e}`;t.inputNames[n]=s}}t.inputs.push(a),a.children.push(t)}))})),0===Object.keys(c).length?p.forEach((e=>{const t=o[e];0===t.children.length&&u.push(t)})):Object.keys(c).forEach((e=>{const[t]=_h(e),n=o[t];null!=n&&(n.signatureKey=c[e],u.push(n))})),Object.keys(l).length>0?Object.keys(l).forEach((e=>{const[t]=_h(e),n=o[t];n&&(n.signatureKey=l[e],i.push(n))})):i=r;let h={};null!=e.library&&null!=e.library.function&&(h=e.library.function.reduce(((e,t)=>(e[t.signature.name]=this.mapFunction(t),e)),{}));const d={nodes:o,inputs:i,outputs:u,weights:s,placeholders:r,signature:t,functions:h};return a.length>0&&(d.initNodes=a),d}mapSignatureEntries(e){return Object.keys(e||{}).reduce(((t,n)=>(t[e[n].name]=n,t)),{})}mapNode(e){const t=kh(e.op)||this.opMappers[e.op]||{};null==e.attr&&(e.attr={});const n={name:e.name,op:e.op,category:t.category,inputNames:(e.input||[]).map((e=>e.startsWith("^")?e.slice(1):e)),inputs:[],children:[],inputParams:{},attrParams:{},rawAttrs:e.attr,outputs:t.outputs};return null!=t.inputs&&(n.inputParams=t.inputs.reduce(((e,t)=>(e[t.name]={type:t.type,inputIndexStart:t.start,inputIndexEnd:t.end},e)),{})),null!=t.attrs&&(n.attrParams=t.attrs.reduce(((t,n)=>{const r=n.type;let s;switch(n.type){case"string":s=Yh(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=Yh(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"string[]":s=ld(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=ld(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"number":s=td(e.attr,n.tfName,n.defaultValue||0),void 0===s&&n.tfDeprecatedName&&(s=td(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"number[]":s=ud(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=ud(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"bool":s=ed(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=ed(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"bool[]":s=pd(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=pd(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"shape":s=id(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=id(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"shape[]":s=cd(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=cd(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"dtype":s=sd(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=sd(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"dtype[]":s=ad(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=ad(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"func":s=rd(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=rd(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"tensor":case"tensors":break;default:throw new Error(`Unsupported param type: ${n.type} for op: ${e.op}`)}return t[n.name]={value:s,type:r},t}),{})),n}mapFunction(e){const t=e.nodeDef,n=[];let r={};null!=t&&(r=t.reduce(((e,t)=>(e[t.name]=this.mapNode(t),"Const"===t.op&&n.push(e[t.name]),e)),{}));const s=[],a=[];e.signature.inputArg.forEach((e=>{const[t]=_h(e.name),n={name:t,op:"Placeholder",inputs:[],inputNames:[],category:"graph",inputParams:{},attrParams:{dtype:{value:nd(e.type),type:"dtype"}},children:[]};n.signatureKey=e.name,s.push(n),r[t]=n}));Object.keys(r).forEach((e=>{const t=r[e];t.inputNames.forEach(((e,n)=>{const[s,,a]=_h(e),o=r[s];if(null!=o.outputs){const e=o.outputs.indexOf(a);if(-1!==e){const r=`${s}:${e}`;t.inputNames[n]=r}}t.inputs.push(o),o.children.push(t)}))}));const o=e.ret;e.signature.outputArg.forEach((e=>{const[t,n]=_h(o[e.name]),s=r[t];null!=s&&(s.defaultOutput=n,a.push(s))}));const i=this.mapArgsToSignature(e);return{nodes:r,inputs:s,outputs:a,weights:n,placeholders:[],signature:i}}mapArgsToSignature(e){return{methodName:e.signature.name,inputs:e.signature.inputArg.reduce(((e,t)=>(e[t.name]=this.mapArgToTensorInfo(t),e)),{}),outputs:e.signature.outputArg.reduce(((t,n)=>(t[n.name]=this.mapArgToTensorInfo(n,e.ret),t)),{})}}mapArgToTensorInfo(e,t){let n=e.name;return null!=t&&(n=t[n]),{name:n,dtype:e.type}}}function Xh(e,t){const n=Array.isArray(e)?String.fromCharCode.apply(null,e):function(e){const t=q().global;if(void 0!==t.atob)return t.atob(e);if("undefined"!=typeof Buffer)return new Buffer(e,"base64").toString();throw new Error("Unable to decode base64 in this environment. Missing built-in atob() or Buffer()")}(e);return t?n:n.toLowerCase()}function Yh(e,t,n,r=!1){const s=e[t];return null!=s?Xh(s.s,r):n}function ed(e,t,n){const r=e[t];return r?r.b:n}function td(e,t,n){const r=e[t]||{},s=null!=r.i?r.i:null!=r.f?r.f:n;return"number"==typeof s?s:parseInt(s,10)}function nd(e){switch("string"==typeof e&&(e=vh[e]),e){case vh.DT_FLOAT:case vh.DT_HALF:return"float32";case vh.DT_INT32:case vh.DT_INT64:case vh.DT_INT8:case vh.DT_UINT8:return"int32";case vh.DT_BOOL:return"bool";case vh.DT_DOUBLE:return"float32";case vh.DT_STRING:return"string";default:return null}}function rd(e,t,n){const r=e[t];return r&&r.func?r.func.name:n}function sd(e,t,n){const r=e[t];return r&&r.type?nd(r.type):n}function ad(e,t,n){const r=e[t];return r&&r.list&&r.list.type?r.list.type.map((e=>nd(e))):n}function od(e){if(!e.unknownRank)return null!=e.dim?e.dim.map((e=>"number"==typeof e.size?e.size:parseInt(e.size,10))):[]}function id(e,t,n){const r=e[t];return r&&r.shape?od(r.shape):n}function ud(e,t,n){const r=e[t];return r?((r.list.f&&r.list.f.length?r.list.f:r.list.i)||[]).map((e=>"number"==typeof e?e:parseInt(e,10))):n}function ld(e,t,n,r=!1){const s=e[t];return s&&s.list&&s.list.s?s.list.s.map((e=>Xh(e,r))):n}function cd(e,t,n){const r=e[t];return r&&r.list&&r.list.shape?r.list.shape.map((e=>od(e))):n}function pd(e,t,n){const r=e[t];return r&&r.list&&r.list.b?r.list.b:n}
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
 */class hd{constructor(e,t,n){this.node=e,this.tensorMap=t,this.context=n,this.inputs=[],this.attrs={},this.inputs=e.inputNames.map((e=>this.getInput(e))),null!=e.rawAttrs&&(this.attrs=Object.keys(e.rawAttrs).reduce(((e,t)=>(e[t]=this.getAttr(t),e)),{}))}getInput(e){return Eh(e,this.tensorMap,this.context)}getAttr(e,t){const n=this.node.rawAttrs[e];if(null!=n.tensor)return Eh(e,this.tensorMap,this.context);if(null!=n.i||null!=n.f)return td(this.node.rawAttrs,e,t);if(null!=n.s)return Yh(this.node.rawAttrs,e,t);if(null!=n.b)return ed(this.node.rawAttrs,e,t);if(null!=n.shape)return id(this.node.rawAttrs,e,t);if(null!=n.type)return sd(this.node.rawAttrs,e,t);if(null!=n.list){if(null!=n.list.i||null!=n.list.f)return ud(this.node.rawAttrs,e,t);if(null!=n.list.s)return ld(this.node.rawAttrs,e,t);if(null!=n.list.shape)return cd(this.node.rawAttrs,e,t);if(null!=n.list.b)return pd(this.node.rawAttrs,e,t);if(null!=n.list.type)return ad(this.node.rawAttrs,e,t)}return t}}
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
 */var dd=Object.freeze({__proto__:null,OP_SCOPE_SUFFIX:hs,abs:Eo,acos:_o,acosh:Io,add:No,addN:Ao,all:$o,any:Mo,argMax:Oo,argMin:Do,asin:Ro,asinh:Fo,atan:Co,atan2:Bo,atanh:Lo,avgPool:Xo,avgPool3d:Yo,basicLSTMCell:si,batchNorm:oi,batchNorm2d:ii,batchNorm3d:ui,batchNorm4d:li,batchToSpaceND:ai,bincount:ci,booleanMaskAsync:Rc,broadcastArgs:pi,broadcastTo:hi,buffer:ia,cast:ua,ceil:di,clipByValue:fi,clone:la,complex:ms,concat:ei,concat1d:gi,concat2d:yi,concat3d:bi,concat4d:wi,conv1d:vi,conv2d:xi,conv2dTranspose:Si,conv3d:ki,conv3dTranspose:Ei,cos:_i,cosh:Ii,cosineWindow:Vc,cumprod:Ai,cumsum:$i,denseBincount:Mi,depthToSpace:Oi,depthwiseConv2d:Di,diag:Ri,dilation2d:Fi,div:ko,divNoNan:zi,dot:Pi,dropout:zc,einsum:Vi,elu:qi,enclosingPowerOfTwo:Pc,equal:Ci,erf:Wi,euclideanNorm:nu,exp:ru,expandDims:su,expm1:au,eye:iu,fft:lc,fill:mi,floor:uu,floorDiv:So,fused:Yc,gather:lu,gatherND:Lc,greater:cu,greaterEqual:pu,ifft:cc,imag:Ma,image:Qp,inTopKAsync:qc,irfft:pc,isFinite:hu,isInf:du,isNaN:mu,leakyRelu:fu,less:gu,lessEqual:yu,linalg:Xp,linspace:bu,localResponseNormalization:wu,log:xu,log1p:vu,logSigmoid:Eu,logSoftmax:Iu,logSumExp:Au,logicalAnd:$u,logicalNot:Mu,logicalOr:Ou,logicalXor:Du,losses:Yp,lowerBound:Cu,matMul:Ea,max:Ki,maxPool:Bu,maxPool3d:Lu,maxPoolWithArgmax:zu,maximum:Pu,mean:Vu,meshgrid:Uu,min:Hi,minimum:ju,mirrorPad:Gu,mod:Ku,moments:Hu,movingAverage:Fc,mul:To,multiRNNCell:Zu,multinomial:Ju,neg:Oa,norm:tu,notEqual:Qu,oneHot:_a,ones:Wu,onesLike:Xu,op:ds,outerProduct:Yu,pad:el,pad1d:tl,pad2d:nl,pad3d:rl,pad4d:sl,pool:ol,pow:Zi,prelu:il,print:ca,prod:ul,raggedGather:ll,raggedTensorToTensor:cl,rand:pl,randomGamma:Bl,randomNormal:Ll,randomStandardNormal:zl,randomUniform:Pl,range:Vl,real:Da,reciprocal:ql,relu:Wl,relu6:Ul,reshape:Qo,reverse:jl,reverse1d:Gl,reverse2d:Kl,reverse3d:Hl,reverse4d:Zl,rfft:dc,round:Jl,rsqrt:Ql,scalar:Ji,scatterND:Cc,searchSorted:Fu,selu:Xl,separableConv2d:Yl,setdiff1dAsync:ec,sigmoid:ti,sign:tc,signal:Jp,sin:nc,sinh:rc,slice:ni,slice1d:sc,slice2d:ac,slice3d:oc,slice4d:ic,softmax:uc,softplus:Tu,spaceToBatchND:al,sparse:eh,sparseToDense:Bc,spectral:Zp,split:hc,sqrt:Qi,square:Xi,squaredDifference:mc,squeeze:fc,stack:gc,step:yc,stridedSlice:bc,string:th,sub:_u,sum:Yi,tan:wc,tanh:ri,tensor:gs,tensor1d:xc,tensor2d:vc,tensor3d:Va,tensor4d:Nc,tensor5d:Sc,tensor6d:kc,tile:ou,topk:Tc,transpose:Ra,truncatedNormal:Ec,unique:_c,unsortedSegmentSum:Ic,unstack:Ac,upperBound:$c,variable:Mc,where:Bi,whereAsync:Dc,zeros:qu,zerosLike:Li});
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
function md(e,t,n=""){if("number"!=typeof e&&"number"!=typeof t){l(e.length===t.length,(()=>n+` Shapes ${e} and ${t} must match`));for(let r=0;r<e.length;r++){const s=e[r],a=t[r];l(s<0||a<0||s===a,(()=>n+` Shapes ${e} and ${t} must match`))}}}function fd(e){return"number"!=typeof e&&!e.some((e=>e<0))}function gd(e,t,n){let r=yd(e,n);const s=!fd(r);if(s&&0===t.length)throw new Error(`Tried to calculate elements of an empty list with non-fully-defined elementShape: ${r}`);if(s&&t.forEach((e=>{r=yd(e.shape,r)})),!fd(r))throw new Error(`Non-fully-defined elementShape: ${r}`);return r}function yd(e,t){if("number"==typeof e)return t;if("number"==typeof t)return e;if(e.length!==t.length)throw new Error(`Incompatible ranks during merge: ${e} vs. ${t}`);const n=[];for(let r=0;r<e.length;++r){const s=e[r],a=t[r];if(s>=0&&a>=0&&s!==a)throw new Error(`Incompatible shape during merge: ${e} vs. ${t}`);n[r]=s>=0?s:a}return n}
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
 */class bd{constructor(e,t,n,r,s,a,o){this.name=e,this.dtype=t,this.maxSize=n,this.elementShape=r,this.identicalElementShapes=s,this.dynamicSize=a,this.clearAfterRead=o,this.tensors=[],this.closed_=!1,this.idTensor=Ji(0),$a(this.idTensor)}get id(){return this.idTensor.id}get closed(){return this.closed_}clearAndClose(e){this.tensors.forEach((t=>{null!=e&&e.has(t.tensor.id)||t.tensor.dispose()})),this.tensors=[],this.closed_=!0,this.idTensor.dispose()}size(){return this.tensors.length}read(e){if(this.closed_)throw new Error(`TensorArray ${this.name} has already been closed.`);if(e<0||e>=this.size())throw new Error(`Tried to read from index ${e}, but array size is: ${this.size()}`);const t=this.tensors[e];if(t.cleared)throw new Error(`TensorArray ${this.name}: Could not read index ${e} twice because it was cleared after a previous read (perhaps try setting clear_after_read = false?).`);return this.clearAfterRead&&(t.cleared=!0),t.read=!0,t.tensor}readMany(e){return e.map((e=>this.read(e)))}write(e,t){if(this.closed_)throw new Error(`TensorArray ${this.name} has already been closed.`);if(e<0||!this.dynamicSize&&e>=this.maxSize)throw new Error(`Tried to write to index ${e}, but array is not resizeable and size is: ${this.maxSize}`);const n=this.tensors[e]||{};if(t.dtype!==this.dtype)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e},\n          because the value dtype is ${t.dtype}, but TensorArray dtype is ${this.dtype}.`);if(0!==this.size()||null!=this.elementShape&&0!==this.elementShape.length||(this.elementShape=t.shape),md(this.elementShape,t.shape,`TensorArray ${this.name}: Could not write to TensorArray index ${e}.`),n.read)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been read.`);if(n.written)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been written.`);n.tensor=t,$a(t),n.written=!0,this.tensors[e]=n}writeMany(e,t){if(e.length!==t.length)throw new Error(`TensorArray ${this.name}: could not write multiple tensors,because the index size: ${e.length} is not the same as tensors size: ${t.length}.`);e.forEach(((e,n)=>this.write(e,t[n])))}gather(e,t){if(t&&t!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but gather requested dtype ${t}`);if(e)e=e.slice(0,this.size());else{e=[];for(let t=0;t<this.size();t++)e.push(t)}if(0===e.length)return gs([],[0].concat(this.elementShape));const n=this.readMany(e);return md(this.elementShape,n[0].shape,"TensorArray shape mismatch: "),gc(n,0)}concat(e){if(e&&e!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but concat requested dtype ${e}`);if(0===this.size())return gs([],[0].concat(this.elementShape));const t=[];for(let e=0;e<this.size();e++)t.push(e);const n=this.readMany(t);return md(this.elementShape,n[0].shape,`TensorArray shape mismatch: tensor array shape (${this.elementShape}) vs first tensor shape (${n[0].shape})`),ei(n,0)}scatter(e,t){if(t.dtype!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${t.dtype}`);if(e.length!==t.shape[0])throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${e.length} vs. ${t.shape[0]}`);const n=Math.max(...e);if(!this.dynamicSize&&n>=this.maxSize)throw new Error(`Max index must be < array size (${n}  vs. ${this.maxSize})`);this.writeMany(e,Ac(t,0))}split(e,t){if(t.dtype!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${t.dtype}`);let n=0;const r=e.map((e=>(n+=e,n)));if(n!==t.shape[0])throw new Error(`Expected sum of lengths to be equal to\n          tensor.shape[0], but sum of lengths is\n        ${n}, and tensor's shape is: ${t.shape}`);if(!this.dynamicSize&&e.length!==this.maxSize)throw new Error(`TensorArray's size is not equal to the size of lengths (${this.maxSize} vs. ${e.length}), and the TensorArray is not marked as dynamically resizeable`);const s=0===n?0:t.size/n,a=[];Ia((()=>{t=Qo(t,[1,n,s]);for(let n=0;n<e.length;++n){const o=[0,0===n?0:r[n-1],0],i=[1,e[n],s];a[n]=Qo(ni(t,o,i),this.elementShape)}return a}));const o=[];for(let t=0;t<e.length;t++)o[t]=t;this.writeMany(o,a)}}
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
 */class wd{constructor(e,t,n,r=-1){this.tensors=e,this.elementShape=t,this.elementDtype=n,null!=e&&e.forEach((e=>{if(n!==e.dtype)throw new Error(`Invalid data types; op elements ${n}, but list elements ${e.dtype}`);md(t,e.shape,"TensorList shape mismatch: "),$a(e)})),this.idTensor=Ji(0),this.maxNumElements=r,$a(this.idTensor)}get id(){return this.idTensor.id}copy(){return new wd([...this.tensors],this.elementShape,this.elementDtype)}clearAndClose(e){this.tensors.forEach((t=>{null!=e&&e.has(t.id)||t.dispose()})),this.tensors.length=0,this.idTensor.dispose()}size(){return this.tensors.length}stack(e,t,n=-1){if(t!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);if(-1!==n&&this.tensors.length!==n)throw new Error(`Operation expected a list with ${n} elements but got a list with ${this.tensors.length} elements.`);md(e,this.elementShape,"TensorList shape mismatch: ");const r=gd(this.elementShape,this.tensors,e);return Ia((()=>{const e=this.tensors.map((e=>Qo(e,r)));return gc(e,0)}))}popBack(e,t){if(t!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);if(0===this.size())throw new Error("Trying to pop from an empty list.");const n=gd(this.elementShape,this.tensors,e),r=this.tensors.pop();return r.kept=!1,md(r.shape,e,"TensorList shape mismatch: "),Qo(r,n)}pushBack(e){if(e.dtype!==this.elementDtype)throw new Error(`Invalid data types; op elements ${e.dtype}, but list elements ${this.elementDtype}`);if(md(e.shape,this.elementShape,"TensorList shape mismatch: "),this.maxNumElements===this.size())throw new Error("Trying to push element into a full list.");$a(e),this.tensors.push(e)}resize(e){if(e<0)throw new Error(`TensorListResize expects size to be non-negative. Got: ${e}`);if(-1!==this.maxNumElements&&e>this.maxNumElements)throw new Error(`TensorListResize input size ${e} is greater maxNumElement ${this.maxNumElements}.`);const t=new wd([],this.elementShape,this.elementDtype,this.maxNumElements);t.tensors.length=e;for(let n=0;n<Math.min(this.tensors.length,e);++n)t.tensors[n]=this.tensors[n];return t}getItem(e,t,n){if(n!==this.elementDtype)throw new Error(`Invalid data types; op elements ${n}, but list elements ${this.elementDtype}`);if(e<0||e>this.tensors.length)throw new Error(`Trying to access element ${e} in a list with ${this.tensors.length} elements.`);if(null==this.tensors[e])throw new Error(`element at index ${e} is null.`);md(this.tensors[e].shape,t,"TensorList shape mismatch: ");const r=gd(this.elementShape,this.tensors,t);return Qo(this.tensors[e],r)}setItem(e,t){if(t.dtype!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t.dtype}, but list elements ${this.elementDtype}`);if(e<0||-1!==this.maxNumElements&&e>=this.maxNumElements)throw new Error(`Trying to set element ${e} in a list with max ${this.maxNumElements} elements.`);md(this.elementShape,t.shape,"TensorList shape mismatch: "),$a(t),null!=this.tensors[e]&&(this.tensors[e].kept=!1),this.tensors[e]=t}gather(e,t,n){if(t!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);md(this.elementShape,n,"TensorList shape mismatch: "),e=e.slice(0,this.size());const r=gd(this.elementShape,this.tensors,n);return 0===e.length?gs([],[0].concat(r)):Ia((()=>{const t=e.map((e=>Qo(this.tensors[e],r)));return gc(t,0)}))}concat(e,t){if(e&&e!==this.elementDtype)throw new Error(`TensorList dtype is ${this.elementDtype} but concat requested dtype ${e}`);md(this.elementShape,t,"TensorList shape mismatch: ");const n=gd(this.elementShape,this.tensors,t);return 0===this.size()?gs([],[0].concat(n)):Ia((()=>{const e=this.tensors.map((e=>Qo(e,n)));return ei(e,0)}))}}
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
const xd=async(e,t,n)=>{switch(e.op){case"If":case"StatelessIf":{const r=Th("thenBranch",e,t,n),s=Th("elseBranch",e,t,n),a=Th("cond",e,t,n),o=Th("args",e,t,n);return(await a.data())[0]?n.functionMap[r].executeFunctionAsync(o,n.tensorArrayMap,n.tensorListMap):n.functionMap[s].executeFunctionAsync(o,n.tensorArrayMap,n.tensorListMap)}case"While":case"StatelessWhile":{const r=Th("body",e,t,n),s=Th("cond",e,t,n),a=Th("args",e,t,n),o=await n.functionMap[s].executeFunctionAsync(a,n.tensorArrayMap,n.tensorListMap),i=a.map((e=>e.id));let u=await o[0].data();o.forEach((e=>{e.kept||-1!==i.indexOf(e.id)||e.dispose()}));let l=a;for(;u[0];){const e=l;l=await n.functionMap[r].executeFunctionAsync(l,n.tensorArrayMap,n.tensorListMap);const t=l.map((e=>e.id));e.forEach((e=>{e.kept||-1!==i.indexOf(e.id)||-1!==t.indexOf(e.id)||e.dispose()}));const a=await n.functionMap[s].executeFunctionAsync(l,n.tensorArrayMap,n.tensorListMap);u=await a[0].data(),a.forEach((e=>{e.kept||-1!==i.indexOf(e.id)||-1!==t.indexOf(e.id)||e.dispose()}))}return l}case"LoopCond":return[Mh(Th("pred",e,t,n))];case"Switch":{const r=Th("pred",e,t,n);let s=Th("data",e,t,n);return s.kept||(s=Mh(s)),(await r.data())[0]?[void 0,s]:[s,void 0]}case"Merge":{const r=e.inputNames.find((e=>void 0!==Eh(e,t,n)));if(r){return[Mh(Eh(r,t,n))]}return}case"Enter":{const r=Th("frameName",e,t,n),s=Th("tensor",e,t,n);return n.enterFrame(r),[Mh(s)]}case"Exit":{const r=Th("tensor",e,t,n);return n.exitFrame(),[Mh(r)]}case"NextIteration":{const r=Th("tensor",e,t,n);return n.nextIteration(),[Mh(r)]}case"TensorArrayV3":{const r=Th("size",e,t,n),s=Th("dtype",e,t,n),a=Th("elementShape",e,t,n),o=Th("dynamicSize",e,t,n),i=Th("clearAfterRead",e,t,n),u=Th("identicalElementShapes",e,t,n),l=Th("name",e,t,n),c=new bd(l,s,r,a,u,o,i);return n.addTensorArray(c),[c.idTensor,Ji(1)]}case"TensorArrayWriteV3":{const r=Th("tensorArrayId",e,t,n),s=Th("index",e,t,n),a=Th("tensor",e,t,n),o=n.getTensorArray(r.id);return o.write(s,a),[o.idTensor]}case"TensorArrayReadV3":{const r=Th("tensorArrayId",e,t,n),s=Th("index",e,t,n);return[n.getTensorArray(r.id).read(s)]}case"TensorArrayGatherV3":{const r=Th("tensorArrayId",e,t,n),s=Th("indices",e,t,n),a=Th("dtype",e,t,n);return[n.getTensorArray(r.id).gather(s,a)]}case"TensorArrayScatterV3":{const r=Th("tensorArrayId",e,t,n),s=Th("indices",e,t,n),a=Th("tensor",e,t,n),o=n.getTensorArray(r.id);return o.scatter(s,a),[o.idTensor]}case"TensorArrayConcatV3":{const r=Th("tensorArrayId",e,t,n),s=n.getTensorArray(r.id),a=Th("dtype",e,t,n);return[s.concat(a)]}case"TensorArraySplitV3":{const r=Th("tensorArrayId",e,t,n),s=Th("tensor",e,t,n),a=Th("lengths",e,t,n),o=n.getTensorArray(r.id);return o.split(a,s),[o.idTensor]}case"TensorArraySizeV3":{const r=Th("tensorArrayId",e,t,n);return[Ji(n.getTensorArray(r.id).size(),"int32")]}case"TensorArrayCloseV3":{const r=Th("tensorArrayId",e,t,n),s=n.getTensorArray(r.id);return s.clearAndClose(),[s.idTensor]}case"TensorListSetItem":{const r=Th("tensorListId",e,t,n),s=Th("index",e,t,n),a=Th("tensor",e,t,n),o=n.getTensorList(r.id);return o.setItem(s,a),[o.idTensor]}case"TensorListGetItem":{const r=Th("tensorListId",e,t,n),s=Th("index",e,t,n),a=Th("elementShape",e,t,n),o=Th("elementDType",e,t,n);return[n.getTensorList(r.id).getItem(s,a,o)]}case"TensorListScatterV2":case"TensorListScatter":{const r=Th("indices",e,t,n),s=function(e,t,n,r){if(t.length!==e.shape[0])throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${t.length} vs. ${e.shape[0]}`);const s=Math.max(...t);if(null!=r&&-1!==r&&s>=r)throw new Error(`Max index must be < array size (${s}  vs. ${r})`);const a=new wd([],n,e.dtype,r),o=Ac(e,0);return t.forEach(((e,t)=>{a.setItem(e,o[t])})),a}(Th("tensor",e,t,n),r,Th("elementShape",e,t,n),Th("numElements",e,t,n));return n.addTensorList(s),[s.idTensor]}case"TensorListReserve":case"EmptyTensorList":{const r=Th("elementShape",e,t,n),s=Th("elementDType",e,t,n);let a;a="TensorListReserve"===e.op?"numElements":"maxNumElements";const o=Th(a,e,t,n),i=function(e,t,n,r){return new wd([],e,t,r)}(r,s,0,"TensorListReserve"===e.op?-1:o);return n.addTensorList(i),[i.idTensor]}case"TensorListGather":{const r=Th("tensorListId",e,t,n),s=Th("indices",e,t,n),a=Th("elementShape",e,t,n),o=Th("elementDType",e,t,n);return[n.getTensorList(r.id).gather(s,o,a)]}case"TensorListStack":{const r=Th("tensorListId",e,t,n),s=Th("elementShape",e,t,n),a=Th("elementDType",e,t,n),o=Th("numElements",e,t,n);return[n.getTensorList(r.id).stack(s,a,o)]}case"TensorListFromTensor":{const r=function(e,t,n){const r=e.dtype;if(e.shape.length<1)throw new Error(`Tensor must be at least a vector, but saw shape: ${e.shape}`);if(e.dtype!==n)throw new Error(`Invalid data types; op elements ${e.dtype}, but list elements ${n}`);md(e.shape.slice(1),t,"TensorList shape mismatch: ");const s=Ac(e);return new wd(s,t,r)}(Th("tensor",e,t,n),Th("elementShape",e,t,n),Th("elementDType",e,t,n));return n.addTensorList(r),[r.idTensor]}case"TensorListConcat":case"TensorListConcatV2":{const r=Th("tensorListId",e,t,n),s=n.getTensorList(r.id),a=Th("dtype",e,t,n),o=Th("elementShape",e,t,n);return[s.concat(a,o)]}case"TensorListPushBack":{const r=Th("tensorListId",e,t,n),s=Th("tensor",e,t,n),a=n.getTensorList(r.id);return a.pushBack(s),[a.idTensor]}case"TensorListPopBack":{const r=Th("tensorListId",e,t,n),s=Th("elementShape",e,t,n),a=Th("elementDType",e,t,n);return[n.getTensorList(r.id).popBack(s,a)]}case"TensorListSplit":{const r=Th("tensor",e,t,n),s=Th("elementShape",e,t,n),a=function(e,t,n){let r=0;const s=t.map((e=>(r+=e,r)));if(r!==e.shape[0])throw new Error(`Expected sum of lengths to be equal to\n          tensor.shape[0], but sum of lengths is\n        ${r}, and tensor's shape is: ${e.shape}`);const a=yd(e.shape.slice(1),n),o=0===r?0:e.size/r,i=Ia((()=>{const n=[];e=Qo(e,[1,r,o]);for(let r=0;r<t.length;++r){const i=[0,0===r?0:s[r-1],0],u=[1,t[r],o];n[r]=Qo(ni(e,i,u),a)}return e.dispose(),n})),u=new wd([],n,e.dtype,t.length);for(let e=0;e<i.length;e++)u.setItem(e,i[e]);return u}(r,Th("lengths",e,t,n),s);return n.addTensorList(a),[a.idTensor]}case"TensorListLength":{const r=Th("tensorListId",e,t,n);return[Ji(n.getTensorList(r.id).size(),"int32")]}case"TensorListResize":{const r=Th("tensorListId",e,t,n),s=Th("size",e,t,n),a=n.getTensorList(r.id).resize(s);return n.addTensorList(a),[a.idTensor]}default:throw TypeError(`Node type ${e.op} is not implemented`)}};
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
 */function vd(e,t,n){const[r,s]=Th("fusedOps",e,t,n),a="biasadd"===r,o=!a,i="prelu"===s,u="fusedbatchnorm"===r,l=Th("numArgs",e,t,n);if(a){if(i&&2!==l)throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd and Prelu must have two extra arguments: bias and alpha.");if(!i&&a&&1!==l)throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd must have one extra argument: bias.")}if(u)throw new Error("FusedConv2d and DepthwiseConv2d with FusedBatchNorm is not supported");const c=Th("strides",e,t,n),p=$h(e,t,n),h=Th("dataFormat",e,t,n).toUpperCase(),d=Th("dilations",e,t,n);let[m,f]=Th("args",e,t,n);o&&(f=m,m=void 0);return{stride:c,pad:p,dataFormat:h,dilations:d,biasArg:m,preluArg:f,activationFunc:s,leakyreluAlpha:Th("leakyreluAlpha",e,t,n)}}
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
function Nd(e,t,n){return{boxes:Th("boxes",e,t,n),scores:Th("scores",e,t,n),maxOutputSize:Th("maxOutputSize",e,t,n),iouThreshold:Th("iouThreshold",e,t,n),scoreThreshold:Th("scoreThreshold",e,t,n),softNmsSigma:Th("softNmsSigma",e,t,n)}}
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
class Sd{constructor(e,t){this.keyDType=e,this.valueDType=t,this.handle=Ji(0),this.tensorMap=new Map,$a(this.handle)}get id(){return this.handle.id}clearAndClose(){this.tensorMap.forEach((e=>e.dispose())),this.tensorMap.clear(),this.handle.dispose()}size(){return this.tensorMap.size}tensorSize(){return Ji(this.size(),"int32")}async import(e,t){this.checkKeyAndValueTensor(e,t);const n=await e.data();return this.tensorMap.forEach((e=>e.dispose())),this.tensorMap.clear(),Ia((()=>{const e=Ac(t),r=n.length,s=e.length;l(r===s,(()=>`The number of elements doesn't match, keys has ${r} elements, the values has ${s} elements.`));for(let t=0;t<r;t++){const r=n[t],s=e[t];$a(s),this.tensorMap.set(r,s)}return this.handle}))}async find(e,t){this.checkKeyAndValueTensor(e,t);const n=await e.data();return Ia((()=>{const e=[];for(let r=0;r<n.length;r++){const s=n[r],a=this.findWithDefault(s,t);e.push(a)}return gc(e)}))}findWithDefault(e,t){const n=this.tensorMap.get(e);return null!=n?n:t}checkKeyAndValueTensor(e,t){if(e.dtype!==this.keyDType)throw new Error(`Expect key dtype ${this.keyDType}, but got ${e.dtype}`);if(t.dtype!==this.valueDType)throw new Error(`Expect value dtype ${this.valueDType}, but got ${t.dtype}`)}}
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
function kd(e,t,n,r,s=Ia){const a=((e,t,n)=>{switch(e.category){case"arithmetic":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"BiasAdd":case"AddV2":case"Add":return[r.add(Th("a",e,t,n),Th("b",e,t,n))];case"AddN":return[r.addN(Th("tensors",e,t,n))];case"FloorMod":case"Mod":return[r.mod(Th("a",e,t,n),Th("b",e,t,n))];case"Mul":return[r.mul(Th("a",e,t,n),Th("b",e,t,n))];case"RealDiv":case"Div":return[r.div(Th("a",e,t,n),Th("b",e,t,n))];case"DivNoNan":return[r.divNoNan(Th("a",e,t,n),Th("b",e,t,n))];case"FloorDiv":return[r.floorDiv(Th("a",e,t,n),Th("b",e,t,n))];case"Sub":return[r.sub(Th("a",e,t,n),Th("b",e,t,n))];case"Minimum":return[r.minimum(Th("a",e,t,n),Th("b",e,t,n))];case"Maximum":return[r.maximum(Th("a",e,t,n),Th("b",e,t,n))];case"Pow":return[r.pow(Th("a",e,t,n),Th("b",e,t,n))];case"SquaredDifference":return[r.squaredDifference(Th("a",e,t,n),Th("b",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"basic_math":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"Abs":case"ComplexAbs":return[r.abs(Th("x",e,t,n))];case"Acos":return[r.acos(Th("x",e,t,n))];case"Acosh":return[r.acosh(Th("x",e,t,n))];case"Asin":return[r.asin(Th("x",e,t,n))];case"Asinh":return[r.asinh(Th("x",e,t,n))];case"Atan":return[r.atan(Th("x",e,t,n))];case"Atan2":return[r.atan2(Th("x",e,t,n),Th("y",e,t,n))];case"Atanh":return[r.atanh(Th("x",e,t,n))];case"Ceil":return[r.ceil(Th("x",e,t,n))];case"Complex":return[r.complex(Th("real",e,t,n),Th("imag",e,t,n))];case"Cos":return[r.cos(Th("x",e,t,n))];case"Cosh":return[r.cosh(Th("x",e,t,n))];case"Elu":return[r.elu(Th("x",e,t,n))];case"Erf":return[r.erf(Th("x",e,t,n))];case"Exp":return[r.exp(Th("x",e,t,n))];case"Expm1":return[r.expm1(Th("x",e,t,n))];case"Floor":return[r.floor(Th("x",e,t,n))];case"Log":return[r.log(Th("x",e,t,n))];case"Log1p":return[r.log1p(Th("x",e,t,n))];case"Imag":return[r.imag(Th("x",e,t,n))];case"Neg":return[r.neg(Th("x",e,t,n))];case"Reciprocal":return[r.reciprocal(Th("x",e,t,n))];case"Real":return[r.real(Th("x",e,t,n))];case"Relu":return[r.relu(Th("x",e,t,n))];case"Round":return[r.round(Th("x",e,t,n))];case"Selu":return[r.selu(Th("x",e,t,n))];case"Sigmoid":return[r.sigmoid(Th("x",e,t,n))];case"Sin":return[r.sin(Th("x",e,t,n))];case"Sign":return[r.sign(Th("x",e,t,n))];case"Sinh":return[r.sinh(Th("x",e,t,n))];case"Softplus":return[r.softplus(Th("x",e,t,n))];case"Sqrt":return[r.sqrt(Th("x",e,t,n))];case"Square":return[r.square(Th("x",e,t,n))];case"Tanh":return[r.tanh(Th("x",e,t,n))];case"Tan":return[r.tan(Th("x",e,t,n))];case"ClipByValue":return[r.clipByValue(Th("x",e,t,n),Th("clipValueMin",e,t,n),Th("clipValueMax",e,t,n))];case"Relu6":return[r.relu6(Th("x",e,t,n))];case"Rsqrt":return[r.rsqrt(Eh(e.inputNames[0],t,n))];case"Prod":return[r.prod(Th("x",e,t,n),Th("axes",e,t,n))];case"LeakyRelu":return[r.leakyRelu(Th("x",e,t,n),Th("alpha",e,t,n))];case"Prelu":return[r.prelu(Th("x",e,t,n),Th("alpha",e,t,n))];case"IsNan":return[r.isNaN(Eh(e.inputNames[0],t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"control":return xd(e,t,n);case"convolution":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"Conv1D":{const s=Th("stride",e,t,n),a=Th("pad",e,t,n),o=Th("dataFormat",e,t,n).toUpperCase(),i=Th("dilation",e,t,n);return[r.conv1d(Th("x",e,t,n),Th("filter",e,t,n),s,a,o,i)]}case"Conv2D":{const s=Th("strides",e,t,n),a=$h(e,t,n),o=Th("dataFormat",e,t,n).toUpperCase(),i=Th("dilations",e,t,n);return[r.conv2d(Th("x",e,t,n),Th("filter",e,t,n),[s[1],s[2]],a,o,[i[1],i[2]])]}case"_FusedConv2D":{const{stride:s,pad:a,dataFormat:o,dilations:i,biasArg:u,preluArg:l,activationFunc:c,leakyreluAlpha:p}=vd(e,t,n);return[r.fused.conv2d({x:Th("x",e,t,n),filter:Th("filter",e,t,n),strides:[s[1],s[2]],pad:a,dataFormat:o,dilations:[i[1],i[2]],bias:u,activation:c,preluActivationWeights:l,leakyreluAlpha:p})]}case"FusedDepthwiseConv2dNative":{const{stride:s,pad:a,dataFormat:o,dilations:i,biasArg:u,preluArg:l,activationFunc:c,leakyreluAlpha:p}=vd(e,t,n);return[r.fused.depthwiseConv2d({x:Th("x",e,t,n),filter:Th("filter",e,t,n),strides:[s[1],s[2]],pad:a,dataFormat:o,dilations:[i[1],i[2]],bias:u,activation:c,preluActivationWeights:l,leakyreluAlpha:p})]}case"Conv2DBackpropInput":case"Conv2dTranspose":{const s=Th("outputShape",e,t,n),a=Th("strides",e,t,n),o=$h(e,t,n);return[r.conv2dTranspose(Th("x",e,t,n),Th("filter",e,t,n),s,[a[1],a[2]],o)]}case"DepthwiseConv2dNative":case"DepthwiseConv2d":{const s=Th("strides",e,t,n),a=$h(e,t,n),o=Th("dilations",e,t,n),i=Th("dataFormat",e,t,n).toUpperCase();return[r.depthwiseConv2d(Th("input",e,t,n),Th("filter",e,t,n),[s[1],s[2]],a,i,[o[1],o[2]])]}case"Conv3D":{const s=Th("strides",e,t,n),a=Th("pad",e,t,n),o=Th("dataFormat",e,t,n).toUpperCase(),i=Th("dilations",e,t,n);return[r.conv3d(Th("x",e,t,n),Th("filter",e,t,n),[s[1],s[2],s[3]],a,o,[i[1],i[2],i[3]])]}case"AvgPool":{const s=Th("strides",e,t,n),a=Th("pad",e,t,n),o=Th("kernelSize",e,t,n);return[r.avgPool(Th("x",e,t,n),[o[1],o[2]],[s[1],s[2]],a)]}case"MaxPool":{const s=Th("strides",e,t,n),a=Th("pad",e,t,n),o=Th("kernelSize",e,t,n);return[r.maxPool(Th("x",e,t,n),[o[1],o[2]],[s[1],s[2]],a)]}case"MaxPoolWithArgmax":{const s=Th("strides",e,t,n),a=Th("pad",e,t,n),o=Th("kernelSize",e,t,n),i=Th("includeBatchInIndex",e,t,n),{result:u,indexes:l}=r.maxPoolWithArgmax(Th("x",e,t,n),[o[1],o[2]],[s[1],s[2]],a,i);return[u,l]}case"AvgPool3D":{const s=Th("strides",e,t,n),a=Th("pad",e,t,n),o=Th("kernelSize",e,t,n);return[r.avgPool3d(Th("x",e,t,n),[o[1],o[2],o[3]],[s[1],s[2],s[3]],a)]}case"MaxPool3D":{const s=Th("strides",e,t,n),a=Th("pad",e,t,n),o=Th("kernelSize",e,t,n);return[r.maxPool3d(Th("x",e,t,n),[o[1],o[2],o[3]],[s[1],s[2],s[3]],a)]}case"Dilation2D":{const s=Th("strides",e,t,n),a=Th("pad",e,t,n),o=Th("dilations",e,t,n),i=s[1],u=s[2],l=o[1],c=o[2];return[r.dilation2d(Th("x",e,t,n),Th("filter",e,t,n),[i,u],a,[l,c],"NHWC")]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"creation":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"Fill":{const s=Th("shape",e,t,n),a=Th("dtype",e,t,n),o=Th("value",e,t,n);return[r.fill(s,o,a)]}case"LinSpace":{const s=Th("start",e,t,n),a=Th("stop",e,t,n),o=Th("num",e,t,n);return[r.linspace(s,a,o)]}case"Multinomial":{const s=Th("logits",e,t,n),a=Th("numSamples",e,t,n),o=Th("seed",e,t,n);return[r.multinomial(s,a,o)]}case"OneHot":{const s=Th("indices",e,t,n),a=Th("depth",e,t,n),o=Th("onValue",e,t,n),i=Th("offValue",e,t,n),u=Th("dtype",e,t,n);return[r.oneHot(s,a,o,i,u)]}case"Ones":return[r.ones(Th("shape",e,t,n),Th("dtype",e,t,n))];case"OnesLike":return[r.onesLike(Th("x",e,t,n))];case"RandomStandardNormal":return[r.randomStandardNormal(Th("shape",e,t,n),Th("dtype",e,t,n),Th("seed",e,t,n))];case"RandomUniform":return[r.randomUniform(Th("shape",e,t,n),Th("minval",e,t,n),Th("maxval",e,t,n),Th("dtype",e,t,n))];case"Range":{const s=Th("start",e,t,n),a=Th("stop",e,t,n),o=Th("step",e,t,n);return[r.range(s,a,o,Th("dtype",e,t,n))]}case"TruncatedNormal":{const s=Th("shape",e,t,n),a=Th("mean",e,t,n),o=Th("stdDev",e,t,n),i=Th("seed",e,t,n);return[r.truncatedNormal(s,a,o,Th("dtype",e,t,n),i)]}case"Zeros":return[r.zeros(Th("shape",e,t,n),Th("dtype",e,t,n))];case"ZerosLike":return[r.zerosLike(Th("x",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"dynamic":return(async(e,t,n,r,s=dd)=>{switch(e.op){case"NonMaxSuppressionV5":{const{boxes:r,scores:a,maxOutputSize:o,iouThreshold:i,scoreThreshold:u,softNmsSigma:l}=Nd(e,t,n),c=await s.image.nonMaxSuppressionWithScoreAsync(r,a,o,i,u,l);return[c.selectedIndices,c.selectedScores]}case"NonMaxSuppressionV4":{const{boxes:r,scores:a,maxOutputSize:o,iouThreshold:i,scoreThreshold:u}=Nd(e,t,n),l=Th("padToMaxOutputSize",e,t,n),c=await s.image.nonMaxSuppressionPaddedAsync(r,a,o,i,u,l);return[c.selectedIndices,c.validOutputs]}case"NonMaxSuppressionV3":case"NonMaxSuppressionV2":{const{boxes:r,scores:a,maxOutputSize:o,iouThreshold:i,scoreThreshold:u}=Nd(e,t,n);return[await s.image.nonMaxSuppressionAsync(r,a,o,i,u)]}case"Where":{const r=s.cast(Th("condition",e,t,n),"bool"),a=[await s.whereAsync(r)];return r.dispose(),a}case"ListDiff":return s.setdiff1dAsync(Th("x",e,t,n),Th("y",e,t,n));default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n);case"evaluation":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"LowerBound":{const s=Th("sortedSequence",e,t,n),a=Th("values",e,t,n);return[r.lowerBound(s,a)]}case"TopKV2":{const s=Th("x",e,t,n),a=Th("k",e,t,n),o=Th("sorted",e,t,n),i=r.topk(s,a,o);return[i.values,i.indices]}case"UpperBound":{const s=Th("sortedSequence",e,t,n),a=Th("values",e,t,n);return[r.upperBound(s,a)]}case"Unique":{const s=Th("x",e,t,n),a=r.unique(s);return[a.values,a.indices]}case"UniqueV2":{const s=Th("x",e,t,n),a=Th("axis",e,t,n),o=r.unique(s,a);return[o.values,o.indices]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"image":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"ResizeBilinear":{const s=Th("images",e,t,n),a=Th("size",e,t,n),o=Th("alignCorners",e,t,n),i=Th("halfPixelCenters",e,t,n);return[r.image.resizeBilinear(s,[a[0],a[1]],o,i)]}case"ResizeNearestNeighbor":{const s=Th("images",e,t,n),a=Th("size",e,t,n),o=Th("alignCorners",e,t,n),i=Th("halfPixelCenters",e,t,n);return[r.image.resizeNearestNeighbor(s,[a[0],a[1]],o,i)]}case"CropAndResize":{const s=Th("image",e,t,n),a=Th("boxes",e,t,n),o=Th("boxInd",e,t,n),i=Th("cropSize",e,t,n),u=Th("method",e,t,n),l=Th("extrapolationValue",e,t,n);return[r.image.cropAndResize(s,a,o,i,u,l)]}case"ImageProjectiveTransformV3":{const s=Th("images",e,t,n),a=Th("transforms",e,t,n),o=Th("outputShape",e,t,n),i=Th("fillValue",e,t,n),u=Th("interpolation",e,t,n),l=Th("fillMode",e,t,n);return[r.image.transform(s,a,u.toLowerCase(),l.toLowerCase(),i,o)]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"graph":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"Const":return t[e.name];case"PlaceholderWithDefault":const s=Th("default",e,t,n);return[Eh(e.name,t,n)||s];case"Placeholder":return[Eh(e.name,t,n)];case"Identity":case"StopGradient":case"FakeQuantWithMinMaxVars":case"Snapshot":return[Mh(Th("x",e,t,n))];case"IdentityN":return Th("x",e,t,n).map((e=>Mh(e)));case"Shape":return[r.tensor1d(Th("x",e,t,n).shape,"int32")];case"ShapeN":return Th("x",e,t,n).map((e=>r.tensor1d(e.shape)));case"Size":return[r.scalar(Th("x",e,t,n).size,"int32")];case"Rank":return[r.scalar(Th("x",e,t,n).rank,"int32")];case"NoOp":return[r.scalar(1)];case"Print":const a=Th("x",e,t,n),o=Th("data",e,t,n),i=Th("message",e,t,n),u=Th("summarize",e,t,n);console.warn("The graph has a tf.print() operation,usually used for debugging, which slows down performance."),console.log(i);for(let e=0;e<o.length;e++)console.log(Array.prototype.slice.call(o[e].dataSync()).slice(0,u));return[a];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"logical":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"Equal":return[r.equal(Th("a",e,t,n),Th("b",e,t,n))];case"NotEqual":return[r.notEqual(Th("a",e,t,n),Th("b",e,t,n))];case"Greater":return[r.greater(Th("a",e,t,n),Th("b",e,t,n))];case"GreaterEqual":return[r.greaterEqual(Th("a",e,t,n),Th("b",e,t,n))];case"Less":return[r.less(Th("a",e,t,n),Th("b",e,t,n))];case"LessEqual":return[r.lessEqual(Th("a",e,t,n),Th("b",e,t,n))];case"LogicalAnd":return[r.logicalAnd(Th("a",e,t,n),Th("b",e,t,n))];case"LogicalNot":return[r.logicalNot(Th("a",e,t,n))];case"LogicalOr":return[r.logicalOr(Th("a",e,t,n),Th("b",e,t,n))];case"Select":case"SelectV2":return[r.where(Th("condition",e,t,n),Th("a",e,t,n),Th("b",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"matrices":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"BatchMatMul":case"BatchMatMulV2":case"MatMul":return[r.matMul(Th("a",e,t,n),Th("b",e,t,n),Th("transposeA",e,t,n),Th("transposeB",e,t,n))];case"Einsum":return[r.einsum(Th("equation",e,t,n),...Th("tensors",e,t,n))];case"Transpose":return[r.transpose(Th("x",e,t,n),Th("perm",e,t,n))];case"_FusedMatMul":const[s,a]=Th("fusedOps",e,t,n),o="biasadd"===s,i="prelu"===a,u=Th("numArgs",e,t,n),l=Th("leakyreluAlpha",e,t,n);if(o){if(i&&2!==u)throw new Error("Fused MatMul with BiasAdd and Prelu must have two extra arguments: bias and alpha.");if(!i&&1!==u)throw new Error("Fused MatMul with BiasAdd must have one extra argument: bias.")}const[c,p]=Th("args",e,t,n);return[r.fused.matMul({a:Th("a",e,t,n),b:Th("b",e,t,n),transposeA:Th("transposeA",e,t,n),transposeB:Th("transposeB",e,t,n),bias:c,activation:a,preluActivationWeights:p,leakyreluAlpha:l})];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"normalization":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"EuclideanNorm":return[r.euclideanNorm(Th("x",e,t,n),Th("axis",e,t,n),Th("keepDims",e,t,n))];case"FusedBatchNorm":case"FusedBatchNormV2":case"FusedBatchNormV3":return[r.batchNorm(Th("x",e,t,n),Th("mean",e,t,n),Th("variance",e,t,n),Th("offset",e,t,n),Th("scale",e,t,n),Th("epsilon",e,t,n))];case"LRN":return[r.localResponseNormalization(Th("x",e,t,n),Th("radius",e,t,n),Th("bias",e,t,n),Th("alpha",e,t,n),Th("beta",e,t,n))];case"Softmax":return[r.softmax(Th("x",e,t,n))];case"LogSoftmax":return[r.logSoftmax(Th("x",e,t,n))];case"SparseToDense":return[r.sparseToDense(Th("sparseIndices",e,t,n),Th("outputShape",e,t,n),Th("sparseValues",e,t,n),Th("defaultValue",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"reduction":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"Max":{const s=Th("axis",e,t,n),a=Th("keepDims",e,t,n);return[r.max(Th("x",e,t,n),s,a)]}case"Mean":{const s=Th("axis",e,t,n),a=Th("keepDims",e,t,n);return[r.mean(Th("x",e,t,n),s,a)]}case"Min":{const s=Th("axis",e,t,n),a=Th("keepDims",e,t,n);return[r.min(Th("x",e,t,n),s,a)]}case"Sum":{const s=Th("axis",e,t,n),a=Th("keepDims",e,t,n);return[r.sum(Th("x",e,t,n),s,a)]}case"All":{const s=Th("axis",e,t,n),a=Th("keepDims",e,t,n);return[r.all(Th("x",e,t,n),s,a)]}case"Any":{const s=Th("axis",e,t,n),a=Th("keepDims",e,t,n);return[r.any(Th("x",e,t,n),s,a)]}case"ArgMax":{const s=Th("axis",e,t,n);return[r.argMax(Th("x",e,t,n),s)]}case"ArgMin":{const s=Th("axis",e,t,n);return[r.argMin(Th("x",e,t,n),s)]}case"Prod":{const s=Th("axis",e,t,n),a=Th("keepDims",e,t,n);return[r.prod(Th("x",e,t,n),s,a)]}case"Cumprod":{const s=Th("axis",e,t,n),a=Th("exclusive",e,t,n),o=Th("reverse",e,t,n);return[r.cumprod(Th("x",e,t,n),s,a,o)]}case"Cumsum":{const s=Th("axis",e,t,n),a=Th("exclusive",e,t,n),o=Th("reverse",e,t,n);return[r.cumsum(Th("x",e,t,n),s,a,o)]}case"Bincount":const s=Th("x",e,t,n),a=Th("weights",e,t,n),o=Th("size",e,t,n);return[r.bincount(s,a,o)];case"DenseBincount":{const s=Th("x",e,t,n),a=Th("weights",e,t,n),o=Th("size",e,t,n),i=Th("binaryOutput",e,t,n);return[r.denseBincount(s,a,o,i)]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"slice_join":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"ConcatV2":case"Concat":{const s=Th("n",e,t,n),a=Th("axis",e,t,n);let o=Th("tensors",e,t,n);return o=o.slice(0,s),[r.concat(o,a)]}case"Gather":{const s=Th("x",e,t,n),a=Th("indices",e,t,n);return[r.gather(s,r.cast(a,"int32"),0)]}case"GatherV2":{const s=Th("axis",e,t,n),a=Th("batchDims",e,t,n),o=Th("x",e,t,n),i=Th("indices",e,t,n);return[r.gather(o,r.cast(i,"int32"),s,a)]}case"Reverse":{const s=Th("dims",e,t,n),a=[];for(let e=0;e<s.length;e++)s[e]&&a.push(e);const o=Th("x",e,t,n);return[r.reverse(o,a)]}case"ReverseV2":{const s=Th("axis",e,t,n),a=Th("x",e,t,n);return[r.reverse(a,s)]}case"Slice":{const s=Th("begin",e,t,n),a=Th("size",e,t,n);return[r.slice(Th("x",e,t,n),s,a)]}case"StridedSlice":{const s=Th("begin",e,t,n),a=Th("end",e,t,n),o=Th("strides",e,t,n),i=Th("beginMask",e,t,n),u=Th("endMask",e,t,n),l=Th("ellipsisMask",e,t,n),c=Th("newAxisMask",e,t,n),p=Th("shrinkAxisMask",e,t,n),h=Th("x",e,t,n);return[r.stridedSlice(h,s,a,o,i,u,l,c,p)]}case"Pack":return Ia((()=>{const s=Th("axis",e,t,n),a=Th("tensors",e,t,n),o=a[0].shape,i=r.squeeze(a[0]).shape,u=a.map((e=>{const t=m(e.shape,o);if(!t&&!m(r.squeeze(e).shape,i))throw new Error("the input tensors shape does not match");return t?e:r.reshape(e,o)}));return[r.stack(u,s)]}));case"Unpack":{const s=Th("axis",e,t,n),a=Th("tensor",e,t,n);return r.unstack(a,s)}case"Tile":{const s=Th("reps",e,t,n);return[r.tile(Th("x",e,t,n),s)]}case"Split":case"SplitV":{const s=Th("axis",e,t,n),a=Th("numOrSizeSplits",e,t,n),o=Th("x",e,t,n);return r.split(o,a,s)}case"ScatterNd":{const s=Th("indices",e,t,n),a=Th("values",e,t,n),o=Th("shape",e,t,n);return[r.scatterND(s,a,o)]}case"GatherNd":{const s=Th("x",e,t,n),a=Th("indices",e,t,n);return[r.gatherND(s,a)]}case"SparseToDense":{const s=Th("sparseIndices",e,t,n),a=Th("outputShape",e,t,n),o=Th("sparseValues",e,t,n),i=Th("defaultValue",e,t,n);return[r.sparseToDense(s,o,a,o.dtype===i.dtype?i:r.cast(i,o.dtype))]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"sparse":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"SparseFillEmptyRows":{const{outputIndices:s,outputValues:a,emptyRowIndicator:o,reverseIndexMap:i}=r.sparse.sparseFillEmptyRows(Th("indices",e,t,n),Th("values",e,t,n),Th("denseShape",e,t,n),Th("defaultValue",e,t,n));return[s,a,o,i]}case"SparseReshape":{const{outputIndices:s,outputShape:a}=r.sparse.sparseReshape(Th("inputIndices",e,t,n),Th("inputShape",e,t,n),Th("newShape",e,t,n));return[s,a]}case"SparseSegmentMean":return[r.sparse.sparseSegmentMean(Th("data",e,t,n),Th("indices",e,t,n),Th("segmentIds",e,t,n))];case"SparseSegmentSum":return[r.sparse.sparseSegmentSum(Th("data",e,t,n),Th("indices",e,t,n),Th("segmentIds",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"spectral":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"FFT":return[r.fft(Th("x",e,t,n))];case"IFFT":return[r.ifft(Th("x",e,t,n))];case"RFFT":return[r.rfft(Th("x",e,t,n))];case"IRFFT":return[r.irfft(Th("x",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"string":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"StringNGrams":{const{nGrams:s,nGramsSplits:a}=r.string.stringNGrams(Th("data",e,t,n),Th("dataSplits",e,t,n),Th("separator",e,t,n),Th("nGramWidths",e,t,n),Th("leftPad",e,t,n),Th("rightPad",e,t,n),Th("padWidth",e,t,n),Th("preserveShortSequences",e,t,n));return[s,a]}case"StringSplit":{const{indices:s,values:a,shape:o}=r.string.stringSplit(Th("input",e,t,n),Th("delimiter",e,t,n),Th("skipEmpty",e,t,n));return[s,a,o]}case"StringToHashBucketFast":return[r.string.stringToHashBucketFast(Th("input",e,t,n),Th("numBuckets",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"transformation":return s((()=>((e,t,n,r=dd)=>{switch(e.op){case"Cast":return[r.cast(Th("x",e,t,n),Th("dtype",e,t,n))];case"ExpandDims":{const s=Th("axis",e,t,n);return[r.expandDims(Th("x",e,t,n),s)]}case"Squeeze":{const s=Th("axis",e,t,n);return[r.squeeze(Th("x",e,t,n),s)]}case"Reshape":return[r.reshape(Th("x",e,t,n),Th("shape",e,t,n))];case"MirrorPad":return[r.mirrorPad(Th("x",e,t,n),Th("padding",e,t,n),Th("mode",e,t,n))];case"PadV2":case"Pad":return[r.pad(Th("x",e,t,n),Th("padding",e,t,n),Th("constantValue",e,t,n))];case"SpaceToBatchND":{const s=Th("blockShape",e,t,n),a=Th("paddings",e,t,n);return[r.spaceToBatchND(Th("x",e,t,n),s,a)]}case"BatchToSpaceND":{const s=Th("blockShape",e,t,n),a=Th("crops",e,t,n);return[r.batchToSpaceND(Th("x",e,t,n),s,a)]}case"DepthToSpace":{const s=Th("blockSize",e,t,n),a=Th("dataFormat",e,t,n).toUpperCase();return[r.depthToSpace(Th("x",e,t,n),s,a)]}case"BroadcastTo":return[r.broadcastTo(Th("x",e,t,n),Th("shape",e,t,n))];case"BroadcastArgs":return[r.broadcastArgs(Th("s0",e,t,n),Th("s1",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"hash_table":return(async(e,t,n,r)=>{switch(e.op){case"HashTable":case"HashTableV2":{const s=Th("keyDType",e,t,n),a=Th("valueDType",e,t,n),o=new Sd(s,a);return r.addHashTable(e.name,o),[o.handle]}case"LookupTableImport":case"LookupTableImportV2":{const s=Th("tableHandle",e,t,n,r),a=Th("keys",e,t,n),o=Th("values",e,t,n),i=r.getHashTableById(s.id);return[await i.import(a,o)]}case"LookupTableFind":case"LookupTableFindV2":{const s=Th("tableHandle",e,t,n,r),a=Th("keys",e,t,n),o=Th("defaultValue",e,t,n),i=r.getHashTableById(s.id);return[await i.find(a,o)]}case"LookupTableSize":case"LookupTableSizeV2":{const s=Th("tableHandle",e,t,n,r);return[r.getHashTableById(s.id).tensorSize()]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n,r);case"custom":const a=kh(e.op);if(a&&a.customExecutor)return a.customExecutor(new hd(e,t,n));throw TypeError(`Custom op ${e.op} is not registered.`);default:throw TypeError(`Unknown op '${e.op}'. File an issue at https://github.com/tensorflow/tfjs/issues so we can add it, or register a custom execution with tf.registerOp()`)}})(e,t,n);return L(a)?a.then((e=>[].concat(e))):[].concat(a)}class Td{constructor(e={},t={},n={},r={}){this.weightMap=e,this.tensorArrayMap=t,this.tensorListMap=n,this.functionMap=r,this.rootContext={id:0,frameName:"",iterationId:0},this.contexts=[this.rootContext],this.lastId=0,this.generateCurrentContextIds()}newFrame(e,t){return{id:e,frameName:t,iterationId:0}}set currentContext(e){this.contexts!==e&&(this.contexts=e,this.generateCurrentContextIds())}get currentContext(){return this.contexts}get currentContextId(){return this._currentContextIds[0]}get currentContextIds(){return this._currentContextIds}generateCurrentContextIds(){const e=[];for(let t=0;t<this.contexts.length-1;t++){const n=this.contexts.slice(0,this.contexts.length-t);e.push(this.contextIdforContexts(n))}e.push(""),this._currentContextIds=e}contextIdforContexts(e){return e?e.map((e=>0===e.id&&0===e.iterationId?"":`${e.frameName}-${e.iterationId}`)).join("/"):""}enterFrame(e){this.contexts&&(this.lastId++,this.contexts=this.contexts.slice(),this.contexts.push(this.newFrame(this.lastId,e)),this._currentContextIds.unshift(this.contextIdforContexts(this.contexts)))}exitFrame(){if(!(this.contexts&&this.contexts.length>1))throw new Error("Cannot exit frame, the context is empty");this.contexts=this.contexts.slice(),this.contexts.splice(-1),this.currentContextIds.shift()}nextIteration(){if(!(this.contexts&&this.contexts.length>0))throw new Error("Cannot increase frame iteration, the context is empty");{this.contexts=this.contexts.slice(),this.lastId++;const e=Object.assign({},this.contexts[this.contexts.length-1]);e.iterationId+=1,e.id=this.lastId,this.contexts.splice(-1,1,e),this._currentContextIds.splice(0,1,this.contextIdforContexts(this.contexts))}}getWeight(e){return this.weightMap[e]}addTensorArray(e){this.tensorArrayMap[e.id]=e}getTensorArray(e){return this.tensorArrayMap[e]}addTensorList(e){this.tensorListMap[e.id]=e}getTensorList(e){return this.tensorListMap[e]}dispose(e){for(const t in this.tensorArrayMap)this.tensorArrayMap[t].clearAndClose(e);for(const t in this.tensorListMap)this.tensorListMap[t].clearAndClose(e)}}
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
 */function Ed(e,t,n,r){const s=new Set,a=[];let o=null,i=null;const u=new Set,l=Object.keys(e).map((e=>Ah(e)[0]));let c=[];null!=r&&(c=r.map((e=>Ah(e.name)[0])));const p=[...t];for(;p.length>0;){const e=p.pop();($d(e)||Md(e)||Od(e))&&null==o&&(o=e,i=o.children.map((e=>e.name)).filter((e=>s.has(e)))),s.add(e.name),null==n[e.name]&&(-1===l.indexOf(e.name)&&-1===c.indexOf(e.name)&&(0!==e.inputs.length?e.inputs.forEach((e=>{u.has(e.name)||(u.add(e.name),p.push(e))})):a.push(e.name)))}return{inputs:e,outputs:t,usedNodes:s,missingInputs:a,dynamicNode:o,syncInputs:i}}const _d=["Switch","Merge","Enter","Exit","NextIteration","StatelessIf","StatelessWhile","if","While"],Id=["NonMaxSuppressionV2","NonMaxSuppressionV3","NonMaxSuppressionV5","Where"],Ad=["HashTable","HashTableV2","LookupTableImport","LookupTableImportV2","LookupTableFind","LookupTableFindV2","LookupTableSize","LookupTableSizeV2"];function $d(e){return _d.indexOf(e.op)>=0}function Md(e){return Id.indexOf(e.op)>=0}function Od(e){return Ad.indexOf(e.op)>=0}
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
 */class Dd{constructor(e,t){this.graph=e,this.parent=t,this.compiledMap=new Map,this._weightMap={},this.SEPERATOR=",",this._functions={},this._functionExecutorMap={},this.intermediateTensors={},this.keepTensorForDebug=!1,this._outputs=e.outputs,this._inputs=e.inputs,this._initNodes=e.initNodes,this._signature=e.signature,this._functions=e.functions,null!=e.functions&&Object.keys(e.functions).forEach((t=>{this._functionExecutorMap[t]=new Dd(e.functions[t],this)}))}get weightIds(){return this.parent?this.parent.weightIds:this._weightIds}get functionExecutorMap(){return this.parent?this.parent.functionExecutorMap:this._functionExecutorMap}get weightMap(){return this.parent?this.parent.weightMap:this._weightMap}set weightMap(e){const t=Object.keys(e).map((t=>e[t].map((e=>e.id))));this._weightIds=[].concat(...t),this._weightMap=e}set resourceManager(e){this._resourceManager=e}get inputs(){return this._inputs.map((e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0})))}get outputs(){return this._outputs.map((e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0})))}get inputNodes(){return this._inputs.map((e=>e.signatureKey||e.name))}get outputNodes(){return this._outputs.map((e=>{const t=e.signatureKey||e.name;return e.defaultOutput?`${t}:${e.defaultOutput}`:t}))}get functions(){return Object.keys(this._functions).reduce(((e,t)=>(e[t]=this._functions[t].signature,e)),{})}getCompilationKey(e,t){const n=e.map((e=>e.name)).sort(),r=t.map((e=>e.name)).sort();return n.join(this.SEPERATOR)+"--"+r.join(this.SEPERATOR)}compile(e,t){const n=Ed(e,t,this.weightMap,this._initNodes),{missingInputs:r,dynamicNode:s,syncInputs:a}=n;if(null!=s)throw new Error(`This execution contains the node '${s.name}', which has the dynamic op '${s.op}'. Please use model.executeAsync() instead. Alternatively, to avoid the dynamic ops, specify the inputs [${a}]`);if(r.length>0){const n=t.map((e=>e.name)),s=Object.keys(e);throw new Error(`Cannot compute the outputs [${n}] from the provided inputs [${s}]. Missing the following inputs: [${r}]`)}return function(e,t,n){const{usedNodes:r,inputs:s}=n,a=[],o=Object.keys(s).map((e=>Ah(e)[0])).map((t=>e.nodes[t])),i=e.initNodes;o.forEach((e=>{r.has(e.name)&&a.push(e)})),e.weights.forEach((e=>{r.has(e.name)&&a.push(e)})),null!=i&&i.forEach((e=>{r.has(e.name)&&a.push(e)}));const u=new Set,l=[];for(;a.length>0;){const e=a.pop();u.add(e.name),t[e.name]||l.push(e),e.children.forEach((e=>{!u.has(e.name)&&r.has(e.name)&&e.inputs.every((e=>u.has(e.name)))&&a.push(e)}))}return l}(this.graph,this.weightMap,n)}execute(e,t){e=this.mapInputs(e);const n=Object.keys(e).sort();this.checkInputs(e),this.checkInputShapeAndType(e),t=this.mapOutputs(t),this.checkOutputs(t);const r=n.map((e=>this.graph.nodes[Ah(e)[0]])),s=t.map((e=>Ah(e)[0]));let a=s.map((e=>this.graph.nodes[e]));this.resetIntermediateTensors(),0===a.length&&(a=this._outputs);const o=this.getCompilationKey(r,a);let i=this.compiledMap.get(o);null==i&&(i=this.compile(e,a),this.compiledMap.set(o,i));const u={},l={};return Ia((()=>{const n=new Td(this.weightMap,u,l,this.functionExecutorMap),r=Object.assign({},this.weightMap);Object.keys(e).forEach((t=>{const[n,s]=Ah(t),a=[];a[s]=e[t],r[n]=a}));const a=this.getFrozenTensorIds(r),o={};for(let e=0;e<i.length;e++){const t=i[e];if(!r[t.name]){const e=kd(t,r,n,this._resourceManager);if(L(e))throw new Error(`The execution of the op '${t.op}' returned a promise. Please use model.executeAsync() instead.`);r[t.name]=e,this.checkTensorForDisposal(t.name,t,r,n,a,s,o)}}return null==this.parent&&n.dispose(a),t.map((e=>Eh(e,r,n)))}))}getFrozenTensorIds(e){const t=[].concat.apply([],Object.keys(e).map((t=>e[t])).map((e=>e.map((e=>e.id)))));return new Set(t)}checkTensorForDisposal(e,t,n,r,s,a,o){"control"!==t.category&&-1===a.indexOf(e)&&(n[e].forEach((e=>{null!=e&&(o[e.id]=(o[e.id]||0)+t.children.length)})),t.inputs.forEach((e=>{if("control"!==e.category){const a=function(e,t,n){return t[Ih(e,n.currentContextId)]}(e.name,n,r);null!=a&&a.forEach((e=>{if(e&&!e.kept&&!s.has(e.id)){const n=o[e.id];if(1===n){if(this.keepTensorForDebug){const[n,s]=_h(t.name,r);this.intermediateTensors[n]||(this.intermediateTensors[n]=[]),this.intermediateTensors[n][s]=e}else e.dispose();delete o[e.id]}else null!=n&&o[e.id]--}}))}})))}async executeAsync(e,t){return this._executeAsync(e,t)}disposeIntermediateTensors(){this.intermediateTensors&&(Object.keys(this.intermediateTensors).forEach((e=>this.intermediateTensors[e].forEach((e=>e.dispose())))),this.disposeTensorsMap())}disposeTensorsMap(){this.tensorsMap&&Object.keys(this.tensorsMap).forEach((e=>{this.tensorsMap[e].forEach((e=>{!e||e.kept||e.isDisposed||this.keepIds.has(e.id)||e.dispose()}))}))}getIntermediateTensors(){return this.tensorsMap}resetIntermediateTensors(){for(const e in this.intermediateTensors)this.intermediateTensors[e].forEach((e=>e.dispose())),delete this.intermediateTensors[e]}async _executeAsync(e,t,n=!1,r={},s={}){n||(e=this.mapInputs(e),this.checkInputs(e),this.checkInputShapeAndType(e),t=this.mapOutputs(t),this.checkOutputs(t));try{this.keepTensorForDebug=q().getBool("KEEP_INTERMEDIATE_TENSORS")}catch(e){console.warn(e.message)}this.resetIntermediateTensors();const a=new Td(this.weightMap,r,s,this.functionExecutorMap);this.tensorsMap=await this.executeWithControlFlow(e,a,t,n);const o=t.map((e=>Eh(e,this.tensorsMap,a))),i=o.map((e=>e.id)),u=Object.keys(e).map((t=>e[t].id));return this.keepIds=new Set([...i,...u,...this.weightIds]),this.keepTensorForDebug||this.disposeTensorsMap(),null==this.parent&&a.dispose(this.keepIds),o}async executeFunctionAsync(e,t,n){const r=e.reduce(((e,t,n)=>(e[this.inputs[n].name]=t,e)),{});return this._executeAsync(r,this.outputNodes,!0,t,n)}async executeWithControlFlow(e,t,n,r){const s=Object.keys(e),a=s.map((e=>this.graph.nodes[Ah(e)[0]])),o=n.map((e=>Ah(e)[0]));let i=o.map((e=>this.graph.nodes[e]));0===i.length&&(i=this._outputs);const{usedNodes:u,missingInputs:l,dynamicNode:c,syncInputs:p}=Ed(e,i,this.weightMap,this._initNodes),h=[...a,...this.graph.weights,...this._initNodes||[]].map((e=>({node:e,contexts:t.currentContext}))),d=Object.assign({},this.weightMap);Object.keys(e).forEach((t=>{const[n,r]=Ah(t),s=[];s[r]=e[t],d[n]=s}));const m={},f=this.getFrozenTensorIds(d),g={};for(;h.length>0;){const e=this.processStack(a,h,t,d,g,f,o,m,u);await Promise.all(e)}null!=c||r||console.warn("This model execution did not contain any nodes with control flow or dynamic output shapes. You can use model.execute() instead.");const y=i.filter((e=>!$d(e)&&!Eh(e.name,d,t))).map((e=>e.name));if(y.length>0){let e="";throw null!=c&&(e=`Alternatively, to avoid the dynamic ops, use model.execute() and specify the inputs [${p}]`),new Error(`Cannot compute the outputs [${y}] from the provided inputs [${s}]. Consider providing the following inputs: [${l}]. ${e}`)}return d}processStack(e,t,n,r,s,a,o,i,u){const l=[];for(;t.length>0;){const e=t.pop();n.currentContext=e.contexts;let c="";if("Enter"===e.node.op&&Th("isConstant",e.node,r,n)&&([c]=_h(e.node.name,n)),null==r[e.node.name]){const p=kd(e.node,r,n,this._resourceManager);c||([c]=_h(e.node.name,n));const h=n.currentContext;L(p)?l.push(p.then((l=>(r[c]=l,n.currentContext=h,this.checkTensorForDisposal(c,e.node,r,n,a,o,i),this.processChildNodes(e.node,t,n,r,s,u),l)))):(r[c]=p,this.checkTensorForDisposal(c,e.node,r,n,a,o,i),this.processChildNodes(e.node,t,n,r,s,u))}else this.processChildNodes(e.node,t,n,r,s,u)}return l}processChildNodes(e,t,n,r,s,a){e.children.forEach((e=>{const[o]=_h(e.name,n);!s[o]&&a.has(e.name)&&("Merge"===e.op?e.inputNames.some((e=>!!Eh(e,r,n)))&&(s[o]=!0,t.push({contexts:n.currentContext,node:e})):e.inputNames.every((e=>!!Eh(e,r,n)))&&(s[o]=!0,t.push({contexts:n.currentContext,node:e})))}))}dispose(){Object.keys(this.weightMap).forEach((e=>this.weightMap[e].forEach((e=>e.dispose()))))}checkInputShapeAndType(e){Object.keys(e).forEach((t=>{const n=e[t],[r]=Ah(t),s=this.graph.nodes[r];if(s.attrParams.shape&&s.attrParams.shape.value){const e=s.attrParams.shape.value;l(e.length===n.shape.length&&n.shape.every(((t,n)=>-1===e[n]||e[n]===t)),(()=>`The shape of dict['${s.name}'] provided in model.execute(dict) must be [${e}], but was [${n.shape}]`))}s.attrParams.dtype&&s.attrParams.dtype.value&&l(n.dtype===s.attrParams.dtype.value,(()=>`The dtype of dict['${s.name}'] provided in model.execute(dict) must be ${s.attrParams.dtype.value}, but was ${n.dtype}`))}))}mapInputs(e){const t={};for(const n in e)if(null!=this._signature&&null!=this._signature.inputs&&null!=this._signature.inputs[n]){t[this._signature.inputs[n].name]=e[n]}else t[n]=e[n];return t}checkInputs(e){const t=Object.keys(e).filter((e=>{const[t]=Ah(e);return null==this.graph.nodes[t]}));if(t.length>0)throw new Error(`The dict provided in model.execute(dict) has keys: [${t}] that are not part of graph`)}mapOutputs(e){return e.map((e=>{if(null!=this._signature&&null!=this._signature.outputs&&null!=this._signature.outputs[e]){return this._signature.outputs[e].name}return e}),{})}checkOutputs(e){e.forEach((e=>{const[t]=Ah(e);if(!this.graph.nodes[t])throw new Error(`The output '${e}' is not found in the graph`)}))}}class Rd{constructor(e={},t={}){this.hashTableNameToHandle=e,this.hashTableMap=t}addHashTable(e,t){this.hashTableNameToHandle[e]=t.handle,this.hashTableMap[t.id]=t}getHashTableHandleByName(e){return this.hashTableNameToHandle[e]}getHashTableById(e){return this.hashTableMap[e]}dispose(){for(const e in this.hashTableMap)this.hashTableMap[e].clearAndClose(),delete this.hashTableMap[e];for(const e in this.hashTableNameToHandle)this.hashTableNameToHandle[e].dispose(),delete this.hashTableNameToHandle[e]}}
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
 */const Fd="?tfjs-format=file",Cd="model.json";class Bd{constructor(e,t={},n=Ta){this.modelUrl=e,this.loadOptions=t,this.version="n/a",this.io=n,null==t&&(this.loadOptions={}),this.resourceManager=new Rd}get modelVersion(){return this.version}get inputNodes(){return this.executor.inputNodes}get outputNodes(){return this.executor.outputNodes}get inputs(){return this.executor.inputs}get outputs(){return this.executor.outputs}get weights(){return this.executor.weightMap}get metadata(){return this.artifacts.userDefinedMetadata}get modelSignature(){return this.signature}get modelStructuredOutputKeys(){return this.structuredOutputKeys}findIOHandler(){const e=this.modelUrl;if(null!=e.load)this.handler=e;else if(null!=this.loadOptions.requestInit)this.handler=this.io.browserHTTPRequest(e,this.loadOptions);else{const t=this.io.getLoadHandlers(e,this.loadOptions);if(0===t.length)t.push(this.io.browserHTTPRequest(e,this.loadOptions));else if(t.length>1)throw new Error(`Found more than one (${t.length}) load handlers for URL '${[e]}'`);this.handler=t[0]}}load(){if(this.findIOHandler(),null==this.handler.load)throw new Error("Cannot proceed with model loading because the IOHandler provided does not have the `load` method implemented.");const e=this.handler.load();return L(e)?e.then((e=>this.loadSync(e))):this.loadSync(e)}loadSync(e){this.artifacts=e;const t=this.artifacts.modelTopology;let n=this.artifacts.signature;if(null!=this.artifacts.userDefinedMetadata){const e=this.artifacts.userDefinedMetadata;null!=e.signature&&(n=e.signature),null!=e.structuredOutputKeys&&(this.structuredOutputKeys=e.structuredOutputKeys)}this.signature=n,this.version=`${t.versions.producer}.${t.versions.minConsumer}`;const r=this.io.decodeWeights(this.artifacts.weightData,this.artifacts.weightSpecs);if(this.executor=new Dd(Qh.Instance.transformGraph(t,this.signature)),this.executor.weightMap=this.convertTensorMapToTensorsMap(r),this.executor.resourceManager=this.resourceManager,null!=e.modelInitializer&&null!=e.modelInitializer.node){const t=Qh.Instance.transformGraph(e.modelInitializer);this.initializer=new Dd(t),this.initializer.weightMap=this.executor.weightMap,this.initializer.resourceManager=this.resourceManager,this.initializer.executeAsync({},[])}return!0}async save(e,t){if("string"==typeof e){const t=this.io.getSaveHandlers(e);if(0===t.length)throw new Error(`Cannot find any save handlers for URL '${e}'`);if(t.length>1)throw new Error(`Found more than one (${t.length}) save handlers for URL '${e}'`);e=t[0]}if(null==e.save)throw new Error("GraphModel.save() cannot proceed because the IOHandler provided does not have the `save` attribute defined.");return e.save(this.artifacts)}predict(e,t){const n=this.execute(e,this.outputNodes);if(this.structuredOutputKeys){const e={};return(n instanceof Br?[n]:n).forEach(((t,n)=>e[this.structuredOutputKeys[n]]=t)),e}return n}normalizeInputs(e){if(!(e instanceof Br||Array.isArray(e)))return e;if((e=Array.isArray(e)?e:[e]).length!==this.inputNodes.length)throw new Error(`Input tensor count mismatch,the graph model has ${this.inputNodes.length} placeholders, while there are ${e.length} input tensors.`);return this.inputNodes.reduce(((t,n,r)=>(t[n]=e[r],t)),{})}normalizeOutputs(e){return e=e||this.outputNodes,Array.isArray(e)?e:[e]}execute(e,t){e=this.normalizeInputs(e),t=this.normalizeOutputs(t);const n=this.executor.execute(e,t);return n.length>1?n:n[0]}async executeAsync(e,t){e=this.normalizeInputs(e),t=this.normalizeOutputs(t);const n=await this.executor.executeAsync(e,t);return n.length>1?n:n[0]}getIntermediateTensors(){return this.executor.getIntermediateTensors()}disposeIntermediateTensors(){this.executor.disposeIntermediateTensors()}convertTensorMapToTensorsMap(e){return Object.keys(e).reduce(((t,n)=>(t[n]=[e[n]],t)),{})}dispose(){this.executor.dispose(),this.initializer&&this.initializer.dispose(),this.resourceManager.dispose()}}async function Ld(e,t={},n=Ta){if(null==e)throw new Error("modelUrl in loadGraphModel() cannot be null. Please provide a url or an IOHandler that loads the model");null==t&&(t={}),t.fromTFHub&&"string"==typeof e&&(e=function(e){e.endsWith("/")||(e+="/");return`${e}${Cd}${Fd}`}
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
    */(e));const r=new Bd(e,t,n);return await r.load(),r}var zd=function(e,t){return(zd=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)};function Pd(e,t){function n(){this.constructor=e}zd(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}var Vd=function(){return(Vd=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var s in t=arguments[n])Object.prototype.hasOwnProperty.call(t,s)&&(e[s]=t[s]);return e}).apply(this,arguments)};function qd(e,t,n,r){return new(n||(n=Promise))((function(t,s){function a(e){try{i(r.next(e))}catch(e){s(e)}}function o(e){try{i(r.throw(e))}catch(e){s(e)}}function i(e){e.done?t(e.value):new n((function(t){t(e.value)})).then(a,o)}i((r=r.apply(e,[])).next())}))}function Wd(e,t){var n,r,s,a,o={label:0,sent:function(){if(1&s[0])throw s[1];return s[1]},trys:[],ops:[]};return a={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function i(a){return function(i){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,r&&(s=2&a[0]?r.return:a[0]?r.throw||((s=r.return)&&s.call(r),0):r.next)&&!(s=s.call(r,a[1])).done)return s;switch(r=0,s&&(a=[2&a[0],s.value]),a[0]){case 0:case 1:s=a;break;case 4:return o.label++,{value:a[1],done:!1};case 5:o.label++,r=a[1],a=[0];continue;case 7:a=o.ops.pop(),o.trys.pop();continue;default:if(!(s=(s=o.trys).length>0&&s[s.length-1])&&(6===a[0]||2===a[0])){o=0;continue}if(3===a[0]&&(!s||a[1]>s[0]&&a[1]<s[3])){o.label=a[1];break}if(6===a[0]&&o.label<s[1]){o.label=s[1],s=a;break}if(s&&o.label<s[2]){o.label=s[2],o.ops.push(a);break}s[2]&&o.ops.pop(),o.trys.pop();continue}a=t.call(e,o)}catch(e){a=[6,e],r=0}finally{n=s=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,i])}}}var Ud=function(){function e(e,t){this.model=e,this.outputStride=t;var n=this.model.inputs[0].shape;l(-1===n[1]&&-1===n[2],(function(){return"Input shape ["+n[1]+", "+n[2]+"] must both be equal to or -1"}))}return e.prototype.predict=function(e){var t=this;return Ia((function(){var n=t.preprocessInput(e.toFloat()).expandDims(0),r=t.model.predict(n).map((function(e){return e.squeeze([0])})),s=t.nameOutputResults(r);return{heatmapScores:s.heatmap.sigmoid(),offsets:s.offsets,displacementFwd:s.displacementFwd,displacementBwd:s.displacementBwd}}))},e.prototype.dispose=function(){this.model.dispose()},e}(),jd=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return Pd(t,e),t.prototype.preprocessInput=function(e){return Ia((function(){return ko(e,127.5).sub(1)}))},t.prototype.nameOutputResults=function(e){return{offsets:e[0],heatmap:e[1],displacementFwd:e[2],displacementBwd:e[3]}},t}(Ud);function Gd(e){return Math.floor(e/2)}var Kd=function(){function e(e,t){this.priorityQueue=new Array(e),this.numberOfElements=-1,this.getElementValue=t}return e.prototype.enqueue=function(e){this.priorityQueue[++this.numberOfElements]=e,this.swim(this.numberOfElements)},e.prototype.dequeue=function(){var e=this.priorityQueue[0];return this.exchange(0,this.numberOfElements--),this.sink(0),this.priorityQueue[this.numberOfElements+1]=null,e},e.prototype.empty=function(){return-1===this.numberOfElements},e.prototype.size=function(){return this.numberOfElements+1},e.prototype.all=function(){return this.priorityQueue.slice(0,this.numberOfElements+1)},e.prototype.max=function(){return this.priorityQueue[0]},e.prototype.swim=function(e){for(;e>0&&this.less(Gd(e),e);)this.exchange(e,Gd(e)),e=Gd(e)},e.prototype.sink=function(e){for(;2*e<=this.numberOfElements;){var t=2*e;if(t<this.numberOfElements&&this.less(t,t+1)&&t++,!this.less(e,t))break;this.exchange(e,t),e=t}},e.prototype.getValueAt=function(e){return this.getElementValue(this.priorityQueue[e])},e.prototype.less=function(e,t){return this.getValueAt(e)<this.getValueAt(t)},e.prototype.exchange=function(e,t){var n=this.priorityQueue[e];this.priorityQueue[e]=this.priorityQueue[t],this.priorityQueue[t]=n},e}();function Hd(e,t,n,r,s,a){for(var o=a.shape,i=o[0],u=o[1],l=!0,c=Math.max(n-s,0),p=Math.min(n+s+1,i),h=c;h<p;++h){for(var d=Math.max(r-s,0),m=Math.min(r+s+1,u),f=d;f<m;++f)if(a.get(h,f,e)>t){l=!1;break}if(!l)break}return l}var Zd=["nose","leftEye","rightEye","leftEar","rightEar","leftShoulder","rightShoulder","leftElbow","rightElbow","leftWrist","rightWrist","leftHip","rightHip","leftKnee","rightKnee","leftAnkle","rightAnkle"],Jd=Zd.length,Qd=Zd.reduce((function(e,t,n){return e[t]=n,e}),{});function Xd(e,t,n,r){return{y:r.get(e,t,n),x:r.get(e,t,n+Jd)}}function Yd(e,t,n){var r=Xd(e.heatmapY,e.heatmapX,e.id,n),s=r.y,a=r.x;return{x:e.heatmapX*t+a,y:e.heatmapY*t+s}}function em(e,t,n){return e<t?t:e>n?n:e}function tm(e,t){return{x:e.x+t.x,y:e.y+t.y}}[["leftHip","leftShoulder"],["leftElbow","leftShoulder"],["leftElbow","leftWrist"],["leftHip","leftKnee"],["leftKnee","leftAnkle"],["rightHip","rightShoulder"],["rightElbow","rightShoulder"],["rightElbow","rightWrist"],["rightHip","rightKnee"],["rightKnee","rightAnkle"],["leftShoulder","rightShoulder"],["leftHip","rightHip"]].map((function(e){var t=e[0],n=e[1];return[Qd[t],Qd[n]]}));var nm=[["nose","leftEye"],["leftEye","leftEar"],["nose","rightEye"],["rightEye","rightEar"],["nose","leftShoulder"],["leftShoulder","leftElbow"],["leftElbow","leftWrist"],["leftShoulder","leftHip"],["leftHip","leftKnee"],["leftKnee","leftAnkle"],["nose","rightShoulder"],["rightShoulder","rightElbow"],["rightElbow","rightWrist"],["rightShoulder","rightHip"],["rightHip","rightKnee"],["rightKnee","rightAnkle"]].map((function(e){var t=e[0],n=e[1];return[Qd[t],Qd[n]]})),rm=nm.map((function(e){return e[1]})),sm=nm.map((function(e){return e[0]}));function am(e,t,n,r){return{y:em(Math.round(e.y/t),0,n-1),x:em(Math.round(e.x/t),0,r-1)}}function om(e,t,n,r,s,a,o,i){void 0===i&&(i=2);for(var u=r.shape,l=u[0],c=u[1],p=function(e,t,n){var r=n.shape[2]/2;return{y:n.get(t.y,t.x,e),x:n.get(t.y,t.x,r+e)}}(e,am(t.position,a,l,c),o),h=tm(t.position,p),d=0;d<i;d++){var m=am(h,a,l,c),f=Xd(m.y,m.x,n,s);h=tm({x:m.x*a,y:m.y*a},{x:f.x,y:f.y})}var g=am(h,a,l,c),y=r.get(g.y,g.x,n);return{position:h,part:Zd[n],score:y}}function im(e,t,n,r,s,a){var o=t.shape[2],i=rm.length,u=new Array(o),l=e.part,c=e.score,p=Yd(l,r,n);u[l.id]={score:c,part:Zd[l.id],position:p};for(var h=i-1;h>=0;--h){var d=rm[h],m=sm[h];u[d]&&!u[m]&&(u[m]=om(h,u[d],m,t,n,r,a))}for(h=0;h<i;++h)d=sm[h],m=rm[h],u[d]&&!u[m]&&(u[m]=om(h,u[d],m,t,n,r,s));return u}function um(e,t,n,r){var s=n.x,a=n.y;return e.some((function(e){var n=e.keypoints[r].position;return function(e,t,n,r){var s=n-e,a=r-t;return s*s+a*a}(a,s,n.y,n.x)<=t}))}function lm(e,t,n){return n.reduce((function(n,r,s){var a=r.position,o=r.score;return um(e,t,a,s)||(n+=o),n}),0)/n.length}function cm(e,t,n,r,s,a,o,i){void 0===o&&(o=.5),void 0===i&&(i=20);for(var u=[],l=function(e,t,n){for(var r=n.shape,s=r[0],a=r[1],o=r[2],i=new Kd(s*a*o,(function(e){return e.score})),u=0;u<s;++u)for(var l=0;l<a;++l)for(var c=0;c<o;++c){var p=n.get(u,l,c);p<e||Hd(c,p,u,l,t,n)&&i.enqueue({score:p,part:{heatmapY:u,heatmapX:l,id:c}})}return i}(o,1,e),c=i*i;u.length<a&&!l.empty();){var p=l.dequeue();if(!um(u,c,Yd(p.part,s,t),p.part.id)){var h=im(p,e,t,s,n,r),d=lm(u,c,h);u.push({keypoints:h,score:d})}}return u}function pm(e){var t=e.shape,n=t[0],r=t[1],s=t[2];return Ia((function(){var t=e.reshape([n*r,s]).argMax(0),a=t.div(Ji(r,"int32")).expandDims(1),o=function(e,t){return Ia((function(){var n=e.div(Ji(t,"int32"));return e.sub(n.mul(Ji(t,"int32")))}))}(t,r).expandDims(1);return ei([a,o],1)}))}function hm(e,t,n,r){return{y:r.get(e,t,n),x:r.get(e,t,n+Jd)}}function dm(e,t,n){return Ia((function(){var r=function(e,t){for(var n=[],r=0;r<Jd;r++){var s=hm(e.get(r,0).valueOf(),e.get(r,1).valueOf(),r,t),a=s.x,o=s.y;n.push(o),n.push(a)}return vc(n,[Jd,2])}(e,n);return e.toTensor().mul(Ji(t,"int32")).toFloat().add(r)}))}function mm(e,t,n){return qd(this,0,void 0,(function(){var r,s,a,o,i,u,l,c,p,h;return Wd(this,(function(d){switch(d.label){case 0:return r=0,s=pm(e),[4,Promise.all([e.buffer(),t.buffer(),s.buffer()])];case 1:return a=d.sent(),o=a[0],i=a[1],u=a[2],[4,(l=dm(u,n,i)).buffer()];case 2:return c=d.sent(),p=Array.from(function(e,t){for(var n=t.shape[0],r=new Float32Array(n),s=0;s<n;s++){var a=t.get(s,0),o=t.get(s,1);r[s]=e.get(a,o,s)}return r}(o,u)),h=p.map((function(e,t){return r+=e,{position:{y:c.get(t,0),x:c.get(t,1)},part:Zd[t],score:e}})),s.dispose(),l.dispose(),[2,{keypoints:h,score:r/h.length}]}}))}))}var fm="https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/",gm="https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/";var ym=[-123.15,-115.9,-103.06],bm=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return Pd(t,e),t.prototype.preprocessInput=function(e){return e.add(ym)},t.prototype.nameOutputResults=function(e){var t=e[0],n=e[1];return{offsets:e[2],heatmap:e[3],displacementFwd:t,displacementBwd:n}},t}(Ud);function wm(e){return qd(this,0,void 0,(function(){return Wd(this,(function(t){return[2,Promise.all(e.map((function(e){return e.buffer()})))]}))}))}function xm(e,t){return km(e,t)?e:Math.floor(e/t)*t+1}function vm(e){l("number"==typeof e||"object"==typeof e,(function(){return"Invalid inputResolution "+e+". Should be a number or an object with width and height"})),"object"==typeof e&&(l("number"==typeof e.width,(function(){return"inputResolution.width has a value of "+e.width+" which is invalid; it must be a number"})),l("number"==typeof e.height,(function(){return"inputResolution.height has a value of "+e.height+" which is invalid; it must be a number"})))}function Nm(e,t){return vm(e),"object"==typeof e?[xm(e.height,t),xm(e.width,t)]:[xm(e,t),xm(e,t)]}var Sm=[8,16,32];function km(e,t){return(e-1)%t==0}function Tm(e){return e instanceof Br?[e.shape[0],e.shape[1]]:[e.height,e.width]}function Em(e,t){var n=t[0],r=t[1],s=Tm(e),a=s[0],o=s[1],i=r/n,u=[0,0,0,0],l=u[0],c=u[1],p=u[2],h=u[3];return o/a<i?(l=0,c=0,p=Math.round(.5*(i*a-o)),h=Math.round(.5*(i*a-o))):(l=Math.round(.5*(1/i*o-a)),c=Math.round(.5*(1/i*o-a)),p=0,h=0),{resized:Ia((function(){var t=function(e){return e instanceof Br?e:ja(e)}(e);return(t=rl(t,[[l,c],[p,h],[0,0]])).resizeBilinear([n,r])})),padding:{top:l,left:p,right:h,bottom:c}}}function _m(e,t,n,r,s){var a=t[0],o=t[1],i=n[0],u=n[1],l=function(e,t,n,r,s){return void 0===r&&(r=0),void 0===s&&(s=0),1===n&&1===t&&0===r&&0===s?e:e.map((function(e){return function(e,t,n,r,s){return void 0===r&&(r=0),void 0===s&&(s=0),{score:e.score,keypoints:e.keypoints.map((function(e){var a=e.score,o=e.part,i=e.position;return{score:a,part:o,position:{x:i.x*n+s,y:i.y*t+r}}}))}}(e,t,n,r,s)}))}(e,(a+r.top+r.bottom)/i,(o+r.left+r.right)/u,-r.top,-r.left);return s?function(e,t){return t<=0?e:e.map((function(e){return function(e,t){return{score:e.score,keypoints:e.keypoints.map((function(e){var n=e.score,r=e.part,s=e.position;return{score:n,part:r,position:{x:t-1-s.x,y:s.y}}}))}}(e,t)}))}(l,o):l}var Im={architecture:"MobileNetV1",outputStride:16,multiplier:.75,inputResolution:257},Am=["MobileNetV1","ResNet50"],$m={MobileNetV1:[8,16,32],ResNet50:[32,16]},Mm={MobileNetV1:[.5,.75,1],ResNet50:[1]},Om=[1,2,4];var Dm={flipHorizontal:!1},Rm={flipHorizontal:!1,maxDetections:5,scoreThreshold:.5,nmsRadius:20};var Fm=function(){function e(e,t){(function(e){l("number"==typeof e,(function(){return"outputStride is not a number"})),l(Sm.indexOf(e)>=0,(function(){return"outputStride of "+e+" is invalid. It must be either 8, 16, or 32"}))})(e.outputStride),function(e,t){l("number"==typeof e[0]&&"number"==typeof e[1],(function(){return"both resolution values must be a number but had values "+e})),l(km(e[0],t),(function(){return"height of "+e[0]+" is invalid for output stride "+t+"."})),l(km(e[1],t),(function(){return"width of "+e[1]+" is invalid for output stride "+t+"."}))}(t,e.outputStride),this.baseModel=e,this.inputResolution=t}return e.prototype.estimateMultiplePoses=function(e,t){return void 0===t&&(t=Rm),qd(this,0,void 0,(function(){var n,r,s,a,o,i,u,l,c,p,h,d,m,f,g,y,b,w,x,v,N;return Wd(this,(function(S){switch(S.label){case 0:return n=Vd({},Rm,t),function(e){var t=e.maxDetections,n=e.scoreThreshold,r=e.nmsRadius;if(t<=0)throw new Error("Invalid maxDetections "+t+". Should be > 0");if(n<0||n>1)throw new Error("Invalid scoreThreshold "+n+". Should be in range [0.0, 1.0]");if(r<=0)throw new Error("Invalid nmsRadius "+r+".")}(t),r=this.baseModel.outputStride,s=this.inputResolution,a=Tm(e),o=a[0],i=a[1],u=Em(e,s),l=u.resized,c=u.padding,p=this.baseModel.predict(l),h=p.heatmapScores,d=p.offsets,m=p.displacementFwd,f=p.displacementBwd,[4,wm([h,d,m,f])];case 1:return g=S.sent(),y=g[0],b=g[1],w=g[2],x=g[3],[4,cm(y,b,w,x,r,n.maxDetections,n.scoreThreshold,n.nmsRadius)];case 2:return v=S.sent(),N=_m(v,[o,i],s,c,n.flipHorizontal),h.dispose(),d.dispose(),m.dispose(),f.dispose(),l.dispose(),[2,N]}}))}))},e.prototype.estimateSinglePose=function(e,t){return void 0===t&&(t=Dm),qd(this,0,void 0,(function(){var n,r,s,a,o,i,u,l,c,p,h,d,m,f,g,y;return Wd(this,(function(b){switch(b.label){case 0:return n=Vd({},Dm,t),r=this.baseModel.outputStride,s=this.inputResolution,a=Tm(e),o=a[0],i=a[1],u=Em(e,s),l=u.resized,c=u.padding,p=this.baseModel.predict(l),h=p.heatmapScores,d=p.offsets,m=p.displacementFwd,f=p.displacementBwd,[4,mm(h,d,r)];case 1:return g=b.sent(),y=_m([g],[o,i],s,c,n.flipHorizontal),h.dispose(),d.dispose(),m.dispose(),f.dispose(),l.dispose(),[2,y[0]]}}))}))},e.prototype.estimatePoses=function(e,t){return qd(this,0,void 0,(function(){return Wd(this,(function(n){switch(n.label){case 0:return"single-person"!==t.decodingMethod?[3,2]:[4,this.estimateSinglePose(e,t)];case 1:return[2,[n.sent()]];case 2:return[2,this.estimateMultiplePoses(e,t)]}}))}))},e.prototype.dispose=function(){this.baseModel.dispose()},e}();function Cm(e){return qd(this,0,void 0,(function(){var t,n,r,s,a,o,i;return Wd(this,(function(u){switch(u.label){case 0:if(t=e.outputStride,n=e.quantBytes,r=e.multiplier,null==xh)throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please also include @tensorflow/tfjs on the page before using this\n        model.");return s=function(e,t,n){var r={1:"100",.75:"075",.5:"050"},s="model-stride"+e+".json";return 4===n?fm+"float/"+r[t]+"/"+s:fm+"quant"+n+"/"+r[t]+"/"+s}(t,r,n),[4,Ld(e.modelUrl||s)];case 1:return a=u.sent(),o=new jd(a,t),i=Nm(e.inputResolution,o.outputStride),[2,new Fm(o,i)]}}))}))}function Bm(e){return qd(this,0,void 0,(function(){var t,n,r,s,a,o;return Wd(this,(function(i){switch(i.label){case 0:if(t=e.outputStride,n=e.quantBytes,null==xh)throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please also include @tensorflow/tfjs on the page before using this\n        model.");return r=function(e,t){var n="model-stride"+e+".json";return 4===t?gm+"float/"+n:gm+"quant"+t+"/"+n}(t,n),[4,Ld(e.modelUrl||r)];case 1:return s=i.sent(),a=new bm(s,t),o=Nm(e.inputResolution,a.outputStride),[2,new Fm(a,o)]}}))}))}function Lm(e){return void 0===e&&(e=Im),qd(this,0,void 0,(function(){return Wd(this,(function(t){return"ResNet50"===(e=function(e){if(null==(e=e||Im).architecture&&(e.architecture="MobileNetV1"),Am.indexOf(e.architecture)<0)throw new Error("Invalid architecture "+e.architecture+". Should be one of "+Am);if(null==e.inputResolution&&(e.inputResolution=257),vm(e.inputResolution),null==e.outputStride&&(e.outputStride=16),$m[e.architecture].indexOf(e.outputStride)<0)throw new Error("Invalid outputStride "+e.outputStride+". Should be one of "+$m[e.architecture]+" for architecutre "+e.architecture+".");if(null==e.multiplier&&(e.multiplier=1),Mm[e.architecture].indexOf(e.multiplier)<0)throw new Error("Invalid multiplier "+e.multiplier+". Should be one of "+Mm[e.architecture]+" for architecutre "+e.architecture+".");if(null==e.quantBytes&&(e.quantBytes=4),Om.indexOf(e.quantBytes)<0)throw new Error("Invalid quantBytes "+e.quantBytes+". Should be one of "+Om+" for architecutre "+e.architecture+".");return e}(e)).architecture?[2,Bm(e)]:"MobileNetV1"===e.architecture?[2,Cm(e)]:[2,null]}))}))}const zm={id:"poseBody",name:"Body Pose Sensing",showStatusButton:!0,blocks:[{opcode:"goToPart",text:"go to [PART]",blockType:"command",isTerminal:!1,arguments:{PART:{type:"string",defaultValue:"rightShoulder",menu:"PART"}}},{opcode:"videoToggle",text:"turn video [VIDEO_STATE]",arguments:{VIDEO_STATE:{type:"string",menu:"VIDEO_STATE",defaultValue:"off"}},blockType:"command"},{opcode:"setVideoTransparency",text:"set video transparency to [TRANSPARENCY]",arguments:{TRANSPARENCY:{type:"number",defaultValue:50}},blockType:"command"}],menus:{PART:{acceptReporters:!0,items:[{text:"nose",value:"nose"},{text:"right eye",value:"leftEye"},{text:"left eye",value:"rightEye"},{text:"right ear",value:"leftEar"},{text:"left ear",value:"rightEar"},{text:"right shoulder",value:"leftShoulder"},{text:"left shoulder",value:"rightShoulder"},{text:"right elbow",value:"leftElbow"},{text:"left elbow",value:"rightElbow"},{text:"right wrist",value:"leftWrist"},{text:"left wrist",value:"rightWrist"},{text:"right hip",value:"leftHip"},{text:"left hip",value:"rightHip"},{text:"right knee",value:"leftKnee"},{text:"left knee",value:"rightKnee"},{text:"right ankle",value:"leftAnkle"},{text:"left ankle",value:"rightAnkle"}]},ATTRIBUTE:{acceptReporters:!0,items:[{text:"motion",value:"motion"},{text:"direction",value:"direction"}]},SUBJECT:{acceptReporters:!0,items:[{text:"sprite",value:"this sprite"},{text:"stage",value:"Stage"}]},VIDEO_STATE:{acceptReporters:!0,items:[{text:"off",value:"off"},{text:"on",value:"on"},{text:"on flipped",value:"on-flipped"}]}}},Pm=t.legacy(zm);t.legacy(zm,{incrementalDevelopment:!0});const{legacyExtension:Vm,legacyDefinition:qm}=Pm.for(),Wm="off",Um="on";let jm=(()=>{let e,n,s=[Vm()],a=[],o=t.Extension;var i,u;return n=class extends o{constructor(){super(...arguments),this.DIMENSIONS=[480,360],this.bodyOptions=zm.menus.PART.items}init(e){this.runtime.ioDevices&&this._loop()}tfCoordsToScratch({x:e,y:t}){return{x:e-250,y:200-t}}projectStarted(){this.setTransparency(this.globalVideoTransparency),this.toggleVideo(this.globalVideoState)}hasPose(){return this.poseState&&this.poseState.keypoints&&this.poseState.score>.01}_loop(){return r(this,void 0,void 0,(function*(){for(;;){const e=this.runtime.ioDevices.video.getFrame({format:"image-data",dimensions:this.DIMENSIONS}),t=+new Date;e&&(this.poseState=yield this.estimatePoseOnImage(e));const n=(+new Date-t)/4;yield new Promise((e=>setTimeout(e,n)))}}))}estimatePoseOnImage(e){return r(this,void 0,void 0,(function*(){const t=yield this.ensureBodyModelLoaded();return yield t.estimateSinglePose(e,{flipHorizontal:!1})}))}ensureBodyModelLoaded(){return r(this,void 0,void 0,(function*(){var e;return null!==(e=this.bodyModel)&&void 0!==e||(this.bodyModel=yield Lm()),this.bodyModel}))}toggleVideo(e){if(e===Wm)return this.runtime.ioDevices.video.disableVideo();this.runtime.ioDevices.video.enableVideo(),this.runtime.ioDevices.video.mirror=e===Um}setTransparency(e){const t=Math.max(Math.min(e,100),0);this.runtime.ioDevices.video.setPreviewGhost(t)}defineBlocks(){this.globalVideoState=Um,this.globalVideoTransparency=50,this.projectStarted(),this.bodyModel=null;const e=this.bodyOptions.map((e=>e.value)),t=qm.goToPart({operation:(e,t)=>{if(this.hasPose()){const{x:n,y:r}=this.tfCoordsToScratch(this.poseState.keypoints.find((t=>t.part===e)).position);t.target.setXY(n,r,!1)}},argumentMethods:{0:{handler:t=>e.includes(t)?t:"nose"}}});return{goToPart:t,videoToggle:qm.videoToggle({operation:e=>{this.toggleVideo(e)},argumentMethods:{0:{handler:e=>["on","off","on-flipped"].includes(e)?e:Um}}}),setVideoTransparency:qm.setVideoTransparency({operation:e=>{this.setTransparency(e)}})}}},i=n,u="PoseBody",Object.defineProperty(i,"name",{configurable:!0,value:u}),(()=>{var t;const r="function"==typeof Symbol&&Symbol.metadata?Object.create(null!==(t=o[Symbol.metadata])&&void 0!==t?t:null):void 0;!function(e,t,n,r,s,a){function o(e){if(void 0!==e&&"function"!=typeof e)throw new TypeError("Function expected");return e}for(var i,u=r.kind,l="getter"===u?"get":"setter"===u?"set":"value",c=!t&&e?r.static?e:e.prototype:null,p=t||(c?Object.getOwnPropertyDescriptor(c,r.name):{}),h=!1,d=n.length-1;d>=0;d--){var m={};for(var f in r)m[f]="access"===f?{}:r[f];for(var f in r.access)m.access[f]=r.access[f];m.addInitializer=function(e){if(h)throw new TypeError("Cannot add initializers after decoration has completed");a.push(o(e||null))};var g=(0,n[d])("accessor"===u?{get:p.get,set:p.set}:p[l],m);if("accessor"===u){if(void 0===g)continue;if(null===g||"object"!=typeof g)throw new TypeError("Object expected");(i=o(g.get))&&(p.get=i),(i=o(g.set))&&(p.set=i),(i=o(g.init))&&s.unshift(i)}else(i=o(g))&&("field"===u?s.unshift(i):p[l]=i)}c&&Object.defineProperty(c,r.name,p),h=!0}(null,e={value:n},s,{kind:"class",name:n.name,metadata:r},null,a),n=e.value,r&&Object.defineProperty(n,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:r}),function(e,t,n){for(var r=arguments.length>2,s=0;s<t.length;s++)n=r?t[s].call(e,n):t[s].call(e)}(n,a)})(),n})();return e.Extension=jm,e}({},ExtensionFramework);//# sourceMappingURL=poseBody.js.map
