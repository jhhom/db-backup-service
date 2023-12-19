import { z } from "zod";
import { makeApi, makeErrors } from "@zodios/core";

export type GetLogResponse = z.infer<typeof zGetLogResponse>;

export const zGetLogResponse = z.array(
  z.object({
    time: z.number(),
    result: z.discriminatedUnion("status", [
      z.object({
        status: z.literal("success"),
        drive: z.object({
          folder: z.string(),
          filename: z.string(),
        }),
      }),
      z.object({ status: z.literal("fail"), error: z.unknown() }),
    ]),
  })
);

export const logApi = makeApi([
  {
    method: "get",
    path: "/logs",
    alias: "getLogs",
    description: "Get logs",
    response: zGetLogResponse,
  },
  {
    method: "get",
    path: "/config",
    alias: "getConfig",
    description: "Get config",
    response: z.object({
      backupInterval: z.string(),
      databaseName: z.string(),
    }),
  },
]);
