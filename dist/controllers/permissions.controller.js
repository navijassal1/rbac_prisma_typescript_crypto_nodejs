import { listPermissoinsService, grantPermissionsService } from "../services/permission.services.js";
import { response } from "../helpers/helper.js";
import { STATUS } from "../enums/enums.js";
export const getPermissoins = async (req, res, next) => {
    try {
        if (!req.tokenUser) {
            return response(res, STATUS.BAD_REQUEST, false, "Target user not set");
        }
        const targetUser = req.tokenUser;
        const result = await listPermissoinsService();
        res.send(result.data);
        // if (!result.success) { return response(res, STATUS.BAD_REQUEST, false, result.message) }
        // return response(res, STATUS.SUCCESS, true, result.message, result.data)
    }
    catch (e) {
        if (e instanceof Error) {
            next(e);
        }
    }
};
export const grantPermissions = async (req, res, next) => {
    try {
        if (!req.tokenUser || !req.body) {
            return response(res, STATUS.BAD_REQUEST, false, "Target user not set");
        }
        const reqBody = req.body;
        const result = await grantPermissionsService(reqBody);
        res.send(result.data);
        // if (!result.success) { return response(res, STATUS.BAD_REQUEST, false, result.message) }
        // return response(res, STATUS.SUCCESS, true, result.message, result.data)
    }
    catch (e) {
        if (e instanceof Error) {
            next(e);
        }
    }
};
//# sourceMappingURL=permissions.controller.js.map