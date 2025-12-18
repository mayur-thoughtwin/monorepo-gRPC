import { connectDB } from "@repo/db";
import { kafkaProducer } from "@repo/kafka";
import { startGrpcServer } from "./grpc-server";

async function main() {
  await connectDB();
  
  // Connect Kafka producer for publishing events
  try {
    await kafkaProducer.connect();
    console.log("✅ Kafka producer connected");
  } catch (error) {
    console.error("❌ Failed to connect Kafka producer:", error);
    // Continue without Kafka - task creation will still work
  }

  startGrpcServer();
  console.log("==========>>>>>>Task service running...");
}

// Graceful shutdown
async function shutdown(signal: string): Promise<void> {
  console.log(`\n${signal} received. Shutting down task service...`);
  
  try {
    await kafkaProducer.disconnect();
    console.log("✅ Kafka producer disconnected");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

main();
