import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
/**
 * Prisma client instance.
 * The adapter allows Prisma to work with MariaDB.
 * Casting to `any` here is optional but can help bypass TypeScript type issues.
 */
declare const prisma: PrismaClient<{
    adapter: PrismaMariaDb;
}, never, import("@prisma/client/runtime/client").DefaultArgs>;
export default prisma;
//# sourceMappingURL=prisma.client.d.ts.map