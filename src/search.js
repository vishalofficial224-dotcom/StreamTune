const YTMusic = require('ytmusic-api');
const ytmusic = new YTMusic();

const init = async () => {
   await ytmusic.initialize();
};

const search = async (query) => {
    const songs = await ytmusic.search(query);
    return songs
};


module.exports = {init, search};