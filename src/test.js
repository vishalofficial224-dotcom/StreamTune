const { Innertube } = require("youtubei.js");

const youtube = async () => {
  const you = await Innertube.create();
  const results = await you.search("Believer");

  console.log(results.results[0]);
};

youtube();
