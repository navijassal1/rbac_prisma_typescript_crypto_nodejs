// Prisma client instance
import prisma from "../../src/lib/prisma.client"
import { Permission } from "@prisma/client"
import bcrypt from "bcrypt"

export async function userSeed(id: number, superAdminPermissions: Permission[]) {
    /* =====================================================
     SUPER ADMIN USER CREATION
     ===================================================== */

    // Hash default admin password
    const hashedPassword = await bcrypt.hash('Admin@123', 10)

    // Create or update super admin user
    const superAdminUser = await prisma.user.upsert({
        where: { email: 'superadmin@gmail.com' },
        update: {},
        create: {
            first_name: 'super',
            last_name: 'admin',
            email: 'superadmin@gmail.com',
            username: 'admin',
            password: hashedPassword,
        }
    })
    console.log(superAdminUser, 'superAdminUser')


    /* =====================================================
       USER → ROLE MAPPING
       ===================================================== */

    // Assign SUPER_ADMIN role to the user
    const userRole = await prisma.user_Role.upsert({
        where: {
            user_id_role_id: {
                user_id: superAdminUser.id,
                role_id: id
            }
        },
        update: {},
        create: {
            user_id: superAdminUser.id,
            role_id: id
        }
    })
    console.log(userRole, 'userRole')


    /* =====================================================
       USER → PERMISSION MAPPING
       ===================================================== */

    // ⚠️ NOTE:
    // user_id is using superAdmin.id (ROLE ID)
    // It probably should be superAdminUser.id (USER ID)
    const userPermission = await prisma.user_permission.createMany({
        data: superAdminPermissions.map(p => ({
            user_id: id, // <-- likely should be superAdminUser.id
            permission_id: p.id
        })),
        skipDuplicates: true
    })
    console.log(userPermission, 'userPermission')
}
