#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> DurbinDash Deployment"
echo "==> Changing to project directory: $SCRIPT_DIR"
cd "$SCRIPT_DIR"

echo "==> Installing npm dependencies..."
npm install

echo "==> Copying service file to /etc/systemd/system/..."
sudo cp durbindash.service /etc/systemd/system/durbindash.service

echo "==> Reloading systemd daemon..."
sudo systemctl daemon-reload

echo "==> Enabling durbindash service..."
sudo systemctl enable durbindash

echo "==> Starting durbindash service..."
sudo systemctl start durbindash

echo "==> Deployment complete!"
echo "==> Check status with: sudo systemctl status durbindash"
