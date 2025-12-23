import * as grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path from "path";

// Path to proto file
const PROTO_PATH = path.join(__dirname, "../../../../packages/proto/user.proto");

const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user as grpc.GrpcObject;

// gRPC client
const UserService = userProto.UserService as grpc.ServiceClientConstructor;

// Use environment variable for service URL (Docker networking)
// Default to localhost for local development
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "localhost:8000";

console.log(`📡 Connecting to User Service at: ${USER_SERVICE_URL}`);

export const userClient = new UserService(
  USER_SERVICE_URL,
  grpc.credentials.createInsecure()
);
