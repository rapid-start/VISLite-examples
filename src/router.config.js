import { defineRouter } from "zipaper"

export default defineRouter({
    routers: [{
        path: "/",
        redirect: "/welcome"
    }, {
        path: "/bigview",
        component: () => import("./pages/bigview/index.js"),
    }, {
        path: "/welcome",
        component: () => import("./pages/welcome/index.js"),
        children: [
            {
                path: "/zoom-line",
                component: () => import("./pages/zoom-line/index.js"),
            }, {
                path: "/h2o",
                component: () => import("./pages/h2o/index.js"),
            }, {
                path: "/manual-unlocking",
                component: () => import("./pages/manual-unlocking/index.js"),
            }, {
                path: "/ring3d",
                component: () => import("./pages/ring3d/index.js"),
            }, {
                path: "/sankey",
                component: () => import("./pages/sankey/index.js"),
            }
        ]
    }, {
        path: "/editor",
        component: () => import("./pages/editor/index.js")
    }]
})