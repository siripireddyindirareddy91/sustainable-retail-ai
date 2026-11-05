# Vercel and Supabase deployment

## Vercel

1. Import the GitHub repository into Vercel, or run `vercel --prod` from this checkout.
2. Select the Next.js framework preset. Build command: `npm run build`. Install command: `npm ci`.
3. The demonstration needs no environment variables. Keep `AI_PROVIDER=deterministic` unless a provider is configured.
4. To enable accounts, add the Supabase URL and public anon key in Vercel environment settings, then redeploy. Never put server keys in `NEXT_PUBLIC_*` variables.
5. Check `/api/health`, product search, recommendations and `/assistant` on the deployed URL.

## Supabase

1. Use an existing free-tier Supabase project or create one through your own account. No billing activation is needed for this demonstration.
2. Run `supabase/migrations/001_initial.sql` in the SQL editor, followed by `supabase/seed.sql`.
3. Set the project Site URL to the deployed app and add the deployment's `/login` URL to the allowed auth redirects.
4. Enable email authentication. Email confirmation follows the project's Auth settings.
5. Sign up normally. A trigger creates a profile and ordinary user role.
6. A trusted administrator can promote a known account using SQL:

```sql
update public.roles set role='admin' where user_id='YOUR_CONFIRMED_USER_UUID';
```

Public API clients cannot modify role records. All private records require `user_id = auth.uid()`. Administrator status is verified by the API against the roles table using the authenticated user's session.

## Product imports

Use `npx tsx scripts/export-seed.ts` to regenerate SQL and the offline catalog from `src/lib/catalog.ts`. An administrator can use the JSON management form or product APIs. `scripts/import-products.ts` accepts a CSV product listing and validates it against the complete catalog schema before authenticated API writes. No unauthorized marketplace scraping is performed.

## AI providers

Set exactly one provider and its server-side API key. OpenAI and Gemini requests time out after 15 seconds and fall back to deterministic catalog retrieval. Provider use may incur costs depending on your account; the no-key mode remains free and fully usable. No paid upgrade is required.

## Recovery

Redeploy a previously successful Vercel deployment for application rollback. Database migrations are not automatically executed by Vercel and must be managed separately. Back up real data before future destructive schema changes.

## Live account setup (2026-11-05)

A Supabase Free Plan resource named `ecorecommend-auth` is connected through the Vercel Marketplace. The database migration and 192-record seed have been applied. Vercel supplies the public URL/anon key and server-only maintenance credentials. Never commit pulled environment files.

`node scripts/verify-auth.mjs` verifies a temporary account, login, private profile access, ordinary role creation, denied role escalation, denied incorrect passwords, and logout, then removes the account. `node scripts/verify-signup-link.mjs` checks the configured confirmation redirect without sending an email.

The Supabase Auth Site URL must be `https://sustainable-retail-ai.vercel.app` and the redirect allowlist must include `https://sustainable-retail-ai.vercel.app/login`. Signups require email confirmation. Password reset uses the same deployed login callback.

The left category sidebar links to filtered product pages, includes product counts and active selection, and becomes a horizontally scrollable category menu on narrow screens.
