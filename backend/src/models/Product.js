import mongoose from "mongoose";

const specSchema = new mongoose.Schema({
    label: String,
    value: String,
}, { _id: false });

const productSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    material:    { type: String, required: true },
    category:    { type: String, required: true },
    rating:      { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    stock:       { type: String, default: "In stock" },
    price:       { type: Number, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    specs:       [specSchema],
    variant:     { type: String, default: "" },
});

export default mongoose.model("Product", productSchema);
