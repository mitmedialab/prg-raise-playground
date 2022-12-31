var simpleprg95grpexample=function(t,e){"use strict";function n(){}function o(t){return t()}function r(){return Object.create(null)}function c(t){t.forEach(o)}function i(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function u(t,e){t.appendChild(e)}function l(t,e,n){const o=function(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;if(e&&e.host)return e;return t.ownerDocument}(t);if(!o.getElementById(e)){const t=p("style");t.id=e,t.textContent=n,function(t,e){u(t.head||t,e),e.sheet}(o,t)}}function a(t,e,n){t.insertBefore(e,n||null)}function d(t){t.parentNode&&t.parentNode.removeChild(t)}function p(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function g(){return f(" ")}function m(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function h(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function x(t){return""===t?null:+t}function y(t,e){t.value=null==e?"":e}function b(t,e,n,o){null===n?t.style.removeProperty(e):t.style.setProperty(e,n,o?"important":"")}function v(t,e,n){t.classList[n?"add":"remove"](e)}let A;function $(t){A=t}const w=[],B=[],T=[],E=[],k=Promise.resolve();let C=!1;function O(t){T.push(t)}const R=new Set;let H=0;function L(){const t=A;do{for(;H<w.length;){const t=w[H];H++,$(t),_(t.$$)}for($(null),w.length=0,H=0;B.length;)B.pop()();for(let t=0;t<T.length;t+=1){const e=T[t];R.has(e)||(R.add(e),e())}T.length=0}while(w.length);for(;E.length;)E.pop()();C=!1,R.clear(),$(t)}function _(t){if(null!==t.fragment){t.update(),c(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(O)}}const j=new Set;function I(t,e){-1===t.$$.dirty[0]&&(w.push(t),C||(C=!0,k.then(L)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function U(t,e,s,u,l,a,p,f=[-1]){const g=A;$(t);const m=t.$$={fragment:null,ctx:[],props:a,update:n,not_equal:l,bound:r(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(g?g.$$.context:[])),callbacks:r(),dirty:f,skip_bound:!1,root:e.target||g.$$.root};p&&p(m.root);let h=!1;if(m.ctx=s?s(t,e.props||{},((e,n,...o)=>{const r=o.length?o[0]:n;return m.ctx&&l(m.ctx[e],m.ctx[e]=r)&&(!m.skip_bound&&m.bound[e]&&m.bound[e](r),h&&I(t,e)),n})):[],m.update(),h=!0,c(m.before_update),m.fragment=!!u&&u(m.ctx),e.target){if(e.hydrate){const t=function(t){return Array.from(t.childNodes)}(e.target);m.fragment&&m.fragment.l(t),t.forEach(d)}else m.fragment&&m.fragment.c();e.intro&&((x=t.$$.fragment)&&x.i&&(j.delete(x),x.i(y))),function(t,e,n,r){const{fragment:s,after_update:u}=t.$$;s&&s.m(e,n),r||O((()=>{const e=t.$$.on_mount.map(o).filter(i);t.$$.on_destroy?t.$$.on_destroy.push(...e):c(e),t.$$.on_mount=[]})),u.forEach(O)}(t,e.target,e.anchor,e.customElement),L()}var x,y;$(g)}class z{$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(c(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=n}$on(t,e){if(!i(e))return n;const o=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return o.push(e),()=>{const t=o.indexOf(e);-1!==t&&o.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function F(t){l(t,"svelte-cadbzg",".container.svelte-cadbzg{text-align:center;padding:30px}button.svelte-cadbzg{border-radius:10px;border:1px solid var(--motion-primary);background-color:var(--motion-primary);padding:10px;font-size:20px;margin-top:10px}button.svelte-cadbzg:hover{background-color:var(--motion-tertiary)}")}function K(t){let o,r,i,s,l,A,$,w,B,T,E,k,C,O,R,H,L,_,j,I=t[0].count+"";return{c(){o=p("div"),r=p("h1"),i=f("The count is "),s=f(I),l=g(),A=p("center"),$=p("button"),$.textContent="Add 1",w=g(),B=p("br"),T=g(),E=p("button"),E.textContent="Add",k=g(),C=p("input"),O=g(),R=p("br"),H=g(),L=p("button"),L.textContent="Reset",h($,"class","svelte-cadbzg"),h(E,"class","svelte-cadbzg"),h(C,"type","number"),b(C,"width","50px"),b(C,"font-size","20px"),h(L,"class","svelte-cadbzg"),h(o,"class","svelte-cadbzg"),v(o,"container",t[2]),b(o,"width",e.px(360)),b(o,"background-color",e.color.ui.white),b(o,"color",e.color.text.primary)},m(e,n){a(e,o,n),u(o,r),u(r,i),u(r,s),u(o,l),u(o,A),u(A,$),u(A,w),u(A,B),u(A,T),u(A,E),u(A,k),u(A,C),y(C,t[1]),u(A,O),u(A,R),u(A,H),u(A,L),_||(j=[m($,"click",t[4]),m(E,"click",t[5]),m(C,"input",t[6]),m(L,"click",t[7])],_=!0)},p(t,[e]){1&e&&I!==(I=t[0].count+"")&&function(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}(s,I),2&e&&x(C.value)!==t[1]&&y(C,t[1])},i:n,o:n,d(t){t&&d(o),_=!1,c(j)}}}function Q(t,n,o){let{extension:r}=n,{close:c}=n;const i=e.activeClass;let s=2;return t.$$set=t=>{"extension"in t&&o(0,r=t.extension),"close"in t&&o(3,c=t.close)},[r,s,i,c,()=>o(0,r.count++,r),()=>o(0,r.count+=s,r),function(){s=x(this.value),o(1,s)},()=>o(0,r.count=0,r)]}function P(t){l(t,"svelte-1z0o0so",".container.svelte-1z0o0so{text-align:center;padding:30px}")}function X(t){let o;return{c(){o=p("div"),o.textContent="Hello, world!",h(o,"class","svelte-1z0o0so"),v(o,"container",t[0]),b(o,"width",e.px(360)),b(o,"background-color",e.color.ui.white),b(o,"color",e.color.text.primary)},m(t,e){a(t,o,e)},p:n,i:n,o:n,d(t){t&&d(o)}}}function J(t,n,o){let{extension:r}=n,{close:c}=n;const i=e.activeClass;return t.$$set=t=>{"extension"in t&&o(1,r=t.extension),"close"in t&&o(2,c=t.close)},[i,r,c]}function N(t){l(t,"svelte-18zucbn",".container.svelte-18zucbn{text-align:center}")}function q(t,e,n){const o=t.slice();return o[4]=e[n],o}function D(t){let e,o,r,c=t[4].name+"";return{c(){e=p("div"),o=f(c),r=g(),b(e,"background-color",t[4].color)},m(t,n){a(t,e,n),u(e,o),u(e,r)},p:n,d(t){t&&d(e)}}}function S(t){let e,o=t[0],r=[];for(let e=0;e<o.length;e+=1)r[e]=D(q(t,o,e));return{c(){e=p("div");for(let t=0;t<r.length;t+=1)r[t].c();h(e,"class","svelte-18zucbn"),v(e,"container",t[1])},m(t,n){a(t,e,n);for(let t=0;t<r.length;t+=1)r[t].m(e,null)},p(t,[n]){if(1&n){let c;for(o=t[0],c=0;c<o.length;c+=1){const i=q(t,o,c);r[c]?r[c].p(i,n):(r[c]=D(i),r[c].c(),r[c].m(e,null))}for(;c<r.length;c+=1)r[c].d(1);r.length=o.length}},i:n,o:n,d(t){t&&d(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(r,t)}}}function Z(t,n,o){let{extension:r}=n,{close:c}=n;const i=Object.entries(e.color).map((([t,e])=>Object.entries(e).map((([e,n])=>({name:`color.${t}.${e}`,color:n}))))).flat(),s=e.activeClass;return t.$$set=t=>{"extension"in t&&o(2,r=t.extension),"close"in t&&o(3,c=t.close)},[i,s,r,c]}const V=()=>({[e.Language.Español]:void 0});class G extends e.Extension{constructor(...t){super(...t,{id:"simpleprg95grpexample",name:"Super Simple Typescript Extension!",blockIconURI:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB8CAYAAABE3L+AAAAACXBIWXMAAAsTAAALEwEAmpwYAAADQElEQVR4nO3dMWsUQRyG8edyZyEqqBgVJHiaUvA76CcQK3sbsbJVv0AquxSKjaWlpBS0thDBwkpFLTQgQRQtTIxnsVdJsnO3c//du3nfH1x1Ozube8JuYLJ7vdFohGlZ6voArH2OLsjRBTm6IEcXNKh7893HD+vARWC7ncOxTAeB+6tnh4/qNqqNDlwFTs/skKwNL4Ha6KnT+6fZHYu1ZCu1ga/pghxdkKMLcnRBji7I0QU5uiBHF+ToghxdkKMLcnRBqVW2HLvAZuD+SzUATkVPEGUTGFLFt8mdB95GThAZ/S/wJ3D/pfoRPUHkNX0J6Afuv1RHoifwH3KCHF2QowtydEGOLsjRBTm6IEcX5OiCHF2QowuKjL6DV9iaeB89QeQq21HgJtVqm01uOXqC6Ojrgfu3hnxNF+ToghxdkKMLcnRBji7I0QU5uiBHF+ToghxdkKMLcvTyJJs6enmS98JFLq1uAdfxenqbBsCbSTaK8hN4Erh/ayjy9D7AtyrPJV/TBTm6IEcX5OiCHF2QowtydEGOLsjRBTm6IEcX5OiCIlfZcq0AJzua+zt5T2I+Bxyf0bFM6wvwuW6DeY5+B7jR0dzPgcsZ4+8BV2ZzKFNbA27XbTDPp/cun2KRO3eXjzxP/tPKPEff6XDu35njt2dyFM0kP7d5jm5BHF2QowtydEGOLsjRBTm6IEcX5OiCHF2Qowty9L0dyxx/eCZH0UzyG5nneWk110OqteUmv9g94G7N+yPgwPj1/6rWEtXtwq/H+2lTH3ia2qjk6LeAXw3HXgKeZcx9DXicMT5Uyaf31Yyxuaf3Q5njQ5Ucve1T68IoObrtw9EFObogRxfk6IIcXZCjC3J0QY4uyNEFlRw959ak3NuSurwlK8nR95Ybvct72ZJKXlrdoHoS9bQPJd4FTmTOvUa1tNv259sDHoxf+yo5+oUO5x6OX11I/twln95VfUtt4OiCHF2QowtydEGOLsjRBTm6IEcX5OiCHF2QowtKRV/J2PeZjLEAy5njVSWfPp1aZdugWrWZ9puRe8BXqlt6m3pB9QjtLh8MvGj6wKvURr3RKKeLLSJf0wU5uiBHF+ToghxdkKMLcnRB/wBIt0+4Irv7NwAAAABJRU5ErkJggg=="}),G.prototype.__init.call(this),G.prototype.__init2.call(this)}__init(){this.count=0}init(t){}increment(){this.count++}incrementBy(t){this.count+=t}__init2(){this.defineTranslations=V}defineBlocks(){return{log:()=>({type:e.BlockType.Command,arg:{type:e.ArgumentType.String,options:{items:["1","two","three"],acceptsReporters:!0,handler:t=>e.Extension.TryCastToArgumentType(e.ArgumentType.String,t,(()=>(alert(`Unsopported input: ${t}`),"")))}},text:t=>`Log ${t} to the console`,operation:t=>console.log(t)}),dummyUI:()=>({type:e.BlockType.Button,text:"Dummy UI",operation:()=>this.openUI("Dummy","Howdy")}),counterUI:()=>({type:e.BlockType.Button,text:"Open Counter",operation:()=>this.openUI("Counter","Pretty cool, right?")}),colorUI:()=>({type:e.BlockType.Button,text:"Show colors",operation:()=>this.openUI("Palette")})}}}return t.Counter=class extends z{constructor(t){super(),U(this,t,Q,K,s,{extension:0,close:3},F)}},t.Dummy=class extends z{constructor(t){super(),U(this,t,J,X,s,{extension:1,close:2},P)}},t.Extension=G,t.Palette=class extends z{constructor(t){super(),U(this,t,Z,S,s,{extension:2,close:3},N)}},Object.defineProperty(t,"__esModule",{value:!0}),t}({},ExtensionFramework);//# sourceMappingURL=simpleprg95grpexample.js.map
