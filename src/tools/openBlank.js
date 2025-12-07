export default function (url) {
    let el = document.createElement("a");
    el.setAttribute("href", url);
    el.setAttribute("target", "_blank");
    el.click();
}