import { defineElement, ref } from "zipaper";
import template from "./index.html";
import style from "./index.scss";

import fetchData from "../../tools/fetchData";
import urlParse from "../../tools/urlParse";
import shader from "../../tools/shader";

export default defineElement({
    template,
    style: {
        content: style
    },
    data() {
        return {
            template: "",
            style: "",
            script: ref("")
        }
    },
    created() {
        let exampleName = urlParse().params.c, _this = this;
        Promise.all([
            fetchData("./examples/" + exampleName + "/index.html"),
            fetchData("./examples/" + exampleName + "/index.scss"),
            fetchData("./examples/" + exampleName + "/index.js")
        ]).then(([template, style, script]) => {

            _this.template = template;
            _this.style = style;
            _this.script = script;

            _this.runExample();
        });
    },
    methods: {
        goback() {
            this.$goto("/welcome");
        },
        showExampleEditor() {
            document.getElementById("nav-editor-btn").setAttribute("class", "active");
            document.getElementById("nav-code-btn").setAttribute("class", "");

            document.getElementById("source-id").style.display = "";
            document.getElementById("code-id").style.display = "none";
        },
        showExampleCode() {
            document.getElementById("nav-editor-btn").setAttribute("class", "");
            document.getElementById("nav-code-btn").setAttribute("class", "active");

            document.getElementById("source-id").style.display = "none";
            document.getElementById("code-id").style.display = "";
        },
        runExample() {

            // 同步完整代码
            document.getElementById("code-id").innerHTML = "<pre tag='html'>" + this.getFullCode() + "</pre>";
            shader(document.getElementById("code-id"));

            // 同步运行效果
            let iframeWindow = document.getElementById('run-id').contentWindow;
            let iframeDocument = iframeWindow.document;

            iframeWindow.fetchData = function (dataName, callback) {
                var dataUrl = "./data/" + dataName + ".json";

                var cacheData = localStorage.getItem("cache://data/" + dataName);
                if (cacheData) {
                    callback(JSON.parse(cacheData));
                } else {

                    fetch(dataUrl, {
                        method: "GET"
                    }).then(function (res) {
                        return res.json();
                    }).then(function (result) {
                        callback(result);
                        localStorage.setItem("cache://data/" + dataName, JSON.stringify(result));
                    });

                }
            };

            iframeDocument.open();
            iframeDocument.write(this.getFullCode(this.getRunScript()));
            iframeDocument.close();

        },
        getFullCode(scriptObj) {
            return `${scriptObj ? scriptObj.tag : ""}<body>
${this.template}
</body>
<script type="module">
${("\n" + (scriptObj ? scriptObj.code : this.script)).replace(/\n/g, "\n    ")}
</script>
<style>
${("\n" + this.style).replace(/\n/g, "\n    ")}
</style>`;
        },
        getRunScript() {
            let scriptCode = this.script;
            let scriptTag = "";

            // VISLite
            let exec1Result = /import *\{([^}]+)\} *from *(["'])vislite\2;?/.exec(this.script);
            if (exec1Result) {

                // 根据开发环境和生产环境区别lib地址
                let libSrc = window.needCache ? "https://cdn.jsdelivr.net/npm/vislite@" + window.version.vislite + "/lib/" : "./cache/vislite/";

                let items = exec1Result[1].trim().split(","), item, index, importCode = "";
                for (index = 0; index < items.length; index++) {
                    item = items[index].trim();

                    importCode += "import " + item + " from '" + libSrc + item + "/index.es.js';\n"
                }

                scriptCode = scriptCode.replace(exec1Result[0], importCode);
            }

             // @vislite/canvas
            let exec2Result = /import *([^} ]+) *from *(["'])@vislite\/canvas\2;?/.exec(this.script);
            if (exec2Result) {
                let libSrc = window.needCache ? "https://cdn.jsdelivr.net/npm/@vislite/canvas@" + window.version.canvas : "./cache/canvas.js";
                scriptTag += "<script src='" + libSrc + "'></script>";

                let importCode = "var " + exec2Result[1] + " = window.Canvas;\n"
                scriptCode = scriptCode.replace(exec2Result[0], importCode);
            }

            return {
                code: scriptCode,
                tag: scriptTag
            };
        }
    }
})