import {
  Outlet,
  RouterProvider,
  Link,
  Router,
  Route,
  RootRoute,
  redirect,
} from "@tanstack/react-router";
import QueryProvider from "~/providers/query";
import { router } from "~/routes/routes";

import { RowData } from "@tanstack/react-table";

import "./markdown-content.css";

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
