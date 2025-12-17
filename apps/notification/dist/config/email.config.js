"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getEmailConfig = () => {
    const user = process.env.EMAIL_USER;
    const password = process.env.EMAIL_PASS;
    if (!user || !password) {
        console.warn("⚠️ Email credentials not found in environment variables");
    }
    return {
        service: process.env.EMAIL_SERVICE || "gmail",
        user: user || "",
        password: password || "",
        fromName: process.env.EMAIL_FROM_NAME || "MonoRepo gRPC App",
        pool: {
            maxConnections: parseInt(process.env.EMAIL_MAX_CONNECTIONS || "5", 10),
            rateDelta: parseInt(process.env.EMAIL_RATE_DELTA || "1000", 10),
            rateLimit: parseInt(process.env.EMAIL_RATE_LIMIT || "5", 10),
        },
    };
};
exports.emailConfig = getEmailConfig();
