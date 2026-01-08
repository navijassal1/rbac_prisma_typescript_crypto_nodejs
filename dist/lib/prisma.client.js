import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { DB } from "../constants/backend.js";
/**
 * PrismaMariaDb connection configuration.
 * Using the DB constants loaded from environment variables.
 */
const db = DB;
const connection = new PrismaMariaDb({
    database: DB.NAME, // Database name
    user: DB.USER, // Database username
    password: DB.PASSWORD, // Database password (can be empty string)
    host: DB.HOST, // Database host (localhost or IP)
    port: DB.PORT, // Database port (number)
});
/**
 * Prisma client instance.
 * The adapter allows Prisma to work with MariaDB.
 * Casting to `any` here is optional but can help bypass TypeScript type issues.
 */
const prisma = new PrismaClient({ adapter: connection });
export default prisma;
//# sourceMappingURL=prisma.client.js.map