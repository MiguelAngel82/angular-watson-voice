'use strict';

/* eslint-env node, es6 */

const express = require('express');
const app = express();
const watson = require('watson-developer-cloud');
const vcapServices = require('vcap_services');
const cors = require('cors');

// allows environment properties to be set in a file named .env
require('dotenv').load({ silent: true });

// on bluemix, enable rate-limiting and force https
if (process.env.VCAP_SERVICES) {
  // enable rate-limiting
  const RateLimit = require('express-rate-limit');
  app.enable('trust proxy'); // required to work properly behind Bluemix's reverse proxy

  const limiter = new RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    delayMs: 0 // disable delaying - full speed until the max limit is reached
  });

  //  apply to /api/*
  app.use('/api/', limiter);

  // force https - microphone access requires https in Chrome and possibly other browsers
  // (*.mybluemix.net domains all have built-in https support)
  const secure = require('express-secure-only');
  app.use(secure());
}

app.use(express.static(__dirname + '/static'));
app.use(cors());

// token endpoints
// **Warning**: these endpoints should probably be guarded with additional authentication & authorization for production use

// speech to text token endpoint
var sttAuthService = new watson.AuthorizationV1(
  Object.assign(
    {
      iam_apikey: process.env.SPEECH_TO_TEXT_APIKEY, // or hard-code credentials here
      url: process.env.SPEECH_TO_TEXT_URL
    },
    vcapServices.getCredentials('speech_to_text') // pulls credentials from environment in bluemix, otherwise returns {}
  )
);
app.use('/api/speech-to-text/token', function(req, res) {
  sttAuthService.getToken(
    {
      //url: watson.SpeechToTextV1.URL
      url: 'https://gateway-lon.watsonplatform.net/speech-to-text/api'
    },
    function(err, token) {
      if (err) {
        console.log('Error retrieving token: ', err);
        res.status(500).send('Error retrieving token');
        return;
      }
      res.send(token);
    }
  );
});

const port = process.env.PORT || process.env.VCAP_APP_PORT || 3002;



app.listen(port, function() {
  console.log('Example IBM Watson Speech JS SDK client app & token server live at http://localhost:%s/', port);
});

// Chrome requires https to access the user's microphone unless it's a localhost url so
// this sets up a basic server on port 3001 using an included self-signed certificate
// note: this is not suitable for production use
// however bluemix automatically adds https support at https://<myapp>.mybluemix.net
if (!process.env.VCAP_SERVICES) {
  const fs = require('fs');
  const https = require('https');
  const HTTPS_PORT = 3001;

const http = require('http');
var server = http.Server(app);

const socketIO = require('socket.io');
var io = socketIO(server);

const socketPort = process.env.PORT || 3005;

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('new-message', (message) => {
    io.emit('new-message', message);
  });
});

server.listen(socketPort, () => {
  console.log(`Socket server started on port: ${socketPort}`);
});


