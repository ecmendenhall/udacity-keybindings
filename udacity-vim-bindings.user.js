// ==UserScript==
// @name Udacity Vim Bindings
// @description Vim keybindings for the Udacity IDE.
// @version 0.9
// 
// @namespace http://e.cmendenhall.com/
// 
// @include http://www.udacity.com/view*
// @match http://www.udacity.com/view*
// 
// ==/UserScript==

function inject(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
}

function change_keymap () {
    console.log('toggle_mode');
    
    var keymap_mode = document.getElementById('keymap_btn').firstElementChild.innerText;

    if (keymap_mode === 'VIM') {
        console.log(CodeMirror.keyMap.default);
        console.log(CodeMirror.keyMap);
        
        CodeMirror.keyMap.default = CodeMirror.keyMap.vim;
        /*codemirror_textarea.addEventListener('keydown', function (key_event) {
                console.log(key_event);
                var cm_div = document.getElementsByClassName('CodeMirror')[0]; 

                function changeCursor(state) {
                     
                     var current_class = cm_div.className;
                     var focus = current_class.search('CodeMirror-focused');
                     var new_class;
                     if (state === 'normal') {
                         new_class = 'CodeMirror cm-keymap-fat-cursor'; 
                     }
                     else if (state === 'insert') {
                         new_class = 'CodeMirror';
                     }
                     if (focus) {
                         new_class = new_class + ' CodeMirror-focused';
                     }
                     cm_div.className = new_class;
                 }
                  
                 if (key_event.keyIdentifier === 'U+001B') {
                     changeCursor('normal');
                 }
                 else if (key_event.keyIdentifier === 'U+005B' && key_event.ctrlKey) {
                     changeCursor('normal');
                 }
                 else if (key_event.keyIdentifier === 'U+0043' && key_event.ctrlKey) {
                     changeCursor('normal');  
                 }
                 else if (key_event.keyIdentifier === 'U+0041') {
                     changeCursor('insert');
                 }
                 else if (key_event.keyIdentifier === 'U+0049') {
                     changeCursor('insert');
                 }
                 else if (key_event.keyIdentifier === 'U+0053') {
                     changeCursor('insert');
                 }
                 else if (key_event.keyIdentifier === 'U+004F') {
                     changeCursor('insert');
                 }
        });*/
    }
    
    else if (keymap_mode === 'DEFAULT') {
        CodeMirror.keyMap.default = CodeMirror.keyMap._default;
        //cm_div.addEventListener('keydown', function () {});
    }

    else if (keymap_mode === 'EMACS') {
        CodeMirror.keyMap.default = CodeMirror.keyMap.emacs;
    }
}

function load_bindings () {
        console.log('load_bindings');

        vimbindings = document.createElement('script');
        vimbindings.type = 'text/javascript';
        vimbindings.src = 'https://raw.github.com/marijnh/CodeMirror/master/keymap/vim.js';
        vimbindings.id = 'vimbindings';
        document.head.appendChild(vimbindings);

        emacsbindings = document.createElement('script');
        emacsbindings.type = 'text/javascript';
        emacsbindings.src = 'https://raw.github.com/marijnh/CodeMirror/master/keymap/emacs.js';
        document.head.appendChild(emacsbindings);

        var cursor_style = ['.CodeMirror.cm-keymap-fat-cursor pre.CodeMirror-cursor {',
                           '    z-index: 10;',
                           '    width: auto;',
                           '    border: 0;',
                           '    background: transparent;',
                           '    background: rgba(0, 200, 0, .4);',
                           '}'].join('\n');
        
        var new_css = document.createElement('style');
        new_css.type = 'text/css';
        new_css.innerHTML = cursor_style;
        document.head.appendChild(new_css);

        CodeMirror.keyMap._default = CodeMirror.keyMap.default;
}

function load_keymap_btn () {
    var right_column = document.getElementById('player-right-column');

    var keymap_btn = document.createElement('div');
    keymap_btn.setAttribute("class", "button gray-button");
    keymap_btn.setAttribute("id", "keymap_btn");
    keymap_btn.innerText = " Key bindings: ";
    var strong_state = document.createElement('strong');
    strong_state.innerText = "DEFAULT";
    keymap_btn.appendChild(strong_state);

    var keymap_btn_style = ['#keymap_btn {',
                             '  float: right;',
                             '  clear: both;',
                             '  margin-top: 5px;', 
                             '  margin-bottom: 3px;',
                             '  line-height: 18px;',
                             '  width: 150px;',
                             '}'].join('\n');

    var keymap_btn_css = document.createElement('style');
        keymap_btn_css.type = 'text/css';
        keymap_btn_css.innerHTML = keymap_btn_style;
        document.head.appendChild(keymap_btn_css);

    keymap_btn.setAttribute("state", 0);

    function toggle_mode (btn) {
        var binding_titles = ["DEFAULT", "VIM", "EMACS"];
        var btn_state = btn.getAttribute('state');
        var i = parseInt(btn_state);
        i = (i + 1) % binding_titles.length;
        btn.setAttribute("state", i);
        var keymap_mode = binding_titles[i];
        btn.firstElementChild.innerText = keymap_mode;
        return keymap_mode;
    }

    function reset_mode (btn) {
        btn.setAttribute("state", 0);
        btn.firstElementChild.innerText = "DEFAULT";
    }

    keymap_btn.addEventListener('click', function () {
        console.log('click')
        var keymap_mode = toggle_mode(this);
        inject(change_keymap);
    });

    window.addEventListener('hashchange', function () {
        reset_mode(keymap_btn); 
    });

    inject(load_bindings);

    function try_append () {
        var auto_next_view = right_column.childNodes[2];
        if (auto_next_view) {
          right_column.appendChild(keymap_btn); 
        } else {
            setTimeout(try_append, 500);
        }
    }

    try_append();

}

load_keymap_btn();
