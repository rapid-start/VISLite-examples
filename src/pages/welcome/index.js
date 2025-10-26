import { defineElement } from "zipaper"
import template from "./index.html"
import style from "./index.scss"

export default defineElement({
    template,
    style: {
        content: style
    },
    methods:{
        openExample(_,target){
            this.$goto("/"+target.getAttribute("tag"));
        }
    }
})