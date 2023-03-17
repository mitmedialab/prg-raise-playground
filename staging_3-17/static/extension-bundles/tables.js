var tables=(function(exports,$common){'use strict';function noop() { }
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
function text$1(data) {
    return document.createTextNode(data);
}
function space() {
    return text$1(' ');
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
function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
    select.selectedIndex = -1; // no option should be selected
}
function select_value(select) {
    const selected_option = select.querySelector(':checked') || select.options[0];
    return selected_option && selected_option.__value;
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        // @ts-ignore
        callbacks.slice().forEach(fn => fn.call(this, event));
    }
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
}/**
 * Makes it easier to reference the css color variables defined in prg-extension-boilerplate/packages/scratch-gui/src/components/programmatic-modal/programmatic-modal.jsx
 */
class CssVar {
    constructor(root) { this.root = root; }
    get(...parts) { return `var(--${this.root}-${parts.join("-")})`; }
    primary(...parts) { return this.get("primary", ...parts); }
    secondary(...parts) { return this.get("secondary", ...parts); }
    tertiary(...parts) { return this.get("tertiary", ...parts); }
    transparent(...parts) { return this.get("transparent", ...parts); }
    light(...parts) { return this.get("light", ...parts); }
}
const ui = new CssVar("ui" /* Color.ui */);
const text = new CssVar("text" /* Color.text */);
const motion = new CssVar("motion" /* Color.motion */);
const red = new CssVar("red" /* Color.red */);
const sound = new CssVar("sound" /* Color.sound */);
const control = new CssVar("control" /* Color.control */);
const data = new CssVar("data" /* Color.data */);
const pen = new CssVar("pen" /* Color.pen */);
const error$1 = new CssVar("error" /* Color.error */);
const extensions = new CssVar("extensions" /* Color.extensions */);
const drop = new CssVar("extensions" /* Color.extensions */);
/**
 * Color variable references corresponding to the css variables defined in prg-extension-boilerplate/packages/scratch-gui/src/components/programmatic-modal/programmatic-modal.jsx
 */
const color = {
    "ui": {
        primary: ui.primary(),
        secondary: ui.secondary(),
        tertiary: ui.tertiary(),
        modalOverlay: ui.get("modal", "overlay"),
        white: ui.get("white"),
        whiteDim: ui.get("white", "dim"),
        whiteTransparent: ui.get("white", "transparent"),
        transparent: ui.transparent(),
        blackTransparent: ui.get("black", "transparent"),
    },
    "text": {
        primary: text.primary(),
        primaryTransparent: text.transparent(),
    },
    "motion": {
        primary: motion.primary(),
        tertiary: motion.tertiary(),
        transparent: motion.get("transparent"),
        lightTansparent: motion.light("transparent"),
    },
    "red": {
        primary: red.primary(),
        tertiary: red.tertiary(),
    },
    "sound": {
        primary: sound.primary(),
        tertiary: sound.tertiary(),
    },
    "control": {
        primary: control.primary(),
    },
    "data": {
        primary: data.primary(),
    },
    "pen": {
        primary: pen.primary(),
        transparent: pen.transparent(),
    },
    "error": {
        primary: error$1.primary(),
        light: error$1.light(),
        transparent: error$1.transparent(),
    },
    "extensions": {
        primary: extensions.primary(),
        tertiary: extensions.tertiary(),
        light: extensions.light(),
        transparent: extensions.transparent(),
    },
    "drop": {
        highlight: drop.get("highlight")
    }
};/* extensions/src/common/components/Ok.svelte generated by Svelte v3.55.1 */

function add_css$3(target) {
	append_styles(target, "svelte-2pm55u", "button.svelte-2pm55u:disabled{background:var(--drop-highlight);border:var(--drop-highlight)}button.svelte-2pm55u{padding:0.75rem 1rem;border-radius:0.25rem;border-width:1px;border-style:solid;font-weight:600;font-size:0.85rem;transition:background-color 0.25s, border-color 0.25s}");
}

function create_fragment$3(ctx) {
	let button;
	let t;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			t = text$1("OK");
			button.disabled = /*disabled*/ ctx[0];
			attr(button, "data-testid", "ok");
			attr(button, "class", "svelte-2pm55u");
			set_style(button, "border-color", /*solid*/ ctx[2]);
			set_style(button, "background-color", /*solid*/ ctx[2]);
			set_style(button, "color", /*text*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, t);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler*/ ctx[3]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*disabled*/ 1) {
				button.disabled = /*disabled*/ ctx[0];
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let { disabled = false } = $$props;
	const text = color.ui.white;
	const solid = color.motion.primary;

	function click_handler(event) {
		bubble.call(this, $$self, event);
	}

	$$self.$$set = $$props => {
		if ('disabled' in $$props) $$invalidate(0, disabled = $$props.disabled);
	};

	return [disabled, text, solid, click_handler];
}

class Ok extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { disabled: 0 }, add_css$3);
	}
}/* extensions/src/common/components/Cancel.svelte generated by Svelte v3.55.1 */

