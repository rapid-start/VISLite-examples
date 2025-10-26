const { copyDisk } = require("oipage/nodejs/disk/index");
const { readdirSync } = require("fs");
const { join } = require("path");

module.exports = class CopyPublicPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.done.tap('CopyPublicPlugin', () => {
            const subFiles = readdirSync(join(process.cwd(), "./" + this.options.source));
            subFiles.forEach(item => {
                if (this.options.ignore.indexOf(item) < 0)
                    copyDisk(
                        join(process.cwd(), "./" + this.options.source + "/" + item),
                        join(process.cwd(), "./" + this.options.target + "/" + item)
                    );
            });

        });
    }
}