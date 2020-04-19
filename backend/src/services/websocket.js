class WebSocket {
  constructor(socket) {
    this.socket = socket;
  }

  msgToBroadcast(to, event, msg = "") {
    this.socket.to(to).emit(event, msg);
  }

  tryToConnect(friendId, from) {
    this.msgToBroadcast(friendId, "connection-request", from);
  }

  emitRefusedConnection(friendId) {
    this.msgToBroadcast(friendId, "connetion-refused");
  }

  emitAcceptedConnection(id, user_id) {
    this.msgToBroadcast(id, "connetion-accepted", user_id);
  }

  emitDisconnectedConnection(id) {
    this.msgToBroadcast(id, "connection-disconnected");
  }

  emitMediaPlay(id) {
    this.msgToBroadcast(id, "media-play");
  }

  emitMediaPause(id) {
    this.msgToBroadcast(id, "media-pause");
  }

  emitMediaSeek(id, timeStamp) {
    this.socket.to(id).emit("media-seeking", timeStamp);
  }
}

module.exports = WebSocket;
