var microbitBlocks=function(e,t){"use strict";function a(e,t,a,n,i,o){function r(e){if(void 0!==e&&"function"!=typeof e)throw new TypeError("Function expected");return e}for(var s,c=n.kind,l="getter"===c?"get":"setter"===c?"set":"value",m=e?n.static?e:e.prototype:null,d=m?Object.getOwnPropertyDescriptor(m,n.name):{},h=!1,p=a.length-1;p>=0;p--){var u={};for(var f in n)u[f]="access"===f?{}:n[f];for(var f in n.access)u.access[f]=n.access[f];u.addInitializer=function(e){if(h)throw new TypeError("Cannot add initializers after decoration has completed");o.push(r(e||null))};var x=(0,a[p])("accessor"===c?{get:d.get,set:d.set}:d[l],u);if("accessor"===c){if(void 0===x)continue;if(null===x||"object"!=typeof x)throw new TypeError("Object expected");(s=r(x.get))&&(d.get=s),(s=r(x.set))&&(d.set=s),(s=r(x.init))&&i.unshift(s)}else(s=r(x))&&("field"===c?i.unshift(s):d[l]=s)}m&&Object.defineProperty(m,n.name,d),h=!0}function n(e,t,a,n){return new(a||(a=Promise))((function(i,o){function r(e){try{c(n.next(e))}catch(e){o(e)}}function s(e){try{c(n.throw(e))}catch(e){o(e)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof a?t:new a((function(e){e(t)}))).then(r,s)}c((n=n.apply(e,t||[])).next())}))}"function"==typeof SuppressedError&&SuppressedError;const i={name:"Replace me with name of your extension",description:"Replace me with a description of your extension",iconURL:"Replace with the name of your icon image file (which should be placed in the same directory as this file)",insetIconURL:"Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"};let o=(()=>{var e;let o,r,s,c,l,m=t.extension(i),d=[];return e=class extends m{constructor(){super(...arguments),this.exampleField=function(e,t,a){for(var n=arguments.length>2,i=0;i<t.length;i++)a=n?t[i].call(e,a):t[i].call(e);return n?a:void 0}(this,d)}init(e){this.exampleField=0}exampleReporter(){return++this.exampleField}reporterThatTakesTwoArguments(e,t){return e+t}exampleCommand(){alert("This is a command!")}exampleCommandWithExtendedDefinition(){alert("This is a command defined using the extended definition strategy!")}exampleHatThatUsesBlockUtility(e,t){return n(this,void 0,void 0,(function*(){return t.stackFrame.isLoop===e}))}},(()=>{var n;const i="function"==typeof Symbol&&Symbol.metadata?Object.create(null!==(n=m[Symbol.metadata])&&void 0!==n?n:null):void 0;o=[t.scratch.reporter`This is the block's display text (so replace me with what you want the block to say)`],r=[t.scratch.reporter`This is the block's display text with inputs here --> ${"string"} and here --> ${{type:"number",defaultValue:1}}`],s=[t.scratch.command`This is the block's display text`],c=[t.scratch.command(((e,t)=>(console.log("Creating a block for extension: ",e.id),t`This is the block's display text`)))],l=[t.scratch.hat`Should the below block execute: ${"Boolean"}`],a(e,0,o,{kind:"method",name:"exampleReporter",static:!1,private:!1,access:{has:e=>"exampleReporter"in e,get:e=>e.exampleReporter},metadata:i},null,d),a(e,0,r,{kind:"method",name:"reporterThatTakesTwoArguments",static:!1,private:!1,access:{has:e=>"reporterThatTakesTwoArguments"in e,get:e=>e.reporterThatTakesTwoArguments},metadata:i},null,d),a(e,0,s,{kind:"method",name:"exampleCommand",static:!1,private:!1,access:{has:e=>"exampleCommand"in e,get:e=>e.exampleCommand},metadata:i},null,d),a(e,0,c,{kind:"method",name:"exampleCommandWithExtendedDefinition",static:!1,private:!1,access:{has:e=>"exampleCommandWithExtendedDefinition"in e,get:e=>e.exampleCommandWithExtendedDefinition},metadata:i},null,d),a(e,0,l,{kind:"method",name:"exampleHatThatUsesBlockUtility",static:!1,private:!1,access:{has:e=>"exampleHatThatUsesBlockUtility"in e,get:e=>e.exampleHatThatUsesBlockUtility},metadata:i},null,d),i&&Object.defineProperty(e,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:i})})(),e})();return e.Extension=o,e}({},ExtensionFramework);//# sourceMappingURL=microbitBlocks.js.map
