import { defineElement } from "zipaper"
import template from "./index.html"
import style from "./index.scss"

// import { Canvas, getLoopColors } from "vislite";
import Canvas from "vislite/lib/Canvas/index.es.min";
import getLoopColors from "vislite/lib/getLoopColors/index.es.min";

import data from "../../assets/sankey.json";
import toSankeyImageData from "./toSankeyImageData";

export default defineElement({
    template,
    style: {
        content: style
    },
    created() {
        setTimeout(function () {
            let el = document.getElementById("content-id");

            let boxWidth = el.clientWidth, boxHeight = el.clientHeight;

            let painter = new Canvas(el);
            let sankeyData = toSankeyImageData(data, boxWidth - 100, boxHeight - 60, 10, 30);

            // 获取颜色
            let nodeColors = getLoopColors(data.nodes.length);
            let lineColors = getLoopColors(data.nodes.length, 0.2);

            painter.config({
                "fontSize": 10
            });

            // 先绘制连线
            let key, node, tNode, i, _helpDis;
            for (key in sankeyData) {
                node = sankeyData[key];

                painter.config({
                    fillStyle: lineColors.pop()
                });
                // 连线
                for (i = 0; i < node.nexts.length; i++) {
                    tNode = sankeyData[node.nexts[i].name];

                    _helpDis = (tNode.left - (node.left + node.width)) * 0.5;

                    painter
                        .beginPath()
                        .moveTo(node.left + node.width, node.nextTops[i])
                        .bezierCurveTo(node.left + node.width + _helpDis, node.nextTops[i], tNode.left - _helpDis, tNode.preTops[0], tNode.left, tNode.preTops[0])
                        .lineTo(tNode.left, tNode.preTops[1])
                        .bezierCurveTo(tNode.left - _helpDis, tNode.preTops[1], node.left + node.width + _helpDis, node.nextTops[i + 1], node.left + node.width, node.nextTops[i + 1])
                        .fill();
                    tNode.preTops.shift();
                }

            }

            // 再绘制别的
            for (key in sankeyData) {
                node = sankeyData[key];

                // 结点
                painter.config({
                    fillStyle: nodeColors.pop()
                }).fillRect(node.left, node.top, node.width, node.height);

                // 文字
                painter.config({
                    fillStyle: '#555555'
                }).fillText(key, node.left + node.width, node.top + node.height * 0.5);

            }
        }, 200);
    }
})