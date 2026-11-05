"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { collectionDefinitions, collectionProducts } from "@/lib/collections";
import { ProductGrid } from "./products";
export function HomeCollections() {
  const [pages, setPages] = useState<Record<string, number>>({});
  return (
    <>
      {collectionDefinitions.map((collection) => {
        const items = collectionProducts(collection.id);
        const page = pages[collection.id] || 1;
        const size = 8;
        return (
          <section className="section" key={collection.id}>
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  A DIFFERENT COLLECTION, EVERY TIME
                </span>
                <h2>{collection.title}</h2>
                <p>
                  {collection.copy} {items.length} distinct listings.
                </p>
              </div>
              <Link
                className="text-link"
                href={`/products?collection=${collection.id}`}
              >
                Explore collection <ArrowRight size={17} />
              </Link>
            </div>
            <ProductGrid items={items.slice((page - 1) * size, page * size)} />
            <div className="pagination">
              <button
                className="btn"
                disabled={page === 1}
                onClick={() =>
                  setPages((p) => ({ ...p, [collection.id]: page - 1 }))
                }
              >
                Previous
              </button>
              <span>
                {(page - 1) * size + 1}–{Math.min(page * size, items.length)} of{" "}
                {items.length}
              </span>
              <button
                className="btn"
                disabled={page * size >= items.length}
                onClick={() =>
                  setPages((p) => ({ ...p, [collection.id]: page + 1 }))
                }
              >
                More products
              </button>
            </div>
          </section>
        );
      })}
    </>
  );
}
