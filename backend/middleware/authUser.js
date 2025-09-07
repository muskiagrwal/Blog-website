import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

/**
 * Middleware: Checks if user is authenticated
 * Supports both cookie-based auth and Bearer token in headers
 */
export const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies?.jwt;

    // If no cookie, check Authorization header (Bearer token)
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("Auth Middleware - Token received:", token);

    // If token is still missing
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find user by ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Middleware Error:", error.message);
    return res.status(401).json({ error: "User not authenticated" });
  }
};

/**
 * Middleware: Role-based authorization
 * Example usage: isAdmin("admin", "superadmin")
 */
export const isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied: Role '${req.user.role}' is not authorized`,
      });
    }
    next();
  };
};
