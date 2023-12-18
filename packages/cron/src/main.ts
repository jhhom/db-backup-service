import { Cron } from "croner";
import { backupPostgreSQLToFile } from "~/database/backup";
import { uploadFileToDrive } from "~/uploads/google-drive";
import pino, { Logger } from "pino";
import path from "path";

import { zodiosContext } from "@zodios/express";
import { logApi } from "@shared/api";
import readline from "readline";
import fs from "fs";
import z from "zod";

const ctx = zodiosContext();

function initBackup(logger: Logger<string>) {
  return function backup() {
    try {
      const dumpFilename = backupPostgreSQLToFile("ims", "dumps", logger);

      uploadFileToDrive(path.join("dumps", dumpFilename));
      logger.info({
        backup: "success",
        drive: {
          folder: "dumps",
          filename: dumpFilename,
        },
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        logger.error({
          backup: "fail",
          error: e.message,
        });
      } else {
        logger.error({
          backup: "fail",
          error: JSON.stringify(e),
        });
      }
    }
  };
}

function readPinoLogs(file: string) {
  const insteam = fs.createReadStream(file, { encoding: "utf-8" });

  const rl = readline.createInterface({
    input: insteam,
  });

  rl.on("line", function (line) {
    console.log(JSON.parse(line));
  });
}

function readPinoLogs2(file: string) {
  const d = fs.readFileSync(file, { encoding: "utf-8" });
  const lines = d.split(/\r?\n/);

  for (const l of lines) {
    if (l === "") {
      continue;
    }
    console.log(JSON.parse(l));
  }
}

function main() {
  const apiApp = ctx.app(logApi);

  const fileTransport = pino.transport({
    target: "pino/file",
    options: { destination: `logs/app.log` },
  });
  const logger = pino({}, fileTransport);

  const backup = initBackup(logger);

  const job = Cron("*/1 * * * *", backup);

  console.log("⚡️ Cron started");

  apiApp.get("/logs", function (req, res) {});

  apiApp.listen(8000, () => {
    console.log("⚡️ API listening at port 8000");
  });
}

function main2() {
  readPinoLogs2("logs/app.log");
}

// main();

main2();
