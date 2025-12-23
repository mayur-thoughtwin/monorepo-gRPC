import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { userHandlers } from "./handlers/userHandlers";

const PROTO_PATH = path.join(__dirname, "../../../packages/proto/user.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;

const userPackage = grpcObj.user;

// Use environment variable for port (Docker compatibility)
// Default to 8000 for local development
const GRPC_PORT = process.env.GRPC_PORT || "8000";

export function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(userPackage.UserService.service, userHandlers);

  // Bind to 0.0.0.0 to accept connections from any network interface (required for Docker)
  server.bindAsync(
    `0.0.0.0:${GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("❌ Failed to start gRPC server:", err);
        return;
      }
      console.log(`✅ gRPC User Service running on port ${port}`);
    }
  );
}
