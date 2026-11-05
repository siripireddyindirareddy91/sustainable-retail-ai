import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProductCard } from "../src/components/products";
import { products } from "../src/lib/catalog";
test("product card exposes detail, wishlist and comparison actions with sample labels", () => {
  const html = renderToStaticMarkup(
    React.createElement(ProductCard, { product: products[20] }),
  );
  assert.match(html, /eco data/);
  assert.match(html, /Save /);
  assert.match(html, /Compare/);
  assert.match(html, /\/products\/photo-/);
  assert.ok(!html.includes("undefined"));
});
