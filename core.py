from app import app, socketio

if __name__ == '__main__':
    # Set reloader to False if connecting to Pozyx
    socketio.run(app, use_reloader=True, debug=True, host='127.0.0.1', port=8000)
