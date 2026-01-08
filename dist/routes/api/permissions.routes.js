import { Router } from "express";
import { getPermissoins, grantPermissions } from "../../controllers/permissions.controller.js";
import { verifyToken } from "../../middlewares/token.manager.js";
import { Roles, Resource, Action } from "../../enums/enums.js";
import { authorize } from "../../middlewares/authorize.role.js";
import { adminGrantPermissionValidation } from "../../validations/admin.validations.js";
import { validateResult } from "../../utils/validation.result.middleware.js";
const permissionRouter = Router();
permissionRouter.use(verifyToken);
permissionRouter.get('/permissions', authorize([Roles.ADMIN], [Resource.SYSTEM], [Action.READ]), getPermissoins);
// permissionRouter.get('/permissions/:id')
permissionRouter.post('/grant-permissions', authorize([Roles.ADMIN], [Resource.SYSTEM], [Action.CREATE]), adminGrantPermissionValidation, validateResult, grantPermissions);
// permissionRouter.put('/permissions/:id')
// permissionRouter.delete('/permissions/:id')
export default permissionRouter;
//# sourceMappingURL=permissions.routes.js.map