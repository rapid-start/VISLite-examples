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
        getFullCode(scriptCode) {
            return `<body>
${this.template}
</body>
<script type="module">
${("\n" + (scriptCode || this.script)).replace(/\n/g, "\n    ")}
</script>
<style>
${("\n" + this.style).replace(/\n/g, "\n    ")}
</style>`;
        },
        getRunScript() {
            let execResult = /import *\{([^}]+)\} *from *(["'])vislite\2;?/.exec(this.script);

            // 根据开发环境和生产环境区别lib地址
            let libSrc = window.needCache ? "https://cdn.jsdelivr.net/npm/vislite@" + window.VISLite_system.version + "/lib/" : "./cache-VISLite/";

            let items = execResult[1].trim().split(","), item, index, importCode = "";
            for (index = 0; index < items.length; index++) {
                item = items[index].trim();

                importCode += "import " + item + " from '" + libSrc + item + "/index.es.js';\n"
            }

            return this.script.replace(execResult[0], importCode);
        }
    }
})