# opencode-mqtt-notify

基于 MQTT 的 OpenCode 通知插件 - 当事件发生时通过 MQTT 发送通知。

## 快速开始

1. **安装 MQTT broker**（或使用远程服务）：
```bash
docker run -d -p 1883:1883 eclipse-mosquitto
```

2. **复制插件**到 OpenCode：
```bash
mkdir -p ~/.config/opencode/plugins/
cp src/mqtt-notify.js ~/.config/opencode/plugins/
```

3. **配置** MQTT 设置：
```bash
mkdir -p ~/.config/opencode
echo '{"host": "localhost", "port": 1883}' > ~/.config/opencode/mqtt-config.json
```

4. **运行监听器**：
```bash
./listener/mqtt-listener.sh &
```

完成。当以下情况发生时你会收到通知：
- OpenCode 需要权限运行某些操作
- 你的会话结束
- 发生错误
- 问答工具被调用

## 工作原理

当 OpenCode 事件发生时，插件发送 MQTT 消息。监听器接收这些消息并显示桌面通知。

```
[OpenCode] → MQTT Broker → [监听器] → 桌面通知
```

## 环境要求

- [OpenCode](https://opencode.ai)
- mosquitto-clients（macOS 上用 `brew install mosquitto`）
- 通知工具：macOS 用 `osascript`，Linux 用 `notify-send`

## 配置

### 插件配置

创建 `~/.config/opencode/mqtt-config.json`：

```json
{
  "host": "localhost",
  "port": 1883
}
```

**选项：**
- `host` - MQTT broker 主机名（默认：localhost）
- `port` - MQTT broker 端口（默认：1883）

### 监听器配置（可选）

监听器发送桌面通知。复制示例配置：
```bash
cp listener/notify-config.example.json listener/notify-config.json
```

编辑 `listener/notify-config.json` 自定义通知命令：

```json
{
  "command": "osascript -e 'display notification \"$MESSAGE\" with title \"$TITLE\"'"
}
```

占位符：`$TITLE`、`$MESSAGE`

**各平台示例：**
| 平台 | 命令 |
|------|------|
| macOS | `osascript -e 'display notification "$MESSAGE" with title "$TITLE"'` |
| Linux | `notify-send '$TITLE' '$MESSAGE'` |
| Linux (dunstify) | `dunstify '$TITLE' '$MESSAGE'` |

## 各平台安装

**macOS：**
```bash
brew install mosquitto
```

**Linux (Ubuntu/Debian)：**
```bash
sudo apt install mosquitto-clients libnotify-bin
```

**Linux (Arch)：**
```bash
sudo pacman -S mosquitto libnotify
```

## 故障排除

**收不到通知？**

1. 检查 MQTT broker 是否运行：
```bash
mosquitto_sub -t 'opencode/#' -v
```

2. 检查监听器是否运行：
```bash
ps aux | grep mqtt-listener
```

3. 对于 Linux，安装通知工具：
```bash
sudo apt install libnotify-bin  # Ubuntu/Debian
```

## 许可证

MIT