// INITIALIZE FIREBASE
var config = {
  apiKey: "AIzaSyB5IYyZaqGpBivXeJ7Q2yKbxiNkv0iLiI8",
  authDomain: "fir-train-e2503.firebaseapp.com",
  databaseURL: "https://fir-train-e2503.firebaseio.com",
  projectId: "fir-train-e2503",
  storageBucket: "fir-train-e2503.appspot.com",
  messagingSenderId: "826109818845"
};
firebase.initializeApp(config);

// Database reference variable
var database = firebase.database();

// Initiating train information variables
var train = '';
var destination = '';
var time = '';
var freqency = '';

//  ON VALUE FUNCTION
database.ref().on('child_added', function(snapshot) {
  var sv = snapshot.val()
  // set variable to current time minus 24 hours
  // 24 hours ago ensures positive numbers in 
  // following calculation variables
  var startTime = moment(sv.time, 'hh:mm').subtract(24, 'hours');
  // set variable to difference between now and startTime
  var diffTime = moment().diff(moment(startTime), 'minutes');
  // divide frequency into diffTime to get remainder
  var timeRemainder = diffTime % sv.frequency;
  // take remainder away from the frequency to calculate
  // minutes until next train
  var minutesUntil = sv.frequency - timeRemainder;
  // add minutesUntil to current time to get next train time
  var nextTrain = moment().add(minutesUntil, 'minutes').format('h:mm a');

  // console.log(startTime);
  // console.log(diffTime);
  // console.log(timeRemainder);
  // console.log(minutesUntil);
  // console.log(nextTrain);

  // create new row HTML
  var newRow = $('<tr>');
  // create new columns with database and calculated variables
  var columns = $(
    '<td>' + sv.trainName + '</td>' +
    '<td>' + sv.destination + '</td>' +
    '<td>' + sv.frequency + '</td>' +
    '<td>' + nextTrain + '</td>' +
    '<td>' + minutesUntil + '</td>'  
  )
  // append columns to row
  newRow.append(columns);
  // append new row to tbody section of html
  $('tbody').append(newRow);
})

// CLICK ADD TRAIN BUTTON
$('#add-train').on('click', function(event) {
  event.preventDefault();

  // grab the input values of the form
  train = $('#train-name').val().trim();
  destination = $('#train-destination').val().trim();
  time = $('#train-time').val().trim();
  freqency = $('#train-frequency').val().trim();

  // push all variables to the database
  database.ref().push({
    trainName: train,
    destination: destination,
    frequency: freqency,
    time: time,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  })

  // clear input boxes
  $('#train-name').val('');
  $('#train-destination').val('');
  $('#train-time').val('');
  $('#train-frequency').val('');
})
