// Load environment variables from .env file
require('dotenv').config();

// Module dependencies
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const debug = require('debug')('chat-api:server');
const cors = require('cors');

// Route handlers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const chatRouter = require('./routes/chat');
const recentChatRouter = require('./routes/recent_chats');

// WebSocket setup
const setupWebSocket = require('./bin/socket');

// Redis client connection
const { connectRedisClient } = require('./bin/cache-store');

// Initialize Express application
const app = express();

// Set up logging and middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS setup
const corsOptions = {
  origin: 'http://localhost:4200', // Change this to your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true, // This allows cookies to be sent with the requests if needed
};
app.use(cors());

// Routes
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/chat', chatRouter);
app.use('/recent-chats', recentChatRouter);

// Handle 404 errors
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.json({ error: err.message }); // Respond with JSON error message
});

// Normalize port number
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Listen on provided port, on all network interfaces
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// WebSocket setup
setupWebSocket(server);

// Function to normalize port
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

// Error handling for server listen
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // Handle specific listen errors with friendly messages
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

// Event listener for HTTP server "listening" event
function onListening() {
  connectRedisClient(); // Connect to Redis
  console.log(`Listening on ${port}`);
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
