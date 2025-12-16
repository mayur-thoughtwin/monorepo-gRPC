"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.User = void 0;
exports.connectDB = connectDB;
exports.disconnectDB = disconnectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/monorepo-grpc";
async function connectDB() {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log("✅ MongoDB connected successfully");
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
}
async function disconnectDB() {
    try {
        await mongoose_1.default.disconnect();
        console.log("MongoDB disconnected");
    }
    catch (error) {
        console.error("MongoDB disconnection error:", error);
    }
}
// Export schemas
var schema_1 = require("./schema");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return schema_1.User; } });
Object.defineProperty(exports, "Task", { enumerable: true, get: function () { return schema_1.Task; } });
exports.default = mongoose_1.default;
