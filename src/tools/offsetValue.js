import isMobile from "./isMobile";

export default (el, event) => {
    if (!isMobile) {
        let _event = event;

        return [
            _event.offsetX, _event.offsetY
        ];
    } else {

        // 阻止浏览器默认事件，重要
        event.preventDefault();

        let _event = event;

        // 返回元素的大小及其相对于视口的位置
        let bounding = el.getBoundingClientRect();

        return [
            (_event.targetTouches[0].clientX) - bounding.left,
            (_event.targetTouches[0].clientY) - bounding.top
        ];
    }
};