import { defineElement } from "zipaper"
import template from "./index.html"
import style from "./index.scss"

// import { Canvas } from "vislite";
import Canvas from "vislite/lib/Canvas/index.es.min";

// import isMobile from "../../tools/isMobile";
import offsetValue from "../../tools/offsetValue";

let updateView = (painter, circles, endPoint) => {
    let info = painter.getInfo();

    painter.clearRect(0, 0, info.width, info.height);
    let width = info.width * 0.85;

    let gapSize = (info.width - width) * 0.5;
    let itemSize = width / 3;
    let itemRadius = itemSize * 0.75 * 0.5;

    // 绘制圆球
    painter.config({
        strokeStyle: "#555",
        lineWidth: 1
    });
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            painter.setRegion(i + "-" + j);

            let cx = gapSize + (i + 0.5) * itemSize;
            let cy = info.height - (2.5 - j) * itemSize - gapSize;

            painter

                // 进入区域模式，记录区域
                .onlyRegion(true).fillCircle(cx, cy, itemRadius)

                // 退出区域模式，绘制图形
                .onlyRegion(false).strokeCircle(cx, cy, itemRadius);
        }
    }

    // 进入视图模式，绘制选中轨迹
    painter.setRegion("").onlyView(true);

    for (let index = 0; index < circles.length; index++) {
        let i = circles[index][0];
        let j = circles[index][1];

        let cx = gapSize + (i + 0.5) * itemSize;
        let cy = info.height - (2.5 - j) * itemSize - gapSize;

        painter.config({
            fillStyle: "#abd5e3"
        }).fillCircle(cx, cy, itemRadius).config({
            fillStyle: "#3b9ee1"
        }).fillCircle(cx, cy, itemRadius * 0.3);
    }

    painter.config({
        strokeStyle: "#3b9ee1",
        lineWidth: itemRadius * 0.1
    }).beginPath();

    for (let index = 0; index < circles.length; index++) {
        let i = circles[index][0];
        let j = circles[index][1];

        let cx = gapSize + (i + 0.5) * itemSize;
        let cy = info.height - (2.5 - j) * itemSize - gapSize;

        painter.lineTo(cx, cy);
    }

    if (endPoint) painter.lineTo(endPoint[0], endPoint[1]);
    painter.stroke()

        // 退出视图模式
        .onlyView(false);

};

export default defineElement({
    template,
    style: {
        content: style
    },
    created() {
        setTimeout(function () {
            let el = document.getElementById("content-id");

            let painter = new Canvas(el);

            let isDown = false;
            let circles = [];

            updateView(painter, circles);

            let doMousedown = (x, y) => {

                painter.getRegion(x, y).then(regionName => {
                    if (regionName) {
                        circles = [];
                        isDown = true;
                    }
                });
            };

            let preRegionName = "";
            let doMousemove = (x, y) => {
                if (isDown) {
                    painter.getRegion(x, y).then(regionName => {

                        if (regionName && regionName != preRegionName) {
                            preRegionName = regionName;

                            let regionArray = regionName.split("-");
                            circles.push([+regionArray[0], +regionArray[1]]);
                        }

                        updateView(painter, circles, [x, y]);
                    });
                }
            };

            let doMouseup = () => {
                isDown = false;
                updateView(painter, circles);

                let values = [];
                for (let index = 0; index < circles.length; index++) {
                    values.push(circles[index][1] * 3 + circles[index][0] + 1);
                }

                if (values.length > 0)
                    setTimeout(() => {
                        alert("解锁密码：" + values.join("-"));

                        updateView(painter, []);
                    }, 50);
            };

            // if (isMobile) {

            el.addEventListener("touchstart", (event) => {
                doMousedown(...offsetValue(el, event));
            }, false);


            el.addEventListener("touchmove", (event) => {
                doMousemove(...offsetValue(el, event));
            }, false);

            el.addEventListener("touchend", doMouseup, false);

            // } else {
            el.addEventListener("mousedown", (event) => {
                doMousedown(...offsetValue(el, event));
            }, false);

            el.addEventListener("mousemove", (event) => {
                doMousemove(...offsetValue(el, event));
            }, false);

            el.addEventListener("mouseup", doMouseup, false);
            // }

        }, 200);
    }
})