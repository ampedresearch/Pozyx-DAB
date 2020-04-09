 function Particle(id, initialPosition) {
    let self = this;

    self.id = id;

    self.diameter = 0;
    self.maxDiameter = 20;

    self.history = [initialPosition];
    self.historySize = 8;

    self.x = self.history[0].x;
    self.y = self.history[0].y;
    self.lerpFactor = 0.2;

    self.update = function() {
        self.updateSize();
        self.updatePosition();
    }

    self.updateSize = function() {
        let maxOut = floor(self.historySize/2);
        let d = map(self.history.length, 0, maxOut, 0, self.maxDiameter, true);
        self.diameter = lerp(self.diameter, d, self.lerpFactor);
    }

    self.show = function() {
        circle(self.x, self.y, self.diameter);
    }

    self.updatePosition = function() {
        if (!self.history.length) return;
        self.x = lerp(self.x, self.history[0].x, self.lerpFactor);
        self.y = lerp(self.y, self.history[0].y, self.lerpFactor);
    }

    self.addPosition = function(position) {
        if (self.history.length >= self.historySize) self.popPosition();
        self.history.unshift(position);
    }

    self.popPosition = function() { self.history.pop(); }
}

function Particles() {
    let self = this;

    self.particleObj = {};

    self.roomWidth = 10000;
    self.roomHeight = 10000;

    self.update = function() {
        for (const k in self.particleObj) {
            self.particleObj[k].update();
        }
    }

    self.show = function() {
        for (const k in self.particleObj) {
            self.particleObj[k].show();
        }
    }

    // Data Processing Functions - Called in response to Posyx data recieved
    self.respondToData = function(payload) {
        let newID = payload.tagId;
        let position = self.convertData(payload);

        if (newID in self.particleObj) self.addPosition(newID, position);
        else self.addParticle(newID, position);
    }

    self.addParticle = function(id, initialPosition) {
        self.particleObj[id] = new Particle(id, initialPosition);
    }

    self.addPosition = function(id, position) {
        self.particleObj[id].addPosition(position);
    }

    self.convertData = function(payload) {
        let position = {};
        let origX = payload.data.coordinates.x;
        let origZ = payload.data.coordinates.y;
        position.x = map(origX, 0, self.roomWidth, 0, width, true);
        position.y = map(origZ, 0, self.roomHeight, 0, height, true);

        return position;
    }

    self.popPositions = function() {
        // console.log('pop');
        for (const k in self.particleObj) {
            self.particleObj[k].popPosition();
        }
    }
}
