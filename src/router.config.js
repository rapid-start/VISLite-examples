import { defineRouter } from "zipaper"

export default defineRouter({
    routers: [{
        path: "/",
        redirect: "/welcome"
    }, {
        path: "/welcome",
        component: () => import("./pages/welcome/index.js"),
    }, {
        path: "/zoom-line",
        component: () => import("./pages/zoom-line/index.js"),
    }, {
        path: "/bigview",
        component: () => import("./pages/bigview/index.js"),
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
        path: "/tree-orient-top-bottom",
        component: () => import("./pages/tree-orient-top-bottom/index.js"),
    }, {
        path: "/sankey",
        component: () => import("./pages/sankey/index.js"),
    }, {
        path: "/tree-radial",
        component: () => import("./pages/tree-radial/index.js"),
    }, {
        path: "/ring-simple",
        component: () => import("./pages/ring-simple/index.js"),
    }]
})