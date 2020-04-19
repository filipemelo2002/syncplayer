const app = require("http").createServer(() => {
  console.log("Server is running");
});
const io = require("socket.io")(app);

const connected = [];
const connectionInstances = [];

const port = process.env.PORT || 5500;
app.listen(port);

io.on("connection", (socket) => {
  connected.push({
    id: socket.id,
    user_id: socket.handshake.query.userId,
  });

  socket.on("connection-try", (connection) => {
    const { from, to } = connection;
    const requestTo = connected.find((socket) => socket.user_id === to);
    if (requestTo) {
      console.log(requestTo);
      socket.to(requestTo.id).emit("connection-request", from);
    } else {
      console.log("user not found");
    }
  });
});
