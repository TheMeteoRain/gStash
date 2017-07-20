
#
# Starts up the node apps for local development.
#

### Stop all existing pm2 nodes ###
pm2 kill

### API
Set-Location ../api
rm package-lock.json
npm uninstall
npm install
Set-Location ..

### INDEXER
Set-Location ./indexer
rm package-lock.json
npm uninstall
npm install
Set-Location ..

### Start pm2 processes
pm2 start ecosystem.config.js

Set-Location ./bin

Write-Host "Useful pm2 commands: pm2 status, pm2 monit, pm2 logs <name>, pm2 restart <name>" -ForegroundColor "magenta"





