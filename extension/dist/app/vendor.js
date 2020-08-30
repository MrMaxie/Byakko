(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.target = "browser";
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("index.css", function(exports, require, module, __filename, __dirname){

require("fuse-box-css")("index.css");
});
});
FuseBox.pkg("fuse-box-css", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

var runningInBrowser = FuseBox.isBrowser || FuseBox.target === "electron";
var cssHandler = function (__filename, contents) {
    if (runningInBrowser) {
        var styleId = __filename.replace(/[\.\/]+/g, "-");
        if (styleId.charAt(0) === "-")
            styleId = styleId.substring(1);
        var exists = document.getElementById(styleId);
        if (!exists) {
            var s = document.createElement(contents ? "style" : "link");
            s.id = styleId;
            s.type = "text/css";
            if (contents) {
                s.innerHTML = contents;
            }
            else {
                s.rel = "stylesheet";
                s.href = __filename;
            }
            document.getElementsByTagName("head")[0].appendChild(s);
        }
        else {
            if (contents) {
                exists.innerHTML = contents;
            }
        }
    }
};
if (typeof FuseBox !== "undefined" && runningInBrowser) {
    FuseBox.on("async", function (name) {
        if (/\.css$/.test(name)) {
            cssHandler(name);
            return false;
        }
    });
}
module.exports = cssHandler;

});
return ___scope___.entry = "index.js";
});
FuseBox.pkg("mobx-react-lite", {}, function(___scope___){
___scope___.file("lib/index.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./assertEnvironment");
var reactBatchedUpdates_1 = require("./utils/reactBatchedUpdates");
var observerBatching_1 = require("./observerBatching");
observerBatching_1.observerBatching(reactBatchedUpdates_1.unstable_batchedUpdates);
var staticRendering_1 = require("./staticRendering");
exports.isUsingStaticRendering = staticRendering_1.isUsingStaticRendering;
exports.useStaticRendering = staticRendering_1.useStaticRendering;
var observer_1 = require("./observer");
exports.observer = observer_1.observer;
var useObserver_1 = require("./useObserver");
exports.useObserver = useObserver_1.useObserver;
var ObserverComponent_1 = require("./ObserverComponent");
exports.Observer = ObserverComponent_1.Observer;
var utils_1 = require("./utils");
exports.useForceUpdate = utils_1.useForceUpdate;
var useAsObservableSource_1 = require("./useAsObservableSource");
exports.useAsObservableSource = useAsObservableSource_1.useAsObservableSource;
var useLocalStore_1 = require("./useLocalStore");
exports.useLocalStore = useLocalStore_1.useLocalStore;
var useQueuedForceUpdate_1 = require("./useQueuedForceUpdate");
exports.useQueuedForceUpdate = useQueuedForceUpdate_1.useQueuedForceUpdate;
exports.useQueuedForceUpdateBlock = useQueuedForceUpdate_1.useQueuedForceUpdateBlock;
var observerBatching_2 = require("./observerBatching");
exports.observerBatching = observerBatching_2.observerBatching;

});
___scope___.file("lib/assertEnvironment.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var react_1 = require("preact/compat/dist/compat.js");
if (!react_1.useState) {
    throw new Error("mobx-react-lite requires React with Hooks support");
}
if (!mobx_1.spy) {
    throw new Error("mobx-react-lite requires mobx at least version 4 to be available");
}

});
___scope___.file("lib/utils/reactBatchedUpdates.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_dom_1 = require("preact/compat/dist/compat.js");
exports.unstable_batchedUpdates = react_dom_1.unstable_batchedUpdates;

});
___scope___.file("lib/observerBatching.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
function defaulNoopBatch(callback) {
    callback();
}
exports.defaulNoopBatch = defaulNoopBatch;
function observerBatching(reactionScheduler) {
    if (!reactionScheduler) {
        reactionScheduler = defaulNoopBatch;
        if ("production" !== process.env.NODE_ENV) {
            console.warn("[MobX] Failed to get unstable_batched updates from react-dom / react-native");
        }
    }
    mobx_1.configure({ reactionScheduler: reactionScheduler });
}
exports.observerBatching = observerBatching;

});
___scope___.file("lib/staticRendering.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globalIsUsingStaticRendering = false;
function useStaticRendering(enable) {
    globalIsUsingStaticRendering = enable;
}
exports.useStaticRendering = useStaticRendering;
function isUsingStaticRendering() {
    return globalIsUsingStaticRendering;
}
exports.isUsingStaticRendering = isUsingStaticRendering;

});
___scope___.file("lib/observer.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("preact/compat/dist/compat.js");
var staticRendering_1 = require("./staticRendering");
var useObserver_1 = require("./useObserver");
function observer(baseComponent, options) {
    if (staticRendering_1.isUsingStaticRendering()) {
        return baseComponent;
    }
    var realOptions = __assign({ forwardRef: false }, options);
    var baseComponentName = baseComponent.displayName || baseComponent.name;
    var wrappedComponent = function (props, ref) {
        return useObserver_1.useObserver(function () { return baseComponent(props, ref); }, baseComponentName);
    };
    wrappedComponent.displayName = baseComponentName;
    var memoComponent;
    if (realOptions.forwardRef) {
        memoComponent = react_1.memo(react_1.forwardRef(wrappedComponent));
    }
    else {
        memoComponent = react_1.memo(wrappedComponent);
    }
    copyStaticProperties(baseComponent, memoComponent);
    memoComponent.displayName = baseComponentName;
    return memoComponent;
}
exports.observer = observer;
var hoistBlackList = {
    $$typeof: true,
    render: true,
    compare: true,
    type: true
};
function copyStaticProperties(base, target) {
    Object.keys(base).forEach(function (key) {
        if (!hoistBlackList[key]) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(base, key));
        }
    });
}

});
___scope___.file("lib/useObserver.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var react_1 = __importDefault(require("preact/compat/dist/compat.js"));
var printDebugValue_1 = require("./printDebugValue");
var reactionCleanupTracking_1 = require("./reactionCleanupTracking");
var staticRendering_1 = require("./staticRendering");
var utils_1 = require("./utils");
var useQueuedForceUpdate_1 = require("./useQueuedForceUpdate");
var EMPTY_OBJECT = {};
function observerComponentNameFor(baseComponentName) {
    return "observer" + baseComponentName;
}
function useObserver(fn, baseComponentName, options) {
    if (baseComponentName === void 0) {
        baseComponentName = "observed";
    }
    if (options === void 0) {
        options = EMPTY_OBJECT;
    }
    if (staticRendering_1.isUsingStaticRendering()) {
        return fn();
    }
    var wantedForceUpdateHook = options.useForceUpdate || utils_1.useForceUpdate;
    var forceUpdate = wantedForceUpdateHook();
    var queuedForceUpdate = useQueuedForceUpdate_1.useQueuedForceUpdate(forceUpdate);
    var reactionTrackingRef = react_1.default.useRef(null);
    if (!reactionTrackingRef.current) {
        var newReaction_1 = new mobx_1.Reaction(observerComponentNameFor(baseComponentName), function () {
            if (trackingData_1.mounted) {
                queuedForceUpdate();
            }
            else {
                newReaction_1.dispose();
                reactionTrackingRef.current = null;
            }
        });
        var trackingData_1 = reactionCleanupTracking_1.createTrackingData(newReaction_1);
        reactionTrackingRef.current = trackingData_1;
        reactionCleanupTracking_1.scheduleCleanupOfReactionIfLeaked(reactionTrackingRef);
    }
    var reaction = reactionTrackingRef.current.reaction;
    react_1.default.useDebugValue(reaction, printDebugValue_1.printDebugValue);
    react_1.default.useEffect(function () {
        reactionCleanupTracking_1.recordReactionAsCommitted(reactionTrackingRef);
        if (reactionTrackingRef.current) {
            reactionTrackingRef.current.mounted = true;
        }
        else {
            reactionTrackingRef.current = {
                reaction: new mobx_1.Reaction(observerComponentNameFor(baseComponentName), function () {
                    queuedForceUpdate();
                }),
                cleanAt: Infinity
            };
            queuedForceUpdate();
        }
        return function () {
            reactionTrackingRef.current.reaction.dispose();
            reactionTrackingRef.current = null;
        };
    }, []);
    return useQueuedForceUpdate_1.useQueuedForceUpdateBlock(function () {
        var rendering;
        var exception;
        reaction.track(function () {
            try {
                rendering = fn();
            }
            catch (e) {
                exception = e;
            }
        });
        if (exception) {
            throw exception;
        }
        return rendering;
    });
}
exports.useObserver = useObserver;

});
___scope___.file("lib/printDebugValue.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
function printDebugValue(v) {
    return mobx_1.getDependencyTree(v);
}
exports.printDebugValue = printDebugValue;

});
___scope___.file("lib/reactionCleanupTracking.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createTrackingData(reaction) {
    var trackingData = {
        cleanAt: Date.now() + exports.CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS,
        reaction: reaction
    };
    return trackingData;
}
exports.createTrackingData = createTrackingData;
exports.CLEANUP_LEAKED_REACTIONS_AFTER_MILLIS = 10000;
exports.CLEANUP_TIMER_LOOP_MILLIS = 10000;
var uncommittedReactionRefs = new Set();
var reactionCleanupHandle;
function ensureCleanupTimerRunning() {
    if (reactionCleanupHandle === undefined) {
        reactionCleanupHandle = setTimeout(cleanUncommittedReactions, exports.CLEANUP_TIMER_LOOP_MILLIS);
    }
}
function scheduleCleanupOfReactionIfLeaked(ref) {
    uncommittedReactionRefs.add(ref);
    ensureCleanupTimerRunning();
}
exports.scheduleCleanupOfReactionIfLeaked = scheduleCleanupOfReactionIfLeaked;
function recordReactionAsCommitted(reactionRef) {
    uncommittedReactionRefs.delete(reactionRef);
}
exports.recordReactionAsCommitted = recordReactionAsCommitted;
function cleanUncommittedReactions() {
    reactionCleanupHandle = undefined;
    var now = Date.now();
    uncommittedReactionRefs.forEach(function (ref) {
        var tracking = ref.current;
        if (tracking) {
            if (now >= tracking.cleanAt) {
                tracking.reaction.dispose();
                ref.current = null;
                uncommittedReactionRefs.delete(ref);
            }
        }
    });
    if (uncommittedReactionRefs.size > 0) {
        ensureCleanupTimerRunning();
    }
}
function forceCleanupTimerToRunNowForTests() {
    if (reactionCleanupHandle) {
        clearTimeout(reactionCleanupHandle);
        cleanUncommittedReactions();
    }
}
exports.forceCleanupTimerToRunNowForTests = forceCleanupTimerToRunNowForTests;
function resetCleanupScheduleForTests() {
    if (reactionCleanupHandle) {
        clearTimeout(reactionCleanupHandle);
        reactionCleanupHandle = undefined;
    }
    uncommittedReactionRefs.clear();
}
exports.resetCleanupScheduleForTests = resetCleanupScheduleForTests;

});
___scope___.file("lib/utils.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
        return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
            ar.push(r.value);
    }
    catch (error) {
        e = { error: error };
    }
    finally {
        try {
            if (r && !r.done && (m = i["return"]))
                m.call(i);
        }
        finally {
            if (e)
                throw e.error;
        }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("preact/compat/dist/compat.js");
var EMPTY_ARRAY = [];
function useUnmount(fn) {
    react_1.useEffect(function () { return fn; }, EMPTY_ARRAY);
}
exports.useUnmount = useUnmount;
function useForceUpdate() {
    var _a = __read(react_1.useState(0), 2), setTick = _a[1];
    var update = react_1.useCallback(function () {
        setTick(function (tick) { return tick + 1; });
    }, []);
    return update;
}
exports.useForceUpdate = useForceUpdate;
function isPlainObject(value) {
    if (!value || typeof value !== "object") {
        return false;
    }
    var proto = Object.getPrototypeOf(value);
    return !proto || proto === Object.prototype;
}
exports.isPlainObject = isPlainObject;
function getSymbol(name) {
    if (typeof Symbol === "function") {
        return Symbol.for(name);
    }
    return "__$mobx-react " + name + "__";
}
exports.getSymbol = getSymbol;
var mockGlobal = {};
function getGlobal() {
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof global !== "undefined") {
        return global;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    return mockGlobal;
}
exports.getGlobal = getGlobal;

});
___scope___.file("lib/useQueuedForceUpdate.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("preact/compat/dist/compat.js"));
var insideRender = false;
var forceUpdateQueue = [];
function useQueuedForceUpdate(forceUpdate) {
    return function () {
        if (insideRender) {
            forceUpdateQueue.push(forceUpdate);
        }
        else {
            forceUpdate();
        }
    };
}
exports.useQueuedForceUpdate = useQueuedForceUpdate;
function useQueuedForceUpdateBlock(callback) {
    insideRender = true;
    forceUpdateQueue = [];
    try {
        var result = callback();
        insideRender = false;
        var queue_1 = forceUpdateQueue.length > 0 ? forceUpdateQueue : undefined;
        react_1.default.useLayoutEffect(function () {
            if (queue_1) {
                queue_1.forEach(function (x) { return x(); });
            }
        }, [queue_1]);
        return result;
    }
    finally {
        insideRender = false;
    }
}
exports.useQueuedForceUpdateBlock = useQueuedForceUpdateBlock;

});
___scope___.file("lib/ObserverComponent.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var useObserver_1 = require("./useObserver");
function ObserverComponent(_a) {
    var children = _a.children, render = _a.render;
    var component = children || render;
    if (typeof component !== "function") {
        return null;
    }
    return useObserver_1.useObserver(component);
}
exports.Observer = ObserverComponent;
ObserverComponent.propTypes = {
    children: ObserverPropsCheck,
    render: ObserverPropsCheck
};
ObserverComponent.displayName = "Observer";
function ObserverPropsCheck(props, key, componentName, location, propFullName) {
    var extraKey = key === "children" ? "render" : "children";
    var hasProp = typeof props[key] === "function";
    var hasExtraProp = typeof props[extraKey] === "function";
    if (hasProp && hasExtraProp) {
        return new Error("MobX Observer: Do not use children and render in the same time in`" + componentName);
    }
    if (hasProp || hasExtraProp) {
        return null;
    }
    return new Error("Invalid prop `" +
        propFullName +
        "` of type `" +
        typeof props[key] +
        "` supplied to" +
        " `" +
        componentName +
        "`, expected `function`.");
}

});
___scope___.file("lib/useAsObservableSource.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
        return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
            ar.push(r.value);
    }
    catch (error) {
        e = { error: error };
    }
    finally {
        try {
            if (r && !r.done && (m = i["return"]))
                m.call(i);
        }
        finally {
            if (e)
                throw e.error;
        }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var react_1 = __importDefault(require("preact/compat/dist/compat.js"));
var utils_1 = require("./utils");
function useAsObservableSourceInternal(current, usedByLocalStore) {
    var culprit = usedByLocalStore ? "useLocalStore" : "useAsObservableSource";
    if ("production" !== process.env.NODE_ENV && usedByLocalStore) {
        var _a = __read(react_1.default.useState(current), 1), initialSource = _a[0];
        if ((initialSource !== undefined && current === undefined) ||
            (initialSource === undefined && current !== undefined)) {
            throw new Error("make sure you never pass `undefined` to " + culprit);
        }
    }
    if (usedByLocalStore && current === undefined) {
        return undefined;
    }
    if ("production" !== process.env.NODE_ENV && !utils_1.isPlainObject(current)) {
        throw new Error(culprit + " expects a plain object as " + (usedByLocalStore ? "second" : "first") + " argument");
    }
    var _b = __read(react_1.default.useState(function () { return mobx_1.observable(current, {}, { deep: false }); }), 1), res = _b[0];
    if ("production" !== process.env.NODE_ENV &&
        Object.keys(res).length !== Object.keys(current).length) {
        throw new Error("the shape of objects passed to " + culprit + " should be stable");
    }
    mobx_1.runInAction(function () {
        Object.assign(res, current);
    });
    return res;
}
exports.useAsObservableSourceInternal = useAsObservableSourceInternal;
function useAsObservableSource(current) {
    return useAsObservableSourceInternal(current, false);
}
exports.useAsObservableSource = useAsObservableSource;

});
___scope___.file("lib/useLocalStore.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var react_1 = __importDefault(require("preact/compat/dist/compat.js"));
var useAsObservableSource_1 = require("./useAsObservableSource");
var utils_1 = require("./utils");
function useLocalStore(initializer, current) {
    var source = useAsObservableSource_1.useAsObservableSourceInternal(current, true);
    return react_1.default.useState(function () {
        var local = mobx_1.observable(initializer(source));
        if (utils_1.isPlainObject(local)) {
            mobx_1.runInAction(function () {
                Object.keys(local).forEach(function (key) {
                    var value = local[key];
                    if (typeof value === "function") {
                        local[key] = wrapInTransaction(value, local);
                    }
                });
            });
        }
        return local;
    })[0];
}
exports.useLocalStore = useLocalStore;
function wrapInTransaction(fn, context) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return mobx_1.transaction(function () { return fn.apply(context, args); });
    };
}

});
return ___scope___.entry = "lib/index.js";
});
FuseBox.pkg("mobx-react", {}, function(___scope___){
___scope___.file("dist/index.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
'use strict';
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./mobxreact.cjs.production.min.js');
}
else {
    module.exports = require('./mobxreact.cjs.development.js');
}

});
___scope___.file("dist/mobxreact.cjs.production.min.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
var e, r = require("mobx"), t = require("preact/compat/dist/compat.js"), n = (e = t) && "object" == typeof e && "default" in e ? e.default : e, o = require("mobx-react-lite"), a = 0, i = {};
function s(e) { return i[e] || (i[e] = function (e) { if ("function" == typeof Symbol)
    return Symbol(e); var r = "__$mobx-react " + e + " (" + a + ")"; return a++, r; }(e)), i[e]; }
function c(e, r) { if (u(e, r))
    return !0; if ("object" != typeof e || null === e || "object" != typeof r || null === r)
    return !1; var t = Object.keys(e), n = Object.keys(r); if (t.length !== n.length)
    return !1; for (var o = 0; o < t.length; o++)
    if (!Object.hasOwnProperty.call(r, t[o]) || !u(e[t[o]], r[t[o]]))
        return !1; return !0; }
function u(e, r) { return e === r ? 0 !== e || 1 / e == 1 / r : e != e && r != r; }
var f = { $$typeof: 1, render: 1, compare: 1, type: 1, childContextTypes: 1, contextType: 1, contextTypes: 1, defaultProps: 1, getDefaultProps: 1, getDerivedStateFromError: 1, getDerivedStateFromProps: 1, mixins: 1, propTypes: 1 };
function l(e, r, t) { Object.hasOwnProperty.call(e, r) ? e[r] = t : Object.defineProperty(e, r, { enumerable: !1, configurable: !0, writable: !0, value: t }); }
var p = s("patchMixins"), b = s("patchedDefinition");
function d(e, r) { for (var t = this, n = arguments.length, o = new Array(n > 2 ? n - 2 : 0), a = 2; a < n; a++)
    o[a - 2] = arguments[a]; r.locks++; try {
    var i;
    return null != e && (i = e.apply(this, o)), i;
}
finally {
    r.locks--, 0 === r.locks && r.methods.forEach((function (e) { e.apply(t, o); }));
} }
function y(e, r) { return function () { for (var t = arguments.length, n = new Array(t), o = 0; o < t; o++)
    n[o] = arguments[o]; d.call.apply(d, [this, e, r].concat(n)); }; }
function v(e, r, t) { var n = function (e, r) { var t = e[p] = e[p] || {}, n = t[r] = t[r] || {}; return n.locks = n.locks || 0, n.methods = n.methods || [], n; }(e, r); n.methods.indexOf(t) < 0 && n.methods.push(t); var o = Object.getOwnPropertyDescriptor(e, r); if (!o || !o[b]) {
    var a = function e(r, t, n, o, a) { var i, s = y(a, o); return (i = {})[b] = !0, i.get = function () { return s; }, i.set = function (a) { if (this === r)
        s = y(a, o);
    else {
        var i = e(this, t, n, o, a);
        Object.defineProperty(this, t, i);
    } }, i.configurable = !0, i.enumerable = n, i; }(e, r, o ? o.enumerable : void 0, n, e[r]);
    Object.defineProperty(e, r, a);
} }
var m = r.$mobx || "$mobx", h = s("isMobXReactObserver"), O = s("isUnmounted"), g = s("skipRender"), w = s("isForcingUpdate");
function j(e) { var r = e.prototype; if (e[h]) {
    var n = x(r);
    console.warn("The provided component class (" + n + ") \n                has already been declared as an observer component.");
}
else
    e[h] = !0; if (r.componentWillReact)
    throw new Error("The componentWillReact life-cycle event is no longer supported"); if (e.__proto__ !== t.PureComponent)
    if (r.shouldComponentUpdate) {
        if (r.shouldComponentUpdate !== R)
            throw new Error("It is not allowed to use shouldComponentUpdate in observer based components.");
    }
    else
        r.shouldComponentUpdate = R; S(r, "props"), S(r, "state"); var a = r.render; return r.render = function () { return P.call(this, a); }, v(r, "componentWillUnmount", (function () { var e; if (!0 !== o.isUsingStaticRendering() && (null === (e = this.render[m]) || void 0 === e || e.dispose(), this[O] = !0, !this.render[m])) {
    var r = x(this);
    console.warn("The reactive render of an observer class component (" + r + ") \n                was overriden after MobX attached. This may result in a memory leak if the \n                overriden reactive render was not properly disposed.");
} })), e; }
function x(e) { return e.displayName || e.name || e.constructor && (e.constructor.displayName || e.constructor.name) || "<component>"; }
function P(e) { var n = this; if (!0 === o.isUsingStaticRendering())
    return e.call(this); l(this, g, !1), l(this, w, !1); var a = x(this), i = e.bind(this), s = !1, c = new r.Reaction(a + ".render()", (function () { if (!s && (s = !0, !0 !== n[O])) {
    var e = !0;
    try {
        l(n, w, !0), n[g] || t.Component.prototype.forceUpdate.call(n), e = !1;
    }
    finally {
        l(n, w, !1), e && c.dispose();
    }
} })); function u() { s = !1; var e = void 0, t = void 0; if (c.track((function () { try {
    t = r._allowStateChanges(!1, i);
}
catch (r) {
    e = r;
} })), e)
    throw e; return t; } return c.reactComponent = this, u[m] = c, this.render = u, u.call(this); }
function R(e, r) { return o.isUsingStaticRendering() && console.warn("[mobx-react] It seems that a re-rendering of a React component is triggered while in static (server-side) mode. Please make sure components are rendered only once server-side."), this.state !== r || !c(this.props, e); }
function S(e, t) { var n = s("reactProp_" + t + "_valueHolder"), o = s("reactProp_" + t + "_atomHolder"); function a() { return this[o] || l(this, o, r.createAtom("reactive " + t)), this[o]; } Object.defineProperty(e, t, { configurable: !0, enumerable: !0, get: function () { var e = !1; return r._allowStateReadsStart && r._allowStateReadsEnd && (e = r._allowStateReadsStart(!0)), a.call(this).reportObserved(), r._allowStateReadsStart && r._allowStateReadsEnd && r._allowStateReadsEnd(e), this[n]; }, set: function (e) { this[w] || c(this[n], e) ? l(this, n, e) : (l(this, n, e), l(this, g, !0), a.call(this).reportChanged(), l(this, g, !1)); } }); }
var C = "function" == typeof Symbol && Symbol.for, E = C ? Symbol.for("react.forward_ref") : "function" == typeof t.forwardRef && t.forwardRef((function (e) { return null; })).$$typeof, A = C ? Symbol.for("react.memo") : "function" == typeof t.memo && t.memo((function (e) { return null; })).$$typeof;
function k(e) { if (!0 === e.isMobxInjector && console.warn("Mobx observer: You are trying to use 'observer' on a component that already has 'inject'. Please apply 'observer' before applying 'inject'"), A && e.$$typeof === A)
    throw new Error("Mobx observer: You are trying to use 'observer' on a function component wrapped in either another observer or 'React.memo'. The observer already applies 'React.memo' for you."); if (E && e.$$typeof === E) {
    var r = e.render;
    if ("function" != typeof r)
        throw new Error("render property of ForwardRef was not a function");
    return t.forwardRef((function () { var e = arguments; return t.createElement(o.Observer, null, (function () { return r.apply(void 0, e); })); }));
} return "function" != typeof e || e.prototype && e.prototype.render || e.isReactClass || Object.prototype.isPrototypeOf.call(t.Component, e) ? j(e) : o.observer(e); }
function U() { return (U = Object.assign || function (e) { for (var r = 1; r < arguments.length; r++) {
    var t = arguments[r];
    for (var n in t)
        Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
} return e; }).apply(this, arguments); }
var _ = n.createContext({});
function M(e) { var r = e.children, t = function (e, r) { if (null == e)
    return {}; var t, n, o = {}, a = Object.keys(e); for (n = 0; n < a.length; n++)
    r.indexOf(t = a[n]) >= 0 || (o[t] = e[t]); return o; }(e, ["children"]), o = n.useContext(_), a = n.useRef(U({}, o, t)); return n.createElement(_.Provider, { value: a.current }, r); }
function T(e, r, t, o) { var a, i, s, c = n.forwardRef((function (t, o) { var a = U({}, t), i = n.useContext(_); return Object.assign(a, e(i || {}, a) || {}), o && (a.ref = o), n.createElement(r, a); })); return o && (c = k(c)), c.isMobxInjector = !0, a = r, i = c, s = Object.getOwnPropertyNames(Object.getPrototypeOf(a)), Object.getOwnPropertyNames(a).forEach((function (e) { f[e] || -1 !== s.indexOf(e) || Object.defineProperty(i, e, Object.getOwnPropertyDescriptor(a, e)); })), c.wrappedComponent = r, c.displayName = function (e, r) { var t = e.displayName || e.name || e.constructor && e.constructor.name || "Component"; return r ? "inject-with-" + r + "(" + t + ")" : "inject(" + t + ")"; }(r, t), c; }
function $(e) { return function (r, t) { return e.forEach((function (e) { if (!(e in t)) {
    if (!(e in r))
        throw new Error("MobX injector: Store '" + e + "' is not available! Make sure it is provided by some Provider");
    t[e] = r[e];
} })), t; }; }
M.displayName = "MobXProvider";
var q = s("disposeOnUnmountProto"), D = s("disposeOnUnmountInst");
function N() { var e = this; [].concat(this[q] || [], this[D] || []).forEach((function (r) { var t = "string" == typeof r ? e[r] : r; null != t && (Array.isArray(t) ? t.map((function (e) { return e(); })) : t()); })); }
function I(e) { function t(t, n, o, a, i, s) { for (var c = arguments.length, u = new Array(c > 6 ? c - 6 : 0), f = 6; f < c; f++)
    u[f - 6] = arguments[f]; return r.untracked((function () { return a = a || "<<anonymous>>", s = s || o, null == n[o] ? t ? new Error("The " + i + " `" + s + "` is marked as required in `" + a + "`, but its value is `" + (null === n[o] ? "null" : "undefined") + "`.") : null : e.apply(void 0, [n, o, a, i, s].concat(u)); })); } var n = t.bind(null, !1); return n.isRequired = t.bind(null, !0), n; }
function X(e) { var r = typeof e; return Array.isArray(e) ? "array" : e instanceof RegExp ? "object" : function (e, r) { return "symbol" === e || "Symbol" === r["@@toStringTag"] || "function" == typeof Symbol && r instanceof Symbol; }(r, e) ? "symbol" : r; }
function F(e, t) { return I((function (n, o, a, i, s) { return r.untracked((function () { if (e && X(n[o]) === t.toLowerCase())
    return null; var i; switch (t) {
    case "Array":
        i = r.isObservableArray;
        break;
    case "Object":
        i = r.isObservableObject;
        break;
    case "Map":
        i = r.isObservableMap;
        break;
    default: throw new Error("Unexpected mobxType: " + t);
} var c = n[o]; if (!i(c)) {
    var u = function (e) { var r = X(e); if ("object" === r) {
        if (e instanceof Date)
            return "date";
        if (e instanceof RegExp)
            return "regexp";
    } return r; }(c), f = e ? " or javascript `" + t.toLowerCase() + "`" : "";
    return new Error("Invalid prop `" + s + "` of type `" + u + "` supplied to `" + a + "`, expected `mobx.Observable" + t + "`" + f + ".");
} return null; })); })); }
function L(e, t) { return I((function (n, o, a, i, s) { for (var c = arguments.length, u = new Array(c > 5 ? c - 5 : 0), f = 5; f < c; f++)
    u[f - 5] = arguments[f]; return r.untracked((function () { if ("function" != typeof t)
    return new Error("Property `" + s + "` of component `" + a + "` has invalid PropType notation."); var r = F(e, "Array")(n, o, a, i, s); if (r instanceof Error)
    return r; for (var c = n[o], f = 0; f < c.length; f++)
    if ((r = t.apply(void 0, [c, f, a, i, s + "[" + f + "]"].concat(u))) instanceof Error)
        return r; return null; })); })); }
var W = { observableArray: F(!1, "Array"), observableArrayOf: L.bind(null, !1), observableMap: F(!1, "Map"), observableObject: F(!1, "Object"), arrayOrObservableArray: F(!0, "Array"), arrayOrObservableArrayOf: L.bind(null, !0), objectOrObservableObject: F(!0, "Object") };
if (!t.Component)
    throw new Error("mobx-react requires React to be available");
if (!r.observable)
    throw new Error("mobx-react requires mobx to be available");
Object.defineProperty(exports, "Observer", { enumerable: !0, get: function () { return o.Observer; } }), Object.defineProperty(exports, "isUsingStaticRendering", { enumerable: !0, get: function () { return o.isUsingStaticRendering; } }), Object.defineProperty(exports, "observerBatching", { enumerable: !0, get: function () { return o.observerBatching; } }), Object.defineProperty(exports, "useAsObservableSource", { enumerable: !0, get: function () { return o.useAsObservableSource; } }), Object.defineProperty(exports, "useLocalStore", { enumerable: !0, get: function () { return o.useLocalStore; } }), Object.defineProperty(exports, "useObserver", { enumerable: !0, get: function () { return o.useObserver; } }), Object.defineProperty(exports, "useStaticRendering", { enumerable: !0, get: function () { return o.useStaticRendering; } }), exports.MobXProviderContext = _, exports.PropTypes = W, exports.Provider = M, exports.disposeOnUnmount = function e(r, t) { if (Array.isArray(t))
    return t.map((function (t) { return e(r, t); })); var o = Object.getPrototypeOf(r).constructor, a = Object.getPrototypeOf(r.constructor), i = Object.getPrototypeOf(Object.getPrototypeOf(r)); if (o !== n.Component && o !== n.PureComponent && a !== n.Component && a !== n.PureComponent && i !== n.Component && i !== n.PureComponent)
    throw new Error("[mobx-react] disposeOnUnmount only supports direct subclasses of React.Component or React.PureComponent."); if ("string" != typeof t && "function" != typeof t && !Array.isArray(t))
    throw new Error("[mobx-react] disposeOnUnmount only works if the parameter is either a property key or a function."); var s = !!r[q] || !!r[D]; return ("string" == typeof t ? r[q] || (r[q] = []) : r[D] || (r[D] = [])).push(t), s || v(r, "componentWillUnmount", N), "string" != typeof t ? t : void 0; }, exports.inject = function () { for (var e = arguments.length, r = new Array(e), t = 0; t < e; t++)
    r[t] = arguments[t]; if ("function" == typeof arguments[0]) {
    var n = arguments[0];
    return function (e) { return T(n, e, n.name, !0); };
} return function (e) { return T($(r), e, r.join("-"), !1); }; }, exports.observer = k;

});
___scope___.file("dist/mobxreact.cjs.development.js", function(exports, require, module, __filename, __dirname){

'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function _interopDefault(ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }
var mobx = require('mobx');
var React = require("preact/compat/dist/compat.js");
var React__default = _interopDefault(React);
var mobxReactLite = require('mobx-react-lite');
var symbolId = 0;
function createSymbol(name) {
    if (typeof Symbol === "function") {
        return Symbol(name);
    }
    var symbol = "__$mobx-react " + name + " (" + symbolId + ")";
    symbolId++;
    return symbol;
}
var createdSymbols = {};
function newSymbol(name) {
    if (!createdSymbols[name]) {
        createdSymbols[name] = createSymbol(name);
    }
    return createdSymbols[name];
}
function shallowEqual(objA, objB) {
    if (is(objA, objB))
        return true;
    if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
        return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length)
        return false;
    for (var i = 0; i < keysA.length; i++) {
        if (!Object.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }
    return true;
}
function is(x, y) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    }
    else {
        return x !== x && y !== y;
    }
}
var hoistBlackList = {
    $$typeof: 1,
    render: 1,
    compare: 1,
    type: 1,
    childContextTypes: 1,
    contextType: 1,
    contextTypes: 1,
    defaultProps: 1,
    getDefaultProps: 1,
    getDerivedStateFromError: 1,
    getDerivedStateFromProps: 1,
    mixins: 1,
    propTypes: 1
};
function copyStaticProperties(base, target) {
    var protoProps = Object.getOwnPropertyNames(Object.getPrototypeOf(base));
    Object.getOwnPropertyNames(base).forEach(function (key) {
        if (!hoistBlackList[key] && protoProps.indexOf(key) === -1) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(base, key));
        }
    });
}
function setHiddenProp(target, prop, value) {
    if (!Object.hasOwnProperty.call(target, prop)) {
        Object.defineProperty(target, prop, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: value
        });
    }
    else {
        target[prop] = value;
    }
}
var mobxMixins = newSymbol("patchMixins");
var mobxPatchedDefinition = newSymbol("patchedDefinition");
function getMixins(target, methodName) {
    var mixins = target[mobxMixins] = target[mobxMixins] || {};
    var methodMixins = mixins[methodName] = mixins[methodName] || {};
    methodMixins.locks = methodMixins.locks || 0;
    methodMixins.methods = methodMixins.methods || [];
    return methodMixins;
}
function wrapper(realMethod, mixins) {
    var _this = this;
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
    }
    mixins.locks++;
    try {
        var retVal;
        if (realMethod !== undefined && realMethod !== null) {
            retVal = realMethod.apply(this, args);
        }
        return retVal;
    }
    finally {
        mixins.locks--;
        if (mixins.locks === 0) {
            mixins.methods.forEach(function (mx) {
                mx.apply(_this, args);
            });
        }
    }
}
function wrapFunction(realMethod, mixins) {
    var fn = function fn() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }
        wrapper.call.apply(wrapper, [this, realMethod, mixins].concat(args));
    };
    return fn;
}
function patch(target, methodName, mixinMethod) {
    var mixins = getMixins(target, methodName);
    if (mixins.methods.indexOf(mixinMethod) < 0) {
        mixins.methods.push(mixinMethod);
    }
    var oldDefinition = Object.getOwnPropertyDescriptor(target, methodName);
    if (oldDefinition && oldDefinition[mobxPatchedDefinition]) {
        return;
    }
    var originalMethod = target[methodName];
    var newDefinition = createDefinition(target, methodName, oldDefinition ? oldDefinition.enumerable : undefined, mixins, originalMethod);
    Object.defineProperty(target, methodName, newDefinition);
}
function createDefinition(target, methodName, enumerable, mixins, originalMethod) {
    var _ref;
    var wrappedFunc = wrapFunction(originalMethod, mixins);
    return _ref = {}, _ref[mobxPatchedDefinition] = true, _ref.get = function get() {
        return wrappedFunc;
    }, _ref.set = function set(value) {
        if (this === target) {
            wrappedFunc = wrapFunction(value, mixins);
        }
        else {
            var newDefinition = createDefinition(this, methodName, enumerable, mixins, value);
            Object.defineProperty(this, methodName, newDefinition);
        }
    }, _ref.configurable = true, _ref.enumerable = enumerable, _ref;
}
var mobxAdminProperty = mobx.$mobx || "$mobx";
var mobxObserverProperty = newSymbol("isMobXReactObserver");
var mobxIsUnmounted = newSymbol("isUnmounted");
var skipRenderKey = newSymbol("skipRender");
var isForcingUpdateKey = newSymbol("isForcingUpdate");
function makeClassComponentObserver(componentClass) {
    var target = componentClass.prototype;
    if (componentClass[mobxObserverProperty]) {
        var displayName = getDisplayName(target);
        console.warn("The provided component class (" + displayName + ") \n                has already been declared as an observer component.");
    }
    else {
        componentClass[mobxObserverProperty] = true;
    }
    if (target.componentWillReact)
        throw new Error("The componentWillReact life-cycle event is no longer supported");
    if (componentClass["__proto__"] !== React.PureComponent) {
        if (!target.shouldComponentUpdate)
            target.shouldComponentUpdate = observerSCU;
        else if (target.shouldComponentUpdate !== observerSCU)
            throw new Error("It is not allowed to use shouldComponentUpdate in observer based components.");
    }
    makeObservableProp(target, "props");
    makeObservableProp(target, "state");
    var baseRender = target.render;
    target.render = function () {
        return makeComponentReactive.call(this, baseRender);
    };
    patch(target, "componentWillUnmount", function () {
        var _this$render$mobxAdmi;
        if (mobxReactLite.isUsingStaticRendering() === true)
            return;
        (_this$render$mobxAdmi = this.render[mobxAdminProperty]) === null || _this$render$mobxAdmi === void 0 ? void 0 : _this$render$mobxAdmi.dispose();
        this[mobxIsUnmounted] = true;
        if (!this.render[mobxAdminProperty]) {
            var _displayName = getDisplayName(this);
            console.warn("The reactive render of an observer class component (" + _displayName + ") \n                was overriden after MobX attached. This may result in a memory leak if the \n                overriden reactive render was not properly disposed.");
        }
    });
    return componentClass;
}
function getDisplayName(comp) {
    return comp.displayName || comp.name || comp.constructor && (comp.constructor.displayName || comp.constructor.name) || "<component>";
}
function makeComponentReactive(render) {
    var _this = this;
    if (mobxReactLite.isUsingStaticRendering() === true)
        return render.call(this);
    setHiddenProp(this, skipRenderKey, false);
    setHiddenProp(this, isForcingUpdateKey, false);
    var initialName = getDisplayName(this);
    var baseRender = render.bind(this);
    var isRenderingPending = false;
    var reaction = new mobx.Reaction(initialName + ".render()", function () {
        if (!isRenderingPending) {
            isRenderingPending = true;
            if (_this[mobxIsUnmounted] !== true) {
                var hasError = true;
                try {
                    setHiddenProp(_this, isForcingUpdateKey, true);
                    if (!_this[skipRenderKey])
                        React.Component.prototype.forceUpdate.call(_this);
                    hasError = false;
                }
                finally {
                    setHiddenProp(_this, isForcingUpdateKey, false);
                    if (hasError)
                        reaction.dispose();
                }
            }
        }
    });
    reaction["reactComponent"] = this;
    reactiveRender[mobxAdminProperty] = reaction;
    this.render = reactiveRender;
    function reactiveRender() {
        isRenderingPending = false;
        var exception = undefined;
        var rendering = undefined;
        reaction.track(function () {
            try {
                rendering = mobx._allowStateChanges(false, baseRender);
            }
            catch (e) {
                exception = e;
            }
        });
        if (exception) {
            throw exception;
        }
        return rendering;
    }
    return reactiveRender.call(this);
}
function observerSCU(nextProps, nextState) {
    if (mobxReactLite.isUsingStaticRendering()) {
        console.warn("[mobx-react] It seems that a re-rendering of a React component is triggered while in static (server-side) mode. Please make sure components are rendered only once server-side.");
    }
    if (this.state !== nextState) {
        return true;
    }
    return !shallowEqual(this.props, nextProps);
}
function makeObservableProp(target, propName) {
    var valueHolderKey = newSymbol("reactProp_" + propName + "_valueHolder");
    var atomHolderKey = newSymbol("reactProp_" + propName + "_atomHolder");
    function getAtom() {
        if (!this[atomHolderKey]) {
            setHiddenProp(this, atomHolderKey, mobx.createAtom("reactive " + propName));
        }
        return this[atomHolderKey];
    }
    Object.defineProperty(target, propName, {
        configurable: true,
        enumerable: true,
        get: function get() {
            var prevReadState = false;
            if (mobx._allowStateReadsStart && mobx._allowStateReadsEnd) {
                prevReadState = mobx._allowStateReadsStart(true);
            }
            getAtom.call(this).reportObserved();
            if (mobx._allowStateReadsStart && mobx._allowStateReadsEnd) {
                mobx._allowStateReadsEnd(prevReadState);
            }
            return this[valueHolderKey];
        },
        set: function set(v) {
            if (!this[isForcingUpdateKey] && !shallowEqual(this[valueHolderKey], v)) {
                setHiddenProp(this, valueHolderKey, v);
                setHiddenProp(this, skipRenderKey, true);
                getAtom.call(this).reportChanged();
                setHiddenProp(this, skipRenderKey, false);
            }
            else {
                setHiddenProp(this, valueHolderKey, v);
            }
        }
    });
}
var hasSymbol = typeof Symbol === "function" && Symbol.for;
var ReactForwardRefSymbol = hasSymbol ?
    Symbol.for("react.forward_ref") : typeof React.forwardRef === "function" &&
    React.forwardRef(function (props) {
        return null;
    })["$$typeof"];
