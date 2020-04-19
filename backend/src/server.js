const app = require("http").createServer(() => {
  console.log("Server is running");
});
const io = require("socket.io")(app);
const crypto = require("crypto");

const connected = [];
const connectionInstances = [];

const port = process.env.PORT || 5500;
app.listen(port);

const WebSocket = require("./services/websocket");
io.on("connection", (socket) => {
  const userId = crypto.randomBytes(3).toString("HEX");
  const { id } = socket;
  const mySocket = new WebSocket(socket);
  connected.push({
    id: socket.id,
    user_id: userId,
  });
  socket.emit("new-id", userId);

  socket.on("connection-try", ({ from, to }) => {
    const friendId = connected.find(({ user_id }) => user_id === to);
    if (friendId) {
      mySocket.tryToConnect(friendId.id, from);
    } else {
      socket.emit("connection-user-not-found");
    }
  });

  socket.on("connection-refused", (userId) => {
    const user = connected.find(({ user_id }) => user_id === userId);
    if (user.id) {
      mySocket.emitRefusedConnection(user.id);
    } else {
      console.log("CANNOT FIND USER " + userId);
    }
  });

  socket.on("connection-accepted", (userId) => {
    const user = connected.find(({ user_id }) => user_id === userId);
    const { user_id } = connected.find(({ id }) => id === socket.id);
    if (user.id) {
      mySocket.emitAcceptedConnection(user.id, user_id);
    } else {
      console.log("CANNOT CONNECT EMIT TO USER " + userId);
    }
  });

  socket.on("connection-disconnect", (userId) => {
    const user = connected.find(({ user_id }) => user_id === userId);
    if (user) {
      mySocket.emitDisconnectedConnection(user.id);
    } else {
      console.log("COULDN'T DISCONNECT FROM " + userId);
    }
  });

  socket.on("media-play", (id) => {
    const user = connected.find(({ user_id }) => user_id == id);
    if (user) {
      mySocket.emitMediaPlay(user.id);
    } else {
      console.log("NO USER FOUND");
    }
  });

  socket.on("media-pause", (id) => {
    const user = connected.find(({ user_id }) => user_id == id);
    if (user) {
      mySocket.emitMediaPause(user.id);
    } else {
      console.log("NO USER FOUND");
    }
  });

  socket.on("media-seeking", ({ id, timeStamp }) => {
    const user = connected.find(({ user_id }) => user_id == id);
    if (user) {
      mySocket.emitMediaSeek(user.id, timeStamp);
    } else {
      console.log("NO USER FOUND");
    }
  });
});
