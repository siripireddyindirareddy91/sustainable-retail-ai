"use client";
import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Leaf,
  Sparkles,
  ArrowUpRight,
  SlidersHorizontal,
  ArrowRight,
  Send,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Lock,
  Check,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { categories, products, Product } from "@/lib/catalog";
import {
  assess,
  recommend,
  Preferences,
  sustainabilityWeights,
} from "@/lib/engine";
import { ProductGrid } from "./products";
import { useStore } from "./store";
import { browserDatabase } from "@/lib/browser";
type Rec = ReturnType<typeof recommend>[number];
async function api(path: string, body?: unknown, method?: string) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("eco-token") : null;
  const response = await fetch(`/api/${path}`, {
    method: method || (body ? "POST" : "GET"),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}
function Title({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="page-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="page-title">{title}</h1>
      <p>{copy}</p>
    </div>
  );
}
function Empty({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="empty">
      <Leaf size={35} />
      <h2>{title}</h2>
      <p>{copy}</p>
      <Link href="/products" className="btn primary">
        Explore the catalog <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
function Chart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div style={{ width: "100%", height: 270, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, bottom: 30, left: -18 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 }}
            angle={-15}
            textAnchor="end"
            interval={0}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#397454" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export function Workspace({ view }: { view: string }) {
  return (
    <div className="wrap page-space">
      {view === "products" ? (
        <Catalog />
      ) : view === "recommendations" ? (
        <Recommendations />
      ) : view === "sustainability" ? (
        <Sustainability />
      ) : view === "explainability" ? (
        <Explainability />
      ) : view === "compare" ? (
        <Compare />
      ) : view === "assistant" ? (
        <Assistant />
      ) : view === "wishlist" || view === "cart" ? (
        <Saved kind={view} />
      ) : view === "login" || view === "signup" ? (
        <Auth signup={view === "signup"} />
      ) : view === "admin" ? (
        <Admin />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
function Catalog() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [budget, setBudget] = useState(60000);
  const [rating, setRating] = useState(0);
  const [eco, setEco] = useState(0);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{
    products: Product[];
    total: number;
    pages: number;
  }>({ products: [], total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const p = searchParams;
    setQ(p.get("q") || "");
    setCategory(p.get("category") || "");
    setCollection(p.get("collection") || "");
    setSort(p.get("sort") || "");
    setPage(1);
  }, [searchParams]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      fetch(
        `/api/products?${new URLSearchParams({ q, category, collection, budget: String(budget), rating: String(rating), sustainability: String(eco), sort, page: String(page) })}`,
        { signal: controller.signal },
      )
        .then(async (r) => {
          if (!r.ok) throw new Error("Catalog unavailable");
          return r.json();
        })
        .then((d) => {
          setData(d);
          setError("");
        })
        .catch((e) => {
          if (e.name !== "AbortError")
            setError("The catalog could not load. Please retry.");
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, category, collection, budget, rating, eco, sort, page]);
  return (
    <>
      <Title
        eyebrow="THE CONSIDERED COLLECTION"
        title="Everyday finds. Better informed."
        copy={`Explore ${products.length} photo-backed demonstration products. Each photograph is mapped to its source product.`}
      />
      <div className="catalog-layout">
        <aside className="filters">
          <h3>
            <SlidersHorizontal size={17} /> Refine your discovery
          </h3>
          <label>
            Search
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Product, material or brand"
            />
          </label>
          <label>
            Category
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Budget: ₹{budget.toLocaleString("en-IN")}
            <input
              type="range"
              min="500"
              max="60000"
              step="500"
              value={budget}
              onChange={(e) => {
                setBudget(Number(e.target.value));
                setPage(1);
              }}
            />
          </label>
          <label>
            Minimum rating
            <select
              value={rating}
              onChange={(e) => {
                setRating(Number(e.target.value));
                setPage(1);
              }}
            >
              {[0, 4, 4.3, 4.5, 4.8].map((v) => (
                <option key={v} value={v}>
                  {v ? `${v}+ stars` : "Any rating"}
                </option>
              ))}
            </select>
          </label>
          <label>
            Minimum sample eco score
            <select
              value={eco}
              onChange={(e) => {
                setEco(Number(e.target.value));
                setPage(1);
              }}
            >
              {[0, 60, 70, 80, 90].map((v) => (
                <option key={v} value={v}>
                  {v ? `${v} / 100` : "Any score"}
                </option>
              ))}
            </select>
          </label>
          <button
            className="text-link"
            onClick={() => {
              setQ("");
              setCategory("");
              setCollection("");
              setBudget(60000);
              setRating(0);
              setEco(0);
              setSort("");
              setPage(1);
            }}
          >
            Reset filters <RefreshCw size={14} />
          </button>
          <div className="filter-note">
            <ShieldCheck size={23} />
            <strong>Clarity is part of the product.</strong>
            <p>
              All environmental attributes are synthetic examples. Missing data
              is always marked.
            </p>
          </div>
        </aside>
        <section>
          <div className="catalog-toolbar">
            <span>
              {loading
                ? "Finding your choices…"
                : `${data.total} products to explore`}
            </span>
            <label>
              Sort by{" "}
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating">Highest rated</option>
                <option value="sustainability">Sample eco score</option>
              </select>
            </label>
          </div>
          {error ? (
            <div className="error">
              {error}
              <button onClick={() => setPage((p) => p + 1)}>Retry</button>
            </div>
          ) : loading ? (
            <div className="product-grid">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div className="skeleton" key={n} />
              ))}
            </div>
          ) : data.products.length ? (
            <ProductGrid items={data.products} />
          ) : (
            <Empty
              title="No matches this time"
              copy="Try a broader search, another category, or a higher budget."
            />
          )}
          <div className="pagination">
            <button
              className="btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>
              Page {page} of {Math.max(1, data.pages)}
            </span>
            <button
              className="btn"
              disabled={page >= data.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
function Recommendations() {
  const [pref, setPref] = useState<Preferences>({
    budget: 6000,
    minRating: 4,
    categories: [],
    priority: "overall",
  });
  const [results, setResults] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toggle } = useStore();
  async function generate(e?: FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api("recommendations", pref);
      setResults(data.recommendations.slice(0, 8));
      localStorage.setItem("eco-preferences", JSON.stringify(pref));
      toggle("history", new Date().toISOString());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    try {
      const saved = localStorage.getItem("eco-preferences");
      if (saved) setPref(JSON.parse(saved));
    } catch {}
  }, []);
  return (
    <>
      <Title
        eyebrow="A LITTLE MORE YOU"
        title="Your priorities. Your perfect starting point."
        copy="Tell us what matters. Every match comes with the reasons behind it."
      />
      <div className="two-col recommendation-layout">
        <form className="panel preference-form" onSubmit={generate}>
          <h2>
            <Sparkles /> Shape your recommendations
          </h2>
          <label>Preferred categories</label>
          <div className="chips">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={pref.categories?.includes(c) ? "selected" : ""}
                onClick={() =>
                  setPref((p) => ({
                    ...p,
                    categories: p.categories?.includes(c)
                      ? p.categories.filter((x) => x !== c)
                      : [...(p.categories || []), c],
                  }))
                }
              >
                {c}
              </button>
            ))}
          </div>
          <label>
            Budget (₹)
            <input
              type="number"
              min="1"
              max="1000000"
              required
              value={pref.budget}
              onChange={(e) =>
                setPref((p) => ({ ...p, budget: Number(e.target.value) }))
              }
            />
          </label>
          <label>
            Minimum rating
            <select
              value={pref.minRating}
              onChange={(e) =>
                setPref((p) => ({ ...p, minRating: Number(e.target.value) }))
              }
            >
              {[0, 4, 4.3, 4.5].map((v) => (
                <option key={v} value={v}>
                  {v || "Any"}
                </option>
              ))}
            </select>
          </label>
          <label>
            Brand
            <select
              value={pref.brand || ""}
              onChange={(e) =>
                setPref((p) => ({ ...p, brand: e.target.value || undefined }))
              }
            >
              <option value="">All brands</option>
              {[...new Set(products.map((p) => p.brand))].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
          <label>
            What matters most?
            <select
              value={pref.priority}
              onChange={(e) => {
                const priority = e.target.value;
                setPref((p) => ({
                  ...p,
                  priority,
                  weights:
                    priority === "sustainability"
                      ? {
                          preference: 0.2,
                          quality: 0.15,
                          price: 0.1,
                          sustainability: 0.45,
                          confidence: 0.1,
                        }
                      : priority === "price"
                        ? {
                            preference: 0.2,
                            quality: 0.15,
                            price: 0.4,
                            sustainability: 0.15,
                            confidence: 0.1,
                          }
                        : priority === "rating"
                          ? {
                              preference: 0.2,
                              quality: 0.45,
                              price: 0.1,
                              sustainability: 0.15,
                              confidence: 0.1,
                            }
                          : undefined,
                }));
              }}
            >
              <option value="overall">Best overall match</option>
              <option value="sustainability">Sample sustainability</option>
              <option value="price">Best value</option>
              <option value="rating">Highest rated</option>
            </select>
          </label>
          <p className="muted">
            Carbon-based ranking is unavailable: no documented carbon
            measurements exist in this sample catalog.
          </p>
          <button disabled={loading} className="btn primary">
            {loading ? "Finding thoughtful matches…" : "Find my matches"}{" "}
            <Sparkles size={17} />
          </button>
          {error && <p className="error">{error}</p>}
        </form>
        <div>
          <div className="panel tinted">
            <ShieldCheck />
            <h2>There is a reason for every match.</h2>
            <p>
              Preference, quality, price, sustainability and evidence confidence
              contribute to a transparent weighted score. These are design
              weights, not scientifically validated constants.
            </p>
            <Link className="text-link" href="/explainability">
              Understand the model <ArrowRight size={16} />
            </Link>
          </div>
          {!results.length && (
            <Empty
              title="Your next good find starts here"
              copy="Choose your preferences and generate a personalized list."
            />
          )}
        </div>
      </div>
      {results.length > 0 && (
        <section className="section">
          <h2>Your considered shortlist</h2>
          <div className="rec-grid">
            {results.map((r) => (
              <div className="panel" key={r.id}>
                <div className="rec-header">
                  <img src={r.product.image} alt={r.product.name} />
                  <div>
                    <Link href={`/products/${r.product.id}`}>
                      <h3>{r.product.name}</h3>
                    </Link>
                    <p>₹{r.product.price.toLocaleString("en-IN")}</p>
                    <span className="pill">{r.score}% match</span>
                  </div>
                </div>
                {Object.entries(r.components).map(([k, v]) => (
                  <div className="score-row" key={k}>
                    <span>{k}</span>
                    <div>
                      <i style={{ width: `${v || 0}%` }} />
                    </div>
                    <strong>{v === null ? "Unknown" : Math.round(v)}</strong>
                  </div>
                ))}
                <details>
                  <summary>Why this made your list</summary>
                  {r.explanation.map((x) => (
                    <p key={x}>{x}</p>
                  ))}
                  <small>
                    {r.confidence} · {r.completeness}% completeness ·{" "}
                    {r.modelVersion}
                  </small>
                </details>
                <Link className="text-link" href={`/products/${r.product.id}`}>
                  Explore product <ArrowUpRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
function Sustainability() {
  const [id, setId] = useState(products[0].id);
  useEffect(() => {
    const p = new URLSearchParams(location.search).get("product");
    if (products.some((x) => x.id === p)) setId(p!);
  }, []);
  const p = products.find((p) => p.id === id)!;
  const a = assess(p);
  return (
    <>
      <Title
        eyebrow="LESS GUESSWORK. MORE CONTEXT."
        title="Look beyond the green label."
        copy="Explore the evidence, the methodology, and the information we do not have."
      />
      <label className="product-select">
        Explore a product
        <select value={id} onChange={(e) => setId(e.target.value)}>
          {products.map((p) => (
            <option value={p.id} key={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <div className="stats">
        <div className="panel">
          <span>Sample sustainability</span>
          <strong>
            {a.score ?? "—"}
            <small>/100</small>
          </strong>
          <p>Illustrative only</p>
        </div>
        <div className="panel">
          <span>Data completeness</span>
          <strong>{a.completeness}%</strong>
          <p>Known attributes / eight</p>
        </div>
        <div className="panel">
          <span>Carbon footprint</span>
          <strong className="stat-text">Unavailable</strong>
          <p>No lifecycle measurement</p>
        </div>
        <div className="panel">
          <span>Verification status</span>
          <strong className="stat-text">Demonstration</strong>
          <p>Not externally verified</p>
        </div>
      </div>
      <div className="two-col section">
        <div className="panel">
          <h2>Available attribute breakdown</h2>
          <Chart
            data={Object.entries(p.attributes)
              .filter(([, a]) => a.value !== null)
              .map(([name, a]) => ({ name, value: a.value! }))}
          />
          <p className="muted">
            Missing attributes are excluded from this chart, never shown as
            zero.
          </p>
        </div>
        <div className="panel">
          <h2>Evidence ledger</h2>
          {Object.entries(p.attributes).map(([name, attr]) => (
            <div className="data-row" key={name}>
              <span>{name}</span>
              <strong>
                {attr.value === null
                  ? "Unavailable"
                  : `${attr.value}/100 · sample`}
              </strong>
            </div>
          ))}
        </div>
      </div>
      <div className="panel tinted">
        <h2>
          <ShieldCheck /> How this score is calculated
        </h2>
        <p>{a.methodology}</p>
        <div className="chips">
          {Object.entries(sustainabilityWeights).map(([k, v]) => (
            <span className="pill" key={k}>
              {k} {v * 100}%
            </span>
          ))}
        </div>
        <p>
          Source: EcoRecommend synthetic seed dataset. No external verification,
          manufacturer reporting or real certifications are present. Scores must
          not be used to infer lifecycle impact or environmental superiority.
        </p>
        <small>
          Methodology {a.version} · Assessed {a.assessedAt}
        </small>
      </div>
    </>
  );
}
function Explainability() {
  const [id, setId] = useState(products[0].id);
  const p = products.find((p) => p.id === id)!;
  const r = recommend({}, [p])[0];
  return (
    <>
      <Title
        eyebrow="OPEN THE BLACK BOX"
        title="A good recommendation explains itself."
        copy="Inspect the factors behind the ranking. No hidden environmental claims."
      />
      <div className="two-col">
        <div className="panel">
          <label>
            Choose a product
            <select value={id} onChange={(e) => setId(e.target.value)}>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <h2>Why are we recommending this?</h2>
          {r.explanation.map((x) => (
            <p className="reason-line" key={x}>
              <Check size={15} />
              {x}
            </p>
          ))}
          <div className="large-score">
            {r.score}
            <small>/100 weighted match</small>
          </div>
        </div>
        <div className="panel">
          <h2>Feature contributions to this score</h2>
          <Chart
            data={Object.entries(r.contributions).map(([name, value]) => ({
              name,
              value,
            }))}
          />
          <p className="muted">
            Bars show weighted points. Their sum, rounded, equals the final
            score. These are direct formula contributions, not SHAP values or
            causal explanations.
          </p>
        </div>
      </div>
      <section className="panel section">
        <h2>The ranking, in plain sight.</h2>
        <div className="formula">
          30% preference + 20% quality + 15% price + 25% sustainability + 10%
          data confidence
        </div>
        <p>
          Each component uses a 0–100 scale. Missing sustainability values cause
          the available recommendation weights to be renormalized. Category
          match is 100 for your selected categories and 65 for open discovery.
          Quality is the sample rating divided by five. Budget suitability
          ranges from 60 to 100 within your budget. All demonstration products
          receive a low evidence-confidence component of 20/100.
        </p>
        <p>
          Content similarity uses category and shared descriptive tokens.
          Collaborative signals are not used without real interaction history.
          No claim of model accuracy is made; evaluation tools report results
          only for explicit datasets.
        </p>
        <div className="data-row">
          <span>Recommendation ID</span>
          <code>{r.id}</code>
        </div>
        <div className="data-row">
          <span>Model version</span>
          <code>{r.modelVersion}</code>
        </div>
        <div className="data-row">
          <span>Confidence</span>
          <strong>{r.confidence}</strong>
        </div>
        <div className="data-row">
          <span>Source</span>
          <strong>Synthetic demonstration seed catalog</strong>
        </div>
      </section>
    </>
  );
}
function Compare() {
  const { state, toggle } = useStore();
  const selected = state.compare
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  async function summarize() {
    try {
      setError("");
      setSummary((await api("ai/compare", { ids: state.compare })).summary);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <>
      <Title
        eyebrow="SIDE BY SIDE. CLEARER CHOICES."
        title="A little perspective goes a long way."
        copy="Compare two to four products. Unknown values stay unknown."
      />
      {selected.length < 2 && (
        <div className="disclosure">
          Select at least two products using the Compare action in the catalog.{" "}
          <Link href="/products">Browse products →</Link>
        </div>
      )}
      {selected.length > 0 ? (
        <>
          <div className="comparison-scroll">
            <table>
              <thead>
                <tr>
                  <th>At a glance</th>
                  {selected.map((p) => (
                    <th key={p.id}>
                      <img
                        className="compare-image"
                        src={p.image}
                        alt={p.name}
                      />
                      <Link href={`/products/${p.id}`}>{p.name}</Link>
                      <button
                        className="text-link"
                        onClick={() => toggle("compare", p.id)}
                      >
                        Remove ×
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Brand", (p: Product) => p.brand],
                  [
                    "Price",
                    (p: Product) => `₹${p.price.toLocaleString("en-IN")}`,
                  ],
                  ["Rating", (p: Product) => `${p.rating}/5 (sample)`],
                  [
                    "Sustainability",
                    (p: Product) =>
                      `${assess(p).score ?? "Unavailable"} /100 (sample)`,
                  ],
                  ["Carbon footprint", () => "Unavailable"],
                  ["Materials", (p: Product) => p.materials],
                  ["Packaging", (p: Product) => p.packaging],
                  [
                    "Recyclability",
                    (p: Product) =>
                      p.attributes.recyclability.value === null
                        ? "Unavailable"
                        : `${p.attributes.recyclability.value}/100 (sample)`,
                  ],
                  [
                    "Data completeness",
                    (p: Product) => `${assess(p).completeness}%`,
                  ],
                  [
                    "Recommendation score",
                    (p: Product) => `${recommend({}, [p])[0].score}/100`,
                  ],
                ].map(([label, fn]) => (
                  <tr key={String(label)}>
                    <td>{String(label)}</td>
                    {selected.map((p) => (
                      <td key={p.id}>{(fn as (p: Product) => string)(p)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            disabled={selected.length < 2}
            className="btn primary"
            onClick={summarize}
          >
            Explain this comparison <Sparkles size={16} />
          </button>
          {summary && (
            <div className="panel section">
              <h3>Grounded comparison · deterministic</h3>
              <p>{summary}</p>
            </div>
          )}
          {error && <p className="error">{error}</p>}
        </>
      ) : (
        <Empty
          title="Bring your options together"
          copy="Add up to four products from the catalog to compare their sample attributes."
        />
      )}
    </>
  );
}
function Assistant() {
  const [messages, setMessages] = useState<
    { role: string; text: string; items?: Product[]; mode?: string }[]
  >([
    {
      role: "assistant",
      text: "Hello, thoughtful shopper. Tell me what you are looking for and your budget. I will search the sample catalog and explain what I find.",
    },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  async function send(value: string) {
    if (!value.trim() || loading) return;
    setText("");
    setMessages((m) => [...m, { role: "user", text: value }]);
    setLoading(true);
    try {
      const d = await api("ai/chat", { message: value });
      setMessages((m) => [
        ...m,
        { role: "assistant", text: d.answer, items: d.products, mode: d.mode },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: (e as Error).message },
      ]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("product");
    const p = products.find((p) => p.id === id);
    if (p) setText(`Tell me about ${p.name}`);
  }, []);
  return (
    <>
      <Title
        eyebrow="YOUR CURIOUS SHOPPING COMPANION"
        title="Good questions lead to better choices."
        copy="Grounded in our catalog. Transparent about what is missing."
      />
      <div className="assistant-layout">
        <aside className="panel tinted">
          <Sparkles size={30} />
          <h2>What are you curious about?</h2>
          {[
            "Recommend sustainable laptops under ₹60,000",
            "Find cotton clothing under ₹2,000",
            "Find products with recyclable packaging",
            "Which product has the best sustainability score?",
          ].map((q) => (
            <button className="prompt" key={q} onClick={() => send(q)}>
              {q}
              <ArrowUpRight size={15} />
            </button>
          ))}
          <p className="muted">
            Without an AI provider key, the assistant uses deterministic
            retrieval and explanations. All catalog information is synthetic.
          </p>
        </aside>
        <section className="chat panel">
          <div className="chat-heading">
            <span className="logo-mark">
              <Sparkles size={20} />
            </span>
            <div>
              <strong>EcoRecommend assistant</strong>
              <small>Catalog-grounded answers</small>
            </div>
            <span className="pill">Demo catalog</span>
          </div>
          <div className="messages" aria-live="polite">
            {messages.map((m, i) => (
              <div className={`message ${m.role}`} key={i}>
                <small>
                  {m.role === "user"
                    ? "You"
                    : `EcoRecommend${m.mode ? ` · ${m.mode}` : ""}`}
                </small>
                <p>{m.text}</p>
                {m.items?.map((p) => (
                  <Link
                    className="chat-product"
                    href={`/products/${p.id}`}
                    key={p.id}
                  >
                    <img src={p.image} alt="" />
                    <span>
                      {p.name}
                      <small>₹{p.price.toLocaleString("en-IN")}</small>
                    </span>
                    <ArrowUpRight size={16} />
                  </Link>
                ))}
              </div>
            ))}
            {loading && (
              <p className="muted">
                Searching the catalog and checking the evidence…
              </p>
            )}
          </div>
          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              send(text);
            }}
          >
            <input
              maxLength={2000}
              aria-label="Message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask about a product, material or budget…"
              required
            />
            <button
              className="btn primary"
              disabled={loading || !text.trim()}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
function Saved({ kind }: { kind: "wishlist" | "cart" }) {
  const { state, clear } = useStore();
  const items = products.filter((p) => state[kind].includes(p.id));
  return (
    <>
      <Title
        eyebrow="YOUR CONSIDERED COLLECTION"
        title={
          kind === "wishlist"
            ? "Good finds, kept close."
            : "Your thoughtful shopping bag."
        }
        copy={
          kind === "wishlist"
            ? "Saved on this device. Signed-in wishlist changes also sync to Supabase when configured."
            : "A demonstration shopping bag. No checkout, payments or real orders."
        }
      />
      {items.length ? (
        <>
          <ProductGrid items={items} />
          {kind === "cart" && (
            <div className="panel section">
              <h2>
                Demo total: ₹
                {items.reduce((s, p) => s + p.price, 0).toLocaleString("en-IN")}
              </h2>
              <p>These sample products are not available for purchase.</p>
            </div>
          )}
          <button className="btn section" onClick={() => clear(kind)}>
            Clear {kind === "cart" ? "bag" : "wishlist"}
          </button>
        </>
      ) : (
        <Empty
          title={
            kind === "wishlist"
              ? "Your wishlist is a clean slate"
              : "Your bag is waiting for inspiration"
          }
          copy="Find something you like and save it from the product catalog."
        />
      )}
    </>
  );
}
function Auth({ signup }: { signup: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [reset, setReset] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const [authReady, setAuthReady] = useState<boolean | null>(null);
  useEffect(() => {
    api("auth/config")
      .then((d) => setAuthReady(d.configured))
      .catch(() => setAuthReady(false));
  }, []);
  useEffect(() => {
    const hash = new URLSearchParams(location.hash.slice(1));
    const token = hash.get("access_token");
    if (token) {
      localStorage.setItem("eco-token", token);
      if (hash.get("type") === "recovery") setRecovery(true);
      else setMessage("Email confirmed. You can now sign in.");
      history.replaceState(null, "", location.pathname);
    }
  }, []);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const d = await api(
        `auth/${recovery ? "password" : reset ? "reset" : signup ? "signup" : "login"}`,
        { email, password },
      );
      if (d.session) {
        await browserDatabase()?.auth.setSession(d.session);
        localStorage.setItem("eco-token", d.session.access_token);
        localStorage.setItem(
          "eco-user",
          JSON.stringify({ email: d.user.email, id: d.user.id }),
        );
        window.location.href = "/dashboard";
      } else
        setMessage(d.message || "Check your email to confirm your account.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-layout">
      <div>
        <span className="eyebrow">A LITTLE MORE PERSONAL</span>
        <h1 className="page-title">
          Better choices.
          <br />
          All in your space.
        </h1>
        <p>
          Save favourites, shape recommendations and keep your priorities close.
        </p>
        <div className="panel tinted">
          <ShieldCheck />
          <h3>Your data, thoughtfully handled.</h3>
          <p>
            Create an account with your email and password. Confirm your email
            before signing in. Your password is managed by Supabase
            authentication.
          </p>
        </div>
      </div>
      <form className="panel auth-form" onSubmit={submit}>
        {authReady === false && (
          <p className="status" role="status">
            Account access is ready to connect. Sign-up and login will be
            enabled when the store owner adds Supabase settings. You can browse
            and save favourites on this device now.
          </p>
        )}
        <Leaf size={32} />
        <h2>
          {recovery
            ? "Choose your new password"
            : reset
              ? "Reset your password"
              : signup
                ? "Create your account"
                : "Welcome back."}
        </h2>
        {!recovery && (
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
        )}
        {!reset && (
          <label>
            Password
            <input
              type="password"
              minLength={8}
              maxLength={128}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={signup ? "new-password" : "current-password"}
            />
          </label>
        )}
        <button className="btn primary" disabled={busy || authReady !== true}>
          {busy
            ? "Please wait…"
            : recovery
              ? "Update password"
              : reset
                ? "Send reset email"
                : signup
                  ? "Create account"
                  : "Sign in"}{" "}
          <ArrowRight size={16} />
        </button>
        {message && (
          <p className="status" role="status">
            {message}
          </p>
        )}
        <button
          type="button"
          className="text-link"
          onClick={() => {
            setReset(!reset);
            setMessage("");
          }}
        >
          {reset ? "Back to sign in" : "Forgot your password?"}
        </button>
        <Link className="text-link" href={signup ? "/login" : "/signup"}>
          {signup
            ? "Already have an account? Sign in"
            : "New here? Create an account"}
        </Link>
        <Link href="/products" className="muted">
          Continue browsing as a guest →
        </Link>
      </form>
    </div>
  );
}
function Dashboard() {
  const { state, clear } = useStore();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("eco-user") || "null"));
    } catch {}
  }, []);
  async function save() {
    try {
      await api("auth/profile", { display_name: name }, "PUT");
      setStatus("Profile saved.");
    } catch (e) {
      setStatus((e as Error).message);
    }
  }
  return (
    <>
      <Title
        eyebrow="YOUR THOUGHTFUL CORNER"
        title={user ? "Welcome to your space." : "A good place to start."}
        copy={
          user
            ? user.email
            : "You are browsing as a guest. Device-local collections work without an account."
        }
      />
      <div className="button-row">
        {user ? (
          <button
            className="btn"
            onClick={() => {
              browserDatabase()?.auth.signOut();
              localStorage.removeItem("eco-token");
              localStorage.removeItem("eco-user");
              setUser(null);
            }}
          >
            <LogOut size={16} /> Sign out
          </button>
        ) : (
          <>
            <Link href="/login" className="btn primary">
              Sign in
            </Link>
            <Link href="/signup" className="btn">
              Create account
            </Link>
          </>
        )}
      </div>
      <div className="stats section">
        {[
          ["Saved products", state.wishlist.length],
          ["Recently viewed", state.recent.length],
          ["Recommendation sessions", state.history.length],
          ["Demo bag", state.cart.length],
        ].map(([k, v]) => (
          <div className="panel" key={k}>
            <span>{k}</span>
            <strong>{v}</strong>
            <small>On this device</small>
          </div>
        ))}
      </div>
      <div className="two-col">
        <div className="panel">
          <h2>Your preferences</h2>
          <p>
            Personalize your budget, preferred categories and sustainability
            priorities.
          </p>
          <Link href="/recommendations" className="btn">
            Edit preferences <ArrowRight size={16} />
          </Link>
        </div>
        <div className="panel">
          <h2>Account settings</h2>
          {user ? (
            <>
              <label>
                Display name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                />
              </label>
              <button className="btn" disabled={!name.trim()} onClick={save}>
                Save profile
              </button>
            </>
          ) : (
            <p>
              Sign in to manage your profile. Guest collections stay in your
              browser.
            </p>
          )}
          <button
            className="text-link"
            onClick={() => {
              clear("recent");
              clear("history");
              setStatus("Local browsing and recommendation history cleared.");
            }}
          >
            Clear local activity
          </button>
          <p role="status">{status}</p>
        </div>
      </div>
      <section className="section">
        <h2>Recently viewed</h2>
        {state.recent.length ? (
          <ProductGrid
            items={
              state.recent
                .map((id) => products.find((p) => p.id === id))
                .filter(Boolean) as Product[]
            }
          />
        ) : (
          <p className="muted">Products you explore will appear here.</p>
        )}
      </section>
      <section className="section">
        <h2>Recommendation activity</h2>
        {state.history.length ? (
          state.history.slice(-5).map((t) => (
            <div className="data-row" key={t}>
              <span>Recommendation session</span>
              <time>{new Date(t).toLocaleString()}</time>
            </div>
          ))
        ) : (
          <p className="muted">
            Generate your first set of recommendations to get started.
          </p>
        )}
      </section>
    </>
  );
}
function Admin() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  async function load() {
    try {
      setError("");
      setData(await api("admin/dashboard"));
    } catch (e) {
      setError((e as Error).message);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function save() {
    try {
      const product = JSON.parse(input);
      await api("admin/products", product);
      setStatus("Product saved to Supabase.");
      load();
    } catch (e) {
      setStatus((e as Error).message);
    }
  }
  async function remove() {
    try {
      const product = JSON.parse(input);
      await api(
        `admin/products/${encodeURIComponent(product.id)}`,
        undefined,
        "DELETE",
      );
      setStatus("Product removed from Supabase.");
    } catch (e) {
      setStatus((e as Error).message);
    }
  }
  return (
    <>
      <Title
        eyebrow="CATALOG OPERATIONS"
        title="A responsible view of the store."
        copy="Administrator access is verified on the server using Supabase roles."
      />
      {error ? (
        <div className="panel auth-wall">
          <Lock size={32} />
          <h2>Administrator access required</h2>
          <p>{error}</p>
          <p>
            Configure Supabase and assign an administrator role through a
            trusted database session. Client-side account settings cannot grant
            this role.
          </p>
          <Link className="btn primary" href="/login">
            Sign in
          </Link>
          <button className="btn" onClick={load}>
            Check access again
          </button>
        </div>
      ) : !data ? (
        <p>Checking administrator access…</p>
      ) : (
        <>
          <div className="stats">
            {["products", "users", "recommendations"].map((k) => (
              <div className="panel" key={k}>
                <span>{k}</span>
                <strong>{String(data[k])}</strong>
              </div>
            ))}
          </div>
          <div className="two-col section">
            <div className="panel">
              <h2>Category distribution</h2>
              <Chart
                data={(
                  data.categories as { name: string; count: number }[]
                ).map((x) => ({ name: x.name, value: x.count }))}
              />
            </div>
            <div className="panel">
              <h2>Product management</h2>
              <p>
                Create or update a complete product record, including
                source-labelled sustainability attributes. JSON import preserves
                the raw evidence schema.
              </p>
              <textarea
                rows={12}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste a product JSON record"
              />
              <div className="button-row">
                <button
                  className="btn"
                  onClick={() => setInput(JSON.stringify(products[0], null, 2))}
                >
                  Load sample schema
                </button>
                <button className="btn primary" onClick={save}>
                  Save record
                </button>
                <button className="btn" onClick={remove}>
                  Delete record
                </button>
              </div>
              <p role="status">{status}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
