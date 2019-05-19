const fs = require('fs');
const https = require('https');

const express = require('express');
const app = express();
const sockets = require('signal-master/sockets');
const basicAuth = require('express-basic-auth');
const config = require('./config.json');

const environment = process.env.NODE_ENV || 'development';

if (environment !== 'development') {
  app.use(basicAuth({
    users: config.users,
    challenge: true
  }));  
}

app.use(express.static('./dist'));

const httpsOptions = {
  key: fs.readFileSync(config.server.key),
  cert: fs.readFileSync(config.server.cert),
  passphrase: config.server.password
}
const server = https.createServer(httpsOptions, app).listen(config.server.port);
sockets(server, config);
