const io = require("socket.io-client");
const crypto = require("crypto");
const socket = io("http://192.168.0.7:5500", { autoConnect: false });

const userId = crypto.randomBytes(3).toString("HEX");
const myId = document.getElementById("myId");
const switcher = document.querySelector("#switcher");
const friendId = document.querySelector("#friendId");

const connect = () => {
  socket.io.opts.query = { userId };
  if (socket.disconnected) {
    socket.connect();
    myId.innerHTML = userId;
  }
};
const connectionRequest = () => {
  socket.on("connection-request", (from) => {
    console.log("CONNECTION REQUEST FROM " + from);
  });
};

const tryConnection = (from, to) => {
  socket.emit("connection-try", { from, to });
};

const disconnect = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
connect();
connectionRequest();

switcher.addEventListener("change", ({ target }) => {
  if (target.checked) {
    tryConnection(userId, friendId.value);
  }
});
