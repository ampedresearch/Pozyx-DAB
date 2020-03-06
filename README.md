# Web Posyx App

## Using Virtual Environment with Python 2
```
$ sudo pip2 install virtualenv
$ virtualenv -p /usr/bin/python2.7 venv
$ source venv/bin/activate
$ deactivate
```

## Packages to install
```
$ python -m pip install --upgrade pip
$ pip install Flask
$ pip install 'flask-mqtt==1.0.5'
$ pip install flask-socketio
$ pip install greenlet
$ pip install eventlet
```

## Requirements
```
$ pip2 install -r requirements.txt
```

## Run
```
$ export FLASK_APP=core.py
$ flask run

$ python core.py
```
