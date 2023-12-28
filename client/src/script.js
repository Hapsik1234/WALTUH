// Slide the content div into place

function fitMargin(element, pixels) {
  element.style.marginTop = (element.clientHeight / 2 + pixels).toString() + "px";
}

document.addEventListener('DOMContentLoaded', function() {
  var div1 = document.getElementById("content");
  fitMargin(div1, 50);

  var id = loadsnow();

  setTimeout(function() {removesnow(id)}, 8000);
});

// Make the closing buttons close popups

document.addEventListener("click", function(event) {
  if (event.target.classList.contains("close")) {
    event.target.parentElement.remove();
  }
});

//(Christmas update) Snow gif

function loadsnow() {
  var gif = document.createElement('div')
  gif.id = "snow";

  document.body.insertBefore(gif, document.body.firstChild);

  return gif.id;
}

function removesnow(id) {
  var gif = document.getElementById(id);

  gif.remove();
}