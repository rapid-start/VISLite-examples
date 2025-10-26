import { defineElement } from "zipaper"
import template from "./index.html"
import style from "./index.scss"

export default defineElement({
    template,
    data() {
        return {

        }
    },
    methods: {
        goback() {
            this.$goto("/welcome");
        }
    },
    style: {
        content: style
    }
})