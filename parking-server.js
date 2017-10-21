"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-parking';

// Port where we'll run the websocket server
const webSocketsServerPort = 1337;

// websocket and http servers
const webSocketServer = require('websocket').server;
const http = require('http');

// list of currently connected clients (users)
const clients = [ ];

const server = http.createServer((request, response) => {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
});
server.listen(webSocketsServerPort, () => { });

// create the server
const wsServer = new webSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket
  // request is just an enhanced HTTP request. For more info
  // http://tools.ietf.org/html/rfc6455#page-6
  httpServer: server
});

// WebSocket server
wsServer.on('request', request => {
  console.log((new Date()) + ' Connection from origin '
        + request.origin + '.');

  const connection = request.accept(null, request.origin);
  let index = clients.push(connection) - 1;
  let first = false;
  console.log('index', index, 'first', first);
  console.log((new Date()) + ' Connection accepted.');

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    if (message.type === 'utf8' && message.utf8Data) {
      // process WebSocket message
      let data = null;
      if (message.utf8Data === 'available') {
        data = {
          plate: 'CP 6668',
          slot: '568',
          status: 'Available',
          time: '18:30 - 20:00'
        };
      } else if (message.utf8Data === 'unavailable') {
        data = {
          plate: 'CP 6668',
          slot: '568',
          status: 'Unavailable'
        };
      }

      if (data) {
        console.log((new Date()) + ' Received Message: ' + message.utf8Data);
        console.log('data', data);
        for (let i=0; i < clients.length; i++) {
            console.log('notify client ', i);
            clients[i].sendUTF(JSON.stringify(data));
        }
      }
    }
  });

  connection.on('close', function(connection) {
    // close user connection
    const now = new Date();
    // remove user from the list of connected clients
    console.log('Disconnect client with index ', index);
    clients.splice(index, 1);
    console.log(`${now} Peer ${connection.remoteAddress} disconnected.`);
  });
});

/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
  return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
