const const_ip = "localhost"
const const_server_port = 3000

//import { io } from 'socket.io-client'

const socket = io("http://instead-former.at.ply.gg:4073");

var rickroll = new Audio("assets/rickroll.mp3")
var notification = new Audio("assets/samsung.mp3")
var balls = new Audio("assets/balls and jaws.mp3")
var calgon = new Audio("assets/calgon.mp3")
var sfx = new Audio("assets/sfx.mp3")

var audio = [rickroll, notification, balls, calgon]

var srvstart = document.getElementById("serverpowerst");
var srvstop = document.getElementById("serverpowersp");
var srvstate = document.getElementById("svstate");

var globsrvst=0;
var lastglobsrvst=0;

srvstart.addEventListener("click", element => {
    console.log("Request sent")
    if (srvstart.name=="start") {
        socket.emit('request', "server-start");
    } else {
        socket.emit('request', "server-stop");
    }
})

socket.on('admin-log', (logcontent) => {
    console.log(logcontent);
})

socket.on('srvstchange', state => {
    srvstart = document.getElementById("serverpowerst");
    srvstop = document.getElementById("serverpowersp");
    if (state==1) {
        console.log("Server starting")
        srvstart.textContent = "Stop"
        srvstart.name = "stop"
        srvstate.textContent = "Stan serwera: Online"
        srvstart.classList.replace("off","on")
        globsrvst=1
    } else if (state==0) {
        console.log("Server stoping")
        srvstart.textContent = "Start"
        srvstart.name = "start"
        srvstate.textContent = "Stan serwera: Offline"
        srvstart.classList.replace("on","off")
        globsrvst=0
    } else if (state==2) {
        console.log("Server started")
        if (globsrvst!==2) {
            var random = Math.floor(Math.random()*audio.length);
            console.log(random.toString() + ' ' + (audio.length-1).toString())
            audio[random].play();
        }
        globsrvst=2
    } else {
        console.log("WTF")
    }
})
