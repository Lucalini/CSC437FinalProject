import mongoose from "mongoose";
import { getEnvVar } from "./getEnvVar.js";

const MONGO_URI = getEnvVar("MONGO_URI");

export async function connectDb() {
    if (!MONGO_URI) {
        throw new Error("MONGO_URI is not set");
    }
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
}
