const { spawn } = require("child_process");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const downloadAudio = (videoId) => {
  const fileName = `downloads/${videoId}.mp4`;
  return new Promise((resolve, reject) => {
    const yt = spawn(process.env.YTDLP_PATH, [
      "-o",
      fileName,
      "--print",
      "after_move:filepath",
      "--print",
      "title",
      `https://youtu.be/${videoId}`,
    ]);

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
