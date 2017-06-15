// This is Node's file system! https://nodejs.org/api/fs.html
var fs = require('fs');
// Express is how we handle our server routing https://expressjs.com/
var express = require('express');
var app = module.exports.app = express();
var server = require('http').createServer(app);
// Socket.IO enables real-time bidirectional event-based communication.
var io = require('socket.io').listen(server);
// The process.env variables are passed in for azure to set automatically
var port = process.env.PORT || 3000;
// Project Oxford allows us to implement some cognitive service apis in a simpler way.
var oxford = require('project-oxford');
// process env variables are set ion Azure
var client = new oxford.Client(process.env.OXFORD);
var angerList = require('./anger.js');
var contemptList = require('./contempt.js');
var disgustList = require('./disgust.js');
var fearList = require('./fear.js');
var happinessList = require('./happiness.js');
var neutralList = require('./neutral.js');
var sadessList = require('./sadness.js');
var surpriseList = require('./surprise.js');
// Setting a global selfieUrl so each time it runs, this data is overwritten.
var selfieUrl;

// This is just our random picker that grabs a random item from each of the lists for the emotions
Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

// Have our server listen on the port we define above so we know when connections are made
server.listen(port);

// Telling our application to use the public folder to serve up static files.
app.use('/public', express.static('public'));

// When a connection is made to the app, serve up index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


// Once a connection is made to the server, open up the socket communication.
io.on('connection', function(socket) { 

  // When the client emits selfiePath, we are getting the image data passed to the server where we save it locally and send it over to the emotion api to analyze.
  socket.on('selfiePath', function (selfiePath) {
    selfieUrl = selfiePath;
    var data = selfieUrl.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    fs.writeFileSync('public/image.png', buf);
    client.emotion.analyzeEmotion({
      path: 'public/image.png',
    }).then(handleResponse, handleError);
  });

  // log errors to the console
  function handleError(error) {
    console.log(error);
  }

  function handleResponse(response) {
    console.log('face gotten');
    // checking to see if the api actually finds a face, if it doesn't it emits nohface to the client which updates the site with a message to try again
    if (response.length == 0) {
      socket.emit('nohface');
      return;
    }
    // If a face is found, we iterate through all of the emotion scores comparing each one to the next, until we know which emotion has the highest number.
    var emotionScores = response[0].scores;
    var highScore = 0;
    var highEmotion;
    for (var i in emotionScores) {
      if (emotionScores[i] > highScore) {
        highScore = emotionScores[i];
        highEmotion = i;
      }
    }
    console.log(highScore);
    console.log(highEmotion);

    // checking to see which the highest emotion is, where we then send a socket message to the client where it picks a random cat from each emotion list and updates the site with the relevant information
    if (highEmotion == 'anger') {
      socket.emit('catify', highEmotion, angerList.pick());
    }
    if (highEmotion == 'contempt') {
      socket.emit('catify', highEmotion, contemptList.pick());
    }
    if (highEmotion == 'disgust') {
      socket.emit('catify', highEmotion, disgustList.pick());
    }
    if (highEmotion == 'fear') {
      socket.emit('catify', highEmotion, fearList.pick());
    }
    if (highEmotion == 'happiness') {
      socket.emit('catify', highEmotion, happinessList.pick());
    }
    if (highEmotion == 'neutral') {
      console.log('emitting for neutral');
      socket.emit('catify', highEmotion, neutralList.pick());
    }
    if (highEmotion == 'sadness') {
      socket.emit('catify', highEmotion, sadnessList.pick());
    }
    if (highEmotion == 'surprise') {
      socket.emit('catify', highEmotion, surpriseList.pick());
    }
  }
});
