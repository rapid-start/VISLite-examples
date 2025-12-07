const fs = require("fs")
const package = require("vislite/package.json")

fs.writeFileSync("./docs/system.js", `window.VISLite_system = {
    "version": "${package.version}"
};`)