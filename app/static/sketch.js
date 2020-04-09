// objects
let liveDancer;
let simDancer;

// html objects
let radiusSlider
let speedSlider
let traceSlider
let checkBoxes;

function setup() {
    // canvas sizing
    let cHeight = document.getElementById('canvas-div').clientHeight;
    let cWidth = document.getElementById('canvas-div').clientWidth-15;
    let myCanvas = createCanvas(cWidth,cHeight);
    myCanvas.parent('canvas-div');

    // object constructors
    simDancer = new Dancer(cWidth,cHeight);
        // TESTING default to circular and forward for testing
        simDancer.updatePathway('CIRCULAR');
        simDancer.updateFacing('FORWARD');

    liveDancer = new Particles();
    setInterval(liveDancer.popPositions, 300);

    // live data
    let handleDataRecieved = function(data) {
        if (!data['payload'][0]) return;
        let payload = data['payload'][0];
        if (!payload['success']) return;
        liveDancer.respondToData(payload);
    }
    socket.addEventListener('mqtt_message', handleDataRecieved);

    // HTML elements
    radiusSlider = document.getElementById('radius-slider');
    speedSlider = document.getElementById('speed-slider');
    traceSlider = document.getElementById('trace-slider');

    checkBoxes = {
        'live' : true,
        'simulated' : true,
        'recorded' : false
    }

    // let checkBoxLive = document.getElementById('live-box');
    // let checkBoxSimulated = document.getElementById('sim-box');
    // let checkBoxRecorded = document.getElementById('record-box');

}

function draw() {
    background(238, 206, 248);
    
    liveDancer.update();
    if(checkBoxes.live){
        liveDancer.show();
    }
    if(checkBoxes.simulated){
        simDancer.update();
        simDancer.show();
    }
}

function updateRadiusVal(){
    simDancer.updateRadius(radiusSlider.value);
    // document.getElementById('radius-label').innerHTML = 'radius: ' + radiusSlider.value;
}

function updateSpeedVal(){
    simDancer.updateSpeed(map(speedSlider.value,10,250, 0, 10));
    // document.getElementById('speed-label').innerHTML = 'speed: ' + speedSlider.value;
}

function updateTraceVal(){
    simDancer.updateTrace(traceSlider.value);
    // document.getElementById('trace-label').innerHTML = 'trace length: ' + traceSlider.value;
}

function checkboxFunction(box){
    checkBoxes[box.id] = box.checked;
    console.log(checkBoxes);
}

function windowResized(){
    let cHeight = document.getElementById('canvas-div').clientHeight;
    let cWidth = document.getElementById('canvas-div').clientWidth-15;
    resizeCanvas(cWidth,cHeight);

    simDancer.reposition(cWidth,cHeight);
}
