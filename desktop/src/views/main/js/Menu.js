const path = require("path");
const { remote } = require("electron");
const { Menu } = remote;

const menuoptions = require(path.resolve(__dirname, "js", "actions.js"));

const menu = Menu.buildFromTemplate(menuoptions);
Menu.setApplicationMenu(menu);

const VideoContiner = document.getElementById("video-container");

function isVideoInFullscreen() {
  if (
    document.fullscreenElement &&
    document.fullscreenElement.nodeName == "DIV"
  ) {
    return true;
  }
  return false;
}

VideoContiner.addEventListener("webkitfullscreenchange", function ({ target }) {
  isVideoInFullscreen()
    ? Menu.setApplicationMenu(null)
    : Menu.setApplicationMenu(menu);
});
