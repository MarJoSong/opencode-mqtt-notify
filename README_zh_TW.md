# OpenCode MQTT 通知外掛

一個 OpenCode 外掛，用於在特定事件發生時透過 MQTT 發送通知，並提供跨平台的消息監聽器以發送桌面通知。

## 功能

- 透過 MQTT 發送以下事件通知：
  - 權限請求 (`permission.asked`)
  - 會話錯誤 (`session.error`)
  - 會話結束 (`session.idle`)
  - 問答工具調用 (`tui.prompt.append`)
- 透過可配置命令實現跨平台桌面通知
- 支援本地和遠端 MQTT broker

## 環境要求

- [OpenCode](https://opencode.ai)
- [mosquitto-clients](https://mosquitto.org) (用於發布/訂閱 MQTT)
- macOS 通知：`osascript`（內建）或 `terminal-notifier`
- Linux 通知：`notify-send`、`dunstify`、`kdialog` 或 `zenity`

## 安裝

### 1. 安裝外掛

將外掛複製到 OpenCode 外掛目錄：
```bash
cp -r src/mqtt-notify.js ~/.config/opencode/plugins/
# 或專案級別安裝
cp -r src/mqtt-notify.js .opencode/plugins/
```

### 2. 安裝 MQTT Broker（可選）

**本地部署（推薦）：**
```bash
docker run -d --name opencode-mosquitto -p 1883:1883 eclipse-mosquitto
```

**或使用遠端 broker：**
```
lic.mindopt.alibaba.net:1883
```

### 3. 安裝 mosquitto-clients

**macOS：**
```bash
brew install mosquitto
```

**Linux (Ubuntu/Debian)：**
```bash
sudo apt install mosquitto-clients
```

**Linux (Arch)：**
```bash
sudo pacman -S mosquitto
```

### 4. 配置外掛

在專案目錄建立 `.opencode/mqtt-config.json`：
```json
{
  "host": "localhost",
  "port": 1883
}
```

### 5. 配置監聽器（可選）

複製並編輯監聽器配置：
```bash
cp listener/notify-config.example.json listener/notify-config.json
```

編輯 `listener/notify-config.json` 自定義通知命令：
```json
{
  "command": "osascript -e 'display notification \"$MESSAGE\" with title \"$TITLE\"'"
}
```

### 6. 啟動監聽器

**方案 A：直接執行：**
```bash
./listener/mqtt-listener.sh
```

**方案 B：作為 macOS 服務執行（LaunchAgent）：**
```bash
cp launch/com.opencode.mqtt-listener.plist ~/Library/LaunchAgents/
# 編輯 plist 設定正確路徑
launchctl load ~/Library/LaunchAgents/com.opencode.mqtt-listener.plist
```

**方案 C：互動式安裝：**
```bash
./setup.sh
```

## 配置

### 外掛 MQTT 設定

建立 `.opencode/mqtt-config.json`：

| 選項 | 描述 | 預設值 |
|------|------|--------|
| `host` | MQTT broker 主機名 | `localhost` |
| `port` | MQTT broker 連接埠 | `1883` |

### 監聽器通知命令

編輯 `listener/notify-config.json`：

通知命令支援兩個預留位置：
- `$TITLE` - 通知標題
- `$MESSAGE` - 通知內容

**各平台範例：**

| 平台 | 命令 |
|------|------|
| macOS (osascript) | `osascript -e 'display notification "$MESSAGE" with title "$TITLE"'` |
| macOS (terminal-notifier) | `terminal-notifier -title '$TITLE' -message '$MESSAGE'` |
| Linux (notify-send) | `notify-send '$TITLE' '$MESSAGE'` |
| Linux (dunstify) | `dunstify '$TITLE' '$MESSAGE'` |
| Linux (KDE) | `kdialog --passivepopup '$MESSAGE' '$TITLE'` |
| Linux (GNOME) | `zenity --notification --text='$TITLE: $MESSAGE'` |

## 專案結構

```
.
├── src/
│   └── mqtt-notify.js        # OpenCode 外掛
├── listener/
│   ├── mqtt-listener.sh      # MQTT 監聽器與通知發送器
│   ├── notify-config.json   # 監聽器設定（使用者定義）
│   └── notify-config.example.json
├── launch/
│   └── com.opencode.mqtt-listener.plist  # macOS LaunchAgent
├── setup.sh                  # 互動式安裝腳本
├── registry.json             # OCX 註冊表元數據
├── LICENSE                   # MIT 授權
├── README.md
├── README_zh_CN.md
├── README_zh_TW.md
└── README_ja.md
```

## 支援的事件

| 事件 | 描述 |
|------|------|
| `permission.asked` | 當 OpenCode 需要權限執行工具時 |
| `session.error` | 當會話中發生錯誤時 |
| `session.idle` | 當會話結束時 |
| `tui.prompt.append` | 當問答工具被呼叫時 |

## 授權

MIT 授權 - 見 [LICENSE](LICENSE)

## 作者

[songyuhua](https://github.com/songyuhua)