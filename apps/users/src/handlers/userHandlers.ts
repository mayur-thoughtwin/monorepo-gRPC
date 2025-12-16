import * as grpc from "@grpc/grpc-js";
import { userService } from "../services/userService";

export const userHandlers = {
  GetUser: async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const user = await userService.getUser({ id: call.request.id });
      callback(null, user);
    } catch (error) {
      callback(error as Error, null);
    }
  },

  Register: async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const result = await userService.register(call.request);
      callback(null, result);
    } catch (error) {
      callback(error as Error, null);
    }
  },

  Login: async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const result = await userService.login({
        email: call.request.email,
        password: call.request.password,
      });
      callback(null, result);
    } catch (error) {
      callback(error as Error, null);
    }
  },
};

