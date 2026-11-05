import { products } from "../src/lib/catalog";
import { collectionProducts } from "../src/lib/collections";
import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { GET, POST, DELETE } from "../src/app/api/[...path]/route";
const call = (path: string, method = "GET", body?: unknown) => {
  const req = new NextRequest(`http://localhost/api/${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return (method === "GET" ? GET : method === "DELETE" ? DELETE : POST)(req, {
    params: Promise.resolve({ path: path.split("?")[0].split("/") }),
  });
};
test("API products searches and paginates", async () => {
  const r = await call("products?q=MacBook");
  assert.equal(r.status, 200);
  const d = await r.json();
  assert.ok(d.total >= 1);
  assert.match(d.products[0].name, /MacBook/);
});
test("unknown product returns 404", async () =>
  assert.equal((await call("products/no-such-id")).status, 404));
test("invalid recommendation preferences return 400", async () =>
  assert.equal(
    (await call("recommendations", "POST", { budget: -1 })).status,
    400,
  ));
test("anonymous administrator access is rejected", async () =>
  assert.equal((await call("admin/dashboard")).status, 403));
test("anonymous product mutation is rejected", async () =>
  assert.equal((await call("products", "POST", {})).status, 403));
test("private wishlist requires authentication", async () =>
  assert.equal((await call("wishlist")).status, 401));
test("comparison requires two to four existing products", async () => {
  assert.equal(
    (await call("compare", "POST", { ids: [products[0].id] })).status,
    400,
  );
  assert.equal(
    (await call("compare", "POST", { ids: [products[0].id, products[1].id] }))
      .status,
    200,
  );
  assert.equal(
    (await call("compare", "POST", { ids: [products[0].id, "bad"] })).status,
    404,
  );
});
test("AI works without credentials and discloses sample data", async () => {
  const r = await call("ai/chat", "POST", { message: "laptop under 150000" });
  const d = await r.json();
  assert.equal(r.status, 200);
  assert.equal(d.mode, "deterministic");
  assert.match(d.answer, /synthetic|demonstration/i);
  assert.ok(d.products.length > 0);
});
test("account creation without configured database returns clear unavailable status", async () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL)
    assert.equal(
      (
        await call("auth/signup", "POST", {
          email: "test@example.com",
          password: "longpassword",
        })
      ).status,
      503,
    );
});
test("catalog API paginates all photo-backed products", async () => {
  const d = await (await call("products?limit=60")).json();
  assert.equal(d.total, products.length);
  assert.equal(d.products.length, 60);
});
test("collection API returns only its assigned records", async () => {
  const d = await (await call("products?collection=materials")).json();
  assert.equal(d.total, collectionProducts("materials").length);
});
test("authentication readiness is available without collecting credentials", async () => {
  const d = await (await call("auth/config")).json();
  assert.equal(typeof d.configured, "boolean");
  assert.equal(d.provider, "supabase");
});
