// setPublicPath.js
if (process.env.PUBLIC_PATH) {
    __webpack_public_path__ = process.env.PUBLIC_PATH;
} else {
    __webpack_public_path__ = '/'; // fallback
}