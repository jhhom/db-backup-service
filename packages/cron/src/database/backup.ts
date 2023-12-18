import shell from "shelljs";
import path from "path";
import { format } from "date-fns";
import { gzipSync } from "zlib";
import fs from "fs";
import { Logger } from "pino";

export function backupPostgreSQLToFile(
  database: string,
  pathToDumpFolder: string,
  logger: Logger<string>
): string {
  const date = formatDate(new Date());
  const dumpFilename = `${database}-${date}`;
  const pathToDumpFile = path.join(pathToDumpFolder, dumpFilename);

  shell.exec(`pg_dump -d ${database} > ${pathToDumpFile}`);
  const dump = fs.readFileSync(pathToDumpFile, "utf-8");

  const b = gzipSync(dump);
  fs.writeFileSync(`${pathToDumpFile}.gz`, b);
  fs.rmSync(pathToDumpFile);

  return `${dumpFilename}.gz`;
}

function formatDate(d: Date): string {
  return `${format(d, "yyyy-MM-dd")}_${format(d, "kk-mm")}`;
}
