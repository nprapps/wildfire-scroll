var { isMobile } = require("./lib/breakpoints");
var {
  classify,
  COLORS,
  makeTranslate,
  wrapText,
  getAPMonth,
} = require("./lib/helpers");

var d3 = {
  ...require("d3-axis/dist/d3-axis.min"),
  ...require("d3-scale/dist/d3-scale.min"),
  ...require("d3-shape/dist/d3-shape.min"),
  ...require("d3-selection/dist/d3-selection.js"),
  ...require("d3-transition/dist/d3-transition.js"),
};

var duration_dates;
var duration_dates_northeast;
var bars;
var durationBars;

var xScale;
var yScale;
var chartHeight;
var valueColumn = "amt";
var labelColumn = "label";
var fmtComma = s => s.toLocaleString().replace(/\.0+$/, "");
var fmtYearAbbrev = d => "\u2019" + (d.getFullYear() + "").slice(-2);
var fmtYearFull = d => d.getFullYear();

// Render a column chart.
var renderChart = function (config) {
  // Setup chart container
  var { labelColumn, valueColumn, dateColumn } = config;

  var aspectWidth = isMobile.matches ? 4 : 16;
  var aspectHeight = isMobile.matches ? 3.5 : 9;
  var valueGap = 6;

  var margins = {
    top: 30,
    right: 10,
    bottom: 20,
    left: 34,
  };

  var ticksY = 5;
  if (isMobile.matches) {
    ticksY = 5;
  }
  var roundTicksFactor = 1;
  var annotationWidth = 60;
  var annotationLineHeight = 16;

  // Calculate actual chart dimensions
  var chartWidth = config.width - margins.left - margins.right;
  chartHeight =
    Math.ceil((config.width * aspectHeight) / aspectWidth) -
    margins.top -
    margins.bottom;

  // Clear existing graphic (for redraw)
  var containerElement = d3.select(config.container);
  containerElement.html("");

  // Create the root SVG element.
  var chartWrapper = containerElement
    .append("div")
    .attr("class", "graphic-wrapper");

  var chartElement = chartWrapper
    .append("svg")
    .attr("width", chartWidth + margins.left + margins.right)
    .attr("height", chartHeight + margins.top + margins.bottom)
    .append("g")
    .attr("transform", `translate(${margins.left},${margins.top})`);

  // Create D3 scale objects.
  xScale = d3
    .scaleBand()
    .range([0, chartWidth])
    // .round(true)
    .padding(0)
    .domain(config.data[0].values.map(d => d[labelColumn]));

  var min = -3;
  var max = 5;
  var labelMax = 4;

  yScale = d3.scaleLinear().domain([min, max]).range([chartHeight, 0]);

  // Create D3 axes.
  var xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickValues([
      1900,
      1910,
      1920,
      1930,
      1940,
      1950,
      1960,
      1970,
      1980,
      1990,
      2000,
      2010,
      2020,
    ]);

  var yAxis = d3
    .axisLeft()
    .scale(yScale)
    .ticks(ticksY)
    .tickFormat(function (d) {
      var num = d == 0 ? 0 : fmtComma(d);
      var pos = d > 0 ? "+" : "";
      return pos + num + "°F";
    });

  duration_dates = [
    {
      begin: xScale(1981),
      end: xScale(2020) + xScale.bandwidth(),
      top: yScale(3.26) - 5,
      bottom: yScale(-0.76) + 5,
      text: LABELS.bucket1,
    },
  ];

  duration_dates_northeast = [
    {
      begin: xScale(2001),
      end: xScale(2020) + xScale.bandwidth(),
      top: yScale(4.093) - 5,
      bottom: yScale(0) + 5,
      text: LABELS.bucket2,
    },
  ];

  // Render axes to chart.
  chartElement
    .append("g")
    .attr("class", "x axis")
    .attr("transform", makeTranslate(0, chartHeight))
    .call(xAxis);

  chartElement.append("g").attr("class", "y axis").call(yAxis);

  // Render grid to chart.

  chartElement
    .append("g")
    .attr("class", "y grid")
    .call(yAxis.tickSize(-chartWidth, 0).tickFormat(""));

  var yAxisLabel =
    isMobile.matches === true
      ? LABELS.yAxisLabelMobile
      : LABELS.yAxisLabelDesktop;

  chartElement
    .append("text")
    .classed("chart-label-title", true)
    .attr("x", xScale(1901) - 5)
    .attr("y", yScale(labelMax) + 4)
    .text(yAxisLabel);

  durationBars = chartElement
    .insert("g", "*")
    .attr("class", "duration")
    .selectAll("rect")
    .data(config.northeast ? duration_dates_northeast : duration_dates)
    .enter();

  durationBars
    .append("rect")
    .attr("x", d => d["begin"])
    .attr("width", d => d["end"] - d["begin"])
    .attr("y", d => d["top"])
    .attr("height", d => chartHeight - d["top"] - (chartHeight - d["bottom"]));

  var annoLine = d3
    .line()
    .x(d => d.x)
    .y(d => d.y);

  chartElement
    .append("g")
    .attr("class", "duration")
    .selectAll("rect")
    .data(duration_dates)
    .enter()
    .append("path")
    .attr("class", "anno-line")
    .attr("d", function (d, i) {
      var yOffset = 10;

      if (isMobile.matches) {
        yOffset = 10;
      }

      var aboveBelow = "top";
      var sign = 1;
      var coords = [
        {
          x: d["begin"],
          y: d[aboveBelow] + yOffset * sign,
        },
        {
          x: d["begin"],
          y: d[aboveBelow],
        },
        {
          x: d["begin"] + (d["end"] - d["begin"]) / 2,
          y: d[aboveBelow],
        },
        {
          x: d["begin"] + (d["end"] - d["begin"]) / 2,
          y: d[aboveBelow] - 10 * sign,
        },
        {
          x: d["begin"] + (d["end"] - d["begin"]) / 2,
          y: d[aboveBelow],
        },
        {
          x: d["end"],
          y: d[aboveBelow],
        },
        {
          x: d["end"],
          y: d[aboveBelow] + yOffset * sign,
        },
      ];

      return annoLine(coords);
    });

  chartElement
    .append("g")
    .attr("class", "annotations")
    .selectAll("text")
    .data(duration_dates)
    .enter()
    .append("text")
    .attr("x", d => d["begin"] + (d["end"] - d["begin"]) / 2)
    .attr("y", (d, i) => {
      return d["top"] - 15;
    })
    .text(d => d.text);

  var barData = config.data.filter(d => d.name == "amt")[0].values;
  var barDataNortheast = config.data.filter(d => d.name == "amt_NE")[0].values;
  var lineData = config.data.filter(
    d => d.name == "nat_avg" || d.name == "ne_avg"
  );

  // Render bars to chart.
  bars = chartElement
    .append("g")
    .attr("class", "bars")
    .selectAll("rect")
    .data(config.northeast ? barDataNortheast : barData)
    .enter();

  bars
    .append("rect")
    .attr("x", d => xScale(d[labelColumn]))
    .attr("y", d => (d[valueColumn] < 0 ? yScale(0) : yScale(d[valueColumn])))
    .attr("width", xScale.bandwidth())
    .attr("height", d =>
      d[valueColumn] < 0
        ? yScale(d[valueColumn]) - yScale(0)
        : yScale(0) - yScale(d[valueColumn])
    )
    .attr("class", function (d) {
      var pos = d[valueColumn] > 0 ? "pos" : "neg";
      return "bar bar-" + d[labelColumn] + " " + pos;
    });

  // Render 0 value line.
  if (min < 0) {
    chartElement
      .append("line")
      .attr("class", "zero-line")
      .attr("x1", 0)
      .attr("x2", chartWidth)
      .attr("y1", yScale(0))
      .attr("y2", yScale(0));
  }

  // Average line function
  var line = d3
    .line()
    .x(d => xScale(d[labelColumn]) + xScale.bandwidth())
    .y(d => yScale(d[valueColumn]));
};

