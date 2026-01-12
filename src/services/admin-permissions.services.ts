/**
 * Admin Permission & Role Services
 * --------------------------------------------------
 * This file contains service-layer functions responsible for:
 * - Fetching users, roles, and permissions
 * - Assigning permissions directly to users
 * - Assigning roles to users and synchronizing permissions
 *
 * All database interactions are handled via Prisma.
 */

import prisma from "../lib/prisma.client.js"
import type { GrantPermissionParams, GrantRolesParams } from "../types/admin-permissions.types.js"
import type { serviceResponse, TargetParams } from "../types/common.types.js"

/**
 * @description Fetch all users from the database
 *              Includes basic user info and assigned role names
 * @returns {Promise<serviceResponse>}
 */
export const listUsersService = async (): Promise<serviceResponse> => {
    try {
        const listUsers = await prisma.user.findMany({
            select: {
                id: true,
                first_name: true,
                last_name: true,
                username: true,
                email: true,
                // Fetch roles assigned to each user
                roles: { select: { role: { select: { name: true } } } }
            }
        })
        // Explicitly handle case where no users exist
        if (listUsers.length === 0) {
            return { success: false, message: "Users do not exist currently" }
        }
        return { success: true, message: "List of users", data: listUsers }
    } catch (error) {
        // Re-throw the error to be handled by a global error handler
        throw error
    }
}
/**
 * @description Fetch all permissions available in the system
 * @returns {Promise<serviceResponse>}
 *          Always returns success with an array (may be empty)
 */
export const listPermissionsService = async (): Promise<serviceResponse> => {
    try {
        const permissions = await prisma.permission.findMany({ orderBy: { id: 'asc' } })
        // Even if no permissions exist, return empty array with success
        return { success: true, message: 'List of permissions', data: permissions }
    } catch (error) {
        throw error
    }
}
/**
 * @description Fetch all Roles from the database
 * @returns {Promise<serviceResponse>}
 */
export const listRolesService = async (): Promise<serviceResponse> => {
    try {
        const listRoles = await prisma.role.findMany({
            select: {
                id: true,
                name: true
            },
            orderBy: {
                id: 'asc'
            }
        })
        // Handle case where no roles exist
        if (listRoles.length === 0) {
            return { success: false, message: "Roles do not exist currently" }
        }
        return { success: true, message: "List of Roles", data: listRoles }
    } catch (error) {
        // Re-throw the error to be handled by a global error handler
        throw error
    }
}
/**
 * @description Fetch all permissions assigned to a specific user
 * @param {number} targetUserId - User ID to fetch permissions for
 * @returns {Promise<serviceResponse>}
 */
export const getUserPermissionsService = async (targetUserId: TargetParams): Promise<serviceResponse> => {
    try {
        const userPermissions = await prisma.user_permission.findMany({
            where: { user_id: targetUserId },
            select: {
                // Include minimal user information
                user: { select: { id: true, username: true } },
                // Include permission details
                permission: true
            }
        })
        // User exists but has no permissions
        if (!userPermissions || userPermissions.length === 0) {
            return { success: true, message: "User has no permissions assigned", data: [] }
        }
        return { success: true, message: "User permission list", data: userPermissions }
    } catch (error) {
        throw error
    }
}
/**
 * @description Grant a set of permissions to a specific user
 *              Existing permissions are replaced with the new set
 * @param {GrantPermissionParams} reqBody
 * @returns {Promise<serviceResponse>}
 */
export const grantPermissionsService = async (reqBody: GrantPermissionParams): Promise<serviceResponse> => {
    try {
        const { user_id, permission_ids } = reqBody
        // Validate permission IDs input
        if (!Array.isArray(permission_ids) || permission_ids.length === 0) {
            return { success: false, message: "Permission IDs must be a non-empty array" }
        }
        const permissionIds: number[] = permission_ids.map(Number)
        // Check if user exists
        const userExists = await prisma.user.findUnique({ where: { id: Number(user_id) } })
        if (!userExists) {
            return { success: false, message: "Invalid user ID" }
        }
        // Validate provided permission IDs exist
        const permissionExists = await prisma.permission.findMany({
            where: { id: { in: permissionIds } },
            select: { id: true }
        })
        if (!permissionExists || permissionExists.length === 0) {
            return { success: false, message: "Invalid permission ID(s)" }
        }
        // Remove permissions that are not included in the new list
        await prisma.user_permission.deleteMany({
            where: {
                user_id: Number(user_id),
                permission_id: { notIn: permissionIds }
            }
        })
        // Assign new permissions (duplicates are skipped automatically)
        await prisma.user_permission.createMany({
            data: permissionIds.map(id => ({
                user_id: Number(user_id),
                permission_id: id
            })),
            skipDuplicates: true
        })
        return { success: true, message: "Permissions granted successfully" }
    } catch (error) {
        throw error
    }
}
/**
 * @description Grant roles to a specific user
 *              This operation also synchronizes permissions
 *              derived from the assigned roles
 * @param {GrantRolesParams} reqBody
 * @returns {Promise<serviceResponse>}
 */
export const grantRolesService = async (reqBody: GrantRolesParams): Promise<serviceResponse> => {
    try {
        const { user_id, role_ids } = reqBody
        // Debug logging (can be removed in production)
        console.log({ user_id, role_ids })
        // Validate role IDs input
        if (!Array.isArray(role_ids) || role_ids.length === 0) {
            return { success: false, message: "Permission IDs must be a non-empty array" }
        }
        const rolesIds: number[] = role_ids.map(Number)
        // Check if user exists
        const userExists = await prisma.user.findUnique({ where: { id: Number(user_id) } })
        if (!userExists) {
            return { success: false, message: "Invalid user ID" }
        }
        // Validate roles exist
        const roleExists = await prisma.role.findMany({
            where: { id: { in: rolesIds } },
            select: { id: true }
        })
        // console.log(roleExists, 'Roles exists')
        if (!roleExists || roleExists.length === 0) {
            return { success: false, message: "Invalid Role ID(s)" }
        }
        // Fetch permissions associated with the selected roles
        const rolePermissions = await prisma.role_permission.findMany({
            where: { role_id: { in: rolesIds } },
            select: {
                permission: true
            }
        })
        // console.log(rolePermissions, 'Roles Permissions')
        // Extract permission IDs from role-permission mapping
        const permissionIds = rolePermissions.map(p => p.permission.id)
        // Remove roles that are no longer assigned
        await prisma.user_Role.deleteMany({
            where: {
                user_id: Number(user_id),
                role_id: { notIn: rolesIds }
            }
        })
        // Assign new roles (skip duplicates)
        await prisma.user_Role.createMany({
            data: rolesIds.map(id => ({
                user_id: Number(user_id),
                role_id: id
            })),
            skipDuplicates: true
        })
        // Remove permissions not derived from assigned roles
        await prisma.user_permission.deleteMany({
            where: {
                user_id: Number(user_id),
                permission_id: { notIn: permissionIds }
            }
        })
        // Assign permissions derived from roles
        await prisma.user_permission.createMany({
            data: permissionIds.map(id => ({
                user_id: Number(user_id),
                permission_id: id
            })),
            skipDuplicates: true
        })
        return { success: true, message: "Roles granted successfully" }
    } catch (error) {
        throw error
    }
}
