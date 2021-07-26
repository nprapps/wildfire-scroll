var renderColumnChart = require("./renderTempChart");

// Initialize the graphic.
var onWindowLoaded = function() {
  render(window.DATA);

  window.addEventListener("resize", () => render(window.DATA));
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
    valueColumn: "amt"
  });
};

//Initially load the graphic
window.onload = onWindowLoaded;
