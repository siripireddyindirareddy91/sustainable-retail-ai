import test from "node:test";
import assert from "node:assert/strict";
import { products, categories } from "../src/lib/catalog";
import {
  collectionDefinitions,
  collectionProducts,
} from "../src/lib/collections";
import { GET } from "../src/app/api/product-image/[id]/route";
test("every category has exactly 105 distinct products and configurations", () => {
  assert.equal(products.length, 1260);
  assert.equal(new Set(products.map((p) => p.name)).size, 1260);
  for (const category of categories) {
    const items = products.filter((p) => p.category === category);
    assert.equal(items.length, 105);
    assert.equal(new Set(items.map((p) => p.id)).size, 105);
    assert.equal(new Set(items.map((p) => p.image)).size, 105);
  }
});
test("home collections contain 120 products each and never overlap", () => {
  const seen = new Set<string>();
  for (const definition of collectionDefinitions) {
    const items = collectionProducts(definition.id);
    assert.equal(items.length, 120);
    for (const product of items) {
      assert.ok(!seen.has(product.id));
      seen.add(product.id);
    }
  }
});
test("individual product artwork differs between listings and rejects unknown ids", async () => {
  const get = (id: string) =>
    GET(new Request("http://localhost"), { params: Promise.resolve({ id }) });
  const a = await get("eco-1001");
  const b = await get("eco-1002");
  assert.equal(a.headers.get("content-type"), "image/svg+xml");
  assert.notEqual(await a.text(), await b.text());
  assert.equal((await get("unknown")).status, 404);
});
