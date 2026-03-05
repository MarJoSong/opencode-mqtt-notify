#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== OpenCode MQTT Notification Setup ==="
echo ""
echo "Select deployment option:"
echo "1) Local Mosquitto (recommended)"
echo "2) Remote server (lic.mindopt.alibaba.net)"
read -p "Enter option [1]: " choice
choice="${choice:-1}"

if [ "$choice" = "1" ]; then
    echo ""
    echo "=== Starting local Mosquitto ==="
    
    if ! command -v docker &> /dev/null; then
        echo "Error: Docker not installed"
        exit 1
    fi
    
    echo "Starting Mosquitto container..."
    docker run -d --name opencode-mqtt -p 0.0.0.0:1883:1883 eclipse-mosquitto mosquitto -c /mosquitto-no-auth.conf
    
    export MQTT_HOST=localhost
    export MQTT_PORT=1883
    
    echo "Local Mosquitto started at localhost:1883"
else
    echo ""
    echo "Using remote server: lic.mindopt.alibaba.net"
    export MQTT_HOST=lic.mindopt.alibaba.net
    export MQTT_PORT=1883
fi

echo ""
echo "=== Starting MQTT Listener Service ==="
echo ""

osascript -e 'display notification "OpenCode notification service started" with title "OpenCode"'

exec "${SCRIPT_DIR}/mqtt-listener.sh"