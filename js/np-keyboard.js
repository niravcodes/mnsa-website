//COMPACTIBILITY!!! WITH KEYS


var using_nepali_layout = true;
var editor=null;

const ModifierKeysWhitelist = [
    "Alt", "AltGr", "CapsLock", "Control",
    "Fn", "FnLock", "Hyper", "Meta",
    "NumLock", "OS", "ScrollLock",
    "Shift", "Super"
];

const data_sakshyarLayout = [
    ' ', '!', '"', '#', '$', '%', '&', "'",
    '(', ')', '*', '+', ',', '-', '।', '्',
    '०', '१', '२', '३', '४', '५', '६', '७',
    '८', '९', 'ङ', 'ङ', '<', '=', '>', '?',
    '@', 'आ', 'भ', 'छ', 'ध', 'ै', 'ऊ', 'घ', 'अ', 'ी',
    'झ', 'ख', '', 'ं', 'ण', 'ओ', 'फ', 'ठ', 'ऋ', 'श', 'थ',
    'ू', "ँ", 'औ', '', 'ञ', 'ढ', 'इ', '॥', 'ए', 'ज्ञ', '_',
    'ृ', 'ा', 'ब', 'च', 'द', 'े', 'उ', 'ग', 'ह', 'ि', 'ज',
    'क', 'ल', 'म', 'न', 'ो', 'प', 'ट', 'र', 'स', 'त', 'ु',
    'व', 'ौ', 'ष', 'य', 'ड', 'ई', 'ऐ', ''
]

function np_keyboard_init(ed){
    editor = ed;
    //work out the compactibility parts
    document.addEventListener('keypress', onKeyPress)
    
}

function noModifierPressed(event) {
    ModifierKeysWhitelist.forEach((k) => {
        if (event.getModifierState(k)) {
            return false;
        }
    })
    return true;
}
function onKeyPress(event) {
    if (editor.hasFocus() == true && using_nepali_layout) {
        var keyname = event.key;
        if (keyname.length == 1 && keyname.match(/[\x20-\x7E]/) && noModifierPressed(event)) {
            console.log(keyname + "intercepted")
            event.preventDefault();
            correspondingNepaliKey = applyLayout(keyname);
            if (correspondingNepaliKey !== null) {
                insertString(editor, correspondingNepaliKey)
            }
        }
    }

    function applyLayout(key) {
        key = key.charCodeAt(0) - 32;
        console.log(key);
        if (data_sakshyarLayout[key])
            return data_sakshyarLayout[key]
        else
            return null;
    }
}

function np_switchkbd() {
    using_nepali_layout = !using_nepali_layout;
    editor.focus();
}

function insertString(editor, str) {
    var selection = editor.getSelection();
    if (selection.length > 0) {
        editor.replaceSelection(str);
    }
    else {
        var doc = editor.getDoc();
        var cursor = doc.getCursor();

        var pos = {
            line: cursor.line,
            ch: cursor.ch
        }
        doc.replaceRange(str, pos);
    }
}