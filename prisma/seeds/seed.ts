// Prisma client instance
import prisma from "../../src/lib/prisma.client"

// Enums for RBAC (Role-Based Access Control)
import { Resource, Action, Roles } from "../../src/enums/enums"

// Password hashing library
import bcrypt from "bcrypt"

async function main() {

  /* =====================================================
     ROLES SEEDING
     ===================================================== */

  // Create or update SUPER_ADMIN role
  const superAdmin = await prisma.role.upsert({
    where: { name: Roles.SUPER_ADMIN },
    update: {},
    create: { name: Roles.SUPER_ADMIN }
  });
  console.log(superAdmin, 'SUPER_ADMIN')

  // Create or update ADMIN role
  const admin = await prisma.role.upsert({
    where: { name: Roles.ADMIN },
    update: {},
    create: { name: Roles.ADMIN }
  });
  console.log(admin, 'ADMIN')

  // Create or update VENDOR role
  const vendor = await prisma.role.upsert({
    where: { name: Roles.VENDOR },
    update: {},
    create: { name: Roles.VENDOR }
  });
  console.log(vendor, 'VENDOR')

  // Create or update USER role
  const user = await prisma.role.upsert({
    where: { name: Roles.USER },
    update: {},
    create: { name: Roles.USER }
  });
  console.log(user, 'USER')


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
        role_id: superAdmin.id
      }
    },
    update: {},
    create: {
      user_id: superAdminUser.id,
      role_id: superAdmin.id
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
      user_id: superAdmin.id, // <-- likely should be superAdminUser.id
      permission_id: p.id
    })),
    skipDuplicates: true
  })
  console.log(userPermission, 'userPermission')
}

/* =====================================================
   SCRIPT EXECUTION
   ===================================================== */

main()
  .then(() => {
    console.log('seeding completed')
  })
  .catch((err) => {
    console.log('err while seeding', err)
  })
