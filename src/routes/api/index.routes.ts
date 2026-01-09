// Import Router from Express to group API routes
import { Router } from "express";

// Import protected user-related routes
import userProtectedRouter from "./user.routes.js";

// Import category-related routes
import categoryProtectedRouter from "../api/category.routes.js";

// Import admin-only permission and management routes
import adminPermissionRouter from "./admin-permissions.routes.js";

// Middleware to verify JWT token
import { verifyToken } from "../../middlewares/token.manager.js";
// Create a main API router instance
const apiRoutes = Router();

// All routers require authentication
apiRoutes.use(verifyToken);
// Mount user-related protected routes
// Example: /api/users/profile, /api/users/update
apiRoutes.use("/users", userProtectedRouter);

// Mount category-related routes
// Example: /api/categories/create, /api/categories/list
apiRoutes.use("/categories", categoryProtectedRouter);

// Mount admin-only routes
// Example: /api/admin/create-user, /api/admin/roles
apiRoutes.use("/admin", adminPermissionRouter);

// Export the API router to be used in the main application
export default apiRoutes;
