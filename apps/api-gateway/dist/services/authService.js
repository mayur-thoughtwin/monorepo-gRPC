"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const userClient_1 = require("../clients/userClient");
exports.authService = {
    register: (data) => {
        return new Promise((resolve, reject) => {
            userClient_1.userClient.Register({
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role || "user",
            }, (err, response) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(response);
                }
            });
        });
    },
    login: (data) => {
        return new Promise((resolve, reject) => {
            userClient_1.userClient.Login({
                email: data.email,
                password: data.password,
            }, (err, response) => {
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
