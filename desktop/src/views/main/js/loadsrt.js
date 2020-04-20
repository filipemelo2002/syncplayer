const srt2vtt = require("srt-to-vtt");
const fs = require("fs");
const captions = document.querySelector("#captions");
const caption = document.querySelector("#caption");
const loadAndConvertSRT = async () => {
  const { filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Subtitles", extensions: ["srt", "vtt"] }],
    properties: ["openFile"],
  });

  if (filePaths.length > 0) {
    const extension = path.extname(filePaths[0]).replace(/(\.)/, "");
    if (extension === "srt") {
      console.log("CONVERTING");
      await fs
        .createReadStream(path.normalize(filePaths[0]))
        .pipe(srt2vtt())
        .pipe(
          fs.createWriteStream(
            path.normalize(filePaths[0].replace(/(\.srt)/, ".vtt"))
          )
        )
        .on("finish", () => {
          caption.setAttribute(
            "src",
            "file:///" +
              filePaths[0].replace(/\\/g, "/").replace(/(\.srt)/, ".vtt")
          );
        });
    } else {
      console.log("LOADING");
      caption.setAttribute(
        "src",
        "file:///" + filePaths[0].replace(/\\/g, "/")
      );
    }
  }
};

captions.addEventListener("click", () => loadAndConvertSRT());
