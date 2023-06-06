var ExtensionFramework=function(e){"use strict";const t={Boolean:"Boolean",Button:"button",Command:"command",Conditional:"conditional",Event:"event",Hat:"hat",Loop:"loop",Reporter:"reporter"},r={Angle:"angle",Boolean:"Boolean",Color:"color",Number:"number",String:"string",Matrix:"matrix",Note:"note",Image:"image",Custom:"custom"},n={BackgroundLayer:"background",VideoLayer:"video",PenLayer:"pen",SpriteLayer:"sprite"},a=[n.VideoLayer,n.SpriteLayer,n.BackgroundLayer,n.PenLayer],o={"Аҧсшәа":"ab","العربية":"ar","አማርኛ":"am",Azeri:"az",Bahasa_Indonesia:"id","Беларуская":"be","Български":"bg","Català":"ca","Česky":"cs",Cymraeg:"cy",Dansk:"da",Deutsch:"de",Eesti:"et","Ελληνικά":"el",English:"en","Español":"es","Español_Latinoamericano":"es-419",Euskara:"eu","فارسی":"fa","Français":"fr",Gaeilge:"ga","Gàidhlig":"gd",Galego:"gl","한국어":"ko","עִבְרִית":"he",Hrvatski:"hr",isiZulu:"zu","Íslenska":"is",Italiano:"it","ქართული_ენა":"ka",Kiswahili:"sw","Kreyòl_ayisyen":"ht","کوردیی_ناوەندی":"ckb","Latviešu":"lv","Lietuvių":"lt",Magyar:"hu","Māori":"mi",Nederlands:"nl","日本語":"ja","にほんご":"ja-Hira","Norsk_Bokmål":"nb",Norsk_Nynorsk:"nn","Oʻzbekcha":"uz","ไทย":"th","ភាសាខ្មែរ":"km",Polski:"pl","Português":"pt","Português_Brasileiro":"pt-br",Rapa_Nui:"rap","Română":"ro","Русский":"ru","Српски":"sr","Slovenčina":"sk","Slovenščina":"sl",Suomi:"fi",Svenska:"sv","Tiếng_Việt":"vi","Türkçe":"tr","Українська":"uk","简体中文":"zh-cn","繁體中文":"zh-tw"},i=Object.keys(o);function s(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(n=Object.getOwnPropertySymbols(e);a<n.length;a++)t.indexOf(n[a])<0&&Object.prototype.propertyIsEnumerable.call(e,n[a])&&(r[n[a]]=e[n[a]])}return r}function c(e,t,r,n,a,o){function i(e){if(void 0!==e&&"function"!=typeof e)throw new TypeError("Function expected");return e}for(var s,c=n.kind,l="getter"===c?"get":"setter"===c?"set":"value",u=!t&&e?n.static?e:e.prototype:null,d=t||(u?Object.getOwnPropertyDescriptor(u,n.name):{}),m=!1,p=r.length-1;p>=0;p--){var h={};for(var g in n)h[g]="access"===g?{}:n[g];for(var g in n.access)h.access[g]=n.access[g];h.addInitializer=function(e){if(m)throw new TypeError("Cannot add initializers after decoration has completed");o.push(i(e||null))};var f=(0,r[p])("accessor"===c?{get:d.get,set:d.set}:d[l],h);if("accessor"===c){if(void 0===f)continue;if(null===f||"object"!=typeof f)throw new TypeError("Object expected");(s=i(f.get))&&(d.get=s),(s=i(f.set))&&(d.set=s),(s=i(f.init))&&a.push(s)}else(s=i(f))&&("field"===c?a.push(s):d[l]=s)}u&&Object.defineProperty(u,n.name,d),m=!0}function l(e,t,r){for(var n=arguments.length>2,a=0;a<t.length;a++)r=n?t[a].call(e,r):t[a].call(e);return n?r:void 0}function u(e,t,r,n){return new(r||(r=Promise))((function(a,o){function i(e){try{c(n.next(e))}catch(e){o(e)}}function s(e){try{c(n.throw(e))}catch(e){o(e)}}function c(e){var t;e.done?a(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(i,s)}c((n=n.apply(e,t||[])).next())}))}function d(e,t=100){return u(this,void 0,void 0,(function*(){let r,n=e();for(;!n;)yield new Promise((e=>{clearTimeout(r),r=setTimeout(e,t)})),n=e();return clearTimeout(r),n}))}const m=e=>"string"==typeof e||e instanceof String,p=e=>"[object Function]"===Object.prototype.toString.call(e)||"function"==typeof e||e instanceof Function,h=e=>e!==Object(e),g=e=>e,f=e=>u(void 0,void 0,void 0,(function*(){const t=new Promise(((t,r)=>{const n=document.createElement("script");n.onload=t,n.onerror=r,n.async=!0,n.src=e,document.body.appendChild(n)}));yield t})),y=(e,t,...r)=>e.call(t,...r),b=(e,t,r)=>(e[t]=r,e),v=(...e)=>{const{size:t}=e.reduce(((e,{length:t})=>e.add(t)),new Set);if(1!==t)throw new Error("Zip failed because collections weren't equal length")};const w="OPEN_UI_FROM_EXTENSION",E="REGISTER_BUTTON_CALLBACK_FROM_EXTENSION",T="internal_IsCustomArgument",I="isCustomArgumentHack",O="dropdownState",x="dropdownEntry",S="init",R="open",k="close",D=(e,t)=>e.emit(w,t),A=(e,t,r)=>{e.emit(E,t),e.on(t,r)};class N{constructor(e){this.root=e}get(...e){return`var(--${this.root}-${e.join("-")})`}primary(...e){return this.get("primary",...e)}secondary(...e){return this.get("secondary",...e)}tertiary(...e){return this.get("tertiary",...e)}transparent(...e){return this.get("transparent",...e)}light(...e){return this.get("light",...e)}}const _=new N("ui"),C=new N("text"),L=new N("motion"),B=new N("red"),M=new N("sound"),P=new N("control"),j=new N("data"),U=new N("pen"),$=new N("error"),V=new N("extensions"),F=new N("extensions"),G={ui:{primary:_.primary(),secondary:_.secondary(),tertiary:_.tertiary(),modalOverlay:_.get("modal","overlay"),white:_.get("white"),whiteDim:_.get("white","dim"),whiteTransparent:_.get("white","transparent"),transparent:_.transparent(),blackTransparent:_.get("black","transparent")},text:{primary:C.primary(),primaryTransparent:C.transparent()},motion:{primary:L.primary(),tertiary:L.tertiary(),transparent:L.get("transparent"),lightTansparent:L.light("transparent")},red:{primary:B.primary(),tertiary:B.tertiary()},sound:{primary:M.primary(),tertiary:M.tertiary()},control:{primary:P.primary()},data:{primary:j.primary()},pen:{primary:U.primary(),transparent:U.transparent()},error:{primary:$.primary(),light:$.light(),transparent:$.transparent()},extensions:{primary:V.primary(),tertiary:V.tertiary(),light:V.light(),transparent:V.transparent()},drop:{highlight:F.get("highlight")}},H=new RegExp("^[a-z0-9]+$","i"),z=new RegExp("[^a-z0-9]+","gi"),W=["prg","prg".split("").reverse().join("")],K=new RegExp(`${W[0]}([0-9]+)${W[1]}`,"g"),J=(e,t,r)=>e.replaceAll(t,r),q="customSaveDataPerExtension";function X(e){return class extends e{constructor(){super(...arguments),this.saveDataHandler=void 0}save(e,t){var r;const{saveDataHandler:n,id:a}=this,o=this.supports("customArguments")?this.customArgumentManager:null,i=null!==(r=null==n?void 0:n.hooks.onSave(this))&&void 0!==r?r:{};if(null==o||o.saveTo(i),0===Object.keys(i).length)return;const s=e[q];s?s[a]=i:e[q]={[a]:i},t.add(a)}load(e){if(!e)return;const{saveDataHandler:t,id:r}=this,n=q in e?e[q][r]:null;n&&(null==t||t.hooks.onLoad(this,n),this.supports("customArguments")&&this.getOrCreateCustomArgumentManager().loadFrom(n))}}}class Z{static get RGB_BLACK(){return{r:0,g:0,b:0}}static get RGB_WHITE(){return{r:255,g:255,b:255}}static decimalToHex(e){e<0&&(e+=16777216);let t=Number(e).toString(16);return t=`#${"000000".substr(0,6-t.length)}${t}`,t}static decimalToRgb(e){const t=e>>24&255;return{r:e>>16&255,g:e>>8&255,b:255&e,a:t>0?t:255}}static hexToRgb(e){e=e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,((e,t,r,n)=>t+t+r+r+n+n));const t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:null}static rgbToHex(e){return Z.decimalToHex(Z.rgbToDecimal(e))}static rgbToDecimal(e){return(e.r<<16)+(e.g<<8)+e.b}static hexToDecimal(e){return Z.rgbToDecimal(Z.hexToRgb(e))}static hsvToRgb(e){let t=e.h%360;t<0&&(t+=360);const r=Math.max(0,Math.min(e.s,1)),n=Math.max(0,Math.min(e.v,1)),a=Math.floor(t/60),o=t/60-a,i=n*(1-r),s=n*(1-r*o),c=n*(1-r*(1-o));let l,u,d;switch(a){default:case 0:l=n,u=c,d=i;break;case 1:l=s,u=n,d=i;break;case 2:l=i,u=n,d=c;break;case 3:l=i,u=s,d=n;break;case 4:l=c,u=i,d=n;break;case 5:l=n,u=i,d=s}return{r:Math.floor(255*l),g:Math.floor(255*u),b:Math.floor(255*d)}}static rgbToHsv(e){const t=e.r/255,r=e.g/255,n=e.b/255,a=Math.min(Math.min(t,r),n),o=Math.max(Math.max(t,r),n);let i=0,s=0;if(a!==o){i=60*((t===a?3:r===a?5:1)-(t===a?r-n:r===a?n-t:t-r)/(o-a))%360,s=(o-a)/o}return{h:i,s:s,v:o}}static mixRgb(e,t,r){if(r<=0)return e;if(r>=1)return t;const n=1-r;return{r:n*e.r+r*t.r,g:n*e.g+r*t.g,b:n*e.b+r*t.b}}}const Q=Z;class Y{static toNumber(e){if("number"==typeof e)return Number.isNaN(e)?0:e;const t=Number(e);return Number.isNaN(t)?0:t}static toBoolean(e){return"boolean"==typeof e?e:"string"==typeof e?""!==e&&"0"!==e&&"false"!==e.toLowerCase():Boolean(e)}static toString(e){return String(e)}static toRgbColorList(e){const t=Y.toRgbColorObject(e);return[t.r,t.g,t.b]}static toRgbColorObject(e){let t;return"string"==typeof e&&"#"===e.substring(0,1)?(t=Q.hexToRgb(e),t||(t={r:0,g:0,b:0,a:255})):t=Q.decimalToRgb(Y.toNumber(e)),t}static isWhiteSpace(e){return null===e||"string"==typeof e&&0===e.trim().length}static compare(e,t){let r=Number(e),n=Number(t);if(0===r&&Y.isWhiteSpace(e)?r=NaN:0===n&&Y.isWhiteSpace(t)&&(n=NaN),isNaN(r)||isNaN(n)){const r=String(e).toLowerCase(),n=String(t).toLowerCase();return r<n?-1:r>n?1:0}return r===1/0&&n===1/0||r===-1/0&&n===-1/0?0:r-n}static isInt(e){return"number"==typeof e?!!isNaN(e)||e===parseInt(e,10):"boolean"==typeof e||"string"==typeof e&&e.indexOf(".")<0}static get LIST_INVALID(){return"INVALID"}static get LIST_ALL(){return"ALL"}static toListIndex(e,t,r){if("number"!=typeof e){if("all"===e)return r?Y.LIST_ALL:Y.LIST_INVALID;if("last"===e)return t>0?t:Y.LIST_INVALID;if("random"===e||"any"===e)return t>0?1+Math.floor(Math.random()*t):Y.LIST_INVALID}return(e=Math.floor(Y.toNumber(e)))<1||e>t?Y.LIST_INVALID:e}}var ee=Y;const te=(e,t)=>{switch(e){case r.String:return`${t}`;case r.Number:return parseFloat(t);case r.Boolean:return JSON.parse(null!=t&&t);case r.Note:case r.Angle:return parseInt(t);case r.Matrix:return ne(t);case r.Color:return ee.toRgbColorObject(t);default:throw new Error(`Method not implemented for value of ${t} and type ${e}`)}},re=e=>1===parseInt(e),ne=e=>{if(25!==e.length)return new Array(5).fill(new Array(5).fill(!1));return e.split("").map(re).reduce(((e,t,r)=>{const n=Math.floor(r/5);return 0===r%5?e[n]=[t]:e[n].push(t),e}),new Array(5))};class ae{constructor(){this.map=new Map,this.pending=null}clearPending(){this.pending=null}setPending(e){this.pending=e}add(e){const t=ae.GetIdentifier();return this.map.set(t,e),this.clearPending(),t}insert(e,t){return this.map.set(e,t),this.clearPending(),e}request(){this.clearPending();const e=ae.GetIdentifier();return[e,t=>this.setPending({id:e,entry:t})]}tryResolve(){if(!this.pending)return;const{pending:{entry:e,id:t}}=this;return this.map.set(t,e),this.clearPending(),{entry:e,id:t}}getCurrentEntries(){return Array.from(this.map.entries()).filter((([e,t])=>null!==t)).map((([e,{text:t}])=>[t,e]))}getEntry(e){return this.map.get(e)}requiresSave(){this.map.size}saveTo(e){const t=Array.from(this.map.entries()).filter((([e,t])=>null!==t)).map((([e,t])=>({id:e,entry:t})));0!==t.length&&(e[ae.SaveKey]=t)}loadFrom(e){var t;null===(t=e[ae.SaveKey])||void 0===t||t.forEach((({id:e,entry:t})=>{this.map.set(e,t)}))}purgeStaleIDs(){}}ae.SaveKey="internal_customArgumentsSaveData",ae.IsIdentifier=e=>e.startsWith(ae.IdentifierPrefix),ae.GetIdentifier=()=>ae.IdentifierPrefix+(new Date).getTime().toString(),ae.IdentifierPrefix="__customArg__";const oe=(e,t)=>u(void 0,void 0,void 0,(function*(){const r="blocklyDropDownContent",n=document.getElementsByClassName(r);if(1!==n.length)return console.error(`Uh oh! Expected 1 element with class '${r}', but found ${n.length}`);const[a]=n,o=yield d((()=>a.children[0]));new e({target:a,anchor:o,props:t}),ie(o)})),ie=e=>{[["goog-menuitem goog-option",e=>{e.margin="auto",e.paddingLeft=e.paddingRight="0px"}],["goog-menuitem-content",e=>e.textAlign="center"]].forEach((([t,r])=>{const n=e.getElementsByClassName(t);console.assert(1===n.length,`Incorrect number of elements found with class: ${t}`),r(n[0].style)}))};class se{makeImage(){return new Image}makeCanvas(){return document.createElement("canvas")}resize(e,t,r){const n=this.makeCanvas();n.width=t,n.height=e.height;let a=n.getContext("2d");a.imageSmoothingEnabled=!1,a.drawImage(e,0,0,n.width,n.height);const o=this.makeCanvas();return o.width=t,o.height=r,a=o.getContext("2d"),a.imageSmoothingEnabled=!1,a.drawImage(n,0,0,o.width,o.height),o}convertResolution1Bitmap(e,t){const r=new Image;r.src=e,r.onload=()=>{t(null,this.resize(r,2*r.width,2*r.height).toDataURL())},r.onerror=()=>{t("Image load failed")}}getResizedWidthHeight(e,t){const r=480,n=360;if(e<=r&&t<=n)return{width:2*e,height:2*t};if(e<=960&&t<=720)return{width:e,height:t};const a=e/t;return a>=1.3333333333333333?{width:960,height:960/a}:{width:720*a,height:720}}importBitmap(e){return new Promise(((t,r)=>{const n=this.makeImage();n.src=e,n.onload=()=>{const r=this.getResizedWidthHeight(n.width,n.height);if(r.width===n.width&&r.height===n.height)t(this.convertDataURIToBinary(e));else{const e=this.resize(n,r.width,r.height).toDataURL();t(this.convertDataURIToBinary(e))}},n.onerror=()=>{r("Image load failed")}}))}convertDataURIToBinary(e){const t=";base64,",r=e.indexOf(t)+t.length,n=e.substring(r),a=window.atob(n),o=a.length,i=new Uint8Array(new ArrayBuffer(o));for(let e=0;e<o;e++)i[e]=a.charCodeAt(e);return i}}let ce,le;const ue=[],de=(e,...t)=>{var r;return null===(r=ue.pop())||void 0===r||r(t),e};let me;const pe={DrowpdownOpen:R,DropdownClose:k,Init:S};const he={isSimpleStatic:e=>Array.isArray(e),isSimpleDynamic:e=>p(e),isStaticWithReporters:e=>"items"in e,isDynamicWithReporters:e=>"getItems"in e},ge=e=>`${e}`,fe=e=>h(e)?`${e}`:Object.assign(Object.assign({},e),{value:`${e.value}`}),ye=(e,t)=>({acceptReporters:t,items:e.map((e=>e)).map(fe)}),be=(e,t,r)=>t?e.menu=((e,t)=>{const r=t.indexOf(e),n=r>=0?r:t.push(e)-1;return`${ge(n)}`})(t,r):null,ve=(e,t,r)=>e,we=e=>e.map((e=>{if(h(e))return g;if(e.type===r.Image)return g;const{options:t}=e;return(e=>e&&"handler"in e)(t)?t.handler:g})),Ee=e=>`${e}`,Te=e=>h(e)?e:e.type,Ie=(e,t,r,n)=>{void 0!==n&&(e.defaultValue=((e,t,r)=>m(e)?ve(e):e)(n))},Oe=e=>!m(e)&&e.type===r.Image,xe=(e,t,r)=>{if(!r||0===r.length)return t;if(!(e=>!m(e))(t))return ve(t);const n=t,a=r.map(((e,t)=>`[${Ee(t)}]`));return ve(n(...a))},Se=e=>`internal_${e}`,Re="ERROR: This argument represents an inline image and should not be accessed.",ke=(e,t,n)=>e.supports("customArguments")?function(a,o){const i=n.map((({name:t,type:n,handler:o})=>{if(n===r.Image)return Re;const i=a[t];if(n===r.Custom){const t=m(i)&&ae.IsIdentifier(i)?this.customArgumentManager.getEntry(i).value:i;return o.call(e,t)}return te(n,o.call(e,i))}));return t.call(e,...i,o)}:function(a,o){const i=n.map((({name:t,type:n,handler:o})=>n===r.Image?Re:te(n,o.call(e,a[t]))));return t.call(e,...i,o)};function De(e){return class extends e{constructor(){super(...arguments),this.blockMap=new Map,this.menus=[]}pushBlock(e,t,r){if(this.blockMap.has(e))throw new Error(`Attempt to push block with opcode ${e}, but it was already set. This is assumed to be a mistake.`);this.blockMap.set(e,{definition:t,operation:r})}getInfo(){if(!this.info){const{id:e,name:t,blockIconURI:r}=this,n=Array.from(this.blockMap.entries()).map((e=>this.convertToInfo(e)));this.info={id:e,blocks:n,name:t,blockIconURI:r,menus:this.collectMenus()}}return this.info}convertToInfo(e){const[r,n]=e,{definition:a,operation:o}=n,i=(e=>p(e))(a)?y(a,this,this):a,{type:s,text:c}=i,l=(e=>{var t,r;const n="args";return"arg"in e&&e.arg?[e.arg]:n in e&&(null!==(r=null===(t=e[n])||void 0===t?void 0:t.length)&&void 0!==r?r:0)>0?e.args:[]})(i),{id:u,runtime:d,menus:m}=this,g=xe(0,c,l),f=((e,t,r)=>{if(t&&0!==t.length)return Object.fromEntries(t.map(((t,n)=>{if(Oe(t))return Object.assign(Object.assign({},t),{dataURI:t.uri});const a={};if(a.type=Te(t),h(t))return a;const{defaultValue:o,options:i}=t;return Ie(a,e,n,o),be(a,i,r),a})).reduce(((e,t,r)=>e.set(Ee(r),t)),new Map))})(r,l,m),b={opcode:r,text:g,blockType:s,arguments:f};if(s===t.Button){const e=((e,t)=>`${e}_${t}`)(u,r);A(d,e,o.bind(this)),b.func=e}else{this[Se(r)]=ke(this,o,((e,t)=>{const r=e.map(Te),n=we(e);return null!=t||(t=r.map(((e,t)=>Ee(t)))),v(r,n,t),r.map(((e,r)=>({type:e,name:t[r],handler:n[r]})))})(l))}return b}collectMenus(){const{isSimpleStatic:e,isSimpleDynamic:t,isStaticWithReporters:r,isDynamicWithReporters:n}=he;return Object.fromEntries(this.menus.map(((a,o)=>{if(e(a))return ye(a,!1);if(t(a))return this.registerDynamicMenu(a,!1,o);if(r(a))return ye(a.items,!0);if(n(a))return this.registerDynamicMenu(a.getItems,!0,o);throw new Error("Unable to process menu")})).reduce(((e,t,r)=>e.set(ge(r),t)),new Map))}registerDynamicMenu(e,t,r){const n=`internal_dynamic_${r}`;return this[n]=()=>e.call(this).map((e=>e)).map(fe),{acceptReporters:t,items:n}}}}function Ae(e){return function(t,r){const n=t.name,a=Se(n);return r.addInitializer((function(){this.pushBlock(n,e,t)})),function(){return this[a].call(this,...arguments)}}}const Ne=e=>t=>r=>{const{operation:n,argumentMethods:a}=p(t)?t.call(r,r):t;return a&&Ce(e,a,r),Object.assign(Object.assign({},e),{operation:n})},_e=e=>(...t)=>{if(0===t.length||!t[0])return Ae(e);const r=t[0];return Ae((t=>{const{argumentMethods:n}=p(r)?r.call(t,t):r;return Ce(e,n,t),e}))},Ce=(e,t,r)=>{const n=e.args?e.args:e.arg?[e.arg]:[];Object.entries(t).map((([e,{handler:t,getItems:r}])=>({arg:n[parseInt(e)],methods:{handler:t,getItems:r}}))).forEach((({arg:e,methods:t})=>Object.entries(t).filter((([e,t])=>void 0!==t)).map((([e,t])=>[e,t.bind(r)])).forEach((([t,r])=>Le(e,t,r)))))},Le=(e,t,r)=>{p(e.options)&&(e.options=r),e.options[t]=r},Be=e=>{if(m(e))throw new Error(`Block defined as string, unexpected! ${e}`);return e},Me=e=>Array.from(e.blocks.map(Be).reduce(((t,r)=>((e,t,r)=>{const{opcode:n,arguments:a,blockType:o}=t,{text:i,orderedNames:c}=Pe(t);if(!a)return e.set(n,{type:o,text:i});const l=Object.entries(null!=a?a:{}).map((e=>{var[t,n]=e,{menu:a}=n,o=s(n,["menu"]);return Object.assign({options:Ve(r,a),name:t,menu:a},o)})).sort((({name:e},{name:t})=>c.indexOf(e)<c.indexOf(t)?-1:1)).map((e=>s(e,["name"]))),{length:u}=l;return u>=2?e.set(n,{type:o,text:i,args:l}):e.set(n,{type:o,text:i,arg:l[0]})})(t,r,e)),new Map).entries()),Pe=({arguments:e,text:t})=>{const r="Error: This should have been overridden by legacy support";if(!e)return{orderedNames:null,text:r};const n=Object.keys(e).map((e=>({name:e,template:`[${e}]`}))).sort((({template:e},{template:r})=>t.indexOf(e)<t.indexOf(r)?-1:1));return 0===n.length?{orderedNames:null,text:r}:{orderedNames:n.map((({name:e})=>e)),text:()=>r}},je={getItems:()=>"Error: This should have been filled in."},Ue={handler:()=>"Error: This should have been filled in."},$e=e=>m(e),Ve=(e,t)=>{const r=t?e.menus[t]:void 0;if(!r)return;if($e(r))return je.getItems;const{items:n,acceptReporters:a}=r;return $e(n)?a?Object.assign(Object.assign({acceptsReporters:a},Ue),je):je.getItems:a?Object.assign({acceptsReporters:a,items:[...n]},Ue):[...n]},Fe=(e,t)=>{if(m(e))throw new Error("Block was unexpectedly a string: "+e);return!!t.has(e.opcode)||(console.error(`Could not find legacy opcode ${e.opcode} within currently defined blocks`),!1)},Ge=e=>{if(typeof e.legacy.menu!=typeof e.modern.menu)throw new Error("Menus don't match");return e},He=e=>{if($e(e))return e;if($e(e.items))return e.items;throw new Error("Menu is not dynamic: "+e)};function ze(e){return class extends e{constructor(){super(...arguments),this.__isLegacy=!0,this.orderArgumentNamesByBlock=new Map,this.getArgNames=e=>{const{opcode:t}=e;if(!this.orderArgumentNamesByBlock.has(t)){const{orderedNames:r}=Pe(e);this.orderArgumentNamesByBlock.set(t,r)}return this.orderArgumentNamesByBlock.get(t)}}getInfo(){if(!this.validatedInfo){const e=super.getInfo();this.validatedInfo=this.validateAndAttach(e)}return this.validatedInfo}validateAndAttach(e){var{id:t,blocks:r,menus:n}=e,a=s(e,["id","blocks","menus"]);const{id:o,blocks:i,menus:c}=this.getLegacyInfo(),l=[...r];if(t!==o)throw new Error(`ID mismatch! Legacy id: ${o} vs. current id: ${t}`);const u=l.reduce(((e,t,r)=>{var{opcode:n}=t,a=s(t,["opcode"]);return e.set(n,Object.assign(Object.assign({},a),{index:r}))}),new Map),d=this,m=i.map((e=>Fe(e,u)?e:void 0)).filter(Boolean).map((e=>{const{opcode:t,arguments:r}=e,{index:a,arguments:o}=u.get(t),i=this.getArgNames(e);if(!i)return{replaceAt:{index:a,block:e}};const s=this[Se(t)];this[t]=((...[e,t])=>s.call(d,(e=>i.reduce(((t,r,n)=>b(t,n,e[r])),{}))(e),t)).bind(d);const l=i.map(((e,t)=>({legacy:r[e],modern:o[t]}))).map(Ge).map((({legacy:{menu:e},modern:{menu:t}})=>({legacyName:e,modernName:t}))).filter((e=>e.legacyName&&e.modernName)).map((({legacyName:e,modernName:t})=>({legacyName:e,modernName:t,legacy:c[e],modern:n[t]}))).map((({legacy:e,modern:t,legacyName:r,modernName:n})=>$e(e)||$e(e.items)?{type:"dynamic",legacy:r,modern:n,methods:{legacy:He(e),modern:He(t)}}:{type:"static",legacy:r,modern:n}));return{menuUpdates:l,replaceAt:{index:a,block:e}}}));return m.forEach((({replaceAt:{index:e,block:t}})=>l[e]=t)),m.map((({menuUpdates:e})=>e)).flat().filter(Boolean).map((e=>{const{legacy:t}=e;if(t in n)throw new Error(`Somehow, there was already a menu called ${t}, which will cause issues in the next step.`);return e})).forEach((({type:e,legacy:t,methods:r})=>{n[t]=c[t],"dynamic"===e&&(d[r.legacy]=()=>d[r.modern]())})),Object.assign({id:t,blocks:l,menus:n},a)}}}const We={image:"image-data",canvas:"canvas"};function Ke(e){return class extends e{constructor(){super(...arguments),this.videoDimensions={width:480,height:360}}get video(){var e,t;return null!==(e=this.videoDevice)&&void 0!==e||(this.videoDevice=null===(t=this.runtime.ioDevices)||void 0===t?void 0:t.video),this.videoDevice}getVideoFrame(e){var t;return null===(t=this.video)||void 0===t?void 0:t.getFrame({format:We[e]})}setVideoTransparency(e){var t;null===(t=this.video)||void 0===t||t.setPreviewGhost(e)}enableVideo(e=!0){this.video&&(this.video.enableVideo(),this.video.provider.mirror=e)}disableVideo(){var e;null===(e=this.video)||void 0===e||e.disableVideo()}}}const Je={customArguments:function(e){class t extends(de(e,X)){constructor(){super(...arguments),this.makeCustomArgument=({component:e,initial:t,acceptReportersHandler:n})=>{var a;null!==(a=this.argumentManager)&&void 0!==a||(this.argumentManager=new ae);const o=this.argumentManager.add(t),i=()=>[{text:T,value:JSON.stringify({component:e,id:o})}];return{type:r.Custom,defaultValue:o,options:void 0===n?i:{acceptsReports:!0,getItems:i,handler:n}}},this.argumentManager=null}get customArgumentManager(){return this.argumentManager}getOrCreateCustomArgumentManager(){var e;return null!==(e=this.argumentManager)&&void 0!==e||(this.argumentManager=new ae),this.argumentManager}[I](e){if(1!==e.length)return!1;const t=e[0];if("object"!=typeof t)return!1;const{text:r}=t;return r===T}processCustomArgumentHack(e,[{value:t}],r){var n;const{id:a,customArgumentManager:o}=this,{component:i,id:s}=JSON.parse(t);switch(e[O]){case pe.Init:return o.getCurrentEntries();case pe.DropdownClose:{const e=o.tryResolve();return e?[[e.entry.text,e.id]]:o.getCurrentEntries()}case pe.DrowpdownOpen:{const t=e[x],c=null!==(n=null==t?void 0:t.value)&&void 0!==n?n:s,l=o.getEntry(c),[u,d]=o.request();return oe(r(a,i),{setter:d,current:l,extension:this}),[["Apply",u]]}}throw new Error("Error during processing -- Context:"+pe)}}return t},ui:function(e){return class extends e{openUI(e,t){const{id:r,name:n,runtime:a}=this;D(a,{id:r,name:n,component:e.replace(".svelte",""),label:t})}}},customSaveData:X,video:Ke,drawable:function(e){return class extends e{createDrawable(e){var t;null!==(t=this.renderer)&&void 0!==t||(this.renderer=this.runtime.renderer);const{renderer:r}=this;if(!r)return null;const a=r.createBitmapSkin(e,1),o=r.createDrawable(n.VideoLayer);r.updateDrawableSkinId(o,a);const i=e=>r.updateDrawableEffect(o,"ghost",e),s=(e=!0)=>r.updateDrawableVisible(o,e);return i(0),s(!0),{setTransparency:i,setVisible:s,update:e=>r.updateBitmapSkin(a,e,1),destroy:()=>{s(!1),r.destroyDrawable(o,n.VideoLayer),r.destroySkin(a)}}}}},addCostumes:function(e){return class extends e{addCostume(e,t,r,n){return u(this,void 0,void 0,(function*(){if(!(e=>"renderer"in e)(e))return console.warn("Costume could not be added is the supplied target wasn't a rendered target");null!=n||(n=`${this.id}_generated_${Date.now()}`),null!=ce||(ce=new se),null!=le||(le=(e=>{const t=document.body.appendChild(document.createElement("canvas")),r=({width:e,height:r})=>{t.width!==e&&(t.width=e),t.height!==r&&(t.height=r)};r(e),t.hidden=!0;const n=t.getContext("2d");return{getDataURL(e){const{width:a,height:o}=e;r(e),n.save(),n.clearRect(0,0,a,o),n.putImageData(e,0,0);const i=t.toDataURL("image/png");return n.restore(),i}}})(t));const{storage:a}=this.runtime,o=a.DataFormat.PNG,i=a.AssetType.ImageBitmap,s=yield ce.importBitmap(le.getDataURL(t)),c=a.createAsset(i,o,s,null,!0),{assetId:l}=c,u={name:n,dataFormat:o,asset:c,md5:`${l}.${o}`,assetId:l};yield this.runtime.addCostume(u);const{length:d}=e.getCostumes();e.addCostume(u,d),"add and set"===r&&e.setCostume(d)}))}}},legacySupport:ze,setTransparencyBlock:function(e){let t=(()=>{var t;let r,n=[];return t=class extends(de(e,Ke)){setVideoTransparencyBlock(e){this.setVideoTransparency(e)}constructor(){super(...arguments),l(this,n)}},r=[Ae({type:"command",text:e=>`Set video to ${e}% transparent`,arg:"number"})],c(t,null,r,{kind:"method",name:"setVideoTransparencyBlock",static:!1,private:!1,access:{has:e=>"setVideoTransparencyBlock"in e,get:e=>e.setVideoTransparencyBlock}},null,n),t})();return t},toggleVideoBlock:function(e){let t=(()=>{var t;let r,n=[];return t=class extends(de(e,Ke)){toggleVideoBlock(e){if("off"===e)return this.disableVideo();this.enableVideo("on"===e)}constructor(){super(...arguments),l(this,n)}},r=[Ae({type:"command",text:e=>`Set video feed to ${e}`,arg:{type:"string",options:["on","off","on (flipped)"]}})],c(t,null,r,{kind:"method",name:"toggleVideoBlock",static:!1,private:!1,access:{has:e=>"toggleVideoBlock"in e,get:e=>e.toggleVideoBlock}},null,n),t})();return t}};class qe{internal_init(){return u(this,void 0,void 0,(function*(){const e=this.runtime;return yield Promise.resolve(this.init({runtime:e,get extensionManager(){return e.getExtensionManager()}}))}))}constructor(e,t,r,n){this.runtime=e,this.name=t,this.id=r,this.blockIconURI=n}}const Xe=new Map;class Ze extends qe{constructor(e){super(...arguments),Xe.set(this.id,this)}}function Qe(e,t){return class extends e{supports(e){return t.includes(e)}}}const Ye="__registerMenuDetials",et=(e,...t)=>{(e=>{var t;"undefined"==typeof window&&(null===(t=null===global||void 0===global?void 0:global[Ye])||void 0===t||t.call(global,e))})(e);const r=De(Qe(Ze,t));if(!t)return r;const{Result:n,allSupported:a}=tt(r,t);return Qe(n,Array.from(a))},tt=(e,t,r=new Set)=>{const n=t.filter((e=>!r.has(e))).map((e=>(r.add(e),e))).map((e=>Je[e])).reduce(((e,t)=>{const{dependencies:n,MixedIn:a}=(e=>{let t;null!=me||(me=Object.entries(Je).reduce(((e,[t,r])=>e.set(r,t)),new Map)),ue.push((e=>{e.map((e=>e)).forEach((e=>{if(!me.has(e))throw new Error("Unkown mixin dependency! "+e);null!=t||(t=[]),t.push(me.get(e))}))}));const r=e();return{dependencies:t,MixedIn:r}})((()=>t(e)));return n?tt(a,n,r).Result:a}),e);return{Result:n,allSupported:r}};class rt extends(et(void 0,"ui","customSaveData","customArguments")){internal_init(){const e=Object.create(null,{internal_init:{get:()=>super.internal_init}});return u(this,void 0,void 0,(function*(){yield e.internal_init.call(this);const t=this.defineBlocks(),r=this;for(const e in t){this.validateOpcode(e);const n=t[e],{operation:a,text:o,arg:i,args:s,type:c}=p(n)?n.call(this,this):n;this.pushBlock(e,i?{text:o,type:c,arg:i}:s?{text:o,type:c,args:s}:{text:o,type:c},a);const l=Se(e);this[e]=function(){return r[l].call(r,...arguments)}}}))}validateOpcode(e){if(!(e in this))return;throw new Error(`The Extension has a member defined as '${e}', but that name should be reserved for the opcode of the block with the same name. Please rename your member, and attach the "validateGenericExtension" decorator to your class so that this can be an error in your IDE and not at runtime.`)}}return e.ArgumentType=r,e.AuxiliaryExtensionInfo="AuxiliaryExtensionInfo",e.BlockType=t,e.Branch={Exit:0,Enter:1,First:1,Second:2,Third:3,Fourth:4,Fifth:5,Sixth:6,Seventh:7},e.ConstructableExtension=qe,e.CustomArgumentManager=ae,e.Extension=rt,e.ExtensionBase=Ze,e.FrameworkID="ExtensionFramework",e.Language=o,e.LanguageKeys=i,e.LayerGroups=a,e.RuntimeEvent={ScriptGlowOn:"SCRIPT_GLOW_ON",ScriptGlowOff:"SCRIPT_GLOW_OFF",BlockGlowOn:"BLOCK_GLOW_ON",BlockGlowOff:"BLOCK_GLOW_OFF",HasCloudDataUpdate:"HAS_CLOUD_DATA_UPDATE",TurboModeOn:"TURBO_MODE_ON",TurboModeOff:"TURBO_MODE_OFF",RecordingOn:"RECORDING_ON",RecordingOff:"RECORDING_OFF",ProjectStart:"PROJECT_START",ProjectRunStart:"PROJECT_RUN_START",ProjectRunStop:"PROJECT_RUN_STOP",ProjectStopAll:"PROJECT_STOP_ALL",StopForTarget:"STOP_FOR_TARGET",VisualReport:"VISUAL_REPORT",ProjectLoaded:"PROJECT_LOADED",ProjectChanged:"PROJECT_CHANGED",ToolboxExtensionsNeedUpdate:"TOOLBOX_EXTENSIONS_NEED_UPDATE",TargetsUpdate:"TARGETS_UPDATE",MonitorsUpdate:"MONITORS_UPDATE",BlockDragUpdate:"BLOCK_DRAG_UPDATE",BlockDragEnd:"BLOCK_DRAG_END",ExtensionAdded:"EXTENSION_ADDED",ExtensionFieldAdded:"EXTENSION_FIELD_ADDED",PeripheralListUpdate:"PERIPHERAL_LIST_UPDATE",PeripheralConnected:"PERIPHERAL_CONNECTED",PeripheralDisconnected:"PERIPHERAL_DISCONNECTED",PeripheralRequestError:"PERIPHERAL_REQUEST_ERROR",PeripheralConnectionLostError:"PERIPHERAL_CONNECTION_LOST_ERROR",PeripheralScanTimeout:"PERIPHERAL_SCAN_TIMEOUT",MicListening:"MIC_LISTENING",BlocksInfoUpdate:"BLOCKSINFO_UPDATE",RuntimeStarted:"RUNTIME_STARTED",RuntimeDisposed:"RUNTIME_DISPOSED",BlocksNeedUpdate:"BLOCKS_NEED_UPDATE"},e.SaveDataHandler=class{constructor(e){this.hooks=e}},e.ScratchBlocksConstants={OutputShapeHexagonal:1,OutputShapeRound:2,OutputShapeSquare:3},e.StageLayering=n,e.TargetType={Sprite:"sprite",Stage:"stage"},e.VariableType={Scalar:"",List:"list",BrooadcastMessage:"broadcast_msg"},e.activeClass=!0,e.assertSameLength=v,e.block=Ae,e.buttonBlock=function(e){return Ae({text:e,type:t.Button})},e.castToType=te,e.closeDropdownState=k,e.color=G,e.copyTo=({target:e,source:t})=>{for(const r in t)r in e&&(e[r]=t[r])},e.customArgumentCheck=I,e.customArgumentFlag=T,e.decode=e=>[...[...e.matchAll(K)].reduce(((e,t)=>{const[r,n]=t;return e.set(r,String.fromCharCode(n))}),new Map)].reduce(((e,[t,r])=>J(e,t,r)),`${e}`),e.dropdownEntryFlag=x,e.dropdownStateFlag=O,e.encode=e=>{const t=[...e.matchAll(z)].reduce(((e,t)=>(t[0].split("").forEach((t=>e.add(t))),e)),new Set);return[...t].map((e=>({char:e,code:e.charCodeAt(0)}))).reduce(((e,{char:t,code:r})=>J(e,t,`${W[0]}${r}${W[1]}`)),`${e}`)},e.extension=et,e.extensionsMap=Xe,e.fetchWithTimeout=function(e,t){return u(this,void 0,void 0,(function*(){const{timeout:r}=t,n=new AbortController,a=setTimeout((()=>n.abort()),r),o=yield fetch(e,Object.assign(Object.assign({},t),{signal:n.signal}));return clearTimeout(a),o}))},e.getTextFromMenuItem=e=>"object"==typeof e?e.text:e,e.getValueFromMenuItem=e=>"object"==typeof e?e.value:e,e.identity=g,e.initDropdownState=S,e.isDynamicMenu=$e,e.isFunction=p,e.isPrimitive=h,e.isString=m,e.isValidID=e=>H.test(e),e.legacy=(e,t)=>({for(){const t=Me(e).map((([e,t])=>({key:e,definer:Ne(t),decorator:_e(t)}))),r=t.reduce(((e,{key:t,definer:r})=>(e[t]=r,e)),{}),n=t.reduce(((e,{key:t,decorator:r})=>(e[t]=r,e)),{}),a=()=>{throw new Error("This property is not meant to be accessed, and is instead solely for type inference / documentation purposes.")};return{legacyExtension:()=>(t,r)=>{class n extends(function(e,t){class r extends(ze(e)){getLegacyInfo(){return t}}return r}(t,e)){constructor(){super(...arguments),this.originalClassName=r.name}}return n},legacyDefinition:r,legacyBlock:n,ReservedNames:{get Menus(){return a()},get Blocks(){return a()},get ArgumentNamesByBlock(){return a()}}}}}),e.loadExternalScript=(e,t,r)=>{const n=document.createElement("script");n.onload=t,n.onerror=null!=r?r:()=>{throw new Error(`Error loading endpoint: ${e}`)},n.src=e,n.async=!0,document.body.appendChild(n)},e.openDropdownState=R,e.openUI=D,e.openUIEvent=w,e.parseText=Pe,e.px=e=>`${e}px`,e.reactiveInvoke=(e,t,r)=>e[t](...r),e.reactiveSet=(e,t,r)=>{e[t]=r},e.registerButtonCallback=A,e.registerButtonCallbackEvent=E,e.registerExtensionDefinitionCallback=e=>global[Ye]=t=>{t&&(e(t),delete global[Ye])},e.renderToDropdown=oe,e.rgbToHex=e=>(e=>{e<0&&(e+=16777216);let t=Number(e).toString(16);return t=`#${"000000".substr(0,6-t.length)}${t}`,t})(function(e){return(e.r<<16)+(e.g<<8)+e.b}(e)),e.saveDataKey=q,e.set=b,e.splitOnCapitals=e=>e.split(/(?=[A-Z])/),e.tryCastToArgumentType=(e,t,r)=>{try{return te(e,t)}catch(e){return r(t)}},e.typesafeCall=y,e.untilCondition=function(e,t=100){return u(this,void 0,void 0,(function*(){let r;for(;!e();)yield new Promise((e=>{clearTimeout(r),r=setTimeout(e,t)}));clearTimeout(r)}))},e.untilExternalGlobalVariableLoaded=(e,t)=>u(void 0,void 0,void 0,(function*(){return window[t]||(yield f(e)),window[t]})),e.untilExternalScriptLoaded=f,e.untilObject=d,e.untilReady=function(e,t=100){return u(this,void 0,void 0,(function*(){let r;for(;!e.ready;)yield new Promise((e=>{clearTimeout(r),r=setTimeout(e,t)}));clearTimeout(r)}))},e.untilTimePassed=function(e){return u(this,void 0,void 0,(function*(){let t;return yield new Promise((r=>t=setTimeout((()=>{clearTimeout(t),r()}),e)))}))},e.validGenericExtension=(...e)=>function(e,t){},Object.defineProperty(e,"__esModule",{value:!0}),e}({});//# sourceMappingURL=ExtensionFramework.js.map
