const WebSocket = require("ws");
var CLIENTS = [];
var id;
const wss = new WebSocket.Server({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});
wss.on("open", ws => {
  ws.send("hi!");
});
wss.on("connection", ws => {
  CLIENTS[id] = ws;
  CLIENTS.push(ws);
  ws.on("message", message => {
    console.log(`Received message => ${message}`);
    sendAll(message);
  });
});
function sendAll(message) {
  console.log("sendAll : ");
  for (var j = 0; j < CLIENTS.length; j++) {
    // Отправить сообщения всем, включая отправителя
    console.log("FOR : ", message);
    CLIENTS[j].send(message);
  }
}
