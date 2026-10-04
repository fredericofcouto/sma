/** @param {Response} response @param {boolean} isHttps @returns {Response} */
export default function applySecurityHeaders(response, isHttps) {
  const headers = new Headers(response.headers);

  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set(
    "Content-Security-Policy",
    "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
  );
  headers.set("X-Frame-Options", "DENY");

  if (isHttps) {
    headers.set("Strict-Transport-Security", "max-age=31536000");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
