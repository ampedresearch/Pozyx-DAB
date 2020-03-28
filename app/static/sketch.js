let particles;

function setup() {
    particles = new Particles();
    setInterval(particles.popPositions, 300);

    let handleDataRecieved = function(data) {
        if (!data['payload'][0]) return;
        let payload = data['payload'][0];
        if (!payload['success']) return;
        particles.respondToData(payload);
    }
    socket.addEventListener('mqtt_message', handleDataRecieved);

    createCanvas(400, 400);
}

function draw() {
    background(255);
    particles.update();
    particles.show();
}
