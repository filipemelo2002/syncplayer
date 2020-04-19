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
    const { id: friendId } = connected.find(({ user_id }) => user_id === to);
    if (friendId) {
      mySocket.tryToConnect(friendId, from);
    } else {
      console.log("CANNOT CONNECT TO USER " + friendId);
    }
  });

  socket.on("connection-refused", (userId) => {
    const { id } = connected.find(({ user_id }) => user_id === userId);
    if (id) {
      mySocket.emitRefusedConnection(id);
    } else {
      console.log("CANNOT FIND USER " + userId);
    }
  });

  socket.on("connection-accepted", (userId) => {
    const { id } = connected.find(({ user_id }) => user_id === userId);
    const { user_id } = connected.find(({ id }) => id === socket.id);
    if (id) {
      mySocket.emitAcceptedConnection(id, user_id);
    } else {
      console.log("CANNOT CONNECT EMIT TO USER " + userId);
    }
  });
});
