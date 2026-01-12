// -------------------- External modules --------------------

// Used to define request body validation rules
import { body } from "express-validator";

// Prisma client for database access
import prisma from '../lib/prisma.client.js';

// HTTP status codes enum
import { STATUS } from "../enums/enums.js";

// Custom Express middleware typing
import type { ApiResponseReturn, ExpressMiddlewareParams } from "../types/common.types.js";

// Standardized API response helper
import { response } from "../helpers/helper.js";
import { validateResult } from "../utils/validation.result.middleware.js";

/**
 * ---------------------------------------------------------
 * Validation rules for granting permissions to a user
 * Accessible by admin only
 * ---------------------------------------------------------
 */
export const adminPermissionValidation = [
  /**
   * --------------------
   * Validate user_id
   * --------------------
   * - Must be present
   * - Must correspond to an existing user in the database
   */
  body("user_id")
    .trim() // Remove extra spaces
    .notEmpty()
    .withMessage("User ID is required.")
    .bail() // Stop validation chain if previous validation fails
    .custom(async (value) => {
      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { id: Number(value) }
      });
      // Throw custom error if user does not exist
      if (!user) {
        throw ({ code: STATUS.UNPROCESSIBLE, message: 'Enter a valid user ID.' });
      }
      return true;
    }),

  /**
   * --------------------
   * Validate permission_ids
   * --------------------
   * - Must be present
   * - Must be a valid array
   * - All permission IDs must exist in the database
   */
  body("permission_ids")
    .trim()
    .notEmpty()
    .withMessage("Permission IDs are required.")
    .bail()
    .custom(async (value: string[] | string) => {
      let permissionIds: number[];
      // Handle array input (e.g., JSON request body)
      if (Array.isArray(value)) {
        permissionIds = value.map(Number);
      }
      // Handle stringified array (e.g., form-data)
      else if (typeof value === 'string') {
        try {
          permissionIds = JSON.parse(value);

          // Ensure parsed value is an array
          if (!Array.isArray(permissionIds)) {
            throw new Error();
          }
        } catch {
          throw ({ code: STATUS.NOT_FOUND, message: 'Permission IDs must be a valid array.' });
        }
      }
      // Reject any other data types
      else {
        throw ({ code: STATUS.NOT_FOUND, message: 'Permission IDs must be a valid array.' });
      }
      // Fetch permissions that exist in the database
      const existingPermissions = await prisma.permission.findMany({
        where: { id: { in: permissionIds } },
        select: { id: true }
      });
      // Validate that all provided IDs exist
      if (permissionIds.length !== existingPermissions.length) {
        throw ({ code: STATUS.NOT_FOUND, message: 'Enter valid permission IDs.' });
      }
      return true;
    }),

  validateResult
];
/**
 * ---------------------------------------------------------
 * Validation rules for granting roles to a user
 * Accessible by admin only
 * ---------------------------------------------------------
 */
export const adminRolesValidation = [
  /**
   * --------------------
   * Validate user_id
   * --------------------
   */
  body("user_id")
    .trim()
    .notEmpty()
    .withMessage("User ID is required.")
    .bail()
    .custom(async (value) => {
      // Verify user existence
      const user = await prisma.user.findUnique({
        where: { id: Number(value) }
      });
      if (!user) {
        throw ({ code: STATUS.UNPROCESSIBLE, message: 'Enter a valid user ID.' });
      }
      return true;
    }),
  /**
   * --------------------
   * Validate role_ids
   * --------------------
   * - Must be a valid array
   * - All roles must exist in the database
   */
  body("role_ids")
    .trim()
    .notEmpty()
    .withMessage("Roles IDs are required.")
    .bail()
    .custom(async (value: string[] | string) => {
      let rolesIds: number[];
      // Handle array input
      if (Array.isArray(value)) {
        rolesIds = value.map(Number);
      }
      // Handle stringified array input
      else if (typeof value === 'string') {
        try {
          rolesIds = JSON.parse(value);

          if (!Array.isArray(rolesIds)) {
            throw new Error();
          }
        } catch {
          throw ({ code: STATUS.NOT_FOUND, message: 'Role IDs must be a valid array.' });
        }
      }
      // Reject invalid input types
      else {
        throw ({ code: STATUS.NOT_FOUND, message: 'Role IDs must be a valid array.' });
      }
      // Fetch existing roles
      const existingRoles = await prisma.role.findMany({
        where: { id: { in: rolesIds } },
        select: { id: true }
      });
      // Ensure all role IDs exist
      if (rolesIds.length !== existingRoles.length) {
        throw ({ code: STATUS.NOT_FOUND, message: 'Enter valid Role IDs.' });
      }
      return true;
    }),

  validateResult
]
/**
 * ---------------------------------------------------------
 * Middleware: Attach target user based on URL param
 * ---------------------------------------------------------
 * - Reads user_id from route params
 * - Verifies user existence
 * - Attaches targetUserId to request object
 */
export const attachTargetUser: ExpressMiddlewareParams = async (req, res, next):Promise<ApiResponseReturn>  => {
  // Convert user_id param to number
  const userId = Number(req.params.user_id);
  // Check if the user exists
  const userExists = await prisma.user.findUnique({
    where: { id: userId }
  });
  // Return 404 if user not found
  if (!userExists) {
    return response(res, STATUS.NOT_FOUND, false, 'User Not Found');
  }
  // Attach user ID to request for downstream middleware/controllers
  req.targetUserId = userExists.id;
  next();
};
