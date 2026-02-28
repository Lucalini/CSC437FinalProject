export const PRODUCTS = [
  {
    id: 1,
    name: "Modular Desk Organizer",
    material: "PLA",
    category: "desk",
    rating: 4.7,
    reviewCount: 128,
    stock: "In stock",
    price: 18.0,
    description: "Stackable trays + pen cup. Ships in 2–3 days.",
    longDescription:
      "A modular set of trays you can stack and reconfigure. Great for pens, cables, SD cards, and desk odds and ends.",
    specs: [
      { label: "Dimensions", value: "180 × 120 × 45 mm (tray)" },
      { label: "Material", value: "PLA (multiple colors available)" },
      { label: "Finish", value: "Matte, light sanding" },
      { label: "Lead time", value: "2–3 business days" },
    ],
    variant: "Charcoal",
  },
  {
    id: 2,
    name: "Articulated Crystal Dragon",
    material: "Resin",
    category: "decor",
    rating: 4.9,
    reviewCount: 64,
    stock: "Limited",
    price: 32.0,
    description: "Highly detailed poseable model. Display-ready finish.",
    longDescription:
      "A beautifully detailed poseable dragon model with crystal-clear resin finish. Each joint is articulated for dynamic display poses.",
    specs: [
      { label: "Dimensions", value: "260 × 90 × 110 mm" },
      { label: "Material", value: "Resin (clear teal)" },
      { label: "Finish", value: "Polished, UV-cured" },
      { label: "Lead time", value: "5–7 business days" },
    ],
    variant: "Clear teal",
  },
  {
    id: 3,
    name: "Mechanical Keycap Set (3 pack)",
    material: "PETG",
    category: "gaming",
    rating: 4.6,
    reviewCount: 203,
    stock: "New",
    price: 12.0,
    description: "MX-compatible artisan caps. Choose colorway at checkout.",
    longDescription:
      'A set of three MX-compatible artisan keycaps, perfect for adding personality to your mechanical keyboard. Available in multiple colorways.',
    specs: [
      { label: "Compatibility", value: "Cherry MX / clones" },
      { label: "Material", value: "PETG (translucent)" },
      { label: "Finish", value: "Smooth, dye-sublimated legends" },
      { label: "Lead time", value: "1–2 business days" },
    ],
    variant: '"Nebula" mix',
  },
];

export const INITIAL_REVIEWS = [
  {
    id: 1,
    productId: 1,
    reviewer: "Jamie P.",
    rating: 5,
    comment: "Perfect fit for my desk drawer. The stackable feature is super useful.",
  },
  {
    id: 2,
    productId: 1,
    reviewer: "Sam K.",
    rating: 4,
    comment: "Good quality print. I'd love one more divider option, but overall great.",
  },
  {
    id: 3,
    productId: 1,
    reviewer: "Taylor W.",
    rating: 5,
    comment: "Arrived fast and looks clean. Holds my cables + USB drives nicely.",
  },
  {
    id: 4,
    productId: 2,
    reviewer: "Morgan L.",
    rating: 5,
    comment: "Stunning detail. The joints move smoothly and it looks amazing on my shelf.",
  },
  {
    id: 5,
    productId: 3,
    reviewer: "Casey R.",
    rating: 4,
    comment: "Love the translucent look. Fits my keyboard perfectly.",
  },
];

export const INITIAL_ORDERS = [
  {
    id: "PM-1042",
    date: "Feb 2, 2026",
    status: "Shipped",
    items: "Desk Organizer (2), Keycaps (1)",
  },
  {
    id: "PM-1031",
    date: "Jan 21, 2026",
    status: "Processing",
    items: "Crystal Dragon (1)",
  },
  {
    id: "PM-1019",
    date: "Jan 3, 2026",
    status: "Completed",
    items: "Cable clips (6), Phone stand (1)",
  },
];

export const CATEGORIES = [
  { value: "", label: "All categories" },
  { value: "desk", label: "Desk & organizers" },
  { value: "decor", label: "Decor" },
  { value: "gaming", label: "Gaming" },
  { value: "parts", label: "Replacement parts" },
];

export const MATERIALS = [
  { value: "", label: "Any" },
  { value: "PLA", label: "PLA" },
  { value: "PETG", label: "PETG" },
  { value: "Resin", label: "Resin" },
];

export const SORT_OPTIONS = [
  { value: "popular", label: "Most popular" },
  { value: "new", label: "Newest" },
  { value: "price_asc", label: "Price (low → high)" },
  { value: "price_desc", label: "Price (high → low)" },
];
