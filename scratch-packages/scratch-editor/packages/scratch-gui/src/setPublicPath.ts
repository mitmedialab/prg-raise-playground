// // @ts-ignore
// import.meta.webpackPublicPath = process.env.PUBLIC_PATH || '/';

// setPublicPath.js

// Set public path
__webpack_public_path__ = process.env.PUBLIC_PATH || '/';

// 🔥 CRITICAL: also fix base URI
if (typeof document !== 'undefined') {
    __webpack_require__.b = document.baseURI;
}