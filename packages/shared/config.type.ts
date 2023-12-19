export type Config = {
  API_URL:
    | {
        environment: "local";
        port: number;
      }
    | {
        environment: "production";
        port: number;
        url: string;
      };
};
