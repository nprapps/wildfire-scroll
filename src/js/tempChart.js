var renderColumnChart = require("./renderTempChart");
var $ = require("./lib/qsa");

var rendered = false;

// Initialize the graphic.
var onWindowLoaded = function() {  
  var series = formatData(window.DATA);

  window.addEventListener("scroll", () => onScroll(series));


  onScroll(series);
  // window.addEventListener("resize", () => render(series));
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
  for (var column in data[20]) {
    if (column == "date" || column == "label") continue;

    series.push({
      name: column,
      values: data
        .filter(d => typeof d[column] !== 'undefined')
        .map(d => ({
          date: d.date,
          label: d.label,
          amt: d[column]
        }))
    });
  }

  return series;
};


// Render the graphic(s)
var render = function(data, northeast) {
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
    dateColumn: "date",
    northeast
  });
};

function isInViewport(elm) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

var onScroll = function(data) {
  if (isInViewport($.one('#section-1'))) {
    // console.log('section 1')
    render(data, false);
  } else if (isInViewport($.one('#section-2'))) {
    // console.log('section 2')
    render(data, true);
  }
}



//Initially load the graphic
window.onload = onWindowLoaded;
