import { Task } from "@repo/db";

export type TaskStatus = "pending" | "inprogress" | "completed";

export interface ITask {
  id: string;
  title: string;
  description: string;
  author: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  author: string;
  status: TaskStatus;
}

export interface GetTaskRequest {
  id: string;
}

export interface GetTasksByAuthorRequest {
  authorId: string;
}

export interface UpdateTaskRequest {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface DeleteTaskRequest {
  id: string;
}

export const taskService = {
  createTask: async (request: CreateTaskRequest) => {
    const newTask = new Task({
      title: request.title,
      description: request.description,
      author: request.author,
      status: request.status || "pending",
    });

    await newTask.save();

    return {
      success: true,
      message: "Task created successfully",
      taskId: newTask._id.toString(),
    };
  },

  getTask: async (request: GetTaskRequest): Promise<ITask> => {
    const task = await Task.findById(request.id);
    if (!task) {
      throw new Error("Task not found");
    }
    return {
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      author: task.author.toString(),
      status: task.status,
      createdAt: task.createdAt?.toISOString() || "",
      updatedAt: task.updatedAt?.toISOString() || "",
    };
  },

  getTasksByAuthor: async (request: GetTasksByAuthorRequest) => {
    const tasks = await Task.find({ author: request.authorId });
    return {
      tasks: tasks.map((task) => ({
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        author: task.author.toString(),
        status: task.status,
        createdAt: task.createdAt?.toISOString() || "",
        updatedAt: task.updatedAt?.toISOString() || "",
      })),
    };
  },

  getAllTasks: async () => {
    const tasks = await Task.find();
    return {
      tasks: tasks.map((task) => ({
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        author: task.author.toString(),
        status: task.status,
        createdAt: task.createdAt?.toISOString() || "",
        updatedAt: task.updatedAt?.toISOString() || "",
      })),
    };
  },

  updateTask: async (request: UpdateTaskRequest) => {
    const task = await Task.findById(request.id);
    if (!task) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    if (request.title) task.title = request.title;
    if (request.description) task.description = request.description;
    if (request.status) task.status = request.status;

    await task.save();

    return {
      success: true,
      message: "Task updated successfully",
    };
  },

  deleteTask: async (request: DeleteTaskRequest) => {
    const task = await Task.findByIdAndDelete(request.id);
    if (!task) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    return {
      success: true,
      message: "Task deleted successfully",
    };
  },
};

