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
  assert.equal(response.headers.get("permissions-policy"), "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(
    response.headers.get("content-security-policy"),
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://i.imgur.com; font-src 'self' data:; connect-src 'self'; frame-src https://www.google.com https://maps.google.com",
  );
  assert.equal(response.headers.get("cross-origin-opener-policy"), "same-origin");
  assert.equal(response.headers.get("strict-transport-security"), "max-age=31536000");
});

test("does not send HSTS over HTTP", () => {
  const response = applySecurityHeaders(new Response("ok"), false);
  assert.equal(response.headers.get("strict-transport-security"), null);
});
