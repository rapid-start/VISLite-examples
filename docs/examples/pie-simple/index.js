import { Pie } from "@vislite/chart";

new Pie({
    el: document.getElementById("root"),
    data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
    ],
    beginDeg: 0
});