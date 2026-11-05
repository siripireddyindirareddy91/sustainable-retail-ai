# Verification

- `npm run typecheck`: TypeScript and App Router route signatures.
- `npm test`: search relevance and combined filters, unique catalog records, missing environmental data, known-weight normalization, contribution arithmetic, recommendation provenance, assistant currency / category retrieval, comparison cardinality, anonymous authorization, malformed API input, deterministic fallback and schema policy assertions.
- `python -m unittest discover -s ai-engine -p test_engine.py`: metric arithmetic, unknown sustainability and weighted contributions.
- `npm run build`: production compilation and server/client integration.
- `npm audit`: dependency advisory checks.

Schema-policy tests inspect the SQL contract; they do not replace live two-user Supabase RLS tests. Account creation, email delivery, recovery and real provider integration require credentials and were not exercised in the default no-key deployment. No quantitative recommendation accuracy is claimed. Python model training requires installing the optional requirements and supplying observed interaction data.
