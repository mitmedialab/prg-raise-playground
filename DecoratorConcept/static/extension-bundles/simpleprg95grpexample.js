var simpleprg95grpexample=function(t,e){"use strict";function n(){}function o(t){return t()}function r(){return Object.create(null)}function c(t){t.forEach(o)}function s(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function u(t,e){t.appendChild(e)}function l(t,e,n){const o=function(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;if(e&&e.host)return e;return t.ownerDocument}(t);if(!o.getElementById(e)){const t=f("style");t.id=e,t.textContent=n,function(t,e){u(t.head||t,e),e.sheet}(o,t)}}function a(t,e,n){t.insertBefore(e,n||null)}function d(t){t.parentNode&&t.parentNode.removeChild(t)}function f(t){return document.createElement(t)}function p(t){return document.createTextNode(t)}function g(){return p(" ")}function m(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function h(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function x(t){return""===t?null:+t}function y(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function b(t,e){t.value=null==e?"":e}function v(t,e,n,o){null===n?t.style.removeProperty(e):t.style.setProperty(e,n,o?"important":"")}function A(t,e,n){t.classList[n?"add":"remove"](e)}let $;function w(t){$=t}const T=[],B=[],E=[],k=[],H=Promise.resolve();let O=!1;function C(t){E.push(t)}const L=new Set;let R=0;function j(){if(0!==R)return;const t=$;do{try{for(;R<T.length;){const t=T[R];R++,w(t),U(t.$$)}}catch(t){throw T.length=0,R=0,t}for(w(null),T.length=0,R=0;B.length;)B.pop()();for(let t=0;t<E.length;t+=1){const e=E[t];L.has(e)||(L.add(e),e())}E.length=0}while(T.length);for(;k.length;)k.pop()();O=!1,L.clear(),w(t)}function U(t){if(null!==t.fragment){t.update(),c(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(C)}}const I=new Set;function z(t,e){-1===t.$$.dirty[0]&&(T.push(t),O||(O=!0,H.then(j)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function F(t,e,i,u,l,a,f,p=[-1]){const g=$;w(t);const m=t.$$={fragment:null,ctx:[],props:a,update:n,not_equal:l,bound:r(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(g?g.$$.context:[])),callbacks:r(),dirty:p,skip_bound:!1,root:e.target||g.$$.root};f&&f(m.root);let h=!1;if(m.ctx=i?i(t,e.props||{},((e,n,...o)=>{const r=o.length?o[0]:n;return m.ctx&&l(m.ctx[e],m.ctx[e]=r)&&(!m.skip_bound&&m.bound[e]&&m.bound[e](r),h&&z(t,e)),n})):[],m.update(),h=!0,c(m.before_update),m.fragment=!!u&&u(m.ctx),e.target){if(e.hydrate){const t=function(t){return Array.from(t.childNodes)}(e.target);m.fragment&&m.fragment.l(t),t.forEach(d)}else m.fragment&&m.fragment.c();e.intro&&((x=t.$$.fragment)&&x.i&&(I.delete(x),x.i(y))),function(t,e,n,r){const{fragment:i,after_update:u}=t.$$;i&&i.m(e,n),r||C((()=>{const e=t.$$.on_mount.map(o).filter(s);t.$$.on_destroy?t.$$.on_destroy.push(...e):c(e),t.$$.on_mount=[]})),u.forEach(C)}(t,e.target,e.anchor,e.customElement),j()}var x,y;w(g)}class K{$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(c(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=n}$on(t,e){if(!s(e))return n;const o=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return o.push(e),()=>{const t=o.indexOf(e);-1!==t&&o.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function Q(t){l(t,"svelte-cadbzg",".container.svelte-cadbzg{text-align:center;padding:30px}button.svelte-cadbzg{border-radius:10px;border:1px solid var(--motion-primary);background-color:var(--motion-primary);padding:10px;font-size:20px;margin-top:10px}button.svelte-cadbzg:hover{background-color:var(--motion-tertiary)}")}function _(t){let o,r,s,i,l,$,w,T,B,E,k,H,O,C,L,R,j,U,I,z=t[0].count+"";return{c(){o=f("div"),r=f("h1"),s=p("The count is "),i=p(z),l=g(),$=f("center"),w=f("button"),w.textContent="Add 1",T=g(),B=f("br"),E=g(),k=f("button"),k.textContent="Add",H=g(),O=f("input"),C=g(),L=f("br"),R=g(),j=f("button"),j.textContent="Reset",h(w,"class","svelte-cadbzg"),h(k,"class","svelte-cadbzg"),h(O,"type","number"),v(O,"width","50px"),v(O,"font-size","20px"),h(j,"class","svelte-cadbzg"),h(o,"class","svelte-cadbzg"),A(o,"container",t[2]),v(o,"width",e.px(360)),v(o,"background-color",e.color.ui.white),v(o,"color",e.color.text.primary)},m(e,n){a(e,o,n),u(o,r),u(r,s),u(r,i),u(o,l),u(o,$),u($,w),u($,T),u($,B),u($,E),u($,k),u($,H),u($,O),b(O,t[1]),u($,C),u($,L),u($,R),u($,j),U||(I=[m(w,"click",t[4]),m(k,"click",t[5]),m(O,"input",t[6]),m(j,"click",t[7])],U=!0)},p(t,[e]){1&e&&z!==(z=t[0].count+"")&&y(i,z),2&e&&x(O.value)!==t[1]&&b(O,t[1])},i:n,o:n,d(t){t&&d(o),U=!1,c(I)}}}function P(t,n,o){let{extension:r}=n,{close:c}=n;const s=e.activeClass;let i=2;return t.$$set=t=>{"extension"in t&&o(0,r=t.extension),"close"in t&&o(3,c=t.close)},[r,i,s,c,()=>o(0,r.count++,r),()=>o(0,r.count+=i,r),function(){i=x(this.value),o(1,i)},()=>o(0,r.count=0,r)]}class X extends e.Extension{constructor(){super(...arguments,null,"simpleprg95grpexample","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB8CAYAAABE3L+AAAAACXBIWXMAAAsTAAALEwEAmpwYAAADQElEQVR4nO3dMWsUQRyG8edyZyEqqBgVJHiaUvA76CcQK3sbsbJVv0AquxSKjaWlpBS0thDBwkpFLTQgQRQtTIxnsVdJsnO3c//du3nfH1x1Ozube8JuYLJ7vdFohGlZ6voArH2OLsjRBTm6IEcXNKh7893HD+vARWC7ncOxTAeB+6tnh4/qNqqNDlwFTs/skKwNL4Ha6KnT+6fZHYu1ZCu1ga/pghxdkKMLcnRBji7I0QU5uiBHF+ToghxdkKMLcnRBqVW2HLvAZuD+SzUATkVPEGUTGFLFt8mdB95GThAZ/S/wJ3D/pfoRPUHkNX0J6Afuv1RHoifwH3KCHF2QowtydEGOLsjRBTm6IEcX5OiCHF2QowuKjL6DV9iaeB89QeQq21HgJtVqm01uOXqC6Ojrgfu3hnxNF+ToghxdkKMLcnRBji7I0QU5uiBHF+ToghxdkKMLcvTyJJs6enmS98JFLq1uAdfxenqbBsCbSTaK8hN4Erh/ayjy9D7AtyrPJV/TBTm6IEcX5OiCHF2QowtydEGOLsjRBTm6IEcX5OiCIlfZcq0AJzua+zt5T2I+Bxyf0bFM6wvwuW6DeY5+B7jR0dzPgcsZ4+8BV2ZzKFNbA27XbTDPp/cun2KRO3eXjzxP/tPKPEff6XDu35njt2dyFM0kP7d5jm5BHF2QowtydEGOLsjRBTm6IEcX5OiCHF2Qowty9L0dyxx/eCZH0UzyG5nneWk110OqteUmv9g94G7N+yPgwPj1/6rWEtXtwq/H+2lTH3ia2qjk6LeAXw3HXgKeZcx9DXicMT5Uyaf31Yyxuaf3Q5njQ5Ucve1T68IoObrtw9EFObogRxfk6IIcXZCjC3J0QY4uyNEFlRw959ak3NuSurwlK8nR95Ybvct72ZJKXlrdoHoS9bQPJd4FTmTOvUa1tNv259sDHoxf+yo5+oUO5x6OX11I/twln95VfUtt4OiCHF2QowtydEGOLsjRBTm6IEcX5OiCHF2QowtKRV/J2PeZjLEAy5njVSWfPp1aZdugWrWZ9puRe8BXqlt6m3pB9QjtLh8MvGj6wKvURr3RKKeLLSJf0wU5uiBHF+ToghxdkKMLcnRB/wBIt0+4Irv7NwAAAABJRU5ErkJggg=="),this.count=0,this.saveDataHandler=new e.SaveDataHandler({Extension:X,onSave:({count:t})=>({count:t}),onLoad:(t,{count:e})=>t.count=e})}init(t){}increment(){this.count++}incrementBy(t){this.count+=t}defineBlocks(){return{log:{type:e.BlockType.Command,arg:{type:e.ArgumentType.String,options:{items:["1","two","three"],acceptsReporters:!0,handler:t=>e.tryCastToArgumentType(e.ArgumentType.String,t,(()=>(alert(`Unsopported input: ${t}`),"")))}},text:t=>`Log ${t} to the console`,operation:t=>console.log(t)},dummyUI:{type:e.BlockType.Button,text:"Dummy UI",operation:()=>this.openUI("Dummy","Howdy")},counterUI:{type:e.BlockType.Button,text:"Open Counter",operation:()=>this.openUI("Counter","Pretty cool, right?")},colorUI:{type:e.BlockType.Button,text:"Show colors",operation:()=>this.openUI("Palette")}}}}function D(t){l(t,"svelte-1z0o0so",".container.svelte-1z0o0so{text-align:center;padding:30px}")}function J(t){let o,r;return{c(){o=f("div"),r=p(t[0]),h(o,"class","svelte-1z0o0so"),A(o,"container",t[1]),v(o,"width",e.px(360)),v(o,"background-color",e.color.ui.white),v(o,"color",e.color.text.primary)},m(t,e){a(t,o,e),u(o,r)},p(t,[e]){1&e&&y(r,t[0])},i:n,o:n,d(t){t&&d(o)}}}function N(t,n,o){let{displayText:r="Hello, world!"}=n,{extension:c}=n,{close:s}=n;const i=e.activeClass;return t.$$set=t=>{"displayText"in t&&o(0,r=t.displayText),"extension"in t&&o(2,c=t.extension),"close"in t&&o(3,s=t.close)},[r,i,c,s]}function q(t){l(t,"svelte-18zucbn",".container.svelte-18zucbn{text-align:center}")}function S(t,e,n){const o=t.slice();return o[4]=e[n],o}function Z(t){let e,o,r,c=t[4].name+"";return{c(){e=f("div"),o=p(c),r=g(),v(e,"background-color",t[4].color)},m(t,n){a(t,e,n),u(e,o),u(e,r)},p:n,d(t){t&&d(e)}}}function V(t){let e,o=t[0],r=[];for(let e=0;e<o.length;e+=1)r[e]=Z(S(t,o,e));return{c(){e=f("div");for(let t=0;t<r.length;t+=1)r[t].c();h(e,"class","svelte-18zucbn"),A(e,"container",t[1])},m(t,n){a(t,e,n);for(let t=0;t<r.length;t+=1)r[t].m(e,null)},p(t,[n]){if(1&n){let c;for(o=t[0],c=0;c<o.length;c+=1){const s=S(t,o,c);r[c]?r[c].p(s,n):(r[c]=Z(s),r[c].c(),r[c].m(e,null))}for(;c<r.length;c+=1)r[c].d(1);r.length=o.length}},i:n,o:n,d(t){t&&d(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(r,t)}}}function G(t,n,o){let{extension:r}=n,{close:c}=n;const s=Object.entries(e.color).map((([t,e])=>Object.entries(e).map((([e,n])=>({name:`color.${t}.${e}`,color:n}))))).flat(),i=e.activeClass;return t.$$set=t=>{"extension"in t&&o(2,r=t.extension),"close"in t&&o(3,c=t.close)},[s,i,r,c]}return t.Counter=class extends K{constructor(t){super(),F(this,t,P,_,i,{extension:0,close:3},Q)}},t.Dummy=class extends K{constructor(t){super(),F(this,t,N,J,i,{displayText:0,extension:2,close:3},D)}},t.Extension=X,t.Palette=class extends K{constructor(t){super(),F(this,t,G,V,i,{extension:2,close:3},q)}},Object.defineProperty(t,"__esModule",{value:!0}),t}({},ExtensionFramework);//# sourceMappingURL=simpleprg95grpexample.js.map
