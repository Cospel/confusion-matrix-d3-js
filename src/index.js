const d3 = require('d3');
const heatmap = require('./heatmap').default;

const data = [
    [
        0,
        0,
        7
    ],
    [
        0,
        1,
        0
    ],
    [
        0,
        2,
        3
    ],
    [
        1,
        0,
        5
    ],
    [
        1,
        1,
        2
    ],
    [
        1,
        2,
        4
    ],
    [
        2,
        0,
        5
    ],
    [
        2,
        1,
        2
    ],
    [
        2,
        2,
        4
    ]
];

const heatmapChart = heatmap();
let container = d3.select('.container');
container.datum(data).call(heatmapChart);
