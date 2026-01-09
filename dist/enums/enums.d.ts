/**
 * Standard HTTP status codes used across the backend.
 * Makes your responses more consistent and readable.
 */
export declare enum STATUS {
    SUCCESS = 200,// OK
    CREATED = 201,// Resource successfully created
    NOT_FOUND = 404,// Resource not found
    UNPROCESSIBLE = 422,// Validation error or unprocessable request
    UNAUTHORIZED = 401,// User is not authenticated
    SERVER_ERROR = 500,// Internal server error
    BAD_REQUEST = 400,// Malformed request or invalid parameters
    CONFLICT = 409,
    FORBIDDEN = 403
}
/**
 * User roles in the system.
 * These are used for both authentication and role-based access control (RBAC).
 */
export declare enum Roles {
    SUPER_ADMIN = "SUPER_ADMIN",// Full access to all system resources
    ADMIN = "ADMIN",// Administrative privileges
    VENDOR = "VENDOR",// Vendor-specific access
    USER = "USER"
}
/**
 * Resources that can be protected with RBAC.
 * Used together with `Action` in the `authorize` middleware.
 */
export declare enum Resource {
    SYSTEM = "SYSTEM",// Core system-level resources
    USER = "USER",// User management resources
    CATEGORY = "CATEGORY"
}
/**
 * Actions that can be performed on resources.
 * Combined with `Resource` to define fine-grained permissions.
 */
export declare enum Action {
    READ = "READ",// View or fetch data
    CREATE = "CREATE",// Create new resource
    UPDATE = "UPDATE",// Modify existing resource
    DELETE = "DELETE"
}
//# sourceMappingURL=enums.d.ts.map