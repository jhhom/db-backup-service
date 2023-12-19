import {
  ColumnDef,
  CoreInstance,
  HeadersInstance,
  RowData,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";
import { flexRender } from "@tanstack/react-table";
import { format } from "date-fns";
import { Table } from "~/components/Table";

type Log = {
  succeed: boolean;
  time: Date;
};

const columnHelper = createColumnHelper<Log>();

const columns = [
  columnHelper.accessor("succeed", {
    id: "Status",
    cell: (info) => (info.getValue() ? "Succeed" : "Failed"),
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
];

const logs: Log[] = [
  {
    succeed: true,
    time: new Date(),
  },
];

export function TablePage() {
  return (
    <div>
      <div className="container mx-auto mt-8">
        <p>Table</p>
        <Table className="mt-4 py-2" data={logs} columns={columns} />
      </div>
    </div>
  );
}
