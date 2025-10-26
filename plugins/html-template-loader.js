const { parseTemplate } = require("xhtml-to-json");

module.exports = function (source) {
    return `export default ${JSON.stringify(parseTemplate(source).toJson())}`;
};