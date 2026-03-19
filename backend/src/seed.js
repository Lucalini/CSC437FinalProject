import Product from "./models/Product.js";
import Review from "./models/Review.js";

const PRODUCTS = [
    {
        name: "Modular Desk Organizer",
        material: "PLA",
        category: "desk",
        rating: 4.7,
        reviewCount: 3,
        stock: "In stock",
        price: 18.0,
        description: "Stackable trays + pen cup. Ships in 2–3 days.",
        longDescription: "A modular set of trays you can stack and reconfigure. Great for pens, cables, SD cards, and desk odds and ends.",
        specs: [
            { label: "Dimensions", value: "180 × 120 × 45 mm (tray)" },
            { label: "Material", value: "PLA (multiple colors available)" },
            { label: "Finish", value: "Matte, light sanding" },
            { label: "Lead time", value: "2–3 business days" },
        ],
        variant: "Charcoal",
    },
    {
        name: "Articulated Crystal Dragon",
        material: "Resin",
        category: "decor",
        rating: 4.9,
        reviewCount: 1,
        stock: "Limited",
        price: 32.0,
        description: "Highly detailed poseable model. Display-ready finish.",
        longDescription: "A beautifully detailed poseable dragon model with crystal-clear resin finish. Each joint is articulated for dynamic display poses.",
        specs: [
            { label: "Dimensions", value: "260 × 90 × 110 mm" },
            { label: "Material", value: "Resin (clear teal)" },
            { label: "Finish", value: "Polished, UV-cured" },
            { label: "Lead time", value: "5–7 business days" },
        ],
        variant: "Clear teal",
    },
    {
        name: "Mechanical Keycap Set (3 pack)",
        material: "PETG",
        category: "gaming",
        rating: 4.6,
        reviewCount: 1,
        stock: "New",
        price: 12.0,
        description: "MX-compatible artisan caps. Choose colorway at checkout.",
        longDescription: "A set of three MX-compatible artisan keycaps, perfect for adding personality to your mechanical keyboard. Available in multiple colorways.",
        specs: [
            { label: "Compatibility", value: "Cherry MX / clones" },
            { label: "Material", value: "PETG (translucent)" },
            { label: "Finish", value: "Smooth, dye-sublimated legends" },
            { label: "Lead time", value: "1–2 business days" },
        ],
        variant: '"Nebula" mix',
    },
];

const SEED_REVIEWS = [
    { productIndex: 0, reviewer: "Jamie P.", rating: 5, comment: "Perfect fit for my desk drawer. The stackable feature is super useful." },
    { productIndex: 0, reviewer: "Sam K.", rating: 4, comment: "Good quality print. I'd love one more divider option, but overall great." },
    { productIndex: 0, reviewer: "Taylor W.", rating: 5, comment: "Arrived fast and looks clean. Holds my cables + USB drives nicely." },
    { productIndex: 1, reviewer: "Morgan L.", rating: 5, comment: "Stunning detail. The joints move smoothly and it looks amazing on my shelf." },
    { productIndex: 2, reviewer: "Casey R.", rating: 4, comment: "Love the translucent look. Fits my keyboard perfectly." },
];

export async function seedDatabase() {
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
        console.log("Database already seeded, skipping.");
        return;
    }

    console.log("Seeding database...");
    const createdProducts = await Product.insertMany(PRODUCTS);

    const reviewDocs = SEED_REVIEWS.map((r) => ({
        productId: createdProducts[r.productIndex]._id,
        userId: "000000000000000000000000",
        reviewer: r.reviewer,
        rating: r.rating,
        comment: r.comment,
    }));
    await Review.insertMany(reviewDocs);

    console.log(`Seeded ${createdProducts.length} products and ${reviewDocs.length} reviews.`);
}
