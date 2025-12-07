import { createApp } from "zipaper"

import App from "./pages/App/index.js"
import router from "./router.config.js"

let app = createApp(App)
    .use(router) // 路由
    .mount(document.getElementById("root")) // 挂载到页面

// console.log(app)