var ExtensionFramework=function(e){"use strict";const t={Boolean:"Boolean",Button:"button",Command:"command",Conditional:"conditional",Event:"event",Hat:"hat",Loop:"loop",Reporter:"reporter"},r={Angle:"angle",Boolean:"Boolean",Color:"color",Number:"number",String:"string",Matrix:"matrix",Note:"note",Image:"image",Custom:"custom"},n={BackgroundLayer:"background",VideoLayer:"video",PenLayer:"pen",SpriteLayer:"sprite"},o=[n.VideoLayer,n.SpriteLayer,n.BackgroundLayer,n.PenLayer],i={"Аҧсшәа":"ab","العربية":"ar","አማርኛ":"am",Azeri:"az",Bahasa_Indonesia:"id","Беларуская":"be","Български":"bg","Català":"ca","Česky":"cs",Cymraeg:"cy",Dansk:"da",Deutsch:"de",Eesti:"et","Ελληνικά":"el",English:"en","Español":"es","Español_Latinoamericano":"es-419",Euskara:"eu","فارسی":"fa","Français":"fr",Gaeilge:"ga","Gàidhlig":"gd",Galego:"gl","한국어":"ko","עִבְרִית":"he",Hrvatski:"hr",isiZulu:"zu","Íslenska":"is",Italiano:"it","ქართული_ენა":"ka",Kiswahili:"sw","Kreyòl_ayisyen":"ht","کوردیی_ناوەندی":"ckb","Latviešu":"lv","Lietuvių":"lt",Magyar:"hu","Māori":"mi",Nederlands:"nl","日本語":"ja","にほんご":"ja-Hira","Norsk_Bokmål":"nb",Norsk_Nynorsk:"nn","Oʻzbekcha":"uz","ไทย":"th","ភាសាខ្មែរ":"km",Polski:"pl","Português":"pt","Português_Brasileiro":"pt-br",Rapa_Nui:"rap","Română":"ro","Русский":"ru","Српски":"sr","Slovenčina":"sk","Slovenščina":"sl",Suomi:"fi",Svenska:"sv","Tiếng_Việt":"vi","Türkçe":"tr","Українська":"uk","简体中文":"zh-cn","繁體中文":"zh-tw"},a=Object.keys(i);function s(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]])}return r}function c(e,t,r,n,o,i){function a(e){if(void 0!==e&&"function"!=typeof e)throw new TypeError("Function expected");return e}for(var s,c=n.kind,l="getter"===c?"get":"setter"===c?"set":"value",u=!t&&e?n.static?e:e.prototype:null,d=t||(u?Object.getOwnPropertyDescriptor(u,n.name):{}),m=!1,p=r.length-1;p>=0;p--){var h={};for(var g in n)h[g]="access"===g?{}:n[g];for(var g in n.access)h.access[g]=n.access[g];h.addInitializer=function(e){if(m)throw new TypeError("Cannot add initializers after decoration has completed");i.push(a(e||null))};var f=(0,r[p])("accessor"===c?{get:d.get,set:d.set}:d[l],h);if("accessor"===c){if(void 0===f)continue;if(null===f||"object"!=typeof f)throw new TypeError("Object expected");(s=a(f.get))&&(d.get=s),(s=a(f.set))&&(d.set=s),(s=a(f.init))&&o.push(s)}else(s=a(f))&&("field"===c?o.push(s):d[l]=s)}u&&Object.defineProperty(u,n.name,d),m=!0}function l(e,t,r){for(var n=arguments.length>2,o=0;o<t.length;o++)r=n?t[o].call(e,r):t[o].call(e);return n?r:void 0}function u(e,t,r,n){return new(r||(r=Promise))((function(o,i){function a(e){try{c(n.next(e))}catch(e){i(e)}}function s(e){try{c(n.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(a,s)}c((n=n.apply(e,t||[])).next())}))}function d(e,t=100){return u(this,void 0,void 0,(function*(){let r,n=e();for(;!n;)yield new Promise((e=>{clearTimeout(r),r=setTimeout(e,t)})),n=e();return clearTimeout(r),n}))}const m=e=>"string"==typeof e||e instanceof String,p=e=>"[object Function]"===Object.prototype.toString.call(e)||"function"==typeof e||e instanceof Function,h=e=>e!==Object(e),g=e=>e,f=e=>u(void 0,void 0,void 0,(function*(){const t=new Promise(((t,r)=>{const n=document.createElement("script");n.onload=t,n.onerror=r,n.async=!0,n.src=e,document.body.appendChild(n)}));yield t})),y=(e,t,...r)=>e.call(t,...r),v=(e,t,r)=>(e[t]=r,e),b=(...e)=>{const{size:t}=e.reduce(((e,{length:t})=>e.add(t)),new Set);if(1!==t)throw new Error("Zip failed because collections weren't equal length")};const w=e=>{if("node"!==("undefined"==typeof window?"node":"browser"))return null;const t=`Bundle Time Event: ${e}`,r=()=>{var e;return null!==(e=global[t])&&void 0!==e||(global[t]={}),global[t]};return{registerCallback:e=>{const n=Symbol(t);return r()[n]=e,()=>{var e;return null===(e=r())||void 0===e||delete e[n]}},fire:e=>{var t,n;const o=Object.getOwnPropertySymbols(r());for(const i of o)null===(n=(t=r())[i])||void 0===n||n.call(t,e,(()=>{var e;return null===(e=r())||void 0===e||delete e[i]}))}}},E="OPEN_UI_FROM_EXTENSION",T="REGISTER_BUTTON_CALLBACK_FROM_EXTENSION",I="internal_IsCustomArgument",x="isCustomArgumentHack",O="dropdownState",S="dropdownEntry",k="init",N="open",R="close",A=(e,t)=>e.emit(E,t),C=(e,t,r)=>{e.emit(T,t),e.on(t,r)};class _{constructor(e){this.root=e}get(...e){return`var(--${this.root}-${e.join("-")})`}primary(...e){return this.get("primary",...e)}secondary(...e){return this.get("secondary",...e)}tertiary(...e){return this.get("tertiary",...e)}transparent(...e){return this.get("transparent",...e)}light(...e){return this.get("light",...e)}}const D=new _("ui"),B=new _("text"),L=new _("motion"),M=new _("red"),P=new _("sound"),j=new _("control"),$=new _("data"),U=new _("pen"),F=new _("error"),V=new _("extensions"),G=new _("extensions"),H={ui:{primary:D.primary(),secondary:D.secondary(),tertiary:D.tertiary(),modalOverlay:D.get("modal","overlay"),white:D.get("white"),whiteDim:D.get("white","dim"),whiteTransparent:D.get("white","transparent"),transparent:D.transparent(),blackTransparent:D.get("black","transparent")},text:{primary:B.primary(),primaryTransparent:B.transparent()},motion:{primary:L.primary(),tertiary:L.tertiary(),transparent:L.get("transparent"),lightTansparent:L.light("transparent")},red:{primary:M.primary(),tertiary:M.tertiary()},sound:{primary:P.primary(),tertiary:P.tertiary()},control:{primary:j.primary()},data:{primary:$.primary()},pen:{primary:U.primary(),transparent:U.transparent()},error:{primary:F.primary(),light:F.light(),transparent:F.transparent()},extensions:{primary:V.primary(),tertiary:V.tertiary(),light:V.light(),transparent:V.transparent()},drop:{highlight:G.get("highlight")}},z=new RegExp("^[a-z0-9]+$","i"),K=new RegExp("[^a-z0-9]+","gi"),W=["prg","prg".split("").reverse().join("")],J=new RegExp(`${W[0]}([0-9]+)${W[1]}`,"g"),q=(e,t,r)=>e.replaceAll(t,r),X="customSaveDataPerExtension";function Z(e){return class extends e{constructor(){super(...arguments),this.saveDataHandler=void 0}save(e,t){var r;const{saveDataHandler:n,id:o}=this,i=this.supports("customArguments")?this.customArgumentManager:null,a=null!==(r=null==n?void 0:n.hooks.onSave(this))&&void 0!==r?r:{};if(null==i||i.saveTo(a),0===Object.keys(a).length)return;const s=e[X];s?s[o]=a:e[X]={[o]:a},t.add(o)}load(e){if(!e)return;const{saveDataHandler:t,id:r}=this,n=X in e?e[X][r]:null;n&&(null==t||t.hooks.onLoad(this,n),this.supports("customArguments")&&this.getOrCreateCustomArgumentManager().loadFrom(n))}}}class Q{static get RGB_BLACK(){return{r:0,g:0,b:0}}static get RGB_WHITE(){return{r:255,g:255,b:255}}static decimalToHex(e){e<0&&(e+=16777216);let t=Number(e).toString(16);return t=`#${"000000".substr(0,6-t.length)}${t}`,t}static decimalToRgb(e){const t=e>>24&255;return{r:e>>16&255,g:e>>8&255,b:255&e,a:t>0?t:255}}static hexToRgb(e){e=e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,((e,t,r,n)=>t+t+r+r+n+n));const t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:null}static rgbToHex(e){return Q.decimalToHex(Q.rgbToDecimal(e))}static rgbToDecimal(e){return(e.r<<16)+(e.g<<8)+e.b}static hexToDecimal(e){return Q.rgbToDecimal(Q.hexToRgb(e))}static hsvToRgb(e){let t=e.h%360;t<0&&(t+=360);const r=Math.max(0,Math.min(e.s,1)),n=Math.max(0,Math.min(e.v,1)),o=Math.floor(t/60),i=t/60-o,a=n*(1-r),s=n*(1-r*i),c=n*(1-r*(1-i));let l,u,d;switch(o){default:case 0:l=n,u=c,d=a;break;case 1:l=s,u=n,d=a;break;case 2:l=a,u=n,d=c;break;case 3:l=a,u=s,d=n;break;case 4:l=c,u=a,d=n;break;case 5:l=n,u=a,d=s}return{r:Math.floor(255*l),g:Math.floor(255*u),b:Math.floor(255*d)}}static rgbToHsv(e){const t=e.r/255,r=e.g/255,n=e.b/255,o=Math.min(Math.min(t,r),n),i=Math.max(Math.max(t,r),n);let a=0,s=0;if(o!==i){a=60*((t===o?3:r===o?5:1)-(t===o?r-n:r===o?n-t:t-r)/(i-o))%360,s=(i-o)/i}return{h:a,s:s,v:i}}static mixRgb(e,t,r){if(r<=0)return e;if(r>=1)return t;const n=1-r;return{r:n*e.r+r*t.r,g:n*e.g+r*t.g,b:n*e.b+r*t.b}}}const Y=Q;class ee{static toNumber(e){if("number"==typeof e)return Number.isNaN(e)?0:e;const t=Number(e);return Number.isNaN(t)?0:t}static toBoolean(e){return"boolean"==typeof e?e:"string"==typeof e?""!==e&&"0"!==e&&"false"!==e.toLowerCase():Boolean(e)}static toString(e){return String(e)}static toRgbColorList(e){const t=ee.toRgbColorObject(e);return[t.r,t.g,t.b]}static toRgbColorObject(e){let t;return"string"==typeof e&&"#"===e.substring(0,1)?(t=Y.hexToRgb(e),t||(t={r:0,g:0,b:0,a:255})):t=Y.decimalToRgb(ee.toNumber(e)),t}static isWhiteSpace(e){return null===e||"string"==typeof e&&0===e.trim().length}static compare(e,t){let r=Number(e),n=Number(t);if(0===r&&ee.isWhiteSpace(e)?r=NaN:0===n&&ee.isWhiteSpace(t)&&(n=NaN),isNaN(r)||isNaN(n)){const r=String(e).toLowerCase(),n=String(t).toLowerCase();return r<n?-1:r>n?1:0}return r===1/0&&n===1/0||r===-1/0&&n===-1/0?0:r-n}static isInt(e){return"number"==typeof e?!!isNaN(e)||e===parseInt(e,10):"boolean"==typeof e||"string"==typeof e&&e.indexOf(".")<0}static get LIST_INVALID(){return"INVALID"}static get LIST_ALL(){return"ALL"}static toListIndex(e,t,r){if("number"!=typeof e){if("all"===e)return r?ee.LIST_ALL:ee.LIST_INVALID;if("last"===e)return t>0?t:ee.LIST_INVALID;if("random"===e||"any"===e)return t>0?1+Math.floor(Math.random()*t):ee.LIST_INVALID}return(e=Math.floor(ee.toNumber(e)))<1||e>t?ee.LIST_INVALID:e}}var te=ee;const re=(e,t)=>{switch(e){case r.String:return`${t}`;case r.Number:return parseFloat(t);case r.Boolean:return JSON.parse(null!=t&&t);case r.Note:case r.Angle:return parseInt(t);case r.Matrix:return oe(t);case r.Color:return te.toRgbColorObject(t);default:throw new Error(`Method not implemented for value of ${t} and type ${e}`)}},ne=e=>1===parseInt(e),oe=e=>{if(25!==e.length)return new Array(5).fill(new Array(5).fill(!1));return e.split("").map(ne).reduce(((e,t,r)=>{const n=Math.floor(r/5);return 0===r%5?e[n]=[t]:e[n].push(t),e}),new Array(5))};class ie{constructor(){this.map=new Map,this.pending=null}clearPending(){this.pending=null}setPending(e){this.pending=e}add(e){const t=ie.GetIdentifier();return this.map.set(t,e),this.clearPending(),t}insert(e,t){return this.map.set(e,t),this.clearPending(),e}request(){this.clearPending();const e=ie.GetIdentifier();return[e,t=>this.setPending({id:e,entry:t})]}tryResolve(){if(!this.pending)return;const{pending:{entry:e,id:t}}=this;return this.map.set(t,e),this.clearPending(),{entry:e,id:t}}getCurrentEntries(){return Array.from(this.map.entries()).filter((([e,t])=>null!==t)).map((([e,{text:t}])=>[t,e]))}getEntry(e){return this.map.get(e)}requiresSave(){this.map.size}saveTo(e){const t=Array.from(this.map.entries()).filter((([e,t])=>null!==t)).map((([e,t])=>({id:e,entry:t})));0!==t.length&&(e[ie.SaveKey]=t)}loadFrom(e){var t;null===(t=e[ie.SaveKey])||void 0===t||t.forEach((({id:e,entry:t})=>{this.map.set(e,t)}))}purgeStaleIDs(){}}ie.SaveKey="internal_customArgumentsSaveData",ie.IsIdentifier=e=>e.startsWith(ie.IdentifierPrefix),ie.GetIdentifier=()=>ie.IdentifierPrefix+(new Date).getTime().toString(),ie.IdentifierPrefix="__customArg__";const ae=(e,t)=>u(void 0,void 0,void 0,(function*(){const r="blocklyDropDownContent",n=document.getElementsByClassName(r);if(1!==n.length)return console.error(`Uh oh! Expected 1 element with class '${r}', but found ${n.length}`);const[o]=n,i=yield d((()=>o.children[0]));new e({target:o,anchor:i,props:t}),se(i)})),se=e=>{[["goog-menuitem goog-option",e=>{e.margin="auto",e.paddingLeft=e.paddingRight="0px"}],["goog-menuitem-content",e=>e.textAlign="center"]].forEach((([t,r])=>{const n=e.getElementsByClassName(t);console.assert(1===n.length,`Incorrect number of elements found with class: ${t}`),r(n[0].style)}))};class ce{makeImage(){return new Image}makeCanvas(){return document.createElement("canvas")}resize(e,t,r){const n=this.makeCanvas();n.width=t,n.height=e.height;let o=n.getContext("2d");o.imageSmoothingEnabled=!1,o.drawImage(e,0,0,n.width,n.height);const i=this.makeCanvas();return i.width=t,i.height=r,o=i.getContext("2d"),o.imageSmoothingEnabled=!1,o.drawImage(n,0,0,i.width,i.height),i}convertResolution1Bitmap(e,t){const r=new Image;r.src=e,r.onload=()=>{t(null,this.resize(r,2*r.width,2*r.height).toDataURL())},r.onerror=()=>{t("Image load failed")}}getResizedWidthHeight(e,t){const r=480,n=360;if(e<=r&&t<=n)return{width:2*e,height:2*t};if(e<=960&&t<=720)return{width:e,height:t};const o=e/t;return o>=1.3333333333333333?{width:960,height:960/o}:{width:720*o,height:720}}importBitmap(e){return new Promise(((t,r)=>{const n=this.makeImage();n.src=e,n.onload=()=>{const r=this.getResizedWidthHeight(n.width,n.height);if(r.width===n.width&&r.height===n.height)t(this.convertDataURIToBinary(e));else{const e=this.resize(n,r.width,r.height).toDataURL();t(this.convertDataURIToBinary(e))}},n.onerror=()=>{r("Image load failed")}}))}convertDataURIToBinary(e){const t=";base64,",r=e.indexOf(t)+t.length,n=e.substring(r),o=window.atob(n),i=o.length,a=new Uint8Array(new ArrayBuffer(i));for(let e=0;e<i;e++)a[e]=o.charCodeAt(e);return a}}let le,ue;const de=[],me=(e,...t)=>{var r;return null===(r=de.pop())||void 0===r||r(t),e};let pe;const he={DrowpdownOpen:N,DropdownClose:R,Init:k};const ge={isSimpleStatic:e=>Array.isArray(e),isSimpleDynamic:e=>p(e),isStaticWithReporters:e=>"items"in e,isDynamicWithReporters:e=>"getItems"in e},fe=e=>`${e}`,ye=e=>h(e)?`${e}`:Object.assign(Object.assign({},e),{value:`${e.value}`}),ve=(e,t)=>({acceptReporters:t,items:e.map((e=>e)).map(ye)}),be=(e,t,r)=>t?e.menu=((e,t)=>{const r=t.indexOf(e),n=r>=0?r:t.push(e)-1;return`${fe(n)}`})(t,r):null,we=(e,t,r)=>e,Ee=e=>e.map((e=>{if(h(e))return g;if(e.type===r.Image)return g;const{options:t}=e;return(e=>e&&"handler"in e)(t)?t.handler:g})),Te=e=>`${e}`,Ie=e=>h(e)?e:e.type,xe=e=>{var t,r;const n="args";return"arg"in e&&e.arg?[e.arg]:n in e&&(null!==(r=null===(t=e[n])||void 0===t?void 0:t.length)&&void 0!==r?r:0)>0?e.args:[]},Oe=(e,t,r,n)=>{void 0!==n&&(e.defaultValue=((e,t,r)=>m(e)?we(e):e)(n))},Se=e=>!m(e)&&e.type===r.Image,ke=(e,t,r)=>{if(!r||0===r.length)return t;if(!(e=>!m(e))(t))return we(t);const n=t,o=r.map(((e,t)=>`[${Te(t)}]`));return we(n(...o))},Ne=e=>`internal_${e}`,Re="ERROR: This argument represents an inline image and should not be accessed.",Ae=(e,t,n)=>e.supports("customArguments")?function(o,i){const a=n.map((({name:t,type:n,handler:i})=>{if(n===r.Image)return Re;const a=o[t];if(n===r.Custom){const t=m(a)&&ie.IsIdentifier(a)?this.customArgumentManager.getEntry(a).value:a;return i.call(e,t)}return re(n,i.call(e,a))}));return t.call(e,...a,i)}:function(o,i){const a=n.map((({name:t,type:n,handler:i})=>n===r.Image?Re:re(n,i.call(e,o[t]))));return t.call(e,...a,i)};function Ce(e){return class extends e{constructor(){super(...arguments),this.blockMap=new Map,this.menus=[]}pushBlock(e,t,r){if(this.blockMap.has(e))throw new Error(`Attempt to push block with opcode ${e}, but it was already set. This is assumed to be a mistake.`);this.blockMap.set(e,{definition:t,operation:r})}getInfo(){if(!this.info){const{id:e,name:t,blockIconURI:r}=this,n=Array.from(this.blockMap.entries()).map((e=>this.convertToInfo(e))),o=this.blockColor,i=this.menuColor,a=this.menuSelectColor;this.info={id:e,blocks:n,name:t,blockIconURI:r,menus:this.collectMenus(),color1:o,color2:i,color3:a}}return this.info}convertToInfo(e){const[r,n]=e,{definition:o,operation:i}=n,a=(e=>p(e))(o)?y(o,this,this):o,{type:s,text:c}=a,l=xe(a),{id:u,runtime:d,menus:m}=this,g=ke(0,c,l),f=((e,t,r)=>{if(t&&0!==t.length)return Object.fromEntries(t.map(((t,n)=>{if(Se(t))return Object.assign(Object.assign({},t),{dataURI:t.uri});const o={};if(o.type=Ie(t),h(t))return o;const{defaultValue:i,options:a}=t;return Oe(o,e,n,i),be(o,a,r),o})).reduce(((e,t,r)=>e.set(Te(r),t)),new Map))})(r,l,m),v={opcode:r,text:g,blockType:s,arguments:f};if(s===t.Button){const e=((e,t)=>`${e}_${t}`)(u,r);C(d,e,i.bind(this)),v.func=e}else{this[Ne(r)]=Ae(this,i,((e,t)=>{const r=e.map(Ie),n=Ee(e);return null!=t||(t=r.map(((e,t)=>Te(t)))),b(r,n,t),r.map(((e,r)=>({type:e,name:t[r],handler:n[r]})))})(l))}return v}collectMenus(){const{isSimpleStatic:e,isSimpleDynamic:t,isStaticWithReporters:r,isDynamicWithReporters:n}=ge;return Object.fromEntries(this.menus.map(((o,i)=>{if(e(o))return ve(o,!1);if(t(o))return this.registerDynamicMenu(o,!1,i);if(r(o))return ve(o.items,!0);if(n(o))return this.registerDynamicMenu(o.getItems,!0,i);throw new Error("Unable to process menu")})).reduce(((e,t,r)=>e.set(fe(r),t)),new Map))}registerDynamicMenu(e,t,r){const n=`internal_dynamic_${r}`;return this[n]=()=>e.call(this).map((e=>e)).map(ye),{acceptReporters:t,items:n}}}}const _e=w("blocks"),De="__getter__",Be="__setter__";function Le(e){return function(t,r){const n=t.name,o=Ne(n);r.addInitializer((function(){this.pushBlock(n,e,t)}));if(!p(e)){const{type:t}=e;null==_e||_e.fire({methodName:n,args:xe(e).map((e=>m(e)?e:e.type)),returns:"command"===t?"void":"Boolean"===t?"bool":"any",scratchType:e.type})}return function(){return this[o].call(this,...arguments)}}}const Me=e=>t=>r=>{const{operation:n,argumentMethods:o}=p(t)?t.call(r,r):t;return o&&je(e,o,r),Object.assign(Object.assign({},e),{operation:n})},Pe=e=>(...t)=>{if(0===t.length||!t[0])return Le(e);const r=t[0];return Le((t=>{const{argumentMethods:n}=p(r)?r.call(t,t):r;return je(e,n,t),e}))},je=(e,t,r)=>{const n=e.args?e.args:e.arg?[e.arg]:[];Object.entries(t).map((([e,{handler:t,getItems:r}])=>({arg:n[parseInt(e)],methods:{handler:t,getItems:r}}))).forEach((({arg:e,methods:t})=>Object.entries(t).filter((([e,t])=>void 0!==t)).map((([e,t])=>[e,t.bind(r)])).forEach((([t,r])=>$e(e,t,r)))))},$e=(e,t,r)=>{p(e.options)&&(e.options=r),e.options[t]=r},Ue=e=>{if(m(e))throw new Error(`Block defined as string, unexpected! ${e}`);return e},Fe=e=>Array.from(e.blocks.map(Ue).reduce(((t,r)=>((e,t,r)=>{const{opcode:n,arguments:o,blockType:i}=t,{text:a,orderedNames:c}=Ve(t);if(!o)return e.set(n,{type:i,text:a});const l=Object.entries(null!=o?o:{}).map((e=>{var[t,n]=e,{menu:o}=n,i=s(n,["menu"]);return Object.assign({options:Ke(r,o),name:t,menu:o},i)})).sort((({name:e},{name:t})=>c.indexOf(e)<c.indexOf(t)?-1:1)).map((e=>s(e,["name"]))),{length:u}=l;return u>=2?e.set(n,{type:i,text:a,args:l}):e.set(n,{type:i,text:a,arg:l[0]})})(t,r,e)),new Map).entries()),Ve=({arguments:e,text:t})=>{const r="Error: This should have been overridden by legacy support";if(!e)return{orderedNames:null,text:r};const n=Object.keys(e).map((e=>({name:e,template:`[${e}]`}))).sort((({template:e},{template:r})=>t.indexOf(e)<t.indexOf(r)?-1:1));return 0===n.length?{orderedNames:null,text:r}:{orderedNames:n.map((({name:e})=>e)),text:()=>r}},Ge={getItems:()=>"Error: This should have been filled in."},He={handler:()=>"Error: This should have been filled in."},ze=e=>m(e),Ke=(e,t)=>{const r=t?e.menus[t]:void 0;if(!r)return;if(ze(r))return Ge.getItems;const{items:n,acceptReporters:o}=r;return ze(n)?o?Object.assign(Object.assign({acceptsReporters:o},He),Ge):Ge.getItems:o?Object.assign({acceptsReporters:o,items:[...n]},He):[...n]},We=(e,t)=>{if(m(e))throw new Error("Block was unexpectedly a string: "+e);return!!t.has(e.opcode)||(console.error(`Could not find legacy opcode ${e.opcode} within currently defined blocks`),!1)},Je=e=>{if(typeof e.legacy.menu!=typeof e.modern.menu)throw new Error("Menus don't match");return e},qe=e=>{if(ze(e))return e;if(ze(e.items))return e.items;throw new Error("Menu is not dynamic: "+e)};function Xe(e){return class extends e{constructor(){super(...arguments),this.__isLegacy=!0,this.orderArgumentNamesByBlock=new Map,this.getArgNames=e=>{const{opcode:t}=e;if(!this.orderArgumentNamesByBlock.has(t)){const{orderedNames:r}=Ve(e);this.orderArgumentNamesByBlock.set(t,r)}return this.orderArgumentNamesByBlock.get(t)}}getInfo(){if(!this.validatedInfo){const e=super.getInfo();this.validatedInfo=this.validateAndAttach(e)}return this.validatedInfo}validateAndAttach(e){var{id:t,blocks:r,menus:n}=e,o=s(e,["id","blocks","menus"]);const{id:i,blocks:a,menus:c}=this.getLegacyInfo(),l=[...r];if(t!==i)throw new Error(`ID mismatch! Legacy id: ${i} vs. current id: ${t}`);const u=l.reduce(((e,t,r)=>{var{opcode:n}=t,o=s(t,["opcode"]);return e.set(n,Object.assign(Object.assign({},o),{index:r}))}),new Map),d=this,m=a.map((e=>We(e,u)?e:void 0)).filter(Boolean).map((e=>{const{opcode:t,arguments:r}=e,{index:o,arguments:i}=u.get(t),a=this.getArgNames(e);if(!a)return{replaceAt:{index:o,block:e}};const s=this[Ne(t)];this[t]=((...[e,t])=>s.call(d,(e=>a.reduce(((t,r,n)=>v(t,n,e[r])),{}))(e),t)).bind(d);const l=a.map(((e,t)=>({legacy:r[e],modern:i[t]}))).map(Je).map((({legacy:{menu:e},modern:{menu:t}})=>({legacyName:e,modernName:t}))).filter((e=>e.legacyName&&e.modernName)).map((({legacyName:e,modernName:t})=>({legacyName:e,modernName:t,legacy:c[e],modern:n[t]}))).map((({legacy:e,modern:t,legacyName:r,modernName:n})=>ze(e)||ze(e.items)?{type:"dynamic",legacy:r,modern:n,methods:{legacy:qe(e),modern:qe(t)}}:{type:"static",legacy:r,modern:n}));return{menuUpdates:l,replaceAt:{index:o,block:e}}}));return m.forEach((({replaceAt:{index:e,block:t}})=>l[e]=t)),m.map((({menuUpdates:e})=>e)).flat().filter(Boolean).map((e=>{const{legacy:t}=e;if(t in n)throw new Error(`Somehow, there was already a menu called ${t}, which will cause issues in the next step.`);return e})).forEach((({type:e,legacy:t,methods:r})=>{n[t]=c[t],"dynamic"===e&&(d[r.legacy]=()=>d[r.modern]())})),Object.assign({id:t,blocks:l,menus:n},o)}}}const Ze=e=>"text"===e.nodeName,Qe={success:"#5ACA75",warning:"#FF8f39",error:"#db1f1f"},Ye={fill:"white","font-weight":"bold","font-size":"14pt","font-family":'"Helvetica Neue", Helvetica, Arial, sans-serif;'};const et=(e,t)=>{for(const r in t)e.setAttribute(r,`${t[r]}`)},tt=()=>[rt("rect"),rt("polygon"),rt("text")],rt=e=>document.createElementNS("http://www.w3.org/2000/svg",e),nt=(()=>{const e=5,t=14,r=10,n=26;return[[50,15],[100,100],[0,100]].map((([o,i])=>[o/e+r,i/t+n])).map((([e,t])=>`${e} ${t}`)).join(", ")})();const ot=e=>{const t=document.body.getElementsByClassName("blocklyFlyout");if(1!==t.length)return{error:"No top level element found."};for(const r of t[0].getElementsByClassName("blocklyFlyoutLabel categoryLabel"))for(const t of r.getElementsByClassName("blocklyFlyoutLabelText"))if(t.innerHTML===e&&"g"===r.nodeName&&Ze(t))return{container:r,title:t};return{error:"No title found matching given name"}},it={image:"image-data",canvas:"canvas"};function at(e){return class extends e{constructor(){super(...arguments),this.videoDimensions={width:480,height:360}}get video(){var e,t;return null!==(e=this.videoDevice)&&void 0!==e||(this.videoDevice=null===(t=this.runtime.ioDevices)||void 0===t?void 0:t.video),this.videoDevice}getVideoFrame(e){var t;return null===(t=this.video)||void 0===t?void 0:t.getFrame({format:it[e]})}setVideoTransparency(e){var t;null===(t=this.video)||void 0===t||t.setPreviewGhost(e)}enableVideo(e=!0){this.video&&(this.video.enableVideo(),this.video.provider.mirror=e)}disableVideo(){var e;null===(e=this.video)||void 0===e||e.disableVideo()}}}const st={customArguments:function(e){class t extends(me(e,Z)){constructor(){super(...arguments),this.makeCustomArgument=({component:e,initial:t,acceptReportersHandler:n})=>{var o;null!==(o=this.argumentManager)&&void 0!==o||(this.argumentManager=new ie);const i=this.argumentManager.add(t),a=()=>[{text:I,value:JSON.stringify({component:e,id:i})}];return{type:r.Custom,defaultValue:i,options:void 0===n?a:{acceptsReports:!0,getItems:a,handler:n}}},this.argumentManager=null}get customArgumentManager(){return this.argumentManager}getOrCreateCustomArgumentManager(){var e;return null!==(e=this.argumentManager)&&void 0!==e||(this.argumentManager=new ie),this.argumentManager}[x](e){if(1!==e.length)return!1;const t=e[0];if("object"!=typeof t)return!1;const{text:r}=t;return r===I}processCustomArgumentHack(e,[{value:t}],r){var n;const{id:o,customArgumentManager:i}=this,{component:a,id:s}=JSON.parse(t);switch(e[O]){case he.Init:return i.getCurrentEntries();case he.DropdownClose:{const e=i.tryResolve();return e?[[e.entry.text,e.id]]:i.getCurrentEntries()}case he.DrowpdownOpen:{const t=e[S],c=null!==(n=null==t?void 0:t.value)&&void 0!==n?n:s,l=i.getEntry(c),[u,d]=i.request();return ae(r(o,a),{setter:d,current:l,extension:this}),[["Apply",u]]}}throw new Error("Error during processing -- Context:"+he)}}return t},ui:function(e){return class extends e{openUI(e,t){const{id:r,name:n,runtime:o}=this;A(o,{id:r,name:n,component:e.replace(".svelte",""),label:t})}}},customSaveData:Z,video:at,drawable:function(e){return class extends e{createDrawable(e){var t;null!==(t=this.renderer)&&void 0!==t||(this.renderer=this.runtime.renderer);const{renderer:r}=this;if(!r)return null;const o=r.createBitmapSkin(e,1),i=r.createDrawable(n.VideoLayer);r.updateDrawableSkinId(i,o);const a=e=>r.updateDrawableEffect(i,"ghost",e),s=(e=!0)=>r.updateDrawableVisible(i,e);return a(0),s(!0),{setTransparency:a,setVisible:s,update:e=>r.updateBitmapSkin(o,e,1),destroy:()=>{s(!1),r.destroyDrawable(i,n.VideoLayer),r.destroySkin(o)}}}}},addCostumes:function(e){return class extends e{addCostume(e,t,r,n){return u(this,void 0,void 0,(function*(){if(!(e=>"renderer"in e)(e))return console.warn("Costume could not be added is the supplied target wasn't a rendered target");null!=n||(n=`${this.id}_generated_${Date.now()}`),null!=le||(le=new ce),null!=ue||(ue=(e=>{const t=document.body.appendChild(document.createElement("canvas")),r=({width:e,height:r})=>{t.width!==e&&(t.width=e),t.height!==r&&(t.height=r)};r(e),t.hidden=!0;const n=t.getContext("2d");return{getDataURL(e){const{width:o,height:i}=e;r(e),n.save(),n.clearRect(0,0,o,i),n.putImageData(e,0,0);const a=t.toDataURL("image/png");return n.restore(),a}}})(t));const{storage:o}=this.runtime,i=o.DataFormat.PNG,a=o.AssetType.ImageBitmap,s=yield le.importBitmap(ue.getDataURL(t)),c=o.createAsset(a,i,s,null,!0),{assetId:l}=c,u={name:n,dataFormat:i,asset:c,md5:`${l}.${i}`,assetId:l};yield this.runtime.addCostume(u);const{length:d}=e.getCostumes();e.addCostume(u,d),"add and set"===r&&e.setCostume(d)}))}}},legacySupport:Xe,setTransparencyBlock:function(e){let t=(()=>{var t;let r,n=[];return t=class extends(me(e,at)){setVideoTransparencyBlock(e){this.setVideoTransparency(e)}constructor(){super(...arguments),l(this,n)}},r=[Le({type:"command",text:e=>`Set video to ${e}% transparent`,arg:"number"})],c(t,null,r,{kind:"method",name:"setVideoTransparencyBlock",static:!1,private:!1,access:{has:e=>"setVideoTransparencyBlock"in e,get:e=>e.setVideoTransparencyBlock}},null,n),t})();return t},toggleVideoBlock:function(e){let t=(()=>{var t;let r,n=[];return t=class extends(me(e,at)){toggleVideoBlock(e){if("off"===e)return this.disableVideo();this.enableVideo("on"===e)}constructor(){super(...arguments),l(this,n)}},r=[Le({type:"command",text:e=>`Set video feed to ${e}`,arg:{type:"string",options:["on","off","on (flipped)"]}})],c(t,null,r,{kind:"method",name:"toggleVideoBlock",static:!1,private:!1,access:{has:e=>"toggleVideoBlock"in e,get:e=>e.toggleVideoBlock}},null,n),t})();return t},appInventor:function(e){return class extends e{get withinAppInventor(){return!1}}},indicators:function(e){return class extends e{indicate({position:e,msg:t,type:r}){return u(this,void 0,void 0,(function*(){const n="category"===e?ot(this.name):{error:"Unsupported indicator position"};if("error"in n)throw new Error(n.error);const{container:o}=n,i=yield function(e,t,r){return u(this,void 0,void 0,(function*(){const n=tt(),[o,i,a]=n,s=Qe[r];et(i,{points:nt,fill:s}),et(a,{x:6,y:55}),et(a,Ye),a.innerHTML=t,n.forEach((t=>e.appendChild(t))),yield Promise.resolve();const{width:c,height:l}=a.getBBox();return et(o,{x:0,width:c+12,height:l+12,y:55-l,fill:s,rx:5}),{close(){n.forEach((t=>e.removeChild(t)))}}}))}(o,t,r);return i}))}}}};class ct{internal_init(){return u(this,void 0,void 0,(function*(){const e=this.runtime;return yield Promise.resolve(this.init({runtime:e,get extensionManager(){return e.getExtensionManager()}}))}))}constructor(e,t,r,n,o,i,a){this.runtime=e,this.name=t,this.id=r,this.blockIconURI=n,this.blockColor=o,this.menuColor=i,this.menuSelectColor=a}}const lt=new Map;class ut extends ct{constructor(e){super(...arguments),lt.set(this.id,this)}}function dt(e,t){return class extends e{supports(e){return t.includes(e)}}}const mt=w("extension"),pt=(e,...t)=>{e&&(null==mt||mt.fire({details:e,addOns:t}));const r=Ce(dt(ut,t));if(!t)return r;const{Result:n,allSupported:o}=ht(r,t);return dt(n,Array.from(o))},ht=(e,t,r=new Set)=>{const n=t.filter((e=>!r.has(e))).map((e=>(r.add(e),e))).map((e=>st[e])).reduce(((e,t)=>{const{dependencies:n,MixedIn:o}=(e=>{let t;null!=pe||(pe=Object.entries(st).reduce(((e,[t,r])=>e.set(r,t)),new Map)),de.push((e=>{e.map((e=>e)).forEach((e=>{if(!pe.has(e))throw new Error("Unkown mixin dependency! "+e);null!=t||(t=[]),t.push(pe.get(e))}))}));const r=e();return{dependencies:t,MixedIn:r}})((()=>t(e)));return n?ht(o,n,r).Result:o}),e);return{Result:n,allSupported:r}};class gt extends(pt(void 0,"ui","customSaveData","customArguments")){internal_init(){const e=Object.create(null,{internal_init:{get:()=>super.internal_init}});return u(this,void 0,void 0,(function*(){yield e.internal_init.call(this);const t=this.defineBlocks(),r=this;for(const e in t){this.validateOpcode(e);const n=t[e],{operation:o,text:i,arg:a,args:s,type:c}=p(n)?n.call(this,this):n;this.pushBlock(e,a?{text:i,type:c,arg:a}:s?{text:i,type:c,args:s}:{text:i,type:c},o);const l=Ne(e);this[e]=function(){return r[l].call(r,...arguments)}}}))}validateOpcode(e){if(!(e in this))return;throw new Error(`The Extension has a member defined as '${e}', but that name should be reserved for the opcode of the block with the same name. Please rename your member, and attach the "validateGenericExtension" decorator to your class so that this can be an error in your IDE and not at runtime.`)}}return e.ArgumentType=r,e.AuxiliaryExtensionInfo="AuxiliaryExtensionInfo",e.BlockType=t,e.Branch={Exit:0,Enter:1,First:1,Second:2,Third:3,Fourth:4,Fifth:5,Sixth:6,Seventh:7},e.ConstructableExtension=ct,e.CustomArgumentManager=ie,e.Extension=gt,e.ExtensionBase=ut,e.FrameworkID="ExtensionFramework",e.Language=i,e.LanguageKeys=a,e.LayerGroups=o,e.RuntimeEvent={ScriptGlowOn:"SCRIPT_GLOW_ON",ScriptGlowOff:"SCRIPT_GLOW_OFF",BlockGlowOn:"BLOCK_GLOW_ON",BlockGlowOff:"BLOCK_GLOW_OFF",HasCloudDataUpdate:"HAS_CLOUD_DATA_UPDATE",TurboModeOn:"TURBO_MODE_ON",TurboModeOff:"TURBO_MODE_OFF",RecordingOn:"RECORDING_ON",RecordingOff:"RECORDING_OFF",ProjectStart:"PROJECT_START",ProjectRunStart:"PROJECT_RUN_START",ProjectRunStop:"PROJECT_RUN_STOP",ProjectStopAll:"PROJECT_STOP_ALL",StopForTarget:"STOP_FOR_TARGET",VisualReport:"VISUAL_REPORT",ProjectLoaded:"PROJECT_LOADED",ProjectChanged:"PROJECT_CHANGED",ToolboxExtensionsNeedUpdate:"TOOLBOX_EXTENSIONS_NEED_UPDATE",TargetsUpdate:"TARGETS_UPDATE",MonitorsUpdate:"MONITORS_UPDATE",BlockDragUpdate:"BLOCK_DRAG_UPDATE",BlockDragEnd:"BLOCK_DRAG_END",ExtensionAdded:"EXTENSION_ADDED",ExtensionFieldAdded:"EXTENSION_FIELD_ADDED",PeripheralListUpdate:"PERIPHERAL_LIST_UPDATE",PeripheralConnected:"PERIPHERAL_CONNECTED",PeripheralDisconnected:"PERIPHERAL_DISCONNECTED",PeripheralRequestError:"PERIPHERAL_REQUEST_ERROR",PeripheralConnectionLostError:"PERIPHERAL_CONNECTION_LOST_ERROR",PeripheralScanTimeout:"PERIPHERAL_SCAN_TIMEOUT",MicListening:"MIC_LISTENING",BlocksInfoUpdate:"BLOCKSINFO_UPDATE",RuntimeStarted:"RUNTIME_STARTED",RuntimeDisposed:"RUNTIME_DISPOSED",BlocksNeedUpdate:"BLOCKS_NEED_UPDATE"},e.SaveDataHandler=class{constructor(e){this.hooks=e}},e.ScratchBlocksConstants={OutputShapeHexagonal:1,OutputShapeRound:2,OutputShapeSquare:3},e.StageLayering=n,e.TargetType={Sprite:"sprite",Stage:"stage"},e.VariableType={Scalar:"",List:"list",BrooadcastMessage:"broadcast_msg"},e.activeClass=!0,e.assertSameLength=b,e.block=Le,e.blockBundleEvent=_e,e.blockIDKey="blockID",e.buttonBlock=function(e){return Le({text:e,type:t.Button})},e.castToType=re,e.closeDropdownState=R,e.color=H,e.copyTo=({target:e,source:t})=>{for(const r in t)r in e&&(e[r]=t[r])},e.customArgumentCheck=x,e.customArgumentFlag=I,e.decode=e=>[...[...e.matchAll(J)].reduce(((e,t)=>{const[r,n]=t;return e.set(r,String.fromCharCode(n))}),new Map)].reduce(((e,[t,r])=>q(e,t,r)),`${e}`),e.dropdownEntryFlag=S,e.dropdownStateFlag=O,e.encode=e=>{const t=[...e.matchAll(K)].reduce(((e,t)=>(t[0].split("").forEach((t=>e.add(t))),e)),new Set);return[...t].map((e=>({char:e,code:e.charCodeAt(0)}))).reduce(((e,{char:t,code:r})=>q(e,t,`${W[0]}${r}${W[1]}`)),`${e}`)},e.extension=pt,e.extensionBundleEvent=mt,e.extensionsMap=lt,e.fetchWithTimeout=function(e,t){return u(this,void 0,void 0,(function*(){const{timeout:r}=t,n=new AbortController,o=setTimeout((()=>n.abort()),r),i=yield fetch(e,Object.assign(Object.assign({},t),{signal:n.signal}));return clearTimeout(o),i}))},e.getAccessorPrefix=De,e.getTextFromMenuItem=e=>"object"==typeof e?e.text:e,e.getValueFromMenuItem=e=>"object"==typeof e?e.value:e,e.getterBlock=function(e){return function(t,r){const n=t.name.replace("get ",De),o=Ne(n);r.addInitializer((function(){this[n]=(e,t)=>this[o].call(this,null,t);const r=`Get ${e.name}`;this.pushBlock(n,{type:"reporter",text:r},t)})),null==_e||_e.fire({methodName:n,args:[],returns:e.type,scratchType:"reporter"})}},e.identity=g,e.initDropdownState=k,e.isDynamicMenu=ze,e.isFunction=p,e.isPrimitive=h,e.isString=m,e.isValidID=e=>z.test(e),e.legacy=(e,t)=>({for(){const t=Fe(e).map((([e,t])=>({key:e,definer:Me(t),decorator:Pe(t)}))),r=t.reduce(((e,{key:t,definer:r})=>(e[t]=r,e)),{}),n=t.reduce(((e,{key:t,decorator:r})=>(e[t]=r,e)),{}),o=()=>{throw new Error("This property is not meant to be accessed, and is instead solely for type inference / documentation purposes.")};return{legacyExtension:()=>(t,r)=>{class n extends(function(e,t){class r extends(Xe(e)){getLegacyInfo(){return t}}return r}(t,e)){constructor(){super(...arguments),this.originalClassName=r.name}}return n},legacyDefinition:r,legacyBlock:n,ReservedNames:{get Menus(){return o()},get Blocks(){return o()},get ArgumentNamesByBlock(){return o()}}}}}),e.loadExternalScript=(e,t,r)=>{const n=document.createElement("script");n.onload=t,n.onerror=null!=r?r:()=>{throw new Error(`Error loading endpoint: ${e}`)},n.src=e,n.async=!0,document.body.appendChild(n)},e.openDropdownState=N,e.openUI=A,e.openUIEvent=E,e.parseText=Ve,e.px=e=>`${e}px`,e.reactiveInvoke=(e,t,r)=>e[t](...r),e.reactiveSet=(e,t,r)=>{e[t]=r},e.registerButtonCallback=C,e.registerButtonCallbackEvent=T,e.renderToDropdown=ae,e.rgbToHex=e=>(e=>{e<0&&(e+=16777216);let t=Number(e).toString(16);return t=`#${"000000".substr(0,6-t.length)}${t}`,t})(function(e){return(e.r<<16)+(e.g<<8)+e.b}(e)),e.saveDataKey=X,e.set=v,e.setAccessorPrefix=Be,e.setterBlock=function(e){return function(r,n){const o=r.name.replace("set ",Be),i=Ne(o);n.addInitializer((function(){this[o]=(e,t)=>this[i].call(this,e,t);const n=e.type,a={type:t.Command,text:t=>`Set ${e.name} to ${t}`,arg:n};this.pushBlock(o,a,r)})),null==_e||_e.fire({methodName:o,args:[e.type],returns:"void",scratchType:"command"})}},e.splitOnCapitals=e=>e.split(/(?=[A-Z])/),e.tryCastToArgumentType=(e,t,r)=>{try{return re(e,t)}catch(e){return r(t)}},e.tryCreateBundleTimeEvent=w,e.typesafeCall=y,e.untilCondition=function(e,t=100){return u(this,void 0,void 0,(function*(){let r;for(;!e();)yield new Promise((e=>{clearTimeout(r),r=setTimeout(e,t)}));clearTimeout(r)}))},e.untilExternalGlobalVariableLoaded=(e,t)=>u(void 0,void 0,void 0,(function*(){return window[t]||(yield f(e)),window[t]})),e.untilExternalScriptLoaded=f,e.untilObject=d,e.untilReady=function(e,t=100){return u(this,void 0,void 0,(function*(){let r;for(;!e.ready;)yield new Promise((e=>{clearTimeout(r),r=setTimeout(e,t)}));clearTimeout(r)}))},e.untilTimePassed=function(e){return u(this,void 0,void 0,(function*(){let t;return yield new Promise((r=>t=setTimeout((()=>{clearTimeout(t),r()}),e)))}))},e.validGenericExtension=(...e)=>function(e,t){},Object.defineProperty(e,"__esModule",{value:!0}),e}({});//# sourceMappingURL=ExtensionFramework.js.map
