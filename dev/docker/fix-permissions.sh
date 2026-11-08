#!/bin/bash

# Ensure we are operating from the project root
cd "$(dirname "$0")/../.."

echo "Adjusting file ownership and permissions for project files..."

# Safely restore user ownership on generated directories/files
sudo chown -R $USER:$USER migrations/ package.json package-lock.json 2>/dev/null

echo "Permissions restored successfully to ($USER:$USER)"
