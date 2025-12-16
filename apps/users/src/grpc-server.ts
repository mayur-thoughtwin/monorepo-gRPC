import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { userHandlers } from "./handlers/userHandlers";

const PROTO_PATH = path.join(__dirname, "../../../packages/proto/user.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;

const userPackage = grpcObj.user;

export function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(userPackage.UserService.service, userHandlers);

  server.bindAsync(
    "0.0.0.0:8000",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Failed to start gRPC server:", err);
        return;
      }
      console.log(`gRPC User Service running on port ${port}`);
    }
  );
}
