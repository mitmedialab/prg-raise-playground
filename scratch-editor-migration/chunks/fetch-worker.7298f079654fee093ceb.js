(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ScratchStorage"] = factory();
	else
		root["ScratchStorage"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// ./node_modules/@scratch/task-herder/dist/task-herder.js
const CancelReason = {
	QueueCostLimitExceeded: "Queue cost limit exceeded",
	Aborted: "Task aborted",
	Cancel: "Task cancelled",
	TaskTooExpensive: "Task cost exceeds maximum bucket size"
};
function PromiseWithResolvers() {
	let e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var TaskRecord = class {
	cost;
	promise;
	run;
	cancel;
	constructor(e, n = {}) {
		this.cost = n.cost ?? 1;
		let { promise: r, resolve: i, reject: a } = PromiseWithResolvers();
		this.promise = r, this.cancel = (e) => {
			a(e);
		}, this.run = async () => {
			try {
				i(await e());
			} catch (e) {
				a(e);
			}
		};
	}
}, TaskQueue = class {
	burstLimit;
	sustainRate;
	queueCostLimit;
	concurrencyLimit;
	tokenCount;
	runningTasks = 0;
	pendingTaskRecords = [];
	lastRefillTime = Date.now();
	onTaskAdded = PromiseWithResolvers().resolve;
	onTaskFinished = PromiseWithResolvers().resolve;
	constructor(e) {
		this.burstLimit = e.burstLimit, this.sustainRate = e.sustainRate, this.tokenCount = e.startingTokens ?? e.burstLimit, this.queueCostLimit = e.queueCostLimit ?? Infinity, this.concurrencyLimit = e.concurrency ?? 1, this.runTasks();
	}
	get length() {
		return this.pendingTaskRecords.length;
	}
	get options() {
		return {
			burstLimit: this.burstLimit,
			sustainRate: this.sustainRate,
			startingTokens: this.tokenCount,
			queueCostLimit: this.queueCostLimit,
			concurrency: this.concurrencyLimit
		};
	}
	do(t, r = {}) {
		let i = new TaskRecord(t, r);
		return i.cost > this.burstLimit ? Promise.reject(Error(CancelReason.TaskTooExpensive)) : this.queueCostLimit < Infinity && this.pendingTaskRecords.reduce((e, t) => e + t.cost, i.cost) > this.queueCostLimit ? Promise.reject(Error(CancelReason.QueueCostLimitExceeded)) : (this.pendingTaskRecords.push(i), r.signal?.addEventListener("abort", () => {
			this.cancel(i.promise, Error(CancelReason.Aborted));
		}), this.onTaskAdded(), i.promise);
	}
	cancel(t, n) {
		let r = this.pendingTaskRecords.findIndex((e) => e.promise === t);
		if (r !== -1) {
			let [t] = this.pendingTaskRecords.splice(r, 1);
			return t.cancel(n ?? Error(CancelReason.Cancel)), !0;
		}
		return !1;
	}
	cancelAll(t) {
		let n = this.pendingTaskRecords;
		return this.pendingTaskRecords = [], t ??= Error(CancelReason.Cancel), n.forEach((e) => {
			e.cancel(t);
		}), n.length;
	}
	refillAndSpend(e) {
		return this.refill(), this.spend(e);
	}
	refill() {
		let e = Date.now(), t = e - this.lastRefillTime;
		if (t <= 0) return;
		this.lastRefillTime = e;
		let n = t / 1e3 * this.sustainRate;
		this.tokenCount = Math.min(this.burstLimit, this.tokenCount + n);
	}
	spend(e) {
		return this.tokenCount >= e ? (this.tokenCount -= e, !0) : !1;
	}
	async runTasks() {
		for (;;) {
			let n = this.pendingTaskRecords.shift();
			if (!n) {
				let { promise: e, resolve: n } = PromiseWithResolvers();
				this.onTaskAdded = n, await e;
				continue;
			}
			if (n.cost > this.burstLimit) {
				n.cancel(Error(CancelReason.TaskTooExpensive));
				continue;
			}
			if (this.refillAndSpend(n.cost)) {
				if (this.runningTasks >= this.concurrencyLimit) {
					let { promise: e, resolve: n } = PromiseWithResolvers();
					this.onTaskFinished = n, await e;
				}
				this.runTask(n);
			} else {
				this.pendingTaskRecords.unshift(n);
				let e = Math.max(n.cost - this.tokenCount, 0), t = Math.ceil(1e3 * e / this.sustainRate);
				await new Promise((e) => setTimeout(e, t));
			}
		}
	}
	async runTask(e) {
		this.runningTasks++;
		try {
			await e.run();
		} finally {
			this.runningTasks--, this.onTaskFinished();
		}
	}
}, QueueManager = class {
	queues;
	defaultOptions;
	constructor(e, t) {
		this.queues = new Map(t), this.defaultOptions = e;
	}
	create(e, t = {}) {
		let n = new TaskQueue({
			...this.defaultOptions,
			...t
		});
		return this.queues.set(e, n), n;
	}
	get(e) {
		return this.queues.get(e);
	}
	getOrCreate(e, t = {}) {
		return this.get(e) ?? this.create(e, t);
	}
	options() {
		return { ...this.defaultOptions };
	}
};


;// ./src/HostQueues.ts

/**
 * @summary A set of generous limits, for things like downloading assets from CDN.
 * @description
 * In practice, these limits seem to lead to slightly better performance than no limits at all, mostly due to the
 * concurrency limit. For example, on my development computer & my relatively fast residential connection, a
 * concurrency limit of 4 loads a particular test project in 21 seconds, as opposed to 25 seconds when I bypass the
 * queue and call `fetch` directly. In that test, my setup downloads about 50 assets per second, so this set of options
 * only affects concurrency and doesn't actually throttle the downloads. Limiting concurrency also fixes the issue
 * where very large projects (thousands of assets) can lead to browser failures like `net::ERR_INSUFFICIENT_RESOURCES`.
 * The exact concurrency limit doesn't seem to matter much since the browser limits parallel connections itself. It
 * just needs to be high enough to avoid bubbles in the download pipeline and low enough to avoid resource exhaustion.
 * @see {@link https://github.com/scratchfoundation/scratch-gui/issues/7111}
 */
const AssetQueueOptions = {
  burstLimit: 64,
  sustainRate: 64,
  // WARNING: asset download concurrency >=5 can lead to corrupted buffers on Chrome (December 2025, Chrome 142.0)
  // when using Scratch's bitmap load pipeline. Marking the canvas context as `{willReadFrequently: true}` seems to
  // eliminate that issue, so maybe the problem is related to hardware acceleration.
  concurrency: 64
};
/**
 * Central registry of per-host queues.
 * Uses strict limits by default. Override these strict limits as needed for specific hosts.
 */
const hostQueueManager = new QueueManager({
  burstLimit: 5,
  sustainRate: 1,
  concurrency: 1
});
;// ./src/scratchFetch.ts
/* unused harmony import specifier */ var scratchFetch_hostQueueManager;

const Headers = globalThis.Headers;
/**
 * Metadata header names.
 * The enum value is the name of the associated header.
 */
var RequestMetadata;
(function (RequestMetadata) {
  /** The ID of the project associated with this request */
  RequestMetadata["ProjectId"] = "X-Project-ID";
  /** The ID of the project run associated with this request */
  RequestMetadata["RunId"] = "X-Run-ID";
})(RequestMetadata || (RequestMetadata = {}));
/**
 * Metadata headers for requests.
 */
const metadata = new Headers();
/**
 * Check if there is any metadata to apply.
 * @returns {boolean} true if `metadata` has contents, or false if it is empty.
 */
const hasMetadata = () => {
  const searchParams = typeof self !== 'undefined' && self && self.location && self.location.search && self.location.search.split(/[?&]/) || [];
  if (!searchParams.includes('scratchMetadata=1')) {
    // for now, disable this feature unless scratchMetadata=1
    // TODO: remove this check once we're sure the feature works correctly in production
    return false;
  }
  for (const _ of metadata) {
    return true;
  }
  return false;
};
/**
 * Non-destructively merge any metadata state (if any) with the provided options object (if any).
 * If there is metadata state but no options object is provided, make a new object.
 * If there is no metadata state, return the provided options parameter without modification.
 * If there is metadata and an options object is provided, modify a copy and return it.
 * Headers in the provided options object may override headers generated from metadata state.
 * @param {RequestInit} [options] The initial request options. May be null or undefined.
 * @returns {RequestInit|undefined} the provided options parameter without modification, or a new options object.
 */
const applyMetadata = options => {
  if (hasMetadata()) {
    const augmentedOptions = Object.assign({}, options);
    augmentedOptions.headers = new Headers(metadata);
    if (options && options.headers) {
      // the Fetch spec says options.headers could be:
      // "A Headers object, an object literal, or an array of two-item arrays to set request's headers."
      // turn it into a Headers object to be sure of how to interact with it
      const overrideHeaders = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
      for (const [name, value] of overrideHeaders.entries()) {
        augmentedOptions.headers.set(name, value);
      }
    }
    return augmentedOptions;
  }
  return options;
};
/**
 * Make a network request.
 * This is a wrapper for the global fetch method, adding some Scratch-specific functionality.
 * @param {RequestInfo|URL} resource The resource to fetch.
 * @param {RequestInit} [requestOptions] Optional object containing custom settings for this request.
 * @param {ScratchFetchOptions} [scratchOptions] Optional Scratch-specific settings for this request.
 * @see {@link https://developer.mozilla.org/docs/Web/API/fetch} for more about the fetch API.
 * @returns {Promise<Response>} A promise for the response to the request.
 */
const scratchFetch = (resource, requestOptions, scratchOptions) => {
  requestOptions = applyMetadata(requestOptions);
  let queueName = scratchOptions === null || scratchOptions === void 0 ? void 0 : scratchOptions.queueName;
  if (!queueName) {
    // Normalize resource to a Request object. The `fetch` call will do this anyway, so it's not much extra work,
    // but it guarantees availability of the URL for queue naming.
    resource = new Request(resource, requestOptions);
    queueName = new URL(resource.url).hostname;
  }
  const queue = hostQueueManager.getOrCreate(queueName, scratchOptions === null || scratchOptions === void 0 ? void 0 : scratchOptions.queueOptions);
  return queue.do(() => fetch(resource, requestOptions));
};
/**
 * Create a new fetch queue with the given identifier and option overrides.
 * If a queue with that identifier already exists, it will be replaced.
 * Queues are automatically created as needed with default options, so
 * there's no need to call this unless you need to override the default queue options.
 * WARNING: If the old queue has is not empty, it may continue to run its tasks in the background.
 * If you need to cancel fetch tasks in that queue before replacing it, do so manually first.
 * @param queueName The name of the queue to create.
 * @param overrides Optional overrides for the default QueueOptions for this specific queue.
 */
const createQueue = (queueName, overrides) => {
  scratchFetch_hostQueueManager.create(queueName, overrides);
};
/**
 * Set the value of a named request metadata item.
 * Setting the value to `null` or `undefined` will NOT remove the item.
 * Use `unsetMetadata` for that.
 * @param {RequestMetadata} name The name of the metadata item to set.
 * @param {any} value The value to set (will be converted to a string).
 */
const setMetadata = (name, value) => {
  metadata.set(name, value);
};
/**
 * Remove a named request metadata item.
 * @param {RequestMetadata} name The name of the metadata item to remove.
 */
const unsetMetadata = name => {
  metadata.delete(name);
};
/**
 * Retrieve a named request metadata item.
 * Only for use in tests. At the time of writing, used in scratch-vm tests.
 * @param {RequestMetadata} name The name of the metadata item to retrieve.
 * @returns {string|null} The value of the metadata item, or `null` if it was not found.
 */
const getMetadata = name => metadata.get(name);
;// ./src/FetchWorkerTool.worker.ts
/* eslint-env worker */
/* eslint-disable-next-line spaced-comment */
/// <reference lib="webworker" />
// This worker won't share the same queue as the main thread, but throttling should be okay
// as long as we don't use FetchTool and FetchWorkerTool at the same time.
// TODO: Communicate metadata from the main thread to workers or move the worker boundary "into" `scratchFetch`.
// Make sure to benchmark any changes to avoid performance regressions, especially for large project loads.


let jobsActive = 0;
const complete = [];
let intervalId = void 0;
/**
 * Register a step function.
 *
 * Step checks if there are completed jobs and if there are sends them to the
 * parent. Then it checks the jobs count. If there are no further jobs, clear
 * the step.
 */
const registerStep = function registerStep() {
  intervalId = setInterval(() => {
    if (complete.length) {
      // Send our chunk of completed requests and instruct postMessage to
      // transfer the buffers instead of copying them.
      postMessage(complete.slice(),
      // Instruct postMessage that these buffers in the sent message
      // should use their Transferable trait. After the postMessage
      // call the "buffers" will still be in complete if you looked,
      // but they will all be length 0 as the data they reference has
      // been sent to the window. This lets us send a lot of data
      // without the normal postMessage behaviour of making a copy of
      // all of the data for the window.
      complete.map(response => response.buffer).filter(Boolean));
      complete.length = 0;
    }
    if (jobsActive === 0) {
      clearInterval(intervalId);
      intervalId = void 0;
    }
  }, 1);
};
/**
 * Receive a job from the parent and fetch the requested data.
 * @param message The message from the parent.
 * @param message.data A job id, url, and options descriptor to perform.
 */
const onMessage = async _ref => {
  let {
    data: job
  } = _ref;
  if (jobsActive === 0 && !intervalId) {
    registerStep();
  }
  jobsActive++;
  try {
    const response = await scratchFetch(job.url, job.options, {
      queueOptions: AssetQueueOptions
    });
    const result = {
      id: job.id
    };
    if (response.ok) {
      result.buffer = await response.arrayBuffer();
    } else if (response.status === 404) {
      result.buffer = null;
    } else {
      throw response.status;
    }
    complete.push(result);
  } catch (error) {
    complete.push({
      id: job.id,
      error: (error === null || error === void 0 ? void 0 : error.message) || "Failed request: ".concat(job.url)
    });
  } finally {
    jobsActive--;
  }
};
// "fetch" is supported in Node.js as of 16.15 and our target browsers as of ~2017
postMessage({
  support: {
    fetch: true
  }
});
self.addEventListener('message', onMessage);
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=fetch-worker.7298f079654fee093ceb.js.map