# OpenCode MQTT Notification Plugin

A plugin for OpenCode that sends notifications via MQTT when specific events occur, with a cross-platform message listener for desktop notifications.

## Features

- Sends MQTT notifications for:
  - Permission requests (`permission.asked`)
  - Session errors (`session.error`)
  - Session completion (`session.idle`)
  - Question tool invocations (`tui.prompt.append`)
- Cross-platform desktop notifications via configurable command
- Supports local and remote MQTT brokers

## Requirements

- [OpenCode](https://opencode.ai)
- [mosquitto-clients](https://mosquitto.org) (for publishing/subscribing to MQTT)
- For macOS notifications: `osascript` (built-in) or `terminal-notifier`
- For Linux notifications: `notify-send`, `dunstify`, `kdialog`, or `zenity`

## Installation

### Step 1: Install mosquitto-clients

This plugin requires `mosquitto_pub` to send MQTT messages.

**macOS:**
```bash
brew install mosquitto
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install mosquitto-clients
```

**Linux (Arch):**
```bash
sudo pacman -S mosquitto
```

### Step 2: Install MQTT Broker (Optional)

**Option A - Local Deployment (Recommended):**
```bash
docker run -d --name opencode-mosquitto -p 1883:1883 eclipse-mosquitto
```

**Option B - Use Remote Broker:**
Set host to `lic.mindopt.alibaba.net` in plugin config (see Step 4).

### Step 3: Install the Plugin

Copy the plugin file to your OpenCode plugins directory:

**For all projects (global):**
```bash
mkdir -p ~/.config/opencode/plugins/
cp src/mqtt-notify.js ~/.config/opencode/plugins/
```

**Or for a specific project only:**
```bash
mkdir -p .opencode/plugins/
cp src/mqtt-notify.js .opencode/plugins/
```

### Step 4: Configure the Plugin

Create `mqtt-config.json` with MQTT broker settings:

**Option A - Global (all projects):**
```bash
mkdir -p ~/.config/opencode
```
Create file `~/.config/opencode/mqtt-config.json`:
```json
{
  "host": "localhost",
  "port": 1883
}
```

**Option B - Project-specific:**
```bash
mkdir -p .opencode
```
Create file `.opencode/mqtt-config.json`:
```json
{
  "host": "localhost",
  "port": 1883
}
```

**Configuration options:**
| Option | Description | Default |
|--------|-------------|---------|
| `host` | MQTT broker hostname | `localhost` |
| `port` | MQTT broker port | `1883` |

**For remote broker**, change `host` to:
```json
{
  "host": "lic.mindopt.alibaba.net",
  "port": 1883
}
```

### Step 5: Configure the Listener (Optional)

The listener reads from MQTT and sends desktop notifications. If not configured, it uses macOS `osascript` by default.

**For Linux or custom notifications:**

Copy the example config:
```bash
cp listener/notify-config.example.json listener/notify-config.json
```

Edit `listener/notify-config.json`:
```json
{
  "command": "notify-send '$TITLE' '$MESSAGE'"
}
```

Available placeholders:
- `$TITLE` - Notification title
- `$MESSAGE` - Notification message

**Platform examples:**
| Platform | Command |
|----------|---------|
| macOS (osascript) | `osascript -e 'display notification "$MESSAGE" with title "$TITLE"'` |
| Linux (notify-send) | `notify-send '$TITLE' '$MESSAGE'` |
| Linux (dunstify) | `dunstify '$TITLE' '$MESSAGE'` |

### Step 6: Start the Listener

Run the listener in background:
```bash
./listener/mqtt-listener.sh &
```

Or use interactive setup:
```bash
./setup.sh
```

## Configuration

### Plugin MQTT Settings

Create `.opencode/mqtt-config.json`:

| Option | Description | Default |
|--------|-------------|---------|
| `host` | MQTT broker hostname | `localhost` |
| `port` | MQTT broker port | `1883` |

### Listener Notification Command

Edit `listener/notify-config.json`:

The notify command supports two placeholders:
- `$TITLE` - Notification title
- `$MESSAGE` - Notification message

**Platform Examples:**

| Platform | Command |
|----------|---------|
| macOS (osascript) | `osascript -e 'display notification "$MESSAGE" with title "$TITLE"'` |
| macOS (terminal-notifier) | `terminal-notifier -title '$TITLE' -message '$MESSAGE'` |
| Linux (notify-send) | `notify-send '$TITLE' '$MESSAGE'` |
| Linux (dunstify) | `dunstify '$TITLE' '$MESSAGE'` |
| Linux (KDE) | `kdialog --passivepopup '$MESSAGE' '$TITLE'` |
| Linux (GNOME) | `zenity --notification --text='$TITLE: $MESSAGE'` |

## Project Structure

```
.
├── src/
│   └── mqtt-notify.js                       # OpenCode plugin
├── listener/
│   ├── mqtt-listener.sh                     # Message listener & notification sender
│   ├── notify-config.json                   # Listener config (create from example)
│   └── notify-config.example.json           # Example listener config
├── setup.sh                                  # Interactive setup script
├── LICENSE                                   # MIT License
└── README.md
```

## How It Works

1. **OpenCode Plugin** (`src/mqtt-notify.js`) - Sends MQTT messages when events occur
2. **MQTT Broker** - Routes messages between plugin and listener
3. **Listener** (`listener/mqtt-listener.sh`) - Receives MQTT messages and shows desktop notifications

```
[OpenCode] --mosquitto_pub--> [MQTT Broker] --mosquitto_sub-- [Listener] --osascript--> [Desktop Notification]
```

## Supported Events

| Event | Description |
|-------|-------------|
| `permission.asked` | When OpenCode needs permission to run a tool |
| `session.error` | When an error occurs in the session |
| `session.idle` | When the session finishes |
| `tui.prompt.append` | When the question tool is invoked |

## License

MIT License - see [LICENSE](LICENSE)

## Author

[songyuhua](https://github.com/songyuhua)