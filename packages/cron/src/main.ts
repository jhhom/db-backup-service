import { Cron } from "croner";
import { backupPostgreSQLToFile } from "~/database/backup";
import { uploadFileToDrive } from "~/uploads/google-drive";
import pino, { Logger } from "pino";
import path from "path";

import { loadConfig } from "~/config";
import { initApi } from "~/api/api";

import { CONFIG } from "@shared/config";

function main() {
  const LOG_FILE_PATH = "logs/app.log";
  const config = loadConfig("config/config.json");

  // 1. Initialize logger
  // 2. Setup cron
  // 3. Setup API server

  // 1. Initialize logger
  // -----------------------------------------------
  const fileTransport = pino.transport({
    target: "pino/file",
    options: { destination: LOG_FILE_PATH },
  });
  const logger = pino({}, fileTransport);

  // 2. Setup cron
  // -----------------------------------------------
  const backup = initBackupService(
    logger,
    "ims",
    config.google_drive.folder_id
  );

  Cron(config.cron.backup_interval, backup);

  // 3. Setup API server
  // -----------------------------------------------
  const apiApp = initApi({ pathToLogFile: LOG_FILE_PATH, config });

  apiApp.listen(CONFIG.API_URL.port, () => {
    console.log(`⚡️ API listening at port ${CONFIG.API_URL.port}`);
  });

  console.log("⚡️ Cron started");
}

main();

function initBackupService(
  logger: Logger<string>,
  databaseName: string,
  driveFolderId: string
) {
  return async function backup() {
    try {
      const dumpFilename = backupPostgreSQLToFile(databaseName, "dumps");
      const pathToDumpfile = path.join("dumps", dumpFilename);

      const folder = await uploadFileToDrive(driveFolderId, pathToDumpfile);
      logger.info({
        backup: "success",
        drive: {
          folder: folder.folderName,
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
