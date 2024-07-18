function playsound() {
    var random = Math.floor(Math.random()*audio.length);
    console.log(random.toString() + ' ' + (audio.length-1).toString())
    audio[random].play();
}