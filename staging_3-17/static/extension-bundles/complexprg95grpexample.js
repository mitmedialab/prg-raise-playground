var complexprg95grpexample=(function(exports,$common){'use strict';function noop() { }
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
}/* extensions/src/complex_example/Alert.svelte generated by Svelte v3.55.1 */

function create_fragment$2(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.innerHTML = `<img src="https://y.yarn.co/e1c7becd-fc72-40cb-8866-2afac14e2712_text.gif" alt="Gif of &#39;Its done&#39; clip from the movie Dune"/>`;
			set_style(div, "width", `400px;`);
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

class Alert extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, null, create_fragment$2, safe_not_equal, {});
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
}const nameByAnimal = {
    [0 /* Animal.Leopard */]: 'leopard',
    [1 /* Animal.Tiger */]: 'tiger',
    [2 /* Animal.Gorilla */]: 'gorilla',
    [3 /* Animal.Monkey */]: 'monkey',
    [4 /* Animal.Pig */]: 'pig',
};
const emojiByAnimal = {
    [0 /* Animal.Leopard */]: '🐆',
    [1 /* Animal.Tiger */]: '🐅',
    [2 /* Animal.Gorilla */]: '🦍',
    [3 /* Animal.Monkey */]: '🐒',
    [4 /* Animal.Pig */]: '🐖',
};
var index = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _getID_decorators;
    let _getColorChannel_decorators;
    let _add_decorators;
    let _sumMatrix_decorators;
    let _selectNote_decorators;
    let _selectAngle_decorators;
    let _increment_decorators;
    let _animalName_decorators;
    let _animalHabit_decorators;
    let _addAnimalToCollectionAndAlert_decorators;
    let _chooseBetweenAnimals_decorators;
    let _showAnimalCollectionUI_decorators;
    let _multiplyUsingThis_decorators;
    let _multiplyUsingSelf_decorators;
    return _a = class TypeScriptFrameworkExample extends $common.extension({
            name: "Realistic Typescript-Based Extension",
            description: "Demonstrating how typescript can be used to write a realistic extension",
            iconURL: "Typescript_logo.png",
            insetIconURL: "typescript-logo.svg",
        }, "ui", "customSaveData", "customArguments") {
            constructor() {
                super(...[...arguments, ...["Realistic Typescript-Based Extension","complexprg95grpexample","data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwcHgiIGhlaWdodD0iNDAwcHgiIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48c3R5bGU+LnN0MHtmaWxsOiMwMDdhY2N9LnN0MXtmaWxsOiNmZmZ9PC9zdHlsZT48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMCAyMDBWMGg0MDB2NDAwSDAiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNODcuNyAyMDAuN1YyMTdoNTJ2MTQ4aDM2LjlWMjE3aDUydi0xNmMwLTkgMC0xNi4zLS40LTE2LjUgMC0uMy0zMS43LS40LTcwLjItLjRsLTcwIC4zdjE2LjRsLS4zLS4xek0zMjEuNCAxODRjMTAuMiAyLjQgMTggNyAyNSAxNC4zIDMuNyA0IDkuMiAxMSA5LjYgMTIuOCAwIC42LTE3LjMgMTIuMy0yNy44IDE4LjgtLjQuMy0yLTEuNC0zLjYtNC01LjItNy40LTEwLjUtMTAuNi0xOC44LTExLjItMTItLjgtMjAgNS41LTIwIDE2IDAgMy4yLjYgNSAxLjggNy42IDIuNyA1LjUgNy43IDguOCAyMy4yIDE1LjYgMjguNiAxMi4zIDQxIDIwLjQgNDguNSAzMiA4LjUgMTMgMTAuNCAzMy40IDQuNyA0OC43LTYuNCAxNi43LTIyIDI4LTQ0LjMgMzEuNy03IDEuMi0yMyAxLTMwLjUtLjMtMTYtMy0zMS4zLTExLTQwLjctMjEuMy0zLjctNC0xMC44LTE0LjctMTAuNC0xNS40bDMuOC0yLjQgMTUtOC43IDExLjMtNi42IDIuNiAzLjVjMy4zIDUuMiAxMC43IDEyLjIgMTUgMTQuNiAxMyA2LjcgMzAuNCA1LjggMzktMiAzLjctMy40IDUuMy03IDUuMy0xMiAwLTQuNi0uNy02LjctMy0xMC4yLTMuMi00LjQtOS42LTgtMjcuNi0xNi0yMC43LTguOC0yOS41LTE0LjQtMzcuNy0yMy00LjctNS4yLTktMTMuMy0xMS0yMC0xLjUtNS44LTItMjAtLjYtMjUuNyA0LjMtMjAgMTkuNC0zNCA0MS0zOCA3LTEuNCAyMy41LS44IDMwLjQgMWwtLjIuMnoiLz48L3N2Zz4="]]);
                this.lhsOptions = (__runInitializers(this, _instanceExtraInitializers), void 0);
                this.collection = [2 /* Animal.Gorilla */];
                this.state = 0;
                this.saveDataHandler = new $common.SaveDataHandler({
                    Extension: TypeScriptFrameworkExample,
                    onSave: ({ collection, state }) => ({ collection, state }),
                    onLoad: (target, source) => $common.copyTo({ target, source })
                });
            }
            getAnimalCollectionEmojis() { return this.collection.map(animal => emojiByAnimal[animal]); }
            addAnimalToCollection(animal) { return this.collection.push(animal); }
            init() {
                this.lhsOptions = [3, 4, 5];
                this.animals = Object.entries(emojiByAnimal).map(([animal, emoji]) => ({
                    value: parseInt(animal), text: emoji
                }));
                this.getAnimalCollection = () => this.collection.map(animal => ({
                    text: emojiByAnimal[animal],
                    value: animal
                }));
            }
            getID() {
                return this.id;
            }
            getColorChannel(color, channel) {
                return color[channel];
            }
            add(left, right) {
                return left + right;
            }
            sumMatrix(matrix, dimension) {
                switch (dimension) {
                    case 0 /* MatrixDimension.Row */:
                        return matrix.map(row => row.reduce((count, current) => count + Number(current), 0)).join("\n");
                    case 1 /* MatrixDimension.Column */:
                        const columnSums = [0, 0, 0, 0, 0];
                        matrix.forEach(row => row.forEach((value, index) => {
                            columnSums[index] += Number(value);
                        }));
                        return columnSums.join(" ");
                    case 2 /* MatrixDimension.Both */:
                        return matrix
                            .map(row => row.reduce((count, current) => count + Number(current), 0))
                            .reduce((count, current) => count + current, 0)
                            .toString();
                }
            }
            selectNote(note) {
                return note;
            }
            selectAngle(angle) {
                return angle;
            }
            increment() {
                return ++this.state;
            }
            animalName(animal) {
                return nameByAnimal[animal];
            }
            animalHabit(animal) {
                switch (animal) {
                    case 0 /* Animal.Leopard */:
                        return 'Africa and Asia';
                    case 1 /* Animal.Tiger */:
                        return 'Asia';
                    case 2 /* Animal.Gorilla */:
                        return 'Africa';
                    case 3 /* Animal.Monkey */:
                        return 'Africa, Asia, and South America';
                    case 4 /* Animal.Pig */:
                        return 'Almost everywhere (except Antartica)';
                }
            }
            addAnimalToCollectionAndAlert(animal) {
                this.addAnimalToCollection(animal);
                this.openUI("Alert");
            }
            chooseBetweenAnimals(animal) {
                return nameByAnimal[animal];
            }
            showAnimalCollectionUI() {
                this.openUI("Animals", "Here's your animal collection");
            }
            // Details of block defined using a 'block getter' function implemented using 'method' syntax.
            // This block is functionally equivalent to the one for 'multiplyUsingSelf' below.
            multiplyUsingThis(left, right, util) {
                return left * right;
            }
            // Details of block defined using a 'block getter' function implemented using 'arrow' syntax.
            // This block is functionally equivalent to the one for 'multiplyUsingThis' above.
            multiplyUsingSelf(left, right, util) {
                return left * right;
            }
        },
        (() => {
            _getID_decorators = [$common.block({
                    type: $common.BlockType.Reporter,
                    text: 'My Extension ID is',
                })];
            _getColorChannel_decorators = [$common.block({
                    type: $common.BlockType.Reporter,
                    args: [
                        $common.ArgumentType.Color,
                        {
                            type: $common.ArgumentType.String, options: [
                                { value: 'r', text: 'red' },
                                { value: 'g', text: 'green' },
                                { value: 'b', text: 'blue' }
                            ]
                        }
                    ],
                    text: (color, channel) => `Report ${channel} of ${color}`,
                })];
            _add_decorators = [$common.block((self) => ({
                    type: $common.BlockType.Reporter,
                    args: [
                        { type: $common.ArgumentType.Number, defaultValue: 3, options: self.lhsOptions },
                        { type: $common.ArgumentType.Number }
                    ],
                    text: (left, right) => `Add ${left} to ${right}`,
                }))];
            _sumMatrix_decorators = [$common.block({
                    type: "reporter",
                    args: [
                        $common.ArgumentType.Matrix,
                        {
                            type: $common.ArgumentType.Number, options: [
                                { value: 0 /* MatrixDimension.Row */, text: 'rows' },
                                { value: 1 /* MatrixDimension.Column */, text: 'columns' },
                                { value: 2 /* MatrixDimension.Both */, text: 'rows and columns' }
                            ]
                        }
                    ],
                    text: (matrix, dimension) => `Sum ${dimension} of ${matrix}`,
                })];
            _selectNote_decorators = [$common.block({
                    type: $common.BlockType.Reporter,
                    arg: $common.ArgumentType.Note,
                    text: (note) => `Pick note ${note}`,
                })];
            _selectAngle_decorators = [$common.block({
                    type: $common.BlockType.Reporter,
                    arg: $common.ArgumentType.Angle,
                    text: (angle) => `Pick angle ${angle}`,
                })];
            _increment_decorators = [$common.block({
                    type: $common.BlockType.Reporter,
                    text: 'Increment',
                })];
            _animalName_decorators = [$common.block((self) => ({
                    type: $common.BlockType.Reporter,
                    text: (animal) => `This is a ${animal}`,
                    arg: {
                        type: $common.ArgumentType.Number,
                        options: {
                            items: self.animals,
                            acceptsReporters: true,
                            handler: (input) => {
                                switch (input) {
                                    case `${0 /* Animal.Leopard */}`:
                                    case `${1 /* Animal.Tiger */}`:
                                    case `${2 /* Animal.Gorilla */}`:
                                    case `${3 /* Animal.Monkey */}`:
                                    case `${4 /* Animal.Pig */}`:
                                        return input;
                                    default:
                                        alert(`You silly goose! ${input} is not an animal.`);
                                        return 0 /* Animal.Leopard */;
                                }
                            }
                        }
                    }
                }))];
            _animalHabit_decorators = [$common.block((self) => ({
                    type: $common.BlockType.Reporter,
                    arg: { type: $common.ArgumentType.Number, options: self.animals },
                    text: (animal) => `Where does the ${animal} live?`,
                }))];
            _addAnimalToCollectionAndAlert_decorators = [$common.block((self) => ({
                    type: $common.BlockType.Command,
                    arg: self.makeCustomArgument({
                        component: "AnimalArgument",
                        initial: { value: 0 /* Animal.Leopard */, text: nameByAnimal[0 /* Animal.Leopard */] }
                    }),
                    text: (animal) => `Add ${animal} to collection`,
                }))];
            _chooseBetweenAnimals_decorators = [$common.block((self) => ({
                    type: $common.BlockType.Reporter,
                    arg: { type: $common.ArgumentType.Number, options: self.getAnimalCollection },
                    text: (animal) => `Animals in collection: ${animal}`,
                }))];
            _showAnimalCollectionUI_decorators = [$common.buttonBlock("Show Animal Collection")];
            _multiplyUsingThis_decorators = [$common.block(function () {
                    return {
                        type: $common.BlockType.Reporter,
                        args: [
                            { type: $common.ArgumentType.Number, defaultValue: 3, options: this.lhsOptions },
                            $common.ArgumentType.Number
                        ],
                        text: (left, right) => `${left} X ${right}`,
                    };
                })];
            _multiplyUsingSelf_decorators = [$common.block((self) => ({
                    type: $common.BlockType.Reporter,
                    text: (left, right) => `${left} X ${right}`,
                    args: [
                        { type: $common.ArgumentType.Number, defaultValue: 3, options: self.lhsOptions },
                        $common.ArgumentType.Number
                    ],
                }))];
            __esDecorate(_a, null, _getID_decorators, { kind: "method", name: "getID", static: false, private: false, access: { has: obj => "getID" in obj, get: obj => obj.getID } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getColorChannel_decorators, { kind: "method", name: "getColorChannel", static: false, private: false, access: { has: obj => "getColorChannel" in obj, get: obj => obj.getColorChannel } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _add_decorators, { kind: "method", name: "add", static: false, private: false, access: { has: obj => "add" in obj, get: obj => obj.add } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _sumMatrix_decorators, { kind: "method", name: "sumMatrix", static: false, private: false, access: { has: obj => "sumMatrix" in obj, get: obj => obj.sumMatrix } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _selectNote_decorators, { kind: "method", name: "selectNote", static: false, private: false, access: { has: obj => "selectNote" in obj, get: obj => obj.selectNote } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _selectAngle_decorators, { kind: "method", name: "selectAngle", static: false, private: false, access: { has: obj => "selectAngle" in obj, get: obj => obj.selectAngle } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _increment_decorators, { kind: "method", name: "increment", static: false, private: false, access: { has: obj => "increment" in obj, get: obj => obj.increment } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _animalName_decorators, { kind: "method", name: "animalName", static: false, private: false, access: { has: obj => "animalName" in obj, get: obj => obj.animalName } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _animalHabit_decorators, { kind: "method", name: "animalHabit", static: false, private: false, access: { has: obj => "animalHabit" in obj, get: obj => obj.animalHabit } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addAnimalToCollectionAndAlert_decorators, { kind: "method", name: "addAnimalToCollectionAndAlert", static: false, private: false, access: { has: obj => "addAnimalToCollectionAndAlert" in obj, get: obj => obj.addAnimalToCollectionAndAlert } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _chooseBetweenAnimals_decorators, { kind: "method", name: "chooseBetweenAnimals", static: false, private: false, access: { has: obj => "chooseBetweenAnimals" in obj, get: obj => obj.chooseBetweenAnimals } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _showAnimalCollectionUI_decorators, { kind: "method", name: "showAnimalCollectionUI", static: false, private: false, access: { has: obj => "showAnimalCollectionUI" in obj, get: obj => obj.showAnimalCollectionUI } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _multiplyUsingThis_decorators, { kind: "method", name: "multiplyUsingThis", static: false, private: false, access: { has: obj => "multiplyUsingThis" in obj, get: obj => obj.multiplyUsingThis } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _multiplyUsingSelf_decorators, { kind: "method", name: "multiplyUsingSelf", static: false, private: false, access: { has: obj => "multiplyUsingSelf" in obj, get: obj => obj.multiplyUsingSelf } }, null, _instanceExtraInitializers);
        })(),
        _a;
})();/* extensions/src/complex_example/AnimalArgument.svelte generated by Svelte v3.55.1 */

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	return child_ctx;
}

// (18:2) {#each Object.keys(emojiByAnimal) as animal}
function create_each_block$1(ctx) {
	let button;
	let t_value = emojiByAnimal[/*animal*/ ctx[6]] + "";
	let t;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[5](/*animal*/ ctx[6]);
	}

	return {
		c() {
			button = element("button");
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, t);

			if (!mounted) {
				dispose = listen(button, "click", click_handler);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
		},
		d(detaching) {
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

function create_fragment$1(ctx) {
	let div;
	let t0;
	let center;
	let p;
	let t1;
	let each_value = Object.keys(emojiByAnimal);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t0 = space();
			center = element("center");
			p = element("p");
			t1 = text(/*text*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			append(div, t0);
			append(div, center);
			append(center, p);
			append(p, t1);
		},
		p(ctx, [dirty]) {
			if (dirty & /*value, parseInt, Object, emojiByAnimal*/ 1) {
				each_value = Object.keys(emojiByAnimal);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, t0);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*text*/ 2) set_data(t1, /*text*/ ctx[1]);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let text;
	let { setter } = $$props;
	let { current } = $$props;
	let { extension } = $$props;
	let value = current.value;
	const click_handler = animal => $$invalidate(0, value = parseInt(animal));

	$$self.$$set = $$props => {
		if ('setter' in $$props) $$invalidate(2, setter = $$props.setter);
		if ('current' in $$props) $$invalidate(3, current = $$props.current);
		if ('extension' in $$props) $$invalidate(4, extension = $$props.extension);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*value*/ 1) {
			$$invalidate(1, text = nameByAnimal[value]);
		}

		if ($$self.$$.dirty & /*setter, value, text*/ 7) {
			setter({ value, text });
		}
	};

	return [value, text, setter, current, extension, click_handler];
}

class AnimalArgument extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { setter: 2, current: 3, extension: 4 });
	}
}/* extensions/src/complex_example/Animals.svelte generated by Svelte v3.55.1 */

function add_css(target) {
	append_styles(target, "svelte-o54gka", ".container.svelte-o54gka{width:360px;padding:10px}button.svelte-o54gka{border-radius:10px;font-size:40px}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i][0];
	child_ctx[10] = list[i][1];
	return child_ctx;
}

// (31:4) {#each [...animalMap] as [animal, count]}
function create_each_block_1(ctx) {
	let li;
	let t0_value = /*count*/ ctx[10] + "";
	let t0;
	let t1;
	let t2_value = /*animal*/ ctx[9] + "";
	let t2;
	let t3_value = (/*count*/ ctx[10] > 1 ? "s" : "") + "";
	let t3;

	return {
		c() {
			li = element("li");
			t0 = text(t0_value);
			t1 = space();
			t2 = text(t2_value);
			t3 = text(t3_value);
		},
		m(target, anchor) {
			insert(target, li, anchor);
			append(li, t0);
			append(li, t1);
			append(li, t2);
			append(li, t3);
		},
		p(ctx, dirty) {
			if (dirty & /*animalMap*/ 2 && t0_value !== (t0_value = /*count*/ ctx[10] + "")) set_data(t0, t0_value);
			if (dirty & /*animalMap*/ 2 && t2_value !== (t2_value = /*animal*/ ctx[9] + "")) set_data(t2, t2_value);
			if (dirty & /*animalMap*/ 2 && t3_value !== (t3_value = (/*count*/ ctx[10] > 1 ? "s" : "") + "")) set_data(t3, t3_value);
		},
		d(detaching) {
			if (detaching) detach(li);
		}
	};
}

// (36:4) {#each extension.animals as animalMenuItem}
function create_each_block(ctx) {
	let button;
	let span;
	let t1_value = /*animalMenuItem*/ ctx[6]["text"] + "";
	let t1;
	let t2;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[4](/*animalMenuItem*/ ctx[6]);
	}

	return {
		c() {
			button = element("button");
			span = element("span");
			span.textContent = "+";
			t1 = text(t1_value);
			t2 = space();
			set_style(span, "font-size", "20px");
			attr(button, "class", "svelte-o54gka");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, span);
			append(button, t1);
			append(button, t2);

			if (!mounted) {
				dispose = listen(button, "click", click_handler);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*extension*/ 1 && t1_value !== (t1_value = /*animalMenuItem*/ ctx[6]["text"] + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

function create_fragment(ctx) {
	let div;
	let ul;
	let t;
	let center;
	let each_value_1 = [.../*animalMap*/ ctx[1]];
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let each_value = /*extension*/ ctx[0].animals;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");
			ul = element("ul");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t = space();
			center = element("center");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "svelte-o54gka");
			toggle_class(div, "container", container);
			set_style(div, "background-color", $common.color.ui.white);
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, ul);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(ul, null);
			}

			append(div, t);
			append(div, center);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(center, null);
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*animalMap*/ 2) {
				each_value_1 = [.../*animalMap*/ ctx[1]];
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(ul, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty & /*invoke, extension*/ 5) {
				each_value = /*extension*/ ctx[0].animals;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(center, null);
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
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
		}
	};
}

const container = true;

function instance($$self, $$props, $$invalidate) {
	let { extension } = $$props;
	let { close } = $$props;
	const invoke = (functionName, ...args) => $common.reactiveInvoke($$invalidate(0, extension), functionName, args);
	let animalMap;

	const setAnimalMap = _ => {
		$$invalidate(1, animalMap = new Map());

		for (const animal of invoke("getAnimalCollectionEmojis")) {
			animalMap.set(animal, animalMap.has(animal) ? animalMap.get(animal) + 1 : 1);
		}
	};

	const click_handler = animalMenuItem => invoke("addAnimalToCollection", animalMenuItem["value"]);

	$$self.$$set = $$props => {
		if ('extension' in $$props) $$invalidate(0, extension = $$props.extension);
		if ('close' in $$props) $$invalidate(3, close = $$props.close);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*extension*/ 1) {
			setAnimalMap();
		}
	};

	return [extension, animalMap, invoke, close, click_handler];
}

class Animals extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { extension: 0, close: 3 }, add_css);
	}
}exports.Alert=Alert;exports.AnimalArgument=AnimalArgument;exports.Animals=Animals;exports.Extension=index;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},ExtensionFramework);//# sourceMappingURL=complexprg95grpexample.js.map
