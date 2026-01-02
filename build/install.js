const fs = require("fs")
const vislitePackage = require("vislite/package.json")

fs.writeFileSync("./docs/system.js", `window.version = {
    "vislite":"${vislitePackage.version}"
};`)