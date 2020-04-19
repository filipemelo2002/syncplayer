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
}

module.exports = WebSocket;
