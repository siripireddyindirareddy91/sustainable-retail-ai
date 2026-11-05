# Verification

- `npm run typecheck`: TypeScript and App Router route signatures.
- `npm test`: search relevance and combined filters, unique catalog records, missing environmental data, known-weight normalization, contribution arithmetic, recommendation provenance, assistant currency / category retrieval, comparison cardinality, anonymous authorization, malformed API input, deterministic fallback and schema policy assertions.
- `python -m unittest discover -s ai-engine -p test_engine.py`: metric arithmetic, unknown sustainability and weighted contributions.
- `npm run build`: production compilation and server/client integration.
- `npm audit`: dependency advisory checks.

Schema-policy tests inspect the SQL contract; they do not replace live two-user Supabase RLS tests. Account creation, email delivery, recovery and real provider integration require credentials and were not exercised in the default no-key deployment. No quantitative recommendation accuracy is claimed. Python model training requires installing the optional requirements and supplying observed interaction data.

## Verified deployment checks

Production URL: https://sustainable-retail-ai.vercel.app

The browser check exercised global laptop search (laptop and matching sleeve), wishlist save, two-item comparison, and generated personalized recommendations. A mobile home-page check used a 390×844 viewport and found no horizontal overflow. The production storefront rendered category photography and the transparency disclosure. Supabase account and actual provider calls remain unverified because no credentials were configured.

## Catalog expansion

The catalog now contains 1,260 uniquely named listings: 105 in each of 12 categories. New listings are distinct functional configurations of 25 product families per category, with configuration-specific specifications and prices. Each has an individual labelled product illustration URL. Four paginated home collections contain 120 products each and have no overlapping product IDs. Catalog pagination exposes every listing without rendering thousands of cards at once.

Authentication links are visible in navigation. `/api/auth/config` reports configuration availability; login and signup display a clear setup notice and remain disabled until Supabase is connected. This avoids asking visitors to submit credentials to an unconfigured service.
