import photoRecords from "../data/photo-products.json";
const categoryMap: Record<string, string> = {
  beauty: "Beauty & Personal Care",
  fragrances: "Beauty & Personal Care",
  "skin-care": "Beauty & Personal Care",
  furniture: "Furniture",
  groceries: "Grocery",
  "home-decoration": "Home & Kitchen",
  "kitchen-accessories": "Home & Kitchen",
  laptops: "Electronics",
  "mobile-accessories": "Electronics",
  smartphones: "Electronics",
  tablets: "Electronics",
  "mens-shirts": "Clothing",
  "womens-dresses": "Clothing",
  tops: "Clothing",
  "mens-shoes": "Footwear",
  "womens-shoes": "Footwear",
  "womens-bags": "Fashion",
  "mens-watches": "Accessories",
  "womens-watches": "Accessories",
  sunglasses: "Accessories",
  "womens-jewellery": "Accessories",
  "sports-accessories": "Sports & Fitness",
  motorcycle: "Automotive",
  vehicle: "Automotive",
};
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
  photoSource?: string;
  photoHash?: string;
};
export const products: Product[] = photoRecords.map((p) => ({
  id: `photo-${p.id}`,
  name: p.title,
  brand: p.brand || "Brand not supplied",
  category: categoryMap[p.category] || "Accessories",
  price: Math.round(p.price * 85),
  originalPrice: Math.round((p.price * 85) / (1 - p.discountPercentage / 100)),
  rating: p.rating,
  reviews: p.reviews.length,
  description: `${p.description} Imported from the DummyJSON demonstration product dataset with its product-specific photograph. Prices converted at an illustrative fixed INR factor, not a live exchange rate. Stock, ratings and descriptions are sample data; no live sale or environmental verification is claimed.`,
  image: p._photo.url,
  materials: "Unavailable — source provides no documented material composition",
  packaging: "Unavailable — no packaging evidence supplied",
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
    ].map((k) => [
      k,
      {
        value: null,
        status: "unavailable",
        note: "No supporting environmental evidence supplied by the source.",
      },
    ]),
  ),
  specifications: {
    "Source category": p.category,
    "Source product ID": String(p.id),
    SKU: p.sku,
    "Source warranty": p.warrantyInformation,
    "Photo provenance": "Product image mapped by source product ID",
    "Image checked": p._photo.checkedAt,
    Availability: "Demonstration dataset; not a live offer",
  },
  demo: true,
  photoSource: p._photo.source,
  photoHash: p._photo.sha256,
}));
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
  "Automotive",
].filter((c) => products.some((p) => p.category === c));
export const PRODUCT_COUNT = products.length;
export const categoryCounts = Object.fromEntries(
  categories.map((c) => [c, products.filter((p) => p.category === c).length]),
);
