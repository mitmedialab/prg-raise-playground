var ExtensionFramework=function(t){"use strict";const e={Boolean:"Boolean",Button:"button",Command:"command",Conditional:"conditional",Event:"event",Hat:"hat",Loop:"loop",Reporter:"reporter"},n={Angle:"angle",Boolean:"Boolean",Color:"color",Number:"number",String:"string",Matrix:"matrix",Note:"note",Image:"image",Custom:"custom"},i={BackgroundLayer:"background",VideoLayer:"video",PenLayer:"pen",SpriteLayer:"sprite"},r=[i.VideoLayer,i.SpriteLayer,i.BackgroundLayer,i.PenLayer],a={"Аҧсшәа":"ab","العربية":"ar","አማርኛ":"am",Azeri:"az",Bahasa_Indonesia:"id","Беларуская":"be","Български":"bg","Català":"ca","Česky":"cs",Cymraeg:"cy",Dansk:"da",Deutsch:"de",Eesti:"et","Ελληνικά":"el",English:"en","Español":"es","Español_Latinoamericano":"es-419",Euskara:"eu","فارسی":"fa","Français":"fr",Gaeilge:"ga","Gàidhlig":"gd",Galego:"gl","한국어":"ko","עִבְרִית":"he",Hrvatski:"hr",isiZulu:"zu","Íslenska":"is",Italiano:"it","ქართული_ენა":"ka",Kiswahili:"sw","Kreyòl_ayisyen":"ht","کوردیی_ناوەندی":"ckb","Latviešu":"lv","Lietuvių":"lt",Magyar:"hu","Māori":"mi",Nederlands:"nl","日本語":"ja","にほんご":"ja-Hira","Norsk_Bokmål":"nb",Norsk_Nynorsk:"nn","Oʻzbekcha":"uz","ไทย":"th","ភាសាខ្មែរ":"km",Polski:"pl","Português":"pt","Português_Brasileiro":"pt-br",Rapa_Nui:"rap","Română":"ro","Русский":"ru","Српски":"sr","Slovenčina":"sk","Slovenščina":"sl",Suomi:"fi",Svenska:"sv","Tiếng_Việt":"vi","Türkçe":"tr","Українська":"uk","简体中文":"zh-cn","繁體中文":"zh-tw"},o=Object.keys(a);class s{static get RGB_BLACK(){return{r:0,g:0,b:0}}static get RGB_WHITE(){return{r:255,g:255,b:255}}static decimalToHex(t){t<0&&(t+=16777216);let e=Number(t).toString(16);return e=`#${"000000".substr(0,6-e.length)}${e}`,e}static decimalToRgb(t){const e=t>>24&255;return{r:t>>16&255,g:t>>8&255,b:255&t,a:e>0?e:255}}static hexToRgb(t){t=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,((t,e,n,i)=>e+e+n+n+i+i));const e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:null}static rgbToHex(t){return s.decimalToHex(s.rgbToDecimal(t))}static rgbToDecimal(t){return(t.r<<16)+(t.g<<8)+t.b}static hexToDecimal(t){return s.rgbToDecimal(s.hexToRgb(t))}static hsvToRgb(t){let e=t.h%360;e<0&&(e+=360);const n=Math.max(0,Math.min(t.s,1)),i=Math.max(0,Math.min(t.v,1)),r=Math.floor(e/60),a=e/60-r,o=i*(1-n),s=i*(1-n*a),c=i*(1-n*(1-a));let l,u,p;switch(r){default:case 0:l=i,u=c,p=o;break;case 1:l=s,u=i,p=o;break;case 2:l=o,u=i,p=c;break;case 3:l=o,u=s,p=i;break;case 4:l=c,u=o,p=i;break;case 5:l=i,u=o,p=s}return{r:Math.floor(255*l),g:Math.floor(255*u),b:Math.floor(255*p)}}static rgbToHsv(t){const e=t.r/255,n=t.g/255,i=t.b/255,r=Math.min(Math.min(e,n),i),a=Math.max(Math.max(e,n),i);let o=0,s=0;if(r!==a){o=60*((e===r?3:n===r?5:1)-(e===r?n-i:n===r?i-e:e-n)/(a-r))%360,s=(a-r)/a}return{h:o,s:s,v:a}}static mixRgb(t,e,n){if(n<=0)return t;if(n>=1)return e;const i=1-n;return{r:i*t.r+n*e.r,g:i*t.g+n*e.g,b:i*t.b+n*e.b}}}const c=s;class l{static toNumber(t){if("number"==typeof t)return Number.isNaN(t)?0:t;const e=Number(t);return Number.isNaN(e)?0:e}static toBoolean(t){return"boolean"==typeof t?t:"string"==typeof t?""!==t&&"0"!==t&&"false"!==t.toLowerCase():Boolean(t)}static toString(t){return String(t)}static toRgbColorList(t){const e=l.toRgbColorObject(t);return[e.r,e.g,e.b]}static toRgbColorObject(t){let e;return"string"==typeof t&&"#"===t.substring(0,1)?(e=c.hexToRgb(t),e||(e={r:0,g:0,b:0,a:255})):e=c.decimalToRgb(l.toNumber(t)),e}static isWhiteSpace(t){return null===t||"string"==typeof t&&0===t.trim().length}static compare(t,e){let n=Number(t),i=Number(e);if(0===n&&l.isWhiteSpace(t)?n=NaN:0===i&&l.isWhiteSpace(e)&&(i=NaN),isNaN(n)||isNaN(i)){const n=String(t).toLowerCase(),i=String(e).toLowerCase();return n<i?-1:n>i?1:0}return n===1/0&&i===1/0||n===-1/0&&i===-1/0?0:n-i}static isInt(t){return"number"==typeof t?!!isNaN(t)||t===parseInt(t,10):"boolean"==typeof t||"string"==typeof t&&t.indexOf(".")<0}static get LIST_INVALID(){return"INVALID"}static get LIST_ALL(){return"ALL"}static toListIndex(t,e,n){if("number"!=typeof t){if("all"===t)return n?l.LIST_ALL:l.LIST_INVALID;if("last"===t)return e>0?e:l.LIST_INVALID;if("random"===t||"any"===t)return e>0?1+Math.floor(Math.random()*e):l.LIST_INVALID}return(t=Math.floor(l.toNumber(t)))<1||t>e?l.LIST_INVALID:t}}var u=l;const p="OPEN_UI_FROM_EXTENSION",g="REGISTER_BUTTON_CALLBACK_FROM_EXTENSION",m="internal_IsCustomArgument",_="isCustomArgumentHack",h="dropdownState",d="dropdownEntry",y="init",S="open",f="close",I=(t,e)=>t.emit(p,e),T=(t,e,n)=>{t.emit(g,e),t.on(e,n)};var E;!function(t){t.ui="ui";t.text="text";t.motion="motion";t.red="red";t.sound="sound";t.control="control";t.data="data";t.pen="pen";t.error="error";t.extensions="extensions";t.drop="drop"}(E||(E={}));class b{constructor(t){this.root=t}get(...t){return`var(--${this.root}-${t.join("-")})`}primary(...t){return this.get("primary",...t)}secondary(...t){return this.get("secondary",...t)}tertiary(...t){return this.get("tertiary",...t)}transparent(...t){return this.get("transparent",...t)}light(...t){return this.get("light",...t)}}const A=new b(E.ui),O=new b(E.text),R=new b(E.motion),v=new b(E.red),D=new b(E.sound),C=new b(E.control),N=new b(E.data),L=new b(E.pen),w=new b(E.error),x=new b(E.extensions),P=new b(E.extensions),k={ui:{primary:A.primary(),secondary:A.secondary(),tertiary:A.tertiary(),modalOverlay:A.get("modal","overlay"),white:A.get("white"),whiteDim:A.get("white","dim"),whiteTransparent:A.get("white","transparent"),transparent:A.transparent(),blackTransparent:A.get("black","transparent")},text:{primary:O.primary(),primaryTransparent:O.transparent()},motion:{primary:R.primary(),tertiary:R.tertiary(),transparent:R.get("transparent"),lightTansparent:R.light("transparent")},red:{primary:v.primary(),tertiary:v.tertiary()},sound:{primary:D.primary(),tertiary:D.tertiary()},control:{primary:C.primary()},data:{primary:N.primary()},pen:{primary:L.primary(),transparent:L.transparent()},error:{primary:w.primary(),light:w.light(),transparent:w.transparent()},extensions:{primary:x.primary(),tertiary:x.tertiary(),light:x.light(),transparent:x.transparent()},drop:{highlight:P.get("highlight")}};async function M(t,e=100){let n,i=t();for(;!i;)await new Promise((t=>{clearTimeout(n),n=setTimeout(t,e)})),i=t();return clearTimeout(n),i}const B=t=>"string"==typeof t||t instanceof String,G=t=>"[object Function]"===Object.prototype.toString.call(t)||"function"==typeof t||t instanceof Function,F=t=>t,U=t=>{[["goog-menuitem goog-option",t=>{t.margin="auto",t.paddingLeft=t.paddingRight="0px"}],["goog-menuitem-content",t=>t.textAlign="center"]].forEach((([e,n])=>{const i=t.getElementsByClassName(e);console.assert(1===i.length,`Incorrect number of elements found with class: ${e}`),n(i[0].style)}))};const $={DrowpdownOpen:S,DropdownClose:f,Init:y},j=t=>{if(1!==t.length)return!1;const e=t[0];if("object"!=typeof e)return!1;const{text:n}=e;return n===m};function H(t,[{value:e}],n){const{id:i,customArgumentManager:r}=this,{component:a,id:o}=JSON.parse(e);switch(t[h]){case $.Init:return r.getCurrentEntries();case $.DropdownClose:{const t=r.tryResolve();return t?[[t.entry.text,t.id]]:r.getCurrentEntries()}case $.DrowpdownOpen:{const e=t[d],l=(s=function(t){let e,n=t[0],i=1;for(;i<t.length;){const r=t[i],a=t[i+1];if(i+=2,("optionalAccess"===r||"optionalCall"===r)&&null==n)return;"access"===r||"optionalAccess"===r?(e=n,n=a(n)):"call"!==r&&"optionalCall"!==r||(n=a(((...t)=>n.call(e,...t))),e=void 0)}return n}([e,"optionalAccess",t=>t.value]),c=()=>o,null!=s?s:c()),u=r.getEntry(l),[p,g]=r.request();return(async(t,e)=>{const n="blocklyDropDownContent",i=document.getElementsByClassName(n);if(1!==i.length)return console.error(`Uh oh! Expected 1 element with class '${n}', but found ${i.length}`);const[r]=i,a=await M((()=>r.children[0]));new t({target:r,anchor:a,props:e}),U(a)})(n(i,a),{setter:g,current:u,extension:this}),[["Apply",p]]}}var s,c;throw new Error("Error during processing -- Context:"+$)}class K{constructor(){K.prototype.__init.call(this),K.prototype.__init2.call(this)}__init(){this.map=new Map}__init2(){this.pending=null}clearPending(){this.pending=null}setPending(t){this.pending=t}add(t){const e=K.GetIdentifier();return this.map.set(e,t),this.clearPending(),e}insert(t,e){return this.map.set(t,e),this.clearPending(),t}request(){this.clearPending();const t=K.GetIdentifier();return[t,e=>this.setPending({id:t,entry:e})]}tryResolve(){if(!this.pending)return;const{pending:{entry:t,id:e}}=this;return this.map.set(e,t),this.clearPending(),{entry:t,id:e}}getCurrentEntries(){return Array.from(this.map.entries()).filter((([t,e])=>null!==e)).map((([t,{text:e}])=>[e,t]))}getEntry(t){return this.map.get(t)}static __initStatic(){this.SaveKey="internal_customArgumentsSaveData"}requiresSave(){this.map.size}saveTo(t){const e=Array.from(this.map.entries()).filter((([t,e])=>null!==e)).map((([t,e])=>({id:t,entry:e})));0!==e.length&&(t[K.SaveKey]=e)}loadFrom(t){!function(t){let e,n=t[0],i=1;for(;i<t.length;){const r=t[i],a=t[i+1];if(i+=2,("optionalAccess"===r||"optionalCall"===r)&&null==n)return;"access"===r||"optionalAccess"===r?(e=n,n=a(n)):"call"!==r&&"optionalCall"!==r||(n=a(((...t)=>n.call(e,...t))),e=void 0)}}([t,"access",t=>t[K.SaveKey],"optionalAccess",t=>t.forEach,"call",t=>t((({id:t,entry:e})=>{this.map.set(t,e)}))])}purgeStaleIDs(){}static __initStatic2(){this.IsIdentifier=t=>t.startsWith(K.IdentifierPrefix)}static __initStatic3(){this.GetIdentifier=()=>K.IdentifierPrefix+(new Date).getTime().toString()}static __initStatic4(){this.IdentifierPrefix="__customArg__"}}function V(t,e){return null!=t?t:e()}function z(t){let e,n=t[0],i=1;for(;i<t.length;){const r=t[i],a=t[i+1];if(i+=2,("optionalAccess"===r||"optionalCall"===r)&&null==n)return;"access"===r||"optionalAccess"===r?(e=n,n=a(n)):"call"!==r&&"optionalCall"!==r||(n=a(((...t)=>n.call(e,...t))),e=void 0)}return n}K.__initStatic(),K.__initStatic2(),K.__initStatic3(),K.__initStatic4();class J{__init(){this.saveDataHandler=void 0}__init2(){this.internal_blocks=[]}__init3(){this.internal_menus=[]}__init4(){this.argumentManager=null}get customArgumentManager(){return this.argumentManager}static __initStatic(){this.SaveDataKey="customSaveDataPerExtension"}save(t,e){const{saveDataHandler:n,id:i,argumentManager:r}=this,a=V(z([n,"optionalAccess",t=>t.hooks,"access",t=>t.onSave,"call",t=>t(this)]),(()=>({})));if(z([r,"optionalAccess",t=>t.saveTo,"call",t=>t(a)]),0===Object.keys(a).length)return;const o=t[J.SaveDataKey];o?o[i]=a:t[J.SaveDataKey]={[i]:a},e.add(i)}load(t){if(!t)return;const{saveDataHandler:e,id:n}=this,i=J.SaveDataKey in t?t[J.SaveDataKey][n]:null;i&&(z([e,"optionalAccess",t=>t.hooks,"access",t=>t.onLoad,"call",t=>t(this,i)]),(this.argumentManager??=new K).loadFrom(i))}openUI(t,e){const{id:n,name:i,runtime:r}=this;I(r,{id:n,name:i,component:t.replace(".svelte",""),label:e})}constructor(t,e){J.prototype.__init.call(this),J.prototype.__init2.call(this),J.prototype.__init3.call(this),J.prototype.__init4.call(this),J.prototype.__init5.call(this),J.prototype.__init6.call(this),J.prototype.__init7.call(this);const{name:n,id:i,blockIconURI:r}=V(e,(()=>this[J.InternalCodeGenArgsGetterKey]()));this.name=n,this.id=i,this.blockIconURI=r,this.runtime=t,J.ExtensionsByID.set(i,this)}internal_init(){this.init({runtime:this.runtime,videoFeed:z([this,"access",t=>t.runtime,"access",t=>t.ioDevices,"optionalAccess",t=>t.video])});const t=this.defineBlocks(),e=[],n=[];for(const i in t){const r=J.IsFunction(t[i])?t[i](this):t[i],a=this.convertToInfo(i,r,e,n);this.internal_blocks.push(a)}for(const[t,i]of e.entries()){let e=!1;const r=n[t];if(Array.isArray(i)){const t=i;this.addStaticMenu(t,e,r)}else if(J.IsFunction(i)){const t=i;this.addDynamicMenu(t,e,r)}else if(e=!0,"items"in i){const t=i;this.addStaticMenu(t.items,e,r)}else if("getItems"in i){const t=i;this.addDynamicMenu(t.getItems,e,r)}else;}}getInfo(){const{id:t,internal_blocks:e,internal_menus:n,name:i,blockIconURI:r}=this,a={id:t,blocks:e,name:i,blockIconURI:r};return n&&(a.menus=Object.values(this.internal_menus).reduce(((t,{name:e,...n})=>(t[e]=n,t)),{})),console.log(JSON.stringify(a,null,4)),a}addStaticMenu(t,e,n){this.internal_menus.push({name:n,acceptReporters:e,items:t.map((t=>t)).map(J.ConvertMenuItemsToString)})}addDynamicMenu(t,e,n){const i=`internal_dynamic_${this.internal_menus.length}`;this[i]=()=>t().map((t=>t)).map(J.ConvertMenuItemsToString),this.internal_menus.push({acceptReporters:e,items:i,name:n})}convertToInfo(t,i,r,a){const{type:o,text:s,operation:c}=i,l=i.arg?[i.arg]:i.args,u=J.ExtractLegacyInformation(i),p=void 0!==u,g=p?[]:void 0,m=J.IsFunction(s)?s(...l.map(((t,e)=>{const n=p?J.ExtractLegacyInformation(t).name:e;return p&&g.push(n),`[${n}]`}))):s,_=this.format(m,t,`Block text for '${t}'`),h=l?new Array(l.length).fill(void 0):void 0,d=z([l,"optionalAccess",t=>t.map,"call",e=>e(((e,n)=>{const i={};if(i.type=J.GetArgumentType(e),i.name=p?J.ExtractLegacyInformation(e).name:`${n}`,J.IsPrimitive(e))return i;const{defaultValue:o,options:s}=e;if(void 0!==o&&(i.defaultValue=J.IsString(i)?this.format(o,J.GetArgTranslationID(t,n),`Default value for arg ${n+1} of ${t} block`):o),!s)return i;const c=r.indexOf(s),l=c>=0,u=l?c:r.push(s)-1,g=V(z([J,"access",t=>t.ExtractLegacyInformation,"call",t=>t(s),"optionalAccess",t=>t.name]),(()=>`${u}`));if(l||a.push(g),i.menu=g,"handler"in s){const{handler:t}=s;h[n]=t}return i})),"access",t=>t.reduce,"call",t=>t(((t,{name:e,...n})=>(t[e]=n,t)),{})]),y=p?u.name:J.GetInternalKey(t),S=c.bind(this),{id:f,customArgumentManager:I}=this,E=o===e.Button,b=E?J.GetButtonID(f,y):void 0;return E?T(this.runtime,b,S):this[y]=(t,e)=>{const i=(p?g.map((e=>t[e])):Object.values(t).slice(0,-1)).map(((t,e)=>{const i=J.GetArgumentType(l[e]),r=V(h[e],(()=>F));return i!==n.Custom?J.CastToType(i,r(t)):J.IsString(t)&&K.IsIdentifier(t)?r(I.getEntry(t).value):r(t)}));return S(...i,e)},{opcode:y,text:_,blockType:o,arguments:d,func:b}}__init5(){this[_]=j.bind(this)}__init6(){this.processCustomArgumentHack=H.bind(this)}format(t,e,n){return t}static __initStatic2(){this.GetExtensionByID=t=>{if(J.ExtensionsByID.has(t))return J.ExtensionsByID.get(t);console.error(`Could not find extension with id '${t}'`)}}static __initStatic3(){this.TryCastToArgumentType=(t,e,n)=>{try{return J.CastToType(t,e)}catch(t){return n(e)}}}__init7(){this.makeCustomArgument=({component:t,initial:e,acceptReportersHandler:i})=>{this.argumentManager??=new K;const r=this.argumentManager.add(e),a=()=>[{text:m,value:JSON.stringify({component:t,id:r})}];return{type:n.Custom,defaultValue:r,options:void 0===i?a:{acceptsReports:!0,getItems:a,handler:i}}}}static __initStatic4(){this.GetKeyFromOpcode=t=>t.replace(J.GetInternalKey(""),"")}static __initStatic5(){this.GetArgTranslationID=(t,e)=>`${t}-arg${e}-default`}static __initStatic6(){this.GetInternalKey=t=>`internal_${t}`}static __initStatic7(){this.GetButtonID=(t,e)=>`${t}_${e}`}static __initStatic8(){this.GetArgumentType=t=>J.IsPrimitive(t)?t:t.type}static __initStatic9(){this.ToFlag=t=>1===parseInt(t)}static __initStatic10(){this.ToMatrix=t=>{if(25!==t.length)return new Array(5).fill(new Array(5).fill(!1));return t.split("").map(J.ToFlag).reduce(((t,e,n)=>{const i=Math.floor(n/5);return 0===n%5?t[i]=[e]:t[i].push(e),t}),new Array(5))}}static __initStatic11(){this.CastToType=(t,e)=>{switch(t){case n.String:return`${e}`;case n.Number:return parseFloat(e);case n.Boolean:return JSON.parse(e);case n.Note:case n.Angle:return parseInt(e);case n.Matrix:return J.ToMatrix(e);case n.Color:return u.toRgbColorObject(e);default:throw new Error(`Method not implemented for value of ${e} and type ${t}`)}}}static __initStatic12(){this.ConvertMenuItemsToString=t=>J.IsPrimitive(t)?`${t}`:{...t,value:`${t.value}`}}static __initStatic13(){this.IsPrimitive=t=>t!==Object(t)}static __initStatic14(){this.IsFunction=t=>G(t)}static __initStatic15(){this.IsString=t=>B(t)}static __initStatic16(){this.ExtensionsByID=new Map}static __initStatic17(){this.InternalCodeGenArgsGetterKey="internal_getCodeGenArgs"}static __initStatic18(){this.TestGetInfo=(t,...e)=>t.getInfo(...e)}static __initStatic19(){this.TestGetBlocks=(t,...e)=>t.getInfo(...e).blocks}static __initStatic20(){this.TestInit=(t,...e)=>t.internal_init(...e)}static __initStatic21(){this.ExtractLegacyInformation=t=>"name"in t?{name:t.name}:void 0}}var W;J.__initStatic(),J.__initStatic2(),J.__initStatic3(),J.__initStatic4(),J.__initStatic5(),J.__initStatic6(),J.__initStatic7(),J.__initStatic8(),J.__initStatic9(),J.__initStatic10(),J.__initStatic11(),J.__initStatic12(),J.__initStatic13(),J.__initStatic14(),J.__initStatic15(),J.__initStatic16(),J.__initStatic17(),J.__initStatic18(),J.__initStatic19(),J.__initStatic20(),J.__initStatic21(),function(t){t.Arg="arg";t.Args="args"}(W||(W={}));const X=new RegExp("^[a-z0-9]+$","i"),q=new RegExp("[^a-z0-9]+","gi"),Z=["prg","prg".split("").reverse().join("")],Q=new RegExp(`${Z[0]}([0-9]+)${Z[1]}`,"g"),Y=(t,e,n)=>t.replaceAll(e,n);return t.ArgumentType=n,t.BlockType=e,t.Branch={Exit:0,Enter:1,First:1,Second:2,Third:3,Fourth:4,Fifth:5,Sixth:6,Seventh:7},t.Extension=J,t.FrameworkID="ExtensionFramework",t.Language=a,t.LanguageKeys=o,t.LayerGroups=r,t.RuntimeEvent={ScriptGlowOn:"SCRIPT_GLOW_ON",ScriptGlowOff:"SCRIPT_GLOW_OFF",BlockGlowOn:"BLOCK_GLOW_ON",BlockGlowOff:"BLOCK_GLOW_OFF",HasCloudDataUpdate:"HAS_CLOUD_DATA_UPDATE",TurboModeOn:"TURBO_MODE_ON",TurboModeOff:"TURBO_MODE_OFF",RecordingOn:"RECORDING_ON",RecordingOff:"RECORDING_OFF",ProjectStart:"PROJECT_START",ProjectRunStart:"PROJECT_RUN_START",ProjectRunStop:"PROJECT_RUN_STOP",ProjectStopAll:"PROJECT_STOP_ALL",StopForTarget:"STOP_FOR_TARGET",VisualReport:"VISUAL_REPORT",ProjectLoaded:"PROJECT_LOADED",ProjectChanged:"PROJECT_CHANGED",ToolboxExtensionsNeedUpdate:"TOOLBOX_EXTENSIONS_NEED_UPDATE",TargetsUpdate:"TARGETS_UPDATE",MonitorsUpdate:"MONITORS_UPDATE",BlockDragUpdate:"BLOCK_DRAG_UPDATE",BlockDragEnd:"BLOCK_DRAG_END",ExtensionAdded:"EXTENSION_ADDED",ExtensionFieldAdded:"EXTENSION_FIELD_ADDED",PeripheralListUpdate:"PERIPHERAL_LIST_UPDATE",PeripheralConnected:"PERIPHERAL_CONNECTED",PeripheralDisconnected:"PERIPHERAL_DISCONNECTED",PeripheralRequestError:"PERIPHERAL_REQUEST_ERROR",PeripheralConnectionLostError:"PERIPHERAL_CONNECTION_LOST_ERROR",PeripheralScanTimeout:"PERIPHERAL_SCAN_TIMEOUT",MicListening:"MIC_LISTENING",BlocksInfoUpdate:"BLOCKSINFO_UPDATE",RuntimeStarted:"RUNTIME_STARTED",RuntimeDisposed:"RUNTIME_DISPOSED",BlocksNeedUpdate:"BLOCKS_NEED_UPDATE"},t.SaveDataHandler=class{constructor(t){this.hooks=t}},t.ScratchBlocksConstants={OutputShapeHexagonal:1,OutputShapeRound:2,OutputShapeSquare:3},t.StageLayering=i,t.TargetType={Sprite:"sprite",Stage:"stage"},t.VariableType={Scalar:"",List:"list",BrooadcastMessage:"broadcast_msg"},t.activeClass=!0,t.closeDropdownState=f,t.color=k,t.copyTo=({target:t,source:e})=>{for(const n in e)n in t&&(t[n]=e[n])},t.customArgumentCheck=_,t.customArgumentFlag=m,t.decode=t=>[...[...t.matchAll(Q)].reduce(((t,e)=>{const[n,i]=e;return t.set(n,String.fromCharCode(i))}),new Map)].reduce(((t,[e,n])=>Y(t,e,n)),`${t}`),t.dropdownEntryFlag=d,t.dropdownStateFlag=h,t.encode=t=>[...[...t.matchAll(q)].reduce(((t,e)=>(e[0].split("").forEach((e=>t.add(e))),t)),new Set)].map((t=>({char:t,code:t.charCodeAt(0)}))).reduce(((t,{char:e,code:n})=>Y(t,e,`${Z[0]}${n}${Z[1]}`)),`${t}`),t.extractFromGetInfo=t=>({}),t.fetchWithTimeout=async function(t,e){const{timeout:n}=e,i=new AbortController,r=setTimeout((()=>i.abort()),n),a=await fetch(t,{...e,signal:i.signal});return clearTimeout(r),a},t.getTextFromMenuItem=t=>"object"==typeof t?t.text:t,t.getValueFromMenuItem=t=>"object"==typeof t?t.value:t,t.identity=F,t.initDropdownState=y,t.isFunction=G,t.isString=B,t.isValidID=t=>X.test(t),t.mockFormatMessage=t=>"",t.openDropdownState=S,t.openUI=I,t.openUIEvent=p,t.px=t=>`${t}px`,t.reactiveInvoke=(t,e,n)=>t[e](...n),t.reactiveSet=(t,e,n)=>{t[e]=n},t.registerButtonCallback=T,t.registerButtonCallbackEvent=g,t.splitOnCapitals=t=>t.split(/(?=[A-Z])/),t.waitForCondition=async function(t,e=100){let n;for(;!t();)await new Promise((t=>{clearTimeout(n),n=setTimeout(t,e)}));clearTimeout(n)},t.waitForObject=M,Object.defineProperty(t,"__esModule",{value:!0}),t}({});//# sourceMappingURL=ExtensionFramework.js.map
