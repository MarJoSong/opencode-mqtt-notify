# opencode-mqtt-notify

MQTT-based notifications for OpenCode - send notifications via MQTT broker when events occur.

## Quick Start

1. **Install MQTT broker**:
```bash
docker run -d --name opencode-mqtt -p 0.0.0.0:1883:1883 eclipse-mosquitto mosquitto -c /mosquitto-no-auth.conf
```

2. **Copy plugin** to OpenCode:
```bash
mkdir -p ~/.config/opencode/plugins/
cp src/mqtt-notify.js ~/.config/opencode/plugins/
```

3. **Run listener**:
```bash
./mqtt-listener.sh &
```

Done. You'll get notified when:
- OpenCode needs permission to run something
- Your session finishes
- An error happens
- The question tool pops up

## Configuration

### Environment Variables

Both plugin and listener use environment variables:

```bash
export MQTT_HOST=localhost
export MQTT_PORT=1883
```

### Notification Command

Override the notification command:

```bash
# macOS (osascript - built-in)
export NOTIFY_COMMAND="osascript -e 'display notification \"\$MESSAGE\" with title \"\$TITLE\"'"

# macOS (terminal-notifier)
export NOTIFY_COMMAND="terminal-notifier -title '\$TITLE' -message '\$MESSAGE'"

# Linux (notify-send)
export NOTIFY_COMMAND="notify-send '\$TITLE' '\$MESSAGE'"

# Linux (dunstify)
export NOTIFY_COMMAND="dunstify '\$TITLE' '\$MESSAGE'"

# Linux (KDE)
export NOTIFY_COMMAND="kdialog --passivepopup '\$MESSAGE' '\$TITLE'"
```

## Requirements

- [OpenCode](https://opencode.ai)
- mosquitto-clients (`brew install mosquitto` on macOS)
- For notifications: `osascript` (macOS), `notify-send` (Linux)

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