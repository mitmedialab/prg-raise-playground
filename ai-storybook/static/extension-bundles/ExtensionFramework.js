var ExtensionFramework=function(e){"use strict";const t={Boolean:"Boolean",Button:"button",Command:"command",Conditional:"conditional",Event:"event",Hat:"hat",Loop:"loop",Reporter:"reporter"},r={Angle:"angle",Boolean:"Boolean",Color:"color",Number:"number",String:"string",Matrix:"matrix",Note:"note",Image:"image",Custom:"custom"},n={BackgroundLayer:"background",VideoLayer:"video",PenLayer:"pen",SpriteLayer:"sprite"},o=[n.VideoLayer,n.SpriteLayer,n.BackgroundLayer,n.PenLayer],a={"Аҧсшәа":"ab","العربية":"ar","አማርኛ":"am",Azeri:"az",Bahasa_Indonesia:"id","Беларуская":"be","Български":"bg","Català":"ca","Česky":"cs",Cymraeg:"cy",Dansk:"da",Deutsch:"de",Eesti:"et","Ελληνικά":"el",English:"en","Español":"es","Español_Latinoamericano":"es-419",Euskara:"eu","فارسی":"fa","Français":"fr",Gaeilge:"ga","Gàidhlig":"gd",Galego:"gl","한국어":"ko","עִבְרִית":"he",Hrvatski:"hr",isiZulu:"zu","Íslenska":"is",Italiano:"it","ქართული_ენა":"ka",Kiswahili:"sw","Kreyòl_ayisyen":"ht","کوردیی_ناوەندی":"ckb","Latviešu":"lv","Lietuvių":"lt",Magyar:"hu","Māori":"mi",Nederlands:"nl","日本語":"ja","にほんご":"ja-Hira","Norsk_Bokmål":"nb",Norsk_Nynorsk:"nn","Oʻzbekcha":"uz","ไทย":"th","ភាសាខ្មែរ":"km",Polski:"pl","Português":"pt","Português_Brasileiro":"pt-br",Rapa_Nui:"rap","Română":"ro","Русский":"ru","Српски":"sr","Slovenčina":"sk","Slovenščina":"sl",Suomi:"fi",Svenska:"sv","Tiếng_Việt":"vi","Türkçe":"tr","Українська":"uk","简体中文":"zh-cn","繁體中文":"zh-tw"},i=Object.keys(a);function s(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]])}return r}function c(e,t,r,n,o,a){function i(e){if(void 0!==e&&"function"!=typeof e)throw new TypeError("Function expected");return e}for(var s,c=n.kind,l="getter"===c?"get":"setter"===c?"set":"value",u=!t&&e?n.static?e:e.prototype:null,d=t||(u?Object.getOwnPropertyDescriptor(u,n.name):{}),m=!1,p=r.length-1;p>=0;p--){var h={};for(var g in n)h[g]="access"===g?{}:n[g];for(var g in n.access)h.access[g]=n.access[g];h.addInitializer=function(e){if(m)throw new TypeError("Cannot add initializers after decoration has completed");a.push(i(e||null))};var f=(0,r[p])("accessor"===c?{get:d.get,set:d.set}:d[l],h);if("accessor"===c){if(void 0===f)continue;if(null===f||"object"!=typeof f)throw new TypeError("Object expected");(s=i(f.get))&&(d.get=s),(s=i(f.set))&&(d.set=s),(s=i(f.init))&&o.push(s)}else(s=i(f))&&("field"===c?o.push(s):d[l]=s)}u&&Object.defineProperty(u,n.name,d),m=!0}function l(e,t,r){for(var n=arguments.length>2,o=0;o<t.length;o++)r=n?t[o].call(e,r):t[o].call(e);return n?r:void 0}function u(e,t,r,n){return new(r||(r=Promise))((function(o,a){function i(e){try{c(n.next(e))}catch(e){a(e)}}function s(e){try{c(n.throw(e))}catch(e){a(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(i,s)}c((n=n.apply(e,t||[])).next())}))}function d(e,t=100){return u(this,void 0,void 0,(function*(){let r,n=e();for(;!n;)yield new Promise((e=>{clearTimeout(r),r=setTimeout(e,t)})),n=e();return clearTimeout(r),n}))}const m=e=>"string"==typeof e||e instanceof String,p=e=>"[object Function]"===Object.prototype.toString.call(e)||"function"==typeof e||e instanceof Function,h=e=>e!==Object(e),g=e=>e,f=e=>u(void 0,void 0,void 0,(function*(){const t=new Promise(((t,r)=>{const n=document.createElement("script");n.onload=t,n.onerror=r,n.async=!0,n.src=e,document.body.appendChild(n)}));yield t})),y=(e,t,...r)=>e.call(t,...r),b=(e,t,r)=>(e[t]=r,e),v=(...e)=>{const{size:t}=e.reduce(((e,{length:t})=>e.add(t)),new Set);if(1!==t)throw new Error("Zip failed because collections weren't equal length")};const w="OPEN_UI_FROM_EXTENSION",E="REGISTER_BUTTON_CALLBACK_FROM_EXTENSION",T="internal_IsCustomArgument",I="isCustomArgumentHack",O="dropdownState",x="dropdownEntry",S="init",k="open",R="close",A=(e,t)=>e.emit(w,t),D=(e,t,r)=>{e.emit(E,t),e.on(t,r)};class N{constructor(e){this.root=e}get(...e){return`var(--${this.root}-${e.join("-")})`}primary(...e){return this.get("primary",...e)}secondary(...e){return this.get("secondary",...e)}tertiary(...e){return this.get("tertiary",...e)}transparent(...e){return this.get("transparent",...e)}light(...e){return this.get("light",...e)}}const _=new N("ui"),C=new N("text"),L=new N("motion"),B=new N("red"),M=new N("sound"),P=new N("control"),j=new N("data"),U=new N("pen"),$=new N("error"),V=new N("extensions"),F=new N("extensions"),G={ui:{primary:_.primary(),secondary:_.secondary(),tertiary:_.tertiary(),modalOverlay:_.get("modal","overlay"),white:_.get("white"),whiteDim:_.get("white","dim"),whiteTransparent:_.get("white","transparent"),transparent:_.transparent(),blackTransparent:_.get("black","transparent")},text:{primary:C.primary(),primaryTransparent:C.transparent()},motion:{primary:L.primary(),tertiary:L.tertiary(),transparent:L.get("transparent"),lightTansparent:L.light("transparent")},red:{primary:B.primary(),tertiary:B.tertiary()},sound:{primary:M.primary(),tertiary:M.tertiary()},control:{primary:P.primary()},data:{primary:j.primary()},pen:{primary:U.primary(),transparent:U.transparent()},error:{primary:$.primary(),light:$.light(),transparent:$.transparent()},extensions:{primary:V.primary(),tertiary:V.tertiary(),light:V.light(),transparent:V.transparent()},drop:{highlight:F.get("highlight")}},H=new RegExp("^[a-z0-9]+$","i"),z=new RegExp("[^a-z0-9]+","gi"),W=["prg","prg".split("").reverse().join("")],K=new RegExp(`${W[0]}([0-9]+)${W[1]}`,"g"),J=(e,t,r)=>e.replaceAll(t,r),q="customSaveDataPerExtension";function X(e){return class extends e{constructor(){super(...arguments),this.saveDataHandler=void 0}save(e,t){var r;const{saveDataHandler:n,id:o}=this,a=this.supports("customArguments")?this.customArgumentManager:null,i=null!==(r=null==n?void 0:n.hooks.onSave(this))&&void 0!==r?r:{};if(null==a||a.saveTo(i),0===Object.keys(i).length)return;const s=e[q];s?s[o]=i:e[q]={[o]:i},t.add(o)}load(e){if(!e)return;const{saveDataHandler:t,id:r}=this,n=q in e?e[q][r]:null;n&&(null==t||t.hooks.onLoad(this,n),this.supports("customArguments")&&this.getOrCreateCustomArgumentManager().loadFrom(n))}}}class Z{static get RGB_BLACK(){return{r:0,g:0,b:0}}static get RGB_WHITE(){return{r:255,g:255,b:255}}static decimalToHex(e){e<0&&(e+=16777216);let t=Number(e).toString(16);return t=`#${"000000".substr(0,6-t.length)}${t}`,t}static decimalToRgb(e){const t=e>>24&255;return{r:e>>16&255,g:e>>8&255,b:255&e,a:t>0?t:255}}static hexToRgb(e){e=e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,((e,t,r,n)=>t+t+r+r+n+n));const t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:null}static rgbToHex(e){return Z.decimalToHex(Z.rgbToDecimal(e))}static rgbToDecimal(e){return(e.r<<16)+(e.g<<8)+e.b}static hexToDecimal(e){return Z.rgbToDecimal(Z.hexToRgb(e))}static hsvToRgb(e){let t=e.h%360;t<0&&(t+=360);const r=Math.max(0,Math.min(e.s,1)),n=Math.max(0,Math.min(e.v,1)),o=Math.floor(t/60),a=t/60-o,i=n*(1-r),s=n*(1-r*a),c=n*(1-r*(1-a));let l,u,d;switch(o){default:case 0:l=n,u=c,d=i;break;case 1:l=s,u=n,d=i;break;case 2:l=i,u=n,d=c;break;case 3:l=i,u=s,d=n;break;case 4:l=c,u=i,d=n;break;case 5:l=n,u=i,d=s}return{r:Math.floor(255*l),g:Math.floor(255*u),b:Math.floor(255*d)}}static rgbToHsv(e){const t=e.r/255,r=e.g/255,n=e.b/255,o=Math.min(Math.min(t,r),n),a=Math.max(Math.max(t,r),n);let i=0,s=0;if(o!==a){i=60*((t===o?3:r===o?5:1)-(t===o?r-n:r===o?n-t:t-r)/(a-o))%360,s=(a-o)/a}return{h:i,s:s,v:a}}static mixRgb(e,t,r){if(r<=0)return e;if(r>=1)return t;const n=1-r;return{r:n*e.r+r*t.r,g:n*e.g+r*t.g,b:n*e.b+r*t.b}}}const Q=Z;class Y{static toNumber(e){if("number"==typeof e)return Number.isNaN(e)?0:e;const t=Number(e);return Number.isNaN(t)?0:t}static toBoolean(e){return"boolean"==typeof e?e:"string"==typeof e?""!==e&&"0"!==e&&"false"!==e.toLowerCase():Boolean(e)}static toString(e){return String(e)}static toRgbColorList(e){const t=Y.toRgbColorObject(e);return[t.r,t.g,t.b]}static toRgbColorObject(e){let t;return"string"==typeof e&&"#"===e.substring(0,1)?(t=Q.hexToRgb(e),t||(t={r:0,g:0,b:0,a:255})):t=Q.decimalToRgb(Y.toNumber(e)),t}static isWhiteSpace(e){return null===e||"string"==typeof e&&0===e.trim().length}static compare(e,t){let r=Number(e),n=Number(t);if(0===r&&Y.isWhiteSpace(e)?r=NaN:0===n&&Y.isWhiteSpace(t)&&(n=NaN),isNaN(r)||isNaN(n)){const r=String(e).toLowerCase(),n=String(t).toLowerCase();return r<n?-1:r>n?1:0}return r===1/0&&n===1/0||r===-1/0&&n===-1/0?0:r-n}static isInt(e){return"number"==typeof e?!!isNaN(e)||e===parseInt(e,10):"boolean"==typeof e||"string"==typeof e&&e.indexOf(".")<0}static get LIST_INVALID(){return"INVALID"}static get LIST_ALL(){return"ALL"}static toListIndex(e,t,r){if("number"!=typeof e){if("all"===e)return r?Y.LIST_ALL:Y.LIST_INVALID;if("last"===e)return t>0?t:Y.LIST_INVALID;if("random"===e||"any"===e)return t>0?1+Math.floor(Math.random()*t):Y.LIST_INVALID}return(e=Math.floor(Y.toNumber(e)))<1||e>t?Y.LIST_INVALID:e}}var ee=Y;const te=(e,t)=>{switch(e){case r.String:return`${t}`;case r.Number:return parseFloat(t);case r.Boolean:return JSON.parse(null!=t&&t);case r.Note:case r.Angle:return parseInt(t);case r.Matrix:return ne(t);case r.Color:return ee.toRgbColorObject(t);default:throw new Error(`Method not implemented for value of ${t} and type ${e}`)}},re=e=>1===parseInt(e),ne=e=>{if(25!==e.length)return new Array(5).fill(new Array(5).fill(!1));return e.split("").map(re).reduce(((e,t,r)=>{const n=Math.floor(r/5);return 0===r%5?e[n]=[t]:e[n].push(t),e}),new Array(5))};class oe{constructor(){this.map=new Map,this.pending=null}clearPending(){this.pending=null}setPending(e){this.pending=e}add(e){const t=oe.GetIdentifier();return this.map.set(t,e),this.clearPending(),t}insert(e,t){return this.map.set(e,t),this.clearPending(),e}request(){this.clearPending();const e=oe.GetIdentifier();return[e,t=>this.setPending({id:e,entry:t})]}tryResolve(){if(!this.pending)return;const{pending:{entry:e,id:t}}=this;return this.map.set(t,e),this.clearPending(),{entry:e,id:t}}getCurrentEntries(){return Array.from(this.map.entries()).filter((([e,t])=>null!==t)).map((([e,{text:t}])=>[t,e]))}getEntry(e){return this.map.get(e)}requiresSave(){this.map.size}saveTo(e){const t=Array.from(this.map.entries()).filter((([e,t])=>null!==t)).map((([e,t])=>({id:e,entry:t})));0!==t.length&&(e[oe.SaveKey]=t)}loadFrom(e){var t;null===(t=e[oe.SaveKey])||void 0===t||t.forEach((({id:e,entry:t})=>{this.map.set(e,t)}))}purgeStaleIDs(){}}oe.SaveKey="internal_customArgumentsSaveData",oe.IsIdentifier=e=>e.startsWith(oe.IdentifierPrefix),oe.GetIdentifier=()=>oe.IdentifierPrefix+(new Date).getTime().toString(),oe.IdentifierPrefix="__customArg__";const ae=(e,t)=>u(void 0,void 0,void 0,(function*(){const r="blocklyDropDownContent",n=document.getElementsByClassName(r);if(1!==n.length)return console.error(`Uh oh! Expected 1 element with class '${r}', but found ${n.length}`);const[o]=n,a=yield d((()=>o.children[0]));new e({target:o,anchor:a,props:t}),ie(a)})),ie=e=>{[["goog-menuitem goog-option",e=>{e.margin="auto",e.paddingLeft=e.paddingRight="0px"}],["goog-menuitem-content",e=>e.textAlign="center"]].forEach((([t,r])=>{const n=e.getElementsByClassName(t);console.assert(1===n.length,`Incorrect number of elements found with class: ${t}`),r(n[0].style)}))};class se{makeImage(){return new Image}makeCanvas(){return document.createElement("canvas")}resize(e,t,r){const n=this.makeCanvas();n.width=t,n.height=e.height;let o=n.getContext("2d");o.imageSmoothingEnabled=!1,o.drawImage(e,0,0,n.width,n.height);const a=this.makeCanvas();return a.width=t,a.height=r,o=a.getContext("2d"),o.imageSmoothingEnabled=!1,o.drawImage(n,0,0,a.width,a.height),a}convertResolution1Bitmap(e,t){const r=new Image;r.src=e,r.onload=()=>{t(null,this.resize(r,2*r.width,2*r.height).toDataURL())},r.onerror=()=>{t("Image load failed")}}getResizedWidthHeight(e,t){const r=480,n=360;if(e<=r&&t<=n)return{width:2*e,height:2*t};if(e<=960&&t<=720)return{width:e,height:t};const o=e/t;return o>=1.3333333333333333?{width:960,height:960/o}:{width:720*o,height:720}}importBitmap(e){return new Promise(((t,r)=>{const n=this.makeImage();n.src=e,n.onload=()=>{const r=this.getResizedWidthHeight(n.width,n.height);if(r.width===n.width&&r.height===n.height)t(this.convertDataURIToBinary(e));else{const e=this.resize(n,r.width,r.height).toDataURL();t(this.convertDataURIToBinary(e))}},n.onerror=()=>{r("Image load failed")}}))}convertDataURIToBinary(e){const t=";base64,",r=e.indexOf(t)+t.length,n=e.substring(r),o=window.atob(n),a=o.length,i=new Uint8Array(new ArrayBuffer(a));for(let e=0;e<a;e++)i[e]=o.charCodeAt(e);return i}}let ce,le;const ue=[],de=(e,...t)=>{var r;return null===(r=ue.pop())||void 0===r||r(t),e};let me;const pe={DrowpdownOpen:k,DropdownClose:R,Init:S};const he={isSimpleStatic:e=>Array.isArray(e),isSimpleDynamic:e=>p(e),isStaticWithReporters:e=>"items"in e,isDynamicWithReporters:e=>"getItems"in e},ge=e=>`${e}`,fe=e=>h(e)?`${e}`:Object.assign(Object.assign({},e),{value:`${e.value}`}),ye=(e,t)=>({acceptReporters:t,items:e.map((e=>e)).map(fe)}),be=(e,t,r)=>t?e.menu=((e,t)=>{const r=t.indexOf(e),n=r>=0?r:t.push(e)-1;return`${ge(n)}`})(t,r):null,ve=(e,t,r)=>e,we=e=>e.map((e=>{if(h(e))return g;const{options:t}=e;return(e=>e&&"handler"in e)(t)?t.handler:g})),Ee=e=>`${e}`,Te=e=>h(e)?e:e.type,Ie=(e,t,r,n)=>{void 0!==n&&(e.defaultValue=((e,t,r)=>m(e)?ve(e):e)(n))},Oe=(e,t,r)=>{if(!r||0===r.length)return t;if(!(e=>!m(e))(t))return ve(t);const n=t,o=r.map(((e,t)=>`[${Ee(t)}]`));return ve(n(...o))},xe=e=>`internal_${e}`,Se=(e,t,n)=>e.supports("customArguments")?function(o,a){const i=n.map((({name:t,type:n,handler:a})=>{const i=o[t];if(n===r.Custom){const t=m(i)&&oe.IsIdentifier(i)?this.customArgumentManager.getEntry(i).value:i;return a.call(e,t)}return te(n,a.call(e,i))}));return t.call(e,...i,a)}:function(r,o){const a=n.map((({name:t,type:n,handler:o})=>te(n,o.call(e,r[t]))));return t.call(e,...a,o)};function ke(e){return class extends e{constructor(){super(...arguments),this.blockMap=new Map,this.menus=[]}pushBlock(e,t,r){if(this.blockMap.has(e))throw new Error(`Attempt to push block with opcode ${e}, but it was already set. This is assumed to be a mistake.`);this.blockMap.set(e,{definition:t,operation:r})}getInfo(){if(!this.info){const{id:e,name:t,blockIconURI:r}=this,n=Array.from(this.blockMap.entries()).map((e=>this.convertToInfo(e)));this.info={id:e,blocks:n,name:t,blockIconURI:r,menus:this.collectMenus()}}return this.info}convertToInfo(e){const[r,n]=e,{definition:o,operation:a}=n,i=(e=>p(e))(o)?y(o,this,this):o,{type:s,text:c}=i,l=(e=>{var t,r;const n="args";return"arg"in e&&e.arg?[e.arg]:n in e&&(null!==(r=null===(t=e[n])||void 0===t?void 0:t.length)&&void 0!==r?r:0)>0?e.args:[]})(i),{id:u,runtime:d,menus:m}=this,g=Oe(0,c,l),f=((e,t,r)=>{if(t&&0!==t.length)return Object.fromEntries(t.map(((t,n)=>{const o={};if(o.type=Te(t),h(t))return o;const{defaultValue:a,options:i}=t;return Ie(o,e,n,a),be(o,i,r),o})).reduce(((e,t,r)=>e.set(Ee(r),t)),new Map))})(r,l,m),b={opcode:r,text:g,blockType:s,arguments:f};if(s===t.Button){const e=((e,t)=>`${e}_${t}`)(u,r);D(d,e,a.bind(this)),b.func=e}else{this[xe(r)]=Se(this,a,((e,t)=>{const r=e.map(Te),n=we(e);return null!=t||(t=r.map(((e,t)=>Ee(t)))),v(r,n,t),r.map(((e,r)=>({type:e,name:t[r],handler:n[r]})))})(l))}return b}collectMenus(){const{isSimpleStatic:e,isSimpleDynamic:t,isStaticWithReporters:r,isDynamicWithReporters:n}=he;return Object.fromEntries(this.menus.map(((o,a)=>{if(e(o))return ye(o,!1);if(t(o))return this.registerDynamicMenu(o,!1,a);if(r(o))return ye(o.items,!0);if(n(o))return this.registerDynamicMenu(o.getItems,!0,a);throw new Error("Unable to process menu")})).reduce(((e,t,r)=>e.set(ge(r),t)),new Map))}registerDynamicMenu(e,t,r){const n=`internal_dynamic_${r}`;return this[n]=()=>e.call(this).map((e=>e)).map(fe),{acceptReporters:t,items:n}}}}function Re(e){return function(t,r){const n=t.name,o=xe(n);return r.addInitializer((function(){this.pushBlock(n,e,t)})),function(){return this[o].call(this,...arguments)}}}const Ae=e=>t=>r=>{const{operation:n,argumentMethods:o}=p(t)?t.call(r,r):t;return o&&Ne(e,o,r),Object.assign(Object.assign({},e),{operation:n})},De=e=>(...t)=>{if(0===t.length||!t[0])return Re(e);const r=t[0];return Re((t=>{const{argumentMethods:n}=p(r)?r.call(t,t):r;return Ne(e,n,t),e}))},Ne=(e,t,r)=>{const n=e.args?e.args:e.arg?[e.arg]:[];Object.entries(t).map((([e,{handler:t,getItems:r}])=>({arg:n[parseInt(e)],methods:{handler:t,getItems:r}}))).forEach((({arg:e,methods:t})=>Object.entries(t).filter((([e,t])=>void 0!==t)).map((([e,t])=>[e,t.bind(r)])).forEach((([t,r])=>_e(e,t,r)))))},_e=(e,t,r)=>{p(e.options)&&(e.options=r),e.options[t]=r},Ce=e=>{if(m(e))throw new Error(`Block defined as string, unexpected! ${e}`);return e},Le=e=>Array.from(e.blocks.map(Ce).reduce(((t,r)=>((e,t,r)=>{const{opcode:n,arguments:o,blockType:a}=t,{text:i,orderedNames:c}=Be(t);if(!o)return e.set(n,{type:a,text:i});const l=Object.entries(null!=o?o:{}).map((e=>{var[t,n]=e,{menu:o}=n,a=s(n,["menu"]);return Object.assign({options:Ue(r,o),name:t,menu:o},a)})).sort((({name:e},{name:t})=>c.indexOf(e)<c.indexOf(t)?-1:1)).map((e=>s(e,["name"]))),{length:u}=l;return u>=2?e.set(n,{type:a,text:i,args:l}):e.set(n,{type:a,text:i,arg:l[0]})})(t,r,e)),new Map).entries()),Be=({arguments:e,text:t})=>{const r="Error: This should have been overridden by legacy support";if(!e)return{orderedNames:null,text:r};const n=Object.keys(e).map((e=>({name:e,template:`[${e}]`}))).sort((({template:e},{template:r})=>t.indexOf(e)<t.indexOf(r)?-1:1));return 0===n.length?{orderedNames:null,text:r}:{orderedNames:n.map((({name:e})=>e)),text:()=>r}},Me={getItems:()=>"Error: This should have been filled in."},Pe={handler:()=>"Error: This should have been filled in."},je=e=>m(e),Ue=(e,t)=>{const r=t?e.menus[t]:void 0;if(!r)return;if(je(r))return Me.getItems;const{items:n,acceptReporters:o}=r;return je(n)?o?Object.assign(Object.assign({acceptsReporters:o},Pe),Me):Me.getItems:o?Object.assign({acceptsReporters:o,items:[...n]},Pe):[...n]},$e=(e,t)=>{if(m(e))throw new Error("Block was unexpectedly a string: "+e);return!!t.has(e.opcode)||(console.error(`Could not find legacy opcode ${e.opcode} within currently defined blocks`),!1)},Ve=e=>{if(typeof e.legacy.menu!=typeof e.modern.menu)throw new Error("Menus don't match");return e},Fe=e=>{if(je(e))return e;if(je(e.items))return e.items;throw new Error("Menu is not dynamic: "+e)};function Ge(e){return class extends e{constructor(){super(...arguments),this.__isLegacy=!0,this.orderArgumentNamesByBlock=new Map,this.getArgNames=e=>{const{opcode:t}=e;if(!this.orderArgumentNamesByBlock.has(t)){const{orderedNames:r}=Be(e);this.orderArgumentNamesByBlock.set(t,r)}return this.orderArgumentNamesByBlock.get(t)}}getInfo(){if(!this.validatedInfo){const e=super.getInfo();this.validatedInfo=this.validateAndAttach(e)}return this.validatedInfo}validateAndAttach(e){var{id:t,blocks:r,menus:n}=e,o=s(e,["id","blocks","menus"]);const{id:a,blocks:i,menus:c}=this.getLegacyInfo(),l=[...r];if(t!==a)throw new Error(`ID mismatch! Legacy id: ${a} vs. current id: ${t}`);const u=l.reduce(((e,t,r)=>{var{opcode:n}=t,o=s(t,["opcode"]);return e.set(n,Object.assign(Object.assign({},o),{index:r}))}),new Map),d=this,m=i.map((e=>$e(e,u)?e:void 0)).filter(Boolean).map((e=>{const{opcode:t,arguments:r}=e,{index:o,arguments:a}=u.get(t),i=this.getArgNames(e);if(!i)return{replaceAt:{index:o,block:e}};const s=this[xe(t)];this[t]=((...[e,t])=>s.call(d,(e=>i.reduce(((t,r,n)=>b(t,n,e[r])),{}))(e),t)).bind(d);const l=i.map(((e,t)=>({legacy:r[e],modern:a[t]}))).map(Ve).map((({legacy:{menu:e},modern:{menu:t}})=>({legacyName:e,modernName:t}))).filter((e=>e.legacyName&&e.modernName)).map((({legacyName:e,modernName:t})=>({legacyName:e,modernName:t,legacy:c[e],modern:n[t]}))).map((({legacy:e,modern:t,legacyName:r,modernName:n})=>je(e)||je(e.items)?{type:"dynamic",legacy:r,modern:n,methods:{legacy:Fe(e),modern:Fe(t)}}:{type:"static",legacy:r,modern:n}));return{menuUpdates:l,replaceAt:{index:o,block:e}}}));return m.forEach((({replaceAt:{index:e,block:t}})=>l[e]=t)),m.map((({menuUpdates:e})=>e)).flat().filter(Boolean).map((e=>{const{legacy:t}=e;if(t in n)throw new Error(`Somehow, there was already a menu called ${t}, which will cause issues in the next step.`);return e})).forEach((({type:e,legacy:t,methods:r})=>{n[t]=c[t],"dynamic"===e&&(d[r.legacy]=()=>d[r.modern]())})),Object.assign({id:t,blocks:l,menus:n},o)}}}const He={image:"image-data",canvas:"canvas"};function ze(e){return class extends e{get video(){var e,t;return null!==(e=this.videoDevice)&&void 0!==e||(this.videoDevice=null===(t=this.runtime.ioDevices)||void 0===t?void 0:t.video),this.videoDevice}getVideoFrame(e){var t;return null===(t=this.video)||void 0===t?void 0:t.getFrame({format:He[e]})}setVideoTransparency(e){var t;null===(t=this.video)||void 0===t||t.setPreviewGhost(e)}enableVideo(e=!0){this.video&&(this.video.enableVideo(),this.video.provider.mirror=e)}disableVideo(){var e;null===(e=this.video)||void 0===e||e.disableVideo()}}}const We={customArguments:function(e){class t extends(de(e,X)){constructor(){super(...arguments),this.makeCustomArgument=({component:e,initial:t,acceptReportersHandler:n})=>{var o;null!==(o=this.argumentManager)&&void 0!==o||(this.argumentManager=new oe);const a=this.argumentManager.add(t),i=()=>[{text:T,value:JSON.stringify({component:e,id:a})}];return{type:r.Custom,defaultValue:a,options:void 0===n?i:{acceptsReports:!0,getItems:i,handler:n}}},this.argumentManager=null}get customArgumentManager(){return this.argumentManager}getOrCreateCustomArgumentManager(){var e;return null!==(e=this.argumentManager)&&void 0!==e||(this.argumentManager=new oe),this.argumentManager}[I](e){if(1!==e.length)return!1;const t=e[0];if("object"!=typeof t)return!1;const{text:r}=t;return r===T}processCustomArgumentHack(e,[{value:t}],r){var n;const{id:o,customArgumentManager:a}=this,{component:i,id:s}=JSON.parse(t);switch(e[O]){case pe.Init:return a.getCurrentEntries();case pe.DropdownClose:{const e=a.tryResolve();return e?[[e.entry.text,e.id]]:a.getCurrentEntries()}case pe.DrowpdownOpen:{const t=e[x],c=null!==(n=null==t?void 0:t.value)&&void 0!==n?n:s,l=a.getEntry(c),[u,d]=a.request();return ae(r(o,i),{setter:d,current:l,extension:this}),[["Apply",u]]}}throw new Error("Error during processing -- Context:"+pe)}}return t},ui:function(e){return class extends e{openUI(e,t){const{id:r,name:n,runtime:o}=this;A(o,{id:r,name:n,component:e.replace(".svelte",""),label:t})}}},customSaveData:X,video:ze,drawable:function(e){return class extends e{createDrawable(e){var t;null!==(t=this.renderer)&&void 0!==t||(this.renderer=this.runtime.renderer);const{renderer:r}=this;if(!r)return null;const o=r.createBitmapSkin(e,1),a=r.createDrawable(n.VideoLayer);r.updateDrawableSkinId(a,o);const i=e=>r.updateDrawableEffect(a,"ghost",e),s=(e=!0)=>r.updateDrawableVisible(a,e);return i(0),s(!0),{setTransparency:i,setVisible:s,update:e=>r.updateBitmapSkin(o,e,1),destroy:()=>{s(!1),r.destroyDrawable(a,n.VideoLayer),r.destroySkin(o)}}}}},addCostumes:function(e){return class extends e{addCostume(e,t,r,n){return u(this,void 0,void 0,(function*(){if(!(e=>"renderer"in e)(e))return console.warn("Costume could not be added is the supplied target wasn't a rendered target");null!=n||(n=`${this.id}_generated_${Date.now()}`),null!=ce||(ce=new se),null!=le||(le=(e=>{const t=document.body.appendChild(document.createElement("canvas")),r=({width:e,height:r})=>{t.width!==e&&(t.width=e),t.height!==r&&(t.height=r)};r(e),t.hidden=!0;const n=t.getContext("2d");return{getDataURL(e){const{width:o,height:a}=e;r(e),n.save(),n.clearRect(0,0,o,a),n.putImageData(e,0,0);const i=t.toDataURL("image/png");return n.restore(),i}}})(t));const{storage:o}=this.runtime,a=o.DataFormat.PNG,i=o.AssetType.ImageBitmap,s=yield ce.importBitmap(le.getDataURL(t)),c=o.createAsset(i,a,s,null,!0),{assetId:l}=c,u={name:n,dataFormat:a,asset:c,md5:`${l}.${a}`,assetId:l};yield this.runtime.addCostume(u);const{length:d}=e.getCostumes();e.addCostume(u,d),"add and set"===r&&e.setCostume(d)}))}}},legacySupport:Ge,setTransparencyBlock:function(e){let t=(()=>{var t;let r,n=[];return t=class extends(de(e,ze)){setVideoTransparencyBlock(e){this.setVideoTransparency(e)}constructor(){super(...arguments),l(this,n)}},r=[Re({type:"command",text:e=>`Set video to ${e}% transparent`,arg:"number"})],c(t,null,r,{kind:"method",name:"setVideoTransparencyBlock",static:!1,private:!1,access:{has:e=>"setVideoTransparencyBlock"in e,get:e=>e.setVideoTransparencyBlock}},null,n),t})();return t},toggleVideoBlock:function(e){let t=(()=>{var t;let r,n=[];return t=class extends(de(e,ze)){toggleVideoBlock(e){if("off"===e)return this.disableVideo();this.enableVideo("on"===e)}constructor(){super(...arguments),l(this,n)}},r=[Re({type:"command",text:e=>`Set video feed to ${e}`,arg:{type:"string",options:["on","off","on (flipped)"]}})],c(t,null,r,{kind:"method",name:"toggleVideoBlock",static:!1,private:!1,access:{has:e=>"toggleVideoBlock"in e,get:e=>e.toggleVideoBlock}},null,n),t})();return t},blockly:function(e){return class extends e{constructor(){super(...arguments),this.blockly=window.Blockly}}}};class Ke{internal_init(){return u(this,void 0,void 0,(function*(){const e=this.runtime;return yield Promise.resolve(this.init({runtime:e,get extensionManager(){return e.getExtensionManager()}}))}))}constructor(e,t,r,n){this.runtime=e,this.name=t,this.id=r,this.blockIconURI=n}}const Je=new Map;class qe extends Ke{constructor(e){super(...arguments),Je.set(this.id,this)}}function Xe(e,t){return class extends e{supports(e){return t.includes(e)}}}const Ze="__registerMenuDetials",Qe=(e,...t)=>{(e=>{var t;"undefined"==typeof window&&(null===(t=null===global||void 0===global?void 0:global[Ze])||void 0===t||t.call(global,e))})(e);const r=ke(Xe(qe,t));if(!t)return r;const{Result:n,allSupported:o}=Ye(r,t);return Xe(n,Array.from(o))},Ye=(e,t,r=new Set)=>{const n=t.filter((e=>!r.has(e))).map((e=>(r.add(e),e))).map((e=>We[e])).reduce(((e,t)=>{const{dependencies:n,MixedIn:o}=(e=>{let t;null!=me||(me=Object.entries(We).reduce(((e,[t,r])=>e.set(r,t)),new Map)),ue.push((e=>{e.map((e=>e)).forEach((e=>{if(!me.has(e))throw new Error("Unkown mixin dependency! "+e);null!=t||(t=[]),t.push(me.get(e))}))}));const r=e();return{dependencies:t,MixedIn:r}})((()=>t(e)));return n?Ye(o,n,r).Result:o}),e);return{Result:n,allSupported:r}};class et extends(Qe(void 0,"ui","customSaveData","customArguments")){internal_init(){const e=Object.create(null,{internal_init:{get:()=>super.internal_init}});return u(this,void 0,void 0,(function*(){yield e.internal_init.call(this);const t=this.defineBlocks(),r=this;for(const e in t){this.validateOpcode(e);const n=t[e],{operation:o,text:a,arg:i,args:s,type:c}=p(n)?n.call(this,this):n;this.pushBlock(e,i?{text:a,type:c,arg:i}:s?{text:a,type:c,args:s}:{text:a,type:c},o);const l=xe(e);this[e]=function(){return r[l].call(r,...arguments)}}}))}validateOpcode(e){if(!(e in this))return;throw new Error(`The Extension has a member defined as '${e}', but that name should be reserved for the opcode of the block with the same name. Please rename your member, and attach the "validateGenericExtension" decorator to your class so that this can be an error in your IDE and not at runtime.`)}}return e.ArgumentType=r,e.AuxiliaryExtensionInfo="AuxiliaryExtensionInfo",e.BlockType=t,e.Branch={Exit:0,Enter:1,First:1,Second:2,Third:3,Fourth:4,Fifth:5,Sixth:6,Seventh:7},e.ConstructableExtension=Ke,e.CustomArgumentManager=oe,e.Extension=et,e.ExtensionBase=qe,e.FrameworkID="ExtensionFramework",e.Language=a,e.LanguageKeys=i,e.LayerGroups=o,e.RuntimeEvent={ScriptGlowOn:"SCRIPT_GLOW_ON",ScriptGlowOff:"SCRIPT_GLOW_OFF",BlockGlowOn:"BLOCK_GLOW_ON",BlockGlowOff:"BLOCK_GLOW_OFF",HasCloudDataUpdate:"HAS_CLOUD_DATA_UPDATE",TurboModeOn:"TURBO_MODE_ON",TurboModeOff:"TURBO_MODE_OFF",RecordingOn:"RECORDING_ON",RecordingOff:"RECORDING_OFF",ProjectStart:"PROJECT_START",ProjectRunStart:"PROJECT_RUN_START",ProjectRunStop:"PROJECT_RUN_STOP",ProjectStopAll:"PROJECT_STOP_ALL",StopForTarget:"STOP_FOR_TARGET",VisualReport:"VISUAL_REPORT",ProjectLoaded:"PROJECT_LOADED",ProjectChanged:"PROJECT_CHANGED",ToolboxExtensionsNeedUpdate:"TOOLBOX_EXTENSIONS_NEED_UPDATE",TargetsUpdate:"TARGETS_UPDATE",MonitorsUpdate:"MONITORS_UPDATE",BlockDragUpdate:"BLOCK_DRAG_UPDATE",BlockDragEnd:"BLOCK_DRAG_END",ExtensionAdded:"EXTENSION_ADDED",ExtensionFieldAdded:"EXTENSION_FIELD_ADDED",PeripheralListUpdate:"PERIPHERAL_LIST_UPDATE",PeripheralConnected:"PERIPHERAL_CONNECTED",PeripheralDisconnected:"PERIPHERAL_DISCONNECTED",PeripheralRequestError:"PERIPHERAL_REQUEST_ERROR",PeripheralConnectionLostError:"PERIPHERAL_CONNECTION_LOST_ERROR",PeripheralScanTimeout:"PERIPHERAL_SCAN_TIMEOUT",MicListening:"MIC_LISTENING",BlocksInfoUpdate:"BLOCKSINFO_UPDATE",RuntimeStarted:"RUNTIME_STARTED",RuntimeDisposed:"RUNTIME_DISPOSED",BlocksNeedUpdate:"BLOCKS_NEED_UPDATE"},e.SaveDataHandler=class{constructor(e){this.hooks=e}},e.ScratchBlocksConstants={OutputShapeHexagonal:1,OutputShapeRound:2,OutputShapeSquare:3},e.StageLayering=n,e.TargetType={Sprite:"sprite",Stage:"stage"},e.VariableType={Scalar:"",List:"list",BrooadcastMessage:"broadcast_msg"},e.activeClass=!0,e.assertSameLength=v,e.block=Re,e.buttonBlock=function(e){return Re({text:e,type:t.Button})},e.castToType=te,e.closeDropdownState=R,e.color=G,e.copyTo=({target:e,source:t})=>{for(const r in t)r in e&&(e[r]=t[r])},e.customArgumentCheck=I,e.customArgumentFlag=T,e.decode=e=>[...[...e.matchAll(K)].reduce(((e,t)=>{const[r,n]=t;return e.set(r,String.fromCharCode(n))}),new Map)].reduce(((e,[t,r])=>J(e,t,r)),`${e}`),e.dropdownEntryFlag=x,e.dropdownStateFlag=O,e.encode=e=>{const t=[...e.matchAll(z)].reduce(((e,t)=>(t[0].split("").forEach((t=>e.add(t))),e)),new Set);return[...t].map((e=>({char:e,code:e.charCodeAt(0)}))).reduce(((e,{char:t,code:r})=>J(e,t,`${W[0]}${r}${W[1]}`)),`${e}`)},e.extension=Qe,e.extensionsMap=Je,e.fetchWithTimeout=function(e,t){return u(this,void 0,void 0,(function*(){const{timeout:r}=t,n=new AbortController,o=setTimeout((()=>n.abort()),r),a=yield fetch(e,Object.assign(Object.assign({},t),{signal:n.signal}));return clearTimeout(o),a}))},e.getTextFromMenuItem=e=>"object"==typeof e?e.text:e,e.getValueFromMenuItem=e=>"object"==typeof e?e.value:e,e.hideElementsOfClass=e=>{for(const t of document.getElementsByClassName(e))t.setAttribute("style","display: none;")},e.identity=g,e.initDropdownState=S,e.isDynamicMenu=je,e.isFunction=p,e.isPrimitive=h,e.isString=m,e.isValidID=e=>H.test(e),e.legacy=(e,t)=>({for(){const t=Le(e).map((([e,t])=>({key:e,definer:Ae(t),decorator:De(t)}))),r=t.reduce(((e,{key:t,definer:r})=>(e[t]=r,e)),{}),n=t.reduce(((e,{key:t,decorator:r})=>(e[t]=r,e)),{}),o=()=>{throw new Error("This property is not meant to be accessed, and is instead solely for type inference / documentation purposes.")};return{legacyExtension:()=>(t,r)=>{class n extends(function(e,t){class r extends(Ge(e)){getLegacyInfo(){return t}}return r}(t,e)){constructor(){super(...arguments),this.originalClassName=r.name}}return n},legacyDefinition:r,legacyBlock:n,ReservedNames:{get Menus(){return o()},get Blocks(){return o()},get ArgumentNamesByBlock(){return o()}}}}}),e.loadExternalScript=(e,t,r)=>{const n=document.createElement("script");n.onload=t,n.onerror=null!=r?r:()=>{throw new Error(`Error loading endpoint: ${e}`)},n.src=e,n.async=!0,document.body.appendChild(n)},e.openDropdownState=k,e.openUI=A,e.openUIEvent=w,e.parseText=Be,e.px=e=>`${e}px`,e.reactiveInvoke=(e,t,r)=>e[t](...r),e.reactiveSet=(e,t,r)=>{e[t]=r},e.registerButtonCallback=D,e.registerButtonCallbackEvent=E,e.registerExtensionDefinitionCallback=e=>global[Ze]=t=>{t&&(e(t),delete global[Ze])},e.renderToDropdown=ae,e.rgbToHex=e=>(e=>{e<0&&(e+=16777216);let t=Number(e).toString(16);return t=`#${"000000".substr(0,6-t.length)}${t}`,t})(function(e){return(e.r<<16)+(e.g<<8)+e.b}(e)),e.saveDataKey=q,e.set=b,e.splitOnCapitals=e=>e.split(/(?=[A-Z])/),e.tryCastToArgumentType=(e,t,r)=>{try{return te(e,t)}catch(e){return r(t)}},e.typesafeCall=y,e.untilCondition=function(e,t=100){return u(this,void 0,void 0,(function*(){let r;for(;!e();)yield new Promise((e=>{clearTimeout(r),r=setTimeout(e,t)}));clearTimeout(r)}))},e.untilExternalGlobalVariableLoaded=(e,t)=>u(void 0,void 0,void 0,(function*(){return window[t]||(yield f(e)),window[t]})),e.untilExternalScriptLoaded=f,e.untilObject=d,e.untilReady=function(e,t=100){return u(this,void 0,void 0,(function*(){let r;for(;!e.ready;)yield new Promise((e=>{clearTimeout(r),r=setTimeout(e,t)}));clearTimeout(r)}))},e.untilTimePassed=function(e){return u(this,void 0,void 0,(function*(){let t;return yield new Promise((r=>t=setTimeout((()=>{clearTimeout(t),r()}),e)))}))},e.validGenericExtension=(...e)=>function(e,t){},Object.defineProperty(e,"__esModule",{value:!0}),e}({});//# sourceMappingURL=ExtensionFramework.js.map
