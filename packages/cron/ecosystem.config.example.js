module.exports = {
  apps: [
    {
      name: "ims-backup-server",
      cwd: "/Users/john/SideProjects/db-backup-service/packages/cron",
      script: "pnpm",
      exec_mode: "cluster_mode",
      instances: 1,
      args: "start",
      log_file:
        "/Users/john/SideProjects/db-backup-service/packages/cron/logs/pm2.log",
    },
  ],
};
