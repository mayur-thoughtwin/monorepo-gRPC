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

export const userClient = new UserService(
  "localhost:8000",
  grpc.credentials.createInsecure()
);

