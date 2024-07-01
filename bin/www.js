var app = require('../app');
var debug = require('debug')('chat-api:server');
var http = require('http');
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const { Server } = require("socket.io");
const {connectRedisClient} = require('./cache-store')

// Create HTTP server.
var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


var setupWebSocket = require('./socket');

setupWebSocket(server);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  connectRedisClient()
  console.log(`listening on ${port}`);
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}