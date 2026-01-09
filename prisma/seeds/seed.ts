// Prisma client instance
import prisma from "../../src/lib/prisma.client"

// Enums for RBAC (Role-Based Access Control)
import { Roles } from "../../src/enums/enums"

import { rolePermissionSeed } from "./role-permission.seed";
import { permissionSeed } from "./permission.seed";

export async function roleSeed() {
    /* =====================================================
     ROLES SEEDING
     ===================================================== */

    // Create or update SUPER_ADMIN role
    const superAdmin = await prisma.role.upsert({
        where: { name: Roles.SUPER_ADMIN },
        update: {},
        create: { name: Roles.SUPER_ADMIN }
    });
    // console.log(superAdmin, 'SUPER_ADMIN')

    // Create or update ADMIN role
    const admin = await prisma.role.upsert({
        where: { name: Roles.ADMIN },
        update: {},
        create: { name: Roles.ADMIN }
    });
    // console.log(admin, 'ADMIN')

    // Create or update VENDOR role
    const vendor = await prisma.role.upsert({
        where: { name: Roles.VENDOR },
        update: {},
        create: { name: Roles.VENDOR }
    });
    // console.log(vendor, 'VENDOR')

    // Create or update USER role
    const user = await prisma.role.upsert({
        where: { name: Roles.USER },
        update: {},
        create: { name: Roles.USER }
    });
    // console.log(user, 'USER')

    /* =====================================================
     PERMISSIONS SEEDING
     ===================================================== */
    await permissionSeed()
        .then(() => {
            console.log('permission seeding completed')
        })
        .catch((err) => {
            console.log('err while permission seeding', err)
        })
        
    /* =====================================================
           ROLE-BASED PERMISSION
           ===================================================== */

    await rolePermissionSeed({ id: superAdmin.id }, { id: admin.id }, { id: user.id }, { id: vendor.id },)
        .then(() => {
            console.log('role-permission seeding completed')
        })
        .catch((err) => {
            console.log('err while role-permission seeding', err)
        })


    /* =====================================================
       SCRIPT EXECUTION
       ===================================================== */
}
roleSeed()
  .then(() => console.log('Roles seeding Completed'))
  .catch(() => console.log('err while Roles seeding'))