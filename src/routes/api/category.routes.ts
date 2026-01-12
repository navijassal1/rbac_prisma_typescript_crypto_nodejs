// Import Router from Express to define category-related routes
import { Router } from "express";

// Import controller functions for category management
import {
  listCategories,
  createCategories,
  categoryDetails,
  updateCategory,
  deleteCategory
} from "../../controllers/category.controller.js";

// Import middleware to attach target user to request
import { attachTargetUser } from "../../validations/user.validations.js";

// Import category-specific validation and attachment middleware
import {
  createCategoryValidation, // Validation rules for creating a category
  attachTargetCategory      // Middleware to attach target category to request
} from "../../validations/category.validations.js";

// Middleware for role-based access control
import { authorize } from "../../middlewares/authorize.role.js";

// Enums for RBAC: actions, resources, roles
import { Action, Resource, Roles } from "../../enums/enums.js";

// Create router instance for protected category routes
const categoryProtectedRouter = Router();

// Automatically attach target user whenever :username param is present
categoryProtectedRouter.param("username", attachTargetUser);

// Route: List all categories for a user
// Permissions: CATEGORY resource, READ action
// Endpoint: GET /api/categories/:username
categoryProtectedRouter.get(
  "/:username",
  authorize([Resource.CATEGORY], [Action.READ]),
  listCategories
);
// Route: Create a new category for a user
// Permissions: CATEGORY resource, CREATE action
// Validates request body before creation
// Endpoint: POST /api/categories/:username
categoryProtectedRouter.post(
  "/:username",
  authorize([Resource.CATEGORY], [Action.CREATE]),
  createCategoryValidation,
  createCategories
);
// Route: Get details of a specific category
// Permissions: CATEGORY resource, READ action
// attachTargetCategory ensures the category exists
// Endpoint: GET /api/categories/:username/:categorySlug
categoryProtectedRouter.get(
  "/:username/:categorySlug",
  authorize([Resource.CATEGORY], [Action.READ]),
  attachTargetCategory,
  categoryDetails
);
// Route: Update a specific category
// Permissions: CATEGORY resource, UPDATE action
// attachTargetCategory ensures correct category is targeted
// Endpoint: PUT /api/categories/:username/:categorySlug
categoryProtectedRouter.put(
  "/:username/:categorySlug",
  authorize([Resource.CATEGORY], [Action.UPDATE]),
  attachTargetCategory,
  updateCategory
);
// Route: Delete a specific category
// Permissions: CATEGORY resource, DELETE action
// attachTargetUser and attachTargetCategory ensure correct user and category are targeted
// Endpoint: DELETE /api/categories/:username/:categorySlug
categoryProtectedRouter.delete(
  "/:username/:categorySlug",
  authorize([Resource.CATEGORY], [Action.DELETE]),
  attachTargetUser,
  attachTargetCategory,
  deleteCategory
);
// Export protected category router
export default categoryProtectedRouter;
