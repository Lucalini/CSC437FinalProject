import { Router } from "express";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/product/:productId", async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});

router.post("/", authenticateToken, async (req, res) => {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
        return res.status(400).json({ error: "productId, rating, and comment are required" });
    }

    try {
        const review = new Review({
            productId,
            userId: req.user.userId,
            reviewer: req.user.username,
            rating,
            comment,
        });
        await review.save();

        const count = await Review.countDocuments({ productId });
        const agg = await Review.aggregate([
            { $match: { productId: review.productId } },
            { $group: { _id: null, avg: { $avg: "$rating" } } },
        ]);
        const avgRating = agg.length > 0 ? Math.round(agg[0].avg * 10) / 10 : rating;
        await Product.findByIdAndUpdate(productId, { rating: avgRating, reviewCount: count });

        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ error: "Failed to create review" });
    }
});

export default router;