function add_css$2(target) {
	append_styles(target, "svelte-1lnk5kq", "button.svelte-1lnk5kq{padding:0.75rem 1rem;border-radius:0.25rem;border-width:1px;border-style:solid;font-weight:600;font-size:0.85rem}");
}

function create_fragment$2(ctx) {
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = "Cancel";
			attr(button, "class", "svelte-1lnk5kq");
			set_style(button, "border-color", /*black*/ ctx[0]);
			set_style(button, "background-color", /*black*/ ctx[0]);
			set_style(button, "color", /*black*/ ctx[0]);
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler*/ ctx[1]);
				mounted = true;
			}
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

function instance$2($$self) {
	const black = color.ui.blackTransparent;

	function click_handler(event) {
		bubble.call(this, $$self, event);
	}

	return [black, click_handler];
}

class Cancel extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, {}, add_css$2);
	}
}/* extensions/src/tables/Make.svelte generated by Svelte v3.55.1 */

function add_css$1(target) {
	append_styles(target, "svelte-3p09kw", ".container.svelte-3p09kw{width:360px;background-color:var(--ui-white);padding:30px;padding:1.5rem 2.25rem}.label.svelte-3p09kw{font-weight:500;margin:0 0 0.75rem}.numberInputContainer.svelte-3p09kw{display:flex;justify-content:space-between;align-items:center}input.svelte-3p09kw{border:1px solid var(--ui-black-transparent);border-radius:5px}.numberInput.svelte-3p09kw{margin-bottom:1.5rem;border:1px solid var(--ui-black-transparent);border-radius:5px;padding:0 1rem;height:3rem;color:var(--text-primary-transparent);font-size:.875rem;vertical-align:middle;margin-top:20px}.nameInput.svelte-3p09kw{margin-bottom:1.5rem;width:100%;border:1px solid var(--ui-black-transparent);border-radius:5px;padding:0 1rem;height:3rem;color:var(--text-primary-transparent);font-size:.875rem}.error.svelte-3p09kw{margin:0px;font-weight:bold}");
}

