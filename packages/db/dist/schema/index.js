"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.User = void 0;
var userSchema_1 = require("./userSchema");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(userSchema_1).default; } });
var taskSchema_1 = require("./taskSchema");
Object.defineProperty(exports, "Task", { enumerable: true, get: function () { return __importDefault(taskSchema_1).default; } });
