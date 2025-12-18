"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
/**
 * Format Zod validation errors into a user-friendly structure
 */
const formatZodErrors = (error) => {
    const formattedErrors = {};
    error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) {
            formattedErrors[path] = [];
        }
        formattedErrors[path].push(issue.message);
    });
    return formattedErrors;
};
/**
 * Validation middleware factory
 * Creates an Express middleware that validates request data against a Zod schema
 *
 * @param schema - Zod schema that can validate body, params, and/or query
 * @returns Express middleware function
 *
 * @example
 * // In routes:
 * router.post("/register", validate(registerSchema), authController.register);
 */
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            // Parse and validate the request
            const validatedData = await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query,
            });
            // Replace request data with validated (and potentially transformed) data
            if (validatedData && typeof validatedData === 'object') {
                if ('body' in validatedData) {
                    req.body = validatedData.body;
                }
                if ('params' in validatedData) {
                    req.params = validatedData.params;
                }
                if ('query' in validatedData) {
                    req.query = validatedData.query;
                }
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const formattedErrors = formatZodErrors(error);
                res.status(400).json({
                    success: false,
                    error: "Validation failed",
                    details: formattedErrors,
                });
                return;
            }
            // Unexpected error
            console.error("Validation middleware error:", error);
            res.status(500).json({
                success: false,
                error: "Internal validation error",
            });
        }
    };
};
exports.validate = validate;
