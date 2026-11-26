const DASHBOARD_ORIGIN = "https://devyousef230-bot.github.io";
const API_PREFIX = "/api/client/v4";
const UPSTREAM = "https://api.cloudflare.com/client/v4";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, X-MF-Bridge-Key",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function allowedPath(path) {
  if (path === "/user/tokens/verify" || path === "/accounts") return true;
  return /^\/accounts\/[A-Za-z0-9_-]+(?:\/storage\/kv\/namespaces(?:\/[A-Za-z0-9_-]+)?|\/workers\/(?:subdomain|scripts(?:\/[A-Za-z0-9_-]+(?:\/(?:secrets|subdomain))?)?))?$/.test(path);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (origin !== DASHBOARD_ORIGIN) {
      return new Response("Forbidden origin", { status: 403 });
    }

    const cors = corsHeaders(origin);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (!["GET", "POST", "PUT"].includes(request.method)) {
      return new Response("Method not allowed", { status: 405, headers: cors });
    }

    const bridgeKey = request.headers.get("X-MF-Bridge-Key") || "";\n    if (!env.BRIDGE_KEY || bridgeKey !== env.BRIDGE_KEY) {\n      return new Response("Unauthorized bridge key", { status: 401, headers: cors });\n    }\n\n    const incoming = new URL(request.url);
    if (!incoming.pathname.startsWith(API_PREFIX)) {
      return new Response("Not found", { status: 404, headers: cors });
    }
    const apiPath = incoming.pathname.slice(API_PREFIX.length) || "/";
    if (!allowedPath(apiPath)) {
      return new Response("API path not allowed", { status: 403, headers: cors });
    }

    const authorization = request.headers.get("Authorization");
    if (!authorization || !/^Bearer\s+\S+$/i.test(authorization)) {
      return new Response(JSON.stringify({
        success: false,
        errors: [{ code: 1001, message: "Missing or invalid Authorization header" }]
      }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    const headers = new Headers();
    headers.set("Authorization", authorization);
    const contentType = request.headers.get("Content-Type");
    if (contentType) headers.set("Content-Type", contentType);

    const upstreamUrl = UPSTREAM + apiPath + incoming.search;
    const upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: request.method === "GET" ? undefined : request.body,
      redirect: "manual"
    });

    const responseHeaders = new Headers(upstreamResponse.headers);
    for (const [key, value] of Object.entries(cors)) responseHeaders.set(key, value);
    responseHeaders.delete("Set-Cookie");

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders
    });
  }
};
