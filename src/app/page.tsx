import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Sparkles,
  ShieldCheck,
  SlidersHorizontal,
  Check,
  Headphones,
  Shirt,
  Armchair,
  Coffee,
  Footprints,
  Flower2,
  BookOpen,
  Dumbbell,
} from "lucide-react";
import {
  products,
  categories,
  PRODUCT_COUNT,
  categoryCounts,
} from "@/lib/catalog";
import { HomeCollections } from "@/components/home-collections";
const icons = [
  Headphones,
  Shirt,
  Shirt,
  Footprints,
  Coffee,
  Flower2,
  Armchair,
  Coffee,
  BookOpen,
  Dumbbell,
  BookOpen,
  Leaf,
];
export default function Home() {
  return (
    <>
      <div className="wrap">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="dot" /> GOOD FOR YOU. MORE MINDFUL OF THE PLANET.
            </div>
            <h1>
              Better choices.
              <br />A <em>greener</em> everyday.
            </h1>
            <p>
              Discover products that fit your life and your values.
              <br className="desktop" /> Thoughtful recommendations. Clear
              reasons. No guesswork.
            </p>
            <div className="button-row">
              <Link className="btn primary" href="/products">
                Explore better choices <ArrowUpRight size={18} />
              </Link>
              <Link className="text-link" href="/recommendations">
                <Sparkles size={17} /> Find my match <ArrowRight size={17} />
              </Link>
            </div>
            <div className="hero-proof">
              <span className="mini-leaves">
                <Leaf />
                <Leaf />
                <Leaf />
              </span>
              <div>
                <strong>Small choices. Meaningful questions.</strong>
                <small>
                  Explore {PRODUCT_COUNT} photo-backed demo products
                </small>
              </div>
            </div>
          </div>
          <div className="hero-art">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=85"
              alt="Green leaves and natural materials reflecting thoughtful everyday living"
            />
            <div className="hero-art-shade" />
            <div className="floating-note">
              <span className="note-icon">
                <Leaf size={24} />
              </span>
              <div>
                <strong>A little more intention.</strong>
                <small>In everything you bring home.</small>
              </div>
              <Check size={17} />
            </div>
            <span className="art-caption">LESS NOISE. MORE NATURE.</span>
          </div>
        </section>
        <div className="disclosure">
          <ShieldCheck size={15} />
          <span>
            A transparent demo: sample products, illustrative scores, real
            explanations. No live marketplace or verified environmental claims.
          </span>
          <Link href="/explainability">
            Learn more <ArrowUpRight size={13} />
          </Link>
        </div>
        <section className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A BETTER WAY TO BROWSE</span>
              <h2>Find your kind of everyday.</h2>
            </div>
            <Link className="text-link" href="/products">
              All categories <ArrowRight size={17} />
            </Link>
          </div>
          <div className="category-grid">
            {categories.map((category) => {
              const Icon = icons[categories.indexOf(category)];
              return (
                <Link
                  key={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                >
                  <span>
                    <Icon size={26} />
                  </span>
                  <strong>
                    {category === "Beauty & Personal Care"
                      ? "Beauty & care"
                      : category === "Eco-Friendly Products"
                        ? "Eco essentials"
                        : category}
                  </strong>
                  <small>
                    {categoryCounts[category]} photo-backed products{" "}
                    <ArrowUpRight size={12} />
                  </small>
                </Link>
              );
            })}
          </div>
        </section>
        <HomeCollections />
        <section className="editorial">
          <div>
            <span className="eyebrow">YOUR VALUES. YOUR RECOMMENDATIONS.</span>
            <h2>
              Shopping that gets you.
              <br />
              And tells you <em>why.</em>
            </h2>
            <p>
              Set your budget, choose what matters, and explore recommendations
              with a transparent breakdown of every match.
            </p>
            <Link href="/recommendations" className="btn primary">
              Make it personal <Sparkles size={17} />
            </Link>
          </div>
          <div className="reason-preview">
            <div>
              <span className="icon-tile">
                <Sparkles />
              </span>
              <span>
                <strong>Why this made your list</strong>
                <small>A recommendation you can understand.</small>
              </span>
              <span className="pill">Explainable AI</span>
            </div>
            {[
              ["Fits your budget", "Price suitability", "90%"],
              ["Matches your preferences", "Category relevance", "100%"],
              ["Shows its sustainability data", "Sample completeness", "63%"],
            ].map(([title, sub, val]) => (
              <div key={title}>
                <Check size={16} />
                <span>
                  <strong>{title}</strong>
                  <small>{sub}</small>
                </span>
                <b>{val}</b>
              </div>
            ))}
            <Link href="/explainability">
              See how our recommendations work <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>
        <section className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">BECAUSE TRUST SHOULD BE STANDARD</span>
              <h2>No green claims without the fine print.</h2>
            </div>
          </div>
          <div className="principles">
            {[
              [
                ShieldCheck,
                "Transparency comes first",
                "We show what we know, where it comes from, and what is still missing.",
              ],
              [
                SlidersHorizontal,
                "You set the priorities",
                "Budget, quality, materials. Shape recommendations around what matters to you.",
              ],
              [
                Leaf,
                "Progress over perfection",
                "Compare documented attributes. Explore alternatives. Make a more informed choice.",
              ],
            ].map(([Icon, title, copy]) => {
              const I = Icon as typeof Leaf;
              return (
                <div key={String(title)}>
                  <I />
                  <h3>{String(title)}</h3>
                  <p>{String(copy)}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
