var scripts = ["vim.js", "emacs.js", "keybindings.js"];

function removeNode () {
        this.parentNode.removeChild(this);
}

for (var i=0; i<scripts.length; i++) {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(scripts[i]);
    s.onload = removeNode;
    document.head.appendChild(s);
}
