const downloadAudio = require('./download.js');

(async () => {
    console.log('starting...');
    await downloadAudio("beliver");
    console.log("finished");
})();


