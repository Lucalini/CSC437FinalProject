import { Router } from "express";
import Order from "../models/Order.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

router.post("/", authenticateToken, async (req, res) => {
    const { items, total, shipping } = req.body;

    if (!items || !items.length || total == null) {
        return res.status(400).json({ error: "Items and total are required" });
    }

    try {
        const order = new Order({
            userId: req.user.userId,
            items,
            total,
            shipping,
            status: "Processing",
        });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: "Failed to place order" });
    }
});

export default router;
