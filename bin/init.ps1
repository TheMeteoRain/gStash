### Project initialization script ###

### Applications to install and their minimum required versions
## Array: command-line name, package name, minimum wanted version
$applications = ("node", "node", "v8.0.0"), ("pm2", "pm2", "2.5.0"), ("tsc", "typescript", "2.3.2")

## Check for application availability and silenty continue without errors if not present
## Return true if application is found and false when not present
Function Check-Version {
  Param($application, $target_version, $name)
  $application_missing = $FALSE

  if (Get-Command $application -ErrorAction SilentlyContinue) {
    $current_version = & $application -v

    if ($current_version -lt $target_version) {
      Write-Warning "[$name] Detected $current_version. Required $target_version"
    }
    else {
      Write-Host "[$name] OK - Detected $current_version. Required $target_version" -ForegroundColor "magenta"
    }
  }
  else {
    Write-Warning "[$name] is missing!"
    $application_missing = $TRUE
  }

  return $application_missing
}

foreach ($application in $applications) {
  if (Check-Version $application[0] $application[2] $application[1] ) {
    Write-Host "Installing" $application[1] "..."
    switch ($application[1]) {
      "pm2" {
        npm install -g $application[1]
        npm install $application[1]@latest -g
        & $application[0] update
      }
      "typescript" {
        npm install -g $application[1]
      }
    }
    Write-Host "Done"
    Write-Host ""
  }
  Write-Host ""
}
