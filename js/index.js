var editorPane = document.getElementById('editor'),
    previewPane = document.getElementById('preview'),
    downloadLink = document.getElementById('download'),
    fileName = '';
// Editor Interactions
onload = editorPane.onkeyup = function () {
    refreshView();
    if (fileName == '') {
        fileName = switchNote()
    };
    localStorage[fileName] = editorPane.value;
};
editorPane.onfocus = function () {
    this.style.webkitTransform = 'translate3D(0px, -10000px,0)';
    webkitRequestAnimationFrame(function () {
        this.style.webkitTransform = '';
    }.bind(this));
};
editorPane.onkeydown = function (event) {
        if (event.keyCode === 9) {
            softTab('  '); // tabs set at 2 spaces
            event.preventDefault();
        }
    }
    // Editor Functions
function refreshView() {
    editorPane.style.height = (window.innerHeight - 110) + 'px';
    previewPane.style.height = (window.innerHeight - 110) + 'px';
    (previewPane.contentWindow.document).write(editorPane.value);
    (previewPane.contentWindow.document).close();
    editorPane.focus();
}

function softTab(spaces) {
    if (document.selection) {
        editorPane.focus();
        var tab = document.selection.createRange();
        tab.text = spaces;
        return;
    } else if (editorPane.selectionStart || editorPage.selectionStart == '0') {
        var startPos = editorPane.selectionStart,
            endPos = editorPane.selectionEnd,
            scrollTop = editorPane.scrollTop;
        editorPane.value = editorPane.value.substring(0, startPos) + spaces + editorPane.value.substring(endPos, editorPane.value.length);
        editorPane.focus();
        editorPane.selectionStart = startPos + spaces.length;
        editorPane.selectionEnd = startPos + spaces.length;
    } else {
        editorPane.value += textArea.value;
        editorPane.focus();
    }
};

function switchNote() {
    fileName = prompt('Welcome to Tinkerpad\n\nThinkerpad is a mobile-friendly scratchpad for tinkering around with HTML, CSS, and JS in the browser. It can also be bookmarked for offline use.\n\nTo Use the Default Scratchpad:\nPress \'Enter\' or select \'Cancel\' to load the default scratchpad\n\nTo Create a New Scratchpad:\nEnter the name of the new scratchpad you wish to create and select \'OK\'\n\nTo Open a Saved Scratchpad:\nEnter the name of the saved scratchpad below to wish to continue editing and select \'OK\'\n\nSaved Scratchpads in This Browser:\n' + Object.keys(localStorage).join(", "), '');
    if (fileName == null || fileName == '') {
        fileName = 'scratchpad';
        editorPane.value = localStorage[fileName]
    }
    if (localStorage[fileName] != '') {
        editorPane.value = localStorage[fileName]
    }
    if (editorPane.value == 'undefined') {
        editorPane.value = '';
    }
    downloadLink.setAttribute('download', fileName + '.html');
    document.getElementById('filename').innerHTML = ': ' + fileName;
    document.title = 'Tinkerpad:' + fileName;
    refreshView();
};

function swingPane(reveal, conceal) {
    var revealPane = document.getElementById(reveal),
        concealPane = document.getElementById(conceal);
    if (revealPane.style.width != '100%') {
        concealPane.setAttribute('style', 'width: 0; margin: 0; padding: 0;');
        revealPane.setAttribute('style', 'width: 100%; margin-left: 0; opacity: 1;');
    } else {
        concealPane.setAttribute('style', 'width: 49.25%;');
        revealPane.setAttribute('style', 'width: 49.25%;');
    }
    refreshView();
};

function exportNote() {
    downloadLink.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(editorPane.value);
    downloadLink.click();
};