var poseBody=function(e,t){"use strict";function n(e,t){return t.forEach((function(t){t&&"string"!=typeof t&&!Array.isArray(t)&&Object.keys(t).forEach((function(n){if("default"!==n&&!(n in e)){var r=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(e,n,r.get?r:{enumerable:!0,get:function(){return t[n]}})}}))})),Object.freeze(e)}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class r{refCount(e){return s("refCount")}incRef(e){return s("incRef")}timerAvailable(){return!0}time(e){return s("time")}read(e){return s("read")}readSync(e){return s("readSync")}readToGPU(e,t){return s("readToGPU")}numDataIds(){return s("numDataIds")}disposeData(e,t){return s("disposeData")}write(e,t,n){return s("write")}move(e,t,n,r,a){return s("move")}memory(){return s("memory")}floatPrecision(){return s("floatPrecision")}epsilon(){return 32===this.floatPrecision()?1e-7:1e-4}dispose(){return s("dispose")}}function s(e){throw new Error(`'${e}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function a(e){let t=e.length,n=0;for(;t>0;)n=Math.random()*t|0,t--,i(e,t,n)}function o(e,t,n){return Math.max(e,Math.min(t,n))}function i(e,t,n){const r=e[t];e[t]=e[n],e[n]=r}function u(e,t){if(!e)throw new Error("string"==typeof t?t:t())}function l(e,t,n=""){u(d(e,t),(()=>n+` Shapes ${e} and ${t} must match`))}function c(e){u(null!=e,(()=>"The input to the tensor constructor must be a non-null value."))}function p(e,t=[],n=!1){if(null==t&&(t=[]),Array.isArray(e)||v(e)&&!n)for(let r=0;r<e.length;++r)p(e[r],t,n);else t.push(e);return t}function h(e){if(0===e.length)return 1;let t=e[0];for(let n=1;n<e.length;n++)t*=e[n];return t}function d(e,t){if(e===t)return!0;if(null==e||null==t)return!1;if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}function m(e){return e%1==0}function f(e,t){return t<=e.length?e:e+" ".repeat(t-e.length)}function g(e,t){const n=t.length;return u((e=null==e?t.map(((e,t)=>t)):[].concat(e)).every((e=>e>=-n&&e<n)),(()=>`All values in axis param must be in range [-${n}, ${n}) but got axis ${e}`)),u(e.every((e=>m(e))),(()=>`All values in axis param must be integers but got axis ${e}`)),e.map((e=>e<0?n+e:e))}function y(e,t){const n=[],r=[],s=null!=t&&Array.isArray(t)&&0===t.length,a=null==t||s?null:g(t,e).sort();let o=0;for(let t=0;t<e.length;++t){if(null!=a){if(a[o]===t&&1!==e[t])throw new Error(`Can't squeeze axis ${t} since its dim '${e[t]}' is not 1`);(null==a[o]||a[o]>t)&&1===e[t]&&(n.push(e[t]),r.push(t)),a[o]<=t&&o++}1!==e[t]&&(n.push(e[t]),r.push(t))}return{newShape:n,keptDims:r}}function b(e,t){let n=null;if(null==e||"float32"===e)n=new Float32Array(t);else if("int32"===e)n=new Int32Array(t);else{if("bool"!==e)throw new Error(`Unknown data type ${e}`);n=new Uint8Array(t)}return n}function w(e,t){let n=null;if(null==e||"float32"===e)n=new Float32Array(t);else if("int32"===e)n=new Int32Array(t);else if("bool"===e)n=new Uint8Array(t);else{if("string"!==e)throw new Error(`Unknown data type ${e}`);n=new Array(t)}return n}function x(e,t){for(let n=0;n<e.length;n++){const r=e[n];if(isNaN(r)||!isFinite(r))throw Error(`A tensor of type ${t} being uploaded contains ${r}.`)}}function N(e){return"bool"===e||"complex64"===e||"float32"===e||"int32"===e||"string"===e}function v(e){return e instanceof Float32Array||e instanceof Int32Array||e instanceof Uint8Array||e instanceof Uint8ClampedArray}function S(e){if("float32"===e||"int32"===e)return 4;if("complex64"===e)return 8;if("bool"===e)return 1;throw new Error(`Unknown dtype ${e}`)}function T(e){if(null==e)return 0;let t=0;return e.forEach((e=>t+=e.length)),t}function k(e){return"string"==typeof e||e instanceof String}function E(e){return"boolean"==typeof e}function _(e){return"number"==typeof e}function M(e){return Array.isArray(e)?M(e[0]):e instanceof Float32Array?"float32":e instanceof Int32Array||e instanceof Uint8Array||e instanceof Uint8ClampedArray?"int32":_(e)?"float32":k(e)?"string":E(e)?"bool":"float32"}function I(e){return!!(e&&e.constructor&&e.call&&e.apply)}function A(e,t){for(let n=t;n<e;++n)if(e%n==0)return n;return e}function D(e){const t=e.length;if(t<2)return[];const n=new Array(t-1);n[t-2]=e[t-1];for(let r=t-3;r>=0;--r)n[r]=n[r+1]*e[r+1];return n}function $(e,t,n,r=!1){const s=new Array;if(1===t.length){const a=t[0]*(r?2:1);for(let t=0;t<a;t++)s[t]=n[e+t]}else{const a=t[0],o=t.slice(1),i=o.reduce(((e,t)=>e*t))*(r?2:1);for(let t=0;t<a;t++)s[t]=$(e+t*i,o,n,r)}return s}function O(e,t,n=!1){if(0===e.length)return t[0];const r=e.reduce(((e,t)=>e*t))*(n?2:1);if(0===r)return[];if(r!==t.length)throw new Error(`[${e}] does not match the input size ${t.length}${n?" for a complex tensor":""}.`);return $(0,e,t,n)}function L(e,t){const n=C(e,t);for(let e=0;e<n.length;e++)n[e]=1;return n}function C(e,t){if(null==t||"float32"===t||"complex64"===t)return new Float32Array(e);if("int32"===t)return new Int32Array(e);if("bool"===t)return new Uint8Array(e);throw new Error(`Unknown data type ${t}`)}function R(e){e.forEach((t=>{u(Number.isInteger(t)&&t>=0,(()=>`Tensor must have a shape comprised of positive integers but got shape [${e}].`))}))}function F(e){return e&&e.then&&"function"==typeof e.then}
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
 */const z="tfjsflags";class B{constructor(e){this.global=e,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=P,this.populateURLFlags()}setPlatform(e,t){null!=this.platform&&(j().getBool("IS_TEST")||j().getBool("PROD")||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${e}.`)),this.platformName=e,this.platform=t}registerFlag(e,t,n){if(this.flagRegistry[e]={evaluationFn:t,setHook:n},null!=this.urlFlags[e]){const t=this.urlFlags[e];j().getBool("IS_TEST")||j().getBool("PROD")||console.warn(`Setting feature override from URL ${e}: ${t}.`),this.set(e,t)}}async getAsync(e){return e in this.flags||(this.flags[e]=await this.evaluateFlag(e)),this.flags[e]}get(e){if(e in this.flags)return this.flags[e];const t=this.evaluateFlag(e);if(F(t))throw new Error(`Flag ${e} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[e]=t,this.flags[e]}getNumber(e){return this.get(e)}getBool(e){return this.get(e)}getFlags(){return this.flags}get features(){return this.flags}set(e,t){if(null==this.flagRegistry[e])throw new Error(`Cannot set flag ${e} as it has not been registered.`);this.flags[e]=t,null!=this.flagRegistry[e].setHook&&this.flagRegistry[e].setHook(t)}evaluateFlag(e){if(null==this.flagRegistry[e])throw new Error(`Cannot evaluate flag '${e}': no evaluation function found.`);return this.flagRegistry[e].evaluationFn()}setFlags(e){this.flags=Object.assign({},e)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(void 0===this.global||void 0===this.global.location||void 0===this.global.location.search)return;const e=this.getQueryParams(this.global.location.search);if(z in e){e[z].split(",").forEach((e=>{const[t,n]=e.split(":");this.urlFlags[t]=function(e,t){if("true"===(t=t.toLowerCase())||"false"===t)return"true"===t;if(""+ +t===t)return+t;throw new Error(`Could not parse value flag value ${t} for flag ${e}.`)}(t,n)}))}}}function P(e){const t={};return e.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,((e,...n)=>(function(e,t,n){e[decodeURIComponent(t)]=decodeURIComponent(n||"")}(t,n[0],n[1]),n.join("=")))),t}function j(){return G}let V,G=null;function W(){if(null==V){let e;if("undefined"!=typeof window)e=window;else if("undefined"!=typeof global)e=global;else if("undefined"!=typeof process)e=process;else{if("undefined"==typeof self)throw new Error("Could not find a global object");e=self}V=e}return V}function U(e,t){const n=function(){const e=W();return null==e._tfGlobals&&(e._tfGlobals=new Map),e._tfGlobals}();if(n.has(e))return n.get(e);{const r=t();return n.set(e,r),n.get(e)}}const q="Acos",H="Acosh",K="Add",Z="AddN",Y="ArgMax",Q="ArgMin",J="Asin",X="Asinh",ee="Atan",te="Atanh",ne="Atan2",re="AvgPool",se="AvgPool3D",ae="BatchMatMul",oe="BatchToSpaceND",ie="Bincount",ue="BroadcastArgs",le="Cast",ce="Ceil",pe="ClipByValue",he="Complex",de="ComplexAbs",me="Concat",fe="Conv2D",ge="Conv2DBackpropFilter",ye="Conv2DBackpropInput",be="Conv3D",we="Conv3DBackpropInputV2",xe="Cosh",Ne="Cumprod",ve="Cumsum",Se="CropAndResize",Te="DenseBincount",ke="DepthToSpace",Ee="DepthwiseConv2dNative",_e="DepthwiseConv2dNativeBackpropFilter",Me="DepthwiseConv2dNativeBackpropInput",Ie="Diag",Ae="Dilation2D",De="RealDiv",$e="Einsum",Oe="Equal",Le="ExpandDims",Ce="Expm1",Re="Fill",Fe="FlipLeftRight",ze="Floor",Be="FloorDiv",Pe="FusedBatchNorm",je="GatherV2",Ve="GatherNd",Ge="Greater",We="GreaterEqual",Ue="Identity",qe="IFFT",He="Imag",Ke="IsFinite",Ze="IsInf",Ye="IsNan",Qe="LeakyRelu",Je="Less",Xe="LessEqual",et="LinSpace",tt="Log1p",nt="LogicalAnd",rt="LogicalNot",st="LogicalOr",at="Maximum",ot="MaxPool",it="MaxPool3D",ut="MaxPoolWithArgmax",lt="Mean",ct="Minimum",pt="MirrorPad",ht="Multinomial",dt="Multiply",mt="NotEqual",ft="NonMaxSuppressionV3",gt="NonMaxSuppressionV4",yt="NonMaxSuppressionV5",bt="OnesLike",wt="OneHot",xt="Pack",Nt="PadV2",vt="Prelu",St="Prod",Tt="RaggedGather",kt="RaggedTensorToTensor",Et="Range",_t="Real",Mt="Reciprocal",It="Relu",At="Reshape",Dt="ResizeNearestNeighbor",$t="ResizeBilinear",Ot="Relu6",Lt="Reverse",Ct="Round",Rt="Rsqrt",Ft="ScatterNd",zt="SearchSorted",Bt="Select",Pt="Selu",jt="Slice",Vt="Sinh",Gt="Sign",Wt="Sigmoid",Ut="Softplus",qt="Sqrt",Ht="SpaceToBatchND",Kt="SplitV",Zt="Softmax",Yt="SparseFillEmptyRows",Qt="SparseReshape",Jt="SparseSegmentMean",Xt="SparseSegmentSum",en="SparseToDense",tn="SquaredDifference",nn="StridedSlice",rn="StringNGrams",sn="StringSplit",an="StringToHashBucketFast",on="Tanh",un="Tile",ln="TopK",cn="Transform",pn="Transpose",hn="Unique",dn="Unpack",mn="UnsortedSegmentSum",fn="ZerosLike",gn="Step",yn="FromPixels",bn="RotateWithOffset",wn="_FusedMatMul",xn="FusedConv2D",Nn="FusedDepthwiseConv2D";
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
function vn(...e){j().getBool("IS_TEST")||j().getBool("PROD")||console.warn(...e)}
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
const Sn=U("kernelRegistry",(()=>new Map)),Tn=U("gradRegistry",(()=>new Map));function kn(e,t){const n=In(e,t);return Sn.get(n)}function En(e){return Tn.get(e)}function _n(e){const t=Sn.entries(),n=[];for(;;){const{done:r,value:s}=t.next();if(r)break;const[a,o]=s,[i]=a.split("_");i===e&&n.push(o)}return n}function Mn(e){const{kernelName:t,backendName:n}=e,r=In(t,n);Sn.has(r)&&vn(`The kernel '${t}' for backend '${n}' is already registered`),Sn.set(r,e)}function In(e,t){return`${t}_${e}`}var An="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},Dn=On,$n=null;try{$n=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch(e){}function On(e,t,n){this.low=0|e,this.high=0|t,this.unsigned=!!n}function Ln(e){return!0===(e&&e.__isLong__)}On.prototype.__isLong__,Object.defineProperty(On.prototype,"__isLong__",{value:!0}),On.isLong=Ln;var Cn={},Rn={};function Fn(e,t){var n,r,s;return t?(s=0<=(e>>>=0)&&e<256)&&(r=Rn[e])?r:(n=Bn(e,(0|e)<0?-1:0,!0),s&&(Rn[e]=n),n):(s=-128<=(e|=0)&&e<128)&&(r=Cn[e])?r:(n=Bn(e,e<0?-1:0,!1),s&&(Cn[e]=n),n)}function zn(e,t){if(isNaN(e))return t?Kn:Hn;if(t){if(e<0)return Kn;if(e>=Wn)return Xn}else{if(e<=-Un)return er;if(e+1>=Un)return Jn}return e<0?zn(-e,t).neg():Bn(e%Gn|0,e/Gn|0,t)}function Bn(e,t,n){return new On(e,t,n)}On.fromInt=Fn,On.fromNumber=zn,On.fromBits=Bn;var Pn=Math.pow;function jn(e,t,n){if(0===e.length)throw Error("empty string");if("NaN"===e||"Infinity"===e||"+Infinity"===e||"-Infinity"===e)return Hn;if("number"==typeof t?(n=t,t=!1):t=!!t,(n=n||10)<2||36<n)throw RangeError("radix");var r;if((r=e.indexOf("-"))>0)throw Error("interior hyphen");if(0===r)return jn(e.substring(1),t,n).neg();for(var s=zn(Pn(n,8)),a=Hn,o=0;o<e.length;o+=8){var i=Math.min(8,e.length-o),u=parseInt(e.substring(o,o+i),n);if(i<8){var l=zn(Pn(n,i));a=a.mul(l).add(zn(u))}else a=(a=a.mul(s)).add(zn(u))}return a.unsigned=t,a}function Vn(e,t){return"number"==typeof e?zn(e,t):"string"==typeof e?jn(e,t):Bn(e.low,e.high,"boolean"==typeof t?t:e.unsigned)}On.fromString=jn,On.fromValue=Vn;var Gn=4294967296,Wn=Gn*Gn,Un=Wn/2,qn=Fn(1<<24),Hn=Fn(0);On.ZERO=Hn;var Kn=Fn(0,!0);On.UZERO=Kn;var Zn=Fn(1);On.ONE=Zn;var Yn=Fn(1,!0);On.UONE=Yn;var Qn=Fn(-1);On.NEG_ONE=Qn;var Jn=Bn(-1,2147483647,!1);On.MAX_VALUE=Jn;var Xn=Bn(-1,-1,!0);On.MAX_UNSIGNED_VALUE=Xn;var er=Bn(0,-2147483648,!1);On.MIN_VALUE=er;var tr=On.prototype;tr.toInt=function(){return this.unsigned?this.low>>>0:this.low},tr.toNumber=function(){return this.unsigned?(this.high>>>0)*Gn+(this.low>>>0):this.high*Gn+(this.low>>>0)},tr.toString=function(e){if((e=e||10)<2||36<e)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative()){if(this.eq(er)){var t=zn(e),n=this.div(t),r=n.mul(t).sub(this);return n.toString(e)+r.toInt().toString(e)}return"-"+this.neg().toString(e)}for(var s=zn(Pn(e,6),this.unsigned),a=this,o="";;){var i=a.div(s),u=(a.sub(i.mul(s)).toInt()>>>0).toString(e);if((a=i).isZero())return u+o;for(;u.length<6;)u="0"+u;o=""+u+o}},tr.getHighBits=function(){return this.high},tr.getHighBitsUnsigned=function(){return this.high>>>0},tr.getLowBits=function(){return this.low},tr.getLowBitsUnsigned=function(){return this.low>>>0},tr.getNumBitsAbs=function(){if(this.isNegative())return this.eq(er)?64:this.neg().getNumBitsAbs();for(var e=0!=this.high?this.high:this.low,t=31;t>0&&0==(e&1<<t);t--);return 0!=this.high?t+33:t+1},tr.isZero=function(){return 0===this.high&&0===this.low},tr.eqz=tr.isZero,tr.isNegative=function(){return!this.unsigned&&this.high<0},tr.isPositive=function(){return this.unsigned||this.high>=0},tr.isOdd=function(){return 1==(1&this.low)},tr.isEven=function(){return 0==(1&this.low)},tr.equals=function(e){return Ln(e)||(e=Vn(e)),(this.unsigned===e.unsigned||this.high>>>31!=1||e.high>>>31!=1)&&(this.high===e.high&&this.low===e.low)},tr.eq=tr.equals,tr.notEquals=function(e){return!this.eq(e)},tr.neq=tr.notEquals,tr.ne=tr.notEquals,tr.lessThan=function(e){return this.comp(e)<0},tr.lt=tr.lessThan,tr.lessThanOrEqual=function(e){return this.comp(e)<=0},tr.lte=tr.lessThanOrEqual,tr.le=tr.lessThanOrEqual,tr.greaterThan=function(e){return this.comp(e)>0},tr.gt=tr.greaterThan,tr.greaterThanOrEqual=function(e){return this.comp(e)>=0},tr.gte=tr.greaterThanOrEqual,tr.ge=tr.greaterThanOrEqual,tr.compare=function(e){if(Ln(e)||(e=Vn(e)),this.eq(e))return 0;var t=this.isNegative(),n=e.isNegative();return t&&!n?-1:!t&&n?1:this.unsigned?e.high>>>0>this.high>>>0||e.high===this.high&&e.low>>>0>this.low>>>0?-1:1:this.sub(e).isNegative()?-1:1},tr.comp=tr.compare,tr.negate=function(){return!this.unsigned&&this.eq(er)?er:this.not().add(Zn)},tr.neg=tr.negate,tr.add=function(e){Ln(e)||(e=Vn(e));var t=this.high>>>16,n=65535&this.high,r=this.low>>>16,s=65535&this.low,a=e.high>>>16,o=65535&e.high,i=e.low>>>16,u=0,l=0,c=0,p=0;return c+=(p+=s+(65535&e.low))>>>16,l+=(c+=r+i)>>>16,u+=(l+=n+o)>>>16,u+=t+a,Bn((c&=65535)<<16|(p&=65535),(u&=65535)<<16|(l&=65535),this.unsigned)},tr.subtract=function(e){return Ln(e)||(e=Vn(e)),this.add(e.neg())},tr.sub=tr.subtract,tr.multiply=function(e){if(this.isZero())return Hn;if(Ln(e)||(e=Vn(e)),$n)return Bn($n.mul(this.low,this.high,e.low,e.high),$n.get_high(),this.unsigned);if(e.isZero())return Hn;if(this.eq(er))return e.isOdd()?er:Hn;if(e.eq(er))return this.isOdd()?er:Hn;if(this.isNegative())return e.isNegative()?this.neg().mul(e.neg()):this.neg().mul(e).neg();if(e.isNegative())return this.mul(e.neg()).neg();if(this.lt(qn)&&e.lt(qn))return zn(this.toNumber()*e.toNumber(),this.unsigned);var t=this.high>>>16,n=65535&this.high,r=this.low>>>16,s=65535&this.low,a=e.high>>>16,o=65535&e.high,i=e.low>>>16,u=65535&e.low,l=0,c=0,p=0,h=0;return p+=(h+=s*u)>>>16,c+=(p+=r*u)>>>16,p&=65535,c+=(p+=s*i)>>>16,l+=(c+=n*u)>>>16,c&=65535,l+=(c+=r*i)>>>16,c&=65535,l+=(c+=s*o)>>>16,l+=t*u+n*i+r*o+s*a,Bn((p&=65535)<<16|(h&=65535),(l&=65535)<<16|(c&=65535),this.unsigned)},tr.mul=tr.multiply,tr.divide=function(e){if(Ln(e)||(e=Vn(e)),e.isZero())throw Error("division by zero");var t,n,r;if($n)return this.unsigned||-2147483648!==this.high||-1!==e.low||-1!==e.high?Bn((this.unsigned?$n.div_u:$n.div_s)(this.low,this.high,e.low,e.high),$n.get_high(),this.unsigned):this;if(this.isZero())return this.unsigned?Kn:Hn;if(this.unsigned){if(e.unsigned||(e=e.toUnsigned()),e.gt(this))return Kn;if(e.gt(this.shru(1)))return Yn;r=Kn}else{if(this.eq(er))return e.eq(Zn)||e.eq(Qn)?er:e.eq(er)?Zn:(t=this.shr(1).div(e).shl(1)).eq(Hn)?e.isNegative()?Zn:Qn:(n=this.sub(e.mul(t)),r=t.add(n.div(e)));if(e.eq(er))return this.unsigned?Kn:Hn;if(this.isNegative())return e.isNegative()?this.neg().div(e.neg()):this.neg().div(e).neg();if(e.isNegative())return this.div(e.neg()).neg();r=Hn}for(n=this;n.gte(e);){t=Math.max(1,Math.floor(n.toNumber()/e.toNumber()));for(var s=Math.ceil(Math.log(t)/Math.LN2),a=s<=48?1:Pn(2,s-48),o=zn(t),i=o.mul(e);i.isNegative()||i.gt(n);)i=(o=zn(t-=a,this.unsigned)).mul(e);o.isZero()&&(o=Zn),r=r.add(o),n=n.sub(i)}return r},tr.div=tr.divide,tr.modulo=function(e){return Ln(e)||(e=Vn(e)),$n?Bn((this.unsigned?$n.rem_u:$n.rem_s)(this.low,this.high,e.low,e.high),$n.get_high(),this.unsigned):this.sub(this.div(e).mul(e))},tr.mod=tr.modulo,tr.rem=tr.modulo,tr.not=function(){return Bn(~this.low,~this.high,this.unsigned)},tr.and=function(e){return Ln(e)||(e=Vn(e)),Bn(this.low&e.low,this.high&e.high,this.unsigned)},tr.or=function(e){return Ln(e)||(e=Vn(e)),Bn(this.low|e.low,this.high|e.high,this.unsigned)},tr.xor=function(e){return Ln(e)||(e=Vn(e)),Bn(this.low^e.low,this.high^e.high,this.unsigned)},tr.shiftLeft=function(e){return Ln(e)&&(e=e.toInt()),0==(e&=63)?this:e<32?Bn(this.low<<e,this.high<<e|this.low>>>32-e,this.unsigned):Bn(0,this.low<<e-32,this.unsigned)},tr.shl=tr.shiftLeft,tr.shiftRight=function(e){return Ln(e)&&(e=e.toInt()),0==(e&=63)?this:e<32?Bn(this.low>>>e|this.high<<32-e,this.high>>e,this.unsigned):Bn(this.high>>e-32,this.high>=0?0:-1,this.unsigned)},tr.shr=tr.shiftRight,tr.shiftRightUnsigned=function(e){if(Ln(e)&&(e=e.toInt()),0===(e&=63))return this;var t=this.high;return e<32?Bn(this.low>>>e|t<<32-e,t>>>e,this.unsigned):Bn(32===e?t:t>>>e-32,0,this.unsigned)},tr.shru=tr.shiftRightUnsigned,tr.shr_u=tr.shiftRightUnsigned,tr.toSigned=function(){return this.unsigned?Bn(this.low,this.high,!1):this},tr.toUnsigned=function(){return this.unsigned?this:Bn(this.low,this.high,!0)},tr.toBytes=function(e){return e?this.toBytesLE():this.toBytesBE()},tr.toBytesLE=function(){var e=this.high,t=this.low;return[255&t,t>>>8&255,t>>>16&255,t>>>24,255&e,e>>>8&255,e>>>16&255,e>>>24]},tr.toBytesBE=function(){var e=this.high,t=this.low;return[e>>>24,e>>>16&255,e>>>8&255,255&e,t>>>24,t>>>16&255,t>>>8&255,255&t]},On.fromBytes=function(e,t,n){return n?On.fromBytesLE(e,t):On.fromBytesBE(e,t)},On.fromBytesLE=function(e,t){return new On(e[0]|e[1]<<8|e[2]<<16|e[3]<<24,e[4]|e[5]<<8|e[6]<<16|e[7]<<24,t)},On.fromBytesBE=function(e,t){return new On(e[4]<<24|e[5]<<16|e[6]<<8|e[7],e[0]<<24|e[1]<<16|e[2]<<8|e[3],t)};
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
const nr=Dn||n({__proto__:null,default:Dn},[Dn]);function rr(e){return nr.fromString(e,!0,16)}const sr=rr("c3a5c85c97cb3127"),ar=rr("b492b66fbe98f273"),or=rr("9ae16a3b2f90404f");function ir(e){return e.xor(e.shru(47))}function ur(e,t,n){const r=e.slice(t,t+n);return nr.fromBytes(Array.from(r),!0,!0)}function lr(e,t){return ur(e,t,8)}function cr(e,t){return ur(e,t,4)}function pr(e,t){return 0===t?e:e.shru(t).or(e.shl(64-t))}function hr(e,t,n=rr("9ddfea08eb382d69")){let r=e.xor(t).mul(n);r=r.xor(r.shru(47));let s=t.xor(r).mul(n);return s=s.xor(s.shru(47)),s=s.mul(n),s}function dr(e,t,n,r){return function(e,t,n,r,s,a){s=s.add(e),a=pr(a.add(s).add(r),21);const o=s;return s=(s=s.add(t)).add(n),a=a.add(pr(s,44)),[s.add(r),a.add(o)]}(lr(e,t),lr(e,t+8),lr(e,t+16),lr(e,t+24),n,r)}function mr(e,t){if("string"===t)throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(e)&&(e=p(e)),j().getBool("DEBUG")&&x(e,t),function(e,t){return e instanceof Float32Array&&"float32"===t||e instanceof Int32Array&&"int32"===t||e instanceof Uint8Array&&"bool"===t}(e,t))return e;if(null==t||"float32"===t||"complex64"===t)return new Float32Array(e);if("int32"===t)return new Int32Array(e);if("bool"===t){const t=new Uint8Array(e.length);for(let n=0;n<t.length;++n)0!==Math.round(e[n])&&(t[n]=1);return t}throw new Error(`Unknown data type ${t}`)}function fr(){return j().platform.now()}function gr(e,t="utf-8"){return t=t||"utf-8",j().platform.encode(e,t)}function yr(e,t="utf-8"){return t=t||"utf-8",j().platform.decode(e,t)}var br=Object.freeze({__proto__:null,createScalarValue:
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
function(e,t){return"string"===t?gr(e):mr([e],t)},toTypedArray:mr,now:fr,fetch:function(e,t){return j().platform.fetch(e,t)},encodeString:gr,decodeString:yr,shuffle:a,shuffleCombo:function(e,t){if(e.length!==t.length)throw new Error(`Array sizes must match to be shuffled together First array length was ${e.length}Second array length was ${t.length}`);let n=e.length,r=0;for(;n>0;)r=Math.random()*n|0,n--,i(e,n,r),i(t,n,r)},clamp:o,nearestLargerEven:function(e){return e%2==0?e:e+1},swap:i,sum:function(e){let t=0;for(let n=0;n<e.length;n++)t+=e[n];return t},randUniform:function(e,t){const n=Math.random();return t*n+(1-n)*e},distSquared:function(e,t){let n=0;for(let r=0;r<e.length;r++){const s=Number(e[r])-Number(t[r]);n+=s*s}return n},assert:u,assertShapesMatch:l,assertNonNull:c,flatten:p,sizeFromShape:h,isScalarShape:function(e){return 0===e.length},arraysEqual:d,isInt:m,tanh:function(e){if(null!=Math.tanh)return Math.tanh(e);if(e===1/0)return 1;if(e===-1/0)return-1;{const t=Math.exp(2*e);return(t-1)/(t+1)}},sizeToSquarishShape:function(e){const t=Math.ceil(Math.sqrt(e));return[t,Math.ceil(e/t)]},createShuffledIndices:function(e){const t=new Uint32Array(e);for(let n=0;n<e;++n)t[n]=n;return a(t),t},rightPad:f,repeatedTry:function(e,t=(e=>0),n,r=setTimeout){return new Promise(((s,a)=>{let o=0;const i=()=>{if(e())return void s();o++;const u=t(o);null!=n&&o>=n?a():r(i,u)};i()}))},inferFromImplicitShape:function(e,t){let n=1,r=-1;for(let t=0;t<e.length;++t)if(e[t]>=0)n*=e[t];else if(-1===e[t]){if(-1!==r)throw Error(`Shapes can only have 1 implicit size. Found -1 at dim ${r} and dim ${t}`);r=t}else if(e[t]<0)throw Error(`Shapes can not be < 0. Found ${e[t]} at dim ${t}`);if(-1===r){if(t>0&&t!==n)throw Error(`Size(${t}) must match the product of shape ${e}`);return e}if(0===n)throw Error(`Cannot infer the missing size in [${e}] when there are 0 elements`);if(t%n!=0)throw Error(`The implicit shape can't be a fractional number. Got ${t} / ${n}`);const s=e.slice();return s[r]=t/n,s},parseAxisParam:g,squeezeShape:y,getTypedArrayFromDType:b,getArrayFromDType:w,checkConversionForErrors:x,isValidDtype:N,hasEncodingLoss:function(e,t){return"complex64"!==t&&(("float32"!==t||"complex64"===e)&&(("int32"!==t||"float32"===e||"complex64"===e)&&("bool"!==t||"bool"!==e)))},isTypedArray:v,bytesPerElement:S,bytesFromStringArray:T,isString:k,isBoolean:E,isNumber:_,inferDtype:M,isFunction:I,nearestDivisor:A,computeStrides:D,toNestedArray:O,makeOnesTypedArray:L,makeZerosTypedArray:C,makeZerosNestedTypedArray:function(e,t){const n=e.reduce(((e,t)=>e*t),1);if(null==t||"float32"===t)return O(e,new Float32Array(n));if("int32"===t)return O(e,new Int32Array(n));if("bool"===t)return O(e,new Uint8Array(n));throw new Error(`Unknown data type ${t}`)},assertNonNegativeIntegerDimensions:R,locToIndex:function(e,t,n){if(0===t)return 0;if(1===t)return e[0];let r=e[e.length-1];for(let t=0;t<e.length-1;++t)r+=n[t]*e[t];return r},indexToLoc:function(e,t,n){if(0===t)return[];if(1===t)return[e];const r=new Array(t);for(let t=0;t<r.length-1;++t)r[t]=Math.floor(e/n[t]),e-=r[t]*n[t];return r[r.length-1]=e,r},isPromise:F,hexToLong:rr,fingerPrint64:function(e,t=e.length){const n=nr.fromNumber(81,!0);if(t<=32)return t<=16?function(e,t=e.length){if(t>=8){const n=or.add(2*t),r=lr(e,0).add(or),s=lr(e,t-8);return hr(pr(s,37).mul(n).add(r),pr(r,25).add(s).mul(n),n)}if(t>=4){const n=or.add(2*t);return hr(cr(e,0).shl(3).add(t),cr(e,t-4),n)}if(t>0){const n=e[0]+(e[t>>1]<<8),r=t+(e[t-1]<<2);return ir(or.mul(n).xor(sr.mul(r))).mul(or)}return or}(e,t):function(e,t=e.length){const n=or.add(2*t),r=lr(e,0).mul(ar),s=lr(e,8),a=lr(e,t-8).mul(n),o=lr(e,t-16).mul(or);return hr(pr(r.add(s),43).add(pr(a,30)).add(o),r.add(pr(s.add(or),18)).add(a),n)}(e,t);if(t<=64)return function(e,t=e.length){const n=or.add(2*t),r=lr(e,0).mul(or),s=lr(e,8),a=lr(e,t-8).mul(n),o=lr(e,t-16).mul(or),i=pr(r.add(s),43).add(pr(a,30)).add(o),u=hr(i,r.add(pr(s.add(or),18)).add(a),n),l=lr(e,16).mul(n),c=lr(e,24),p=i.add(lr(e,t-32)).mul(n),h=u.add(lr(e,t-24)).mul(n);return hr(pr(l.add(c),43).add(pr(p,30)).add(h),l.add(pr(c.add(r),18)).add(p),n)}(e,t);let r=n,s=n.mul(ar).add(113),a=ir(s.mul(or).add(113)).mul(or),o=[nr.UZERO,nr.UZERO],i=[nr.UZERO,nr.UZERO];r=r.mul(or).add(lr(e,0));let u=0;const l=64*(t-1>>6),c=l+(t-1&63)-63;do{r=pr(r.add(s).add(o[0]).add(lr(e,u+8)),37).mul(ar),s=pr(s.add(o[1]).add(lr(e,u+48)),42).mul(ar),r=r.xor(i[1]),s=s.add(o[0]).add(lr(e,u+40)),a=pr(a.add(i[0]),33).mul(ar),o=dr(e,u,o[1].mul(ar),r.add(i[0])),i=dr(e,u+32,a.add(i[1]),s.add(lr(e,u+16))),[a,r]=[r,a],u+=64}while(u!==l);const p=ar.add(a.and(255).shl(1));return u=c,i[0]=i[0].add(t-1&63),o[0]=o[0].add(i[0]),i[0]=i[0].add(o[0]),r=pr(r.add(s).add(o[0]).add(lr(e,u+8)),37).mul(p),s=pr(s.add(o[1]).add(lr(e,u+48)),42).mul(p),r=r.xor(i[1].mul(9)),s=s.add(o[0].mul(9).add(lr(e,u+40))),a=pr(a.add(i[0]),33).mul(p),o=dr(e,u,o[1].mul(p),r.add(i[0])),i=dr(e,u+32,a.add(i[1]),s.add(lr(e,u+16))),[a,r]=[r,a],hr(hr(o[0],i[0],p).add(ir(s).mul(sr)).add(a),hr(o[1],i[1],p).add(r),p)}});
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
 */class wr{constructor(e,t){this.backendTimer=e,this.logger=t,null==t&&(this.logger=new Nr)}profileKernel(e,t,n){let r;const s=()=>{r=n()};let a;const o=fr();if(this.backendTimer.timerAvailable())a=this.backendTimer.time(s);else{s();for(const e of r)e.dataSync();a=Promise.resolve({kernelMs:fr()-o})}if(j().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let t=0;t<r.length;t++){const n=r[t];n.data().then((t=>{xr(t,n.dtype,e)}))}return{kernelName:e,outputs:r,inputs:t,timeMs:a.then((e=>e.kernelMs)),extraInfo:a.then((e=>null!=e.getExtraProfileInfo?e.getExtraProfileInfo():""))}}logKernelProfile(e){const{kernelName:t,outputs:n,timeMs:r,inputs:s,extraInfo:a}=e;n.forEach((e=>{Promise.all([e.data(),r,a]).then((n=>{this.logger.logKernelProfile(t,e,n[0],n[1],s,n[2])}))}))}}function xr(e,t,n){if("float32"!==t)return!1;for(let t=0;t<e.length;t++){const r=e[t];if(isNaN(r)||!isFinite(r))return console.warn(`Found ${r} in the result of '${n}'`),!0}return!1}class Nr{logKernelProfile(e,t,n,r,s,a){const o="number"==typeof r?f(`${r}ms`,9):r.error,i=f(e,25),u=t.rank,l=t.size,c=f(t.shape.toString(),14);let p="";for(const e in s){const n=s[e];if(null!=n){const r=n.shape||t.shape,s=r.length;p+=`${e}: ${s}D ${s>0?r:""} `}}console.log(`%c${i}\t%c${o}\t%c${u}D ${c}\t%c${l}\t%c${p}\t%c${a}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}}
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
 */function vr(e,t,n,r){const s=D(t),a=function(e,t,n,r){const s=h(t),a=r[r.length-1],o=new Array(a).fill(0),i=t.length,u="complex64"===n?Er(e):e;if(i>1)for(let e=0;e<s/a;e++){const t=e*a;for(let e=0;e<a;e++)o[e]=Math.max(o[e],Sr(u[t+e],0,n).length)}return o}(e,t,n,s),o=t.length,i=kr(e,t,n,s,a),u=["Tensor"];return r&&(u.push(`  dtype: ${n}`),u.push(`  rank: ${o}`),u.push(`  shape: [${t}]`),u.push("  values:")),u.push(i.map((e=>"    "+e)).join("\n")),u.join("\n")}function Sr(e,t,n){let r;return r=Array.isArray(e)?`${parseFloat(e[0].toFixed(7))} + ${parseFloat(e[1].toFixed(7))}j`:k(e)?`'${e}'`:"bool"===n?Tr(e):parseFloat(e.toFixed(7)).toString(),f(r,t)}function Tr(e){return 0===e?"false":"true"}function kr(e,t,n,r,s,a=!0){const o="complex64"===n?2:1,i=t[0],u=t.length;if(0===u){if("complex64"===n){return[Sr(Er(e)[0],0,n)]}return"bool"===n?[Tr(e[0])]:[e[0].toString()]}if(1===u){if(i>20){const t=3*o;let r=Array.from(e.slice(0,t)),a=Array.from(e.slice((i-3)*o,i*o));return"complex64"===n&&(r=Er(r),a=Er(a)),["["+r.map(((e,t)=>Sr(e,s[t],n))).join(", ")+", ..., "+a.map(((e,t)=>Sr(e,s[i-3+t],n))).join(", ")+"]"]}return["["+("complex64"===n?Er(e):Array.from(e)).map(((e,t)=>Sr(e,s[t],n))).join(", ")+"]"]}const l=t.slice(1),c=r.slice(1),p=r[0]*o,h=[];if(i>20){for(let t=0;t<3;t++){const r=t*p,a=r+p;h.push(...kr(e.slice(r,a),l,n,c,s,!1))}h.push("...");for(let t=i-3;t<i;t++){const r=t*p,a=r+p;h.push(...kr(e.slice(r,a),l,n,c,s,t===i-1))}}else for(let t=0;t<i;t++){const r=t*p,a=r+p;h.push(...kr(e.slice(r,a),l,n,c,s,t===i-1))}const d=2===u?",":"";h[0]="["+h[0]+d;for(let e=1;e<h.length-1;e++)h[e]=" "+h[e]+d;let m=",\n";for(let e=2;e<u;e++)m+="\n";return h[h.length-1]=" "+h[h.length-1]+"]"+(a?"":m),h}function Er(e){const t=[];for(let n=0;n<e.length;n+=2)t.push([e[n],e[n+1]]);return t}
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
 */class _r{constructor(e,t,n){if(this.dtype=t,this.shape=e.slice(),this.size=h(e),null!=n){const e=n.length;u(e===this.size,(()=>`Length of values '${e}' does not match the size inferred by the shape '${this.size}'.`))}if("complex64"===t)throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=n||w(t,this.size),this.strides=D(e)}set(e,...t){0===t.length&&(t=[0]),u(t.length===this.rank,(()=>`The number of provided coordinates (${t.length}) must match the rank (${this.rank})`));const n=this.locToIndex(t);this.values[n]=e}get(...e){0===e.length&&(e=[0]);let t=0;for(const n of e){if(n<0||n>=this.shape[t]){const t=`Requested out of range element at ${e}.   Buffer shape=${this.shape}`;throw new Error(t)}t++}let n=e[e.length-1];for(let t=0;t<e.length-1;++t)n+=this.strides[t]*e[t];return this.values[n]}locToIndex(e){if(0===this.rank)return 0;if(1===this.rank)return e[0];let t=e[e.length-1];for(let n=0;n<e.length-1;++n)t+=this.strides[n]*e[n];return t}indexToLoc(e){if(0===this.rank)return[];if(1===this.rank)return[e];const t=new Array(this.shape.length);for(let n=0;n<t.length-1;++n)t[n]=Math.floor(e/this.strides[n]),e-=t[n]*this.strides[n];return t[t.length-1]=e,t}get rank(){return this.shape.length}toTensor(){return Mr().makeTensor(this.values,this.shape,this.dtype)}}let Mr=null,Ir=null;class Ar{constructor(e,t,n,r){this.kept=!1,this.isDisposedInternal=!1,this.shape=e.slice(),this.dtype=t||"float32",this.size=h(e),this.strides=D(e),this.dataId=n,this.id=r,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){const e=await this.data();return Ir.buffer(this.shape,this.dtype,e)}bufferSync(){return Ir.buffer(this.shape,this.dtype,this.dataSync())}async array(){const e=await this.data();return O(this.shape,e,"complex64"===this.dtype)}arraySync(){return O(this.shape,this.dataSync(),"complex64"===this.dtype)}async data(){this.throwIfDisposed();const e=Mr().read(this.dataId);if("string"===this.dtype){const t=await e;try{return t.map((e=>yr(e)))}catch(e){throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return e}dataToGPU(e){return this.throwIfDisposed(),Mr().readToGPU(this.dataId,e)}dataSync(){this.throwIfDisposed();const e=Mr().readSync(this.dataId);if("string"===this.dtype)try{return e.map((e=>yr(e)))}catch(e){throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return e}async bytes(){this.throwIfDisposed();const e=await Mr().read(this.dataId);return"string"===this.dtype?e:new Uint8Array(e.buffer)}dispose(){this.isDisposed||(Mr().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(e=!1){return Ir.print(this,e)}clone(){return this.throwIfDisposed(),Ir.clone(this)}toString(e=!1){return vr(this.dataSync(),this.shape,this.dtype,e)}cast(e){return this.throwIfDisposed(),Ir.cast(this,e)}variable(e=!0,t,n){return this.throwIfDisposed(),Mr().makeVariable(this,e,t,n)}}Object.defineProperty(Ar,Symbol.hasInstance,{value:e=>!!e&&null!=e.data&&null!=e.dataSync&&null!=e.throwIfDisposed}),U("Tensor",(()=>Ar));class Dr extends Ar{constructor(e,t,n,r){super(e.shape,e.dtype,e.dataId,r),this.trainable=t,this.name=n}assign(e){if(e.dtype!==this.dtype)throw new Error(`dtype of the new value (${e.dtype}) and previous value (${this.dtype}) must match`);if(!d(e.shape,this.shape))throw new Error(`shape of the new value (${e.shape}) and previous value (${this.shape}) must match`);Mr().disposeTensor(this),this.dataId=e.dataId,Mr().incRef(this,null)}dispose(){Mr().disposeVariable(this),this.isDisposedInternal=!0}}
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
var $r,Or,Lr,Cr,Rr;Object.defineProperty(Dr,Symbol.hasInstance,{value:e=>e instanceof Ar&&null!=e.assign&&e.assign instanceof Function}),function(e){e.R0="R0",e.R1="R1",e.R2="R2",e.R3="R3",e.R4="R4",e.R5="R5",e.R6="R6"}($r||($r={})),function(e){e.float32="float32",e.int32="int32",e.bool="int32",e.complex64="complex64"}(Or||(Or={})),function(e){e.float32="float32",e.int32="int32",e.bool="bool",e.complex64="complex64"}(Lr||(Lr={})),function(e){e.float32="float32",e.int32="float32",e.bool="float32",e.complex64="complex64"}(Cr||(Cr={})),function(e){e.float32="complex64",e.int32="complex64",e.bool="complex64",e.complex64="complex64"}(Rr||(Rr={}));const Fr={float32:Cr,int32:Or,bool:Lr,complex64:Rr};function zr(e,t){if("string"===e||"string"===t){if("string"===e&&"string"===t)return"string";throw new Error(`Can not upcast ${e} with ${t}`)}return Fr[e][t]}
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
function Br(e,t){if(e.dtype===t.dtype)return[e,t];const n=zr(e.dtype,t.dtype);return[e.cast(n),t.cast(n)]}function Pr(e,t){u(e.dtype===t.dtype,(()=>`The dtypes of the first(${e.dtype}) and second(${t.dtype}) input must match`))}function jr(e){const t=[];return Vr(e,t,new Set),t}function Vr(e,t,n){if(null==e)return;if(e instanceof Ar)return void t.push(e);if(r=e,!Array.isArray(r)&&"object"!=typeof r)return;var r;const s=e;for(const e in s){const r=s[e];n.has(r)||(n.add(r),Vr(r,t,n))}}var Gr=Object.freeze({__proto__:null,makeTypesMatch:Br,assertTypesMatch:Pr,isTensorInList:function(e,t){return t.some((t=>t.id===e.id))},getTensorsInContainer:jr});
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
 */function Wr(e){return null!=e.kernelName}class Ur{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map((e=>e.name))))}}}dispose(){for(const e in this.registeredVariables)this.registeredVariables[e].dispose()}}class qr{constructor(e){this.ENV=e,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new Ur}async ready(){if(null!=this.pendingBackendInit)return this.pendingBackendInit.then((()=>{}));if(null!=this.backendInstance)return;const e=this.getSortedBackends();for(let t=0;t<e.length;t++){const n=e[t];if(await this.initializeBackend(n).success)return void await this.setBackend(n)}throw new Error("Could not initialize any backends, all backend initializations failed.")}get backend(){if(null!=this.pendingBackendInit)throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(null==this.backendInstance){const{name:e,asyncInit:t}=this.initializeBackendsAndReturnBest();if(t)throw new Error(`The highest priority backend '${e}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(e)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(e){if(!(e in this.registry)){if(!(e in this.registryFactory))return null;{const{asyncInit:t}=this.initializeBackend(e);if(t)return null}}return this.registry[e]}findBackendFactory(e){return e in this.registryFactory?this.registryFactory[e].factory:null}registerBackend(e,t,n=1){return e in this.registryFactory?(vn(`${e} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[e]={factory:t,priority:n},!0)}async setBackend(e){if(null==this.registryFactory[e])throw new Error(`Backend name '${e}' not found in registry`);if(this.backendName=e,null==this.registry[e]){this.backendInstance=null;const{success:t,asyncInit:n}=this.initializeBackend(e);if(!(n?await t:t))return!1}return this.backendInstance=this.registry[e],this.setupRegisteredKernels(),this.profiler=new wr(this.backendInstance),!0}setupRegisteredKernels(){_n(this.backendName).forEach((e=>{null!=e.setupFunc&&e.setupFunc(this.backendInstance)}))}disposeRegisteredKernels(e){_n(e).forEach((t=>{null!=t.disposeFunc&&t.disposeFunc(this.registry[e])}))}initializeBackend(e){const t=this.registryFactory[e];if(null==t)throw new Error(`Cannot initialize backend ${e}, no registration found.`);try{const n=t.factory();if(!n||n instanceof r||"function"!=typeof n.then)return this.registry[e]=n,{success:!0,asyncInit:!1};{const t=++this.pendingBackendInitId,r=n.then((n=>!(t<this.pendingBackendInitId)&&(this.registry[e]=n,this.pendingBackendInit=null,!0))).catch((n=>(t<this.pendingBackendInitId||(this.pendingBackendInit=null,vn(`Initialization of backend ${e} failed`),vn(n.stack||n.message)),!1)));return this.pendingBackendInit=r,{success:r,asyncInit:!0}}}catch(t){return vn(`Initialization of backend ${e} failed`),vn(t.stack||t.message),{success:!1,asyncInit:!1}}}removeBackend(e){if(!(e in this.registryFactory))throw new Error(`${e} backend not found in registry`);this.backendName===e&&null!=this.pendingBackendInit&&this.pendingBackendInitId++,e in this.registry&&(this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e]),delete this.registryFactory[e],this.backendName===e&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(0===Object.keys(this.registryFactory).length)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort(((e,t)=>this.registryFactory[t].priority-this.registryFactory[e].priority))}initializeBackendsAndReturnBest(){const e=this.getSortedBackends();for(let t=0;t<e.length;t++){const n=e[t],{success:r,asyncInit:s}=this.initializeBackend(n);if(s||r)return{name:n,asyncInit:s}}throw new Error("Could not initialize any backends, all backend initializations failed.")}moveData(e,t){const n=this.state.tensorInfo.get(t),r=n.backend,s=this.readSync(t),a=r.refCount(t);r.disposeData(t,!0),n.backend=e,e.move(t,s,n.shape,n.dtype,a),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(e,t){let n,r=null;if(null==t){if("function"!=typeof e)throw new Error("Please provide a function to tidy()");t=e}else{if("string"!=typeof e&&!(e instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if("function"!=typeof t)throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");r=e}return this.scopedRun((()=>this.startScope(r)),(()=>this.endScope(n)),(()=>(n=t(),n instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),n)))}scopedRun(e,t,n){e();try{const e=n();return t(),e}catch(e){throw t(),e}}nextTensorId(){return qr.nextTensorId++}nextVariableId(){return qr.nextVariableId++}clone(e){const t=Kr.runKernel(Ue,{x:e}),n={x:e};return this.addTapeNode(this.state.activeScope.name,n,[t],(e=>({x:()=>{const t={x:e},n={dtype:"float32"};return Kr.runKernel(le,t,n)}})),[],{}),t}runKernel(e,t,n){null==this.backendName&&this.backend;if(!(null!=kn(e,this.backendName)))throw new Error(`Kernel '${e}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:e,inputs:t,attrs:n})}shouldCheckForMemLeaks(){return this.ENV.getBool("IS_TEST")}checkKernelForMemLeak(e,t,n){const r=this.backend.numDataIds();let s=0;n.forEach((e=>{s+="complex64"===e.dtype?3:1}));const a=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],o=r-t-s-a;if(o>0)throw new Error(`Backend '${this.backendName}' has an internal memory leak (${o} data ids) after running '${e}'`)}runKernelFunc(e){let t,n=[];const r=this.isTapeOn(),s=this.state.numBytes,a=this.state.numTensors;let o,i;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0),null==this.backendName&&this.backend;const l=Wr(e)?e.kernelName:null!=this.state.activeScope?this.state.activeScope.name:"";if(Wr(e)){const{kernelName:t,inputs:s,attrs:a}=e;null==this.backendName&&this.backend;const l=kn(t,this.backendName);u(null!=l,(()=>`Cannot find registered kernel '${t}' for backend '${this.backendName}'`)),o=()=>{const e=this.backend.numDataIds();i=l.kernelFunc({inputs:s,attrs:a,backend:this.backend});const o=Array.isArray(i)?i:[i];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(t,e,o);const u=o.map((e=>null!=e.rank?e:this.makeTensorFromTensorInfo(e)));if(r){const e=this.getTensorsForGradient(t,s,u);n=this.saveTensorsForBackwardMode(e)}return u}}else{const{forwardFunc:t}=e,s=e=>{r&&(n=e.map((e=>this.keep(this.clone(e)))))};o=()=>{const e=this.backend.numDataIds();i=this.tidy((()=>t(this.backend,s)));const n=Array.isArray(i)?i:[i];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(l,e,n),n}}const{inputs:c,attrs:p}=e,h=Wr(e)?null:e.backwardsFunc;let d;return this.scopedRun((()=>this.state.kernelDepth++),(()=>this.state.kernelDepth--),(()=>{this.ENV.getBool("DEBUG")||this.state.profiling?(d=this.profiler.profileKernel(l,c,(()=>o())),this.ENV.getBool("DEBUG")&&this.profiler.logKernelProfile(d),t=d.outputs):t=o()})),r&&this.addTapeNode(l,c,t,h,n,p),this.state.profiling&&this.state.activeProfile.kernels.push({name:l,bytesAdded:this.state.numBytes-s,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-a,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(c).map((e=>null!=c[e]?c[e].shape:null)),outputShapes:t.map((e=>e.shape)),kernelTimeMs:d.timeMs,extraInfo:d.extraInfo}),Array.isArray(i)?t:t[0]}saveTensorsForBackwardMode(e){const t=e.map((e=>this.keep(this.clone(e))));return t}getTensorsForGradient(e,t,n){const r=En(e);if(null!=r){const e=r.inputsToSave||[],s=r.outputsToSave||[];let a;r.saveAllInputs?(u(Array.isArray(t),(()=>"saveAllInputs is true, expected inputs to be an array.")),a=Object.keys(t).map((e=>t[e]))):a=e.map((e=>t[e]));const o=n.filter(((e,t)=>s[t]));return a.concat(o)}return[]}makeTensor(e,t,n,r){if(null==e)throw new Error("Values passed to engine.makeTensor() are null");n=n||"float32",r=r||this.backend;let s=e;"string"===n&&k(e[0])&&(s=e.map((e=>gr(e))));const a=r.write(s,t,n),o=new Ar(t,n,a,this.nextTensorId());if(this.trackTensor(o,r),"string"===n){const e=this.state.tensorInfo.get(a),t=T(s);this.state.numBytes+=t-e.bytes,e.bytes=t}return o}makeTensorFromDataId(e,t,n,r){const s={dataId:e,shape:t,dtype:n=n||"float32"};return this.makeTensorFromTensorInfo(s,r)}makeTensorFromTensorInfo(e,t){const{dataId:n,shape:r,dtype:s}=e,a=new Ar(r,s,n,this.nextTensorId());return this.trackTensor(a,t),a}makeVariable(e,t=!0,n,r){n=n||this.nextVariableId().toString(),null!=r&&r!==e.dtype&&(e=e.cast(r));const s=new Dr(e,t,n,this.nextTensorId());if(null!=this.state.registeredVariables[s.name])throw new Error(`Variable with name ${s.name} was already registered`);return this.state.registeredVariables[s.name]=s,this.incRef(s,this.backend),s}trackTensor(e,t){this.state.numTensors++,"string"===e.dtype&&this.state.numStringTensors++;let n=0;"complex64"!==e.dtype&&"string"!==e.dtype&&(n=e.size*S(e.dtype)),this.state.numBytes+=n,this.state.tensorInfo.has(e.dataId)||(this.state.numDataBuffers++,this.state.tensorInfo.set(e.dataId,{backend:t||this.backend,dtype:e.dtype,shape:e.shape,bytes:n})),e instanceof Dr||this.track(e)}incRef(e,t){this.trackTensor(e,t),this.backend.incRef(e.dataId)}removeDataId(e,t){this.state.tensorInfo.has(e)&&this.state.tensorInfo.get(e).backend===t&&(this.state.tensorInfo.delete(e),this.state.numDataBuffers--)}disposeTensor(e){if(!this.state.tensorInfo.has(e.dataId))return;const t=this.state.tensorInfo.get(e.dataId);if(this.state.numTensors--,"string"===e.dtype&&(this.state.numStringTensors--,this.state.numBytes-=t.bytes),"complex64"!==e.dtype&&"string"!==e.dtype){const t=e.size*S(e.dtype);this.state.numBytes-=t}t.backend.disposeData(e.dataId)&&this.removeDataId(e.dataId,t.backend)}disposeVariables(){for(const e in this.state.registeredVariables){const t=this.state.registeredVariables[e];this.disposeVariable(t)}}disposeVariable(e){this.disposeTensor(e),null!=this.state.registeredVariables[e.name]&&delete this.state.registeredVariables[e.name]}memory(){const e=this.backend.memory();return e.numTensors=this.state.numTensors,e.numDataBuffers=this.state.numDataBuffers,e.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(e.unreliable=!0,null==e.reasons&&(e.reasons=[]),e.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),e}async profile(e){this.state.profiling=!0;const t=this.state.numBytes,n=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await e(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map((e=>e.totalBytesSnapshot))),this.state.activeProfile.newBytes=this.state.numBytes-t,this.state.activeProfile.newTensors=this.state.numTensors-n;for(const e of this.state.activeProfile.kernels)e.kernelTimeMs=await e.kernelTimeMs,e.extraInfo=await e.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&0===this.state.kernelDepth}addTapeNode(e,t,n,r,s,a){const o={id:this.state.nextTapeNodeId++,kernelName:e,inputs:t,outputs:n,saved:s},i=En(e);null!=i&&(r=i.gradFunc),null!=r&&(o.gradient=e=>(e=e.map(((e,t)=>{if(null==e){const e=n[t],r=C(e.size,e.dtype);return this.makeTensor(r,e.shape,e.dtype)}return e})),r(e.length>1?e:e[0],s,a))),this.state.activeTape.push(o)}keep(e){return e.kept=!0,e}startTape(){0===this.state.gradientDepth&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(e){const t={track:[],name:"unnamed scope",id:this.state.nextScopeId++};e&&(t.name=e),this.state.scopeStack.push(t),this.state.activeScope=t}endScope(e){const t=jr(e),n=new Set(t.map((e=>e.id)));for(let e=0;e<this.state.activeScope.track.length;e++){const t=this.state.activeScope.track[e];t.kept||n.has(t.id)||t.dispose()}const r=this.state.scopeStack.pop();this.state.activeScope=0===this.state.scopeStack.length?null:this.state.scopeStack[this.state.scopeStack.length-1],t.forEach((e=>{e.kept||e.scopeId!==r.id||this.track(e)}))}gradients(e,t,n,r=!1){if(u(t.length>0,(()=>"gradients() received an empty list of xs.")),null!=n&&"float32"!==n.dtype)throw new Error(`dy must have 'float32' dtype, but has '${n.dtype}'`);const s=this.scopedRun((()=>this.startTape()),(()=>this.endTape()),(()=>this.tidy("forward",e)));u(s instanceof Ar,(()=>"The result y returned by f() must be a tensor."));const a=function(e,t,n){const r={},s={};for(let e=0;e<t.length;e++)r[t[e].id]=!0;for(let n=0;n<e.length;n++){const a=e[n],o=a.inputs;for(const e in o){const n=o[e];let i=!1;for(let e=0;e<t.length;e++)if(r[n.id]){a.outputs.forEach((e=>r[e.id]=!0)),i=!0,s[a.id]=!0;break}if(i)break}}const a={};a[n.id]=!0;const o={};for(let t=e.length-1;t>=0;t--){const n=e[t],r=n.inputs;for(let e=0;e<n.outputs.length;e++)if(a[n.outputs[e].id]){for(const e in r)a[r[e].id]=!0,o[n.id]=!0;break}}const i=[];for(let t=0;t<e.length;t++){const n=e[t];if(s[n.id]&&o[n.id]){const e={};for(const t in n.inputs){const s=n.inputs[t];r[s.id]&&(e[t]=s)}const t=Object.assign({},n);t.inputs=e,t.outputs=n.outputs,i.push(t)}}return i}(this.state.activeTape,t,s);if(!r&&0===a.length&&t.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",(()=>{const e={};e[s.id]=null==n?function(e){const t=L(h(e),"float32");return Kr.makeTensor(t,e,"float32")}(s.shape):n,function(e,t,n,r){for(let s=t.length-1;s>=0;s--){const a=t[s],o=[];if(a.outputs.forEach((t=>{const n=e[t.id];null!=n?o.push(n):o.push(null)})),null==a.gradient)throw new Error(`Cannot compute gradient: gradient function not found for ${a.kernelName}.`);const i=a.gradient(o);for(const t in a.inputs){if(!(t in i))throw new Error(`Cannot backprop through input ${t}. Available gradients found: ${Object.keys(i)}.`);const s=n((()=>i[t]()));if("float32"!==s.dtype)throw new Error(`Error in gradient for op ${a.kernelName}. The gradient of input ${t} must have 'float32' dtype, but has '${s.dtype}'`);const o=a.inputs[t];if(!d(s.shape,o.shape))throw new Error(`Error in gradient for op ${a.kernelName}. The gradient of input '${t}' has shape '${s.shape}', which does not match the shape of the input '${o.shape}'`);if(null==e[o.id])e[o.id]=s;else{const t=e[o.id];e[o.id]=r(t,s),t.dispose()}}}}
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
 */(e,a,(e=>this.tidy(e)),Zr);const r=t.map((t=>e[t.id]));return 0===this.state.gradientDepth&&(this.state.activeTape.forEach((e=>{for(const t of e.saved)t.dispose()})),this.state.activeTape=null),{value:s,grads:r}}))}customGrad(e){return u(I(e),(()=>"The f passed in customGrad(f) must be a function.")),(...t)=>{let n;u(t.every((e=>e instanceof Ar)),(()=>"The args passed in customGrad(f)(x1, x2,...) must all be tensors"));const r={};t.forEach(((e,t)=>{r[t]=e}));return this.runKernelFunc({forwardFunc:(r,s)=>(n=e(...t,s),u(n.value instanceof Ar,(()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor")),u(I(n.gradFunc),(()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function.")),n.value),backwardsFunc:(e,r)=>{const s=n.gradFunc(e,r),a=Array.isArray(s)?s:[s];u(a.length===t.length,(()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...).")),u(a.every((e=>e instanceof Ar)),(()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors."));const o={};return a.forEach(((e,t)=>{o[t]=()=>e})),o},inputs:r})}}readSync(e){return this.state.tensorInfo.get(e).backend.readSync(e)}read(e){return this.state.tensorInfo.get(e).backend.read(e)}readToGPU(e,t){return this.state.tensorInfo.get(e).backend.readToGPU(e,t)}async time(e){const t=fr(),n=await this.backend.time(e);return n.wallMs=fr()-t,n}track(e){return null!=this.state.activeScope&&(e.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(e)),e}get registeredVariables(){return this.state.registeredVariables}reset(){this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new Ur;for(const e in this.registry)this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}}function Hr(){const e=W();if(null==e._tfengine){const t=new B(e);e._tfengine=new qr(t)}var t;
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */return t=e._tfengine.ENV,G=t,Mr=()=>e._tfengine,e._tfengine}qr.nextTensorId=0,qr.nextVariableId=0;const Kr=Hr();function Zr(e,t){const n={a:e,b:t};return Kr.runKernel(K,n)}
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
 */let Yr;function Qr(){return"undefined"!=typeof window&&null!=window.document||"undefined"!=typeof WorkerGlobalScope}var Jr=Object.freeze({__proto__:null,mockIsMobile:function(e){Yr=e},isMobile:function(e){if(void 0!==Yr)return Yr;if(e||"undefined"!=typeof navigator&&null!=navigator){if(e||(e=navigator),"ReactNative"===e.product)return!0;const t=e.userAgent||e.vendor||("undefined"!=typeof window?window.opera:"");if(!t){const t=e;return t.userAgentData&&t.userAgentData.mobile}return/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4))}return!1},isBrowser:Qr});
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
 */const Xr=j();
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
function es(e,t){let n=e;if(v(e))return"string"===t?[]:[e.length];if(!Array.isArray(e))return[];const r=[];for(;Array.isArray(n)||v(n)&&"string"!==t;)r.push(n.length),n=n[0];return Array.isArray(e)&&j().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&ts(e,r,[]),r}function ts(e,t,n){if(n=n||[],!Array.isArray(e)&&!v(e))return void u(0===t.length,(()=>`Element arr[${n.join("][")}] is a primitive, but should be an array/TypedArray of ${t[0]} elements`));u(t.length>0,(()=>`Element arr[${n.join("][")}] should be a primitive, but is an array of ${e.length} elements`)),u(e.length===t[0],(()=>`Element arr[${n.join("][")}] should have ${t[0]} elements, but has ${e.length} elements`));const r=t.slice(1);for(let t=0;t<e.length;++t)ts(e[t],r,n.concat(t))}function ns(e,t,n,r){if("string_or_numeric"!==e){if(null==e)throw new Error("Expected dtype cannot be null.");if("numeric"!==e&&e!==t||"numeric"===e&&"string"===t)throw new Error(`Argument '${n}' passed to '${r}' must be ${e} tensor, but got ${t} tensor`)}}function rs(e,t,n,r="numeric"){if(e instanceof Ar)return ns(r,e.dtype,t,n),e;let s=M(e);if("string"!==s&&["bool","int32","float32"].indexOf(r)>=0&&(s=r),ns(r,s,t,n),null==e||!v(e)&&!Array.isArray(e)&&"number"!=typeof e&&"boolean"!=typeof e&&"string"!=typeof e){const r=null==e?"null":e.constructor.name;throw new Error(`Argument '${t}' passed to '${n}' must be a Tensor or TensorLike, but got '${r}'`)}const a=es(e,s);v(e)||Array.isArray(e)||(e=[e]);const o="string"!==s?mr(e,s):p(e,[],!0);return Kr.makeTensor(o,a,s)}function ss(e,t,n,r="numeric"){if(!Array.isArray(e))throw new Error(`Argument ${t} passed to ${n} must be a \`Tensor[]\` or \`TensorLike[]\``);return e.map(((e,s)=>rs(e,`${t}[${s}]`,n,r)))}
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
 */Xr.registerFlag("DEBUG",(()=>!1),(e=>{e&&console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.")})),Xr.registerFlag("IS_BROWSER",(()=>Qr())),Xr.registerFlag("IS_NODE",(()=>"undefined"!=typeof process&&void 0!==process.versions&&void 0!==process.versions.node)),Xr.registerFlag("IS_CHROME",(()=>"undefined"!=typeof navigator&&null!=navigator&&null!=navigator.userAgent&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor))),Xr.registerFlag("PROD",(()=>!1)),Xr.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY",(()=>Xr.getBool("DEBUG"))),Xr.registerFlag("DEPRECATION_WARNINGS_ENABLED",(()=>!0)),Xr.registerFlag("IS_TEST",(()=>!1)),Xr.registerFlag("CHECK_COMPUTATION_FOR_ERRORS",(()=>!0)),Xr.registerFlag("WRAP_TO_IMAGEBITMAP",(()=>!1)),Xr.registerFlag("ENGINE_COMPILE_ONLY",(()=>!1)),Xr.registerFlag("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU",(()=>!1)),Xr.registerFlag("USE_SETTIMEOUTCUSTOM",(()=>!1));const as="__op";function os(e){const t=Object.keys(e);if(1!==t.length)throw new Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${t.length} keys.`);let n=t[0];const r=e[n];n.endsWith("_")&&(n=n.substring(0,n.length-1)),n+=as;const s=(...e)=>{Kr.startScope(n);try{const t=r(...e);return F(t)&&console.error("Cannot return a Promise inside of tidy."),Kr.endScope(t),t}catch(e){throw Kr.endScope(null),e}};return Object.defineProperty(s,"name",{value:n,configurable:!0}),s}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const is=os({complex_:function(e,t){const n=rs(e,"real","complex"),r=rs(t,"imag","complex");l(n.shape,r.shape,`real and imag shapes, ${n.shape} and ${r.shape}, must match in call to tf.complex().`);const s={real:n,imag:r};return Kr.runKernel(he,s)}});
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
 */function us(e,t,n,r){if(null==r&&(r=M(e)),"complex64"===r)throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(!v(e)&&!Array.isArray(e)&&"number"!=typeof e&&"boolean"!=typeof e&&"string"!=typeof e)throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(null!=t){R(t);const e=h(t),r=h(n);u(e===r,(()=>`Based on the provided shape, [${t}], the tensor should have ${e} values but has ${r}`));for(let e=0;e<n.length;++e){const r=n[e],s=e!==n.length-1||r!==h(t.slice(e));u(n[e]===t[e]||!s,(()=>`Error creating a new Tensor. Inferred shape (${n}) does not match the provided shape (${t}). `))}}return v(e)||Array.isArray(e)||(e=[e]),t=t||n,e="string"!==r?mr(e,r):p(e,[],!0),Kr.makeTensor(e,t,r)}
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
 */function ls(e,t,n){return us(e,t,es(e,n),n)}
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
 */const cs={float32:4,float16:2,int32:4,uint16:2,uint8:1,bool:1,complex64:8};
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
 */function ps(e,t){const n={};let r,s=0;for(const a of t){const t=a.name,o=a.dtype,i=a.shape,u=h(i);let l;if("quantization"in a){const n=a.quantization;if("uint8"===n.dtype||"uint16"===n.dtype){if(!("min"in n)||!("scale"in n))throw new Error(`Weight ${a.name} with quantization ${n.dtype} doesn't have corresponding metadata min and scale.`)}else{if("float16"!==n.dtype)throw new Error(`Weight ${a.name} has unknown quantization dtype ${n.dtype}. Supported quantization dtypes are: 'uint8', 'uint16', and 'float16'.`);if("float32"!==o)throw new Error(`Weight ${a.name} is quantized with ${n.dtype} which only supports weights of type float32 not ${o}.`)}const i=cs[n.dtype],c=e.slice(s,s+u*i),p="uint8"===n.dtype?new Uint8Array(c):new Uint16Array(c);if("float32"===o)if("uint8"===n.dtype||"uint16"===n.dtype){l=new Float32Array(p.length);for(let e=0;e<p.length;e++){const t=p[e];l[e]=t*n.scale+n.min}}else{if("float16"!==n.dtype)throw new Error(`Unsupported quantization type ${n.dtype} for weight type float32.`);void 0===r&&(r=vs()),l=r(p)}else{if("int32"!==o)throw new Error(`Unsupported dtype in weight '${t}': ${o}`);if("uint8"!==n.dtype&&"uint16"!==n.dtype)throw new Error(`Unsupported quantization type ${n.dtype} for weight type int32.`);l=new Int32Array(p.length);for(let e=0;e<p.length;e++){const t=p[e];l[e]=Math.round(t*n.scale+n.min)}}s+=u*i}else if("string"===o){const t=h(a.shape);l=[];for(let n=0;n<t;n++){const t=new Uint32Array(e.slice(s,s+4))[0];s+=4;const n=new Uint8Array(e.slice(s,s+t));l.push(n),s+=t}}else{const r=cs[o],a=e.slice(s,s+u*r);if("float32"===o)l=new Float32Array(a);else if("int32"===o)l=new Int32Array(a);else if("bool"===o)l=new Uint8Array(a);else{if("complex64"!==o)throw new Error(`Unsupported dtype in weight '${t}': ${o}`);{l=new Float32Array(a);const e=new Float32Array(l.length/2),r=new Float32Array(l.length/2);for(let t=0;t<e.length;t++)e[t]=l[2*t],r[t]=l[2*t+1];const s=ls(e,i,"float32"),o=ls(r,i,"float32");n[t]=is(s,o),s.dispose(),o.dispose()}}s+=u*r}"complex64"!==o&&(n[t]=ls(l,i,o))}return n}function hs(e){if(null===e)throw new Error(`Invalid input value: ${JSON.stringify(e)}`);let t=0;const n=[];e.forEach((e=>{if(t+=e.byteLength,n.push(e.byteLength===e.buffer.byteLength?e:new e.constructor(e)),!(e instanceof Float32Array||e instanceof Int32Array||e instanceof Uint8Array))throw new Error(`Unsupported TypedArray subtype: ${e.constructor.name}`)}));const r=new Uint8Array(t);let s=0;return n.forEach((e=>{r.set(new Uint8Array(e.buffer),s),s+=e.byteLength})),r.buffer}const ds="undefined"!=typeof Buffer&&("undefined"==typeof Blob||"undefined"==typeof atob||"undefined"==typeof btoa);function ms(e){return ds?Buffer.byteLength(e):new Blob([e]).size}function fs(e){if(1===e.length)return e[0];let t=0;e.forEach((e=>{t+=e.byteLength}));const n=new Uint8Array(t);let r=0;return e.forEach((e=>{n.set(new Uint8Array(e),r),r+=e.byteLength})),n.buffer}function gs(e){for(e=e.trim();e.endsWith("/");)e=e.slice(0,e.length-1);const t=e.split("/");return t[t.length-1]}function ys(e,t){const n={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,weightsManifest:t};return null!=e.signature&&(n.signature=e.signature),null!=e.userDefinedMetadata&&(n.userDefinedMetadata=e.userDefinedMetadata),null!=e.modelInitializer&&(n.modelInitializer=e.modelInitializer),null!=e.trainingConfig&&(n.trainingConfig=e.trainingConfig),n}function bs(e,t,n){const r={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy};if(null!=e.trainingConfig&&(r.trainingConfig=e.trainingConfig),null!=e.weightsManifest){if(!t)throw new Error("modelJSON has weightsManifest but weightSpecs is null");if(!n)throw new Error("modelJSON has weightsManifest but weightData is null");r.weightSpecs=t,r.weightData=n}return null!=e.signature&&(r.signature=e.signature),null!=e.userDefinedMetadata&&(r.userDefinedMetadata=e.userDefinedMetadata),null!=e.modelInitializer&&(r.modelInitializer=e.modelInitializer),r}async function ws(e,t){let n,r;return null!=e.weightsManifest&&([n,r]=await t(e.weightsManifest)),bs(e,n,r)}function xs(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("Expected JSON model topology, received ArrayBuffer.");return{dateSaved:new Date,modelTopologyType:"JSON",modelTopologyBytes:null==e.modelTopology?0:ms(JSON.stringify(e.modelTopology)),weightSpecsBytes:null==e.weightSpecs?0:ms(JSON.stringify(e.weightSpecs)),weightDataBytes:null==e.weightData?0:e.weightData.byteLength}}function Ns(e){const t=[];for(const n of e)t.push(...n.weights);return t}function vs(){const e=function(){const e=e=>{let t=e<<13,n=0;for(;0==(8388608&t);)n-=8388608,t<<=1;return t&=-8388609,n+=947912704,t|n},t=new Uint32Array(2048);t[0]=0;for(let n=1;n<1024;n++)t[n]=e(n);for(let e=1024;e<2048;e++)t[e]=939524096+(e-1024<<13);return t}(),t=function(){const e=new Uint32Array(64);e[0]=0,e[31]=1199570944,e[32]=2147483648,e[63]=3347054592;for(let t=1;t<31;t++)e[t]=t<<23;for(let t=33;t<63;t++)e[t]=2147483648+(t-32<<23);return e}(),n=function(){const e=new Uint32Array(64);for(let t=0;t<64;t++)e[t]=1024;return e[0]=e[32]=0,e}();return r=>{const s=new ArrayBuffer(4*r.length),a=new Uint32Array(s);for(let s=0;s<r.length;s++){const o=r[s],i=e[n[o>>10]+(1023&o)]+t[o>>10];a[s]=i}return new Float32Array(s)}}
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
 */class Ss{constructor(){this.saveRouters=[],this.loadRouters=[]}static getInstance(){return null==Ss.instance&&(Ss.instance=new Ss),Ss.instance}static registerSaveRouter(e){Ss.getInstance().saveRouters.push(e)}static registerLoadRouter(e){Ss.getInstance().loadRouters.push(e)}static getSaveHandlers(e){return Ss.getHandlers(e,"save")}static getLoadHandlers(e,t){return Ss.getHandlers(e,"load",t)}static getHandlers(e,t,n){const r=[];return("load"===t?Ss.getInstance().loadRouters:Ss.getInstance().saveRouters).forEach((t=>{const s=t(e,n);null!==s&&r.push(s)})),r}}const Ts="tensorflowjs",ks="models_store",Es="model_info_store";function _s(){if(!j().getBool("IS_BROWSER"))throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");const e="undefined"==typeof window?self:window,t=e.indexedDB||e.mozIndexedDB||e.webkitIndexedDB||e.msIndexedDB||e.shimIndexedDB;if(null==t)throw new Error("The current browser does not appear to support IndexedDB.");return t}function Ms(e){const t=e.result;t.createObjectStore(ks,{keyPath:"modelPath"}),t.createObjectStore(Es,{keyPath:"modelPath"})}class Is{constructor(e){if(this.indexedDB=_s(),null==e||!e)throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");this.modelPath=e}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");return this.databaseAction(this.modelPath,e)}async load(){return this.databaseAction(this.modelPath)}databaseAction(e,t){return new Promise(((e,n)=>{const r=this.indexedDB.open(Ts,1);r.onupgradeneeded=()=>Ms(r),r.onsuccess=()=>{const s=r.result;if(null==t){const t=s.transaction(ks,"readonly"),r=t.objectStore(ks).get(this.modelPath);r.onsuccess=()=>{if(null==r.result)return s.close(),n(new Error(`Cannot find model with path '${this.modelPath}' in IndexedDB.`));e(r.result.modelArtifacts)},r.onerror=e=>(s.close(),n(r.error)),t.oncomplete=()=>s.close()}else{const r=xs(t),a=s.transaction(Es,"readwrite");let o=a.objectStore(Es);const i=o.put({modelPath:this.modelPath,modelArtifactsInfo:r});let u;i.onsuccess=()=>{u=s.transaction(ks,"readwrite");const i=u.objectStore(ks).put({modelPath:this.modelPath,modelArtifacts:t,modelArtifactsInfo:r});i.onsuccess=()=>e({modelArtifactsInfo:r}),i.onerror=e=>{o=a.objectStore(Es);const t=o.delete(this.modelPath);t.onsuccess=()=>(s.close(),n(i.error)),t.onerror=e=>(s.close(),n(i.error))}},i.onerror=e=>(s.close(),n(i.error)),a.oncomplete=()=>{null==u?s.close():u.oncomplete=()=>s.close()}}},r.onerror=e=>n(r.error)}))}}Is.URL_SCHEME="indexeddb://";const As=e=>{return j().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(Is.URL_SCHEME)?(t=e.slice(Is.URL_SCHEME.length),new Is(t)):null;var t};Ss.registerSaveRouter(As),Ss.registerLoadRouter(As);class Ds{constructor(){this.indexedDB=_s()}async listModels(){return new Promise(((e,t)=>{const n=this.indexedDB.open(Ts,1);n.onupgradeneeded=()=>Ms(n),n.onsuccess=()=>{const r=n.result,s=r.transaction(Es,"readonly"),a=s.objectStore(Es).getAll();a.onsuccess=()=>{const t={};for(const e of a.result)t[e.modelPath]=e.modelArtifactsInfo;e(t)},a.onerror=e=>(r.close(),t(a.error)),s.oncomplete=()=>r.close()},n.onerror=e=>t(n.error)}))}async removeModel(e){var t;return e=(t=e).startsWith(Is.URL_SCHEME)?t.slice(Is.URL_SCHEME.length):t,new Promise(((t,n)=>{const r=this.indexedDB.open(Ts,1);r.onupgradeneeded=()=>Ms(r),r.onsuccess=()=>{const s=r.result,a=s.transaction(Es,"readwrite"),o=a.objectStore(Es),i=o.get(e);let u;i.onsuccess=()=>{if(null==i.result)return s.close(),n(new Error(`Cannot find model with path '${e}' in IndexedDB.`));{const r=o.delete(e),a=()=>{u=s.transaction(ks,"readwrite");const r=u.objectStore(ks).delete(e);r.onsuccess=()=>t(i.result.modelArtifactsInfo),r.onerror=e=>n(i.error)};r.onsuccess=a,r.onerror=e=>(a(),s.close(),n(i.error))}},i.onerror=e=>(s.close(),n(i.error)),a.oncomplete=()=>{null==u?s.close():u.oncomplete=()=>s.close()}},r.onerror=e=>n(r.error)}))}}
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
 */const $s="/",Os="tensorflowjs_models",Ls="info",Cs="model_topology",Rs="weight_specs",Fs="weight_data",zs="model_metadata";function Bs(e){return{info:[Os,e,Ls].join($s),topology:[Os,e,Cs].join($s),weightSpecs:[Os,e,Rs].join($s),weightData:[Os,e,Fs].join($s),modelMetadata:[Os,e,zs].join($s)}}function Ps(e){for(const t of Object.values(e))window.localStorage.removeItem(t)}function js(e){const t=e.split($s);if(t.length<3)throw new Error(`Invalid key format: ${e}`);return t.slice(1,t.length-1).join($s)}class Vs{constructor(e){if(!j().getBool("IS_BROWSER")||"undefined"==typeof window||void 0===window.localStorage)throw new Error("The current environment does not support local storage.");if(this.LS=window.localStorage,null==e||!e)throw new Error("For local storage, modelPath must not be null, undefined or empty.");this.modelPath=e,this.keys=Bs(this.modelPath)}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");{const t=JSON.stringify(e.modelTopology),n=JSON.stringify(e.weightSpecs),r=xs(e);try{this.LS.setItem(this.keys.info,JSON.stringify(r)),this.LS.setItem(this.keys.topology,t),this.LS.setItem(this.keys.weightSpecs,n),this.LS.setItem(this.keys.weightData,function(e){if(ds)return Buffer.from(e).toString("base64");const t=new Uint8Array(e);let n="";for(let e=0,r=t.length;e<r;e++)n+=String.fromCharCode(t[e]);return btoa(n)}(e.weightData));const s={format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,signature:null!=e.signature?e.signature:void 0,userDefinedMetadata:null!=e.userDefinedMetadata?e.userDefinedMetadata:void 0,modelInitializer:null!=e.modelInitializer?e.modelInitializer:void 0,trainingConfig:null!=e.trainingConfig?e.trainingConfig:void 0};return this.LS.setItem(this.keys.modelMetadata,JSON.stringify(s)),{modelArtifactsInfo:r}}catch(e){throw Ps(this.keys),new Error(`Failed to save model '${this.modelPath}' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=${r.modelTopologyBytes}, weightSpecsBytes=${r.weightSpecsBytes}, weightDataBytes=${r.weightDataBytes}.`)}}}async load(){const e=JSON.parse(this.LS.getItem(this.keys.info));if(null==e)throw new Error(`In local storage, there is no model with name '${this.modelPath}'`);if("JSON"!==e.modelTopologyType)throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");const t={},n=JSON.parse(this.LS.getItem(this.keys.topology));if(null==n)throw new Error(`In local storage, the topology of model '${this.modelPath}' is missing.`);t.modelTopology=n;const r=JSON.parse(this.LS.getItem(this.keys.weightSpecs));if(null==r)throw new Error(`In local storage, the weight specs of model '${this.modelPath}' are missing.`);t.weightSpecs=r;const s=this.LS.getItem(this.keys.modelMetadata);if(null!=s){const e=JSON.parse(s);t.format=e.format,t.generatedBy=e.generatedBy,t.convertedBy=e.convertedBy,null!=e.signature&&(t.signature=e.signature),null!=e.userDefinedMetadata&&(t.userDefinedMetadata=e.userDefinedMetadata),null!=e.modelInitializer&&(t.modelInitializer=e.modelInitializer),null!=e.trainingConfig&&(t.trainingConfig=e.trainingConfig)}const a=this.LS.getItem(this.keys.weightData);if(null==a)throw new Error(`In local storage, the binary weight values of model '${this.modelPath}' are missing.`);return t.weightData=function(e){if(ds){const t=Buffer.from(e,"base64");return t.buffer.slice(t.byteOffset,t.byteOffset+t.byteLength)}const t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;++e)n.set([t.charCodeAt(e)],e);return n.buffer}(a),t}}Vs.URL_SCHEME="localstorage://";const Gs=e=>{return j().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(Vs.URL_SCHEME)?(t=e.slice(Vs.URL_SCHEME.length),new Vs(t)):null;var t};Ss.registerSaveRouter(Gs),Ss.registerLoadRouter(Gs);class Ws{constructor(){u(j().getBool("IS_BROWSER"),(()=>"Current environment is not a web browser")),u("undefined"==typeof window||void 0!==window.localStorage,(()=>"Current browser does not appear to support localStorage")),this.LS=window.localStorage}async listModels(){const e={},t=Os+$s,n=$s+Ls;for(let r=0;r<this.LS.length;++r){const s=this.LS.key(r);if(s.startsWith(t)&&s.endsWith(n)){e[js(s)]=JSON.parse(this.LS.getItem(s))}}return e}async removeModel(e){var t;const n=Bs(e=(t=e).startsWith(Vs.URL_SCHEME)?t.slice(Vs.URL_SCHEME.length):t);if(null==this.LS.getItem(n.info))throw new Error(`Cannot find model at path '${e}'`);const r=JSON.parse(this.LS.getItem(n.info));return Ps(n),r}}
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
 */const Us="://";class qs{constructor(){this.managers={}}static getInstance(){return null==qs.instance&&(qs.instance=new qs),qs.instance}static registerManager(e,t){u(null!=e,(()=>"scheme must not be undefined or null.")),e.endsWith(Us)&&(e=e.slice(0,e.indexOf(Us))),u(e.length>0,(()=>"scheme must not be an empty string."));const n=qs.getInstance();u(null==n.managers[e],(()=>`A model store manager is already registered for scheme '${e}'.`)),n.managers[e]=t}static getManager(e){const t=qs.getInstance().managers[e];if(null==t)throw new Error(`Cannot find model manager for scheme '${e}'`);return t}static getSchemes(){return Object.keys(qs.getInstance().managers)}}function Hs(e){if(-1===e.indexOf(Us))throw new Error(`The url string provided does not contain a scheme. Supported schemes are: ${qs.getSchemes().join(",")}`);return{scheme:e.split(Us)[0],path:e.split(Us)[1]}}async function Ks(e,t,n=!1){u(e!==t,(()=>`Old path and new path are the same: '${e}'`));const r=Ss.getLoadHandlers(e);u(r.length>0,(()=>`Copying failed because no load handler is found for source URL ${e}.`)),u(r.length<2,(()=>`Copying failed because more than one (${r.length}) load handlers for source URL ${e}.`));const s=r[0],a=Ss.getSaveHandlers(t);u(a.length>0,(()=>`Copying failed because no save handler is found for destination URL ${t}.`)),u(a.length<2,(()=>`Copying failed because more than one (${r.length}) save handlers for destination URL ${t}.`));const o=a[0],i=Hs(e).scheme,l=Hs(e).path,c=i===Hs(e).scheme,p=await s.load();n&&c&&await qs.getManager(i).removeModel(l);const h=await o.save(p);return n&&!c&&await qs.getManager(i).removeModel(l),h.modelArtifactsInfo}
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
class Zs{constructor(){this.messageName="setTimeoutCustom",this.functionRefs=[],this.handledMessageCount=0,this.hasEventListener=!1}fetch(e,t){return fetch(e,t)}now(){return performance.now()}encode(e,t){if("utf-8"!==t&&"utf8"!==t)throw new Error(`Browser's encoder only supports utf-8, but got ${t}`);return null==this.textEncoder&&(this.textEncoder=new TextEncoder),this.textEncoder.encode(e)}decode(e,t){return new TextDecoder(t).decode(e)}setTimeoutCustom(e,t){window&&j().getBool("USE_SETTIMEOUTCUSTOM")?(this.functionRefs.push(e),setTimeout((()=>{window.postMessage({name:this.messageName,index:this.functionRefs.length-1},"*")}),t),this.hasEventListener||(this.hasEventListener=!0,window.addEventListener("message",(e=>{if(e.source===window&&e.data.name===this.messageName){e.stopPropagation();(0,this.functionRefs[e.data.index])(),this.handledMessageCount++,this.handledMessageCount===this.functionRefs.length&&(this.functionRefs=[],this.handledMessageCount=0)}}),!0))):setTimeout(e,t)}}if(j().get("IS_BROWSER")){j().setPlatform("browser",new Zs);try{qs.registerManager(Vs.URL_SCHEME,new Ws)}catch(e){}try{qs.registerManager(Is.URL_SCHEME,new Ds)}catch(e){}}
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
 */const Ys=()=>require("node-fetch");let Qs;class Js{constructor(){this.util=require("util"),this.textEncoder=new this.util.TextEncoder}fetch(e,t){return null!=j().global.fetch?j().global.fetch(e,t):(null==Qs&&(Qs=Ys()),Qs(e,t))}now(){const e=process.hrtime();return 1e3*e[0]+e[1]/1e6}encode(e,t){if("utf-8"!==t&&"utf8"!==t)throw new Error(`Node built-in encoder only supports utf-8, but got ${t}`);return this.textEncoder.encode(e)}decode(e,t){return 0===e.length?"":new this.util.TextDecoder(t).decode(e)}}
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
function Xs(e,t="float32",n){return t=t||"float32",R(e),new _r(e,t,n)}
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
 */j().get("IS_NODE")&&!j().get("IS_BROWSER")&&j().setPlatform("node",new Js);const ea=os({cast_:function(e,t){const n=rs(e,"x","cast");if(!N(t))throw new Error(`Failed to cast to unknown dtype ${t}`);if("string"===t&&"string"!==n.dtype||"string"!==t&&"string"===n.dtype)throw new Error("Only strings can be casted to strings");const r={x:n},s={dtype:t};return Kr.runKernel(le,r,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ta=os({clone_:function(e){const t={x:rs(e,"x","clone","string_or_numeric")};return Kr.runKernel(Ue,t)}});
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
 */function na(e,t=!1){console.log(e.toString(t))}
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
 */Hr();Ir={buffer:Xs,cast:ea,clone:ta,print:na};function ra(e){return new Promise((e=>setTimeout(e))).then(e)}class sa{constructor(e){if(!j().getBool("IS_BROWSER"))throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");e.startsWith(sa.URL_SCHEME)&&(e=e.slice(sa.URL_SCHEME.length)),null!=e&&0!==e.length||(e="model"),this.modelJsonFileName=e+".json",this.weightDataFileName=e+".weights.bin"}async save(e){if("undefined"==typeof document)throw new Error("Browser downloads are not supported in this environment since `document` is not present");const t=window.URL.createObjectURL(new Blob([e.weightData],{type:"application/octet-stream"}));if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");{const n=ys(e,[{paths:["./"+this.weightDataFileName],weights:e.weightSpecs}]),r=window.URL.createObjectURL(new Blob([JSON.stringify(n)],{type:"application/json"})),s=null==this.modelJsonAnchor?document.createElement("a"):this.modelJsonAnchor;if(s.download=this.modelJsonFileName,s.href=r,await ra((()=>s.dispatchEvent(new MouseEvent("click")))),null!=e.weightData){const e=null==this.weightDataAnchor?document.createElement("a"):this.weightDataAnchor;e.download=this.weightDataFileName,e.href=t,await ra((()=>e.dispatchEvent(new MouseEvent("click"))))}return{modelArtifactsInfo:xs(e)}}}}sa.URL_SCHEME="downloads://";class aa{constructor(e){if(null==e||e.length<1)throw new Error(`When calling browserFiles, at least 1 file is required, but received ${e}`);this.jsonFile=e[0],this.weightsFiles=e.slice(1)}async load(){return new Promise(((e,t)=>{const n=new FileReader;n.onload=n=>{const r=JSON.parse(n.target.result),s=r.modelTopology;if(null==s)return void t(new Error(`modelTopology field is missing from file ${this.jsonFile.name}`));if(null==r.weightsManifest)return void t(new Error(`weightManifest field is missing from file ${this.jsonFile.name}`));if(0===this.weightsFiles.length)return void e({modelTopology:s});const a=ws(r,(e=>this.loadWeights(e)));e(a)},n.onerror=e=>t(`Failed to read model topology and weights manifest JSON from file '${this.jsonFile.name}'. BrowserFiles supports loading Keras-style tf.Model artifacts only.`),n.readAsText(this.jsonFile)}))}loadWeights(e){const t=[],n=[];for(const r of e)t.push(...r.weights),n.push(...r.paths);const r=this.checkManifestAndWeightFiles(e),s=n.map((e=>this.loadWeightsFile(e,r[e])));return Promise.all(s).then((e=>[t,fs(e)]))}loadWeightsFile(e,t){return new Promise(((n,r)=>{const s=new FileReader;s.onload=e=>{const t=e.target.result;n(t)},s.onerror=t=>r(`Failed to weights data from file of path '${e}'.`),s.readAsArrayBuffer(t)}))}checkManifestAndWeightFiles(e){const t=[],n=this.weightsFiles.map((e=>gs(e.name))),r={};for(const s of e)s.paths.forEach((e=>{const s=gs(e);if(-1!==t.indexOf(s))throw new Error(`Duplicate file basename found in weights manifest: '${s}'`);if(t.push(s),-1===n.indexOf(s))throw new Error(`Weight file with basename '${s}' is not provided.`);r[e]=this.weightsFiles[n.indexOf(s)]}));if(t.length!==this.weightsFiles.length)throw new Error(`Mismatch in the number of files in weights manifest (${t.length}) and the number of weight files provided (${this.weightsFiles.length}).`);return r}}
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
function oa(e,t,n,r){!function(e){u(null!=e&&Array.isArray(e)&&e.length>0,(()=>"promises must be a none empty array"))}(e),function(e,t){u(e>=0&&e<=1,(()=>`Progress fraction must be in range [0, 1], but got startFraction ${e}`)),u(t>=0&&t<=1,(()=>`Progress fraction must be in range [0, 1], but got endFraction ${t}`)),u(t>=e,(()=>`startFraction must be no more than endFraction, but got startFraction ${e} and endFraction ${t}`))}(n=null==n?0:n,r=null==r?1:r);let s=0;return Promise.all(e.map((a=>(a.then((a=>{const o=n+ ++s/e.length*(r-n);return t(o),a})),a))))}
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
 */async function ia(e,t){null==t&&(t={});const n=null==t.fetchFunc?j().platform.fetch:t.fetchFunc,r=e.map((e=>n(e,t.requestInit,{isBinary:!0}))),s=(null==t.onProgress?await Promise.all(r):await oa(r,t.onProgress,0,.5)).map((e=>e.arrayBuffer()));return null==t.onProgress?await Promise.all(s):await oa(s,t.onProgress,.5,1)}function ua(e){return async(t,n="",r)=>{const s=t.map((()=>!1)),a={},o=null!=r?r.map((()=>!1)):[],i=[];if(t.forEach(((e,t)=>{let n=0;e.weights.forEach((e=>{const u="quantization"in e?e.quantization.dtype:e.dtype,l=cs[u]*h(e.shape),c=()=>{s[t]=!0,null==a[t]&&(a[t]=[]),a[t].push({manifestEntry:e,groupOffset:n,sizeBytes:l})};null!=r?r.forEach(((t,n)=>{t===e.name&&(c(),o[n]=!0)})):c(),i.push(e.name),n+=l}))})),!o.every((e=>e))){const e=r.filter(((e,t)=>!o[t]));throw new Error(`Could not find weights in manifest with names: ${e.join(", ")}. \nManifest JSON has weights with names: ${i.join(", ")}.`)}const u=s.reduce(((e,t,n)=>(t&&e.push(n),e)),[]),l=[];u.forEach((e=>{t[e].paths.forEach((e=>{const t=n+(n.endsWith("/")?"":"/")+e;l.push(t)}))}));const c=await e(l),p={};let d=0;return u.forEach((e=>{const n=t[e].paths.length;let r=0;for(let e=0;e<n;e++)r+=c[d+e].byteLength;const s=new ArrayBuffer(r),o=new Uint8Array(s);let i=0;for(let e=0;e<n;e++){const t=new Uint8Array(c[d+e]);o.set(t,i),i+=t.byteLength}a[e].forEach((e=>{const t=ps(s.slice(e.groupOffset,e.groupOffset+e.sizeBytes),[e.manifestEntry]);for(const e in t)p[e]=t[e]})),d+=n})),p}}
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
 */Ss.registerSaveRouter((e=>j().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(sa.URL_SCHEME)?function(e="model"){return new sa(e)}(e.slice(sa.URL_SCHEME.length)):null));class la{constructor(e,t){if(this.DEFAULT_METHOD="POST",null==t&&(t={}),this.weightPathPrefix=t.weightPathPrefix,this.onProgress=t.onProgress,this.weightUrlConverter=t.weightUrlConverter,null!=t.fetchFunc?(u("function"==typeof t.fetchFunc,(()=>"Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)")),this.fetch=t.fetchFunc):this.fetch=j().platform.fetch,u(null!=e&&e.length>0,(()=>"URL path for http must not be null, undefined or empty.")),Array.isArray(e)&&u(2===e.length,(()=>`URL paths for http must have a length of 2, (actual length is ${e.length}).`)),this.path=e,null!=t.requestInit&&null!=t.requestInit.body)throw new Error("requestInit is expected to have no pre-existing body, but has one.");this.requestInit=t.requestInit||{}}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");const t=Object.assign({method:this.DEFAULT_METHOD},this.requestInit);t.body=new FormData;const n=ys(e,[{paths:["./model.weights.bin"],weights:e.weightSpecs}]);t.body.append("model.json",new Blob([JSON.stringify(n)],{type:"application/json"}),"model.json"),null!=e.weightData&&t.body.append("model.weights.bin",new Blob([e.weightData],{type:"application/octet-stream"}),"model.weights.bin");const r=await this.fetch(this.path,t);if(r.ok)return{modelArtifactsInfo:xs(e),responses:[r]};throw new Error(`BrowserHTTPRequest.save() failed due to HTTP response status ${r.status}.`)}async load(){const e=await this.fetch(this.path,this.requestInit);if(!e.ok)throw new Error(`Request to ${this.path} failed with status code ${e.status}. Please verify this URL points to the model JSON of the model to load.`);let t;try{t=await e.json()}catch(e){let t=`Failed to parse model JSON of response from ${this.path}.`;throw this.path.endsWith(".pb")?t+=" Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository.":t+=" Please make sure the server is serving valid JSON for this request.",new Error(t)}const n=t.modelTopology,r=t.weightsManifest;if(null==n&&null==r)throw new Error(`The JSON from HTTP path ${this.path} contains neither model topology or manifest for weights.`);return ws(t,(e=>this.loadWeights(e)))}async loadWeights(e){const t=Array.isArray(this.path)?this.path[1]:this.path,[n,r]=function(e){const t=e.lastIndexOf("/"),n=e.lastIndexOf("?"),r=e.substring(0,t),s=n>t?e.substring(n):"";return[r+"/",s]}(t),s=this.weightPathPrefix||n,a=Ns(e),o=[],i=[];for(const t of e)for(const e of t.paths)null!=this.weightUrlConverter?i.push(this.weightUrlConverter(e)):o.push(s+e+r);this.weightUrlConverter&&o.push(...await Promise.all(i));return[a,fs(await ia(o,{requestInit:this.requestInit,fetchFunc:this.fetch,onProgress:this.onProgress}))]}}function ca(e){return null!=e.match(la.URL_SCHEME_REGEX)}la.URL_SCHEME_REGEX=/^https?:\/\//;const pa=(e,t)=>{if("undefined"==typeof fetch&&(null==t||null==t.fetchFunc))return null;{let n=!0;if(n=Array.isArray(e)?e.every((e=>ca(e))):ca(e),n)return ha(e,t)}return null};function ha(e,t){return new la(e,t)}Ss.registerSaveRouter(pa),Ss.registerLoadRouter(pa);
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
class da{constructor(e){this.modelArtifacts=e}load(){return this.modelArtifacts}}class ma{constructor(e){this.saveHandler=e}save(e){return this.saveHandler(e)}}class fa{constructor(e){e.load&&(this.load=()=>Promise.resolve(e.load())),e.save&&(this.save=t=>Promise.resolve(e.save(t)))}}function ga(e,t,n,r){if(1===arguments.length){return null!=e.modelTopology||null!=e.weightSpecs?new da(e):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new da({modelTopology:e}))}return console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new da({modelTopology:e,weightSpecs:t,weightData:n,trainingConfig:r})}
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
var ya=Object.freeze({__proto__:null,browserFiles:function(e){return new aa(e)},browserHTTPRequest:function(e,t){return ha(e,t)},concatenateArrayBuffers:fs,decodeWeights:ps,encodeWeights:async function(e,t){const n=[],r=[],s=Array.isArray(e)?e.map((e=>e.name)):Object.keys(e);for(let a=0;a<s.length;++a){const o=s[a],i=Array.isArray(e)?e[a].tensor:e[o];if("float32"!==i.dtype&&"int32"!==i.dtype&&"bool"!==i.dtype&&"string"!==i.dtype&&"complex64"!==i.dtype)throw new Error(`Unsupported dtype in weight '${o}': ${i.dtype}`);const u={name:o,shape:i.shape,dtype:i.dtype};if("string"===i.dtype){const e=new Promise((async e=>{const t=await i.bytes(),n=t.reduce(((e,t)=>e+t.length),0)+4*t.length,r=new Uint8Array(n);let s=0;for(let e=0;e<t.length;e++){const n=t[e],a=new Uint8Array(new Uint32Array([n.length]).buffer);r.set(a,s),s+=4,r.set(n,s),s+=n.length}e(r)}));r.push(e)}else r.push(i.data());null!=t&&(u.group=t),n.push(u)}return{data:hs(await Promise.all(r)),specs:n}},fromMemory:function(e,t,n,r){const s=arguments;return new fa(ga(...s))},fromMemorySync:ga,getLoadHandlers:(e,t)=>Ss.getLoadHandlers(e,t)
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
 */,getModelArtifactsForJSON:ws,getModelArtifactsForJSONSync:bs,getModelArtifactsInfoForJSON:xs,getSaveHandlers:e=>Ss.getSaveHandlers(e),getWeightSpecs:Ns,http:ha,isHTTPScheme:ca,loadWeights:async function(e,t="",n,r){return ua((e=>ia(e,{requestInit:r})))(e,t,n)},registerLoadRouter:e=>Ss.registerLoadRouter(e),registerSaveRouter:e=>Ss.registerSaveRouter(e),weightsLoaderFactory:ua,withSaveHandler:function(e){return new ma(e)},withSaveHandlerSync:function(e){return new ma(e)},copyModel:async function(e,t){return Ks(e,t,!1)},listModels:async function(){const e=qs.getSchemes(),t={};for(const n of e){const e=await qs.getManager(n).listModels();for(const r in e){t[n+Us+r]=e[r]}}return t},moveModel:async function(e,t){return Ks(e,t,!0)},removeModel:async function(e){const t=Hs(e);return qs.getManager(t.scheme).removeModel(t.path)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ba=os({matMul_:function(e,t,n=!1,r=!1){let s=rs(e,"a","matMul"),a=rs(t,"b","matMul");[s,a]=Br(s,a);const o={a:s,b:a},i={transposeA:n,transposeB:r};return Kr.runKernel(ae,o,i)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const wa=os({oneHot_:function(e,t,n=1,r=0,s="int32"){if(t<2)throw new Error(`Error in oneHot: depth must be >=2, but it is ${t}`);const a={indices:rs(e,"indices","oneHot","int32")},o={dtype:s,depth:t,onValue:n,offValue:r};return Kr.runKernel(wt,a,o)}});
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
 */function xa(e,t){return Kr.tidy(e,t)}function Na(e){jr(e).forEach((e=>e.dispose()))}function va(e){return Kr.keep(e)}const Sa=os({imag_:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
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
function(e){const t={input:rs(e,"input","imag")};return Kr.runKernel(He,t)}});
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
 */const Ta=os({neg_:function(e){const t={x:rs(e,"x","neg")};return Kr.runKernel("Neg",t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ka=os({real_:function(e){const t={input:rs(e,"input","real")};return Kr.runKernel(_t,t)}});
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
 */const Ea=os({transpose_:function(e,t,n){const r=rs(e,"x","transpose");if(null==t&&(t=r.shape.map(((e,t)=>t)).reverse()),u(r.rank===t.length,(()=>`Error in transpose: rank of input ${r.rank} must match length of perm ${t}.`)),t.forEach((e=>{u(e>=0&&e<r.rank,(()=>"All entries in 'perm' must be between 0 and "+(r.rank-1)+` but got ${t}`))})),r.rank<=1)return r.clone();const s={x:r},a={perm:t};return"complex64"===r.dtype?xa((()=>{let e=ka(r),t=Sa(r);return e=Kr.runKernel(pn,{x:e},a),t=Kr.runKernel(pn,{x:t},a),n&&(t=Ta(t)),is(e,t)})):Kr.runKernel(pn,s,a)}});
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
 */const _a=os({confusionMatrix_:function(e,t,n){const r=rs(e,"labels","confusionMatrix"),s=rs(t,"predictions","confusionMatrix");u(null==n||n>0&&Number.isInteger(n),(()=>`If provided, numClasses must be a positive integer, but got ${n}`)),u(1===r.rank,(()=>`Expected the rank of labels to be 1, but got ${r.rank}`)),u(1===s.rank,(()=>`Expected the rank of predictions to be 1, but got ${s.rank}`)),u(r.shape[0]===s.shape[0],(()=>`Mismatch in the number of examples: ${r.shape[0]} vs. ${s.shape[0]}. Labels and predictions should have the same number of elements.`)),u(n>0&&Number.isInteger(n),(()=>`numClasses is required to be a positive integer, but got ${n}`));const a=wa(ea(r,"int32"),n),o=wa(ea(s,"int32"),n),i=Ea(a),l=ba(i,o);return ea(l,"int32")}});
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
 */var Ma=Object.freeze({__proto__:null,confusionMatrix:_a});
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
 */function Ia(e,t){const n=e.length,r=[];for(let s=0;s<n;s++){const a=n-1-s,o=e[a]||1;(t[t.length-1-s]||1)>1&&1===o&&r.unshift(a)}return r}function Aa(e,t){const n=[];for(let r=0;r<t.length;r++){const s=e[e.length-r-1],a=t.length-r-1,o=t[a];(null==s||1===s&&o>1)&&n.unshift(a)}return n}function Da(e,t){const n=[],r=Math.max(e.length,t.length);for(let s=0;s<r;s++){let r=e[e.length-s-1];null==r&&(r=1);let a=t[t.length-s-1];if(null==a&&(a=1),1===r)n.unshift(a);else if(1===a)n.unshift(r);else{if(r!==a){throw Error(`Operands could not be broadcast together with shapes ${e} and ${t}.`)}n.unshift(r)}}return n}var $a=Object.freeze({__proto__:null,getBroadcastDims:Ia,getReductionAxes:Aa,assertAndGetBroadcastShape:Da});
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
 */function Oa(e,t,n){if(c(e),null!=t&&3!==t.length)throw new Error("tensor3d() requires shape to have three numbers");const r=es(e,n);if(3!==r.length&&1!==r.length)throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");if(1===r.length&&null==t)throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");return us(e,t,r,n)}
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
 */let La;function Ca(e,t=3){if(t>4)throw new Error("Cannot construct Tensor with more than 4 channels from pixels.");if(null==e)throw new Error("pixels passed to tf.browser.fromPixels() can not be null");let n=!1,r=!1,s=!1,a=!1,o=!1,i=!1;if(e.data instanceof Uint8Array)n=!0;else if("undefined"!=typeof ImageData&&e instanceof ImageData)r=!0;else if("undefined"!=typeof HTMLVideoElement&&e instanceof HTMLVideoElement)s=!0;else if("undefined"!=typeof HTMLImageElement&&e instanceof HTMLImageElement)a=!0;else if(null!=e.getContext)o=!0;else{if(!("undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap))throw new Error(`pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData in browser, or OffscreenCanvas, ImageData in webworker or {data: Uint32Array, width: number, height: number}, but was ${e.constructor.name}`);i=!0}if(null!=kn(yn,Kr.backendName)){const n={pixels:e},r={numChannels:t};return Kr.runKernel(yn,n,r)}const[u,l]=s?[e.videoWidth,e.videoHeight]:[e.width,e.height];let c,p;if(o)c=e.getContext("2d").getImageData(0,0,u,l).data;else if(r||n)c=e.data;else if(a||s||i){if(null==La)if("undefined"==typeof document){if("undefined"==typeof OffscreenCanvas||"undefined"==typeof OffscreenCanvasRenderingContext2D)throw new Error("Cannot parse input in current context. Reason: OffscreenCanvas Context2D rendering is not supported.");La=new OffscreenCanvas(1,1).getContext("2d")}else La=document.createElement("canvas").getContext("2d",{willReadFrequently:!0});La.canvas.width=u,La.canvas.height=l,La.drawImage(e,0,0,u,l),c=La.getImageData(0,0,u,l).data}if(4===t)p=new Int32Array(c);else{const e=u*l;p=new Int32Array(e*t);for(let n=0;n<e;n++)for(let e=0;e<t;++e)p[n*t+e]=c[4*n+e]}return Oa(p,[l,u,t],"int32")}function Ra(e){return"undefined"!=typeof window&&"undefined"!=typeof ImageBitmap&&window.hasOwnProperty("createImageBitmap")&&!(e instanceof ImageBitmap)&&function(e){return null!=e&&0!==e.width&&0!==e.height}(e)&&!function(e){return null!=e&&e.data instanceof Uint8Array}(e)}const Fa=os({fromPixels_:Ca});var za=Object.freeze({__proto__:null,fromPixelsAsync:async function(e,t=3){let n=null;if(j().getBool("WRAP_TO_IMAGEBITMAP")&&Ra(e)){let t;try{t=await createImageBitmap(e,{premultiplyAlpha:"none"})}catch(e){t=null}n=null!=t&&t.width===e.width&&t.height===e.height?t:e}else n=e;return Ca(n,t)},toPixels:async function(e,t){let n=rs(e,"img","toPixels");if(!(e instanceof Ar)){const e=n;n=ea(e,"int32"),e.dispose()}if(2!==n.rank&&3!==n.rank)throw new Error(`toPixels only supports rank 2 or 3 tensors, got rank ${n.rank}.`);const[r,s]=n.shape.slice(0,2),a=2===n.rank?1:n.shape[2];if(a>4||2===a)throw new Error(`toPixels only supports depth of size 1, 3 or 4 but got ${a}`);if("float32"!==n.dtype&&"int32"!==n.dtype)throw new Error(`Unsupported type for toPixels: ${n.dtype}. Please use float32 or int32 tensors.`);const o=await n.data(),i="float32"===n.dtype?255:1,u=new Uint8ClampedArray(s*r*4);for(let e=0;e<r*s;++e){const t=[0,0,0,255];for(let r=0;r<a;r++){const s=o[e*a+r];if("float32"===n.dtype){if(s<0||s>1)throw new Error(`Tensor values for a float32 Tensor must be in the range [0 - 1] but encountered ${s}.`)}else if("int32"===n.dtype&&(s<0||s>255))throw new Error(`Tensor values for a int32 Tensor must be in the range [0 - 255] but encountered ${s}.`);1===a?(t[0]=s*i,t[1]=s*i,t[2]=s*i):t[r]=s*i}const r=4*e;u[r+0]=Math.round(t[0]),u[r+1]=Math.round(t[1]),u[r+2]=Math.round(t[2]),u[r+3]=Math.round(t[3])}if(null!=t){t.width=s,t.height=r;const e=t.getContext("2d"),n=new ImageData(u,s,r);e.putImageData(n,0,0)}return n!==e&&n.dispose(),u},fromPixels:Fa});function Ba(e,t){const n=e.shape.length,r=t.shape.length;if(n<1)throw new Error(`tf.gatherND() expects the input to be rank 1 or higher, but the rank was ${n}.`);if(r<1)throw new Error(`tf.gatherND() expects the indices to be rank 1 or higher, but the rank was ${r}.`);if("int32"!==t.dtype)throw new Error(`tf.gatherND() expects the indices to be int32 type, but the dtype was ${t.dtype}.`);if(t.shape[r-1]>n)throw new Error(`index innermost dimension length must be <= tensor rank; saw: ${t.shape[r-1]} vs. ${n}`);if(0===h(e.shape))throw new Error(`Requested more than 0 entries, but input is empty. Input shape: ${e.shape}.`);const s=t.shape,a=s[s.length-1];let o=1;for(let e=0;e<s.length-1;++e)o*=s[e];const i=e.shape,u=s.slice();u.pop();let l=1;for(let e=a;e<n;++e)l*=i[e],u.push(i[e]);const c=[...D(e.shape).map((e=>e/l)),1].slice(0,a);return[u,o,l,c]}var Pa=Object.freeze({__proto__:null,prepareAndValidate:Ba});function ja(e,t,n){const r=t.rank>1?t.shape[t.rank-1]:1,s=t.rank>1?t.rank-1:1,a=`Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: ${n.shape}, indices.shape: ${t.shape}, shape: ${e}, sliceDim: ${r}, and batchDim: ${s}.`;if(n.rank<s)throw new Error(a+` update.rank < ${s}. `);if(e.length<r+(n.rank-s))throw new Error(a+` Output shape length < ${r+(n.rank-s)}`);if(n.rank!==s+e.length-r)throw new Error(a+" update.rank != "+(s+e.length-r));for(let e=0;e<s;++e)if(n.shape[e]!==t.shape[e])throw new Error(a+` updates.shape[${e}] (${n.shape[e]}) != indices.shape[${e}] (${t.shape[e]}).`);for(let t=0;t<n.rank-s;++t)if(n.shape[t+s]!==e[t+r])throw new Error(a+` updates.shape[${t+s}] (${n.shape[t+s]}) != shape[${t+s}] (${e[t+s]})`)}function Va(e,t,n){if(t.rank<1)throw new Error(`tf.scatterND() expects the indices to be rank 1 or higher, but the rank was ${t.rank}.`);if(e.rank<1)throw new Error(`tf.scatterND() expects the updates to be rank 1 or higher, but the rank was ${e.rank}.`);if("int32"!==t.dtype)throw new Error(`The dtype of 'indices' should be int32, but got dtype: ${t.dtype}`);if(n.length<1)throw new Error(`Output rank must be greater or equal to 1, but got shape: ${n}`);if(0===n.length){if(0===t.size)throw new Error(`Indices specified for empty output. indices shape: ${t.shape}`);if(0===e.size)throw new Error(`Updates specified for empty output. updates shape: ${e.shape}`)}ja(n,t,e)}function Ga(e,t,n){const r=t.shape.length,s=r>1?t.shape[r-1]:1,a=n.length;let o=1;for(let e=s;e<a;++e)o*=n[e];const i=s<1?1:s;return{sliceRank:s,numUpdates:h(t.shape)/i,sliceSize:o,strides:[...D(n.slice(0,s)),1],outputSize:h(n)}}var Wa=Object.freeze({__proto__:null,validateUpdateShape:ja,validateInput:Va,calculateShapes:Ga});
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
 */function Ua(e,t,n,r){const s=[...e];for(let e=s.length;e<r.length;e++)s.push(1);for(let e=0;e<n;e++)0===e?s[t]=1:(s.splice(t,0,1),s.pop());return s}function qa(e,t,n){return n<=e?n:n-(t-1)}function Ha(e,t){const n=[];for(let r=0;r<e;r++)n.push(t+r);return n}function Ka(e,t,n,r,s){const a=[...s],o=Ha(n,t);for(let s=0;s<a.length;s++)if(o.indexOf(s)>-1)a[s]=0;else{const o=qa(t,n,s);let i=r[o];e&1<<o&&(i=0),a[s]=i}return a}function Za(e,t,n,r,s){const a=[...s],i=Ha(n,t);for(let s=0;s<a.length;s++)if(i.indexOf(s)>-1)a[s]=Number.MAX_SAFE_INTEGER;else{const o=qa(t,n,s);let i=r[o];e&1<<o&&(i=Number.MAX_SAFE_INTEGER),a[s]=i}for(let e=0;e<a.length;e++){const t=s[e];a[e]<0&&(a[e]+=t),a[e]=o(0,a[e],s[e])}return a}function Ya(e,t,n){let r=e[t];return(n&1<<t||null==r)&&(r=1),r}function Qa(e,t,n,r,s,a){let i=t[s];const u=n[s]||1;(e&1<<s||a&1<<s||null==i)&&(i=u>0?Number.MIN_SAFE_INTEGER:Number.MAX_SAFE_INTEGER);const l=r[s];return i<0&&(i+=l),i=o(0,i,l-1),i}function Ja(e,t,n,r,s,a){let i=t[s];const u=n[s]||1;(e&1<<s||a&1<<s||null==i)&&(i=u>0?Number.MAX_SAFE_INTEGER:Number.MIN_SAFE_INTEGER);const l=r[s];return i<0&&(i+=l),i=u>0?o(0,i,l):o(-1,i,l-1),i}function Xa(e,t,n,r,s,a){if(s[t])return n>0?a[t]:a[t+1&1];{const t=e<0?r+e:e;return t<a[0]?a[0]:t>a[1]?a[1]:t}}var eo=Object.freeze({__proto__:null,assertParamsValid:function(e,t,n){const r=e.shape.length;u(r===t.length,(()=>`Error in slice${r}D: Length of begin ${t} must match the rank of the array (${r}).`)),u(r===n.length,(()=>`Error in slice${r}D: Length of size ${n} must match the rank of the array (${r}).`));for(let s=0;s<r;++s)u(t[s]+n[s]<=e.shape[s],(()=>`Error in slice${r}D: begin[${s}] + size[${s}] (${t[s]+n[s]}) would overflow input.shape[${s}] (${e.shape[s]})`))},maskToAxes:function(e){const t=[];let n=0;for(;e>0;)1&e&&t.push(n),e/=2,n++;return t},computeOutShape:function(e,t,n){const r=[];for(let s=0;s<e.length;s++)r[s]=Math.ceil((t[s]-e[s])/n[s]);return r},stridesWithElidedDims:Ua,getNormalizedAxes:function(e,t,n,r,s,a,o,i,u){const l=e.length;let c=new Array(l),p=new Array(l),h=new Array(l);if(t.length&&n>0){const u=t[0],l=n+1;c=Ka(o,u,l,r,e),p=Za(i,u,l,s,e),h=Ua(a,u,l,e)}else for(let t=0;t<l;t++)c[t]=Qa(o,r,a,e,t,u),p[t]=Ja(i,s,a,e,t,u),h[t]=Ya(a,t,u);return{begin:c,end:p,strides:h}},startIndicesWithElidedDims:Ka,stopIndicesWithElidedDims:Za,stridesForAxis:Ya,startForAxis:Qa,stopForAxis:Ja,isSliceContinous:function(e,t,n){let r=n.length;for(let e=0;e<n.length;e++)if(n[e]>1){r=e;break}for(let s=r+1;s<n.length;s++)if(t[s]>0||n[s]!==e[s])return!1;return!0},computeFlatOffset:function(e,t){let n=e.length>0?e[e.length-1]:1;for(let r=0;r<e.length-1;r++)n+=e[r]*t[r];return n},parseSliceParams:function(e,t,n){let r;const s=e.shape.length;let a;return r="number"==typeof t?[t,...new Array(s-1).fill(0)]:t.length<s?t.concat(new Array(s-t.length).fill(0)):t.slice(),r.forEach((e=>{u(-1!==e,(()=>"slice() does not support negative begin indexing."))})),a=null==n?new Array(s).fill(-1):"number"==typeof n?[n,...new Array(s-1).fill(-1)]:n.length<s?n.concat(new Array(s-n.length).fill(-1)):n,a=a.map(((t,n)=>t>=0?t:(u(-1===t,(()=>`Negative size values should be exactly -1 but got ${t} for the slice() size at index ${n}.`)),e.shape[n]-r[n]))),[r,a]},sliceInfo:function(e,t,n,r,s,a,o,i,u){let l;if(null==r?(l=new Array(t.length),l.fill(1)):l=r,null!=o&&0!=(o&o-1))throw new Error("Multiple ellipses in slice is not allowed.");let c=!1;const p={dims:l.length,numAddAxisAfterEllipsis:0,begin:t.slice(),end:n.slice(),strides:l.slice(),beginMask:s,endMask:a,ellipsisMask:o,newAxisMask:i,shrinkAxisMask:u};for(let e=0;e<p.dims;e++)c&&0!=(1<<e&i)&&p.numAddAxisAfterEllipsis++,1<<e&o&&(c=!0);c||(p.ellipsisMask|=1<<p.dims,p.dims++);const h={dims:e.length,beginMask:0,endMask:0,beginValid:!1,endValid:!1};!function(e,t){t.beginMask=0,t.endMask=0,t.shrinkAxisMask=0;let n=0;t.beginValid=null!=e.begin,t.endValid=null!=e.end,t.begin=new Array(t.dims),t.end=new Array(t.dims),t.strides=new Array(t.dims),t.finalShapeGatherIndices=[],t.finalShapeGatherIndicesSparse=[],t.inputShapeGatherIndicesSparse=new Array(t.dims);for(let r=0;r<e.dims;r++)if(1<<r&e.ellipsisMask){const s=Math.min(t.dims-(e.dims-r)+1+e.numAddAxisAfterEllipsis,t.dims);for(;n<s;n++)t.begin[n]=0,t.end[n]=0,t.strides[n]=1,t.beginMask|=1<<n,t.endMask|=1<<n,t.finalShapeGatherIndices.push(n),t.finalShapeGatherIndicesSparse.push(-1),t.inputShapeGatherIndicesSparse[n]=r}else if(1<<r&e.newAxisMask)t.finalShapeGatherIndices.push(-2),t.finalShapeGatherIndicesSparse.push(-1);else{if(n===t.begin.length)throw Error(`Index out of range using input dim ${n}; input has only ${t.dims} dims, ${t.begin.length}.`);null!=e.begin&&(t.begin[n]=e.begin[r]),null!=e.end&&(t.end[n]=e.end[r]),t.strides[n]=e.strides[r],e.beginMask&1<<r&&(t.beginMask|=1<<n),e.endMask&1<<r&&(t.endMask|=1<<n),e.shrinkAxisMask&1<<r?(t.finalShapeGatherIndices.push(-1),t.finalShapeGatherIndicesSparse.push(-1),t.shrinkAxisMask|=1<<n):(t.finalShapeGatherIndices.push(n),t.finalShapeGatherIndicesSparse.push(r)),t.inputShapeGatherIndicesSparse[n]=r,n++}}(p,h);let d=!0,m=!0,f=!0;const g=[],y=[];for(let t=0;t<e.length;++t){if(0===h.strides[t])throw Error(`strides[${t}] must be non-zero`);const n=!!(h.shrinkAxisMask&1<<t),r=e[t];if(-1===r){g.push(n?1:-1);continue}const s=[h.beginMask&1<<t,h.endMask&1<<t],a=[h.strides[t]>0?0:-1,h.strides[t]>0?r:r-1];if(n&&h.strides[t]<=0)throw Error("only stride 1 allowed on non-range indexing.");f=f&&1===h.strides[t];const o=!!(h.beginMask&1<<t&&h.endMask&1<<t);if(h.beginValid&&h.endValid){if(n){const e=h.begin[t]<0?r+h.begin[t]:h.begin[t];if(h.begin[t]=e,h.end[t]=h.begin[t]+1,e<0||e>=r)throw Error(`slice index ${h.begin[t]} of dimension ${t} out of bounds.`)}else h.begin[t]=Xa(h.begin[t],0,h.strides[t],r,s,a),h.end[t]=Xa(h.end[t],1,h.strides[t],r,s,a);const e=1===h.strides[t]&&0===h.begin[t]&&h.end[t]===r;d=d&&e,m=m&&(0===t&&1===h.strides[t]||e)}else d=d&&1===h.strides[t]&&o,m=m&&(0===t&&1===h.strides[t]||o);let i,u=!1;if(h.beginValid&&h.endValid?(i=h.end[t]-h.begin[t],u=!0):n?(i=1,u=!0):o&&r>=0&&(i=h.strides[t]<0?-r:r,u=!0),u){let e;e=0===i||i<0!=h.strides[t]<0?0:Math.trunc(i/h.strides[t])+(i%h.strides[t]!=0?1:0),g.push(e)}else g.push(-1)}for(let e=0;e<h.finalShapeGatherIndices.length;++e){const t=h.finalShapeGatherIndices[e];t>=0?y.push(g[t]):-2===t&&y.push(1)}return{finalShapeSparse:y.filter(((e,t)=>-2!==h.finalShapeGatherIndices[t])),finalShape:y,isIdentity:d,sliceDim0:m,isSimpleSlice:f,begin:h.begin,end:h.end,strides:h.strides}}});
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
 */class to{getClassName(){return this.constructor.className}static fromConfig(e,t){return new e(t)}}class no{constructor(){this.classNameMap={}}static getMap(){return null==no.instance&&(no.instance=new no),no.instance}static register(e){no.getMap().classNameMap[e.className]=[e,e.fromConfig]}}function ro(e){u(null!=e.className,(()=>"Class being registered does not have the static className property defined.")),u("string"==typeof e.className,(()=>"className is required to be a string, but got type "+typeof e.className)),u(e.className.length>0,(()=>"Class being registered has an empty-string as its className, which is disallowed.")),no.register(e)}var so=Object.freeze({__proto__:null,Serializable:to,SerializationMap:no,registerClass:ro});
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
 */function ao(){return 32===Kr.backend.floatPrecision()?.001:.1}function oo(e,t,n){let r=!0;if((v(e)||v(t))&&(r=!1),v(e)&&v(t)&&(r=!0),r){const n=e.constructor.name,r=t.constructor.name;if(n!==r)throw new Error(`Arrays are of different type. Actual: ${n}. Expected: ${r}`)}if(Array.isArray(e)&&Array.isArray(t)){const n=es(e),r=es(t);if(!d(n,r))throw new Error(`Arrays have different shapes. Actual: [${n}]. Expected: [${r}]`)}const s=v(e)?e:p(e),a=v(t)?t:p(t);if(s.length!==a.length)throw new Error(`Arrays have different lengths actual: ${s.length} vs expected: ${a.length}.\nActual:   ${s}.\nExpected: ${a}.`);for(let e=0;e<a.length;++e){const t=s[e],r=a[e];if(!n(t,r))throw new Error(`Arrays differ: actual[${e}] = ${t}, expected[${e}] = ${r}.\nActual:   ${s}.\nExpected: ${a}.`)}"undefined"!=typeof expect&&expect().nothing()}function io(e,t,n){return!isFinite(e)&&!isFinite(t)||!(isNaN(e)||isNaN(t)||Math.abs(e-t)>n)}var uo=Object.freeze({__proto__:null,TEST_EPSILON_FLOAT16:.1,expectArraysClose:function(e,t,n){return null==n&&(n=ao()),oo(e,t,((e,t)=>io(e,t,n)))},testEpsilon:ao,expectPromiseToFail:function(e,t){e().then((()=>t.fail()),(()=>t())),"undefined"!=typeof expect&&expect().nothing()},expectArraysEqual:function(e,t){const n="string"==typeof t||"number"==typeof t||"boolean"==typeof t?[t]:t;return k(e)||k(e[0])||k(t)||k(t[0])?oo(e,n,((e,t)=>e==t)):oo(e,t,((e,t)=>io(e,t,0)))},expectNumbersClose:function(e,t,n){if(null==n&&(n=ao()),!io(e,t,n))throw new Error(`Numbers differ: actual === ${e}, expected === ${t}`);"undefined"!=typeof expect&&expect().nothing()},expectValuesInRange:function(e,t,n){for(let r=0;r<e.length;r++)if(e[r]<t||e[r]>n)throw new Error(`Value out of range:${e[r]} low: ${t}, high: ${n}`)},expectArrayBuffersEqual:function(e,t){const n=new Float32Array(e),r=new Float32Array(t);if(n.length!==r.length)throw new Error(`Expected ArrayBuffer to be of length ${r.length}, but it was ${n.length}`);for(let e=0;e<r.length;e++)if(n[e]!==r[e])throw new Error(`Expected ArrayBuffer value at ${e} to be ${r[e]} but got ${n[e]} instead`)},encodeStrings:function e(t){for(let n=0;n<t.length;n++){const r=t[n];Array.isArray(r)?e(r):t[n]=gr(r)}return t},createVideoElement:function(e){const t=document.createElement("video");return"playsInline"in t&&(t.playsInline=!0),t.muted=!0,t.loop=!0,t.style.position="fixed",t.style.left="0px",t.style.top="0px",t.preload="auto",t.appendChild(e),new Promise((e=>{t.addEventListener("loadeddata",(n=>e(t))),t.load()}))},play:async function(e){await e.play(),"requestVideoFrameCallback"in e&&await new Promise((t=>{e.requestVideoFrameCallback(t)}))}});/** @license See the LICENSE file. */const lo=os({add_:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
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
function(e,t){let n=rs(e,"a","add"),r=rs(t,"b","add");[n,r]=Br(n,r);const s={a:n,b:r};return Kr.runKernel(K,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const co=os({floorDiv_:function(e,t){let n=rs(e,"a","floorDiv"),r=rs(t,"b","floorDiv");[n,r]=Br(n,r);const s={a:n,b:r};return Kr.runKernel(Be,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const po=os({div_:function(e,t){let n=rs(e,"a","div"),r=rs(t,"b","div");if([n,r]=Br(n,r),"int32"===n.dtype&&"int32"===r.dtype)return co(n,r);const s={a:n,b:r};return Kr.runKernel(De,s,{})}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ho=os({mul_:function(e,t){let n=rs(e,"a","mul"),r=rs(t,"b","mul");[n,r]=Br(n,r);const s={a:n,b:r};return Kr.runKernel(dt,s)}});
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
 */const mo=os({abs_:function(e){const t=rs(e,"x","abs");if("complex64"===t.dtype){const e={x:t};return Kr.runKernel(de,e)}{const e={x:t};return Kr.runKernel("Abs",e)}}});
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
 */const fo=os({acos_:function(e){const t={x:rs(e,"x","acos")};return Kr.runKernel(q,t)}});
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
 */const go=os({acosh_:function(e){const t={x:rs(e,"x","acosh")};return Kr.runKernel(H,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const yo=os({addN_:function(e){u(Array.isArray(e),(()=>"The argument passed to tf.addN() must be a list of tensors")),u(e.length>=1,(()=>`Must pass at least one tensor to tf.addN(), but got ${e.length}`));const t=e.map(((e,t)=>rs(e,`tensors${t}`,"addN"))),n=t[0];t.forEach((e=>{if(e.dtype!==n.dtype)throw new Error("All tensors passed to tf.addN() must have the same dtype")})),t.forEach((e=>{if(!d(e.shape,n.shape))throw new Error("All tensors passed to tf.addN() must have the same shape")}));const r=t;return Kr.runKernel(Z,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const bo=os({all_:function(e,t=null,n=!1){const r={x:rs(e,"x","all","bool")},s={axis:t,keepDims:n};return Kr.runKernel("All",r,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const wo=os({any_:function(e,t=null,n=!1){const r={x:rs(e,"x","any","bool")},s={axis:t,keepDims:n};return Kr.runKernel("Any",r,s)}});
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
 */const xo=os({argMax_:function(e,t=0){const n={x:rs(e,"x","argMax")},r={axis:t};return Kr.runKernel(Y,n,r)}});
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
 */const No=os({argMin_:function(e,t=0){const n={x:rs(e,"x","argMin")},r={axis:t};return Kr.runKernel(Q,n,r)}});
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
 */const vo=os({asin_:function(e){const t={x:rs(e,"x","asin")};return Kr.runKernel(J,t)}});
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
 */const So=os({asinh_:function(e){const t={x:rs(e,"x","asinh")};return Kr.runKernel(X,t)}});
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
 */const To=os({atan_:function(e){const t={x:rs(e,"x","atan")};return Kr.runKernel(ee,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ko=os({atan2_:function(e,t){let n=rs(e,"a","atan2"),r=rs(t,"b","atan2");[n,r]=Br(n,r);const s={a:n,b:r};return Kr.runKernel(ne,s)}});
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
 */const Eo=os({atanh_:function(e){const t={x:rs(e,"x","atanh")};return Kr.runKernel(te,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _o(e,t,n,r,s,a,o="channelsLast"){const[i,u]=Do(t);let l;if("channelsLast"===o)l=[i,u,e[3],e[3]];else{if("channelsFirst"!==o)throw new Error(`Unknown dataFormat ${o}`);l=[i,u,e[1],e[1]]}return Mo(e,l,n,r,s,a,!1,o)}function Mo(e,t,n,r,s,a,o=!1,i="channelsLast"){let[u,l,c,p]=[-1,-1,-1,-1];if("channelsLast"===i)[u,l,c,p]=e;else{if("channelsFirst"!==i)throw new Error(`Unknown dataFormat ${i}`);[u,p,l,c]=e}const[h,d,,m]=t,[f,g]=Do(n),[y,b]=Do(r),w=Oo(h,y),x=Oo(d,b),{padInfo:N,outHeight:v,outWidth:S}=function(e,t,n,r,s,a,o,i,u){let l,c,p;if("number"==typeof e){l={top:e,bottom:e,left:e,right:e,type:0===e?"VALID":"NUMBER"};const s=function(e,t,n,r,s){null==r&&(r=Ao(e,t,n));const a=e[0],o=e[1],i=Lo((a-t+2*r)/n+1,s),u=Lo((o-t+2*r)/n+1,s);return[i,u]}([t,n],a,r,e,i);c=s[0],p=s[1]}else if("same"===e){c=Math.ceil(t/r),p=Math.ceil(n/s);const e=Math.max(0,(c-1)*r+a-t),i=Math.max(0,(p-1)*s+o-n),u=Math.floor(e/2),h=e-u,d=Math.floor(i/2);l={top:u,bottom:h,left:d,right:i-d,type:"SAME"}}else if("valid"===e)l={top:0,bottom:0,left:0,right:0,type:"VALID"},c=Math.ceil((t-a+1)/r),p=Math.ceil((n-o+1)/s);else{if("object"!=typeof e)throw Error(`Unknown padding parameter: ${e}`);{const h="channelsLast"===u?e[1][0]:e[2][0],d="channelsLast"===u?e[1][1]:e[2][1],m="channelsLast"===u?e[2][0]:e[3][0],f="channelsLast"===u?e[2][1]:e[3][1];l={top:h,bottom:d,left:m,right:f,type:0===h&&0===d&&0===m&&0===f?"VALID":"EXPLICIT"},c=Lo((t-a+h+d)/r+1,i),p=Lo((n-o+m+f)/s+1,i)}}return{padInfo:l,outHeight:c,outWidth:p}}(s,l,c,f,g,w,x,a,i),T=o?m*p:m;let k;return"channelsFirst"===i?k=[u,T,v,S]:"channelsLast"===i&&(k=[u,v,S,T]),{batchSize:u,dataFormat:i,inHeight:l,inWidth:c,inChannels:p,outHeight:v,outWidth:S,outChannels:T,padInfo:N,strideHeight:f,strideWidth:g,filterHeight:h,filterWidth:d,effectiveFilterHeight:w,effectiveFilterWidth:x,dilationHeight:y,dilationWidth:b,inShape:e,outShape:k,filterShape:t}}function Io(e,t,n,r,s,a=!1,o="channelsLast",i){let[u,l,c,p,h]=[-1,-1,-1,-1,-1];if("channelsLast"===o)[u,l,c,p,h]=e;else{if("channelsFirst"!==o)throw new Error(`Unknown dataFormat ${o}`);[u,h,l,c,p]=e}const[d,m,f,,g]=t,[y,b,w]=$o(n),[x,N,v]=$o(r),S=Oo(d,x),T=Oo(m,N),k=Oo(f,v),{padInfo:E,outDepth:_,outHeight:M,outWidth:I}=function(e,t,n,r,s,a,o,i,u,l,c){let p,h,d,m;if("number"==typeof e){p={top:e,bottom:e,left:e,right:e,front:e,back:e,type:0===e?"VALID":"NUMBER"};const a=function(e,t,n,r,s,a){null==s&&(s=Ao(e,t,r));const o=e[0],i=e[1],u=e[2],l=Lo((o-t+2*s)/r+1,a),c=Lo((i-t+2*s)/r+1,a),p=Lo((u-t+2*s)/r+1,a);return[l,c,p,n]}([t,n,r,1],i,1,s,e,c);h=a[0],d=a[1],m=a[2]}else if("same"===e){h=Math.ceil(t/s),d=Math.ceil(n/a),m=Math.ceil(r/o);const e=(h-1)*s+i-t,c=(d-1)*a+u-n,f=(m-1)*o+l-r,g=Math.floor(e/2),y=e-g,b=Math.floor(c/2),w=c-b,x=Math.floor(f/2);p={top:b,bottom:w,left:x,right:f-x,front:g,back:y,type:"SAME"}}else{if("valid"!==e)throw Error(`Unknown padding parameter: ${e}`);p={top:0,bottom:0,left:0,right:0,front:0,back:0,type:"VALID"},h=Math.ceil((t-i+1)/s),d=Math.ceil((n-u+1)/a),m=Math.ceil((r-l+1)/o)}return{padInfo:p,outDepth:h,outHeight:d,outWidth:m}}(s,l,c,p,y,b,w,S,T,k,i),A=a?g*h:g;let D;return"channelsFirst"===o?D=[u,A,_,M,I]:"channelsLast"===o&&(D=[u,_,M,I,A]),{batchSize:u,dataFormat:o,inDepth:l,inHeight:c,inWidth:p,inChannels:h,outDepth:_,outHeight:M,outWidth:I,outChannels:A,padInfo:E,strideDepth:y,strideHeight:b,strideWidth:w,filterDepth:d,filterHeight:m,filterWidth:f,effectiveFilterDepth:S,effectiveFilterHeight:T,effectiveFilterWidth:k,dilationDepth:x,dilationHeight:N,dilationWidth:v,inShape:e,outShape:D,filterShape:t}}function Ao(e,t,n,r=1){const s=Oo(t,r);return Math.floor((e[0]*(n-1)-n+s)/2)}function Do(e){return"number"==typeof e?[e,e,e]:2===e.length?[e[0],e[1],1]:e}function $o(e){return"number"==typeof e?[e,e,e]:e}function Oo(e,t){return t<=1?e:e+(e-1)*(t-1)}function Lo(e,t){if(!t)return Math.trunc(e);switch(t){case"round":return Math.round(e);case"ceil":return Math.ceil(e);case"floor":return Math.floor(e);default:throw new Error(`Unknown roundingMode ${t}`)}}function Co(e){const[t,n,r]=Do(e);return 1===t&&1===n&&1===r}function Ro(e,t){return Co(e)||Co(t)}function Fo(e){if("NHWC"===e)return"channelsLast";if("NCHW"===e)return"channelsFirst";throw new Error(`Unknown dataFormat ${e}`)}function zo(e,t,n){if(null!=n){if("string"==typeof t)throw Error(`Error in ${e}: pad must be an integer when using dimRoundingMode ${n} but got pad ${t}.`);if("number"==typeof t)u(m(t),(()=>`Error in ${e}: pad must be an integer when using dimRoundingMode ${n} but got pad ${t}.`));else{if("object"!=typeof t)throw Error(`Error in ${e}: Unknown padding parameter: ${t}`);t.forEach((t=>{t.forEach((t=>{u(m(t),(()=>`Error in ${e}: pad must be an integer when using dimRoundingMode ${n} but got pad ${t}.`))}))}))}}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Bo=os({reshape_:function(e,t){const n={x:rs(e,"x","reshape","string_or_numeric")},r={shape:t};return Kr.runKernel(At,n,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Po=os({avgPool_:function(e,t,n,r,s){const a=rs(e,"x","avgPool","float32");u(Ro(n,1),(()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${n} and dilations '1'`));let o=a,i=!1;3===a.rank&&(i=!0,o=Bo(a,[1,a.shape[0],a.shape[1],a.shape[2]])),u(4===o.rank,(()=>`Error in avgPool: x must be rank 4 but got rank ${o.rank}.`)),zo("avgPool",r,s);const l={x:o},c={filterSize:t,strides:n,pad:r,dimRoundingMode:s};let p=Kr.runKernel(re,l,c);return p=ea(p,a.dtype),i?Bo(p,[p.shape[1],p.shape[2],p.shape[3]]):p}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const jo=os({avgPool3d_:function(e,t,n,r,s,a="NDHWC"){const o=rs(e,"x","avgPool3d","float32");let i=o,l=!1;4===o.rank&&(l=!0,i=Bo(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),u(5===i.rank,(()=>`Error in avgPool3d: x must be rank 5 but got rank ${i.rank}.`)),u("NDHWC"===a,(()=>`Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of ${a}`)),zo("avgPool3d",r,s);const c={x:i},p={filterSize:t,strides:n,pad:r,dimRoundingMode:s,dataFormat:a};let h=Kr.runKernel(se,c,p);return h=ea(h,i.dtype),l?Bo(h,[h.shape[1],h.shape[2],h.shape[3],h.shape[4]]):h}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Vo=os({concat_:function(e,t=0){u(e.length>=1,(()=>"Pass at least one tensor to concat"));const n=ss(e,"tensors","concat","string_or_numeric");if("complex64"===n[0].dtype&&n.forEach((e=>{if("complex64"!==e.dtype)throw new Error(`Cannot concatenate complex64 tensors with a tensor\n          with dtype ${e.dtype}. `)})),1===n.length)return ta(n[0]);const r=n,s={axis:t};return Kr.runKernel(me,r,s)}});
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
 */const Go=os({sigmoid_:function(e){const t={x:rs(e,"x","sigmoid","float32")};return Kr.runKernel(Wt,t)}});
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
 */const Wo=os({slice_:function(e,t,n){const r=rs(e,"x","slice","string_or_numeric");if(0===r.rank)throw new Error("Slicing scalar is not possible");const s={x:r},a={begin:t,size:n};return Kr.runKernel(jt,s,a)}});
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
 */const Uo=os({tanh_:function(e){const t={x:rs(e,"x","tanh","float32")};return Kr.runKernel(on,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const qo=os({basicLSTMCell_:function(e,t,n,r,s,a){const o=rs(e,"forgetBias","basicLSTMCell"),i=rs(t,"lstmKernel","basicLSTMCell"),u=rs(n,"lstmBias","basicLSTMCell"),l=rs(r,"data","basicLSTMCell"),c=rs(s,"c","basicLSTMCell"),p=rs(a,"h","basicLSTMCell"),h=Vo([l,p],1),d=ba(h,i),m=lo(d,u),f=m.shape[0],g=m.shape[1]/4,y=[f,g],b=Wo(m,[0,0],y),w=Wo(m,[0,g],y),x=Wo(m,[0,2*g],y),N=Wo(m,[0,3*g],y),v=lo(ho(Go(b),Uo(w)),ho(c,Go(lo(o,x))));return[v,ho(Uo(v),Go(N))]}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ho=os({batchToSpaceND_:function(e,t,n){const r=rs(e,"x","batchToSpaceND"),s=t.reduce(((e,t)=>e*t));u(r.rank>=1+t.length,(()=>`input rank is ${r.rank} but should be > than blockShape.length ${t.length}`)),u(n.length===t.length,(()=>`crops.length is ${n.length} but should be equal to blockShape.length  ${t.length}`)),u(r.shape[0]%s==0,(()=>`input tensor batch is ${r.shape[0]} but is not divisible by the product of the elements of blockShape ${t.join(" * ")} === ${s}`));const a={x:r},o={blockShape:t,crops:n};return Kr.runKernel(oe,a,o)}});const Ko=os({batchNorm_:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
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
function(e,t,n,r,s,a){null==a&&(a=.001);const o=rs(e,"x","batchNorm"),i=rs(t,"mean","batchNorm"),l=rs(n,"variance","batchNorm");let c,p;null!=s&&(c=rs(s,"scale","batchNorm")),null!=r&&(p=rs(r,"offset","batchNorm")),u(i.rank===l.rank,(()=>"Batch normalization gradient requires mean and variance to have equal ranks.")),u(null==p||i.rank===p.rank,(()=>"Batch normalization gradient requires mean and offset to have equal ranks.")),u(null==c||i.rank===c.rank,(()=>"Batch normalization gradient requires mean and scale to have equal ranks."));const h={x:function(e){let t;return t=0===e.rank||1===e.rank?Bo(e,[1,1,1,e.size]):2===e.rank?Bo(e,[1,1,e.shape[0],e.shape[1]]):3===e.rank?Bo(e,[1,e.shape[0],e.shape[1],e.shape[2]]):e,t}(o),scale:c,offset:p,mean:i,variance:l},d={varianceEpsilon:a},m=Kr.runKernel(Pe,h,d);return Bo(m,o.shape)}});const Zo=os({batchNorm2d_:function(e,t,n,r,s,a){const o=rs(e,"x","batchNorm"),i=rs(t,"mean","batchNorm"),l=rs(n,"variance","batchNorm");let c,p;return null!=s&&(c=rs(s,"scale","batchNorm")),null!=r&&(p=rs(r,"offset","batchNorm")),u(2===o.rank,(()=>`Error in batchNorm2D: x must be rank 2 but got rank ${o.rank}.`)),u(2===i.rank||1===i.rank,(()=>`Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank ${i.rank}.`)),u(2===l.rank||1===l.rank,(()=>`Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank ${l.rank}.`)),null!=c&&u(2===c.rank||1===c.rank,(()=>`Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank ${c.rank}.`)),null!=p&&u(2===p.rank||1===p.rank,(()=>`Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank ${p.rank}.`)),Ko(o,i,l,p,c,a)}});const Yo=os({batchNorm3d_:function(e,t,n,r,s,a){const o=rs(e,"x","batchNorm"),i=rs(t,"mean","batchNorm"),l=rs(n,"variance","batchNorm");let c,p;return null!=s&&(c=rs(s,"scale","batchNorm")),null!=r&&(p=rs(r,"offset","batchNorm")),u(3===o.rank,(()=>`Error in batchNorm3D: x must be rank 3 but got rank ${o.rank}.`)),u(3===i.rank||1===i.rank,(()=>`Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank ${i.rank}.`)),u(3===l.rank||1===l.rank,(()=>`Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank ${l.rank}.`)),null!=c&&u(3===c.rank||1===c.rank,(()=>`Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank ${c.rank}.`)),null!=p&&u(3===p.rank||1===p.rank,(()=>`Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank ${p.rank}.`)),Ko(o,i,l,p,c,a)}});const Qo=os({batchNorm4d_:function(e,t,n,r,s,a){const o=rs(e,"x","batchNorm"),i=rs(t,"mean","batchNorm"),l=rs(n,"variance","batchNorm");let c,p;return null!=s&&(c=rs(s,"scale","batchNorm")),null!=r&&(p=rs(r,"offset","batchNorm")),u(4===o.rank,(()=>`Error in batchNorm4D: x must be rank 4 but got rank ${o.rank}.`)),u(4===i.rank||1===i.rank,(()=>`Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank ${i.rank}.`)),u(4===l.rank||1===l.rank,(()=>`Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank ${l.rank}.`)),null!=c&&u(4===c.rank||1===c.rank,(()=>`Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank ${c.rank}.`)),null!=p&&u(4===p.rank||1===p.rank,(()=>`Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank ${p.rank}.`)),Ko(o,i,l,p,c,a)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Jo=os({bincount_:function(e,t,n){const r=rs(e,"x","bincount"),s=rs(t,"weights","bincount");u("int32"===r.dtype,(()=>`Error in bincount: input dtype must be int32, but got ${r.dtype}`)),u(n>=0,(()=>`size must be non-negative, but got ${n}.`)),u(s.size===r.size||0===s.size,(()=>`Error in bincount: weights must have the same size as input or0-length, but got input shape: ${r.shape}, weights shape: ${s.shape}.`));const a={x:r,weights:s},o={size:n};return Kr.runKernel(ie,a,o)}});
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
 */const Xo=os({broadcastArgs_:function(e,t){const n=rs(e,"s0","broadcastArgs","int32"),r=rs(t,"s1","broadcastArgs","int32");if(1!==n.rank)throw new Error(`broadcastArgs(): first input must be a vector (rank=1). Has rank ${n.rank}`);if(1!==r.rank)throw new Error(`broadcastArgs(): second input must be a vector (rank=1). Has rank ${r.rank}`);const s={s0:n,s1:r};return Kr.runKernel(ue,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ei=os({broadcastTo_:function(e,t){let n=rs(e,"broadcastTo","x");const r=n.shape;if(t.some((e=>!(e>0)||e%1!=0)))throw new Error(`broadcastTo(): Invalid broadcast shape [${t}].`);if(t.length<n.rank)throw new Error(`broadcastTo(): shape.length=${t.length} < input.rank=${n.rank}.`);if(t.length>n.rank){const e=n.shape.slice();for(;e.length<t.length;)e.unshift(1);n=Bo(n,e)}const s=n.shape,a=Array.from(t);for(let e=t.length-1;e>=0;e--)if(s[e]===t[e])a[e]=1;else if(1!==n.shape[e])throw new Error(`broadcastTo(): [${r}] cannot be broadcast to [${t}].`);if(0===a.map(((e,t)=>e>1?t:-1)).filter((e=>e>=0)).length)return ta(n);const o={x:n},i={reps:a};return Kr.runKernel(un,o,i)}});
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
 */const ti=os({ceil_:function(e){const t={x:rs(e,"x","ceil","float32")};return Kr.runKernel(ce,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ni(e,t,n){const r={shape:e,value:t,dtype:n};return Kr.runKernel(Re,{},r)}
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
 */const ri=os({clipByValue_:function(e,t,n){const r=rs(e,"x","clipByValue");if(u(t<=n,(()=>`Error in clip: min (${t}) must be less than or equal to max (${n}).`)),t===n)return ni(r.shape,t,r.dtype);const s={x:r},a={clipValueMin:t,clipValueMax:n};return Kr.runKernel(pe,s,a)}});const si=os({concat1d_:function(e){return Vo(e,0)}});const ai=os({concat2d_:function(e,t){return Vo(e,t)}});const oi=os({concat3d_:function(e,t){return Vo(e,t)}});const ii=os({concat4d_:function(e,t){return Vo(e,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ui=os({conv2d_:function(e,t,n,r,s="NHWC",a=[1,1],o){const i=rs(e,"x","conv2d","float32"),l=rs(t,"filter","conv2d","float32");let c=i,p=!1;3===i.rank&&(p=!0,c=Bo(i,[1,i.shape[0],i.shape[1],i.shape[2]])),u(4===c.rank,(()=>`Error in conv2d: input must be rank 4, but got rank ${c.rank}.`)),u(4===l.rank,(()=>`Error in conv2d: filter must be rank 4, but got rank ${l.rank}.`)),zo("conv2d",r,o);const h="NHWC"===s?c.shape[3]:c.shape[1];u(h===l.shape[2],(()=>`Error in conv2d: depth of input (${h}) must match input depth for filter ${l.shape[2]}.`)),u(Ro(n,a),(()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`));const d={x:c,filter:l},m={strides:n,pad:r,dataFormat:s,dilations:a,dimRoundingMode:o},f=Kr.runKernel(fe,d,m);return p?Bo(f,[f.shape[1],f.shape[2],f.shape[3]]):f}});const li=os({conv1d_:function(e,t,n,r,s="NWC",a=1,o){const i=rs(e,"x","conv1d"),l=rs(t,"filter","conv1d");let c=i,p=!1;2===i.rank&&(p=!0,c=Bo(i,[1,i.shape[0],i.shape[1]])),u(3===c.rank,(()=>`Error in conv1d: input must be rank 3, but got rank ${c.rank}.`)),u(3===l.rank,(()=>`Error in conv1d: filter must be rank 3, but got rank ${l.rank}.`)),zo("conv1d",r,o),u(c.shape[2]===l.shape[1],(()=>`Error in conv1d: depth of input (${c.shape[2]}) must match input depth for filter ${l.shape[1]}.`)),u(Ro(n,a),(()=>`Error in conv1D: Either stride or dilation must be 1. Got stride ${n} and dilation '${a}'`)),u("NWC"===s,(()=>`Error in conv1d: got dataFormat of ${s} but only NWC is currently supported.`));const h=Bo(l,[1,l.shape[0],l.shape[1],l.shape[2]]),d=Bo(c,[c.shape[0],1,c.shape[1],c.shape[2]]),m=ui(d,h,[1,n],r,"NHWC",[1,a],o);return Bo(m,p?[m.shape[2],m.shape[3]]:[m.shape[0],m.shape[2],m.shape[3]])}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ci=os({conv2DBackpropInput_:function(e,t,n,r,s,a="NHWC",o){u(e.length===t.rank,(()=>`Length of inShape (${e.length}) and rank of dy (${t.rank}) must match`));let i=e,l=t,c=!1;3===t.rank&&(c=!0,l=Bo(t,[1,t.shape[0],t.shape[1],t.shape[2]]),i=[1,e[0],e[1],e[2]]),u(4===i.length,(()=>`Error in conv2dDerInput: inShape must be length 4, but got length ${i.length}.`)),u(4===l.rank,(()=>`Error in conv2dDerInput: dy must be rank 4, but got rank ${l.rank}`)),u(4===n.rank,(()=>`Error in conv2dDerInput: filter must be rank 4, but got rank ${n.rank}`));const p="NHWC"===a?i[3]:i[1],h="NHWC"===a?l.shape[3]:l.shape[1];u(p===n.shape[2],(()=>`Error in conv2dDerInput: depth of input (${p}) must match input depth for filter ${n.shape[2]}.`)),u(h===n.shape[3],(()=>`Error in conv2dDerInput: depth of output (${h}) must match output depth for filter ${n.shape[3]}.`)),zo("conv2dDerInput",s,o);const d={dy:l,filter:n},m={strides:r,pad:s,dataFormat:a,dimRoundingMode:o,inputShape:i},f=Kr.runKernel(ye,d,m);return c?Bo(f,[f.shape[1],f.shape[2],f.shape[3]]):f}});const pi=os({conv2dTranspose_:function(e,t,n,r,s,a){const o=rs(e,"x","conv2dTranspose"),i=rs(t,"filter","conv2dTranspose");return ci(n,o,i,r,s,"NHWC",a)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const hi=os({conv3d_:function(e,t,n,r,s="NDHWC",a=[1,1,1]){const o=rs(e,"x","conv3d"),i=rs(t,"filter","conv3d");let l=o,c=!1;4===o.rank&&(c=!0,l=Bo(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),u(5===l.rank,(()=>`Error in conv3d: input must be rank 5, but got rank ${l.rank}.`)),u(5===i.rank,(()=>`Error in conv3d: filter must be rank 5, but got rank ${i.rank}.`)),u(l.shape[4]===i.shape[3],(()=>`Error in conv3d: depth of input (${l.shape[4]}) must match input depth for filter ${i.shape[3]}.`)),u(Ro(n,a),(()=>`Error in conv3D: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`)),u("NDHWC"===s,(()=>`Error in conv3d: got dataFormat of ${s} but only NDHWC is currently supported.`));const p={x:l,filter:i},h={strides:n,pad:r,dataFormat:s,dilations:a},d=Kr.runKernel(be,p,h);return c?Bo(d,[d.shape[1],d.shape[2],d.shape[3],d.shape[4]]):d}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const di=os({conv3DBackpropInput_:function(e,t,n,r,s){u(e.length===t.rank,(()=>`Length of inShape (${e.length}) and rank of dy (${t.rank}) must match`));let a=e,o=t,i=!1;4===t.rank&&(i=!0,o=Bo(t,[1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]]),a=[1,e[0],e[1],e[2],e[3]]);const l=a[4],c=o.shape[4];u(5===a.length,(()=>`Error in conv3dDerInput: inShape must be length 5, but got length ${a.length}.`)),u(5===o.rank,(()=>`Error in conv3dDerInput: dy must be rank 5, but got rank ${o.rank}`)),u(5===n.rank,(()=>`Error in conv3dDerInput: filter must be rank 5, but got rank ${n.rank}`)),u(l===n.shape[3],(()=>`Error in conv3dDerInput: depth of input (${l}) must match input depth for filter ${n.shape[3]}.`)),u(c===n.shape[4],(()=>`Error in conv3dDerInput: depth of output (${c}) must match output depth for filter ${n.shape[4]}.`));const p={dy:o,filter:n},h={pad:s,strides:r,inputShape:a},d=Kr.runKernel(we,p,h);return i?Bo(d,[d.shape[1],d.shape[2],d.shape[3],d.shape[4]]):d}});const mi=os({conv3dTranspose_:function(e,t,n,r,s){const a=rs(e,"x","conv3dTranspose"),o=rs(t,"filter","conv3dTranspose");return di(n,a,o,r,s)}});
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
 */const fi=os({cos_:function(e){const t={x:rs(e,"x","cos","float32")};return Kr.runKernel("Cos",t)}});
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
 */const gi=os({cosh_:function(e){const t={x:rs(e,"x","cosh","float32")};return Kr.runKernel(xe,t)}});
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
 */const yi=os({cumprod_:function(e,t=0,n=!1,r=!1){const s={x:rs(e,"x","cumprod")},a={axis:t,exclusive:n,reverse:r};return Kr.runKernel(Ne,s,a)}});
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
 */const bi=os({cumsum_:function(e,t=0,n=!1,r=!1){const s={x:rs(e,"x","cumsum")},a={axis:t,exclusive:n,reverse:r};return Kr.runKernel(ve,s,a)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const wi=os({denseBincount_:function(e,t,n,r=!1){const s=rs(e,"x","denseBincount"),a=rs(t,"weights","denseBincount");u("int32"===s.dtype,(()=>`Error in denseBincount: input dtype must be int32, but got ${s.dtype}`)),u(s.rank<=2,(()=>`Error in denseBincount: input must be at most rank 2, but got rank ${s.rank}.`)),u(n>=0,(()=>`size must be non-negative, but got ${n}.`)),u(a.size===s.size||0===a.size,(()=>`Error in denseBincount: weights must have the same shape as x or 0-length, but got x shape: ${s.shape}, weights shape: ${a.shape}.`));const o={x:s,weights:a},i={size:n,binaryOutput:r};return Kr.runKernel(Te,o,i)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const xi=os({depthToSpace_:function(e,t,n="NHWC"){const r=rs(e,"x","depthToSpace","float32"),s="NHWC"===n?r.shape[1]:r.shape[2],a="NHWC"===n?r.shape[2]:r.shape[3],o="NHWC"===n?r.shape[3]:r.shape[1];u(t>1,(()=>`blockSize should be > 1 for depthToSpace, but was: ${t}`)),u(s*t>=0,(()=>`Negative dimension size caused by overflow when multiplying\n    ${s} and ${t}  for depthToSpace with input shape\n    ${r.shape}`)),u(a*t>=0,(()=>`Negative dimension size caused by overflow when multiplying\n    ${a} and ${t} for depthToSpace with input shape\n        ${r.shape}`)),u(o%(t*t)==0,(()=>`Dimension size must be evenly divisible by ${t*t} but is ${o} for depthToSpace with input shape ${r.shape}`));const i={x:r},l={blockSize:t,dataFormat:n};return Kr.runKernel(ke,i,l)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ni=os({depthwiseConv2d_:function(e,t,n,r,s="NHWC",a=[1,1],o){const i=rs(e,"x","depthwiseConv2d","float32"),l=rs(t,"filter","depthwiseConv2d","float32");let c=i,p=!1;3===i.rank&&(p=!0,c=Bo(i,[1,i.shape[0],i.shape[1],i.shape[2]])),u(4===c.rank,(()=>`Error in depthwiseConv2d: input must be rank 4, but got rank ${c.rank}.`)),u(4===l.rank,(()=>`Error in depthwiseConv2d: filter must be rank 4, but got rank ${l.rank}.`));const h="NHWC"===s?c.shape[3]:c.shape[1];u(h===l.shape[2],(()=>`Error in depthwiseConv2d: number of input channels (${h}) must match the inChannels dimension in filter ${l.shape[2]}.`)),zo("depthwiseConv2d",r,o);const d={x:c,filter:l},m={strides:n,pad:r,dataFormat:s,dilations:a,dimRoundingMode:o},f=Kr.runKernel(Ee,d,m);return p?Bo(f,[f.shape[1],f.shape[2],f.shape[3]]):f}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const vi=os({diag_:function(e){const t={x:rs(e,"x","diag")};return Kr.runKernel(Ie,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Si=os({dilation2d_:function(e,t,n,r,s=[1,1],a="NHWC"){const o=rs(e,"x","dilation2d"),i=rs(t,"filter","dilation2d");u(3===o.rank||4===o.rank,(()=>`Error in dilation2d: input must be rank 3 or 4, but got rank ${o.rank}.`)),u(3===i.rank,(()=>`Error in dilation2d: filter must be rank 3, but got rank ${i.rank}.`)),u("NHWC"===a,(()=>`Error in dilation2d: Only NHWC is currently supported, but got dataFormat of ${a}`));let l=o,c=!1;3===o.rank&&(l=Bo(o,[1,o.shape[0],o.shape[1],o.shape[2]]),c=!0);const p={x:l,filter:i},h={strides:n,pad:r,dilations:s},d=Kr.runKernel(Ae,p,h);return c?Bo(d,[d.shape[1],d.shape[2],d.shape[3]]):d}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ti=os({equal_:function(e,t){let n=rs(e,"a","equal","string_or_numeric"),r=rs(t,"b","equal","string_or_numeric");[n,r]=Br(n,r),Da(n.shape,r.shape);const s={a:n,b:r};return Kr.runKernel(Oe,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ki=os({where_:function(e,t,n){const r=rs(t,"a","where"),s=rs(n,"b","where"),a=rs(e,"condition","where","bool"),o=Da(Da(a.shape,r.shape),s.shape),i={condition:ei(a,o),t:ei(r,o),e:ei(s,o)};return Kr.runKernel(Bt,i)}});
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
 */const Ei=os({zerosLike_:function(e){const t={x:rs(e,"x","zerosLike")};return Kr.runKernel(fn,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const _i=os({divNoNan_:function(e,t){let n=rs(e,"a","div"),r=rs(t,"b","div");[n,r]=Br(n,r);const s=po(n,r),a=Ei(s),o=Ti(r,a);return ki(o,a,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Mi=os({dot_:function(e,t){const n=rs(e,"t1","dot"),r=rs(t,"t2","dot");u(!(1!==n.rank&&2!==n.rank||1!==r.rank&&2!==r.rank),(()=>`Error in dot: inputs must all be rank 1 or 2, but got ranks ${n.rank} and ${r.rank}.`));const s=1===n.rank?n.size:n.shape[1],a=1===r.rank?r.size:r.shape[0];if(u(s===a,(()=>`Error in dot: inner dimensions of inputs must match, but got ${s} and ${a}.`)),1===n.rank&&1===r.rank){const e=Bo(n,[1,-1]),t=Bo(r,[-1,1]),s=ba(e,t);return Bo(s,[])}if(1===n.rank&&2===r.rank){const e=Bo(n,[1,-1]),t=Bo(r,[r.shape[0],r.shape[1]]),s=ba(e,t);return Bo(s,[s.size])}if(2===n.rank&&1===r.rank){const e=Bo(r,[-1,1]),t=ba(n,e);return Bo(t,[t.size])}{const e=Bo(r,[r.shape[0],r.shape[1]]);return ba(n,e)}}});
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
 */const Ii=os({einsum_:function(e,...t){const n=t.map(((e,t)=>rs(e,`tensors${t}`,"einsum"))),r={equation:e};return Kr.runKernel($e,n,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ai=os({elu_:function(e){const t={x:rs(e,"x","elu","float32")};return Kr.runKernel("Elu",t)}});
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
 */const Di=os({erf_:function(e){let t=rs(e,"x","erf");u("int32"===t.dtype||"float32"===t.dtype,(()=>"Input dtype must be `int32` or `float32`.")),"int32"===t.dtype&&(t=ea(t,"float32"));const n={x:t};return Kr.runKernel("Erf",n)}});
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
 */function $i(e,t){for(let n=0;n<e.length;++n)if(e[e.length-n-1]!==t-1-n)return!1;return!0}function Oi(e,t,n){const r=e.length+t.length,s=[];let a=0,o=0;for(let i=0;i<r;i++)-1===n.indexOf(i)?s.push(e[a++]):s.push(t[o++]);return s}function Li(e,t){return Oi(e,t.map((e=>1)),t)}const Ci=os({max_:
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
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
function(e,t=null,n=!1){const r={x:rs(e,"x","max")},s={reductionIndices:t,keepDims:n};return Kr.runKernel("Max",r,s)}});
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
 */const Ri=os({min_:function(e,t=null,n=!1){const r={x:rs(e,"x","min")},s={axis:t,keepDims:n};return Kr.runKernel("Min",r,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Fi=os({pow_:function(e,t){let n=rs(e,"base","pow"),r=rs(t,"exp","pow");[n,r]=Br(n,r);const s={a:n,b:r};return Kr.runKernel("Pow",s)}});
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
 */function zi(e,t){if((v(e)&&"string"!==t||Array.isArray(e))&&"complex64"!==t)throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if("string"===t&&v(e)&&!(e instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return us(e,[],[],t)}
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
 */const Bi=os({sqrt_:function(e){const t={x:rs(e,"x","sqrt","float32")};return Kr.runKernel(qt,t)}});
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
 */const Pi=os({square_:function(e){const t=rs(e,"x","square");return Kr.runKernel("Square",{x:t},{})}});
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
 */const ji=os({sum_:function(e,t=null,n=!1){let r=rs(e,"x","sum");"bool"===r.dtype&&(r=ea(r,"int32"));const s={x:r},a={axis:t,keepDims:n};return Kr.runKernel("Sum",s,a)}});
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
 */function Vi(e,t,n=null){if(0===e.rank)return mo(e);if(1!==e.rank&&null===n)return Vi(Bo(e,[-1]),t,n);if(1===e.rank||"number"==typeof n||Array.isArray(n)&&1===n.length){if(1===t)return ji(mo(e),n);if(t===1/0)return Ci(mo(e),n);if(t===-1/0)return Ri(mo(e),n);if("euclidean"===t||2===t)return Bi(ji(Fi(mo(e),zi(2,"int32")),n));throw new Error(`Error in norm: invalid ord value: ${t}`)}if(Array.isArray(n)&&2===n.length){if(1===t)return Ci(ji(mo(e),n[0]),n[1]-1);if(t===1/0)return Ci(ji(mo(e),n[1]),n[0]);if(t===-1/0)return Ri(ji(mo(e),n[1]),n[0]);if("fro"===t||"euclidean"===t)return Bi(ji(Pi(e),n));throw new Error(`Error in norm: invalid ord value: ${t}`)}throw new Error(`Error in norm: invalid axis: ${n}`)}const Gi=os({norm_:function(e,t="euclidean",n=null,r=!1){const s=Vi(e=rs(e,"x","norm"),t,n);let a=s.shape;if(r){const t=g(n,e.shape);a=Li(s.shape,t)}return Bo(s,a)}});
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
 */const Wi=os({euclideanNorm_:function(e,t=null,n=!1){return Gi(e,"euclidean",t,n)}});
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
 */const Ui=os({exp_:function(e){const t={x:rs(e,"x","exp")};return Kr.runKernel("Exp",t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const qi=os({expandDims_:function(e,t=0){const n=rs(e,"x","expandDims","string_or_numeric");u(t<=n.rank,(()=>"Axis must be <= rank of the tensor"));const r={input:n},s={dim:t};return Kr.runKernel(Le,r,s)}});
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
 */const Hi=os({expm1_:function(e){const t={x:rs(e,"x","expm1")};return Kr.runKernel(Ce,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ki=os({tile_:function(e,t){const n=rs(e,"x","tile","string_or_numeric");u(n.rank===t.length,(()=>`Error in transpose: rank of input ${n.rank} must match length of reps ${t}.`));const r={x:n},s={reps:t};return Kr.runKernel(un,r,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Zi=os({eye_:function(e,t,n,r="float32"){null==t&&(t=e);const s=Xs([e,t],r),a=e<=t?e:t;for(let e=0;e<a;++e)s.set(1,e,e);const o=Bo(s.toTensor(),[e,t]);if(null==n)return o;if(1===n.length)return Ki(qi(o,0),[n[0],1,1]);if(2===n.length)return Ki(qi(qi(o,0),0),[n[0],n[1],1,1]);if(3===n.length)return Ki(qi(qi(qi(o,0),0),0),[n[0],n[1],n[2],1,1]);throw new Error(`eye() currently supports only 1D and 2D batchShapes, but received ${n.length}D.`)}});
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
 */const Yi=os({floor_:function(e){const t={x:rs(e,"x","floor","float32")};return Kr.runKernel(ze,t)}});
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
 */const Qi=os({gather_:function(e,t,n=0,r=0){const s={x:rs(e,"x","gather"),indices:rs(t,"indices","gather","int32")},a={axis:n,batchDims:r};return Kr.runKernel(je,s,a)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ji=os({greater_:function(e,t){let n=rs(e,"a","greater","string_or_numeric"),r=rs(t,"b","greater","string_or_numeric");[n,r]=Br(n,r),Da(n.shape,r.shape);const s={a:n,b:r};return Kr.runKernel(Ge,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Xi=os({greaterEqual_:function(e,t){let n=rs(e,"a","greaterEqual","string_or_numeric"),r=rs(t,"b","greaterEqual","string_or_numeric");[n,r]=Br(n,r),Da(n.shape,r.shape);const s={a:n,b:r};return Kr.runKernel(We,s)}});
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
 */const eu=os({isFinite_:function(e){const t={x:rs(e,"x","isFinite")};return Kr.runKernel(Ke,t)}});
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
 */const tu=os({isInf_:function(e){const t={x:rs(e,"x","isInf")};return Kr.runKernel(Ze,t)}});
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
 */const nu=os({isNaN_:function(e){const t={x:rs(e,"x","isNaN")};return Kr.runKernel(Ye,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ru=os({leakyRelu_:function(e,t=.2){const n={x:rs(e,"x","leakyRelu")},r={alpha:t};return Kr.runKernel(Qe,n,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const su=os({less_:function(e,t){let n=rs(e,"a","less","string_or_numeric"),r=rs(t,"b","less","string_or_numeric");[n,r]=Br(n,r),Da(n.shape,r.shape);const s={a:n,b:r};return Kr.runKernel(Je,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const au=os({lessEqual_:function(e,t){let n=rs(e,"a","lessEqual","string_or_numeric"),r=rs(t,"b","lessEqual","string_or_numeric");[n,r]=Br(n,r),Da(n.shape,r.shape);const s={a:n,b:r};return Kr.runKernel(Xe,s)}});
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
 */function ou(e,t,n){if(n<=0)throw new Error("The number of values should be positive.");const r={start:e,stop:t,num:n};return Kr.runKernel(et,{},r)}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const iu=os({localResponseNormalization_:function(e,t=5,n=1,r=1,s=.5){const a=rs(e,"x","localResponseNormalization");u(4===a.rank||3===a.rank,(()=>`Error in localResponseNormalization: x must be rank 3 or 4 but got\n               rank ${a.rank}.`)),u(m(t),(()=>`Error in localResponseNormalization: depthRadius must be an integer but got depthRadius ${t}.`));let o=a,i=!1;3===a.rank&&(i=!0,o=Bo(a,[1,a.shape[0],a.shape[1],a.shape[2]]));const l={x:o},c={depthRadius:t,bias:n,alpha:r,beta:s},p=Kr.runKernel("LRN",l,c);return i?Bo(p,[p.shape[1],p.shape[2],p.shape[3]]):p}});
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
 */const uu=os({log_:function(e){const t={x:rs(e,"x","log","float32")};return Kr.runKernel("Log",t)}});
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
 */const lu=os({log1p_:function(e){const t={x:rs(e,"x","log1p")};return Kr.runKernel(tt,t)}});
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
 */function cu(e,t){u(I(e),(()=>"The f passed in variableGrads(f) must be a function")),u(null==t||Array.isArray(t)&&t.every((e=>e instanceof Dr)),(()=>"The varList passed in variableGrads(f, varList) must be an array of variables"));const n=null!=t;if(!n){t=[];for(const e in Kr.registeredVariables)t.push(Kr.registeredVariables[e])}const r=n?t.filter((e=>!e.trainable)):null,s=t.length;t=t.filter((e=>e.trainable)),u(t.length>0,(()=>`variableGrads() expects at least one of the input variables to be trainable, but none of the ${s} variables is trainable.`));const{value:a,grads:o}=Kr.gradients(e,t,null,!0);u(o.some((e=>null!=e)),(()=>"Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize().")),u(0===a.rank,(()=>`The f passed in variableGrads(f) must return a scalar, but it returned a rank-${a.rank} tensor`));const i={};return t.forEach(((e,t)=>{null!=o[t]&&(i[e.name]=o[t])})),null!=r&&r.forEach((e=>i[e.name]=null)),{value:a,grads:i}}function pu(e){return Kr.customGrad(e)}function hu(e){if(e.filter((e=>null==e)).length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that\n    the f you passed encloses all operations that lead from x to y.")}
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
 */const du=os({softplus_:function(e){const t={x:rs(e,"x","softplus")};return Kr.runKernel(Ut,t)}});
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
 */const mu=os({logSigmoid_:function(e){const t=rs(e,"x","logSigmoid");return pu((e=>({value:Ta(du(Ta(e))),gradFunc:t=>ho(t,Go(Ta(e)))})))(t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const fu=os({sub_:function(e,t){let n=rs(e,"a","sub"),r=rs(t,"b","sub");[n,r]=Br(n,r);const s={a:n,b:r};return Kr.runKernel("Sub",s)}});
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
 */const gu=os({logSoftmax_:function(e,t=-1){const n=rs(e,"logits","logSoftmax");if(-1===t&&(t=n.rank-1),t!==n.rank-1)throw Error(`Log Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and axis was ${t}`);const r=pu(((e,n)=>{const r=Ci(e,t,!0),s=fu(e,r),a=fu(ea(s,"float32"),uu(ji(Ui(s),t,!0)));n([a]);return{value:a,gradFunc:(e,n)=>{const[r]=n,s=Ui(r);return fu(e,ho(ji(e,t,!0),s))}}}));return r(n)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const yu=os({logSumExp_:function(e,t=null,n=!1){const r=rs(e,"x","logSumExp"),s=g(t,r.shape),a=Ci(r,s,!0),o=fu(r,a),i=Ui(o),u=ji(i,s),l=uu(u),c=lo(Bo(a,l.shape),l);if(n){const e=Li(c.shape,s);return Bo(c,e)}return c}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const bu=os({logicalAnd_:function(e,t){const n=rs(e,"a","logicalAnd","bool"),r=rs(t,"b","logicalAnd","bool");Da(n.shape,r.shape);const s={a:n,b:r};return Kr.runKernel(nt,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const wu=os({logicalNot_:function(e){const t={x:rs(e,"x","logicalNot","bool")};return Kr.runKernel(rt,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const xu=os({logicalOr_:function(e,t){const n=rs(e,"a","logicalOr","bool"),r=rs(t,"b","logicalOr","bool");Da(n.shape,r.shape);const s={a:n,b:r};return Kr.runKernel(st,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Nu=os({logicalXor_:function(e,t){const n=rs(e,"a","logicalXor","bool"),r=rs(t,"b","logicalXor","bool");return Da(n.shape,r.shape),bu(xu(e,t),wu(bu(e,t)))}}),vu=2147483648;
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
 */const Su=os({searchSorted_:function(e,t,n="left"){const r=rs(e,"sortedSequence","searchSorted"),s=rs(t,"values","searchSorted"),a=r.shape[r.shape.length-1],o=s.shape[s.shape.length-1],i=Bo(r,[-1,a]),u=Bo(s,[-1,o]);if(i.rank<2)throw new Error("Sorted input argument must be at least 2-dimensional");if(i.shape[0]!==u.shape[0])throw new Error("Leading dimension of 'sortedSequence' and 'values' must match.");if(h(u.shape)>=vu)throw new Error("values tensor size must less than 2147483648");if(i.shape[1]>=vu)throw new Error(`trailing dim_size must less than 2147483648 for int32 output type, was ${i.shape[1]}`);const l={sortedSequence:i,values:u},c={side:n};return Kr.runKernel(zt,l,c)}});
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
 */function Tu(e,t){return Su(e,t,"left")}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ku=os({maxPool_:function(e,t,n,r,s){const a=rs(e,"x","maxPool");let o=a,i=!1;3===a.rank&&(i=!0,o=Bo(a,[1,a.shape[0],a.shape[1],a.shape[2]])),u(4===o.rank,(()=>`Error in maxPool: input must be rank 4 but got rank ${o.rank}.`)),u(Ro(n,1),(()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${n} and dilations '1'`)),zo("maxPool",r,s);const l={x:o},c={filterSize:t,strides:n,pad:r,dimRoundingMode:s},p=Kr.runKernel(ot,l,c);return i?Bo(p,[p.shape[1],p.shape[2],p.shape[3]]):p}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Eu=os({maxPool3d_:function(e,t=[1,1,1],n,r,s,a="NDHWC"){const o=rs(e,"x","maxPool3d");let i=o,l=!1;4===o.rank&&(l=!0,i=Bo(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),u(5===i.rank,(()=>`Error in maxPool3d: x must be rank 5 but got rank ${i.rank}.`)),u("NDHWC"===a,(()=>`Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of ${a}`)),zo("maxPool3d",r,s);const c={x:i},p={filterSize:t,strides:n,pad:r,dimRoundingMode:s,dataFormat:a},h=Kr.runKernel(it,c,p);return l?Bo(h,[h.shape[1],h.shape[2],h.shape[3],h.shape[4]]):h}});
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
 */const _u=os({maxPoolWithArgmax_:function(e,t,n,r,s=!1){const a={x:rs(e,"x","maxPoolWithArgmax")},o={filterSize:t,strides:n,pad:r,includeBatchInIndex:s},i=Kr.runKernel(ut,a,o);return{result:i[0],indexes:i[1]}}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Mu=os({maximum_:function(e,t){let n=rs(e,"a","maximum"),r=rs(t,"b","maximum");[n,r]=Br(n,r),"bool"===n.dtype&&(n=ea(n,"int32"),r=ea(r,"int32")),Da(n.shape,r.shape);const s={a:n,b:r};return Kr.runKernel(at,s)}});
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
 */const Iu=os({mean_:function(e,t=null,n=!1){const r={x:rs(e,"x","mean")},s={axis:t,keepDims:n};return Kr.runKernel(lt,r,s)}});
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
 */function Au(e,t="float32"){if("complex64"===t){const t=Au(e,"float32"),n=Au(e,"float32");return is(t,n)}const n=C(h(e),t);return Kr.makeTensor(n,e,t)}
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
 */function Du(e,t="float32"){if("complex64"===t){const t=Du(e,"float32"),n=Au(e,"float32");return is(t,n)}const n=L(h(e),t);return Kr.makeTensor(n,e,t)}
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
 */function $u(e,t,{indexing:n="xy"}={}){if("xy"!==n&&"ij"!==n)throw new TypeError(`${n} is not a valid third argument to meshgrid`);if(void 0===e)return[];let r=rs(e,"x","meshgrid",e instanceof Ar?e.dtype:"float32");if(void 0===t)return[r];let s=rs(t,"y","meshgrid",t instanceof Ar?t.dtype:"float32");const a=h(r.shape),o=h(s.shape);return"xy"===n?(r=Bo(r,[1,-1]),s=Bo(s,[-1,1]),[ba(Du([o,1],r.dtype),r),ba(s,Du([1,a],s.dtype))]):(r=Bo(r,[-1,1]),s=Bo(s,[1,-1]),[ba(r,Du([1,o],r.dtype)),ba(Du([a,1],s.dtype),s)])}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ou=os({minimum_:function(e,t){let n=rs(e,"a","minimum"),r=rs(t,"b","minimum");[n,r]=Br(n,r),"bool"===n.dtype&&(n=ea(n,"int32"),r=ea(r,"int32")),Da(n.shape,r.shape);const s={a:n,b:r};return Kr.runKernel(ct,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Lu=os({mirrorPad_:function(e,t,n){u("reflect"===n||"symmetric"===n,(()=>`Invalid mode. Mode must be either reflect or symmetric. Got ${n}.`));const r=rs(e,"x","mirrorPad");if(0===r.rank)throw new Error("mirrorPad(scalar) is not defined. Pass non-scalar to mirrorPad");u(t.length===r.rank,(()=>`Padding doesn't match input. Must be ${r.rank}. Got ${t.length}.`));const s="reflect"===n?1:0;for(let e=0;e<r.rank;e++)u(2===t[e].length,(()=>"Invalid number of paddings. Must be length of 2 each.")),u(t[e][0]>=0&&t[e][0]<=r.shape[e]-s&&t[e][1]>=0&&t[e][1]<=r.shape[e]-s,(()=>`Padding in dimension ${e} cannot be greater than or equal to ${r.shape[e]-s} or less than 0 for input of shape ${r.shape}`));const a={paddings:t,mode:n},o={x:r};return Kr.runKernel(pt,o,a)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Cu=os({mod_:function(e,t){let n=rs(e,"a","mod"),r=rs(t,"b","mod");[n,r]=Br(n,r);const s={a:n,b:r};return Kr.runKernel("Mod",s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ru=os({moments_:function(e,t=null,n=!1){const r=g(t,(e=rs(e,"x","moments")).shape),s=Iu(e,r,n);let a=s.shape;n||(a=Li(s.shape,r));const o=Pi(fu(ea(e,"float32"),Bo(s,a)));return{mean:s,variance:Iu(o,r,n)}}});const Fu=os({multiRNNCell_:function(e,t,n,r){const s=rs(t,"data","multiRNNCell"),a=ss(n,"c","multiRNNCell"),o=ss(r,"h","multiRNNCell");let i=s;const u=[];for(let t=0;t<e.length;t++){const n=e[t](i,a[t],o[t]);u.push(n[0]),u.push(n[1]),i=n[1]}const l=[],c=[];for(let e=0;e<u.length;e+=2)l.push(u[e]),c.push(u[e+1]);return[l,c]}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const zu=os({multinomial_:function(e,t,n,r=!1){const s=rs(e,"logits","multinomial"),a=s.size,o=s.rank;if(a<2)throw new Error(`Error in multinomial: you need at least 2 outcomes, but got ${a}.`);if(o>2)throw new Error(`Rank of probabilities must be 1 or 2, but is ${o}`);n=n||Math.random();const i={logits:1===o?Bo(s,[1,-1]):s},u={numSamples:t,seed:n,normalized:r},l=Kr.runKernel(ht,i,u);return 1===o?Bo(l,[l.size]):l}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Bu=os({notEqual_:function(e,t){let n=rs(e,"a","notEqual","string_or_numeric"),r=rs(t,"b","notEqual","string_or_numeric");[n,r]=Br(n,r),Da(n.shape,r.shape);const s={a:n,b:r};return Kr.runKernel(mt,s)}});
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
 */const Pu=os({onesLike_:function(e){const t={x:rs(e,"x","onesLike")};return Kr.runKernel(bt,t)}});const ju=os({outerProduct_:function(e,t){const n=rs(e,"v1","outerProduct"),r=rs(t,"v2","outerProduct");u(1===n.rank&&1===r.rank,(()=>`Error in outerProduct: inputs must be rank 1, but got ranks ${n.rank} and ${r.rank}.`));const s=Bo(n,[-1,1]),a=Bo(r,[1,-1]);return ba(s,a)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Vu=os({pad_:function(e,t,n=0){const r=rs(e,"x","pad");if(0===r.rank)throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");const s={paddings:t,constantValue:n},a={x:r};return Kr.runKernel(Nt,a,s)}});const Gu=os({pad1d_:function(e,t,n=0){return u(2===t.length,(()=>"Invalid number of paddings. Must be length of 2.")),Vu(e,[t],n)}});const Wu=os({pad2d_:function(e,t,n=0){return u(2===t.length&&2===t[0].length&&2===t[1].length,(()=>"Invalid number of paddings. Must be length of 2 each.")),Vu(e,t,n)}});const Uu=os({pad3d_:function(e,t,n=0){return u(3===t.length&&2===t[0].length&&2===t[1].length&&2===t[2].length,(()=>"Invalid number of paddings. Must be length of 2 each.")),Vu(e,t,n)}});const qu=os({pad4d_:function(e,t,n=0){return u(4===t.length&&2===t[0].length&&2===t[1].length&&2===t[2].length&&2===t[3].length,(()=>"Invalid number of paddings. Must be length of 2 each.")),Vu(e,t,n)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Hu=os({spaceToBatchND_:function(e,t,n){const r=rs(e,"x","spaceToBatchND");u(r.rank>=1+t.length,(()=>`input rank ${r.rank} should be > than [blockShape] ${t.length}`)),u(n.length===t.length,(()=>`paddings.shape[0] ${n.length} must be equal to [blockShape] ${t.length}`)),u(r.shape.reduce(((e,r,s)=>s>0&&s<=t.length?e&&(r+n[s-1][0]+n[s-1][1])%t[s-1]==0:e),!0),(()=>`input spatial dimensions ${r.shape.slice(1)} with paddings ${n.toString()} must be divisible by blockShapes ${t.toString()}`));const s={x:r},a={blockShape:t,paddings:n};return Kr.runKernel(Ht,s,a)}});
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
 */const Ku=os({pool_:function(e,t,n,r,s,a,o){null==s&&(s=[1,1]),null==a&&(a=1),0===r&&(r="valid");const i=rs(e,"x","maxPool");let l=i,c=!1;3===i.rank&&(c=!0,l=Bo(i,[1,i.shape[0],i.shape[1],i.shape[2]])),u(Ro(a,s),(()=>`Error in pool: Either strides or dilations must be 1. Got strides ${a} and dilations '${s}'`));const p=_o(l.shape,t,a,s,r),h=[p.dilationHeight,p.dilationWidth];let d;d="same"===r?function(e,t){const n=e.map(((e,n)=>e+(e-1)*(t[n]-1))),r=n.map((e=>e-1)),s=r.map((e=>Math.floor(e/2))),a=r.map(((e,t)=>e-s[t]));return r.map(((e,t)=>[s[t],a[t]]))}([p.filterHeight,p.filterWidth],h):[[0,0],[0,0]];const m=1===h[0]&&1===h[1],[f,g]=function(e,t,n){const r=n.map((e=>e[0])),s=n.map((e=>e[1])),a=e.concat(r,s),o=t.map(((e,t)=>(e-a[t]%e)%e)),i=s.map(((e,t)=>e+o[t])),u=t.map(((e,t)=>[r[t],i[t]])),l=t.map(((e,t)=>[0,o[t]]));return[u,l]}([p.inHeight,p.inWidth],h,d),y=m?r:"valid",b=m?l:Hu(l,h,f),w=("avg"===n?()=>Po(b,t,a,y,o):()=>ku(b,t,a,y,o))(),x=m?w:Ho(w,h,g);return c?Bo(x,[x.shape[1],x.shape[2],x.shape[3]]):x}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Zu=os({prelu_:function(e,t){const n={x:rs(e,"x","prelu"),alpha:rs(t,"alpha","prelu")};return Kr.runKernel(vt,n)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Yu=os({prod_:function(e,t=null,n=!1){let r=rs(e,"x","prod");"bool"===r.dtype&&(r=ea(r,"int32"));const s={x:r},a={axis:t,keepDims:n};return Kr.runKernel(St,s,a)}});
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
 */const Qu=os({raggedGather_:function(e,t,n,r){const s={paramsNestedSplits:e.map(((e,t)=>rs(e,`tensors${t}`,"raggedGather","int32"))),paramsDenseValues:rs(t,"paramsDenseValues","raggedGather"),indices:rs(n,"indices","raggedGather","int32")},a={outputRaggedRank:r},o=Kr.runKernel(Tt,s,a);return{outputNestedSplits:o.slice(0,o.length-1),outputDenseValues:o[o.length-1]}}});
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
 */const Ju=os({raggedTensorToTensor_:function(e,t,n,r,s){const a=rs(e,"shape","raggedTensorToTensor","int32"),o=rs(t,"values","raggedTensorToTensor"),i={shape:a,values:o,defaultValue:rs(n,"defaultValue","raggedTensorToTensor",o.dtype),rowPartitionTensors:r.map(((e,t)=>rs(e,`tensors${t}`,"raggedTensorToTensor","int32")))},u={rowPartitionTypes:s};return Kr.runKernel(kt,i,u)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Xu=os({rand_:function(e,t,n){const r=h(e);let s=null;if(null==n||"float32"===n)s=new Float32Array(r);else if("int32"===n)s=new Int32Array(r);else{if("bool"!==n)throw new Error(`Unknown data type ${n}`);s=new Uint8Array(r)}for(let e=0;e<r;e++)s[e]=t();return Kr.makeTensor(s,e,n)}});var el={};(function(e,t,n){function r(e){var t=this,n=function(){var e=4022871197,t=function(t){t=String(t);for(var n=0;n<t.length;n++){var r=.02519603282416938*(e+=t.charCodeAt(n));r-=e=r>>>0,e=(r*=e)>>>0,e+=4294967296*(r-=e)}return 2.3283064365386963e-10*(e>>>0)};return t}();t.next=function(){var e=2091639*t.s0+2.3283064365386963e-10*t.c;return t.s0=t.s1,t.s1=t.s2,t.s2=e-(t.c=0|e)},t.c=1,t.s0=n(" "),t.s1=n(" "),t.s2=n(" "),t.s0-=n(e),t.s0<0&&(t.s0+=1),t.s1-=n(e),t.s1<0&&(t.s1+=1),t.s2-=n(e),t.s2<0&&(t.s2+=1),n=null}function s(e,t){return t.c=e.c,t.s0=e.s0,t.s1=e.s1,t.s2=e.s2,t}function a(e,t){var n=new r(e),a=t&&t.state,o=n.next;return o.int32=function(){return 4294967296*n.next()|0},o.double=function(){return o()+11102230246251565e-32*(2097152*o()|0)},o.quick=o,a&&("object"==typeof a&&s(a,n),o.state=function(){return s(n,{})}),o}t&&t.exports?t.exports=a:n&&n.amd?n((function(){return a})):this.alea=a})(0,{get exports(){return el},set exports(e){el=e}},!1);var tl={};!function(e){!function(e,t,n){function r(e){var t=this,n="";t.x=0,t.y=0,t.z=0,t.w=0,t.next=function(){var e=t.x^t.x<<11;return t.x=t.y,t.y=t.z,t.z=t.w,t.w^=t.w>>>19^e^e>>>8},e===(0|e)?t.x=e:n+=e;for(var r=0;r<n.length+64;r++)t.x^=0|n.charCodeAt(r),t.next()}function s(e,t){return t.x=e.x,t.y=e.y,t.z=e.z,t.w=e.w,t}function a(e,t){var n=new r(e),a=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do{var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21)}while(0===e);return e},o.int32=n.next,o.quick=o,a&&("object"==typeof a&&s(a,n),o.state=function(){return s(n,{})}),o}t&&t.exports?t.exports=a:n&&n.amd?n((function(){return a})):this.xor128=a}(0,e,!1)}({get exports(){return tl},set exports(e){tl=e}});var nl={};!function(e){!function(e,t,n){function r(e){var t=this,n="";t.next=function(){var e=t.x^t.x>>>2;return t.x=t.y,t.y=t.z,t.z=t.w,t.w=t.v,(t.d=t.d+362437|0)+(t.v=t.v^t.v<<4^e^e<<1)|0},t.x=0,t.y=0,t.z=0,t.w=0,t.v=0,e===(0|e)?t.x=e:n+=e;for(var r=0;r<n.length+64;r++)t.x^=0|n.charCodeAt(r),r==n.length&&(t.d=t.x<<10^t.x>>>4),t.next()}function s(e,t){return t.x=e.x,t.y=e.y,t.z=e.z,t.w=e.w,t.v=e.v,t.d=e.d,t}function a(e,t){var n=new r(e),a=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do{var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21)}while(0===e);return e},o.int32=n.next,o.quick=o,a&&("object"==typeof a&&s(a,n),o.state=function(){return s(n,{})}),o}t&&t.exports?t.exports=a:n&&n.amd?n((function(){return a})):this.xorwow=a}(0,e,!1)}({get exports(){return nl},set exports(e){nl=e}});var rl={};!function(e){!function(e,t,n){function r(e){var t=this;t.next=function(){var e,n,r=t.x,s=t.i;return e=r[s],n=(e^=e>>>7)^e<<24,n^=(e=r[s+1&7])^e>>>10,n^=(e=r[s+3&7])^e>>>3,n^=(e=r[s+4&7])^e<<7,e=r[s+7&7],n^=(e^=e<<13)^e<<9,r[s]=n,t.i=s+1&7,n},function(e,t){var n,r=[];if(t===(0|t))r[0]=t;else for(t=""+t,n=0;n<t.length;++n)r[7&n]=r[7&n]<<15^t.charCodeAt(n)+r[n+1&7]<<13;for(;r.length<8;)r.push(0);for(n=0;n<8&&0===r[n];++n);for(8==n?r[7]=-1:r[n],e.x=r,e.i=0,n=256;n>0;--n)e.next()}(t,e)}function s(e,t){return t.x=e.x.slice(),t.i=e.i,t}function a(e,t){null==e&&(e=+new Date);var n=new r(e),a=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do{var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21)}while(0===e);return e},o.int32=n.next,o.quick=o,a&&(a.x&&s(a,n),o.state=function(){return s(n,{})}),o}t&&t.exports?t.exports=a:n&&n.amd?n((function(){return a})):this.xorshift7=a}(0,e,!1)}({get exports(){return rl},set exports(e){rl=e}});var sl={};!function(e){!function(e,t,n){function r(e){var t=this;t.next=function(){var e,n,r=t.w,s=t.X,a=t.i;return t.w=r=r+1640531527|0,n=s[a+34&127],e=s[a=a+1&127],n^=n<<13,e^=e<<17,n^=n>>>15,e^=e>>>12,n=s[a]=n^e,t.i=a,n+(r^r>>>16)|0},function(e,t){var n,r,s,a,o,i=[],u=128;for(t===(0|t)?(r=t,t=null):(t+="\0",r=0,u=Math.max(u,t.length)),s=0,a=-32;a<u;++a)t&&(r^=t.charCodeAt((a+32)%t.length)),0===a&&(o=r),r^=r<<10,r^=r>>>15,r^=r<<4,r^=r>>>13,a>=0&&(o=o+1640531527|0,s=0==(n=i[127&a]^=r+o)?s+1:0);for(s>=128&&(i[127&(t&&t.length||0)]=-1),s=127,a=512;a>0;--a)r=i[s+34&127],n=i[s=s+1&127],r^=r<<13,n^=n<<17,r^=r>>>15,n^=n>>>12,i[s]=r^n;e.w=o,e.X=i,e.i=s}(t,e)}function s(e,t){return t.i=e.i,t.w=e.w,t.X=e.X.slice(),t}function a(e,t){null==e&&(e=+new Date);var n=new r(e),a=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do{var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21)}while(0===e);return e},o.int32=n.next,o.quick=o,a&&(a.X&&s(a,n),o.state=function(){return s(n,{})}),o}t&&t.exports?t.exports=a:n&&n.amd?n((function(){return a})):this.xor4096=a}(0,e,!1)}({get exports(){return sl},set exports(e){sl=e}});var al={};!function(e){!function(e,t,n){function r(e){var t=this,n="";t.next=function(){var e=t.b,n=t.c,r=t.d,s=t.a;return e=e<<25^e>>>7^n,n=n-r|0,r=r<<24^r>>>8^s,s=s-e|0,t.b=e=e<<20^e>>>12^n,t.c=n=n-r|0,t.d=r<<16^n>>>16^s,t.a=s-e|0},t.a=0,t.b=0,t.c=-1640531527,t.d=1367130551,e===Math.floor(e)?(t.a=e/4294967296|0,t.b=0|e):n+=e;for(var r=0;r<n.length+20;r++)t.b^=0|n.charCodeAt(r),t.next()}function s(e,t){return t.a=e.a,t.b=e.b,t.c=e.c,t.d=e.d,t}function a(e,t){var n=new r(e),a=t&&t.state,o=function(){return(n.next()>>>0)/4294967296};return o.double=function(){do{var e=((n.next()>>>11)+(n.next()>>>0)/4294967296)/(1<<21)}while(0===e);return e},o.int32=n.next,o.quick=o,a&&("object"==typeof a&&s(a,n),o.state=function(){return s(n,{})}),o}t&&t.exports?t.exports=a:n&&n.amd?n((function(){return a})):this.tychei=a}(0,e,!1)}({get exports(){return al},set exports(e){al=e}});var ol={};!function(e){!function(t,n,r){var s,a=256,o="random",i=r.pow(a,6),u=r.pow(2,52),l=2*u,c=255;function p(e,c,p){var y=[],b=f(m((c=1==c?{entropy:!0}:c||{}).entropy?[e,g(n)]:null==e?function(){try{var e;return s&&(e=s.randomBytes)?e=e(a):(e=new Uint8Array(a),(t.crypto||t.msCrypto).getRandomValues(e)),g(e)}catch(e){var r=t.navigator,o=r&&r.plugins;return[+new Date,t,o,t.screen,g(n)]}}():e,3),y),w=new h(y),x=function(){for(var e=w.g(6),t=i,n=0;e<u;)e=(e+n)*a,t*=a,n=w.g(1);for(;e>=l;)e/=2,t/=2,n>>>=1;return(e+n)/t};return x.int32=function(){return 0|w.g(4)},x.quick=function(){return w.g(4)/4294967296},x.double=x,f(g(w.S),n),(c.pass||p||function(e,t,n,s){return s&&(s.S&&d(s,w),e.state=function(){return d(w,{})}),n?(r[o]=e,t):e})(x,b,"global"in c?c.global:this==r,c.state)}function h(e){var t,n=e.length,r=this,s=0,o=r.i=r.j=0,i=r.S=[];for(n||(e=[n++]);s<a;)i[s]=s++;for(s=0;s<a;s++)i[s]=i[o=c&o+e[s%n]+(t=i[s])],i[o]=t;(r.g=function(e){for(var t,n=0,s=r.i,o=r.j,i=r.S;e--;)t=i[s=c&s+1],n=n*a+i[c&(i[s]=i[o=c&o+t])+(i[o]=t)];return r.i=s,r.j=o,n})(a)}function d(e,t){return t.i=e.i,t.j=e.j,t.S=e.S.slice(),t}function m(e,t){var n,r=[],s=typeof e;if(t&&"object"==s)for(n in e)try{r.push(m(e[n],t-1))}catch(e){}return r.length?r:"string"==s?e:e+"\0"}function f(e,t){for(var n,r=e+"",s=0;s<r.length;)t[c&s]=c&(n^=19*t[c&s])+r.charCodeAt(s++);return g(t)}function g(e){return String.fromCharCode.apply(0,e)}if(f(r.random(),n),e.exports){e.exports=p;try{s=require("crypto")}catch(e){}}else r["seed"+o]=p}("undefined"!=typeof self?self:An,[],Math)}({get exports(){return ol},set exports(e){ol=e}});var il=el,ul=tl,ll=nl,cl=rl,pl=sl,hl=al,dl=ol;dl.alea=il,dl.xor128=ul,dl.xorwow=ll,dl.xorshift7=cl,dl.xor4096=pl,dl.tychei=hl;var ml=dl;
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
 */class fl{constructor(e,t,n,r,s){this.mean=e,this.stdDev=t,this.dtype=n,this.nextVal=NaN,this.truncated=r,this.truncated&&(this.upper=this.mean+2*this.stdDev,this.lower=this.mean-2*this.stdDev);const a=s||Math.random();this.random=ml.alea(a.toString())}nextValue(){if(!isNaN(this.nextVal)){const e=this.nextVal;return this.nextVal=NaN,e}let e,t,n=!1;for(;!n;){let r,s,a;do{r=2*this.random()-1,s=2*this.random()-1,a=r*r+s*s}while(a>=1||0===a);const o=Math.sqrt(-2*Math.log(a)/a);e=this.mean+this.stdDev*r*o,t=this.mean+this.stdDev*s*o,this.truncated&&!this.isValidTruncated(e)||(n=!0)}return this.truncated&&!this.isValidTruncated(t)||(this.nextVal=this.convertValue(t)),this.convertValue(e)}convertValue(e){return null==this.dtype||"float32"===this.dtype?e:Math.round(e)}isValidTruncated(e){return e<=this.upper&&e>=this.lower}}class gl{constructor(e,t,n,r){this.alpha=e,this.beta=1/t,this.dtype=n;const s=r||Math.random();this.randu=ml.alea(s.toString()),this.randn=new fl(0,1,n,!1,this.randu()),this.d=e<1?e+2/3:e-1/3,this.c=1/Math.sqrt(9*this.d)}nextValue(){let e,t,n,r,s,a;for(;;){do{r=this.randn.nextValue(),a=1+this.c*r}while(a<=0);if(a*=a*a,e=r*r,t=1-.331*e*e,n=.5*e+this.d*(1-a+Math.log(a)),s=this.randu(),s<t||Math.log(s)<n)break}return a=1/this.beta*this.d*a,this.alpha<1&&(a*=Math.pow(this.randu(),1/this.alpha)),this.convertValue(a)}convertValue(e){return"float32"===this.dtype?e:Math.round(e)}}class yl{constructor(e=0,t=1,n,r){if(this.canReturnFloat=()=>null==this.dtype||"float32"===this.dtype,this.min=e,this.range=t-e,this.dtype=n,null==r&&(r=Math.random()),"number"==typeof r&&(r=r.toString()),!this.canReturnFloat()&&this.range<=1)throw new Error(`The difference between ${e} - ${t} <= 1 and dtype is not float`);this.random=ml.alea(r)}convertValue(e){return this.canReturnFloat()?e:Math.round(e)}nextValue(){return this.convertValue(this.min+this.range*this.random())}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const bl=os({randomGamma_:function(e,t,n=1,r="float32",s){if(null==n&&(n=1),null==r&&(r="float32"),"float32"!==r&&"int32"!==r)throw new Error(`Unsupported data type ${r}`);const a=new gl(t,n,r,s),o=Xs(e,r);for(let e=0;e<o.values.length;e++)o.values[e]=a.nextValue();return o.toTensor()}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const wl=os({randomNormal_:function(e,t=0,n=1,r,s){if(null!=r&&"bool"===r)throw new Error(`Unsupported data type ${r}`);const a=new fl(t,n,r,!1,s),o=Xs(e,r);for(let e=0;e<o.values.length;e++)o.values[e]=a.nextValue();return o.toTensor()}});
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
 */const xl=os({randomStandardNormal_:function(e,t,n){if(null!=t&&"bool"===t)throw new Error(`Unsupported data type ${t}`);return wl(e,0,1,t,n)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Nl=os({randomUniform_:function(e,t=0,n=1,r="float32",s){const a=Xs(e,r),o=new yl(t,n,null,s);for(let e=0;e<a.values.length;e++)a.values[e]=o.nextValue();return a.toTensor()}});
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
 */function vl(e,t,n=1,r="float32"){if(0===n)throw new Error("Cannot have a step of zero");const s={start:e,stop:t,step:n,dtype:r};return Kr.runKernel(Et,{},s)}
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
 */const Sl=os({reciprocal_:function(e){const t={x:rs(e,"x","reciprocal")};return Kr.runKernel(Mt,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Tl=os({relu_:function(e){const t={x:rs(e,"x","relu")};return Kr.runKernel(It,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const kl=os({relu6_:function(e){const t={x:rs(e,"x","relu6")};return Kr.runKernel(Ot,t)}});
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
 */const El=os({reverse_:function(e,t){const n={x:rs(e,"x","reverse")},r={dims:t};return Kr.runKernel(Lt,n,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const _l=os({reverse1d_:function(e){const t=rs(e,"x","reverse");return u(1===t.rank,(()=>`Error in reverse1D: x must be rank 1 but got rank ${t.rank}.`)),El(t,0)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ml=os({reverse2d_:function(e,t){const n=rs(e,"x","reverse");return u(2===n.rank,(()=>`Error in reverse2D: x must be rank 2 but got rank ${n.rank}.`)),El(n,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Il=os({reverse3d_:function(e,t){const n=rs(e,"x","reverse");return u(3===n.rank,(()=>`Error in reverse3D: x must be rank 3 but got rank ${n.rank}.`)),El(n,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Al=os({reverse4d_:function(e,t){const n=rs(e,"x","reverse");return u(4===n.rank,(()=>`Error in reverse4D: x must be rank 4 but got rank ${n.rank}.`)),El(n,t)}});
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
 */const Dl=os({round_:function(e){const t={x:rs(e,"x","round")};return Kr.runKernel(Ct,t)}});
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
 */const $l=os({rsqrt_:function(e){const t={x:rs(e,"x","rsqrt","float32")};return Kr.runKernel(Rt,t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ol=os({selu_:function(e){const t={x:rs(e,"x","selu")};return Kr.runKernel(Pt,t)}});const Ll=os({separableConv2d_:function(e,t,n,r,s,a=[1,1],o="NHWC"){const i=rs(e,"x","separableConv2d"),l=rs(t,"depthwiseFilter","separableConv2d"),c=rs(n,"pointwiseFilter","separableConv2d");let p=i,h=!1;if(3===i.rank&&(h=!0,p=Bo(i,[1,i.shape[0],i.shape[1],i.shape[2]])),"NCHW"===o)throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");u(4===p.rank,(()=>`Error in separableConv2d: input must be rank 4, but got rank ${p.rank}.`)),u(4===l.rank,(()=>`Error in separableConv2d: depthwise filter must be rank 4, but got rank ${l.rank}.`)),u(4===c.rank,(()=>`Error in separableConv2d: pointwise filter must be rank 4, but got rank ${l.rank}.`)),u(1===c.shape[0],(()=>`Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got ${c.shape[0]}.`)),u(1===c.shape[1],(()=>`Error in separableConv2d: the second dimension of pointwise filter must be 1, but got ${c.shape[1]}.`));const d=l.shape[2],m=l.shape[3];u(c.shape[2]===d*m,(()=>`Error in separableConv2d: the third dimension of pointwise filter must be ${d*m}, but got ${c.shape[2]}.`));const f=Ni(p,l,r,s,o,a),g=ui(f,c,1,"valid",o);return h?Bo(g,[g.shape[1],g.shape[2],g.shape[3]]):g}});
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
 */const Cl=async function(e,t){const n=rs(e,"x","setdiff1d"),r=rs(t,"y","setdiff1d");u(n.dtype===r.dtype,(()=>`x and y should have the same dtype, but got x (${n.dtype}) and y (${r.dtype}).`)),u(1===n.rank,(()=>`x should be 1D tensor, but got x (${n.shape}).`)),u(1===r.rank,(()=>`y should be 1D tensor, but got y (${r.shape}).`));const s=await n.data(),a=await r.data(),o=new Set(a);let i=0;for(let e=0;e<s.length;e++)o.has(s[e])||i++;const l=new _r([i],n.dtype),c=new _r([i],"int32");for(let e=0,t=0;e<s.length;e++)o.has(s[e])||(l.values[t]=s[e],c.values[t]=e,t++);return[l.toTensor(),c.toTensor()]};
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
 */const Rl=os({sign_:function(e){const t={x:rs(e,"x","sign")};return Kr.runKernel(Gt,t)}});
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
 */const Fl=os({sin_:function(e){const t={x:rs(e,"x","sin","float32")};return Kr.runKernel("Sin",t)}});
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
 */const zl=os({sinh_:function(e){const t={x:rs(e,"x","sinh")};return Kr.runKernel(Vt,t)}});
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
 */const Bl=os({slice1d_:function(e,t,n){const r=rs(e,"x","slice1d");return u(1===r.rank,(()=>`slice1d expects a rank-1 tensor, but got a rank-${r.rank} tensor`)),Wo(r,[t],[n])}});
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
 */const Pl=os({slice2d_:function(e,t,n){const r=rs(e,"x","slice2d");return u(2===r.rank,(()=>`slice2d expects a rank-2 tensor, but got a rank-${r.rank} tensor`)),Wo(r,t,n)}});
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
 */const jl=os({slice3d_:function(e,t,n){const r=rs(e,"x","slice3d");return u(3===r.rank,(()=>`slice3d expects a rank-3 tensor, but got a rank-${r.rank} tensor`)),Wo(r,t,n)}});
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
 */const Vl=os({slice4d_:function(e,t,n){const r=rs(e,"x","slice4d");return u(4===r.rank,(()=>`slice4d expects a rank-4 tensor, but got a rank-${r.rank} tensor`)),Wo(r,t,n)}});
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
 */const Gl=os({softmax_:function(e,t=-1){const n=rs(e,"logits","softmax","float32");if(-1===t&&(t=n.rank-1),t!==n.rank-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and dim was ${t}`);const r={logits:n},s={dim:t};return Kr.runKernel(Zt,r,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Wl=os({fft_:function(e){u("complex64"===e.dtype,(()=>`The dtype for tf.spectral.fft() must be complex64 but got ${e.dtype}.`));const t={input:e};return Kr.runKernel("FFT",t)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ul=os({ifft_:function(e){u("complex64"===e.dtype,(()=>`The dtype for tf.spectral.ifft() must be complex64 but got ${e.dtype}.`));const t={input:e};return Kr.runKernel(qe,t)}});
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
 */const ql=os({irfft_:function(e){const t=e.shape[e.shape.length-1],n=e.size/t;let r;if(t<=2){const s=Bo(e,[n,t]);r=Ul(s)}else{const s=[n,2*(t-1)],a=Bo(ka(e),[n,t]),o=Bo(Sa(e),[n,t]),i=El(Wo(a,[0,1],[n,t-2]),1),u=ho(El(Wo(o,[0,1],[n,t-2]),1),zi(-1)),l=Vo([a,i],1),c=Vo([o,u],1),p=Bo(is(l,c),[s[0],s[1]]);r=Ul(p)}if(r=ka(r),3===e.rank&&0!==e.shape[0]){const t=r,n=e.shape[0];r=Bo(r,[n,r.shape[0]/n,r.shape[1]]),t.dispose()}return r}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Hl=os({split_:function(e,t,n=0){const r={x:rs(e,"x","split")},s={numOrSizeSplits:t,axis:n};return Kr.runKernel(Kt,r,s)}});
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
 */const Kl=os({rfft_:function(e,t){u("float32"===e.dtype,(()=>`The dtype for rfft() must be real value but got ${e.dtype}`));let n=e.shape[e.shape.length-1];const r=e.size/n;let s;if(null!=t&&t<n){const r=e.shape.map((e=>0)),a=e.shape.map((e=>e));a[e.shape.length-1]=t,s=Wo(e,r,a),n=t}else if(null!=t&&t>n){const r=e.shape.map((e=>e));r[e.shape.length-1]=t-n,s=Vo([e,Au(r)],e.shape.length-1),n=t}else s=e;const a=Ei(s),o=Bo(is(s,a),[r,n]),i=Wl(o),l=Math.floor(n/2)+1,c=ka(i),p=Sa(i),h=Hl(c,[l,n-l],c.shape.length-1),d=Hl(p,[l,n-l],p.shape.length-1),m=s.shape.slice();return m[s.shape.length-1]=l,Bo(is(h[0],d[0]),m)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Zl=os({squaredDifference_:function(e,t){let n=rs(e,"a","squaredDifference"),r=rs(t,"b","squaredDifference");[n,r]=Br(n,r),Da(n.shape,r.shape);const s={a:n,b:r};return Kr.runKernel(tn,s,{})}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Yl=os({squeeze_:function(e,t){const n=rs(e,"x","squeeze","string_or_numeric");return Bo(n,y(n.shape,t).newShape)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ql=os({stack_:function(e,t=0){const n=ss(e,"tensors","stack","string_or_numeric");u(n.length>=1,(()=>"Pass at least one tensor to tf.stack")),n.length>0&&u(t<=n[0].rank,(()=>"Axis must be <= rank of the tensor"));const r=n,s={axis:t};return Kr.runKernel(xt,r,s)}});
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
 */const Jl=os({step_:function(e,t=0){const n={x:rs(e,"x","step")},r={alpha:t};return Kr.runKernel(gn,n,r)}});
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
 */const Xl=os({stridedSlice_:function(e,t,n,r,s=0,a=0,o=0,i=0,u=0){const l={x:rs(e,"x","stridedSlice","string_or_numeric")},c={begin:t,end:n,strides:r,beginMask:s,endMask:a,ellipsisMask:o,newAxisMask:i,shrinkAxisMask:u};return Kr.runKernel(nn,l,c)}});
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
 */const ec=os({tan_:function(e){const t={x:rs(e,"x","tan","float32")};return Kr.runKernel("Tan",t)}});
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
 */function tc(e,t){c(e);const n=es(e,t);if(1!==n.length)throw new Error("tensor1d() requires values to be a flat/TypedArray");return us(e,null,n,t)}
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
 */function nc(e,t,n){if(c(e),null!=t&&2!==t.length)throw new Error("tensor2d() requires shape to have two numbers");const r=es(e,n);if(2!==r.length&&1!==r.length)throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");if(1===r.length&&null==t)throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");return us(e,t,r,n)}
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
 */function rc(e,t,n){if(c(e),null!=t&&4!==t.length)throw new Error("tensor4d() requires shape to have four numbers");const r=es(e,n);if(4!==r.length&&1!==r.length)throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");if(1===r.length&&null==t)throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");return us(e,t,r,n)}
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
 */function sc(e,t,n){if(c(e),null!=t&&5!==t.length)throw new Error("tensor5d() requires shape to have five numbers");const r=es(e,n);if(5!==r.length&&1!==r.length)throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");if(1===r.length&&null==t)throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");return us(e,t,r,n)}
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
 */function ac(e,t,n){if(c(e),null!=t&&6!==t.length)throw new Error("tensor6d() requires shape to have six numbers");const r=es(e,n);if(6!==r.length&&1!==r.length)throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");if(1===r.length&&null==t)throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");return us(e,t=t||r,r,n)}
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
 */const oc=os({topk_:function(e,t=1,n=!0){const r=rs(e,"x","topk");if(0===r.rank)throw new Error("topk() expects the input to be of rank 1 or higher");const s=r.shape[r.shape.length-1];if(t<0)throw new Error(`'k' passed to topk() must be >= 0 but got ${t}`);if(t>s)throw new Error(`'k' passed to topk() must be <= the last dimension (${s}) but got ${t}`);const a={x:r},o={k:t,sorted:n},[i,u]=Kr.runKernel(ln,a,o);return{values:i,indices:u}}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ic=os({truncatedNormal_:function(e,t=0,n=1,r,s){if(null!=r&&"bool"===r)throw new Error("Unsupported data type $ { dtype }");const a=new fl(t,n,r,!0,s),o=Xs(e,r);for(let e=0;e<o.values.length;e++)o.values[e]=a.nextValue();return o.toTensor()}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const uc=os({unique_:function(e,t=0){const n=rs(e,"x","unique","string_or_numeric");u(n.rank>0,(()=>"The input tensor must be at least 1D"));const r={x:n},s={axis:t},[a,o]=Kr.runKernel(hn,r,s);return{values:a,indices:o}}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const lc=os({unsortedSegmentSum_:function(e,t,n){const r=rs(e,"x","unsortedSegmentSum"),s=rs(t,"segmentIds","unsortedSegmentSum","int32");u(m(n),(()=>"numSegments must be of dtype int"));const a={x:r,segmentIds:s},o={numSegments:n};return Kr.runKernel(mn,a,o)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const cc=os({unstack_:function(e,t=0){const n=rs(e,"x","unstack","string_or_numeric");u(t>=-n.shape.length&&t<n.shape.length,(()=>`Axis = ${t} is not in [-${n.shape.length}, ${n.shape.length})`));const r={value:n},s={axis:t};return Kr.runKernel(dn,r,s)}});
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
 */function pc(e,t){return Su(e,t,"right")}
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
 */function hc(e,t=!0,n,r){return Kr.makeVariable(e,t,n,r)}
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
 */function dc(e,t){const n=[];for(let e=0;e<t.length;e++)t[e]&&n.push(e);const r=Xs(e,"int32"),s=Xs([n.length,e.length],"int32");for(let t=0;t<n.length;t++){const a=r.indexToLoc(n[t]),o=t*e.length;s.values.set(a,o)}return s.toTensor()}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const mc=async function(e){const t=rs(e,"condition","whereAsync","bool"),n=await t.data(),r=dc(t.shape,n);return e!==t&&t.dispose(),r};
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
 */const fc=async function(e,t,n){const r=rs(e,"tensor","boolMask"),s=rs(t,"mask","boolMask","bool"),a=null==n?0:n,o=s.rank,i=r.shape;u(o>0,(()=>"mask cannot be scalar")),l(i.slice(a,a+o),s.shape,"mask's shape must match the first K dimensions of tensor's shape,");let c=1;for(let e=a;e<a+o;e++)c*=i[e];const p=i.slice(0,a).concat([c],i.slice(a+o)),h=Bo(r,p),d=Bo(s,[-1]),m=await mc(d),f=Yl(m,[1]),g=Qi(h,f,a);return e!==r&&r.dispose(),t!==s&&s.dispose(),f.dispose(),h.dispose(),d.dispose(),m.dispose(),g};
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
 */const gc=os({movingAverage_:function(e,t,n,r,s=!0){const a=rs(e,"v","movingAverage"),o=rs(t,"x","movingAverage"),i=rs(n,"decay","movingAverage");Pr(a,o),u(d(a.shape,o.shape),(()=>"Shape mismatch in v and x"));const l=zi(1),c=fu(l,i);let p=ho(fu(o,a),c);if(s){u(null!=r,(()=>"When using zeroDebias: true, step is required."));const e=rs(r,"step","movingAverage");p=po(p,fu(l,Fi(i,e)))}return lo(a,p)}});
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
 */const yc=os({scatterND_:function(e,t,n){const r=rs(e,"indices","scatterND","int32"),s=rs(t,"updates","scatterND");Va(s,r,n);const a={indices:r,updates:s},o={shape:n};return Kr.runKernel(Ft,a,o)}});const bc=os({sparseToDense_:
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
function(e,t,n,r=0){const s=rs(e,"sparseIndices","sparseToDense","int32"),a=rs(t,"sparseValues","sparseToDense","string_or_numeric"),o=rs(r,"defaultValue","sparseToDense",a.dtype);!function(e,t,n,r){if("int32"!==e.dtype)throw new Error(`tf.sparseToDense() expects the indices to be int32 type, but the dtype was ${e.dtype}.`);if(e.rank>2)throw new Error(`sparseIndices should be a scalar, vector, or matrix, but got shape ${e.shape}.`);const s=e.rank>0?e.shape[0]:1,a=e.rank>1?e.shape[1]:1;if(n.length!==a)throw new Error(`outputShape has incorrect number of elements:, ${n.length}, should be: ${a}.`);const o=t.size;if(0!==t.rank&&(1!==t.rank||o!==s))throw new Error(`sparseValues has incorrect shape ${t.shape}, should be [] or [${s}]`);if(t.dtype!==r.dtype)throw new Error("sparseValues.dtype must match defaultValues.dtype")}(s,a,n,o);const i={sparseIndices:s,sparseValues:a,defaultValue:o},u={outputShape:n};return Kr.runKernel(en,i,u)}});
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
 */const wc=os({gatherND_:function(e,t){const n=rs(t,"indices","gatherND","int32"),r={params:rs(e,"x","gatherND","string_or_numeric"),indices:n};return Kr.runKernel(Ve,r)}});
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
 */const xc=os({dropout_:
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
function(e,t,n,r){const s=rs(e,"x","dropout");if(u("float32"===s.dtype,(()=>`x has to be a floating point tensor since it's going to be scaled, but got a ${s.dtype} tensor instead.`)),u(t>=0&&t<1,(()=>`rate must be a float in the range [0, 1), but got ${t}.`)),0===t)return e instanceof Ar?s.clone():s;const a=function(e,t){if(null==t)return e.shape.slice();if(d(e.shape,t))return t;if(e.shape.length===t.length){const n=[];for(let r=0;r<e.shape.length;r++)null==t[r]&&null!=e.shape[r]?n.push(e.shape[r]):n.push(t[r]);return n}return t}(s,n),o=1-t,i=po(Yi(lo(Nl(a,0,1,"float32",r),o)),o);return ho(s,i)}});
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
 */function Nc(e){return Math.floor(Math.pow(2,Math.ceil(Math.log(e)/Math.log(2))))}function vc(e,t,n){const r=1-e%2,s=new Float32Array(e);for(let a=0;a<e;++a){const o=2*Math.PI*a/(e+r-1);s[a]=t-n*Math.cos(o)}return tc(s,"float32")}
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
 */const Sc=async function(e,t,n=1){const r=rs(e,"predictions","inTopK"),s=rs(t,"targets","inTopK");u(r.rank>1,(()=>`inTopK() expects the predictions to be of rank 2 or higher, but got ${r.rank}`)),u(r.rank-1===s.rank,(()=>`predictions rank should be 1 larger than targets rank, but got predictions rank ${r.rank} and targets rank ${s.rank}`)),l(r.shape.slice(0,r.shape.length-1),s.shape,"predictions's shape should be align with the targets' shape, except the last dimension.");const a=r.shape[r.shape.length-1];u(n>0&&n<=a,(()=>`'k' passed to inTopK() must be > 0 && <= the predictions last dimension (${a}), but got ${n}`));const o=await r.data(),i=await s.data(),[c,p]=[o.length/a,a],h=b("bool",c);for(let e=0;e<c;e++){const t=e*p,r=o.subarray(t,t+p),s=[];for(let e=0;e<r.length;e++)s.push({value:r[e],index:e});s.sort(((e,t)=>t.value-e.value)),h[e]=0;for(let t=0;t<n;t++)if(s[t].index===i[e]){h[e]=1;break}}return e!==r&&r.dispose(),t!==s&&s.dispose(),ls(h,s.shape,"bool")};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Tc=os({conv2DBackpropFilter_:function(e,t,n,r,s,a="NHWC",o){let i=e;3===e.rank&&(i=Bo(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let l=t;3===l.rank&&(l=Bo(t,[1,t.shape[0],t.shape[1],t.shape[2]])),u(4===i.rank,(()=>`Error in conv2dDerFilter: input must be rank 4, but got shape ${i.shape}.`)),u(4===l.rank,(()=>`Error in conv2dDerFilter: dy must be rank 4, but got shape ${l.shape}.`)),u(4===n.length,(()=>`Error in conv2dDerFilter: filterShape must be length 4, but got ${n}.`));const c="NHWC"===a?i.shape[3]:i.shape[1],p="NHWC"===a?l.shape[3]:l.shape[1];u(c===n[2],(()=>`Error in conv2dDerFilter: depth of input ${c}) must match input depth in filter (${n[2]}.`)),u(p===n[3],(()=>`Error in conv2dDerFilter: depth of dy (${p}) must match output depth for filter (${n[3]}).`)),zo("conv2dDerFilter",s,o);const h={x:i,dy:l},d={strides:r,pad:s,dataFormat:a,dimRoundingMode:o,filterShape:n};return Kr.runKernel(ge,h,d)}});
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
 */function kc(e,t,n){if(null==n||"linear"===n)return e;if("relu"===n)return ho(e,Jl(t));throw new Error(`Cannot compute gradient for fused activation ${n}.`)}function Ec(e,t){let n=t;const r=Aa(e.shape,t.shape);return r.length>0&&(n=ji(n,r)),Bo(n,e.shape)}function _c(e,t,n,r){if("linear"===t)return e;if("relu"===t)return Tl(e);if("elu"===t)return Ai(e);if("relu6"===t)return kl(e);if("prelu"===t)return Zu(e,n);if("leakyrelu"===t)return ru(e,r);if("sigmoid"===t)return Go(e);throw new Error(`Unknown fused activation ${t}.`)}const Mc=(e,t)=>!(e>0)||"linear"===t;
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
 */const Ic=os({fusedConv2d_:function({x:e,filter:t,strides:n,pad:r,dataFormat:s="NHWC",dilations:a=[1,1],dimRoundingMode:o,bias:i,activation:l="linear",preluActivationWeights:c,leakyreluAlpha:p}){if(l=l||"linear",!1===Mc(Kr.state.gradientDepth,l)){u("NHWC"===s,(()=>`Error in fused conv2d: got dataFormat of ${s} but only NHWC is currently supported for the case of gradient depth is 0 and the activation is not linear.`));let h=ui(e,t,n,r,s,a,o);return null!=i&&(h=lo(h,i)),_c(h,l,c,p)}const h=rs(e,"x","conv2d","float32"),d=rs(t,"filter","conv2d","float32");let m=h,f=!1;3===h.rank&&(f=!0,m=Bo(h,[1,h.shape[0],h.shape[1],h.shape[2]])),u(4===m.rank,(()=>`Error in fused conv2d: input must be rank 4, but got rank ${m.rank}.`)),u(4===d.rank,(()=>`Error in fused conv2d: filter must be rank 4, but got rank ${d.rank}.`)),zo("fused conv2d",r,o);const g="NHWC"===s?m.shape[3]:m.shape[1];u(d.shape[2]===g,(()=>`Error in conv2d: depth of input (${g}) must match input depth for filter ${d.shape[2]}.`)),u(Ro(n,a),(()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`));const y=Mo(m.shape,d.shape,n,a,r,o);let b,w;if(null!=i&&(b=rs(i,"bias","fused conv2d"),[b]=Br(b,h),"NHWC"===s?Da(y.outShape,b.shape):(u(b.shape.length<=1,(()=>`Error in fused conv2d: only supports scalar or 1-D Tensor bias for NCHW format but got the bias of rank-${b.shape.length}.`)),u(0===b.shape.length||b.shape[0]===y.outChannels||1===b.shape[0],(()=>`Error in fused conv2d: bias shape (${b.shape}) is not compatible with the number of output channels (${y.outChannels})`)))),null!=c){const e=c.shape;if(u(e.length<=1||3===e.length,(()=>`Error in fused conv2d: only supports scalar, 1-D Tensor or 3-D Tensor PReLU activation weights but got a tensor of rank-${e.length}.`)),1===e.length)u(1===e[0]||e[0]===y.outChannels,(()=>`Error in fused conv2d: PReLU activation weights (${e}) is not compatible with the number of output channels (${y.outChannels}).`));else if(3===e.length)try{Da(e,y.outShape)}catch(t){const n=`Error in fused conv2d: PReLU activation weights (${e}) is not compatible with the output shape of the conv2d (${y.outShape}).`;throw Error(n)}w=rs(c,"prelu weights","fused conv2d")}const x=(e,t)=>{u("NHWC"===s,(()=>`Error in gradient of fused conv2D: got dataFormat of ${s} but only NHWC is currently supported.`));const[o,i,c,p]=t,h=kc(e,c,l);u(Co(a),(()=>`Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${a}'`));const d=[ci(i.shape,h,o,n,r),Tc(i,h,o.shape,n,r)];if(null!=p){const e=Ec(p,h);d.push(e)}return d},N={x:m,filter:d,bias:b,preluActivationWeights:w},v={strides:n,pad:r,dataFormat:s,dilations:a,dimRoundingMode:o,activation:l,leakyreluAlpha:p};if(null==i){const e=pu(((e,t,n)=>{let r=Kr.runKernel(xn,N,v);return n([t,e,r]),f&&(r=Bo(r,[r.shape[1],r.shape[2],r.shape[3]])),{value:r,gradFunc:x}}));return e(m,d)}{const e=pu(((e,t,n,r)=>{let s=Kr.runKernel(xn,N,v);return r([t,e,s,n]),f&&(s=Bo(s,[s.shape[1],s.shape[2],s.shape[3]])),{value:s,gradFunc:x}}));return e(m,d,b)}}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ac=os({depthwiseConv2dNativeBackpropFilter_:function(e,t,n,r,s,a=[1,1],o){let i=e;3===e.rank&&(i=Bo(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let u=t;3===u.rank&&(u=Bo(t,[1,t.shape[0],t.shape[1],t.shape[2]]));const l={x:i,dy:u},c={strides:r,pad:s,dimRoundingMode:o,dilations:a,filterShape:n};return Kr.runKernel(_e,l,c)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Dc=os({depthwiseConv2dNativeBackpropInput_:function(e,t,n,r,s,a=[1,1],o){let i=t,u=!1;3===t.rank&&(u=!0,i=Bo(t,[1,t.shape[0],t.shape[1],t.shape[2]]));const l={dy:i,filter:n},c={strides:r,pad:s,dimRoundingMode:o,dilations:a,inputShape:e},p=Kr.runKernel(Me,l,c);return u?Bo(p,[p.shape[1],p.shape[2],p.shape[3]]):p}});
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
 */const $c=os({fusedDepthwiseConv2d_:function({x:e,filter:t,strides:n,pad:r,dataFormat:s="NHWC",dilations:a=[1,1],dimRoundingMode:o,bias:i,activation:l="linear",preluActivationWeights:c,leakyreluAlpha:p}){if(!1===Mc(Kr.state.gradientDepth,l)){let u=Ni(e,t,n,r,s,a,o);return null!=i&&(u=lo(u,i)),_c(u,l,c,p)}const h=rs(e,"x","depthwiseConv2d","float32"),d=rs(t,"filter","depthwiseConv2d","float32");let m=h,f=!1;3===h.rank&&(f=!0,m=Bo(h,[1,h.shape[0],h.shape[1],h.shape[2]])),u(4===m.rank,(()=>`Error in fused depthwiseConv2d: input must be rank 4, but got rank ${m.rank}.`)),u(4===d.rank,(()=>`Error in fused depthwiseConv2d: filter must be rank 4, but got rank ${d.rank}.`)),u(m.shape[3]===d.shape[2],(()=>`Error in fused depthwiseConv2d: number of input channels (${m.shape[3]}) must match the inChannels dimension in filter ${d.shape[2]}.`)),null==a&&(a=[1,1]),u(Ro(n,a),(()=>`Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`)),zo("fused depthwiseConv2d",r,o);const g=Mo(m.shape,d.shape,n,a,r,o,!0);let y,b;null!=i&&(y=rs(i,"bias","fused conv2d"),[y]=Br(y,h),Da(g.outShape,y.shape)),null!=c&&(b=rs(c,"prelu weights","fused depthwiseConv2d"));const w=(e,t)=>{u(Co(a),(()=>`Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '${a}'`));const[s,i,c,p]=t,h=kc(e,c,l),d=Dc(i.shape,h,s,n,r,a,o),m=Ac(i,h,s.shape,n,r,a,o);if(null!=p){return[d,m,Ec(y,h)]}return[d,m]},x={x:m,filter:d,bias:y,preluActivationWeights:b},N={strides:n,pad:r,dataFormat:s,dilations:a,dimRoundingMode:o,activation:l,leakyreluAlpha:p};if(null==i){const e=pu(((e,t,n)=>{let r=Kr.runKernel(Nn,x,N);return n([t,e,r]),f&&(r=Bo(r,[r.shape[1],r.shape[2],r.shape[3]])),{value:r,gradFunc:w}}));return e(m,d)}{const e=pu(((e,t,n,r)=>{let s=Kr.runKernel(Nn,x,N);return r([t,e,s,n]),f&&(s=Bo(s,[s.shape[1],s.shape[2],s.shape[3]])),{value:s,gradFunc:w}}));return e(m,d,y)}}});
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
 */const Oc=os({fusedMatMul_:function({a:e,b:t,transposeA:n=!1,transposeB:r=!1,bias:s,activation:a="linear",preluActivationWeights:o,leakyreluAlpha:i=.2}){if(!1===Mc(Kr.state.gradientDepth,a)){let u=ba(e,t,n,r);return null!=s&&(u=lo(u,s)),_c(u,a,o,i)}let l=rs(e,"a","fused matMul"),c=rs(t,"b","fused matMul");[l,c]=Br(l,c);const p=n?l.shape[l.rank-2]:l.shape[l.rank-1],d=r?c.shape[c.rank-1]:c.shape[c.rank-2],m=n?l.shape[l.rank-1]:l.shape[l.rank-2],f=r?c.shape[c.rank-2]:c.shape[c.rank-1],g=l.shape.slice(0,-2),y=c.shape.slice(0,-2),b=h(g),w=h(y);u(p===d,(()=>`Error in fused matMul: inner shapes (${p}) and (${d}) of Tensors with shapes ${l.shape} and ${c.shape} and transposeA=${n} and transposeB=${r} must match.`));const x=Da(l.shape.slice(0,-2),c.shape.slice(0,-2)).concat([m,f]),N=Bo(l,n?[b,p,m]:[b,m,p]),v=Bo(c,r?[w,f,d]:[w,d,f]);let S,T;null!=s&&(S=rs(s,"bias","fused matMul"),[S]=Br(S,l),Da(x,S.shape)),null!=o&&(T=rs(o,"prelu weights","fused matMul"));const k=(e,t)=>{const[o,i,u,l]=t,c=kc(Bo(e,u.shape),u,a);let p,h;if(n||r?!n&&r?(p=ba(c,i,!1,!1),h=ba(c,o,!0,!1)):n&&!r?(p=ba(i,c,!1,!0),h=ba(o,c,!1,!1)):(p=ba(i,c,!0,!0),h=ba(c,o,!0,!0)):(p=ba(c,i,!1,!0),h=ba(o,c,!0,!1)),null!=s){return[p,h,Ec(l,c)]}return[p,h]},E={a:N,b:v,bias:S,preluActivationWeights:T},_={transposeA:n,transposeB:r,activation:a,leakyreluAlpha:i};if(null==s){const e=pu(((e,t,n)=>{const r=Kr.runKernel(wn,E,_);return n([e,t,r]),{value:Bo(r,x),gradFunc:k}}));return e(N,v)}{const e=pu(((e,t,n,r)=>{const s=Kr.runKernel(wn,E,_);return r([e,t,s,n]),{value:Bo(s,x),gradFunc:k}}));return e(N,v,S)}}});
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
 */var Lc=Object.freeze({__proto__:null,conv2d:Ic,depthwiseConv2d:$c,matMul:Oc});
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
 */const Cc=os({hammingWindow_:function(e){return vc(e,.54,.46)}});
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
 */const Rc=os({hannWindow_:function(e){return vc(e,.5,.5)}});
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
 */const Fc=os({frame_:function(e,t,n,r=!1,s=0){let a=0;const o=[];for(;a+t<=e.size;)o.push(Wo(e,a,t)),a+=n;if(r)for(;a<e.size;){const r=a+t-e.size,i=Vo([Wo(e,a,t-r),ni([r],s)]);o.push(i),a+=n}return 0===o.length?nc([],[0,t]):Bo(Vo(o),[o.length,t])}});
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
 */const zc=os({stft_:function(e,t,n,r,s=Rc){null==r&&(r=Nc(t));const a=Fc(e,t,n),o=ho(a,s(t));return Kl(o,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Bc=os({cropAndResize_:function(e,t,n,r,s="bilinear",a=0){const o=rs(e,"image","cropAndResize"),i=rs(t,"boxes","cropAndResize","float32"),l=rs(n,"boxInd","cropAndResize","int32"),c=i.shape[0];u(4===o.rank,(()=>`Error in cropAndResize: image must be rank 4,but got rank ${o.rank}.`)),u(2===i.rank&&4===i.shape[1],(()=>`Error in cropAndResize: boxes must be have size [${c},4] but had shape ${i.shape}.`)),u(1===l.rank&&l.shape[0]===c,(()=>`Error in cropAndResize: boxInd must be have size [${c}] but had shape ${i.shape}.`)),u(2===r.length,(()=>`Error in cropAndResize: cropSize must be of length 2, but got length ${r.length}.`)),u(r[0]>=1&&r[1]>=1,(()=>`cropSize must be atleast [1,1], but was ${r}`)),u("bilinear"===s||"nearest"===s,(()=>`method must be bilinear or nearest, but was ${s}`));const p={image:o,boxes:i,boxInd:l},h={method:s,extrapolationValue:a,cropSize:r};return Kr.runKernel(Se,p,h)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Pc=os({flipLeftRight_:function(e){const t=rs(e,"image","flipLeftRight","float32");u(4===t.rank,(()=>`Error in flipLeftRight: image must be rank 4,but got rank ${t.rank}.`));const n={image:t};return Kr.runKernel(Fe,n,{})}});
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
 */const jc=os({grayscaleToRGB_:function(e){const t=rs(e,"image","grayscaleToRGB"),n=t.rank-1,r=t.shape[n];u(t.rank>=2,(()=>`Error in grayscaleToRGB: images must be at least rank 2, but got rank ${t.rank}.`)),u(1===r,(()=>`Error in grayscaleToRGB: last dimension of a grayscale image should be size 1, but got size ${r}.`));const s=new Array(t.rank);return s.fill(1,0,n),s[n]=3,Ki(t,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Vc=os({rotateWithOffset_:function(e,t,n=0,r=.5){const s=rs(e,"image","rotateWithOffset","float32");u(4===s.rank,(()=>`Error in rotateWithOffset: image must be rank 4,but got rank ${s.rank}.`));const a={image:s},o={radians:t,fillValue:n,center:r};return Kr.runKernel(bn,a,o)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gc(e,t,n,r,s,a){null==r&&(r=.5),null==s&&(s=Number.NEGATIVE_INFINITY),null==a&&(a=0);const o=e.shape[0];return n=Math.min(n,o),u(0<=r&&r<=1,(()=>`iouThreshold must be in [0, 1], but was '${r}'`)),u(2===e.rank,(()=>`boxes must be a 2D tensor, but was of rank '${e.rank}'`)),u(4===e.shape[1],(()=>`boxes must have 4 columns, but 2nd dimension was ${e.shape[1]}`)),u(1===t.rank,(()=>"scores must be a 1D tensor")),u(t.shape[0]===o,(()=>`scores has incompatible shape with boxes. Expected ${o}, but was ${t.shape[0]}`)),u(0<=a&&a<=1,(()=>`softNmsSigma must be in [0, 1], but was '${a}'`)),{maxOutputSize:n,iouThreshold:r,scoreThreshold:s,softNmsSigma:a}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Wc=os({nonMaxSuppression_:function(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY){const a=rs(e,"boxes","nonMaxSuppression","float32"),o=rs(t,"scores","nonMaxSuppression","float32"),i=Gc(a,o,n,r,s),u={maxOutputSize:n=i.maxOutputSize,iouThreshold:r=i.iouThreshold,scoreThreshold:s=i.scoreThreshold};return Kr.runKernel(ft,{boxes:a,scores:o},u)}});
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
 */function Uc(e,t,n){const r=function(e,t,n){return function(e,t,n){let r=0,s=e.length,a=0,o=!1;for(;r<s;){a=r+(s-r>>>1);const i=n(t,e[a]);i>0?r=a+1:(s=a,o=!i)}return o?r:-r-1}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */(e,t,n||qc)}(e,t,n),s=r<0?-(r+1):r;e.splice(s,0,t)}function qc(e,t){return e>t?1:e<t?-1:0}function Hc(e,t,n,r,s){return Yc(e,t,n,r,s,0)}function Kc(e,t,n,r,s,a){return Yc(e,t,n,r,s,0,!1,a,!0)}function Zc(e,t,n,r,s,a){return Yc(e,t,n,r,s,a,!0)}function Yc(e,t,n,r,s,a,o=!1,i=!1,u=!1){const l=[];for(let e=0;e<t.length;e++)t[e]>s&&l.push({score:t[e],boxIndex:e,suppressBeginIndex:0});l.sort(Xc);const c=a>0?-.5/a:0,p=[],h=[];for(;p.length<n&&l.length>0;){const t=l.pop(),{score:n,boxIndex:a,suppressBeginIndex:o}=t;if(n<s)break;let i=!1;for(let n=p.length-1;n>=o;--n){const o=Qc(e,a,p[n]);if(o>=r){i=!0;break}if(t.score=t.score*Jc(r,c,o),t.score<=s)break}t.suppressBeginIndex=p.length,i||(t.score===n?(p.push(a),h.push(t.score)):t.score>s&&Uc(l,t,Xc))}const d=p.length,m=n-d;i&&m>0&&(p.push(...new Array(m).fill(0)),h.push(...new Array(m).fill(0)));const f={selectedIndices:p};return o&&(f.selectedScores=h),u&&(f.validOutputs=d),f}function Qc(e,t,n){const r=e.subarray(4*t,4*t+4),s=e.subarray(4*n,4*n+4),a=Math.min(r[0],r[2]),o=Math.min(r[1],r[3]),i=Math.max(r[0],r[2]),u=Math.max(r[1],r[3]),l=Math.min(s[0],s[2]),c=Math.min(s[1],s[3]),p=Math.max(s[0],s[2]),h=Math.max(s[1],s[3]),d=(i-a)*(u-o),m=(p-l)*(h-c);if(d<=0||m<=0)return 0;const f=Math.max(a,l),g=Math.max(o,c),y=Math.min(i,p),b=Math.min(u,h),w=Math.max(y-f,0)*Math.max(b-g,0);return w/(d+m-w)}function Jc(e,t,n){const r=Math.exp(t*n*n);return n<=e?r:0}function Xc(e,t){return e.score-t.score||e.score===t.score&&t.boxIndex-e.boxIndex}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ep=async function(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY){const a=rs(e,"boxes","nonMaxSuppressionAsync"),o=rs(t,"scores","nonMaxSuppressionAsync"),i=Gc(a,o,n,r,s);n=i.maxOutputSize,r=i.iouThreshold,s=i.scoreThreshold;const u=await Promise.all([a.data(),o.data()]),l=u[0],c=u[1],{selectedIndices:p}=Hc(l,c,n,r,s);return a!==e&&a.dispose(),o!==t&&o.dispose(),tc(p,"int32")};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const tp=os({nonMaxSuppressionWithScore_:function(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,a=0){const o=rs(e,"boxes","nonMaxSuppression"),i=rs(t,"scores","nonMaxSuppression"),u=Gc(o,i,n,r,s,a),l={boxes:o,scores:i},c={maxOutputSize:n=u.maxOutputSize,iouThreshold:r=u.iouThreshold,scoreThreshold:s=u.scoreThreshold,softNmsSigma:a=u.softNmsSigma},p=Kr.runKernel(yt,l,c);return{selectedIndices:p[0],selectedScores:p[1]}}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const np=async function(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,a=0){const o=rs(e,"boxes","nonMaxSuppressionAsync"),i=rs(t,"scores","nonMaxSuppressionAsync"),u=Gc(o,i,n,r,s,a);n=u.maxOutputSize,r=u.iouThreshold,s=u.scoreThreshold,a=u.softNmsSigma;const l=await Promise.all([o.data(),i.data()]),c=l[0],p=l[1],{selectedIndices:h,selectedScores:d}=Zc(c,p,n,r,s,a);return o!==e&&o.dispose(),i!==t&&i.dispose(),{selectedIndices:tc(h,"int32"),selectedScores:tc(d)}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const rp=os({nonMaxSuppressionPadded_:function(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,a=!1){const o=rs(e,"boxes","nonMaxSuppression"),i=rs(t,"scores","nonMaxSuppression"),u=Gc(o,i,n,r,s,null),l={boxes:o,scores:i},c={maxOutputSize:u.maxOutputSize,iouThreshold:u.iouThreshold,scoreThreshold:u.scoreThreshold,padToMaxOutputSize:a},p=Kr.runKernel(gt,l,c);return{selectedIndices:p[0],validOutputs:p[1]}}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const sp=async function(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,a=!1){const o=rs(e,"boxes","nonMaxSuppressionAsync"),i=rs(t,"scores","nonMaxSuppressionAsync"),u=Gc(o,i,n,r,s,null),l=u.maxOutputSize,c=u.iouThreshold,p=u.scoreThreshold,[h,d]=await Promise.all([o.data(),i.data()]),{selectedIndices:m,validOutputs:f}=Kc(h,d,l,c,p,a);return o!==e&&o.dispose(),i!==t&&i.dispose(),{selectedIndices:tc(m,"int32"),validOutputs:zi(f,"int32")}};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ap=os({resizeBilinear_:function(e,t,n=!1,r=!1){const s=rs(e,"images","resizeBilinear");u(3===s.rank||4===s.rank,(()=>`Error in resizeBilinear: x must be rank 3 or 4, but got rank ${s.rank}.`)),u(2===t.length,(()=>`Error in resizeBilinear: new shape must 2D, but got shape ${t}.`)),u(!1===r||!1===n,(()=>"Error in resizeBilinear: If halfPixelCenters is true, alignCorners must be false."));let a=s,o=!1;3===s.rank&&(o=!0,a=Bo(s,[1,s.shape[0],s.shape[1],s.shape[2]]));const i={images:a},l={alignCorners:n,halfPixelCenters:r,size:t},c=Kr.runKernel($t,i,l);return o?Bo(c,[c.shape[1],c.shape[2],c.shape[3]]):c}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const op=os({resizeNearestNeighbor_:function(e,t,n=!1,r=!1){const s=rs(e,"images","resizeNearestNeighbor");u(3===s.rank||4===s.rank,(()=>`Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank ${s.rank}.`)),u(2===t.length,(()=>`Error in resizeNearestNeighbor: new shape must 2D, but got shape ${t}.`)),u("float32"===s.dtype||"int32"===s.dtype,(()=>"`images` must have `int32` or `float32` as dtype")),u(!1===r||!1===n,(()=>"Error in resizeNearestNeighbor: If halfPixelCenters is true, alignCorners must be false."));let a=s,o=!1;3===s.rank&&(o=!0,a=Bo(s,[1,s.shape[0],s.shape[1],s.shape[2]]));const i={images:a},l={alignCorners:n,halfPixelCenters:r,size:t},c=Kr.runKernel(Dt,i,l);return o?Bo(c,[c.shape[1],c.shape[2],c.shape[3]]):c}});
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
 */const ip=os({threshold_:function(e,t="binary",n=!1,r=.5){const s=rs(e,"image","threshold"),a=s.shape[0]*s.shape[1];let o,i,l,c,p=ho(tc([r]),255);if(u(3===s.rank,(()=>`Error in threshold: image must be rank 3,but got rank ${s.rank}.`)),u(3===s.shape[2]||1===s.shape[2],(()=>`Error in threshold: image color channel must be equal to 3 or 1but got ${s.shape[2]}.`)),u("int32"===s.dtype||"float32"===s.dtype,(()=>`Error in dtype: image dtype must be int32 or float32,but got dtype ${s.dtype}.`)),u("otsu"===t||"binary"===t,(()=>`Method must be binary or otsu, but was ${t}`)),3===s.shape[2]){[o,i,l]=Hl(s,[1,1,1],-1);const e=ho(o,.2989),t=ho(i,.587),n=ho(l,.114);c=lo(lo(e,t),n)}else c=e;if("otsu"===t){p=function(e,t){let n,r,s,a,o,i,u=tc([-1]),l=tc([0]),c=tc([0]);for(let p=0;p<e.size-1;p++){n=Wo(e,0,p+1),r=Wo(e,p+1),o=po(ji(n),t),i=po(ji(r),t);const h=ji(ho(n,vl(0,n.size)));s=po(h,ji(n));const d=ni(r.shape,n.size),m=lo(vl(0,r.size),d),f=ho(r,m);a=po(ji(f),ji(r));const g=fu(s,a),y=fu(s,a),b=ho(o,i);c=ho(ho(b,g),y);const w=Ji(c,l);l=ki(w,c,l),u=ki(w,tc([p]),u)}return u}(Jo(ea(Dl(c),"int32"),ls([]),256),a)}const h=n?au(c,p):Ji(c,p);return ea(ho(h,255),"int32")}});
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
 */const up=os({transform_:function(e,t,n="nearest",r="constant",s=0,a){const o=rs(e,"image","transform","float32"),i=rs(t,"transforms","transform","float32");u(4===o.rank,(()=>`Error in transform: image must be rank 4,but got rank ${o.rank}.`)),u(2===i.rank&&(i.shape[0]===o.shape[0]||1===i.shape[0])&&8===i.shape[1],(()=>"Error in transform: Input transform should be batch x 8 or 1 x 8")),u(null==a||2===a.length,(()=>`Error in transform: outputShape must be [height, width] or null, but got ${a}.`));const l={image:o,transforms:i},c={interpolation:n,fillMode:r,fillValue:s,outputShape:a};return Kr.runKernel(cn,l,c)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const lp=os({bandPart_:function(e,t,n){u(t%1==0,(()=>`bandPart(): numLower must be an integer, got ${t}.`)),u(n%1==0,(()=>`bandPart(): numUpper must be an integer, got ${n}.`));const r=rs(e,"a","bandPart");u(r.rank>=2,(()=>`bandPart(): Rank must be at least 2, got ${r.rank}.`));const s=r.shape,[a,o]=r.shape.slice(-2);if(!(t<=a))throw new Error(`bandPart(): numLower (${t}) must not be greater than the number of rows (${a}).`);if(!(n<=o))throw new Error(`bandPart(): numUpper (${n}) must not be greater than the number of columns (${o}).`);t<0&&(t=a),n<0&&(n=o);const i=Bo(vl(0,a,1,"int32"),[-1,1]),l=vl(0,o,1,"int32"),c=fu(i,l),p=bu(au(c,zi(+t,"int32")),Xi(c,zi(-n,"int32"))),h=Au([a,o],r.dtype);return Bo(Ql(cc(Bo(r,[-1,a,o])).map((e=>ki(p,e,h)))),s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const cp=os({gramSchmidt_:function(e){let t;if(Array.isArray(e)){t=!1,u(null!=e&&e.length>0,(()=>"Gram-Schmidt process: input must not be null, undefined, or empty"));const n=e[0].shape[0];for(let t=1;t<e.length;++t)u(e[t].shape[0]===n,(()=>`Gram-Schmidt: Non-unique lengths found in the input vectors: (${e[t].shape[0]} vs. ${n})`))}else t=!0,e=Hl(e,e.shape[0],0).map((e=>Yl(e,[0])));u(e.length<=e[0].shape[0],(()=>`Gram-Schmidt: Number of vectors (${e.length}) exceeds number of dimensions (${e[0].shape[0]}).`));const n=[],r=e;for(let t=0;t<e.length;++t)n.push(Kr.tidy((()=>{let e=r[t];if(t>0)for(let r=0;r<t;++r){const t=ho(ji(ho(n[r],e)),n[r]);e=fu(e,t)}return po(e,Gi(e,"euclidean"))})));return t?Ql(n,0):n}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pp(e,t=!1){return Kr.tidy((()=>{u(2===e.shape.length,(()=>`qr2d() requires a 2D Tensor, but got a ${e.shape.length}D Tensor.`));const n=e.shape[0],r=e.shape[1];let s=Zi(n),a=ta(e);const o=nc([[1]],[1,1]);let i=ta(o);const l=n>=r?r:n;for(let e=0;e<l;++e){const t=a,u=i,l=s;[i,a,s]=Kr.tidy((()=>{const t=Wo(a,[e,e],[n-e,1]),u=Gi(t),l=Wo(a,[e,e],[1,1]),c=ki(Ji(l,0),nc([[-1]]),nc([[1]])),p=fu(l,ho(c,u)),h=po(t,p);i=1===h.shape[0]?ta(o):Vo([o,Wo(h,[1,0],[h.shape[0]-1,h.shape[1]])],0);const d=Ta(po(ba(c,p),u)),m=Wo(a,[e,0],[n-e,r]),f=ho(d,i),g=Ea(i);if(0===e)a=fu(m,ba(f,ba(g,m)));else{const t=fu(m,ba(f,ba(g,m)));a=Vo([Wo(a,[0,0],[e,r]),t],0)}const y=Ea(f),b=Wo(s,[0,e],[n,s.shape[1]-e]);if(0===e)s=fu(b,ba(ba(b,i),y));else{const t=fu(b,ba(ba(b,i),y));s=Vo([Wo(s,[0,0],[n,e]),t],1)}return[i,a,s]})),Na([t,u,l])}return!t&&n>r&&(s=Wo(s,[0,0],[n,r]),a=Wo(a,[0,0],[r,r])),[s,a]}))}const hp=os({qr_:function(e,t=!1){if(u(e.rank>=2,(()=>`qr() requires input tensor to have a rank >= 2, but got rank ${e.rank}`)),2===e.rank)return pp(e,t);{const n=e.shape.slice(0,e.shape.length-2).reduce(((e,t)=>e*t)),r=cc(Bo(e,[n,e.shape[e.shape.length-2],e.shape[e.shape.length-1]]),0),s=[],a=[];r.forEach((e=>{const[n,r]=pp(e,t);s.push(n),a.push(r)}));return[Bo(Ql(s,0),e.shape),Bo(Ql(a,0),e.shape)]}}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var dp;!function(e){e[e.NONE=0]="NONE",e[e.MEAN=1]="MEAN",e[e.SUM=2]="SUM",e[e.SUM_BY_NONZERO_WEIGHTS=3]="SUM_BY_NONZERO_WEIGHTS"}(dp||(dp={}));const mp=os({computeWeightedLoss_:function(e,t,n=dp.SUM_BY_NONZERO_WEIGHTS){const r=rs(e,"losses","computeWeightedLoss");let s=null;null!=t&&(s=rs(t,"weights","computeWeightedLoss"));const a=null==s?r:ho(r,s);if(n===dp.NONE)return a;if(n===dp.SUM)return ji(a);if(n===dp.MEAN){if(null==s)return Iu(a);{const e=r.size/s.size,t=po(ji(a),ji(s));return e>1?po(t,zi(e)):t}}if(n===dp.SUM_BY_NONZERO_WEIGHTS){if(null==s)return po(ji(a),zi(r.size));{const e=ho(s,Du(r.shape)),t=ea(ji(Bu(e,zi(0))),"float32");return po(ji(a),t)}}throw Error(`Unknown reduction: ${n}`)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const fp=os({absoluteDifference_:function(e,t,n,r=dp.SUM_BY_NONZERO_WEIGHTS){const s=rs(e,"labels","absoluteDifference"),a=rs(t,"predictions","absoluteDifference");let o=null;null!=n&&(o=rs(n,"weights","absoluteDifference")),l(s.shape,a.shape,"Error in absoluteDifference: ");const i=mo(fu(s,a));return mp(i,o,r)}});const gp=os({cosineDistance_:function(e,t,n,r,s=dp.SUM_BY_NONZERO_WEIGHTS){const a=rs(e,"labels","cosineDistance"),o=rs(t,"predictions","cosineDistance");let i=null;null!=r&&(i=rs(r,"weights","cosineDistance")),l(a.shape,o.shape,"Error in cosineDistance: ");const u=zi(1),c=fu(u,ji(ho(a,o),n,!0));return mp(c,i,s)}});const yp=os({hingeLoss_:function(e,t,n,r=dp.SUM_BY_NONZERO_WEIGHTS){let s=rs(e,"labels","hingeLoss");const a=rs(t,"predictions","hingeLoss");let o=null;null!=n&&(o=rs(n,"weights","hingeLoss")),l(s.shape,a.shape,"Error in hingeLoss: ");const i=zi(1);s=fu(ho(zi(2),s),i);const u=Tl(fu(i,ho(s,a)));return mp(u,o,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const bp=os({huberLoss_:function(e,t,n,r=1,s=dp.SUM_BY_NONZERO_WEIGHTS){const a=rs(e,"labels","huberLoss"),o=rs(t,"predictions","huberLoss");let i=null;null!=n&&(i=rs(n,"weights","huberLoss")),l(a.shape,o.shape,"Error in huberLoss: ");const u=zi(r),c=mo(fu(o,a)),p=Ou(c,u),h=fu(c,p),d=lo(ho(zi(.5),Pi(p)),ho(u,h));return mp(d,i,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const wp=os({logLoss_:function(e,t,n,r=1e-7,s=dp.SUM_BY_NONZERO_WEIGHTS){const a=rs(e,"labels","logLoss"),o=rs(t,"predictions","logLoss");let i=null;null!=n&&(i=rs(n,"weights","logLoss")),l(a.shape,o.shape,"Error in logLoss: ");const u=zi(1),c=zi(r),p=Ta(ho(a,uu(lo(o,c)))),h=ho(fu(u,a),uu(lo(fu(u,o),c))),d=fu(p,h);return mp(d,i,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const xp=os({meanSquaredError_:function(e,t,n,r=dp.SUM_BY_NONZERO_WEIGHTS){const s=rs(e,"labels","meanSquaredError"),a=rs(t,"predictions","meanSquaredError");let o=null;null!=n&&(o=rs(n,"weights","meanSquaredError")),l(s.shape,a.shape,"Error in meanSquaredError: ");const i=Zl(s,a);return mp(i,o,r)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Np=os({sigmoidCrossEntropy_:function(e,t,n,r=0,s=dp.SUM_BY_NONZERO_WEIGHTS){let a=rs(e,"multiClassLabels","sigmoidCrossEntropy");const o=rs(t,"logits","sigmoidCrossEntropy");let i=null;if(null!=n&&(i=rs(n,"weights","sigmoidCrossEntropy")),l(a.shape,o.shape,"Error in sigmoidCrossEntropy: "),r>0){const e=zi(r),t=zi(1),n=zi(.5);a=lo(ho(a,fu(t,e)),ho(n,e))}const u=function(e,t){const n=rs(e,"labels","sigmoidCrossEntropyWithLogits"),r=rs(t,"logits","sigmoidCrossEntropyWithLogits");l(n.shape,r.shape,"Error in sigmoidCrossEntropyWithLogits: ");const s=Tl(r),a=ho(r,n),o=lu(Ui(Ta(mo(r))));return lo(fu(s,a),o)}(a,o);return mp(u,i,s)}});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const vp=os({softmaxCrossEntropy_:function(e,t,n,r=0,s=dp.SUM_BY_NONZERO_WEIGHTS){let a=rs(e,"onehotLabels","softmaxCrossEntropy");const o=rs(t,"logits","softmaxCrossEntropy");let i=null;if(null!=n&&(i=rs(n,"weights","softmaxCrossEntropy")),l(a.shape,o.shape,"Error in softmaxCrossEntropy: "),r>0){const e=zi(r),t=zi(1),n=zi(a.shape[1]);a=lo(ho(a,fu(t,e)),po(e,n))}const u=function(e,t,n=-1){if(-1===n&&(n=t.rank-1),n!==t.rank-1)throw Error(`Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank ${t.rank} and dim was ${n}`);const r=pu(((e,t,r)=>{const s=yu(t,[n],!0),a=fu(ea(t,"float32"),s);r([e,a]);const o=Ta(ho(a,e));return{value:ji(o,[n]),gradFunc:(e,t)=>{const[r,s]=t,a=Li(e.shape,[n]);return[ho(Bo(e,a),fu(ea(r,"float32"),Ui(s))),ho(Bo(e,a),fu(Ui(s),ea(r,"float32")))]}}}));return r(e,t)}(a,o);return mp(u,i,s)}});
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
 */const Sp=os({sparseFillEmptyRows_:function(e,t,n,r){const s=rs(e,"indices","sparseFillEmptyRows","int32"),a=rs(t,"values","sparseFillEmptyRows"),o=rs(n,"denseShape","sparseFillEmptyRows","int32"),i=rs(r,"defaultValue","sparseFillEmptyRows",a.dtype);if(2!==s.rank)throw new Error(`Indices should be Tensor2D but received shape\n        ${s.shape}`);if(1!==a.rank)throw new Error(`Values should be Tensor1D but received shape ${a.shape}`);if(1!==o.rank)throw new Error(`Dense shape should be Tensor1D but received shape ${o.shape}`);if(0!==i.rank)throw new Error(`Default value should be a scalar but received shape ${i.shape}`);const u={indices:s,values:a,denseShape:o,defaultValue:i},l=Kr.runKernel(Yt,u);return{outputIndices:l[0],outputValues:l[1],emptyRowIndicator:l[2],reverseIndexMap:l[3]}}});
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
 */const Tp=os({sparseReshape_:function(e,t,n){const r=rs(e,"inputIndices","sparseReshape","int32"),s=rs(t,"inputShape","sparseReshape","int32"),a=rs(n,"newShape","sparseReshape","int32");if(2!==r.rank)throw new Error(`Input indices should be Tensor2D but received shape\n        ${r.shape}`);if(1!==s.rank)throw new Error(`Input shape should be Tensor1D but received shape ${s.shape}`);if(1!==a.rank)throw new Error(`New shape should be Tensor1D but received shape ${a.shape}`);const o={inputIndices:r,inputShape:s,newShape:a},i=Kr.runKernel(Qt,o);return{outputIndices:i[0],outputShape:i[1]}}});
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
 */const kp=os({sparseSegmentMean_:function(e,t,n){const r=rs(e,"data","sparseSegmentMean"),s=rs(t,"indices","sparseSegmentMean","int32"),a=rs(n,"segmentIds","sparseSegmentMean","int32");if(r.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(1!==s.rank)throw new Error(`Indices should be Tensor1D but received shape\n          ${s.shape}`);if(1!==a.rank)throw new Error(`Segment ids should be Tensor1D but received shape\n          ${a.shape}`);const o={data:r,indices:s,segmentIds:a};return Kr.runKernel(Jt,o)}});
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
 */const Ep=os({sparseSegmentSum_:function(e,t,n){const r=rs(e,"data","sparseSegmentSum"),s=rs(t,"indices","sparseSegmentSum","int32"),a=rs(n,"segmentIds","sparseSegmentSum","int32");if(r.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(1!==s.rank)throw new Error(`Indices should be Tensor1D but received shape\n         ${s.shape}`);if(1!==a.rank)throw new Error(`Segment ids should be Tensor1D but received shape\n         ${a.shape}`);const o={data:r,indices:s,segmentIds:a};return Kr.runKernel(Xt,o)}});
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
 */const _p=os({stringNGrams_:function(e,t,n,r,s,a,o,i){const u=rs(e,"data","stringNGrams","string");if("string"!==u.dtype)throw new Error("Data must be of datatype string");if(1!==u.shape.length)throw new Error(`Data must be a vector, saw: ${u.shape}`);const l=rs(t,"dataSplits","stringNGrams");if("int32"!==l.dtype)throw new Error("Data splits must be of datatype int32");const c={separator:n,nGramWidths:r,leftPad:s,rightPad:a,padWidth:o,preserveShortSequences:i},p={data:u,dataSplits:l},h=Kr.runKernel(rn,p,c);return{nGrams:h[0],nGramsSplits:h[1]}}});
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
 */const Mp=os({stringSplit_:function(e,t,n=!0){const r=rs(e,"input","stringSplit","string"),s=rs(t,"delimiter","stringSplit","string");if(1!==r.rank)throw new Error(`Input should be Tensor1D but received shape ${r.shape}`);if(0!==s.rank)throw new Error(`Delimiter should be a scalar but received shape ${s.shape}`);const a={skipEmpty:n},o={input:r,delimiter:s},i=Kr.runKernel(sn,o,a);return{indices:i[0],values:i[1],shape:i[2]}}});
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
 */const Ip=os({stringToHashBucketFast_:function(e,t){const n=rs(e,"input","stringToHashBucketFast","string"),r={numBuckets:t};if(t<=0)throw new Error("Number of buckets must be at least 1");const s={input:n};return Kr.runKernel(an,s,r)}}),Ap={fft:Wl,ifft:Ul,rfft:Kl,irfft:ql},Dp={hammingWindow:Cc,hannWindow:Rc,frame:Fc,stft:zc},$p={flipLeftRight:Pc,grayscaleToRGB:jc,resizeNearestNeighbor:op,resizeBilinear:ap,rotateWithOffset:Vc,cropAndResize:Bc,nonMaxSuppression:Wc,nonMaxSuppressionAsync:ep,nonMaxSuppressionWithScore:tp,nonMaxSuppressionWithScoreAsync:np,nonMaxSuppressionPadded:rp,nonMaxSuppressionPaddedAsync:sp,threshold:ip,transform:up},Op={bandPart:lp,gramSchmidt:cp,qr:hp},Lp={absoluteDifference:fp,computeWeightedLoss:mp,cosineDistance:gp,hingeLoss:yp,huberLoss:bp,logLoss:wp,meanSquaredError:xp,sigmoidCrossEntropy:Np,softmaxCrossEntropy:vp},Cp={sparseFillEmptyRows:Sp,sparseReshape:Tp,sparseSegmentMean:kp,sparseSegmentSum:Ep},Rp={stringNGrams:_p,stringSplit:Mp,stringToHashBucketFast:Ip};
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
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
class Fp extends to{minimize(e,t=!1,n){const{value:r,grads:s}=this.computeGradients(e,n);if(null!=n){const e=n.map((e=>({name:e.name,tensor:s[e.name]})));this.applyGradients(e)}else this.applyGradients(s);return Na(s),t?r:(r.dispose(),null)}get iterations(){return null==this.iterations_&&(this.iterations_=0),this.iterations_}incrementIterations(){this.iterations_=this.iterations+1}computeGradients(e,t){return cu(e,t)}dispose(){null!=this.iterations_&&Na(this.iterations_)}async saveIterations(){return null==this.iterations_&&(this.iterations_=0),{name:"iter",tensor:zi(this.iterations_,"int32")}}async getWeights(){throw new Error("getWeights() is not implemented for this optimizer yet.")}async setWeights(e){throw new Error(`setWeights() is not implemented for this optimizer class ${this.getClassName()}`)}async extractIterations(e){return this.iterations_=(await e[0].tensor.data())[0],e.slice(1)}}Object.defineProperty(Fp,Symbol.hasInstance,{value:e=>null!=e.minimize&&null!=e.computeGradients&&null!=e.applyGradients});
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
class zp extends Fp{constructor(e,t,n=null){super(),this.learningRate=e,this.rho=t,this.epsilon=n,this.accumulatedGrads=[],this.accumulatedUpdates=[],null==n&&(this.epsilon=Kr.backend.epsilon())}applyGradients(e){(Array.isArray(e)?e.map((e=>e.name)):Object.keys(e)).forEach(((t,n)=>{const r=Kr.registeredVariables[t];null==this.accumulatedGrads[n]&&(this.accumulatedGrads[n]={originalName:`${t}/accum_grad`,variable:xa((()=>Ei(r).variable(false)))}),null==this.accumulatedUpdates[n]&&(this.accumulatedUpdates[n]={originalName:`${t}/accum_var`,variable:xa((()=>Ei(r).variable(false)))});const s=Array.isArray(e)?e[n].tensor:e[t];if(null==s)return;const a=this.accumulatedGrads[n].variable,o=this.accumulatedUpdates[n].variable;xa((()=>{const e=lo(ho(a,this.rho),ho(Pi(s),1-this.rho)),t=ho(po(Bi(lo(o,this.epsilon)),Bi(lo(a,this.epsilon))),s),n=lo(ho(o,this.rho),ho(Pi(t),1-this.rho));a.assign(e),o.assign(n);const i=lo(ho(t,-this.learningRate),r);r.assign(i)}))})),this.incrementIterations()}dispose(){null!=this.accumulatedUpdates&&(Na(this.accumulatedGrads.map((e=>e.variable))),Na(this.accumulatedUpdates.map((e=>e.variable))))}async getWeights(){const e=[...this.accumulatedGrads,...this.accumulatedUpdates];return[await this.saveIterations()].concat(e.map((e=>({name:e.originalName,tensor:e.variable}))))}async setWeights(e){const t=(e=await this.extractIterations(e)).length/2;this.accumulatedGrads=e.slice(0,t).map((e=>({originalName:e.name,variable:e.tensor.variable(false)}))),this.accumulatedUpdates=e.slice(t,2*t).map((e=>({originalName:e.name,variable:e.tensor.variable(false)})))}getConfig(){return{learningRate:this.learningRate,rho:this.rho,epsilon:this.epsilon}}static fromConfig(e,t){return new e(t.learningRate,t.rho,t.epsilon)}}zp.className="Adadelta",ro(zp);
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
class Bp extends Fp{constructor(e,t=.1){super(),this.learningRate=e,this.initialAccumulatorValue=t,this.accumulatedGrads=[]}applyGradients(e){(Array.isArray(e)?e.map((e=>e.name)):Object.keys(e)).forEach(((t,n)=>{const r=Kr.registeredVariables[t];if(null==this.accumulatedGrads[n]){const e=!1;this.accumulatedGrads[n]={originalName:`${t}/accumulator`,variable:xa((()=>ni(r.shape,this.initialAccumulatorValue).variable(e)))}}const s=Array.isArray(e)?e[n].tensor:e[t];if(null==s)return;const a=this.accumulatedGrads[n].variable;xa((()=>{const e=lo(a,Pi(s));a.assign(e);const t=lo(ho(po(s,Bi(lo(e,Kr.backend.epsilon()))),-this.learningRate),r);r.assign(t)}))})),this.incrementIterations()}dispose(){null!=this.accumulatedGrads&&Na(this.accumulatedGrads.map((e=>e.variable)))}async getWeights(){return[await this.saveIterations()].concat(this.accumulatedGrads.map((e=>({name:e.originalName,tensor:e.variable}))))}async setWeights(e){e=await this.extractIterations(e);this.accumulatedGrads=e.map((e=>({originalName:e.name,variable:e.tensor.variable(false)})))}getConfig(){return{learningRate:this.learningRate,initialAccumulatorValue:this.initialAccumulatorValue}}static fromConfig(e,t){return new e(t.learningRate,t.initialAccumulatorValue)}}Bp.className="Adagrad",ro(Bp);
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
class Pp extends Fp{constructor(e,t,n,r=null){super(),this.learningRate=e,this.beta1=t,this.beta2=n,this.epsilon=r,this.accumulatedFirstMoment=[],this.accumulatedSecondMoment=[],xa((()=>{this.accBeta1=zi(t).variable(),this.accBeta2=zi(n).variable()})),null==r&&(this.epsilon=Kr.backend.epsilon())}applyGradients(e){const t=Array.isArray(e)?e.map((e=>e.name)):Object.keys(e);xa((()=>{const n=fu(1,this.accBeta1),r=fu(1,this.accBeta2);t.forEach(((t,s)=>{const a=Kr.registeredVariables[t];null==this.accumulatedFirstMoment[s]&&(this.accumulatedFirstMoment[s]={originalName:`${t}/m`,variable:xa((()=>Ei(a).variable(false)))}),null==this.accumulatedSecondMoment[s]&&(this.accumulatedSecondMoment[s]={originalName:`${t}/v`,variable:xa((()=>Ei(a).variable(false)))});const o=Array.isArray(e)?e[s].tensor:e[t];if(null==o)return;const i=this.accumulatedFirstMoment[s].variable,u=this.accumulatedSecondMoment[s].variable,l=lo(ho(i,this.beta1),ho(o,1-this.beta1)),c=lo(ho(u,this.beta2),ho(Pi(o),1-this.beta2)),p=po(l,n),h=po(c,r);i.assign(l),u.assign(c);const d=lo(ho(po(p,lo(Bi(h),this.epsilon)),-this.learningRate),a);a.assign(d)})),this.accBeta1.assign(ho(this.accBeta1,this.beta1)),this.accBeta2.assign(ho(this.accBeta2,this.beta2))})),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.accBeta2.dispose(),null!=this.accumulatedFirstMoment&&Na(this.accumulatedFirstMoment.map((e=>e.variable))),null!=this.accumulatedSecondMoment&&Na(this.accumulatedSecondMoment.map((e=>e.variable)))}async getWeights(){const e=[...this.accumulatedFirstMoment,...this.accumulatedSecondMoment];return[await this.saveIterations()].concat(e.map((e=>({name:e.originalName,tensor:e.variable}))))}async setWeights(e){e=await this.extractIterations(e),xa((()=>{this.accBeta1.assign(Fi(this.beta1,this.iterations_+1)),this.accBeta2.assign(Fi(this.beta2,this.iterations_+1))}));const t=e.length/2;this.accumulatedFirstMoment=e.slice(0,t).map((e=>({originalName:e.name,variable:e.tensor.variable(false)}))),this.accumulatedSecondMoment=e.slice(t,2*t).map((e=>({originalName:e.name,variable:e.tensor.variable(false)})))}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon}}static fromConfig(e,t){return new e(t.learningRate,t.beta1,t.beta2,t.epsilon)}}Pp.className="Adam",ro(Pp);
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
class jp extends Fp{constructor(e,t,n,r=null,s=0){super(),this.learningRate=e,this.beta1=t,this.beta2=n,this.epsilon=r,this.decay=s,this.accumulatedFirstMoment=[],this.accumulatedWeightedInfNorm=[],xa((()=>{this.iteration=zi(0).variable(),this.accBeta1=zi(t).variable()})),null==r&&(this.epsilon=Kr.backend.epsilon())}applyGradients(e){const t=Array.isArray(e)?e.map((e=>e.name)):Object.keys(e);xa((()=>{const n=fu(1,this.accBeta1),r=po(-this.learningRate,lo(ho(this.iteration,this.decay),1));t.forEach(((t,s)=>{const a=Kr.registeredVariables[t];null==this.accumulatedFirstMoment[s]&&(this.accumulatedFirstMoment[s]={originalName:`${t}/m`,variable:Ei(a).variable(false)}),null==this.accumulatedWeightedInfNorm[s]&&(this.accumulatedWeightedInfNorm[s]={originalName:`${t}/v`,variable:Ei(a).variable(false)});const o=Array.isArray(e)?e[s].tensor:e[t];if(null==o)return;const i=this.accumulatedFirstMoment[s].variable,u=this.accumulatedWeightedInfNorm[s].variable,l=lo(ho(i,this.beta1),ho(o,1-this.beta1)),c=ho(u,this.beta2),p=mo(o),h=Mu(c,p);i.assign(l),u.assign(h);const d=lo(ho(po(r,n),po(l,lo(h,this.epsilon))),a);a.assign(d)})),this.iteration.assign(lo(this.iteration,1)),this.accBeta1.assign(ho(this.accBeta1,this.beta1))})),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.iteration.dispose(),null!=this.accumulatedFirstMoment&&Na(this.accumulatedFirstMoment.map((e=>e.variable))),null!=this.accumulatedWeightedInfNorm&&Na(this.accumulatedWeightedInfNorm.map((e=>e.variable)))}async getWeights(){throw new Error("getWeights() is not implemented for Adamax yet.")}async setWeights(e){throw new Error("setWeights() is not implemented for Adamax yet.")}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon,decay:this.decay}}static fromConfig(e,t){return new e(t.learningRate,t.beta1,t.beta2,t.epsilon,t.decay)}}jp.className="Adamax",ro(jp);
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
class Vp extends Fp{constructor(e){super(),this.learningRate=e,this.setLearningRate(e)}applyGradients(e){(Array.isArray(e)?e.map((e=>e.name)):Object.keys(e)).forEach(((t,n)=>{const r=Array.isArray(e)?e[n].tensor:e[t];if(null==r)return;const s=Kr.registeredVariables[t];xa((()=>{const e=lo(ho(this.c,r),s);s.assign(e)}))})),this.incrementIterations()}setLearningRate(e){this.learningRate=e,null!=this.c&&this.c.dispose(),this.c=va(zi(-e))}dispose(){this.c.dispose()}async getWeights(){return[await this.saveIterations()]}async setWeights(e){if(0!==(e=await this.extractIterations(e)).length)throw new Error("SGD optimizer does not have settable weights.")}getConfig(){return{learningRate:this.learningRate}}static fromConfig(e,t){return new e(t.learningRate)}}Vp.className="SGD",ro(Vp);
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
class Gp extends Vp{constructor(e,t,n=!1){super(e),this.learningRate=e,this.momentum=t,this.useNesterov=n,this.accumulations=[],this.m=zi(this.momentum)}applyGradients(e){(Array.isArray(e)?e.map((e=>e.name)):Object.keys(e)).forEach(((t,n)=>{const r=Kr.registeredVariables[t];if(null==this.accumulations[n]){const e=!1;this.accumulations[n]={originalName:`${t}/momentum`,variable:xa((()=>Ei(r).variable(e)))}}const s=this.accumulations[n].variable,a=Array.isArray(e)?e[n].tensor:e[t];null!=a&&xa((()=>{let e;const t=lo(ho(this.m,s),a);e=this.useNesterov?lo(ho(this.c,lo(a,ho(t,this.m))),r):lo(ho(this.c,t),r),s.assign(t),r.assign(e)}))})),this.incrementIterations()}dispose(){this.m.dispose(),null!=this.accumulations&&Na(this.accumulations.map((e=>e.variable)))}setMomentum(e){this.momentum=e}async getWeights(){return[await this.saveIterations()].concat(this.accumulations.map((e=>({name:e.originalName,tensor:e.variable}))))}async setWeights(e){e=await this.extractIterations(e);this.accumulations=e.map((e=>({originalName:e.name,variable:e.tensor.variable(false)})))}getConfig(){return{learningRate:this.learningRate,momentum:this.momentum,useNesterov:this.useNesterov}}static fromConfig(e,t){return new e(t.learningRate,t.momentum,t.useNesterov)}}Gp.className="Momentum",ro(Gp);
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
class Wp extends Fp{constructor(e,t=.9,n=0,r=null,s=!1){if(super(),this.learningRate=e,this.decay=t,this.momentum=n,this.epsilon=r,this.accumulatedMeanSquares=[],this.accumulatedMoments=[],this.accumulatedMeanGrads=[],this.centered=s,null==r&&(this.epsilon=Kr.backend.epsilon()),null==e)throw new Error("learningRate for RMSPropOptimizer must be defined.")}applyGradients(e){(Array.isArray(e)?e.map((e=>e.name)):Object.keys(e)).forEach(((t,n)=>{const r=Kr.registeredVariables[t],s=!1;null==this.accumulatedMeanSquares[n]&&(this.accumulatedMeanSquares[n]={originalName:`${t}/rms`,variable:xa((()=>Ei(r).variable(s)))}),null==this.accumulatedMoments[n]&&(this.accumulatedMoments[n]={originalName:`${t}/momentum`,variable:xa((()=>Ei(r).variable(s)))}),null==this.accumulatedMeanGrads[n]&&this.centered&&(this.accumulatedMeanGrads[n]={originalName:`${t}/mg`,variable:xa((()=>Ei(r).variable(s)))});const a=Array.isArray(e)?e[n].tensor:e[t];if(null==a)return;const o=this.accumulatedMeanSquares[n].variable,i=this.accumulatedMoments[n].variable;xa((()=>{const e=lo(ho(o,this.decay),ho(Pi(a),1-this.decay));if(this.centered){const t=this.accumulatedMeanGrads[n].variable,s=lo(ho(t,this.decay),ho(a,1-this.decay)),u=po(ho(a,this.learningRate),Bi(fu(e,lo(Pi(s),this.epsilon)))),l=lo(ho(i,this.momentum),u);o.assign(e),t.assign(s),i.assign(l);const c=fu(r,l);r.assign(c)}else{const e=lo(ho(o,this.decay),ho(Pi(a),1-this.decay)),t=lo(ho(i,this.momentum),po(ho(a,this.learningRate),Bi(lo(e,this.epsilon))));o.assign(e),i.assign(t);const n=fu(r,t);r.assign(n)}}))})),this.incrementIterations()}dispose(){null!=this.accumulatedMeanSquares&&Na(this.accumulatedMeanSquares.map((e=>e.variable))),null!=this.accumulatedMeanGrads&&this.centered&&Na(this.accumulatedMeanGrads.map((e=>e.variable))),null!=this.accumulatedMoments&&Na(this.accumulatedMoments.map((e=>e.variable)))}async getWeights(){const e=[...this.accumulatedMeanSquares,...this.accumulatedMoments];return this.centered&&e.push(...this.accumulatedMeanGrads),[await this.saveIterations()].concat(e.map((e=>({name:e.originalName,tensor:e.variable}))))}async setWeights(e){e=await this.extractIterations(e);const t=this.centered?e.length/3:e.length/2,n=!1;this.accumulatedMeanSquares=e.slice(0,t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)}))),this.accumulatedMoments=e.slice(t,2*t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)}))),this.centered&&(this.accumulatedMeanGrads=e.slice(2*t,3*t).map((e=>({originalName:e.name,variable:e.tensor.variable(n)}))))}getConfig(){return{learningRate:this.learningRate,decay:this.decay,momentum:this.momentum,epsilon:this.epsilon,centered:this.centered}}static fromConfig(e,t){return new e(t.learningRate,t.decay,t.momentum,t.epsilon,t.centered)}}Wp.className="RMSProp",ro(Wp);
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
class Up{static sgd(e){return new Vp(e)}static momentum(e,t,n=!1){return new Gp(e,t,n)}static rmsprop(e,t=.9,n=0,r=null,s=!1){return new Wp(e,t,n,r,s)}static adam(e=.001,t=.9,n=.999,r=null){return new Pp(e,t,n,r)}static adadelta(e=.001,t=.95,n=null){return new zp(e,t,n)}static adamax(e=.002,t=.9,n=.999,r=null,s=0){return new jp(e,t,n,r,s)}static adagrad(e,t=.1){return new Bp(e,t)}}
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
 */const qp={sgd:Up.sgd,momentum:Up.momentum,adadelta:Up.adadelta,adagrad:Up.adagrad,rmsprop:Up.rmsprop,adamax:Up.adamax,adam:Up.adam},Hp="undefined"!=typeof requestAnimationFrame?requestAnimationFrame:"undefined"!=typeof setImmediate?setImmediate:e=>e();
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
var Kp;!function(e){e[e.FIRST_DIM_SIZE=0]="FIRST_DIM_SIZE",e[e.VALUE_ROWIDS=1]="VALUE_ROWIDS",e[e.ROW_LENGTHS=2]="ROW_LENGTHS",e[e.ROW_SPLITS=3]="ROW_SPLITS",e[e.ROW_LIMITS=4]="ROW_LIMITS",e[e.ROW_STARTS=5]="ROW_STARTS"}(Kp||(Kp={}));
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
const Zp="->",Yp=/->/g;function Qp(e,t){const n=[];for(let r=0;r<e.length;++r)0!==e[r].length&&-1===e[r].indexOf(t)&&-1!==t||n.push(r);return n}var Jp=Object.freeze({__proto__:null,segOpComputeOptimalWindowSize:
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
function(e,t){let n,r=!1;for(e<=30?(n=e,r=!0):n=A(e,Math.floor(Math.sqrt(e)));!r;)n>t||n===e?r=!0:n=A(e,n+1);return n},computeOutShape:function(e,t,n){const r=[],s=e.length;for(let a=0;a<s;a++)a!==t?r.push(e[a]):r.push(n);return r},collectGatherOpShapeInfo:function(e,t,n,r){const s=t.shape.length,a=e.shape.length;if(0!==r&&(r<-s||r>s))throw new Error(`Expect batchDims in the range of [-${s}, ${s}], but got ${r}`);if(r<0&&(r+=s),r>a)throw new Error(`batchDims (${r}) must be less than rank(x) (\n    ${a}).`);if(n<r)throw new Error(`batchDims (${r}) must be less than or equal to axis (${n}).`);for(let n=0;n<r;++n)if(e.shape[n]!==t.shape[n])throw new Error(`x.shape[${n}]: ${e.shape[n]} should be equal to indices.shape[${n}]: ${t.shape[n]}.`);const o=e.shape[n],i=[];let u=1,l=1,c=1;for(let t=0;t<r;++t)i.push(e.shape[t]),u*=e.shape[t];for(let t=r;t<n;t++)i.push(e.shape[t]),l*=e.shape[t];for(let e=r;e<s;e++)i.push(t.shape[e]);for(let t=n+1;t<a;t++)i.push(e.shape[t]),c*=e.shape[t];return{batchSize:u,sliceSize:c,outerSize:l,dimSize:o,outputShape:i}}});
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
 */var Xp=Object.freeze({__proto__:null,slice_util:eo,segment_util:Jp,fromUint8ToStringArray:function(e){try{return e.map((e=>yr(e)))}catch(e){throw new Error(`Failed to decode encoded string bytes into utf-8, error: ${e}`)}},fromStringArrayToUint8:function(e){return e.map((e=>gr(e)))},upcastType:zr,axesAreInnerMostDims:$i,combineLocations:Oi,computeOutAndReduceShapes:function(e,t){const n=[],r=e.length;for(let s=0;s<r;s++)-1===t.indexOf(s)&&n.push(e[s]);return[n,t.map((t=>e[t]))]},expandShapeToKeepDim:Li,assertAxesAreInnerMostDims:function(e,t,n){u($i(t,n),(()=>`${e} supports only inner-most axes for now. Got axes ${t} and rank-${n} input.`))},getAxesPermutation:function(e,t){if($i(e,t))return null;const n=[];for(let r=0;r<t;++r)-1===e.indexOf(r)&&n.push(r);return e.forEach((e=>n.push(e))),n},getUndoAxesPermutation:function(e){return e.map(((e,t)=>[t,e])).sort(((e,t)=>e[1]-t[1])).map((e=>e[0]))},getInnerMostAxes:function(e,t){const n=[];for(let r=t-e;r<t;++r)n.push(r);return n},getBroadcastDims:Ia,getReductionAxes:Aa,assertAndGetBroadcastShape:Da,assertParamsConsistent:
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
function(e,t){const n=e[0].length;e.forEach(((e,t)=>{u(e.length===n,(()=>`Error in concat${n}D: rank of tensors[${t}] must be the same as the rank of the rest (${n})`))})),u(t>=0&&t<n,(()=>`Error in concat${n}D: axis must be between 0 and ${n-1}.`));const r=e[0];e.forEach(((e,s)=>{for(let a=0;a<n;a++)u(a===t||e[a]===r[a],(()=>`Error in concat${n}D: Shape of tensors[${s}] (${e}) does not match the shape of the rest (${r}) along the non-concatenated axis ${s}.`))}))},computeOutShape:function(e,t){const n=e[0].slice();for(let r=1;r<e.length;r++)n[t]+=e[r][t];return n},computeDilation2DInfo:function(e,t,n,r,s="NHWC",a){return Mo(e,[...t,e[3]],n,a,r,null,null,Fo(s))},computePool2DInfo:_o,computePool3DInfo:function(e,t,n,r,s,a,o="NDHWC"){const[i,u,l]=$o(t);let c,p;if("NDHWC"===o)p="channelsLast",c=[i,u,l,e[4],e[4]];else{if("NCDHW"!==o)throw new Error(`Unknown dataFormat ${o}`);p="channelsFirst",c=[i,u,l,e[1],e[1]]}return Io(e,c,n,r,s,!1,p,a)},computeConv2DInfo:Mo,computeConv3DInfo:Io,computeDefaultPad:Ao,tupleValuesAreOne:Co,eitherStridesOrDilationsAreOne:Ro,convertConv2DDataFormat:Fo,checkPadOnDimRoundingMode:zo,getFusedDyActivation:kc,getFusedBiasGradient:Ec,applyActivation:_c,shouldFuse:Mc,get RowPartitionType(){return Kp},combineRaggedTensorToTensorShapes:function(e,t,n){let r=new Array;if(null==n&&null==t)return r;if(null==t)for(;r.length<e+n.length;)r.push(-1);else r=t.slice();if(null==n)return r;if(e+n.length!==r.length)throw new Error(`rt input.shape and shape=${t} are incompatible: rt input.rank = ${e+n.length}, but shape.rank = ${r.length}`);for(let s=1;s<n.length;++s){const a=n[s],o=r[r.length-n.length+s],i=r[o];if(a>=0)if(i>=0){if(i!==a)throw new Error(`rt input.shape and shape=${t} are incompatible: rt input.shape[${s+e}] = ${a} but shape[${s+e}] = ${i}`)}else r[o]=a}return r},getRowPartitionTypesHelper:function(e){const t={FIRST_DIM_SIZE:Kp.FIRST_DIM_SIZE,VALUE_ROWIDS:Kp.VALUE_ROWIDS,ROW_LENGTHS:Kp.ROW_LENGTHS,ROW_SPLITS:Kp.ROW_SPLITS,ROW_LIMITS:Kp.ROW_LIMITS,ROW_STARTS:Kp.ROW_STARTS},n=[];for(const r of e){if(!(r in t))break;n.push(t[r])}return n},getRaggedRank:function(e){return 0===e.length?0:e[0]===Kp.FIRST_DIM_SIZE?e.length-1:e.length},validateDefaultValueShape:function(e,t){if(null==e||null==t)return;const n=e.length,r=t.length;if(n>=r)throw new Error(`defaultValue.shape=${e} and ragged tensor flatValues.shape=${t}, are incompatible: defaultValue.rank = ${n} must be less than ragged tensor input flatValues.rank = ${r})`);for(let s=0;s<Math.min(n,r-1);++s){const n=e[s],r=t[s+1];if(n>=0&&r>=0&&1!==n&&n!==r)throw new Error(`defaultValue.shape=${e}, and ragged tensor input flatValues.shape=${t} are incompatible: defaultValue.shape[${s-e.length}] = ${n} but ragged tensor input.flatValues.shape[${s-e.length}] = ${r}`)}}
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
 */,PARALLELIZE_THRESHOLD:30,computeOptimalWindowSize:function(e){return e<=30?e:A(e,Math.floor(Math.sqrt(e)))}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */,getImageCenter:function(e,t,n){return[n*("number"==typeof e?e:e[0]),t*("number"==typeof e?e:e[1])]}
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
 */,getReshaped:function(e,t,n,r=!0){let s=[];if(r)s=s.concat(t.slice(0)),s.push(e[0]/n),s=s.concat(e.slice(1));else{s=s.concat(e[0]);const n=t.length;for(let r=0;r<n;++r)s=s.concat([e[r+1]/t[r],t[r]]);s=s.concat(e.slice(n+1))}return s},getPermuted:function(e,t,n=!0){const r=[];if(n){r.push(t);for(let n=t+1;n<e;++n)n<=2*t?(r.push(n),r.push(n-(t+1))):r.push(n)}else{const n=[],s=[];for(let r=1;r<e;++r)r>=2*t+1||r%2==1?s.push(r):n.push(r);r.push(...n),r.push(0),r.push(...s)}return r},getReshapedPermuted:function(e,t,n,r=!0){const s=[];r?s.push(e[0]/n):s.push(e[0]*n);for(let n=1;n<e.length;++n)n<=t.length?r?s.push(t[n-1]*e[n]):s.push(e[n]/t[n-1]):s.push(e[n]);return s},getSliceBeginCoords:function(e,t){const n=[0];for(let r=0;r<t;++r)n.push(e[r][0]);return n},getSliceSize:function(e,t,n){const r=e.slice(0,1);for(let s=0;s<n;++s)r.push(e[s+1]-t[s][0]-t[s][1]);return r}
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
 */,prepareAndValidate:Ba,validateUpdateShape:ja,validateInput:Va,calculateShapes:Ga,SELU_SCALEALPHA:1.7580993408473768,SELU_SCALE:1.0507009873554805,ERF_P:.3275911,ERF_A1:.254829592,ERF_A2:-.284496736,ERF_A3:1.421413741,ERF_A4:-1.453152027,ERF_A5:1.061405429,warn:vn,log:function(...e){j().getBool("IS_TEST")||j().getBool("PROD")||console.log(...e)},mergeRealAndImagArrays:
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
function(e,t){if(e.length!==t.length)throw new Error(`Cannot merge real and imag arrays of different lengths. real:${e.length}, imag: ${t.length}.`);const n=new Float32Array(2*e.length);for(let r=0;r<n.length;r+=2)n[r]=e[r/2],n[r+1]=t[r/2];return n},splitRealAndImagArrays:function(e){const t=new Float32Array(e.length/2),n=new Float32Array(e.length/2);for(let r=0;r<e.length;r+=2)t[r/2]=e[r],n[r/2]=e[r+1];return{real:t,imag:n}},complexWithEvenIndex:function(e){const t=Math.ceil(e.length/4),n=new Float32Array(t),r=new Float32Array(t);for(let t=0;t<e.length;t+=4)n[Math.floor(t/4)]=e[t],r[Math.floor(t/4)]=e[t+1];return{real:n,imag:r}},complexWithOddIndex:function(e){const t=Math.floor(e.length/4),n=new Float32Array(t),r=new Float32Array(t);for(let t=2;t<e.length;t+=4)n[Math.floor(t/4)]=e[t],r[Math.floor(t/4)]=e[t+1];return{real:n,imag:r}},getComplexWithIndex:function(e,t){return{real:e[2*t],imag:e[2*t+1]}},assignToTypedArray:function(e,t,n,r){e[2*r]=t,e[2*r+1]=n},exponents:function(e,t){const n=new Float32Array(e/2),r=new Float32Array(e/2);for(let s=0;s<Math.ceil(e/2);s++){const a=(t?2:-2)*Math.PI*(s/e);n[s]=Math.cos(a),r[s]=Math.sin(a)}return{real:n,imag:r}},exponent:function(e,t,n){const r=(n?2:-2)*Math.PI*(e/t);return{real:Math.cos(r),imag:Math.sin(r)}},decodeEinsumEquation:function(e,t){const n=((e=e.replace(/\s/g,"")).length-e.replace(Yp,"").length)/Zp.length;if(n<1)throw new Error("Equations without an arrow are not supported.");if(n>1)throw new Error(`Equation must contain exactly one arrow ("${Zp}").`);const[r,s]=e.split(Zp);u(-1===r.indexOf("..."),(()=>'The ellipsis notation ("...") is not supported yet.'));const a=r.split(","),o=a.length;if(t!==o)throw new Error(`Expected ${o} input tensors, received ${t}`);if(o>2)throw new Error("Support for more than 2 input tensors is not implemented yet.");const i=[];for(let e=0;e<s.length;++e){const t=s[e];if(!a.some((e=>-1!==e.indexOf(t))))throw new Error(`Output subscripts contain the label ${t} not present in the input subscripts.`);-1===i.indexOf(t)&&i.push(t)}for(let e=0;e<r.length;++e){const t=r[e];-1===i.indexOf(t)&&","!==t&&i.push(t)}const l=new Array(a.length);for(let e=0;e<o;++e){if(new Set(a[e].split("")).size!==a[e].length)throw new Error(`Found duplicate axes in input component ${a[e]}. Support for duplicate axes in input is not implemented yet.`);l[e]=[];for(let t=0;t<a[e].length;++t)l[e].push(i.indexOf(a[e][t]))}const c=i.length,p=[];for(let e=s.length;e<c;++e)p.push(e);return{allDims:i,summedDims:p,idDims:l}},getEinsumPermutation:function(e,t){let n=new Array(e);n.fill(-1);for(let e=0;e<t.length;++e)n[t[e]]=e;const r=[];for(let t=0;t<e;++t)-1===n[t]&&r.push(t);return n=n.filter((e=>-1!==e)),{permutationIndices:n,expandDims:r}},checkEinsumDimSizes:function(e,t,n){const r=new Array(e);for(let e=0;e<n.length;++e){const s=n[e].shape;for(let n=0;n<t[e].length;++n)void 0===r[t[e][n]]?r[t[e][n]]=s[n]:u(r[t[e][n]]===s[n],(()=>`Expected dimension ${r[t[e][n]]} at axis ${n} of input shaped ${JSON.stringify(s)}, but got dimension ${s[n]}`))}},getEinsumComputePath:function(e,t){const n=e,r=[];let s=0;0===e.length&&n.push(-1),s=e.length+1;for(let e=0;e<s;++e)r.push([]);const a=[];for(let e=0;e<n.length;++e){const s=Qp(t,n[e]);for(const t of s)-1===a.indexOf(t)&&(r[e].push(t),a.push(t))}return{path:n,steps:r}},isIdentityPermutation:function(e){return e.every(((e,t)=>e===t))},prepareSplitSize:function(e,t,n=0){let r=[];if("number"==typeof t)u(e.shape[n]%t==0,(()=>"Number of splits must evenly divide the axis.")),r=new Array(t).fill(e.shape[n]/t);else{u(t.reduce(((e,t)=>(-1===t&&(e+=1),e)),0)<=1,(()=>"There should be only one negative value in split array."));const s=t.indexOf(-1);if(-1!==s){const r=t.reduce(((e,t)=>t>0?e+t:e));t[s]=e.shape[n]-r}u(e.shape[n]===t.reduce(((e,t)=>e+t)),(()=>"The sum of sizes must match the size of the axis dimension.")),r=t}return r}
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
 */,getSparseFillEmptyRowsIndicesDenseShapeMismatch:function(e){return`Received SparseTensor with denseShape[0] = 0 but\n  indices.shape[0] = ${e}`},getSparseFillEmptyRowsNegativeIndexErrorMessage:function(e,t){return`indices(${e}, 0) is invalid: ${t} < 0`},getSparseFillEmptyRowsOutOfRangeIndexErrorMessage:function(e,t,n){return`indices(${e}, 0) is invalid: ${t} >= ${n}`}
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
 */,getSparseReshapeMultipleNegativeOneOutputDimErrorMessage:function(e,t){return`only one output dimension may be -1, not both ${e} and ${t}`},getSparseReshapeNegativeOutputDimErrorMessage:function(e,t){return`size ${e} must be non-negative, not ${t}`},getSparseReshapeEmptyTensorZeroOutputDimErrorMessage:function(){return"reshape cannot infer the missing input size for an empty tensor unless all specified input sizes are non-zero"},getSparseReshapeInputOutputMultipleErrorMessage:function(e,t){return`Input to reshape is a SparseTensor with ${h(e)}\n  dense values, but the requested shape requires a multiple of ${h(t)}. inputShape=${e} outputShape= ${t}`},getSparseReshapeInputOutputMismatchErrorMessage:function(e,t){return`Input to reshape is a tensor with ${h(e)} dense values, but the requested shape has ${h(t)}. inputShape=${e} outputShape=${t}`}
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
 */,getSparseSegmentReductionNegativeSegmentIdsErrorMessage:function(){return"segment ids must be >= 0"},getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage:function(){return"segment ids are not increasing"},getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage:function(e,t){return`Segment id ${e} out of range [0, ${t}), possibly because segmentIds input is not sorted.`},getSparseSegmentReductionIndicesOutOfRangeErrorMessage:function(e,t,n){return`Bad: indices[${e}] == ${t} out of range [0, ${n})`}}),eh=Object.freeze({__proto__:null,nonMaxSuppressionV3Impl:Hc,nonMaxSuppressionV4Impl:Kc,nonMaxSuppressionV5Impl:Zc,whereImpl:dc}),th=Object.freeze({__proto__:null,AdadeltaOptimizer:zp,AdagradOptimizer:Bp,AdamOptimizer:Pp,AdamaxOptimizer:jp,MomentumOptimizer:Gp,Optimizer:Fp,OptimizerConstructors:Up,RMSPropOptimizer:Wp,SGDOptimizer:Vp,Tensor:Ar,TensorBuffer:_r,Variable:Dr,get Rank(){return $r},sumOutType:function(e){return zr(e,"int32")},upcastType:zr,get Reduction(){return dp},customGrad:pu,grad:function(e){return u(I(e),(()=>"The f passed in grad(f) must be a function")),(t,n)=>{const r=rs(t,"x","tf.grad","string_or_numeric"),s=null!=n?rs(n,"dy","tf.grad"):null;return Kr.tidy((()=>{const{value:t,grads:n}=Kr.gradients((()=>e(r)),[r],s);return null!=s&&l(t.shape,s.shape,"The shape of dy passed in grad(f)(x, dy) must match the shape returned by f(x)"),hu(n),n[0]}))}},grads:function(e){return u(I(e),(()=>"The f passed in grads(f) must be a function")),(t,n)=>{u(Array.isArray(t),(()=>"The args passed in grads(f)(args) must be an array of `Tensor`s or `TensorLike`s"));const r=ss(t,"args","tf.grads","string_or_numeric"),s=null!=n?rs(n,"dy","tf.grads"):null;return Kr.tidy((()=>{const{value:t,grads:n}=Kr.gradients((()=>e(...r)),r,s);return null!=s&&l(t.shape,s.shape,"The shape of dy passed in grads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),hu(n),n}))}},valueAndGrad:function(e){return u(I(e),(()=>"The f passed in valueAndGrad(f) must be a function")),(t,n)=>{u(t instanceof Ar,(()=>"The x passed in valueAndGrad(f)(x) must be a tensor")),u(null==n||n instanceof Ar,(()=>"The dy passed in valueAndGrad(f)(x, dy) must be a tensor"));const{grads:r,value:s}=Kr.gradients((()=>e(t)),[t],n);return hu(r),{grad:r[0],value:s}}},valueAndGrads:function(e){return u(I(e),(()=>"The f passed in valueAndGrads(f) must be a function")),(t,n)=>{u(Array.isArray(t)&&t.every((e=>e instanceof Ar)),(()=>"The args passed in valueAndGrads(f)(args) must be array of tensors")),u(null==n||n instanceof Ar,(()=>"The dy passed in valueAndGrads(f)(args, dy) must be a tensor"));const r=Kr.gradients((()=>e(...t)),t,n);return null!=n&&l(r.value.shape,n.shape,"The shape of dy passed in valueAndGrads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),hu(r.grads),r}},variableGrads:cu,Environment:B,env:j,get ENV(){return G},nextFrame:function(){return new Promise((e=>Hp((()=>e()))))},KernelBackend:r,DataStorage:class{constructor(e,t){this.backend=e,this.dataMover=t,this.data=new WeakMap,this.dataIdsCount=0}get(e){return this.data.has(e)||this.dataMover.moveData(this.backend,e),this.data.get(e)}set(e,t){this.dataIdsCount++,this.data.set(e,t)}has(e){return this.data.has(e)}delete(e){return this.dataIdsCount--,this.data.delete(e)}numDataIds(){return this.dataIdsCount}},abs:mo,acos:fo,acosh:go,add:lo,addN:yo,all:bo,any:wo,argMax:xo,argMin:No,asin:vo,asinh:So,atan:To,atan2:ko,atanh:Eo,avgPool:Po,avgPool3d:jo,basicLSTMCell:qo,batchToSpaceND:Ho,batchNorm:Ko,batchNorm2d:Zo,batchNorm3d:Yo,batchNorm4d:Qo,bincount:Jo,broadcastArgs:Xo,broadcastTo:ei,buffer:Xs,cast:ea,ceil:ti,clipByValue:ri,clone:ta,complex:is,concat:Vo,concat1d:si,concat2d:ai,concat3d:oi,concat4d:ii,conv1d:li,conv2d:ui,conv2dTranspose:pi,conv3d:hi,conv3dTranspose:mi,cos:fi,cosh:gi,cumprod:yi,cumsum:bi,denseBincount:wi,depthToSpace:xi,depthwiseConv2d:Ni,diag:vi,dilation2d:Si,div:po,divNoNan:_i,dot:Mi,einsum:Ii,elu:Ai,equal:Ti,erf:Di,euclideanNorm:Wi,exp:Ui,expandDims:qi,expm1:Hi,eye:Zi,fill:ni,floor:Yi,floorDiv:co,gather:Qi,greater:Ji,greaterEqual:Xi,imag:Sa,isFinite:eu,isInf:tu,isNaN:nu,leakyRelu:ru,less:su,lessEqual:au,linspace:ou,localResponseNormalization:iu,log:uu,log1p:lu,logSigmoid:mu,logSoftmax:gu,logSumExp:yu,logicalAnd:bu,logicalNot:wu,logicalOr:xu,logicalXor:Nu,lowerBound:Tu,matMul:ba,max:Ci,maxPool:ku,maxPool3d:Eu,maxPoolWithArgmax:_u,maximum:Mu,mean:Iu,meshgrid:$u,min:Ri,minimum:Ou,mirrorPad:Lu,mod:Cu,moments:Ru,mul:ho,multiRNNCell:Fu,multinomial:zu,neg:Ta,notEqual:Bu,oneHot:wa,ones:Du,onesLike:Pu,outerProduct:ju,pad:Vu,pad1d:Gu,pad2d:Wu,pad3d:Uu,pad4d:qu,pool:Ku,pow:Fi,prelu:Zu,print:na,prod:Yu,raggedGather:Qu,raggedTensorToTensor:Ju,rand:Xu,randomGamma:bl,randomNormal:wl,randomStandardNormal:xl,randomUniform:Nl,range:vl,real:ka,reciprocal:Sl,relu:Tl,relu6:kl,reshape:Bo,reverse:El,reverse1d:_l,reverse2d:Ml,reverse3d:Il,reverse4d:Al,round:Dl,rsqrt:$l,scalar:zi,selu:Ol,separableConv2d:Ll,setdiff1dAsync:Cl,sigmoid:Go,sign:Rl,sin:Fl,sinh:zl,slice:Wo,slice1d:Bl,slice2d:Pl,slice3d:jl,slice4d:Vl,softmax:Gl,softplus:du,spaceToBatchND:Hu,fft:Wl,ifft:Ul,irfft:ql,rfft:Kl,split:Hl,sqrt:Bi,square:Pi,squaredDifference:Zl,squeeze:Yl,stack:Ql,step:Jl,stridedSlice:Xl,sub:fu,sum:ji,tan:ec,tanh:Uo,tensor:ls,tensor1d:tc,tensor2d:nc,tensor3d:Oa,tensor4d:rc,tensor5d:sc,tensor6d:ac,tile:Ki,topk:oc,truncatedNormal:ic,unique:uc,unsortedSegmentSum:lc,unstack:cc,upperBound:pc,variable:hc,where:ki,whereAsync:mc,zeros:Au,zerosLike:Ei,op:os,OP_SCOPE_SUFFIX:as,booleanMaskAsync:fc,transpose:Ea,norm:Gi,movingAverage:gc,scatterND:yc,searchSorted:Su,sparseToDense:bc,gatherND:wc,dropout:xc,enclosingPowerOfTwo:Nc,cosineWindow:vc,inTopKAsync:Sc,image:$p,linalg:Op,losses:Lp,spectral:Ap,fused:Lc,signal:Dp,sparse:Cp,string:Rp,train:qp,enableProdMode:function(){j().set("PROD",!0)},enableDebugMode:function(){j().set("DEBUG",!0)},disableDeprecationWarnings:function(){j().set("DEPRECATION_WARNINGS_ENABLED",!1),console.warn("TensorFlow.js deprecation warnings have been disabled.")},deprecationWarn:function(e){j().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(e+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")},disposeVariables:function(){Kr.disposeVariables()},engine:function(){return Kr},memory:function(){return Kr.memory()},profile:function(e){return Kr.profile(e)},tidy:xa,dispose:Na,keep:va,time:function(e){return Kr.time(e)},setBackend:function(e){return Kr.setBackend(e)},ready:function(){return Kr.ready()},getBackend:function(){return Kr.backendName},removeBackend:function(e){Kr.removeBackend(e)},findBackend:function(e){return Kr.findBackend(e)},findBackendFactory:function(e){return Kr.findBackendFactory(e)},registerBackend:function(e,t,n=1){return Kr.registerBackend(e,t,n)},backend:function(){return Kr.backend},setPlatform:function(e,t){j().setPlatform(e,t)},getKernel:kn,getGradient:En,getKernelsForBackend:_n,registerKernel:Mn,registerGradient:function(e){const{kernelName:t}=e;Tn.has(t)&&j().getBool("DEBUG")&&vn(`Overriding the gradient for '${t}'`),Tn.set(t,e)},unregisterKernel:function(e,t){const n=In(e,t);if(!Sn.has(n))throw new Error(`The kernel '${e}' for backend '${t}' is not registered`);Sn.delete(n)},unregisterGradient:function(e){if(!Tn.has(e))throw new Error(`The gradient '${e}' for backend is not registered`);Tn.delete(e)},copyRegisteredKernels:function(e,t){_n(e).forEach((e=>{Mn(Object.assign({},e,{backendName:t}))}))},Abs:"Abs",Acos:q,Acosh:H,Add:K,AddN:Z,All:"All",Any:"Any",ArgMax:Y,ArgMin:Q,Asin:J,Asinh:X,Atan:ee,Atanh:te,Atan2:ne,AvgPool:re,AvgPoolGrad:"AvgPoolGrad",AvgPool3D:se,AvgPool3DGrad:"AvgPool3DGrad",BatchMatMul:ae,BatchToSpaceND:oe,Bincount:ie,BroadcastTo:"BroadcastTo",BroadcastArgs:ue,Cast:le,Ceil:ce,ClipByValue:pe,Complex:he,ComplexAbs:de,Concat:me,Conv2D:fe,Conv2DBackpropFilter:ge,Conv2DBackpropInput:ye,Conv3D:be,Conv3DBackpropFilterV2:"Conv3DBackpropFilterV2",Conv3DBackpropInputV2:we,Cos:"Cos",Cosh:xe,Cumprod:Ne,Cumsum:ve,CropAndResize:Se,DenseBincount:Te,DepthToSpace:ke,DepthwiseConv2dNative:Ee,DepthwiseConv2dNativeBackpropFilter:_e,DepthwiseConv2dNativeBackpropInput:Me,Diag:Ie,Dilation2D:Ae,Dilation2DBackpropInput:"Dilation2DBackpropInput",Dilation2DBackpropFilter:"Dilation2DBackpropFilter",RealDiv:De,Einsum:$e,Elu:"Elu",EluGrad:"EluGrad",Erf:"Erf",Equal:Oe,Exp:"Exp",ExpandDims:Le,Expm1:Ce,FFT:"FFT",Fill:Re,FlipLeftRight:Fe,Floor:ze,FloorDiv:Be,FusedBatchNorm:Pe,GatherV2:je,GatherNd:Ve,Greater:Ge,GreaterEqual:We,Identity:Ue,IFFT:qe,Imag:He,IsFinite:Ke,IsInf:Ze,IsNan:Ye,LeakyRelu:Qe,Less:Je,LessEqual:Xe,LinSpace:et,Log:"Log",Log1p:tt,LogicalAnd:nt,LogicalNot:rt,LogicalOr:st,LogicalXor:"LogicalXor",LogSoftmax:"LogSoftmax",LowerBound:"LowerBound",LRN:"LRN",LRNGrad:"LRNGrad",Max:"Max",Maximum:at,MaxPool:ot,MaxPoolGrad:"MaxPoolGrad",MaxPool3D:it,MaxPool3DGrad:"MaxPool3DGrad",MaxPoolWithArgmax:ut,Mean:lt,Min:"Min",Minimum:ct,MirrorPad:pt,Mod:"Mod",Multinomial:ht,Multiply:dt,Neg:"Neg",NotEqual:mt,NonMaxSuppressionV3:ft,NonMaxSuppressionV4:gt,NonMaxSuppressionV5:yt,OnesLike:bt,OneHot:wt,Pack:xt,PadV2:Nt,Pool:"Pool",Pow:"Pow",Prelu:vt,Prod:St,RaggedGather:Tt,RaggedTensorToTensor:kt,Range:Et,Real:_t,Reciprocal:Mt,Relu:It,Reshape:At,ResizeNearestNeighbor:Dt,ResizeNearestNeighborGrad:"ResizeNearestNeighborGrad",ResizeBilinear:$t,ResizeBilinearGrad:"ResizeBilinearGrad",Relu6:Ot,Reverse:Lt,Round:Ct,Rsqrt:Rt,ScatterNd:Ft,SearchSorted:zt,Select:Bt,Selu:Pt,Slice:jt,Sin:"Sin",Sinh:Vt,Sign:Gt,Sigmoid:Wt,Softplus:Ut,Sqrt:qt,Sum:"Sum",SpaceToBatchND:Ht,SplitV:Kt,Softmax:Zt,SparseFillEmptyRows:Yt,SparseReshape:Qt,SparseSegmentMean:Jt,SparseSegmentSum:Xt,SparseToDense:en,SquaredDifference:tn,Square:"Square",StridedSlice:nn,StringNGrams:rn,StringSplit:sn,StringToHashBucketFast:an,Sub:"Sub",Tan:"Tan",Tanh:on,Tile:un,TopK:ln,Transform:cn,Transpose:pn,Unique:hn,Unpack:dn,UnsortedSegmentSum:mn,UpperBound:"UpperBound",ZerosLike:fn,Step:gn,FromPixels:yn,RotateWithOffset:bn,_FusedMatMul:wn,FusedConv2D:xn,FusedDepthwiseConv2D:Nn,version_core:"3.21.0",browser:za,io:ya,math:Ma,serialization:so,test_util:uo,util:br,backend_util:Xp,broadcast_util:$a,tensor_util:Gr,slice_util:eo,gather_util:Pa,scatter_util:Wa,device_util:Jr,kernel_impls:eh});
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
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
var nh,rh;j().registerFlag("KEEP_INTERMEDIATE_TENSORS",(()=>!1),(e=>{e&&console.warn("Keep intermediate tensors is ON. This will print the values of all intermediate tensors during model inference. Not all models support this mode. For details, check e2e/benchmarks/ model_config.js. This significantly impacts performance.")})),function(e){e[e.DT_INVALID=0]="DT_INVALID",e[e.DT_FLOAT=1]="DT_FLOAT",e[e.DT_DOUBLE=2]="DT_DOUBLE",e[e.DT_INT32=3]="DT_INT32",e[e.DT_UINT8=4]="DT_UINT8",e[e.DT_INT16=5]="DT_INT16",e[e.DT_INT8=6]="DT_INT8",e[e.DT_STRING=7]="DT_STRING",e[e.DT_COMPLEX64=8]="DT_COMPLEX64",e[e.DT_INT64=9]="DT_INT64",e[e.DT_BOOL=10]="DT_BOOL",e[e.DT_QINT8=11]="DT_QINT8",e[e.DT_QUINT8=12]="DT_QUINT8",e[e.DT_QINT32=13]="DT_QINT32",e[e.DT_BFLOAT16=14]="DT_BFLOAT16",e[e.DT_QINT16=15]="DT_QINT16",e[e.DT_QUINT16=16]="DT_QUINT16",e[e.DT_UINT16=17]="DT_UINT16",e[e.DT_COMPLEX128=18]="DT_COMPLEX128",e[e.DT_HALF=19]="DT_HALF",e[e.DT_RESOURCE=20]="DT_RESOURCE",e[e.DT_VARIANT=21]="DT_VARIANT",e[e.DT_UINT32=22]="DT_UINT32",e[e.DT_UINT64=23]="DT_UINT64",e[e.DT_FLOAT_REF=101]="DT_FLOAT_REF",e[e.DT_DOUBLE_REF=102]="DT_DOUBLE_REF",e[e.DT_INT32_REF=103]="DT_INT32_REF",e[e.DT_UINT8_REF=104]="DT_UINT8_REF",e[e.DT_INT16_REF=105]="DT_INT16_REF",e[e.DT_INT8_REF=106]="DT_INT8_REF",e[e.DT_STRING_REF=107]="DT_STRING_REF",e[e.DT_COMPLEX64_REF=108]="DT_COMPLEX64_REF",e[e.DT_INT64_REF=109]="DT_INT64_REF",e[e.DT_BOOL_REF=110]="DT_BOOL_REF",e[e.DT_QINT8_REF=111]="DT_QINT8_REF",e[e.DT_QUINT8_REF=112]="DT_QUINT8_REF",e[e.DT_QINT32_REF=113]="DT_QINT32_REF",e[e.DT_BFLOAT16_REF=114]="DT_BFLOAT16_REF",e[e.DT_QINT16_REF=115]="DT_QINT16_REF",e[e.DT_QUINT16_REF=116]="DT_QUINT16_REF",e[e.DT_UINT16_REF=117]="DT_UINT16_REF",e[e.DT_COMPLEX128_REF=118]="DT_COMPLEX128_REF",e[e.DT_HALF_REF=119]="DT_HALF_REF",e[e.DT_RESOURCE_REF=120]="DT_RESOURCE_REF",e[e.DT_VARIANT_REF=121]="DT_VARIANT_REF",e[e.DT_UINT32_REF=122]="DT_UINT32_REF",e[e.DT_UINT64_REF=123]="DT_UINT64_REF"}(nh||(nh={})),function(e){var t;(t=e.CheckpointFormatVersion||(e.CheckpointFormatVersion={}))[t.LEGACY=0]="LEGACY",t[t.V1=1]="V1",t[t.V2=2]="V2"}(rh||(rh={}));
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
const sh={};function ah(e){return sh[e]}
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
 */function oh(e,t,n,r,s){const a=t.inputParams[e];if(a&&void 0!==a.inputIndexStart){const e=a.inputIndexStart,o=0===a.inputIndexEnd?void 0:void 0===a.inputIndexEnd?e+1:a.inputIndexEnd;if("tensor"===a.type)return ih(t.inputNames[a.inputIndexStart],n,r,s);if("tensors"===a.type){return t.inputNames.slice(e,o).map((e=>ih(e,n,r,s)))}const i=ih(t.inputNames.slice(e)[0],n,r,s),u=i.dataSync();return"number"===a.type?u[0]:O(i.shape,u)}const o=t.attrParams[e];return o&&o.value}function ih(e,t,n,r){const[s,a]=ch(e);if(null!=r){const e=r.getHashTableHandleByName(s);if(null!=e)return e}const o=n.currentContextIds.find((e=>!!t[lh(s,e)]));return void 0!==o?t[lh(s,o)][a]:void 0}function uh(e,t){const[n,r,s]=ch(e);return[lh(n,t&&t.currentContextId),r,s]}function lh(e,t){return t?`${e}-${t}`:e}function ch(e){const t=e.split(":");if(1===t.length)return[e,0,void 0];const n=t[0],r=3===t.length?t[1]:void 0;return[n,Number(t[t.length-1]),r]}function ph(e,t,n){let r=oh("pad",e,t,n);if("explicit"===r){r=oh("explicitPaddings",e,t,n);const s=[[0,0],[0,0],[0,0],[0,0]];for(let e=0;e<4;e++)s[e][0]=r[2*e],s[e][1]=r[2*e+1];return s}return r}function hh(e){return e.kept?e:ta(e)}
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
 */var dh=Object.freeze({__proto__:null,json:[{tfOpName:"Add",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AddV2",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AddN",category:"arithmetic",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}]},{tfOpName:"BiasAdd",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"Sub",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"RealDiv",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Div",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"DivNoNan",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"FloorDiv",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Mul",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Maximum",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Minimum",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Pow",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SquaredDifference",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Mod",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"FloorMod",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}]});
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
 */var mh=Object.freeze({__proto__:null,json:[{tfOpName:"Abs",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Acos",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Asin",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atan2",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Ceil",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ClipByValue",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"clipValueMin",type:"number"},{start:2,name:"clipValueMax",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Complex",category:"basic_math",inputs:[{start:0,name:"real",type:"tensor"},{start:1,name:"imag",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ComplexAbs",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cos",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cosh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Elu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Exp",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Floor",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Log",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Imag",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"Tout",name:"outputType",type:"dtype",notSupported:!0}]},{tfOpName:"Neg",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Real",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"Tout",name:"outputType",type:"dtype",notSupported:!0}]},{tfOpName:"Prelu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"alpha",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Relu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Relu6",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Selu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sigmoid",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sin",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sinh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sqrt",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Rsqrt",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Square",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Tan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Tanh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sign",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Round",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Expm1",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Log1p",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Reciprocal",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Softplus",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Asinh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Acosh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atanh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Erf",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Prod",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axes",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool",notSupported:!0},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LeakyRelu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"alpha",name:"alpha",type:"number",defaultValue:.2},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"IsNan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}]});
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
 */var fh=Object.freeze({__proto__:null,json:[{tfOpName:"EmptyTensorList",category:"control",inputs:[{start:0,name:"elementShape",type:"shape"},{start:1,name:"maxNumElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"LoopCond",category:"control",inputs:[{start:0,name:"pred",type:"tensor"}]},{tfOpName:"Switch",category:"control",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"pred",type:"tensor"}]},{tfOpName:"Merge",category:"control",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}]},{tfOpName:"Enter",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"frame_name",name:"frameName",type:"string"},{tfName:"is_constant",name:"isConstant",type:"bool"}]},{tfOpName:"Exit",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"NextIteration",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayV3",category:"control",inputs:[{start:0,name:"size",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"dynamic_size",name:"dynamicSize",type:"bool"},{tfName:"clear_after_read",name:"clearAfterRead",type:"bool"},{tfName:"identical_element_shapes",name:"identicalElementShapes",type:"bool"},{tfName:"tensor_array_name",name:"name",type:"string"}]},{tfOpName:"TensorArrayWriteV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"tensor",type:"tensor"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayReadV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayGatherV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape",name:"elementShape",type:"shape"}]},{tfOpName:"TensorArrayScatterV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"tensor",type:"tensor"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"TensorArrayConcatV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape_except0",name:"elementShapeExcept0",type:"shape",notSupported:!0}]},{tfOpName:"TensorArraySplitV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"tensor",type:"tensor"},{start:2,name:"lengths",type:"number[]"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"TensorArraySizeV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"flowIn",type:"number"}]},{tfOpName:"TensorArrayCloseV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"}]},{tfOpName:"StatelessIf",category:"control",inputs:[{start:0,name:"cond",type:"tensor"},{start:1,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"then_branch",name:"thenBranch",type:"func"},{tfName:"else_branch",name:"elseBranch",type:"func"}]},{tfOpName:"If",category:"control",inputs:[{start:0,name:"cond",type:"tensor"},{start:1,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"then_branch",name:"thenBranch",type:"func"},{tfName:"else_branch",name:"elseBranch",type:"func"}]},{tfOpName:"StatelessWhile",category:"control",inputs:[{start:0,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"cond",name:"cond",type:"func"},{tfName:"body",name:"body",type:"func"}]},{tfOpName:"While",category:"control",inputs:[{start:0,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"cond",name:"cond",type:"func"},{tfName:"body",name:"body",type:"func"}]},{tfOpName:"TensorListScatter",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListScatterV2",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"},{start:3,name:"numElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListGather",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListGetItem",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListSetItem",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"tensor",type:"tensor"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListReserve",category:"control",inputs:[{start:0,name:"elementShape",type:"shape"},{start:1,name:"numElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListFromTensor",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListStack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"},{tfName:"num_elements",name:"numElements",type:"dtype"}]},{tfOpName:"TensorListSplit",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"elementShape",type:"shape"},{start:2,name:"lengths",type:"number[]"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListConcat",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}],attrs:[{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListConcatV2",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}],attrs:[{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListPopBack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListPushBack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"tensor",type:"tensor"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListLength",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}]},{tfOpName:"TensorListResize",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"size",type:"number"}]}]});
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
 */var gh=Object.freeze({__proto__:null,json:[{tfOpName:"AvgPool",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPool",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[],notSupported:!0},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPoolWithArgmax",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"include_batch_in_index",name:"includeBatchInIndex",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AvgPool3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPool3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Conv1D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"stride",name:"stride",type:"number"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NWC"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"dilation",name:"dilation",type:"number",defaultValue:1}]},{tfOpName:"Conv2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"useCudnnOnGpu",name:"useCudnnOnGpu",type:"bool"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"_FusedConv2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"use_cudnn_on_gpu",name:"useCudnnOnGpu",type:"bool",defaultValue:!0},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]",defaultValue:[1,1,1,1]},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:1e-4},{tfName:"leakyrelu_alpha",name:"leakyreluAlpha",type:"number",defaultValue:.2}]},{tfOpName:"Conv2DBackpropInput",category:"convolution",inputs:[{start:2,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:0,name:"outputShape",type:"number[]"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]",notSupported:!0}]},{tfOpName:"DepthwiseConv2d",category:"convolution",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"DepthwiseConv2dNative",category:"convolution",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"FusedDepthwiseConv2dNative",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]",defaultValue:[1,1,1,1]},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]}]},{tfOpName:"Conv3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"Dilation2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"rates",name:"dilations",type:"number[]"},{tfName:"padding",name:"pad",type:"string"}]}]});
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
 */var yh=Object.freeze({__proto__:null,json:[{tfOpName:"Fill",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"},{start:1,name:"value",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"LinSpace",category:"creation",inputs:[{start:0,name:"start",type:"number"},{start:1,name:"stop",type:"number"},{start:2,name:"num",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"OneHot",category:"creation",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"depth",type:"number"},{start:2,name:"onValue",type:"number",defaultValue:1},{start:3,name:"offValue",type:"number",defaultValue:0}],attrs:[{tfName:"axis",name:"axis",type:"number",notSupported:!0},{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"Ones",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"OnesLike",category:"creation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"RandomStandardNormal",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"RandomUniform",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"minval",name:"minval",type:"number",defaultValue:0},{tfName:"maxval",name:"maxval",type:"number",defaultValue:1},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"Range",category:"creation",inputs:[{start:0,name:"start",type:"number"},{start:1,name:"stop",type:"number"},{start:2,name:"step",type:"number",defaultValue:0}],attrs:[{tfName:"Tidx",name:"dtype",type:"dtype"}]},{tfOpName:"TruncatedNormal",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"means",name:"mean",type:"number",defaultValue:0},{tfName:"stddev",name:"stdDev",type:"number",defaultValue:1},{tfName:"seed",name:"seed",type:"number"},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"Zeros",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"ZerosLike",category:"creation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"Multinomial",category:"creation",inputs:[{start:0,name:"logits",type:"tensor"},{start:1,name:"numSamples",type:"number"}],attrs:[{tfName:"seed",name:"seed",type:"number"},{tfName:"seed2",name:"seed2",type:"number"},{tfName:"T",name:"dtype",type:"dtype"},{tfName:"output_dtype",name:"output_dtype",type:"dtype"}]}]});
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
 */var bh=Object.freeze({__proto__:null,json:[{tfOpName:"NonMaxSuppressionV2",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"}]},{tfOpName:"NonMaxSuppressionV3",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"}]},{tfOpName:"NonMaxSuppressionV4",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"T_threshold",name:"threshold",type:"dtype",notSupported:!0},{tfName:"pad_to_max_output_size",name:"padToMaxOutputSize",type:"bool"}]},{tfOpName:"NonMaxSuppressionV5",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"},{start:5,name:"softNmsSigma",type:"number"}]},{tfOpName:"Where",category:"dynamic",inputs:[{start:0,name:"condition",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ListDiff",category:"dynamic",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}]});
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
 */var wh=Object.freeze({__proto__:null,json:[{tfOpName:"LowerBound",category:"evaluation",inputs:[{start:0,name:"sortedSequence",type:"tensor"},{start:1,name:"values",type:"tensor"}]},{tfOpName:"TopKV2",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"k",type:"number"}],attrs:[{tfName:"sorted",name:"sorted",type:"bool"}]},{tfOpName:"UpperBound",category:"evaluation",inputs:[{start:0,name:"sortedSequence",type:"tensor"},{start:1,name:"values",type:"tensor"}]},{tfOpName:"Unique",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"UniqueV2",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]}]});
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
 */var xh=Object.freeze({__proto__:null,json:[{tfOpName:"PlaceholderWithDefault",category:"graph",inputs:[{start:0,name:"default",type:"tensor"}],attrs:[{tfName:"shape",name:"shape",type:"shape"},{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"Placeholder",category:"graph",attrs:[{tfName:"shape",name:"shape",type:"shape"},{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"Const",category:"graph"},{tfOpName:"Identity",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"IdentityN",category:"graph",inputs:[{start:0,end:0,name:"x",type:"tensors"}]},{tfOpName:"Snapshot",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Rank",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Size",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Shape",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"ShapeN",category:"graph",inputs:[{start:0,end:0,name:"x",type:"tensors"}]},{tfOpName:"Print",category:"graph",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"data",type:"tensors"}],attrs:[{tfName:"message",name:"message",type:"string"},{tfName:"first_n",name:"firstN",type:"number",notSupported:!0},{tfName:"summarize",name:"summarize",type:"number",defaultValue:3}]},{tfOpName:"NoOp",category:"graph",inputs:[]},{tfOpName:"StopGradient",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"FakeQuantWithMinMaxVars",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"min",name:"min",type:"number"},{tfName:"max",name:"max",type:"number"}]}]});
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
 */var Nh=Object.freeze({__proto__:null,json:[{tfOpName:"HashTable",category:"hash_table",inputs:[],attrs:[{tfName:"shared_name",name:"sharedName",type:"string"},{tfName:"use_node_name_sharing",name:"useNodeNameSharing",type:"bool"},{tfName:"key_dtype",name:"keyDType",type:"dtype"},{tfName:"value_dtype",name:"valueDType",type:"dtype"}]},{tfOpName:"HashTableV2",category:"hash_table",inputs:[],attrs:[{tfName:"shared_name",name:"sharedName",type:"string"},{tfName:"use_node_name_sharing",name:"useNodeNameSharing",type:"bool"},{tfName:"key_dtype",name:"keyDType",type:"dtype"},{tfName:"value_dtype",name:"valueDType",type:"dtype"}]},{tfOpName:"LookupTableImport",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableImportV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableFind",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableFindV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableSize",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"}]},{tfOpName:"LookupTableSizeV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"}]}]});
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
 */var vh=Object.freeze({__proto__:null,json:[{tfOpName:"ResizeBilinear",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"size",type:"number[]"}],attrs:[{tfName:"align_corners",name:"alignCorners",type:"bool"},{tfName:"half_pixel_centers",name:"halfPixelCenters",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ResizeNearestNeighbor",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"size",type:"number[]"}],attrs:[{tfName:"align_corners",name:"alignCorners",type:"bool"},{tfName:"half_pixel_centers",name:"halfPixelCenters",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"CropAndResize",category:"image",inputs:[{start:0,name:"image",type:"tensor"},{start:1,name:"boxes",type:"tensor"},{start:2,name:"boxInd",type:"tensor"},{start:3,name:"cropSize",type:"number[]"}],attrs:[{tfName:"method",name:"method",type:"string"},{tfName:"extrapolation_value",name:"extrapolationValue",type:"number"}]},{tfOpName:"ImageProjectiveTransformV3",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"transforms",type:"tensor"},{start:2,name:"outputShape",type:"number[]"},{start:3,name:"fillValue",type:"number"}],attrs:[{tfName:"interpolation",name:"interpolation",type:"string"},{tfName:"fill_mode",name:"fillMode",type:"string"}]}]});
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
 */var Sh=Object.freeze({__proto__:null,json:[{tfOpName:"Equal",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"NotEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Greater",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"GreaterEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Less",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LessEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalAnd",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalNot",category:"logical",inputs:[{start:0,name:"a",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalOr",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Select",category:"logical",inputs:[{start:0,name:"condition",type:"tensor"},{start:1,name:"a",type:"tensor"},{start:2,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SelectV2",category:"logical",inputs:[{start:0,name:"condition",type:"tensor"},{start:1,name:"a",type:"tensor"},{start:2,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}]});
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
 */var Th=Object.freeze({__proto__:null,json:[{tfOpName:"_FusedMatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:1e-4},{tfName:"transpose_a",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"transpose_b",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"leakyrelu_alpha",name:"leakyreluAlpha",type:"number",defaultValue:.2},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"transpose_a",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"transpose_b",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BatchMatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"adj_x",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"adj_y",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BatchMatMulV2",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"adj_x",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"adj_y",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Transpose",category:"matrices",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"perm",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Einsum",category:"matrices",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}],attrs:[{tfName:"equation",name:"equation",type:"string"},{tfName:"N",name:"n",type:"number",defaultValue:2},{tfName:"T",name:"dtype",type:"dtype"}]}]});
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
 */var kh=Object.freeze({__proto__:null,json:[{tfOpName:"EuclideanNorm",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool",defaultValue:!1}]},{tfOpName:"FusedBatchNorm",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"FusedBatchNormV2",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"FusedBatchNormV3",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"LRN",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"depth_radius",name:"radius",type:"number",defaultValue:5},{tfName:"bias",name:"bias",type:"number",defaultValue:1},{tfName:"alpha",name:"alpha",type:"number",defaultValue:1},{tfName:"beta",name:"beta",type:"number",defaultValue:.5}]},{tfOpName:"Softmax",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"LogSoftmax",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"SparseToDense",category:"normalization",inputs:[{start:0,name:"sparseIndices",type:"tensor"},{start:1,name:"outputShape",type:"number[]"},{start:2,name:"sparseValues",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",defaultValue:!0,notSupported:!0}]}]});
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
 */var Eh=Object.freeze({__proto__:null,json:[{tfOpName:"Bincount",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"size",type:"number"},{start:2,name:"weights",type:"tensor"}]},{tfOpName:"DenseBincount",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"size",type:"number"},{start:2,name:"weights",type:"tensor"}],attrs:[{tfName:"binary_output",name:"binaryOutput",type:"bool"}]},{tfOpName:"Max",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Mean",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Min",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Sum",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"All",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Any",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"ArgMax",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"ArgMin",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"Prod",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Cumprod",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}],attrs:[{tfName:"exclusive",name:"exclusive",type:"bool"},{tfName:"reverse",name:"reverse",type:"bool"}]},{tfOpName:"Cumsum",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}],attrs:[{tfName:"exclusive",name:"exclusive",type:"bool"},{tfName:"reverse",name:"reverse",type:"bool"}]}]});
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
 */var _h=Object.freeze({__proto__:null,json:[{tfOpName:"ConcatV2",category:"slice_join",inputs:[{start:0,end:-1,name:"tensors",type:"tensors"},{start:-1,name:"axis",type:"number"}],attrs:[{tfName:"N",name:"n",type:"number",defaultValue:2}]},{tfOpName:"Concat",category:"slice_join",inputs:[{start:1,end:0,name:"tensors",type:"tensors"},{start:0,name:"axis",type:"number"}],attrs:[{tfName:"N",name:"n",type:"number",defaultValue:2}]},{tfOpName:"GatherV2",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"axis",type:"number",defaultValue:0}],attrs:[{tfName:"batch_dims",name:"batchDims",type:"number",defaultValue:0}]},{tfOpName:"Gather",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",notSupported:!0}]},{tfOpName:"Reverse",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"dims",type:"bool[]"}]},{tfOpName:"ReverseV2",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}]},{tfOpName:"Slice",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"begin",type:"number[]"},{start:2,name:"size",type:"number[]"}]},{tfOpName:"StridedSlice",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"begin",type:"number[]"},{start:2,name:"end",type:"number[]"},{start:3,name:"strides",type:"number[]"}],attrs:[{tfName:"begin_mask",name:"beginMask",type:"number",defaultValue:0},{tfName:"end_mask",name:"endMask",type:"number",defaultValue:0},{tfName:"new_axis_mask",name:"newAxisMask",type:"number",defaultValue:0},{tfName:"ellipsis_mask",name:"ellipsisMask",type:"number",defaultValue:0},{tfName:"shrink_axis_mask",name:"shrinkAxisMask",type:"number",defaultValue:0}]},{tfOpName:"Pack",category:"slice_join",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}],attrs:[{tfName:"axis",name:"axis",type:"number",defaultValue:0}]},{tfOpName:"Unpack",category:"slice_join",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"axis",name:"axis",type:"number",defaultValue:0},{tfName:"num",name:"num",type:"number",defaultValue:0,notSupported:!0}]},{tfOpName:"Tile",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"reps",type:"number[]"}]},{tfOpName:"Split",category:"slice_join",inputs:[{start:0,name:"axis",type:"number",defaultValue:0},{start:1,name:"x",type:"tensor"}],attrs:[{tfName:"num_split",name:"numOrSizeSplits",type:"number",defaultValue:1}]},{tfOpName:"SplitV",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"numOrSizeSplits",type:"number[]"},{start:2,name:"axis",type:"number",defaultValue:0}]},{tfOpName:"ScatterNd",category:"slice_join",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"values",type:"tensor"},{start:2,name:"shape",type:"number[]"}]},{tfOpName:"GatherNd",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"}]},{tfOpName:"SparseToDense",category:"slice_join",inputs:[{start:0,name:"sparseIndices",type:"tensor"},{start:1,name:"outputShape",type:"number[]"},{start:2,name:"sparseValues",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",defaultValue:!1,notSupported:!0}]}]});
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
 */var Mh=Object.freeze({__proto__:null,json:[{tfOpName:"SparseFillEmptyRows",category:"sparse",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"values",type:"tensor"},{start:2,name:"denseShape",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}]},{tfOpName:"SparseReshape",category:"sparse",inputs:[{start:0,name:"inputIndices",type:"tensor"},{start:1,name:"inputShape",type:"tensor"},{start:2,name:"newShape",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SparseSegmentMean",category:"sparse",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"segmentIds",type:"tensor"}]},{tfOpName:"SparseSegmentSum",category:"sparse",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"segmentIds",type:"tensor"}]}]});
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
 */var Ih=Object.freeze({__proto__:null,json:[{tfOpName:"FFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"IFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"RFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"fft_length",type:"number",notSupported:!0}]},{tfOpName:"IRFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"fft_length",type:"number",notSupported:!0}]}]});
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
 */var Ah=Object.freeze({__proto__:null,json:[{tfOpName:"StringNGrams",category:"string",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"dataSplits",type:"tensor"}],attrs:[{tfName:"separator",name:"separator",type:"string"},{tfName:"ngram_widths",name:"nGramWidths",type:"number[]"},{tfName:"left_pad",name:"leftPad",type:"string"},{tfName:"right_pad",name:"rightPad",type:"string"},{tfName:"pad_width",name:"padWidth",type:"number"},{tfName:"preserve_short_sequences",name:"preserveShortSequences",type:"bool"}],outputs:["ngrams","ngrams_splits"]},{tfOpName:"StringSplit",category:"string",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"delimiter",type:"tensor"}],attrs:[{tfName:"skip_empty",name:"skipEmpty",type:"bool"}],outputs:["indices","values","shape"]},{tfOpName:"StringToHashBucketFast",category:"string",inputs:[{start:0,name:"input",type:"tensor"}],attrs:[{tfName:"num_buckets",name:"numBuckets",type:"number"}]}]});
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
 */var Dh=Object.freeze({__proto__:null,json:[{tfOpName:"Cast",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"SrcT",name:"sdtype",type:"dtype",notSupported:!0},{tfName:"DstT",name:"dtype",type:"dtype"}]},{tfOpName:"ExpandDims",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"MirrorPad",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"}],attrs:[{tfName:"mode",name:"mode",type:"string"}]},{tfOpName:"Pad",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"}],attrs:[{tfName:"constant_value",name:"constantValue",type:"number",defaultValue:0}]},{tfOpName:"PadV2",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"},{start:2,name:"constantValue",type:"number",defaultValue:0}]},{tfOpName:"Reshape",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}]},{tfOpName:"Squeeze",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"axis",tfDeprecatedName:"squeeze_dims",name:"axis",type:"number[]"}]},{tfOpName:"SpaceToBatchND",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"blockShape",type:"number[]"},{start:2,name:"paddings",type:"number[]"}]},{tfOpName:"BatchToSpaceND",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"blockShape",type:"number[]"},{start:2,name:"crops",type:"number[]"}]},{tfOpName:"DepthToSpace",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"block_size",name:"blockSize",type:"number"},{tfName:"data_format",name:"dataFormat",type:"string"}]},{tfOpName:"BroadcastTo",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}],attrs:[]},{tfOpName:"BroadcastArgs",category:"transformation",inputs:[{start:0,name:"s0",type:"tensor"},{start:1,name:"s1",type:"tensor"}],attrs:[]}]});
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
 */class $h{static get Instance(){return this._instance||(this._instance=new this)}constructor(){const e=[].concat(...[dh,mh,fh,gh,yh,bh,wh,xh,Nh,vh,Sh,Th,kh,Eh,_h,Mh,Ih,Ah,Dh].map((e=>e.json)));this.opMappers=e.reduce(((e,t)=>(e[t.tfOpName]=t,e)),{})}transformGraph(e,t={}){const n=e.node,r=[],s=[],a=[],o=n.reduce(((e,t)=>(e[t.name]=this.mapNode(t),t.op.startsWith("Placeholder")?r.push(e[t.name]):"Const"===t.op?s.push(e[t.name]):null!=t.input&&0!==t.input.length||a.push(e[t.name]),e)),{});let i=[];const u=[];let l={},c={};null!=t&&(l=this.mapSignatureEntries(t.inputs),c=this.mapSignatureEntries(t.outputs));const p=Object.keys(o);p.forEach((e=>{const t=o[e];t.inputNames.forEach(((e,n)=>{const[r,,s]=uh(e),a=o[r];if(null!=a.outputs){const e=a.outputs.indexOf(s);if(-1!==e){const s=`${r}:${e}`;t.inputNames[n]=s}}t.inputs.push(a),a.children.push(t)}))})),0===Object.keys(c).length?p.forEach((e=>{const t=o[e];0===t.children.length&&u.push(t)})):Object.keys(c).forEach((e=>{const[t]=uh(e),n=o[t];null!=n&&(n.signatureKey=c[e],u.push(n))})),Object.keys(l).length>0?Object.keys(l).forEach((e=>{const[t]=uh(e),n=o[t];n&&(n.signatureKey=l[e],i.push(n))})):i=r;let h={};null!=e.library&&null!=e.library.function&&(h=e.library.function.reduce(((e,t)=>(e[t.signature.name]=this.mapFunction(t),e)),{}));const d={nodes:o,inputs:i,outputs:u,weights:s,placeholders:r,signature:t,functions:h};return a.length>0&&(d.initNodes=a),d}mapSignatureEntries(e){return Object.keys(e||{}).reduce(((t,n)=>(t[e[n].name]=n,t)),{})}mapNode(e){const t=ah(e.op)||this.opMappers[e.op]||{};null==e.attr&&(e.attr={});const n={name:e.name,op:e.op,category:t.category,inputNames:(e.input||[]).map((e=>e.startsWith("^")?e.slice(1):e)),inputs:[],children:[],inputParams:{},attrParams:{},rawAttrs:e.attr,outputs:t.outputs};return null!=t.inputs&&(n.inputParams=t.inputs.reduce(((e,t)=>(e[t.name]={type:t.type,inputIndexStart:t.start,inputIndexEnd:t.end},e)),{})),null!=t.attrs&&(n.attrParams=t.attrs.reduce(((t,n)=>{const r=n.type;let s;switch(n.type){case"string":s=Lh(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=Lh(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"string[]":s=Wh(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=Wh(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"number":s=Rh(e.attr,n.tfName,n.defaultValue||0),void 0===s&&n.tfDeprecatedName&&(s=Rh(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"number[]":s=Gh(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=Gh(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"bool":s=Ch(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=Ch(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"bool[]":s=qh(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=qh(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"shape":s=Vh(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=Vh(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"shape[]":s=Uh(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=Uh(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"dtype":s=Bh(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=Bh(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"dtype[]":s=Ph(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=Ph(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"func":s=zh(e.attr,n.tfName,n.defaultValue),void 0===s&&n.tfDeprecatedName&&(s=zh(e.attr,n.tfDeprecatedName,n.defaultValue));break;case"tensor":case"tensors":break;default:throw new Error(`Unsupported param type: ${n.type} for op: ${e.op}`)}return t[n.name]={value:s,type:r},t}),{})),n}mapFunction(e){const t=e.nodeDef,n=[];let r={};null!=t&&(r=t.reduce(((e,t)=>(e[t.name]=this.mapNode(t),"Const"===t.op&&n.push(e[t.name]),e)),{}));const s=[],a=[];e.signature.inputArg.forEach((e=>{const[t]=uh(e.name),n={name:t,op:"Placeholder",inputs:[],inputNames:[],category:"graph",inputParams:{},attrParams:{dtype:{value:Fh(e.type),type:"dtype"}},children:[]};n.signatureKey=e.name,s.push(n),r[t]=n}));Object.keys(r).forEach((e=>{const t=r[e];t.inputNames.forEach(((e,n)=>{const[s,,a]=uh(e),o=r[s];if(null!=o.outputs){const e=o.outputs.indexOf(a);if(-1!==e){const r=`${s}:${e}`;t.inputNames[n]=r}}t.inputs.push(o),o.children.push(t)}))}));const o=e.ret;e.signature.outputArg.forEach((e=>{const[t,n]=uh(o[e.name]),s=r[t];null!=s&&(s.defaultOutput=n,a.push(s))}));const i=this.mapArgsToSignature(e);return{nodes:r,inputs:s,outputs:a,weights:n,placeholders:[],signature:i}}mapArgsToSignature(e){return{methodName:e.signature.name,inputs:e.signature.inputArg.reduce(((e,t)=>(e[t.name]=this.mapArgToTensorInfo(t),e)),{}),outputs:e.signature.outputArg.reduce(((t,n)=>(t[n.name]=this.mapArgToTensorInfo(n,e.ret),t)),{})}}mapArgToTensorInfo(e,t){let n=e.name;return null!=t&&(n=t[n]),{name:n,dtype:e.type}}}function Oh(e,t){const n=Array.isArray(e)?String.fromCharCode.apply(null,e):function(e){const t=j().global;if(void 0!==t.atob)return t.atob(e);if("undefined"!=typeof Buffer)return new Buffer(e,"base64").toString();throw new Error("Unable to decode base64 in this environment. Missing built-in atob() or Buffer()")}(e);return t?n:n.toLowerCase()}function Lh(e,t,n,r=!1){const s=e[t];return null!=s?Oh(s.s,r):n}function Ch(e,t,n){const r=e[t];return r?r.b:n}function Rh(e,t,n){const r=e[t]||{},s=null!=r.i?r.i:null!=r.f?r.f:n;return"number"==typeof s?s:parseInt(s,10)}function Fh(e){switch("string"==typeof e&&(e=nh[e]),e){case nh.DT_FLOAT:case nh.DT_HALF:return"float32";case nh.DT_INT32:case nh.DT_INT64:case nh.DT_INT8:case nh.DT_UINT8:return"int32";case nh.DT_BOOL:return"bool";case nh.DT_DOUBLE:return"float32";case nh.DT_STRING:return"string";default:return null}}function zh(e,t,n){const r=e[t];return r&&r.func?r.func.name:n}function Bh(e,t,n){const r=e[t];return r&&r.type?Fh(r.type):n}function Ph(e,t,n){const r=e[t];return r&&r.list&&r.list.type?r.list.type.map((e=>Fh(e))):n}function jh(e){if(!e.unknownRank)return null!=e.dim?e.dim.map((e=>"number"==typeof e.size?e.size:parseInt(e.size,10))):[]}function Vh(e,t,n){const r=e[t];return r&&r.shape?jh(r.shape):n}function Gh(e,t,n){const r=e[t];return r?((r.list.f&&r.list.f.length?r.list.f:r.list.i)||[]).map((e=>"number"==typeof e?e:parseInt(e,10))):n}function Wh(e,t,n,r=!1){const s=e[t];return s&&s.list&&s.list.s?s.list.s.map((e=>Oh(e,r))):n}function Uh(e,t,n){const r=e[t];return r&&r.list&&r.list.shape?r.list.shape.map((e=>jh(e))):n}function qh(e,t,n){const r=e[t];return r&&r.list&&r.list.b?r.list.b:n}
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
 */class Hh{constructor(e,t,n){this.node=e,this.tensorMap=t,this.context=n,this.inputs=[],this.attrs={},this.inputs=e.inputNames.map((e=>this.getInput(e))),null!=e.rawAttrs&&(this.attrs=Object.keys(e.rawAttrs).reduce(((e,t)=>(e[t]=this.getAttr(t),e)),{}))}getInput(e){return ih(e,this.tensorMap,this.context)}getAttr(e,t){const n=this.node.rawAttrs[e];if(null!=n.tensor)return ih(e,this.tensorMap,this.context);if(null!=n.i||null!=n.f)return Rh(this.node.rawAttrs,e,t);if(null!=n.s)return Lh(this.node.rawAttrs,e,t);if(null!=n.b)return Ch(this.node.rawAttrs,e,t);if(null!=n.shape)return Vh(this.node.rawAttrs,e,t);if(null!=n.type)return Bh(this.node.rawAttrs,e,t);if(null!=n.list){if(null!=n.list.i||null!=n.list.f)return Gh(this.node.rawAttrs,e,t);if(null!=n.list.s)return Wh(this.node.rawAttrs,e,t);if(null!=n.list.shape)return Uh(this.node.rawAttrs,e,t);if(null!=n.list.b)return qh(this.node.rawAttrs,e,t);if(null!=n.list.type)return Ph(this.node.rawAttrs,e,t)}return t}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Kh=Object.freeze({__proto__:null,abs:mo,acos:fo,acosh:go,add:lo,addN:yo,all:bo,any:wo,argMax:xo,argMin:No,asin:vo,asinh:So,atan:To,atan2:ko,atanh:Eo,avgPool:Po,avgPool3d:jo,basicLSTMCell:qo,batchToSpaceND:Ho,batchNorm:Ko,batchNorm2d:Zo,batchNorm3d:Yo,batchNorm4d:Qo,bincount:Jo,broadcastArgs:Xo,broadcastTo:ei,buffer:Xs,cast:ea,ceil:ti,clipByValue:ri,clone:ta,complex:is,concat:Vo,concat1d:si,concat2d:ai,concat3d:oi,concat4d:ii,conv1d:li,conv2d:ui,conv2dTranspose:pi,conv3d:hi,conv3dTranspose:mi,cos:fi,cosh:gi,cumprod:yi,cumsum:bi,denseBincount:wi,depthToSpace:xi,depthwiseConv2d:Ni,diag:vi,dilation2d:Si,div:po,divNoNan:_i,dot:Mi,einsum:Ii,elu:Ai,equal:Ti,erf:Di,euclideanNorm:Wi,exp:Ui,expandDims:qi,expm1:Hi,eye:Zi,fill:ni,floor:Yi,floorDiv:co,gather:Qi,greater:Ji,greaterEqual:Xi,imag:Sa,isFinite:eu,isInf:tu,isNaN:nu,leakyRelu:ru,less:su,lessEqual:au,linspace:ou,localResponseNormalization:iu,log:uu,log1p:lu,logSigmoid:mu,logSoftmax:gu,logSumExp:yu,logicalAnd:bu,logicalNot:wu,logicalOr:xu,logicalXor:Nu,lowerBound:Tu,matMul:ba,max:Ci,maxPool:ku,maxPool3d:Eu,maxPoolWithArgmax:_u,maximum:Mu,mean:Iu,meshgrid:$u,min:Ri,minimum:Ou,mirrorPad:Lu,mod:Cu,moments:Ru,mul:ho,multiRNNCell:Fu,multinomial:zu,neg:Ta,notEqual:Bu,oneHot:wa,ones:Du,onesLike:Pu,outerProduct:ju,pad:Vu,pad1d:Gu,pad2d:Wu,pad3d:Uu,pad4d:qu,pool:Ku,pow:Fi,prelu:Zu,print:na,prod:Yu,raggedGather:Qu,raggedTensorToTensor:Ju,rand:Xu,randomGamma:bl,randomNormal:wl,randomStandardNormal:xl,randomUniform:Nl,range:vl,real:ka,reciprocal:Sl,relu:Tl,relu6:kl,reshape:Bo,reverse:El,reverse1d:_l,reverse2d:Ml,reverse3d:Il,reverse4d:Al,round:Dl,rsqrt:$l,scalar:zi,selu:Ol,separableConv2d:Ll,setdiff1dAsync:Cl,sigmoid:Go,sign:Rl,sin:Fl,sinh:zl,slice:Wo,slice1d:Bl,slice2d:Pl,slice3d:jl,slice4d:Vl,softmax:Gl,softplus:du,spaceToBatchND:Hu,fft:Wl,ifft:Ul,irfft:ql,rfft:Kl,split:Hl,sqrt:Bi,square:Pi,squaredDifference:Zl,squeeze:Yl,stack:Ql,step:Jl,stridedSlice:Xl,sub:fu,sum:ji,tan:ec,tanh:Uo,tensor:ls,tensor1d:tc,tensor2d:nc,tensor3d:Oa,tensor4d:rc,tensor5d:sc,tensor6d:ac,tile:Ki,topk:oc,truncatedNormal:ic,unique:uc,unsortedSegmentSum:lc,unstack:cc,upperBound:pc,variable:hc,where:ki,whereAsync:mc,zeros:Au,zerosLike:Ei,op:os,OP_SCOPE_SUFFIX:as,booleanMaskAsync:fc,transpose:Ea,norm:Gi,movingAverage:gc,scatterND:yc,searchSorted:Su,sparseToDense:bc,gatherND:wc,dropout:xc,enclosingPowerOfTwo:Nc,cosineWindow:vc,inTopKAsync:Sc,image:$p,linalg:Op,losses:Lp,spectral:Ap,fused:Lc,signal:Dp,sparse:Cp,string:Rp});
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
function Zh(e,t,n=""){if("number"!=typeof e&&"number"!=typeof t){u(e.length===t.length,(()=>n+` Shapes ${e} and ${t} must match`));for(let r=0;r<e.length;r++){const s=e[r],a=t[r];u(s<0||a<0||s===a,(()=>n+` Shapes ${e} and ${t} must match`))}}}function Yh(e){return"number"!=typeof e&&!e.some((e=>e<0))}function Qh(e,t,n){let r=Jh(e,n);const s=!Yh(r);if(s&&0===t.length)throw new Error(`Tried to calculate elements of an empty list with non-fully-defined elementShape: ${r}`);if(s&&t.forEach((e=>{r=Jh(e.shape,r)})),!Yh(r))throw new Error(`Non-fully-defined elementShape: ${r}`);return r}function Jh(e,t){if("number"==typeof e)return t;if("number"==typeof t)return e;if(e.length!==t.length)throw new Error(`Incompatible ranks during merge: ${e} vs. ${t}`);const n=[];for(let r=0;r<e.length;++r){const s=e[r],a=t[r];if(s>=0&&a>=0&&s!==a)throw new Error(`Incompatible shape during merge: ${e} vs. ${t}`);n[r]=s>=0?s:a}return n}
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
 */class Xh{constructor(e,t,n,r,s,a,o){this.name=e,this.dtype=t,this.maxSize=n,this.elementShape=r,this.identicalElementShapes=s,this.dynamicSize=a,this.clearAfterRead=o,this.tensors=[],this.closed_=!1,this.idTensor=zi(0),va(this.idTensor)}get id(){return this.idTensor.id}get closed(){return this.closed_}clearAndClose(e){this.tensors.forEach((t=>{null!=e&&e.has(t.tensor.id)||t.tensor.dispose()})),this.tensors=[],this.closed_=!0,this.idTensor.dispose()}size(){return this.tensors.length}read(e){if(this.closed_)throw new Error(`TensorArray ${this.name} has already been closed.`);if(e<0||e>=this.size())throw new Error(`Tried to read from index ${e}, but array size is: ${this.size()}`);const t=this.tensors[e];if(t.cleared)throw new Error(`TensorArray ${this.name}: Could not read index ${e} twice because it was cleared after a previous read (perhaps try setting clear_after_read = false?).`);return this.clearAfterRead&&(t.cleared=!0),t.read=!0,t.tensor}readMany(e){return e.map((e=>this.read(e)))}write(e,t){if(this.closed_)throw new Error(`TensorArray ${this.name} has already been closed.`);if(e<0||!this.dynamicSize&&e>=this.maxSize)throw new Error(`Tried to write to index ${e}, but array is not resizeable and size is: ${this.maxSize}`);const n=this.tensors[e]||{};if(t.dtype!==this.dtype)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e},\n          because the value dtype is ${t.dtype}, but TensorArray dtype is ${this.dtype}.`);if(0!==this.size()||null!=this.elementShape&&0!==this.elementShape.length||(this.elementShape=t.shape),Zh(this.elementShape,t.shape,`TensorArray ${this.name}: Could not write to TensorArray index ${e}.`),n.read)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been read.`);if(n.written)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been written.`);n.tensor=t,va(t),n.written=!0,this.tensors[e]=n}writeMany(e,t){if(e.length!==t.length)throw new Error(`TensorArray ${this.name}: could not write multiple tensors,because the index size: ${e.length} is not the same as tensors size: ${t.length}.`);e.forEach(((e,n)=>this.write(e,t[n])))}gather(e,t){if(t&&t!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but gather requested dtype ${t}`);if(e)e=e.slice(0,this.size());else{e=[];for(let t=0;t<this.size();t++)e.push(t)}if(0===e.length)return ls([],[0].concat(this.elementShape));const n=this.readMany(e);return Zh(this.elementShape,n[0].shape,"TensorArray shape mismatch: "),Ql(n,0)}concat(e){if(e&&e!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but concat requested dtype ${e}`);if(0===this.size())return ls([],[0].concat(this.elementShape));const t=[];for(let e=0;e<this.size();e++)t.push(e);const n=this.readMany(t);return Zh(this.elementShape,n[0].shape,`TensorArray shape mismatch: tensor array shape (${this.elementShape}) vs first tensor shape (${n[0].shape})`),Vo(n,0)}scatter(e,t){if(t.dtype!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${t.dtype}`);if(e.length!==t.shape[0])throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${e.length} vs. ${t.shape[0]}`);const n=Math.max(...e);if(!this.dynamicSize&&n>=this.maxSize)throw new Error(`Max index must be < array size (${n}  vs. ${this.maxSize})`);this.writeMany(e,cc(t,0))}split(e,t){if(t.dtype!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${t.dtype}`);let n=0;const r=e.map((e=>(n+=e,n)));if(n!==t.shape[0])throw new Error(`Expected sum of lengths to be equal to\n          tensor.shape[0], but sum of lengths is\n        ${n}, and tensor's shape is: ${t.shape}`);if(!this.dynamicSize&&e.length!==this.maxSize)throw new Error(`TensorArray's size is not equal to the size of lengths (${this.maxSize} vs. ${e.length}), and the TensorArray is not marked as dynamically resizeable`);const s=0===n?0:t.size/n,a=[];xa((()=>{t=Bo(t,[1,n,s]);for(let n=0;n<e.length;++n){const o=[0,0===n?0:r[n-1],0],i=[1,e[n],s];a[n]=Bo(Wo(t,o,i),this.elementShape)}return a}));const o=[];for(let t=0;t<e.length;t++)o[t]=t;this.writeMany(o,a)}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class ed{constructor(e,t,n,r=-1){this.tensors=e,this.elementShape=t,this.elementDtype=n,null!=e&&e.forEach((e=>{if(n!==e.dtype)throw new Error(`Invalid data types; op elements ${n}, but list elements ${e.dtype}`);Zh(t,e.shape,"TensorList shape mismatch: "),va(e)})),this.idTensor=zi(0),this.maxNumElements=r,va(this.idTensor)}get id(){return this.idTensor.id}copy(){return new ed([...this.tensors],this.elementShape,this.elementDtype)}clearAndClose(e){this.tensors.forEach((t=>{null!=e&&e.has(t.id)||t.dispose()})),this.tensors.length=0,this.idTensor.dispose()}size(){return this.tensors.length}stack(e,t,n=-1){if(t!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);if(-1!==n&&this.tensors.length!==n)throw new Error(`Operation expected a list with ${n} elements but got a list with ${this.tensors.length} elements.`);Zh(e,this.elementShape,"TensorList shape mismatch: ");const r=Qh(this.elementShape,this.tensors,e);return xa((()=>{const e=this.tensors.map((e=>Bo(e,r)));return Ql(e,0)}))}popBack(e,t){if(t!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);if(0===this.size())throw new Error("Trying to pop from an empty list.");const n=Qh(this.elementShape,this.tensors,e),r=this.tensors.pop();return r.kept=!1,Zh(r.shape,e,"TensorList shape mismatch: "),Bo(r,n)}pushBack(e){if(e.dtype!==this.elementDtype)throw new Error(`Invalid data types; op elements ${e.dtype}, but list elements ${this.elementDtype}`);if(Zh(e.shape,this.elementShape,"TensorList shape mismatch: "),this.maxNumElements===this.size())throw new Error("Trying to push element into a full list.");va(e),this.tensors.push(e)}resize(e){if(e<0)throw new Error(`TensorListResize expects size to be non-negative. Got: ${e}`);if(-1!==this.maxNumElements&&e>this.maxNumElements)throw new Error(`TensorListResize input size ${e} is greater maxNumElement ${this.maxNumElements}.`);const t=new ed([],this.elementShape,this.elementDtype,this.maxNumElements);t.tensors.length=e;for(let n=0;n<Math.min(this.tensors.length,e);++n)t.tensors[n]=this.tensors[n];return t}getItem(e,t,n){if(n!==this.elementDtype)throw new Error(`Invalid data types; op elements ${n}, but list elements ${this.elementDtype}`);if(e<0||e>this.tensors.length)throw new Error(`Trying to access element ${e} in a list with ${this.tensors.length} elements.`);if(null==this.tensors[e])throw new Error(`element at index ${e} is null.`);Zh(this.tensors[e].shape,t,"TensorList shape mismatch: ");const r=Qh(this.elementShape,this.tensors,t);return Bo(this.tensors[e],r)}setItem(e,t){if(t.dtype!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t.dtype}, but list elements ${this.elementDtype}`);if(e<0||-1!==this.maxNumElements&&e>=this.maxNumElements)throw new Error(`Trying to set element ${e} in a list with max ${this.maxNumElements} elements.`);Zh(this.elementShape,t.shape,"TensorList shape mismatch: "),va(t),null!=this.tensors[e]&&(this.tensors[e].kept=!1),this.tensors[e]=t}gather(e,t,n){if(t!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);Zh(this.elementShape,n,"TensorList shape mismatch: "),e=e.slice(0,this.size());const r=Qh(this.elementShape,this.tensors,n);return 0===e.length?ls([],[0].concat(r)):xa((()=>{const t=e.map((e=>Bo(this.tensors[e],r)));return Ql(t,0)}))}concat(e,t){if(e&&e!==this.elementDtype)throw new Error(`TensorList dtype is ${this.elementDtype} but concat requested dtype ${e}`);Zh(this.elementShape,t,"TensorList shape mismatch: ");const n=Qh(this.elementShape,this.tensors,t);return 0===this.size()?ls([],[0].concat(n)):xa((()=>{const e=this.tensors.map((e=>Bo(e,n)));return Vo(e,0)}))}}
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
const td=async(e,t,n)=>{switch(e.op){case"If":case"StatelessIf":{const r=oh("thenBranch",e,t,n),s=oh("elseBranch",e,t,n),a=oh("cond",e,t,n),o=oh("args",e,t,n);return(await a.data())[0]?n.functionMap[r].executeFunctionAsync(o,n.tensorArrayMap,n.tensorListMap):n.functionMap[s].executeFunctionAsync(o,n.tensorArrayMap,n.tensorListMap)}case"While":case"StatelessWhile":{const r=oh("body",e,t,n),s=oh("cond",e,t,n),a=oh("args",e,t,n),o=await n.functionMap[s].executeFunctionAsync(a,n.tensorArrayMap,n.tensorListMap),i=a.map((e=>e.id));let u=await o[0].data();o.forEach((e=>{e.kept||-1!==i.indexOf(e.id)||e.dispose()}));let l=a;for(;u[0];){const e=l;l=await n.functionMap[r].executeFunctionAsync(l,n.tensorArrayMap,n.tensorListMap);const t=l.map((e=>e.id));e.forEach((e=>{e.kept||-1!==i.indexOf(e.id)||-1!==t.indexOf(e.id)||e.dispose()}));const a=await n.functionMap[s].executeFunctionAsync(l,n.tensorArrayMap,n.tensorListMap);u=await a[0].data(),a.forEach((e=>{e.kept||-1!==i.indexOf(e.id)||-1!==t.indexOf(e.id)||e.dispose()}))}return l}case"LoopCond":return[hh(oh("pred",e,t,n))];case"Switch":{const r=oh("pred",e,t,n);let s=oh("data",e,t,n);return s.kept||(s=hh(s)),(await r.data())[0]?[void 0,s]:[s,void 0]}case"Merge":{const r=e.inputNames.find((e=>void 0!==ih(e,t,n)));if(r){return[hh(ih(r,t,n))]}return}case"Enter":{const r=oh("frameName",e,t,n),s=oh("tensor",e,t,n);return n.enterFrame(r),[hh(s)]}case"Exit":{const r=oh("tensor",e,t,n);return n.exitFrame(),[hh(r)]}case"NextIteration":{const r=oh("tensor",e,t,n);return n.nextIteration(),[hh(r)]}case"TensorArrayV3":{const r=oh("size",e,t,n),s=oh("dtype",e,t,n),a=oh("elementShape",e,t,n),o=oh("dynamicSize",e,t,n),i=oh("clearAfterRead",e,t,n),u=oh("identicalElementShapes",e,t,n),l=oh("name",e,t,n),c=new Xh(l,s,r,a,u,o,i);return n.addTensorArray(c),[c.idTensor,zi(1)]}case"TensorArrayWriteV3":{const r=oh("tensorArrayId",e,t,n),s=oh("index",e,t,n),a=oh("tensor",e,t,n),o=n.getTensorArray(r.id);return o.write(s,a),[o.idTensor]}case"TensorArrayReadV3":{const r=oh("tensorArrayId",e,t,n),s=oh("index",e,t,n);return[n.getTensorArray(r.id).read(s)]}case"TensorArrayGatherV3":{const r=oh("tensorArrayId",e,t,n),s=oh("indices",e,t,n),a=oh("dtype",e,t,n);return[n.getTensorArray(r.id).gather(s,a)]}case"TensorArrayScatterV3":{const r=oh("tensorArrayId",e,t,n),s=oh("indices",e,t,n),a=oh("tensor",e,t,n),o=n.getTensorArray(r.id);return o.scatter(s,a),[o.idTensor]}case"TensorArrayConcatV3":{const r=oh("tensorArrayId",e,t,n),s=n.getTensorArray(r.id),a=oh("dtype",e,t,n);return[s.concat(a)]}case"TensorArraySplitV3":{const r=oh("tensorArrayId",e,t,n),s=oh("tensor",e,t,n),a=oh("lengths",e,t,n),o=n.getTensorArray(r.id);return o.split(a,s),[o.idTensor]}case"TensorArraySizeV3":{const r=oh("tensorArrayId",e,t,n);return[zi(n.getTensorArray(r.id).size(),"int32")]}case"TensorArrayCloseV3":{const r=oh("tensorArrayId",e,t,n),s=n.getTensorArray(r.id);return s.clearAndClose(),[s.idTensor]}case"TensorListSetItem":{const r=oh("tensorListId",e,t,n),s=oh("index",e,t,n),a=oh("tensor",e,t,n),o=n.getTensorList(r.id);return o.setItem(s,a),[o.idTensor]}case"TensorListGetItem":{const r=oh("tensorListId",e,t,n),s=oh("index",e,t,n),a=oh("elementShape",e,t,n),o=oh("elementDType",e,t,n);return[n.getTensorList(r.id).getItem(s,a,o)]}case"TensorListScatterV2":case"TensorListScatter":{const r=oh("indices",e,t,n),s=function(e,t,n,r){if(t.length!==e.shape[0])throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${t.length} vs. ${e.shape[0]}`);const s=Math.max(...t);if(null!=r&&-1!==r&&s>=r)throw new Error(`Max index must be < array size (${s}  vs. ${r})`);const a=new ed([],n,e.dtype,r),o=cc(e,0);return t.forEach(((e,t)=>{a.setItem(e,o[t])})),a}(oh("tensor",e,t,n),r,oh("elementShape",e,t,n),oh("numElements",e,t,n));return n.addTensorList(s),[s.idTensor]}case"TensorListReserve":case"EmptyTensorList":{const r=oh("elementShape",e,t,n),s=oh("elementDType",e,t,n);let a;a="TensorListReserve"===e.op?"numElements":"maxNumElements";const o=oh(a,e,t,n),i=function(e,t,n,r){return new ed([],e,t,r)}(r,s,0,"TensorListReserve"===e.op?-1:o);return n.addTensorList(i),[i.idTensor]}case"TensorListGather":{const r=oh("tensorListId",e,t,n),s=oh("indices",e,t,n),a=oh("elementShape",e,t,n),o=oh("elementDType",e,t,n);return[n.getTensorList(r.id).gather(s,o,a)]}case"TensorListStack":{const r=oh("tensorListId",e,t,n),s=oh("elementShape",e,t,n),a=oh("elementDType",e,t,n),o=oh("numElements",e,t,n);return[n.getTensorList(r.id).stack(s,a,o)]}case"TensorListFromTensor":{const r=function(e,t,n){const r=e.dtype;if(e.shape.length<1)throw new Error(`Tensor must be at least a vector, but saw shape: ${e.shape}`);if(e.dtype!==n)throw new Error(`Invalid data types; op elements ${e.dtype}, but list elements ${n}`);Zh(e.shape.slice(1),t,"TensorList shape mismatch: ");const s=cc(e);return new ed(s,t,r)}(oh("tensor",e,t,n),oh("elementShape",e,t,n),oh("elementDType",e,t,n));return n.addTensorList(r),[r.idTensor]}case"TensorListConcat":case"TensorListConcatV2":{const r=oh("tensorListId",e,t,n),s=n.getTensorList(r.id),a=oh("dtype",e,t,n),o=oh("elementShape",e,t,n);return[s.concat(a,o)]}case"TensorListPushBack":{const r=oh("tensorListId",e,t,n),s=oh("tensor",e,t,n),a=n.getTensorList(r.id);return a.pushBack(s),[a.idTensor]}case"TensorListPopBack":{const r=oh("tensorListId",e,t,n),s=oh("elementShape",e,t,n),a=oh("elementDType",e,t,n);return[n.getTensorList(r.id).popBack(s,a)]}case"TensorListSplit":{const r=oh("tensor",e,t,n),s=oh("elementShape",e,t,n),a=function(e,t,n){let r=0;const s=t.map((e=>(r+=e,r)));if(r!==e.shape[0])throw new Error(`Expected sum of lengths to be equal to\n          tensor.shape[0], but sum of lengths is\n        ${r}, and tensor's shape is: ${e.shape}`);const a=Jh(e.shape.slice(1),n),o=0===r?0:e.size/r,i=xa((()=>{const n=[];e=Bo(e,[1,r,o]);for(let r=0;r<t.length;++r){const i=[0,0===r?0:s[r-1],0],u=[1,t[r],o];n[r]=Bo(Wo(e,i,u),a)}return e.dispose(),n})),u=new ed([],n,e.dtype,t.length);for(let e=0;e<i.length;e++)u.setItem(e,i[e]);return u}(r,oh("lengths",e,t,n),s);return n.addTensorList(a),[a.idTensor]}case"TensorListLength":{const r=oh("tensorListId",e,t,n);return[zi(n.getTensorList(r.id).size(),"int32")]}case"TensorListResize":{const r=oh("tensorListId",e,t,n),s=oh("size",e,t,n),a=n.getTensorList(r.id).resize(s);return n.addTensorList(a),[a.idTensor]}default:throw TypeError(`Node type ${e.op} is not implemented`)}};
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
 */function nd(e,t,n){const[r,s]=oh("fusedOps",e,t,n),a="biasadd"===r,o=!a,i="prelu"===s,u="fusedbatchnorm"===r,l=oh("numArgs",e,t,n);if(a){if(i&&2!==l)throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd and Prelu must have two extra arguments: bias and alpha.");if(!i&&a&&1!==l)throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd must have one extra argument: bias.")}if(u)throw new Error("FusedConv2d and DepthwiseConv2d with FusedBatchNorm is not supported");const c=oh("strides",e,t,n),p=ph(e,t,n),h=oh("dataFormat",e,t,n).toUpperCase(),d=oh("dilations",e,t,n);let[m,f]=oh("args",e,t,n);o&&(f=m,m=void 0);return{stride:c,pad:p,dataFormat:h,dilations:d,biasArg:m,preluArg:f,activationFunc:s,leakyreluAlpha:oh("leakyreluAlpha",e,t,n)}}
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
function rd(e,t,n){return{boxes:oh("boxes",e,t,n),scores:oh("scores",e,t,n),maxOutputSize:oh("maxOutputSize",e,t,n),iouThreshold:oh("iouThreshold",e,t,n),scoreThreshold:oh("scoreThreshold",e,t,n),softNmsSigma:oh("softNmsSigma",e,t,n)}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
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
class sd{constructor(e,t){this.keyDType=e,this.valueDType=t,this.handle=zi(0),this.tensorMap=new Map,va(this.handle)}get id(){return this.handle.id}clearAndClose(){this.tensorMap.forEach((e=>e.dispose())),this.tensorMap.clear(),this.handle.dispose()}size(){return this.tensorMap.size}tensorSize(){return zi(this.size(),"int32")}async import(e,t){this.checkKeyAndValueTensor(e,t);const n=await e.data();return this.tensorMap.forEach((e=>e.dispose())),this.tensorMap.clear(),xa((()=>{const e=cc(t),r=n.length,s=e.length;u(r===s,(()=>`The number of elements doesn't match, keys has ${r} elements, the values has ${s} elements.`));for(let t=0;t<r;t++){const r=n[t],s=e[t];va(s),this.tensorMap.set(r,s)}return this.handle}))}async find(e,t){this.checkKeyAndValueTensor(e,t);const n=await e.data();return xa((()=>{const e=[];for(let r=0;r<n.length;r++){const s=n[r],a=this.findWithDefault(s,t);e.push(a)}return Ql(e)}))}findWithDefault(e,t){const n=this.tensorMap.get(e);return null!=n?n:t}checkKeyAndValueTensor(e,t){if(e.dtype!==this.keyDType)throw new Error(`Expect key dtype ${this.keyDType}, but got ${e.dtype}`);if(t.dtype!==this.valueDType)throw new Error(`Expect value dtype ${this.valueDType}, but got ${t.dtype}`)}}
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
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
function ad(e,t,n,r,s=xa){const a=((e,t,n)=>{switch(e.category){case"arithmetic":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"BiasAdd":case"AddV2":case"Add":return[r.add(oh("a",e,t,n),oh("b",e,t,n))];case"AddN":return[r.addN(oh("tensors",e,t,n))];case"FloorMod":case"Mod":return[r.mod(oh("a",e,t,n),oh("b",e,t,n))];case"Mul":return[r.mul(oh("a",e,t,n),oh("b",e,t,n))];case"RealDiv":case"Div":return[r.div(oh("a",e,t,n),oh("b",e,t,n))];case"DivNoNan":return[r.divNoNan(oh("a",e,t,n),oh("b",e,t,n))];case"FloorDiv":return[r.floorDiv(oh("a",e,t,n),oh("b",e,t,n))];case"Sub":return[r.sub(oh("a",e,t,n),oh("b",e,t,n))];case"Minimum":return[r.minimum(oh("a",e,t,n),oh("b",e,t,n))];case"Maximum":return[r.maximum(oh("a",e,t,n),oh("b",e,t,n))];case"Pow":return[r.pow(oh("a",e,t,n),oh("b",e,t,n))];case"SquaredDifference":return[r.squaredDifference(oh("a",e,t,n),oh("b",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"basic_math":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"Abs":case"ComplexAbs":return[r.abs(oh("x",e,t,n))];case"Acos":return[r.acos(oh("x",e,t,n))];case"Acosh":return[r.acosh(oh("x",e,t,n))];case"Asin":return[r.asin(oh("x",e,t,n))];case"Asinh":return[r.asinh(oh("x",e,t,n))];case"Atan":return[r.atan(oh("x",e,t,n))];case"Atan2":return[r.atan2(oh("x",e,t,n),oh("y",e,t,n))];case"Atanh":return[r.atanh(oh("x",e,t,n))];case"Ceil":return[r.ceil(oh("x",e,t,n))];case"Complex":return[r.complex(oh("real",e,t,n),oh("imag",e,t,n))];case"Cos":return[r.cos(oh("x",e,t,n))];case"Cosh":return[r.cosh(oh("x",e,t,n))];case"Elu":return[r.elu(oh("x",e,t,n))];case"Erf":return[r.erf(oh("x",e,t,n))];case"Exp":return[r.exp(oh("x",e,t,n))];case"Expm1":return[r.expm1(oh("x",e,t,n))];case"Floor":return[r.floor(oh("x",e,t,n))];case"Log":return[r.log(oh("x",e,t,n))];case"Log1p":return[r.log1p(oh("x",e,t,n))];case"Imag":return[r.imag(oh("x",e,t,n))];case"Neg":return[r.neg(oh("x",e,t,n))];case"Reciprocal":return[r.reciprocal(oh("x",e,t,n))];case"Real":return[r.real(oh("x",e,t,n))];case"Relu":return[r.relu(oh("x",e,t,n))];case"Round":return[r.round(oh("x",e,t,n))];case"Selu":return[r.selu(oh("x",e,t,n))];case"Sigmoid":return[r.sigmoid(oh("x",e,t,n))];case"Sin":return[r.sin(oh("x",e,t,n))];case"Sign":return[r.sign(oh("x",e,t,n))];case"Sinh":return[r.sinh(oh("x",e,t,n))];case"Softplus":return[r.softplus(oh("x",e,t,n))];case"Sqrt":return[r.sqrt(oh("x",e,t,n))];case"Square":return[r.square(oh("x",e,t,n))];case"Tanh":return[r.tanh(oh("x",e,t,n))];case"Tan":return[r.tan(oh("x",e,t,n))];case"ClipByValue":return[r.clipByValue(oh("x",e,t,n),oh("clipValueMin",e,t,n),oh("clipValueMax",e,t,n))];case"Relu6":return[r.relu6(oh("x",e,t,n))];case"Rsqrt":return[r.rsqrt(ih(e.inputNames[0],t,n))];case"Prod":return[r.prod(oh("x",e,t,n),oh("axes",e,t,n))];case"LeakyRelu":return[r.leakyRelu(oh("x",e,t,n),oh("alpha",e,t,n))];case"Prelu":return[r.prelu(oh("x",e,t,n),oh("alpha",e,t,n))];case"IsNan":return[r.isNaN(ih(e.inputNames[0],t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"control":return td(e,t,n);case"convolution":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"Conv1D":{const s=oh("stride",e,t,n),a=oh("pad",e,t,n),o=oh("dataFormat",e,t,n).toUpperCase(),i=oh("dilation",e,t,n);return[r.conv1d(oh("x",e,t,n),oh("filter",e,t,n),s,a,o,i)]}case"Conv2D":{const s=oh("strides",e,t,n),a=ph(e,t,n),o=oh("dataFormat",e,t,n).toUpperCase(),i=oh("dilations",e,t,n);return[r.conv2d(oh("x",e,t,n),oh("filter",e,t,n),[s[1],s[2]],a,o,[i[1],i[2]])]}case"_FusedConv2D":{const{stride:s,pad:a,dataFormat:o,dilations:i,biasArg:u,preluArg:l,activationFunc:c,leakyreluAlpha:p}=nd(e,t,n);return[r.fused.conv2d({x:oh("x",e,t,n),filter:oh("filter",e,t,n),strides:[s[1],s[2]],pad:a,dataFormat:o,dilations:[i[1],i[2]],bias:u,activation:c,preluActivationWeights:l,leakyreluAlpha:p})]}case"FusedDepthwiseConv2dNative":{const{stride:s,pad:a,dataFormat:o,dilations:i,biasArg:u,preluArg:l,activationFunc:c,leakyreluAlpha:p}=nd(e,t,n);return[r.fused.depthwiseConv2d({x:oh("x",e,t,n),filter:oh("filter",e,t,n),strides:[s[1],s[2]],pad:a,dataFormat:o,dilations:[i[1],i[2]],bias:u,activation:c,preluActivationWeights:l,leakyreluAlpha:p})]}case"Conv2DBackpropInput":case"Conv2dTranspose":{const s=oh("outputShape",e,t,n),a=oh("strides",e,t,n),o=ph(e,t,n);return[r.conv2dTranspose(oh("x",e,t,n),oh("filter",e,t,n),s,[a[1],a[2]],o)]}case"DepthwiseConv2dNative":case"DepthwiseConv2d":{const s=oh("strides",e,t,n),a=ph(e,t,n),o=oh("dilations",e,t,n),i=oh("dataFormat",e,t,n).toUpperCase();return[r.depthwiseConv2d(oh("input",e,t,n),oh("filter",e,t,n),[s[1],s[2]],a,i,[o[1],o[2]])]}case"Conv3D":{const s=oh("strides",e,t,n),a=oh("pad",e,t,n),o=oh("dataFormat",e,t,n).toUpperCase(),i=oh("dilations",e,t,n);return[r.conv3d(oh("x",e,t,n),oh("filter",e,t,n),[s[1],s[2],s[3]],a,o,[i[1],i[2],i[3]])]}case"AvgPool":{const s=oh("strides",e,t,n),a=oh("pad",e,t,n),o=oh("kernelSize",e,t,n);return[r.avgPool(oh("x",e,t,n),[o[1],o[2]],[s[1],s[2]],a)]}case"MaxPool":{const s=oh("strides",e,t,n),a=oh("pad",e,t,n),o=oh("kernelSize",e,t,n);return[r.maxPool(oh("x",e,t,n),[o[1],o[2]],[s[1],s[2]],a)]}case"MaxPoolWithArgmax":{const s=oh("strides",e,t,n),a=oh("pad",e,t,n),o=oh("kernelSize",e,t,n),i=oh("includeBatchInIndex",e,t,n),{result:u,indexes:l}=r.maxPoolWithArgmax(oh("x",e,t,n),[o[1],o[2]],[s[1],s[2]],a,i);return[u,l]}case"AvgPool3D":{const s=oh("strides",e,t,n),a=oh("pad",e,t,n),o=oh("kernelSize",e,t,n);return[r.avgPool3d(oh("x",e,t,n),[o[1],o[2],o[3]],[s[1],s[2],s[3]],a)]}case"MaxPool3D":{const s=oh("strides",e,t,n),a=oh("pad",e,t,n),o=oh("kernelSize",e,t,n);return[r.maxPool3d(oh("x",e,t,n),[o[1],o[2],o[3]],[s[1],s[2],s[3]],a)]}case"Dilation2D":{const s=oh("strides",e,t,n),a=oh("pad",e,t,n),o=oh("dilations",e,t,n),i=s[1],u=s[2],l=o[1],c=o[2];return[r.dilation2d(oh("x",e,t,n),oh("filter",e,t,n),[i,u],a,[l,c],"NHWC")]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"creation":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"Fill":{const s=oh("shape",e,t,n),a=oh("dtype",e,t,n),o=oh("value",e,t,n);return[r.fill(s,o,a)]}case"LinSpace":{const s=oh("start",e,t,n),a=oh("stop",e,t,n),o=oh("num",e,t,n);return[r.linspace(s,a,o)]}case"Multinomial":{const s=oh("logits",e,t,n),a=oh("numSamples",e,t,n),o=oh("seed",e,t,n);return[r.multinomial(s,a,o)]}case"OneHot":{const s=oh("indices",e,t,n),a=oh("depth",e,t,n),o=oh("onValue",e,t,n),i=oh("offValue",e,t,n),u=oh("dtype",e,t,n);return[r.oneHot(s,a,o,i,u)]}case"Ones":return[r.ones(oh("shape",e,t,n),oh("dtype",e,t,n))];case"OnesLike":return[r.onesLike(oh("x",e,t,n))];case"RandomStandardNormal":return[r.randomStandardNormal(oh("shape",e,t,n),oh("dtype",e,t,n),oh("seed",e,t,n))];case"RandomUniform":return[r.randomUniform(oh("shape",e,t,n),oh("minval",e,t,n),oh("maxval",e,t,n),oh("dtype",e,t,n))];case"Range":{const s=oh("start",e,t,n),a=oh("stop",e,t,n),o=oh("step",e,t,n);return[r.range(s,a,o,oh("dtype",e,t,n))]}case"TruncatedNormal":{const s=oh("shape",e,t,n),a=oh("mean",e,t,n),o=oh("stdDev",e,t,n),i=oh("seed",e,t,n);return[r.truncatedNormal(s,a,o,oh("dtype",e,t,n),i)]}case"Zeros":return[r.zeros(oh("shape",e,t,n),oh("dtype",e,t,n))];case"ZerosLike":return[r.zerosLike(oh("x",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"dynamic":return(async(e,t,n,r,s=Kh)=>{switch(e.op){case"NonMaxSuppressionV5":{const{boxes:r,scores:a,maxOutputSize:o,iouThreshold:i,scoreThreshold:u,softNmsSigma:l}=rd(e,t,n),c=await s.image.nonMaxSuppressionWithScoreAsync(r,a,o,i,u,l);return[c.selectedIndices,c.selectedScores]}case"NonMaxSuppressionV4":{const{boxes:r,scores:a,maxOutputSize:o,iouThreshold:i,scoreThreshold:u}=rd(e,t,n),l=oh("padToMaxOutputSize",e,t,n),c=await s.image.nonMaxSuppressionPaddedAsync(r,a,o,i,u,l);return[c.selectedIndices,c.validOutputs]}case"NonMaxSuppressionV3":case"NonMaxSuppressionV2":{const{boxes:r,scores:a,maxOutputSize:o,iouThreshold:i,scoreThreshold:u}=rd(e,t,n);return[await s.image.nonMaxSuppressionAsync(r,a,o,i,u)]}case"Where":{const r=s.cast(oh("condition",e,t,n),"bool"),a=[await s.whereAsync(r)];return r.dispose(),a}case"ListDiff":return s.setdiff1dAsync(oh("x",e,t,n),oh("y",e,t,n));default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n);case"evaluation":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"LowerBound":{const s=oh("sortedSequence",e,t,n),a=oh("values",e,t,n);return[r.lowerBound(s,a)]}case"TopKV2":{const s=oh("x",e,t,n),a=oh("k",e,t,n),o=oh("sorted",e,t,n),i=r.topk(s,a,o);return[i.values,i.indices]}case"UpperBound":{const s=oh("sortedSequence",e,t,n),a=oh("values",e,t,n);return[r.upperBound(s,a)]}case"Unique":{const s=oh("x",e,t,n),a=r.unique(s);return[a.values,a.indices]}case"UniqueV2":{const s=oh("x",e,t,n),a=oh("axis",e,t,n),o=r.unique(s,a);return[o.values,o.indices]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"image":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"ResizeBilinear":{const s=oh("images",e,t,n),a=oh("size",e,t,n),o=oh("alignCorners",e,t,n),i=oh("halfPixelCenters",e,t,n);return[r.image.resizeBilinear(s,[a[0],a[1]],o,i)]}case"ResizeNearestNeighbor":{const s=oh("images",e,t,n),a=oh("size",e,t,n),o=oh("alignCorners",e,t,n),i=oh("halfPixelCenters",e,t,n);return[r.image.resizeNearestNeighbor(s,[a[0],a[1]],o,i)]}case"CropAndResize":{const s=oh("image",e,t,n),a=oh("boxes",e,t,n),o=oh("boxInd",e,t,n),i=oh("cropSize",e,t,n),u=oh("method",e,t,n),l=oh("extrapolationValue",e,t,n);return[r.image.cropAndResize(s,a,o,i,u,l)]}case"ImageProjectiveTransformV3":{const s=oh("images",e,t,n),a=oh("transforms",e,t,n),o=oh("outputShape",e,t,n),i=oh("fillValue",e,t,n),u=oh("interpolation",e,t,n),l=oh("fillMode",e,t,n);return[r.image.transform(s,a,u.toLowerCase(),l.toLowerCase(),i,o)]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"graph":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"Const":return t[e.name];case"PlaceholderWithDefault":const s=oh("default",e,t,n);return[ih(e.name,t,n)||s];case"Placeholder":return[ih(e.name,t,n)];case"Identity":case"StopGradient":case"FakeQuantWithMinMaxVars":case"Snapshot":return[hh(oh("x",e,t,n))];case"IdentityN":return oh("x",e,t,n).map((e=>hh(e)));case"Shape":return[r.tensor1d(oh("x",e,t,n).shape,"int32")];case"ShapeN":return oh("x",e,t,n).map((e=>r.tensor1d(e.shape)));case"Size":return[r.scalar(oh("x",e,t,n).size,"int32")];case"Rank":return[r.scalar(oh("x",e,t,n).rank,"int32")];case"NoOp":return[r.scalar(1)];case"Print":const a=oh("x",e,t,n),o=oh("data",e,t,n),i=oh("message",e,t,n),u=oh("summarize",e,t,n);console.warn("The graph has a tf.print() operation,usually used for debugging, which slows down performance."),console.log(i);for(let e=0;e<o.length;e++)console.log(Array.prototype.slice.call(o[e].dataSync()).slice(0,u));return[a];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"logical":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"Equal":return[r.equal(oh("a",e,t,n),oh("b",e,t,n))];case"NotEqual":return[r.notEqual(oh("a",e,t,n),oh("b",e,t,n))];case"Greater":return[r.greater(oh("a",e,t,n),oh("b",e,t,n))];case"GreaterEqual":return[r.greaterEqual(oh("a",e,t,n),oh("b",e,t,n))];case"Less":return[r.less(oh("a",e,t,n),oh("b",e,t,n))];case"LessEqual":return[r.lessEqual(oh("a",e,t,n),oh("b",e,t,n))];case"LogicalAnd":return[r.logicalAnd(oh("a",e,t,n),oh("b",e,t,n))];case"LogicalNot":return[r.logicalNot(oh("a",e,t,n))];case"LogicalOr":return[r.logicalOr(oh("a",e,t,n),oh("b",e,t,n))];case"Select":case"SelectV2":return[r.where(oh("condition",e,t,n),oh("a",e,t,n),oh("b",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"matrices":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"BatchMatMul":case"BatchMatMulV2":case"MatMul":return[r.matMul(oh("a",e,t,n),oh("b",e,t,n),oh("transposeA",e,t,n),oh("transposeB",e,t,n))];case"Einsum":return[r.einsum(oh("equation",e,t,n),...oh("tensors",e,t,n))];case"Transpose":return[r.transpose(oh("x",e,t,n),oh("perm",e,t,n))];case"_FusedMatMul":const[s,a]=oh("fusedOps",e,t,n),o="biasadd"===s,i="prelu"===a,u=oh("numArgs",e,t,n),l=oh("leakyreluAlpha",e,t,n);if(o){if(i&&2!==u)throw new Error("Fused MatMul with BiasAdd and Prelu must have two extra arguments: bias and alpha.");if(!i&&1!==u)throw new Error("Fused MatMul with BiasAdd must have one extra argument: bias.")}const[c,p]=oh("args",e,t,n);return[r.fused.matMul({a:oh("a",e,t,n),b:oh("b",e,t,n),transposeA:oh("transposeA",e,t,n),transposeB:oh("transposeB",e,t,n),bias:c,activation:a,preluActivationWeights:p,leakyreluAlpha:l})];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"normalization":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"EuclideanNorm":return[r.euclideanNorm(oh("x",e,t,n),oh("axis",e,t,n),oh("keepDims",e,t,n))];case"FusedBatchNorm":case"FusedBatchNormV2":case"FusedBatchNormV3":return[r.batchNorm(oh("x",e,t,n),oh("mean",e,t,n),oh("variance",e,t,n),oh("offset",e,t,n),oh("scale",e,t,n),oh("epsilon",e,t,n))];case"LRN":return[r.localResponseNormalization(oh("x",e,t,n),oh("radius",e,t,n),oh("bias",e,t,n),oh("alpha",e,t,n),oh("beta",e,t,n))];case"Softmax":return[r.softmax(oh("x",e,t,n))];case"LogSoftmax":return[r.logSoftmax(oh("x",e,t,n))];case"SparseToDense":return[r.sparseToDense(oh("sparseIndices",e,t,n),oh("outputShape",e,t,n),oh("sparseValues",e,t,n),oh("defaultValue",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"reduction":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"Max":{const s=oh("axis",e,t,n),a=oh("keepDims",e,t,n);return[r.max(oh("x",e,t,n),s,a)]}case"Mean":{const s=oh("axis",e,t,n),a=oh("keepDims",e,t,n);return[r.mean(oh("x",e,t,n),s,a)]}case"Min":{const s=oh("axis",e,t,n),a=oh("keepDims",e,t,n);return[r.min(oh("x",e,t,n),s,a)]}case"Sum":{const s=oh("axis",e,t,n),a=oh("keepDims",e,t,n);return[r.sum(oh("x",e,t,n),s,a)]}case"All":{const s=oh("axis",e,t,n),a=oh("keepDims",e,t,n);return[r.all(oh("x",e,t,n),s,a)]}case"Any":{const s=oh("axis",e,t,n),a=oh("keepDims",e,t,n);return[r.any(oh("x",e,t,n),s,a)]}case"ArgMax":{const s=oh("axis",e,t,n);return[r.argMax(oh("x",e,t,n),s)]}case"ArgMin":{const s=oh("axis",e,t,n);return[r.argMin(oh("x",e,t,n),s)]}case"Prod":{const s=oh("axis",e,t,n),a=oh("keepDims",e,t,n);return[r.prod(oh("x",e,t,n),s,a)]}case"Cumprod":{const s=oh("axis",e,t,n),a=oh("exclusive",e,t,n),o=oh("reverse",e,t,n);return[r.cumprod(oh("x",e,t,n),s,a,o)]}case"Cumsum":{const s=oh("axis",e,t,n),a=oh("exclusive",e,t,n),o=oh("reverse",e,t,n);return[r.cumsum(oh("x",e,t,n),s,a,o)]}case"Bincount":const s=oh("x",e,t,n),a=oh("weights",e,t,n),o=oh("size",e,t,n);return[r.bincount(s,a,o)];case"DenseBincount":{const s=oh("x",e,t,n),a=oh("weights",e,t,n),o=oh("size",e,t,n),i=oh("binaryOutput",e,t,n);return[r.denseBincount(s,a,o,i)]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"slice_join":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"ConcatV2":case"Concat":{const s=oh("n",e,t,n),a=oh("axis",e,t,n);let o=oh("tensors",e,t,n);return o=o.slice(0,s),[r.concat(o,a)]}case"Gather":{const s=oh("x",e,t,n),a=oh("indices",e,t,n);return[r.gather(s,r.cast(a,"int32"),0)]}case"GatherV2":{const s=oh("axis",e,t,n),a=oh("batchDims",e,t,n),o=oh("x",e,t,n),i=oh("indices",e,t,n);return[r.gather(o,r.cast(i,"int32"),s,a)]}case"Reverse":{const s=oh("dims",e,t,n),a=[];for(let e=0;e<s.length;e++)s[e]&&a.push(e);const o=oh("x",e,t,n);return[r.reverse(o,a)]}case"ReverseV2":{const s=oh("axis",e,t,n),a=oh("x",e,t,n);return[r.reverse(a,s)]}case"Slice":{const s=oh("begin",e,t,n),a=oh("size",e,t,n);return[r.slice(oh("x",e,t,n),s,a)]}case"StridedSlice":{const s=oh("begin",e,t,n),a=oh("end",e,t,n),o=oh("strides",e,t,n),i=oh("beginMask",e,t,n),u=oh("endMask",e,t,n),l=oh("ellipsisMask",e,t,n),c=oh("newAxisMask",e,t,n),p=oh("shrinkAxisMask",e,t,n),h=oh("x",e,t,n);return[r.stridedSlice(h,s,a,o,i,u,l,c,p)]}case"Pack":return xa((()=>{const s=oh("axis",e,t,n),a=oh("tensors",e,t,n),o=a[0].shape,i=r.squeeze(a[0]).shape,u=a.map((e=>{const t=d(e.shape,o);if(!t&&!d(r.squeeze(e).shape,i))throw new Error("the input tensors shape does not match");return t?e:r.reshape(e,o)}));return[r.stack(u,s)]}));case"Unpack":{const s=oh("axis",e,t,n),a=oh("tensor",e,t,n);return r.unstack(a,s)}case"Tile":{const s=oh("reps",e,t,n);return[r.tile(oh("x",e,t,n),s)]}case"Split":case"SplitV":{const s=oh("axis",e,t,n),a=oh("numOrSizeSplits",e,t,n),o=oh("x",e,t,n);return r.split(o,a,s)}case"ScatterNd":{const s=oh("indices",e,t,n),a=oh("values",e,t,n),o=oh("shape",e,t,n);return[r.scatterND(s,a,o)]}case"GatherNd":{const s=oh("x",e,t,n),a=oh("indices",e,t,n);return[r.gatherND(s,a)]}case"SparseToDense":{const s=oh("sparseIndices",e,t,n),a=oh("outputShape",e,t,n),o=oh("sparseValues",e,t,n),i=oh("defaultValue",e,t,n);return[r.sparseToDense(s,o,a,o.dtype===i.dtype?i:r.cast(i,o.dtype))]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"sparse":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"SparseFillEmptyRows":{const{outputIndices:s,outputValues:a,emptyRowIndicator:o,reverseIndexMap:i}=r.sparse.sparseFillEmptyRows(oh("indices",e,t,n),oh("values",e,t,n),oh("denseShape",e,t,n),oh("defaultValue",e,t,n));return[s,a,o,i]}case"SparseReshape":{const{outputIndices:s,outputShape:a}=r.sparse.sparseReshape(oh("inputIndices",e,t,n),oh("inputShape",e,t,n),oh("newShape",e,t,n));return[s,a]}case"SparseSegmentMean":return[r.sparse.sparseSegmentMean(oh("data",e,t,n),oh("indices",e,t,n),oh("segmentIds",e,t,n))];case"SparseSegmentSum":return[r.sparse.sparseSegmentSum(oh("data",e,t,n),oh("indices",e,t,n),oh("segmentIds",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"spectral":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"FFT":return[r.fft(oh("x",e,t,n))];case"IFFT":return[r.ifft(oh("x",e,t,n))];case"RFFT":return[r.rfft(oh("x",e,t,n))];case"IRFFT":return[r.irfft(oh("x",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"string":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"StringNGrams":{const{nGrams:s,nGramsSplits:a}=r.string.stringNGrams(oh("data",e,t,n),oh("dataSplits",e,t,n),oh("separator",e,t,n),oh("nGramWidths",e,t,n),oh("leftPad",e,t,n),oh("rightPad",e,t,n),oh("padWidth",e,t,n),oh("preserveShortSequences",e,t,n));return[s,a]}case"StringSplit":{const{indices:s,values:a,shape:o}=r.string.stringSplit(oh("input",e,t,n),oh("delimiter",e,t,n),oh("skipEmpty",e,t,n));return[s,a,o]}case"StringToHashBucketFast":return[r.string.stringToHashBucketFast(oh("input",e,t,n),oh("numBuckets",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"transformation":return s((()=>((e,t,n,r=Kh)=>{switch(e.op){case"Cast":return[r.cast(oh("x",e,t,n),oh("dtype",e,t,n))];case"ExpandDims":{const s=oh("axis",e,t,n);return[r.expandDims(oh("x",e,t,n),s)]}case"Squeeze":{const s=oh("axis",e,t,n);return[r.squeeze(oh("x",e,t,n),s)]}case"Reshape":return[r.reshape(oh("x",e,t,n),oh("shape",e,t,n))];case"MirrorPad":return[r.mirrorPad(oh("x",e,t,n),oh("padding",e,t,n),oh("mode",e,t,n))];case"PadV2":case"Pad":return[r.pad(oh("x",e,t,n),oh("padding",e,t,n),oh("constantValue",e,t,n))];case"SpaceToBatchND":{const s=oh("blockShape",e,t,n),a=oh("paddings",e,t,n);return[r.spaceToBatchND(oh("x",e,t,n),s,a)]}case"BatchToSpaceND":{const s=oh("blockShape",e,t,n),a=oh("crops",e,t,n);return[r.batchToSpaceND(oh("x",e,t,n),s,a)]}case"DepthToSpace":{const s=oh("blockSize",e,t,n),a=oh("dataFormat",e,t,n).toUpperCase();return[r.depthToSpace(oh("x",e,t,n),s,a)]}case"BroadcastTo":return[r.broadcastTo(oh("x",e,t,n),oh("shape",e,t,n))];case"BroadcastArgs":return[r.broadcastArgs(oh("s0",e,t,n),oh("s1",e,t,n))];default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n)));case"hash_table":return(async(e,t,n,r)=>{switch(e.op){case"HashTable":case"HashTableV2":{const s=oh("keyDType",e,t,n),a=oh("valueDType",e,t,n),o=new sd(s,a);return r.addHashTable(e.name,o),[o.handle]}case"LookupTableImport":case"LookupTableImportV2":{const s=oh("tableHandle",e,t,n,r),a=oh("keys",e,t,n),o=oh("values",e,t,n),i=r.getHashTableById(s.id);return[await i.import(a,o)]}case"LookupTableFind":case"LookupTableFindV2":{const s=oh("tableHandle",e,t,n,r),a=oh("keys",e,t,n),o=oh("defaultValue",e,t,n),i=r.getHashTableById(s.id);return[await i.find(a,o)]}case"LookupTableSize":case"LookupTableSizeV2":{const s=oh("tableHandle",e,t,n,r);return[r.getHashTableById(s.id).tensorSize()]}default:throw TypeError(`Node type ${e.op} is not implemented`)}})(e,t,n,r);case"custom":const a=ah(e.op);if(a&&a.customExecutor)return a.customExecutor(new Hh(e,t,n));throw TypeError(`Custom op ${e.op} is not registered.`);default:throw TypeError(`Unknown op '${e.op}'. File an issue at https://github.com/tensorflow/tfjs/issues so we can add it, or register a custom execution with tf.registerOp()`)}})(e,t,n);return F(a)?a.then((e=>[].concat(e))):[].concat(a)}class od{constructor(e={},t={},n={},r={}){this.weightMap=e,this.tensorArrayMap=t,this.tensorListMap=n,this.functionMap=r,this.rootContext={id:0,frameName:"",iterationId:0},this.contexts=[this.rootContext],this.lastId=0,this.generateCurrentContextIds()}newFrame(e,t){return{id:e,frameName:t,iterationId:0}}set currentContext(e){this.contexts!==e&&(this.contexts=e,this.generateCurrentContextIds())}get currentContext(){return this.contexts}get currentContextId(){return this._currentContextIds[0]}get currentContextIds(){return this._currentContextIds}generateCurrentContextIds(){const e=[];for(let t=0;t<this.contexts.length-1;t++){const n=this.contexts.slice(0,this.contexts.length-t);e.push(this.contextIdforContexts(n))}e.push(""),this._currentContextIds=e}contextIdforContexts(e){return e?e.map((e=>0===e.id&&0===e.iterationId?"":`${e.frameName}-${e.iterationId}`)).join("/"):""}enterFrame(e){this.contexts&&(this.lastId++,this.contexts=this.contexts.slice(),this.contexts.push(this.newFrame(this.lastId,e)),this._currentContextIds.unshift(this.contextIdforContexts(this.contexts)))}exitFrame(){if(!(this.contexts&&this.contexts.length>1))throw new Error("Cannot exit frame, the context is empty");this.contexts=this.contexts.slice(),this.contexts.splice(-1),this.currentContextIds.shift()}nextIteration(){if(!(this.contexts&&this.contexts.length>0))throw new Error("Cannot increase frame iteration, the context is empty");{this.contexts=this.contexts.slice(),this.lastId++;const e=Object.assign({},this.contexts[this.contexts.length-1]);e.iterationId+=1,e.id=this.lastId,this.contexts.splice(-1,1,e),this._currentContextIds.splice(0,1,this.contextIdforContexts(this.contexts))}}getWeight(e){return this.weightMap[e]}addTensorArray(e){this.tensorArrayMap[e.id]=e}getTensorArray(e){return this.tensorArrayMap[e]}addTensorList(e){this.tensorListMap[e.id]=e}getTensorList(e){return this.tensorListMap[e]}dispose(e){for(const t in this.tensorArrayMap)this.tensorArrayMap[t].clearAndClose(e);for(const t in this.tensorListMap)this.tensorListMap[t].clearAndClose(e)}}
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
 */function id(e,t,n,r){const s=new Set,a=[];let o=null,i=null;const u=new Set,l=Object.keys(e).map((e=>ch(e)[0]));let c=[];null!=r&&(c=r.map((e=>ch(e.name)[0])));const p=[...t];for(;p.length>0;){const e=p.pop();(pd(e)||hd(e)||dd(e))&&null==o&&(o=e,i=o.children.map((e=>e.name)).filter((e=>s.has(e)))),s.add(e.name),null==n[e.name]&&(-1===l.indexOf(e.name)&&-1===c.indexOf(e.name)&&(0!==e.inputs.length?e.inputs.forEach((e=>{u.has(e.name)||(u.add(e.name),p.push(e))})):a.push(e.name)))}return{inputs:e,outputs:t,usedNodes:s,missingInputs:a,dynamicNode:o,syncInputs:i}}const ud=["Switch","Merge","Enter","Exit","NextIteration","StatelessIf","StatelessWhile","if","While"],ld=["NonMaxSuppressionV2","NonMaxSuppressionV3","NonMaxSuppressionV5","Where"],cd=["HashTable","HashTableV2","LookupTableImport","LookupTableImportV2","LookupTableFind","LookupTableFindV2","LookupTableSize","LookupTableSizeV2"];function pd(e){return ud.indexOf(e.op)>=0}function hd(e){return ld.indexOf(e.op)>=0}function dd(e){return cd.indexOf(e.op)>=0}
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
 */class md{constructor(e,t){this.graph=e,this.parent=t,this.compiledMap=new Map,this._weightMap={},this.SEPERATOR=",",this._functions={},this._functionExecutorMap={},this.intermediateTensors={},this.keepTensorForDebug=!1,this._outputs=e.outputs,this._inputs=e.inputs,this._initNodes=e.initNodes,this._signature=e.signature,this._functions=e.functions,null!=e.functions&&Object.keys(e.functions).forEach((t=>{this._functionExecutorMap[t]=new md(e.functions[t],this)}))}get weightIds(){return this.parent?this.parent.weightIds:this._weightIds}get functionExecutorMap(){return this.parent?this.parent.functionExecutorMap:this._functionExecutorMap}get weightMap(){return this.parent?this.parent.weightMap:this._weightMap}set weightMap(e){const t=Object.keys(e).map((t=>e[t].map((e=>e.id))));this._weightIds=[].concat(...t),this._weightMap=e}set resourceManager(e){this._resourceManager=e}get inputs(){return this._inputs.map((e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0})))}get outputs(){return this._outputs.map((e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0})))}get inputNodes(){return this._inputs.map((e=>e.signatureKey||e.name))}get outputNodes(){return this._outputs.map((e=>{const t=e.signatureKey||e.name;return e.defaultOutput?`${t}:${e.defaultOutput}`:t}))}get functions(){return Object.keys(this._functions).reduce(((e,t)=>(e[t]=this._functions[t].signature,e)),{})}getCompilationKey(e,t){const n=e.map((e=>e.name)).sort(),r=t.map((e=>e.name)).sort();return n.join(this.SEPERATOR)+"--"+r.join(this.SEPERATOR)}compile(e,t){const n=id(e,t,this.weightMap,this._initNodes),{missingInputs:r,dynamicNode:s,syncInputs:a}=n;if(null!=s)throw new Error(`This execution contains the node '${s.name}', which has the dynamic op '${s.op}'. Please use model.executeAsync() instead. Alternatively, to avoid the dynamic ops, specify the inputs [${a}]`);if(r.length>0){const n=t.map((e=>e.name)),s=Object.keys(e);throw new Error(`Cannot compute the outputs [${n}] from the provided inputs [${s}]. Missing the following inputs: [${r}]`)}return function(e,t,n){const{usedNodes:r,inputs:s}=n,a=[],o=Object.keys(s).map((e=>ch(e)[0])).map((t=>e.nodes[t])),i=e.initNodes;o.forEach((e=>{r.has(e.name)&&a.push(e)})),e.weights.forEach((e=>{r.has(e.name)&&a.push(e)})),null!=i&&i.forEach((e=>{r.has(e.name)&&a.push(e)}));const u=new Set,l=[];for(;a.length>0;){const e=a.pop();u.add(e.name),t[e.name]||l.push(e),e.children.forEach((e=>{!u.has(e.name)&&r.has(e.name)&&e.inputs.every((e=>u.has(e.name)))&&a.push(e)}))}return l}(this.graph,this.weightMap,n)}execute(e,t){e=this.mapInputs(e);const n=Object.keys(e).sort();this.checkInputs(e),this.checkInputShapeAndType(e),t=this.mapOutputs(t),this.checkOutputs(t);const r=n.map((e=>this.graph.nodes[ch(e)[0]])),s=t.map((e=>ch(e)[0]));let a=s.map((e=>this.graph.nodes[e]));this.resetIntermediateTensors(),0===a.length&&(a=this._outputs);const o=this.getCompilationKey(r,a);let i=this.compiledMap.get(o);null==i&&(i=this.compile(e,a),this.compiledMap.set(o,i));const u={},l={};return xa((()=>{const n=new od(this.weightMap,u,l,this.functionExecutorMap),r=Object.assign({},this.weightMap);Object.keys(e).forEach((t=>{const[n,s]=ch(t),a=[];a[s]=e[t],r[n]=a}));const a=this.getFrozenTensorIds(r),o={};for(let e=0;e<i.length;e++){const t=i[e];if(!r[t.name]){const e=ad(t,r,n,this._resourceManager);if(F(e))throw new Error(`The execution of the op '${t.op}' returned a promise. Please use model.executeAsync() instead.`);r[t.name]=e,this.checkTensorForDisposal(t.name,t,r,n,a,s,o)}}return null==this.parent&&n.dispose(a),t.map((e=>ih(e,r,n)))}))}getFrozenTensorIds(e){const t=[].concat.apply([],Object.keys(e).map((t=>e[t])).map((e=>e.map((e=>e.id)))));return new Set(t)}checkTensorForDisposal(e,t,n,r,s,a,o){"control"!==t.category&&-1===a.indexOf(e)&&(n[e].forEach((e=>{null!=e&&(o[e.id]=(o[e.id]||0)+t.children.length)})),t.inputs.forEach((e=>{if("control"!==e.category){const a=function(e,t,n){return t[lh(e,n.currentContextId)]}(e.name,n,r);null!=a&&a.forEach((e=>{if(e&&!e.kept&&!s.has(e.id)){const n=o[e.id];if(1===n){if(this.keepTensorForDebug){const[n,s]=uh(t.name,r);this.intermediateTensors[n]||(this.intermediateTensors[n]=[]),this.intermediateTensors[n][s]=e}else e.dispose();delete o[e.id]}else null!=n&&o[e.id]--}}))}})))}async executeAsync(e,t){return this._executeAsync(e,t)}disposeIntermediateTensors(){this.intermediateTensors&&(Object.keys(this.intermediateTensors).forEach((e=>this.intermediateTensors[e].forEach((e=>e.dispose())))),this.disposeTensorsMap())}disposeTensorsMap(){this.tensorsMap&&Object.keys(this.tensorsMap).forEach((e=>{this.tensorsMap[e].forEach((e=>{!e||e.kept||e.isDisposed||this.keepIds.has(e.id)||e.dispose()}))}))}getIntermediateTensors(){return this.tensorsMap}resetIntermediateTensors(){for(const e in this.intermediateTensors)this.intermediateTensors[e].forEach((e=>e.dispose())),delete this.intermediateTensors[e]}async _executeAsync(e,t,n=!1,r={},s={}){n||(e=this.mapInputs(e),this.checkInputs(e),this.checkInputShapeAndType(e),t=this.mapOutputs(t),this.checkOutputs(t));try{this.keepTensorForDebug=j().getBool("KEEP_INTERMEDIATE_TENSORS")}catch(e){console.warn(e.message)}this.resetIntermediateTensors();const a=new od(this.weightMap,r,s,this.functionExecutorMap);this.tensorsMap=await this.executeWithControlFlow(e,a,t,n);const o=t.map((e=>ih(e,this.tensorsMap,a))),i=o.map((e=>e.id)),u=Object.keys(e).map((t=>e[t].id));return this.keepIds=new Set([...i,...u,...this.weightIds]),this.keepTensorForDebug||this.disposeTensorsMap(),null==this.parent&&a.dispose(this.keepIds),o}async executeFunctionAsync(e,t,n){const r=e.reduce(((e,t,n)=>(e[this.inputs[n].name]=t,e)),{});return this._executeAsync(r,this.outputNodes,!0,t,n)}async executeWithControlFlow(e,t,n,r){const s=Object.keys(e),a=s.map((e=>this.graph.nodes[ch(e)[0]])),o=n.map((e=>ch(e)[0]));let i=o.map((e=>this.graph.nodes[e]));0===i.length&&(i=this._outputs);const{usedNodes:u,missingInputs:l,dynamicNode:c,syncInputs:p}=id(e,i,this.weightMap,this._initNodes),h=[...a,...this.graph.weights,...this._initNodes||[]].map((e=>({node:e,contexts:t.currentContext}))),d=Object.assign({},this.weightMap);Object.keys(e).forEach((t=>{const[n,r]=ch(t),s=[];s[r]=e[t],d[n]=s}));const m={},f=this.getFrozenTensorIds(d),g={};for(;h.length>0;){const e=this.processStack(a,h,t,d,g,f,o,m,u);await Promise.all(e)}null!=c||r||console.warn("This model execution did not contain any nodes with control flow or dynamic output shapes. You can use model.execute() instead.");const y=i.filter((e=>!pd(e)&&!ih(e.name,d,t))).map((e=>e.name));if(y.length>0){let e="";throw null!=c&&(e=`Alternatively, to avoid the dynamic ops, use model.execute() and specify the inputs [${p}]`),new Error(`Cannot compute the outputs [${y}] from the provided inputs [${s}]. Consider providing the following inputs: [${l}]. ${e}`)}return d}processStack(e,t,n,r,s,a,o,i,u){const l=[];for(;t.length>0;){const e=t.pop();n.currentContext=e.contexts;let c="";if("Enter"===e.node.op&&oh("isConstant",e.node,r,n)&&([c]=uh(e.node.name,n)),null==r[e.node.name]){const p=ad(e.node,r,n,this._resourceManager);c||([c]=uh(e.node.name,n));const h=n.currentContext;F(p)?l.push(p.then((l=>(r[c]=l,n.currentContext=h,this.checkTensorForDisposal(c,e.node,r,n,a,o,i),this.processChildNodes(e.node,t,n,r,s,u),l)))):(r[c]=p,this.checkTensorForDisposal(c,e.node,r,n,a,o,i),this.processChildNodes(e.node,t,n,r,s,u))}else this.processChildNodes(e.node,t,n,r,s,u)}return l}processChildNodes(e,t,n,r,s,a){e.children.forEach((e=>{const[o]=uh(e.name,n);!s[o]&&a.has(e.name)&&("Merge"===e.op?e.inputNames.some((e=>!!ih(e,r,n)))&&(s[o]=!0,t.push({contexts:n.currentContext,node:e})):e.inputNames.every((e=>!!ih(e,r,n)))&&(s[o]=!0,t.push({contexts:n.currentContext,node:e})))}))}dispose(){Object.keys(this.weightMap).forEach((e=>this.weightMap[e].forEach((e=>e.dispose()))))}checkInputShapeAndType(e){Object.keys(e).forEach((t=>{const n=e[t],[r]=ch(t),s=this.graph.nodes[r];if(s.attrParams.shape&&s.attrParams.shape.value){const e=s.attrParams.shape.value;u(e.length===n.shape.length&&n.shape.every(((t,n)=>-1===e[n]||e[n]===t)),(()=>`The shape of dict['${s.name}'] provided in model.execute(dict) must be [${e}], but was [${n.shape}]`))}s.attrParams.dtype&&s.attrParams.dtype.value&&u(n.dtype===s.attrParams.dtype.value,(()=>`The dtype of dict['${s.name}'] provided in model.execute(dict) must be ${s.attrParams.dtype.value}, but was ${n.dtype}`))}))}mapInputs(e){const t={};for(const n in e)if(null!=this._signature&&null!=this._signature.inputs&&null!=this._signature.inputs[n]){t[this._signature.inputs[n].name]=e[n]}else t[n]=e[n];return t}checkInputs(e){const t=Object.keys(e).filter((e=>{const[t]=ch(e);return null==this.graph.nodes[t]}));if(t.length>0)throw new Error(`The dict provided in model.execute(dict) has keys: [${t}] that are not part of graph`)}mapOutputs(e){return e.map((e=>{if(null!=this._signature&&null!=this._signature.outputs&&null!=this._signature.outputs[e]){return this._signature.outputs[e].name}return e}),{})}checkOutputs(e){e.forEach((e=>{const[t]=ch(e);if(!this.graph.nodes[t])throw new Error(`The output '${e}' is not found in the graph`)}))}}class fd{constructor(e={},t={}){this.hashTableNameToHandle=e,this.hashTableMap=t}addHashTable(e,t){this.hashTableNameToHandle[e]=t.handle,this.hashTableMap[t.id]=t}getHashTableHandleByName(e){return this.hashTableNameToHandle[e]}getHashTableById(e){return this.hashTableMap[e]}dispose(){for(const e in this.hashTableMap)this.hashTableMap[e].clearAndClose(),delete this.hashTableMap[e];for(const e in this.hashTableNameToHandle)this.hashTableNameToHandle[e].dispose(),delete this.hashTableNameToHandle[e]}}
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
 */const gd="?tfjs-format=file",yd="model.json";class bd{constructor(e,t={},n=ya){this.modelUrl=e,this.loadOptions=t,this.version="n/a",this.io=n,null==t&&(this.loadOptions={}),this.resourceManager=new fd}get modelVersion(){return this.version}get inputNodes(){return this.executor.inputNodes}get outputNodes(){return this.executor.outputNodes}get inputs(){return this.executor.inputs}get outputs(){return this.executor.outputs}get weights(){return this.executor.weightMap}get metadata(){return this.artifacts.userDefinedMetadata}get modelSignature(){return this.signature}get modelStructuredOutputKeys(){return this.structuredOutputKeys}findIOHandler(){const e=this.modelUrl;if(null!=e.load)this.handler=e;else if(null!=this.loadOptions.requestInit)this.handler=this.io.browserHTTPRequest(e,this.loadOptions);else{const t=this.io.getLoadHandlers(e,this.loadOptions);if(0===t.length)t.push(this.io.browserHTTPRequest(e,this.loadOptions));else if(t.length>1)throw new Error(`Found more than one (${t.length}) load handlers for URL '${[e]}'`);this.handler=t[0]}}load(){if(this.findIOHandler(),null==this.handler.load)throw new Error("Cannot proceed with model loading because the IOHandler provided does not have the `load` method implemented.");const e=this.handler.load();return F(e)?e.then((e=>this.loadSync(e))):this.loadSync(e)}loadSync(e){this.artifacts=e;const t=this.artifacts.modelTopology;let n=this.artifacts.signature;if(null!=this.artifacts.userDefinedMetadata){const e=this.artifacts.userDefinedMetadata;null!=e.signature&&(n=e.signature),null!=e.structuredOutputKeys&&(this.structuredOutputKeys=e.structuredOutputKeys)}this.signature=n,this.version=`${t.versions.producer}.${t.versions.minConsumer}`;const r=this.io.decodeWeights(this.artifacts.weightData,this.artifacts.weightSpecs);if(this.executor=new md($h.Instance.transformGraph(t,this.signature)),this.executor.weightMap=this.convertTensorMapToTensorsMap(r),this.executor.resourceManager=this.resourceManager,null!=e.modelInitializer&&null!=e.modelInitializer.node){const t=$h.Instance.transformGraph(e.modelInitializer);this.initializer=new md(t),this.initializer.weightMap=this.executor.weightMap,this.initializer.resourceManager=this.resourceManager,this.initializer.executeAsync({},[])}return!0}async save(e,t){if("string"==typeof e){const t=this.io.getSaveHandlers(e);if(0===t.length)throw new Error(`Cannot find any save handlers for URL '${e}'`);if(t.length>1)throw new Error(`Found more than one (${t.length}) save handlers for URL '${e}'`);e=t[0]}if(null==e.save)throw new Error("GraphModel.save() cannot proceed because the IOHandler provided does not have the `save` attribute defined.");return e.save(this.artifacts)}predict(e,t){const n=this.execute(e,this.outputNodes);if(this.structuredOutputKeys){const e={};return(n instanceof Ar?[n]:n).forEach(((t,n)=>e[this.structuredOutputKeys[n]]=t)),e}return n}normalizeInputs(e){if(!(e instanceof Ar||Array.isArray(e)))return e;if((e=Array.isArray(e)?e:[e]).length!==this.inputNodes.length)throw new Error(`Input tensor count mismatch,the graph model has ${this.inputNodes.length} placeholders, while there are ${e.length} input tensors.`);return this.inputNodes.reduce(((t,n,r)=>(t[n]=e[r],t)),{})}normalizeOutputs(e){return e=e||this.outputNodes,Array.isArray(e)?e:[e]}execute(e,t){e=this.normalizeInputs(e),t=this.normalizeOutputs(t);const n=this.executor.execute(e,t);return n.length>1?n:n[0]}async executeAsync(e,t){e=this.normalizeInputs(e),t=this.normalizeOutputs(t);const n=await this.executor.executeAsync(e,t);return n.length>1?n:n[0]}getIntermediateTensors(){return this.executor.getIntermediateTensors()}disposeIntermediateTensors(){this.executor.disposeIntermediateTensors()}convertTensorMapToTensorsMap(e){return Object.keys(e).reduce(((t,n)=>(t[n]=[e[n]],t)),{})}dispose(){this.executor.dispose(),this.initializer&&this.initializer.dispose(),this.resourceManager.dispose()}}async function wd(e,t={},n=ya){if(null==e)throw new Error("modelUrl in loadGraphModel() cannot be null. Please provide a url or an IOHandler that loads the model");null==t&&(t={}),t.fromTFHub&&"string"==typeof e&&(e=function(e){e.endsWith("/")||(e+="/");return`${e}${yd}${gd}`}
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
    */(e));const r=new bd(e,t,n);return await r.load(),r}var xd=function(e,t){return(xd=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)};function Nd(e,t){function n(){this.constructor=e}xd(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}var vd=function(){return(vd=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var s in t=arguments[n])Object.prototype.hasOwnProperty.call(t,s)&&(e[s]=t[s]);return e}).apply(this,arguments)};function Sd(e,t,n,r){return new(n||(n=Promise))((function(s,a){function o(e){try{u(r.next(e))}catch(e){a(e)}}function i(e){try{u(r.throw(e))}catch(e){a(e)}}function u(e){e.done?s(e.value):new n((function(t){t(e.value)})).then(o,i)}u((r=r.apply(e,t||[])).next())}))}function Td(e,t){var n,r,s,a,o={label:0,sent:function(){if(1&s[0])throw s[1];return s[1]},trys:[],ops:[]};return a={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function i(a){return function(i){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,r&&(s=2&a[0]?r.return:a[0]?r.throw||((s=r.return)&&s.call(r),0):r.next)&&!(s=s.call(r,a[1])).done)return s;switch(r=0,s&&(a=[2&a[0],s.value]),a[0]){case 0:case 1:s=a;break;case 4:return o.label++,{value:a[1],done:!1};case 5:o.label++,r=a[1],a=[0];continue;case 7:a=o.ops.pop(),o.trys.pop();continue;default:if(!(s=(s=o.trys).length>0&&s[s.length-1])&&(6===a[0]||2===a[0])){o=0;continue}if(3===a[0]&&(!s||a[1]>s[0]&&a[1]<s[3])){o.label=a[1];break}if(6===a[0]&&o.label<s[1]){o.label=s[1],s=a;break}if(s&&o.label<s[2]){o.label=s[2],o.ops.push(a);break}s[2]&&o.ops.pop(),o.trys.pop();continue}a=t.call(e,o)}catch(e){a=[6,e],r=0}finally{n=s=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,i])}}}var kd=function(){function e(e,t){this.model=e,this.outputStride=t;var n=this.model.inputs[0].shape;u(-1===n[1]&&-1===n[2],(function(){return"Input shape ["+n[1]+", "+n[2]+"] must both be equal to or -1"}))}return e.prototype.predict=function(e){var t=this;return xa((function(){var n=t.preprocessInput(ea(e,"float32")),r=qi(n,0),s=t.model.predict(r).map((function(e){return Yl(e,[0])})),a=t.nameOutputResults(s);return{heatmapScores:Go(a.heatmap),offsets:a.offsets,displacementFwd:a.displacementFwd,displacementBwd:a.displacementBwd}}))},e.prototype.dispose=function(){this.model.dispose()},e}(),Ed=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return Nd(t,e),t.prototype.preprocessInput=function(e){return xa((function(){return fu(po(e,127.5),1)}))},t.prototype.nameOutputResults=function(e){return{offsets:e[0],heatmap:e[1],displacementFwd:e[2],displacementBwd:e[3]}},t}(kd);function _d(e){return Math.floor(e/2)}var Md=function(){function e(e,t){this.priorityQueue=new Array(e),this.numberOfElements=-1,this.getElementValue=t}return e.prototype.enqueue=function(e){this.priorityQueue[++this.numberOfElements]=e,this.swim(this.numberOfElements)},e.prototype.dequeue=function(){var e=this.priorityQueue[0];return this.exchange(0,this.numberOfElements--),this.sink(0),this.priorityQueue[this.numberOfElements+1]=null,e},e.prototype.empty=function(){return-1===this.numberOfElements},e.prototype.size=function(){return this.numberOfElements+1},e.prototype.all=function(){return this.priorityQueue.slice(0,this.numberOfElements+1)},e.prototype.max=function(){return this.priorityQueue[0]},e.prototype.swim=function(e){for(;e>0&&this.less(_d(e),e);)this.exchange(e,_d(e)),e=_d(e)},e.prototype.sink=function(e){for(;2*e<=this.numberOfElements;){var t=2*e;if(t<this.numberOfElements&&this.less(t,t+1)&&t++,!this.less(e,t))break;this.exchange(e,t),e=t}},e.prototype.getValueAt=function(e){return this.getElementValue(this.priorityQueue[e])},e.prototype.less=function(e,t){return this.getValueAt(e)<this.getValueAt(t)},e.prototype.exchange=function(e,t){var n=this.priorityQueue[e];this.priorityQueue[e]=this.priorityQueue[t],this.priorityQueue[t]=n},e}();function Id(e,t,n,r,s,a){for(var o=a.shape,i=o[0],u=o[1],l=!0,c=Math.max(n-s,0),p=Math.min(n+s+1,i),h=c;h<p;++h){for(var d=Math.max(r-s,0),m=Math.min(r+s+1,u),f=d;f<m;++f)if(a.get(h,f,e)>t){l=!1;break}if(!l)break}return l}var Ad=["nose","leftEye","rightEye","leftEar","rightEar","leftShoulder","rightShoulder","leftElbow","rightElbow","leftWrist","rightWrist","leftHip","rightHip","leftKnee","rightKnee","leftAnkle","rightAnkle"],Dd=Ad.length,$d=Ad.reduce((function(e,t,n){return e[t]=n,e}),{});function Od(e,t,n,r){return{y:r.get(e,t,n),x:r.get(e,t,n+Dd)}}function Ld(e,t,n){var r=Od(e.heatmapY,e.heatmapX,e.id,n),s=r.y,a=r.x;return{x:e.heatmapX*t+a,y:e.heatmapY*t+s}}function Cd(e,t,n){return e<t?t:e>n?n:e}function Rd(e,t){return{x:e.x+t.x,y:e.y+t.y}}[["leftHip","leftShoulder"],["leftElbow","leftShoulder"],["leftElbow","leftWrist"],["leftHip","leftKnee"],["leftKnee","leftAnkle"],["rightHip","rightShoulder"],["rightElbow","rightShoulder"],["rightElbow","rightWrist"],["rightHip","rightKnee"],["rightKnee","rightAnkle"],["leftShoulder","rightShoulder"],["leftHip","rightHip"]].map((function(e){var t=e[0],n=e[1];return[$d[t],$d[n]]}));var Fd=[["nose","leftEye"],["leftEye","leftEar"],["nose","rightEye"],["rightEye","rightEar"],["nose","leftShoulder"],["leftShoulder","leftElbow"],["leftElbow","leftWrist"],["leftShoulder","leftHip"],["leftHip","leftKnee"],["leftKnee","leftAnkle"],["nose","rightShoulder"],["rightShoulder","rightElbow"],["rightElbow","rightWrist"],["rightShoulder","rightHip"],["rightHip","rightKnee"],["rightKnee","rightAnkle"]].map((function(e){var t=e[0],n=e[1];return[$d[t],$d[n]]})),zd=Fd.map((function(e){return e[1]})),Bd=Fd.map((function(e){return e[0]}));function Pd(e,t,n,r){return{y:Cd(Math.round(e.y/t),0,n-1),x:Cd(Math.round(e.x/t),0,r-1)}}function jd(e,t,n,r,s,a,o,i){void 0===i&&(i=2);for(var u=r.shape,l=u[0],c=u[1],p=function(e,t,n){var r=n.shape[2]/2;return{y:n.get(t.y,t.x,e),x:n.get(t.y,t.x,r+e)}}(e,Pd(t.position,a,l,c),o),h=Rd(t.position,p),d=0;d<i;d++){var m=Pd(h,a,l,c),f=Od(m.y,m.x,n,s);h=Rd({x:m.x*a,y:m.y*a},{x:f.x,y:f.y})}var g=Pd(h,a,l,c),y=r.get(g.y,g.x,n);return{position:h,part:Ad[n],score:y}}function Vd(e,t,n,r,s,a){var o=t.shape[2],i=zd.length,u=new Array(o),l=e.part,c=e.score,p=Ld(l,r,n);u[l.id]={score:c,part:Ad[l.id],position:p};for(var h=i-1;h>=0;--h){var d=zd[h],m=Bd[h];u[d]&&!u[m]&&(u[m]=jd(h,u[d],m,t,n,r,a))}for(h=0;h<i;++h)d=Bd[h],m=zd[h],u[d]&&!u[m]&&(u[m]=jd(h,u[d],m,t,n,r,s));return u}function Gd(e,t,n,r){var s=n.x,a=n.y;return e.some((function(e){var n=e.keypoints[r].position;return function(e,t,n,r){var s=n-e,a=r-t;return s*s+a*a}(a,s,n.y,n.x)<=t}))}function Wd(e,t,n){return n.reduce((function(n,r,s){var a=r.position,o=r.score;return Gd(e,t,a,s)||(n+=o),n}),0)/n.length}function Ud(e,t,n,r,s,a,o,i){void 0===o&&(o=.5),void 0===i&&(i=20);for(var u=[],l=function(e,t,n){for(var r=n.shape,s=r[0],a=r[1],o=r[2],i=new Md(s*a*o,(function(e){return e.score})),u=0;u<s;++u)for(var l=0;l<a;++l)for(var c=0;c<o;++c){var p=n.get(u,l,c);p<e||Id(c,p,u,l,t,n)&&i.enqueue({score:p,part:{heatmapY:u,heatmapX:l,id:c}})}return i}(o,1,e),c=i*i;u.length<a&&!l.empty();){var p=l.dequeue();if(!Gd(u,c,Ld(p.part,s,t),p.part.id)){var h=Vd(p,e,t,s,n,r),d=Wd(u,c,h);u.push({keypoints:h,score:d})}}return u}function qd(e){var t=e.shape,n=t[0],r=t[1],s=t[2];return xa((function(){var t=Bo(e,[n*r,s]),a=xo(t,0),o=qi(po(a,zi(r,"int32")),1),i=qi(function(e,t){return xa((function(){var n=po(e,zi(t,"int32"));return fu(e,ho(n,zi(t,"int32")))}))}(a,r),1);return Vo([o,i],1)}))}function Hd(e,t,n,r){return{y:r.get(e,t,n),x:r.get(e,t,n+Dd)}}function Kd(e,t,n){return xa((function(){var r=function(e,t){for(var n=[],r=0;r<Dd;r++){var s=Hd(e.get(r,0).valueOf(),e.get(r,1).valueOf(),r,t),a=s.x,o=s.y;n.push(o),n.push(a)}return nc(n,[Dd,2])}(e,n);return lo(ea(ho(e.toTensor(),zi(t,"int32")),"float32"),r)}))}function Zd(e,t,n){return Sd(this,void 0,void 0,(function(){var r,s,a,o,i,u,l,c,p,h;return Td(this,(function(d){switch(d.label){case 0:return r=0,s=qd(e),[4,Promise.all([e.buffer(),t.buffer(),s.buffer()])];case 1:return a=d.sent(),o=a[0],i=a[1],u=a[2],[4,(l=Kd(u,n,i)).buffer()];case 2:return c=d.sent(),p=Array.from(function(e,t){for(var n=t.shape[0],r=new Float32Array(n),s=0;s<n;s++){var a=t.get(s,0),o=t.get(s,1);r[s]=e.get(a,o,s)}return r}(o,u)),h=p.map((function(e,t){return r+=e,{position:{y:c.get(t,0),x:c.get(t,1)},part:Ad[t],score:e}})),s.dispose(),l.dispose(),[2,{keypoints:h,score:r/h.length}]}}))}))}var Yd="https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/",Qd="https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/";var Jd=[-123.15,-115.9,-103.06],Xd=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return Nd(t,e),t.prototype.preprocessInput=function(e){return lo(e,Jd)},t.prototype.nameOutputResults=function(e){var t=e[0],n=e[1];return{offsets:e[2],heatmap:e[3],displacementFwd:t,displacementBwd:n}},t}(kd);function em(e){return Sd(this,void 0,void 0,(function(){return Td(this,(function(t){return[2,Promise.all(e.map((function(e){return e.buffer()})))]}))}))}function tm(e,t){return am(e,t)?e:Math.floor(e/t)*t+1}function nm(e){u("number"==typeof e||"object"==typeof e,(function(){return"Invalid inputResolution "+e+". Should be a number or an object with width and height"})),"object"==typeof e&&(u("number"==typeof e.width,(function(){return"inputResolution.width has a value of "+e.width+" which is invalid; it must be a number"})),u("number"==typeof e.height,(function(){return"inputResolution.height has a value of "+e.height+" which is invalid; it must be a number"})))}function rm(e,t){return nm(e),"object"==typeof e?[tm(e.height,t),tm(e.width,t)]:[tm(e,t),tm(e,t)]}var sm=[8,16,32];function am(e,t){return(e-1)%t==0}function om(e){return e instanceof Ar?[e.shape[0],e.shape[1]]:[e.height,e.width]}function im(e,t){var n=t[0],r=t[1],s=om(e),a=s[0],o=s[1],i=r/n,u=[0,0,0,0],l=u[0],c=u[1],p=u[2],h=u[3];return o/a<i?(l=0,c=0,p=Math.round(.5*(i*a-o)),h=Math.round(.5*(i*a-o))):(l=Math.round(.5*(1/i*o-a)),c=Math.round(.5*(1/i*o-a)),p=0,h=0),{resized:xa((function(){var t=function(e){return e instanceof Ar?e:Fa(e)}(e);return t=Uu(t,[[l,c],[p,h],[0,0]]),$p.resizeBilinear(t,[n,r])})),padding:{top:l,left:p,right:h,bottom:c}}}function um(e,t,n,r,s){var a=t[0],o=t[1],i=n[0],u=n[1],l=function(e,t,n,r,s){return void 0===r&&(r=0),void 0===s&&(s=0),1===n&&1===t&&0===r&&0===s?e:e.map((function(e){return function(e,t,n,r,s){return void 0===r&&(r=0),void 0===s&&(s=0),{score:e.score,keypoints:e.keypoints.map((function(e){var a=e.score,o=e.part,i=e.position;return{score:a,part:o,position:{x:i.x*n+s,y:i.y*t+r}}}))}}(e,t,n,r,s)}))}(e,(a+r.top+r.bottom)/i,(o+r.left+r.right)/u,-r.top,-r.left);return s?function(e,t){return t<=0?e:e.map((function(e){return function(e,t){return{score:e.score,keypoints:e.keypoints.map((function(e){var n=e.score,r=e.part,s=e.position;return{score:n,part:r,position:{x:t-1-s.x,y:s.y}}}))}}(e,t)}))}(l,o):l}var lm={architecture:"MobileNetV1",outputStride:16,multiplier:.75,inputResolution:257},cm=["MobileNetV1","ResNet50"],pm={MobileNetV1:[8,16,32],ResNet50:[32,16]},hm={MobileNetV1:[.5,.75,1],ResNet50:[1]},dm=[1,2,4];var mm={flipHorizontal:!1},fm={flipHorizontal:!1,maxDetections:5,scoreThreshold:.5,nmsRadius:20};var gm=function(){function e(e,t){(function(e){u("number"==typeof e,(function(){return"outputStride is not a number"})),u(sm.indexOf(e)>=0,(function(){return"outputStride of "+e+" is invalid. It must be either 8, 16, or 32"}))})(e.outputStride),function(e,t){u("number"==typeof e[0]&&"number"==typeof e[1],(function(){return"both resolution values must be a number but had values "+e})),u(am(e[0],t),(function(){return"height of "+e[0]+" is invalid for output stride "+t+"."})),u(am(e[1],t),(function(){return"width of "+e[1]+" is invalid for output stride "+t+"."}))}(t,e.outputStride),this.baseModel=e,this.inputResolution=t}return e.prototype.estimateMultiplePoses=function(e,t){return void 0===t&&(t=fm),Sd(this,void 0,void 0,(function(){var n,r,s,a,o,i,u,l,c,p,h,d,m,f,g,y,b,w,x,N,v;return Td(this,(function(S){switch(S.label){case 0:return n=vd({},fm,t),function(e){var t=e.maxDetections,n=e.scoreThreshold,r=e.nmsRadius;if(t<=0)throw new Error("Invalid maxDetections "+t+". Should be > 0");if(n<0||n>1)throw new Error("Invalid scoreThreshold "+n+". Should be in range [0.0, 1.0]");if(r<=0)throw new Error("Invalid nmsRadius "+r+".")}(t),r=this.baseModel.outputStride,s=this.inputResolution,a=om(e),o=a[0],i=a[1],u=im(e,s),l=u.resized,c=u.padding,p=this.baseModel.predict(l),h=p.heatmapScores,d=p.offsets,m=p.displacementFwd,f=p.displacementBwd,[4,em([h,d,m,f])];case 1:return g=S.sent(),y=g[0],b=g[1],w=g[2],x=g[3],[4,Ud(y,b,w,x,r,n.maxDetections,n.scoreThreshold,n.nmsRadius)];case 2:return N=S.sent(),v=um(N,[o,i],s,c,n.flipHorizontal),h.dispose(),d.dispose(),m.dispose(),f.dispose(),l.dispose(),[2,v]}}))}))},e.prototype.estimateSinglePose=function(e,t){return void 0===t&&(t=mm),Sd(this,void 0,void 0,(function(){var n,r,s,a,o,i,u,l,c,p,h,d,m,f,g,y;return Td(this,(function(b){switch(b.label){case 0:return n=vd({},mm,t),r=this.baseModel.outputStride,s=this.inputResolution,a=om(e),o=a[0],i=a[1],u=im(e,s),l=u.resized,c=u.padding,p=this.baseModel.predict(l),h=p.heatmapScores,d=p.offsets,m=p.displacementFwd,f=p.displacementBwd,[4,Zd(h,d,r)];case 1:return g=b.sent(),y=um([g],[o,i],s,c,n.flipHorizontal),h.dispose(),d.dispose(),m.dispose(),f.dispose(),l.dispose(),[2,y[0]]}}))}))},e.prototype.estimatePoses=function(e,t){return Sd(this,void 0,void 0,(function(){return Td(this,(function(n){switch(n.label){case 0:return"single-person"!==t.decodingMethod?[3,2]:[4,this.estimateSinglePose(e,t)];case 1:return[2,[n.sent()]];case 2:return[2,this.estimateMultiplePoses(e,t)]}}))}))},e.prototype.dispose=function(){this.baseModel.dispose()},e}();function ym(e){return Sd(this,void 0,void 0,(function(){var t,n,r,s,a,o,i;return Td(this,(function(u){switch(u.label){case 0:if(t=e.outputStride,n=e.quantBytes,r=e.multiplier,null==th)throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please also include @tensorflow/tfjs on the page before using this\n        model.");return s=function(e,t,n){var r={1:"100",.75:"075",.5:"050"},s="model-stride"+e+".json";return 4===n?Yd+"float/"+r[t]+"/"+s:Yd+"quant"+n+"/"+r[t]+"/"+s}(t,r,n),[4,wd(e.modelUrl||s)];case 1:return a=u.sent(),o=new Ed(a,t),i=rm(e.inputResolution,o.outputStride),[2,new gm(o,i)]}}))}))}function bm(e){return Sd(this,void 0,void 0,(function(){var t,n,r,s,a,o;return Td(this,(function(i){switch(i.label){case 0:if(t=e.outputStride,n=e.quantBytes,null==th)throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please also include @tensorflow/tfjs on the page before using this\n        model.");return r=function(e,t){var n="model-stride"+e+".json";return 4===t?Qd+"float/"+n:Qd+"quant"+t+"/"+n}(t,n),[4,wd(e.modelUrl||r)];case 1:return s=i.sent(),a=new Xd(s,t),o=rm(e.inputResolution,a.outputStride),[2,new gm(a,o)]}}))}))}function wm(e){return void 0===e&&(e=lm),Sd(this,void 0,void 0,(function(){return Td(this,(function(t){return"ResNet50"===(e=function(e){if(null==(e=e||lm).architecture&&(e.architecture="MobileNetV1"),cm.indexOf(e.architecture)<0)throw new Error("Invalid architecture "+e.architecture+". Should be one of "+cm);if(null==e.inputResolution&&(e.inputResolution=257),nm(e.inputResolution),null==e.outputStride&&(e.outputStride=16),pm[e.architecture].indexOf(e.outputStride)<0)throw new Error("Invalid outputStride "+e.outputStride+". Should be one of "+pm[e.architecture]+" for architecture "+e.architecture+".");if(null==e.multiplier&&(e.multiplier=1),hm[e.architecture].indexOf(e.multiplier)<0)throw new Error("Invalid multiplier "+e.multiplier+". Should be one of "+hm[e.architecture]+" for architecture "+e.architecture+".");if(null==e.quantBytes&&(e.quantBytes=4),dm.indexOf(e.quantBytes)<0)throw new Error("Invalid quantBytes "+e.quantBytes+". Should be one of "+dm+" for architecture "+e.architecture+".");if("MobileNetV1"===e.architecture&&32===e.outputStride&&1!==e.multiplier)throw new Error("When using an output stride of 32, you must select 1 as the multiplier.");return e}(e)).architecture?[2,bm(e)]:"MobileNetV1"===e.architecture?[2,ym(e)]:[2,null]}))}))}const xm=0,Nm=1,vm=2;class Sm extends t.Extension{internal_getCodeGenArgs(){return{id:"poseBody",name:"Body Sensing",blockIconURI:"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIKCSBpZD0ic3ZnMTE3IiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKCSB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQwIDQwIgoJIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwIDQwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzQ2OTFGRjt9Cgkuc3Qxe2ZpbGw6IzhBQjlGRjt9Cgkuc3Qye2ZpbGw6I0ZGRkZGRjt9Cgkuc3Qze2ZpbGw6Izk5RjFGRjt9Cgkuc3Q0e2ZpbGw6I0NDRjhGRjt9Cjwvc3R5bGU+Cjxzb2RpcG9kaTpuYW1lZHZpZXcgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IiBib3JkZXJvcGFjaXR5PSIxIiBncmlkdG9sZXJhbmNlPSIxMCIgZ3VpZGV0b2xlcmFuY2U9IjEwIiBpZD0ibmFtZWR2aWV3MTE5IiBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJFeHRlbnNpb25zL1NvZnR3YXJlL1ZpZGVvLVNlbnNpbmctQmxvY2siIGlua3NjYXBlOmN4PSIxNC40NjcwNjkiIGlua3NjYXBlOmN5PSI2LjU5MDMwNTYiIGlua3NjYXBlOmRvY3VtZW50LXJvdGF0aW9uPSIwIiBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIgaW5rc2NhcGU6c25hcC1zbW9vdGgtbm9kZXM9ImZhbHNlIiBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI5MDciIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTYwMCIgaW5rc2NhcGU6d2luZG93LXg9IjU3MSIgaW5rc2NhcGU6d2luZG93LXk9Ijk2IiBpbmtzY2FwZTp6b29tPSI3LjA0IiBvYmplY3R0b2xlcmFuY2U9IjEwIiBwYWdlY29sb3I9IiNmZmZmZmYiIHNob3dncmlkPSJmYWxzZSI+Cgk8L3NvZGlwb2RpOm5hbWVkdmlldz4KPHRpdGxlICBpZD0idGl0bGUxMDQiPkV4dGVuc2lvbnMvU29mdHdhcmUvVmlkZW8tU2Vuc2luZy1CbG9jazwvdGl0bGU+CjxkZXNjICBpZD0iZGVzYzEwNiI+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNC4zLDM3LjhoLTIuOWMtMC40LDAtMC44LTAuNC0wLjgtMC44bC0wLjEtNWwtMC4xLTEwLjhjMC0wLjIsMC0wLjUsMC4xLTAuN2MwLjEtMC43LDAuNS0xLjIsMC45LTEuNwoJYzAuNi0wLjYsMS40LTAuOSwyLjItMC45aDFsLTAuNSwzLjd2MGwtMS4zLDEwLjRsLTAuNCwzLjRjMCwwLjMsMC4xLDAuNywwLjUsMC44bDEuNywwLjdDMTQuOSwzNy4yLDE0LjgsMzcuOCwxNC4zLDM3Ljh6Ii8+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zNi42LDE2LjlsLTAuNCwwLjhjLTAuNCwwLjUtMSwwLjgtMS43LDAuOWwtOC40LDAuNWwtNC4xLDAuMkwyMS41LDIwYy0xLjEsMS40LTIuMiwxLjYtNCwxLjZoLTMuNGwwLjMtMi4xCglsMC4yLTEuMmwwLTAuM2gwLjJjMS43LDAsMy4xLTEuNCwzLjEtMy4xbC0xLjUtMS44bC01LTYuMWwtMC42LTAuOGwxLjUtMC42TDEyLjcsNmw1LjUsNS44aDBsMy42LDMuOGMwLjYsMC43LDEuNiwxLjEsMi41LDEuMQoJbDEuOCwwTDM2LjYsMTYuOXoiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTEyLjcsNmwwLDAuM2MwLDAuMy0wLjIsMC41LTAuNSwwLjVoLTAuNGMtMC4xLDAtMC4zLDAtMC40LDAuMWwtMC42LTAuOGwxLjUtMC42TDEyLjcsNnoiLz4KPGc+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTQuNiwxOGwtMi4yLDMuMmMtMC41LTAuMS0xLjMtMC4zLTEuOS0wLjdjLTAuMy0wLjItMC42LTAuNC0wLjgtMC42bC00LjEtNS44Yy0wLjctMC45LTAuNy0yLjEtMC4xLTIuOQoJCWwzLjEtNC40bDMuMy00LjZjMC4xLTAuMSwwLjMtMC4xLDAuMywwLjFsMC4xLDMuMmMwLDAuMy0wLjIsMC41LTAuNSwwLjVoLTAuNGMtMC4zLDAtMC41LDAuMi0wLjYsMC40TDEwLDcuOWwtMS45LDMuNgoJCWMtMC4yLDAuNC0wLjEsMC44LDAuMiwxLjFjMS4xLDAuOSwyLjcsMi4zLDIuNywyLjNDMTQuNCwxNy44LDE0LjYsMTgsMTQuNiwxOEwxNC42LDE4eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE1LDE4LjdsLTAuNiwwLjhsMC4yLTEuMkMxNC45LDE4LjYsMTUsMTguNywxNSwxOC43TDE1LDE4Ljd6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjEuNSwxMi43bDEuMi0xLjJjMC44LTAuOCwyLTAuOCwyLjgsMGMwLjgsMC44LDAuOCwyLDAsMi44bC0xLjIsMS4yYy0wLjgsMC44LTIsMC44LTIuOCwwCgkJQzIwLjcsMTQuNywyMC43LDEzLjQsMjEuNSwxMi43eiIvPgo8L2c+CjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNS42LDExLjRjLTAuNi0wLjYtMS40LTAuNy0yLjEtMC40YzAuMywwLjEsMC41LDAuMiwwLjcsMC40YzAuOCwwLjgsMC44LDIsMCwyLjhsLTEuMiwxLjIKCWMtMC4yLDAuMi0wLjQsMC40LTAuNywwLjRjMC43LDAuMywxLjYsMC4xLDIuMS0wLjRsMS4yLTEuMkMyNi40LDEzLjUsMjYuNCwxMi4yLDI1LjYsMTEuNHoiLz4KPHBhdGggY2xhc3M9InN0MiIgZD0iTTE0LjYsMThsMC4zLDJsLTAuOCwxLjZ2MGwtMS4zLDEwLjRoLTIuM2wtMC4xLTEwLjhjMC0wLjIsMC0wLjUsMC4xLTAuN2MtMC4yLTAuMS0wLjQtMC4yLTAuNS0wLjMKCWMtMC4xLTAuMS0wLjItMC4yLTAuMy0wLjNsLTQuMS01LjhjLTAuNy0wLjktMC43LTIuMS0wLjEtMi45bDMuMS00LjRsMS4yLDFMMTAsNy45bC0xLjksMy42Yy0wLjIsMC40LTAuMSwwLjgsMC4yLDEuMQoJYzEuMSwwLjksMi43LDIuMywyLjcsMi4zQzE0LjQsMTcuOCwxNC42LDE4LDE0LjYsMThMMTQuNiwxOHoiLz4KPHBhdGggY2xhc3M9InN0MyIgZD0iTTI2LjEsMTkuMUwyNi4xLDE5LjFsLTQuMSwwLjJMMjEuNSwyMGMtMS4xLDEuNC0yLjIsMS42LTQsMS42aC0zLjRsMC41LTMuN2gwLjJjMS43LDAsMy4xLTEuNCwzLjEtMy4xCglsLTEuNS0xLjhsMCwwbDEuOC0xLjNoMGwzLjYsMy44YzAuNiwwLjcsMS42LDEuMSwyLjUsMS4xbDEuOCwwTDI2LjEsMTkuMXoiLz4KPHBhdGggY2xhc3M9InN0NCIgZD0iTTIyLjEsMTkuNEwyMS41LDIwYy0xLjEsMS40LTIuMiwxLjYtNCwxLjZoLTEuOGMwLjksMCwxLjYtMC4xLDIuMy0wLjNjMC42LTAuMiwxLjItMC42LDEuNy0xLjMKCWMwLjQtMC40LDAuOS0wLjYsMS40LTAuN0wyMi4xLDE5LjR6Ii8+Cjwvc3ZnPgo="}}init(e){this.runtime=e.runtime,this.firstInstall=!0,this.runtime.ioDevices&&this._loop()}static get DIMENSIONS(){return[480,360]}tfCoordsToScratch({x:e,y:t}){return{x:e-250,y:200-t}}projectStarted(){this.setVideoTransparency(this.globalVideoTransparency),this.videoToggle(this.globalVideoState)}isConnected(){return this.hasPose()}hasPose(){return this.poseState&&this.poseState.keypoints&&this.poseState.score>.01}async _loop(){for(;;){const e=this.runtime.ioDevices.video.getFrame({format:"image-data",dimensions:Sm.DIMENSIONS}),t=+new Date;e&&(this.poseState=await this.estimatePoseOnImage(e));const n=(+new Date-t)/4;await new Promise((e=>setTimeout(e,n)))}}async estimatePoseOnImage(e){const t=await this.ensureBodyModelLoaded();return await t.estimateSinglePose(e,{flipHorizontal:!1})}async ensureBodyModelLoaded(){return this.bodyModel??=await wm(),this.bodyModel}videoToggle(e){if(e===xm)return this.runtime.ioDevices.video.disableVideo();this.runtime.ioDevices.video.enableVideo(),this.runtime.ioDevices.video.mirror=e===Nm}setVideoTransparency(e){const t=Math.max(Math.min(e,100),0);this.runtime.ioDevices.video.setPreviewGhost(t)}defineBlocks(){this.firstInstall&&(this.globalVideoState=Nm,this.globalVideoTransparency=50,this.projectStarted(),this.firstInstall=!1,this.bodyModel=null);const e=[{text:"nose",value:"nose"},{text:"right eye",value:"leftEye"},{text:"left eye",value:"rightEye"},{text:"right ear",value:"leftEar"},{text:"left ear",value:"rightEar"},{text:"right shoulder",value:"leftShoulder"},{text:"left shoulder",value:"rightShoulder"},{text:"right elbow",value:"leftElbow"},{text:"left elbow",value:"rightElbow"},{text:"right wrist",value:"leftWrist"},{text:"left wrist",value:"rightWrist"},{text:"right hip",value:"leftHip"},{text:"left hip",value:"rightHip"},{text:"right knee",value:"leftKnee"},{text:"left knee",value:"rightKnee"},{text:"right ankle",value:"leftAnkle"},{text:"left ankle",value:"rightAnkle"}],n=e.map((e=>e.value));return{goToBodyPartBlock:()=>({type:t.BlockType.Command,arg:{type:t.ArgumentType.String,options:{acceptsReporters:!0,items:e,handler:e=>n.includes(e)?e:"nose"}},text:e=>`go to ${e}`,operation:(e,t)=>{if(this.hasPose()){const{x:n,y:r}=this.tfCoordsToScratch(this.poseState.keypoints.find((t=>t.part===e)).position);t.target.setXY(n,r,!1)}}}),videoToggleBlock:()=>({type:t.BlockType.Command,arg:{type:t.ArgumentType.Number,options:{acceptsReporters:!0,items:[{text:"off",value:xm},{text:"on",value:Nm},{text:"on and flipped",value:vm}],handler:e=>Math.min(Math.max(e,xm),vm)}},text:e=>`turn video ${e}`,operation:e=>{this.videoToggle(e)}}),setVideoTransparencyBlock:()=>({type:t.BlockType.Command,arg:{type:t.ArgumentType.Number,defaultValue:50},text:e=>`set video transparency to ${e}`,operation:e=>{this.setVideoTransparency(e)}})}}}return e.Extension=Sm,Object.defineProperty(e,"__esModule",{value:!0}),e}({},ExtensionFramework);//# sourceMappingURL=poseBody.js.map
