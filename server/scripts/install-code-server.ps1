$localCodeServerDir = "C:\local-code-server"

# Create the directory if it does not exist
if (!(Test-Path $localCodeServerDir)) {
    New-Item -ItemType Directory -Force -Path $localCodeServerDir | Out-Null
}

# Set npm's prefix so that global installs go to our local directory
npm config set prefix $localCodeServerDir

# Install code-server globally using the modified prefix
npm install -g code-server

# After installation, copy the executable (code-server.cmd) to our local folder if needed
$installedCommand = Join-Path $env:APPDATA "npm\node_modules\code-server\bin\code-server.cmd"
$destinationCommand = Join-Path $localCodeServerDir "code-server.cmd"

if (Test-Path $installedCommand) {
    Copy-Item -Path $installedCommand -Destination $destinationCommand -Force
} else {
    Write-Host "Warning: Could not find code-server.cmd in the npm global installation folder."
}

Write-Host "code-server installation complete in $localCodeServerDir!"