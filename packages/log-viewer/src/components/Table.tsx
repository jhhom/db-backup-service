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

export function Table<TData extends RowData>({
  data,
  columns,
  className,
}: {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  className?: string;
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table
      className={twMerge(
        "w-full divide-y divide-gray-300 border border-gray-300",
        className,
      )}
    >
      <thead className="bg-white text-left text-sm font-semibold text-gray-900">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className={twMerge(
                  "border-r border-gray-300 py-3.5 pl-4",
                  header.column.columnDef.meta?.headerProps?.className,
                )}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td
                className={twMerge(
                  "whitespace-nowrap border-r border-gray-300 py-2.5 pl-4 text-sm font-medium  text-gray-900",
                  cell.column.columnDef.meta?.cellProps?.className,
                )}
                key={cell.id}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
