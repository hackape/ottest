// https://raw.githubusercontent.com/Operational-Transformation/ot.js/master/dist/ot.js
const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const ot = require('ot');

app.listen(8081);
function handler (req, res) {
  res.writeHead(200);
  res.end();
}

const server = new ot.Server("");

// when you receive an operation as a JSON string from one of the clients, do:
function onReceiveOperation (json) {
  // { wrapped: [''], meta: { creator, id }, revision } = json;
  const operation = ot.TextOperation.fromJSON(json.wrapped);
  server.receiveOperation(json.revision, operation);
  server.broadcast(json, server.document);
}

server.subscription = [];
server.subscribe = function (socket) {
  server.subscription.push(socket);
}

server.broadcast = (operation, document) => {
  server.subscription.forEach(socket => {
    console.log('broadcasting', operation);
    console.log('current document', document);
    socket.emit('server', operation);
  })
}

let counter = 0
io.on('connection', function (socket) {
  console.log('counting connection', counter++);
  socket.emit('news', { hello: 'world' });
  socket.on('client', onReceiveOperation);
  server.subscribe(socket);
});
