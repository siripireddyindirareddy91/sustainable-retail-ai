"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { categories, categoryCounts, PRODUCT_COUNT } from "@/lib/catalog";
import { LayoutGrid, ChevronRight, Leaf } from "lucide-react";
export function CategorySidebar() {
  const path = usePathname();
  const params = useSearchParams();
  const active = path === "/products" ? params.get("category") : null;
  return (
    <aside className="category-rail" aria-label="Shopping categories">
      <div className="category-rail-title">
        <LayoutGrid size={17} />
        <strong>Shop by category</strong>
      </div>
      <Link
        className={
          path === "/products" && !active
            ? "category-rail-link selected"
            : "category-rail-link"
        }
        href="/products"
      >
        <span>All products</span>
        <small>{PRODUCT_COUNT}</small>
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/products?category=${encodeURIComponent(category)}`}
          aria-current={active === category ? "page" : undefined}
          className={`category-rail-link ${active === category ? "selected" : ""}`}
        >
          <span>{category}</span>
          <small>{categoryCounts[category]}</small>
          <ChevronRight size={13} />
        </Link>
      ))}
      <div className="category-rail-note">
        <Leaf size={22} />
        <strong>More clarity. Better choices.</strong>
        <p>Source-matched photographs and transparent product information.</p>
        <Link href="/explainability">How recommendations work →</Link>
      </div>
    </aside>
  );
}
