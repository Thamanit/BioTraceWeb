import { createError } from "../utils/error.js";

export const verifyRBAC = (req, res, next) => {
    verifyToken(req, res, next, () => {
        const user = req.user;
        if (user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        }
    });
};