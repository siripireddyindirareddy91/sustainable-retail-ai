"use client";
import Link from "next/link";
import {
  Heart,
  ArrowUpRight,
  Star,
  Scale,
  Leaf,
  Check,
  ShoppingBag,
} from "lucide-react";
import { Product } from "@/lib/catalog";
import { assess } from "@/lib/engine";
import { useStore } from "./store";
export function ProductCard({
  product: p,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { state, toggle } = useStore();
  const score = assess(p).score;
  return (
    <article
      className="product-card"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="product-photo">
        <Link href={`/products/${p.id}`}>
          <img src={p.image} alt={p.name} loading="lazy" />
        </Link>
        <span className="product-tag">
          {score !== null && score >= 80
            ? "Mindful pick"
            : "Everyday essential"}
        </span>
        <button
          className={`save-button ${state.wishlist.includes(p.id) ? "saved" : ""}`}
          aria-label={`Save ${p.name}`}
          onClick={() => toggle("wishlist", p.id)}
        >
          <Heart
            size={17}
            fill={state.wishlist.includes(p.id) ? "currentColor" : "none"}
          />
        </button>
        <button
          className="compare-button"
          onClick={() => toggle("compare", p.id)}
        >
          <Scale size={14} />
          {state.compare.includes(p.id) ? "Added" : "Compare"}
        </button>
      </div>
      <div className="product-info">
        <div className="brand-row">
          <span>{p.brand}</span>
          <span>
            <Star size={12} fill="#dc9a26" color="#dc9a26" />
            {p.rating} <small>({p.reviews})</small>
          </span>
        </div>
        <Link href={`/products/${p.id}`} className="product-name">
          {p.name}
        </Link>
        <div className="price-row">
          <strong>₹{p.price.toLocaleString("en-IN")}</strong>
          <del>₹{p.originalPrice.toLocaleString("en-IN")}</del>
          <span>{Math.round((1 - p.price / p.originalPrice) * 100)}% off</span>
        </div>
        <div className="product-bottom">
          <span className="eco-score">
            <Leaf size={14} />
            {score ?? "—"}
            <small>/ 100 sample eco score</small>
          </span>
          <Link href={`/products/${p.id}`} aria-label={`View ${p.name}`}>
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </div>
    </article>
  );
}
export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="product-grid">
      {items.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
export function SaveActions({ id }: { id: string }) {
  const { state, toggle } = useStore();
  return (
    <div className="button-row">
      <button className="btn primary" onClick={() => toggle("cart", id)}>
        <ShoppingBag size={17} />
        {state.cart.includes(id) ? "Remove from demo bag" : "Add to demo bag"}
      </button>
      <button className="btn" onClick={() => toggle("wishlist", id)}>
        <Heart size={16} />
        {state.wishlist.includes(id) ? "Saved" : "Save"}
      </button>
      <button className="btn" onClick={() => toggle("compare", id)}>
        <Scale size={16} />
        {state.compare.includes(id) ? "Added" : "Compare"}
      </button>
    </div>
  );
}
