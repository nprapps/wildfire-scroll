var {renderChart, updateChart} = require("./renderTempChart");
var debounce = require("./lib/debounce");
var $ = require("./lib/qsa");

var rendered = false;
var secondSection;

// Initialize the graphic.
var onWindowLoaded = function() {  
  var series = formatData(window.DATA);

  render(series);
  window.addEventListener("scroll", debounce(() => onScroll(series), 50));
  window.addEventListener("resize", debounce(() => render(series), 50));
  
};


//Format graphic data for processing by D3.
var formatData = function(data) {
  var series = [];

  data.forEach(function(d) {
    if (d.date instanceof Date) return;
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
var render = function(data) {
  // Render the chart!
  if (!isInViewport($.one('#section-1')) && !isInViewport($.one('#section-2'))) return;
  var container = ".graphic.temp-changes .container";
  var element = document.querySelector(container);
  var width = element.offsetWidth;
  renderChart({
    container,
    width,
    data,
    labelColumn: "label",
    valueColumn: "amt",
    dateColumn: "date",
    northeast: isInViewport($.one('#section-2'))
  });
  rendered = true;
};

function isInViewport(elm) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

var onScroll = function(data) {
  if (!isInViewport($.one('#section-1')) && !isInViewport($.one('#section-2'))) return;
  if (!rendered) render(data);
  if (isInViewport($.one('#section-2')) !== secondSection) {
    secondSection = isInViewport($.one('#section-2'));
    updateChart(data, secondSection);
  }
}


window.addEventListener("load", onWindowLoaded);
