import { splitNum } from './tool/circle';
import prismHorizontal from './prism-horizontal';
import prismVertical from './prism-vertical';
import sphereFragment from './sphere-fragment';
import mergeOption from '../mergeOption';
import rotateLineFactory from "./tool/rotateLine";
import triangles from "./tool/triangles";
import { rotate } from "vislite";

class Geometry {
    __option;

    constructor(option = {}) {
        this.__option = mergeOption(option, {
            precision: 0.1, // 精度
            normal: false, // 是否需要法向量
        });
    }

    /**
     * 【1】辅助方法
     */

    // 计算切割份数
    splitNum(radius, deg) {
        return splitNum(this.__option.precision, radius, deg);
    }

    // 物体方向转换
    rotateLine(x1, y1, z1, x2, y2, z2) {
        const rotateLine = rotateLineFactory(x1, y1, z1, x2, y2, z2);
        return (x, y, z) => rotateLine(x, y, z, this.__option.normal);
    }

    /**
     * 【2】立方片段
     */

    // 棱柱水平部分
    prismHorizontal(x, y, z, radius, num, d, beginDeg, deg) {
        return prismHorizontal(this.__option.normal, x, y, z, radius, num, d, beginDeg, deg);
    }

    // 棱柱垂直部分
    prismVertical(x, y, z, radius, height, num, beginDeg, deg) {
        return prismVertical(this.__option.normal, x, y, z, radius, height, num, beginDeg, deg);
    }

    // 球体中的一瓣子
    sphereFragment(cx, cy, cz, radius, num, index) {
        return sphereFragment(this.__option.normal, cx, cy, cz, radius, num, index);
    }

    /**
     * 【3】立方体
     */

    // 饼柱体
    pie(x, y, z, radius, height, beginDeg, deg) {

        // 求解出需要切割多少份比较合理
        const num = splitNum(this.__option.precision, radius, deg);

        const beginXZ = rotate(x, z, beginDeg, x + radius, z);
        const endXZ = rotate(x, z, beginDeg + deg, x + radius, z);

        const result = [{
            name: "bottom",
            points: prismHorizontal(this.__option.normal, x, y, z, radius, num, height > 0 ? -1 : 1, beginDeg, deg),
            length: 3 * num,
            method: "TRIANGLES"
        }, {
            name: "top",
            points: prismHorizontal(this.__option.normal, x, y + height, z, radius, num, height > 0 ? 1 : -1, beginDeg, deg),
            length: 3 * num,
            method: "TRIANGLES"
        }, {
            name: "side",
            points: prismVertical(this.__option.normal, x, y, z, radius, height, num, beginDeg, deg),
            length: 6 * num,
            method: "TRIANGLES"
        }, {
            name: "begin",
            points: triangles(this.__option.normal, [
                x, y, z, x, y + height, z, beginXZ[0], y, beginXZ[1],
                beginXZ[0], y + height, beginXZ[1], beginXZ[0], y, beginXZ[1], x, y + height, z
            ]),
            length: 6,
            method: "TRIANGLES"
        }, {
            name: "end",
            points: triangles(this.__option.normal, [
                x, y, z, endXZ[0], y, endXZ[1], x, y + height, z,
                endXZ[0], y + height, endXZ[1], x, y + height, z, endXZ[0], y, endXZ[1]
            ]),
            length: 6,
            method: "TRIANGLES"
        }];

        return result;
    }

    // 圆柱体
    cylinder(x, y, z, radius, x2, y2, z2) {

        // 求解出需要切割多少份比较合理
        const num = splitNum(this.__option.precision, radius);

        if (arguments.length == 5) {
            return this.prism(x, y, z, radius, x2, num);
        } else {
            return this.prism(x, y, z, radius, x2, y2, z2, num);
        }
    }

    // 棱柱体
    prism(x, y, z, radius, x2, y2, z2, num) {

        let height, rotateLine = null;

        if (arguments.length == 6) {
            height = x2;
            num = y2;
        } else {
            height = (y > y2 ? -1 : 1) * Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y) + (z2 - z) * (z2 - z));
            rotateLine = rotateLineFactory(x, y, z, x2, y2, z2);
        }

        const result = [{
            name: "bottom",
            points: [],
            length: 0,
            method: "TRIANGLES"
        }, {
            name: "top",
            points: [],
            length: 0,
            method: "TRIANGLES"
        }, {
            name: "side",
            points: [],
            length: 0,
            method: "TRIANGLES"
        }];

        // 绘制底部的盖子
        (result[0].points).push(...prismHorizontal(this.__option.normal, x, y, z, radius, num, height > 0 ? -1 : 1));

        // 绘制顶部的盖子
        (result[1].points).push(...prismHorizontal(this.__option.normal, x, y + height, z, radius, num, height > 0 ? 1 : -1));

        // 绘制侧边部分
        (result[2].points).push(...prismVertical(this.__option.normal, x, y, z, radius, height, num));

        for (let i = 0; i < result.length; i++) {
            if (rotateLine) {

                const points = [];
                let isNormal = false;
                for (let index = 0; index < result[i].points.length; index += 3) {
                    points.push(...rotateLine(result[i].points[index], result[i].points[index + 1], result[i].points[index + 2], (this.__option.normal) && isNormal));
                    isNormal = !isNormal;
                }
                (result[i].points) = points;
            }
            result[i].length = result[i].points.length / (this.__option.normal ? 6 : 3);
        }

        return result;
    }

    // 球体
    sphere(cx, cy, cz, radius) {

        // 求解出需要切割多少份比较合理
        const num = splitNum(this.__option.precision, radius);

        // 然后一瓣瓣的绘制
        const result = [{
            name: "surface",
            points: [],
            length: 0,
            method: "TRIANGLES"
        }];
        for (let i = 0; i < num; i++) {
            (result[0].points).push(...sphereFragment(this.__option.normal, cx, cy, cz, radius, num, i));
        }

        result[0].length = result[0].points.length / (this.__option.normal ? 6 : 3);

        return result;
    }

}

export default Geometry;