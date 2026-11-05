import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const sql = readFileSync("supabase/migrations/001_initial.sql", "utf8");
test("all private record tables enforce owner identity in policies", () => {
  assert.match(sql, /owner_access/);
  assert.match(
    sql,
    /using\(user_id=auth.uid\(\)\) with check\(user_id=auth.uid\(\)\)/,
  );
  assert.match(sql, /enable row level security/);
});
test("public API cannot promote users or mutate audit logs", () => {
  assert.ok(!sql.includes("create policy role_write"));
  assert.match(sql, /No role write policies/);
  assert.match(sql, /admin_audit_read/);
});
