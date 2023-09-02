function fitMargin(element, pixels) {
  element.style.marginTop = (element.clientHeight / 2 + pixels).toString() + "px";
}

document.addEventListener('DOMContentLoaded', function() {
  var div1 = document.getElementById("content");
  fitMargin(div1, 50);

});