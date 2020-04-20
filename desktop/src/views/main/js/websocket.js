const { dialog } = require("electron").remote;
const io = require("socket.io-client");
const socket = io("https://syncplayer-backend.herokuapp.com/", {
  autoConnect: false,
});

const myId = document.getElementById("myId");
const switcher = document.querySelector("#switcher");
const friendId = document.querySelector("#friendId");
const video = document.querySelector("#media-video");
const connect = () => {
  if (socket.disconnected) {
    socket.connect();
    retrieveUserId();
    retrieveConnectionStatus();
    connectionDisabled();
    userNotExists();
    mediaEvents();
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
    switcher.checked = true;
    friendId.disabled = true;
  });

  socket.on("connetion-refused", () => {
    switcher.checked = false;
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
    friendId.value = from;
    friendId.disabled = true;
    switcher.checked = true;
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
const connectionDisabled = () => {
  socket.on("connection-disconnected", () => {
    switcher.checked = false;
    friendId.disabled = false;
  });
};
const tryConnection = (from, to) => {
  socket.emit("connection-try", { from, to });
};
const userNotExists = () => {
  socket.on("connection-user-not-found", () => {
    friendId.style.setProperty("border", "2px solid #ff2b2b");
    switcher.checked = false;
  });
};
const disconnectUser = (friendId) => {
  socket.emit("connection-disconnect", friendId);
};

const mediaEvents = () => {
  socket.on("media-play", () => {
    if (video.paused) video.play();
  });
  socket.on("media-pause", () => {
    if (!video.paused) video.pause();
  });
  socket.on("media-seeking", (timeStamp) => {
    if (video.currentTime !== timeStamp) video.currentTime = timeStamp;
  });
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
    if (friendId.value.length > 0 && friendId.value !== myId.innerHTML) {
      friendId.style.setProperty("border", "none");
      tryConnection(myId.innerHTML, friendId.value);
    } else {
      friendId.style.setProperty("border", "2px solid #ff2b2b");
      target.checked = false;
    }
  } else {
    friendId.disabled = false;
    disconnectUser(friendId.value);
  }
});
