# Random Music Downloader

Downloads a random 15 second music file from https://tones.wolfram.com/generate.

## Usage

As a shell script:

```sh
npx download-random-music
```

Or in JavaScript:

```js
const fs = require("fs");
const path = require("path");
const downloadRandomMusic = require("download-random-music");

const outPath = path.join(__dirname, "random-music.mp3");
const outStream = fs.createWriteStream(outPath);
const downloadStream = await downloadRandomMusic().then((res) => res.data);
await new Promise((resolve, reject) => {
  downloadStream.pipe(outStream);
  downloadStream.on("error", (error) => {
    console.error(error);
    downloadStream.close();
    reject();
  });
  downloadStream.on("close", () => {
    console.log("Complete");
    resolve();
  });
});
```
