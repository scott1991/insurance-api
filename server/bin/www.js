#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app.js';
import debugLib from 'debug';
import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const projectDirname = __filename.split(path.sep).slice(-4)[0];
const debug = debugLib(projectDirname + ':server');

import db from '../models/index.js';
const sequelize = db.sequelize;

db.loadModels().then(() => {
  return sequelize.sync({ force: false })
}).then(() => {

  /**
   * Get port from environment and store in Express.
   */

  let port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

  /**
   * Create HTTP server.
   */

  let server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);




  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
})
  .catch(function (error) {
    console.log(error, error.stack);
    process.exit();
  });


/**
* Normalize a port into a number, string, or false.
*/
function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
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

