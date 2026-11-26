const DASHBOARD_ORIGIN = "https://devyousef230-bot.github.io";
const API_PREFIX = "/api/client/v4";
const UPSTREAM = "https://api.cloudflare.com/client/v4";

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function allowedPath(path, method) {
  if (method === "GET" && (path === "/user/tokens/verify" || path === "/accounts")) return true;
  if (!path.startsWith("/accounts/")) return false;
  if (/^\/accounts\/[A-Za-z0-9_-]+$/.test(path)) return method === "GET";
  if (/^\/accounts\/[A-Za-z0-9_-]+\/storage\/kv\/namespaces$/.test(path)) return method === "GET" || method === "POST";
  if (/^\/accounts\/[A-Za-z0-9_-]+\/workers\/scripts$/.test(path)) return method === "GET";
  if (/^\/accounts\/[A-Za-z0-9_-]+\/workers\/scripts\/[a-z0-9-]{1,63}$/.test(path)) return method === "PUT";
  if (/^\/accounts\/[A-Za-z0-9_-]+\/workers\/scripts\/[a-z0-9-]{1,63}\/secrets$/.test(path)) return method === "PUT";
  if (/^\/accounts\/[A-Za-z0-9_-]+\/workers\/subdomain$/.test(path)) return method === "GET";
  if (/^\/accounts\/[A-Za-z0-9_-]+\/workers\/scripts\/[a-z0-9-]{1,63}\/subdomain$/.test(path)) return method === "GET" || method === "POST";
  return false;
}

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") || "";
    if (origin !== DASHBOARD_ORIGIN) return new Response("Forbidden origin", { status: 403 });
    const headers = cors(origin);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (!["GET", "POST", "PUT"].includes(request.method)) {
      return new Response("Method not allowed", { status: 405, headers });
    }

    const incoming = new URL(request.url);
    if (!incoming.pathname.startsWith(API_PREFIX)) return new Response("Not found", { status: 404, headers });
    const apiPath = incoming.pathname.slice(API_PREFIX.length) || "/";
    if (!allowedPath(apiPath, request.method)) return new Response("API path not allowed", { status: 403, headers });

    const authorization = request.headers.get("Authorization") || "";
    if (!/^Bearer\s+\S+$/i.test(authorization)) {
      return new Response(JSON.stringify({ success: false, errors: [{ code: 1001, message: "Missing or invalid Authorization header" }] }), {
        status: 401, headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    if (request.method !== "GET") {
      const length = Number(request.headers.get("Content-Length") || 0);
      if (length > 25 * 1024 * 1024) return new Response("Payload too large", { status: 413, headers });
    }

    const forwardHeaders = new Headers({ Authorization: authorization });
    const contentType = request.headers.get("Content-Type");
    if (contentType) forwardHeaders.set("Content-Type", contentType);

    try {
      const upstream = await fetch(UPSTREAM + apiPath + incoming.search, {
        method: request.method,
        headers: forwardHeaders,
        body: request.method === "GET" ? undefined : request.body,
        redirect: "manual"
      });
      const responseHeaders = new Headers(upstream.headers);
      for (const [key, value] of Object.entries(headers)) responseHeaders.set(key, value);
      responseHeaders.delete("Set-Cookie");
      return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: responseHeaders });
    } catch {
      return new Response(JSON.stringify({ success: false, errors: [{ message: "Cloudflare API is temporarily unavailable." }] }), {
        status: 502, headers: { ...headers, "Content-Type": "application/json" }
      });
    }
  }
};
