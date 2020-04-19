const { dialog } = require("electron").remote;
const io = require("socket.io-client");
const socket = io("http://192.168.0.7:5500", { autoConnect: false });

const myId = document.getElementById("myId");
const switcher = document.querySelector("#switcher");
const friendId = document.querySelector("#friendId");

const connect = () => {
  if (socket.disconnected) {
    socket.connect();
    retrieveUserId();
    retrieveConnectionStatus();
  }
};
const retrieveUserId = () => {
  socket.on("new-id", (id) => {
    myId.innerHTML = id;
  });
};

const retrieveConnectionStatus = () => {
  socket.on("connetion-accepted", (id) => {
    console.log("CONNECTED TO " + id);
  });

  socket.on("connetion-refused", () => {
    console.log("CONNECTION REFUSED");
  });
};

const emitAcceptedConnection = (acceptedId) => {
  socket.emit("connection-accepted", acceptedId);
};

const emitRefusedConnection = (refusedId) => {
  socket.emit("connection-refused", refusedId);
};

const connectionRequestDialog = async (from) => {
  const options = {
    title: "Connection request",
    type: "info",
    message: `The user ${from} wants to connect to you. Do you want to accept it?`,
    buttons: ["Accept", "Cancel"],
  };
  const { response } = await dialog.showMessageBox(options);
  if (response === 0) {
    emitAcceptedConnection(from);
  } else {
    emitRefusedConnection(from);
  }
};

const connectionRequest = () => {
  socket.on("connection-request", (from) => {
    connectionRequestDialog(from);
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
    tryConnection(myId.innerHTML, friendId.value);
  }
});
