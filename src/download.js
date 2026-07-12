const { spawn } = require("child_process");
const dotenv = require("dotenv");

dotenv.config({path: "../.env"});

const downloadAudio = (videoId) => {
    let fileName = ''
  return new Promise((resolve, reject) => {
    const yt = spawn(process.env.YTDLP_PATH, [
      "-o", "downloads/%(title)s.%(ext)s",
      "--print", "after_move:filepath",
      `https://youtu.be/${videoId}`
    ]);

    yt.stdout.on("data", (data) => {
        fileName += data.toString().trim();
        console.log(JSON.stringify(data.toString()))
});

    console.log(fileName)

    yt.on("close", (code) => {
      if (code === 0) {
        resolve(fileName);
      } else {
        reject(new Error("Download failed"));
      }
    });

    yt.on("error", (err) => {
      reject(err);
    });
  });


};


module.exports = downloadAudio;