import { startUserConsumer, stopUserConsumer } from "./consumers/userConsumer";
import { startTaskConsumer, stopTaskConsumer } from "./consumers/taskConsumer";
import { emailService } from "./services/emailService";

async function main(): Promise<void> {
  console.log("==========>>>>>>Notification service starting...");

  try {
    // Initialize email service
    await emailService.initialize();
    
    // Start Kafka consumers for different event types
    await startUserConsumer();
    await startTaskConsumer();

    console.log("✅ Notification service running and listening for events!");
    
    // Log configuration
    console.log("📋 Configuration:");
    console.log(`   - Using new Kafka API: ${process.env.USE_NEW_KAFKA_API === "true"}`);
    console.log(`   - Email service status: ${emailService.getStatus().ready ? "Ready" : "Not ready"}`);
    console.log(`   - Admin email: ${process.env.ADMIN_EMAIL || "admin12@yopmail.com"}`);
    console.log("📋 Active consumers:");
    console.log("   - User events consumer");
    console.log("   - Task events consumer");
  } catch (error) {
    console.error("❌ Failed to start notification service:", error);
    process.exit(1);
  }
}

// Graceful shutdown handlers
async function shutdown(signal: string): Promise<void> {
  console.log(`\n${signal} received. Shutting down notification service...`);
  
  try {
    await stopUserConsumer();
    await stopTaskConsumer();
    console.log("✅ Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught exception:", error);
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled rejection at:", promise, "reason:", reason);
});

main();
