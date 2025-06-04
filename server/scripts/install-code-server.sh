curl -fsSL https://code-server.dev/install.sh | sh

# Define the absolute projects directory path
PROJECT_DIR="$HOME/projects"

# Create the projects directory if it doesn't exist
mkdir -p "$PROJECT_DIR"

# Set permissions: owner has read, write, execute; group and others have read and execute
chmod -R 755 "$PROJECT_DIR"

# Ensure the current user is the owner of the directory to prevent any permission issues
chown -R "$(whoami):$(whoami)" "$PROJECT_DIR"

echo "code-server installation and setup complete!"