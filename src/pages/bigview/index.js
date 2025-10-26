import { defineElement, ref } from "zipaper"
import template from "./index.html"
import style from "./index.scss"

export default defineElement({
    template,
    style: {
        content: style
    },
    data() {
        return {
            titleSize: ref(30)
        };
    },
    created() {
        setTimeout(this.updateSize, 200);
        window.addEventListener("resize", this.updateSize);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.updateSize);
    },
    methods: {
        updateSize() {
            let width = 1920;
            let height = 1920 * (window.innerHeight - 60) / window.innerWidth;
            let scaleVal = window.innerWidth / 1920;

            let contentEl = document.getElementById("content-id");

            contentEl.style.transform = 'scale(' + scaleVal + ',' + scaleVal + ' )';
            contentEl.style.width = width + "px";
            contentEl.style.height = height + 'px';

            this.titleSize = height * 0.03;
        }
    }
})