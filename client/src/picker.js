// address and port of websocket server
const const_address = "localhost"     // At production: http://instead-former.at.ply.gg
const const_server_port = 3000         // At production: 4073

var state_indicator_on = document.getElementById("indicator_on").classList;
var state_indicator_connecting = document.getElementById("indicator_connecting").classList;
var state_indicator_off = document.getElementById("indicator_off").classList;

state_indicator_connecting.add("enabled"); 
// TODO: Connection indicators backend //nuh uh nie chce mi się

class serverIndicator
{
    properties;
    constructor(state, properties)
    {
        this.properties = properties
        console.log("Creating server " + properties.name);
        // Creating new server element (shit tone of this.* but i might need it later)
        this.node = document.createElement("div")
        this.node.classList.add("server_element")
        this.name = document.createElement("div"); this.name.textContent = properties.name;
        this.status = document.createElement("span"); this.status.textContent = state;
        this.status.appendChild(document.createElement("br"));
        this.version = document.createElement("span"); this.version.textContent = properties.version;
        this.version.appendChild(document.createElement("br"));
        this.engine = document.createElement("span"); this.engine.textContent = properties.engine;
        this.engine.appendChild(document.createElement("br"));
        this.node.appendChild(this.name).classList.add("server_name")
        this.node.appendChild(this.status).classList.add("server_status")
        this.node.appendChild(this.version).classList.add("server_version")
        this.node.appendChild(this.engine).classList.add("server_engine")
        this.stateIndicator = this.node.appendChild(document.createElement("div"))
        // this.stateIndicator.setAttribute("id", "stateIndicator"+this.properties.name)
        this.newServer = document.getElementById("server_list_container").appendChild(this.node);
        // Append server

        this.updateParameters(state, this.stateIndicator);

        this.newServer.addEventListener("click", () => {window.location = encodeURI("http://localhost/?server="+properties.name)}) 
        //this has to be encoded as uri because html converts ? to %3F otherwise 
        return 0;
    }
    
    updateParameters(state, elem){
        
        console.log(elem)
        // elem.removeAttribute("class")
        // removeClasses(elem)
        
        switch (state) {
            case "on":
                elem.classList.add("server_status_indicator_on")
                break;
            case "off":
                elem.classList.add("server_status_indicator_off")
                break;
            case "starting":
                elem.classList.add("server_status_indicator_starting")
                break;
            default:
                break;
        }
    }
}

var serverList = []

// function removeClasses(element)
// {
//     element.removeAttribute("class")
// }

function isOn(object, array)
{
    // console.log(JSON.stringify(array.properties))
    // console.log(JSON.stringify(object))
    let result = false;

    array.some((element) => {
        console.log(element.properties.name)
        console.log(object.name)
        if(element.properties.name == object.name)
        { result = true}
    })
    
    return result;
}

// console.log(isOn({
//     "address": "adres.4fun.com",
//     "version": "1.20.1",
//     "engine":  "Neoforge",
//     "run": "run.sh",
//     "text": "Stus x Lena Wołoch crossover when",
//     "name": "Fun"
//  }, serverList))

try {

    const socket = io(const_address + ':' + const_server_port);


    socket.on('admin-log', (logcontent) => {
        console.log(logcontent);
    })

    socket.on('srvstchange', (state, server, properties) => {
        console.log("received: state=" + state + " server=" + server + " properties: " + properties)
        console.log(!isOn(properties, serverList))
        if(!isOn(properties, serverList))
        {
            serverList.push(new serverIndicator(state, properties))
        }
        else
        {
            
            serverList.some(elem => {
                if(elem.properties.name == server) {
                    elem.updateParameters(state, elem.stateIndicator)
                }
            })
        } 
    })

    socket.on('disconnect', (reason) => {
        state_indicator_connecting.remove("enabled");
        state_indicator_off.add("enabled");
        state_indicator_on.remove("enabled");
    });

    socket.on("connect", (con) => {
        state_indicator_connecting.remove("enabled");
        state_indicator_off.remove("enabled");
        state_indicator_on.add("enabled");
        
        new popup(3, "Nawiązano połączenie z serwerem.")
    });

} catch (error) 
{
    new popup(1, "Nie udało się połączyć z serwerem. Przepraszamy za wszelkie niedogodności, prosimy aby spróbować ponownie. Jeżeli to nie zadziała połącz się z administratorami sieci WALTUH.");
    console.error("Connection with websocket failed with error: " + error);
}