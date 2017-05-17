Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

var fs = require('fs');
var express = require('express');
var app = module.exports.app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;
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

server.listen(port);

app.use('/public', express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) { 

  socket.on('selfiePath', function (selfiePath) {
    selfieUrl = selfiePath;
    var data = selfieUrl.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    fs.writeFileSync('public/image.png', buf);
    client.emotion.analyzeEmotion({
      path: 'public/image.png',
    }).then(handleResponse, handleError);
  });

  socket.on('selfieData', function (selfieData) {
    var d = new Buffer(selfieData.split(',')[1], 'base64');
    client.emotion.analyzeEmotion({
      data: d,
    }).then(handleResponse, handleError);
  });

  function handleError(error) {
    console.log(error);
  }

  function handleResponse(response) {
    console.log('face gotten');
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
