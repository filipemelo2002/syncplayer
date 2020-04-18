const path = require("path");
const { remote } = require("electron");
const { Menu } = remote;

const menuoptions = require(path.resolve(__dirname, "js", "actions.js"));

const menu = Menu.buildFromTemplate(menuoptions);
Menu.setApplicationMenu(menu);

const Video = document.getElementById("media-video");

function isVideoInFullscreen() {
  if (
    document.fullscreenElement &&
    document.fullscreenElement.nodeName == "VIDEO"
  ) {
    return true;
  }
  return false;
}

Video.addEventListener("webkitfullscreenchange", function ({ target }) {
  isVideoInFullscreen()
    ? Menu.setApplicationMenu(null)
    : Menu.setApplicationMenu(menu);
});