var ReactMemoSymbol = hasSymbol ?
    Symbol.for("react.memo") : typeof React.memo === "function" &&
    React.memo(function (props) {
        return null;
    })["$$typeof"];
function observer(component) {
    if (component["isMobxInjector"] === true) {
        console.warn("Mobx observer: You are trying to use 'observer' on a component that already has 'inject'. Please apply 'observer' before applying 'inject'");
    }
    if (ReactMemoSymbol && component["$$typeof"] === ReactMemoSymbol) {
        throw new Error("Mobx observer: You are trying to use 'observer' on a function component wrapped in either another observer or 'React.memo'. The observer already applies 'React.memo' for you.");
    }
    if (ReactForwardRefSymbol && component["$$typeof"] === ReactForwardRefSymbol) {
        var baseRender = component["render"];
        if (typeof baseRender !== "function")
            throw new Error("render property of ForwardRef was not a function");
        return React.forwardRef(function ObserverForwardRef() {
            var args = arguments;
            return React.createElement(mobxReactLite.Observer, null, function () {
                return baseRender.apply(undefined, args);
            });
        });
    }
    if (typeof component === "function" && (!component.prototype || !component.prototype.render) && !component["isReactClass"] && !Object.prototype.isPrototypeOf.call(React.Component, component)) {
        return mobxReactLite.observer(component);
    }
    return makeClassComponentObserver(component);
}
function _extends() {
    _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null)
        return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0)
            continue;
        target[key] = source[key];
    }
    return target;
}
var MobXProviderContext = React__default.createContext({});
function Provider(props) {
    var children = props.children, stores = _objectWithoutPropertiesLoose(props, ["children"]);
    var parentValue = React__default.useContext(MobXProviderContext);
    var mutableProviderRef = React__default.useRef(_extends({}, parentValue, stores));
    var value = mutableProviderRef.current;
    {
        var newValue = _extends({}, value, stores);
        if (!shallowEqual(value, newValue)) {
            throw new Error("MobX Provider: The set of provided stores has changed. See: https://github.com/mobxjs/mobx-react#the-set-of-provided-stores-has-changed-error.");
        }
    }
    return React__default.createElement(MobXProviderContext.Provider, {
        value: value
    }, children);
}
Provider.displayName = "MobXProvider";
function createStoreInjector(grabStoresFn, component, injectNames, makeReactive) {
    var Injector = React__default.forwardRef(function (props, ref) {
        var newProps = _extends({}, props);
        var context = React__default.useContext(MobXProviderContext);
        Object.assign(newProps, grabStoresFn(context || {}, newProps) || {});
        if (ref) {
            newProps.ref = ref;
        }
        return React__default.createElement(component, newProps);
    });
    if (makeReactive)
        Injector = observer(Injector);
    Injector["isMobxInjector"] = true;
    copyStaticProperties(component, Injector);
    Injector["wrappedComponent"] = component;
    Injector.displayName = getInjectName(component, injectNames);
    return Injector;
}
function getInjectName(component, injectNames) {
    var displayName;
    var componentName = component.displayName || component.name || component.constructor && component.constructor.name || "Component";
    if (injectNames)
        displayName = "inject-with-" + injectNames + "(" + componentName + ")";
    else
        displayName = "inject(" + componentName + ")";
    return displayName;
}
function grabStoresByName(storeNames) {
    return function (baseStores, nextProps) {
        storeNames.forEach(function (storeName) {
            if (storeName in nextProps)
                return;
            if (!(storeName in baseStores))
                throw new Error("MobX injector: Store '" + storeName + "' is not available! Make sure it is provided by some Provider");
            nextProps[storeName] = baseStores[storeName];
        });
        return nextProps;
    };
}
function inject() {
    for (var _len = arguments.length, storeNames = new Array(_len), _key = 0; _key < _len; _key++) {
        storeNames[_key] = arguments[_key];
    }
    if (typeof arguments[0] === "function") {
        var grabStoresFn = arguments[0];
        return function (componentClass) {
            return createStoreInjector(grabStoresFn, componentClass, grabStoresFn.name, true);
        };
    }
    else {
        return function (componentClass) {
            return createStoreInjector(grabStoresByName(storeNames), componentClass, storeNames.join("-"), false);
        };
    }
}
var protoStoreKey = newSymbol("disposeOnUnmountProto");
var instStoreKey = newSymbol("disposeOnUnmountInst");
function runDisposersOnWillUnmount() {
    var _this = this;
    [].concat(this[protoStoreKey] || [], this[instStoreKey] || []).forEach(function (propKeyOrFunction) {
        var prop = typeof propKeyOrFunction === "string" ? _this[propKeyOrFunction] : propKeyOrFunction;
        if (prop !== undefined && prop !== null) {
            if (Array.isArray(prop))
                prop.map(function (f) {
                    return f();
                });
            else
                prop();
        }
    });
}
function disposeOnUnmount(target, propertyKeyOrFunction) {
    if (Array.isArray(propertyKeyOrFunction)) {
        return propertyKeyOrFunction.map(function (fn) {
            return disposeOnUnmount(target, fn);
        });
    }
    var c = Object.getPrototypeOf(target).constructor;
    var c2 = Object.getPrototypeOf(target.constructor);
    var c3 = Object.getPrototypeOf(Object.getPrototypeOf(target));
    if (!(c === React__default.Component || c === React__default.PureComponent || c2 === React__default.Component || c2 === React__default.PureComponent || c3 === React__default.Component || c3 === React__default.PureComponent)) {
        throw new Error("[mobx-react] disposeOnUnmount only supports direct subclasses of React.Component or React.PureComponent.");
    }
    if (typeof propertyKeyOrFunction !== "string" && typeof propertyKeyOrFunction !== "function" && !Array.isArray(propertyKeyOrFunction)) {
        throw new Error("[mobx-react] disposeOnUnmount only works if the parameter is either a property key or a function.");
    }
    var isDecorator = typeof propertyKeyOrFunction === "string";
    var componentWasAlreadyModified = !!target[protoStoreKey] || !!target[instStoreKey];
    var store = isDecorator ?
        target[protoStoreKey] || (target[protoStoreKey] = []) :
        target[instStoreKey] || (target[instStoreKey] = []);
    store.push(propertyKeyOrFunction);
    if (!componentWasAlreadyModified) {
        patch(target, "componentWillUnmount", runDisposersOnWillUnmount);
    }
    if (typeof propertyKeyOrFunction !== "string") {
        return propertyKeyOrFunction;
    }
}
function createChainableTypeChecker(validator) {
    function checkType(isRequired, props, propName, componentName, location, propFullName) {
        for (var _len = arguments.length, rest = new Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
            rest[_key - 6] = arguments[_key];
        }
        return mobx.untracked(function () {
            componentName = componentName || "<<anonymous>>";
            propFullName = propFullName || propName;
            if (props[propName] == null) {
                if (isRequired) {
                    var actual = props[propName] === null ? "null" : "undefined";
                    return new Error("The " + location + " `" + propFullName + "` is marked as required " + "in `" + componentName + "`, but its value is `" + actual + "`.");
                }
                return null;
            }
            else {
                return validator.apply(void 0, [props, propName, componentName, location, propFullName].concat(rest));
            }
        });
    }
    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);
    return chainedCheckType;
}
function isSymbol(propType, propValue) {
    if (propType === "symbol") {
        return true;
    }
    if (propValue["@@toStringTag"] === "Symbol") {
        return true;
    }
    if (typeof Symbol === "function" && propValue instanceof Symbol) {
        return true;
    }
    return false;
}
function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
        return "array";
    }
    if (propValue instanceof RegExp) {
        return "object";
    }
    if (isSymbol(propType, propValue)) {
        return "symbol";
    }
    return propType;
}
function getPreciseType(propValue) {
    var propType = getPropType(propValue);
    if (propType === "object") {
        if (propValue instanceof Date) {
            return "date";
        }
        else if (propValue instanceof RegExp) {
            return "regexp";
        }
    }
    return propType;
}
function createObservableTypeCheckerCreator(allowNativeType, mobxType) {
    return createChainableTypeChecker(function (props, propName, componentName, location, propFullName) {
        return mobx.untracked(function () {
            if (allowNativeType) {
                if (getPropType(props[propName]) === mobxType.toLowerCase())
                    return null;
            }
            var mobxChecker;
            switch (mobxType) {
                case "Array":
                    mobxChecker = mobx.isObservableArray;
                    break;
                case "Object":
                    mobxChecker = mobx.isObservableObject;
                    break;
                case "Map":
                    mobxChecker = mobx.isObservableMap;
                    break;
                default:
                    throw new Error("Unexpected mobxType: " + mobxType);
            }
            var propValue = props[propName];
            if (!mobxChecker(propValue)) {
                var preciseType = getPreciseType(propValue);
                var nativeTypeExpectationMessage = allowNativeType ? " or javascript `" + mobxType.toLowerCase() + "`" : "";
                return new Error("Invalid prop `" + propFullName + "` of type `" + preciseType + "` supplied to" + " `" + componentName + "`, expected `mobx.Observable" + mobxType + "`" + nativeTypeExpectationMessage + ".");
            }
            return null;
        });
    });
}
function createObservableArrayOfTypeChecker(allowNativeType, typeChecker) {
    return createChainableTypeChecker(function (props, propName, componentName, location, propFullName) {
        for (var _len2 = arguments.length, rest = new Array(_len2 > 5 ? _len2 - 5 : 0), _key2 = 5; _key2 < _len2; _key2++) {
            rest[_key2 - 5] = arguments[_key2];
        }
        return mobx.untracked(function () {
            if (typeof typeChecker !== "function") {
                return new Error("Property `" + propFullName + "` of component `" + componentName + "` has " + "invalid PropType notation.");
            }
            else {
                var error = createObservableTypeCheckerCreator(allowNativeType, "Array")(props, propName, componentName, location, propFullName);
                if (error instanceof Error)
                    return error;
                var propValue = props[propName];
                for (var i = 0; i < propValue.length; i++) {
                    error = typeChecker.apply(void 0, [propValue, i, componentName, location, propFullName + "[" + i + "]"].concat(rest));
                    if (error instanceof Error)
                        return error;
                }
                return null;
            }
        });
    });
}
var observableArray = createObservableTypeCheckerCreator(false, "Array");
var observableArrayOf = createObservableArrayOfTypeChecker.bind(null, false);
var observableMap = createObservableTypeCheckerCreator(false, "Map");
var observableObject = createObservableTypeCheckerCreator(false, "Object");
var arrayOrObservableArray = createObservableTypeCheckerCreator(true, "Array");
var arrayOrObservableArrayOf = createObservableArrayOfTypeChecker.bind(null, true);
var objectOrObservableObject = createObservableTypeCheckerCreator(true, "Object");
var PropTypes = {
    observableArray: observableArray,
    observableArrayOf: observableArrayOf,
    observableMap: observableMap,
    observableObject: observableObject,
    arrayOrObservableArray: arrayOrObservableArray,
    arrayOrObservableArrayOf: arrayOrObservableArrayOf,
    objectOrObservableObject: objectOrObservableObject
};
if (!React.Component)
    throw new Error("mobx-react requires React to be available");
if (!mobx.observable)
    throw new Error("mobx-react requires mobx to be available");
Object.defineProperty(exports, 'Observer', {
    enumerable: true,
    get: function () {
        return mobxReactLite.Observer;
    }
});
Object.defineProperty(exports, 'isUsingStaticRendering', {
    enumerable: true,
    get: function () {
        return mobxReactLite.isUsingStaticRendering;
    }
});
Object.defineProperty(exports, 'observerBatching', {
    enumerable: true,
    get: function () {
        return mobxReactLite.observerBatching;
    }
});
Object.defineProperty(exports, 'useAsObservableSource', {
    enumerable: true,
    get: function () {
        return mobxReactLite.useAsObservableSource;
    }
});
Object.defineProperty(exports, 'useLocalStore', {
    enumerable: true,
    get: function () {
        return mobxReactLite.useLocalStore;
    }
});
Object.defineProperty(exports, 'useObserver', {
    enumerable: true,
    get: function () {
        return mobxReactLite.useObserver;
    }
});
Object.defineProperty(exports, 'useStaticRendering', {
    enumerable: true,
    get: function () {
        return mobxReactLite.useStaticRendering;
    }
});
exports.MobXProviderContext = MobXProviderContext;
exports.PropTypes = PropTypes;
exports.Provider = Provider;
exports.disposeOnUnmount = disposeOnUnmount;
exports.inject = inject;
exports.observer = observer;

});
return ___scope___.entry = "dist/index.js";
});
FuseBox.pkg("mobx", {}, function(___scope___){
___scope___.file("lib/index.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    module.exports = require('./mobx.min.js');
}
else {
    module.exports = require('./mobx.js');
}

});
___scope___.file("lib/mobx.min.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
var e = [];
Object.freeze(e);
var t = {};
function r() { return ++Re.mobxGuid; }
function n(e) { throw o(!1, e), "X"; }
function o(e, t) { if (!e)
    throw new Error("[mobx] " + (t || "An invariant failed, however the error is obfuscated because this is a production build.")); }
function i(e) { var t = !1; return function () { if (!t)
    return t = !0, e.apply(this, arguments); }; }
Object.freeze(t);
var a = function () { };
function s(e) { return null !== e && "object" == typeof e; }
function u(e) { if (null === e || "object" != typeof e)
    return !1; var t = Object.getPrototypeOf(e); return t === Object.prototype || null === t; }
function c(e, t, r) { Object.defineProperty(e, t, { enumerable: !1, writable: !0, configurable: !0, value: r }); }
function l(e, t) { var r = "isMobX" + e; return t.prototype[r] = !0, function (e) { return s(e) && !0 === e[r]; }; }
function f(e) { return e instanceof Map; }
function p(e) { return e instanceof Set; }
function h(e) { var t = new Set; for (var r in e)
    t.add(r); return Object.getOwnPropertySymbols(e).forEach((function (r) { Object.getOwnPropertyDescriptor(e, r).enumerable && t.add(r); })), Array.from(t); }
function d(e) { return e && e.toString ? e.toString() : new String(e).toString(); }
function v(e) { return null === e ? null : "object" == typeof e ? "" + e : e; }
var y = "undefined" != typeof Reflect && Reflect.ownKeys ? Reflect.ownKeys : Object.getOwnPropertySymbols ? function (e) { return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e)); } : Object.getOwnPropertyNames, b = Symbol("mobx administration"), g = function () { function e(e) { void 0 === e && (e = "Atom@" + r()), this.name = e, this.isPendingUnobservation = !1, this.isBeingObserved = !1, this.observers = new Set, this.diffValue = 0, this.lastAccessedBy = 0, this.lowestObserverState = exports.IDerivationState.NOT_TRACKING; } return e.prototype.onBecomeObserved = function () { this.onBecomeObservedListeners && this.onBecomeObservedListeners.forEach((function (e) { return e(); })); }, e.prototype.onBecomeUnobserved = function () { this.onBecomeUnobservedListeners && this.onBecomeUnobservedListeners.forEach((function (e) { return e(); })); }, e.prototype.reportObserved = function () { return ke(this); }, e.prototype.reportChanged = function () { Ne(), function (e) { if (e.lowestObserverState === exports.IDerivationState.STALE)
    return; e.lowestObserverState = exports.IDerivationState.STALE, e.observers.forEach((function (t) { t.dependenciesState === exports.IDerivationState.UP_TO_DATE && (t.isTracing !== Y.NONE && Be(t, e), t.onBecomeStale()), t.dependenciesState = exports.IDerivationState.STALE; })); }(this), Ve(); }, e.prototype.toString = function () { return this.name; }, e; }(), m = l("Atom", g);
function w(e, t, r) { void 0 === t && (t = a), void 0 === r && (r = a); var n = new g(e); return t !== a && Ze(n, t), r !== a && et(n, r), n; }
var x = { identity: function (e, t) { return e === t; }, structural: function (e, t) { return ar(e, t); }, default: function (e, t) { return Object.is(e, t); }, shallow: function (e, t) { return ar(e, t, 1); } }, O = function (e, t) { return (O = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (e, t) { e.__proto__ = t; } || function (e, t) { for (var r in t)
    t.hasOwnProperty(r) && (e[r] = t[r]); })(e, t); };
var S = function () { return (S = Object.assign || function (e) { for (var t, r = 1, n = arguments.length; r < n; r++)
    for (var o in t = arguments[r])
        Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]); return e; }).apply(this, arguments); };
