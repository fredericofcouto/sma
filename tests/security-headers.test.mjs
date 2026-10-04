import assert from "node:assert/strict";
import test from "node:test";
import applySecurityHeaders from "../worker/security-headers.mjs";

test("adds security headers without changing the response", async () => {
  const original = new Response("Paróquia", {
    status: 201,
    headers: { "cache-control": "public, max-age=60" },
  });
  const response = applySecurityHeaders(original, true);

  assert.equal(response.status, 201);
  assert.equal(await response.text(), "Paróquia");
  assert.equal(response.headers.get("cache-control"), "public, max-age=60");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.equal(response.headers.get("permissions-policy"), "camera=(), microphone=(), geolocation=()");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(
    response.headers.get("content-security-policy"),
    "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
  );
  assert.equal(response.headers.get("strict-transport-security"), "max-age=31536000");
});

test("does not send HSTS over HTTP", () => {
  const response = applySecurityHeaders(new Response("ok"), false);
  assert.equal(response.headers.get("strict-transport-security"), null);
});
