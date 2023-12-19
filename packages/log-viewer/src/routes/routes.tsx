import {
  Outlet,
  RouterProvider,
  Link,
  Router,
  Route,
  RootRoute,
  redirect,
  useParams,
  useRouterState,
} from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { useLayoutEffect } from "react";
import { HomePage } from "~/pages/HomePage";
import { TablePage } from "~/pages/TablePage";

// Create a root route
function Root() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

const rootRoute = new RootRoute({
  component: Root,
});

export const indexRoute = new Route({
  id: "home",
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const tableRoute = new Route({
  id: "table",
  getParentRoute: () => rootRoute,
  path: "/table",
  component: TablePage,
});

// Create the route tree using your routes
export const routeTree = rootRoute.addChildren([indexRoute, tableRoute]);

export const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
