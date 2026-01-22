// Import Express framework
import express from "express";

// Import environment/server configuration constants
import { SERVER_ENV } from "./constants/backend.js";

// Import main API routes
import apiRoutes from "./routes/api/index.routes.js";

// Import public authentication routes (e.g., login, register)
import authRouter from "./routes/auth/auth.routes.js";

import cors from "cors"
import cookieParser from "cookie-parser"

// Create an Express application instance
const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',  // frontend URL
    credentials: true                 // allow sending cookies
}))

// Middleware to parse incoming JSON requests
// Mount public authentication routes at /auth
// Example: /auth/login, /auth/register
app.use("/auth", authRouter);
// Mount protected or main API routes at /api
// Example: /api/users, /api/products
app.use("/api", apiRoutes);
// Start the server and listen on the configured port
app.listen(SERVER_ENV.PORT, () => {
    console.log(
        `Server is listening on http://localhost:${SERVER_ENV.PORT}`
    );
});
