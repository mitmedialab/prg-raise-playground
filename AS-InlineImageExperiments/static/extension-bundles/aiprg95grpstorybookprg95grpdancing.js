var aiprg95grpstorybookprg95grpdancing=function(t,e){"use strict";function n(t,e,n,i,o,s){function r(t){if(void 0!==t&&"function"!=typeof t)throw new TypeError("Function expected");return t}for(var a,c=i.kind,l="getter"===c?"get":"setter"===c?"set":"value",d=!e&&t?i.static?t:t.prototype:null,u=e||(d?Object.getOwnPropertyDescriptor(d,i.name):{}),p=!1,h=n.length-1;h>=0;h--){var f={};for(var g in i)f[g]="access"===g?{}:i[g];for(var g in i.access)f.access[g]=i.access[g];f.addInitializer=function(t){if(p)throw new TypeError("Cannot add initializers after decoration has completed");s.push(r(t||null))};var v=(0,n[h])("accessor"===c?{get:u.get,set:u.set}:u[l],f);if("accessor"===c){if(void 0===v)continue;if(null===v||"object"!=typeof v)throw new TypeError("Object expected");(a=r(v.get))&&(u.get=a),(a=r(v.set))&&(u.set=a),(a=r(v.init))&&o.push(a)}else(a=r(v))&&("field"===c?o.push(a):u[l]=a)}d&&Object.defineProperty(d,i.name,u),p=!0}function i(t,e,n,i){return new(n||(n=Promise))((function(o,s){function r(t){try{c(i.next(t))}catch(t){s(t)}}function a(t){try{c(i.throw(t))}catch(t){s(t)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(r,a)}c((i=i.apply(t,e||[])).next())}))}const o="ai-storybook-dancing",s={name:"Dancing Activity for AI Storybook"},r=t=>i(void 0,void 0,void 0,(function*(){var n;(t=>{window.top.postMessage({identifier:o,destination:"unity",input:t,method:"Dance"},"*")})(t),yield(n=`end ${t}`,new Promise((t=>{const i=({data:s})=>{if(console.log(`[RAISE Playground ('${n}') listener]\n${JSON.stringify(s,Object.keys(s).sort(),3)}`),e.isString(s))return;const{identifier:r,destination:a,content:c}=s;r===o&&"blocks"===a&&c===n&&(removeEventListener("message",i),t())};addEventListener("message",i)})))}));let a=!1;var c=(()=>{var t;let c,l,d,u,p,h=[];return t=class t extends(e.extension(s,"blockly","customSaveData")){constructor(){super(...arguments),this.saveDataHandler=(function(t,e,n){for(var i=arguments.length>2,o=0;o<e.length;o++)n=i?e[o].call(t,n):e[o].call(t)}(this,h),new e.SaveDataHandler({Extension:t,onSave:()=>({hackToLoadExtensionEvenIfNoBlocksInProject:!0}),onLoad:()=>{}}))}init(t){return i(this,void 0,void 0,(function*(){var t;["gui_menu-bar-position_3U1T0","gui_stage-and-target-wrapper_69KBf","react-tabs_react-tabs__tab-list_17Wee","backpack_backpack-container_2_wGr","gui_extension-button-container_b4rCs"].forEach(e.hideElementsWithClass),document.getElementsByClassName("gui_body-wrapper_-N0sA")[0].style.height="100%",window.dispatchEvent(new Event("resize")),t="ready",window.top.postMessage({identifier:o,source:"blocks",content:t},"*"),this.blockly.getMainWorkspace().zoom(0,0,2)}))}get runContinuously(){return a=!a,a}hop(t){return i(this,void 0,void 0,(function*(){yield r("hop")}))}stepLeft(){return i(this,void 0,void 0,(function*(){yield r("swivel left")}))}stepRight(){return i(this,void 0,void 0,(function*(){yield r("swivel right")}))}spin(t){return i(this,void 0,void 0,(function*(){yield r(`spin ${t}`)}))}entry(t){return this.runContinuously}},c=[e.block({text:"Hop",type:"command"})],l=[e.block({text:"Step left",type:"command"})],d=[e.block({text:"Step right",type:"command"})],u=[e.block({text:t=>`Spin ${t}`,type:"command",arg:{type:"string",options:["left","right"]}})],p=[e.block({text:"Tell doodlebot to dance",type:"hat"})],n(t,null,c,{kind:"method",name:"hop",static:!1,private:!1,access:{has:t=>"hop"in t,get:t=>t.hop}},null,h),n(t,null,l,{kind:"method",name:"stepLeft",static:!1,private:!1,access:{has:t=>"stepLeft"in t,get:t=>t.stepLeft}},null,h),n(t,null,d,{kind:"method",name:"stepRight",static:!1,private:!1,access:{has:t=>"stepRight"in t,get:t=>t.stepRight}},null,h),n(t,null,u,{kind:"method",name:"spin",static:!1,private:!1,access:{has:t=>"spin"in t,get:t=>t.spin}},null,h),n(t,null,p,{kind:"method",name:"entry",static:!1,private:!1,access:{has:t=>"entry"in t,get:t=>t.entry}},null,h),t})();return t.Extension=c,Object.defineProperty(t,"__esModule",{value:!0}),t}({},ExtensionFramework);//# sourceMappingURL=aiprg95grpstorybookprg95grpdancing.js.map