function create_fragment$1(ctx) {
	let div7;
	let div1;
	let div0;
	let t1;
	let input0;
	let t2;
	let div3;
	let div2;
	let t4;
	let input1;
	let t5;
	let div5;
	let div4;
	let t7;
	let input2;
	let t8;
	let div6;
	let ok;
	let t9;
	let cancel;
	let t10;
	let p;
	let current;
	let mounted;
	let dispose;

	ok = new Ok({
			props: {
				disabled: /*zeroLength*/ ctx[4] || /*alreadyTaken*/ ctx[5]
			}
		});

	ok.$on("click", /*submit*/ ctx[6]);
	cancel = new Cancel({});

	cancel.$on("click", function () {
		if (is_function(/*close*/ ctx[0])) /*close*/ ctx[0].apply(this, arguments);
	});

	return {
		c() {
			div7 = element("div");
			div1 = element("div");
			div0 = element("div");
			div0.textContent = "Table Name";
			t1 = space();
			input0 = element("input");
			t2 = space();
			div3 = element("div");
			div2 = element("div");
			div2.textContent = "Number of Rows";
			t4 = space();
			input1 = element("input");
			t5 = space();
			div5 = element("div");
			div4 = element("div");
			div4.textContent = "Number of Columns";
			t7 = space();
			input2 = element("input");
			t8 = space();
			div6 = element("div");
			create_component(ok.$$.fragment);
			t9 = space();
			create_component(cancel.$$.fragment);
			t10 = space();
			p = element("p");
			p.textContent = "That table name already exists";
			attr(div0, "class", "svelte-3p09kw");
			toggle_class(div0, "label", label);
			input0.autofocus = true;
			attr(input0, "data-testid", "makeNameInput");
			attr(input0, "class", "svelte-3p09kw");
			toggle_class(input0, "nameInput", nameInput);
			attr(div2, "class", "svelte-3p09kw");
			toggle_class(div2, "label", label);
			attr(input1, "type", "number");
			attr(input1, "min", min);
			attr(input1, "max", max);
			attr(input1, "class", "svelte-3p09kw");
			toggle_class(input1, "numberInput", numberInput);
			attr(div3, "class", "svelte-3p09kw");
			toggle_class(div3, "numberInputContainer", numberInputContainer);
			attr(div4, "class", "svelte-3p09kw");
			toggle_class(div4, "label", label);
			attr(input2, "type", "number");
			attr(input2, "min", min);
			attr(input2, "max", max);
			attr(input2, "class", "svelte-3p09kw");
			toggle_class(input2, "numberInput", numberInput);
			attr(div5, "class", "svelte-3p09kw");
			toggle_class(div5, "numberInputContainer", numberInputContainer);
			attr(p, "class", "svelte-3p09kw");
			toggle_class(p, "error", error);
			set_style(p, "visibility", /*alreadyTaken*/ ctx[5] ? "visible" : "hidden");
			set_style(p, "color", $common.color.error.primary);
			attr(div7, "class", "svelte-3p09kw");
			toggle_class(div7, "container", container);
		},
		m(target, anchor) {
			insert(target, div7, anchor);
			append(div7, div1);
			append(div1, div0);
			append(div1, t1);
			append(div1, input0);
			set_input_value(input0, /*name*/ ctx[1]);
			append(div7, t2);
			append(div7, div3);
			append(div3, div2);
			append(div3, t4);
			append(div3, input1);
			set_input_value(input1, /*rows*/ ctx[2]);
			append(div7, t5);
			append(div7, div5);
			append(div5, div4);
			append(div5, t7);
			append(div5, input2);
			set_input_value(input2, /*columns*/ ctx[3]);
			append(div7, t8);
			append(div7, div6);
			mount_component(ok, div6, null);
			append(div6, t9);
			mount_component(cancel, div6, null);
			append(div7, t10);
			append(div7, p);
			current = true;
			input0.focus();

			if (!mounted) {
				dispose = [
					listen(input0, "input", /*input0_input_handler*/ ctx[8]),
					listen(input1, "input", /*input1_input_handler*/ ctx[9]),
					listen(input2, "input", /*input2_input_handler*/ ctx[10])
				];

				mounted = true;
			}
		},
		p(new_ctx, [dirty]) {
			ctx = new_ctx;

			if (dirty & /*name*/ 2 && input0.value !== /*name*/ ctx[1]) {
				set_input_value(input0, /*name*/ ctx[1]);
			}

			if (dirty & /*rows*/ 4 && to_number(input1.value) !== /*rows*/ ctx[2]) {
				set_input_value(input1, /*rows*/ ctx[2]);
			}

			if (dirty & /*columns*/ 8 && to_number(input2.value) !== /*columns*/ ctx[3]) {
				set_input_value(input2, /*columns*/ ctx[3]);
			}

			const ok_changes = {};
			if (dirty & /*zeroLength, alreadyTaken*/ 48) ok_changes.disabled = /*zeroLength*/ ctx[4] || /*alreadyTaken*/ ctx[5];
			ok.$set(ok_changes);

			if (dirty & /*alreadyTaken*/ 32) {
				set_style(p, "visibility", /*alreadyTaken*/ ctx[5] ? "visible" : "hidden");
			}
		},
		i(local) {
			if (current) return;
			transition_in(ok.$$.fragment, local);
			transition_in(cancel.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(ok.$$.fragment, local);
			transition_out(cancel.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div7);
			destroy_component(ok);
			destroy_component(cancel);
			mounted = false;
			run_all(dispose);
		}
	};
}

const container = true;
const label = true;
const numberInputContainer = true, numberInput = true, nameInput = true;
const error = true;
const min = 1, max = 100;

function instance$1($$self, $$props, $$invalidate) {
	let { extension } = $$props;
	let { close } = $$props;
	const invoke = (functionName, ...args) => $common.reactiveInvoke($$invalidate(7, extension), functionName, args);
	let name = "";
	let rows = 1;
	let columns = 1;
	let zeroLength, alreadyTaken;

	const submit = () => {
		invoke("newTable", { name, rows, columns });
		close();
	};

	function input0_input_handler() {
		name = this.value;
		$$invalidate(1, name);
	}

	function input1_input_handler() {
		rows = to_number(this.value);
		$$invalidate(2, rows);
	}

	function input2_input_handler() {
		columns = to_number(this.value);
		$$invalidate(3, columns);
	}

	$$self.$$set = $$props => {
		if ('extension' in $$props) $$invalidate(7, extension = $$props.extension);
		if ('close' in $$props) $$invalidate(0, close = $$props.close);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*name*/ 2) {
			$$invalidate(4, zeroLength = name.length === 0);
		}

		if ($$self.$$.dirty & /*name, extension*/ 130) {
			$$invalidate(5, alreadyTaken = name in extension.tables);
		}
	};

	return [
		close,
		name,
		rows,
		columns,
		zeroLength,
		alreadyTaken,
		submit,
		extension,
		input0_input_handler,
		input1_input_handler,
		input2_input_handler
	];
}

class Make extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { extension: 7, close: 0 }, add_css$1);
	}
}/* extensions/src/tables/View.svelte generated by Svelte v3.55.1 */

