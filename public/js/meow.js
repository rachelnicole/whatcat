var socket = io();

navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;


var constraints = { video: { width: 1280, height: 720 } }; 

function takepicture() {
  var video = $('video');
  var width = video.attr('width');
  var height = video.height();

  var canvas = $('<canvas></canvas>').appendTo($('body'))[0];
  var context = canvas.getContext('2d');
  canvas.style.display = 'none';
  canvas.width = width;
  canvas.height = height;
  context.drawImage(video[0], 0, 0, width, height);
  
  var imageData = context.getImageData(0, 0, width, height);
  var data = canvas.toDataURL('image/png');

  $('video').remove();
  var img = $('<img></img>')
    .appendTo($('#selfie').html(''))
    .attr('src', data);
  socket.emit('selfiePath', data);
}

if (navigator.getUserMedia) {
  $('#selfie').one('click', function () {
  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
        $('#selfie').html('');
        var video = $('<video></video>')
          .attr('width', 500)
            .appendTo($('.selfie-wrapper'))[0];
        var take = $('<button class="snapshot"></button>')
          .text('Click to take a pic!')
          .prependTo($('.step-one'))
          .on('click', takepicture);
         var video = document.querySelector('video');
         video.srcObject = stream;
         video.onloadedmetadata = function(e) {
           video.play();
         };
        take.on('click', function() {
        });
      },
      function(err) {
         console.log("The following error occurred: " + err.name);
      }
   );
  });
} else {
   console.log("getUserMedia not supported");
}

function submitUrl() {
  selfiePath = document.getElementById("selfiePath").value;
  $('#selfiePath').attr('disabled', true);
  $('<img>', { src: selfiePath }).appendTo('#selfie');
  $('#submitButton').prop('disabled', true);
  socket.emit('selfiePath', selfiePath);
};

function startOver() {
  // $('#selfiePath').attr('disabled', false);
  // $('#selfiePath').val('');
  // $('#submitButton').prop('disabled', false);
  // $('.step-one').addClass('shown').removeClass('hidden');
  // $('.step-two').addClass('hidden').removeClass('shown');
  // $('#selfie').empty();
  // $('.breedImg').empty();
  // $('.yourEmotion').empty();
  // $('.breedName').empty();
  // $('.breedDesc').empty();
  // $('<img>', { src: 'public/images/mystery.png' }).appendTo('#selfie');
  // $('<img>', { src: 'public/images/mystery.png' }).appendTo('.breedImg');
  // $('.form-error').empty();
  window.location.reload(true);

};

socket.on('catify', function (highEmotion, response) {
  console.log('hitting catify');
  if (response == '') {
    alert('Error! Make sure your image has at least one face and is less than 4 MB.');
    location.reload(true);
  }
  else {
    whichCat(highEmotion, response);
  }
});

socket.on('nohface', function() {
  $('.form-error').append('sorry we were unable to detect a face, please make sure all features are unobstructed');
  $('#selfiePath').attr('disabled', false);
  $('#selfiePath').val('');
  $('#submitButton').prop('disabled', false);
});


function whichCat(highEmotion, response) {
  $('.breedImg').empty();
  $('<img>', { src: response.breedImg }).appendTo('.breedImg');
  $('.yourEmotion').append('Your emotion is: ' + highEmotion);
  $('.breedName').append(response.breedName);
  $('.breedDesc').append(response.breedDesc);
  $('.step-one').addClass('hidden').removeClass('shown');
  $('.step-two').addClass('shown').removeClass('hidden');
};
