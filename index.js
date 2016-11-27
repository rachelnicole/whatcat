Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

var http = require('http');
var express = require('express');
var app = module.exports.app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var oxford = require('project-oxford');
var client = new oxford.Client('23fae0648e74431388964ed07938c6ec');
var angerList = require('./anger.js');
var contemptList = require('./contempt.js');
var disgustList = require('./disgust.js');
var fearList = require('./fear.js');
var happinessList = require('./happiness.js');
var neutralList = require('./neutral.js');
var sadessList = require('./sadness.js');
var surpriseList = require('./surprise.js');



app.use('/public', express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) { 
  socket.on('selfiePath', function (selfiePath) {
    console.log('face url: ' + selfiePath);
    client.emotion.analyzeEmotion({
      url: selfiePath,
    }).then(function (response) {
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
        console.log(angerList.pick());
      }
      if (highEmotion == 'contempt') {
        console.log(contemptList.pick());
      }
      if (highEmotion == 'disgust') {
        console.log(disgustList.pick());
      }
      if (highEmotion == 'fear') {
        console.log(fearList.pick());
      }
      if (highEmotion == 'happiness') {
        console.log(happinessList.pick());
      }
      if (highEmotion == 'neutral') {
        console.log(neutralList.pick());
      }
      if (highEmotion == 'sadness') {
        console.log(sadnessList.pick());
      }
      if (highEmotion == 'surprise') {
        console.log(surpriseList.pick());
      }
    });
  });
});

server.listen(3030);
