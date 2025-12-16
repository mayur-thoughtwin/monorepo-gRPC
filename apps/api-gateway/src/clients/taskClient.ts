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

export const taskClient = new TaskService(
  "localhost:8001",
  grpc.credentials.createInsecure()
);

