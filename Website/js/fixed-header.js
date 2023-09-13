window.onscroll = function() {myFunction()};

var preheader = document.getElementById("preheader");
var preh = preheader.offsetHeight;

var prehtit = document.getElementById("preh-title");
var style = window.getComputedStyle(prehtit, null).getPropertyValue('font-size');
const default_prehtit_size = parseFloat(style); 

var header = document.getElementById("header");
var h = header.offsetHeight;
var headertop = header.offsetTop;

// var sfh = document.getElementById("sfh");
// var lastSfhPos = sfh.offsetTop;

var content = document.getElementsByClassName("content")[0];

function myFunction() {
  // stick the header
  if (window.pageYOffset > headertop) {
    content.style.paddingTop = h;
    header.classList.add("sticky");
  } else {
    content.style.paddingTop = 0;
    header.classList.remove("sticky");
  }
  
  // resize preheader bk
  var d = preh - window.pageYOffset;
  if (d <= 0) {
    preheader.style.backgroundSize = "100px 100px";
  } else {
    var scale = d / preh * 100;
    preheader.style.backgroundSize = `${scale+100}% ${scale+100}%`;
    if (!(scale < 70)) prehtit.style.fontSize = `${default_prehtit_size / 100 * (scale)}px`;
  }
}