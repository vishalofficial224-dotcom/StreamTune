const buttons = (songs) => {
  return songs
    .filter((song) => song.videoId)
    .map((song) => [
      {
        text: song.name,
        callback_data: song.videoId,
      },
    ]);
};

module.exports = buttons;
