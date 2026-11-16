import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "7d";

export const signToken = payload => {
    try {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRATION,
        });
    } catch (error) {
        logger.error("Failed to sign token", error);
        throw error;
    }
};

export const verifyToken = token => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        logger.error("Failed to verify token", error);
        return null;
    }
};

const jwtoken = {
    sign: signToken,
    verify: verifyToken,
};

export default jwtoken;
