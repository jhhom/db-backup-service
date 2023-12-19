import { zodiosContext } from "@zodios/express";
import { GetLogResponse, logApi } from "@shared/api";
import fs from "fs";
import cors from "cors";
import { Config } from "~/config";

export function initApi(arg: { pathToLogFile: string; config: Config }) {
  const ctx = zodiosContext();

  const apiApp = ctx.app(logApi);

  apiApp.use(
    cors({
      origin: [
        "http://localhost:8010",
        "http://localhost:8000",
        "https://ims-backup.joohom.dev",
        "https://ims-backup.com",
        "http://localhost:9000",
      ],
    })
  );

  apiApp.get("/logs", function (req, res) {
    const logs = readPinoLogs(arg.pathToLogFile)
      .map((l): GetLogResponse[number] => ({
        time: l.time,
        result:
          l.backup === "success"
            ? {
                status: l.backup,
                drive: l.drive,
              }
            : {
                error: l.error,
                status: l.backup,
              },
      }))
      .sort((a, b) => b.time - a.time);
    res.json(logs);
  });

  apiApp.get("/config", function (req, res) {
    res.json({
      backupInterval: arg.config.cron.backup_interval,
      databaseName: arg.config.postgresql.database,
    });
  });

  return apiApp;
}

type LogItem = {
  level: number;
  time: number;
} & (
  | {
      backup: "success";
      drive: {
        folder: string;
        filename: string;
      };
    }
  | {
      backup: "fail";
      error: unknown;
    }
);

function readPinoLogs(file: string): LogItem[] {
  const d = fs.readFileSync(file, { encoding: "utf-8" });
  const lines = d.split(/\r?\n/);

  const logItems: LogItem[] = [];

  for (const l of lines) {
    if (l === "") {
      continue;
    }
    logItems.push(JSON.parse(l));
  }
  return logItems;
}
