#!/usr/bin/env bash

SERVICE_FILE="$(dirname "$0")/../durbindash.service"
PASS=0
FAIL=0

assert_contains() {
  local desc="$1"
  local pattern="$2"
  if grep -q "$pattern" "$SERVICE_FILE"; then
    echo "PASS: $desc"
    PASS=$((PASS+1))
  else
    echo "FAIL: $desc (pattern: $pattern)"
    FAIL=$((FAIL+1))
  fi
}

assert_file_exists() {
  if [ -f "$SERVICE_FILE" ]; then
    echo "PASS: Service file exists"
    PASS=$((PASS+1))
  else
    echo "FAIL: Service file does not exist at $SERVICE_FILE"
    FAIL=$((FAIL+1))
  fi
}

assert_file_exists
assert_contains "User=ryandurbin" "User=ryandurbin"
assert_contains "WorkingDirectory set correctly" "WorkingDirectory=/home/ryandurbin/projects/durbindash"
assert_contains "Restart=on-failure" "Restart=on-failure"
assert_contains "RestartSec=5" "RestartSec=5"
assert_contains "ExecStart references npm start" "ExecStart=.*npm start"
assert_contains "WantedBy=multi-user.target" "WantedBy=multi-user.target"
assert_contains "Type=simple" "Type=simple"
assert_contains "After=network.target" "After=network.target"

echo ""
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
