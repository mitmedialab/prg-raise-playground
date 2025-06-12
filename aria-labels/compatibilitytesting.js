"use strict";
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["GUI"] = factory();
	else
		root["GUI"] = factory();
})(self, () => {
return (self["webpackChunkGUI"] = self["webpackChunkGUI"] || []).push([["compatibilitytesting"],{

/***/ "./src/playground/compatibility-testing.jsx":
/*!**************************************************!*\
  !*** ./src/playground/compatibility-testing.jsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/.pnpm/react@16.14.0/node_modules/react/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/.pnpm/react-dom@16.14.0_react@16.14.0/node_modules/react-dom/index.js");
/* harmony import */ var _containers_gui_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../containers/gui.jsx */ "./src/containers/gui.jsx");
/* harmony import */ var _lib_hash_parser_hoc_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/hash-parser-hoc.jsx */ "./src/lib/hash-parser-hoc.jsx");
/* harmony import */ var _lib_app_state_hoc_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/app-state-hoc.jsx */ "./src/lib/app-state-hoc.jsx");





const WrappedGui = (0,_lib_app_state_hoc_jsx__WEBPACK_IMPORTED_MODULE_4__["default"])((0,_lib_hash_parser_hoc_jsx__WEBPACK_IMPORTED_MODULE_3__["default"])(_containers_gui_jsx__WEBPACK_IMPORTED_MODULE_2__["default"]));
const DEFAULT_PROJECT_ID = '10015059';
class Player extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
    this.updateProject = this.updateProject.bind(this);
    this.state = {
      projectId: window.location.hash.substring(1) || DEFAULT_PROJECT_ID
    };
  }
  componentDidMount() {
    window.addEventListener('hashchange', this.updateProject);
    if (!window.location.hash.substring(1)) {
      window.location.hash = DEFAULT_PROJECT_ID;
    }
  }
  componentWillUnmount() {
    window.addEventListener('hashchange', this.updateProject);
  }
  updateProject() {
    this.setState({
      projectId: window.location.hash.substring(1)
    });
  }
  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
      style: {
        display: 'flex'
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(WrappedGui, {
      isPlayerOnly: true,
      isFullScreen: false
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("iframe", {
      allowFullScreen: true,
      allowTransparency: true,
      frameBorder: "0",
      height: "402",
      src: "https://scratch.mit.edu/projects/embed/".concat(this.state.projectId, "/?autostart=true"),
      width: "485"
    }));
  }
}
const appTarget = document.createElement('div');
document.body.appendChild(appTarget);
react_dom__WEBPACK_IMPORTED_MODULE_1__.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Player, null), appTarget);

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors-node_modules_pnpm_microbit_microbit-universal-hex_0_2_2_tslib_2_6_2_node_modules_micr-8f889f","src_containers_gui_jsx-src_lib_app-state-hoc_jsx-src_lib_hash-parser-hoc_jsx"], () => (__webpack_exec__("./src/playground/compatibility-testing.jsx")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ return __webpack_exports__;
/******/ }
]);
});
//# sourceMappingURL=compatibilitytesting.js.map