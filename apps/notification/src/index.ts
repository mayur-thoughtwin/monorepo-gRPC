import { startUserConsumer, stopUserConsumer } from "./consumers/userConsumer";

async function main(): Promise<void> {
  console.log("==========>>>>>>Notification service starting...");
  
  try {
    // Start Kafka consumer for user events
    await startUserConsumer();
    
    console.log("✅ Notification service running and listening for events!");
  } catch (error) {
    console.error("❌ Failed to start notification service:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down notification service...");
  await stopUserConsumer();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down notification service...");
  await stopUserConsumer();
  process.exit(0);
});

main();
