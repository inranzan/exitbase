import { slidingWindow } from "@arcjet/node";
import aj from "../config/security.js";
import logger from "../config/logger.js";

const securityMiddleware = async (req, res, next) => {
    try {
        const role = req.user?.role || "guest";

        let limit;
        let message;

        switch (role) {
            case "admin":
                limit = 100;
                message = "Admin request limit reached (100 req/min).";
                break;
            case "user":
                limit = 50;
                message = "User request limit reached (50 req/min).";
                break;
            case "guest":
                limit = 15;
                message = "Guest request limit reached (15 req/min).";
                break;
        }

        const client = aj.withRule(
            slidingWindow({
                mode: "LIVE",
                interval: 60,
                max: limit,
                name: `${role}-rate-limit`,
            })
        );

        const decision = await client.protect(req);

        // for blocking bot requests
        if (decision.isDenied && decision.reason.isBot()) {
            logger.warn("Blocked detected bot request.", {
                ip: req.ip,
                userAgent: req.get("User-Agent"),
                path: req.path,
            });

            return res.status(403).json({
                error: "Forbidden",
                message: "Automated requests are not allowed.",
            });
        }

        if (decision.isDenied && decision.reason.isShield()) {
            logger.warn("Shield blocked request.", {
                ip: req.ip,
                userAgent: req.get("User-Agent"),
                path: req.path,
            });

            return res.status(403).json({
                error: "Forbidden",
                message: "Security policy blocked the request.",
            });
        }

        if (decision.isDenied && decision.reason.isRateLimit()) {
            logger.warn("Rate limit exceeded.", {
                ip: req.ip,
                userAgent: req.get("User-Agent"),
                path: req.path,
            });

            return res.status(403).json({
                error: "Forbidden",
                message: "Out of request rate limit.",
            });
        }

        next();
    } catch (error) {
        console.error("Arcjet security error: ", error);
        res.status(500).json({
            error: "Internal Server error.",
            message: "Security middleware: Something went wrong.",
        });
    }
};

export default securityMiddleware;
