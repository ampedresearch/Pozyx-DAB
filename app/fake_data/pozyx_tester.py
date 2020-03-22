# This file is used for generating fake JSON messages for testing
# when someone is not actively using the Pozyx system (e.g. Corona)

import json
from threading import Thread, Event


class PozyxTester:
    def __init__(self, socketio):
        self.stopFlag = Event()
        self.interval = Interval(self.stopFlag, self.send_message)
        self.iterator = 0

        self.socketio = socketio

        with open('app/fake_data/test_session.json') as f:
            self.data = json.load(f)

    def send_message(self):
        self.socketio.emit('mqtt_message', data=self.form_data())

    def form_data(self):
        fakeKeys = [int(k) for k in self.data.keys()]
        fakeKeys.sort()
        fakeKey = str(fakeKeys[0])
        payload = self.data[fakeKey][self.iterator]
        data = {'topic': 'fake', 'payload': [payload]}

        self.iterator = (self.iterator + 1) % len(self.data[fakeKey])

        return data

    def start(self):
        self.interval.start()  # This may not work more than once

    def stop(self):
        self.stopFlag.set()


# Interval function for asynchronously, repeatedly calling some code
# From https://stackoverflow.com/questions/12435211/
# python-threading-timer-repeat-function-every-n-seconds
class Interval(Thread,):
    def __init__(self, event, funcToCall):
        Thread.__init__(self)
        self.stopped = event
        self.func = funcToCall

    def run(self):
        while not self.stopped.wait(0.5):
            self.func()
