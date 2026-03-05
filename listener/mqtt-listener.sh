#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

MQTT_HOST="${MQTT_HOST:-localhost}"
MQTT_PORT="${MQTT_PORT:-1883}"
MQTT_TOPIC="opencode/#"
CONFIG_FILE="${SCRIPT_DIR}/notify-config.json"

NOTIFY_COMMAND="osascript -e 'display notification \"\$MESSAGE\" with title \"\$TITLE\"'"

if [ -f "$CONFIG_FILE" ] && command -v jq &> /dev/null; then
    COMMAND=$(jq -r '.command // empty' "$CONFIG_FILE" 2>/dev/null)
    if [ -n "$COMMAND" ]; then
        NOTIFY_COMMAND="$COMMAND"
    fi
fi

send_notification() {
    local title="$1"
    local message="$2"
    local cmd="$NOTIFY_COMMAND"
    cmd="${cmd//\$TITLE/$title}"
    cmd="${cmd//\$MESSAGE/$message}"
    eval "$cmd"
}

cleanup() {
    echo "Stopping MQTT listener..."
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "Starting MQTT listener for OpenCode notifications..."
echo "Listening on ${MQTT_HOST}:${MQTT_PORT} for topic: ${MQTT_TOPIC}"
echo "Using notify command: $NOTIFY_COMMAND"

mosquitto_sub -h "$MQTT_HOST" -p "$MQTT_PORT" -t "$MQTT_TOPIC" -v | while read -r topic message; do
    case "$topic" in
        opencode/permission)
            send_notification "OpenCode Permission" "$message"
            ;;
        opencode/error)
            send_notification "OpenCode Error" "$message"
            ;;
        opencode/session)
            send_notification "OpenCode Session" "$message"
            ;;
        opencode/question)
            send_notification "OpenCode Question" "$message"
            ;;
        *)
            send_notification "OpenCode" "$message"
            ;;
    esac
done
