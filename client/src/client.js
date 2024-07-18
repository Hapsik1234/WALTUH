// address and port of websocket server

const const_address = "localhost"     // At production: http://instead-former.at.ply.gg
const const_server_port = 3000         // At production: 4073


// Sounds that will be played after minecraft server startup

var rickroll = new Audio("assets/rickroll.mp3");
var notification = new Audio("assets/samsung.mp3");
var balls = new Audio("assets/balls and jaws.mp3");
var calgon = new Audio("assets/calgon.mp3");
var sfx = new Audio("assets/sfx.mp3");

var audio = [rickroll, notification, balls, calgon, sfx]


//define state indicators
var state_indicator_on = document.getElementById("indicator_on").classList;
var state_indicator_connecting = document.getElementById("indicator_connecting").classList;
var state_indicator_off = document.getElementById("indicator_off").classList;

//define text field objects

var about = document.getElementById("text_about");
var address = document.getElementById("text_address");
var version = document.getElementById("text_version");
var engine = document.getElementById("text_engine");

//default state

state_indicator_connecting.add("enabled"); 

// Defining buttons (program doesn't work without it)

var srvstart = document.getElementById("serverpowerst");
var srvstate = document.getElementById("svstate");

// Last and actual server states

var globsrvst=0;
var lastglobsrvst=0;




try {
    // import { io } from 'socket.io-client' // Do not uncomment, the program doesn't work with this crucial part...

    const socket = io(const_address + ':' + const_server_port); // Defining library's object for websocket

    // Adding functions to click of buttons

    srvstart.addEventListener("click", element => {
        console.log("Request sent")
        if (srvstart.name=="start") {
            socket.emit('request', "server-start", ServerInstance);
        } else {
            socket.emit('request', "server-stop", ServerInstance);
        }
    })

    // Handle admin log from web socket

    socket.on('admin-log', (logcontent) => {
        console.log(logcontent);
    })


    // Handle server state change info from web socket

    socket.on('srvstchange', (state, server, properties) => {
        console.log("received: state=" + state + " server=" + server + " properties: " + properties)
        console.log(properties)
        if(server == ServerInstance)
        {
            
            about.textContent = properties.text;
            address.textContent = properties.address;
            version.textContent = properties.version;
            engine.textContent = properties.engine;
            switch(state) {
                case "off": // Stop of the minecraft server
                    console.log("Server stoping")
                    srvstart.textContent = "Start"
                    srvstart.name = "start"
                    srvstate.textContent = "Stan serwera: Offline"
                    srvstart.classList.remove("on")
                    srvstart.classList.add("off")
                    globsrvst=0
                break;
                case "starting": // Starting of the minecraft server
                    console.log("Server starting")
                    srvstart.textContent = "Stop"
                    srvstart.name = "stop"
                    srvstate.textContent = "Stan serwera: Starting"
                    srvstart.classList.remove("off")
                    srvstart.classList.add("on")
                    globsrvst=1
                break;
                case "on": // Start of the minecraft server
                    console.log("Server starting")
                    srvstart.textContent = "Stop"
                    srvstart.name = "stop"
                    srvstate.textContent = "Stan serwera: Online"
                    srvstart.classList.remove("off")
                    srvstart.classList.add("on")
                    if (globsrvst!==2) {
                        playsound();
                        new popup(3, "Serwer minecraft forfan został poprawnie uruchomiony. Dziękujemy za skorzystanie z usług <s>mojego</s> naszego systemu WALTUH (Wireless Acurate Lovely Turning out Usage to mc server Host).")
                    }
                    globsrvst=2;
                break;
            }
        }
    })


    // Disconnection from web socket

    socket.on('disconnect', (reason) => {
        state_indicator_connecting.remove("enabled");
        state_indicator_off.add("enabled");
        state_indicator_on.remove("enabled");

        console.error('Socket disconnected:', reason);
        new popup(1, "Zakończono połączenie z serwerem niepowodzeniem.");

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
        state_indicator_connecting.remove("enabled");
        state_indicator_off.remove("enabled");
        state_indicator_on.add("enabled");
        
        new popup(3, "Nawiązano połączenie z serwerem.")
    });

} catch(error) {
    state_indicator_connecting.remove("enabled");
    state_indicator_on.remove("enabled");
    state_indicator_off.add("enabled");
    new popup(1, "Nie udało się połączyć z serwerem. Przepraszamy za wszelkie niedogodności, prosimy aby spróbować ponownie. Jeżeli to nie zadziała połącz się z administratorami sieci WALTUH.");
    console.error("Connection with websocket failed with error: " + error);
}