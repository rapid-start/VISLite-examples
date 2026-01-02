import Canvas from "@vislite/canvas";

let attr = { // 公共的属性
    cx: _this => _this.width * 0.5,
    cy: _this => _this.height * 0.5,
    r1: 180,
    r2: 250,
    beginDeg: Math.PI * 0.75,
}

let canvas = new Canvas({
    el: document.getElementById("root"),
    data: {
        deep: 0
    },
    template: [{
        name: "arc",
        attr: {
            type: "fill",
            deg: Math.PI * 1.5,
            ...attr
        },
        config: {
            fillStyle: "#aaaaaa",
            arcStartCap: "round",
            arcEndCap: "round"
        },
    }, {
        name: "arc",
        attr: {
            type: "fill",
            deg: _this => Math.PI * 1.5 * _this.data.deep,
            ...attr
        },
        config: {
            // fillStyle: "#1e8e9c",
            fillStyle: _this => _this.painter.createConicGradient(
                _this.width * 0.5, _this.height * 0.5,
                Math.PI * 0.5, Math.PI * 2)
                .setColor(0, "#85eabeff")
                .setColor(0.3, "#e3e34dff")
                .setColor(0.5, "#d3d318ff")
                .setColor(0.7, "#eb6661ff")
                .setColor(1, "#ca130dff")
                .value(),

            arcStartCap: "round",
            arcEndCap: "round"
        },
    }, {
        name: "text",
        attr: {
            type: "fill",
            text: _this => (_this.data.deep * 120).toFixed(0) + " km/h",
            x: _this => _this.width * 0.5,
            y: _this => _this.height * 0.5,
        },
        config: {
            textAlign: "center",
            fontSize: 40,
            fontWeight: 800
        }
    }]
});

setInterval(function () {
    canvas.setData({
        deep: Math.random()
    });
}, 2000);