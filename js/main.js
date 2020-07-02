var compileButton = document.getElementById("CompileButton");
var mnsa = document.getElementById("codeeditor");

var editor = CodeMirror.fromTextArea(mnsa, { theme: "monokai", mode: "sakshyar", lineNumbers: true, scrollbarStyle: "overlay", cursorHeight:0.8});
window.addEventListener("load", ()=>{editor.refresh();}) //after google font loads, the cursor position needs to be recalculated
np_keyboard_init(editor);

var np_kbd_switch_button = document.getElementById('entonpswitch').getElementsByTagName("input")[0];
np_kbd_switch_button.addEventListener("change", ()=>{
    if (np_kbd_switch_button.checked){
        np_switchkbd();        
    }
    else{
        np_switchkbd();        
    }
})

var socket = io.connect('http://crnr.mnsa.cc');
var connection_okay = false;
var programRunning = false;


var totalTutorials = 4
var currentTutorial = 0;
function scrolltoview() {
    currentTutorial = (currentTutorial + 1) % totalTutorials;
    document.getElementsByClassName('slide')[currentTutorial].scrollIntoView({ behavior: "smooth", block: "nearest" });
}


function submit_compile() {
    if (connection_okay && !programRunning && editor.getValue() !== "") {
        socket.emit('codesend', { code: editor.getValue() });

        terminal_refresh();
        hide_editor();
        programRunning = true;
        compileButton.innerHTML = "रोक्नुहोस<img src='img/arrow-01.png'>"
    }
    else{
        if (programRunning){
            compileButton.innerHTML = "चलाउनुहोस<img src='img/arrow-01.png'>"
            programRunning = false;
            show_editor();
        }
    }
}
socket.on('over5kb', (data) => {
    //have some cool css popup or red lining classes
    //or redirect to some other page
    alert('You sent more code than our server likes to handle. Refresh the page and try again. Brevity is the soul of wit.')
})
socket.on('toolongsincelasttalk', (data) => {
    //have some cool css popup or red lining classes
    //or redirect to some other page
    alert('Server timed out. Refresh the page')
})
socket.on('toomanyconnections', (data) => {
    //have some cool css popup or red lining classes
    //or redirect to some other page
    alert('Server overloaded')
})
socket.on('status', (data) => {
    if(data.okay) 
        connection_okay = true;
    if(data.executionFinished)
    {terminal_allow_quit();}
})


terminal = document.getElementById("Terminal")
terminal_init(terminal, socket);
show_editor()
function hide_editor(){
    editor.getWrapperElement().style.visibility="hidden"
    terminal.style.visibility="visible"
    terminal.focus()
}
function show_editor(){
    editor.getWrapperElement().style.visibility="visible"
    terminal.style.visibility="hidden"
    editor.focus();
}




var np_slideout_activated = false;
function np_slideout(){
    if (np_slideout_activated){
        document.getElementById('kbdlayout').style.left = '0px';
    }
    else{
        document.getElementById('kbdlayout').style.left = '-77px';
    }
    np_slideout_activated = !np_slideout_activated; 
}