# opencode-mqtt-notify

MQTT-based notifications for OpenCode - send notifications via MQTT broker when events occur.

## Quick Start

1. **Install MQTT broker**:
```bash
docker run -d --name opencode-mqtt -p 0.0.0.0:1883:1883 eclipse-mosquitto mosquitto -c /mosquitto-no-auth.conf
```

> **Note:** The `-p 0.0.0.0:1883:1883` flag binds the broker to all network interfaces, allowing remote connections. Use `-p 1883:1883` for local-only access.

2. **Copy plugin** to OpenCode:
```bash
mkdir -p ~/.config/opencode/plugins/
cp src/mqtt-notify.js ~/.config/opencode/plugins/
```

3. **Configure** MQTT settings:
```bash
mkdir -p ~/.config/opencode
echo '{"host": "localhost", "port": 1883}' > ~/.config/opencode/mqtt-config.json
```

4. **Run listener**:
```bash
./listener/mqtt-listener.sh &
```

Done. You'll get notified when:
- OpenCode needs permission to run something
- Your session finishes
- An error happens
- The question tool pops up

## What It Does

This plugin sends MQTT messages when OpenCode events occur. A listener script receives these messages and displays desktop notifications.

```
[OpenCode] → MQTT Broker → [Listener] → Desktop Notification
```

## Requirements

- [OpenCode](https://opencode.ai)
- mosquitto-clients (`brew install mosquitto` on macOS)
- For notifications: `osascript` (macOS), `notify-send` (Linux)

## Configuration

### Environment Variables

Both plugin and listener use environment variables:

```bash
# MQTT broker
export MQTT_HOST=localhost
export MQTT_PORT=1883

# Notification command (listener only)
export NOTIFY_COMMAND="osascript -e 'display notification \"\$MESSAGE\" with title \"\$TITLE\"'"
```

**Options:**
- `MQTT_HOST` - MQTT broker hostname (default: localhost)
- `MQTT_PORT` - MQTT broker port (default: 1883)
- `NOTIFY_COMMAND` - Notification command with `$TITLE` and `$MESSAGE` placeholders

### Listener Config (Optional)

The listener sends desktop notifications. Copy the example config:
```bash
cp listener/notify-config.example.json listener/notify-config.json
```

Edit `listener/notify-config.json` to customize notification command:

```json
{
  "command": "osascript -e 'display notification \"$MESSAGE\" with title \"$TITLE\"'"
}
```

Placeholders: `$TITLE`, `$MESSAGE`

**Platform examples:**
| Platform | Command |
|----------|---------|
| macOS | `osascript -e 'display notification "$MESSAGE" with title "$TITLE"'` |
| Linux | `notify-send '$TITLE' '$MESSAGE'` |
| Linux (dunstify) | `dunstify '$TITLE' '$MESSAGE'` |

## Setup by Platform

**macOS:**
```bash
brew install mosquitto
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install mosquitto-clients libnotify-bin
```

**Linux (Arch):**
```bash
sudo pacman -S mosquitto libnotify
```

## Troubleshooting

**Not receiving notifications?**

1. Check MQTT broker is running:
```bash
mosquitto_sub -t 'opencode/#' -v
```

2. Check listener is running:
```bash
ps aux | grep mqtt-listener
```

3. For Linux, install notification tools:
```bash
sudo apt install libnotify-bin  # Ubuntu/Debian
```

## License

MIT