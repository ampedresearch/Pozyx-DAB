class Dot{
	constructor(object){
		this.pos = createVector(object.x, object.y);
		this.history = [];
		this.historySize = 80;
		this.size = 10;
		this.arrow;

		this.arrowLength = 20;
	}

	update(object){
		this.updatePosition(object.pos);
		this.updateArrow(object.facing);
		this.draw();
	}

	updatePosition(pos){
		// wrong code for trace
		// should i just pass history from 
		if(this.history.length >= this.historySize) this.history.pop();
		this.history.unshift(pos);
		// set current pos
		this.pos.x = pos.x;
		this.pos.y = pos.y;
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
		this.drawTrace();
		this.drawArrow();

		fill(255);
		ellipse(this.pos.x, this.pos.y, this.size, this.size);
	}
}


class Dancer{
	constructor(){
		this.pos = createVector(50,50); //might remove this?
		this.history = [this.pos.copy()];
		this.historySize = 10;

		this.angle = 0;
		this.speed = 1;

		this.radius = 50; //holder value
		this.center = createVector(50,50); //midway of 100-scale

		this.pathway; //both edited through html buttons
		this.facing;

		this.dot = new Dot({x: this.pos.x, y: this.pos.y});
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
		this.speed = parseInt(speed);
	}

	setTrace(trace){
		this.dot.updateTrace(parseInt(trace));
	}
}

class LiveDancer extends Dancer(){
	respondtoData(payload){
		let newID = payload.tagId;
		let position = this.convertData(payload);
		// NOT HANDLING IDS HERE
		// if newID = this.id?? or do code similar
		// to willies' Particles() for all live dancers
		this.addPosition(position);
	}
	convertData(payload) {
	    let position = {};
	    let origX = payload.data.coordinates.x;
	    let origZ = payload.data.coordinates.y;
	    let roomWidth = 10000;
	    let roomHeight = 10000;
	    position.x = map(origX, 0, roomWidth, 0, width, true);
	    position.y = map(origZ, 0, roomHeight, 0, height, true);

	    return position;
	}
}