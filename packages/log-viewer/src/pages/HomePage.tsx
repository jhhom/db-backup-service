import { Zodios } from "@zodios/core";
import z from "zod";
import { logApi } from "@shared/api";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { Table } from "~/components/Table";

import { CONFIG } from "@shared/config";

const apiClient = new Zodios(
  CONFIG.API_URL.environment === "local"
    ? `http://localhost:${CONFIG.API_URL.port}`
    : CONFIG.API_URL.url,
  logApi,
);

type Log = { time: Date } & {
  succeed: boolean;
  data:
    | {
        succeed: true;
        folder: string;
        name: string;
      }
    | {
        succeed: false;
        error: unknown;
      };
};

const columnHelper = createColumnHelper<Log>();

const columns = [
  columnHelper.accessor("succeed", {
    id: "Status",
    cell: (info) =>
      info.getValue() ? (
        <span className="rounded-md border border-green-500 bg-green-100 px-2 py-1.5">
          Succeed
        </span>
      ) : (
        <span className="rounded-md border border-red-400 bg-red-100 px-2 py-1.5">
          Failed
        </span>
      ),
    header: () => <span>Status</span>,
  }),
  columnHelper.accessor("time", {
    id: "Time",
    cell: (info) => {
      const t = info.getValue();
      return `${format(t, "yyyy-MM-dd")}-${format(t, "kk:mm")}`;
    },
    header: () => <span>Time</span>,
  }),
  columnHelper.accessor("data", {
    id: "Data",
    cell: (info) => {
      const d = info.getValue();
      if (d.succeed) {
        return (
          <div>
            Dumped at:{" "}
            <code className="rounded-md border border-gray-400 bg-gray-100 px-1 py-0.5">{`${d.folder}/${d.name}`}</code>
          </div>
        );
      } else {
        return JSON.stringify(d.error);
      }
    },
  }),
];

export function HomePage() {
  const logsQuery = useQuery({
    queryKey: ["logs"],
    queryFn: () => apiClient.getLogs(),
  });

  const configQuery = useQuery({
    queryKey: ["config"],
    queryFn: () => apiClient.getConfig(),
  });

  return (
    <div>
      <h2 className="container mx-auto mt-8 text-2xl">
        Periodic PostgreSQL Backups
      </h2>
      <div className="container mx-auto mt-8">
        <div>
          Backing up database:{" "}
          <code className="rounded-md border border-gray-400 bg-gray-100 px-1 py-0.5">
            {configQuery.data?.databaseName}
          </code>
        </div>
        <div className="mt-2">
          At cron interval:&nbsp;&nbsp;{" "}
          <pre className="mt-1 rounded-md border border-gray-400 bg-gray-100 px-1 py-0.5">
            {configQuery.data?.backupInterval}
          </pre>
        </div>
        <p className="mt-6">Past backups performed:</p>
        <Table
          className="mt-4 py-2"
          data={
            logsQuery.data
              ? logsQuery.data.map((d): Log => {
                  if (d.result.status === "success") {
                    return {
                      succeed: true,
                      data: {
                        succeed: true,
                        folder: d.result.drive.folder,
                        name: d.result.drive.filename,
                      },
                      time: new Date(d.time),
                    };
                  } else {
                    return {
                      succeed: false,
                      data: {
                        succeed: false,
                        error: d.result.error,
                      },
                      time: new Date(d.time),
                    };
                  }
                })
              : []
          }
          columns={columns}
        />
      </div>
    </div>
  );
}
