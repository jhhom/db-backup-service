import { describe, test } from "vitest";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

describe("backup cron", () => {
  test("format date", () => {
    const d = new Date();
    const localD = utcToZonedTime(d, "Asia/Kuala_Lumpur");
    const _d = `${format(localD, "yyyy-MM-dd")}_${format(localD, "kk-mm")}`;
    console.log(_d);
  });
});
