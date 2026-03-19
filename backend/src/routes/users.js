import { Router } from "express";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/me", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user.toSafeObject());
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

router.patch("/me", authenticateToken, async (req, res) => {
    const allowed = ["address", "preferredMaterial", "notifications"];
    const updates = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined) {
            updates[key] = req.body[key];
        }
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updates,
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user.toSafeObject());
    } catch (err) {
        res.status(500).json({ error: "Failed to update profile" });
    }
});

export default router;
