window.onscroll = function() {myFunction()};

var header = document.getElementById("header");
var h = header.offsetHeight;
var sticky = header.offsetTop;

var sfh = document.getElementById("sfh");
var lastSfhPos = sfh.offsetTop;

var content = document.getElementsByClassName("content")[0];

function myFunction() {
  if (window.pageYOffset > sticky) {
    content.style.paddingTop = h;
    header.classList.add("sticky");
  } else {
    content.style.paddingTop = 0;
    header.classList.remove("sticky");
  }
  if (sfh.offsetTop > lastSfhPos) {
    sfh.height = 0;
  } else {
    sfh.height = 28;
  }
  lastSfhPos = sfh.offsetTop;
}