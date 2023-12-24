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

//Popup function

function popup(type, text, title=null) {
    var color;
    if (type <= 3 && type > 0) {    //Checking for type of popup validation
        switch(type) {
            case 1:
                color = "#ff6666";
                if (!title) {
                    title = "Błąd!";
                }
                break
            case 2:
                color = "#e6ac0c";
                if (!title) {
                    title = "Ostrzeżenie!";
                }
                break
            case 3:
                color = "#19dd19";
                if (!title) {
                    title = "Sukces!";
                }
                break
        }

        var newPopup = document.createElement('div');
        newPopup.className = 'popup'; // Apply styles for the popup
        newPopup.style.backgroundColor = color;
        newPopup.innerHTML = `
            <span class="popup-inner close" style="margin-left: 100%; cursor: pointer; font-size: 30px">&times;</span>
            <p class="popup-inner">${title}</p>
            <p class="popup-inner">${text}</p>
        `;

        var popupcontainer = document.getElementById("popup-container");

        popupcontainer.appendChild(newPopup);

        return 0;

    } else {
        return 1;
    }
}



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

socket.on('disconnect', (reason) => {
    console.error('Socket disconnected:', reason);
    popup(1, "Zakończono połączenie z serwerem niepowodzeniem.");
});

socket.on("connect", (con) => {
    popup(3, "Uzyskano połączenie z serwerem.")
});