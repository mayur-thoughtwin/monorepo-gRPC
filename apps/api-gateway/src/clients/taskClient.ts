import * as grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path from "path";

// Path to proto file
const PROTO_PATH = path.join(__dirname, "../../../../packages/proto/task.proto");

const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const taskProto = grpc.loadPackageDefinition(packageDefinition).task as grpc.GrpcObject;

// gRPC client
const TaskService = taskProto.TaskService as grpc.ServiceClientConstructor;

// Use environment variable for service URL (Docker networking)
// Default to localhost for local development
const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL || "localhost:8001";

console.log(`📡 Connecting to Task Service at: ${TASK_SERVICE_URL}`);

export const taskClient = new TaskService(
  TASK_SERVICE_URL,
  grpc.credentials.createInsecure()
);
