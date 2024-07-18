const { spawn } = require('child_process');
require('dotenv').config();
const pass = process.env.pass; // get pass from dotenv
const fs = require('fs');
const path = require('path');
const path_to_mcserver = (path.resolve(__dirname)); // Path to minecraft server
const cvar = require("./consts.json");
const EventEmitter = require('events');
// const server = require('./server.js')

// const command = "cd "+ path_to_mcserver + "/"+  + " && sudo bash\n";


// Defining WebSocket server
const io = require('socket.io')(cvar.server_port, {
  cors: {
    orgin: ["http://big-idle.at.ply.gg:53454", "http://localhost"]
  }
});

const color = {
  blue: "\x1b[34m\x1b[1m%s\x1b[0m",
  red: "\x1b[1m\x1b[31m",
  green: "\x1b[32m"
};



class Server {
  state; // possible values: "off", "starting", "on"
  path;
  cmd;
  name;
  properties;
  statechange;
  
  constructor(directory, name=directory, properties) {
    this.state = "off";
    this.path = path_to_mcserver + '\\servers\\' + directory
    this.name = name;
    this.properties = properties;
    this.cmd = spawn("sudo bash", [""], { shell: true });
    // this.statechange = EventEmitter();

    ServerInstance(this);

    // Handle events from cmd ==================

    // Handle data from minecraft server

    this.cmd.stdout.on('data', (data) => {

      // Printing the data
      // console.log(color.green, `[Minecraft] ${data.toString()}`);

      process.stdout.write(data.toString());
      
      // Handle server full start
      if (data.toString().includes("Done")) {
        console.log(color.green, "Server successfully started!");
        this.changeState("on");
      }

      // Handle server full stop
      if (data.toString().includes(pass)) { 
        console.log(color.green, "Server stopped.");
        this.changeState("off");
      }

    });
      
    // Handle errors from minecraft server
    this.cmd.stderr.on('data', (data) => {
      console.error(`[Error] ${data}`);
    });

    // Handle stop of cmd session
    this.cmd.on('close', (code) => { 
      console.log(color.red, `Cmd unexpectedly closed with code: ${code}`);
      this.changeState("off");
      this.dispatchEvent

      if (this.cmd) this.cmd.kill(); // // Do not uncomment
    });

  }

  changeState(state) {
    this.state = state;
    io.emit('srvstchange', this.state, this.name, this.properties);
    // this.statechange.emit(state);
  }

  start() { this.cmd.stdin.write("cd "+ path_to_mcserver + "\\"+ server.name + " && sudo bash run.sh\n"); }
  stop () { this.cmd.stdin.write('stop\n'); }
  
  execute(command)
  {
    if((!cvar.illegals.some(sub => command.includes(sub)))&&this.state == "on")
    {
      server.cmd.stdin.write(command + '\n');
    }
  }
}

function validateJsonProperties(object)
{
  for(i in cvar.config_file_properties)
  {
    if(!object.hasOwnProperty(cvar.config_file_properties[i]))
    {
      // console.log("returned false on: " + cvar.config_file_properties[i] + ", object: " + Object.keys(object))
      return false;
    }
  }
  return true;
}



var servers_list = []

function getDirectories(source){
  return fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());
}

function remove_duplicates(source) {
  return source.filter((value, index, self) =>
    index === source.findIndex((t) => (
      t.name == value.name || t.directory == value.directory || t.properties.address == value.properties.address
    ))
  );
}

function validate_server(server_directory_object) {
  directory = path_to_mcserver + '/servers/' + server_directory_object.name;

  // console.log(directory);  // DONE: automatic server search (ass for short)
  
  config_file_dir = directory + "/" + cvar.config_file_name;

  if (!fs.existsSync(config_file_dir)) { return 0; }

  try {

    config_file_parsed = JSON.parse(fs.readFileSync(config_file_dir));

    if (!validateJsonProperties(config_file_parsed)) { return 0; }

    return {
      directory: server_directory_object.name,
      properties: config_file_parsed,
      name: config_file_parsed.name
    };

  } catch (err) { console.error(err); return 0; }
}




function updateServers() {
  let directories = getDirectories(path_to_mcserver + "/servers");

  let temp_servers_list = []

  for (i in directories) {
    result = validate_server(directories[i]);
    if (result) { temp_servers_list.push(result); } // If the directory has a valid minecraft server in it add it to the list
  }
  temp_servers_list = remove_duplicates(temp_servers_list)

  console.log("New:")

  for (let i in temp_servers_list) {
    servers_list.push(new Server(temp_servers_list[i].name, temp_servers_list[i].directory, temp_servers_list[i].properties))
    console.log("Created new server: " + temp_servers_list[i].name)
  }
}

updateServers();




function ServerInstance(serverObject) {
  io.on("connection", socket => {

    io.emit('admin-log', "\"Hello World!\" from server");
    io.emit('srvstchange', serverObject.state, serverObject.name, serverObject.properties);
    console.log("User " + socket.id.toString() + " connected");

    // Handle requests from WebSocket ========

    socket.on('request', (request, server) => {
      if (serverObject.name == server) {
        console.log("Requested request " + request + " for " + server + " from " + socket.id);
        requestHandler("request", request, serverObject);
      }
    });

    socket.on('command', (request, server) => {
      if (serverObject.name == server) {
        console.log("Requested command " + request + " for " + server + " from " + socket.id);
        requestHandler("command", request, serverObject);
      }
    });
  });
}



function requestHandler(type, request, server) {
  console.log("Received: " + type +  " " + request + " " + server);

  switch(type) {
    // Start or stop request

    case "request":

      if (request=='server-start' && server.state=="off") 
      {
        server.changeState("starting");
        console.log("Starting server");

        // Starting minecraft server

        server.cmd.stdin.write("cd "+ path_to_mcserver + "/servers/"+ server.name + " && sudo bash run.sh\n");
      } 
      else 
      if (request=='server-stop' && server.state=="on") 
      {
        server.changeState("off");
        console.log("Stopping server");
        
        // Zmiana stanu serwera przed zatrzymaniem go jest celowa, bo inaczej masz remote code execution ze strony internetowej

        // Stoping minecraft server
        server.stop();
      }

      break;
    // Command request
    case "command":

      if (server.state=="on");
        server.execute(request);
    break;
  }
}


// No errors announcement

console.log('\x1b[1m\x1b[30m%s\x1b[0m',"OK");
