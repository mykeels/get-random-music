#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");

const { downloadRandomMusic } = require("./index");

const options = commandLineArgs([
  { name: "format", alias: "f", type: String, defaultValue: "MP3" },
  { name: "out", alias: "o", type: String },
  { name: "help", alias: "h", type: Boolean },
]);

const usage = commandLineUsage([
  {
    header: "Download Random Music",
    content:
      "Downloads a random 15 second music file from https://tones.wolfram.com/generate.",
  },
  {
    header: "Options",
    optionList: [
      {
        name: "format",
        alias: "f",
        typeLabel: "{underline string}",
        description:
          'The format to download the music in. Can be "MP3", "WAV", "FLAC", "MIDI"',
      },
      {
        name: "out",
        alias: "o",
        typeLabel: "{underline string}",
        description:
          'The output path to store the downloaded file. Defaults to "./random-music.mp3"',
      },
      {
        name: "help",
        alias: "h",
        description: "Print this usage guide.",
      },
    ],
  },
]);

if (options.help) {
  console.log(usage);
  process.exit(0);
}

(async () => {
  const outPath = path.resolve(
    options.out || `./random-music.${options.format.toLowerCase()}`
  );
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  console.log("Downloading Random", options.format, "Music");
  const outStream = fs.createWriteStream(outPath);
  const downloadStream = await downloadRandomMusic({
    format: options.format.toUpperCase(),
  }).then((res) => res.data);
  downloadStream.pipe(outStream);
  downloadStream.on("error", (error) => {
    console.error(error);
    downloadStream.close();
  });
  downloadStream.on("close", () =>
    console.log("Downloaded Random Music to", outPath)
  );
})();
