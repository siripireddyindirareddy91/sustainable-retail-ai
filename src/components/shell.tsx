"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Leaf,
  Search,
  Heart,
  ShoppingBag,
  ArrowUpRight,
  Scale,
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "./store";
const links = [
  ["/products", "Discover"],
  ["/recommendations", "For you"],
  ["/sustainability", "Our impact"],
  ["/explainability", "How it works"],
];
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { state } = useStore();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="announcement">
        <span>A little more thoughtful. A lot more transparent.</span>
        <Link href="/explainability">
          Meet your greener shopping companion <ArrowUpRight size={13} />
        </Link>
      </div>
      <header>
        <div className="nav wrap">
          <Link href="/" className="logo">
            <span className="logo-mark">
              <Leaf size={24} />
            </span>
            eco<span className="logo-light">recommend</span>
            <small>AI</small>
          </Link>
          <nav className={open ? "open" : ""}>
            {links.map(([url, label]) => (
              <Link
                onClick={() => setOpen(false)}
                className={path === url ? "active" : ""}
                key={url}
                href={url}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <Link href="/compare" aria-label="Compare products">
              <Scale size={19} />
              {state.compare.length > 0 && <b>{state.compare.length}</b>}
            </Link>
            <Link href="/wishlist" aria-label="Wishlist">
              <Heart size={19} />
              {state.wishlist.length > 0 && <b>{state.wishlist.length}</b>}
            </Link>
            <Link href="/cart" aria-label="Shopping bag">
              <ShoppingBag size={19} />
              {state.cart.length > 0 && <b>{state.cart.length}</b>}
            </Link>
            <Link className="account-link" href="/dashboard">
              My account <ArrowUpRight size={14} />
            </Link>
            <button
              className="mobile-menu icon-button"
              aria-label="Toggle navigation"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <div className="search-row wrap">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            router.push(
              `/products?q=${encodeURIComponent(String(data.get("q") || ""))}`,
            );
          }}
        >
          <Search size={18} />
          <input
            name="q"
            aria-label="Search products"
            placeholder="Find your next better choice..."
          />
          <button type="submit">
            Search <ArrowUpRight size={15} />
          </button>
        </form>
        <Link href="/assistant">
          <Sparkles size={17} /> Ask your AI shopping assistant{" "}
          <ArrowUpRight size={15} />
        </Link>
      </div>
      <main>{children}</main>
      <section className="trust-strip wrap">
        <div>
          <ShieldCheck />
          <span>
            <strong>Evidence, before everything</strong>
            <small>Sources and missing data, made visible.</small>
          </span>
        </div>
        <div>
          <Sparkles />
          <span>
            <strong>Recommendations with a reason</strong>
            <small>Understand every factor behind your match.</small>
          </span>
        </div>
        <div>
          <Leaf />
          <span>
            <strong>Thoughtful by design</strong>
            <small>A little clarity for your everyday choices.</small>
          </span>
        </div>
      </section>
      <footer>
        <div className="wrap footer-inner">
          <div>
            <Link href="/" className="logo">
              <Leaf /> ecorecommend <small>AI</small>
            </Link>
            <p>
              Shop smarter. Choose greener.
              <br />
              Trust every recommendation.
            </p>
            <small>Demonstration catalog. No purchases or live stock.</small>
          </div>
          <div>
            <strong>Explore</strong>
            <Link href="/products">All products</Link>
            <Link href="/recommendations">Recommendations</Link>
            <Link href="/compare">Compare products</Link>
          </div>
          <div>
            <strong>Built on trust</strong>
            <Link href="/sustainability">Sustainability methodology</Link>
            <Link href="/explainability">Explainable AI</Link>
            <Link href="/assistant">Shopping assistant</Link>
          </div>
          <div>
            <strong>Your space</strong>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/admin">Administration</Link>
          </div>
        </div>
        <div className="wrap footer-bottom">
          © 2026 EcoRecommend AI. An independent academic demonstration.
          <span>
            Transparency looks good on everyone. <Leaf size={13} />
          </span>
        </div>
      </footer>
    </>
  );
}
