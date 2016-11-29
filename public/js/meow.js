var socket = io.connect('http://localhost:3030/');
function submitUrl() {
  selfiePath = document.getElementById("selfiePath").value;
  socket.emit('selfiePath', selfiePath);
}
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
  $('<img>', { src: selfiePath }).appendTo('#selfie');
  $('<img>', { src: response.breedImg }).appendTo('.breedImg');
  $('.breedName').append(response.breedName);
  $('.breedDesc').append(response.breedDesc);
}