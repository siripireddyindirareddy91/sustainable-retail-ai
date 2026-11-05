import { products, Product } from "./catalog";
export const MODEL_VERSION = "transparent-hybrid-v1";
export const sustainabilityWeights: Record<string, number> = {
  materials: 0.2,
  packaging: 0.15,
  durability: 0.15,
  energy: 0.1,
  repairability: 0.15,
  recyclability: 0.15,
  certifications: 0.05,
  carbon: 0.05,
};
export function assess(p: Product) {
  const entries = Object.entries(p.attributes).filter(
    ([, a]) => a.value !== null,
  );
  const knownWeight = entries.reduce(
    (s, [k]) => s + sustainabilityWeights[k],
    0,
  );
  const score =
    entries.length < 3
      ? null
      : Math.round(
          entries.reduce(
            (s, [k, a]) => s + a.value! * sustainabilityWeights[k],
            0,
          ) / knownWeight,
        );
  return {
    score,
    completeness: Math.round((entries.length / 8) * 100),
    confidence: p.demo ? "Demonstration only" : "Unverified",
    knownWeight,
    methodology:
      "Available attributes are normalized to 0–100 and weighted; missing attributes are excluded, never assigned zero. At least three attributes required. Cross-category environmental superiority is not established.",
    weights: sustainabilityWeights,
    attributes: p.attributes,
    carbon: p.carbon,
    sources: [
      {
        name: "EcoRecommend synthetic seed dataset",
        status: "demonstration",
        url: null,
      },
    ],
    assessedAt: "2026-11-05",
    version: "sustainability-v1",
  };
}
export type Preferences = {
  query?: string;
  categories?: string[];
  budget?: number;
  minRating?: number;
  minSustainability?: number;
  brand?: string;
  priority?: string;
  weights?: Record<string, number>;
};
export function search(pref: Preferences = {}) {
  const q = (pref.query || "").toLowerCase().trim();
  const tokens = q.split(/\s+/).filter(Boolean);
  return products.filter(
    (p) =>
      tokens.every((t) =>
        `${p.name} ${p.category} ${p.brand} ${p.materials} ${p.packaging}`
          .toLowerCase()
          .includes(t),
      ) &&
      (!pref.categories?.length || pref.categories.includes(p.category)) &&
      (!pref.budget || p.price <= pref.budget) &&
      p.rating >= (pref.minRating || 0) &&
      (!pref.brand || p.brand === pref.brand) &&
      (!pref.minSustainability ||
        (assess(p).score ?? -1) >= pref.minSustainability),
  );
}
export function recommend(pref: Preferences = {}, catalog = search(pref)) {
  const weights = pref.weights || {
    preference: 0.3,
    quality: 0.2,
    price: 0.15,
    sustainability: 0.25,
    confidence: 0.1,
  };
  const total =
    Object.values(weights).reduce((s, v) => s + Math.max(0, v), 0) || 1;
  return catalog
    .map((p) => {
      const a = assess(p);
      const components = {
        preference: pref.categories?.includes(p.category) ? 100 : 65,
        quality: (p.rating / 5) * 100,
        price: pref.budget
          ? Math.max(0, 100 - (p.price / pref.budget) * 40)
          : 75,
        sustainability: a.score,
        confidence: p.demo ? 20 : a.completeness,
      };
      const active = Object.entries(components).filter(([, v]) => v !== null);
      const denominator =
        active.reduce((s, [k]) => s + (weights[k] || 0) / total, 0) || 1;
      const contributions = Object.fromEntries(
        active.map(([k, v]) => [
          k,
          Math.round(((v! * (weights[k] || 0)) / total / denominator) * 100) /
            100,
        ]),
      );
      const score = Math.round(
        Object.values(contributions).reduce((s, v) => s + v, 0),
      );
      return {
        id: `${MODEL_VERSION}:${p.id}`,
        product: p,
        score,
        components,
        contributions,
        weights,
        completeness: a.completeness,
        confidence: "Low — synthetic demonstration evidence",
        explanation: [
          `${p.category} ${pref.categories?.length ? "matches your category selection" : "is included in your discovery results"}.`,
          `₹${p.price.toLocaleString("en-IN")} ${pref.budget ? "fits your budget" : "is the sample catalog price"}.`,
          `Sample customer rating: ${p.rating}/5.`,
          a.score === null
            ? "Insufficient sustainability data to assess."
            : `Sample sustainability score ${a.score}/100; ${a.completeness}% data completeness.`,
          `Environmental claims and ratings are synthetic and are not independently verified.`,
        ],
        sources: a.sources,
        timestamp: new Date().toISOString(),
        modelVersion: MODEL_VERSION,
      };
    })
    .sort((a, b) =>
      pref.priority === "sustainability"
        ? (b.components.sustainability ?? -1) -
          (a.components.sustainability ?? -1)
        : pref.priority === "rating"
          ? b.product.rating - a.product.rating
          : pref.priority === "price"
            ? a.product.price - b.product.price
            : b.score - a.score,
    );
}
export function similar(p: Product) {
  const tokens = new Set(`${p.name} ${p.materials}`.toLowerCase().split(/\W+/));
  return products
    .filter((x) => x.id !== p.id)
    .map((x) => ({
      p: x,
      score:
        (x.category === p.category ? 5 : 0) +
        `${x.name} ${x.materials}`
          .toLowerCase()
          .split(/\W+/)
          .filter((t) => tokens.has(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.p);
}
export function retrieveQuery(message: string) {
  const text = message.toLowerCase();
  const budget = text.match(
    /(?:under|below|budget|₹|rs\.?)[\s₹]*(\d[\d,]*)\s*(k)?/,
  );
  const amount = budget
    ? Number(budget[1].replace(/,/g, "")) * (budget[2] ? 1000 : 1)
    : undefined;
  const mappings: [RegExp, string][] = [
    [/laptop|speaker|headphone|electronic/, "Electronics"],
    [/clothing|shirt|cotton|tee|trouser/, "Clothing"],
    [/shoe|sneaker|footwear/, "Footwear"],
    [/bottle|kitchen|kettle/, "Home & Kitchen"],
    [/beauty|soap|shampoo/, "Beauty & Personal Care"],
    [/yoga|fitness|gym/, "Sports & Fitness"],
    [/book/, "Books"],
    [/bag|backpack|wallet/, "Fashion"],
  ];
  const category = mappings.find(([re]) => re.test(text))?.[1];
  let found = search({
    budget: amount,
    categories: category ? [category] : undefined,
  });
  const nouns = [
    "laptop",
    "speaker",
    "headphone",
    "shirt",
    "cotton",
    "tee",
    "sneaker",
    "bottle",
    "kettle",
    "shampoo",
    "soap",
    "yoga",
    "backpack",
  ];
  const noun = nouns.find((n) => text.includes(n));
  if (noun)
    found = found.filter((p) =>
      `${p.name} ${p.materials}`.toLowerCase().includes(noun),
    );
  if (/recyclable packaging/.test(text))
    found = found.filter((p) => p.packaging.startsWith("Recyclable"));
  return recommend(
    {
      budget: amount,
      categories: category ? [category] : undefined,
      priority: /most sustainable|best sustainability/.test(text)
        ? "sustainability"
        : undefined,
    },
    found,
  ).slice(0, 4);
}
