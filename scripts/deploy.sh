cd ~/.backup/db-backup-service/packages/cron

echo "Fetching and resetting to latest changes..."
git fetch origin
git reset --hard origin/master

echo "Building..."
pnpm run build

echo "Restarting the server..."
pm2 restart ecosystem.config.js