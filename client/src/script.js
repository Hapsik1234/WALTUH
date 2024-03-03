const date = new Date();
// Slide the content div into place

function fitMargin(element, pixels) {
  element.style.marginTop = (element.clientHeight / 2 + pixels).toString() + "px";
}

document.addEventListener('DOMContentLoaded', function() {

  console.log(date.getMonth());
  if(date.getMonth() == 11) { //snow works only from december to june  || date.getMonth()<6
      var id = loadsnow();
      console.log("Ładowanie śniegu");

    setTimeout(function() {removesnow(id)}, 8000);
  }
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

    document.body.insertBefore(gif, document.body.ariaValueMin);

    return gif.id;
}

function removesnow(id) {
  var gif = document.getElementById(id);

  gif.remove();
}