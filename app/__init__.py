from __future__ import print_function
import sys

import eventlet
import json
from flask import Flask
from flask_mqtt import Mqtt
from flask_socketio import SocketIO
from config import Config

from fake_data.pozyx_tester import PozyxTester

from flask_bootstrap import Bootstrap

fakeDataMode = True

eventlet.monkey_patch()  # Better production server apparently

app = Flask(__name__)
app.config.from_object(Config)

# Used for sending messages to our web app(s)
socketio = SocketIO(app)

# Used for styling
bootstrap = Bootstrap(app)

# Fake connection for testing
if fakeDataMode:
    fakeMqtt = PozyxTester(socketio)
    fakeMqtt.start()

# Actual connection to Pozyx system
else:
    # topic = 'tags' # if in local mode
    topic = "5e53f6a58e1fde21f8abf509"
    mqtt = Mqtt(app)

    @mqtt.on_connect()
    def handle_connect(client, userdata, flags, rc):
        print("Connected", file=sys.stderr)
        mqtt.subscribe(topic)

    @mqtt.on_subscribe()
    def handle_subscribe(client, userdata, mid, granted_qos):
        print("Subscribed", file=sys.stderr)

    @mqtt.on_message()
    def handle_mqtt_message(client, userdata, message):
        data = dict(
            topic=message.topic,
            payload=json.loads(message.payload.decode())
        )
        socketio.emit('mqtt_message', data=data)
        print(data, file=sys.stderr)

    @mqtt.on_log()
    def handle_logging(client, userdata, level, buf):
        # socketio.emit('mqtt_log', 'Message logged')
        print(buf, file=sys.stderr)

from app import routes  # Awkward, but this location is Flask syntax
