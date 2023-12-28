//Twoje dane:
//instead-former.at.ply.gg:4073
const const_ip = "localhost"    //Twoje IP - nie muszę tłumaczyć
const const_http_port = "8080"    //Port od serwera PHP (./mcserver/client/index.php) - tego co hostujesz przez XAMPP czy co tam chcesz
const const_server_port = 3000    //Port od WebSocketa (nwm czy to się tłumaczy na gniazdo sieciowe) - to możesz sobie zmienić, jest to serwer(./mcserver/server/)
const const_username = ''     //Hasło do użytkownika Ubuntu
const const_password = ''    //Nazwa użytkownika Ubuntu
const const_ssh2_port = 22      //Port do serwera ssh2
const const_path_to_mcserver = "D:\\desktop -  heavy\\dwd\\minecraft\\java\\.server 4fun"   //Ścieżka do serwera mc
const const_server_start = "run.sh"    //Nazwa pliku co go uruchamiasz
const command = 'cd';
const args = [const_path_to_mcserver, '&&', 'call run.bat'];

// Defining class that enables communication of minecraft server and web socket server

class Communicator {
  constructor() {
    this.events = {};
  }

  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => {
        callback(data);
      });
    }
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        cb => cb !== callback
      );
    }
  }
}


// Defining WebSocket server
const io = require('socket.io')(3000, {
    cors: {
        orgin: ["http://big-idle.at.ply.gg:53454"]
    }
})



const { spawn } = require('child_process');

var commin = new Communicator();
var commout = new Communicator();

var mcserverstate = 0;  // State of mcserver: 0 - off; 1 - starting; 2 - online;

let serverStarted = false;
let cmd;

io.on("connection", socket => {

  io.emit('admin-log', "\"Hello World!\" from server");
  io.emit('srvstchange', mcserverstate);
  console.log("User " + socket.id.toString() + " connected");

  // Handle requests from WebSocket

  socket.on('request', (request) => {
      console.log("Requsted " + request + " from " + socket.id);
      switch(request) {
          case "server-start":
            console.log("Starting server");
            commin.emit('clientreq', "start");
            //fetch("http://localhost:8080/mcserver/server/run_command.php?command=start notepad.exe")
            
            break
          case "server-stop":
            console.log("Stopping server");
            commin.emit('clientreq', "stop");
            mcserverstate = 3;
            break
      }
  })

  // Handle requests from minecraft server

  commout.on('serverst', (state) => {
    console.log("Recived from mc");

    switch(state) {
      case "stop":  // Minecraft server stoped
        console.log("Recived from mc: Server stoped");
        io.emit('srvstchange', 0);
      break
      case "start": // Minecraft server starting
        console.log("Recived from mc: Server starting");
        io.emit('srvstchange', 1);
      break
      case "online":  // Minecraft server started
        console.log("Recived from mc: Server started");
        io.emit('srvstchange', 2);
      break
      
    }
    
  })
})


// Turning on and off the minecraft server

commin.on('clientreq', (req) => {

  console.log("Recived request from server");

  if (req === "start" && !serverStarted) {

    console.log("Recived request from server: start");

    cmd = spawn(command, args, { shell: true });
    mcserverstate = 1;
    commout.emit("serverst", "start");

    cmd.stdout.on('data', (data) => {
      console.log('\x1b[34m\x1b[1m%s\x1b[0m', `[Minecraft] ${data}`);
      if (data.toString().includes("Done")) {
        console.log("Server successfully started!");
        commout.emit('serverst', "online");
        mcserverstate = 2;
        serverStarted = true;
      }
    });

    cmd.stderr.on('data', (data) => {
      console.error(`[Error] ${data}`);
    });

    cmd.on('close', (code) => {
      console.log('\x1b[1m\x1b[34m%s\x1b[0m',`Minecraft server has been stopped with error code: ${code}`);
      commout.emit('serverst', "stop");
      serverStarted = false;
      mcserverstate = 0;
      if (cmd) {
        cmd.kill();
      }
    });
  }

  if (req === "stop") {
    console.log("Recived request from server: stop");
    console.log("Actually tring to stop server");
    cmd.stdin.write('stop\n');
  }
});



// No errors announcement

console.log('\x1b[1m\x1b[30m%s\x1b[0m',"OK");
