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

function load_bindings () { 
    var vimbindings = document.createElement('script');
    vimbindings.type = 'text/javascript';
    vimbindings.src = 'http://codemirror.net/keymap/vim.js';
    document.head.appendChild(vimbindings);

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

    var ember_view_div = document.getElementById('assignment-view').firstElementChild;
    var ember_view_id = ember_view_div.id;
    var textarea = ember_view_div.childNodes[1];
    var codemirror = ember_view_div.childNodes[2];
    var buttonbar = ember_view_div.childNodes[4];
    console.log(buttonbar);

    ember_view_div.removeChild(textarea);
    ember_view_div.removeChild(codemirror);
    ember_view_div.removeChild(buttonbar);

    ember_view_div.appendChild(textarea);
    ember_view_div.appendChild(buttonbar);

    Ember.View.views[ember_view_id].assignment.reopen({ reloadIDE: function () {
        _this=this
        this.addObserver('ideModel', function () {
            var customIDE = _this.get('ideModel');
            if (!customIDE) {
                return;
            }
            var startingCode = customIDE.get('usercode') || customIDE.get('suppliedCode') || "Welcome to Udacious IDE!";
            var codeEditor;
            var aceDiv = _this.get('aceDiv');
            CodeMirror.keyMap.basic.Tab = "indentMore";
            var editor_textarea = document.getElementById('editor');
            codeEditor = CodeMirror.fromTextArea(editor_textarea,
            {mode: 'python', 
             theme: 'eclipse', 
             indentUnit: 4, 
             lineNumbers: true, 
             keyMap: 'vim',
             onKeyEvent: function (instance, key_event) {

                 function changeCursor(state) {
                     var cm_div = document.getElementsByClassName('CodeMirror')[0];
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
             }
                });
            codeEditor.setValue(startingCode);
            _this.set('codeEditor', codeEditor);});
        var model = this.get('ideModel');
        if (model && this.get('codeEditor')) {
            this.set('ideModel', false);
            this.set('ideModel', model);
        }
    }});

    Ember.View.views[ember_view_id].assignment.reloadIDE();

    var old_ide = document.getElementById(ember_view_id).childNodes[5];
    ember_view_div.removeChild(old_ide);
}

function load_keymap_btn () {
    console.log("load_keymap_btn");
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
        var binding_titles = ["DEFAULT", "VIM"];
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
        var keymap_mode = toggle_mode(this);
        if (keymap_mode === "VIM") {
            inject(load_bindings);
        }
    });

    window.addEventListener('hashchange', function () {
        reset_mode(keymap_btn); 
    });

    function try_append () {
        console.log("try_append");
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