function add_css(target) {
	append_styles(target, "svelte-n7skhf", ".container.svelte-n7skhf{width:480px;padding:1.5rem 2.25rem}.tableListDropdown.svelte-n7skhf{margin-bottom:1.5rem;width:100%;border:1px solid var(--ui-black-transparent);border-radius:5px;padding:0 1rem;height:3rem;color:var(--text-primary-transparent);font-size:1rem}.tableBox.svelte-n7skhf{border:1px solid var(--ui-black-transparent);border-radius:5px;margin-bottom:1rem;padding:1rem;color:var(--text-primary-transparent);font-size:1rem;overflow:scroll}.tableValueInput.svelte-n7skhf{width:3rem;padding:.25rem;color:var(--text-primary-transparent);font-size:1rem}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[13] = list[i];
	child_ctx[15] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[16] = list[i];
	child_ctx[18] = i;
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[19] = list[i];
	child_ctx[15] = i;
	return child_ctx;
}

function get_each_context_3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[21] = list[i];
	return child_ctx;
}

// (52:6) {#each Object.keys(extension.tables) as name}
function create_each_block_3(ctx) {
	let option;
	let t0_value = /*name*/ ctx[21] + "";
	let t0;
	let t1;
	let option_value_value;

	return {
		c() {
			option = element("option");
			t0 = text$1(t0_value);
			t1 = space();
			option.__value = option_value_value = /*name*/ ctx[21];
			option.value = option.__value;
		},
		m(target, anchor) {
			insert(target, option, anchor);
			append(option, t0);
			append(option, t1);
		},
		p(ctx, dirty) {
			if (dirty & /*extension*/ 1 && t0_value !== (t0_value = /*name*/ ctx[21] + "")) set_data(t0, t0_value);

			if (dirty & /*extension*/ 1 && option_value_value !== (option_value_value = /*name*/ ctx[21])) {
				option.__value = option_value_value;
				option.value = option.__value;
			}
		},
		d(detaching) {
			if (detaching) detach(option);
		}
	};
}

// (64:10) {#each [...Array(extension.tables[selected][0].length)] as _, i}
function create_each_block_2(ctx) {
	let th;
	let t_value = /*i*/ ctx[15] + 1 + "";
	let t;

	return {
		c() {
			th = element("th");
			t = text$1(t_value);
		},
		m(target, anchor) {
			insert(target, th, anchor);
			append(th, t);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(th);
		}
	};
}

// (73:12) {#each row as value, j}
function create_each_block_1(ctx) {
	let th;
	let input;
	let input_value_value;
	let mounted;
	let dispose;

	function change_handler(...args) {
		return /*change_handler*/ ctx[9](/*i*/ ctx[15], /*j*/ ctx[18], ...args);
	}

	return {
		c() {
			th = element("th");
			input = element("input");
			attr(input, "type", "number");
			input.value = input_value_value = /*value*/ ctx[16];
			attr(input, "data-testid", "tableCell");
			attr(input, "class", "svelte-n7skhf");
			toggle_class(input, "tableValueInput", /*tableValueInput*/ ctx[6]);
		},
		m(target, anchor) {
			insert(target, th, anchor);
			append(th, input);

			if (!mounted) {
				dispose = listen(input, "change", change_handler);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*extension, selected, Object*/ 5 && input_value_value !== (input_value_value = /*value*/ ctx[16]) && input.value !== input_value_value) {
				input.value = input_value_value;
			}
		},
		d(detaching) {
			if (detaching) detach(th);
			mounted = false;
			dispose();
		}
	};
}

// (70:8) {#each extension.tables[selected] as row, i}
function create_each_block(ctx) {
	let tr;
	let th;
	let t0_value = /*i*/ ctx[15] + 1 + "";
	let t0;
	let t1;
	let t2;
	let each_value_1 = /*row*/ ctx[13];
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	return {
		c() {
			tr = element("tr");
			th = element("th");
			t0 = text$1(t0_value);
			t1 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
		},
		m(target, anchor) {
			insert(target, tr, anchor);
			append(tr, th);
			append(th, t0);
			append(tr, t1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tr, null);
			}

			append(tr, t2);
		},
		p(ctx, dirty) {
			if (dirty & /*extension, selected, tableValueInput, update*/ 197) {
				each_value_1 = /*row*/ ctx[13];
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tr, t2);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d(detaching) {
			if (detaching) detach(tr);
			destroy_each(each_blocks, detaching);
		}
	};
}

