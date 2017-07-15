### 
Set-Location ..

### Stop all existing pm2 nodes ###
pm2 kill

###
pm2 start ecosystem.config.js

Write-Host "Useful pm2 commands: pm2 monit, pm2 logs <name>, pm2 restart <name>"

Set-Location bin



