from __future__ import print_function
import sys

import eventlet
import json
from flask import Flask
from flask_mqtt import Mqtt
from flask_socketio import SocketIO
from config import Config

eventlet.monkey_patch()  # maybe unnecessary

app = Flask(__name__)
app.config.from_object(Config)

# topic = 'tags' # if in local mode
topic = "5e53f6a58e1fde21f8abf509"
mqtt = Mqtt(app)
socketio = SocketIO(app)


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


from app import routes
