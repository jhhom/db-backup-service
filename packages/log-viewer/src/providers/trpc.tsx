import {
  createTRPCProxyClient,
  wsLink,
  createWSClient,
  httpBatchLink,
} from "@trpc/client";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { config } from "@config/config";
import { IAppStoreAdminRouter } from "@backend/router/router-store-admin";

const trpc = createTRPCProxyClient<IAppStoreAdminRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === "development" &&
          typeof window !== "undefined") ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    wsLink<IAppStoreAdminRouter>({
      client: createWSClient({
        url: config.SERVER_URL,
      }),
    }),
  ],
});

export default trpc;
