import { defineElement } from "zipaper"
import template from "./index.html"
import style from "./index.scss"

import openBlank from "../../tools/openBlank"

export default defineElement({
    template,
    style: {
        content: style
    },
    methods: {
        openCopy(_, target) {
            openBlank("#/editor?c=" + target.getAttribute("tag"));
        },
        openExample(_, target) {
            let pagename = target.getAttribute("tag")
            if (["bigview"].indexOf(pagename) > -1) {
                openBlank("#/" + pagename);
            } else {
                this.$goto("/welcome/" + pagename);
            }
        }
    }
})