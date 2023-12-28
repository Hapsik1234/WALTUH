const const_ip = "localhost"
const const_server_port = 3000

//import { io } from 'socket.io-client'

const socket = io("http://instead-former.at.ply.gg:4073");


// Sounds that will be played after minecraft server startup

var rickroll = new Audio("assets/rickroll.mp3")
var notification = new Audio("assets/samsung.mp3")
var balls = new Audio("assets/balls and jaws.mp3")
var calgon = new Audio("assets/calgon.mp3")
var sfx = new Audio("assets/sfx.mp3")

var audio = [rickroll, notification, balls, calgon]

// Defining buttons (program doesn't work without it)

var srvstart = document.getElementById("serverpowerst");
var srvstate = document.getElementById("svstate");

// Last and actual server states

var globsrvst=0;
var lastglobsrvst=0;



// Play random sound

function playsound() {
    var random = Math.floor(Math.random()*audio.length);
    console.log(random.toString() + ' ' + (audio.length-1).toString())
    audio[random].play();
}

// Popup function

function popup(type, text, title=null) {
    var color;
    if (type <= 3 && type > 0) {    // Checking for type of popup validation
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


        // Append popup

        var popupcontainer = document.getElementById("popup-container");

        popupcontainer.appendChild(newPopup);

        return 0;

    } else {    // Returning 1 in case of wrong parameters
        return 1;
    }
}


// Adding functions to click of buttons

srvstart.addEventListener("click", element => {
    console.log("Request sent")
    if (srvstart.name=="start") {
        socket.emit('request', "server-start");
    } else {
        socket.emit('request', "server-stop");
    }
})

// Handle admin log from web socket

socket.on('admin-log', (logcontent) => {
    console.log(logcontent);
})

// Handle server state change info from web socket

socket.on('srvstchange', state => {
    switch(state) {
        case 0: // Stop of the minecraft server
            console.log("Server stoping")
            srvstart.textContent = "Start"
            srvstart.name = "start"
            srvstate.textContent = "Stan serwera: Offline"
            srvstart.classList.remove("on")
            srvstart.classList.add("off")
            globsrvst=0
        break;
        case 1: // Starting of the minecraft server
            console.log("Server starting")
            srvstart.textContent = "Stop"
            srvstart.name = "stop"
            srvstate.textContent = "Stan serwera: Starting"
            srvstart.classList.remove("off")
            srvstart.classList.add("on")
            globsrvst=1
        break;
        case 2: // Start of the minecraft server
            console.log("Server starting")
            srvstart.textContent = "Stop"
            srvstart.name = "stop"
            srvstate.textContent = "Stan serwera: Online"
            srvstart.classList.remove("off")
            srvstart.classList.add("on")
            if (globsrvst!==2) {
                playsound();
                popup(3, "Serwer minecraft forfan został poprawnie uruchomiony. Dziękujemy za skorzystanie z usług <s>mojego</s> naszego systemu WALTUH (Wireless Acurate Lovely Turning out Usage to mc server Host).")
            }
            globsrvst=2;
        break;
    }
})


// Disconnection from web socket

socket.on('disconnect', (reason) => {
    console.error('Socket disconnected:', reason);
    popup(1, "Zakończono połączenie z serwerem niepowodzeniem.");

    // The button

    srvstart.textContent = "Błąd"
    srvstart.name = ""
    srvstate.textContent = "Stan serwera: Nie można nawiązać połączenia z serwerem."
    srvstart.classList.remove("off")
    srvstart.classList.remove("on")

    globsrvst=-1
});


// Connection to web socket

socket.on("connect", (con) => {
    popup(3, "Nawiązano połączenie z serwerem.")
});