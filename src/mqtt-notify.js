export const MqttNotifyPlugin = async ({ $, directory, worktree }) => {
  let MQTT_HOST = "localhost";
  let MQTT_PORT = "1883";

  const loadConfig = (dir) => {
    const { existsSync, readFileSync } = require("fs");
    const configPath = `${dir}/.opencode/mqtt-config.json`;
    if (existsSync(configPath)) {
      const config = JSON.parse(readFileSync(configPath, "utf-8"));
      return { host: config.host, port: config.port };
    }
    return null;
  };

  try {
    let config = loadConfig(directory);
    if (!config) {
      const { homedir } = require("os");
      config = loadConfig(homedir() + "/.config/opencode");
    }
    if (config) {
      MQTT_HOST = config.host || MQTT_HOST;
      MQTT_PORT = String(config.port || MQTT_PORT);
    }
  } catch (error) {
    console.log("Using default MQTT config");
  }

  const MQTT_TOPIC_PREFIX = "opencode";

  const sendMqttNotification = async (title, message) => {
    try {
      await $`mosquitto_pub -h ${MQTT_HOST} -p ${MQTT_PORT} -t ${MQTT_TOPIC_PREFIX}/${title} -m ${message}`;
    } catch (error) {
      console.error("Failed to send MQTT notification:", error);
    }
  };

  return {
    "permission.asked": async ({ event }) => {
      const toolName = event.tool || "unknown";
      await sendMqttNotification("permission", `OpenCode needs permission to run: ${toolName}`);
    },

    "session.error": async ({ event }) => {
      const errorMsg = event.error?.message || event.message || "Unknown error";
      await sendMqttNotification("error", `An error happened: ${errorMsg}`);
    },

    "session.idle": async ({ event }) => {
      await sendMqttNotification("session", "Your session has finished");
    },

    "tui.prompt.append": async ({ event }) => {
      if (event.tool === "question") {
        await sendMqttNotification("question", "The question tool has been invoked");
      }
    },
  };
};