function A(e) { var t = "function" == typeof Symbol && e[Symbol.iterator], r = 0; return t ? t.call(e) : { next: function () { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; }
function _(e, t) { var r = "function" == typeof Symbol && e[Symbol.iterator]; if (!r)
    return e; var n, o, i = r.call(e), a = []; try {
    for (; (void 0 === t || t-- > 0) && !(n = i.next()).done;)
        a.push(n.value);
}
catch (e) {
    o = { error: e };
}
finally {
    try {
        n && !n.done && (r = i.return) && r.call(i);
    }
    finally {
        if (o)
            throw o.error;
    }
} return a; }
function E() { for (var e = [], t = 0; t < arguments.length; t++)
    e = e.concat(_(arguments[t])); return e; }
var D = Symbol("mobx did run lazy initializers"), j = Symbol("mobx pending decorators"), C = {}, R = {};
function T(e, t) { var r = t ? C : R; return r[e] || (r[e] = { configurable: !0, enumerable: t, get: function () { return I(this), this[e]; }, set: function (t) { I(this), this[e] = t; } }); }
function I(e) { var t, r; if (!0 !== e[D]) {
    var n = e[j];
    if (n) {
        c(e, D, !0);
        var o = E(Object.getOwnPropertySymbols(n), Object.keys(n));
        try {
            for (var i = A(o), a = i.next(); !a.done; a = i.next()) {
                var s = n[a.value];
                s.propertyCreator(e, s.prop, s.descriptor, s.decoratorTarget, s.decoratorArguments);
            }
        }
        catch (e) {
            t = { error: e };
        }
        finally {
            try {
                a && !a.done && (r = i.return) && r.call(i);
            }
            finally {
                if (t)
                    throw t.error;
            }
        }
    }
} }
function P(t, r) { return function () { var n, o = function (e, o, i, a) { if (!0 === a)
    return r(e, o, i, e, n), null; if (!Object.prototype.hasOwnProperty.call(e, j)) {
    var s = e[j];
    c(e, j, S({}, s));
} return e[j][o] = { prop: o, propertyCreator: r, descriptor: i, decoratorTarget: e, decoratorArguments: n }, T(o, t); }; return N(arguments) ? (n = e, o.apply(null, arguments)) : (n = Array.prototype.slice.call(arguments), o); }; }
function N(e) { return (2 === e.length || 3 === e.length) && ("string" == typeof e[1] || "symbol" == typeof e[1]) || 4 === e.length && !0 === e[3]; }
function V(e, t, r) { return dt(e) ? e : Array.isArray(e) ? W.array(e, { name: r }) : u(e) ? W.object(e, void 0, { name: r }) : f(e) ? W.map(e, { name: r }) : p(e) ? W.set(e, { name: r }) : e; }
function k(e) { return e; }
function B(e) { o(e); var t = P(!0, (function (t, r, n, o, i) { var a = n ? n.initializer ? n.initializer.call(t) : n.value : void 0; Ft(t).addObservableProp(r, a, e); })), r = ("undefined" != typeof process && process.env, t); return r.enhancer = e, r; }
var L = { deep: !0, name: void 0, defaultDecorator: void 0, proxy: !0 };
function M(e) { return null == e ? L : "string" == typeof e ? { name: e, deep: !0, proxy: !0 } : e; }
Object.freeze(L);
var U = B(V), G = B((function (e, t, r) { return null == e ? e : tr(e) || Gt(e) || Ht(e) || Xt(e) ? e : Array.isArray(e) ? W.array(e, { name: r, deep: !1 }) : u(e) ? W.object(e, void 0, { name: r, deep: !1 }) : f(e) ? W.map(e, { name: r, deep: !1 }) : p(e) ? W.set(e, { name: r, deep: !1 }) : n(!1); })), q = B(k), K = B((function (e, t, r) { return ar(e, t) ? t : e; }));
function z(e) { return e.defaultDecorator ? e.defaultDecorator.enhancer : !1 === e.deep ? k : V; }
var H = { box: function (e, t) { arguments.length > 2 && J("box"); var r = M(t); return new we(e, z(r), r.name, !0, r.equals); }, array: function (e, t) { arguments.length > 2 && J("array"); var r = M(t); return kt(e, z(r), r.name); }, map: function (e, t) { arguments.length > 2 && J("map"); var r = M(t); return new zt(e, z(r), r.name); }, set: function (e, t) { arguments.length > 2 && J("set"); var r = M(t); return new Jt(e, z(r), r.name); }, object: function (e, t, r) { "string" == typeof arguments[1] && J("object"); var n = M(r); if (!1 === n.proxy)
        return rt({}, e, t, n); var o = nt(n), i = rt({}, void 0, void 0, n), a = jt(i); return ot(a, e, t, o), a; }, ref: q, shallow: G, deep: U, struct: K }, W = function (e, t, r) { if ("string" == typeof arguments[1] || "symbol" == typeof arguments[1])
    return U.apply(null, arguments); if (dt(e))
    return e; var o = u(e) ? W.object(e, t, r) : Array.isArray(e) ? W.array(e, t) : f(e) ? W.map(e, t) : p(e) ? W.set(e, t) : e; if (o !== e)
    return o; n(!1); };
function J(e) { n("Expected one or two arguments to observable." + e + ". Did you accidentally try to use observable." + e + " as decorator?"); }
Object.keys(H).forEach((function (e) { return W[e] = H[e]; }));
var X, Y, F = P(!1, (function (e, t, r, n, o) { var i = r.get, a = r.set, s = o[0] || {}; Ft(e).addComputedProp(e, t, S({ get: i, set: a, context: e }, s)); })), $ = F({ equals: x.structural }), Q = function (e, t, r) { if ("string" == typeof t)
    return F.apply(null, arguments); if (null !== e && "object" == typeof e && 1 === arguments.length)
    return F.apply(null, arguments); var n = "object" == typeof t ? t : {}; return n.get = e, n.set = "function" == typeof t ? t : n.set, n.name = n.name || e.name || "", new Oe(n); };
Q.struct = $, (X = exports.IDerivationState || (exports.IDerivationState = {}))[X.NOT_TRACKING = -1] = "NOT_TRACKING", X[X.UP_TO_DATE = 0] = "UP_TO_DATE", X[X.POSSIBLY_STALE = 1] = "POSSIBLY_STALE", X[X.STALE = 2] = "STALE", function (e) { e[e.NONE = 0] = "NONE", e[e.LOG = 1] = "LOG", e[e.BREAK = 2] = "BREAK"; }(Y || (Y = {}));
var Z = function (e) { this.cause = e; };
function ee(e) { return e instanceof Z; }
function te(e) { switch (e.dependenciesState) {
    case exports.IDerivationState.UP_TO_DATE: return !1;
    case exports.IDerivationState.NOT_TRACKING:
    case exports.IDerivationState.STALE: return !0;
    case exports.IDerivationState.POSSIBLY_STALE:
        for (var t = ue(!0), r = ae(), n = e.observing, o = n.length, i = 0; i < o; i++) {
            var a = n[i];
            if (Se(a)) {
                if (Re.disableErrorBoundaries)
                    a.get();
                else
                    try {
                        a.get();
                    }
                    catch (e) {
                        return se(r), ce(t), !0;
                    }
                if (e.dependenciesState === exports.IDerivationState.STALE)
                    return se(r), ce(t), !0;
            }
        }
        return le(e), se(r), ce(t), !1;
} }
function re(e) { var t = e.observers.size > 0; Re.computationDepth > 0 && t && n(!1), Re.allowStateChanges || !t && "strict" !== Re.enforceActions || n(!1); }
function ne(e, t, r) { var n = ue(!0); le(e), e.newObserving = new Array(e.observing.length + 100), e.unboundDepsCount = 0, e.runId = ++Re.runId; var o, i = Re.trackingDerivation; if (Re.trackingDerivation = e, !0 === Re.disableErrorBoundaries)
    o = t.call(r);
else
    try {
        o = t.call(r);
    }
    catch (e) {
        o = new Z(e);
    } return Re.trackingDerivation = i, function (e) { for (var t = e.observing, r = e.observing = e.newObserving, n = exports.IDerivationState.UP_TO_DATE, o = 0, i = e.unboundDepsCount, a = 0; a < i; a++) {
    0 === (s = r[a]).diffValue && (s.diffValue = 1, o !== a && (r[o] = s), o++), s.dependenciesState > n && (n = s.dependenciesState);
} r.length = o, e.newObserving = null, i = t.length; for (; i--;) {
    0 === (s = t[i]).diffValue && Ie(s, e), s.diffValue = 0;
} for (; o--;) {
    var s;
    1 === (s = r[o]).diffValue && (s.diffValue = 0, Te(s, e));
} n !== exports.IDerivationState.UP_TO_DATE && (e.dependenciesState = n, e.onBecomeStale()); }(e), ce(n), o; }
function oe(e) { var t = e.observing; e.observing = []; for (var r = t.length; r--;)
    Ie(t[r], e); e.dependenciesState = exports.IDerivationState.NOT_TRACKING; }
function ie(e) { var t = ae(); try {
    return e();
}
finally {
    se(t);
} }
function ae() { var e = Re.trackingDerivation; return Re.trackingDerivation = null, e; }
function se(e) { Re.trackingDerivation = e; }
function ue(e) { var t = Re.allowStateReads; return Re.allowStateReads = e, t; }
function ce(e) { Re.allowStateReads = e; }
function le(e) { if (e.dependenciesState !== exports.IDerivationState.UP_TO_DATE) {
    e.dependenciesState = exports.IDerivationState.UP_TO_DATE;
    for (var t = e.observing, r = t.length; r--;)
        t[r].lowestObserverState = exports.IDerivationState.UP_TO_DATE;
} }
var fe = 0, pe = 1, he = Object.getOwnPropertyDescriptor((function () { }), "name");
he && he.configurable;
function de(e, t, r) { var n = function () { return ve(e, t, r || this, arguments); }; return n.isMobxAction = !0, n; }
function ve(e, t, r, n) { var o = ye(); try {
    return t.apply(r, n);
}
catch (e) {
    throw o.error = e, e;
}
finally {
    be(o);
} }
function ye(e, t, r) { var n = ae(); Ne(); var o = { prevDerivation: n, prevAllowStateChanges: ge(!0), prevAllowStateReads: ue(!0), notifySpy: !1, startTime: 0, actionId: pe++, parentActionId: fe }; return fe = o.actionId, o; }
function be(e) { fe !== e.actionId && n("invalid action stack. did you forget to finish an action?"), fe = e.parentActionId, void 0 !== e.error && (Re.suppressReactionErrors = !0), me(e.prevAllowStateChanges), ce(e.prevAllowStateReads), Ve(), se(e.prevDerivation), e.notifySpy, Re.suppressReactionErrors = !1; }
function ge(e) { var t = Re.allowStateChanges; return Re.allowStateChanges = e, t; }
function me(e) { Re.allowStateChanges = e; }
var we = function (e) { function t(t, n, o, i, a) { void 0 === o && (o = "ObservableValue@" + r()), void 0 === i && (i = !0), void 0 === a && (a = x.default); var s = e.call(this, o) || this; return s.enhancer = n, s.name = o, s.equals = a, s.hasUnreportedChange = !1, s.value = n(t, void 0, o), s; } return function (e, t) { function r() { this.constructor = e; } O(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r); }(t, e), t.prototype.dehanceValue = function (e) { return void 0 !== this.dehancer ? this.dehancer(e) : e; }, t.prototype.set = function (e) { this.value; if ((e = this.prepareNewValue(e)) !== Re.UNCHANGED) {
    0, this.setNewValue(e);
} }, t.prototype.prepareNewValue = function (e) { if (re(this), Ct(this)) {
    var t = Tt(this, { object: this, type: "update", newValue: e });
    if (!t)
        return Re.UNCHANGED;
    e = t.newValue;
} return e = this.enhancer(e, this.value, this.name), this.equals(this.value, e) ? Re.UNCHANGED : e; }, t.prototype.setNewValue = function (e) { var t = this.value; this.value = e, this.reportChanged(), It(this) && Nt(this, { type: "update", object: this, newValue: e, oldValue: t }); }, t.prototype.get = function () { return this.reportObserved(), this.dehanceValue(this.value); }, t.prototype.intercept = function (e) { return Rt(this, e); }, t.prototype.observe = function (e, t) { return t && e({ object: this, type: "update", newValue: this.value, oldValue: void 0 }), Pt(this, e); }, t.prototype.toJSON = function () { return this.get(); }, t.prototype.toString = function () { return this.name + "[" + this.value + "]"; }, t.prototype.valueOf = function () { return v(this.get()); }, t.prototype[Symbol.toPrimitive] = function () { return this.valueOf(); }, t; }(g), xe = l("ObservableValue", we), Oe = function () { function e(e) { this.dependenciesState = exports.IDerivationState.NOT_TRACKING, this.observing = [], this.newObserving = null, this.isBeingObserved = !1, this.isPendingUnobservation = !1, this.observers = new Set, this.diffValue = 0, this.runId = 0, this.lastAccessedBy = 0, this.lowestObserverState = exports.IDerivationState.UP_TO_DATE, this.unboundDepsCount = 0, this.__mapid = "#" + r(), this.value = new Z(null), this.isComputing = !1, this.isRunningSetter = !1, this.isTracing = Y.NONE, o(e.get, "missing option for computed: get"), this.derivation = e.get, this.name = e.name || "ComputedValue@" + r(), e.set && (this.setter = de(this.name + "-setter", e.set)), this.equals = e.equals || (e.compareStructural || e.struct ? x.structural : x.default), this.scope = e.context, this.requiresReaction = !!e.requiresReaction, this.keepAlive = !!e.keepAlive; } return e.prototype.onBecomeStale = function () { !function (e) { if (e.lowestObserverState !== exports.IDerivationState.UP_TO_DATE)
    return; e.lowestObserverState = exports.IDerivationState.POSSIBLY_STALE, e.observers.forEach((function (t) { t.dependenciesState === exports.IDerivationState.UP_TO_DATE && (t.dependenciesState = exports.IDerivationState.POSSIBLY_STALE, t.isTracing !== Y.NONE && Be(t, e), t.onBecomeStale()); })); }(this); }, e.prototype.onBecomeObserved = function () { this.onBecomeObservedListeners && this.onBecomeObservedListeners.forEach((function (e) { return e(); })); }, e.prototype.onBecomeUnobserved = function () { this.onBecomeUnobservedListeners && this.onBecomeUnobservedListeners.forEach((function (e) { return e(); })); }, e.prototype.get = function () { this.isComputing && n("Cycle detected in computation " + this.name + ": " + this.derivation), 0 !== Re.inBatch || 0 !== this.observers.size || this.keepAlive ? (ke(this), te(this) && this.trackAndCompute() && function (e) { if (e.lowestObserverState === exports.IDerivationState.STALE)
    return; e.lowestObserverState = exports.IDerivationState.STALE, e.observers.forEach((function (t) { t.dependenciesState === exports.IDerivationState.POSSIBLY_STALE ? t.dependenciesState = exports.IDerivationState.STALE : t.dependenciesState === exports.IDerivationState.UP_TO_DATE && (e.lowestObserverState = exports.IDerivationState.UP_TO_DATE); })); }(this)) : te(this) && (this.warnAboutUntrackedRead(), Ne(), this.value = this.computeValue(!1), Ve()); var e = this.value; if (ee(e))
    throw e.cause; return e; }, e.prototype.peek = function () { var e = this.computeValue(!1); if (ee(e))
    throw e.cause; return e; }, e.prototype.set = function (e) { if (this.setter) {
    o(!this.isRunningSetter, "The setter of computed value '" + this.name + "' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?"), this.isRunningSetter = !0;
    try {
        this.setter.call(this.scope, e);
    }
    finally {
        this.isRunningSetter = !1;
    }
}
else
    o(!1, !1); }, e.prototype.trackAndCompute = function () { var e = this.value, t = this.dependenciesState === exports.IDerivationState.NOT_TRACKING, r = this.computeValue(!0), n = t || ee(e) || ee(r) || !this.equals(e, r); return n && (this.value = r), n; }, e.prototype.computeValue = function (e) { var t; if (this.isComputing = !0, Re.computationDepth++, e)
    t = ne(this, this.derivation, this.scope);
else if (!0 === Re.disableErrorBoundaries)
    t = this.derivation.call(this.scope);
else
    try {
        t = this.derivation.call(this.scope);
    }
    catch (e) {
        t = new Z(e);
    } return Re.computationDepth--, this.isComputing = !1, t; }, e.prototype.suspend = function () { this.keepAlive || (oe(this), this.value = void 0); }, e.prototype.observe = function (e, t) { var r = this, n = !0, o = void 0; return Fe((function () { var i = r.get(); if (!n || t) {
    var a = ae();
    e({ type: "update", object: r, newValue: i, oldValue: o }), se(a);
} n = !1, o = i; })); }, e.prototype.warnAboutUntrackedRead = function () { }, e.prototype.toJSON = function () { return this.get(); }, e.prototype.toString = function () { return this.name + "[" + this.derivation.toString() + "]"; }, e.prototype.valueOf = function () { return v(this.get()); }, e.prototype[Symbol.toPrimitive] = function () { return this.valueOf(); }, e; }(), Se = l("ComputedValue", Oe), Ae = ["mobxGuid", "spyListeners", "enforceActions", "computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "allowStateReads", "disableErrorBoundaries", "runId", "UNCHANGED"], _e = function () { this.version = 5, this.UNCHANGED = {}, this.trackingDerivation = null, this.computationDepth = 0, this.runId = 0, this.mobxGuid = 0, this.inBatch = 0, this.pendingUnobservations = [], this.pendingReactions = [], this.isRunningReactions = !1, this.allowStateChanges = !0, this.allowStateReads = !0, this.enforceActions = !1, this.spyListeners = [], this.globalReactionErrorHandlers = [], this.computedRequiresReaction = !1, this.reactionRequiresObservable = !1, this.observableRequiresReaction = !1, this.computedConfigurable = !1, this.disableErrorBoundaries = !1, this.suppressReactionErrors = !1; }, Ee = {};
function De() { return "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : Ee; }
var je = !0, Ce = !1, Re = function () { var e = De(); return e.__mobxInstanceCount > 0 && !e.__mobxGlobals && (je = !1), e.__mobxGlobals && e.__mobxGlobals.version !== (new _e).version && (je = !1), je ? e.__mobxGlobals ? (e.__mobxInstanceCount += 1, e.__mobxGlobals.UNCHANGED || (e.__mobxGlobals.UNCHANGED = {}), e.__mobxGlobals) : (e.__mobxInstanceCount = 1, e.__mobxGlobals = new _e) : (setTimeout((function () { Ce || n("There are multiple, different versions of MobX active. Make sure MobX is loaded only once or use `configure({ isolateGlobalState: true })`"); }), 1), new _e); }();
function Te(e, t) { e.observers.add(t), e.lowestObserverState > t.dependenciesState && (e.lowestObserverState = t.dependenciesState); }
function Ie(e, t) { e.observers.delete(t), 0 === e.observers.size && Pe(e); }
function Pe(e) { !1 === e.isPendingUnobservation && (e.isPendingUnobservation = !0, Re.pendingUnobservations.push(e)); }
function Ne() { Re.inBatch++; }
function Ve() { if (0 == --Re.inBatch) {
    Ue();
    for (var e = Re.pendingUnobservations, t = 0; t < e.length; t++) {
        var r = e[t];
        r.isPendingUnobservation = !1, 0 === r.observers.size && (r.isBeingObserved && (r.isBeingObserved = !1, r.onBecomeUnobserved()), r instanceof Oe && r.suspend());
    }
    Re.pendingUnobservations = [];
} }
function ke(e) { var t = Re.trackingDerivation; return null !== t ? (t.runId !== e.lastAccessedBy && (e.lastAccessedBy = t.runId, t.newObserving[t.unboundDepsCount++] = e, e.isBeingObserved || (e.isBeingObserved = !0, e.onBecomeObserved())), !0) : (0 === e.observers.size && Re.inBatch > 0 && Pe(e), !1); }
function Be(e, t) { if (console.log("[mobx.trace] '" + e.name + "' is invalidated due to a change in: '" + t.name + "'"), e.isTracing === Y.BREAK) {
    var r = [];
    !function e(t, r, n) { if (r.length >= 1e3)
        return void r.push("(and many more)"); r.push("" + new Array(n).join("\t") + t.name), t.dependencies && t.dependencies.forEach((function (t) { return e(t, r, n + 1); })); }(it(e), r, 1), new Function("debugger;\n/*\nTracing '" + e.name + "'\n\nYou are entering this break point because derivation '" + e.name + "' is being traced and '" + t.name + "' is now forcing it to update.\nJust follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update\nThe stackframe you are looking for is at least ~6-8 stack-frames up.\n\n" + (e instanceof Oe ? e.derivation.toString().replace(/[*]\//g, "/") : "") + "\n\nThe dependencies for this derivation are:\n\n" + r.join("\n") + "\n*/\n    ")();
} }
var Le = function () { function e(e, t, n, o) { void 0 === e && (e = "Reaction@" + r()), void 0 === o && (o = !1), this.name = e, this.onInvalidate = t, this.errorHandler = n, this.requiresObservable = o, this.observing = [], this.newObserving = [], this.dependenciesState = exports.IDerivationState.NOT_TRACKING, this.diffValue = 0, this.runId = 0, this.unboundDepsCount = 0, this.__mapid = "#" + r(), this.isDisposed = !1, this._isScheduled = !1, this._isTrackPending = !1, this._isRunning = !1, this.isTracing = Y.NONE; } return e.prototype.onBecomeStale = function () { this.schedule(); }, e.prototype.schedule = function () { this._isScheduled || (this._isScheduled = !0, Re.pendingReactions.push(this), Ue()); }, e.prototype.isScheduled = function () { return this._isScheduled; }, e.prototype.runReaction = function () { if (!this.isDisposed) {
    if (Ne(), this._isScheduled = !1, te(this)) {
        this._isTrackPending = !0;
        try {
            this.onInvalidate(), this._isTrackPending;
        }
        catch (e) {
            this.reportExceptionInDerivation(e);
        }
    }
    Ve();
} }, e.prototype.track = function (e) { if (!this.isDisposed) {
    Ne(), this._isRunning = !0;
    var t = ne(this, e, void 0);
    this._isRunning = !1, this._isTrackPending = !1, this.isDisposed && oe(this), ee(t) && this.reportExceptionInDerivation(t.cause), Ve();
} }, e.prototype.reportExceptionInDerivation = function (e) { var t = this; if (this.errorHandler)
    this.errorHandler(e, this);
else {
    if (Re.disableErrorBoundaries)
        throw e;
    var r = "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this + "'";
    Re.suppressReactionErrors ? console.warn("[mobx] (error in reaction '" + this.name + "' suppressed, fix error of causing action below)") : console.error(r, e), Re.globalReactionErrorHandlers.forEach((function (r) { return r(e, t); }));
} }, e.prototype.dispose = function () { this.isDisposed || (this.isDisposed = !0, this._isRunning || (Ne(), oe(this), Ve())); }, e.prototype.getDisposer = function () { var e = this.dispose.bind(this); return e[b] = this, e; }, e.prototype.toString = function () { return "Reaction[" + this.name + "]"; }, e.prototype.trace = function (e) { void 0 === e && (e = !1), wt(this, e); }, e; }();
var Me = function (e) { return e(); };
function Ue() { Re.inBatch > 0 || Re.isRunningReactions || Me(Ge); }
function Ge() { Re.isRunningReactions = !0; for (var e = Re.pendingReactions, t = 0; e.length > 0;) {
    100 == ++t && (console.error("Reaction doesn't converge to a stable state after 100 iterations. Probably there is a cycle in the reactive function: " + e[0]), e.splice(0));
    for (var r = e.splice(0), n = 0, o = r.length; n < o; n++)
        r[n].runReaction();
} Re.isRunningReactions = !1; }
var qe = l("Reaction", Le);
function Ke(e) { var t = Me; Me = function (r) { return e((function () { return t(r); })); }; }
function ze(e) { return console.warn("[mobx.spy] Is a no-op in production builds"), function () { }; }
function He() { n(!1); }
function We(e) { return function (t, r, n) { if (n) {
    if (n.value)
        return { value: de(e, n.value), enumerable: !1, configurable: !0, writable: !0 };
    var o = n.initializer;
    return { enumerable: !1, configurable: !0, writable: !0, initializer: function () { return de(e, o.call(this)); } };
} return Je(e).apply(this, arguments); }; }
function Je(e) { return function (t, r, n) { Object.defineProperty(t, r, { configurable: !0, enumerable: !1, get: function () { }, set: function (t) { c(this, r, Xe(e, t)); } }); }; }
var Xe = function (e, t, r, n) { return 1 === arguments.length && "function" == typeof e ? de(e.name || "<unnamed action>", e) : 2 === arguments.length && "function" == typeof t ? de(e, t) : 1 === arguments.length && "string" == typeof e ? We(e) : !0 !== n ? We(t).apply(null, arguments) : void c(e, t, de(e.name || t, r.value, this)); };
function Ye(e, t, r) { c(e, t, de(t, r.bind(e))); }
function Fe(e, n) { void 0 === n && (n = t); var o, i = n && n.name || e.name || "Autorun@" + r(); if (!n.scheduler && !n.delay)
    o = new Le(i, (function () { this.track(u); }), n.onError, n.requiresObservable);
else {
    var a = Qe(n), s = !1;
    o = new Le(i, (function () { s || (s = !0, a((function () { s = !1, o.isDisposed || o.track(u); }))); }), n.onError, n.requiresObservable);
} function u() { e(o); } return o.schedule(), o.getDisposer(); }
Xe.bound = function (e, t, r, n) { return !0 === n ? (Ye(e, t, r.value), null) : r ? { configurable: !0, enumerable: !1, get: function () { return Ye(this, t, r.value || r.initializer.call(this)), this[t]; }, set: He } : { enumerable: !1, configurable: !0, set: function (e) { Ye(this, t, e); }, get: function () { } }; };
var $e = function (e) { return e(); };
function Qe(e) { return e.scheduler ? e.scheduler : e.delay ? function (t) { return setTimeout(t, e.delay); } : $e; }
function Ze(e, t, r) { return tt("onBecomeObserved", e, t, r); }
function et(e, t, r) { return tt("onBecomeUnobserved", e, t, r); }
function tt(e, t, r, o) { var i = "function" == typeof o ? rr(t, r) : rr(t), a = "function" == typeof o ? o : r, s = e + "Listeners"; return i[s] ? i[s].add(a) : i[s] = new Set([a]), "function" != typeof i[e] ? n(!1) : function () { var e = i[s]; e && (e.delete(a), 0 === e.size && delete i[s]); }; }
function rt(e, t, r, n) { var o = nt(n = M(n)); return I(e), Ft(e, n.name, o.enhancer), t && ot(e, t, r, o), e; }
function nt(e) { return e.defaultDecorator || (!1 === e.deep ? q : U); }
function ot(e, t, r, n) { var o, i; Ne(); try {
    var a = y(t);
    try {
        for (var s = A(a), u = s.next(); !u.done; u = s.next()) {
            var c = u.value, l = Object.getOwnPropertyDescriptor(t, c);
            0;
            var f = r && c in r ? r[c] : l.get ? F : n;
            0;
            var p = f(e, c, l, !0);
            p && Object.defineProperty(e, c, p);
        }
    }
    catch (e) {
        o = { error: e };
    }
    finally {
        try {
            u && !u.done && (i = s.return) && i.call(s);
        }
        finally {
            if (o)
                throw o.error;
        }
    }
}
finally {
    Ve();
} }
function it(e, t) { return at(rr(e, t)); }
function at(e) { var t, r, n = { name: e.name }; return e.observing && e.observing.length > 0 && (n.dependencies = (t = e.observing, r = [], t.forEach((function (e) { -1 === r.indexOf(e) && r.push(e); })), r).map(at)), n; }
function st(e) { var t = { name: e.name }; return function (e) { return e.observers && e.observers.size > 0; }(e) && (t.observers = Array.from(function (e) { return e.observers; }(e)).map(st)), t; }
var ut = 0;
function ct() { this.message = "FLOW_CANCELLED"; }
function lt(e) { "function" == typeof e.cancel && e.cancel(); }
function ft(e, t) { if (null == e)
    return !1; if (void 0 !== t) {
    if (!1 === tr(e))
        return !1;
    if (!e[b].values.has(t))
        return !1;
    var r = rr(e, t);
    return Se(r);
} return Se(e); }
function pt(e) { return arguments.length > 1 ? n(!1) : ft(e); }
function ht(e, t) { return null != e && (void 0 !== t ? !!tr(e) && e[b].values.has(t) : tr(e) || !!e[b] || m(e) || qe(e) || Se(e)); }
function dt(e) { return 1 !== arguments.length && n(!1), ht(e); }
function vt(e) { return tr(e) ? e[b].getKeys() : Ht(e) ? Array.from(e.keys()) : Xt(e) ? Array.from(e.keys()) : Gt(e) ? e.map((function (e, t) { return t; })) : n(!1); }
function yt(e, t, r) { if (2 !== arguments.length || Xt(e))
    if (tr(e)) {
        var i = e[b], a = i.values.get(t);
        a ? i.write(t, r) : i.addObservableProp(t, r, i.defaultEnhancer);
    }
    else if (Ht(e))
        e.set(t, r);
    else if (Xt(e))
        e.add(t);
    else {
        if (!Gt(e))
            return n(!1);
        "number" != typeof t && (t = parseInt(t, 10)), o(t >= 0, "Not a valid index: '" + t + "'"), Ne(), t >= e.length && (e.length = t + 1), e[t] = r, Ve();
    }
else {
    Ne();
    var s = t;
    try {
        for (var u in s)
            yt(e, u, s[u]);
    }
    finally {
        Ve();
    }
} }
function bt(e, t) { return tr(e) ? nr(e).has(t) : Ht(e) ? e.has(t) : Xt(e) ? e.has(t) : Gt(e) ? t >= 0 && t < e.length : n(!1); }
ct.prototype = Object.create(Error.prototype);
var gt = { detectCycles: !0, exportMapsAsObjects: !0, recurseEverything: !1 };
function mt(e, t, r, n) { return n.detectCycles && e.set(t, r), r; }
function wt() { for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t]; var r = !1; "boolean" == typeof e[e.length - 1] && (r = e.pop()); var o = xt(e); if (!o)
    return n(!1); o.isTracing === Y.NONE && console.log("[mobx.trace] '" + o.name + "' tracing enabled"), o.isTracing = r ? Y.BREAK : Y.LOG; }
function xt(e) { switch (e.length) {
    case 0: return Re.trackingDerivation;
    case 1: return rr(e[0]);
    case 2: return rr(e[0], e[1]);
} }
function Ot(e, t) { void 0 === t && (t = void 0), Ne(); try {
    return e.apply(t);
}
finally {
    Ve();
} }
function St(e, t, n) { var o; "number" == typeof n.timeout && (o = setTimeout((function () { if (!a[b].isDisposed) {
    a();
    var e = new Error("WHEN_TIMEOUT");
    if (!n.onError)
        throw e;
    n.onError(e);
} }), n.timeout)), n.name = n.name || "When@" + r(); var i = de(n.name + "-effect", t), a = Fe((function (t) { e() && (t.dispose(), o && clearTimeout(o), i()); }), n); return a; }
function At(e, t) { var r, n = new Promise((function (n, o) { var i = St(e, n, S(S({}, t), { onError: o })); r = function () { i(), o("WHEN_CANCELLED"); }; })); return n.cancel = r, n; }
function _t(e) { return e[b]; }
function Et(e) { return "string" == typeof e || "number" == typeof e || "symbol" == typeof e; }
var Dt = { has: function (e, t) { if (t === b || "constructor" === t || t === D)
        return !0; var r = _t(e); return Et(t) ? r.has(t) : t in e; }, get: function (e, t) { if (t === b || "constructor" === t || t === D)
        return e[t]; var r = _t(e), n = r.values.get(t); if (n instanceof g) {
        var o = n.get();
        return void 0 === o && r.has(t), o;
    } return Et(t) && r.has(t), e[t]; }, set: function (e, t, r) { return !!Et(t) && (yt(e, t, r), !0); }, deleteProperty: function (e, t) { return !!Et(t) && (_t(e).remove(t), !0); }, ownKeys: function (e) { return _t(e).keysAtom.reportObserved(), Reflect.ownKeys(e); }, preventExtensions: function (e) { return n("Dynamic observable objects cannot be frozen"), !1; } };
function jt(e) { var t = new Proxy(e, Dt); return e[b].proxy = t, t; }
function Ct(e) { return void 0 !== e.interceptors && e.interceptors.length > 0; }
function Rt(e, t) { var r = e.interceptors || (e.interceptors = []); return r.push(t), i((function () { var e = r.indexOf(t); -1 !== e && r.splice(e, 1); })); }
function Tt(e, t) { var r = ae(); try {
    for (var n = E(e.interceptors || []), i = 0, a = n.length; i < a && (o(!(t = n[i](t)) || t.type, "Intercept handlers should return nothing or a change object"), t); i++)
        ;
    return t;
}
finally {
    se(r);
} }
function It(e) { return void 0 !== e.changeListeners && e.changeListeners.length > 0; }
function Pt(e, t) { var r = e.changeListeners || (e.changeListeners = []); return r.push(t), i((function () { var e = r.indexOf(t); -1 !== e && r.splice(e, 1); })); }
function Nt(e, t) { var r = ae(), n = e.changeListeners; if (n) {
    for (var o = 0, i = (n = n.slice()).length; o < i; o++)
        n[o](t);
    se(r);
} }
var Vt = { get: function (e, t) { return t === b ? e[b] : "length" === t ? e[b].getArrayLength() : "number" == typeof t ? Lt.get.call(e, t) : "string" != typeof t || isNaN(t) ? Lt.hasOwnProperty(t) ? Lt[t] : e[t] : Lt.get.call(e, parseInt(t)); }, set: function (e, t, r) { return "length" === t && e[b].setArrayLength(r), "number" == typeof t && Lt.set.call(e, t, r), "symbol" == typeof t || isNaN(t) ? e[t] = r : Lt.set.call(e, parseInt(t), r), !0; }, preventExtensions: function (e) { return n("Observable arrays cannot be frozen"), !1; } };
function kt(e, t, n, o) { void 0 === n && (n = "ObservableArray@" + r()), void 0 === o && (o = !1); var i, a, s, u = new Bt(n, t, o); i = u.values, a = b, s = u, Object.defineProperty(i, a, { enumerable: !1, writable: !1, configurable: !0, value: s }); var c = new Proxy(u.values, Vt); if (u.proxy = c, e && e.length) {
    var l = ge(!0);
    u.spliceWithArray(0, 0, e), me(l);
} return c; }
var Bt = function () { function t(e, t, n) { this.owned = n, this.values = [], this.proxy = void 0, this.lastKnownLength = 0, this.atom = new g(e || "ObservableArray@" + r()), this.enhancer = function (r, n) { return t(r, n, e + "[..]"); }; } return t.prototype.dehanceValue = function (e) { return void 0 !== this.dehancer ? this.dehancer(e) : e; }, t.prototype.dehanceValues = function (e) { return void 0 !== this.dehancer && e.length > 0 ? e.map(this.dehancer) : e; }, t.prototype.intercept = function (e) { return Rt(this, e); }, t.prototype.observe = function (e, t) { return void 0 === t && (t = !1), t && e({ object: this.proxy, type: "splice", index: 0, added: this.values.slice(), addedCount: this.values.length, removed: [], removedCount: 0 }), Pt(this, e); }, t.prototype.getArrayLength = function () { return this.atom.reportObserved(), this.values.length; }, t.prototype.setArrayLength = function (e) { if ("number" != typeof e || e < 0)
    throw new Error("[mobx.array] Out of range: " + e); var t = this.values.length; if (e !== t)
    if (e > t) {
        for (var r = new Array(e - t), n = 0; n < e - t; n++)
            r[n] = void 0;
        this.spliceWithArray(t, 0, r);
    }
    else
        this.spliceWithArray(e, t - e); }, t.prototype.updateArrayLength = function (e, t) { if (e !== this.lastKnownLength)
    throw new Error("[mobx] Modification exception: the internal structure of an observable array was changed."); this.lastKnownLength += t; }, t.prototype.spliceWithArray = function (t, r, n) { var o = this; re(this.atom); var i = this.values.length; if (void 0 === t ? t = 0 : t > i ? t = i : t < 0 && (t = Math.max(0, i + t)), r = 1 === arguments.length ? i - t : null == r ? 0 : Math.max(0, Math.min(r, i - t)), void 0 === n && (n = e), Ct(this)) {
    var a = Tt(this, { object: this.proxy, type: "splice", index: t, removedCount: r, added: n });
    if (!a)
        return e;
    r = a.removedCount, n = a.added;
} n = 0 === n.length ? n : n.map((function (e) { return o.enhancer(e, void 0); })); var s = this.spliceItemsIntoValues(t, r, n); return 0 === r && 0 === n.length || this.notifyArraySplice(t, n, s), this.dehanceValues(s); }, t.prototype.spliceItemsIntoValues = function (e, t, r) { var n; if (r.length < 1e4)
    return (n = this.values).splice.apply(n, E([e, t], r)); var o = this.values.slice(e, e + t); return this.values = this.values.slice(0, e).concat(r, this.values.slice(e + t)), o; }, t.prototype.notifyArrayChildUpdate = function (e, t, r) { var n = !this.owned && !1, o = It(this), i = o || n ? { object: this.proxy, type: "update", index: e, newValue: t, oldValue: r } : null; this.atom.reportChanged(), o && Nt(this, i); }, t.prototype.notifyArraySplice = function (e, t, r) { var n = !this.owned && !1, o = It(this), i = o || n ? { object: this.proxy, type: "splice", index: e, removed: r, added: t, removedCount: r.length, addedCount: t.length } : null; this.atom.reportChanged(), o && Nt(this, i); }, t; }(), Lt = { intercept: function (e) { return this[b].intercept(e); }, observe: function (e, t) { return void 0 === t && (t = !1), this[b].observe(e, t); }, clear: function () { return this.splice(0); }, replace: function (e) { var t = this[b]; return t.spliceWithArray(0, t.values.length, e); }, toJS: function () { return this.slice(); }, toJSON: function () { return this.toJS(); }, splice: function (e, t) { for (var r = [], n = 2; n < arguments.length; n++)
        r[n - 2] = arguments[n]; var o = this[b]; switch (arguments.length) {
        case 0: return [];
        case 1: return o.spliceWithArray(e);
        case 2: return o.spliceWithArray(e, t);
    } return o.spliceWithArray(e, t, r); }, spliceWithArray: function (e, t, r) { return this[b].spliceWithArray(e, t, r); }, push: function () { for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t]; var r = this[b]; return r.spliceWithArray(r.values.length, 0, e), r.values.length; }, pop: function () { return this.splice(Math.max(this[b].values.length - 1, 0), 1)[0]; }, shift: function () { return this.splice(0, 1)[0]; }, unshift: function () { for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t]; var r = this[b]; return r.spliceWithArray(0, 0, e), r.values.length; }, reverse: function () { var e = this.slice(); return e.reverse.apply(e, arguments); }, sort: function (e) { var t = this.slice(); return t.sort.apply(t, arguments); }, remove: function (e) { var t = this[b], r = t.dehanceValues(t.values).indexOf(e); return r > -1 && (this.splice(r, 1), !0); }, get: function (e) { var t = this[b]; if (t) {
        if (e < t.values.length)
            return t.atom.reportObserved(), t.dehanceValue(t.values[e]);
        console.warn("[mobx.array] Attempt to read an array index (" + e + ") that is out of bounds (" + t.values.length + "). Please check length first. Out of bound indices will not be tracked by MobX");
    } }, set: function (e, t) { var r = this[b], n = r.values; if (e < n.length) {
        re(r.atom);
        var o = n[e];
        if (Ct(r)) {
            var i = Tt(r, { type: "update", object: r.proxy, index: e, newValue: t });
            if (!i)
                return;
            t = i.newValue;
        }
        (t = r.enhancer(t, o)) !== o && (n[e] = t, r.notifyArrayChildUpdate(e, t, o));
    }
    else {
        if (e !== n.length)
            throw new Error("[mobx.array] Index out of bounds, " + e + " is larger than " + n.length);
        r.spliceWithArray(e, 0, [t]);
    } } };
["concat", "flat", "includes", "indexOf", "join", "lastIndexOf", "slice", "toString", "toLocaleString"].forEach((function (e) { "function" == typeof Array.prototype[e] && (Lt[e] = function () { var t = this[b]; t.atom.reportObserved(); var r = t.dehanceValues(t.values); return r[e].apply(r, arguments); }); })), ["every", "filter", "find", "findIndex", "flatMap", "forEach", "map", "some"].forEach((function (e) { "function" == typeof Array.prototype[e] && (Lt[e] = function (t, r) { var n = this, o = this[b]; return o.atom.reportObserved(), o.dehanceValues(o.values)[e]((function (e, o) { return t.call(r, e, o, n); }), r); }); })), ["reduce", "reduceRight"].forEach((function (e) { Lt[e] = function (t, r) { var n = this, o = this[b]; return o.atom.reportObserved(), o.values[e]((function (e, r, i) { return r = o.dehanceValue(r), t(e, r, i, n); }), r); }; }));
var Mt, Ut = l("ObservableArrayAdministration", Bt);
function Gt(e) { return s(e) && Ut(e[b]); }
var qt, Kt = {}, zt = function () { function e(e, t, n) { if (void 0 === t && (t = V), void 0 === n && (n = "ObservableMap@" + r()), this.enhancer = t, this.name = n, this[Mt] = Kt, this._keysAtom = w(this.name + ".keys()"), this[Symbol.toStringTag] = "Map", "function" != typeof Map)
    throw new Error("mobx.map requires Map polyfill for the current browser. Check babel-polyfill or core-js/es6/map.js"); this._data = new Map, this._hasMap = new Map, this.merge(e); } return e.prototype._has = function (e) { return this._data.has(e); }, e.prototype.has = function (e) { var t = this; if (!Re.trackingDerivation)
    return this._has(e); var r = this._hasMap.get(e); if (!r) {
    var n = r = new we(this._has(e), k, this.name + "." + d(e) + "?", !1);
    this._hasMap.set(e, n), et(n, (function () { return t._hasMap.delete(e); }));
} return r.get(); }, e.prototype.set = function (e, t) { var r = this._has(e); if (Ct(this)) {
    var n = Tt(this, { type: r ? "update" : "add", object: this, newValue: t, name: e });
    if (!n)
        return this;
    t = n.newValue;
} return r ? this._updateValue(e, t) : this._addValue(e, t), this; }, e.prototype.delete = function (e) { var t = this; if ((re(this._keysAtom), Ct(this)) && !(n = Tt(this, { type: "delete", object: this, name: e })))
    return !1; if (this._has(e)) {
    var r = It(this), n = r ? { type: "delete", object: this, oldValue: this._data.get(e).value, name: e } : null;
    return Ot((function () { t._keysAtom.reportChanged(), t._updateHasMapEntry(e, !1), t._data.get(e).setNewValue(void 0), t._data.delete(e); })), r && Nt(this, n), !0;
} return !1; }, e.prototype._updateHasMapEntry = function (e, t) { var r = this._hasMap.get(e); r && r.setNewValue(t); }, e.prototype._updateValue = function (e, t) { var r = this._data.get(e); if ((t = r.prepareNewValue(t)) !== Re.UNCHANGED) {
    var n = It(this), o = n ? { type: "update", object: this, oldValue: r.value, name: e, newValue: t } : null;
    0, r.setNewValue(t), n && Nt(this, o);
} }, e.prototype._addValue = function (e, t) { var r = this; re(this._keysAtom), Ot((function () { var n = new we(t, r.enhancer, r.name + "." + d(e), !1); r._data.set(e, n), t = n.value, r._updateHasMapEntry(e, !0), r._keysAtom.reportChanged(); })); var n = It(this); n && Nt(this, n ? { type: "add", object: this, name: e, newValue: t } : null); }, e.prototype.get = function (e) { return this.has(e) ? this.dehanceValue(this._data.get(e).get()) : this.dehanceValue(void 0); }, e.prototype.dehanceValue = function (e) { return void 0 !== this.dehancer ? this.dehancer(e) : e; }, e.prototype.keys = function () { return this._keysAtom.reportObserved(), this._data.keys(); }, e.prototype.values = function () { var e = this, t = this.keys(); return cr({ next: function () { var r = t.next(), n = r.done, o = r.value; return { done: n, value: n ? void 0 : e.get(o) }; } }); }, e.prototype.entries = function () { var e = this, t = this.keys(); return cr({ next: function () { var r = t.next(), n = r.done, o = r.value; return { done: n, value: n ? void 0 : [o, e.get(o)] }; } }); }, e.prototype[(Mt = b, Symbol.iterator)] = function () { return this.entries(); }, e.prototype.forEach = function (e, t) { var r, n; try {
    for (var o = A(this), i = o.next(); !i.done; i = o.next()) {
        var a = _(i.value, 2), s = a[0], u = a[1];
        e.call(t, u, s, this);
    }
}
catch (e) {
    r = { error: e };
}
finally {
    try {
        i && !i.done && (n = o.return) && n.call(o);
    }
    finally {
        if (r)
            throw r.error;
    }
} }, e.prototype.merge = function (e) { var t = this; return Ht(e) && (e = e.toJS()), Ot((function () { var r = ge(!0); try {
    u(e) ? h(e).forEach((function (r) { return t.set(r, e[r]); })) : Array.isArray(e) ? e.forEach((function (e) { var r = _(e, 2), n = r[0], o = r[1]; return t.set(n, o); })) : f(e) ? (e.constructor !== Map && n("Cannot initialize from classes that inherit from Map: " + e.constructor.name), e.forEach((function (e, r) { return t.set(r, e); }))) : null != e && n("Cannot initialize map from " + e);
}
finally {
    me(r);
} })), this; }, e.prototype.clear = function () { var e = this; Ot((function () { ie((function () { var t, r; try {
    for (var n = A(e.keys()), o = n.next(); !o.done; o = n.next()) {
        var i = o.value;
        e.delete(i);
    }
}
catch (e) {
    t = { error: e };
}
finally {
    try {
        o && !o.done && (r = n.return) && r.call(n);
    }
    finally {
        if (t)
            throw t.error;
    }
} })); })); }, e.prototype.replace = function (e) { var t = this; return Ot((function () { var r, o, i, a, s = function (e) { if (f(e) || Ht(e))
    return e; if (Array.isArray(e))
    return new Map(e); if (u(e)) {
    var t = new Map;
    for (var r in e)
        t.set(r, e[r]);
    return t;
} return n("Cannot convert to map from '" + e + "'"); }(e), c = new Map, l = !1; try {
    for (var p = A(t._data.keys()), h = p.next(); !h.done; h = p.next()) {
        var d = h.value;
        if (!s.has(d))
            if (t.delete(d))
                l = !0;
            else {
                var v = t._data.get(d);
                c.set(d, v);
            }
    }
}
catch (e) {
    r = { error: e };
}
finally {
    try {
        h && !h.done && (o = p.return) && o.call(p);
    }
    finally {
        if (r)
            throw r.error;
    }
} try {
    for (var y = A(s.entries()), b = y.next(); !b.done; b = y.next()) {
        var g = _(b.value, 2), m = (d = g[0], v = g[1], t._data.has(d));
        if (t.set(d, v), t._data.has(d)) {
            var w = t._data.get(d);
            c.set(d, w), m || (l = !0);
        }
    }
}
catch (e) {
    i = { error: e };
}
finally {
    try {
        b && !b.done && (a = y.return) && a.call(y);
    }
    finally {
        if (i)
            throw i.error;
    }
} if (!l)
    if (t._data.size !== c.size)
        t._keysAtom.reportChanged();
    else
        for (var x = t._data.keys(), O = c.keys(), S = x.next(), E = O.next(); !S.done;) {
            if (S.value !== E.value) {
                t._keysAtom.reportChanged();
                break;
            }
            S = x.next(), E = O.next();
        } t._data = c; })), this; }, Object.defineProperty(e.prototype, "size", { get: function () { return this._keysAtom.reportObserved(), this._data.size; }, enumerable: !0, configurable: !0 }), e.prototype.toPOJO = function () { var e, t, r = {}; try {
    for (var n = A(this), o = n.next(); !o.done; o = n.next()) {
        var i = _(o.value, 2), a = i[0], s = i[1];
        r["symbol" == typeof a ? a : d(a)] = s;
    }
}
catch (t) {
    e = { error: t };
}
finally {
    try {
        o && !o.done && (t = n.return) && t.call(n);
    }
    finally {
        if (e)
            throw e.error;
    }
} return r; }, e.prototype.toJS = function () { return new Map(this); }, e.prototype.toJSON = function () { return this.toPOJO(); }, e.prototype.toString = function () { var e = this; return this.name + "[{ " + Array.from(this.keys()).map((function (t) { return d(t) + ": " + e.get(t); })).join(", ") + " }]"; }, e.prototype.observe = function (e, t) { return Pt(this, e); }, e.prototype.intercept = function (e) { return Rt(this, e); }, e; }(), Ht = l("ObservableMap", zt), Wt = {}, Jt = function () { function e(e, t, n) { if (void 0 === t && (t = V), void 0 === n && (n = "ObservableSet@" + r()), this.name = n, this[qt] = Wt, this._data = new Set, this._atom = w(this.name), this[Symbol.toStringTag] = "Set", "function" != typeof Set)
    throw new Error("mobx.set requires Set polyfill for the current browser. Check babel-polyfill or core-js/es6/set.js"); this.enhancer = function (e, r) { return t(e, r, n); }, e && this.replace(e); } return e.prototype.dehanceValue = function (e) { return void 0 !== this.dehancer ? this.dehancer(e) : e; }, e.prototype.clear = function () { var e = this; Ot((function () { ie((function () { var t, r; try {
    for (var n = A(e._data.values()), o = n.next(); !o.done; o = n.next()) {
        var i = o.value;
        e.delete(i);
    }
}
catch (e) {
    t = { error: e };
}
finally {
    try {
        o && !o.done && (r = n.return) && r.call(n);
    }
    finally {
        if (t)
            throw t.error;
    }
} })); })); }, e.prototype.forEach = function (e, t) { var r, n; try {
    for (var o = A(this), i = o.next(); !i.done; i = o.next()) {
        var a = i.value;
        e.call(t, a, a, this);
    }
}
catch (e) {
    r = { error: e };
}
finally {
    try {
        i && !i.done && (n = o.return) && n.call(o);
    }
    finally {
        if (r)
            throw r.error;
    }
} }, Object.defineProperty(e.prototype, "size", { get: function () { return this._atom.reportObserved(), this._data.size; }, enumerable: !0, configurable: !0 }), e.prototype.add = function (e) { var t = this; if ((re(this._atom), Ct(this)) && !(n = Tt(this, { type: "add", object: this, newValue: e })))
    return this; if (!this.has(e)) {
    Ot((function () { t._data.add(t.enhancer(e, void 0)), t._atom.reportChanged(); }));
    var r = It(this), n = r ? { type: "add", object: this, newValue: e } : null;
    r && Nt(this, n);
} return this; }, e.prototype.delete = function (e) { var t = this; if (Ct(this) && !(n = Tt(this, { type: "delete", object: this, oldValue: e })))
    return !1; if (this.has(e)) {
    var r = It(this), n = r ? { type: "delete", object: this, oldValue: e } : null;
    return Ot((function () { t._atom.reportChanged(), t._data.delete(e); })), r && Nt(this, n), !0;
} return !1; }, e.prototype.has = function (e) { return this._atom.reportObserved(), this._data.has(this.dehanceValue(e)); }, e.prototype.entries = function () { var e = 0, t = Array.from(this.keys()), r = Array.from(this.values()); return cr({ next: function () { var n = e; return e += 1, n < r.length ? { value: [t[n], r[n]], done: !1 } : { done: !0 }; } }); }, e.prototype.keys = function () { return this.values(); }, e.prototype.values = function () { this._atom.reportObserved(); var e = this, t = 0, r = Array.from(this._data.values()); return cr({ next: function () { return t < r.length ? { value: e.dehanceValue(r[t++]), done: !1 } : { done: !0 }; } }); }, e.prototype.replace = function (e) { var t = this; return Xt(e) && (e = e.toJS()), Ot((function () { var r = ge(!0); try {
    Array.isArray(e) ? (t.clear(), e.forEach((function (e) { return t.add(e); }))) : p(e) ? (t.clear(), e.forEach((function (e) { return t.add(e); }))) : null != e && n("Cannot initialize set from " + e);
}
finally {
    me(r);
} })), this; }, e.prototype.observe = function (e, t) { return Pt(this, e); }, e.prototype.intercept = function (e) { return Rt(this, e); }, e.prototype.toJS = function () { return new Set(this); }, e.prototype.toString = function () { return this.name + "[ " + Array.from(this).join(", ") + " ]"; }, e.prototype[(qt = b, Symbol.iterator)] = function () { return this.values(); }, e; }(), Xt = l("ObservableSet", Jt), Yt = function () { function e(e, t, r, n) { void 0 === t && (t = new Map), this.target = e, this.values = t, this.name = r, this.defaultEnhancer = n, this.keysAtom = new g(r + ".keys"); } return e.prototype.read = function (e) { return this.values.get(e).get(); }, e.prototype.write = function (e, t) { var r = this.target, n = this.values.get(e); if (n instanceof Oe)
    n.set(t);
else {
    if (Ct(this)) {
        if (!(i = Tt(this, { type: "update", object: this.proxy || r, name: e, newValue: t })))
            return;
        t = i.newValue;
    }
    if ((t = n.prepareNewValue(t)) !== Re.UNCHANGED) {
        var o = It(this), i = o ? { type: "update", object: this.proxy || r, oldValue: n.value, name: e, newValue: t } : null;
        0, n.setNewValue(t), o && Nt(this, i);
    }
} }, e.prototype.has = function (e) { var t = this.pendingKeys || (this.pendingKeys = new Map), r = t.get(e); if (r)
    return r.get(); var n = !!this.values.get(e); return r = new we(n, k, this.name + "." + d(e) + "?", !1), t.set(e, r), r.get(); }, e.prototype.addObservableProp = function (e, t, r) { void 0 === r && (r = this.defaultEnhancer); var n = this.target; if (Ct(this)) {
    var o = Tt(this, { object: this.proxy || n, name: e, type: "add", newValue: t });
    if (!o)
        return;
    t = o.newValue;
} var i = new we(t, r, this.name + "." + d(e), !1); this.values.set(e, i), t = i.value, Object.defineProperty(n, e, function (e) { return $t[e] || ($t[e] = { configurable: !0, enumerable: !0, get: function () { return this[b].read(e); }, set: function (t) { this[b].write(e, t); } }); }(e)), this.notifyPropertyAddition(e, t); }, e.prototype.addComputedProp = function (e, t, r) { var n, o, i, a = this.target; r.name = r.name || this.name + "." + d(t), this.values.set(t, new Oe(r)), (e === a || (n = e, o = t, !(i = Object.getOwnPropertyDescriptor(n, o)) || !1 !== i.configurable && !1 !== i.writable)) && Object.defineProperty(e, t, function (e) { return Qt[e] || (Qt[e] = { configurable: Re.computedConfigurable, enumerable: !1, get: function () { return Zt(this).read(e); }, set: function (t) { Zt(this).write(e, t); } }); }(t)); }, e.prototype.remove = function (e) { if (this.values.has(e)) {
    var t = this.target;
    if (Ct(this))
        if (!(a = Tt(this, { object: this.proxy || t, name: e, type: "remove" })))
            return;
    try {
        Ne();
        var r = It(this), n = this.values.get(e), o = n && n.get();
        if (n && n.set(void 0), this.keysAtom.reportChanged(), this.values.delete(e), this.pendingKeys) {
            var i = this.pendingKeys.get(e);
            i && i.set(!1);
        }
        delete this.target[e];
        var a = r ? { type: "remove", object: this.proxy || t, oldValue: o, name: e } : null;
        0, r && Nt(this, a);
    }
    finally {
        Ve();
    }
} }, e.prototype.illegalAccess = function (e, t) { console.warn("Property '" + t + "' of '" + e + "' was accessed through the prototype chain. Use 'decorate' instead to declare the prop or access it statically through it's owner"); }, e.prototype.observe = function (e, t) { return Pt(this, e); }, e.prototype.intercept = function (e) { return Rt(this, e); }, e.prototype.notifyPropertyAddition = function (e, t) { var r = It(this), n = r ? { type: "add", object: this.proxy || this.target, name: e, newValue: t } : null; if (r && Nt(this, n), this.pendingKeys) {
    var o = this.pendingKeys.get(e);
    o && o.set(!0);
} this.keysAtom.reportChanged(); }, e.prototype.getKeys = function () { var e, t; this.keysAtom.reportObserved(); var r = []; try {
    for (var n = A(this.values), o = n.next(); !o.done; o = n.next()) {
        var i = _(o.value, 2), a = i[0];
        i[1] instanceof we && r.push(a);
    }
}
catch (t) {
    e = { error: t };
}
finally {
    try {
        o && !o.done && (t = n.return) && t.call(n);
    }
    finally {
        if (e)
            throw e.error;
    }
} return r; }, e; }();
function Ft(e, t, n) { if (void 0 === t && (t = ""), void 0 === n && (n = V), Object.prototype.hasOwnProperty.call(e, b))
    return e[b]; u(e) || (t = (e.constructor.name || "ObservableObject") + "@" + r()), t || (t = "ObservableObject@" + r()); var o = new Yt(e, new Map, d(t), n); return c(e, b, o), o; }
var $t = Object.create(null), Qt = Object.create(null);
function Zt(e) { var t = e[b]; return t || (I(e), e[b]); }
var er = l("ObservableObjectAdministration", Yt);
function tr(e) { return !!s(e) && (I(e), er(e[b])); }
function rr(e, t) { if ("object" == typeof e && null !== e) {
    if (Gt(e))
        return void 0 !== t && n(!1), e[b].atom;
    if (Xt(e))
        return e[b];
    if (Ht(e)) {
        var r = e;
        return void 0 === t ? r._keysAtom : ((o = r._data.get(t) || r._hasMap.get(t)) || n(!1), o);
    }
    var o;
    if (I(e), t && !e[b] && e[t], tr(e))
        return t ? ((o = e[b].values.get(t)) || n(!1), o) : n(!1);
    if (m(e) || Se(e) || qe(e))
        return e;
}
else if ("function" == typeof e && qe(e[b]))
    return e[b]; return n(!1); }
function nr(e, t) { return e || n("Expecting some object"), void 0 !== t ? nr(rr(e, t)) : m(e) || Se(e) || qe(e) ? e : Ht(e) || Xt(e) ? e : (I(e), e[b] ? e[b] : void n(!1)); }
function or(e, t) { return (void 0 !== t ? rr(e, t) : tr(e) || Ht(e) || Xt(e) ? nr(e) : rr(e)).name; }
var ir = Object.prototype.toString;
function ar(e, t, r) { return void 0 === r && (r = -1), function e(t, r, n, o, i) { if (t === r)
    return 0 !== t || 1 / t == 1 / r; if (null == t || null == r)
    return !1; if (t != t)
    return r != r; var a = typeof t; if ("function" !== a && "object" !== a && "object" != typeof r)
    return !1; var s = ir.call(t); if (s !== ir.call(r))
    return !1; switch (s) {
    case "[object RegExp]":
    case "[object String]": return "" + t == "" + r;
    case "[object Number]": return +t != +t ? +r != +r : 0 == +t ? 1 / +t == 1 / r : +t == +r;
    case "[object Date]":
    case "[object Boolean]": return +t == +r;
    case "[object Symbol]": return "undefined" != typeof Symbol && Symbol.valueOf.call(t) === Symbol.valueOf.call(r);
    case "[object Map]":
    case "[object Set]": n >= 0 && n++;
} t = sr(t), r = sr(r); var u = "[object Array]" === s; if (!u) {
    if ("object" != typeof t || "object" != typeof r)
        return !1;
    var c = t.constructor, l = r.constructor;
    if (c !== l && !("function" == typeof c && c instanceof c && "function" == typeof l && l instanceof l) && "constructor" in t && "constructor" in r)
        return !1;
} if (0 === n)
    return !1; n < 0 && (n = -1); i = i || []; var f = (o = o || []).length; for (; f--;)
    if (o[f] === t)
        return i[f] === r; if (o.push(t), i.push(r), u) {
    if ((f = t.length) !== r.length)
        return !1;
    for (; f--;)
        if (!e(t[f], r[f], n - 1, o, i))
            return !1;
}
else {
    var p = Object.keys(t), h = void 0;
    if (f = p.length, Object.keys(r).length !== f)
        return !1;
    for (; f--;)
        if (h = p[f], !ur(r, h) || !e(t[h], r[h], n - 1, o, i))
            return !1;
} return o.pop(), i.pop(), !0; }(e, t, r); }
function sr(e) { return Gt(e) ? e.slice() : f(e) || Ht(e) ? Array.from(e.entries()) : p(e) || Xt(e) ? Array.from(e.entries()) : e; }
function ur(e, t) { return Object.prototype.hasOwnProperty.call(e, t); }
function cr(e) { return e[Symbol.iterator] = lr, e; }
function lr() { return this; }
if ("undefined" == typeof Proxy || "undefined" == typeof Symbol)
    throw new Error("[mobx] MobX 5+ requires Proxy and Symbol objects. If your environment doesn't support Symbol or Proxy objects, please downgrade to MobX 4. For React Native Android, consider upgrading JSCore.");
"object" == typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ && __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({ spy: ze, extras: { getDebugName: or }, $mobx: b }), exports.$mobx = b, exports.FlowCancellationError = ct, exports.ObservableMap = zt, exports.ObservableSet = Jt, exports.Reaction = Le, exports._allowStateChanges = function (e, t) { var r, n = ge(e); try {
    r = t();
}
finally {
    me(n);
} return r; }, exports._allowStateChangesInsideComputed = function (e) { var t, r = Re.computationDepth; Re.computationDepth = 0; try {
    t = e();
}
finally {
    Re.computationDepth = r;
} return t; }, exports._allowStateReadsEnd = ce, exports._allowStateReadsStart = ue, exports._endAction = be, exports._getAdministration = nr, exports._getGlobalState = function () { return Re; }, exports._interceptReads = function (e, t, r) { var o; if (Ht(e) || Gt(e) || xe(e))
    o = nr(e);
else {
    if (!tr(e))
        return n(!1);
    if ("string" != typeof t)
        return n(!1);
    o = nr(e, t);
} return void 0 !== o.dehancer ? n(!1) : (o.dehancer = "function" == typeof t ? t : r, function () { o.dehancer = void 0; }); }, exports._isComputingDerivation = function () { return null !== Re.trackingDerivation; }, exports._resetGlobalState = function () { var e = new _e; for (var t in e)
    -1 === Ae.indexOf(t) && (Re[t] = e[t]); Re.allowStateChanges = !Re.enforceActions; }, exports._startAction = ye, exports.action = Xe, exports.autorun = Fe, exports.comparer = x, exports.computed = Q, exports.configure = function (e) { var t = e.enforceActions, r = e.computedRequiresReaction, o = e.computedConfigurable, i = e.disableErrorBoundaries, a = e.reactionScheduler, s = e.reactionRequiresObservable, u = e.observableRequiresReaction; if (!0 === e.isolateGlobalState && ((Re.pendingReactions.length || Re.inBatch || Re.isRunningReactions) && n("isolateGlobalState should be called before MobX is running any reactions"), Ce = !0, je && (0 == --De().__mobxInstanceCount && (De().__mobxGlobals = void 0), Re = new _e)), void 0 !== t) {
    var c = void 0;
    switch (t) {
        case !0:
        case "observed":
            c = !0;
            break;
        case !1:
        case "never":
            c = !1;
            break;
        case "strict":
        case "always":
            c = "strict";
            break;
        default: n("Invalid value for 'enforceActions': '" + t + "', expected 'never', 'always' or 'observed'");
    }
    Re.enforceActions = c, Re.allowStateChanges = !0 !== c && "strict" !== c;
} void 0 !== r && (Re.computedRequiresReaction = !!r), void 0 !== s && (Re.reactionRequiresObservable = !!s), void 0 !== u && (Re.observableRequiresReaction = !!u, Re.allowStateReads = !Re.observableRequiresReaction), void 0 !== o && (Re.computedConfigurable = !!o), void 0 !== i && (!0 === i && console.warn("WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled."), Re.disableErrorBoundaries = !!i), a && Ke(a); }, exports.createAtom = w, exports.decorate = function (e, t) { var r = "function" == typeof e ? e.prototype : e, n = function (e) { var n = t[e]; Array.isArray(n) || (n = [n]); var o = Object.getOwnPropertyDescriptor(r, e), i = n.reduce((function (t, n) { return n(r, e, t); }), o); i && Object.defineProperty(r, e, i); }; for (var o in t)
    n(o); return e; }, exports.entries = function (e) { return tr(e) ? vt(e).map((function (t) { return [t, e[t]]; })) : Ht(e) ? vt(e).map((function (t) { return [t, e.get(t)]; })) : Xt(e) ? Array.from(e.entries()) : Gt(e) ? e.map((function (e, t) { return [t, e]; })) : n(!1); }, exports.extendObservable = rt, exports.flow = function (e) { 1 !== arguments.length && n("Flow expects 1 argument and cannot be used as decorator"); var t = e.name || "<unnamed flow>"; return function () { var r, n = this, o = arguments, i = ++ut, s = Xe(t + " - runid: " + i + " - init", e).apply(n, o), u = void 0, c = new Promise((function (e, n) { var o = 0; function a(e) { var r; u = void 0; try {
    r = Xe(t + " - runid: " + i + " - yield " + o++, s.next).call(s, e);
}
catch (e) {
    return n(e);
} l(r); } function c(e) { var r; u = void 0; try {
    r = Xe(t + " - runid: " + i + " - yield " + o++, s.throw).call(s, e);
}
catch (e) {
    return n(e);
} l(r); } function l(t) { if (!t || "function" != typeof t.then)
    return t.done ? e(t.value) : (u = Promise.resolve(t.value)).then(a, c); t.then(l, n); } r = n, a(void 0); })); return c.cancel = Xe(t + " - runid: " + i + " - cancel", (function () { try {
    u && lt(u);
    var e = s.return(void 0), t = Promise.resolve(e.value);
    t.then(a, a), lt(t), r(new ct);
}
catch (e) {
    r(e);
} })), c; }; }, exports.get = function (e, t) { if (bt(e, t))
    return tr(e) ? e[t] : Ht(e) ? e.get(t) : Gt(e) ? e[t] : n(!1); }, exports.getAtom = rr, exports.getDebugName = or, exports.getDependencyTree = it, exports.getObserverTree = function (e, t) { return st(rr(e, t)); }, exports.has = bt, exports.intercept = function (e, t, r) { return "function" == typeof r ? function (e, t, r) { return nr(e, t).intercept(r); }(e, t, r) : function (e, t) { return nr(e).intercept(t); }(e, t); }, exports.isAction = function (e) { return "function" == typeof e && !0 === e.isMobxAction; }, exports.isArrayLike = function (e) { return Array.isArray(e) || Gt(e); }, exports.isBoxedObservable = xe, exports.isComputed = pt, exports.isComputedProp = function (e, t) { return "string" != typeof t ? n(!1) : ft(e, t); }, exports.isFlowCancellationError = function (e) { return e instanceof ct; }, exports.isObservable = dt, exports.isObservableArray = Gt, exports.isObservableMap = Ht, exports.isObservableObject = tr, exports.isObservableProp = function (e, t) { return "string" != typeof t ? n(!1) : ht(e, t); }, exports.isObservableSet = Xt, exports.keys = vt, exports.observable = W, exports.observe = function (e, t, r, n) { return "function" == typeof r ? function (e, t, r, n) { return nr(e, t).observe(r, n); }(e, t, r, n) : function (e, t, r) { return nr(e).observe(t, r); }(e, t, r); }, exports.onBecomeObserved = Ze, exports.onBecomeUnobserved = et, exports.onReactionError = function (e) { return Re.globalReactionErrorHandlers.push(e), function () { var t = Re.globalReactionErrorHandlers.indexOf(e); t >= 0 && Re.globalReactionErrorHandlers.splice(t, 1); }; }, exports.reaction = function (e, n, o) { void 0 === o && (o = t); var i, a, s, u = o.name || "Reaction@" + r(), c = Xe(u, o.onError ? (i = o.onError, a = n, function () { try {
    return a.apply(this, arguments);
}
catch (e) {
    i.call(this, e);
} }) : n), l = !o.scheduler && !o.delay, f = Qe(o), p = !0, h = !1, d = o.compareStructural ? x.structural : o.equals || x.default, v = new Le(u, (function () { p || l ? y() : h || (h = !0, f(y)); }), o.onError, o.requiresObservable); function y() { if (h = !1, !v.isDisposed) {
    var t = !1;
    v.track((function () { var r = e(v); t = p || !d(s, r), s = r; })), p && o.fireImmediately && c(s, v), p || !0 !== t || c(s, v), p && (p = !1);
} } return v.schedule(), v.getDisposer(); }, exports.remove = function (e, t) { if (tr(e))
    e[b].remove(t);
else if (Ht(e))
    e.delete(t);
else if (Xt(e))
    e.delete(t);
else {
    if (!Gt(e))
        return n(!1);
    "number" != typeof t && (t = parseInt(t, 10)), o(t >= 0, "Not a valid index: '" + t + "'"), e.splice(t, 1);
} }, exports.runInAction = function (e, t) { return "string" == typeof e || e.name, ve(0, "function" == typeof e ? e : t, this, void 0); }, exports.set = yt, exports.spy = ze, exports.toJS = function (e, t) { var r; return "boolean" == typeof t && (t = { detectCycles: t }), t || (t = gt), t.detectCycles = void 0 === t.detectCycles ? !0 === t.recurseEverything : !0 === t.detectCycles, t.detectCycles && (r = new Map), function e(t, r, n) { if (!r.recurseEverything && !dt(t))
    return t; if ("object" != typeof t)
    return t; if (null === t)
    return null; if (t instanceof Date)
    return t; if (xe(t))
    return e(t.get(), r, n); if (dt(t) && vt(t), !0 === r.detectCycles && null !== t && n.has(t))
    return n.get(t); if (Gt(t) || Array.isArray(t)) {
    var o = mt(n, t, [], r), i = t.map((function (t) { return e(t, r, n); }));
    o.length = i.length;
    for (var a = 0, s = i.length; a < s; a++)
        o[a] = i[a];
    return o;
} if (Xt(t) || Object.getPrototypeOf(t) === Set.prototype) {
    if (!1 === r.exportMapsAsObjects) {
        var u = mt(n, t, new Set, r);
        return t.forEach((function (t) { u.add(e(t, r, n)); })), u;
    }
    var c = mt(n, t, [], r);
    return t.forEach((function (t) { c.push(e(t, r, n)); })), c;
} if (Ht(t) || Object.getPrototypeOf(t) === Map.prototype) {
    if (!1 === r.exportMapsAsObjects) {
        var l = mt(n, t, new Map, r);
        return t.forEach((function (t, o) { l.set(o, e(t, r, n)); })), l;
    }
    var f = mt(n, t, {}, r);
    return t.forEach((function (t, o) { f[o] = e(t, r, n); })), f;
} var p = mt(n, t, {}, r); return h(t).forEach((function (o) { p[o] = e(t[o], r, n); })), p; }(e, t, r); }, exports.trace = wt, exports.transaction = Ot, exports.untracked = ie, exports.values = function (e) { return tr(e) ? vt(e).map((function (t) { return e[t]; })) : Ht(e) ? vt(e).map((function (t) { return e.get(t); })) : Xt(e) ? Array.from(e.values()) : Gt(e) ? e.slice() : n(!1); }, exports.when = function (e, t, r) { return 1 === arguments.length || t && "object" == typeof t ? At(e, t) : St(e, t, r || {}); };

});
___scope___.file("lib/mobx.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var OBFUSCATED_ERROR = "An invariant failed, however the error is obfuscated because this is a production build.";
var EMPTY_ARRAY = [];
Object.freeze(EMPTY_ARRAY);
var EMPTY_OBJECT = {};
Object.freeze(EMPTY_OBJECT);
function getNextId() {
    return ++globalState.mobxGuid;
}
function fail(message) {
    invariant(false, message);
    throw "X";
}
function invariant(check, message) {
    if (!check)
        throw new Error("[mobx] " + (message || OBFUSCATED_ERROR));
}
var deprecatedMessages = [];
function deprecated(msg, thing) {
    if (thing) {
        return deprecated("'" + msg + "', use '" + thing + "' instead.");
    }
    if (deprecatedMessages.indexOf(msg) !== -1)
        return false;
    deprecatedMessages.push(msg);
    console.error("[mobx] Deprecated: " + msg);
    return true;
}
function once(func) {
    var invoked = false;
    return function () {
        if (invoked)
            return;
        invoked = true;
        return func.apply(this, arguments);
    };
}
var noop = function () { };
function unique(list) {
    var res = [];
    list.forEach(function (item) {
        if (res.indexOf(item) === -1)
            res.push(item);
    });
    return res;
}
function isObject(value) {
    return value !== null && typeof value === "object";
}
function isPlainObject(value) {
    if (value === null || typeof value !== "object")
        return false;
    var proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}
function convertToMap(dataStructure) {
    if (isES6Map(dataStructure) || isObservableMap(dataStructure)) {
        return dataStructure;
    }
    else if (Array.isArray(dataStructure)) {
        return new Map(dataStructure);
    }
    else if (isPlainObject(dataStructure)) {
        var map = new Map();
        for (var key in dataStructure) {
            map.set(key, dataStructure[key]);
        }
        return map;
    }
    else {
        return fail("Cannot convert to map from '" + dataStructure + "'");
    }
}
function addHiddenProp(object, propName, value) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: true,
        configurable: true,
        value: value
    });
}
function addHiddenFinalProp(object, propName, value) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: false,
        configurable: true,
        value: value
    });
}
function isPropertyConfigurable(object, prop) {
    var descriptor = Object.getOwnPropertyDescriptor(object, prop);
    return !descriptor || (descriptor.configurable !== false && descriptor.writable !== false);
}
function assertPropertyConfigurable(object, prop) {
    if (!isPropertyConfigurable(object, prop))
        fail("Cannot make property '" + prop.toString() + "' observable, it is not configurable and writable in the target object");
}
function createInstanceofPredicate(name, clazz) {
    var propName = "isMobX" + name;
    clazz.prototype[propName] = true;
    return function (x) {
        return isObject(x) && x[propName] === true;
    };
}
function isArrayLike(x) {
    return Array.isArray(x) || isObservableArray(x);
}
function isES6Map(thing) {
    return thing instanceof Map;
}
function isES6Set(thing) {
    return thing instanceof Set;
}
function getPlainObjectKeys(object) {
    var enumerables = new Set();
    for (var key in object)
        enumerables.add(key);
    Object.getOwnPropertySymbols(object).forEach(function (k) {
        if (Object.getOwnPropertyDescriptor(object, k).enumerable)
            enumerables.add(k);
    });
    return Array.from(enumerables);
}
function stringifyKey(key) {
    if (key && key.toString)
        return key.toString();
    else
        return new String(key).toString();
}
function toPrimitive(value) {
    return value === null ? null : typeof value === "object" ? "" + value : value;
}
var ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys
    ? Reflect.ownKeys
    : Object.getOwnPropertySymbols
        ? function (obj) { return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj)); }
        : Object.getOwnPropertyNames;
