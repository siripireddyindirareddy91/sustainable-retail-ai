import { products, Product } from "./catalog";
import { assess } from "./engine";
export const collectionDefinitions = [
  {
    id: "discovery",
    title: "Fresh discoveries",
    copy: "A diverse starting point across every category.",
  },
  {
    id: "materials",
    title: "Home & everyday finds",
    copy: "Product-matched photographs. Environmental evidence is marked unavailable.",
  },
  {
    id: "top-rated",
    title: "Highly rated finds",
    copy: "Explore a separate collection of sample customer favourites.",
  },
  {
    id: "value",
    title: "Everyday value",
    copy: "Distinct, budget-friendly finds for your daily routine.",
  },
];
export function collectionProducts(collection: string): Product[] {
  const index = collectionDefinitions.findIndex((c) => c.id === collection);
  return index < 0
    ? []
    : products
        .filter((_, i) => i % 4 === index)
        .sort((a, b) =>
          index === 1
            ? (assess(b).score ?? -1) - (assess(a).score ?? -1)
            : index === 2
              ? b.rating - a.rating
              : index === 3
                ? a.price - b.price
                : 0,
        )
        .slice(0, 120);
}
