import { z } from "zod";
import { makeApi, makeErrors } from "@zodios/core";

export const logApi = makeApi([
  {
    method: "get",
    path: "/logs",
    alias: "getLogs",
    description: "Get logs",
    response: z.object({
      time: z.number(),
      result: z.discriminatedUnion("status", [
        z.object({
          status: z.literal("success"),
          drive: z.object({
            folder: z.string(),
            filename: z.string(),
          }),
        }),
        z.object({ status: z.literal("fail"), error: z.string() }),
      ]),
    }),
  },
]);
