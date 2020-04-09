function Dancer(w,h) {
	let self = this;

	self.pos = createVector(w/2,h/2);
	self.prevPos = createVector(0,0);
	self.arrowhead = createVector(1,1);
	self.pathway;
	self.facing = "FORWARD";
	self.arrowlength = 25;
	self.normalized = createVector(1,1);

	// trace array
	self.posArray = [];
	self.arrayLength = 20;

	//display
	self.size = 25;
	self.fill;

	//circular vars
	self.radius = 50;
	self.angle = 0;
	self.speed = 1;
	self.center = createVector(w/2,h/2);

	// linear vars
	self.lineAngle = 0; // angle with horizontal
	self.velocity = createVector(1,1);
	self.lineStartPos;
	self.lineEndPos;

	self.frames = 0;


	self.update = function(){
		if(self.pathway == null){
			// textSize(24);
			// text('select a pathway!', self.pos.x + self.size, self.pos.y);
		} else if (self.pathway == "CIRCULAR"){
			self.updateCircular();
		} else if (self.pathway == "LINEAR"){
			self.updateLinear();
		}

		self.updateFacingDirection(self.velocity.copy());
		self.drawTrace();
	}

	self.reposition = function(w,h){
		self.center = createVector(w/2,h/2);
		self.posArray = [];
	}

	self.updatePathway = function(pathway){
		self.pathway = pathway;
		if (self.pathway == "CIRCULAR"){
			self.pos.x = self.center.x - self.radius;
			self.pos.y = self.center.y;
		} else if (self.pathway == "LINEAR"){
			self.lineStartPos = createVector(parseFloat(width/2) - parseFloat(self.radius),height/2);
			self.lineEndPos = createVector(parseFloat(width/2) + parseFloat(self.radius), height/2);
			self.lineAngle = Math.atan2(self.lineEndPos.y - self.lineStartPos.y, self.lineEndPos.x - self.lineStartPos.x);

			self.velocity.x = self.speed*cos(self.lineAngle);
			self.velocity.y = self.speed*sin(self.lineAngle);

			self.pos.x = self.lineStartPos.x;
			self.pos.y = self.lineStartPos.y;
		}
		// clear path
		self.posArray = [];
	}

	self.updateFacing = function(facing){
		self.facing = facing;
	}

	self.updateRadius = function(value){
		self.radius = value;
	}

	self.updateSpeed = function(value){
		self.speed = value;
		self.velocity.x = self.speed*cos(self.lineAngle);
		self.velocity.y = self.speed*sin(self.lineAngle);
	}

	self.updateTrace = function(value){
		self.arrayLength = value;
	}

	self.updateFacingDirection = function(vel){
		// calculate from velocity
		self.normalized = vel.normalize().mult(self.arrowlength);

		switch(self.facing){
			case 'FORWARD':
				self.arrowhead = self.normalized;
				break;
			case 'BACKWARD':
				self.arrowhead = self.normalized.mult(-1);
				break;
			case 'LEFT':
				self.arrowhead = createVector(self.normalized.y,-self.normalized.x);
				break;
			case 'RIGHT':
				self.arrowhead = createVector(-self.normalized.y,self.normalized.x);
				break;
		}

		// draw facing
		strokeWeight(10);
		stroke(0);
		line(self.pos.x, self.pos.y,self.pos.x+self.arrowhead.x,self.pos.y+self.arrowhead.y);
	}


	self.updateCircular = function(){
		self.prevPos.x = self.pos.x;
		self.prevPos.y = self.pos.y;

		self.pos.x = self.center.x + self.radius * cos(self.angle);
		self.pos.y = self.center.y + self.radius * sin(self.angle);

		self.angle = self.angle + self.speed/self.radius;

		// draw path below dancer
		noFill();
		stroke(0);
		strokeWeight(5);
		// ellipse(self.center.x, self.center.y, self.radius * 2);
		strokeWeight(10);
		stroke(255);

		// generate velocity
		self.velocity = createVector(self.pos.x - self.prevPos.x, self.pos.y - self.prevPos.y);
	}

	self.updateLinear = function(){
		// update start and end pos
		self.lineStartPos = createVector(parseFloat(width/2) - parseFloat(self.radius),height/2);
		self.lineEndPos = createVector(parseFloat(width/2) + parseFloat(self.radius), height/2);

		if(self.pos.x > self.lineEndPos.x | self.pos.x < self.lineStartPos.x ){ //if at end
			self.velocity = self.velocity.mult(-1);
		}

		self.pos.x += self.velocity.x; // 1
		self.pos.y += self.velocity.y; // 0

		// draw line path under dancer
		stroke(255);
		strokeWeight(5);
		line(self.lineStartPos.x,self.lineStartPos.y,self.lineEndPos.x,self.lineEndPos.y);
		fill(0);
		noStroke();
		ellipse(self.lineStartPos.x,self.lineStartPos.y, 15, 15);
		ellipse(self.lineEndPos.x,self.lineEndPos.y, 15, 15);

	}

	self.drawTrace = function(){
		self.frames += 1;

		// trace every X frames
		if (self.frames >= 10){
			self.posArray.push(self.pos.copy());
			self.frames = 0;
		}

		if(self.posArray.length >= self.arrayLength){
			self.posArray.shift(); //only X length trace
		}

		// draw trace
		for(var i = 0; i <= self.posArray.length -1 ; i++){
			fill(0,0,250,50*i);
			noStroke();
			ellipse(self.posArray[i].x,self.posArray[i].y, 10, 10);
		}
	}

	self.show = function(){
		noStroke();
		fill(255);
		ellipse(self.pos.x,self.pos.y, self.size, self.size);
	}

}

