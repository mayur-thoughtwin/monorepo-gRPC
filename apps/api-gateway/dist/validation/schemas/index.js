"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatus = exports.deleteTaskParamsSchema = exports.getTaskParamsSchema = exports.updateTaskSchema = exports.createTaskSchema = exports.UserRole = exports.getUserParamsSchema = exports.loginSchema = exports.registerSchema = void 0;
// User schemas
var user_schema_1 = require("./user.schema");
Object.defineProperty(exports, "registerSchema", { enumerable: true, get: function () { return user_schema_1.registerSchema; } });
Object.defineProperty(exports, "loginSchema", { enumerable: true, get: function () { return user_schema_1.loginSchema; } });
Object.defineProperty(exports, "getUserParamsSchema", { enumerable: true, get: function () { return user_schema_1.getUserParamsSchema; } });
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return user_schema_1.UserRole; } });
// Task schemas
var task_schema_1 = require("./task.schema");
Object.defineProperty(exports, "createTaskSchema", { enumerable: true, get: function () { return task_schema_1.createTaskSchema; } });
Object.defineProperty(exports, "updateTaskSchema", { enumerable: true, get: function () { return task_schema_1.updateTaskSchema; } });
Object.defineProperty(exports, "getTaskParamsSchema", { enumerable: true, get: function () { return task_schema_1.getTaskParamsSchema; } });
Object.defineProperty(exports, "deleteTaskParamsSchema", { enumerable: true, get: function () { return task_schema_1.deleteTaskParamsSchema; } });
Object.defineProperty(exports, "TaskStatus", { enumerable: true, get: function () { return task_schema_1.TaskStatus; } });
