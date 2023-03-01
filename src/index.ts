import "@total-typescript/ts-reset";

import { default as axios } from "axios";
import puppeteer from "puppeteer-core";

import { locateChrome } from "./utils";

/**
 *
 * Downloads a random 15 second music file from https://tones.wolfram.com/generate
 */
export const downloadRandomMusic = async (
  options: RandomMusicOptions = { format: "MP3" }
): Promise<import("axios").AxiosResponse<import("stream").Readable>> => {
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

  const mp3Url = urls
    .filter(Boolean)
    .find((url) => url.endsWith(options.format));

  await browser.close();

  if (!mp3Url) {
    throw new Error(`No mp3Url found`);
  }

  return axios.get(mp3Url, {
    responseType: "stream",
  });
};

type RandomMusicOptions = {
  format: "MP3" | "MIDI" | "WAV" | "FLAC";
};

export default downloadRandomMusic;
