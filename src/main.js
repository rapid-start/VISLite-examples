import { createApp } from "zipaper"

import App from "./pages/App/index.js"
import router from "./router.config.js"

createApp(App)
    .use({
        install(Zipaper) {
            Zipaper.prototype.toWelcome = function () {
                this.$goto("/welcome")
            }
        }
    })
    .use(router) // 路由
    .mount(document.getElementById("root")) // 挂载到页面