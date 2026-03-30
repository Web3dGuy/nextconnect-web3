// Shim for packages that do require('crypto') and then use .subtle
// Instead of webpack resolving 'crypto' to false (empty module),
// this delegates to the browser's native Web Crypto API.
if (typeof globalThis !== "undefined" && globalThis.crypto) {
  module.exports = globalThis.crypto;
} else {
  module.exports = {};
}
