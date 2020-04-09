let particles;
let simDancer;
let radiusSlider;
let canvasSize = 600;

function setup() {
    radiusSlider = document.getElementById('radius');

    particles = new Particles();
    setInterval(particles.popPositions, 300);

    let handleDataRecieved = function(data) {
        if (!data['payload'][0]) return;
        let payload = data['payload'][0];
        if (!payload['success']) return;
        particles.respondToData(payload);
    }
    socket.addEventListener('mqtt_message', handleDataRecieved);

    // HTML elements
    radiusSlider = document.getElementById('radius-slider');
    speedSlider = document.getElementById('speed-slider');
    traceSlider = document.getElementById('trace-slider');

    // canvas sizing
    let cHeight = document.getElementById('canvas-div').clientHeight;
    let cWidth = document.getElementById('canvas-div').clientWidth-15;
    let myCanvas = createCanvas(cWidth,cHeight);
    myCanvas.parent('canvas-div');

    simDancer = new Dancer(cWidth,cHeight);
        // TESTING default to circular and forward for testing
        simDancer.updatePathway('CIRCULAR');
        simDancer.updateFacing('FORWARD');
}

function draw() {
    background(238, 206, 248);
    particles.update();
    particles.show();

    simDancer.update();
    simDancer.show();
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

function windowResized(){
    let cHeight = document.getElementById('canvas-div').clientHeight;
    let cWidth = document.getElementById('canvas-div').clientWidth-15;
    resizeCanvas(cWidth,cHeight);

    simDancer.reposition(cWidth,cHeight);
}
