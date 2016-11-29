Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

var http = require('http');
var express = require('express');
var app = module.exports.app = express();
var port = process.env.PORT || 3000;
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var oxford = require('project-oxford');
var client = new oxford.Client(process.env.OXFORD);
var angerList = require('./anger.js');
var contemptList = require('./contempt.js');
var disgustList = require('./disgust.js');
var fearList = require('./fear.js');
var happinessList = require('./happiness.js');
var neutralList = require('./neutral.js');
var sadessList = require('./sadness.js');
var surpriseList = require('./surprise.js');
var selfieUrl;

console.log(process.env.OXFORD);

app.use('/public', express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) { 
  socket.on('selfiePath', function (selfiePath) {
    selfieUrl = selfiePath;
    console.log('face url: ' + selfiePath);
    client.emotion.analyzeEmotion({
      url: selfiePath,
    }).then(function (response) {
      if (response.length == 0) {
        socket.emit('nohface');
        return;
      }
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
      if (highEmotion == 'anger') {
        socket.emit('catify', highEmotion, selfiePath, angerList.pick());
      }
      if (highEmotion == 'contempt') {
        socket.emit('catify', highEmotion, selfiePath, contemptList.pick());
      }
      if (highEmotion == 'disgust') {
        socket.emit('catify', highEmotion, selfiePath, disgustList.pick());
      }
      if (highEmotion == 'fear') {
        socket.emit('catify', highEmotion, selfiePath, fearList.pick());
      }
      if (highEmotion == 'happiness') {
        socket.emit('catify', highEmotion, selfiePath, happinessList.pick());
      }
      if (highEmotion == 'neutral') {
        console.log('emitting for neutral');
        socket.emit('catify', highEmotion, selfiePath, neutralList.pick());
      }
      if (highEmotion == 'sadness') {
        socket.emit('catify', highEmotion, selfiePath, sadnessList.pick());
      }
      if (highEmotion == 'surprise') {
        socket.emit('catify', highEmotion, selfiePath, surpriseList.pick());
      }
    });
  });
});

server.listen(port);
