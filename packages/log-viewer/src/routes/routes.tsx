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
import QueryProvider from "~/providers/query";
import { useLayoutEffect } from "react";
import { HomePage } from "~/pages/HomePage";

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

// Create the route tree using your routes
export const routeTree = rootRoute.addChildren([indexRoute]);

export const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
