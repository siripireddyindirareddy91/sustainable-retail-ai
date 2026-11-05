import test from "node:test";
import assert from "node:assert/strict";
import { products, categories } from "../src/lib/catalog";
import {
  assess,
  recommend,
  search,
  similar,
  retrieveQuery,
} from "../src/lib/engine";
test("catalog contains unique photo-backed sample records", () => {
  assert.equal(products.length, 192);
  assert.equal(new Set(products.map((p) => p.id)).size, products.length);
  assert.ok(categories.length >= 8);
  assert.ok(products.every((p) => p.demo && p.carbon === null));
});
test("search never returns unrelated products", () => {
  assert.ok(search({ query: "MacBook" }).length >= 1);
  assert.equal(search({ query: "not-a-real-product" }).length, 0);
  assert.ok(
    search({ query: "cotton" }).every((p) =>
      `${p.name} ${p.materials}`.toLowerCase().includes("cotton"),
    ),
  );
});
test("budget, category, rating and sustainability filters apply together", () => {
  for (const p of search({
    categories: ["Clothing"],
    budget: 2500,
    minRating: 4.2,
    minSustainability: 60,
  })) {
    assert.equal(p.category, "Clothing");
    assert.ok(p.price <= 2500);
    assert.ok(p.rating >= 4.2);
    assert.ok(assess(p).score! >= 60);
  }
});
test("missing environmental information remains null", () => {
  const p = structuredClone(products[0]);
  Object.values(p.attributes).forEach((a) => (a.value = null));
  const a = assess(p);
  assert.equal(a.score, null);
  assert.equal(a.completeness, 0);
  assert.equal(a.carbon, null);
});
test("incomplete scores normalize only observed attributes", () => {
  const p = structuredClone(products[0]);
  Object.values(p.attributes).forEach((a) => (a.value = null));
  p.attributes.materials.value = 80;
  p.attributes.packaging.value = 80;
  p.attributes.durability.value = 80;
  assert.equal(assess(p).score, 80);
});
test("all recommendation contributions add up to the displayed score", () => {
  for (const r of recommend()) {
    assert.equal(
      Math.round(Object.values(r.contributions).reduce((a, b) => a + b, 0)),
      r.score,
    );
    assert.ok(r.score >= 0 && r.score <= 100);
    assert.ok(r.explanation.length >= 4);
    assert.ok(r.confidence.startsWith("Low"));
    assert.ok(r.sources.length);
  }
});
test("unknown sustainability does not contribute a zero to ranking", () => {
  const p = structuredClone(products[0]);
  Object.values(p.attributes).forEach((a) => (a.value = null));
  const r = recommend({}, [p])[0];
  assert.equal(r.components.sustainability, null);
  assert.ok(!("sustainability" in r.contributions));
  assert.ok(Number.isFinite(r.score));
});
test("assistant parses Indian currency and retrieves only laptops", () => {
  const rs = retrieveQuery("Recommend sustainable laptops under ₹60,000");
  assert.ok(rs.every((r) => r.product.category === "Electronics"));

  assert.ok(rs.every((r) => r.product.price < 60000));
  assert.equal(retrieveQuery("laptop under 1000").length, 0);
});
test("assistant recyclable packaging query respects documented sample field", () => {
  assert.ok(
    retrieveQuery("Find products with recyclable packaging").every((r) =>
      r.product.packaging.startsWith("Recyclable"),
    ),
  );
});
test("content retrieval excludes the source product", () => {
  assert.equal(similar(products[0]).length, 4);
  assert.ok(similar(products[0]).every((p) => p.id !== products[0].id));
});
