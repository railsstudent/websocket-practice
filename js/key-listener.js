$(document).ready(() => {

  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;
  // if browser doesn't support WebSocket, just show
  // some notification and exit
  if (!window.WebSocket) {
    console.log('Websocket is not supported');
    return;
  } else {
    console.log('Websocket is supported');
  }

  const connection = new WebSocket('ws://192.168.164.84:1337');

  connection.onopen = function () {
     // connection is opened and ready to use
     console.log('Connection opened');
  };

  connection.onerror = function (error) {
    // an error occurred when sending/receiving data
    console.error(error);
  };

  /**
   * Send mesage when user presses Enter key
   */
  $(window).keydown(function(e) {
    console.log(e.keyCode);
    console.log(String.fromCharCode(e.keyCode));
    if (String.fromCharCode(e.keyCode) === 'A' && e.shiftKey === false) {
      console.log('Show available parking info');
      connection.send('available');
    } else if (String.fromCharCode(e.keyCode) === 'S' && e.shiftKey === false) {
      console.log('Show unavailable parking info');
      connection.send('unavailable');
    }
  });

});
