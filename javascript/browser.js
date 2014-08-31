function Browser() {
    var win;
    var websocket;
    var connected = false;
    var id = $.cookie('browser-id');

    if (!id) {
        id = randomNumbersString(6);
        $.cookie('browser-id', id, {expires: 365});
    }

    function randomNumbersString(count) {
        var result = '';
        for (var i = 0; i < count; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }

    function connect() {
        if (win && !win.closed) {
            win.focus();
        } else {
            win = window.open('window.html', 'websocket', 'height=' + screen.height + ',width=' + screen.width + ',resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no');
            win.onload = function() {
                if (connected) win.onOpen(id);
            };
        }
        if (!connected) {
            websocket = new WebSocket('ws://api.dusi.mobi:8000/browser?id=' + id);
            websocket.onmessage = function(evt) {
                win.focus();
                win.location = evt.data;
            };
            websocket.onopen = function() {
                connected = true;
                if(win.onOpen) win.onOpen(id);
            };
            websocket.onclose = function() {
                connected = false;
                win.location = 'window.html';
            };
            websocket.onerror = function() {
                win.onError();
                win.location = 'window.html';
            };
        }
    }

    setInterval(function() {
        if (connected && win && !win.closed) {
            websocket.send('');
        }
    }, 15000);

    Browser.prototype.connect = connect;
}