import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fsPromise = fs.promises;

export const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromise.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromise.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

export const logger = (req, res, next) => {
  logEvents(
    `${req?.method}\t${req?.url}\t${req?.headers.origin}`,
    "reqLog.log"
  );
  // console.log(`${req?.method} ${req?.path}`);
  next();
};
