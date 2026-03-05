export const MqttNotifyPlugin = async ({ $, directory, worktree }) => {
  const MQTT_HOST = process.env.MQTT_HOST || "localhost";
  const MQTT_PORT = process.env.MQTT_PORT || "1883";

  const MQTT_TOPIC_PREFIX = "opencode";

  const sendMqttNotification = async (title, message) => {
    try {
      await $`mosquitto_pub -h ${MQTT_HOST} -p ${MQTT_PORT} -t ${MQTT_TOPIC_PREFIX}/${title} -m ${message}`;
    } catch (error) {
      console.error("[mqtt-notify] Failed to send MQTT notification:", error);
    }
  };

  return {
    event: async ({ event }) => {
      if (event.type === "permission.asked") {
        const toolName = event.tool || "unknown";
        await sendMqttNotification("permission", `OpenCode needs permission to run: ${toolName}`);
      } else if (event.type === "session.error") {
        const errorMsg = event.error?.message || event.message || "Unknown error";
        await sendMqttNotification("error", `An error happened: ${errorMsg}`);
      } else if (event.type === "session.idle") {
        await sendMqttNotification("session", "Your session has finished");
      } else if (event.type === "session.complete") {
        await sendMqttNotification("session", "Your session has finished");
      }
    },
  };
};