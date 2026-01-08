import { STATUS } from "../enums/enums.js";
import prisma from "../lib/prisma.client.js";
export const listPermissoinsService = async () => {
    const permissions = await prisma.permission.findMany();
    return { success: true, message: 'List permissoins', data: permissions };
};
export const grantPermissionsService = async (reqBody) => {
    try {
        console.log(reqBody, 'body in admin grant permisison');
        const userExists = await prisma.user.findUnique({
            where: {
                id: Number(reqBody.user_id)
            }
        });
        if (!userExists) {
            return { success: true, message: "Invalid user ID" };
        }
        const permissionExists = await prisma.permission.findUnique({
            where: {
                id: Number(reqBody.permission_id)
            }
        });
        if (!permissionExists) {
            return { success: true, message: "Invalid Permission ID" };
        }
        const grantUserPermission = await prisma.user_permission.create({
            data: {
                user_id: Number(reqBody.user_id),
                permission_id: Number(reqBody.permission_id)
            }
        });
        console.log(grantUserPermission, 'grantUserPermission');
        if (!grantUserPermission) {
            throw new Error("error");
        }
        return { success: true, message: "Role Created successfully", data: { userExists, permissionExists } };
    }
    catch (error) {
        throw (error);
    }
};
//# sourceMappingURL=admin.permission.services.js.map