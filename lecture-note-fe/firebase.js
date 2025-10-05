// Compatibility shim: re-export firebase client from the TypeScript module in `src`
// This keeps any existing import paths working while the app uses the typed module.
const mod = require("./src/firebase");
module.exports = mod;
