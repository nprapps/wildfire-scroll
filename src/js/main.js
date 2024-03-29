// require("./lib/pym");
require("./analytics");
require("./tempChart");

var $ = require("./lib/qsa");
var track = require("./lib/tracking");
require("./video");

var slides = $(".sequence .slide").reverse();
var autoplayWrapper = $.one(".a11y-controls");

var completion = 0;

if (false) "play canplay canplaythrough ended stalled waiting suspend".split(" ").forEach(e => {
  $("video").forEach(v => v.addEventListener(e, console.log));
});

// handle NPR One
var here = new URL(window.location.href);
var renderPlatform = here.searchParams.get("renderPlatform");
var isOne = renderPlatform && renderPlatform.match(/nprone/i);
if (isOne) {
  document.body.classList.add("nprone");
}


var active = null;
var activateSlide = function(slide) {
  if (active == slide) return;
  if (active) {
    var exiting = active;
    active.classList.remove("active");
    active.classList.add("exiting");
    setTimeout(() => exiting.classList.remove("exiting"), 1000);
  }
  // force video playback
  if (!isOne) $("video[autoplay]", slide).forEach(v => {
    v.currentTime = 1;
    v.play();
  });
  // lazy-load neighboring slides
  var neighbors = [-1, 0, 1, 2];
  var all = $(".sequence .slide");
  var index = all.indexOf(slide);
  neighbors.forEach(function(offset) {
    var neighbor = all[index + offset];
    if (!neighbor) return;
    var images = $("[data-src]", neighbor);
    images.forEach(function(img) {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
      img.poster = img.dataset.poster;
      img.removeAttribute("data-poster");
    })
  });

  slide.classList.add("active");
  slide.classList.remove("exiting");
  active = slide;

  // Assuming first (intro) slide is not video
  // if (slide.dataset.type === "video") {
  //   autoplayWrapper.classList.remove("hidden");
  // } else {
  //   autoplayWrapper.classList.add("hidden");
  // }
}

var onScroll = function() {
  for (var i = 0; i < slides.length; i++) {
    var slide = slides[i];
    var bounds = slide.getBoundingClientRect();
    if (bounds.top < window.innerHeight * .9 && bounds.bottom > 0) {
      var complete = ((slides.length - i) / slides.length * 100) | 0;
      if (complete > completion) {
        completion = complete;
        track("completion", completion + "%");
      }
      return activateSlide(slide);
    }
  }
}

document.body.classList.add("boot-complete");
window.addEventListener("scroll", onScroll);
onScroll();

// link tracking
var trackLink = function() {
  var action = this.dataset.track;
  var label = this.dataset.label;
  track(action, label);
};
$("[data-track]").forEach(el => el.addEventListener("click", trackLink));