function create_fragment(ctx) {
	let div2;
	let div0;
	let select;
	let t0;
	let div1;
	let table;
	let thead;
	let tr;
	let th;
	let t1;
	let t2;
	let tbody;
	let t3;
	let center;
	let ok;
	let current;
	let mounted;
	let dispose;
	let each_value_3 = Object.keys(/*extension*/ ctx[0].tables);
	let each_blocks_2 = [];

	for (let i = 0; i < each_value_3.length; i += 1) {
		each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
	}

	let each_value_2 = [...Array(/*extension*/ ctx[0].tables[/*selected*/ ctx[2]][0].length)];
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	let each_value = /*extension*/ ctx[0].tables[/*selected*/ ctx[2]];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	ok = new Ok({});

	ok.$on("click", function () {
		if (is_function(/*close*/ ctx[1])) /*close*/ ctx[1].apply(this, arguments);
	});

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			select = element("select");

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].c();
			}

			t0 = space();
			div1 = element("div");
			table = element("table");
			thead = element("thead");
			tr = element("tr");
			th = element("th");
			t1 = space();

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t2 = space();
			tbody = element("tbody");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t3 = space();
			center = element("center");
			create_component(ok.$$.fragment);
			attr(select, "data-testid", "tableSelect");
			attr(select, "class", "svelte-n7skhf");
			if (/*selected*/ ctx[2] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[8].call(select));
			toggle_class(select, "tableListDropdown", /*tableListDropdown*/ ctx[4]);
			attr(div1, "class", "svelte-n7skhf");
			toggle_class(div1, "tableBox", /*tableBox*/ ctx[5]);
			attr(div2, "class", "svelte-n7skhf");
			toggle_class(div2, "container", /*container*/ ctx[3]);
			set_style(div2, "width", `360px`);
			set_style(div2, "background-color", $common.color.ui.white);
			set_style(div2, "color", $common.color.text.primary);
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div0, select);

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].m(select, null);
			}

			select_option(select, /*selected*/ ctx[2]);
			append(div2, t0);
			append(div2, div1);
			append(div1, table);
			append(table, thead);
			append(thead, tr);
			append(tr, th);
			append(tr, t1);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(tr, null);
			}

			append(table, t2);
			append(table, tbody);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(tbody, null);
			}

			append(div2, t3);
			append(div2, center);
			mount_component(ok, center, null);
			current = true;

			if (!mounted) {
				dispose = listen(select, "change", /*select_change_handler*/ ctx[8]);
				mounted = true;
			}
		},
		p(new_ctx, [dirty]) {
			ctx = new_ctx;

			if (dirty & /*Object, extension*/ 1) {
				each_value_3 = Object.keys(/*extension*/ ctx[0].tables);
				let i;

				for (i = 0; i < each_value_3.length; i += 1) {
					const child_ctx = get_each_context_3(ctx, each_value_3, i);

					if (each_blocks_2[i]) {
						each_blocks_2[i].p(child_ctx, dirty);
					} else {
						each_blocks_2[i] = create_each_block_3(child_ctx);
						each_blocks_2[i].c();
						each_blocks_2[i].m(select, null);
					}
				}

				for (; i < each_blocks_2.length; i += 1) {
					each_blocks_2[i].d(1);
				}

				each_blocks_2.length = each_value_3.length;
			}

			if (dirty & /*selected, Object, extension*/ 5) {
				select_option(select, /*selected*/ ctx[2]);
			}

			if (dirty & /*extension, selected*/ 5) {
				each_value_2 = [...Array(/*extension*/ ctx[0].tables[/*selected*/ ctx[2]][0].length)];
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_2(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(tr, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_2.length;
			}

			if (dirty & /*extension, selected, tableValueInput, update*/ 197) {
				each_value = /*extension*/ ctx[0].tables[/*selected*/ ctx[2]];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(tbody, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i(local) {
			if (current) return;
			transition_in(ok.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(ok.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div2);
			destroy_each(each_blocks_2, detaching);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			destroy_component(ok);
			mounted = false;
			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { extension } = $$props;
	let { close } = $$props;
	const invoke = (functionName, ...args) => $common.reactiveInvoke($$invalidate(0, extension), functionName, args);
	const container = $common.activeClass;

	const tableListDropdown = $common.activeClass,
		tableBox = $common.activeClass,
		tableValueInput = $common.activeClass;

	const tableNames = Object.keys(extension.tables);
	let selected = tableNames.length > 0 ? tableNames[0] : "";

	const update = (e, row, column) => invoke("changeTableValue", {
		name: selected,
		row,
		column,
		value: parseInt(e.currentTarget.value)
	});

	function select_change_handler() {
		selected = select_value(this);
		$$invalidate(2, selected);
		$$invalidate(0, extension);
	}

	const change_handler = (i, j, e) => update(e, i, j);

	$$self.$$set = $$props => {
		if ('extension' in $$props) $$invalidate(0, extension = $$props.extension);
		if ('close' in $$props) $$invalidate(1, close = $$props.close);
	};

	return [
		extension,
		close,
		selected,
		container,
		tableListDropdown,
		tableBox,
		tableValueInput,
		update,
		select_change_handler,
		change_handler
	];
}

class View extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { extension: 0, close: 1 }, add_css);
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
}
function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", {
    configurable: true,
    value: prefix ? "".concat(prefix, " ", name) : name
  });
}var index = (() => {
    let _classDecorators = [$common.validGenericExtension()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var Tables = _classThis = class extends $common.Extension {
        constructor() {
            super(...[...arguments, ...["Tables","tables","data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIiBbDQoJPCFFTlRJVFkgbnNfZXh0ZW5kICJodHRwOi8vbnMuYWRvYmUuY29tL0V4dGVuc2liaWxpdHkvMS4wLyI+DQoJPCFFTlRJVFkgbnNfYWkgImh0dHA6Ly9ucy5hZG9iZS5jb20vQWRvYmVJbGx1c3RyYXRvci8xMC4wLyI+DQoJPCFFTlRJVFkgbnNfZ3JhcGhzICJodHRwOi8vbnMuYWRvYmUuY29tL0dyYXBocy8xLjAvIj4NCgk8IUVOVElUWSBuc192YXJzICJodHRwOi8vbnMuYWRvYmUuY29tL1ZhcmlhYmxlcy8xLjAvIj4NCgk8IUVOVElUWSBuc19pbXJlcCAiaHR0cDovL25zLmFkb2JlLmNvbS9JbWFnZVJlcGxhY2VtZW50LzEuMC8iPg0KCTwhRU5USVRZIG5zX3NmdyAiaHR0cDovL25zLmFkb2JlLmNvbS9TYXZlRm9yV2ViLzEuMC8iPg0KCTwhRU5USVRZIG5zX2N1c3RvbSAiaHR0cDovL25zLmFkb2JlLmNvbS9HZW5lcmljQ3VzdG9tTmFtZXNwYWNlLzEuMC8iPg0KCTwhRU5USVRZIG5zX2Fkb2JlX3hwYXRoICJodHRwOi8vbnMuYWRvYmUuY29tL1hQYXRoLzEuMC8iPg0KXT4NCjwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIEdlbmVyYXRvcjogU1ZHIFJlcG8gTWl4ZXIgVG9vbHMgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM6eD0iJm5zX2V4dGVuZDsiIHhtbG5zOmk9IiZuc19haTsiIHhtbG5zOmdyYXBoPSImbnNfZ3JhcGhzOyINCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCINCgkgdmlld0JveD0iMCAwIDI0IDI0IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNCAyNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8bWV0YWRhdGE+DQoJPHNmdyAgeG1sbnM9IiZuc19zZnc7Ij4NCgkJPHNsaWNlcz4KDTwvc2xpY2VzPg0KCQk8c2xpY2VTb3VyY2VCb3VuZHMgIHdpZHRoPSI1MDUiIGhlaWdodD0iOTg0IiBib3R0b21MZWZ0T3JpZ2luPSJ0cnVlIiB4PSIwIiB5PSItMTIwIj4KDTwvc2xpY2VTb3VyY2VCb3VuZHM+DQoJPC9zZnc+DQo8L21ldGFkYXRhPg0KPGc+DQoJPGc+DQoJCTxnPg0KCQkJPGc+DQoJCQkJPHBhdGggZD0iTTIwLDI0SDRjLTIuMiwwLTQtMS44LTQtNFY1YzAtMC42LDAuNC0xLDEtMWgyMmMwLjYsMCwxLDAuNCwxLDF2MTVDMjQsMjIuMiwyMi4yLDI0LDIwLDI0eiBNMiw2djE0YzAsMS4xLDAuOSwyLDIsMmgxNg0KCQkJCQljMS4xLDAsMi0wLjksMi0yVjZIMnoiLz4NCgkJCTwvZz4NCgkJPC9nPg0KCQk8Zz4NCgkJCTxnPg0KCQkJCTxwYXRoIHN0cm9rZT0iIzJEMkQyRCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTEyLDYiLz4NCgkJCTwvZz4NCgkJPC9nPg0KCTwvZz4NCgk8Zz4NCgkJPGc+DQoJCQk8cGF0aCBkPSJNMjMsNUgxVjRjMC0xLjcsMS4zLTMsMy0zaDE2YzEuNywwLDMsMS4zLDMsM1Y1eiIvPg0KCQk8L2c+DQoJCTxnPg0KCQkJPHBhdGggZD0iTTIzLDZIMUMwLjQsNiwwLDUuNiwwLDVWNGMwLTIuMiwxLjgtNCw0LTRoMTZjMi4yLDAsNCwxLjgsNCw0djFDMjQsNS42LDIzLjYsNiwyMyw2eiBNMiw0aDIwYzAtMS4xLTAuOS0yLTItMkg0DQoJCQkJQzIuOSwyLDIsMi45LDIsNHoiLz4NCgkJPC9nPg0KCTwvZz4NCgk8Zz4NCgkJPGc+DQoJCQk8cGF0aCBkPSJNNywyNGMtMC42LDAtMS0wLjQtMS0xVjVjMC0wLjYsMC40LTEsMS0xczEsMC40LDEsMXYxOEM4LDIzLjYsNy42LDI0LDcsMjR6Ii8+DQoJCTwvZz4NCgk8L2c+DQoJPGc+DQoJCTxnPg0KCQkJPHBhdGggc3Ryb2tlPSIjMkQyRDJEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNMSw4Ii8+DQoJCTwvZz4NCgk8L2c+DQoJPGc+DQoJCTxnPg0KCQkJPHBhdGggc3Ryb2tlPSIjMkQyRDJEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNMjMsOCIvPg0KCQk8L2c+DQoJPC9nPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGQ9Ik0yMywxMkgxYy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xaDIyYzAuNiwwLDEsMC40LDEsMVMyMy42LDEyLDIzLDEyeiIvPg0KCQk8L2c+DQoJPC9nPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGQ9Ik0yMywxOEgxYy0wLjYsMC0xLTAuNC0xLTFzMC40LTEsMS0xaDIyYzAuNiwwLDEsMC40LDEsMVMyMy42LDE4LDIzLDE4eiIvPg0KCQk8L2c+DQoJPC9nPg0KPC9nPg0KPC9zdmc+"]]);
            // save tables to .sb3 when project is saved
            this.saveDataHandler = new $common.SaveDataHandler({
                Extension: Tables,
                onSave: (self) => { return self.tables; },
                onLoad: (self, tables) => { self.tables = tables; },
            });
        }
        init(env) {
            if (!this.tables) {
                this.tables = {};
                this.tables.myTable = [];
                this.tables.myTable.push([0]);
            }
            // dynamic retriever of table names for block dropdowns
            this.tableNamesArg = {
                type: $common.ArgumentType.String,
                options: {
                    getItems: this.getTableNames.bind(this),
                    acceptsReporters: true,
                    handler: (reported) => {
                        if (this.getTableNames().indexOf(reported) === undefined) {
                            alert(`no table with name ${reported} exists`);
                            return 'myTable';
                        }
                        return reported;
                    }
                }
            };
            this.defaultNumberArg = {
                type: $common.ArgumentType.Number,
                defaultValue: 1
            };
        }
        getTableNames() {
            return Object.keys(this.tables).map(tableName => ({
                text: tableName,
                value: tableName
            }));
        }
        newTable(info) {
            const { name, rows, columns } = info;
            this.tables[name] = [];
            for (let i = 0; i < rows; i++) {
                let newRow = [];
                for (let j = 0; j < columns; j++)
                    newRow.push(0);
                this.tables[name].push(newRow);
            }
        }
        changeTableValue(info) {
            const { name, row, column, value } = info;
            this.tables[name][row][column] = value;
        }
        defineBlocks() {
            return {
                // button that opens a modal to create a new table
                createTable: () => ({
                    type: $common.BlockType.Button,
                    text: 'new table',
                    operation: () => this.openUI("Make", "Add a table"),
                }),
                // programmatic means for creating a new table
                addTable: (self) => ({
                    type: $common.BlockType.Command,
                    args: [self.tableNamesArg, self.defaultNumberArg, self.defaultNumberArg],
                    text: (name, rows, columns) => `add table called ${name} with ${rows} rows and ${columns} columns`,
                    operation: (name, rows, columns) => {
                        if (name in self.tables) {
                            alert(`that table already exists`);
                            return;
                        }
                        const info = {
                            name: name,
                            rows: rows,
                            columns: columns
                        };
                        self.newTable(info);
                    }
                }),
                // deletes table from project memory
                removeTable: (self) => ({
                    type: $common.BlockType.Command,
                    arg: self.tableNamesArg,
                    text: (table) => `remove ${table}`,
                    operation: (table) => {
                        if (this.tables[table]) {
                            delete this.tables[table];
                            return;
                        }
                        else {
                            alert(`that table doesn't exist`);
                            return;
                        }
                    }
                }),
                // adds a new column to the given table
                insertColumn: (self) => ({
                    type: $common.BlockType.Command,
                    arg: self.tableNamesArg,
                    text: (table) => `add column to ${table}`,
                    operation: (table) => {
                        if (!(table in self.tables)) {
                            alert(`that table does not exist.`);
                            return;
                        }
                        for (let i = 0; i < this.tables[table].length; i++) {
                            this.tables[table][i].push(0);
                        }
                    }
                }),
                // add a row to the given table
                insertRow: (self) => ({
                    type: $common.BlockType.Command,
                    arg: self.tableNamesArg,
                    text: (table) => `add row to ${table}`,
                    operation: (table) => {
                        if (!(table in self.tables)) {
                            alert(`that table does not exist.`);
                            return;
                        }
                        let newRow = [];
                        for (let i = 0; i < this.tables[table][0].length; i++) {
                            newRow.push(0);
                        }
                        this.tables[table].push(newRow);
                    }
                }),
                // change the value in a given table cell
                insertValueAt: (self) => ({
                    type: $common.BlockType.Command,
                    args: [self.tableNamesArg, $common.ArgumentType.Number, self.defaultNumberArg, self.defaultNumberArg],
                    text: (table, value, row, column) => `insert ${value} at row ${row} and column ${column} of ${table}`,
                    operation: (table, value, row, column) => {
                        if (!(table in self.tables)) {
                            alert(`that table does not exist.`);
                        }
                        else if (this.tables[table].length < row) {
                            alert(`That row value is too high!`);
                        }
                        else if (this.tables[table][0].length < column) {
                            alert(`That column value is too high!`);
                        }
                        else {
                            this.tables[table][row - 1][column - 1] = value;
                        }
                    }
                }),
                // get value from a given cell
                getValueAt: (self) => ({
                    type: $common.BlockType.Reporter,
                    args: [self.tableNamesArg, self.defaultNumberArg, self.defaultNumberArg],
                    text: (table, row, column) => `item at row ${row} and column ${column} of ${table}`,
                    operation: (table, row, column) => {
                        if (!(table in self.tables)) {
                            alert(`that table does not exist.`);
                            return -1;
                        }
                        else if (this.tables[table].length < row) {
                            alert(`That row value is too high!`);
                            return -1;
                        }
                        else if (this.tables[table][0].length < column) {
                            alert(`That column value is too high!`);
                            return -1;
                        }
                        else {
                            return this.tables[table][row - 1][column - 1];
                        }
                    }
                }),
                numberOfRows: (self) => ({
                    type: $common.BlockType.Reporter,
                    arg: self.tableNamesArg,
                    text: (table) => `number of rows in ${table}`,
                    operation: (table) => {
                        if (!(table in self.tables)) {
                            alert(`that table does not exist.`);
                            return -1;
                        }
                        return this.tables[table].length;
                    }
                }),
                numberOfColumns: (self) => ({
                    type: $common.BlockType.Reporter,
                    arg: self.tableNamesArg,
                    text: (table) => `number of columns in ${table}`,
                    operation: (table) => {
                        if (!(table in self.tables)) {
                            alert(`that table does not exist.`);
                            return -1;
                        }
                        return this.tables[table][0].length;
                    }
                }),
                highestValueOfColumn: (self) => ({
                    type: $common.BlockType.Reporter,
                    args: [self.tableNamesArg, self.defaultNumberArg],
                    text: (table, column) => `highest value of column ${column} in ${table}`,
                    operation: (table, column) => {
                        if (!(table in self.tables)) {
                            alert(`that table does not exist.`);
                            return -1;
                        }
                        return this.tables[table].reduce((max, current) => Math.max(max, current[column - 1]), -Infinity);
                    }
                }),
                highestValueOfRow: (self) => ({
                    type: $common.BlockType.Reporter,
                    args: [self.tableNamesArg, self.defaultNumberArg],
                    text: (table, row) => `highest value of row ${row} in ${table}`,
                    operation: (table, row) => {
                        if (!(table in self.tables)) {
                            alert(`that table does not exist.`);
                            return -1;
                        }
                        return Math.max(...this.tables[table][row - 1]);
                    }
                }),
                // gets the row # for the highest value in a given column
                indexOfHighestColumnValue: (self) => ({
                    type: $common.BlockType.Reporter,
                    args: [self.tableNamesArg, self.defaultNumberArg],
                    text: (table, column) => `row # of highest value in column ${column} of ${table}`,
                    operation: (table, column) => {
                        if (!(table in self.tables)) {
                            alert(`that table does not exist.`);
                            return -1;
                        }
                        let max = this.tables[table].reduce((curMax, current, index) => {
                            if (curMax[1] >= current[column - 1]) {
                                return curMax;
                            }
                            else {
                                return [index, current[column - 1]];
                            }
                        }, [-1, -Infinity]);
                        return (max[0] + 1);
                    }
                }),
                // gets the column # for the highest value of a given row
                indexOfHighestRowValue: (self) => ({
                    type: $common.BlockType.Reporter,
                    args: [self.tableNamesArg, self.defaultNumberArg],
                    text: (table, row) => `column # of highest value in row ${row} of ${table}`,
                    operation: (table, row) => {
                        if (!(table in this.tables)) {
                            alert(`that table does not exist.`);
                            return -1;
                        }
                        let max = Math.max(...this.tables[table][row - 1]);
                        return (this.tables[table][row - 1].indexOf(max) + 1);
                    }
                }),
                // opens a modal to view a table, in which one can also change table values
                showTable: () => ({
                    type: $common.BlockType.Button,
                    text: 'view tables',
                    operation: () => this.openUI("View", "View / Edit Table Values"),
                }),
            };
        }
    };
    __setFunctionName(_classThis, "Tables");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        Tables = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Tables = _classThis;
})();exports.Extension=index;exports.Make=Make;exports.View=View;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},ExtensionFramework);//# sourceMappingURL=tables.js.map
