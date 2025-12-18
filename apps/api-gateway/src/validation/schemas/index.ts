// User schemas
export {
  registerSchema,
  loginSchema,
  getUserParamsSchema,
  UserRole,
  type UserRoleType,
  type RegisterInput,
  type LoginInput,
  type GetUserParamsInput,
} from "./user.schema";

// Task schemas
export {
  createTaskSchema,
  updateTaskSchema,
  getTaskParamsSchema,
  deleteTaskParamsSchema,
  TaskStatus,
  type TaskStatusType,
  type CreateTaskInput,
  type UpdateTaskInput,
  type GetTaskParamsInput,
} from "./task.schema";

