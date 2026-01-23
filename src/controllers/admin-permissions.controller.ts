/**
 * Admin Permissions Controller
 * --------------------------------------------------
 * This file contains Express middleware functions
 * responsible for handling admin-level permission
 * and role management requests.
 *
 * Each controller:
 * - Validates required request context
 * - Calls the appropriate service
 * - Returns a standardized API response
 */

// --------------------------------------------------
// Type Imports
// --------------------------------------------------

import type {
  ApiResponseReturn,
  ExpressMiddlewareParams,
  serviceResponse,
  TargetParams
} from "../types/common.types.js"

import type {
  GrantPermissionParams,
  GrantRolesParams,
  paginationParams
} from "../types/admin-permissions.types.js"

// --------------------------------------------------
// Service Imports
// --------------------------------------------------

import {
  listPermissionsService,
  grantPermissionsService,
  getUserPermissionsService,
  listUsersService,
  listRolesService,
  fetchUsersWithRolesService,
  grantRolesService
} from "../services/admin-permissions.services.js"

// --------------------------------------------------
// Helpers & Enums
// --------------------------------------------------

import { response } from "../helpers/helper.js"
import { STATUS } from "../enums/enums.js"
import { errorHandler } from "../middlewares/error.handler.js"

// --------------------------------------------------
// Controllers
// --------------------------------------------------

/**
 * @description Fetch all users in the system
 * @route       GET /list-users
 * @access      Protected / Admin
 */
export const listUsers: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
  try {
    const param: string = String(req.params.role)
    const reqQuery: paginationParams = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sort_by: (req.query.sort_by as paginationParams['sort_by']) || 'id',
      sort_order: ((req.query.sort_order as string)?.toLowerCase() == 'desc' ? 'desc' : 'asc'),
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      search: (req.query.search as string) || ''  
    }
    const result: serviceResponse = await listUsersService(reqQuery)
    if (!result.success) {
      return response(res, STATUS.BAD_REQUEST, false, result.message)
    }
    return response(res, STATUS.SUCCESS, true, result.message, result.data)
  } catch (e) {
    return errorHandler(e as Error, res)
  }
}

/**
 * @description Fetch all permissions available in the system
 * @route       GET /list-permissions
 * @access      Protected / Admin
 */
export const listPermissions: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
  try {
    const result: serviceResponse = await listPermissionsService()
    if (!result.success) {
      return response(res, STATUS.BAD_REQUEST, false, result.message)
    }

    return response(res, STATUS.SUCCESS, true, result.message, result.data)
  } catch (e) {
    return errorHandler(e as Error, res)
  }
}

/**
 * @description Fetch all roles defined in the system
 * @route       GET /list-roles
 * @access      Protected / Admin
 */
export const listRoles: ExpressMiddlewareParams = async (req, res) => {
  try {
    const result: serviceResponse = await listRolesService()
    if (!result.success) {
      return response(res, STATUS.BAD_REQUEST, false, result.message)
    }
    return response(res, STATUS.SUCCESS, true, result.message, result.data)
  } catch (e) {
    return errorHandler(e as Error, res)
  }
}

/**
 * @description Fetch permissions assigned to a specific user
 * @route       GET /users/:userId/permissions
 * @access      Protected / Admin
 * @requires    req.targetUserId (attached by middleware)
 */
export const getUserPermissions: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
  try {
    const targetUserId: TargetParams = req.targetUserId
    const result: serviceResponse = await getUserPermissionsService(targetUserId)
    if (!result.success) {
      return response(res, STATUS.BAD_REQUEST, false, result.message)
    }
    return response(res, STATUS.SUCCESS, true, result.message, result.data)
  } catch (e) {
    return errorHandler(e as Error, res)
  }
}

/**
 * @description Grant permissions to a specific user
 *              Existing permissions are replaced
 * @route       PUT /permissions
 * @access      Protected / Admin
 * @body        GrantPermissionParams
 *              - user_id
 *              - permission_ids[]
 */
export const grantPermissions: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
  try {
    const reqBody: GrantPermissionParams = req.body
    console.log(reqBody, 'req body')
    const result: serviceResponse = await grantPermissionsService(reqBody)

    if (!result.success) {
      return response(res, STATUS.BAD_REQUEST, false, result.message)
    }

    return response(res, STATUS.SUCCESS, true, result.message, result.data)
  } catch (e) {
    return errorHandler(e as Error, res)
  }
}

/**
 * @description Grant roles to a specific user
 *              Existing roles are replaced
 * @route       PUT /roles
 * @access      Protected / Admin
 * @body        GrantRolesParams
 *              - user_id
 *              - role_ids[]
 */
export const grantRoles: ExpressMiddlewareParams = async (req, res): Promise<ApiResponseReturn> => {
  try {
    const reqBody: GrantRolesParams = req.body
    const result: serviceResponse = await grantRolesService(reqBody)

    if (!result.success) {
      return response(res, STATUS.BAD_REQUEST, false, result.message)
    }

    return response(res, STATUS.SUCCESS, true, result.message, result.data)
  } catch (e) {
    return errorHandler(e as Error, res)
  }
}


/**
 * @description Fetch all roles defined in the system
 * @route       GET /list-roles
 * @access      Protected / Admin
 */
export const fetchUsersWithRoles: ExpressMiddlewareParams = async (req, res) => {
  try {
    const param: string = String(req.params.role)
    const reqQuery: paginationParams = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sort_by: (req.query.sort_by as paginationParams['sort_by']) || 'id',
      sort_order: ((req.query.sort_order as string)?.toLowerCase() == 'desc' ? 'desc' : 'asc'),
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      search: (req.query.search as string) || '',
      
    }
    const result: serviceResponse = await fetchUsersWithRolesService(param, reqQuery)
    if (!result.success) {
      return response(res, STATUS.BAD_REQUEST, false, result.message)
    }
    return response(res, STATUS.SUCCESS, true, result.message, result.data)
  } catch (e) {
    return errorHandler(e as Error, res)
  }
}