import { RouterProvider } from "@tanstack/react-router";
import { router } from "~/routes/routes";

import { RowData } from "@tanstack/react-table";

import "./markdown-content.css";
import QueryProvider from "~/providers/query";

// Create the router using your route tree
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    headerProps?: {
      className?: string;
    };
    cellProps?: {
      className?: string;
    };
  }
}

const App = () => {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
};

export default App;
