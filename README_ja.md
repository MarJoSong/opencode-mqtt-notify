# OpenCode MQTT 通知プラグイン

特定のイベントが発生したときにMQTT経由で通知を送信するOpenCodeプラグインと、クロスプラットフォームのメッセージリスナーによるデスクトップ通知を提供します。

## 機能

- 以下のイベントのMQTT通知を送信：
  - 権限リクエスト (`permission.asked`)
  - セッションエラー (`session.error`)
  - セッション終了 (`session.idle`)
  - 質問ツール起動時 (`tui.prompt.append`)
- 設定可能なコマンドによるクロスプラットフォームのデスクトップ通知
- ローカルとリモートのMQTT brokerをサポート

## 必要環境

- [OpenCode](https://opencode.ai)
- [mosquitto-clients](https://mosquitto.org) (MQTTの公開/購読に使用)
- macOS通知：`osascript`（組み込み）または`terminal-notifier`
- Linux通知：`notify-send`、`dunstify`、`kdialog`、または`zenity`

## インストール

### 1. プラグインのインストール

プラグインをOpenCodeプラグインディレクトリにコピー：
```bash
cp -r src/mqtt-notify.js ~/.config/opencode/plugins/
# またはプロジェクト固有のインストール
cp -r src/mqtt-notify.js .opencode/plugins/
```

### 2. MQTT Brokerのインストール（オプション）

**ローカルデプロイ（推奨）：**
```bash
docker run -d --name opencode-mosquitto -p 1883:1883 eclipse-mosquitto
```

**リモートbrokerを使用する場合：**
```
lic.mindopt.alibaba.net:1883
```

### 3. mosquitto-clientsのインストール

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

### 4. プラグインの設定

プロジェクトディレクトリに `.opencode/mqtt-config.json` を作成：
```json
{
  "host": "localhost",
  "port": 1883
}
```

### 5. リスナーの設定（オプション）

リスナー設定をコピーして編集：
```bash
cp listener/notify-config.example.json listener/notify-config.json
```

`listener/notify-config.json` を編集して通知コマンドをカスタマイズ：
```json
{
  "command": "osascript -e 'display notification \"$MESSAGE\" with title \"$TITLE\"'"
}
```

### 6. リスナーの起動

**方法A：直接実行：**
```bash
./listener/mqtt-listener.sh
```

**方法B：macOSサービスとして実行（LaunchAgent）：**
```bash
cp launch/com.opencode.mqtt-listener.plist ~/Library/LaunchAgents/
# plistを編集して正しいパスを設定
launchctl load ~/Library/LaunchAgents/com.opencode.mqtt-listener.plist
```

**方法C：インタラクティブセットアップ：**
```bash
./setup.sh
```

## 設定

### プラグインMQTT設定

`.opencode/mqtt-config.json` を作成：

| オプション | 説明 | デフォルト |
|------------|------|------------|
| `host` | MQTT brokerホスト名 | `localhost` |
| `port` | MQTT brokerポート | `1883` |

### リスナー通知コマンド

`listener/notify-config.json` を編集：

通知コマンドは2つのプレースホルダーをサポート：
- `$TITLE` - 通知のタイトル
- `$MESSAGE` - 通知の内容

**プラットフォーム別例：**

| プラットフォーム | コマンド |
|------------------|----------|
| macOS (osascript) | `osascript -e 'display notification "$MESSAGE" with title "$TITLE"'` |
| macOS (terminal-notifier) | `terminal-notifier -title '$TITLE' -message '$MESSAGE'` |
| Linux (notify-send) | `notify-send '$TITLE' '$MESSAGE'` |
| Linux (dunstify) | `dunstify '$TITLE' '$MESSAGE'` |
| Linux (KDE) | `kdialog --passivepopup '$MESSAGE' '$TITLE'` |
| Linux (GNOME) | `zenity --notification --text='$TITLE: $MESSAGE'` |

## プロジェクト構造

```
.
├── src/
│   └── mqtt-notify.js        # OpenCodeプラグイン
├── listener/
│   ├── mqtt-listener.sh      # MQTTリスナーと通知送信
│   ├── notify-config.json   # リスナー設定（ユーザー定義）
│   └── notify-config.example.json
├── launch/
│   └── com.opencode.mqtt-listener.plist  # macOS LaunchAgent
├── setup.sh                  # インタラクティブセットアップスクリプト
├── registry.json             # OCXレジストリメタデータ
├── LICENSE                   # MITライセンス
├── README.md
├── README_zh_CN.md
├── README_zh_TW.md
└── README_ja.md
```

## サポートしているイベント

| イベント | 説明 |
|---------|------|
| `permission.asked` | OpenCodeがツール実行の許可を必要とする時 |
| `session.error` | セッションでエラーが発生した時 |
| `session.idle` | セッションが完了した時 |
| `tui.prompt.append` | 質問ツールが起動した時 |

## ライセンス

MITライセンス - [LICENSE](LICENSE)を参照

## 著者

[songyuhua](https://github.com/songyuhua)