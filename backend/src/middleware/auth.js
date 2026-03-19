import jwt from "jsonwebtoken";
import { getEnvVar } from "../getEnvVar.js";

const JWT_SECRET = getEnvVar("JWT_SECRET");

export function authenticateToken(req, res, next) {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
}

export function generateToken(user) {
    return jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: "24h" }
    );
}
