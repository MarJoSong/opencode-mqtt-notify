# OpenCode MQTT 通知插件

一个 OpenCode 插件，用于在特定事件发生时通过 MQTT 发送通知，并提供跨平台的消息监听器以发送桌面通知。

## 功能

- 通过 MQTT 发送以下事件通知：
  - 权限请求 (`permission.asked`)
  - 会话错误 (`session.error`)
  - 会话结束 (`session.idle`)
  - 问答工具调用 (`tui.prompt.append`)
- 通过可配置命令实现跨平台桌面通知
- 支持本地和远程 MQTT broker

## 环境要求

- [OpenCode](https://opencode.ai)
- [mosquitto-clients](https://mosquitto.org) (用于发布/订阅 MQTT)
- macOS 通知：`osascript`（内置）或 `terminal-notifier`
- Linux 通知：`notify-send`、`dunstify`、`kdialog` 或 `zenity`

## 安装

### 1. 安装插件

将插件复制到 OpenCode 插件目录：
```bash
cp -r src/mqtt-notify.js ~/.config/opencode/plugins/
# 或项目级别安装
cp -r src/mqtt-notify.js .opencode/plugins/
```

### 2. 安装 MQTT Broker（可选）

**本地部署（推荐）：**
```bash
docker run -d --name opencode-mosquitto -p 1883:1883 eclipse-mosquitto
```

**或使用远程 broker：**
```
lic.mindopt.alibaba.net:1883
```

### 3. 安装 mosquitto-clients

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

### 4. 配置插件

在项目目录创建 `.opencode/mqtt-config.json`：
```json
{
  "host": "localhost",
  "port": 1883
}
```

### 5. 配置监听器（可选）

复制并编辑监听器配置：
```bash
cp listener/notify-config.example.json listener/notify-config.json
```

编辑 `listener/notify-config.json` 自定义通知命令：
```json
{
  "command": "osascript -e 'display notification \"$MESSAGE\" with title \"$TITLE\"'"
}
```

### 6. 启动监听器

**方案 A：直接运行：**
```bash
./listener/mqtt-listener.sh
```

**方案 B：作为 macOS 服务运行（LaunchAgent）：**
```bash
cp launch/com.opencode.mqtt-listener.plist ~/Library/LaunchAgents/
# 编辑 plist 设置正确路径
launchctl load ~/Library/LaunchAgents/com.opencode.mqtt-listener.plist
```

**方案 C：交互式安装：**
```bash
./setup.sh
```

## 配置

### 插件 MQTT 设置

创建 `.opencode/mqtt-config.json`：

| 选项 | 描述 | 默认值 |
|------|------|--------|
| `host` | MQTT broker 主机名 | `localhost` |
| `port` | MQTT broker 端口 | `1883` |

### 监听器通知命令

编辑 `listener/notify-config.json`：

通知命令支持两个占位符：
- `$TITLE` - 通知标题
- `$MESSAGE` - 通知内容

**各平台示例：**

| 平台 | 命令 |
|------|------|
| macOS (osascript) | `osascript -e 'display notification "$MESSAGE" with title "$TITLE"'` |
| macOS (terminal-notifier) | `terminal-notifier -title '$TITLE' -message '$MESSAGE'` |
| Linux (notify-send) | `notify-send '$TITLE' '$MESSAGE'` |
| Linux (dunstify) | `dunstify '$TITLE' '$MESSAGE'` |
| Linux (KDE) | `kdialog --passivepopup '$MESSAGE' '$TITLE'` |
| Linux (GNOME) | `zenity --notification --text='$TITLE: $MESSAGE'` |

## 项目结构

```
.
├── src/
│   └── mqtt-notify.js        # OpenCode 插件
├── listener/
│   ├── mqtt-listener.sh      # MQTT 监听器与通知发送器
│   ├── notify-config.json   # 监听器配置（用户定义）
│   └── notify-config.example.json
├── launch/
│   └── com.opencode.mqtt-listener.plist  # macOS LaunchAgent
├── setup.sh                  # 交互式安装脚本
├── registry.json             # OCX 注册表元数据
├── LICENSE                   # MIT 许可证
├── README.md
├── README_zh_CN.md
├── README_zh_TW.md
└── README_ja.md
```

## 支持的事件

| 事件 | 描述 |
|------|------|
| `permission.asked` | 当 OpenCode 需要权限运行工具时 |
| `session.error` | 当会话中发生错误时 |
| `session.idle` | 当会话结束时 |
| `tui.prompt.append` | 当问答工具被调用时 |

## 许可证

MIT 许可证 - 见 [LICENSE](LICENSE)

## 作者

[songyuhua](https://github.com/songyuhua)