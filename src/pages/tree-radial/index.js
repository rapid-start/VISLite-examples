import { defineElement } from "zipaper"
import template from "./index.html"
import style from "./index.scss"

import { Canvas, TreeLayout, move } from "vislite";
import data from "../../assets/flare.json";

export default defineElement({
    template,
    style: {
        content: style
    },
    created() {
        setTimeout(function () {

            let mycontent = document.getElementById("content-id");
            let painter = new Canvas(mycontent).config({
                fontSize: 9
            });

            let width = mycontent.clientWidth;
            let height = mycontent.clientHeight;

            let pid, cx = width * 0.5, cy = height * 0.5;

            let treeLayout = new TreeLayout({
                "id": function (treedata) {
                    return treedata.name
                }
            }).setOption({
                type: "circle",
                x: cx,
                y: cy,
                radius: Math.min(height, width) * 0.5 - 100
            }).bind(data, function (tree) {
                painter.clearRect(0, 0, width, height);

                // 绘制连线
                painter.setRegion("").config({
                    strokeStyle: '#cccccc'
                });
                for (let key in tree.node) {
                    if (tree.node[key].show && key != tree.root) {
                        pid = tree.node[key].pid

                        let x1 = tree.node[key].left, y1 = tree.node[key].top;
                        let x2 = tree.node[pid].left, y2 = tree.node[pid].top;
                        if (pid == tree.root) {
                            painter
                                .beginPath()
                                .moveTo(x1, y1)
                                .bezierCurveTo(
                                    ...move(cx - 30 - x1, cy - 30 - y1, 30, x1, y1),
                                    ...move(x2 - cx + 30, y2 - cy + 30, 30, x2, y2),
                                    x2, y2
                                ).stroke();
                        } else {
                            painter
                                .beginPath()
                                .moveTo(x1, y1)
                                .bezierCurveTo(
                                    ...move(cx - x1, cy - y1, 30, x1, y1),
                                    ...move(x2 - cx, y2 - cy, 30, x2, y2),
                                    x2, y2
                                ).stroke();
                        }
                    }
                }

                // 绘制节点和文字
                painter.config({
                    strokeStyle: '#b0c4de'
                });
                for (let key in tree.node) {
                    if (tree.node[key].show) {
                        if (!tree.node[key].isOpen && tree.node[key].children.length > 0) {
                            painter.config({
                                fillStyle: "#b0c4de"
                            });
                        } else {
                            painter.config({
                                fillStyle: "#ffffff"
                            });
                        }
                        painter.setRegion(key).fullCircle(tree.node[key].left, tree.node[key].top, 4);

                        painter.setRegion("").config({
                            fillStyle: "black"
                        }).fillText("  " + key.replace(/\-\d+$/, ''), tree.node[key].left, tree.node[key].top, tree.node[key].deg);
                    }
                }

            });

            mycontent.addEventListener('click', function (event) {
                painter.getRegion(event.offsetX, event.offsetY).then(function (regionName) {
                    if (regionName) {
                        treeLayout.toggleNode(regionName);
                    }
                });

            });

        }, 200);
    }
})