var $mobx = Symbol("mobx administration");
var Atom = (function () {
    function Atom(name) {
        if (name === void 0) {
            name = "Atom@" + getNextId();
        }
        this.name = name;
        this.isPendingUnobservation = false;
        this.isBeingObserved = false;
        this.observers = new Set();
        this.diffValue = 0;
        this.lastAccessedBy = 0;
        this.lowestObserverState = exports.IDerivationState.NOT_TRACKING;
    }
    Atom.prototype.onBecomeObserved = function () {
        if (this.onBecomeObservedListeners) {
            this.onBecomeObservedListeners.forEach(function (listener) { return listener(); });
        }
    };
    Atom.prototype.onBecomeUnobserved = function () {
        if (this.onBecomeUnobservedListeners) {
            this.onBecomeUnobservedListeners.forEach(function (listener) { return listener(); });
        }
    };
    Atom.prototype.reportObserved = function () {
        return reportObserved(this);
    };
    Atom.prototype.reportChanged = function () {
        startBatch();
        propagateChanged(this);
        endBatch();
    };
    Atom.prototype.toString = function () {
        return this.name;
    };
    return Atom;
}());
var isAtom = createInstanceofPredicate("Atom", Atom);
function createAtom(name, onBecomeObservedHandler, onBecomeUnobservedHandler) {
    if (onBecomeObservedHandler === void 0) {
        onBecomeObservedHandler = noop;
    }
    if (onBecomeUnobservedHandler === void 0) {
        onBecomeUnobservedHandler = noop;
    }
    var atom = new Atom(name);
    if (onBecomeObservedHandler !== noop) {
        onBecomeObserved(atom, onBecomeObservedHandler);
    }
    if (onBecomeUnobservedHandler !== noop) {
        onBecomeUnobserved(atom, onBecomeUnobservedHandler);
    }
    return atom;
}
function identityComparer(a, b) {
    return a === b;
}
function structuralComparer(a, b) {
    return deepEqual(a, b);
}
function shallowComparer(a, b) {
    return deepEqual(a, b, 1);
}
function defaultComparer(a, b) {
    return Object.is(a, b);
}
var comparer = {
    identity: identityComparer,
    structural: structuralComparer,
    default: defaultComparer,
    shallow: shallowComparer
};
var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p]; };
    return extendStatics(d, b);
};
function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function () {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m)
        return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length)
                o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}
