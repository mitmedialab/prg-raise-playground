var ExtensionFramework=function(e){"use strict";const t={Boolean:"Boolean",Button:"button",Command:"command",Conditional:"conditional",Event:"event",Hat:"hat",Loop:"loop",Reporter:"reporter"},r={Angle:"angle",Boolean:"Boolean",Color:"color",Number:"number",String:"string",Matrix:"matrix",Note:"note",Image:"image",Custom:"custom"},n={BackgroundLayer:"background",VideoLayer:"video",PenLayer:"pen",SpriteLayer:"sprite"},a=[n.VideoLayer,n.SpriteLayer,n.BackgroundLayer,n.PenLayer],o={"Аҧсшәа":"ab","العربية":"ar","አማርኛ":"am",Azeri:"az",Bahasa_Indonesia:"id","Беларуская":"be","Български":"bg","Català":"ca","Česky":"cs",Cymraeg:"cy",Dansk:"da",Deutsch:"de",Eesti:"et","Ελληνικά":"el",English:"en","Español":"es","Español_Latinoamericano":"es-419",Euskara:"eu","فارسی":"fa","Français":"fr",Gaeilge:"ga","Gàidhlig":"gd",Galego:"gl","한국어":"ko","עִבְרִית":"he",Hrvatski:"hr",isiZulu:"zu","Íslenska":"is",Italiano:"it","ქართული_ენა":"ka",Kiswahili:"sw","Kreyòl_ayisyen":"ht","کوردیی_ناوەندی":"ckb","Latviešu":"lv","Lietuvių":"lt",Magyar:"hu","Māori":"mi",Nederlands:"nl","日本語":"ja","にほんご":"ja-Hira","Norsk_Bokmål":"nb",Norsk_Nynorsk:"nn","Oʻzbekcha":"uz","ไทย":"th","ភាសាខ្មែរ":"km",Polski:"pl","Português":"pt","Português_Brasileiro":"pt-br",Rapa_Nui:"rap","Română":"ro","Русский":"ru","Српски":"sr","Slovenčina":"sk","Slovenščina":"sl",Suomi:"fi",Svenska:"sv","Tiếng_Việt":"vi","Türkçe":"tr","Українська":"uk","简体中文":"zh-cn","繁體中文":"zh-tw"},i=Object.keys(o);async function s(e,t=100){let r,n=e();for(;!n;)await new Promise((e=>{clearTimeout(r),r=setTimeout(e,t)})),n=e();return clearTimeout(r),n}const c=e=>"string"==typeof e||e instanceof String,l=e=>"[object Function]"===Object.prototype.toString.call(e)||"function"==typeof e||e instanceof Function,u=e=>e!==Object(e),d=e=>e,m=async e=>{const t=new Promise(((t,r)=>{const n=document.createElement("script");n.onload=t,n.onerror=r,n.async=!0,n.src=e,document.body.appendChild(n)}));await t},p=(e,t,...r)=>e.call(t,...r),h=(e,t,r)=>(e[t]=r,e),g=(...e)=>{const{size:t}=e.reduce(((e,{length:t})=>e.add(t)),new Set);if(1!==t)throw new Error("Zip failed because collections weren't equal length")};const f="OPEN_UI_FROM_EXTENSION",y="REGISTER_BUTTON_CALLBACK_FROM_EXTENSION",w="internal_IsCustomArgument",b="isCustomArgumentHack",E="dropdownState",T="dropdownEntry",I="init",v="open",S="close",x=(e,t)=>e.emit(f,t),k=(e,t,r)=>{e.emit(y,t),e.on(t,r)};class R{constructor(e){this.root=e}get(...e){return`var(--${this.root}-${e.join("-")})`}primary(...e){return this.get("primary",...e)}secondary(...e){return this.get("secondary",...e)}tertiary(...e){return this.get("tertiary",...e)}transparent(...e){return this.get("transparent",...e)}light(...e){return this.get("light",...e)}}const D=new R("ui"),O=new R("text"),A=new R("motion"),N=new R("red"),_=new R("sound"),C=new R("control"),L=new R("data"),B=new R("pen"),M=new R("error"),P=new R("extensions"),U=new R("extensions"),$={ui:{primary:D.primary(),secondary:D.secondary(),tertiary:D.tertiary(),modalOverlay:D.get("modal","overlay"),white:D.get("white"),whiteDim:D.get("white","dim"),whiteTransparent:D.get("white","transparent"),transparent:D.transparent(),blackTransparent:D.get("black","transparent")},text:{primary:O.primary(),primaryTransparent:O.transparent()},motion:{primary:A.primary(),tertiary:A.tertiary(),transparent:A.get("transparent"),lightTansparent:A.light("transparent")},red:{primary:N.primary(),tertiary:N.tertiary()},sound:{primary:_.primary(),tertiary:_.tertiary()},control:{primary:C.primary()},data:{primary:L.primary()},pen:{primary:B.primary(),transparent:B.transparent()},error:{primary:M.primary(),light:M.light(),transparent:M.transparent()},extensions:{primary:P.primary(),tertiary:P.tertiary(),light:P.light(),transparent:P.transparent()},drop:{highlight:U.get("highlight")}},V=new RegExp("^[a-z0-9]+$","i"),F=new RegExp("[^a-z0-9]+","gi"),j=["prg","prg".split("").reverse().join("")],G=new RegExp(`${j[0]}([0-9]+)${j[1]}`,"g"),H=(e,t,r)=>e.replaceAll(t,r),z="customSaveDataPerExtension";function W(e){return class extends e{constructor(){super(...arguments),this.saveDataHandler=void 0}save(e,t){const{saveDataHandler:r,id:n}=this,a=this.supports("customArguments")?this.customArgumentManager:null,o=r?.hooks.onSave(this)??{};if(a?.saveTo(o),0===Object.keys(o).length)return;const i=e[z];i?i[n]=o:e[z]={[n]:o},t.add(n)}load(e){if(!e)return;const{saveDataHandler:t,id:r}=this,n=z in e?e[z][r]:null;n&&(t?.hooks.onLoad(this,n),this.supports("customArguments")&&this.getOrCreateCustomArgumentManager().loadFrom(n))}}}class K{static get RGB_BLACK(){return{r:0,g:0,b:0}}static get RGB_WHITE(){return{r:255,g:255,b:255}}static decimalToHex(e){e<0&&(e+=16777216);let t=Number(e).toString(16);return t=`#${"000000".substr(0,6-t.length)}${t}`,t}static decimalToRgb(e){const t=e>>24&255;return{r:e>>16&255,g:e>>8&255,b:255&e,a:t>0?t:255}}static hexToRgb(e){e=e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,((e,t,r,n)=>t+t+r+r+n+n));const t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:null}static rgbToHex(e){return K.decimalToHex(K.rgbToDecimal(e))}static rgbToDecimal(e){return(e.r<<16)+(e.g<<8)+e.b}static hexToDecimal(e){return K.rgbToDecimal(K.hexToRgb(e))}static hsvToRgb(e){let t=e.h%360;t<0&&(t+=360);const r=Math.max(0,Math.min(e.s,1)),n=Math.max(0,Math.min(e.v,1)),a=Math.floor(t/60),o=t/60-a,i=n*(1-r),s=n*(1-r*o),c=n*(1-r*(1-o));let l,u,d;switch(a){default:case 0:l=n,u=c,d=i;break;case 1:l=s,u=n,d=i;break;case 2:l=i,u=n,d=c;break;case 3:l=i,u=s,d=n;break;case 4:l=c,u=i,d=n;break;case 5:l=n,u=i,d=s}return{r:Math.floor(255*l),g:Math.floor(255*u),b:Math.floor(255*d)}}static rgbToHsv(e){const t=e.r/255,r=e.g/255,n=e.b/255,a=Math.min(Math.min(t,r),n),o=Math.max(Math.max(t,r),n);let i=0,s=0;if(a!==o){i=60*((t===a?3:r===a?5:1)-(t===a?r-n:r===a?n-t:t-r)/(o-a))%360,s=(o-a)/o}return{h:i,s:s,v:o}}static mixRgb(e,t,r){if(r<=0)return e;if(r>=1)return t;const n=1-r;return{r:n*e.r+r*t.r,g:n*e.g+r*t.g,b:n*e.b+r*t.b}}}const J=K;class q{static toNumber(e){if("number"==typeof e)return Number.isNaN(e)?0:e;const t=Number(e);return Number.isNaN(t)?0:t}static toBoolean(e){return"boolean"==typeof e?e:"string"==typeof e?""!==e&&"0"!==e&&"false"!==e.toLowerCase():Boolean(e)}static toString(e){return String(e)}static toRgbColorList(e){const t=q.toRgbColorObject(e);return[t.r,t.g,t.b]}static toRgbColorObject(e){let t;return"string"==typeof e&&"#"===e.substring(0,1)?(t=J.hexToRgb(e),t||(t={r:0,g:0,b:0,a:255})):t=J.decimalToRgb(q.toNumber(e)),t}static isWhiteSpace(e){return null===e||"string"==typeof e&&0===e.trim().length}static compare(e,t){let r=Number(e),n=Number(t);if(0===r&&q.isWhiteSpace(e)?r=NaN:0===n&&q.isWhiteSpace(t)&&(n=NaN),isNaN(r)||isNaN(n)){const r=String(e).toLowerCase(),n=String(t).toLowerCase();return r<n?-1:r>n?1:0}return r===1/0&&n===1/0||r===-1/0&&n===-1/0?0:r-n}static isInt(e){return"number"==typeof e?!!isNaN(e)||e===parseInt(e,10):"boolean"==typeof e||"string"==typeof e&&e.indexOf(".")<0}static get LIST_INVALID(){return"INVALID"}static get LIST_ALL(){return"ALL"}static toListIndex(e,t,r){if("number"!=typeof e){if("all"===e)return r?q.LIST_ALL:q.LIST_INVALID;if("last"===e)return t>0?t:q.LIST_INVALID;if("random"===e||"any"===e)return t>0?1+Math.floor(Math.random()*t):q.LIST_INVALID}return(e=Math.floor(q.toNumber(e)))<1||e>t?q.LIST_INVALID:e}}var X=q;const Z=(e,t)=>{switch(e){case r.String:return`${t}`;case r.Number:return parseFloat(t);case r.Boolean:return JSON.parse(t??!1);case r.Note:case r.Angle:return parseInt(t);case r.Matrix:return Y(t);case r.Color:return X.toRgbColorObject(t);default:throw new Error(`Method not implemented for value of ${t} and type ${e}`)}},Q=e=>1===parseInt(e),Y=e=>{if(25!==e.length)return new Array(5).fill(new Array(5).fill(!1));return e.split("").map(Q).reduce(((e,t,r)=>{const n=Math.floor(r/5);return 0===r%5?e[n]=[t]:e[n].push(t),e}),new Array(5))};class ee{constructor(){this.map=new Map,this.pending=null}clearPending(){this.pending=null}setPending(e){this.pending=e}add(e){const t=ee.GetIdentifier();return this.map.set(t,e),this.clearPending(),t}insert(e,t){return this.map.set(e,t),this.clearPending(),e}request(){this.clearPending();const e=ee.GetIdentifier();return[e,t=>this.setPending({id:e,entry:t})]}tryResolve(){if(!this.pending)return;const{pending:{entry:e,id:t}}=this;return this.map.set(t,e),this.clearPending(),{entry:e,id:t}}getCurrentEntries(){return Array.from(this.map.entries()).filter((([e,t])=>null!==t)).map((([e,{text:t}])=>[t,e]))}getEntry(e){return this.map.get(e)}requiresSave(){this.map.size}saveTo(e){const t=Array.from(this.map.entries()).filter((([e,t])=>null!==t)).map((([e,t])=>({id:e,entry:t})));0!==t.length&&(e[ee.SaveKey]=t)}loadFrom(e){e[ee.SaveKey]?.forEach((({id:e,entry:t})=>{this.map.set(e,t)}))}purgeStaleIDs(){}}ee.SaveKey="internal_customArgumentsSaveData",ee.IsIdentifier=e=>e.startsWith(ee.IdentifierPrefix),ee.GetIdentifier=()=>ee.IdentifierPrefix+(new Date).getTime().toString(),ee.IdentifierPrefix="__customArg__";const te=async(e,t)=>{const r="blocklyDropDownContent",n=document.getElementsByClassName(r);if(1!==n.length)return console.error(`Uh oh! Expected 1 element with class '${r}', but found ${n.length}`);const[a]=n,o=await s((()=>a.children[0]));new e({target:a,anchor:o,props:t}),re(o)},re=e=>{[["goog-menuitem goog-option",e=>{e.margin="auto",e.paddingLeft=e.paddingRight="0px"}],["goog-menuitem-content",e=>e.textAlign="center"]].forEach((([t,r])=>{const n=e.getElementsByClassName(t);console.assert(1===n.length,`Incorrect number of elements found with class: ${t}`),r(n[0].style)}))};class ne{makeImage(){return new Image}makeCanvas(){return document.createElement("canvas")}resize(e,t,r){const n=this.makeCanvas();n.width=t,n.height=e.height;let a=n.getContext("2d");a.imageSmoothingEnabled=!1,a.drawImage(e,0,0,n.width,n.height);const o=this.makeCanvas();return o.width=t,o.height=r,a=o.getContext("2d"),a.imageSmoothingEnabled=!1,a.drawImage(n,0,0,o.width,o.height),o}convertResolution1Bitmap(e,t){const r=new Image;r.src=e,r.onload=()=>{t(null,this.resize(r,2*r.width,2*r.height).toDataURL())},r.onerror=()=>{t("Image load failed")}}getResizedWidthHeight(e,t){const r=480,n=360;if(e<=r&&t<=n)return{width:2*e,height:2*t};if(e<=960&&t<=720)return{width:e,height:t};const a=e/t;return a>=1.3333333333333333?{width:960,height:960/a}:{width:720*a,height:720}}importBitmap(e){return new Promise(((t,r)=>{const n=this.makeImage();n.src=e,n.onload=()=>{const r=this.getResizedWidthHeight(n.width,n.height);if(r.width===n.width&&r.height===n.height)t(this.convertDataURIToBinary(e));else{const e=this.resize(n,r.width,r.height).toDataURL();t(this.convertDataURIToBinary(e))}},n.onerror=()=>{r("Image load failed")}}))}convertDataURIToBinary(e){const t=";base64,",r=e.indexOf(t)+t.length,n=e.substring(r),a=window.atob(n),o=a.length,i=new Uint8Array(new ArrayBuffer(o));for(let e=0;e<o;e++)i[e]=a.charCodeAt(e);return i}}const ae=e=>{const t=document.body.appendChild(document.createElement("canvas")),r=({width:e,height:r})=>{t.width!==e&&(t.width=e),t.height!==r&&(t.height=r)};r(e),t.hidden=!0;const n=t.getContext("2d");return{getDataURL(e){const{width:a,height:o}=e;r(e),n.save(),n.clearRect(0,0,a,o),n.putImageData(e,0,0);const i=t.toDataURL("image/png");return n.restore(),i}}};let oe,ie;const se=e=>"renderer"in e;const ce=[],le=(e,...t)=>(ce.pop()?.(t),e);let ue;const de={DrowpdownOpen:v,DropdownClose:S,Init:I};const me={isSimpleStatic:e=>Array.isArray(e),isSimpleDynamic:e=>l(e),isStaticWithReporters:e=>"items"in e,isDynamicWithReporters:e=>"getItems"in e},pe=e=>`${e}`,he=e=>u(e)?`${e}`:{...e,value:`${e.value}`},ge=(e,t)=>({acceptReporters:t,items:e.map((e=>e)).map(he)}),fe=(e,t,r)=>t?e.menu=((e,t)=>{const r=t.indexOf(e),n=r>=0?r:t.push(e)-1;return`${pe(n)}`})(t,r):null,ye=(e,t,r)=>e,we=e=>l(e),be=(e,t)=>`${e}_${t}`,Ee=e=>e.map((e=>{if(u(e))return d;const{options:t}=e;return(e=>e&&"handler"in e)(t)?t.handler:d})),Te=e=>`${e}`,Ie=e=>u(e)?e:e.type,ve=e=>{const t="args";return"arg"in e&&e.arg?[e.arg]:t in e&&(e[t]?.length??0)>0?e.args:[]},Se=(e,t)=>{const r=e.map(Ie),n=Ee(e);return t??(t=r.map(((e,t)=>Te(t)))),g(r,n,t),r.map(((e,r)=>({type:e,name:t[r],handler:n[r]})))},xe=(e,t,r)=>{if(t&&0!==t.length)return Object.fromEntries(t.map(((t,n)=>{const a={};if(a.type=Ie(t),u(t))return a;const{defaultValue:o,options:i}=t;return ke(a,e,n,o),fe(a,i,r),a})).reduce(((e,t,r)=>e.set(Te(r),t)),new Map))},ke=(e,t,r,n)=>{void 0!==n&&(e.defaultValue=((e,t,r)=>c(e)?ye(e):e)(n))},Re=(e,t,r)=>{if(!r||0===r.length)return t;if(!(e=>!c(e))(t))return ye(t);const n=t,a=r.map(((e,t)=>`[${Te(t)}]`));return ye(n(...a))},De=e=>`internal_${e}`,Oe=(e,t,n)=>e.supports("customArguments")?function(a,o){const i=n.map((({name:t,type:n,handler:o})=>{const i=a[t];if(n===r.Custom){const t=c(i)&&ee.IsIdentifier(i)?this.customArgumentManager.getEntry(i).value:i;return o.call(e,t)}return Z(n,o.call(e,i))}));return t.call(e,...i,o)}:function(r,a){const o=n.map((({name:t,type:n,handler:a})=>Z(n,a.call(e,r[t]))));return t.call(e,...o,a)};function Ae(e){return function(t,r){const n=t.name,a=De(n);return r.addInitializer((function(){this.pushBlock(n,e,t)})),function(){return this[a].call(this,...arguments)}}}const Ne=e=>t=>r=>{const{operation:n,argumentMethods:a}=l(t)?t.call(r,r):t;return a&&Ce(e,a,r),{...e,operation:n}},_e=e=>(...t)=>{if(0===t.length||!t[0])return Ae(e);const r=t[0];return Ae((t=>{const{argumentMethods:n}=l(r)?r.call(t,t):r;return Ce(e,n,t),e}))},Ce=(e,t,r)=>{const n=e.args?e.args:e.arg?[e.arg]:[];Object.entries(t).map((([e,{handler:t,getItems:r}])=>({arg:n[parseInt(e)],methods:{handler:t,getItems:r}}))).forEach((({arg:e,methods:t})=>Object.entries(t).filter((([e,t])=>t)).map((([e,t])=>[e,t.bind(r)])).forEach((([t,r])=>Le(e.options,t,r)))))},Le=(e,t,r)=>{e[t]=r},Be=e=>{if(c(e))throw new Error(`Block defined as string, unexpected! ${e}`);return e},Me=e=>Array.from(e.blocks.map(Be).reduce(((t,r)=>((e,t,r)=>{const{opcode:n,arguments:a,blockType:o}=t,{text:i,orderedNames:s}=Pe(t);if(!a)return e.set(n,{type:o,text:i});const c=Object.entries(a??{}).map((([e,{menu:t,...n}])=>({options:Fe(r,t),name:e,menu:t,...n}))).sort((({name:e},{name:t})=>s.indexOf(e)<s.indexOf(t)?-1:1)).map((({name:e,...t})=>t)),{length:l}=c;return l>=2?e.set(n,{type:o,text:i,args:c}):e.set(n,{type:o,text:i,arg:c[0]})})(t,r,e)),new Map).entries()),Pe=({arguments:e,text:t})=>{const r="Error: This should have been overridden by legacy support";if(!e)return{orderedNames:null,text:r};const n=Object.keys(e).map((e=>({name:e,template:`[${e}]`}))).sort((({template:e},{template:r})=>t.indexOf(e)<t.indexOf(r)?-1:1));return 0===n.length?{orderedNames:null,text:r}:{orderedNames:n.map((({name:e})=>e)),text:()=>r}},Ue={getItems:()=>"Error: This should have been filled in."},$e={handler:()=>"Error: This should have been filled in."},Ve=e=>c(e),Fe=(e,t)=>{const r=t?e.menus[t]:void 0;if(!r)return;if(Ve(r))return Ue.getItems;const{items:n,acceptReporters:a}=r;return Ve(n)?a?{acceptsReporters:a,...$e,...Ue}:Ue.getItems:a?{acceptsReporters:a,items:[...n],...$e}:[...n]},je=(e,t)=>{if(c(e))throw new Error("Block was unexpectedly a string: "+e);return!!t.has(e.opcode)||(console.error(`Could not find legacy opcode ${e.opcode} within currently defined blocks`),!1)},Ge=e=>{if(typeof e.legacy.menu!=typeof e.modern.menu)throw new Error("Menus don't match");return e},He=e=>{if(Ve(e))return e;if(Ve(e.items))return e.items;throw new Error("Menu is not dynamic: "+e)};function ze(e){return class extends e{constructor(){super(...arguments),this.__isLegacy=!0,this.orderArgumentNamesByBlock=new Map,this.getArgNames=e=>{const{opcode:t}=e;if(!this.orderArgumentNamesByBlock.has(t)){const{orderedNames:r}=Pe(e);this.orderArgumentNamesByBlock.set(t,r)}return this.orderArgumentNamesByBlock.get(t)}}getInfo(){if(!this.validatedInfo){const e=super.getInfo();this.validatedInfo=this.validateAndAttach(e)}return this.validatedInfo}validateAndAttach({id:e,blocks:t,menus:r,...n}){const{id:a,blocks:o,menus:i}=this.getLegacyInfo(),s=[...t];if(e!==a)throw new Error(`ID mismatch! Legacy id: ${a} vs. current id: ${e}`);const c=s.reduce(((e,{opcode:t,...r},n)=>e.set(t,{...r,index:n})),new Map),l=this,u=o.map((e=>je(e,c)?e:void 0)).filter(Boolean).map((e=>{const{opcode:t,arguments:n}=e,{index:a,arguments:o}=c.get(t),s=this.getArgNames(e);if(!s)return{replaceAt:{index:a,block:e}};const u=this[De(t)];this[t]=((...[e,t])=>u.call(l,(e=>s.reduce(((t,r,n)=>h(t,n,e[r])),{}))(e),t)).bind(l);const d=s.map(((e,t)=>({legacy:n[e],modern:o[t]}))).map(Ge).map((({legacy:{menu:e},modern:{menu:t}})=>({legacyName:e,modernName:t}))).filter((e=>e.legacyName&&e.modernName)).map((({legacyName:e,modernName:t})=>({legacyName:e,modernName:t,legacy:i[e],modern:r[t]}))).map((({legacy:e,modern:t,legacyName:r,modernName:n})=>Ve(e)||Ve(e.items)?{type:"dynamic",legacy:r,modern:n,methods:{legacy:He(e),modern:He(t)}}:{type:"static",legacy:r,modern:n}));return{menuUpdates:d,replaceAt:{index:a,block:e}}}));return u.forEach((({replaceAt:{index:e,block:t}})=>s[e]=t)),u.map((({menuUpdates:e})=>e)).flat().filter(Boolean).map((e=>{const{legacy:t}=e;if(t in r)throw new Error(`Somehow, there was already a menu called ${t}, which will cause issues in the next step.`);return e})).forEach((({type:e,legacy:t,methods:n})=>{r[t]=i[t],"dynamic"===e&&(l[n.legacy]=()=>l[n.modern]())})),{id:e,blocks:s,menus:r,...n}}}}const We={image:"image-data",canvas:"canvas"};function Ke(e){return class extends e{get video(){return this.videoDevice??(this.videoDevice=this.runtime.ioDevices?.video),this.videoDevice}getVideoFrame(e){return this.video?.getFrame({format:We[e]})}setVideoTransparency(e){this.video?.setPreviewGhost(e)}enableVideo(e=!0){this.video&&(this.video.enableVideo(),this.video.provider.mirror=e)}disableVideo(){this.video?.disableVideo()}}}function Je(e,t,r,n,a,o){function i(e){if(void 0!==e&&"function"!=typeof e)throw new TypeError("Function expected");return e}for(var s,c=n.kind,l="getter"===c?"get":"setter"===c?"set":"value",u=!t&&e?n.static?e:e.prototype:null,d=t||(u?Object.getOwnPropertyDescriptor(u,n.name):{}),m=!1,p=r.length-1;p>=0;p--){var h={};for(var g in n)h[g]="access"===g?{}:n[g];for(var g in n.access)h.access[g]=n.access[g];h.addInitializer=function(e){if(m)throw new TypeError("Cannot add initializers after decoration has completed");o.push(i(e||null))};var f=(0,r[p])("accessor"===c?{get:d.get,set:d.set}:d[l],h);if("accessor"===c){if(void 0===f)continue;if(null===f||"object"!=typeof f)throw new TypeError("Object expected");(s=i(f.get))&&(d.get=s),(s=i(f.set))&&(d.set=s),(s=i(f.init))&&a.push(s)}else(s=i(f))&&("field"===c?a.push(s):d[l]=s)}u&&Object.defineProperty(u,n.name,d),m=!0}function qe(e,t,r){for(var n=arguments.length>2,a=0;a<t.length;a++)r=n?t[a].call(e,r):t[a].call(e);return n?r:void 0}const Xe={customArguments:function(e){class t extends(le(e,W)){constructor(){super(...arguments),this.makeCustomArgument=({component:e,initial:t,acceptReportersHandler:n})=>{this.argumentManager??(this.argumentManager=new ee);const a=this.argumentManager.add(t),o=()=>[{text:w,value:JSON.stringify({component:e,id:a})}];return{type:r.Custom,defaultValue:a,options:void 0===n?o:{acceptsReports:!0,getItems:o,handler:n}}},this.argumentManager=null}get customArgumentManager(){return this.argumentManager}getOrCreateCustomArgumentManager(){return this.argumentManager??(this.argumentManager=new ee),this.argumentManager}[b](e){if(1!==e.length)return!1;const t=e[0];if("object"!=typeof t)return!1;const{text:r}=t;return r===w}processCustomArgumentHack(e,[{value:t}],r){const{id:n,customArgumentManager:a}=this,{component:o,id:i}=JSON.parse(t);switch(e[E]){case de.Init:return a.getCurrentEntries();case de.DropdownClose:{const e=a.tryResolve();return e?[[e.entry.text,e.id]]:a.getCurrentEntries()}case de.DrowpdownOpen:{const t=e[T],s=t?.value??i,c=a.getEntry(s),[l,u]=a.request();return te(r(n,o),{setter:u,current:c,extension:this}),[["Apply",l]]}}throw new Error("Error during processing -- Context:"+de)}}return t},ui:function(e){return class extends e{openUI(e,t){const{id:r,name:n,runtime:a}=this;x(a,{id:r,name:n,component:e.replace(".svelte",""),label:t})}}},customSaveData:W,video:Ke,drawable:function(e){return class extends e{createDrawable(e){this.renderer??(this.renderer=this.runtime.renderer);const{renderer:t}=this;if(!t)return null;const r=t.createBitmapSkin(e,1),a=t.createDrawable(n.VideoLayer);t.updateDrawableSkinId(a,r);const o=e=>t.updateDrawableEffect(a,"ghost",e),i=(e=!0)=>t.updateDrawableVisible(a,e);return o(0),i(!0),{setTransparency:o,setVisible:i,update:e=>t.updateBitmapSkin(r,e,1),destroy:()=>{i(!1),t.destroyDrawable(a,n.VideoLayer),t.destroySkin(r)}}}}},addCostumes:function(e){return class extends e{async addCostume(e,t,r,n){if(!se(e))return console.warn("Costume could not be added is the supplied target wasn't a rendered target");n??(n=`${this.id}_generated_${Date.now()}`),oe??(oe=new ne),ie??(ie=ae(t));const{storage:a}=this.runtime,o=a.DataFormat.PNG,i=a.AssetType.ImageBitmap,s=await oe.importBitmap(ie.getDataURL(t)),c=a.createAsset(i,o,s,null,!0),{assetId:l}=c,u={name:n,dataFormat:o,asset:c,md5:`${l}.${o}`,assetId:l};await this.runtime.addCostume(u);const{length:d}=e.getCostumes();e.addCostume(u,d),"add and set"===r&&e.setCostume(d)}}},legacySupport:ze,setTransparencyBlock:function(e){let t=(()=>{var t;let r,n=[];return t=class extends(le(e,Ke)){setVideoTransparencyBlock(e){this.setVideoTransparency(e)}constructor(){super(...arguments),qe(this,n)}},r=[Ae({type:"command",text:e=>`Set video to ${e}% transparent`,arg:"number"})],Je(t,null,r,{kind:"method",name:"setVideoTransparencyBlock",static:!1,private:!1,access:{has:e=>"setVideoTransparencyBlock"in e,get:e=>e.setVideoTransparencyBlock}},null,n),t})();return t},toggleVideoBlock:function(e){let t=(()=>{var t;let r,n=[];return t=class extends(le(e,Ke)){toggleVideoBlock(e){if("off"===e)return this.disableVideo();this.enableVideo("on"===e)}constructor(){super(...arguments),qe(this,n)}},r=[Ae({type:"command",text:e=>`Set video feed to ${e}`,arg:{type:"string",options:["on","off","on (flipped)"]}})],Je(t,null,r,{kind:"method",name:"toggleVideoBlock",static:!1,private:!1,access:{has:e=>"toggleVideoBlock"in e,get:e=>e.toggleVideoBlock}},null,n),t})();return t}};class Ze{async internal_init(){const e=this.runtime;return await Promise.resolve(this.init({runtime:e,get extensionManager(){return e.getExtensionManager()}}))}constructor(e,t,r,n){this.runtime=e,this.name=t,this.id=r,this.blockIconURI=n}}const Qe=new Map;class Ye extends Ze{constructor(e){super(...arguments),Qe.set(this.id,this)}}function et(e,t){return class extends e{supports(e){return t.includes(e)}}}const tt="__registerMenuDetials",rt=(e,...r)=>{(e=>{"undefined"==typeof window&&global?.[tt]?.(e)})(e);const n=(a=et(Ye,r),class extends a{constructor(){super(...arguments),this.blockMap=new Map,this.menus=[]}pushBlock(e,t,r){if(this.blockMap.has(e))throw new Error(`Attempt to push block with opcode ${e}, but it was already set. This is assumed to be a mistake.`);this.blockMap.set(e,{definition:t,operation:r})}getInfo(){if(!this.info){const{id:e,name:t,blockIconURI:r}=this,n=Array.from(this.blockMap.entries()).map((e=>this.convertToInfo(e)));this.info={id:e,blocks:n,name:t,blockIconURI:r,menus:this.collectMenus()}}return this.info}convertToInfo(e){const[r,n]=e,{definition:a,operation:o}=n,i=we(a)?p(a,this,this):a,{type:s,text:c}=i,l=ve(i),{id:u,runtime:d,menus:m}=this,h={opcode:r,text:Re(r,c,l),blockType:s,arguments:xe(r,l,m)};if(s===t.Button){const e=be(u,r);k(d,e,o.bind(this)),h.func=e}else this[De(r)]=Oe(this,o,Se(l));return h}collectMenus(){const{isSimpleStatic:e,isSimpleDynamic:t,isStaticWithReporters:r,isDynamicWithReporters:n}=me;return Object.fromEntries(this.menus.map(((a,o)=>{if(e(a))return ge(a,!1);if(t(a))return this.registerDynamicMenu(a,!1,o);if(r(a))return ge(a.items,!0);if(n(a))return this.registerDynamicMenu(a.getItems,!0,o);throw new Error("Unable to process menu")})).reduce(((e,t,r)=>e.set(pe(r),t)),new Map))}registerDynamicMenu(e,t,r){const n=`internal_dynamic_${r}`;return this[n]=()=>e.call(this).map((e=>e)).map(he),{acceptReporters:t,items:n}}});var a;if(!r)return n;const{Result:o,allSupported:i}=nt(n,r);return et(o,Array.from(i))},nt=(e,t,r=new Set)=>{const n=t.filter((e=>!r.has(e))).map((e=>(r.add(e),e))).map((e=>Xe[e])).reduce(((e,t)=>{const{dependencies:n,MixedIn:a}=(e=>{let t;ue??(ue=Object.entries(Xe).reduce(((e,[t,r])=>e.set(r,t)),new Map)),ce.push((e=>{e.map((e=>e)).forEach((e=>{if(!ue.has(e))throw new Error("Unkown mixin dependency! "+e);t??(t=[]),t.push(ue.get(e))}))}));const r=e();return{dependencies:t,MixedIn:r}})((()=>t(e)));return n?nt(a,n,r).Result:a}),e);return{Result:n,allSupported:r}};class at extends(rt(void 0,"ui","customSaveData","customArguments")){async internal_init(){await super.internal_init();const e=this.defineBlocks(),t=this;for(const r in e){this.validateOpcode(r);const n=e[r],{operation:a,text:o,arg:i,args:s,type:c}=l(n)?n.call(this,this):n;this.pushBlock(r,i?{text:o,type:c,arg:i}:s?{text:o,type:c,args:s}:{text:o,type:c},a);const u=De(r);this[r]=function(){return t[u].call(t,...arguments)}}}validateOpcode(e){if(!(e in this))return;throw new Error(`The Extension has a member defined as '${e}', but that name should be reserved for the opcode of the block with the same name. Please rename your member, and attach the "validateGenericExtension" decorator to your class so that this can be an error in your IDE and not at runtime.`)}}return e.ArgumentType=r,e.BlockType=t,e.Branch={Exit:0,Enter:1,First:1,Second:2,Third:3,Fourth:4,Fifth:5,Sixth:6,Seventh:7},e.ConstructableExtension=Ze,e.CustomArgumentManager=ee,e.Extension=at,e.ExtensionBase=Ye,e.FrameworkID="ExtensionFramework",e.Language=o,e.LanguageKeys=i,e.LayerGroups=a,e.RuntimeEvent={ScriptGlowOn:"SCRIPT_GLOW_ON",ScriptGlowOff:"SCRIPT_GLOW_OFF",BlockGlowOn:"BLOCK_GLOW_ON",BlockGlowOff:"BLOCK_GLOW_OFF",HasCloudDataUpdate:"HAS_CLOUD_DATA_UPDATE",TurboModeOn:"TURBO_MODE_ON",TurboModeOff:"TURBO_MODE_OFF",RecordingOn:"RECORDING_ON",RecordingOff:"RECORDING_OFF",ProjectStart:"PROJECT_START",ProjectRunStart:"PROJECT_RUN_START",ProjectRunStop:"PROJECT_RUN_STOP",ProjectStopAll:"PROJECT_STOP_ALL",StopForTarget:"STOP_FOR_TARGET",VisualReport:"VISUAL_REPORT",ProjectLoaded:"PROJECT_LOADED",ProjectChanged:"PROJECT_CHANGED",ToolboxExtensionsNeedUpdate:"TOOLBOX_EXTENSIONS_NEED_UPDATE",TargetsUpdate:"TARGETS_UPDATE",MonitorsUpdate:"MONITORS_UPDATE",BlockDragUpdate:"BLOCK_DRAG_UPDATE",BlockDragEnd:"BLOCK_DRAG_END",ExtensionAdded:"EXTENSION_ADDED",ExtensionFieldAdded:"EXTENSION_FIELD_ADDED",PeripheralListUpdate:"PERIPHERAL_LIST_UPDATE",PeripheralConnected:"PERIPHERAL_CONNECTED",PeripheralDisconnected:"PERIPHERAL_DISCONNECTED",PeripheralRequestError:"PERIPHERAL_REQUEST_ERROR",PeripheralConnectionLostError:"PERIPHERAL_CONNECTION_LOST_ERROR",PeripheralScanTimeout:"PERIPHERAL_SCAN_TIMEOUT",MicListening:"MIC_LISTENING",BlocksInfoUpdate:"BLOCKSINFO_UPDATE",RuntimeStarted:"RUNTIME_STARTED",RuntimeDisposed:"RUNTIME_DISPOSED",BlocksNeedUpdate:"BLOCKS_NEED_UPDATE"},e.SaveDataHandler=class{constructor(e){this.hooks=e}},e.ScratchBlocksConstants={OutputShapeHexagonal:1,OutputShapeRound:2,OutputShapeSquare:3},e.StageLayering=n,e.TargetType={Sprite:"sprite",Stage:"stage"},e.VariableType={Scalar:"",List:"list",BrooadcastMessage:"broadcast_msg"},e.activeClass=!0,e.assertSameLength=g,e.block=Ae,e.buttonBlock=function(e){return Ae({text:e,type:t.Button})},e.castToType=Z,e.closeDropdownState=S,e.color=$,e.copyTo=({target:e,source:t})=>{for(const r in t)r in e&&(e[r]=t[r])},e.customArgumentCheck=b,e.customArgumentFlag=w,e.decode=e=>[...[...e.matchAll(G)].reduce(((e,t)=>{const[r,n]=t;return e.set(r,String.fromCharCode(n))}),new Map)].reduce(((e,[t,r])=>H(e,t,r)),`${e}`),e.dropdownEntryFlag=T,e.dropdownStateFlag=E,e.encode=e=>{const t=[...e.matchAll(F)].reduce(((e,t)=>(t[0].split("").forEach((t=>e.add(t))),e)),new Set);return[...t].map((e=>({char:e,code:e.charCodeAt(0)}))).reduce(((e,{char:t,code:r})=>H(e,t,`${j[0]}${r}${j[1]}`)),`${e}`)},e.extension=rt,e.extensionsMap=Qe,e.fetchWithTimeout=async function(e,t){const{timeout:r}=t,n=new AbortController,a=setTimeout((()=>n.abort()),r),o=await fetch(e,{...t,signal:n.signal});return clearTimeout(a),o},e.getTextFromMenuItem=e=>"object"==typeof e?e.text:e,e.getValueFromMenuItem=e=>"object"==typeof e?e.value:e,e.identity=d,e.initDropdownState=I,e.isDynamicMenu=Ve,e.isFunction=l,e.isPrimitive=u,e.isString=c,e.isValidID=e=>V.test(e),e.legacy=(e,t)=>({for(){const t=Me(e).map((([e,t])=>({key:e,definer:Ne(t),decorator:_e(t)}))),r=t.reduce(((e,{key:t,definer:r})=>(e[t]=r,e)),{}),n=t.reduce(((e,{key:t,decorator:r})=>(e[t]=r,e)),{}),a=()=>{throw new Error("This property is not meant to be accessed, and is instead solely for type inference / documentation purposes.")};return{legacyExtension:()=>(t,r)=>{class n extends(function(e,t){class r extends(ze(e)){getLegacyInfo(){return t}}return r}(t,e)){constructor(){super(...arguments),this.originalClassName=r.name}}return n},legacyDefinition:r,legacyBlock:n,ReservedNames:{get Menus(){return a()},get Blocks(){return a()},get ArgumentNamesByBlock(){return a()}}}}}),e.loadExternalScript=(e,t,r)=>{const n=document.createElement("script");n.onload=t,n.onerror=r??(()=>{throw new Error(`Error loading endpoint: ${e}`)}),n.src=e,n.async=!0,document.body.appendChild(n)},e.openDropdownState=v,e.openUI=x,e.openUIEvent=f,e.parseText=Pe,e.px=e=>`${e}px`,e.reactiveInvoke=(e,t,r)=>e[t](...r),e.reactiveSet=(e,t,r)=>{e[t]=r},e.registerButtonCallback=k,e.registerButtonCallbackEvent=y,e.registerExtensionDefinitionCallback=e=>global[tt]=t=>{t&&(e(t),delete global[tt])},e.renderToDropdown=te,e.rgbToHex=e=>(e=>{e<0&&(e+=16777216);let t=Number(e).toString(16);return t=`#${"000000".substr(0,6-t.length)}${t}`,t})(function(e){return(e.r<<16)+(e.g<<8)+e.b}(e)),e.saveDataKey=z,e.set=h,e.splitOnCapitals=e=>e.split(/(?=[A-Z])/),e.tryCastToArgumentType=(e,t,r)=>{try{return Z(e,t)}catch{return r(t)}},e.typesafeCall=p,e.untilCondition=async function(e,t=100){let r;for(;!e();)await new Promise((e=>{clearTimeout(r),r=setTimeout(e,t)}));clearTimeout(r)},e.untilExternalGlobalVariableLoaded=async(e,t)=>(window[t]||await m(e),window[t]),e.untilExternalScriptLoaded=m,e.untilObject=s,e.untilReady=async function(e,t=100){let r;for(;!e.ready;)await new Promise((e=>{clearTimeout(r),r=setTimeout(e,t)}));clearTimeout(r)},e.untilTimePassed=async function(e){return await new Promise((t=>setTimeout(t,e)))},e.validGenericExtension=(...e)=>function(e,t){},Object.defineProperty(e,"__esModule",{value:!0}),e}({});//# sourceMappingURL=ExtensionFramework.js.map
