
const { spawn } = require('child_process');

const const_server_port = "3000";    // Websocket server
const const_path_to_mcserver ="/home/bolk/Pulpit/server/serverside/servers";  // Path to minecraft server
const command = "cd "+ const_path_to_mcserver + "/"+  + " && sudo bash\n";

const pass = "mMVahPSL2qcg0Q4d0LKC6A==";

// Defining WebSocket server
const io = require('socket.io')(const_server_port, {
  cors: {
      orgin: ["http://big-idle.at.ply.gg:53454", "http://localhost"]
  }
});

const color = {
  blue: "\x1b[34m \x1b[1m%s\x1b[0m",
  red: "\x1b[1m\x1b[31m",
  green: "\x1b[32m"
};

class Server {
  state; //possible values: "off", "starting", "on"
  path;
  cmd;
  name;

  constructor(directory, name) {
    this.state = "off";
    this.path = const_path_to_mcserver + '\\' + directory
    this.name = name;
    this.cmd = spawn("sudo bash", [""], { shell: true });

    ServerInstance(this);
  }

  changeState(state) {
    this.state = state;
    io.emit('srvstchange', this.state, this.name);
  }
}

//Fun = new Server(Fun, "4fun");
Surviv = new Server("Surviv", "Surviv");
//Fun = new Server("Fun", "Fun")

//import { get } from 'http';

// const getDirectories = source =>
//   console.log(fs.readdirSync(source, { withFileTypes: true })
//     .filter(dirent => dirent.isDirectory()))

// getDirectories(const_path_to_mcserver);

// var cmd;

// cmd = spawn("cmd.exe", [""], { shell: true });

// var cmd;
// cmd.on("close", (code) => {
//   console.log("Closed")
// });

function ServerInstance(ServerObject) {
  io.on("connection", socket => {

    io.emit('admin-log', "\"Hello World!\" from server");
    io.emit('srvstchange', ServerObject.state);
    console.log("User " + socket.id.toString() + " connected");

    // Handle requests from WebSocket

    socket.on('request', (request, server) => {
      console.log("Requested request " + request + " for " + server + " from " + socket.id);
      requestHandler("request", request, ServerObject, server);
    });

    socket.on('command', (request, server) => {
      console.log("Requested command " + request + " for " + server + " from " + socket.id);
      requestHandler("command", request, ServerObject, server);
    });




    /* 
      CMD HANDLER
    */
    ServerObject.cmd.stdout.on('data', (data) => { // Handle data from minecraft server

      console.log(color.green, `[Minecraft] ${data}`);  // Printing the data
      
      if (data.toString().includes("Done")) { // Handle server fully started
        console.log("Server successfully started!");
        ServerObject.changeState("on");
      }

      if (data.toString().includes(pass)) { // Handle server fully stopped
        console.log("Server stopped.");
        ServerObject.changeState("off");
      }

    });
      
    ServerObject.cmd.stderr.on('data', (data) => { // Handle errors from minecraft server
      console.error(`[Error] ${data}`);
    });
    
    ServerObject.cmd.on('close', (code) => { // Handle stop of cmd session
      console.log('',`Cmd unexpectedly closed with code: ${code}`);
      ServerObject.changeState("off")

      if (ServerObject.cmd) ServerObject.cmd.kill(); // // Do not uncomment
    });

    /*
      End of CMD HANDLER 
    */
  });
}

function requestHandler(type, request, server, serverName){
  console.log("Received: " + type +  " " + request + " " + server)

  //TODO: 
switch(type)
{
case "request":
  if (server.name == serverName)
  switch(request) {
    case "server-start":
      if (server.state=="off") {
        server.changeState("starting")
        console.log("Starting server");

        // Starting minecraft server

        //cmd.emit
        server.cmd.stdin.write("cd "+ const_path_to_mcserver + "/"+ server.name + " && sudo bash run.sh\n");
        //cmd = new spawn(command, args, { shell: true });
      }
    
    break;
      
    case "server-stop":

      // Stoping minecraft server

      server.changeState("off");
      //Zmiana stanu serwera przed zatrzymaniem go jest celowa, bo inaczej masz remote code execution ze strony internetowej
      server.cmd.stdin.write('stop\n');

      console.log("Stopping server");
      

    break;
  }
  case "command":
   if (server.state== "on"){
      server.cmd.stdin.write(request + '\n');
   }

  break;
 }
}


// No errors announcement

console.log('\x1b[1m\x1b[30m%s\x1b[0m',"OK");
