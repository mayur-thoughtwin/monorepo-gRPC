import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { taskHandlers } from "./handlers/taskHandlers";

const PROTO_PATH = path.join(__dirname, "../../../packages/proto/task.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;

const taskPackage = grpcObj.task;

export function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(taskPackage.TaskService.service, taskHandlers);

  server.bindAsync(
    "0.0.0.0:8001",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Failed to start gRPC server:", err);
        return;
      }
      console.log(`gRPC Task Service running on port ${port}`);
    }
  );
}
