import test from "node:test";
import assert from "node:assert/strict";
import { products, categories } from "../src/lib/catalog";
import records from "../src/data/photo-products.json";
import {
  collectionDefinitions,
  collectionProducts,
} from "../src/lib/collections";
test("every listing uses the exact photograph assigned by its source product record", () => {
  for (const p of products) {
    const record = records.find((r) => `photo-${r.id}` === p.id)!;
    assert.ok(record);
    assert.equal(p.image, record._photo.url);
    assert.equal(p.name, record.title);
    assert.ok(p.image.startsWith("https://cdn.dummyjson.com/"));
    assert.ok(record._photo.bytes > 1000);
  }
});
test("image URLs and fetched image SHA-256 hashes are unique across the entire catalog", () => {
  assert.equal(new Set(products.map((p) => p.image)).size, products.length);
  assert.equal(new Set(products.map((p) => p.photoHash)).size, products.length);
});
test("home collections never repeat a product or its photograph", () => {
  const seen = new Set<string>();
  const photos = new Set<string>();
  for (const c of collectionDefinitions) {
    const items = collectionProducts(c.id);
    assert.ok(items.length > 0);
    for (const p of items) {
      assert.ok(!seen.has(p.id));
      assert.ok(!photos.has(p.image));
      seen.add(p.id);
      photos.add(p.image);
    }
  }
});
test("all exposed categories contain photo-backed products and no environmental measurements are invented", () => {
  for (const c of categories) assert.ok(products.some((p) => p.category === c));
  assert.ok(
    products.every(
      (p) =>
        p.carbon === null &&
        Object.values(p.attributes).every((a) => a.value === null),
    ),
  );
});