function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
        return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
            ar.push(r.value);
    }
    catch (error) {
        e = { error: error };
    }
    finally {
        try {
            if (r && !r.done && (m = i["return"]))
                m.call(i);
        }
        finally {
            if (e)
                throw e.error;
        }
    }
    return ar;
}
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}
var mobxDidRunLazyInitializersSymbol = Symbol("mobx did run lazy initializers");
var mobxPendingDecorators = Symbol("mobx pending decorators");
var enumerableDescriptorCache = {};
var nonEnumerableDescriptorCache = {};
function createPropertyInitializerDescriptor(prop, enumerable) {
    var cache = enumerable ? enumerableDescriptorCache : nonEnumerableDescriptorCache;
    return (cache[prop] ||
        (cache[prop] = {
            configurable: true,
            enumerable: enumerable,
            get: function () {
                initializeInstance(this);
                return this[prop];
            },
            set: function (value) {
                initializeInstance(this);
                this[prop] = value;
            }
        }));
}
function initializeInstance(target) {
    var e_1, _a;
    if (target[mobxDidRunLazyInitializersSymbol] === true)
        return;
    var decorators = target[mobxPendingDecorators];
    if (decorators) {
        addHiddenProp(target, mobxDidRunLazyInitializersSymbol, true);
        var keys = __spread(Object.getOwnPropertySymbols(decorators), Object.keys(decorators));
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                var d = decorators[key];
                d.propertyCreator(target, d.prop, d.descriptor, d.decoratorTarget, d.decoratorArguments);
            }
        }
        catch (e_1_1) {
            e_1 = { error: e_1_1 };
        }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return))
                    _a.call(keys_1);
            }
            finally {
                if (e_1)
                    throw e_1.error;
            }
        }
    }
}
function createPropDecorator(propertyInitiallyEnumerable, propertyCreator) {
    return function decoratorFactory() {
        var decoratorArguments;
        var decorator = function decorate(target, prop, descriptor, applyImmediately) {
            if (applyImmediately === true) {
                propertyCreator(target, prop, descriptor, target, decoratorArguments);
                return null;
            }
            if (!quacksLikeADecorator(arguments))
                fail("This function is a decorator, but it wasn't invoked like a decorator");
            if (!Object.prototype.hasOwnProperty.call(target, mobxPendingDecorators)) {
                var inheritedDecorators = target[mobxPendingDecorators];
                addHiddenProp(target, mobxPendingDecorators, __assign({}, inheritedDecorators));
            }
            target[mobxPendingDecorators][prop] = {
                prop: prop,
                propertyCreator: propertyCreator,
                descriptor: descriptor,
                decoratorTarget: target,
                decoratorArguments: decoratorArguments
            };
            return createPropertyInitializerDescriptor(prop, propertyInitiallyEnumerable);
        };
        if (quacksLikeADecorator(arguments)) {
            decoratorArguments = EMPTY_ARRAY;
            return decorator.apply(null, arguments);
        }
        else {
            decoratorArguments = Array.prototype.slice.call(arguments);
            return decorator;
        }
    };
}
function quacksLikeADecorator(args) {
    return (((args.length === 2 || args.length === 3) &&
        (typeof args[1] === "string" || typeof args[1] === "symbol")) ||
        (args.length === 4 && args[3] === true));
}
function deepEnhancer(v, _, name) {
    if (isObservable(v))
        return v;
    if (Array.isArray(v))
        return observable.array(v, { name: name });
    if (isPlainObject(v))
        return observable.object(v, undefined, { name: name });
    if (isES6Map(v))
        return observable.map(v, { name: name });
    if (isES6Set(v))
        return observable.set(v, { name: name });
    return v;
}
function shallowEnhancer(v, _, name) {
    if (v === undefined || v === null)
        return v;
    if (isObservableObject(v) || isObservableArray(v) || isObservableMap(v) || isObservableSet(v))
        return v;
    if (Array.isArray(v))
        return observable.array(v, { name: name, deep: false });
    if (isPlainObject(v))
        return observable.object(v, undefined, { name: name, deep: false });
    if (isES6Map(v))
        return observable.map(v, { name: name, deep: false });
    if (isES6Set(v))
        return observable.set(v, { name: name, deep: false });
    return fail("The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets");
}
function referenceEnhancer(newValue) {
    return newValue;
}
function refStructEnhancer(v, oldValue, name) {
    if (isObservable(v))
        throw "observable.struct should not be used with observable values";
    if (deepEqual(v, oldValue))
        return oldValue;
    return v;
}
function createDecoratorForEnhancer(enhancer) {
    invariant(enhancer);
    var decorator = createPropDecorator(true, function (target, propertyName, descriptor, _decoratorTarget, decoratorArgs) {
        {
            invariant(!descriptor || !descriptor.get, "@observable cannot be used on getter (property \"" + stringifyKey(propertyName) + "\"), use @computed instead.");
        }
        var initialValue = descriptor
            ? descriptor.initializer
                ? descriptor.initializer.call(target)
                : descriptor.value
            : undefined;
        asObservableObject(target).addObservableProp(propertyName, initialValue, enhancer);
    });
    var res = typeof process !== "undefined" && process.env && "development" !== "production"
        ? function observableDecorator() {
            if (arguments.length < 2)
                return fail("Incorrect decorator invocation. @observable decorator doesn't expect any arguments");
            return decorator.apply(null, arguments);
        }
        : decorator;
    res.enhancer = enhancer;
    return res;
}
var defaultCreateObservableOptions = {
    deep: true,
    name: undefined,
    defaultDecorator: undefined,
    proxy: true
};
Object.freeze(defaultCreateObservableOptions);
function assertValidOption(key) {
    if (!/^(deep|name|equals|defaultDecorator|proxy)$/.test(key))
        fail("invalid option for (extend)observable: " + key);
}
function asCreateObservableOptions(thing) {
    if (thing === null || thing === undefined)
        return defaultCreateObservableOptions;
    if (typeof thing === "string")
        return { name: thing, deep: true, proxy: true };
    {
        if (typeof thing !== "object")
            return fail("expected options object");
        Object.keys(thing).forEach(assertValidOption);
    }
    return thing;
}
var deepDecorator = createDecoratorForEnhancer(deepEnhancer);
var shallowDecorator = createDecoratorForEnhancer(shallowEnhancer);
var refDecorator = createDecoratorForEnhancer(referenceEnhancer);
var refStructDecorator = createDecoratorForEnhancer(refStructEnhancer);
function getEnhancerFromOptions(options) {
    return options.defaultDecorator
        ? options.defaultDecorator.enhancer
        : options.deep === false
            ? referenceEnhancer
            : deepEnhancer;
}
function createObservable(v, arg2, arg3) {
    if (typeof arguments[1] === "string" || typeof arguments[1] === "symbol") {
        return deepDecorator.apply(null, arguments);
    }
    if (isObservable(v))
        return v;
    var res = isPlainObject(v)
        ? observable.object(v, arg2, arg3)
        : Array.isArray(v)
            ? observable.array(v, arg2)
            : isES6Map(v)
                ? observable.map(v, arg2)
                : isES6Set(v)
                    ? observable.set(v, arg2)
                    : v;
    if (res !== v)
        return res;
    fail("The provided value could not be converted into an observable. If you want just create an observable reference to the object use 'observable.box(value)'");
}
var observableFactories = {
    box: function (value, options) {
        if (arguments.length > 2)
            incorrectlyUsedAsDecorator("box");
        var o = asCreateObservableOptions(options);
        return new ObservableValue(value, getEnhancerFromOptions(o), o.name, true, o.equals);
    },
    array: function (initialValues, options) {
        if (arguments.length > 2)
            incorrectlyUsedAsDecorator("array");
        var o = asCreateObservableOptions(options);
        return createObservableArray(initialValues, getEnhancerFromOptions(o), o.name);
    },
    map: function (initialValues, options) {
        if (arguments.length > 2)
            incorrectlyUsedAsDecorator("map");
        var o = asCreateObservableOptions(options);
        return new ObservableMap(initialValues, getEnhancerFromOptions(o), o.name);
    },
    set: function (initialValues, options) {
        if (arguments.length > 2)
            incorrectlyUsedAsDecorator("set");
        var o = asCreateObservableOptions(options);
        return new ObservableSet(initialValues, getEnhancerFromOptions(o), o.name);
    },
    object: function (props, decorators, options) {
        if (typeof arguments[1] === "string")
            incorrectlyUsedAsDecorator("object");
        var o = asCreateObservableOptions(options);
        if (o.proxy === false) {
            return extendObservable({}, props, decorators, o);
        }
        else {
            var defaultDecorator = getDefaultDecoratorFromObjectOptions(o);
            var base = extendObservable({}, undefined, undefined, o);
            var proxy = createDynamicObservableObject(base);
            extendObservableObjectWithProperties(proxy, props, decorators, defaultDecorator);
            return proxy;
        }
    },
    ref: refDecorator,
    shallow: shallowDecorator,
    deep: deepDecorator,
    struct: refStructDecorator
};
var observable = createObservable;
Object.keys(observableFactories).forEach(function (name) { return (observable[name] = observableFactories[name]); });
function incorrectlyUsedAsDecorator(methodName) {
    fail("Expected one or two arguments to observable." + methodName + ". Did you accidentally try to use observable." + methodName + " as decorator?");
}
var computedDecorator = createPropDecorator(false, function (instance, propertyName, descriptor, decoratorTarget, decoratorArgs) {
    {
        invariant(descriptor && descriptor.get, "Trying to declare a computed value for unspecified getter '" + stringifyKey(propertyName) + "'");
    }
    var get = descriptor.get, set = descriptor.set;
    var options = decoratorArgs[0] || {};
    asObservableObject(instance).addComputedProp(instance, propertyName, __assign({ get: get,
        set: set, context: instance }, options));
});
var computedStructDecorator = computedDecorator({ equals: comparer.structural });
var computed = function computed(arg1, arg2, arg3) {
    if (typeof arg2 === "string") {
        return computedDecorator.apply(null, arguments);
    }
    if (arg1 !== null && typeof arg1 === "object" && arguments.length === 1) {
        return computedDecorator.apply(null, arguments);
    }
    {
        invariant(typeof arg1 === "function", "First argument to `computed` should be an expression.");
        invariant(arguments.length < 3, "Computed takes one or two arguments if used as function");
    }
    var opts = typeof arg2 === "object" ? arg2 : {};
    opts.get = arg1;
    opts.set = typeof arg2 === "function" ? arg2 : opts.set;
    opts.name = opts.name || arg1.name || "";
    return new ComputedValue(opts);
};
computed.struct = computedStructDecorator;
(function (IDerivationState) {
    IDerivationState[IDerivationState["NOT_TRACKING"] = -1] = "NOT_TRACKING";
    IDerivationState[IDerivationState["UP_TO_DATE"] = 0] = "UP_TO_DATE";
    IDerivationState[IDerivationState["POSSIBLY_STALE"] = 1] = "POSSIBLY_STALE";
    IDerivationState[IDerivationState["STALE"] = 2] = "STALE";
})(exports.IDerivationState || (exports.IDerivationState = {}));
var TraceMode;
(function (TraceMode) {
    TraceMode[TraceMode["NONE"] = 0] = "NONE";
    TraceMode[TraceMode["LOG"] = 1] = "LOG";
    TraceMode[TraceMode["BREAK"] = 2] = "BREAK";
})(TraceMode || (TraceMode = {}));
var CaughtException = (function () {
    function CaughtException(cause) {
        this.cause = cause;
    }
    return CaughtException;
}());
function isCaughtException(e) {
    return e instanceof CaughtException;
}
function shouldCompute(derivation) {
    switch (derivation.dependenciesState) {
        case exports.IDerivationState.UP_TO_DATE:
            return false;
        case exports.IDerivationState.NOT_TRACKING:
        case exports.IDerivationState.STALE:
            return true;
        case exports.IDerivationState.POSSIBLY_STALE: {
            var prevAllowStateReads = allowStateReadsStart(true);
            var prevUntracked = untrackedStart();
            var obs = derivation.observing, l = obs.length;
            for (var i = 0; i < l; i++) {
                var obj = obs[i];
                if (isComputedValue(obj)) {
                    if (globalState.disableErrorBoundaries) {
                        obj.get();
                    }
                    else {
                        try {
                            obj.get();
                        }
                        catch (e) {
                            untrackedEnd(prevUntracked);
                            allowStateReadsEnd(prevAllowStateReads);
                            return true;
                        }
                    }
                    if (derivation.dependenciesState === exports.IDerivationState.STALE) {
                        untrackedEnd(prevUntracked);
                        allowStateReadsEnd(prevAllowStateReads);
                        return true;
                    }
                }
            }
            changeDependenciesStateTo0(derivation);
            untrackedEnd(prevUntracked);
            allowStateReadsEnd(prevAllowStateReads);
            return false;
        }
    }
}
function isComputingDerivation() {
    return globalState.trackingDerivation !== null;
}
function checkIfStateModificationsAreAllowed(atom) {
    var hasObservers = atom.observers.size > 0;
    if (globalState.computationDepth > 0 && hasObservers)
        fail("Computed values are not allowed to cause side effects by changing observables that are already being observed. Tried to modify: " + atom.name);
    if (!globalState.allowStateChanges && (hasObservers || globalState.enforceActions === "strict"))
        fail((globalState.enforceActions
            ? "Since strict-mode is enabled, changing observed observable values outside actions is not allowed. Please wrap the code in an `action` if this change is intended. Tried to modify: "
            : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, the render function of a React component? Tried to modify: ") +
            atom.name);
}
function checkIfStateReadsAreAllowed(observable) {
    if (!globalState.allowStateReads &&
        globalState.observableRequiresReaction) {
        console.warn("[mobx] Observable " + observable.name + " being read outside a reactive context");
    }
}
function trackDerivedFunction(derivation, f, context) {
    var prevAllowStateReads = allowStateReadsStart(true);
    changeDependenciesStateTo0(derivation);
    derivation.newObserving = new Array(derivation.observing.length + 100);
    derivation.unboundDepsCount = 0;
    derivation.runId = ++globalState.runId;
    var prevTracking = globalState.trackingDerivation;
    globalState.trackingDerivation = derivation;
    var result;
    if (globalState.disableErrorBoundaries === true) {
        result = f.call(context);
    }
    else {
        try {
            result = f.call(context);
        }
        catch (e) {
            result = new CaughtException(e);
        }
    }
    globalState.trackingDerivation = prevTracking;
    bindDependencies(derivation);
    warnAboutDerivationWithoutDependencies(derivation);
    allowStateReadsEnd(prevAllowStateReads);
    return result;
}
function warnAboutDerivationWithoutDependencies(derivation) {
    if (derivation.observing.length !== 0)
        return;
    if (globalState.reactionRequiresObservable || derivation.requiresObservable) {
        console.warn("[mobx] Derivation " + derivation.name + " is created/updated without reading any observable value");
    }
}
function bindDependencies(derivation) {
    var prevObserving = derivation.observing;
    var observing = (derivation.observing = derivation.newObserving);
    var lowestNewObservingDerivationState = exports.IDerivationState.UP_TO_DATE;
    var i0 = 0, l = derivation.unboundDepsCount;
    for (var i = 0; i < l; i++) {
        var dep = observing[i];
        if (dep.diffValue === 0) {
            dep.diffValue = 1;
            if (i0 !== i)
                observing[i0] = dep;
            i0++;
        }
        if (dep.dependenciesState > lowestNewObservingDerivationState) {
            lowestNewObservingDerivationState = dep.dependenciesState;
        }
    }
    observing.length = i0;
    derivation.newObserving = null;
    l = prevObserving.length;
    while (l--) {
        var dep = prevObserving[l];
        if (dep.diffValue === 0) {
            removeObserver(dep, derivation);
        }
        dep.diffValue = 0;
    }
    while (i0--) {
        var dep = observing[i0];
        if (dep.diffValue === 1) {
            dep.diffValue = 0;
            addObserver(dep, derivation);
        }
    }
    if (lowestNewObservingDerivationState !== exports.IDerivationState.UP_TO_DATE) {
        derivation.dependenciesState = lowestNewObservingDerivationState;
        derivation.onBecomeStale();
    }
}
function clearObserving(derivation) {
    var obs = derivation.observing;
    derivation.observing = [];
    var i = obs.length;
    while (i--)
        removeObserver(obs[i], derivation);
    derivation.dependenciesState = exports.IDerivationState.NOT_TRACKING;
}
function untracked(action) {
    var prev = untrackedStart();
    try {
        return action();
    }
    finally {
        untrackedEnd(prev);
    }
}
function untrackedStart() {
    var prev = globalState.trackingDerivation;
    globalState.trackingDerivation = null;
    return prev;
}
function untrackedEnd(prev) {
    globalState.trackingDerivation = prev;
}
function allowStateReadsStart(allowStateReads) {
    var prev = globalState.allowStateReads;
    globalState.allowStateReads = allowStateReads;
    return prev;
}
function allowStateReadsEnd(prev) {
    globalState.allowStateReads = prev;
}
function changeDependenciesStateTo0(derivation) {
    if (derivation.dependenciesState === exports.IDerivationState.UP_TO_DATE)
        return;
    derivation.dependenciesState = exports.IDerivationState.UP_TO_DATE;
    var obs = derivation.observing;
    var i = obs.length;
    while (i--)
        obs[i].lowestObserverState = exports.IDerivationState.UP_TO_DATE;
}
var currentActionId = 0;
var nextActionId = 1;
var functionNameDescriptor = Object.getOwnPropertyDescriptor(function () { }, "name");
var isFunctionNameConfigurable = functionNameDescriptor && functionNameDescriptor.configurable;
function createAction(actionName, fn, ref) {
    {
        invariant(typeof fn === "function", "`action` can only be invoked on functions");
        if (typeof actionName !== "string" || !actionName)
            fail("actions should have valid names, got: '" + actionName + "'");
    }
    var res = function () {
        return executeAction(actionName, fn, ref || this, arguments);
    };
    res.isMobxAction = true;
    {
        if (isFunctionNameConfigurable) {
            Object.defineProperty(res, "name", { value: actionName });
        }
    }
    return res;
}
function executeAction(actionName, fn, scope, args) {
    var runInfo = _startAction(actionName, scope, args);
    try {
        return fn.apply(scope, args);
    }
    catch (err) {
        runInfo.error = err;
        throw err;
    }
    finally {
        _endAction(runInfo);
    }
}
function _startAction(actionName, scope, args) {
    var notifySpy = isSpyEnabled() && !!actionName;
    var startTime = 0;
    if (notifySpy && "development" !== "production") {
        startTime = Date.now();
        var l = (args && args.length) || 0;
        var flattendArgs = new Array(l);
        if (l > 0)
            for (var i = 0; i < l; i++)
                flattendArgs[i] = args[i];
        spyReportStart({
            type: "action",
            name: actionName,
            object: scope,
            arguments: flattendArgs
        });
    }
    var prevDerivation = untrackedStart();
    startBatch();
    var prevAllowStateChanges = allowStateChangesStart(true);
    var prevAllowStateReads = allowStateReadsStart(true);
    var runInfo = {
        prevDerivation: prevDerivation,
        prevAllowStateChanges: prevAllowStateChanges,
        prevAllowStateReads: prevAllowStateReads,
        notifySpy: notifySpy,
        startTime: startTime,
        actionId: nextActionId++,
        parentActionId: currentActionId
    };
    currentActionId = runInfo.actionId;
    return runInfo;
}
function _endAction(runInfo) {
    if (currentActionId !== runInfo.actionId) {
        fail("invalid action stack. did you forget to finish an action?");
    }
    currentActionId = runInfo.parentActionId;
    if (runInfo.error !== undefined) {
        globalState.suppressReactionErrors = true;
    }
    allowStateChangesEnd(runInfo.prevAllowStateChanges);
    allowStateReadsEnd(runInfo.prevAllowStateReads);
    endBatch();
    untrackedEnd(runInfo.prevDerivation);
    if (runInfo.notifySpy && "development" !== "production") {
        spyReportEnd({ time: Date.now() - runInfo.startTime });
    }
    globalState.suppressReactionErrors = false;
}
function allowStateChanges(allowStateChanges, func) {
    var prev = allowStateChangesStart(allowStateChanges);
    var res;
    try {
        res = func();
    }
    finally {
        allowStateChangesEnd(prev);
    }
    return res;
}
function allowStateChangesStart(allowStateChanges) {
    var prev = globalState.allowStateChanges;
    globalState.allowStateChanges = allowStateChanges;
    return prev;
}
function allowStateChangesEnd(prev) {
    globalState.allowStateChanges = prev;
}
function allowStateChangesInsideComputed(func) {
    var prev = globalState.computationDepth;
    globalState.computationDepth = 0;
    var res;
    try {
        res = func();
    }
    finally {
        globalState.computationDepth = prev;
    }
    return res;
}
var ObservableValue = (function (_super) {
    __extends(ObservableValue, _super);
    function ObservableValue(value, enhancer, name, notifySpy, equals) {
        if (name === void 0) {
            name = "ObservableValue@" + getNextId();
        }
        if (notifySpy === void 0) {
            notifySpy = true;
        }
        if (equals === void 0) {
            equals = comparer.default;
        }
        var _this = _super.call(this, name) || this;
        _this.enhancer = enhancer;
        _this.name = name;
        _this.equals = equals;
        _this.hasUnreportedChange = false;
        _this.value = enhancer(value, undefined, name);
        if (notifySpy && isSpyEnabled() && "development" !== "production") {
            spyReport({ type: "create", name: _this.name, newValue: "" + _this.value });
        }
        return _this;
    }
    ObservableValue.prototype.dehanceValue = function (value) {
        if (this.dehancer !== undefined)
            return this.dehancer(value);
        return value;
    };
    ObservableValue.prototype.set = function (newValue) {
        var oldValue = this.value;
        newValue = this.prepareNewValue(newValue);
        if (newValue !== globalState.UNCHANGED) {
            var notifySpy = isSpyEnabled();
            if (notifySpy && "development" !== "production") {
                spyReportStart({
                    type: "update",
                    name: this.name,
                    newValue: newValue,
                    oldValue: oldValue
                });
            }
            this.setNewValue(newValue);
            if (notifySpy && "development" !== "production")
                spyReportEnd();
        }
    };
    ObservableValue.prototype.prepareNewValue = function (newValue) {
        checkIfStateModificationsAreAllowed(this);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                object: this,
                type: "update",
                newValue: newValue
            });
            if (!change)
                return globalState.UNCHANGED;
            newValue = change.newValue;
        }
        newValue = this.enhancer(newValue, this.value, this.name);
        return this.equals(this.value, newValue) ? globalState.UNCHANGED : newValue;
    };
    ObservableValue.prototype.setNewValue = function (newValue) {
        var oldValue = this.value;
        this.value = newValue;
        this.reportChanged();
        if (hasListeners(this)) {
            notifyListeners(this, {
                type: "update",
                object: this,
                newValue: newValue,
                oldValue: oldValue
            });
        }
    };
    ObservableValue.prototype.get = function () {
        this.reportObserved();
        return this.dehanceValue(this.value);
    };
    ObservableValue.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    ObservableValue.prototype.observe = function (listener, fireImmediately) {
        if (fireImmediately)
            listener({
                object: this,
                type: "update",
                newValue: this.value,
                oldValue: undefined
            });
        return registerListener(this, listener);
    };
    ObservableValue.prototype.toJSON = function () {
        return this.get();
    };
    ObservableValue.prototype.toString = function () {
        return this.name + "[" + this.value + "]";
    };
    ObservableValue.prototype.valueOf = function () {
        return toPrimitive(this.get());
    };
    ObservableValue.prototype[Symbol.toPrimitive] = function () {
        return this.valueOf();
    };
    return ObservableValue;
}(Atom));
var isObservableValue = createInstanceofPredicate("ObservableValue", ObservableValue);
var ComputedValue = (function () {
    function ComputedValue(options) {
        this.dependenciesState = exports.IDerivationState.NOT_TRACKING;
        this.observing = [];
        this.newObserving = null;
        this.isBeingObserved = false;
        this.isPendingUnobservation = false;
        this.observers = new Set();
        this.diffValue = 0;
        this.runId = 0;
        this.lastAccessedBy = 0;
        this.lowestObserverState = exports.IDerivationState.UP_TO_DATE;
        this.unboundDepsCount = 0;
        this.__mapid = "#" + getNextId();
        this.value = new CaughtException(null);
        this.isComputing = false;
        this.isRunningSetter = false;
        this.isTracing = TraceMode.NONE;
        invariant(options.get, "missing option for computed: get");
        this.derivation = options.get;
        this.name = options.name || "ComputedValue@" + getNextId();
        if (options.set)
            this.setter = createAction(this.name + "-setter", options.set);
        this.equals =
            options.equals ||
                (options.compareStructural || options.struct
                    ? comparer.structural
                    : comparer.default);
        this.scope = options.context;
        this.requiresReaction = !!options.requiresReaction;
        this.keepAlive = !!options.keepAlive;
    }
    ComputedValue.prototype.onBecomeStale = function () {
        propagateMaybeChanged(this);
    };
    ComputedValue.prototype.onBecomeObserved = function () {
        if (this.onBecomeObservedListeners) {
            this.onBecomeObservedListeners.forEach(function (listener) { return listener(); });
        }
    };
    ComputedValue.prototype.onBecomeUnobserved = function () {
        if (this.onBecomeUnobservedListeners) {
            this.onBecomeUnobservedListeners.forEach(function (listener) { return listener(); });
        }
    };
    ComputedValue.prototype.get = function () {
        if (this.isComputing)
            fail("Cycle detected in computation " + this.name + ": " + this.derivation);
        if (globalState.inBatch === 0 && this.observers.size === 0 && !this.keepAlive) {
            if (shouldCompute(this)) {
                this.warnAboutUntrackedRead();
                startBatch();
                this.value = this.computeValue(false);
                endBatch();
            }
        }
        else {
            reportObserved(this);
            if (shouldCompute(this))
                if (this.trackAndCompute())
                    propagateChangeConfirmed(this);
        }
        var result = this.value;
        if (isCaughtException(result))
            throw result.cause;
        return result;
    };
    ComputedValue.prototype.peek = function () {
        var res = this.computeValue(false);
        if (isCaughtException(res))
            throw res.cause;
        return res;
    };
    ComputedValue.prototype.set = function (value) {
        if (this.setter) {
            invariant(!this.isRunningSetter, "The setter of computed value '" + this.name + "' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?");
            this.isRunningSetter = true;
            try {
                this.setter.call(this.scope, value);
            }
            finally {
                this.isRunningSetter = false;
            }
        }
        else
            invariant(false, "[ComputedValue '" + this.name + "'] It is not possible to assign a new value to a computed value.");
    };
    ComputedValue.prototype.trackAndCompute = function () {
        if (isSpyEnabled() && "development" !== "production") {
            spyReport({
                object: this.scope,
                type: "compute",
                name: this.name
            });
        }
        var oldValue = this.value;
        var wasSuspended = this.dependenciesState === exports.IDerivationState.NOT_TRACKING;
        var newValue = this.computeValue(true);
        var changed = wasSuspended ||
            isCaughtException(oldValue) ||
            isCaughtException(newValue) ||
            !this.equals(oldValue, newValue);
        if (changed) {
            this.value = newValue;
        }
        return changed;
    };
    ComputedValue.prototype.computeValue = function (track) {
        this.isComputing = true;
        globalState.computationDepth++;
        var res;
        if (track) {
            res = trackDerivedFunction(this, this.derivation, this.scope);
        }
        else {
            if (globalState.disableErrorBoundaries === true) {
                res = this.derivation.call(this.scope);
            }
            else {
                try {
                    res = this.derivation.call(this.scope);
                }
                catch (e) {
                    res = new CaughtException(e);
                }
            }
        }
        globalState.computationDepth--;
        this.isComputing = false;
        return res;
    };
    ComputedValue.prototype.suspend = function () {
        if (!this.keepAlive) {
            clearObserving(this);
            this.value = undefined;
        }
    };
    ComputedValue.prototype.observe = function (listener, fireImmediately) {
        var _this = this;
        var firstTime = true;
        var prevValue = undefined;
        return autorun(function () {
            var newValue = _this.get();
            if (!firstTime || fireImmediately) {
                var prevU = untrackedStart();
                listener({
                    type: "update",
                    object: _this,
                    newValue: newValue,
                    oldValue: prevValue
                });
                untrackedEnd(prevU);
            }
            firstTime = false;
            prevValue = newValue;
        });
    };
    ComputedValue.prototype.warnAboutUntrackedRead = function () {
        if (this.requiresReaction === true) {
            fail("[mobx] Computed value " + this.name + " is read outside a reactive context");
        }
        if (this.isTracing !== TraceMode.NONE) {
            console.log("[mobx.trace] '" + this.name + "' is being read outside a reactive context. Doing a full recompute");
        }
        if (globalState.computedRequiresReaction) {
            console.warn("[mobx] Computed value " + this.name + " is being read outside a reactive context. Doing a full recompute");
        }
    };
    ComputedValue.prototype.toJSON = function () {
        return this.get();
    };
    ComputedValue.prototype.toString = function () {
        return this.name + "[" + this.derivation.toString() + "]";
    };
    ComputedValue.prototype.valueOf = function () {
        return toPrimitive(this.get());
    };
    ComputedValue.prototype[Symbol.toPrimitive] = function () {
        return this.valueOf();
    };
    return ComputedValue;
}());
var isComputedValue = createInstanceofPredicate("ComputedValue", ComputedValue);
var persistentKeys = [
    "mobxGuid",
    "spyListeners",
    "enforceActions",
    "computedRequiresReaction",
    "reactionRequiresObservable",
    "observableRequiresReaction",
    "allowStateReads",
    "disableErrorBoundaries",
    "runId",
    "UNCHANGED"
];
var MobXGlobals = (function () {
    function MobXGlobals() {
        this.version = 5;
        this.UNCHANGED = {};
        this.trackingDerivation = null;
        this.computationDepth = 0;
        this.runId = 0;
        this.mobxGuid = 0;
        this.inBatch = 0;
        this.pendingUnobservations = [];
        this.pendingReactions = [];
        this.isRunningReactions = false;
        this.allowStateChanges = true;
        this.allowStateReads = true;
        this.enforceActions = false;
        this.spyListeners = [];
        this.globalReactionErrorHandlers = [];
        this.computedRequiresReaction = false;
        this.reactionRequiresObservable = false;
        this.observableRequiresReaction = false;
        this.computedConfigurable = false;
        this.disableErrorBoundaries = false;
        this.suppressReactionErrors = false;
    }
    return MobXGlobals;
}());
var mockGlobal = {};
function getGlobal() {
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof global !== "undefined") {
        return global;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    return mockGlobal;
}
var canMergeGlobalState = true;
var isolateCalled = false;
var globalState = (function () {
    var global = getGlobal();
    if (global.__mobxInstanceCount > 0 && !global.__mobxGlobals)
        canMergeGlobalState = false;
    if (global.__mobxGlobals && global.__mobxGlobals.version !== new MobXGlobals().version)
        canMergeGlobalState = false;
    if (!canMergeGlobalState) {
        setTimeout(function () {
            if (!isolateCalled) {
                fail("There are multiple, different versions of MobX active. Make sure MobX is loaded only once or use `configure({ isolateGlobalState: true })`");
            }
        }, 1);
        return new MobXGlobals();
    }
    else if (global.__mobxGlobals) {
        global.__mobxInstanceCount += 1;
        if (!global.__mobxGlobals.UNCHANGED)
            global.__mobxGlobals.UNCHANGED = {};
        return global.__mobxGlobals;
    }
    else {
        global.__mobxInstanceCount = 1;
        return (global.__mobxGlobals = new MobXGlobals());
    }
})();
function isolateGlobalState() {
    if (globalState.pendingReactions.length ||
        globalState.inBatch ||
        globalState.isRunningReactions)
        fail("isolateGlobalState should be called before MobX is running any reactions");
    isolateCalled = true;
    if (canMergeGlobalState) {
        if (--getGlobal().__mobxInstanceCount === 0)
            getGlobal().__mobxGlobals = undefined;
        globalState = new MobXGlobals();
    }
}
function getGlobalState() {
    return globalState;
}
function resetGlobalState() {
    var defaultGlobals = new MobXGlobals();
    for (var key in defaultGlobals)
        if (persistentKeys.indexOf(key) === -1)
            globalState[key] = defaultGlobals[key];
    globalState.allowStateChanges = !globalState.enforceActions;
}
function hasObservers(observable) {
    return observable.observers && observable.observers.size > 0;
}
function getObservers(observable) {
    return observable.observers;
}
function addObserver(observable, node) {
    observable.observers.add(node);
    if (observable.lowestObserverState > node.dependenciesState)
        observable.lowestObserverState = node.dependenciesState;
}
function removeObserver(observable, node) {
    observable.observers.delete(node);
    if (observable.observers.size === 0) {
        queueForUnobservation(observable);
    }
}
function queueForUnobservation(observable) {
    if (observable.isPendingUnobservation === false) {
        observable.isPendingUnobservation = true;
        globalState.pendingUnobservations.push(observable);
    }
}
function startBatch() {
    globalState.inBatch++;
}
function endBatch() {
    if (--globalState.inBatch === 0) {
        runReactions();
        var list = globalState.pendingUnobservations;
        for (var i = 0; i < list.length; i++) {
            var observable = list[i];
            observable.isPendingUnobservation = false;
            if (observable.observers.size === 0) {
                if (observable.isBeingObserved) {
                    observable.isBeingObserved = false;
                    observable.onBecomeUnobserved();
                }
                if (observable instanceof ComputedValue) {
                    observable.suspend();
                }
            }
        }
        globalState.pendingUnobservations = [];
    }
}
function reportObserved(observable) {
    checkIfStateReadsAreAllowed(observable);
    var derivation = globalState.trackingDerivation;
    if (derivation !== null) {
        if (derivation.runId !== observable.lastAccessedBy) {
            observable.lastAccessedBy = derivation.runId;
            derivation.newObserving[derivation.unboundDepsCount++] = observable;
            if (!observable.isBeingObserved) {
                observable.isBeingObserved = true;
                observable.onBecomeObserved();
            }
        }
        return true;
    }
    else if (observable.observers.size === 0 && globalState.inBatch > 0) {
        queueForUnobservation(observable);
    }
    return false;
}
function propagateChanged(observable) {
    if (observable.lowestObserverState === exports.IDerivationState.STALE)
        return;
    observable.lowestObserverState = exports.IDerivationState.STALE;
    observable.observers.forEach(function (d) {
        if (d.dependenciesState === exports.IDerivationState.UP_TO_DATE) {
            if (d.isTracing !== TraceMode.NONE) {
                logTraceInfo(d, observable);
            }
            d.onBecomeStale();
        }
        d.dependenciesState = exports.IDerivationState.STALE;
    });
}
function propagateChangeConfirmed(observable) {
    if (observable.lowestObserverState === exports.IDerivationState.STALE)
        return;
    observable.lowestObserverState = exports.IDerivationState.STALE;
    observable.observers.forEach(function (d) {
        if (d.dependenciesState === exports.IDerivationState.POSSIBLY_STALE)
            d.dependenciesState = exports.IDerivationState.STALE;
        else if (d.dependenciesState === exports.IDerivationState.UP_TO_DATE)
            observable.lowestObserverState = exports.IDerivationState.UP_TO_DATE;
    });
}
function propagateMaybeChanged(observable) {
    if (observable.lowestObserverState !== exports.IDerivationState.UP_TO_DATE)
        return;
    observable.lowestObserverState = exports.IDerivationState.POSSIBLY_STALE;
    observable.observers.forEach(function (d) {
        if (d.dependenciesState === exports.IDerivationState.UP_TO_DATE) {
            d.dependenciesState = exports.IDerivationState.POSSIBLY_STALE;
            if (d.isTracing !== TraceMode.NONE) {
                logTraceInfo(d, observable);
            }
            d.onBecomeStale();
        }
    });
}
function logTraceInfo(derivation, observable) {
    console.log("[mobx.trace] '" + derivation.name + "' is invalidated due to a change in: '" + observable.name + "'");
    if (derivation.isTracing === TraceMode.BREAK) {
        var lines = [];
        printDepTree(getDependencyTree(derivation), lines, 1);
        new Function("debugger;\n/*\nTracing '" + derivation.name + "'\n\nYou are entering this break point because derivation '" + derivation.name + "' is being traced and '" + observable.name + "' is now forcing it to update.\nJust follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update\nThe stackframe you are looking for is at least ~6-8 stack-frames up.\n\n" + (derivation instanceof ComputedValue ? derivation.derivation.toString().replace(/[*]\//g, "/") : "") + "\n\nThe dependencies for this derivation are:\n\n" + lines.join("\n") + "\n*/\n    ")();
    }
}
function printDepTree(tree, lines, depth) {
    if (lines.length >= 1000) {
        lines.push("(and many more)");
        return;
    }
    lines.push("" + new Array(depth).join("\t") + tree.name);
    if (tree.dependencies)
        tree.dependencies.forEach(function (child) { return printDepTree(child, lines, depth + 1); });
}
var Reaction = (function () {
    function Reaction(name, onInvalidate, errorHandler, requiresObservable) {
        if (name === void 0) {
            name = "Reaction@" + getNextId();
        }
        if (requiresObservable === void 0) {
            requiresObservable = false;
        }
        this.name = name;
        this.onInvalidate = onInvalidate;
        this.errorHandler = errorHandler;
        this.requiresObservable = requiresObservable;
        this.observing = [];
        this.newObserving = [];
        this.dependenciesState = exports.IDerivationState.NOT_TRACKING;
        this.diffValue = 0;
        this.runId = 0;
        this.unboundDepsCount = 0;
        this.__mapid = "#" + getNextId();
        this.isDisposed = false;
        this._isScheduled = false;
        this._isTrackPending = false;
        this._isRunning = false;
        this.isTracing = TraceMode.NONE;
    }
    Reaction.prototype.onBecomeStale = function () {
        this.schedule();
    };
    Reaction.prototype.schedule = function () {
        if (!this._isScheduled) {
            this._isScheduled = true;
            globalState.pendingReactions.push(this);
            runReactions();
        }
    };
    Reaction.prototype.isScheduled = function () {
        return this._isScheduled;
    };
    Reaction.prototype.runReaction = function () {
        if (!this.isDisposed) {
            startBatch();
            this._isScheduled = false;
            if (shouldCompute(this)) {
                this._isTrackPending = true;
                try {
                    this.onInvalidate();
                    if (this._isTrackPending &&
                        isSpyEnabled() &&
                        "development" !== "production") {
                        spyReport({
                            name: this.name,
                            type: "scheduled-reaction"
                        });
                    }
                }
                catch (e) {
                    this.reportExceptionInDerivation(e);
                }
            }
            endBatch();
        }
    };
    Reaction.prototype.track = function (fn) {
        if (this.isDisposed) {
            return;
        }
        startBatch();
        var notify = isSpyEnabled();
        var startTime;
        if (notify && "development" !== "production") {
            startTime = Date.now();
            spyReportStart({
                name: this.name,
                type: "reaction"
            });
        }
        this._isRunning = true;
        var result = trackDerivedFunction(this, fn, undefined);
        this._isRunning = false;
        this._isTrackPending = false;
        if (this.isDisposed) {
            clearObserving(this);
        }
        if (isCaughtException(result))
            this.reportExceptionInDerivation(result.cause);
        if (notify && "development" !== "production") {
            spyReportEnd({
                time: Date.now() - startTime
            });
        }
        endBatch();
    };
    Reaction.prototype.reportExceptionInDerivation = function (error) {
        var _this = this;
        if (this.errorHandler) {
            this.errorHandler(error, this);
            return;
        }
        if (globalState.disableErrorBoundaries)
            throw error;
        var message = "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this + "'";
        if (globalState.suppressReactionErrors) {
            console.warn("[mobx] (error in reaction '" + this.name + "' suppressed, fix error of causing action below)");
        }
        else {
            console.error(message, error);
        }
        if (isSpyEnabled()) {
            spyReport({
                type: "error",
                name: this.name,
                message: message,
                error: "" + error
            });
        }
        globalState.globalReactionErrorHandlers.forEach(function (f) { return f(error, _this); });
    };
    Reaction.prototype.dispose = function () {
        if (!this.isDisposed) {
            this.isDisposed = true;
            if (!this._isRunning) {
                startBatch();
                clearObserving(this);
                endBatch();
            }
        }
    };
    Reaction.prototype.getDisposer = function () {
        var r = this.dispose.bind(this);
        r[$mobx] = this;
        return r;
    };
    Reaction.prototype.toString = function () {
        return "Reaction[" + this.name + "]";
    };
    Reaction.prototype.trace = function (enterBreakPoint) {
        if (enterBreakPoint === void 0) {
            enterBreakPoint = false;
        }
        trace(this, enterBreakPoint);
    };
    return Reaction;
}());
function onReactionError(handler) {
    globalState.globalReactionErrorHandlers.push(handler);
    return function () {
        var idx = globalState.globalReactionErrorHandlers.indexOf(handler);
        if (idx >= 0)
            globalState.globalReactionErrorHandlers.splice(idx, 1);
    };
}
var MAX_REACTION_ITERATIONS = 100;
var reactionScheduler = function (f) { return f(); };
function runReactions() {
    if (globalState.inBatch > 0 || globalState.isRunningReactions)
        return;
    reactionScheduler(runReactionsHelper);
}
function runReactionsHelper() {
    globalState.isRunningReactions = true;
    var allReactions = globalState.pendingReactions;
    var iterations = 0;
    while (allReactions.length > 0) {
        if (++iterations === MAX_REACTION_ITERATIONS) {
            console.error("Reaction doesn't converge to a stable state after " + MAX_REACTION_ITERATIONS + " iterations." +
                (" Probably there is a cycle in the reactive function: " + allReactions[0]));
            allReactions.splice(0);
        }
        var remainingReactions = allReactions.splice(0);
        for (var i = 0, l = remainingReactions.length; i < l; i++)
            remainingReactions[i].runReaction();
    }
    globalState.isRunningReactions = false;
}
var isReaction = createInstanceofPredicate("Reaction", Reaction);
function setReactionScheduler(fn) {
    var baseScheduler = reactionScheduler;
    reactionScheduler = function (f) { return fn(function () { return baseScheduler(f); }); };
}
function isSpyEnabled() {
    return !!globalState.spyListeners.length;
}
function spyReport(event) {
    if (!globalState.spyListeners.length)
        return;
    var listeners = globalState.spyListeners;
    for (var i = 0, l = listeners.length; i < l; i++)
        listeners[i](event);
}
function spyReportStart(event) {
    var change = __assign(__assign({}, event), { spyReportStart: true });
    spyReport(change);
}
var END_EVENT = { spyReportEnd: true };
function spyReportEnd(change) {
    if (change)
        spyReport(__assign(__assign({}, change), { spyReportEnd: true }));
    else
        spyReport(END_EVENT);
}
function spy(listener) {
    {
        globalState.spyListeners.push(listener);
        return once(function () {
            globalState.spyListeners = globalState.spyListeners.filter(function (l) { return l !== listener; });
        });
    }
}
function dontReassignFields() {
    fail("@action fields are not reassignable");
}
function namedActionDecorator(name) {
    return function (target, prop, descriptor) {
        if (descriptor) {
            if (descriptor.get !== undefined) {
                return fail("@action cannot be used with getters");
            }
            if (descriptor.value) {
                return {
                    value: createAction(name, descriptor.value),
                    enumerable: false,
                    configurable: true,
                    writable: true
                };
            }
            var initializer_1 = descriptor.initializer;
            return {
                enumerable: false,
                configurable: true,
                writable: true,
                initializer: function () {
                    return createAction(name, initializer_1.call(this));
                }
            };
        }
        return actionFieldDecorator(name).apply(this, arguments);
    };
}
function actionFieldDecorator(name) {
    return function (target, prop, descriptor) {
        Object.defineProperty(target, prop, {
            configurable: true,
            enumerable: false,
            get: function () {
                return undefined;
            },
            set: function (value) {
                addHiddenProp(this, prop, action(name, value));
            }
        });
    };
}
function boundActionDecorator(target, propertyName, descriptor, applyToInstance) {
    if (applyToInstance === true) {
        defineBoundAction(target, propertyName, descriptor.value);
        return null;
    }
    if (descriptor) {
        return {
            configurable: true,
            enumerable: false,
            get: function () {
                defineBoundAction(this, propertyName, descriptor.value || descriptor.initializer.call(this));
                return this[propertyName];
            },
            set: dontReassignFields
        };
    }
    return {
        enumerable: false,
        configurable: true,
        set: function (v) {
            defineBoundAction(this, propertyName, v);
        },
        get: function () {
            return undefined;
        }
    };
}
var action = function action(arg1, arg2, arg3, arg4) {
    if (arguments.length === 1 && typeof arg1 === "function")
        return createAction(arg1.name || "<unnamed action>", arg1);
    if (arguments.length === 2 && typeof arg2 === "function")
        return createAction(arg1, arg2);
    if (arguments.length === 1 && typeof arg1 === "string")
        return namedActionDecorator(arg1);
    if (arg4 === true) {
        addHiddenProp(arg1, arg2, createAction(arg1.name || arg2, arg3.value, this));
    }
    else {
        return namedActionDecorator(arg2).apply(null, arguments);
    }
};
action.bound = boundActionDecorator;
function runInAction(arg1, arg2) {
    var actionName = typeof arg1 === "string" ? arg1 : arg1.name || "<unnamed action>";
    var fn = typeof arg1 === "function" ? arg1 : arg2;
    {
        invariant(typeof fn === "function" && fn.length === 0, "`runInAction` expects a function without arguments");
        if (typeof actionName !== "string" || !actionName)
            fail("actions should have valid names, got: '" + actionName + "'");
    }
    return executeAction(actionName, fn, this, undefined);
}
function isAction(thing) {
    return typeof thing === "function" && thing.isMobxAction === true;
}
function defineBoundAction(target, propertyName, fn) {
    addHiddenProp(target, propertyName, createAction(propertyName, fn.bind(target)));
}
function autorun(view, opts) {
    if (opts === void 0) {
        opts = EMPTY_OBJECT;
    }
    {
        invariant(typeof view === "function", "Autorun expects a function as first argument");
        invariant(isAction(view) === false, "Autorun does not accept actions since actions are untrackable");
    }
    var name = (opts && opts.name) || view.name || "Autorun@" + getNextId();
    var runSync = !opts.scheduler && !opts.delay;
    var reaction;
    if (runSync) {
        reaction = new Reaction(name, function () {
            this.track(reactionRunner);
        }, opts.onError, opts.requiresObservable);
    }
    else {
        var scheduler_1 = createSchedulerFromOptions(opts);
        var isScheduled_1 = false;
        reaction = new Reaction(name, function () {
            if (!isScheduled_1) {
                isScheduled_1 = true;
                scheduler_1(function () {
                    isScheduled_1 = false;
                    if (!reaction.isDisposed)
                        reaction.track(reactionRunner);
                });
            }
        }, opts.onError, opts.requiresObservable);
    }
    function reactionRunner() {
        view(reaction);
    }
    reaction.schedule();
    return reaction.getDisposer();
}
var run = function (f) { return f(); };
function createSchedulerFromOptions(opts) {
    return opts.scheduler
        ? opts.scheduler
        : opts.delay
            ? function (f) { return setTimeout(f, opts.delay); }
            : run;
}
function reaction(expression, effect, opts) {
    if (opts === void 0) {
        opts = EMPTY_OBJECT;
    }
    {
        invariant(typeof expression === "function", "First argument to reaction should be a function");
        invariant(typeof opts === "object", "Third argument of reactions should be an object");
    }
    var name = opts.name || "Reaction@" + getNextId();
    var effectAction = action(name, opts.onError ? wrapErrorHandler(opts.onError, effect) : effect);
    var runSync = !opts.scheduler && !opts.delay;
    var scheduler = createSchedulerFromOptions(opts);
    var firstTime = true;
    var isScheduled = false;
    var value;
    var equals = opts.compareStructural
        ? comparer.structural
        : opts.equals || comparer.default;
    var r = new Reaction(name, function () {
        if (firstTime || runSync) {
            reactionRunner();
        }
        else if (!isScheduled) {
            isScheduled = true;
            scheduler(reactionRunner);
        }
    }, opts.onError, opts.requiresObservable);
    function reactionRunner() {
        isScheduled = false;
        if (r.isDisposed)
            return;
        var changed = false;
        r.track(function () {
            var nextValue = expression(r);
            changed = firstTime || !equals(value, nextValue);
            value = nextValue;
        });
        if (firstTime && opts.fireImmediately)
            effectAction(value, r);
        if (!firstTime && changed === true)
            effectAction(value, r);
        if (firstTime)
            firstTime = false;
    }
    r.schedule();
    return r.getDisposer();
}
function wrapErrorHandler(errorHandler, baseFn) {
    return function () {
        try {
            return baseFn.apply(this, arguments);
        }
        catch (e) {
            errorHandler.call(this, e);
        }
    };
}
function onBecomeObserved(thing, arg2, arg3) {
    return interceptHook("onBecomeObserved", thing, arg2, arg3);
}
function onBecomeUnobserved(thing, arg2, arg3) {
    return interceptHook("onBecomeUnobserved", thing, arg2, arg3);
}
function interceptHook(hook, thing, arg2, arg3) {
    var atom = typeof arg3 === "function" ? getAtom(thing, arg2) : getAtom(thing);
    var cb = typeof arg3 === "function" ? arg3 : arg2;
    var listenersKey = hook + "Listeners";
    if (atom[listenersKey]) {
        atom[listenersKey].add(cb);
    }
    else {
        atom[listenersKey] = new Set([cb]);
    }
    var orig = atom[hook];
    if (typeof orig !== "function")
        return fail("Not an atom that can be (un)observed");
    return function () {
        var hookListeners = atom[listenersKey];
        if (hookListeners) {
            hookListeners.delete(cb);
            if (hookListeners.size === 0) {
                delete atom[listenersKey];
            }
        }
    };
}
function configure(options) {
    var enforceActions = options.enforceActions, computedRequiresReaction = options.computedRequiresReaction, computedConfigurable = options.computedConfigurable, disableErrorBoundaries = options.disableErrorBoundaries, reactionScheduler = options.reactionScheduler, reactionRequiresObservable = options.reactionRequiresObservable, observableRequiresReaction = options.observableRequiresReaction;
    if (options.isolateGlobalState === true) {
        isolateGlobalState();
    }
    if (enforceActions !== undefined) {
        if (typeof enforceActions === "boolean" || enforceActions === "strict")
            deprecated("Deprecated value for 'enforceActions', use 'false' => '\"never\"', 'true' => '\"observed\"', '\"strict\"' => \"'always'\" instead");
        var ea = void 0;
        switch (enforceActions) {
            case true:
            case "observed":
                ea = true;
                break;
            case false:
            case "never":
                ea = false;
                break;
            case "strict":
            case "always":
                ea = "strict";
                break;
            default:
                fail("Invalid value for 'enforceActions': '" + enforceActions + "', expected 'never', 'always' or 'observed'");
        }
        globalState.enforceActions = ea;
        globalState.allowStateChanges = ea === true || ea === "strict" ? false : true;
    }
    if (computedRequiresReaction !== undefined) {
        globalState.computedRequiresReaction = !!computedRequiresReaction;
    }
    if (reactionRequiresObservable !== undefined) {
        globalState.reactionRequiresObservable = !!reactionRequiresObservable;
    }
    if (observableRequiresReaction !== undefined) {
        globalState.observableRequiresReaction = !!observableRequiresReaction;
        globalState.allowStateReads = !globalState.observableRequiresReaction;
    }
    if (computedConfigurable !== undefined) {
        globalState.computedConfigurable = !!computedConfigurable;
    }
    if (disableErrorBoundaries !== undefined) {
        if (disableErrorBoundaries === true)
            console.warn("WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled.");
        globalState.disableErrorBoundaries = !!disableErrorBoundaries;
    }
    if (reactionScheduler) {
        setReactionScheduler(reactionScheduler);
    }
}
function decorate(thing, decorators) {
    invariant(isPlainObject(decorators), "Decorators should be a key value map");
    var target = typeof thing === "function" ? thing.prototype : thing;
    var _loop_1 = function (prop) {
        var propertyDecorators = decorators[prop];
        if (!Array.isArray(propertyDecorators)) {
            propertyDecorators = [propertyDecorators];
        }
        invariant(propertyDecorators.every(function (decorator) { return typeof decorator === "function"; }), "Decorate: expected a decorator function or array of decorator functions for '" + prop + "'");
        var descriptor = Object.getOwnPropertyDescriptor(target, prop);
        var newDescriptor = propertyDecorators.reduce(function (accDescriptor, decorator) { return decorator(target, prop, accDescriptor); }, descriptor);
        if (newDescriptor)
            Object.defineProperty(target, prop, newDescriptor);
    };
    for (var prop in decorators) {
        _loop_1(prop);
    }
    return thing;
}
function extendObservable(target, properties, decorators, options) {
    {
        invariant(arguments.length >= 2 && arguments.length <= 4, "'extendObservable' expected 2-4 arguments");
        invariant(typeof target === "object", "'extendObservable' expects an object as first argument");
        invariant(!isObservableMap(target), "'extendObservable' should not be used on maps, use map.merge instead");
    }
    options = asCreateObservableOptions(options);
    var defaultDecorator = getDefaultDecoratorFromObjectOptions(options);
    initializeInstance(target);
    asObservableObject(target, options.name, defaultDecorator.enhancer);
    if (properties)
        extendObservableObjectWithProperties(target, properties, decorators, defaultDecorator);
    return target;
}
function getDefaultDecoratorFromObjectOptions(options) {
    return options.defaultDecorator || (options.deep === false ? refDecorator : deepDecorator);
}
function extendObservableObjectWithProperties(target, properties, decorators, defaultDecorator) {
    var e_1, _a, e_2, _b;
    {
        invariant(!isObservable(properties), "Extending an object with another observable (object) is not supported. Please construct an explicit propertymap, using `toJS` if need. See issue #540");
        if (decorators) {
            var keys = getPlainObjectKeys(decorators);
            try {
                for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                    var key = keys_1_1.value;
                    if (!(key in properties))
                        fail("Trying to declare a decorator for unspecified property '" + stringifyKey(key) + "'");
                }
            }
            catch (e_1_1) {
                e_1 = { error: e_1_1 };
            }
            finally {
                try {
                    if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return))
                        _a.call(keys_1);
                }
                finally {
                    if (e_1)
                        throw e_1.error;
                }
            }
        }
    }
    startBatch();
    try {
        var keys = ownKeys(properties);
        try {
            for (var keys_2 = __values(keys), keys_2_1 = keys_2.next(); !keys_2_1.done; keys_2_1 = keys_2.next()) {
                var key = keys_2_1.value;
                var descriptor = Object.getOwnPropertyDescriptor(properties, key);
                if ("development" !== "production") {
                    if (!isPlainObject(properties))
                        fail("'extendObservable' only accepts plain objects as second argument");
                    if (isComputed(descriptor.value))
                        fail("Passing a 'computed' as initial property value is no longer supported by extendObservable. Use a getter or decorator instead");
                }
                var decorator = decorators && key in decorators
                    ? decorators[key]
                    : descriptor.get
                        ? computedDecorator
                        : defaultDecorator;
                if ("development" !== "production" && typeof decorator !== "function")
                    fail("Not a valid decorator for '" + stringifyKey(key) + "', got: " + decorator);
                var resultDescriptor = decorator(target, key, descriptor, true);
                if (resultDescriptor)
                    Object.defineProperty(target, key, resultDescriptor);
            }
        }
        catch (e_2_1) {
            e_2 = { error: e_2_1 };
        }
        finally {
            try {
                if (keys_2_1 && !keys_2_1.done && (_b = keys_2.return))
                    _b.call(keys_2);
            }
            finally {
                if (e_2)
                    throw e_2.error;
            }
        }
    }
    finally {
        endBatch();
    }
}
function getDependencyTree(thing, property) {
    return nodeToDependencyTree(getAtom(thing, property));
}
function nodeToDependencyTree(node) {
    var result = {
        name: node.name
    };
    if (node.observing && node.observing.length > 0)
        result.dependencies = unique(node.observing).map(nodeToDependencyTree);
    return result;
}
function getObserverTree(thing, property) {
    return nodeToObserverTree(getAtom(thing, property));
}
function nodeToObserverTree(node) {
    var result = {
        name: node.name
    };
    if (hasObservers(node))
        result.observers = Array.from(getObservers(node)).map(nodeToObserverTree);
    return result;
}
var generatorId = 0;
function FlowCancellationError() {
    this.message = "FLOW_CANCELLED";
}
FlowCancellationError.prototype = Object.create(Error.prototype);
function isFlowCancellationError(error) {
    return error instanceof FlowCancellationError;
}
function flow(generator) {
    if (arguments.length !== 1)
        fail("Flow expects 1 argument and cannot be used as decorator");
    var name = generator.name || "<unnamed flow>";
    return function () {
        var ctx = this;
        var args = arguments;
        var runId = ++generatorId;
        var gen = action(name + " - runid: " + runId + " - init", generator).apply(ctx, args);
        var rejector;
        var pendingPromise = undefined;
        var promise = new Promise(function (resolve, reject) {
            var stepId = 0;
            rejector = reject;
            function onFulfilled(res) {
                pendingPromise = undefined;
                var ret;
                try {
                    ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen.next).call(gen, res);
                }
                catch (e) {
                    return reject(e);
                }
                next(ret);
            }
            function onRejected(err) {
                pendingPromise = undefined;
                var ret;
                try {
                    ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen.throw).call(gen, err);
                }
                catch (e) {
                    return reject(e);
                }
                next(ret);
            }
            function next(ret) {
                if (ret && typeof ret.then === "function") {
                    ret.then(next, reject);
                    return;
                }
                if (ret.done)
                    return resolve(ret.value);
                pendingPromise = Promise.resolve(ret.value);
                return pendingPromise.then(onFulfilled, onRejected);
            }
            onFulfilled(undefined);
        });
        promise.cancel = action(name + " - runid: " + runId + " - cancel", function () {
            try {
                if (pendingPromise)
                    cancelPromise(pendingPromise);
                var res = gen.return(undefined);
                var yieldedPromise = Promise.resolve(res.value);
                yieldedPromise.then(noop, noop);
                cancelPromise(yieldedPromise);
                rejector(new FlowCancellationError());
            }
            catch (e) {
                rejector(e);
            }
        });
        return promise;
    };
}
function cancelPromise(promise) {
    if (typeof promise.cancel === "function")
        promise.cancel();
}
function interceptReads(thing, propOrHandler, handler) {
    var target;
    if (isObservableMap(thing) || isObservableArray(thing) || isObservableValue(thing)) {
        target = getAdministration(thing);
    }
    else if (isObservableObject(thing)) {
        if (typeof propOrHandler !== "string")
            return fail("InterceptReads can only be used with a specific property, not with an object in general");
        target = getAdministration(thing, propOrHandler);
    }
    else {
        return fail("Expected observable map, object or array as first array");
    }
    if (target.dehancer !== undefined)
        return fail("An intercept reader was already established");
    target.dehancer = typeof propOrHandler === "function" ? propOrHandler : handler;
    return function () {
        target.dehancer = undefined;
    };
}
function intercept(thing, propOrHandler, handler) {
    if (typeof handler === "function")
        return interceptProperty(thing, propOrHandler, handler);
    else
        return interceptInterceptable(thing, propOrHandler);
}
function interceptInterceptable(thing, handler) {
    return getAdministration(thing).intercept(handler);
}
function interceptProperty(thing, property, handler) {
    return getAdministration(thing, property).intercept(handler);
}
function _isComputed(value, property) {
    if (value === null || value === undefined)
        return false;
    if (property !== undefined) {
        if (isObservableObject(value) === false)
            return false;
        if (!value[$mobx].values.has(property))
            return false;
        var atom = getAtom(value, property);
        return isComputedValue(atom);
    }
    return isComputedValue(value);
}
function isComputed(value) {
    if (arguments.length > 1)
        return fail("isComputed expects only 1 argument. Use isObservableProp to inspect the observability of a property");
    return _isComputed(value);
}
function isComputedProp(value, propName) {
    if (typeof propName !== "string")
        return fail("isComputed expected a property name as second argument");
    return _isComputed(value, propName);
}
function _isObservable(value, property) {
    if (value === null || value === undefined)
        return false;
    if (property !== undefined) {
        if ((isObservableMap(value) || isObservableArray(value)))
            return fail("isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.");
        if (isObservableObject(value)) {
            return value[$mobx].values.has(property);
        }
        return false;
    }
    return (isObservableObject(value) ||
        !!value[$mobx] ||
        isAtom(value) ||
        isReaction(value) ||
        isComputedValue(value));
}
function isObservable(value) {
    if (arguments.length !== 1)
        fail("isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property");
    return _isObservable(value);
}
function isObservableProp(value, propName) {
    if (typeof propName !== "string")
        return fail("expected a property name as second argument");
    return _isObservable(value, propName);
}
function keys(obj) {
    if (isObservableObject(obj)) {
        return obj[$mobx].getKeys();
    }
    if (isObservableMap(obj)) {
        return Array.from(obj.keys());
    }
    if (isObservableSet(obj)) {
        return Array.from(obj.keys());
    }
    if (isObservableArray(obj)) {
        return obj.map(function (_, index) { return index; });
    }
    return fail("'keys()' can only be used on observable objects, arrays, sets and maps");
}
function values(obj) {
    if (isObservableObject(obj)) {
        return keys(obj).map(function (key) { return obj[key]; });
    }
    if (isObservableMap(obj)) {
        return keys(obj).map(function (key) { return obj.get(key); });
    }
    if (isObservableSet(obj)) {
        return Array.from(obj.values());
    }
    if (isObservableArray(obj)) {
        return obj.slice();
    }
    return fail("'values()' can only be used on observable objects, arrays, sets and maps");
}
function entries(obj) {
    if (isObservableObject(obj)) {
        return keys(obj).map(function (key) { return [key, obj[key]]; });
    }
    if (isObservableMap(obj)) {
        return keys(obj).map(function (key) { return [key, obj.get(key)]; });
    }
    if (isObservableSet(obj)) {
        return Array.from(obj.entries());
    }
    if (isObservableArray(obj)) {
        return obj.map(function (key, index) { return [index, key]; });
    }
    return fail("'entries()' can only be used on observable objects, arrays and maps");
}
function set(obj, key, value) {
    if (arguments.length === 2 && !isObservableSet(obj)) {
        startBatch();
        var values_1 = key;
        try {
            for (var key_1 in values_1)
                set(obj, key_1, values_1[key_1]);
        }
        finally {
            endBatch();
        }
        return;
    }
    if (isObservableObject(obj)) {
        var adm = obj[$mobx];
        var existingObservable = adm.values.get(key);
        if (existingObservable) {
            adm.write(key, value);
        }
        else {
            adm.addObservableProp(key, value, adm.defaultEnhancer);
        }
    }
    else if (isObservableMap(obj)) {
        obj.set(key, value);
    }
    else if (isObservableSet(obj)) {
        obj.add(key);
    }
    else if (isObservableArray(obj)) {
        if (typeof key !== "number")
            key = parseInt(key, 10);
        invariant(key >= 0, "Not a valid index: '" + key + "'");
        startBatch();
        if (key >= obj.length)
            obj.length = key + 1;
        obj[key] = value;
        endBatch();
    }
    else {
        return fail("'set()' can only be used on observable objects, arrays and maps");
    }
}
function remove(obj, key) {
    if (isObservableObject(obj)) {
        obj[$mobx].remove(key);
    }
    else if (isObservableMap(obj)) {
        obj.delete(key);
    }
    else if (isObservableSet(obj)) {
        obj.delete(key);
    }
    else if (isObservableArray(obj)) {
        if (typeof key !== "number")
            key = parseInt(key, 10);
        invariant(key >= 0, "Not a valid index: '" + key + "'");
        obj.splice(key, 1);
    }
    else {
        return fail("'remove()' can only be used on observable objects, arrays and maps");
    }
}
function has(obj, key) {
    if (isObservableObject(obj)) {
        var adm = getAdministration(obj);
        return adm.has(key);
    }
    else if (isObservableMap(obj)) {
        return obj.has(key);
    }
    else if (isObservableSet(obj)) {
        return obj.has(key);
    }
    else if (isObservableArray(obj)) {
        return key >= 0 && key < obj.length;
    }
    else {
        return fail("'has()' can only be used on observable objects, arrays and maps");
    }
}
function get(obj, key) {
    if (!has(obj, key))
        return undefined;
    if (isObservableObject(obj)) {
        return obj[key];
    }
    else if (isObservableMap(obj)) {
        return obj.get(key);
    }
    else if (isObservableArray(obj)) {
        return obj[key];
    }
    else {
        return fail("'get()' can only be used on observable objects, arrays and maps");
    }
}
function observe(thing, propOrCb, cbOrFire, fireImmediately) {
    if (typeof cbOrFire === "function")
        return observeObservableProperty(thing, propOrCb, cbOrFire, fireImmediately);
    else
        return observeObservable(thing, propOrCb, cbOrFire);
}
function observeObservable(thing, listener, fireImmediately) {
    return getAdministration(thing).observe(listener, fireImmediately);
}
function observeObservableProperty(thing, property, listener, fireImmediately) {
    return getAdministration(thing, property).observe(listener, fireImmediately);
}
var defaultOptions = {
    detectCycles: true,
    exportMapsAsObjects: true,
    recurseEverything: false
};
function cache(map, key, value, options) {
    if (options.detectCycles)
        map.set(key, value);
    return value;
}
function toJSHelper(source, options, __alreadySeen) {
    if (!options.recurseEverything && !isObservable(source))
        return source;
    if (typeof source !== "object")
        return source;
    if (source === null)
        return null;
    if (source instanceof Date)
        return source;
    if (isObservableValue(source))
        return toJSHelper(source.get(), options, __alreadySeen);
    if (isObservable(source))
        keys(source);
    var detectCycles = options.detectCycles === true;
    if (detectCycles && source !== null && __alreadySeen.has(source)) {
        return __alreadySeen.get(source);
    }
    if (isObservableArray(source) || Array.isArray(source)) {
        var res_1 = cache(__alreadySeen, source, [], options);
        var toAdd = source.map(function (value) { return toJSHelper(value, options, __alreadySeen); });
        res_1.length = toAdd.length;
        for (var i = 0, l = toAdd.length; i < l; i++)
            res_1[i] = toAdd[i];
        return res_1;
    }
    if (isObservableSet(source) || Object.getPrototypeOf(source) === Set.prototype) {
        if (options.exportMapsAsObjects === false) {
            var res_2 = cache(__alreadySeen, source, new Set(), options);
            source.forEach(function (value) {
                res_2.add(toJSHelper(value, options, __alreadySeen));
            });
            return res_2;
        }
        else {
            var res_3 = cache(__alreadySeen, source, [], options);
            source.forEach(function (value) {
                res_3.push(toJSHelper(value, options, __alreadySeen));
            });
            return res_3;
        }
    }
    if (isObservableMap(source) || Object.getPrototypeOf(source) === Map.prototype) {
        if (options.exportMapsAsObjects === false) {
            var res_4 = cache(__alreadySeen, source, new Map(), options);
            source.forEach(function (value, key) {
                res_4.set(key, toJSHelper(value, options, __alreadySeen));
            });
            return res_4;
        }
        else {
            var res_5 = cache(__alreadySeen, source, {}, options);
            source.forEach(function (value, key) {
                res_5[key] = toJSHelper(value, options, __alreadySeen);
            });
            return res_5;
        }
    }
    var res = cache(__alreadySeen, source, {}, options);
    getPlainObjectKeys(source).forEach(function (key) {
        res[key] = toJSHelper(source[key], options, __alreadySeen);
    });
    return res;
}
function toJS(source, options) {
    if (typeof options === "boolean")
        options = { detectCycles: options };
    if (!options)
        options = defaultOptions;
    options.detectCycles =
        options.detectCycles === undefined
            ? options.recurseEverything === true
            : options.detectCycles === true;
    var __alreadySeen;
    if (options.detectCycles)
        __alreadySeen = new Map();
    return toJSHelper(source, options, __alreadySeen);
}
function trace() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var enterBreakPoint = false;
    if (typeof args[args.length - 1] === "boolean")
        enterBreakPoint = args.pop();
    var derivation = getAtomFromArgs(args);
    if (!derivation) {
        return fail("'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
    }
    if (derivation.isTracing === TraceMode.NONE) {
        console.log("[mobx.trace] '" + derivation.name + "' tracing enabled");
    }
    derivation.isTracing = enterBreakPoint ? TraceMode.BREAK : TraceMode.LOG;
}
function getAtomFromArgs(args) {
    switch (args.length) {
        case 0:
            return globalState.trackingDerivation;
        case 1:
            return getAtom(args[0]);
        case 2:
            return getAtom(args[0], args[1]);
    }
}
function transaction(action, thisArg) {
    if (thisArg === void 0) {
        thisArg = undefined;
    }
    startBatch();
    try {
        return action.apply(thisArg);
    }
    finally {
        endBatch();
    }
}
function when(predicate, arg1, arg2) {
    if (arguments.length === 1 || (arg1 && typeof arg1 === "object"))
        return whenPromise(predicate, arg1);
    return _when(predicate, arg1, arg2 || {});
}
function _when(predicate, effect, opts) {
    var timeoutHandle;
    if (typeof opts.timeout === "number") {
        timeoutHandle = setTimeout(function () {
            if (!disposer[$mobx].isDisposed) {
                disposer();
                var error = new Error("WHEN_TIMEOUT");
                if (opts.onError)
                    opts.onError(error);
                else
                    throw error;
            }
        }, opts.timeout);
    }
    opts.name = opts.name || "When@" + getNextId();
    var effectAction = createAction(opts.name + "-effect", effect);
    var disposer = autorun(function (r) {
        if (predicate()) {
            r.dispose();
            if (timeoutHandle)
                clearTimeout(timeoutHandle);
            effectAction();
        }
    }, opts);
    return disposer;
}
function whenPromise(predicate, opts) {
    if (opts && opts.onError)
        return fail("the options 'onError' and 'promise' cannot be combined");
    var cancel;
    var res = new Promise(function (resolve, reject) {
        var disposer = _when(predicate, resolve, __assign(__assign({}, opts), { onError: reject }));
        cancel = function () {
            disposer();
            reject("WHEN_CANCELLED");
        };
    });
    res.cancel = cancel;
    return res;
}
function getAdm(target) {
    return target[$mobx];
}
function isPropertyKey(val) {
    return typeof val === "string" || typeof val === "number" || typeof val === "symbol";
}
var objectProxyTraps = {
    has: function (target, name) {
        if (name === $mobx || name === "constructor" || name === mobxDidRunLazyInitializersSymbol)
            return true;
        var adm = getAdm(target);
        if (isPropertyKey(name))
            return adm.has(name);
        return name in target;
    },
    get: function (target, name) {
        if (name === $mobx || name === "constructor" || name === mobxDidRunLazyInitializersSymbol)
            return target[name];
        var adm = getAdm(target);
        var observable = adm.values.get(name);
        if (observable instanceof Atom) {
            var result = observable.get();
            if (result === undefined) {
                adm.has(name);
            }
            return result;
        }
        if (isPropertyKey(name))
            adm.has(name);
        return target[name];
    },
    set: function (target, name, value) {
        if (!isPropertyKey(name))
            return false;
        set(target, name, value);
        return true;
    },
    deleteProperty: function (target, name) {
        if (!isPropertyKey(name))
            return false;
        var adm = getAdm(target);
        adm.remove(name);
        return true;
    },
    ownKeys: function (target) {
        var adm = getAdm(target);
        adm.keysAtom.reportObserved();
        return Reflect.ownKeys(target);
    },
    preventExtensions: function (target) {
        fail("Dynamic observable objects cannot be frozen");
        return false;
    }
};
function createDynamicObservableObject(base) {
    var proxy = new Proxy(base, objectProxyTraps);
    base[$mobx].proxy = proxy;
    return proxy;
}
function hasInterceptors(interceptable) {
    return interceptable.interceptors !== undefined && interceptable.interceptors.length > 0;
}
function registerInterceptor(interceptable, handler) {
    var interceptors = interceptable.interceptors || (interceptable.interceptors = []);
    interceptors.push(handler);
    return once(function () {
        var idx = interceptors.indexOf(handler);
        if (idx !== -1)
            interceptors.splice(idx, 1);
    });
}
function interceptChange(interceptable, change) {
    var prevU = untrackedStart();
    try {
        var interceptors = __spread((interceptable.interceptors || []));
        for (var i = 0, l = interceptors.length; i < l; i++) {
            change = interceptors[i](change);
            invariant(!change || change.type, "Intercept handlers should return nothing or a change object");
            if (!change)
                break;
        }
        return change;
    }
    finally {
        untrackedEnd(prevU);
    }
}
function hasListeners(listenable) {
    return listenable.changeListeners !== undefined && listenable.changeListeners.length > 0;
}
function registerListener(listenable, handler) {
    var listeners = listenable.changeListeners || (listenable.changeListeners = []);
    listeners.push(handler);
    return once(function () {
        var idx = listeners.indexOf(handler);
        if (idx !== -1)
            listeners.splice(idx, 1);
    });
}
function notifyListeners(listenable, change) {
    var prevU = untrackedStart();
    var listeners = listenable.changeListeners;
    if (!listeners)
        return;
    listeners = listeners.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i](change);
    }
    untrackedEnd(prevU);
}
var MAX_SPLICE_SIZE = 10000;
var arrayTraps = {
    get: function (target, name) {
        if (name === $mobx)
            return target[$mobx];
        if (name === "length")
            return target[$mobx].getArrayLength();
        if (typeof name === "number") {
            return arrayExtensions.get.call(target, name);
        }
        if (typeof name === "string" && !isNaN(name)) {
            return arrayExtensions.get.call(target, parseInt(name));
        }
        if (arrayExtensions.hasOwnProperty(name)) {
            return arrayExtensions[name];
        }
        return target[name];
    },
    set: function (target, name, value) {
        if (name === "length") {
            target[$mobx].setArrayLength(value);
        }
        if (typeof name === "number") {
            arrayExtensions.set.call(target, name, value);
        }
        if (typeof name === "symbol" || isNaN(name)) {
            target[name] = value;
        }
        else {
            arrayExtensions.set.call(target, parseInt(name), value);
        }
        return true;
    },
    preventExtensions: function (target) {
        fail("Observable arrays cannot be frozen");
        return false;
    }
};
function createObservableArray(initialValues, enhancer, name, owned) {
    if (name === void 0) {
        name = "ObservableArray@" + getNextId();
    }
    if (owned === void 0) {
        owned = false;
    }
    var adm = new ObservableArrayAdministration(name, enhancer, owned);
    addHiddenFinalProp(adm.values, $mobx, adm);
    var proxy = new Proxy(adm.values, arrayTraps);
    adm.proxy = proxy;
    if (initialValues && initialValues.length) {
        var prev = allowStateChangesStart(true);
        adm.spliceWithArray(0, 0, initialValues);
        allowStateChangesEnd(prev);
    }
    return proxy;
}
var ObservableArrayAdministration = (function () {
    function ObservableArrayAdministration(name, enhancer, owned) {
        this.owned = owned;
        this.values = [];
        this.proxy = undefined;
        this.lastKnownLength = 0;
        this.atom = new Atom(name || "ObservableArray@" + getNextId());
        this.enhancer = function (newV, oldV) { return enhancer(newV, oldV, name + "[..]"); };
    }
    ObservableArrayAdministration.prototype.dehanceValue = function (value) {
        if (this.dehancer !== undefined)
            return this.dehancer(value);
        return value;
    };
    ObservableArrayAdministration.prototype.dehanceValues = function (values) {
        if (this.dehancer !== undefined && values.length > 0)
            return values.map(this.dehancer);
        return values;
    };
    ObservableArrayAdministration.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    ObservableArrayAdministration.prototype.observe = function (listener, fireImmediately) {
        if (fireImmediately === void 0) {
            fireImmediately = false;
        }
        if (fireImmediately) {
            listener({
                object: this.proxy,
                type: "splice",
                index: 0,
                added: this.values.slice(),
                addedCount: this.values.length,
                removed: [],
                removedCount: 0
            });
        }
        return registerListener(this, listener);
    };
    ObservableArrayAdministration.prototype.getArrayLength = function () {
        this.atom.reportObserved();
        return this.values.length;
    };
    ObservableArrayAdministration.prototype.setArrayLength = function (newLength) {
        if (typeof newLength !== "number" || newLength < 0)
            throw new Error("[mobx.array] Out of range: " + newLength);
        var currentLength = this.values.length;
        if (newLength === currentLength)
            return;
        else if (newLength > currentLength) {
            var newItems = new Array(newLength - currentLength);
            for (var i = 0; i < newLength - currentLength; i++)
                newItems[i] = undefined;
            this.spliceWithArray(currentLength, 0, newItems);
        }
        else
            this.spliceWithArray(newLength, currentLength - newLength);
    };
    ObservableArrayAdministration.prototype.updateArrayLength = function (oldLength, delta) {
        if (oldLength !== this.lastKnownLength)
            throw new Error("[mobx] Modification exception: the internal structure of an observable array was changed.");
        this.lastKnownLength += delta;
    };
    ObservableArrayAdministration.prototype.spliceWithArray = function (index, deleteCount, newItems) {
        var _this = this;
        checkIfStateModificationsAreAllowed(this.atom);
        var length = this.values.length;
        if (index === undefined)
            index = 0;
        else if (index > length)
            index = length;
        else if (index < 0)
            index = Math.max(0, length + index);
        if (arguments.length === 1)
            deleteCount = length - index;
        else if (deleteCount === undefined || deleteCount === null)
            deleteCount = 0;
        else
            deleteCount = Math.max(0, Math.min(deleteCount, length - index));
        if (newItems === undefined)
            newItems = EMPTY_ARRAY;
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                object: this.proxy,
                type: "splice",
                index: index,
                removedCount: deleteCount,
                added: newItems
            });
            if (!change)
                return EMPTY_ARRAY;
            deleteCount = change.removedCount;
            newItems = change.added;
        }
        newItems = newItems.length === 0 ? newItems : newItems.map(function (v) { return _this.enhancer(v, undefined); });
        {
            var lengthDelta = newItems.length - deleteCount;
            this.updateArrayLength(length, lengthDelta);
        }
        var res = this.spliceItemsIntoValues(index, deleteCount, newItems);
        if (deleteCount !== 0 || newItems.length !== 0)
            this.notifyArraySplice(index, newItems, res);
        return this.dehanceValues(res);
    };
    ObservableArrayAdministration.prototype.spliceItemsIntoValues = function (index, deleteCount, newItems) {
        var _a;
        if (newItems.length < MAX_SPLICE_SIZE) {
            return (_a = this.values).splice.apply(_a, __spread([index, deleteCount], newItems));
        }
        else {
            var res = this.values.slice(index, index + deleteCount);
            this.values = this.values
                .slice(0, index)
                .concat(newItems, this.values.slice(index + deleteCount));
            return res;
        }
    };
    ObservableArrayAdministration.prototype.notifyArrayChildUpdate = function (index, newValue, oldValue) {
        var notifySpy = !this.owned && isSpyEnabled();
        var notify = hasListeners(this);
        var change = notify || notifySpy
            ? {
                object: this.proxy,
                type: "update",
                index: index,
                newValue: newValue,
                oldValue: oldValue
            }
            : null;
        if (notifySpy && "development" !== "production")
            spyReportStart(__assign(__assign({}, change), { name: this.atom.name }));
        this.atom.reportChanged();
        if (notify)
            notifyListeners(this, change);
        if (notifySpy && "development" !== "production")
            spyReportEnd();
    };
    ObservableArrayAdministration.prototype.notifyArraySplice = function (index, added, removed) {
        var notifySpy = !this.owned && isSpyEnabled();
        var notify = hasListeners(this);
        var change = notify || notifySpy
            ? {
                object: this.proxy,
                type: "splice",
                index: index,
                removed: removed,
                added: added,
                removedCount: removed.length,
                addedCount: added.length
            }
            : null;
        if (notifySpy && "development" !== "production")
            spyReportStart(__assign(__assign({}, change), { name: this.atom.name }));
        this.atom.reportChanged();
        if (notify)
            notifyListeners(this, change);
        if (notifySpy && "development" !== "production")
            spyReportEnd();
    };
    return ObservableArrayAdministration;
}());
var arrayExtensions = {
    intercept: function (handler) {
        return this[$mobx].intercept(handler);
    },
    observe: function (listener, fireImmediately) {
        if (fireImmediately === void 0) {
            fireImmediately = false;
        }
        var adm = this[$mobx];
        return adm.observe(listener, fireImmediately);
    },
    clear: function () {
        return this.splice(0);
    },
    replace: function (newItems) {
        var adm = this[$mobx];
        return adm.spliceWithArray(0, adm.values.length, newItems);
    },
    toJS: function () {
        return this.slice();
    },
    toJSON: function () {
        return this.toJS();
    },
    splice: function (index, deleteCount) {
        var newItems = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            newItems[_i - 2] = arguments[_i];
        }
        var adm = this[$mobx];
        switch (arguments.length) {
            case 0:
                return [];
            case 1:
                return adm.spliceWithArray(index);
            case 2:
                return adm.spliceWithArray(index, deleteCount);
        }
        return adm.spliceWithArray(index, deleteCount, newItems);
    },
    spliceWithArray: function (index, deleteCount, newItems) {
        var adm = this[$mobx];
        return adm.spliceWithArray(index, deleteCount, newItems);
    },
    push: function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var adm = this[$mobx];
        adm.spliceWithArray(adm.values.length, 0, items);
        return adm.values.length;
    },
    pop: function () {
        return this.splice(Math.max(this[$mobx].values.length - 1, 0), 1)[0];
    },
    shift: function () {
        return this.splice(0, 1)[0];
    },
    unshift: function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var adm = this[$mobx];
        adm.spliceWithArray(0, 0, items);
        return adm.values.length;
    },
    reverse: function () {
        {
            console.warn("[mobx] `observableArray.reverse()` will not update the array in place. Use `observableArray.slice().reverse()` to suppress this warning and perform the operation on a copy, or `observableArray.replace(observableArray.slice().reverse())` to reverse & update in place");
        }
        var clone = this.slice();
        return clone.reverse.apply(clone, arguments);
    },
    sort: function (compareFn) {
        {
            console.warn("[mobx] `observableArray.sort()` will not update the array in place. Use `observableArray.slice().sort()` to suppress this warning and perform the operation on a copy, or `observableArray.replace(observableArray.slice().sort())` to sort & update in place");
        }
        var clone = this.slice();
        return clone.sort.apply(clone, arguments);
    },
    remove: function (value) {
        var adm = this[$mobx];
        var idx = adm.dehanceValues(adm.values).indexOf(value);
        if (idx > -1) {
            this.splice(idx, 1);
            return true;
        }
        return false;
    },
    get: function (index) {
        var adm = this[$mobx];
        if (adm) {
            if (index < adm.values.length) {
                adm.atom.reportObserved();
                return adm.dehanceValue(adm.values[index]);
            }
            console.warn("[mobx.array] Attempt to read an array index (" + index + ") that is out of bounds (" + adm.values.length + "). Please check length first. Out of bound indices will not be tracked by MobX");
        }
        return undefined;
    },
    set: function (index, newValue) {
        var adm = this[$mobx];
        var values = adm.values;
        if (index < values.length) {
            checkIfStateModificationsAreAllowed(adm.atom);
            var oldValue = values[index];
            if (hasInterceptors(adm)) {
                var change = interceptChange(adm, {
                    type: "update",
                    object: adm.proxy,
                    index: index,
                    newValue: newValue
                });
                if (!change)
                    return;
                newValue = change.newValue;
            }
            newValue = adm.enhancer(newValue, oldValue);
            var changed = newValue !== oldValue;
            if (changed) {
                values[index] = newValue;
                adm.notifyArrayChildUpdate(index, newValue, oldValue);
            }
        }
        else if (index === values.length) {
            adm.spliceWithArray(index, 0, [newValue]);
        }
        else {
            throw new Error("[mobx.array] Index out of bounds, " + index + " is larger than " + values.length);
        }
    }
};
[
    "concat",
    "flat",
    "includes",
    "indexOf",
    "join",
    "lastIndexOf",
    "slice",
    "toString",
    "toLocaleString"
].forEach(function (funcName) {
    if (typeof Array.prototype[funcName] !== "function") {
        return;
    }
    arrayExtensions[funcName] = function () {
        var adm = this[$mobx];
        adm.atom.reportObserved();
        var res = adm.dehanceValues(adm.values);
        return res[funcName].apply(res, arguments);
    };
});
["every", "filter", "find", "findIndex", "flatMap", "forEach", "map", "some"].forEach(function (funcName) {
    if (typeof Array.prototype[funcName] !== "function") {
        return;
    }
    arrayExtensions[funcName] = function (callback, thisArg) {
        var _this = this;
        var adm = this[$mobx];
        adm.atom.reportObserved();
        var dehancedValues = adm.dehanceValues(adm.values);
        return dehancedValues[funcName](function (element, index) {
            return callback.call(thisArg, element, index, _this);
        }, thisArg);
    };
});
["reduce", "reduceRight"].forEach(function (funcName) {
    arrayExtensions[funcName] = function (callback, initialValue) {
        var _this = this;
        var adm = this[$mobx];
        adm.atom.reportObserved();
        return adm.values[funcName](function (accumulator, currentValue, index) {
            currentValue = adm.dehanceValue(currentValue);
            return callback(accumulator, currentValue, index, _this);
        }, initialValue);
    };
});
var isObservableArrayAdministration = createInstanceofPredicate("ObservableArrayAdministration", ObservableArrayAdministration);
function isObservableArray(thing) {
    return isObject(thing) && isObservableArrayAdministration(thing[$mobx]);
}
var _a;
var ObservableMapMarker = {};
var ObservableMap = (function () {
    function ObservableMap(initialData, enhancer, name) {
        if (enhancer === void 0) {
            enhancer = deepEnhancer;
        }
        if (name === void 0) {
            name = "ObservableMap@" + getNextId();
        }
        this.enhancer = enhancer;
        this.name = name;
        this[_a] = ObservableMapMarker;
        this._keysAtom = createAtom(this.name + ".keys()");
        this[Symbol.toStringTag] = "Map";
        if (typeof Map !== "function") {
            throw new Error("mobx.map requires Map polyfill for the current browser. Check babel-polyfill or core-js/es6/map.js");
        }
        this._data = new Map();
        this._hasMap = new Map();
        this.merge(initialData);
    }
    ObservableMap.prototype._has = function (key) {
        return this._data.has(key);
    };
    ObservableMap.prototype.has = function (key) {
        var _this = this;
        if (!globalState.trackingDerivation)
            return this._has(key);
        var entry = this._hasMap.get(key);
        if (!entry) {
            var newEntry = (entry = new ObservableValue(this._has(key), referenceEnhancer, this.name + "." + stringifyKey(key) + "?", false));
            this._hasMap.set(key, newEntry);
            onBecomeUnobserved(newEntry, function () { return _this._hasMap.delete(key); });
        }
        return entry.get();
    };
    ObservableMap.prototype.set = function (key, value) {
        var hasKey = this._has(key);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: hasKey ? "update" : "add",
                object: this,
                newValue: value,
                name: key
            });
            if (!change)
                return this;
            value = change.newValue;
        }
        if (hasKey) {
            this._updateValue(key, value);
        }
        else {
            this._addValue(key, value);
        }
        return this;
    };
    ObservableMap.prototype.delete = function (key) {
        var _this = this;
        checkIfStateModificationsAreAllowed(this._keysAtom);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: "delete",
                object: this,
                name: key
            });
            if (!change)
                return false;
        }
        if (this._has(key)) {
            var notifySpy = isSpyEnabled();
            var notify = hasListeners(this);
            var change = notify || notifySpy
                ? {
                    type: "delete",
                    object: this,
                    oldValue: this._data.get(key).value,
                    name: key
                }
                : null;
            if (notifySpy && "development" !== "production")
                spyReportStart(__assign(__assign({}, change), { name: this.name, key: key }));
            transaction(function () {
                _this._keysAtom.reportChanged();
                _this._updateHasMapEntry(key, false);
                var observable = _this._data.get(key);
                observable.setNewValue(undefined);
                _this._data.delete(key);
            });
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && "development" !== "production")
                spyReportEnd();
            return true;
        }
        return false;
    };
    ObservableMap.prototype._updateHasMapEntry = function (key, value) {
        var entry = this._hasMap.get(key);
        if (entry) {
            entry.setNewValue(value);
        }
    };
    ObservableMap.prototype._updateValue = function (key, newValue) {
        var observable = this._data.get(key);
        newValue = observable.prepareNewValue(newValue);
        if (newValue !== globalState.UNCHANGED) {
            var notifySpy = isSpyEnabled();
            var notify = hasListeners(this);
            var change = notify || notifySpy
                ? {
                    type: "update",
                    object: this,
                    oldValue: observable.value,
                    name: key,
                    newValue: newValue
                }
                : null;
            if (notifySpy && "development" !== "production")
                spyReportStart(__assign(__assign({}, change), { name: this.name, key: key }));
            observable.setNewValue(newValue);
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && "development" !== "production")
                spyReportEnd();
        }
    };
    ObservableMap.prototype._addValue = function (key, newValue) {
        var _this = this;
        checkIfStateModificationsAreAllowed(this._keysAtom);
        transaction(function () {
            var observable = new ObservableValue(newValue, _this.enhancer, _this.name + "." + stringifyKey(key), false);
            _this._data.set(key, observable);
            newValue = observable.value;
            _this._updateHasMapEntry(key, true);
            _this._keysAtom.reportChanged();
        });
        var notifySpy = isSpyEnabled();
        var notify = hasListeners(this);
        var change = notify || notifySpy
            ? {
                type: "add",
                object: this,
                name: key,
                newValue: newValue
            }
            : null;
        if (notifySpy && "development" !== "production")
            spyReportStart(__assign(__assign({}, change), { name: this.name, key: key }));
        if (notify)
            notifyListeners(this, change);
        if (notifySpy && "development" !== "production")
            spyReportEnd();
    };
    ObservableMap.prototype.get = function (key) {
        if (this.has(key))
            return this.dehanceValue(this._data.get(key).get());
        return this.dehanceValue(undefined);
    };
    ObservableMap.prototype.dehanceValue = function (value) {
        if (this.dehancer !== undefined) {
            return this.dehancer(value);
        }
        return value;
    };
    ObservableMap.prototype.keys = function () {
        this._keysAtom.reportObserved();
        return this._data.keys();
    };
    ObservableMap.prototype.values = function () {
        var self = this;
        var keys = this.keys();
        return makeIterable({
            next: function () {
                var _b = keys.next(), done = _b.done, value = _b.value;
                return {
                    done: done,
                    value: done ? undefined : self.get(value)
                };
            }
        });
    };
    ObservableMap.prototype.entries = function () {
        var self = this;
        var keys = this.keys();
        return makeIterable({
            next: function () {
                var _b = keys.next(), done = _b.done, value = _b.value;
                return {
                    done: done,
                    value: done ? undefined : [value, self.get(value)]
                };
            }
        });
    };
    ObservableMap.prototype[(_a = $mobx, Symbol.iterator)] = function () {
        return this.entries();
    };
    ObservableMap.prototype.forEach = function (callback, thisArg) {
        var e_1, _b;
        try {
            for (var _c = __values(this), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), key = _e[0], value = _e[1];
                callback.call(thisArg, value, key, this);
            }
        }
        catch (e_1_1) {
            e_1 = { error: e_1_1 };
        }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return))
                    _b.call(_c);
            }
            finally {
                if (e_1)
                    throw e_1.error;
            }
        }
    };
    ObservableMap.prototype.merge = function (other) {
        var _this = this;
        if (isObservableMap(other)) {
            other = other.toJS();
        }
        transaction(function () {
            var prev = allowStateChangesStart(true);
            try {
                if (isPlainObject(other))
                    getPlainObjectKeys(other).forEach(function (key) {
                        return _this.set(key, other[key]);
                    });
                else if (Array.isArray(other))
                    other.forEach(function (_b) {
                        var _c = __read(_b, 2), key = _c[0], value = _c[1];
                        return _this.set(key, value);
                    });
                else if (isES6Map(other)) {
                    if (other.constructor !== Map)
                        fail("Cannot initialize from classes that inherit from Map: " + other.constructor.name);
                    other.forEach(function (value, key) { return _this.set(key, value); });
                }
                else if (other !== null && other !== undefined)
                    fail("Cannot initialize map from " + other);
            }
            finally {
                allowStateChangesEnd(prev);
            }
        });
        return this;
    };
    ObservableMap.prototype.clear = function () {
        var _this = this;
        transaction(function () {
            untracked(function () {
                var e_2, _b;
                try {
                    for (var _c = __values(_this.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var key = _d.value;
                        _this.delete(key);
                    }
                }
                catch (e_2_1) {
                    e_2 = { error: e_2_1 };
                }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return))
                            _b.call(_c);
                    }
                    finally {
                        if (e_2)
                            throw e_2.error;
                    }
                }
            });
        });
    };
    ObservableMap.prototype.replace = function (values) {
        var _this = this;
        transaction(function () {
            var e_3, _b, e_4, _c;
            var replacementMap = convertToMap(values);
            var orderedData = new Map();
            var keysReportChangedCalled = false;
            try {
                for (var _d = __values(_this._data.keys()), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var key = _e.value;
                    if (!replacementMap.has(key)) {
                        var deleted = _this.delete(key);
                        if (deleted) {
                            keysReportChangedCalled = true;
                        }
                        else {
                            var value = _this._data.get(key);
                            orderedData.set(key, value);
                        }
                    }
                }
            }
            catch (e_3_1) {
                e_3 = { error: e_3_1 };
            }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return))
                        _b.call(_d);
                }
                finally {
                    if (e_3)
                        throw e_3.error;
                }
            }
            try {
                for (var _f = __values(replacementMap.entries()), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var _h = __read(_g.value, 2), key = _h[0], value = _h[1];
                    var keyExisted = _this._data.has(key);
                    _this.set(key, value);
                    if (_this._data.has(key)) {
                        var value_1 = _this._data.get(key);
                        orderedData.set(key, value_1);
                        if (!keyExisted) {
                            keysReportChangedCalled = true;
                        }
                    }
                }
            }
            catch (e_4_1) {
                e_4 = { error: e_4_1 };
            }
            finally {
                try {
                    if (_g && !_g.done && (_c = _f.return))
                        _c.call(_f);
                }
                finally {
                    if (e_4)
                        throw e_4.error;
                }
            }
            if (!keysReportChangedCalled) {
                if (_this._data.size !== orderedData.size) {
                    _this._keysAtom.reportChanged();
                }
                else {
                    var iter1 = _this._data.keys();
                    var iter2 = orderedData.keys();
                    var next1 = iter1.next();
                    var next2 = iter2.next();
                    while (!next1.done) {
                        if (next1.value !== next2.value) {
                            _this._keysAtom.reportChanged();
                            break;
                        }
                        next1 = iter1.next();
                        next2 = iter2.next();
                    }
                }
            }
            _this._data = orderedData;
        });
        return this;
    };
    Object.defineProperty(ObservableMap.prototype, "size", {
        get: function () {
            this._keysAtom.reportObserved();
            return this._data.size;
        },
        enumerable: true,
        configurable: true
    });
    ObservableMap.prototype.toPOJO = function () {
        var e_5, _b;
        var res = {};
        try {
            for (var _c = __values(this), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), key = _e[0], value = _e[1];
                res[typeof key === "symbol" ? key : stringifyKey(key)] = value;
            }
        }
        catch (e_5_1) {
            e_5 = { error: e_5_1 };
        }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return))
                    _b.call(_c);
            }
            finally {
                if (e_5)
                    throw e_5.error;
            }
        }
        return res;
    };
    ObservableMap.prototype.toJS = function () {
        return new Map(this);
    };
    ObservableMap.prototype.toJSON = function () {
        return this.toPOJO();
    };
    ObservableMap.prototype.toString = function () {
        var _this = this;
        return (this.name +
            "[{ " +
            Array.from(this.keys())
                .map(function (key) { return stringifyKey(key) + ": " + ("" + _this.get(key)); })
                .join(", ") +
            " }]");
    };
    ObservableMap.prototype.observe = function (listener, fireImmediately) {
        invariant(fireImmediately !== true, "`observe` doesn't support fireImmediately=true in combination with maps.");
        return registerListener(this, listener);
    };
    ObservableMap.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    return ObservableMap;
}());
var isObservableMap = createInstanceofPredicate("ObservableMap", ObservableMap);
var _a$1;
var ObservableSetMarker = {};
var ObservableSet = (function () {
    function ObservableSet(initialData, enhancer, name) {
        if (enhancer === void 0) {
            enhancer = deepEnhancer;
        }
        if (name === void 0) {
            name = "ObservableSet@" + getNextId();
        }
        this.name = name;
        this[_a$1] = ObservableSetMarker;
        this._data = new Set();
        this._atom = createAtom(this.name);
        this[Symbol.toStringTag] = "Set";
        if (typeof Set !== "function") {
            throw new Error("mobx.set requires Set polyfill for the current browser. Check babel-polyfill or core-js/es6/set.js");
        }
        this.enhancer = function (newV, oldV) { return enhancer(newV, oldV, name); };
        if (initialData) {
            this.replace(initialData);
        }
    }
    ObservableSet.prototype.dehanceValue = function (value) {
        if (this.dehancer !== undefined) {
            return this.dehancer(value);
        }
        return value;
    };
    ObservableSet.prototype.clear = function () {
        var _this = this;
        transaction(function () {
            untracked(function () {
                var e_1, _b;
                try {
                    for (var _c = __values(_this._data.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var value = _d.value;
                        _this.delete(value);
                    }
                }
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return))
                            _b.call(_c);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
            });
        });
    };
    ObservableSet.prototype.forEach = function (callbackFn, thisArg) {
        var e_2, _b;
        try {
            for (var _c = __values(this), _d = _c.next(); !_d.done; _d = _c.next()) {
                var value = _d.value;
                callbackFn.call(thisArg, value, value, this);
            }
        }
        catch (e_2_1) {
            e_2 = { error: e_2_1 };
        }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return))
                    _b.call(_c);
            }
            finally {
                if (e_2)
                    throw e_2.error;
            }
        }
    };
    Object.defineProperty(ObservableSet.prototype, "size", {
        get: function () {
            this._atom.reportObserved();
            return this._data.size;
        },
        enumerable: true,
        configurable: true
    });
    ObservableSet.prototype.add = function (value) {
        var _this = this;
        checkIfStateModificationsAreAllowed(this._atom);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: "add",
                object: this,
                newValue: value
            });
            if (!change)
                return this;
        }
        if (!this.has(value)) {
            transaction(function () {
                _this._data.add(_this.enhancer(value, undefined));
                _this._atom.reportChanged();
            });
            var notifySpy = isSpyEnabled();
            var notify = hasListeners(this);
            var change = notify || notifySpy
                ? {
                    type: "add",
                    object: this,
                    newValue: value
                }
                : null;
            if (notifySpy && "development" !== "production")
                spyReportStart(change);
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && "development" !== "production")
                spyReportEnd();
        }
        return this;
    };
    ObservableSet.prototype.delete = function (value) {
        var _this = this;
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: "delete",
                object: this,
                oldValue: value
            });
            if (!change)
                return false;
        }
        if (this.has(value)) {
            var notifySpy = isSpyEnabled();
            var notify = hasListeners(this);
            var change = notify || notifySpy
                ? {
                    type: "delete",
                    object: this,
                    oldValue: value
                }
                : null;
            if (notifySpy && "development" !== "production")
                spyReportStart(__assign(__assign({}, change), { name: this.name }));
            transaction(function () {
                _this._atom.reportChanged();
                _this._data.delete(value);
            });
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && "development" !== "production")
                spyReportEnd();
            return true;
        }
        return false;
    };
    ObservableSet.prototype.has = function (value) {
        this._atom.reportObserved();
        return this._data.has(this.dehanceValue(value));
    };
    ObservableSet.prototype.entries = function () {
        var nextIndex = 0;
        var keys = Array.from(this.keys());
        var values = Array.from(this.values());
        return makeIterable({
            next: function () {
                var index = nextIndex;
                nextIndex += 1;
                return index < values.length
                    ? { value: [keys[index], values[index]], done: false }
                    : { done: true };
            }
        });
    };
    ObservableSet.prototype.keys = function () {
        return this.values();
    };
    ObservableSet.prototype.values = function () {
        this._atom.reportObserved();
        var self = this;
        var nextIndex = 0;
        var observableValues = Array.from(this._data.values());
        return makeIterable({
            next: function () {
                return nextIndex < observableValues.length
                    ? { value: self.dehanceValue(observableValues[nextIndex++]), done: false }
                    : { done: true };
            }
        });
    };
    ObservableSet.prototype.replace = function (other) {
        var _this = this;
        if (isObservableSet(other)) {
            other = other.toJS();
        }
        transaction(function () {
            var prev = allowStateChangesStart(true);
            try {
                if (Array.isArray(other)) {
                    _this.clear();
                    other.forEach(function (value) { return _this.add(value); });
                }
                else if (isES6Set(other)) {
                    _this.clear();
                    other.forEach(function (value) { return _this.add(value); });
                }
                else if (other !== null && other !== undefined) {
                    fail("Cannot initialize set from " + other);
                }
            }
            finally {
                allowStateChangesEnd(prev);
            }
        });
        return this;
    };
    ObservableSet.prototype.observe = function (listener, fireImmediately) {
        invariant(fireImmediately !== true, "`observe` doesn't support fireImmediately=true in combination with sets.");
        return registerListener(this, listener);
    };
    ObservableSet.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    ObservableSet.prototype.toJS = function () {
        return new Set(this);
    };
    ObservableSet.prototype.toString = function () {
        return this.name + "[ " + Array.from(this).join(", ") + " ]";
    };
    ObservableSet.prototype[(_a$1 = $mobx, Symbol.iterator)] = function () {
        return this.values();
    };
    return ObservableSet;
}());
var isObservableSet = createInstanceofPredicate("ObservableSet", ObservableSet);
var ObservableObjectAdministration = (function () {
    function ObservableObjectAdministration(target, values, name, defaultEnhancer) {
        if (values === void 0) {
            values = new Map();
        }
        this.target = target;
        this.values = values;
        this.name = name;
        this.defaultEnhancer = defaultEnhancer;
        this.keysAtom = new Atom(name + ".keys");
    }
    ObservableObjectAdministration.prototype.read = function (key) {
        return this.values.get(key).get();
    };
    ObservableObjectAdministration.prototype.write = function (key, newValue) {
        var instance = this.target;
        var observable = this.values.get(key);
        if (observable instanceof ComputedValue) {
            observable.set(newValue);
            return;
        }
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: "update",
                object: this.proxy || instance,
                name: key,
                newValue: newValue
            });
            if (!change)
                return;
            newValue = change.newValue;
        }
        newValue = observable.prepareNewValue(newValue);
        if (newValue !== globalState.UNCHANGED) {
            var notify = hasListeners(this);
            var notifySpy = isSpyEnabled();
            var change = notify || notifySpy
                ? {
                    type: "update",
                    object: this.proxy || instance,
                    oldValue: observable.value,
                    name: key,
                    newValue: newValue
                }
                : null;
            if (notifySpy && "development" !== "production")
                spyReportStart(__assign(__assign({}, change), { name: this.name, key: key }));
            observable.setNewValue(newValue);
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && "development" !== "production")
                spyReportEnd();
        }
    };
    ObservableObjectAdministration.prototype.has = function (key) {
        var map = this.pendingKeys || (this.pendingKeys = new Map());
        var entry = map.get(key);
        if (entry)
            return entry.get();
        else {
            var exists = !!this.values.get(key);
            entry = new ObservableValue(exists, referenceEnhancer, this.name + "." + stringifyKey(key) + "?", false);
            map.set(key, entry);
            return entry.get();
        }
    };
    ObservableObjectAdministration.prototype.addObservableProp = function (propName, newValue, enhancer) {
        if (enhancer === void 0) {
            enhancer = this.defaultEnhancer;
        }
        var target = this.target;
        assertPropertyConfigurable(target, propName);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                object: this.proxy || target,
                name: propName,
                type: "add",
                newValue: newValue
            });
            if (!change)
                return;
            newValue = change.newValue;
        }
        var observable = new ObservableValue(newValue, enhancer, this.name + "." + stringifyKey(propName), false);
        this.values.set(propName, observable);
        newValue = observable.value;
        Object.defineProperty(target, propName, generateObservablePropConfig(propName));
        this.notifyPropertyAddition(propName, newValue);
    };
    ObservableObjectAdministration.prototype.addComputedProp = function (propertyOwner, propName, options) {
        var target = this.target;
        options.name = options.name || this.name + "." + stringifyKey(propName);
        this.values.set(propName, new ComputedValue(options));
        if (propertyOwner === target || isPropertyConfigurable(propertyOwner, propName))
            Object.defineProperty(propertyOwner, propName, generateComputedPropConfig(propName));
    };
    ObservableObjectAdministration.prototype.remove = function (key) {
        if (!this.values.has(key))
            return;
        var target = this.target;
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                object: this.proxy || target,
                name: key,
                type: "remove"
            });
            if (!change)
                return;
        }
        try {
            startBatch();
            var notify = hasListeners(this);
            var notifySpy = isSpyEnabled();
            var oldObservable = this.values.get(key);
            var oldValue = oldObservable && oldObservable.get();
            oldObservable && oldObservable.set(undefined);
            this.keysAtom.reportChanged();
            this.values.delete(key);
            if (this.pendingKeys) {
                var entry = this.pendingKeys.get(key);
                if (entry)
                    entry.set(false);
            }
            delete this.target[key];
            var change = notify || notifySpy
                ? {
                    type: "remove",
                    object: this.proxy || target,
                    oldValue: oldValue,
                    name: key
                }
                : null;
            if (notifySpy && "development" !== "production")
                spyReportStart(__assign(__assign({}, change), { name: this.name, key: key }));
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && "development" !== "production")
                spyReportEnd();
        }
        finally {
            endBatch();
        }
    };
    ObservableObjectAdministration.prototype.illegalAccess = function (owner, propName) {
        console.warn("Property '" + propName + "' of '" + owner + "' was accessed through the prototype chain. Use 'decorate' instead to declare the prop or access it statically through it's owner");
    };
    ObservableObjectAdministration.prototype.observe = function (callback, fireImmediately) {
        invariant(fireImmediately !== true, "`observe` doesn't support the fire immediately property for observable objects.");
        return registerListener(this, callback);
    };
    ObservableObjectAdministration.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    ObservableObjectAdministration.prototype.notifyPropertyAddition = function (key, newValue) {
        var notify = hasListeners(this);
        var notifySpy = isSpyEnabled();
        var change = notify || notifySpy
            ? {
                type: "add",
                object: this.proxy || this.target,
                name: key,
                newValue: newValue
            }
            : null;
        if (notifySpy && "development" !== "production")
            spyReportStart(__assign(__assign({}, change), { name: this.name, key: key }));
        if (notify)
            notifyListeners(this, change);
        if (notifySpy && "development" !== "production")
            spyReportEnd();
        if (this.pendingKeys) {
            var entry = this.pendingKeys.get(key);
            if (entry)
                entry.set(true);
        }
        this.keysAtom.reportChanged();
    };
    ObservableObjectAdministration.prototype.getKeys = function () {
        var e_1, _a;
        this.keysAtom.reportObserved();
        var res = [];
        try {
            for (var _b = __values(this.values), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                if (value instanceof ObservableValue)
                    res.push(key);
            }
        }
        catch (e_1_1) {
            e_1 = { error: e_1_1 };
        }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return))
                    _a.call(_b);
            }
            finally {
                if (e_1)
                    throw e_1.error;
            }
        }
        return res;
    };
    return ObservableObjectAdministration;
}());
function asObservableObject(target, name, defaultEnhancer) {
    if (name === void 0) {
        name = "";
    }
    if (defaultEnhancer === void 0) {
        defaultEnhancer = deepEnhancer;
    }
    if (Object.prototype.hasOwnProperty.call(target, $mobx))
        return target[$mobx];
    invariant(Object.isExtensible(target), "Cannot make the designated object observable; it is not extensible");
    if (!isPlainObject(target))
        name = (target.constructor.name || "ObservableObject") + "@" + getNextId();
    if (!name)
        name = "ObservableObject@" + getNextId();
    var adm = new ObservableObjectAdministration(target, new Map(), stringifyKey(name), defaultEnhancer);
    addHiddenProp(target, $mobx, adm);
    return adm;
}
var observablePropertyConfigs = Object.create(null);
var computedPropertyConfigs = Object.create(null);
function generateObservablePropConfig(propName) {
    return (observablePropertyConfigs[propName] ||
        (observablePropertyConfigs[propName] = {
            configurable: true,
            enumerable: true,
            get: function () {
                return this[$mobx].read(propName);
            },
            set: function (v) {
                this[$mobx].write(propName, v);
            }
        }));
}
function getAdministrationForComputedPropOwner(owner) {
    var adm = owner[$mobx];
    if (!adm) {
        initializeInstance(owner);
        return owner[$mobx];
    }
    return adm;
}
function generateComputedPropConfig(propName) {
    return (computedPropertyConfigs[propName] ||
        (computedPropertyConfigs[propName] = {
            configurable: globalState.computedConfigurable,
            enumerable: false,
            get: function () {
                return getAdministrationForComputedPropOwner(this).read(propName);
            },
            set: function (v) {
                getAdministrationForComputedPropOwner(this).write(propName, v);
            }
        }));
}
var isObservableObjectAdministration = createInstanceofPredicate("ObservableObjectAdministration", ObservableObjectAdministration);
function isObservableObject(thing) {
    if (isObject(thing)) {
        initializeInstance(thing);
        return isObservableObjectAdministration(thing[$mobx]);
    }
    return false;
}
function getAtom(thing, property) {
    if (typeof thing === "object" && thing !== null) {
        if (isObservableArray(thing)) {
            if (property !== undefined)
                fail("It is not possible to get index atoms from arrays");
            return thing[$mobx].atom;
        }
        if (isObservableSet(thing)) {
            return thing[$mobx];
        }
        if (isObservableMap(thing)) {
            var anyThing = thing;
            if (property === undefined)
                return anyThing._keysAtom;
            var observable = anyThing._data.get(property) || anyThing._hasMap.get(property);
            if (!observable)
                fail("the entry '" + property + "' does not exist in the observable map '" + getDebugName(thing) + "'");
            return observable;
        }
        initializeInstance(thing);
        if (property && !thing[$mobx])
            thing[property];
        if (isObservableObject(thing)) {
            if (!property)
                return fail("please specify a property");
            var observable = thing[$mobx].values.get(property);
            if (!observable)
                fail("no observable property '" + property + "' found on the observable object '" + getDebugName(thing) + "'");
            return observable;
        }
        if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
            return thing;
        }
    }
    else if (typeof thing === "function") {
        if (isReaction(thing[$mobx])) {
            return thing[$mobx];
        }
    }
    return fail("Cannot obtain atom from " + thing);
}
function getAdministration(thing, property) {
    if (!thing)
        fail("Expecting some object");
    if (property !== undefined)
        return getAdministration(getAtom(thing, property));
    if (isAtom(thing) || isComputedValue(thing) || isReaction(thing))
        return thing;
    if (isObservableMap(thing) || isObservableSet(thing))
        return thing;
    initializeInstance(thing);
    if (thing[$mobx])
        return thing[$mobx];
    fail("Cannot obtain administration from " + thing);
}
function getDebugName(thing, property) {
    var named;
    if (property !== undefined)
        named = getAtom(thing, property);
    else if (isObservableObject(thing) || isObservableMap(thing) || isObservableSet(thing))
        named = getAdministration(thing);
    else
        named = getAtom(thing);
    return named.name;
}
var toString = Object.prototype.toString;
function deepEqual(a, b, depth) {
    if (depth === void 0) {
        depth = -1;
    }
    return eq(a, b, depth);
}
function eq(a, b, depth, aStack, bStack) {
    if (a === b)
        return a !== 0 || 1 / a === 1 / b;
    if (a == null || b == null)
        return false;
    if (a !== a)
        return b !== b;
    var type = typeof a;
    if (type !== "function" && type !== "object" && typeof b != "object")
        return false;
    var className = toString.call(a);
    if (className !== toString.call(b))
        return false;
    switch (className) {
        case "[object RegExp]":
        case "[object String]":
            return "" + a === "" + b;
        case "[object Number]":
            if (+a !== +a)
                return +b !== +b;
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case "[object Date]":
        case "[object Boolean]":
            return +a === +b;
        case "[object Symbol]":
            return (typeof Symbol !== "undefined" && Symbol.valueOf.call(a) === Symbol.valueOf.call(b));
        case "[object Map]":
        case "[object Set]":
            if (depth >= 0) {
                depth++;
            }
            break;
    }
    a = unwrap(a);
    b = unwrap(b);
    var areArrays = className === "[object Array]";
    if (!areArrays) {
        if (typeof a != "object" || typeof b != "object")
            return false;
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor &&
            !(typeof aCtor === "function" &&
                aCtor instanceof aCtor &&
                typeof bCtor === "function" &&
                bCtor instanceof bCtor) &&
            ("constructor" in a && "constructor" in b)) {
            return false;
        }
    }
    if (depth === 0) {
        return false;
    }
    else if (depth < 0) {
        depth = -1;
    }
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
        if (aStack[length] === a)
            return bStack[length] === b;
    }
    aStack.push(a);
    bStack.push(b);
    if (areArrays) {
        length = a.length;
        if (length !== b.length)
            return false;
        while (length--) {
            if (!eq(a[length], b[length], depth - 1, aStack, bStack))
                return false;
        }
    }
    else {
        var keys = Object.keys(a);
        var key = void 0;
        length = keys.length;
        if (Object.keys(b).length !== length)
            return false;
        while (length--) {
            key = keys[length];
            if (!(has$1(b, key) && eq(a[key], b[key], depth - 1, aStack, bStack)))
                return false;
        }
    }
    aStack.pop();
    bStack.pop();
    return true;
}
function unwrap(a) {
    if (isObservableArray(a))
        return a.slice();
    if (isES6Map(a) || isObservableMap(a))
        return Array.from(a.entries());
    if (isES6Set(a) || isObservableSet(a))
        return Array.from(a.entries());
    return a;
}
function has$1(a, key) {
    return Object.prototype.hasOwnProperty.call(a, key);
}
function makeIterable(iterator) {
    iterator[Symbol.iterator] = getSelf;
    return iterator;
}
function getSelf() {
    return this;
}
if (typeof Proxy === "undefined" || typeof Symbol === "undefined") {
    throw new Error("[mobx] MobX 5+ requires Proxy and Symbol objects. If your environment doesn't support Symbol or Proxy objects, please downgrade to MobX 4. For React Native Android, consider upgrading JSCore.");
}
try {
    "development";
}
catch (e) {
    var g = getGlobal();
    if (typeof process === "undefined")
        g.process = {};
    g.process.env = {};
}
(function () {
    function testCodeMinification() { }
    if (testCodeMinification.name !== "testCodeMinification" &&
        "development" !== "production" &&
        typeof process !== 'undefined' && process.env.IGNORE_MOBX_MINIFY_WARNING !== "true") {
        var varName = ["process", "env", "NODE_ENV"].join(".");
        console.warn("[mobx] you are running a minified build, but '" + varName + "' was not set to 'production' in your bundler. This results in an unnecessarily large and slow bundle");
    }
})();
if (typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === "object") {
    __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
        spy: spy,
        extras: {
            getDebugName: getDebugName
        },
        $mobx: $mobx
    });
}
exports.$mobx = $mobx;
exports.FlowCancellationError = FlowCancellationError;
exports.ObservableMap = ObservableMap;
exports.ObservableSet = ObservableSet;
exports.Reaction = Reaction;
exports._allowStateChanges = allowStateChanges;
exports._allowStateChangesInsideComputed = allowStateChangesInsideComputed;
exports._allowStateReadsEnd = allowStateReadsEnd;
exports._allowStateReadsStart = allowStateReadsStart;
exports._endAction = _endAction;
exports._getAdministration = getAdministration;
exports._getGlobalState = getGlobalState;
exports._interceptReads = interceptReads;
exports._isComputingDerivation = isComputingDerivation;
exports._resetGlobalState = resetGlobalState;
exports._startAction = _startAction;
exports.action = action;
exports.autorun = autorun;
exports.comparer = comparer;
exports.computed = computed;
exports.configure = configure;
exports.createAtom = createAtom;
exports.decorate = decorate;
exports.entries = entries;
exports.extendObservable = extendObservable;
exports.flow = flow;
exports.get = get;
exports.getAtom = getAtom;
exports.getDebugName = getDebugName;
exports.getDependencyTree = getDependencyTree;
exports.getObserverTree = getObserverTree;
exports.has = has;
exports.intercept = intercept;
exports.isAction = isAction;
exports.isArrayLike = isArrayLike;
exports.isBoxedObservable = isObservableValue;
exports.isComputed = isComputed;
exports.isComputedProp = isComputedProp;
exports.isFlowCancellationError = isFlowCancellationError;
exports.isObservable = isObservable;
exports.isObservableArray = isObservableArray;
exports.isObservableMap = isObservableMap;
exports.isObservableObject = isObservableObject;
exports.isObservableProp = isObservableProp;
exports.isObservableSet = isObservableSet;
exports.keys = keys;
exports.observable = observable;
exports.observe = observe;
exports.onBecomeObserved = onBecomeObserved;
exports.onBecomeUnobserved = onBecomeUnobserved;
exports.onReactionError = onReactionError;
exports.reaction = reaction;
exports.remove = remove;
exports.runInAction = runInAction;
exports.set = set;
exports.spy = spy;
exports.toJS = toJS;
exports.trace = trace;
exports.transaction = transaction;
exports.untracked = untracked;
exports.values = values;
exports.when = when;

});
return ___scope___.entry = "lib/index.js";
});
FuseBox.pkg("preact", {}, function(___scope___){
___scope___.file("dist/preact.js", function(exports, require, module, __filename, __dirname){

var n, l, u, t, i, o, r, f = {}, e = [], c = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
function s(n, l) { for (var u in l)
    n[u] = l[u]; return n; }
function a(n) { var l = n.parentNode; l && l.removeChild(n); }
function p(n, l, u) { var t, i, o, r = arguments, f = {}; for (o in l)
    "key" == o ? t = l[o] : "ref" == o ? i = l[o] : f[o] = l[o]; if (arguments.length > 3)
    for (u = [u], o = 3; o < arguments.length; o++)
        u.push(r[o]); if (null != u && (f.children = u), "function" == typeof n && null != n.defaultProps)
    for (o in n.defaultProps)
        void 0 === f[o] && (f[o] = n.defaultProps[o]); return v(n, f, t, i, null); }
function v(l, u, t, i, o) { var r = { type: l, props: u, key: t, ref: i, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: o }; return null == o && (r.__v = r), null != n.vnode && n.vnode(r), r; }
function h(n) { return n.children; }
function y(n, l) { this.props = n, this.context = l; }
function d(n, l) { if (null == l)
    return n.__ ? d(n.__, n.__.__k.indexOf(n) + 1) : null; for (var u; l < n.__k.length; l++)
    if (null != (u = n.__k[l]) && null != u.__e)
        return u.__e; return "function" == typeof n.type ? d(n) : null; }
function _(n) { var l, u; if (null != (n = n.__) && null != n.__c) {
    for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++)
        if (null != (u = n.__k[l]) && null != u.__e) {
            n.__e = n.__c.base = u.__e;
            break;
        }
    return _(n);
} }
function w(l) { (!l.__d && (l.__d = !0) && u.push(l) && !x.__r++ || i !== n.debounceRendering) && ((i = n.debounceRendering) || t)(x); }
function x() { for (var n; x.__r = u.length;)
    n = u.sort(function (n, l) { return n.__v.__b - l.__v.__b; }), u = [], n.some(function (n) { var l, u, t, i, o, r, f; n.__d && (r = (o = (l = n).__v).__e, (f = l.__P) && (u = [], (t = s({}, o)).__v = t, i = z(f, o, t, l.__n, void 0 !== f.ownerSVGElement, null, u, null == r ? d(o) : r), N(u, o), i != r && _(o))); }); }
function k(n, l, u, t, i, o, r, c, s, p) { var y, _, w, x, k, g, b, A = t && t.__k || e, P = A.length; for (s == f && (s = null != r ? r[0] : P ? d(t, 0) : null), u.__k = [], y = 0; y < l.length; y++)
    if (null != (x = u.__k[y] = null == (x = l[y]) || "boolean" == typeof x ? null : "string" == typeof x || "number" == typeof x ? v(null, x, null, null, x) : Array.isArray(x) ? v(h, { children: x }, null, null, null) : null != x.__e || null != x.__c ? v(x.type, x.props, x.key, null, x.__v) : x)) {
        if (x.__ = u, x.__b = u.__b + 1, null === (w = A[y]) || w && x.key == w.key && x.type === w.type)
            A[y] = void 0;
        else
            for (_ = 0; _ < P; _++) {
                if ((w = A[_]) && x.key == w.key && x.type === w.type) {
                    A[_] = void 0;
                    break;
                }
                w = null;
            }
        k = z(n, x, w = w || f, i, o, r, c, s, p), (_ = x.ref) && w.ref != _ && (b || (b = []), w.ref && b.push(w.ref, null, x), b.push(_, x.__c || k, x)), null != k ? (null == g && (g = k), s = m(n, x, w, A, r, k, s), p || "option" != u.type ? "function" == typeof u.type && (u.__d = s) : n.value = "") : s && w.__e == s && s.parentNode != n && (s = d(w));
    } if (u.__e = g, null != r && "function" != typeof u.type)
    for (y = r.length; y--;)
        null != r[y] && a(r[y]); for (y = P; y--;)
    null != A[y] && j(A[y], A[y]); if (b)
    for (y = 0; y < b.length; y++)
        $(b[y], b[++y], b[++y]); }
function m(n, l, u, t, i, o, r) { var f, e, c; if (void 0 !== l.__d)
    f = l.__d, l.__d = void 0;
else if (i == u || o != r || null == o.parentNode)
    n: if (null == r || r.parentNode !== n)
        n.appendChild(o), f = null;
    else {
        for (e = r, c = 0; (e = e.nextSibling) && c < t.length; c += 2)
            if (e == o)
                break n;
        n.insertBefore(o, r), f = r;
    } return void 0 !== f ? f : o.nextSibling; }
function g(n, l, u, t, i) { var o; for (o in u)
    "children" === o || "key" === o || o in l || A(n, o, null, u[o], t); for (o in l)
    i && "function" != typeof l[o] || "children" === o || "key" === o || "value" === o || "checked" === o || u[o] === l[o] || A(n, o, l[o], u[o], t); }
function b(n, l, u) { "-" === l[0] ? n.setProperty(l, u) : n[l] = null == u ? "" : "number" != typeof u || c.test(l) ? u : u + "px"; }
function A(n, l, u, t, i) { var o, r; if (i && "className" == l && (l = "class"), "style" === l)
    if ("string" == typeof u)
        n.style = u;
    else {
        if ("string" == typeof t && (n.style = t = ""), t)
            for (l in t)
                u && l in u || b(n.style, l, "");
        if (u)
            for (l in u)
                t && u[l] === t[l] || b(n.style, l, u[l]);
    }
else
    "o" === l[0] && "n" === l[1] ? (o = l !== (l = l.replace(/Capture$/, "")), (r = l.toLowerCase()) in n && (l = r), l = l.slice(2), n.l || (n.l = {}), n.l[l] = u, u ? t || n.addEventListener(l, P, o) : n.removeEventListener(l, P, o)) : "list" !== l && "tagName" !== l && "form" !== l && "type" !== l && "size" !== l && "download" !== l && "href" !== l && !i && l in n ? n[l] = null == u ? "" : u : "function" != typeof u && "dangerouslySetInnerHTML" !== l && (l !== (l = l.replace(/xlink:?/, "")) ? null == u || !1 === u ? n.removeAttributeNS("http://www.w3.org/1999/xlink", l.toLowerCase()) : n.setAttributeNS("http://www.w3.org/1999/xlink", l.toLowerCase(), u) : null == u || !1 === u && !/^ar/.test(l) ? n.removeAttribute(l) : n.setAttribute(l, u)); }
function P(l) { this.l[l.type](n.event ? n.event(l) : l); }
function C(n, l, u) { var t, i; for (t = 0; t < n.__k.length; t++)
    (i = n.__k[t]) && (i.__ = n, i.__e && ("function" == typeof i.type && i.__k.length > 1 && C(i, l, u), l = m(u, i, i, n.__k, null, i.__e, l), "function" == typeof n.type && (n.__d = l))); }
function z(l, u, t, i, o, r, f, e, c) { var a, p, v, d, _, w, x, m, g, b, A, P = u.type; if (void 0 !== u.constructor)
    return null; (a = n.__b) && a(u); try {
    n: if ("function" == typeof P) {
        if (m = u.props, g = (a = P.contextType) && i[a.__c], b = a ? g ? g.props.value : a.__ : i, t.__c ? x = (p = u.__c = t.__c).__ = p.__E : ("prototype" in P && P.prototype.render ? u.__c = p = new P(m, b) : (u.__c = p = new y(m, b), p.constructor = P, p.render = H), g && g.sub(p), p.props = m, p.state || (p.state = {}), p.context = b, p.__n = i, v = p.__d = !0, p.__h = []), null == p.__s && (p.__s = p.state), null != P.getDerivedStateFromProps && (p.__s == p.state && (p.__s = s({}, p.__s)), s(p.__s, P.getDerivedStateFromProps(m, p.__s))), d = p.props, _ = p.state, v)
            null == P.getDerivedStateFromProps && null != p.componentWillMount && p.componentWillMount(), null != p.componentDidMount && p.__h.push(p.componentDidMount);
        else {
            if (null == P.getDerivedStateFromProps && m !== d && null != p.componentWillReceiveProps && p.componentWillReceiveProps(m, b), !p.__e && null != p.shouldComponentUpdate && !1 === p.shouldComponentUpdate(m, p.__s, b) || u.__v === t.__v) {
                p.props = m, p.state = p.__s, u.__v !== t.__v && (p.__d = !1), p.__v = u, u.__e = t.__e, u.__k = t.__k, p.__h.length && f.push(p), C(u, e, l);
                break n;
            }
            null != p.componentWillUpdate && p.componentWillUpdate(m, p.__s, b), null != p.componentDidUpdate && p.__h.push(function () { p.componentDidUpdate(d, _, w); });
        }
        p.context = b, p.props = m, p.state = p.__s, (a = n.__r) && a(u), p.__d = !1, p.__v = u, p.__P = l, a = p.render(p.props, p.state, p.context), p.state = p.__s, null != p.getChildContext && (i = s(s({}, i), p.getChildContext())), v || null == p.getSnapshotBeforeUpdate || (w = p.getSnapshotBeforeUpdate(d, _)), A = null != a && a.type == h && null == a.key ? a.props.children : a, k(l, Array.isArray(A) ? A : [A], u, t, i, o, r, f, e, c), p.base = u.__e, p.__h.length && f.push(p), x && (p.__E = p.__ = null), p.__e = !1;
    }
    else
        null == r && u.__v === t.__v ? (u.__k = t.__k, u.__e = t.__e) : u.__e = T(t.__e, u, t, i, o, r, f, c);
    (a = n.diffed) && a(u);
}
catch (l) {
    u.__v = null, n.__e(l, u, t);
} return u.__e; }
function N(l, u) { n.__c && n.__c(u, l), l.some(function (u) { try {
    l = u.__h, u.__h = [], l.some(function (n) { n.call(u); });
}
catch (l) {
    n.__e(l, u.__v);
} }); }
function T(n, l, u, t, i, o, r, c) { var s, a, p, v, h, y = u.props, d = l.props; if (i = "svg" === l.type || i, null != o)
    for (s = 0; s < o.length; s++)
        if (null != (a = o[s]) && ((null === l.type ? 3 === a.nodeType : a.localName === l.type) || n == a)) {
            n = a, o[s] = null;
            break;
        } if (null == n) {
    if (null === l.type)
        return document.createTextNode(d);
    n = i ? document.createElementNS("http://www.w3.org/2000/svg", l.type) : document.createElement(l.type, d.is && { is: d.is }), o = null, c = !1;
} if (null === l.type)
    y !== d && n.data !== d && (n.data = d);
else {
    if (null != o && (o = e.slice.call(n.childNodes)), p = (y = u.props || f).dangerouslySetInnerHTML, v = d.dangerouslySetInnerHTML, !c) {
        if (null != o)
            for (y = {}, h = 0; h < n.attributes.length; h++)
                y[n.attributes[h].name] = n.attributes[h].value;
        (v || p) && (v && p && v.__html == p.__html || (n.innerHTML = v && v.__html || ""));
    }
    g(n, d, y, i, c), v ? l.__k = [] : (s = l.props.children, k(n, Array.isArray(s) ? s : [s], l, u, t, "foreignObject" !== l.type && i, o, r, f, c)), c || ("value" in d && void 0 !== (s = d.value) && s !== n.value && A(n, "value", s, y.value, !1), "checked" in d && void 0 !== (s = d.checked) && s !== n.checked && A(n, "checked", s, y.checked, !1));
} return n; }
function $(l, u, t) { try {
    "function" == typeof l ? l(u) : l.current = u;
}
catch (l) {
    n.__e(l, t);
} }
function j(l, u, t) { var i, o, r; if (n.unmount && n.unmount(l), (i = l.ref) && (i.current && i.current !== l.__e || $(i, null, u)), t || "function" == typeof l.type || (t = null != (o = l.__e)), l.__e = l.__d = void 0, null != (i = l.__c)) {
    if (i.componentWillUnmount)
        try {
            i.componentWillUnmount();
        }
        catch (l) {
            n.__e(l, u);
        }
    i.base = i.__P = null;
} if (i = l.__k)
    for (r = 0; r < i.length; r++)
        i[r] && j(i[r], u, t); null != o && a(o); }
function H(n, l, u) { return this.constructor(n, u); }
function I(l, u, t) { var i, r, c; n.__ && n.__(l, u), r = (i = t === o) ? null : t && t.__k || u.__k, l = p(h, null, [l]), c = [], z(u, (i ? u : t || u).__k = l, r || f, f, void 0 !== u.ownerSVGElement, t && !i ? [t] : r ? null : u.childNodes.length ? e.slice.call(u.childNodes) : null, c, t || f, i), N(c, l); }
n = { __e: function (n, l) { for (var u, t; l = l.__;)
        if ((u = l.__c) && !u.__)
            try {
                if (u.constructor && null != u.constructor.getDerivedStateFromError && (t = !0, u.setState(u.constructor.getDerivedStateFromError(n))), null != u.componentDidCatch && (t = !0, u.componentDidCatch(n)), t)
                    return w(u.__E = u);
            }
            catch (l) {
                n = l;
            } throw n; } }, l = function (n) { return null != n && void 0 === n.constructor; }, y.prototype.setState = function (n, l) { var u; u = null != this.__s && this.__s !== this.state ? this.__s : this.__s = s({}, this.state), "function" == typeof n && (n = n(s({}, u), this.props)), n && s(u, n), null != n && this.__v && (l && this.__h.push(l), w(this)); }, y.prototype.forceUpdate = function (n) { this.__v && (this.__e = !0, n && this.__h.push(n), w(this)); }, y.prototype.render = h, u = [], t = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, x.__r = 0, o = f, r = 0, exports.render = I, exports.hydrate = function (n, l) { I(n, l, o); }, exports.createElement = p, exports.h = p, exports.Fragment = h, exports.createRef = function () { return { current: null }; }, exports.isValidElement = l, exports.Component = y, exports.cloneElement = function (n, l, u) { var t, i, o, r = arguments, f = s({}, n.props); for (o in l)
    "key" == o ? t = l[o] : "ref" == o ? i = l[o] : f[o] = l[o]; if (arguments.length > 3)
    for (u = [u], o = 3; o < arguments.length; o++)
        u.push(r[o]); return null != u && (f.children = u), v(n.type, f, t || n.key, i || n.ref, null); }, exports.createContext = function (n, l) { var u = { __c: l = "__cC" + r++, __: n, Consumer: function (n, l) { return n.children(l); }, Provider: function (n, u, t) { return this.getChildContext || (u = [], (t = {})[l] = this, this.getChildContext = function () { return t; }, this.shouldComponentUpdate = function (n) { this.props.value !== n.value && u.some(w); }, this.sub = function (n) { u.push(n); var l = n.componentWillUnmount; n.componentWillUnmount = function () { u.splice(u.indexOf(n), 1), l && l.call(n); }; }), n.children; } }; return u.Provider.__ = u.Consumer.contextType = u; }, exports.toChildArray = function n(l, u) { return u = u || [], null == l || "boolean" == typeof l || (Array.isArray(l) ? l.some(function (l) { n(l, u); }) : u.push(l)), u; }, exports.__u = j, exports.options = n;

});
___scope___.file("compat/dist/compat.js", function(exports, require, module, __filename, __dirname){

var n = require("preact/hooks/dist/hooks.js"), t = require("preact");
function e(n, t) { for (var e in t)
    n[e] = t[e]; return n; }
function r(n, t) { for (var e in n)
    if ("__source" !== e && !(e in t))
        return !0; for (var r in t)
    if ("__source" !== r && n[r] !== t[r])
        return !0; return !1; }
function o(n) { this.props = n; }
function u(n, e) { function o(n) { var t = this.props.ref, o = t == n.ref; return !o && t && (t.call ? t(null) : t.current = null), e ? !e(this.props, n) || !o : r(this.props, n); } function u(e) { return this.shouldComponentUpdate = o, t.createElement(n, e); } return u.displayName = "Memo(" + (n.displayName || n.name) + ")", u.prototype.isReactComponent = !0, u.__f = !0, u; }
(o.prototype = new t.Component).isPureReactComponent = !0, o.prototype.shouldComponentUpdate = function (n, t) { return r(this.props, n) || r(this.state, t); };
var i = t.options.__b;
t.options.__b = function (n) { n.type && n.type.__f && n.ref && (n.props.ref = n.ref, n.ref = null), i && i(n); };
var f = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
function c(n) { function t(t, r) { var o = e({}, t); return delete o.ref, n(o, (r = t.ref || r) && ("object" != typeof r || "current" in r) ? r : null); } return t.$$typeof = f, t.render = t, t.prototype.isReactComponent = t.__f = !0, t.displayName = "ForwardRef(" + (n.displayName || n.name) + ")", t; }
var l = function (n, e) { return n ? t.toChildArray(t.toChildArray(n).map(e)) : null; }, a = { map: l, forEach: l, count: function (n) { return n ? t.toChildArray(n).length : 0; }, only: function (n) { var e = t.toChildArray(n); if (1 !== e.length)
        throw "Children.only"; return e[0]; }, toArray: t.toChildArray }, s = t.options.__e;
function p(n) { return n && ((n = e({}, n)).__c = null, n.__k = n.__k && n.__k.map(p)), n; }
function v(n) { return n && (n.__v = null, n.__k = n.__k && n.__k.map(v)), n; }
function h() { this.__u = 0, this.t = null, this.__b = null; }
function d(n) { var t = n.__.__c; return t && t.o && t.o(n); }
function x(n) { var e, r, o; function u(u) { if (e || (e = n()).then(function (n) { r = n.default || n; }, function (n) { o = n; }), o)
    throw o; if (!r)
    throw e; return t.createElement(r, u); } return u.displayName = "Lazy", u.__f = !0, u; }
function m() { this.u = null, this.i = null; }
t.options.__e = function (n, t, e) { if (n.then)
    for (var r, o = t; o = o.__;)
        if ((r = o.__c) && r.__c)
            return null == t.__e && (t.__e = e.__e, t.__k = e.__k), r.__c(n, t.__c); s(n, t, e); }, (h.prototype = new t.Component).__c = function (n, t) { var e = this; null == e.t && (e.t = []), e.t.push(t); var r = d(e.__v), o = !1, u = function () { o || (o = !0, t.componentWillUnmount = t.__c, r ? r(i) : i()); }; t.__c = t.componentWillUnmount, t.componentWillUnmount = function () { u(), t.__c && t.__c(); }; var i = function () { var n; if (!--e.__u)
    for (e.__v.__k[0] = v(e.state.o), e.setState({ o: e.__b = null }); n = e.t.pop();)
        n.forceUpdate(); }; e.__u++ || e.setState({ o: e.__b = e.__v.__k[0] }), n.then(u, u); }, h.prototype.componentWillUnmount = function () { this.t = []; }, h.prototype.render = function (n, e) { return this.__b && (this.__v.__k && (this.__v.__k[0] = p(this.__b)), this.__b = null), [t.createElement(t.Fragment, null, e.o ? null : n.children), e.o && n.fallback]; };
var _ = function (n, t, e) { if (++e[1] === e[0] && n.i.delete(t), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.i.size))
    for (e = n.u; e;) {
        for (; e.length > 3;)
            e.pop()();
        if (e[1] < e[0])
            break;
        n.u = e = e[2];
    } };
function y(n) { return this.getChildContext = function () { return n.context; }, n.children; }
function b(n) { var e = this, r = n.l, o = t.createElement(y, { context: e.context }, n.__v); e.componentWillUnmount = function () { var n = e.s.parentNode; n && n.removeChild(e.s), t.__u(e.p); }, e.l && e.l !== r && (e.componentWillUnmount(), e.v = !1), n.__v ? e.v ? (r.__k = e.__k, t.render(o, r), e.__k = r.__k) : (e.s = document.createTextNode(""), e.__k = r.__k, t.hydrate("", r), r.appendChild(e.s), e.v = !0, e.l = r, t.render(o, r, e.s), r.__k = e.__k, e.__k = e.s.__k) : e.v && e.componentWillUnmount(), e.p = o; }
function S(n, e) { return t.createElement(b, { __v: n, l: e }); }
(m.prototype = new t.Component).o = function (n) { var t = this, e = d(t.__v), r = t.i.get(n); return r[0]++, function (o) { var u = function () { t.props.revealOrder ? (r.push(o), _(t, n, r)) : o(); }; e ? e(u) : u(); }; }, m.prototype.render = function (n) { this.u = null, this.i = new Map; var e = t.toChildArray(n.children); n.revealOrder && "b" === n.revealOrder[0] && e.reverse(); for (var r = e.length; r--;)
    this.i.set(e[r], this.u = [1, 0, this.u]); return n.children; }, m.prototype.componentDidUpdate = m.prototype.componentDidMount = function () { var n = this; this.i.forEach(function (t, e) { _(n, e, t); }); };
var E = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
t.Component.prototype.isReactComponent = {};
var w = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
function C(n, e, r) { if (null == e.__k)
    for (; e.firstChild;)
        e.removeChild(e.firstChild); return t.render(n, e), "function" == typeof r && r(), n ? n.__c : null; }
function R(n, e, r) { return t.hydrate(n, e), "function" == typeof r && r(), n ? n.__c : null; }
var g = t.options.event;
function A(n, t) { n["UNSAFE_" + t] && !n[t] && Object.defineProperty(n, t, { get: function () { return this["UNSAFE_" + t]; }, set: function (n) { this["UNSAFE_" + t] = n; } }); }
t.options.event = function (n) { g && (n = g(n)), n.persist = function () { }; var t = !1, e = !1, r = n.stopPropagation; n.stopPropagation = function () { r.call(n), t = !0; }; var o = n.preventDefault; return n.preventDefault = function () { o.call(n), e = !0; }, n.isPropagationStopped = function () { return t; }, n.isDefaultPrevented = function () { return e; }, n.nativeEvent = n; };
var N, U = { configurable: !0, get: function () { return this.class; } }, O = t.options.vnode;
t.options.vnode = function (n) { n.$$typeof = w; var e = n.type, r = n.props; if (e) {
    var o;
    if (r.class != r.className && (U.enumerable = "className" in r, null != r.className && (r.class = r.className), Object.defineProperty(r, "className", U)), "function" != typeof e)
        for (o in r.defaultValue && void 0 !== r.value && (r.value || 0 === r.value || (r.value = r.defaultValue), r.defaultValue = void 0), "select" === e && r.multiple && Array.isArray(r.value) && (t.toChildArray(r.children).forEach(function (n) { -1 != r.value.indexOf(n.props.value) && (n.props.selected = !0); }), r.value = void 0), !0 === r.download && (r.download = ""), r) {
            var u = E.test(o);
            u && (n.props[o.replace(/[A-Z0-9]/, "-$&").toLowerCase()] = r[o]), (u || null === r[o]) && (r[o] = void 0);
        }
    else
        e.prototype && !e.prototype.h && (e.prototype.h = !0, A(e.prototype, "componentWillMount"), A(e.prototype, "componentWillReceiveProps"), A(e.prototype, "componentWillUpdate"));
    !function (t) { var e = n.type, r = n.props; if (r && "string" == typeof e) {
        var o = {};
        for (var u in r)
            /^on(Ani|Tra|Tou)/.test(u) && (r[u.toLowerCase()] = r[u], delete r[u]), o[u.toLowerCase()] = u;
        if (o.ondoubleclick && (r.ondblclick = r[o.ondoubleclick], delete r[o.ondoubleclick]), o.onbeforeinput && (r.onbeforeinput = r[o.onbeforeinput], delete r[o.onbeforeinput]), o.onchange && ("textarea" === e || "input" === e.toLowerCase() && !/^fil|che|ra/i.test(r.type))) {
            var i = o.oninput || "oninput";
            r[i] || (r[i] = r[o.onchange], delete r[o.onchange]);
        }
    } }();
} O && O(n); };
var F = t.options.__r;
t.options.__r = function (n) { F && F(n), N = n.__c; };
var L = { ReactCurrentDispatcher: { current: { readContext: function (n) { return N.__n[n.__c].props.value; } } } };
function k(n) { return t.createElement.bind(null, n); }
function M(n) { return !!n && n.$$typeof === w; }
function D(n) { return M(n) ? t.cloneElement.apply(null, arguments) : n; }
function T(n) { return !!n.__k && (t.render(null, n), !0); }
function W(n) { return n && (n.base || 1 === n.nodeType && n) || null; }
var j = function (n, t) { return n(t); }, I = t.Fragment, P = { useState: n.useState, useReducer: n.useReducer, useEffect: n.useEffect, useLayoutEffect: n.useLayoutEffect, useRef: n.useRef, useImperativeHandle: n.useImperativeHandle, useMemo: n.useMemo, useCallback: n.useCallback, useContext: n.useContext, useDebugValue: n.useDebugValue, version: "16.8.0", Children: a, render: C, hydrate: R, unmountComponentAtNode: T, createPortal: S, createElement: t.createElement, createContext: t.createContext, createFactory: k, cloneElement: D, createRef: t.createRef, Fragment: t.Fragment, isValidElement: M, findDOMNode: W, Component: t.Component, PureComponent: o, memo: u, forwardRef: c, unstable_batchedUpdates: j, StrictMode: I, Suspense: h, SuspenseList: m, lazy: x, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: L };
Object.keys(n).forEach(function (t) { exports[t] = n[t]; }), exports.createElement = t.createElement, exports.createContext = t.createContext, exports.createRef = t.createRef, exports.Fragment = t.Fragment, exports.Component = t.Component, exports.version = "16.8.0", exports.Children = a, exports.render = C, exports.hydrate = R, exports.unmountComponentAtNode = T, exports.createPortal = S, exports.createFactory = k, exports.cloneElement = D, exports.isValidElement = M, exports.findDOMNode = W, exports.PureComponent = o, exports.memo = u, exports.forwardRef = c, exports.unstable_batchedUpdates = j, exports.StrictMode = I, exports.Suspense = h, exports.SuspenseList = m, exports.lazy = x, exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = L, exports.default = P;

});
___scope___.file("hooks/dist/hooks.js", function(exports, require, module, __filename, __dirname){

var n, t, r, u = require("preact"), o = 0, i = [], c = u.options.__r, e = u.options.diffed, f = u.options.__c, a = u.options.unmount;
function p(n, r) { u.options.__h && u.options.__h(t, n, o || r), o = 0; var i = t.__H || (t.__H = { __: [], __h: [] }); return n >= i.__.length && i.__.push({}), i.__[n]; }
function v(n) { return o = 1, s(A, n); }
function s(r, u, o) { var i = p(n++, 2); return i.t = r, i.__c || (i.__c = t, i.__ = [o ? o(u) : A(void 0, u), function (n) { var t = i.t(i.__[0], n); i.__[0] !== t && (i.__ = [t, i.__[1]], i.__c.setState({})); }]), i.__; }
function x(r, o) { var i = p(n++, 4); !u.options.__s && q(i.__H, o) && (i.__ = r, i.__H = o, t.__h.push(i)); }
function m(t, r) { var u = p(n++, 7); return q(u.__H, r) ? (u.__H = r, u.__h = t, u.__ = t()) : u.__; }
function y() { i.some(function (n) { if (n.__P)
    try {
        n.__H.__h.forEach(h), n.__H.__h.forEach(_), n.__H.__h = [];
    }
    catch (t) {
        return n.__H.__h = [], u.options.__e(t, n.__v), !0;
    } }), i = []; }
u.options.__r = function (r) { c && c(r), n = 0; var u = (t = r.__c).__H; u && (u.__h.forEach(h), u.__h.forEach(_), u.__h = []); }, u.options.diffed = function (n) { e && e(n); var t = n.__c; t && t.__H && t.__H.__h.length && (1 !== i.push(t) && r === u.options.requestAnimationFrame || ((r = u.options.requestAnimationFrame) || function (n) { var t, r = function () { clearTimeout(u), l && cancelAnimationFrame(t), setTimeout(n); }, u = setTimeout(r, 100); l && (t = requestAnimationFrame(r)); })(y)); }, u.options.__c = function (n, t) { t.some(function (n) { try {
    n.__h.forEach(h), n.__h = n.__h.filter(function (n) { return !n.__ || _(n); });
}
catch (r) {
    t.some(function (n) { n.__h && (n.__h = []); }), t = [], u.options.__e(r, n.__v);
} }), f && f(n, t); }, u.options.unmount = function (n) { a && a(n); var t = n.__c; if (t && t.__H)
    try {
        t.__H.__.forEach(h);
    }
    catch (n) {
        u.options.__e(n, t.__v);
    } };
var l = "function" == typeof requestAnimationFrame;
function h(n) { "function" == typeof n.u && n.u(); }
function _(n) { n.u = n.__(); }
function q(n, t) { return !n || t.some(function (t, r) { return t !== n[r]; }); }
function A(n, t) { return "function" == typeof t ? t(n) : t; }
exports.useState = v, exports.useReducer = s, exports.useEffect = function (r, o) { var i = p(n++, 3); !u.options.__s && q(i.__H, o) && (i.__ = r, i.__H = o, t.__H.__h.push(i)); }, exports.useLayoutEffect = x, exports.useRef = function (n) { return o = 5, m(function () { return { current: n }; }, []); }, exports.useImperativeHandle = function (n, t, r) { o = 6, x(function () { "function" == typeof n ? n(t()) : n && (n.current = t()); }, null == r ? r : r.concat(n)); }, exports.useMemo = m, exports.useCallback = function (n, t) { return o = 8, m(function () { return n; }, t); }, exports.useContext = function (r) { var u = t.context[r.__c], o = p(n++, 9); return o.__c = r, u ? (null == o.__ && (o.__ = !0, u.sub(t)), u.props.value) : r.__; }, exports.useDebugValue = function (n, t) { u.options.useDebugValue && u.options.useDebugValue(t ? t(n) : n); }, exports.useErrorBoundary = function (r) { var u = p(n++, 10), o = v(); return u.__ = r, t.componentDidCatch || (t.componentDidCatch = function (n) { u.__ && u.__(n), o[1](n); }), [o[0], function () { o[1](void 0); }]; };

});
return ___scope___.entry = "dist/preact.js";
});
FuseBox.pkg("process", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

if (FuseBox.isServer) {
    if (typeof __process_env__ !== "undefined") {
        Object.assign(global.process.env, __process_env__);
    }
    module.exports = global.process;
}
else {
    if (typeof Object.assign != "function") {
        Object.assign = function (target, varArgs) {
            "use strict";
            if (target == null) {
                throw new TypeError("Cannot convert undefined or null to object");
            }
            var to = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];
                if (nextSource != null) {
                    for (var nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }
    var productionEnv = false;
    var process = (module.exports = {});
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;
    function cleanUpNextTick() {
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        }
        else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }
    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = setTimeout(cleanUpNextTick);
        draining = true;
        var len = queue.length;
        while (len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        clearTimeout(timeout);
    }
    process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            setTimeout(drainQueue, 0);
        }
    };
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function () {
        this.fun.apply(null, this.array);
    };
    process.title = "browser";
    process.browser = true;
    process.env = {
        NODE_ENV: productionEnv ? "production" : "development"
    };
    if (typeof __process_env__ !== "undefined") {
        Object.assign(process.env, __process_env__);
    }
    process.argv = [];
    process.version = "";
    process.versions = {};
    function noop() { }
    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.binding = function (name) {
        throw new Error("process.binding is not supported");
    };
    process.cwd = function () {
        return "/";
    };
    process.chdir = function (dir) {
        throw new Error("process.chdir is not supported");
    };
    process.umask = function () {
        return 0;
    };
}

});
return ___scope___.entry = "index.js";
});
FuseBox.pkg("tslib", {}, function(___scope___){
___scope___.file("tslib.js", function(exports, require, module, __filename, __dirname){

/*! *****************************************************************************
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
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if (typeof module === "object" && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p]; };
    __extends = function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    __rest = function (s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };
    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    };
    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    };
    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    __createBinding = function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    };
    __exportStar = function (m, exports) {
        for (var p in m)
            if (p !== "default" && !exports.hasOwnProperty(p))
                exports[p] = m[p];
    };
    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    };
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };
    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };
    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    };
    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };
    __asyncValues = function (o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    };
    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    };
    __importStar = function (mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (Object.hasOwnProperty.call(mod, k))
                    result[k] = mod[k];
        result["default"] = mod;
        return result;
    };
    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    __classPrivateFieldGet = function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };
    __classPrivateFieldSet = function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };
    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});

});
return ___scope___.entry = "tslib.js";
});
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((m||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),f=e.substring(o+1);return[a,f]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(m){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function f(e){return{server:require(e)}}function u(e,n){var o=n.path||"./",a=n.pkg||"default",u=r(e);if(u&&(o="./",a=u[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=u[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!m&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return f(e);var s=x[a];if(!s){if(m&&"electron"!==_.target)throw"Package not found "+a;return f(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,d=t(o,e),c=i(d),p=s.f[c];return!p&&c.indexOf("*")>-1&&(l=c),p||l||(c=t(d,"/","index.js"),p=s.f[c],p||"."!==d||(c=s.s&&s.s.entry||"index.js",p=s.f[c]),p||(c=d+".js",p=s.f[c]),p||(p=s.f[d+".jsx"]),p||(c=d+"/index.jsx",p=s.f[c])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:d,validPath:c}}function s(e,r,n){if(void 0===n&&(n={}),!m)return r(/\.(js|json)$/.test(e)?h.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);_.dynamic(a,o),r(_.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=y[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function d(e){if(null!==e&&["function","object","array"].indexOf(typeof e)!==-1&&!e.hasOwnProperty("default"))return Object.isFrozen(e)?void(e.default=e):void Object.defineProperty(e,"default",{value:e,writable:!0,enumerable:!1})}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=u(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),f=x[t.pkgName];if(f){var p={};for(var v in f.f)a.test(v)&&(p[v]=c(t.pkgName+"/"+v));return p}}if(!i){var g="function"==typeof r,y=l("async",[e,r]);if(y===!1)return;return s(e,function(e){return g?r(e):null},r)}var w=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var b=i.locals={},j=n(t.validPath);b.exports={},b.module={exports:b.exports},b.require=function(e,r){var n=c(e,{pkg:w,path:j,v:t.versions});return _.sdep&&d(n),n},m||!h.require.main?b.require.main={filename:"./",paths:[]}:b.require.main=h.require.main;var k=[b.module.exports,b.require,b.module,t.validPath,j,w];return l("before-import",k),i.fn.apply(k[0],k),l("after-import",k),b.module.exports}if(e.FuseBox)return e.FuseBox;var p="undefined"!=typeof ServiceWorkerGlobalScope,v="undefined"!=typeof WorkerGlobalScope,m="undefined"!=typeof window&&"undefined"!=typeof window.navigator||v||p,h=m?v||p?{}:window:global;m&&(h.global=v||p?{}:window),e=m&&"undefined"==typeof __fbx__dnm__?e:module.exports;var g=m?v||p?{}:window.__fsbx__=window.__fsbx__||{}:h.$fsbx=h.$fsbx||{};m||(h.require=require);var x=g.p=g.p||{},y=g.e=g.e||{},_=function(){function r(){}return r.global=function(e,r){return void 0===r?h[e]:void(h[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){y[e]=y[e]||[],y[e].push(r)},r.exists=function(e){try{var r=u(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=u(e,{}),n=x[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);f(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=x.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(x[e])return n(x[e].s);var t=x[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r.packages=x,r.isBrowser=m,r.isServer=!m,r.plugins=[],r}();return m||(h.FuseBox=_),e.FuseBox=_}(this))