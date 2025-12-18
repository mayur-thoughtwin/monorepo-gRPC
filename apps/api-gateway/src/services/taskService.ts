import { taskClient } from "../clients/taskClient";

export interface Task {
  id: string;
  title: string;
  description: string;
  author: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  author: string;
  authorName: string;
  status?: string;
}

export interface CreateTaskResponse {
  success: boolean;
  message: string;
  taskId: string;
}

export interface UpdateTaskRequest {
  id: string;
  title?: string;
  description?: string;
  status?: string;
}

export interface UpdateTaskResponse {
  success: boolean;
  message: string;
}

export interface DeleteTaskResponse {
  success: boolean;
  message: string;
}

export interface GetTasksResponse {
  tasks: Task[];
}

export const taskService = {
  createTask: (data: CreateTaskRequest): Promise<CreateTaskResponse> => {
    return new Promise((resolve, reject) => {
      taskClient.CreateTask(data, (err: any, response: CreateTaskResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  },

  getTask: (id: string): Promise<Task> => {
    return new Promise((resolve, reject) => {
      taskClient.GetTask({ id }, (err: any, data: Task) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },

  getTasksByAuthor: (authorId: string): Promise<GetTasksResponse> => {
    return new Promise((resolve, reject) => {
      taskClient.GetTasksByAuthor({ authorId }, (err: any, data: GetTasksResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },

  getAllTasks: (): Promise<GetTasksResponse> => {
    return new Promise((resolve, reject) => {
      taskClient.GetAllTasks({}, (err: any, data: GetTasksResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },

  updateTask: (data: UpdateTaskRequest): Promise<UpdateTaskResponse> => {
    return new Promise((resolve, reject) => {
      taskClient.UpdateTask(data, (err: any, response: UpdateTaskResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  },

  deleteTask: (id: string): Promise<DeleteTaskResponse> => {
    return new Promise((resolve, reject) => {
      taskClient.DeleteTask({ id }, (err: any, response: DeleteTaskResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  },
};

