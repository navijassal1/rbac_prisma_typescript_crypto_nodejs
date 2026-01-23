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
import type { GrantPermissionParams, GrantRolesParams, paginationParams } from "../types/admin-permissions.types.js";
import type { serviceResponse, TargetParams } from "../types/common.types.js";
/**
 * @description Fetch all users from the database
 *              Includes basic user info and assigned role names
 * @returns {Promise<serviceResponse>}
 */
export declare const listUsersService: (reqQuery: paginationParams) => Promise<serviceResponse>;
/**
 * @description Fetch all permissions available in the system
 * @returns {Promise<serviceResponse>}
 *          Always returns success with an array (may be empty)
 */
export declare const listPermissionsService: () => Promise<serviceResponse>;
/**
 * @description Fetch all Roles from the database
 * @returns {Promise<serviceResponse>}
 */
export declare const listRolesService: () => Promise<serviceResponse>;
/**
 * @description Fetch all permissions assigned to a specific user
 * @param {number} targetUserId - User ID to fetch permissions for
 * @returns {Promise<serviceResponse>}
 */
export declare const getUserPermissionsService: (targetUserId: TargetParams) => Promise<serviceResponse>;
/**
 * @description Grant a set of permissions to a specific user
 *              Existing permissions are replaced with the new set
 * @param {GrantPermissionParams} reqBody
 * @returns {Promise<serviceResponse>}
 */
export declare const grantPermissionsService: (reqBody: GrantPermissionParams) => Promise<serviceResponse>;
/**
 * @description Grant roles to a specific user
 *              This operation also synchronizes permissions
 *              derived from the assigned roles
 * @param {GrantRolesParams} reqBody
 * @returns {Promise<serviceResponse>}
 */
export declare const grantRolesService: (reqBody: GrantRolesParams) => Promise<serviceResponse>;
/**
 * @description Fetch all Roles from the database
 * @returns {Promise<serviceResponse>}
 */
export declare const fetchUsersWithRolesService: (param: string, reqQuery: paginationParams) => Promise<serviceResponse>;
/**export const fetchUsersWithRolesService = async (param: string, reqQuery: paginationParams): Promise<serviceResponse> => {
    try {
        let { page, sort_by, sort_order, limit, search } = reqQuery;
        const pageSize = 10;
        const offset = (page - 1) * limit;
        let listUsers = []
        let totalRecords
        console.log({ page, sort_by, sort_order, param, limit, search })

        if (param == 'ALL') {
            listUsers = await prisma.user.findMany({
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    username: true,
                    email: true,
                    // Fetch roles assigned to each user
                    roles: { select: { role: { select: { name: true, id: true } } } }
                },
                skip: offset,
                take: limit,
                orderBy: { [sort_by]: sort_order },
                where: {
                    AND: [
                        {
                            roles: {
                                none: {
                                    role: {
                                        name: Roles.SUPER_ADMIN
                                    }
                                }
                            }
                        },
                        {
                            OR: [
                                { first_name: { startsWith: search } },
                                { last_name: { startsWith: search } },
                                { username: { startsWith: search } },
                                { email: { startsWith: search } }
                            ]
                        }
                    ]
                }
            });
            if (search) {
                console.log('in search')
                totalRecords = await prisma.user.count({
                    where: {
                        roles: {
                            none: {
                                role: { name: Roles.SUPER_ADMIN }
                            }
                        },
                        OR: [
                            { first_name: { startsWith: search } },
                            { last_name: { startsWith: search } },
                            { username: { startsWith: search } },
                            { email: { startsWith: search } }
                        ]
                    }
                });
            } else {
                console.log('not in search')
                totalRecords = await prisma.user.count({
                    where: {
                        roles: {
                            none: {
                                role: { name: Roles.SUPER_ADMIN }
                            }
                        }
                    }
                });
            }
        } else {
            listUsers = await prisma.user.findMany({
                where: {
                    roles: {
                        some: {              // User_RoleListRelationFilter
                            role: {
                                is: {          // THIS is invalid in your schema because `role` is a single object, not a list
                                    name: param
                                }
                            }
                        }
                    },
                    OR: [
                        { first_name: { startsWith: search } },
                        { last_name: { startsWith: search } },
                        { username: { startsWith: search } },
                        { email: { startsWith: search } }
                    ]
                },
                include: { roles: { select: { role: { select: { name: true, id: true } } } } },
                skip: offset,
                take: limit,
                orderBy: { [sort_by]: sort_order },

            }
            )

            if (search) {
                totalRecords = await prisma.user.count({
                    where: {
                        AND: [
                            {
                                roles: {
                                    some: {
                                        role: { name: param }
                                    }
                                }
                            },
                            {
                                roles: {
                                    none: {
                                        role: { name: Roles.SUPER_ADMIN }
                                    }
                                }
                            }
                        ],
                        OR: [
                            { first_name: { startsWith: search } },
                            { last_name: { startsWith: search } },
                            { username: { startsWith: search } },
                            { email: { startsWith: search } }
                        ]
                    }
                });
            }
            else {

                totalRecords = await prisma.user.count({
                    where: {
                        AND: [
                            {
                                roles: {
                                    some: {
                                        role: { name: param }
                                    }
                                }
                            },
                            {
                                roles: {
                                    none: {
                                        role: { name: Roles.SUPER_ADMIN }
                                    }
                                }
                            }
                        ]
                    }
                });
            }
        }
        // Handle case where no roles exist
        if (listUsers.length === 0) {
            return {
                success: true, message: "Users do not exist currently", data: {
                    users: []
                }
            }
        }
        const cleanResponse = listUsers.map(user => ({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            email: user.email,
            // roleIds: user.roles.map(r => r.role.id),
            roles: user.roles.map(r => r.role.name),
        }))
        const totalPages = Math.ceil(totalRecords / limit);
        const from = offset + 1;
        const to = Math.min(offset + limit, totalRecords);
        return {
            success: true,
            message: `List of ${param}`,
            data: {
                users: cleanResponse,
                data_details: {
                    current: page,
                    total_data: listUsers.length,
                    total_records: totalRecords,
                    from,
                    to,
                    total_pages: totalPages,
                    limit,
                    sort_by,
                    sort_order: sort_order.toUpperCase(),
                },
            },
            // data: {
            //     users: cleanResponse,
            //     data_details: {
            //         current: Number(page),
            //         total_data: total,
            //         from: offset + 1,
            //         to: offset + pageSize,
            //         total_pages: Math.ceil(total / pageSize),
            //         sort_by: sort_by,
            //         sort_order: sort_order.toUpperCase(),
            //     },
            // }
        }
    } catch (error) {
        // Re-throw the error to be handled by a global error handler
        throw error
    }
} */
//# sourceMappingURL=admin-permissions.services.d.ts.map