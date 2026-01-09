import type { Request, Response, NextFunction } from "express";
import type { Resource, Action } from "../enums/enums.js";
/**
 * Role-Based Access Control (RBAC) middleware
 *
 * @param allowedResources - list of resources the user can access
 * @param allowedActions - list of actions the user can perform
 * @returns Express middleware function
 */
export declare const authorize: (allowedResources: Resource[], allowedActions: Action[]) => (req: Request, res: Response, next: NextFunction) => Promise<object | undefined>;
//# sourceMappingURL=authorize.role.d.ts.map