const fs = require("fs")
const vislitePackage = require("vislite/package.json")
const canvasPackage = require("@vislite/canvas/package.json")

fs.writeFileSync("./docs/system.js", `window.version = {
    "vislite":"${vislitePackage.version}",
    "canvas":"${canvasPackage.version}"
};`)