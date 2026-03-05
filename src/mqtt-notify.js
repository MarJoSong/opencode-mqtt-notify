export const MqttNotifyPlugin = async ({ $, directory, worktree }) => {
  const MQTT_HOST = process.env.MQTT_HOST || "localhost";
  const MQTT_PORT = process.env.MQTT_PORT || "1883";

  console.log("[mqtt-notify] Plugin initialized, MQTT:", MQTT_HOST, MQTT_PORT);

  const MQTT_TOPIC_PREFIX = "opencode";

  const sendMqttNotification = async (title, message) => {
    console.log(`[mqtt-notify] Publishing: ${MQTT_HOST}:${MQTT_PORT}, topic: opencode/${title}, message: ${message}`);
    try {
      await $`mosquitto_pub -h ${MQTT_HOST} -p ${MQTT_PORT} -t ${MQTT_TOPIC_PREFIX}/${title} -m ${message}`;
      console.log("[mqtt-notify] MQTT message sent successfully");
    } catch (error) {
      console.error("[mqtt-notify] Failed to send MQTT notification:", error);
    }
  };

  return {
    event: async ({ event }) => {
      console.log("[mqtt-notify] Received event:", event.type);

      if (event.type === "permission.asked") {
        const toolName = event.tool || "unknown";
        console.log("[mqtt-notify] Permission requested for:", toolName);
        await sendMqttNotification("permission", `OpenCode needs permission to run: ${toolName}`);
      } else if (event.type === "session.error") {
        const errorMsg = event.error?.message || event.message || "Unknown error";
        console.log("[mqtt-notify] Session error:", errorMsg);
        await sendMqttNotification("error", `An error happened: ${errorMsg}`);
      } else if (event.type === "session.idle") {
        console.log("[mqtt-notify] Session idle");
        await sendMqttNotification("session", "Your session has finished");
      } else if (event.type === "session.complete") {
        console.log("[mqtt-notify] Session complete");
        await sendMqttNotification("session", "Your session has finished");
      }
    },
  };
};