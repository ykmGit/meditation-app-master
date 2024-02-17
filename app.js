const song = document.querySelector(".song");
const play = document.querySelector(".play");
const replay = document.querySelector(".replay");
const outline = document.querySelector(".moving-outline circle");
const video = document.querySelector(".vid-container video");
//Sounds
const sounds = document.querySelectorAll(".sound-picker button");
//Time Display
const timeDisplay = document.querySelector(".time-display");
//時間経過円の全周の長さ（1359.759765625）
const outlineLength = outline.getTotalLength();
//Duration
const timeSelect = document.querySelectorAll(".time-select button");
let fakeDuration = 600;

// 経過時間のアニメーション
outline.style.strokeDashoffset = outlineLength;
outline.style.strokeDasharray = outlineLength;
timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${('00' + Math.floor(fakeDuration % 60)).slice(-2)}`;

sounds.forEach(sound => {
  sound.addEventListener("click", function () {
    song.src = this.getAttribute("data-sound");
    video.src = this.getAttribute("data-video");
    checkPlaying(song);
  });
});

play.addEventListener("click", function () {
  checkPlaying(song);
});

replay.addEventListener("click", function () {
  restartSong(song);

});


const restartSong = song => {
  // let currentTime = song.currentTime;
  song.currentTime = 0;
  console.log("ciao")

}

timeSelect.forEach(option => {
  option.addEventListener("click", function () {
    fakeDuration = this.getAttribute("data-time");
    timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${('00' + Math.floor(fakeDuration % 60)).slice(-2)}`;
  });
});

// 曲、動画が止まっていたら再生。再生されていたら停止
const checkPlaying = song => {
  if (song.paused) {
    song.play();
    video.play();
    play.src = "./svg/pause.svg";
  } else {
    song.pause();
    video.pause();
    play.src = "./svg/play.svg";
  }
};

song.ontimeupdate = function () {
  //.currentTimeでvideo要素の現在の再生時間を取得できる
  let currentTime = song.currentTime;
  //例：600（fakeDuration）-7.695571（currentTime）
  let elapsed = fakeDuration - currentTime;
  //余りが経過残時間になる
  let seconds = Math.round(elapsed % 60);
  //経過時間
  let minutes = Math.floor(elapsed / 60);

  if (seconds == 60) {
    seconds = 59; //端数があって60秒が表示されてしまう
  }
  //残りの再生時間 0:00
  timeDisplay.textContent = `${minutes}:${('0' + seconds).slice(-2)}`;
  //円周の進んだ長さ計算
  //例：1342.3195525928159
  let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
  //時間経過のアニメーションに進んだ長さをセットする
  //例：全周（1359.759765625）から「1342.3195525928159」進んだ
  outline.style.strokeDashoffset = progress;

  //時間になったら停止する
  if (currentTime >= fakeDuration) {
    song.pause();
    song.currentTime = 0;
    play.src = "./svg/play.svg";
    video.pause();
  }
};
