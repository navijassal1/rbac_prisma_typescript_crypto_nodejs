// Import Router from Express to define route handlers
import { Router } from "express";
// Import controller functions for user authentication
import { signUp, login, refreshAccessToken } from "../../controllers/user.controller.js";
// Import request validation rules for signup and login
import { signupValidation, loginValidation, refreshTokenValidation } from "../../validations/user.validations.js";
// Create a router instance for public user/auth routes
const authRouter = Router();
// User signup route
// 1. signupValidation → validates request body
// 2. validateResult → checks validation errors
// 3. signUp → handles user registration logic
authRouter.post("/signup", signupValidation, signUp);
// User login route
// 1. loginValidation → validates request body
// 2. validateResult → checks validation errors
// 3. login → handles authentication logic
authRouter.post("/login", loginValidation, login);
// Refresh token route
// 1. refreshTokenValidation → validates the presence and format of the refresh token in the request
// 2. validateResult → checks for validation errors
// 3. refreshAccessToken → handles the logic to verify the refresh token, generate new tokens, update DB, and respond
authRouter.get("/refresh-token", refreshTokenValidation, refreshAccessToken);
// Export router to be used in the main app
export default authRouter;
//# sourceMappingURL=auth.routes.js.map