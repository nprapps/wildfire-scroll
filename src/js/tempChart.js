var renderColumnChart = require("./renderTempChart");

// Initialize the graphic.
var onWindowLoaded = function() {  
  var series = formatData(window.DATA);
  console.log(series)
  render(series);


  // render(window.DATA);

  window.addEventListener("resize", () => render(window.DATA));
};

//Format graphic data for processing by D3.
var formatData = function(data) {
  var series = [];

  data.forEach(function(d) {
    if (d.date instanceof Date) return;
    // var [m, day, y] = d.date.split("/").map(Number);
    // y = y > 50 ? 1900 + y : 2000 + y;
    // d.date = new Date(y, m - 1, day);
    d.date = new Date(d.label,1,1)
  });

  // Restructure tabular data for easier charting.
  for (var column in data[0]) {
    if (column == "date" || column == "label") continue;

    series.push({
      name: column,
      values: data.map(d => ({
        date: d.date,
        label: d.label,
        amt: d[column]
      }))
    });
  }

  return series;
};



// Render the graphic(s)
var render = function(data) {
  // Render the chart!
  var container = ".graphic.temp-changes .container";
  var element = document.querySelector(container);
  var width = element.offsetWidth;
  renderColumnChart({
    container,
    width,
    data,
    labelColumn: "label",
    valueColumn: "amt",
    dateColumn: "date"
  });
};

//Initially load the graphic
window.onload = onWindowLoaded;
