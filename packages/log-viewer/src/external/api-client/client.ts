import superjson from "superjson";
import { wsLink, createWSClient, createTRPCProxyClient } from "@trpc/client";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { fromPromise, ok, err } from "neverthrow";

import { AppError, type AppErrorUnion } from "@api-contract/errors";
import type { Unsubscribable } from "@trpc/server/observable";

import type { IAppRouter } from "@backend/router/router";

import { config } from "@config/config";

import { RouterError } from "@backend/router/error-formatter";
import { ServiceInput, ServiceSyncResult } from "@api-contract/types";
import { IAppStoreAdminRouter } from "@backend/router/router-store-admin";
import { IStoreAdminClient } from "@api-contract/client";
import { StoreAdminSubscriptionEventPayload } from "@api-contract/subscription";

export class Client implements IStoreAdminClient {
  #trpc: ReturnType<typeof createTRPCProxyClient<IAppStoreAdminRouter>>;
  #subscription: Unsubscribable | undefined;
  #socketListeners: {
    [k in keyof StoreAdminSubscriptionEventPayload]: Map<
      number,
      (arg: StoreAdminSubscriptionEventPayload[k]) => void
    >;
  };

  constructor() {
    this.#trpc = createTRPCProxyClient<IAppStoreAdminRouter>({
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === "development" &&
              typeof window !== "undefined") ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        wsLink<IAppRouter>({
          client: createWSClient({
            url: config.SERVER_URL,
          }),
        }),
      ],
    });
    this.#socketListeners = {
      dummy: new Map(),
    };
  }

  addListener<T extends keyof StoreAdminSubscriptionEventPayload>(
    event: T,
    listener: (payload: StoreAdminSubscriptionEventPayload[T]) => void,
  ) {
    const min = Math.ceil(1);
    const max = Math.floor(10_000);
    let uniqueRandomInt = Math.floor(Math.random() * (max - min + 1)) + min;

    while (this.#socketListeners[event].has(uniqueRandomInt)) {
      uniqueRandomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.#socketListeners[event].set(uniqueRandomInt, listener);

    if (this.#socketListeners[event].size > 100) {
      throw new Error(
        "Number of listeners exceeded maximum numer of listeners, which is 100",
      );
    }

    return uniqueRandomInt;
  }

  removeListener(
    event: keyof StoreAdminSubscriptionEventPayload,
    listenerId: number,
  ) {
    this.#socketListeners[event].delete(listenerId);
  }

  resetListeners() {
    this.#socketListeners = {
      dummy: new Map(),
    };
  }

  #runListener<T extends keyof StoreAdminSubscriptionEventPayload>(
    event: T,
    payload: StoreAdminSubscriptionEventPayload[T],
  ) {
    for (const listener of this.#socketListeners[event].values()) {
      listener(payload);
    }
  }

  #fromApiPromise<T>(promise: Promise<T>) {
    return fromPromise(promise, (e) => e as RouterError).mapErr(
      (e) =>
        new AppError(e.data.details.type, e.data.details.info) as AppErrorUnion,
    );
  }

  async ["admin/get_taxon_tree"]() {
    return this.#fromApiPromise(
      this.#trpc["store_admin/get_taxon_tree"].query(),
    );
  }

  async ["admin/get_one_taxon"](args: ServiceInput<"admin/get_one_taxon">) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/get_one_taxon"].query(args),
    );
  }

  async ["admin/list_product_options"](
    args: ServiceInput<"admin/list_product_options">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/list_product_options"].query(args),
    );
  }

  async ["admin/create_product_option"](
    args: ServiceInput<"admin/create_product_option">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/create_product_option"].mutate(args),
    );
  }

  async ["admin/create_taxon"](args: ServiceInput<"admin/create_taxon">) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/create_taxon"].mutate(args),
    );
  }

  async ["admin/edit_taxon"](args: ServiceInput<"admin/edit_taxon">) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/edit_taxon"].mutate(args),
    );
  }

  async ["admin/delete_taxon"](args: ServiceInput<"admin/delete_taxon">) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/delete_taxon"].mutate(args),
    );
  }

  async ["admin/get_available_taxon_parents"]() {
    return this.#fromApiPromise(
      this.#trpc["store_admin/get_available_taxon_parents"].query(),
    );
  }

  async ["admin/get_product_option_for_edit"](
    args: ServiceInput<"admin/get_product_option_for_edit">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/get_product_option_for_edit"].query(args),
    );
  }

  async ["admin/list_products"](args: ServiceInput<"admin/list_products">) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/list_products"].query(args),
    );
  }

  async ["admin/get_one_product"](args: ServiceInput<"admin/get_one_product">) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/get_one_product"].query(args),
    );
  }

  async ["admin/edit_product_option"](
    args: ServiceInput<"admin/edit_product_option">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/edit_product_option"].mutate(args),
    );
  }

  async ["admin/delete_product_option_value"](
    args: ServiceInput<"admin/delete_product_option_value">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/delete_product_option_value"].mutate(args),
    );
  }

  async ["admin/create_simple_product"](
    args: ServiceInput<"admin/create_simple_product">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/create_simple_product"].mutate(args),
    );
  }

  async ["admin/create_product_variant"](
    args: ServiceInput<"admin/create_product_variant">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/create_product_variant"].mutate(args),
    );
  }

  async ["admin/edit_product_variant"](
    args: ServiceInput<"admin/edit_product_variant">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/edit_product_variant"].mutate(args),
    );
  }

  async ["admin/create_configurable_product"](
    args: ServiceInput<"admin/create_configurable_product">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/create_configurable_product"].mutate(args),
    );
  }

  async ["admin/edit_simple_product"](
    args: ServiceInput<"admin/edit_simple_product">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/edit_simple_product"].mutate(args),
    );
  }

  async ["admin/edit_configurable_product"](
    args: ServiceInput<"admin/edit_configurable_product">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/edit_configurable_product"].mutate(args),
    );
  }

  async ["admin/get_product_configurable_options"](
    args: ServiceInput<"admin/get_product_configurable_options">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/get_product_configurable_options"].query(args),
    );
  }

  async ["admin/list_product_variants"](
    args: ServiceInput<"admin/list_product_variants">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/list_product_variants"].query(args),
    );
  }

  async ["admin/get_product_variant_for_edit"](
    args: ServiceInput<"admin/get_product_variant_for_edit">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/get_product_variant_for_edit"].query(args),
    );
  }

  async ["admin/generate_product_variants"](
    args: ServiceInput<"admin/generate_product_variants">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/generate_product_variants"].query(args),
    );
  }

  async ["admin/save_generated_product_variants"](
    args: ServiceInput<"admin/save_generated_product_variants">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/save_generated_product_variants"].mutate(args),
    );
  }

  async ["admin/check_taxon_slug_uniqueness"](
    args: ServiceInput<"admin/check_taxon_slug_uniqueness">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/check_taxon_slug_uniqueness"].query(args),
    );
  }

  async ["admin/generate_unique_taxon_slug"](
    args: ServiceInput<"admin/generate_unique_taxon_slug">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/generate_unique_taxon_slug"].query(args),
    );
  }

  async ["admin/list_orders"](args: ServiceInput<"admin/list_orders">) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/list_orders"].query(args),
    );
  }

  async ["admin/get_one_order"](args: ServiceInput<"admin/get_one_order">) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/get_one_order"].query(args),
    );
  }

  async ["admin/list_customers"](args: ServiceInput<"admin/list_customers">) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/list_customers"].query(args),
    );
  }

  async ["admin/update_item_shipment_status"](
    args: ServiceInput<"admin/update_item_shipment_status">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/update_item_shipment_status"].mutate(args),
    );
  }

  async ["admin/list_product_association_types"](
    args: ServiceInput<"admin/list_product_association_types">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/list_product_association_types"].query(args),
    );
  }

  async ["admin/create_product_association_type"](
    args: ServiceInput<"admin/create_product_association_type">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/create_product_association_type"].mutate(args),
    );
  }

  async ["admin/edit_product_association_type"](
    args: ServiceInput<"admin/edit_product_association_type">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/edit_product_association_type"].mutate(args),
    );
  }

  async ["admin/delete_product_association_type"](
    args: ServiceInput<"admin/delete_product_association_type">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/delete_product_association_type"].mutate(args),
    );
  }

  async ["admin/get_one_product_association_type"](
    args: ServiceInput<"admin/get_one_product_association_type">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/get_one_product_association_type"].query(args),
    );
  }

  async ["admin/cancel_order"](args: ServiceInput<"admin/cancel_order">) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/cancel_order"].mutate(args),
    );
  }

  async ["admin/delete_product"](args: ServiceInput<"admin/delete_product">) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/delete_product"].mutate(args),
    );
  }

  async ["admin/delete_products"](args: ServiceInput<"admin/delete_products">) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/delete_products"].mutate(args),
    );
  }

  async ["admin/delete_product_variant"](
    args: ServiceInput<"admin/delete_product_variant">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/delete_product_variant"].mutate(args),
    );
  }

  async ["admin/get_breadcrumb_title_of_route_parameter"](
    args: ServiceInput<"admin/get_breadcrumb_title_of_route_parameter">,
  ) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/get_breadcrumb_title_of_route_parameter"].query(
        args,
      ),
    );
  }

  async ["admin/dashboard"](args: ServiceInput<"admin/dashboard">) {
    return this.#fromApiPromise(
      this.#trpc["store_admin/dashboard"].query(args),
    );
  }

  async ["admin/dashboard_new_data"]() {
    return this.#fromApiPromise(
      this.#trpc["store_admin/dashboard_new_data"].query(),
    );
  }
}

export const client = new Client();
