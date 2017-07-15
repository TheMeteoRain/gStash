### Project initialization script ###

### Applications to install and their minimum required versions
## Array: command-line name, package name, minimum wanted version
$applications = ("node", "node", "v8.0.0"), ("pm2", "pm2", "2.5.0"), ("tsc", "typescript", "2.4.1")

## Check for application availability and silenty continue without errors if not present
## Return true if application is found and false when not present
Function Check-Version {
    Param($application, $target_version, $name)
    $application_missing = $FALSE

    if (Get-Command $application -ErrorAction SilentlyContinue) {
        $current_version = & $application -v
        $application_missing = $FALSE

        if ($current_version -lt $target_version) {
            Write-Warning "["$name.ToUpper() "]Detected $current_version. Required $target_version"
        }
        else {
            Write-Host "["$name.ToUpper() "] OK - Detected $current_version. Required $target_version"
        }
    }
    else {
        Write-Warning "["$name.ToUpper() "] is missing!"
        $application_missing = $TRUE
    }

    return $application_missing
}

foreach ($application in $applications) {
    if (Check-Version $application[0] $application[2] $application[1] ) {
        Write-Host "Installing" $application[1] "..."
        switch ($application[1]) {
            "pm2" {
                npm --silent install -g $application[1]
                npm --silent install $application[1]@latest -g
                & $application[0] update
            }
            "typescript" {
                npm --silent install -g $application[1]
            }
        }
        Write-Host "Done"
        Write-Host ""
    }
    Write-Host ""
}


Write-Host "Installing npm dependencies..."
Set-Location ..

npm --silent install

Set-Location bin
Write-Host "Done"
