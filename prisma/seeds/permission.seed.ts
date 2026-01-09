// Prisma client instance
import prisma from "../../src/lib/prisma.client"

// Enums for RBAC (Role-Based Access Control)
import { Resource, Action } from "../../src/enums/enums"


export async function permissionSeed() {
    /* =====================================================
     PERMISSIONS SEEDING
     ===================================================== */

    // Generate all combinations of Resource × Action
    const permissionsData = Object.values(Resource).flatMap(resource =>
        Object.values(Action).map(action => ({ resource, action }))
    )
    console.log(permissionsData, 'permissionsData')

    // Insert permissions into database
    await prisma.permission.createMany({
        data: permissionsData
    })
}

