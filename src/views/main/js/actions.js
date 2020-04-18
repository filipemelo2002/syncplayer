const { remote } = require("electron");
const { dialog } = remote;
const path = require("path");

const label = document.querySelector("#label");
const source = document.getElementById("media-video");
const video = document.getElementById("video");

const click = async () => {
  const { filePaths } = await dialog.showOpenDialog({
    filters: [
      { name: "Movies", extensions: ["mkv", "avi", "mp4", "webm", "ogg"] },
      { name: "All Files", extensions: ["*"] },
    ],
    properties: ["openFile"],
  });

  if (filePaths.length > 0) {
    const name = path.basename(filePaths[0]);
    const extension = path.extname(filePaths[0]).replace(/(\.)/, "");

    label.innerHTML = name;
    video.type = `video/${extension}`;
    const sanitizedPath = filePaths[0].replace(/\\/g, "/");
    video.src = `file:///${sanitizedPath}`;
    source.load();
  }
};
module.exports = [
  {
    label: "Open",
    click,
  },
  {
    label: "Exit",
    role: "quit",
  },
];
