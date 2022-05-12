const { default: axios } = require("axios");
const puppeteer = require("puppeteer-core");

const { locateChrome } = require("./utils");

/**
 *
 * Downloads a random 15 second mp3 file from https://tones.wolfram.com/generate
 * @param {RandomMusicOptions} options
 * @returns {Promise<import("axios").AxiosResponse<import("stream").Stream>>}
 */
const downloadRandomMusic = async (options = { format: "MP3" }) => {
  const browser = await puppeteer.launch({
    executablePath: await locateChrome(),
  });
  const page = await browser.newPage();
  await page.goto("https://tones.wolfram.com/generate", {
    waitUntil: "networkidle2",
  });
  const urls = await page.$$eval("main>div a", (anchors) =>
    anchors.map((a) => a.getAttribute("href"))
  );

  const mp3Url = urls.find((url) => url.endsWith(options.format));

  await browser.close();

  return axios.get(mp3Url, {
    responseType: "stream",
  });
};

/**
 * @typedef {object} RandomMusicOptions
 * @property {"MP3" | "MIDI" | "WAV" | "FLAC"} [format]
 */

module.exports.downloadRandomMusic = downloadRandomMusic;
module.exports = downloadRandomMusic;
