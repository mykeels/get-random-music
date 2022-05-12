const { downloadRandomMusic } = require("./src");

(async () => {
  const fs = require("fs");
  const path = require("path");

  const outStream = fs.createWriteStream(path.join(__dirname, "random.mp3"));
  const downloadStream = await downloadRandomMusic().then((res) => res.data);
  downloadStream.pipe(outStream);
  downloadStream.on("error", (error) => {
    console.error(error);
    downloadStream.close();
  });
  downloadStream.on("close", () => console.log("Complete"));
})();
