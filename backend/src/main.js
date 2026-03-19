import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { getEnvVar } from "./getEnvVar.js";
import { connectDb } from "./db.js";
import { seedDatabase } from "./seed.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import reviewRoutes from "./routes/reviews.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/users.js";

const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = getEnvVar("STATIC_DIR", false) || path.join(__dirname, "../../frontend/dist");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(STATIC_DIR));

app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(STATIC_DIR, "index.html"));
});

async function start() {
    await connectDb();
    await seedDatabase();
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}.  CTRL+C to stop.`);
    });
}

start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
