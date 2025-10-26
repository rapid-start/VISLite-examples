import { defineElement } from "zipaper"
import template from "./index.html"
import style from "./index.scss"

import { getLoopColors, getWebGLContext, Shader, Buffer, rotate, Matrix4 } from "vislite";
import to3dColor from "../../tools/to3dColor.js";
import vshaderColor from "./vshader.c";
import fshaderColor from "./fshader.c";
import data from './data.json';

let colors = getLoopColors(data.length);

export default defineElement({
    template,
    style: {
        content: style
    },
    created() {
        setTimeout(function () {

            let colors3d = [];
            for (let i = 0; i < colors.length; i++) {
                colors3d.push(to3dColor(colors[i]));
            }

            let colors_gray = getLoopColors(data.length, 0.9);

            let colors3d_gray = [];
            for (let i = 0; i < colors.length; i++) {
                colors3d_gray.push(to3dColor(colors_gray[i]));
            }

            let el = document.getElementById("content-id");
            let painter = getWebGLContext(el, 1, "aspectFill");

            // 开启深度计算
            painter.enable(painter.DEPTH_TEST);

            // 编译着色器程序
            let shader = new Shader(painter).compile(vshaderColor, fshaderColor).use();

            // 获取世界矩阵、点位置、点颜色变量把柄
            let u_camera = painter.getUniformLocation(shader.program, "u_matrix");
            let a_position = painter.getAttribLocation(shader.program, "a_position");
            let u_color = painter.getUniformLocation(shader.program, "u_color");

            // 创建缓冲区
            let buffer = new Buffer(painter).use();

            // 设置世界矩阵
            let matrix4 = new Matrix4().scale(0.7, 0.7, 0.7).rotate(-1, 1, 0, 0);
            painter.uniformMatrix4fv(u_camera, false, matrix4.value());

            // 求解值总数
            let allValue = 0;
            for (let i = 0; i < data.length; i++) {
                allValue += data[i].value;
            }

            let beginDeg = Math.PI * -0.5;
            for (let i = 0; i < data.length; i++) {
                let deg = data[i].value / allValue * Math.PI * 2;

                let stripTriangles_top = [];
                let stripTriangles_bottom = [];
                let stripTriangles_near = [];
                let stripTriangles_far = [];

                // 计算切割份数
                let splitNum = Math.ceil(deg * el.clientHeight * 0.1);

                let innerRadius = 0.8, outerRadius = 1.7;
                let deepLen = 0.1;

                let perDeg = deg / splitNum;
                for (let j = 0; j <= splitNum; j++) {

                    let positionOuter = rotate(0, 0, beginDeg + perDeg * j, outerRadius, 0);
                    let positionInner = rotate(0, 0, beginDeg + perDeg * j, innerRadius, 0);

                    stripTriangles_top.push(
                        positionOuter[0], positionOuter[1], deepLen,
                        positionInner[0], positionInner[1], deepLen
                    );

                    stripTriangles_bottom.push(
                        positionOuter[0], positionOuter[1], -deepLen,
                        positionInner[0], positionInner[1], -deepLen
                    );

                    stripTriangles_near.push(
                        positionInner[0], positionInner[1], deepLen,
                        positionInner[0], positionInner[1], -deepLen
                    );

                    stripTriangles_far.push(
                        positionOuter[0], positionOuter[1], deepLen,
                        positionOuter[0], positionOuter[1], -deepLen
                    );

                }

                // 设置明亮颜色
                painter.uniform4f(u_color, ...colors3d[i]);

                // 绘制上
                buffer.write(new Float32Array(stripTriangles_top)).divide(a_position, 3, 3, 0);
                painter.drawArrays(painter.TRIANGLE_STRIP, 0, stripTriangles_top.length / 3);

                // 绘制下
                buffer.write(new Float32Array(stripTriangles_bottom)).divide(a_position, 3, 3, 0);
                painter.drawArrays(painter.TRIANGLE_STRIP, 0, stripTriangles_bottom.length / 3);

                // 设置暗淡颜色
                painter.uniform4f(u_color, ...colors3d_gray[i]);

                // 绘制上
                buffer.write(new Float32Array(stripTriangles_near)).divide(a_position, 3, 3, 0);
                painter.drawArrays(painter.TRIANGLE_STRIP, 0, stripTriangles_near.length / 3);

                // 绘制下
                buffer.write(new Float32Array(stripTriangles_far)).divide(a_position, 3, 3, 0);
                painter.drawArrays(painter.TRIANGLE_STRIP, 0, stripTriangles_far.length / 3);

                beginDeg += deg;
            }

        }, 200);
    }
})