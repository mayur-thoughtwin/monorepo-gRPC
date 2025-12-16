import { connectDB } from "@repo/db";
import { startGrpcServer } from "./grpc-server";

async function main() {
  await connectDB();
  startGrpcServer();
  console.log("==========>>>>>>Task service running...");
}

main();
