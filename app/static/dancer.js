class Dot{
	constructor(object){
		this.pos = createVector(object.x, object.y);
		this.history = [];
		this.historySize = 80;
		this.size = 15;
		this.fill = object.fill;

		this.arrow;
		this.arrowLength = 20;

		this.scale = 300;
	}

	update(object){
		this.updatePosition(object.pos);
		this.updateArrow(object.facing);
		this.draw();
	}

	updatePosition(pos){
		// scale to scale value .. can make function to update with resize
		let scaleX = map(pos.x, 0, 100, 0, this.scale);
		let scaleY = map(pos.y, 0, 100, 0, this.scale);
		let scalePos = createVector(scaleX,scaleY);
		if(this.history.length >= this.historySize) this.history.pop();
		this.history.unshift(scalePos);
		// set current pos
		this.pos.x = scalePos.x;
		this.pos.y = scalePos.y;
	}

	updateArrow(arrow){
		this.arrow = arrow;
	}

	updateTrace(trace){
		// not working properly
		this.historySize = trace;
	}

	drawTrace(){
		// use history to draw trace
		noStroke();
		for(var i = 0; i <= this.history.length -1 ; i++){
			fill(0,0,250,map(i,0,this.history.length, 50, 0));
			ellipse(this.history[i].x,this.history[i].y, this.size/2, this.size/2);
		}
	}

	drawArrow(){
		strokeWeight(5);
		stroke(0);
		line(this.pos.x, this.pos.y, this.pos.x + this.arrow.x*this.arrowLength, this.pos.y + this.arrow.y*this.arrowLength);
	}

	draw(){
		// scaling to canvas? with push/pop
		push();
		translate(width/2-this.scale/2,height/2-this.scale/2);
		this.drawTrace();
		this.drawArrow();

		fill(this.fill);
		strokeWeight(0);
		ellipse(this.pos.x, this.pos.y, this.size, this.size);
		pop();
	}
}


class SimDancer{
	constructor(pos, idNum){
		this.pos = createVector(pos.x, pos.y); //might remove this?
		this.history = [this.pos.copy()]; //do we need history for Dancer?
		this.historySize = 10;

		this.angle = 0;
		this.speed = 1;

		this.radius = 50; //holder value
		this.center = createVector(50,50); //midway of 100-scale

		this.pathway; //both edited through html buttons
		this.facing;
		this.faceTarget = createVector(0,0);

		this.id = idNum;
		this.dot = new Dot({x: this.pos.x, y: this.pos.y, fill: color(random(255),random(255),random(255))});
	}

	update(){
		// update position and push to dot class
		// maybe move this to updateposition function?
		let newPos;
		switch(this.pathway){
			case 'CIRCULAR':
				newPos = this.updateCircular();
				break;
			case 'LINEAR':
				newPos = this.updateLinear();
				break;
			default:
				newPos = createVector(50,50);
				console.log('no pathway chosen');
		}
		
		this.addPosition(newPos);
		let newFace = this.updateFacing();
		// push data to inner class
		this.dot.update({pos: newPos, facing: newFace});
	}

	updateCircular(){
		// calculate NEXT position based current angle
		let newPos = createVector(this.center.x + this.radius * cos(this.angle), this.center.y + this.radius * sin(this.angle)); 
		this.angle += this.speed/this.radius; //should i edit this.angle in updateAngle()?

		return newPos;
	}

	updateLinear(){
		// the position will be of X% of line length using cos of angle
		let newPos = createVector(0,50);
		let lineStart = createVector(this.center.x - this.radius, 50);
		let lineEnd = createVector(this.center.x + this.radius, 50);

		// use the cos of angle to map the position from -radius to radius from center
		this.angle += this.speed/this.radius;
		newPos.x = map(cos(this.angle), -1, 1, lineStart.x, lineEnd.x);
		
		return newPos;
	}

	updateFacing(){
		// calculate facing from difference in position
		let newFacing;
		let normalized;
		normalized = createVector(this.history[0].x-this.history[1].x, this.history[0].y-this.history[1].y).normalize();
		switch(this.facing){
			case 'FORWARD':
				newFacing = normalized.copy();
				break;
			case 'LEFT':
				newFacing = createVector(normalized.y, - normalized.x);
				break;
			case 'RIGHT':
				newFacing = createVector(-normalized.y, normalized.x);
				break;
			case 'BACKWARD':
				newFacing = normalized.mult(-1);
				break;
			case 'TARGET':
				newFacing = this.calcTarget();
				break;
			default:
				newFacing = normalized.copy();
		}
		return newFacing;
	}

	addPosition(pos){ 
		// add position to history
		if(this.history.length >= this.historySize) this.history.pop();
		this.history.unshift(pos);
	}

	updateCenter(x,y){
		this.center = createVector(parseInt(x),parseInt(y));
		console.log(this.center);
	}

	updateScale(w,h){
		this.dot.updateScale(w,h);
	}

	setPathway(pathway){
		this.pathway = pathway;
	}

	setFacing(facing){
		this.facing = facing;
	}

	setRadius(radius){
		this.radius = parseInt(radius);
	}

	setSpeed(speed){
		this.speed = map(parseInt(speed), 1, 50, 0.2 ,7);
	}

	setTrace(trace){
		this.dot.updateTrace(parseInt(trace));
	}
}

// seperate class
// look @ particleS

class LiveDancer{
	constructor(id, initpos){
		this.id = id;

		this.history = [initpos];
		this.historySize = 8; //does this need to change?

		this.pos = createVector(this.history[0].x,this.history[0].y);

		this.lerpFactor = 0.1;

		this.dot = new Dot({x: this.pos.x, y: this.pos.y, fill: color(0)});
	}

	update(){
		// return update position and push to dot class
		let newPos = this.updatePosition();
		let newFace = createVector(0,0); //supposedly can get from pozyx data?
		this.dot.update({pos: newPos, facing: newFace});

		this.pos = newPos; 
	}

	updatePosition(){
		let newPos = createVector(0,0);
		newPos.x = lerp(this.pos.x, this.history[0].x, this.lerpFactor);
		newPos.y = lerp(this.pos.y, this.history[0].y, this.lerpFactor);

		return newPos;
	}

	addPosition(pos){
		 if (this.history.length >= this.historySize) this.popPosition();
        this.history.unshift(pos);
	}

	popPosition(){
		this.history.pop();
	}

}

class LiveDancers{
	constructor(){
		this.dancerObj = {};
		this.roomSize = createVector(10000,10000);
	}

	update(){
		for(const k in this.dancerObj) {
			this.dancerObj[k].update();
		}
	}

	respondToData(payload){
		let newID = payload.tagId;
		let position = this.convertData(payload);

		if (newID in this.dancerObj) this.addPosition(newID, position);
		else this.addDancer(newID, position);
	}

	addDancer(id,initpos){
		this.dancerObj[id] = new LiveDancer(id, initpos);
	}

	addPosition(id, pos){
		this.dancerObj[id].addPosition(pos);
	}

	convertData(payload){
		let pos = createVector(0,0);
		let origX = payload.data.coordinates.x;
        let origZ = payload.data.coordinates.y;
        // scaled to 100-points like simDancer
        pos.x = map(origX, 0, this.roomSize.x, 0, 100, true);
        pos.y = map(origZ, 0, this.roomSize.y, 0, 100, true);

        return pos;
	}

	popPositions(){
		for ( const k in this.dancerObj){
			this.dancerObj[k].popPosition();
		}
	}
}