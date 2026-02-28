#!/usr/bin/env bash
# Tests for deploy.sh structure
set -e
SCRIPT="$(dirname "$0")/deploy.sh"
PASS=0
FAIL=0

assert_contains() {
    local desc="$1"
    local pattern="$2"
    if grep -q "$pattern" "$SCRIPT"; then
        echo "PASS: $desc"
        PASS=$((PASS+1))
    else
        echo "FAIL: $desc (missing: $pattern)"
        FAIL=$((FAIL+1))
    fi
}

assert_executable() {
    if [ -x "$SCRIPT" ]; then
        echo "PASS: deploy.sh is executable"
        PASS=$((PASS+1))
    else
        echo "FAIL: deploy.sh is not executable"
        FAIL=$((FAIL+1))
    fi
}

assert_file_exists() {
    if [ -f "$SCRIPT" ]; then
        echo "PASS: deploy.sh exists"
        PASS=$((PASS+1))
    else
        echo "FAIL: deploy.sh does not exist"
        FAIL=$((FAIL+1))
    fi
}

assert_file_exists
assert_executable
assert_contains "set -e present" "set -e"
assert_contains "npm install present" "npm install"
assert_contains "cp service file" "cp durbindash.service /etc/systemd/system/"
assert_contains "systemctl daemon-reload" "systemctl daemon-reload"
assert_contains "systemctl enable durbindash" "systemctl enable durbindash"
assert_contains "systemctl start durbindash" "systemctl start durbindash"

echo ""
echo "Results: $PASS passed, $FAIL failed"
[ $FAIL -eq 0 ] && exit 0 || exit 1
