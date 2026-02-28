#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[deploy] Starting DurbinDash deployment..."

echo "[deploy] Changing to project directory: $SCRIPT_DIR"
cd "$SCRIPT_DIR"

echo "[deploy] Installing npm dependencies..."
npm install

echo "[deploy] Copying service file to /etc/systemd/system/..."
sudo cp durbindash.service /etc/systemd/system/durbindash.service

echo "[deploy] Reloading systemd daemon..."
sudo systemctl daemon-reload

echo "[deploy] Enabling durbindash service..."
sudo systemctl enable durbindash

echo "[deploy] Starting durbindash service..."
sudo systemctl start durbindash

echo "[deploy] Deployment complete! DurbinDash is running."
echo "[deploy] Check status with: sudo systemctl status durbindash"
