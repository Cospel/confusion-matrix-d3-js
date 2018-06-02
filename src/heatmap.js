const d3 = require('d3');

function heatmap() {
    const boxBorderColor = '#FFFFFF';
    const boxBorderSize = 2;
    const daysHuman = ['test', 'dog', 'elephant'];
    const hoursHuman = daysHuman;
    const dayLabelWidth = 30;
    const width = 200;
    const height = 200;
    const boxSize = ((width-40)/daysHuman.length) - 2;
    const hourLabelHeight = 20;
    const boxInitialColor = '#BBBBBB';
    const animationDuration = 2000;

    // Configurable properties
    let colorSchema = [
        //'#ffd8d4',
        //'#ff584c',
        //'#9c1e19',

        '#BBBBBB',
        '#C0FFE7',
        '#95F6D7',
        '#6AEDC7',
        '#59C3A3',
        '#479980'
    ];
    let margin = {
        top: 30,
        right: 10,
        bottom: 10,
        left: 30
    };

    let svg;
    let data;
    let colorScale;
    let chartWidth;
    let chartHeight;
    let boxes;
    let dayLabels;
    let hourLabels;

    function exports(_selection) {
        _selection.each(function(_data) {
            chartWidth = width - margin.left - margin.right;
            chartHeight = height - margin.top - margin.bottom;

            data = _data;

            buildScales();
            buildSVG(this);
            drawDayLabels();
            drawHourLabels();
            drawBoxes();
        });
    }

    function buildContainerGroups() {
        let container = svg
              .append('g')
                .classed('container-group', true)
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

        container
          .append('g')
            .classed('chart-group', true);
        container
          .append('g')
            .classed('day-labels-group', true);
        container
          .append('g')
            .classed('hour-labels-group', true);
        container
          .append('g')
            .classed('metadata-group', true);
    }

    function buildScales() {
        colorScale = d3.scaleLinear()
                .range([colorSchema[0], colorSchema[colorSchema.length - 1]])
                .domain(d3.extent(data, function (d) { return d[2] }))
                .interpolate(d3.interpolateHcl);
    }

    function buildSVG(container) {
        if (!svg) {
            svg = d3.select(container)
                  .append('svg')
                    .classed('heatmap', true);

            buildContainerGroups();
        }

        svg
            .attr('width', width)
            .attr('height', height);
    }

    function drawBoxes() {
        boxes = svg.select('.chart-group').selectAll('.box').data(data);

        // draw boxes
        boxes.enter()
          .append('rect')
            .classed('box', true)
            .attr('width', boxSize)
            .attr('height', boxSize)
            .attr('x', function (d) { return d[1] * boxSize; })
            .attr('y', function (d) { return d[0] * boxSize; })
            .style('opacity', 0.2)
            .style('fill', boxInitialColor)
            .style('stroke', boxBorderColor)
            .style('stroke-width', boxBorderSize)
            .transition()
            .duration(animationDuration)
            .style('fill', function (d) { return colorScale(d[2]); })
            .style('opacity', 1);

        console.log('test new 8');
        // show the text of value above the cell
        svg.selectAll('rect').on('mouseover', function(d) {
            // get the position of the clicked cell
            var xPos = parseFloat(d3.select(this).attr('x'));
            var yPos = parseFloat(d3.select(this).attr('y'));
            d3.select(this).style('stroke', 'black');
            console.log(xPos, yPos);

            // draw boxes
            svg.select('.chart-group').append('rect')
                    .attr({
                        'class': 'tooltip',
                        'x': xPos + 10,
                        'y': yPos - 30,
                        'width': 40,
                        'height': 20,
                        'fill': 'rgba(200, 200, 200, 0.5)',
                        'stroke': 'yellow'
                    });

            // draw text value above drawed box
            svg.select('.chart-group').append('text')
                    .attr({
                        'class': 'tooltip',
                        'x': xPos + 30,
                        'y': yPos - 15,
                        'text-anchor': 'middle',
                        'font-family': 'sans-serif',
                        'font-size': '14px',
                        'font-weight': 'bold',
                        'fill': 'black'
                    })
                    .text(d3.format('.2f')(0.4212));

        }).on('mouseout', function(d) {
            d3.select(this).style('stroke', boxBorderColor);
        });
        boxes.exit().remove();
    }

    function drawDayLabels() {
        let dayLabelsGroup = svg.select('.day-labels-group');

        dayLabels = svg.select('.day-labels-group').selectAll('.day-label')
            .data(daysHuman);

        dayLabels.enter()
          .append('text')
            .text((d) => d)
            .attr('x', 0)
            .attr('y', (d, i) => i * boxSize)
            .style('text-anchor', 'start')
            .style('dominant-baseline', 'central')
            .attr('class', 'day-label');

        dayLabelsGroup.attr('transform', `translate(-${dayLabelWidth}, ${boxSize/2})`);
    }

    function drawHourLabels() {
        let hourLabelsGroup = svg.select('.hour-labels-group');

        hourLabels = svg.select('.hour-labels-group').selectAll('.hour-label')
            .data(hoursHuman);

        hourLabels.enter()
          .append('text')
            .text((d) => d)
            .attr('y', 0)
            .attr('x', (d, i) => i * boxSize)
            .style('text-anchor', 'middle')
            .style('dominant-baseline', 'central')
            .attr('class', 'hour-label');

        hourLabelsGroup.attr('transform', `translate(${boxSize/2}, -${hourLabelHeight})`);
    }

    // API
    exports.colorSchema = function(_x) {
        if (!arguments.length) {
            return colorSchema;
        }
        colorSchema = _x;

        return this;
    };

    exports.height = function(_x) {
        if (!arguments.length) {
            return height;
        }
        height = _x;

        return this;
    };

    exports.margin = function(_x) {
        if (!arguments.length) {
            return margin;
        }
        margin = _x;

        return this;
    };

    exports.width = function(_x) {
        if (!arguments.length) {
            return width;
        }
        width = _x;

        return this;
    };

    return exports;
};

export default heatmap;
