import prisma from "../lib/prisma.client.js"
import type { GrantPermissionParams } from "../types/admin.permissions.types.js"
import type { serviceResponse } from "../types/common.types.js"

/**
 * @description Fetch all permissions available in the system
 * @returns {Promise<serviceResponse>} - Returns success status, message, and list of permissions
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
 * @description Fetch all permissions assigned to a specific user
 * @param {number} targetUserId - User ID to fetch permissions for
 * @returns {Promise<serviceResponse>} - Success status, message, and list of user's permissions
 */
export const getUserPermissionsService = async (targetUserId: number): Promise<serviceResponse> => {
    try {
        const userPermissions = await prisma.user_permission.findMany({
            where: { user_id: targetUserId },
            select: {
                user: { select: { id: true, username: true } }, // include user info
                permission: true // include permission details
            }
        })

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
 *              This function replaces existing permissions with the new set
 * @param {GrantPermissionParams} reqBody - Contains user ID and list of permission IDs to grant
 * @returns {Promise<serviceResponse>} - Success status and message
 */
export const grantPermissionsService = async (reqBody: GrantPermissionParams): Promise<serviceResponse> => {
    try {
        const { user_id, permission_ids } = reqBody

        if (!Array.isArray(permission_ids) || permission_ids.length === 0) {
            return { success: false, message: "Permission IDs must be a non-empty array" }
        }

        const permissionIds: number[] = permission_ids.map(Number)

        // Check if user exists
        const userExists = await prisma.user.findUnique({ where: { id: Number(user_id) } })
        if (!userExists) {
            return { success: false, message: "Invalid user ID" }
        }

        // Validate provided permissions exist
        const permissionExists = await prisma.permission.findMany({
            where: { id: { in: permissionIds } },
            select: { id: true }
        })
        if (!permissionExists || permissionExists.length === 0) {
            return { success: false, message: "Invalid permission ID(s)" }
        }

        // Remove permissions that are not in the new list
        await prisma.user_permission.deleteMany({
            where: {
                user_id: Number(user_id),
                permission_id: { notIn: permissionIds }
            }
        })

        // Grant new permissions (skip duplicates)
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
