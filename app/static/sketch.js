// 
let cHeight = 0;
let cWidth = 0;

// objects
let dancer;
let dancer2;

let dancers = [];

// html objects
let radiusSlider
let speedSlider
let traceSlider
let checkBoxes;

function setup() {
    // canvas sizing
    cHeight = document.getElementById('canvas-div').clientHeight;
    cWidth = document.getElementById('canvas-div').clientWidth-15;
    let myCanvas = createCanvas(cWidth,cHeight);
    myCanvas.parent('canvas-div');

    // object constructors
    // let liveDancer = new LiveDancer(50,50);

    // following test
    dancer = new Dancer(50, 50);
    dancer2 = new Dancer(50,60);
    dancer.setPathway('LINEAR');

    dancer2.setPathway('CIRCULAR');

    dancers.push(dancer);
    dancers.push(dancer2);
/*
    dancer = new Dancer(50, 50);
    dancers.push(dancer);*/

    /*liveDancer = new Particles();
    setInterval(liveDancer.popPositions, 300);

    // live data
    let handleDataRecieved = function(data) {
        if (!data['payload'][0]) return;
        let payload = data['payload'][0];
        if (!payload['success']) return;
        liveDancer.respondToData(payload);
    }
    socket.addEventListener('mqtt_message', handleDataRecieved);*/

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
    cHeight = document.getElementById('canvas-div').clientHeight;
    cWidth = document.getElementById('canvas-div').clientWidth-15;

/*    for(i=0;i<dancers.length-1;i++){
        push();
        translate(cWidth/2-50,cHeight/2-50);
        scale(1.2);
        dancers[i].update();
        pop();
    }*/
    push();
    translate(cWidth/2-50,cHeight/2-50);
    scale(1.2);
    dancer.update();

    let newCenter = dancer.dot.pos;
    dancer2.updateCenter(parseInt(newCenter.x),parseInt(newCenter.y));
    dancer2.update();
    pop();

    // liveDancer.update(); //not working
}

function setPathway(pathway){
    dancer.setPathway(pathway);
    console.log('path set to ' + pathway);
}

function setFacing(facing){
    dancer.setFacing(facing);
    console.log('facing set to ' + facing);
}

function setRadius(){
    let radius = radiusSlider.value
    dancer.setRadius(radius);
    document.getElementById('radius-label').innerHTML = radius;
}

function setSpeed(){
    dancer.setSpeed(speedSlider.value);
    document.getElementById('speed-label').innerHTML = speedSlider.value;
}

////////// in progress
function setTrace(){
    dancer.setTrace(traceSlider.value);
    document.getElementById('trace-label').innerHTML = traceSlider.value;
}

function checkboxFunction(box){
    checkBoxes[box.id] = box.checked;
    console.log(checkBoxes);
}

function windowResized(){
    let cHeight = document.getElementById('canvas-div').clientHeight;
    let cWidth = document.getElementById('canvas-div').clientWidth-15;
    resizeCanvas(cWidth,cHeight);
    // rescale dancer movement here in dancer.scale();

}

function addDancer(){
    let newDancer = new Dancer(50,50); //should also pass color
    dancers.push(newDancer);
    let id = "dancer" + (dancers.length-1).toString();

    // $("dancers").append("new form");
}

function removeDancer(){
    // ?? how to delete an object...
    //pop from dancers[]
}