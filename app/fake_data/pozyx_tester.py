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
        datas = self.form_data()
        # return
        for d in datas:
            self.socketio.emit('mqtt_message', data=d)

    def form_data(self):
        datas = []
        fakeKeys = [k for k in self.data.keys()]
        iteratorMaxSize = min([len(d) for d in self.data.values()])

        for fk in fakeKeys:
            payload = self.data[fk][self.iterator]
            datas.append({'topic': 'fake', 'payload': [payload]})

        self.iterator = (self.iterator + 1) % iteratorMaxSize

        return datas

    def start(self):
        self.interval.start()  # This may not work more than once

    def stop(self):
        self.stopFlag.set()


# Interval function for asynchronously, repeatedly calling some code
# From https://stackoverflow.com/questions/12435211/
# python-threading-timer-repeat-function-every-n-seconds
class Interval(Thread):
    def __init__(self, event, funcToCall, callRate=0.1):
        Thread.__init__(self)
        self.stopped = event
        self.func = funcToCall
        self.rate = callRate

    def run(self):
        while not self.stopped.wait(self.rate):
            self.func()
