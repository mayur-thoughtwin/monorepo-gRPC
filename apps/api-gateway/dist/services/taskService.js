"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = void 0;
const taskClient_1 = require("../clients/taskClient");
exports.taskService = {
    createTask: (data) => {
        return new Promise((resolve, reject) => {
            taskClient_1.taskClient.CreateTask(data, (err, response) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(response);
                }
            });
        });
    },
    getTask: (id) => {
        return new Promise((resolve, reject) => {
            taskClient_1.taskClient.GetTask({ id }, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    },
    getTasksByAuthor: (authorId) => {
        return new Promise((resolve, reject) => {
            taskClient_1.taskClient.GetTasksByAuthor({ authorId }, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    },
    getAllTasks: () => {
        return new Promise((resolve, reject) => {
            taskClient_1.taskClient.GetAllTasks({}, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    },
    updateTask: (data) => {
        return new Promise((resolve, reject) => {
            taskClient_1.taskClient.UpdateTask(data, (err, response) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(response);
                }
            });
        });
    },
    deleteTask: (id) => {
        return new Promise((resolve, reject) => {
            taskClient_1.taskClient.DeleteTask({ id }, (err, response) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(response);
                }
            });
        });
    },
};
