//Twoje dane:
//instead-former.at.ply.gg:4073
const const_ip = "localhost"    //Twoje IP - nie muszę tłumaczyć
const const_http_port = "8080"    //Port od serwera PHP (./mcserver/client/index.php) - tego co hostujesz przez XAMPP czy co tam chcesz
const const_server_port = 3000    //Port od WebSocketa (nwm czy to się tłumaczy na gniazdo sieciowe) - to możesz sobie zmienić, jest to serwer(./mcserver/server/)
const const_username = ''     //Hasło do użytkownika Ubuntu
const const_password = ''    //Nazwa użytkownika Ubuntu
const const_ssh2_port = 22      //Port do serwera ssh2
const const_path_to_mcserver = "/home/bolk/Pulpit/mcserver/"   //Ścieżka do serwera mc
const const_server_start = "run.sh"    //Nazwa pliku co go uruchamiasz
const command = 'cd';
const args = ['/home/bolk/Pulpit/mcserver', '&&', './run.sh'];

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



const io = require('socket.io')(3000, {
    cors: {
        orgin: ["http://big-idle.at.ply.gg:53454"]
    }
})


const readline = require('readline');
const { spawn } = require('child_process');
const { error } = require('console')


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var commin = new Communicator();
var commout = new Communicator();

let continueListening = true;
let serverStarted = false;
let cmd;

io.on("connection", socket => {
  io.emit('admin-log', "\"Hello World!\" from server")
  console.log("User " + socket.id.toString() + " connected")
  socket.on('request', (request) => {
      console.log("Requsted " + request + " from " + socket.id)
      switch(request) {
          case "server-start":
            console.log("Starting server")
            commin.emit('clientreq', "start")
            //fetch("http://localhost:8080/mcserver/server/run_command.php?command=start notepad.exe")
            io.emit('srvstchange', 1)
            break
          case "server-stop":
            console.log("Stopping server")
            commin.emit('clientreq', "stop")
            break
      }
  })
  commout.on('serverst', (state) => {
    if (state=="stop") {
      io.emit('srvstchange', 0)
    } else if (state=="online") {
      io.emit('srvstchange', 2)
    }
    
  })
})



commin.on('clientreq', (req) => {


  if (req === "start" && !serverStarted) {
    cmd = spawn(command, args, { shell: true });

    cmd.stdout.on('data', (data) => {
      console.log('\x1b[34m\x1b[1m%s\x1b[0m', `[Minecraft] ${data}`);
      if (data.toString().includes("Done")) {
        console.log("Server successfully started!");
        commout.emit('serverst', "online");
        serverStarted = true;
      }
    });

    cmd.stderr.on('data', (data) => {
      console.error(`[Error] ${data}`);
    });

    cmd.on('close', (code) => {
      console.log('\x1b[1m\x1b[34m%s\x1b[0m',`Minecraft server stopped with error code: ${code}`);
      commout.emit('serverst', "stop");
      serverStarted = false;
      if (cmd) {
        cmd.kill();
      }
      continueListening = false;
    });
  }

  if (req === "stop") {
    console.log("Actually tring to stop server")
    cmd.stdin.write('stop\n');
  }
});

console.log('\x1b[1m\x1b[30m%s\x1b[0m',"OK")
