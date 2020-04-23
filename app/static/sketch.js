let cHeight = 0;
let cWidth = 0;

// objects
let liveDancer;

let simDancers = {};
let idCount = 1;

function setup() {
    // canvas sizing
    cHeight = document.getElementById('canvas-div').clientHeight;
    cWidth = document.getElementById('canvas-div').clientWidth-15;
    let myCanvas = createCanvas(cWidth,cHeight);
    myCanvas.parent('canvas-div');

    liveDancer = new LiveDancers();
    setInterval(liveDancer .popPositions, 300);

    let handleDataRecieved = function(data) {
        if (!data['payload'][0]) return;
        let payload = data['payload'][0];
        if (!payload['success']) return;
        liveDancer.respondToData(payload);
    }
    socket.addEventListener('mqtt_message', handleDataRecieved);

    // HTML elements
    liveSwitch = document.getElementById('live-switch');
    // startRecord = document.getElementById
}

function draw() {
    background(238, 206, 248);

    for(const k in simDancers){        
        simDancers[k].update();
    }

    if(liveSwitch.checked){
        liveDancer.update();
    }
}

function setPathway(pathway, id){
    console.log(id);
    simDancers[id].setPathway(pathway);
    console.log('path set to ' + pathway);
}

function setFacing(facing, id){
    simDancers[id].setFacing(facing);
    console.log('facing set to ' + facing);
}

function setRadius(id){
    let rSlider = document.getElementById(`radius-slider${id}`);
    let radius = rSlider.value;
    simDancers[id].setRadius(radius);
    document.getElementById('radius-label').innerHTML = radius;
}

function setSpeed(id){
    let spSlider = document.getElementById(`speed-slider${id}`);
    let speed = spSlider.value;
    simDancers[id].setSpeed(speed);
    document.getElementById('speed-label').innerHTML = speed;
}

////////// in progress
function setTrace(){
    simDancers.setTrace(traceSlider.value);
    document.getElementById('trace-label').innerHTML = traceSlider.value;
}

function addDancer(){
    let idNum = idCount;
    idCount += 1; //counter
    let id = "dancer" + idNum;
    let newDancer = new SimDancer(createVector(50,50), idNum); //should also pass color
    simDancers[idNum] = newDancer; 

    // need to add target here.. MOVE TO DIFFERENT FUNCTION?
    let thisTarget = `<option class="target-item target${idNum}">dancer${idNum}</option>`;
    $(`.target-select`).append(thisTarget);

    let targets = ""; //make targets list
    for(const j in simDancers){
        if(j != idNum){
            targets += `<option class="target-item target${j}">dancer${j}</option>`;
        }
    }


    let thisHTML = `
    <div class='dancer' id='${id}'>

    <div id='heading${idNum}'>
        <button class='btn btn-primary' type='button' data-toggle='collapse' data-target='#${id}collapse' aria-expanded='false' aria-controls='${id}collapse'>
            Dancer ${idNum} Options
        </button>

    </div>

    <div class='collapse' id='${id}collapse' aria-labelledby="heading${idNum}" data-parent="#dancers-container">
    <div class='sliders'>
        <label>Radius</label><input type='range' class='slider' id='radius-slider${idNum}' value=25 max=50 min=10 onInput='setRadius(${idNum})'><label class='value' id='radius-label'>25</label>
        <label>Speed</label><input type='range' class='slider' id='speed-slider${idNum}' value=25 max=50 min=1 onInput='setSpeed(${idNum})'><label class='value' id='speed-label'>25</label>
        <label>Trace length</label><input type='range' class='slider' id='trace-slider${idNum}' value=50 max=100 min=0 onInput='setTrace(${idNum})'><label class='value' id='trace-label'>50</label>
    </div>

    <div class='pathways'>
        <label>Pathway Type:</label>
        <button id='LINEAR' type='button' onClick='setPathway(this.id, ${idNum})'>Linear</button>
        <button id='CIRCULAR' type='button' onClick='setPathway(this.id, ${idNum})'>Circular</button>
        <button id='RANDOM' type='button' onClick='setPathway(this.id, ${idNum})'>Random</button>
    </div>

    <div class='facings'>
        <label>Facing:</label>
        <button id='FORWARD' type='button' onClick='setFacing(this.id, ${idNum})'>Forward</button>
        <button id='LEFT' type='button' onClick='setFacing(this.id, ${idNum})'>Left</button>
        <button id='RIGHT' type='button' onClick='setFacing(this.id, ${idNum})'>Right</button>
        <button id='BACKWARD' type='button' onClick='setFacing(this.id, ${idNum})'>Backward</button>
        <button id='TARGET' type='button' onClick='setFacing(this.id, ${idNum})'>Target</button>
        <!-- make target button show/collapse select options-->
        <select class="form-control target-select" id="${id}-facing-target">
            <option id="noTarget"> none </option>
            ${targets} 
        </select>
    </div>
    <button class='removeDancer' onClick='removeDancer(${idNum})'>Remove Dancer ${idNum}</button>
    </div>
    </div> `

    $("#dancers-container").append(thisHTML);
}

function removeDancer(dancerId){
    delete simDancers[dancerId];
    let id = '#dancer' + dancerId;
    $(id).remove();

    // need to remove target here...
    $(`.target${dancerId}`).remove();
}

function handleTargets(){
    for(const k in simDancers){
        if(simDancers[k].facing == 'TARGET'){
            //get selected item from dancers' id-facing-target
            // this dancers face target = selected option's position
            // make sure to add if position == null (dancer has disappeared)
            // this will be selected option = noTarget ID
        }
    }
}

function windowResized(){
    let cHeight = document.getElementById('canvas-div').clientHeight;
    let cWidth = document.getElementById('canvas-div').clientWidth-15;
    resizeCanvas(cWidth,cHeight);
}