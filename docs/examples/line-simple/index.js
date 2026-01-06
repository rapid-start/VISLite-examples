import { Line } from "@vislite/chart";

new Line({
    el: document.getElementById("root"),
    xAxis: {
        value: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    data: [120, 200, 150, 80, 70, 110, 130],
    isSmooth: true
});