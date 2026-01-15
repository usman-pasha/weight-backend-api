import jwt from "jsonwebtoken";
import config from "../config/index.js";
import prisma from "../core/db.js";

export const verifyAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Authorization token is required"
            });
        }
        const decodedToken = jwt.verify(token, config.ACCESS_SECRET);

        // Check if token is still active in DB
        const tokenDoc = await prisma.token.findFirst({
            where: {
                jwtToken: token,
                status: "active",
            },
        });

        if (!tokenDoc) {
            return res.status(401).json({
                message: "Session expired. Please login again.",
                status: false,
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                username: true,
                accountType: true,
            },
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid token. User not found",
                status: false,
            });
        }
        req.user = user;
        req.userId = decodedToken?.id;
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized: " + error.message
        });
    }
};

export const authorizePermissions = (...allowedAccountTypes) => {
    return (req, res, next) => {
        try {
            // Ensure `req.user` exists and contains an `accountType`
            if (!req.user || !req.user.accountType) {
                return res.status(403).json({
                    message: "Access Denied: Unable to determine user role.",
                });
            }

            // Check if the user's accountType is in the allowed list
            if (!allowedAccountTypes.includes(req.user.accountType)) {
                return res.status(403).json({
                    message: `Access Denied: You do not have permission to perform this action. Your role: ${req.user.accountType}`,
                });
            }

            next(); // User is authorized, proceed
        } catch (error) {
            return res.status(500).json({
                message: "Server Error: Unable to process permissions.",
                error: error.message,
            });
        }
    };
};