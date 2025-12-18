import { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Format Zod validation errors into a user-friendly structure
 */
const formatZodErrors = (error: z.ZodError) => {
  const formattedErrors: Record<string, string[]> = {};

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
export const validate = <T extends z.ZodTypeAny>(schema: T) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
          req.params = validatedData.params as typeof req.params;
        }
        if ('query' in validatedData) {
          req.query = validatedData.query as typeof req.query;
        }
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
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
/**
 * Type helper to extract the validated body type from a schema
 */
export type ValidatedBody<T extends z.ZodTypeAny> = z.infer<T> extends { body: infer B } ? B : never;

/**
 * Type helper to extract the validated params type from a schema
 */
export type ValidatedParams<T extends z.ZodTypeAny> = z.infer<T> extends { params: infer P } ? P : never;

/**
 * Type helper to extract the validated query type from a schema
 */
export type ValidatedQuery<T extends z.ZodTypeAny> = z.infer<T> extends { query: infer Q } ? Q : never;

