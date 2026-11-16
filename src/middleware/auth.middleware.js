import { verifyToken } from "../utils/jwt.js";
import { cookies } from "../utils/cookies.js";
import logger from "../config/logger.js";

// user authentication middleware
export const authenticate = async (req, res, next) => {
    try {
        let token = cookies.get(req, "token");

        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Authentication token is required.",
            });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Invalid or expired token.",
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        logger.error("Authentication middleware error", error);
        return res.status(401).json({
            error: "Unauthorized",
            message: "Authentication failed.",
        });
    }
};

// user role check middleware
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: "Forbidden",
                message: "You do not have permission to perform this action.",
            });
        }
        next();
    };
};
