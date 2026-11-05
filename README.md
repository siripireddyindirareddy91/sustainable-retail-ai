# EcoRecommend AI

A Trustworthy Generative AI Framework for Explainable Sustainability-Aware Retail Product Recommendations.

**Shop Smarter. Choose Greener. Trust Every Recommendation.**

## Run locally

Node.js 22 or newer is recommended.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No account or API key is required for the demonstration experience.

```sh
npm run typecheck
npm test
npm run build
npm start
```

## Implemented experience

- Responsive Next.js App Router storefront and 1,260 seeded demonstration products in 12 categories.
- Search, category / budget / rating / sustainability filters, sorting, pagination and product details.
- Transparent weighted recommendations with configurable priorities, per-feature contributions, completeness, source labels and model versions.
- Sustainability assessment with unknown values excluded and minimum evidence thresholds; provenance and methodology pages.
- Catalog-grounded shopping assistant, optional OpenAI/Gemini summaries, and deterministic fallback.
- Two-to-four-product comparison, device-local wishlist, demo shopping bag, recently viewed products and recommendation activity.
- Supabase email authentication, profile API, server-enforced administrator authorization, protected product mutations and wishlist persistence when configured.
- Database migration with 23 RLS-enabled tables, indexes, update triggers, trusted role assignment, seed SQL and vector column.
- Optional Python TF-IDF / cosine recommendation model, interaction-based collaborative filtering, personalization utilities and offline evaluation metrics.
- API validation, request limits, security headers and automated tests.

## Honest operating modes

The default application is an academic **demonstration**, not a live marketplace. Products, brands, prices, ratings and environmental attributes are fictional. Each product has a unique, labelled SVG illustration; these are not photographs or verified depictions of real goods. Carbon footprints and certifications are unavailable. Environmental rankings are illustrative and do not establish real environmental superiority. No payment processing, checkout or fulfillment is offered.

Without Supabase credentials, authentication and administrator mutations return explicit unavailable/unauthorized responses. Collections remain device-local. With Supabase configured, catalog queries can use stored product records and signed-in wishlist mutations sync to the database. Some client views and the recommendation engine use the bundled versioned seed snapshot; regenerate/redeploy the snapshot when importing a new catalog to keep them consistent.

The Node runtime uses a transparent weighted model, not a trained collaborative model or SHAP. The optional Python model supports collaborative filtering only after sufficient real interactions are supplied. No model accuracy is claimed without a held-out evaluation dataset. Vector storage is prepared; semantic embeddings and a vector index are not automatically provisioned. The current retrieval implementation uses catalog filtering / content similarity, not a hosted embedding service.

## Configure integrations

Copy `.env.example` to `.env.local` and set only the integrations you need. Do not commit secrets.

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: enable database and email accounts.
- `AI_PROVIDER=deterministic` works without credentials.
- `AI_PROVIDER=openai` + `OPENAI_API_KEY`, or `AI_PROVIDER=gemini` + `GEMINI_API_KEY`: enable catalog-grounded generative summaries. Failures fall back to deterministic answers.
- `SUPABASE_SERVICE_ROLE_KEY` is reserved for trusted maintenance tooling and is not required by public routes.
- `PYTHON_AI_SERVICE_URL` is reserved for an optional future external service. The Python model currently runs offline; no extra service is required for the web app.

See [deployment instructions](docs/DEPLOYMENT.md), [architecture and API](docs/ARCHITECTURE.md), and [verification notes](docs/TESTING.md).

## Python model

```sh
python -m pip install -r ai-engine/requirements.txt
python ai-engine/recommendation/model.py --query "cotton clothing" --budget 3000
python -m unittest discover -s ai-engine -p test_engine.py
```

To train collaborative signals, pass `--interactions interactions.csv --user USER_ID` with actual `user_id,product_id,weight` events. At least 20 events from three users are required. Evaluation: `python ai-engine/evaluation/metrics.py labels.json`, where JSON contains `recommendations` (user IDs to ranked product IDs), `relevant` (held-out relevant product IDs), `catalog_size`, optional `categories`, and `k`.

## Repository structure

```text
src/app/                 App Router storefront, product detail and workspace routes
src/app/api/[...path]/   Validated REST APIs
src/components/          Navigation, product cards, collections and interactive workspaces
src/lib/                 Catalog, ranking, sustainability and server identity
supabase/migrations/     Database schema and RLS
supabase/seed.sql         1,260 labelled sample products and evidence records
ai-engine/               Optional Python hybrid recommendation / evaluation modules
scripts/                 Seed exporter and product import utilities
 tests/                  Engine, API, schema-policy and component tests
 docs/                   Setup, architecture, deployment and testing
```

## Limitations before a real commercial launch

Configure and run Supabase migrations, verify RLS with separate real user sessions, configure recovery redirect URLs, use a shared rate-limit store rather than the per-instance best-effort limiter, configure a real product provider, replace sample evidence with attributable records, and complete provider and account integration testing. Device-local guest state is not a secure account database. Never use client role claims as administrator authorization.
