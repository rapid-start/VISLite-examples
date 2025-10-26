export default (el, keyName) => {

    // 获取结点的全部样式
    const allStyle = document.defaultView && document.defaultView.getComputedStyle ?
        document.defaultView.getComputedStyle(el, null) :
        el.currentStyle;

    // 如果没有指定属性名称，返回全部样式
    return typeof keyName === 'string' ?
        allStyle.getPropertyValue(keyName) :
        allStyle;
};