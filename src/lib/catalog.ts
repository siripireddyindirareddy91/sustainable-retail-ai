export const categories = [
  "Electronics",
  "Fashion",
  "Clothing",
  "Footwear",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Furniture",
  "Grocery",
  "Accessories",
  "Sports & Fitness",
  "Books",
  "Eco-Friendly Products",
];
export type Evidence = {
  value: number | null;
  status: "demonstration" | "unavailable";
  note: string;
};
export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  materials: string;
  packaging: string;
  carbon: number | null;
  attributes: Record<string, Evidence>;
  specifications: Record<string, string>;
  demo: boolean;
};
const groups = [
  [
    "Solar Bluetooth Speaker",
    "Refurbished Everyday Laptop",
    "Wireless Over-Ear Headphones",
    "Energy-Saving Desk Monitor",
    "Rechargeable Reading Light",
  ],
  [
    "Recycled Canvas Tote",
    "Everyday Cork Wallet",
    "Linen Weekend Bag",
    "Recycled Travel Backpack",
    "Hemp Crossbody Bag",
  ],
  [
    "Organic Cotton Essential Tee",
    "Relaxed Linen Shirt",
    "Hemp Everyday Trousers",
    "Recycled Fleece Jacket",
    "Cotton Lounge Set",
  ],
  [
    "Recycled Knit Sneakers",
    "Cork Footbed Sandals",
    "Canvas Walking Shoes",
    "Everyday Trail Trainers",
    "Natural Rubber Flip Flops",
  ],
  [
    "Insulated Steel Bottle",
    "Bamboo Kitchen Essentials",
    "Recycled Glass Storage Set",
    "Low-Energy Electric Kettle",
    "Cast Iron Everyday Pan",
  ],
  [
    "Solid Shampoo Bar",
    "Bamboo Toothbrush Set",
    "Refillable Body Wash",
    "Plant-Based Soap Collection",
    "Reusable Cotton Face Pads",
  ],
  [
    "FSC-Style Oak Side Table",
    "Modular Bamboo Bookshelf",
    "Reclaimed Wood Stool",
    "Recycled Fabric Lounge Chair",
    "Compact Writing Desk",
  ],
  [
    "Organic Breakfast Oats",
    "Shade-Grown Coffee Beans",
    "Loose Leaf Green Tea",
    "Plant-Based Pantry Box",
    "Mixed Nut Snack Jar",
  ],
  [
    "Cork Laptop Sleeve",
    "Recycled Fabric Cap",
    "Steel Travel Cutlery",
    "Reusable Shopping Pouches",
    "Minimal Canvas Belt",
  ],
  [
    "Natural Rubber Yoga Mat",
    "Steel Fitness Bottle",
    "Recycled Gym Duffel",
    "Cork Yoga Blocks",
    "Adjustable Resistance Bands",
  ],
  [
    "The Circular Living Handbook",
    "A Practical Guide to Repair",
    "Small-Space Gardening",
    "The Mindful Wardrobe",
    "Climate Science Explained",
  ],
  [
    "Home Compost Starter",
    "Reusable Beeswax Wraps",
    "Refill Cleaning Starter Kit",
    "Recycled Paper Notebook Set",
    "Plantable Seed Pencils",
  ],
];
const photos = [
  "photo-1608043152269-423dbba4e7e1",
  "photo-1553062407-98eeb64c6a62",
  "photo-1521572163474-6864f9cf17ab",
  "photo-1542291026-7eec264c27ff",
  "photo-1602143407151-7111542de6e8",
  "photo-1608571423902-eed4a5ad8108",
  "photo-1494438639946-1ebd1d20bf85",
  "photo-1447933601403-0c6688de566e",
  "photo-1553062407-98eeb64c6a62",
  "photo-1544367567-0f2fcb009e0b",
  "photo-1544947950-fa07a98d237f",
  "photo-1542601906990-b4d3fb778b09",
];
export const products: Product[] = groups.flatMap((names, c) =>
  names.map((name, i) => {
    const n = c * 5 + i;
    return {
      id: `eco-${String(n + 1).padStart(3, "0")}`,
      name,
      brand: ["Terra & Co.", "Everkind", "Rooted", "Greenhouse", "Loop Studio"][
        i
      ],
      category: categories[c],
      price:
        c === 0
          ? [3499, 45999, 5999, 12999, 1499][i]
          : Math.round((399 + c * 137 + i * 460) / 10) * 10,
      originalPrice:
        c === 0
          ? [4499, 52999, 7499, 14999, 1999][i]
          : Math.round((599 + c * 160 + i * 560) / 10) * 10,
      rating: Number((4 + (n % 9) / 10).toFixed(1)),
      reviews: 23 + n * 17,
      description: `${name} is a fictional demonstration product created to explore thoughtful shopping. Compare its sample attributes, price and rating using transparent recommendation rules. No live stock or environmental certification is claimed.`,
      image: `https://images.unsplash.com/${photos[c]}?auto=format&fit=crop&w=700&q=80`,
      materials: [
        "Recycled textile blend (sample)",
        "Cotton and natural fibres (sample)",
        "Mixed materials; composition unavailable",
      ][i % 3],
      packaging:
        i % 3 === 0
          ? "Recyclable paper packaging (sample)"
          : "Packaging information unavailable",
      carbon: null,
      attributes: Object.fromEntries(
        [
          "materials",
          "packaging",
          "durability",
          "energy",
          "repairability",
          "recyclability",
          "certifications",
          "carbon",
        ].map((key, j) => [
          key,
          {
            value:
              j === 7 || j === 6 || (n + j) % 4 === 0
                ? null
                : 55 + ((n * 7 + j * 11) % 43),
            status:
              j === 7 || j === 6 || (n + j) % 4 === 0
                ? "unavailable"
                : "demonstration",
            note: "Synthetic design data, not independently verified environmental evidence.",
          },
        ]),
      ),
      specifications: {
        Collection: "Everyday essentials",
        Warranty: "Not available — sample listing",
        Availability: "Demonstration only; not for sale",
      },
      demo: true,
    };
  }),
);
