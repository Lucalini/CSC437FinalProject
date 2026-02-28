import express from "express";
import { getEnvVar } from "./getEnvVar.js";

const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const app = express();

app.get("/hello", (req, res) => {
    res.send("Hello, World!");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}.  CTRL+C to stop.`);
});
