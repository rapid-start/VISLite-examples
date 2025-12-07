import { Canvas, animation, rotate, getLoopColors } from "vislite";

let i;

let data = [
    { value: 1048, name: 'Search Engine' },
    { value: 735, name: 'Direct' },
    { value: 580, name: 'Email' },
    { value: 484, name: 'Union Ads' },
    { value: 300, name: 'Video Ads' }
];

let colors = getLoopColors(data.length);

let mycontent = document.getElementById("content-id");
let mytooltip = document.getElementById("tooltip-id");

let painter, updateView;

let beginDeg, deg, allValue = 0, cx, cy, radius;

// 求解值总数
for (i = 0; i < data.length; i++) {
    allValue += data[i].value;
}

let doit = function () {

    // 圆心和半径
    cx = mycontent.clientWidth * 0.5;
    cy = mycontent.clientHeight * 0.5 + 20;
    radius = Math.max(Math.min(cx, cy) - 100, 0);

    if (radius <= 0) return;

    painter = new Canvas(mycontent).config({
        shadowColor: "#555555"
    });

    /**
     * 定义绘制方法
     * @param deep 绘制进度
     * @param up 被悬浮的
     * @param down 取消悬浮的
     */
    updateView = function (deep, up, down) {
        painter.setRegion("")
            .clearRect(0, 0, mycontent.clientWidth, mycontent.clientHeight);

        // 绘制标题
        painter.config({
            "textAlign": "center",
            "fontSize": 20,
            "fontWeight": 600

        }).fillText("Referer of a Website", cx, 30)
            .config({
                "fontWeight": 200,
                "fontSize": 12
            }).fillText("Fake Data", cx, 60);

        // legend提示
        painter.config({
            "textAlign": "left"
        });
        for (i = 0; i < data.length; i++) {
            painter.config({
                "fillStyle": "black"
            }).fillText(data[i].name, 50, i * 24 + 50)
                .config({
                    "fillStyle": colors[i],
                    "rectRadius": [5]
                }).fillRect(20, i * 24 + 40, 25, 16);
        }

        beginDeg = Math.PI * -0.5;

        let drawSelectPie;
        for (i = 0; i < data.length; i++) {

            deg = data[i].value / allValue * Math.PI * 2;
            let drawPie = function (i, beginDeg, deg) {
                painter.setRegion("index" + i);

                // 根据动画修改半径
                let radiusMore = 0;
                if (up == "index" + i) {
                    radiusMore = deep;
                } else if (down == "index" + i) {
                    radiusMore = 1 - deep;
                }

                painter.config({
                    fillStyle: colors[i],
                    strokeStyle: colors[i],
                    shadowBlur: up == "index" + i ? 10 : 0
                });

                let p1 = rotate(cx, cy, beginDeg + deg * 0.5, cx + radius, cy);
                let p2 = rotate(cx, cy, beginDeg + deg * 0.5, cx + radius + 20, cy);
                let p3 = [p2[0] + 15 * (p1[0] > cx ? 1 : -1), p2[1]];
                let p4 = [p2[0] + 20 * (p1[0] > cx ? 1 : -1), p2[1]];

                // 连线
                painter.beginPath().moveTo(p1[0], p1[1]).lineTo(p2[0], p2[1]).lineTo(p3[0], p3[1]).stroke();

                // 饼
                painter.fillArc(cx, cy, radius * 0.5 - radiusMore * radius * 0.05, radius + radiusMore * radius * 0.05, beginDeg, deg);

                // 文字
                painter.config({
                    textAlign: p1[0] > cx ? "left" : "right",
                    fillStyle: "black",
                    shadowBlur: 0
                }).fillText(data[i].name, p4[0], p4[1]);

            };

            if (up != "index" + i) {
                drawPie(i, beginDeg, deg);
            } else {
                drawSelectPie = (function (i, beginDeg, deg) {
                    return function () {
                        drawPie(i, beginDeg, deg);
                    }
                })(i, beginDeg, deg);
            }

            beginDeg += deg;
        }

        if (drawSelectPie) drawSelectPie();

    };

    updateView(1);
};
doit();

// 当前被悬浮的区域
let currentRegion;

// 注册鼠标悬浮事件
let stop = function () { };
mycontent.addEventListener('mousemove', function (event) {
    if (painter) {
        painter.getRegion(event.offsetX, event.offsetY).then(function (regionName) {
            if (regionName) {

                if (!currentRegion) {

                    // 显示悬浮框
                    mytooltip.style.display = "";

                }

                // 如果悬浮区域改变了
                if (regionName != currentRegion) {
                    stop();

                    let _currentRegion = currentRegion;
                    currentRegion = regionName;

                    stop = animation(function (deep) {
                        updateView(deep, regionName, _currentRegion);
                    }, 200);

                    let index = +regionName.replace('index', '');

                    // 修改悬浮框内容
                    mytooltip.innerHTML = "<div style='border-color:" + colors[index] + "'><label>Access From</label>" +
                        "<i style='background-color:" + colors[index] + "'></i>" +
                        "<span>" + data[index].name + "</span>" +
                        "<span>" + data[index].value + "</span></div>";

                }

                // 修改悬浮框位置
                if (event.offsetX > cx) {
                    mytooltip.style.left = (event.offsetX - 20 - mytooltip.clientWidth) + "px";
                } else {
                    mytooltip.style.left = (event.offsetX + 20) + "px";
                }
                mytooltip.style.top = (event.offsetY + 20) + "px";

            } else {

                // 如果当前存在悬浮区域
                if (currentRegion) {
                    stop();

                    let _currentRegion = currentRegion;
                    currentRegion = "";

                    // 隐藏悬浮框
                    mytooltip.style.display = "none";

                    stop = animation(function (deep) {
                        updateView(deep, undefined, _currentRegion);
                    }, 200);
                }

            }

        });
    }
});