import { Router } from "express";
import User from "../models/User.js";
import { generateToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
    }
    if (password.length < 4) {
        return res.status(400).json({ error: "Password must be at least 4 characters" });
    }

    try {
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) {
            return res.status(409).json({ error: "Username or email already taken" });
        }

        const user = new User({ username, email, hashedPassword: password });
        await user.save();

        const token = generateToken(user);
        res.status(201).json({ token, user: user.toSafeObject() });
    } catch (err) {
        res.status(500).json({ error: "Registration failed" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const valid = await user.comparePassword(password);
        if (!valid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const token = generateToken(user);
        res.json({ token, user: user.toSafeObject() });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

export default router;
