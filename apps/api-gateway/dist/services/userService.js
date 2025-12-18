"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const userClient_1 = require("../clients/userClient");
exports.userService = {
    getUser: (id) => {
        return new Promise((resolve, reject) => {
            userClient_1.userClient.GetUser({ id }, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    },
};
