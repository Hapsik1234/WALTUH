//Slide the content div into place

function fitMargin(element, pixels) {
  element.style.marginTop = (element.clientHeight / 2 + pixels).toString() + "px";
}

document.addEventListener('DOMContentLoaded', function() {
  var div1 = document.getElementById("content");
  fitMargin(div1, 50);

});

//Make the closing buttons close popups

var container = document

container.addEventListener("click", function(event) {
  if (event.target.classList.contains("close")) {
    event.target.parentElement.remove();
  }
});