import locate from "locate-chrome";

export const locateChrome = async (): Promise<string> => {
  const executablePath =
    process.env.CHROME_EXECUTABLE_PATH || (await locate());

  if (!executablePath) {
    throw new Error(
      "cannot find chrome executable path ... please specify CHROME_EXECUTABLE_PATH env variable"
    );
  }

  return executablePath;
};
