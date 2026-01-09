// Import Express framework
import express from "express";
// Import environment/server configuration constants
import { SERVER_ENV } from "./constants/backend.js";
// Import main API routes
import apiRoutes from "./routes/api/index.routes.js";
// Import public authentication routes (e.g., login, register)
import userPublicRouter from "./routes/auth/user.public.routes.js";
// Create an Express application instance
const app = express();
// Middleware to parse incoming JSON requests
app.use(express.json());
// Mount public authentication routes at /auth
// Example: /auth/login, /auth/register
app.use("/auth", userPublicRouter);
// Mount protected or main API routes at /api
// Example: /api/users, /api/products
app.use("/api", apiRoutes);
// Start the server and listen on the configured port
app.listen(SERVER_ENV.PORT, () => {
    console.log(`Server is listening on http://localhost:${SERVER_ENV.PORT}`);
});
//# sourceMappingURL=index.js.map