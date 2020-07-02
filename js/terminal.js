var terminal = null;
var input = null;
var output = null;
var allowQuit = false;

function terminal_init(term, socket){
    terminal = term;
    input = terminal.getElementsByTagName("input")[0]
    output = terminal.getElementsByTagName("pre")[0];

    allowQuit = false;
    input.value = "";
    output.innerHTML = "";

    //callbacks
    terminal.addEventListener("click", ()=>{input.focus()})
    input.addEventListener("keypress", (event)=>{
        var key = event.which || event.keyCode;
        if (key === 13){
            if (allowQuit){
                submit_compile();
            }
            socket.emit('inputsend', {data:input.value})
            socket.emit('inputsend', {data:'\0'})
            output.innerHTML += input.value + "<br>";
            input.value = "";
            terminal.scrollTop = terminal.scrollHeight;
        }
    })
    socket.on('outputsend', (data) => {
        output.innerHTML += data.output;
        terminal.scrollTop = terminal.scrollHeight;
    })
    socket.on('messagesend', (data) => {
        output.innerHTML += '<span class="terminalmessage">' + data.output + '</span>'
        terminal.scrollTop = terminal.scrollHeight;
    })
}


function terminal_allow_quit(){
    allowQuit = true;
}

function terminal_refresh(){
    input.value = "";
    output.innerHTML = "";
    allowQuit=false;
}