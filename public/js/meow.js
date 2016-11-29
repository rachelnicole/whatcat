var socket = io();
function submitUrl() {
  selfiePath = document.getElementById("selfiePath").value;
  $('#selfiePath').attr('disabled', true);
  $('#submitButton').prop('disabled', true);
  socket.emit('selfiePath', selfiePath);
};

function startOver() {
  $('#selfiePath').attr('disabled', false);
  $('#selfiePath').val('');
  $('#submitButton').prop('disabled', false);
  $('.step-one').addClass('shown').removeClass('hidden');
  $('.step-two').addClass('hidden').removeClass('shown');
  $('#selfie').empty();
  $('.breedImg').empty();
  $('.breedName').empty();
  $('.breedDesc').empty();
  $('<img>', { src: 'public/images/mystery.png' }).appendTo('#selfie');
  $('<img>', { src: 'public/images/mystery.png' }).appendTo('.breedImg');

};

socket.on('catify', function (selfiePath, response) {
  console.log('hitting catify');
  if (response == '') {
    alert('Error! Make sure your image has at least one face and is less than 4 MB.');
    location.reload(true);
  }
  else {
    whichCat(selfiePath, response);
  }
});

socket.on('nohface', function() {
  $('.form-error').append('sorry we were unable to detect a face, please make sure all features are unobstructed');
});


function whichCat(selfiePath, response) {
  console.log(response);
  $('#selfie').empty();
  $('.breedImg').empty();
  $('<img>', { src: selfiePath }).appendTo('#selfie');
  $('<img>', { src: response.breedImg }).appendTo('.breedImg');
  $('.breedName').append(response.breedName);
  $('.breedDesc').append(response.breedDesc);
  $('.step-one').addClass('hidden').removeClass('shown');
  $('.step-two').addClass('shown').removeClass('hidden');
};