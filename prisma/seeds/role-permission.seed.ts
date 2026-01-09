// Prisma client instance
import prisma from "../../src/lib/prisma.client"

// Enums for RBAC (Role-Based Access Control)
import { Resource, Action } from "../../src/enums/enums"
import { userSeed } from "./user-seed"

export async function rolePermissionSeed(superAdmin: {id:number}, admin: {id:number}, user: {id:number}, vendor: {id:number}) {
    // Fetch all permissions
    const allPermissions = await prisma.permission.findMany()
    console.log('-----------all Permissions--------------')
    console.log(allPermissions)

    /* =====================================================
       ROLE-BASED PERMISSION FILTERING
       ===================================================== */

    // SUPER ADMIN gets all permissions
    const superAdminPermissions = allPermissions
    console.log('---------superAdminPermissions----------')
    console.log(superAdminPermissions)

    // ADMIN gets all permissions except SYSTEM resource
    const adminPermissions = allPermissions.filter(
        p => p.resource !== Resource.SYSTEM
    )
    console.log('---------adminPermissions----------')
    console.log(adminPermissions)

    // VENDOR can manage CATEGORY except DELETE
    const vendorPermissions = allPermissions.filter(
        p =>
            p.resource === Resource.CATEGORY &&
            p.action !== Action.DELETE
    )
    console.log('---------vendorPermissions----------')
    console.log(vendorPermissions)

    // USER can only READ USER resource
    const userPermissions = allPermissions.filter(
        p =>
            p.resource === Resource.USER &&
            p.action === Action.READ
    )
    console.log('---------userPermissions----------')
    console.log(userPermissions)

    /* =====================================================
       ROLE → PERMISSION MAPPING
       ===================================================== */

    // Assign permissions to SUPER ADMIN
    await prisma.role_permission.createMany({
        data: superAdminPermissions.map(p => ({
            role_id: superAdmin.id,
            permission_id: p.id
        })),
        skipDuplicates: true
    })

    // Assign permissions to ADMIN
    await prisma.role_permission.createMany({
        data: adminPermissions.map(p => ({
            role_id: admin.id,
            permission_id: p.id
        })),
        skipDuplicates: true
    })

    // Assign permissions to VENDOR
    await prisma.role_permission.createMany({
        data: vendorPermissions.map(p => ({
            role_id: vendor.id,
            permission_id: p.id
        })),
        skipDuplicates: true
    })

    // Assign permissions to USER
    await prisma.role_permission.createMany({
        data: userPermissions.map(p => ({
            role_id: user.id,
            permission_id: p.id
        })),
        skipDuplicates: true
    })
    /* =====================================================
            SUPER ADMIN USER CREATION
           ===================================================== */
    await userSeed(superAdmin.id,superAdminPermissions)
        .then(() => {
            console.log('Super-Admin seeding completed')
        })
        .catch((err) => {
            console.log('err while Super-Admin seeding', err)
        })
}

