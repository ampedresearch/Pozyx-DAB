class Dot{
	constructor(object){
		this.pos = createVector(object.x, object.y);
		this.history = [];
		this.historySize = 80;
		this.size = 10;
		this.facing = undefined;

		this.arrowLength = 20;
	}

	update(object){
		this.updatePosition(object.pos);
		this.updateFacing(object.facing);
		this.draw();
	}

	updatePosition(pos){
		// limit by history size
		// should i just pass history from Dancer class?
		if(this.history.length >= this.historySize) this.history.pop();
		this.history.unshift(pos);
		// set current pos
		this.pos.x = pos.x;
		this.pos.y = pos.y;
	}

	updateFacing(facing){
		// new facing
		this.facing = facing; //may need to copy vector
	}

	drawTrace(){
		// use history to draw trace
		noStroke();
		for(var i = 0; i <= this.history.length -1 ; i++){
			fill(0,0,250,map(i,0,this.history.length, 50, 0));
			ellipse(this.history[i].x,this.history[i].y, this.size/2, this.size/2);
		}
	}

	drawFacing(){
		strokeWeight(5);
		stroke(0);
		line(this.pos.x, this.pos.y, this.pos.x + this.facing.x*this.arrowLength, this.pos.y + this.facing.y*this.arrowLength);
	}

	draw(){
		// draw
		// scaling to canvas?
		this.drawTrace();
		this.drawFacing();

		fill(255);
		ellipse(this.pos.x, this.pos.y, this.size, this.size);
	}
}


class Dancer{
	constructor(){
		this.pos = createVector(50,50);
		this.history = [this.pos.copy()];
		this.historySize = 10;

		this.angle = 0;
		this.speed = 1;

		this.radius = 50; //holder value
		this.center = 50; //midway of 100-scale

		this.pathway;

		this.dot = new Dot({x: this.pos.x, y: this.pos.y});
	}

	update(){
		// update position and push to dot class
		// maybe move this to updateposition function?
		let newPos;
		switch(this.pathway){
			case 'CIRCULAR':
				newPos = this.updateCircular(this.pos);
				break;
			case 'LINEAR':
				newPos = this.updateLinear(this.pos);
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
		let newPos = createVector(this.center + this.radius * cos(this.angle), this.center + this.radius * sin(this.angle)); 
		this.angle += this.speed/this.radius; //should i edit this.angle in updateAngle()?

		return newPos;
	}

	updateLinear(){
		// the position will be of X% of line length using cos of angle
		let newPos = createVector(0,50);
		this.angle += this.speed/this.radius;

		let lineStart = createVector(this.center-this.radius, 50);
		let lineEnd = createVector(this.center+this.radius, 50);

		//OPTION ONE
		// use the cos of angle to map the position from -radius to radius from center
		newPos.x = map(cos(this.angle), -1, 1, lineStart.x, lineEnd.x);

		//OPTION TWO
		//use the +/- of the cos(angle) to calculate mvmt 
		
		return newPos;
	}

	updateFacing(){
		// calculate facing from difference in position
		let newFacing;
		newFacing = createVector(this.history[0].x-this.history[1].x, this.history[0].y-this.history[1].y);
		// switch(this.facing)
		newFacing.normalize();

		return newFacing;
	}

	addPosition(pos){ 
		// add position to history
		if(this.history.length >= this.historySize) this.history.pop();
		this.history.unshift(pos);
	}

	setPathway(pathway){
		this.pathway = pathway;
	}
}