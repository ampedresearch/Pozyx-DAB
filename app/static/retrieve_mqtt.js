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
    if ((recording == true) && data['payload']['success']) {
        let tagId = data['payload']['tagId'];

        if (movementSession.hasOwnProperty(tagId))
            movementSession[tagId].push(data);
        else movementSession[tagId] = [data];
    }
}

// How to start/stop recording
let startRecording = function() {recording = true;}
let stopRecording = function() {
    recording = false;
    addNewDownloadLink();
    movementSession = {};
}

// Append data to the screen
let addNewDownloadLink = function() {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(movementSession));
    let listElement = document.createElement("li");
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute("href", dataStr);
    downloadLink.setAttribute('download', 'session.json');
    downloadLink.innerHTML = "New Session";

    listElement.appendChild(downloadLink);
    pastRecordings.appendChild(listElement);
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
