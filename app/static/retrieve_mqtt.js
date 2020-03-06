// Script for recording movements in the posyx lab and downloading
// them.

// ---------------------------Variables---------------------------

// For handling mqtt communications
let socket;

// Tracking user recordings
let recording = false;
let movementSession = {};

// DOM Manipulation
let pastRecordings;
let recordButton;

// ---------------------------Functions---------------------------

// Called each time a new mqtt message is recieved
// This checks the state of the recording variable
let sessionRecorder = function(data) {
    if (!data['payload'][0]) return;

    // We may need to do more checking to ensure these are
    // properly formed messages
    let payload = data['payload'][0];
    if (recording && payload['success']) {
        let tagId = payload['tagId'];

        if (movementSession.hasOwnProperty(tagId))
            movementSession[tagId].push(payload);
        else movementSession[tagId] = [payload];
        console.log(movementSession);
    }
}

// How to start/stop recording
let startRecording = function() {recording = true;}
let stopRecording = function() {
    addNewDownloadLink();
    movementSession = {};
    recording = false;
}

// Append download links to the webpage
let addNewDownloadLink = function() {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(movementSession));
    let listElement = document.createElement("li");
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute("href", dataStr);
    downloadLink.setAttribute('download', 'session' + Date.now() + '.json');

    downloadLink.innerHTML = formatItemName();

    listElement.appendChild(downloadLink);
    pastRecordings.prepend(listElement);
}

let formatItemName = function() {
    let now = new Date(Date.now()).toString('YYYY-MM-dd');
    return ('Session: ' + now);
}

let handleRecordButtonClick = function() {
    if (recording) {
        stopRecording();
        recordButton.innerHTML = "Start Recording"
    }
    else {
        startRecording();
        recordButton.innerHTML = "Stop Recording"
    }
}

// ---------------------------Page Load---------------------------

document.addEventListener("DOMContentLoaded", function(){
    socket = io();
    pastRecordings = document.getElementById('pastRecordings');
    recordButton = document.getElementById('recordButton');

    socket.addEventListener('mqtt_message', sessionRecorder);
    recordButton.addEventListener('click', handleRecordButtonClick);
    // Set up the buttons and

});
