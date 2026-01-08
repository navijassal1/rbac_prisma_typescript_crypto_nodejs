/**
 * Standard HTTP status codes used across the backend.
 * Makes your responses more consistent and readable.
 */
export var STATUS;
(function (STATUS) {
    STATUS[STATUS["SUCCESS"] = 200] = "SUCCESS";
    STATUS[STATUS["CREATED"] = 201] = "CREATED";
    STATUS[STATUS["NOT_FOUND"] = 404] = "NOT_FOUND";
    STATUS[STATUS["UNPROCESSIBLE"] = 422] = "UNPROCESSIBLE";
    STATUS[STATUS["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    STATUS[STATUS["SERVER_ERROR"] = 500] = "SERVER_ERROR";
    STATUS[STATUS["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    STATUS[STATUS["CONFLICT"] = 409] = "CONFLICT";
})(STATUS || (STATUS = {}));
/**
 * User roles in the system.
 * These are used for both authentication and role-based access control (RBAC).
 */
export var Roles;
(function (Roles) {
    Roles["SUPER_ADMIN"] = "SUPER_ADMIN";
    Roles["ADMIN"] = "ADMIN";
    Roles["VENDOR"] = "VENDOR";
    Roles["USER"] = "USER";
})(Roles || (Roles = {}));
/**
 * Resources that can be protected with RBAC.
 * Used together with `Action` in the `authorize` middleware.
 */
export var Resource;
(function (Resource) {
    Resource["SYSTEM"] = "SYSTEM";
    Resource["USER"] = "USER";
    Resource["CATEGORY"] = "CATEGORY";
})(Resource || (Resource = {}));
/**
 * Actions that can be performed on resources.
 * Combined with `Resource` to define fine-grained permissions.
 */
export var Action;
(function (Action) {
    Action["READ"] = "READ";
    Action["CREATE"] = "CREATE";
    Action["UPDATE"] = "UPDATE";
    Action["DELETE"] = "DELETE"; // Remove resource
})(Action || (Action = {}));
//# sourceMappingURL=enums.js.map