var updateChart = function (data, northeast) {
  var name = northeast ? "amt_NE" : "amt";
  var data = data.filter(d => d.name == name)[0].values;
  // Create a update selection: bind to the new data
  var durBars = durationBars
    .selectAll("rect")
    .data(northeast ? duration_dates_northeast : duration_dates);

  durBars
    .enter()
    .append("rect")
    .merge(durBars)
    .transition()
    .duration(1000)
    .delay(200)
    .attr("x", d => d["begin"])
    .attr("width", d => d["end"] - d["begin"])
    .attr("y", d => d["top"])
    .attr("height", d => chartHeight - d["top"] - (chartHeight - d["bottom"]));

  var u = bars.selectAll("rect").data(data);

  u.enter()
    .append("rect")
    .merge(u)
    .transition()
    .duration(1000)
    .delay(200)
    .attr("y", d => (d[valueColumn] < 0 ? yScale(0) : yScale(d[valueColumn])))
    .attr("height", d =>
      d[valueColumn] < 0
        ? yScale(d[valueColumn]) - yScale(0)
        : yScale(0) - yScale(d[valueColumn])
    )
    .attr("class", function (d) {
      var pos = d[valueColumn] > 0 ? "pos" : "neg";
      return "bar bar-" + d[labelColumn] + " " + pos;
    });
};

module.exports = { updateChart, renderChart };
