var extensionProbe=(function(exports,$common){'use strict';function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
        src_url_equal_anchor = document.createElement('a');
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function append(target, node) {
    target.appendChild(node);
}
function append_styles(target, style_sheet_id, styles) {
    const append_styles_to = get_root_for_style(target);
    if (!append_styles_to.getElementById(style_sheet_id)) {
        const style = element('style');
        style.id = style_sheet_id;
        style.textContent = styles;
        append_stylesheet(append_styles_to, style);
    }
}
function get_root_for_style(node) {
    if (!node)
        return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
        return root;
    }
    return node.ownerDocument;
}
function append_stylesheet(node, style) {
    append(node.head || node, style);
    return style.sheet;
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_style(node, key, value, important) {
    if (value === null) {
        node.style.removeProperty(key);
    }
    else {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs#run-time-svelte-onmount
 */
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function
function flush() {
    // Do not reenter flush while dirty components are updated, as this can
    // result in an infinite loop. Instead, let the inner flush handle it.
    // Reentrancy is ok afterwards for bindings etc.
    if (flushidx !== 0) {
        return;
    }
    const saved_component = current_component;
    do {
        // first, call beforeUpdate functions
        // and update components
        try {
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
        }
        catch (e) {
            // reset dirty state to not end up in a deadlocked state and then rethrow
            dirty_components.length = 0;
            flushidx = 0;
            throw e;
        }
        set_current_component(null);
        dirty_components.length = 0;
        flushidx = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
    else if (callback) {
        callback();
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
            // if the component was destroyed immediately
            // it will update the `$$.on_destroy` reference to `null`.
            // the destructured on_destroy may still reference to the old array
            if (component.$$.on_destroy) {
                component.$$.on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: [],
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        if (!is_function(callback)) {
            return noop;
        }
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind,
    key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _,
    done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function (f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? {
      get: descriptor.get,
      set: descriptor.set
    } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.push(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.push(_);else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
}
function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
}const filename = "legacy.ts";
const fullSuppportName = "legacyFullSupport";
const incrementalSupportName = "legacyIncrementalSupport";
const genericExampleName = "GenericExample";
const declareGenericExtension = `export default class ${genericExampleName} extends Extension<..., ...> { ... }`;
const extensionDeclarations = [
    "// generic extension\n" + declareGenericExtension,
    "vs",
    "// configurable extension extension\nexport default class ConfigurableExample extends extension({...}) { ... }"
].join("\n\n");
const supportMembers = {
    legacyExtension: "legacyExtension",
    legacyDefinition: "legacyDefinition",
    legacyBlock: "legacyBlock",
    ReservedNames: "ReservedNames",
};
const { legacyExtension, legacyDefinition, legacyBlock, ReservedNames } = supportMembers;
const usedByGeneric = { legacyExtension, legacyDefinition, ReservedNames };
const extractPropertiesForGeneric = (funcName) => `const { ${Object.values(usedByGeneric).join(", ")} } = ${funcName}<${genericExampleName}>();`;
const genericDescriptions = {
    [legacyExtension]: {
        description: "A decorator to apply to your extension in order to give it legacy support",
        snippet: ["@legacyExtension()", declareGenericExtension].join("\n")
    },
    [legacyDefinition]: {
        description: "A utility function to assist in defining legacy blocks within your extension",
        snippet: `defineBlocks() {
  // Assuming that the legacy extension defined a block with the name 'exampleLegacyBlock'
  return {
    exampleLegacyBlock: legacyBlock.exampleLegacyBlock({
      operation: (x: number) => { ... },
      argumentMethods: {  
        ...
        // See jsdoc documentation
      }
    })
  }
}`
    },
    [ReservedNames]: {
        description: `This member should not be used, but instead you can hover over it to identify names that have been 'reserved' by the legacy extension. 
The names included within the 'blocks' property correspond to blocks your extension will have to define. 
Your class will be prohibited from defining members with the same name as any of these reserved names.`,
    }
};var index = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _displayInfo_decorators;
    let _legacyProbe_decorators;
    return _a = class ExtensionProbe extends $common.extension({
            name: "Extension Probe",
            description: "(INTERNAL) Use this extension to probe the info of other estensions",
        }, "ui") {
            constructor() {
                super(...[...arguments, ...["Extension Probe","extensionProbe","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB8CAYAAABE3L+AAAAACXBIWXMAAAsTAAALEwEAmpwYAAADQElEQVR4nO3dMWsUQRyG8edyZyEqqBgVJHiaUvA76CcQK3sbsbJVv0AquxSKjaWlpBS0thDBwkpFLTQgQRQtTIxnsVdJsnO3c//du3nfH1x1Ozube8JuYLJ7vdFohGlZ6voArH2OLsjRBTm6IEcXNKh7893HD+vARWC7ncOxTAeB+6tnh4/qNqqNDlwFTs/skKwNL4Ha6KnT+6fZHYu1ZCu1ga/pghxdkKMLcnRBji7I0QU5uiBHF+ToghxdkKMLcnRBqVW2HLvAZuD+SzUATkVPEGUTGFLFt8mdB95GThAZ/S/wJ3D/pfoRPUHkNX0J6Afuv1RHoifwH3KCHF2QowtydEGOLsjRBTm6IEcX5OiCHF2QowuKjL6DV9iaeB89QeQq21HgJtVqm01uOXqC6Ojrgfu3hnxNF+ToghxdkKMLcnRBji7I0QU5uiBHF+ToghxdkKMLcvTyJJs6enmS98JFLq1uAdfxenqbBsCbSTaK8hN4Erh/ayjy9D7AtyrPJV/TBTm6IEcX5OiCHF2QowtydEGOLsjRBTm6IEcX5OiCIlfZcq0AJzua+zt5T2I+Bxyf0bFM6wvwuW6DeY5+B7jR0dzPgcsZ4+8BV2ZzKFNbA27XbTDPp/cun2KRO3eXjzxP/tPKPEff6XDu35njt2dyFM0kP7d5jm5BHF2QowtydEGOLsjRBTm6IEcX5OiCHF2Qowty9L0dyxx/eCZH0UzyG5nneWk110OqteUmv9g94G7N+yPgwPj1/6rWEtXtwq/H+2lTH3ia2qjk6LeAXw3HXgKeZcx9DXicMT5Uyaf31Yyxuaf3Q5njQ5Ucve1T68IoObrtw9EFObogRxfk6IIcXZCjC3J0QY4uyNEFlRw959ak3NuSurwlK8nR95Ybvct72ZJKXlrdoHoS9bQPJd4FTmTOvUa1tNv259sDHoxf+yo5+oUO5x6OX11I/twln95VfUtt4OiCHF2QowtydEGOLsjRBTm6IEcX5OiCHF2QowtKRV/J2PeZjLEAy5njVSWfPp1aZdugWrWZ9puRe8BXqlt6m3pB9QjtLh8MvGj6wKvURr3RKKeLLSJf0wU5uiBHF+ToghxdkKMLcnRB/wBIt0+4Irv7NwAAAABJRU5ErkJggg=="]]);
                this.extensionManager = (__runInitializers(this, _instanceExtraInitializers), void 0);
                this.addedExtensions = [];
                this.defaultOption = "Add an extension to probe it";
            }
            init({ runtime, extensionManager }) {
                this.extensionManager = extensionManager;
                runtime.addListener($common.RuntimeEvent.ExtensionAdded, ({ name, id }) => {
                    if (id === this.id)
                        return;
                    this.addedExtensions.push({ text: name, value: id });
                });
            }
            displayInfo(extensionID) {
                const info = this.getExtensionInfo(extensionID);
                this.currentInfo = info;
                this.openUI("Info", `Info for ${info.name}`);
            }
            legacyProbe(extensionID) {
                const info = this.getExtensionInfo(extensionID);
                if (!info)
                    return;
                download(filename, getLegacyFileContent(info));
                this.openUI("Instructions", "How to use legacy.ts");
            }
            getExtension(id) {
                if (id !== this.defaultOption)
                    return this.extensionManager.getExtensionInstance(id);
                alert("You must load an extension and then select it's ID in order to probe it.");
                return undefined;
            }
            getExtensionInfo(id) {
                const instance = this.getExtension(id);
                return instance ? getCleanedInfo(instance) : undefined;
            }
            getIDs() {
                return this.addedExtensions.length > 0 ? this.addedExtensions : [this.defaultOption];
            }
        },
        (() => {
            _displayInfo_decorators = [$common.block((self) => ({
                    type: "command",
                    text: (id) => `Show info for ${id}`,
                    arg: { type: $common.ArgumentType.String, options: self.getIDs }
                }))];
            _legacyProbe_decorators = [$common.block((self) => ({
                    type: "command",
                    text: (id) => `Get legacy support for ${id}`,
                    arg: { type: $common.ArgumentType.String, options: self.getIDs }
                }))];
            __esDecorate(_a, null, _displayInfo_decorators, { kind: "method", name: "displayInfo", static: false, private: false, access: { has: obj => "displayInfo" in obj, get: obj => obj.displayInfo } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _legacyProbe_decorators, { kind: "method", name: "legacyProbe", static: false, private: false, access: { has: obj => "legacyProbe" in obj, get: obj => obj.legacyProbe } }, null, _instanceExtraInitializers);
        })(),
        _a;
})();
const getCleanedInfo = (extension) => {
    const info = extension.getInfo();
    const purgeKeys = ["blockIconURI", "menuIconURI"];
    purgeKeys.filter(key => key in info).forEach(key => delete info[key]);
    info.blocks = info.blocks
        .map(block => $common.isString(block)
        ? undefined
        : "blockType" in block ? block : { ...block, blockType: "command" })
        .filter(Boolean);
    if (info.menus) {
        info.menus = Object.entries(info.menus).reduce((acc, [key, value]) => {
            if (!$common.isString(value)) {
                const acceptReporters = "acceptReporters";
                if (!(acceptReporters in value))
                    value[acceptReporters] = false;
            }
            acc[key] = value;
            return acc;
        }, {});
    }
    return info;
};
const getLegacyFileContent = (info) => {
    const method = "for";
    const importName = "legacy";
    const variableName = "info";
    const declareAndExport = "export const";
    const imports = `import { ${importName} } from "$common";`;
    const declaration = `${declareAndExport} ${variableName} = ${JSON.stringify(info, null, 2)} as const;`;
    const flags = JSON.stringify({ incrementalDevelopment: true });
    const exports = [
        `${declareAndExport} ${fullSuppportName} = ${importName}(${variableName}).${method};`,
        `${declareAndExport} ${incrementalSupportName} = ${importName}(${variableName}, ${flags}).${method};`
    ].join("\n");
    return [imports, declaration, exports].join("\n");
};
const download = (filename, text) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};/* extensions/src/common/components/Snippet.svelte generated by Svelte v3.55.1 */

function add_css$2(target) {
	append_styles(target, "svelte-1mfppcc", "button.svelte-1mfppcc{margin-top:0px}");
}

// (19:0) {#if copyable === "top"}
function create_if_block_1(ctx) {
	let center;
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			center = element("center");
			button = element("button");
			button.textContent = "Copy Snippet";
			attr(button, "class", "svelte-1mfppcc");
		},
		m(target, anchor) {
			insert(target, center, anchor);
			append(center, button);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler*/ ctx[4]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(center);
			mounted = false;
			dispose();
		}
	};
}

// (23:0) {#if copyable === true}
function create_if_block$1(ctx) {
	let center;
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			center = element("center");
			button = element("button");
			button.textContent = "Copy Snippet";
			attr(button, "class", "svelte-1mfppcc");
		},
		m(target, anchor) {
			insert(target, center, anchor);
			append(center, button);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler_1*/ ctx[5]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(center);
			mounted = false;
			dispose();
		}
	};
}

function create_fragment$2(ctx) {
	let link;
	let script;
	let script_src_value;
	let t0;
	let t1;
	let pre;
	let code_1;
	let t2;
	let t3;
	let if_block1_anchor;
	let mounted;
	let dispose;
	let if_block0 = /*copyable*/ ctx[1] === "top" && create_if_block_1(ctx);
	let if_block1 = /*copyable*/ ctx[1] === true && create_if_block$1(ctx);

	return {
		c() {
			link = element("link");
			script = element("script");
			t0 = space();
			if (if_block0) if_block0.c();
			t1 = space();
			pre = element("pre");
			code_1 = element("code");
			t2 = text(/*code*/ ctx[0]);
			t3 = space();
			if (if_block1) if_block1.c();
			if_block1_anchor = empty();
			attr(link, "rel", "stylesheet");
			attr(link, "href", "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/vs2015.min.css");
			if (!src_url_equal(script.src, script_src_value = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js")) attr(script, "src", script_src_value);
			attr(code_1, "class", "language-typescript");
		},
		m(target, anchor) {
			append(document.head, link);
			append(document.head, script);
			insert(target, t0, anchor);
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t1, anchor);
			insert(target, pre, anchor);
			append(pre, code_1);
			append(code_1, t2);
			insert(target, t3, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, if_block1_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(link, "load", /*highlight*/ ctx[3]),
					listen(script, "load", /*highlight*/ ctx[3])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (/*copyable*/ ctx[1] === "top") {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(t1.parentNode, t1);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty & /*code*/ 1) set_data(t2, /*code*/ ctx[0]);

			if (/*copyable*/ ctx[1] === true) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block$1(ctx);
					if_block1.c();
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			detach(link);
			detach(script);
			if (detaching) detach(t0);
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach(t1);
			if (detaching) detach(pre);
			if (detaching) detach(t3);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach(if_block1_anchor);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { code } = $$props;
	let { copyable = true } = $$props;
	const clipboard = text => navigator.clipboard.writeText(text);
	const highlight = () => window["hljs"]?.highlightAll();
	onMount(highlight);
	const click_handler = () => clipboard(code);
	const click_handler_1 = () => clipboard(code);

	$$self.$$set = $$props => {
		if ('code' in $$props) $$invalidate(0, code = $$props.code);
		if ('copyable' in $$props) $$invalidate(1, copyable = $$props.copyable);
	};

	return [code, copyable, clipboard, highlight, click_handler, click_handler_1];
}

class Snippet extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { code: 0, copyable: 1 }, add_css$2);
	}
}/* extensions/src/extensionProbe/Info.svelte generated by Svelte v3.55.1 */

function add_css$1(target) {
	append_styles(target, "svelte-qmu6lz", ".container.svelte-qmu6lz{padding:30px;height:80vh;width:80vw;overflow:scroll}");
}

function create_fragment$1(ctx) {
	let div;
	let snippet;
	let current;

	snippet = new Snippet({
			props: {
				code: JSON.stringify(/*extension*/ ctx[0].currentInfo ?? "ERROR: No info", null, 4)
			}
		});

	return {
		c() {
			div = element("div");
			create_component(snippet.$$.fragment);
			attr(div, "class", "svelte-qmu6lz");
			toggle_class(div, "container", /*container*/ ctx[1]);
			set_style(div, "background-color", $common.color.ui.white);
			set_style(div, "color", $common.color.text.primary);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(snippet, div, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const snippet_changes = {};
			if (dirty & /*extension*/ 1) snippet_changes.code = JSON.stringify(/*extension*/ ctx[0].currentInfo ?? "ERROR: No info", null, 4);
			snippet.$set(snippet_changes);
		},
		i(local) {
			if (current) return;
			transition_in(snippet.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(snippet.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(snippet);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { extension } = $$props;
	let { close } = $$props;
	const container = $common.activeClass;

	$$self.$$set = $$props => {
		if ('extension' in $$props) $$invalidate(0, extension = $$props.extension);
		if ('close' in $$props) $$invalidate(2, close = $$props.close);
	};

	return [extension, container, close];
}

class Info extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { extension: 0, close: 2 }, add_css$1);
	}
}/* extensions/src/extensionProbe/Instructions.svelte generated by Svelte v3.55.1 */

function add_css(target) {
	append_styles(target, "svelte-7ob0w7", ".container.svelte-7ob0w7{padding:30px;height:80vh;width:80vw;overflow:scroll}.codelike.svelte-7ob0w7{background-color:black;color:rgb(210, 134, 80);padding:3px;font-family:monospace}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i][0];
	child_ctx[5] = list[i][1].description;
	child_ctx[6] = list[i][1].snippet;
	return child_ctx;
}

// (54:14) {#if snippet}
function create_if_block(ctx) {
	let snippet;
	let current;
	snippet = new Snippet({ props: { code: /*snippet*/ ctx[6] } });

	return {
		c() {
			create_component(snippet.$$.fragment);
		},
		m(target, anchor) {
			mount_component(snippet, target, anchor);
			current = true;
		},
		p: noop,
		i(local) {
			if (current) return;
			transition_in(snippet.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(snippet.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(snippet, detaching);
		}
	};
}

// (51:10) {#each Object.entries(genericDescriptions) as [field, {description, snippet}
function create_each_block(ctx) {
	let li;
	let strong;
	let t0_value = /*field*/ ctx[4] + "";
	let t0;
	let t1;
	let t2;
	let t3_value = /*description*/ ctx[5] + "";
	let t3;
	let t4;
	let t5;
	let current;
	let if_block = /*snippet*/ ctx[6] && create_if_block(ctx);

	return {
		c() {
			li = element("li");
			strong = element("strong");
			t0 = text(t0_value);
			t1 = text(":");
			t2 = space();
			t3 = text(t3_value);
			t4 = space();
			if (if_block) if_block.c();
			t5 = space();
		},
		m(target, anchor) {
			insert(target, li, anchor);
			append(li, strong);
			append(strong, t0);
			append(strong, t1);
			append(li, t2);
			append(li, t3);
			append(li, t4);
			if (if_block) if_block.m(li, null);
			append(li, t5);
			current = true;
		},
		p(ctx, dirty) {
			if (/*snippet*/ ctx[6]) if_block.p(ctx, dirty);
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(li);
			if (if_block) if_block.d();
		}
	};
}

function create_fragment(ctx) {
	let div;
	let h30;
	let t1;
	let span0;
	let t3;
	let ol0;
	let li0;
	let t7;
	let li1;
	let t8;
	let span2;
	let t10;
	let snippet0;
	let t11;
	let span3;
	let t13;
	let snippet1;
	let t14;
	let h31;
	let t16;
	let ol1;
	let li2;
	let t17;
	let t18;
	let t19;
	let snippet2;
	let t20;
	let li3;
	let t21;
	let ul;
	let t22;
	let li4;
	let t23;
	let t24;
	let t25;
	let t26;
	let t27;
	let snippet3;
	let t28;
	let h32;
	let t30;
	let current;

	snippet0 = new Snippet({
			props: { code: /*importStatement*/ ctx[1] }
		});

	snippet1 = new Snippet({
			props: {
				code: extensionDeclarations,
				copyable: false
			}
		});

	snippet2 = new Snippet({
			props: {
				code: extractPropertiesForGeneric(incrementalSupportName)
			}
		});

	let each_value = Object.entries(genericDescriptions);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	snippet3 = new Snippet({
			props: {
				code: extractPropertiesForGeneric(fullSuppportName)
			}
		});

	return {
		c() {
			div = element("div");
			h30 = element("h3");
			h30.textContent = "Next Steps";
			t1 = text("\n  Once you've downloaded the ");
			span0 = element("span");
			span0.textContent = `${filename}`;
			t3 = text(" file:\n  ");
			ol0 = element("ol");
			li0 = element("li");
			li0.innerHTML = `Move the download into your extension folder so you can use it in your extension&#39;s <span class="codelike svelte-7ob0w7">index.ts</span> file.`;
			t7 = space();
			li1 = element("li");
			t8 = text("Import the following functions into your ");
			span2 = element("span");
			span2.textContent = "index.ts";
			t10 = text(" file from the downloaded legacy file:\n          ");
			create_component(snippet0.$$.fragment);
			t11 = text("\n      The remaining instructions vary depending on if you're extending the generic Extension base class vs using the onfigurable");
			span3 = element("span");
			span3.textContent = "extension()";
			t13 = text(" factory function.\n      ");
			create_component(snippet1.$$.fragment);
			t14 = space();
			h31 = element("h3");
			h31.textContent = "Generic Extension";
			t16 = space();
			ol1 = element("ol");
			li2 = element("li");
			t17 = text("Extract the necessary properties from ");
			t18 = text(incrementalSupportName);
			t19 = space();
			create_component(snippet2.$$.fragment);
			t20 = space();
			li3 = element("li");
			t21 = text("Utilize the elements like so:\n        ");
			ul = element("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t22 = space();
			li4 = element("li");
			t23 = text("Once you've implemented all legacy blocks, you can finally replace the usage of ");
			t24 = text(incrementalSupportName);
			t25 = text(" with ");
			t26 = text(fullSuppportName);
			t27 = text(". \n        If this does not cause type errors, it means you've succesfully implemented all legacy blocks. \n        If you do get errors, there are likely some blocks you still need to implement, or perhaps you have a member that uses a Reserved Name. \n        ");
			create_component(snippet3.$$.fragment);
			t28 = space();
			h32 = element("h3");
			h32.textContent = "Configurable Extension";
			t30 = text("\n  TODO");
			attr(span0, "class", "codelike svelte-7ob0w7");
			attr(span2, "class", "codelike svelte-7ob0w7");
			attr(span3, "class", "codelike svelte-7ob0w7");
			attr(div, "class", "svelte-7ob0w7");
			toggle_class(div, "container", /*container*/ ctx[0]);
			set_style(div, "background-color", $common.color.ui.white);
			set_style(div, "color", $common.color.text.primary);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, h30);
			append(div, t1);
			append(div, span0);
			append(div, t3);
			append(div, ol0);
			append(ol0, li0);
			append(ol0, t7);
			append(ol0, li1);
			append(li1, t8);
			append(li1, span2);
			append(li1, t10);
			mount_component(snippet0, li1, null);
			append(ol0, t11);
			append(ol0, span3);
			append(ol0, t13);
			mount_component(snippet1, ol0, null);
			append(div, t14);
			append(div, h31);
			append(div, t16);
			append(div, ol1);
			append(ol1, li2);
			append(li2, t17);
			append(li2, t18);
			append(li2, t19);
			mount_component(snippet2, li2, null);
			append(ol1, t20);
			append(ol1, li3);
			append(li3, t21);
			append(li3, ul);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(ul, null);
			}

			append(ol1, t22);
			append(ol1, li4);
			append(li4, t23);
			append(li4, t24);
			append(li4, t25);
			append(li4, t26);
			append(li4, t27);
			mount_component(snippet3, li4, null);
			append(div, t28);
			append(div, h32);
			append(div, t30);
			current = true;
		},
		p(ctx, [dirty]) {
			if (dirty & /*Object, genericDescriptions*/ 0) {
				each_value = Object.entries(genericDescriptions);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(ul, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(snippet0.$$.fragment, local);
			transition_in(snippet1.$$.fragment, local);
			transition_in(snippet2.$$.fragment, local);

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			transition_in(snippet3.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(snippet0.$$.fragment, local);
			transition_out(snippet1.$$.fragment, local);
			transition_out(snippet2.$$.fragment, local);
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			transition_out(snippet3.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(snippet0);
			destroy_component(snippet1);
			destroy_component(snippet2);
			destroy_each(each_blocks, detaching);
			destroy_component(snippet3);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { extension } = $$props;
	let { close } = $$props;
	const container = $common.activeClass;
	const importStatement = `import { ${fullSuppportName}, ${incrementalSupportName} } from "./${filename.replace(".ts", "")}";`;

	$$self.$$set = $$props => {
		if ('extension' in $$props) $$invalidate(2, extension = $$props.extension);
		if ('close' in $$props) $$invalidate(3, close = $$props.close);
	};

	return [container, importStatement, extension, close];
}

class Instructions extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { extension: 2, close: 3 }, add_css);
	}
}exports.Extension=index;exports.Info=Info;exports.Instructions=Instructions;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},ExtensionFramework);//# sourceMappingURL=extensionProbe.js.map
