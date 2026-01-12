import type { Request, Response, NextFunction } from "express";

/**
 * Type definition for an Express middleware function.
 * Middleware can be synchronous or asynchronous (returning a Promise).
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function to pass control
 */
// 2. Define the generic return type that allows the object OR void (for next())
export type ApiResponseReturn = object | void;
// 3. Define the Middleware type with a default of your structure
export type ExpressMiddlewareParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<ApiResponseReturn>;
/**
 * Type definition for an Express error-handling middleware.
 * Error handlers have four parameters: error, request, response, next.
 *
 * @param err - The error object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export type ErrorHandlerParams = (
  err: Error,
  res: Response,

) => object;
/**
 * Type definition for a standard API response function.
 * Used to send consistent JSON responses across the app.
 *
 * @param res - Express response object
 * @param status - HTTP status code (e.g., 200, 400, 404)
 * @param success - Boolean indicating success or failure
 * @param message - Response message
 * @param data - Optional object containing additional data
 */
export type ResponseParams = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: object
) => object;
/**
 * Type definition for an unauthorized response helper.
 * Typically used when authentication fails (HTTP 401).
 *
 * @param res - Express response object
 */
export type unauthorizedResponseParams = (
  res: Response,
) => object;
export interface serviceResponse<T = object> {
  success: boolean;
  message: string;
  data?: T;
}
export type TargetParams=number;           // User ID (primary key)


