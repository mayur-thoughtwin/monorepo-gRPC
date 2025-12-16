import * as grpc from "@grpc/grpc-js";
import { taskService } from "../services/taskService";

export const taskHandlers = {
  CreateTask: async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const result = await taskService.createTask(call.request);
      callback(null, result);
    } catch (error) {
      callback(error as Error, null);
    }
  },

  GetTask: async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const task = await taskService.getTask({ id: call.request.id });
      callback(null, task);
    } catch (error) {
      callback(error as Error, null);
    }
  },

  GetTasksByAuthor: async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const result = await taskService.getTasksByAuthor({
        authorId: call.request.authorId,
      });
      callback(null, result);
    } catch (error) {
      callback(error as Error, null);
    }
  },

  GetAllTasks: async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const result = await taskService.getAllTasks();
      callback(null, result);
    } catch (error) {
      callback(error as Error, null);
    }
  },

  UpdateTask: async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const result = await taskService.updateTask(call.request);
      callback(null, result);
    } catch (error) {
      callback(error as Error, null);
    }
  },

  DeleteTask: async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const result = await taskService.deleteTask({ id: call.request.id });
      callback(null, result);
    } catch (error) {
      callback(error as Error, null);
    }
  },
};

