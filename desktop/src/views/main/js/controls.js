const play_pause = document.querySelector("#play-pause");
const currentTime = document.querySelector("#currentTime");
const progress = document.querySelector("#progress");
const media = document.querySelector("#media-video");
const minimize_maximize = document.querySelector("#maximize-minimize");
const containerVideo = document.getElementById("video-container");
const volume = document.getElementById("volumebar");
const volumeIndicator = document.getElementById("volumeIndicator");
const controls = document.querySelector(".player-controls");

const handlePause = (e) => {
  e.preventDefault();
  if (video.paused) {
    socket.emit("media-play", friendId.value);
    video.play();
    //play_pause.setAttribute("src", "./assets/pause-circle.svg");
  } else {
    socket.emit("media-pause", friendId.value);
    video.pause();
    //play_pause.setAttribute("src", "./assets/play-circle.svg");
  }
};
const fullscreen = (e) => {
  e.preventDefault();
  if (isVideoInFullscreen()) {
    minimize_maximize.setAttribute("src", "./assets/maximize.svg");
    document.webkitExitFullscreen();
  } else {
    minimize_maximize.setAttribute("src", "./assets/minimize.svg");
    containerVideo.webkitRequestFullScreen();
  }
};
video.addEventListener("click", handlePause);
play_pause.addEventListener("click", handlePause);
video.addEventListener("pause", () => {
  play_pause.setAttribute("src", "./assets/play-circle.svg");
});
video.addEventListener("play", () => {
  play_pause.setAttribute("src", "./assets/pause-circle.svg");
});
video.addEventListener("dblclick", fullscreen);
minimize_maximize.addEventListener("click", fullscreen);

media.addEventListener("durationchange", ({ target }) => {
  totalTime.innerHTML = parseSeconds(target.duration);
});

media.addEventListener("timeupdate", ({ target }) => {
  currentTime.innerHTML = parseSeconds(target.currentTime);
  const percent = target.currentTime / target.duration;
  progress.value = percent ? percent : 0;
});
progress.addEventListener("click", seek);
function seek(event) {
  const percent = event.offsetX / this.offsetWidth;
  media.currentTime = percent * media.duration;
  progress.value = percent / 100;

  socket.emit("media-seeking", {
    timeStamp: media.currentTime,
    id: friendId.value,
  });
}
function parseSeconds(seconds) {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
}

function debounce(func, wait) {
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(func, wait);
  };
}

const muteVolume = (e) => {
  e.preventDefault();
  if (video.volume !== 0) {
    volume.value = 0;
    video.volume = 0;
    volumeIndicator.setAttribute("src", "./assets/volume-x.svg");
  } else {
    volume.value = 1;
    video.volume = 1;
    volumeIndicator.setAttribute("src", "./assets/volume-2.svg");
  }
};
volumeIndicator.addEventListener("click", muteVolume);
volume.addEventListener("change", ({ target }) => {
  video.volume = target.value;
  if (target.value == 0) {
    volumeIndicator.setAttribute("src", "./assets/volume-x.svg");
  } else if (target.value > 0 && target.value <= 0.2) {
    volumeIndicator.setAttribute("src", "./assets/volume.svg");
  } else if (target.value > 0.2 && target.value <= 0.5) {
    volumeIndicator.setAttribute("src", "./assets/volume-1.svg");
  } else {
    volumeIndicator.setAttribute("src", "./assets/volume-2.svg");
  }
});
