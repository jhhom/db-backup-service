import { describe, test } from "vitest";
import { format } from "date-fns";

describe("backup cron", () => {
  test("format date", () => {
    const d = new Date();
    const _d = `${format(d, "yyyy-MM-dd")}_${format(d, "kk-mm")}`;
    console.log(_d);
  });
});
