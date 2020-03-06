# Web Pozyx App
Flask Web App for communicating with the DAB! Posyx system.

## Using Virtual Environment with Python 2
This currently runs in Python 2.7.1 as the [initial test scripts from the Pozyx page](https://www.pozyx.io/documentation/creator/connect-with-mqtt) did not appear to form a connection in Python 3. Please use a virtual environment to ensure settings are uniform across machines. (The exact commands to activate might vary in Windows.)
```
$ sudo pip2 install virtualenv
$ virtualenv -p /usr/bin/python2.7 venv
$ source venv/bin/activate
$ deactivate
```

## Packages
All the packages are listed in the requirements file, so to install the proper packages, you should only have to run the following command:
```
$ pip install -r requirements.txt
```

If you install or change any python packages, make sure to run the following command to keep the requirements file updated.
```
```

I (Willie) ran the following commands on initial setup (though you shouldn't have to).
```
$ python -m pip install --upgrade pip
$ pip install Flask
$ pip install 'flask-mqtt==1.0.5'
$ pip install flask-socketio
$ pip install greenlet
$ pip install eventlet
```

## Run
Because we are using an eventlet server rather than the default, you will not use the `flask run` command. Instead, you will simply run the core script.
```
$ python core.py
```
Furthermore, because this forms a single connection to the Posyx cloud, you will need to rerun this command any time you make any changes (not just reload the page). The *autoreloader* must always be disabled to prevent the [same problem of forming duplicate connections](https://flask-mqtt.readthedocs.io/en/latest/index.html#limitations).


## Resources
* [Pozyx MQTT](https://www.pozyx.io/documentation/creator/connect-with-mqtt)
* [Flask](https://flask.palletsprojects.com/en/1.1.x/)
* [Flask MQTT](https://flask-mqtt.readthedocs.io/en/latest/index.html)
* [Flask SocketIO](https://flask-socketio.readthedocs.io/en/latest/)
* [Python Virtual Environments Guide](https://docs.python-guide.org/dev/virtualenvs/)
