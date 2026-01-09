/**
 * Parameters required to grant permissions to a user.
 */
export interface GrantPermissionParams {
    /** ID of the user to whom permissions will be granted */
    user_id: number;
    /** Array of permission IDs to assign to the user */
    permission_ids: number[];
}
export interface GrantRolesParams {
    /** ID of the user to whom permissions will be granted */
    user_id: number;
    /** Array of permission IDs to assign to the user */
    role_ids: number[];
}
//# sourceMappingURL=admin.permissions.types.d.ts.map