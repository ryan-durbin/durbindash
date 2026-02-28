#!/usr/bin/env bash
set -e

SERVICE_FILE="$(dirname "$0")/../durbindash.service"
PASS=0
FAIL=0

assert_contains() {
  local desc="$1"
  local pattern="$2"
  if grep -q "$pattern" "$SERVICE_FILE"; then
    echo "  PASS: $desc"
    PASS=$((PASS + 1))
  else
    echo "  FAIL: $desc (pattern: $pattern)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== DurbinDash Service File Tests ==="

[ -f "$SERVICE_FILE" ] && echo "  PASS: service file exists" && PASS=$((PASS+1)) || { echo "  FAIL: service file missing"; FAIL=$((FAIL+1)); }

assert_contains "User=ryandurbin" "User=ryandurbin"
assert_contains "WorkingDirectory set" "WorkingDirectory=/home/ryandurbin/projects/durbindash"
assert_contains "Restart=on-failure" "Restart=on-failure"
assert_contains "RestartSec=5" "RestartSec=5"
assert_contains "ExecStart references npm start" "ExecStart=.*npm start"
assert_contains "WantedBy=multi-user.target" "WantedBy=multi-user.target"
assert_contains "Type=simple" "Type=simple"
assert_contains "After=network.target" "After=network.target"

echo ""
echo "Results: $PASS passed, $FAIL failed"
[ $FAIL -eq 0 ] && echo "All tests passed!" && exit 0 || { echo "Some tests failed!"; exit 1; }
