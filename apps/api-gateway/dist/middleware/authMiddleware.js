"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateToken = exports.authorizeRoles = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// JWT Secret - In production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    if (!token) {
        res.status(401).json({ error: "Access token required" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({ error: "Invalid or expired token" });
        return;
    }
};
exports.authenticateToken = authenticateToken;
// Middleware to check for specific roles
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: "Authentication required" });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ error: "Insufficient permissions" });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
// Generate JWT token
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};
exports.generateToken = generateToken;
// Generate refresh token (longer expiry)
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};
exports.generateRefreshToken = generateRefreshToken;
