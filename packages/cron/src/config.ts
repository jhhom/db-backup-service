import { z } from "zod";
import fs from "fs";
import process from "process";
import path from "path";

const zConfig = z.object({
  postgresql: z.object({
    database: z.string().min(1),
  }),
  cron: z.object({
    backup_interval: z.string().min(1),
  }),
  google_drive: z.object({
    folder_id: z.string().min(1),
  }),
});

export type Config = z.infer<typeof zConfig>;

/**
 *
 * @param pathToConfig Path to the config file relative to the root of this package
 * @returns
 */
export function loadConfig(pathToConfig: string) {
  const filePath = path.join(process.cwd(), pathToConfig);
  const content = fs.readFileSync(filePath, { encoding: "utf-8" });
  const config = zConfig.parse(JSON.parse(content));
  return config;
}
