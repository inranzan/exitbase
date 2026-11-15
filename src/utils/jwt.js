import jwt, { verify } from "jsonwebtoken";
import logger from "../config/logger";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1d";

// jwt
const jwtoken = {
    sign: payload => {
        try {
            return jwt.sign(payload, JWT_SECRET, {
                expiresIn: JWT_EXPIRATION,
            });
        } catch (error) {
            logger.error("Failed to authenticate the token.", error);
            //   throw new Error("Failed to authenticate the token.");
        }
    },

    verify: token => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            logger.error("Failed to verify the token", error);
        }
    },
};

export default jwtoken;
