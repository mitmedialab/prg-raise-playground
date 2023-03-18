var simpleprg95grpexample=(function(exports,$common){'use strict';function noop() { }
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
function to_number(value) {
    return value === '' ? null : +value;
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
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
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
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
}/* extensions/src/simple_example/Counter.svelte generated by Svelte v3.55.1 */

function add_css$2(target) {
	append_styles(target, "svelte-cadbzg", ".container.svelte-cadbzg{text-align:center;padding:30px}button.svelte-cadbzg{border-radius:10px;border:1px solid var(--motion-primary);background-color:var(--motion-primary);padding:10px;font-size:20px;margin-top:10px}button.svelte-cadbzg:hover{background-color:var(--motion-tertiary)}");
}

function create_fragment$2(ctx) {
	let div;
	let h1;
	let t0;
	let t1_value = /*extension*/ ctx[0].count + "";
	let t1;
	let t2;
	let center;
	let button0;
	let t4;
	let br0;
	let t5;
	let button1;
	let t7;
	let input;
	let t8;
	let br1;
	let t9;
	let button2;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			h1 = element("h1");
			t0 = text("The count is ");
			t1 = text(t1_value);
			t2 = space();
			center = element("center");
			button0 = element("button");
			button0.textContent = "Add 1";
			t4 = space();
			br0 = element("br");
			t5 = space();
			button1 = element("button");
			button1.textContent = "Add";
			t7 = space();
			input = element("input");
			t8 = space();
			br1 = element("br");
			t9 = space();
			button2 = element("button");
			button2.textContent = "Reset";
			attr(button0, "class", "svelte-cadbzg");
			attr(button1, "class", "svelte-cadbzg");
			attr(input, "type", "number");
			set_style(input, "width", "50px");
			set_style(input, "font-size", "20px");
			attr(button2, "class", "svelte-cadbzg");
			attr(div, "class", "svelte-cadbzg");
			toggle_class(div, "container", /*container*/ ctx[2]);
			set_style(div, "width", $common.px(360));
			set_style(div, "background-color", $common.color.ui.white);
			set_style(div, "color", $common.color.text.primary);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, h1);
			append(h1, t0);
			append(h1, t1);
			append(div, t2);
			append(div, center);
			append(center, button0);
			append(center, t4);
			append(center, br0);
			append(center, t5);
			append(center, button1);
			append(center, t7);
			append(center, input);
			set_input_value(input, /*value*/ ctx[1]);
			append(center, t8);
			append(center, br1);
			append(center, t9);
			append(center, button2);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*click_handler*/ ctx[4]),
					listen(button1, "click", /*click_handler_1*/ ctx[5]),
					listen(input, "input", /*input_input_handler*/ ctx[6]),
					listen(button2, "click", /*click_handler_2*/ ctx[7])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*extension*/ 1 && t1_value !== (t1_value = /*extension*/ ctx[0].count + "")) set_data(t1, t1_value);

			if (dirty & /*value*/ 2 && to_number(input.value) !== /*value*/ ctx[1]) {
				set_input_value(input, /*value*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { extension } = $$props;
	let { close } = $$props;
	const container = $common.activeClass;
	let value = 2;
	const click_handler = () => $$invalidate(0, extension.count++, extension);
	const click_handler_1 = () => $$invalidate(0, extension.count += value, extension);

	function input_input_handler() {
		value = to_number(this.value);
		$$invalidate(1, value);
	}

	const click_handler_2 = () => $$invalidate(0, extension.count = 0, extension);

	$$self.$$set = $$props => {
		if ('extension' in $$props) $$invalidate(0, extension = $$props.extension);
		if ('close' in $$props) $$invalidate(3, close = $$props.close);
	};

	return [
		extension,
		value,
		container,
		close,
		click_handler,
		click_handler_1,
		input_input_handler,
		click_handler_2
	];
}

class Counter extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { extension: 0, close: 3 }, add_css$2);
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
}const details = {
    name: "Simple Typescript Extension",
    description: "Skeleton for a typescript extension",
    implementationLanguage: $common.Language.English,
    [$common.Language.Español]: {
        name: "Extensión simple Typescript",
        description: "Ejemplo de una extensión simple usando Typescript"
    }
};
var index = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _log_decorators;
    let _dummyUI_decorators;
    let _counterUI_decorators;
    let _colorUI_decorators;
    return _a = class SimpleTypescript extends $common.extension(details, "ui", "customSaveData", "setTransparencyBlock") {
            constructor() {
                super(...[...arguments, ...["Simple Typescript Extension","simpleprg95grpexample","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB8CAYAAABE3L+AAAAACXBIWXMAAAsTAAALEwEAmpwYAAADQElEQVR4nO3dMWsUQRyG8edyZyEqqBgVJHiaUvA76CcQK3sbsbJVv0AquxSKjaWlpBS0thDBwkpFLTQgQRQtTIxnsVdJsnO3c//du3nfH1x1Ozube8JuYLJ7vdFohGlZ6voArH2OLsjRBTm6IEcXNKh7893HD+vARWC7ncOxTAeB+6tnh4/qNqqNDlwFTs/skKwNL4Ha6KnT+6fZHYu1ZCu1ga/pghxdkKMLcnRBji7I0QU5uiBHF+ToghxdkKMLcnRBqVW2HLvAZuD+SzUATkVPEGUTGFLFt8mdB95GThAZ/S/wJ3D/pfoRPUHkNX0J6Afuv1RHoifwH3KCHF2QowtydEGOLsjRBTm6IEcX5OiCHF2QowuKjL6DV9iaeB89QeQq21HgJtVqm01uOXqC6Ojrgfu3hnxNF+ToghxdkKMLcnRBji7I0QU5uiBHF+ToghxdkKMLcvTyJJs6enmS98JFLq1uAdfxenqbBsCbSTaK8hN4Erh/ayjy9D7AtyrPJV/TBTm6IEcX5OiCHF2QowtydEGOLsjRBTm6IEcX5OiCIlfZcq0AJzua+zt5T2I+Bxyf0bFM6wvwuW6DeY5+B7jR0dzPgcsZ4+8BV2ZzKFNbA27XbTDPp/cun2KRO3eXjzxP/tPKPEff6XDu35njt2dyFM0kP7d5jm5BHF2QowtydEGOLsjRBTm6IEcX5OiCHF2Qowty9L0dyxx/eCZH0UzyG5nneWk110OqteUmv9g94G7N+yPgwPj1/6rWEtXtwq/H+2lTH3ia2qjk6LeAXw3HXgKeZcx9DXicMT5Uyaf31Yyxuaf3Q5njQ5Ucve1T68IoObrtw9EFObogRxfk6IIcXZCjC3J0QY4uyNEFlRw959ak3NuSurwlK8nR95Ybvct72ZJKXlrdoHoS9bQPJd4FTmTOvUa1tNv259sDHoxf+yo5+oUO5x6OX11I/twln95VfUtt4OiCHF2QowtydEGOLsjRBTm6IEcX5OiCHF2QowtKRV/J2PeZjLEAy5njVSWfPp1aZdugWrWZ9puRe8BXqlt6m3pB9QjtLh8MvGj6wKvURr3RKKeLLSJf0wU5uiBHF+ToghxdkKMLcnRB/wBIt0+4Irv7NwAAAABJRU5ErkJggg=="]]);
                this.count = (__runInitializers(this, _instanceExtraInitializers), 0);
                this.logOptions = {
                    items: ['1', 'two', 'three'],
                    acceptsReporters: true,
                    handler: (x) => $common.tryCastToArgumentType($common.ArgumentType.String, x, () => {
                        alert(`Unsopported input: ${x}`);
                        return "";
                    })
                };
                this.saveDataHandler = new $common.SaveDataHandler({
                    Extension: SimpleTypescript,
                    onSave: ({ count }) => ({ count }),
                    onLoad: (self, { count }) => self.count = count
                });
            }
            increment() {
                this.count++;
            }
            incrementBy(amount) {
                this.count += amount;
            }
            init(env) { }
            log(msg) {
                this.setVideoTransparencyBlock();
                console.log(msg);
            }
            dummyUI() {
                this.openUI("Dummy", "Howdy");
            }
            counterUI() {
                this.openUI("Counter", "Pretty cool, right?");
            }
            colorUI() {
                this.openUI("Palette");
            }
        },
        (() => {
            _log_decorators = [$common.block((self) => ({
                    type: $common.BlockType.Command,
                    text: (msg) => `Log ${msg} to the console`,
                    arg: { type: $common.ArgumentType.String, options: self.logOptions }
                }))];
            _dummyUI_decorators = [$common.block({ type: $common.BlockType.Button, text: `Dummy UI` })];
            _counterUI_decorators = [$common.block({ type: $common.BlockType.Button, text: "Open Counter" })];
            _colorUI_decorators = [$common.buttonBlock("Show colors")];
            __esDecorate(_a, null, _log_decorators, { kind: "method", name: "log", static: false, private: false, access: { has: obj => "log" in obj, get: obj => obj.log } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _dummyUI_decorators, { kind: "method", name: "dummyUI", static: false, private: false, access: { has: obj => "dummyUI" in obj, get: obj => obj.dummyUI } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _counterUI_decorators, { kind: "method", name: "counterUI", static: false, private: false, access: { has: obj => "counterUI" in obj, get: obj => obj.counterUI } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _colorUI_decorators, { kind: "method", name: "colorUI", static: false, private: false, access: { has: obj => "colorUI" in obj, get: obj => obj.colorUI } }, null, _instanceExtraInitializers);
        })(),
        _a;
})();/* extensions/src/simple_example/Dummy.svelte generated by Svelte v3.55.1 */

function add_css$1(target) {
	append_styles(target, "svelte-1z0o0so", ".container.svelte-1z0o0so{text-align:center;padding:30px}");
}

function create_fragment$1(ctx) {
	let div;
	let t;

	return {
		c() {
			div = element("div");
			t = text(/*displayText*/ ctx[0]);
			attr(div, "class", "svelte-1z0o0so");
			toggle_class(div, "container", /*container*/ ctx[1]);
			set_style(div, "width", $common.px(360));
			set_style(div, "background-color", $common.color.ui.white);
			set_style(div, "color", $common.color.text.primary);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(ctx, [dirty]) {
			if (dirty & /*displayText*/ 1) set_data(t, /*displayText*/ ctx[0]);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { displayText = "Hello, world!" } = $$props;
	let { extension } = $$props;
	let { close } = $$props;
	const container = $common.activeClass;

	$$self.$$set = $$props => {
		if ('displayText' in $$props) $$invalidate(0, displayText = $$props.displayText);
		if ('extension' in $$props) $$invalidate(2, extension = $$props.extension);
		if ('close' in $$props) $$invalidate(3, close = $$props.close);
	};

	return [displayText, container, extension, close];
}

class Dummy extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { displayText: 0, extension: 2, close: 3 }, add_css$1);
	}
}/* extensions/src/simple_example/Palette.svelte generated by Svelte v3.55.1 */

function add_css(target) {
	append_styles(target, "svelte-18zucbn", ".container.svelte-18zucbn{text-align:center}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	return child_ctx;
}

// (20:2) {#each colors as color}
function create_each_block(ctx) {
	let div;
	let t0_value = /*color*/ ctx[4].name + "";
	let t0;
	let t1;

	return {
		c() {
			div = element("div");
			t0 = text(t0_value);
			t1 = space();
			set_style(div, "background-color", /*color*/ ctx[4].color);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function create_fragment(ctx) {
	let div;
	let each_value = /*colors*/ ctx[0];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "svelte-18zucbn");
			toggle_class(div, "container", /*container*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*colors*/ 1) {
				each_value = /*colors*/ ctx[0];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { extension } = $$props;
	let { close } = $$props;

	const colors = Object.entries($common.color).map(([key, innerColors]) => {
		return Object.entries(innerColors).map(([innerKey, color]) => ({ name: `color.${key}.${innerKey}`, color }));
	}).flat();

	const container = $common.activeClass;

	$$self.$$set = $$props => {
		if ('extension' in $$props) $$invalidate(2, extension = $$props.extension);
		if ('close' in $$props) $$invalidate(3, close = $$props.close);
	};

	return [colors, container, extension, close];
}

class Palette extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { extension: 2, close: 3 }, add_css);
	}
}exports.Counter=Counter;exports.Dummy=Dummy;exports.Extension=index;exports.Palette=Palette;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},ExtensionFramework);//# sourceMappingURL=simpleprg95grpexample.js.map
