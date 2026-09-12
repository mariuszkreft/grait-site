import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const port = Number(process.env.PORT || 8080);
const root = new URL(".", import.meta.url).pathname;

const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".png", "image/png"],
]);

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  setHeaders(res);

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405);
    return res.end("method not allowed");
  }

  if (url.pathname === "/healthz") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("ok");
  }

  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const file = normalize(join(root, "static", pathname));
  if (!file.startsWith(join(root, "static"))) {
    res.writeHead(403);
    return res.end("forbidden");
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": types.get(extname(file)) || "application/octet-stream" });
    if (req.method === "HEAD") return res.end();
    return res.end(body);
  } catch {
    const body = await readFile(join(root, "static", "index.html"));
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(body);
  }
}).listen(port, "0.0.0.0", () => {
  console.log(`grait-site listening on :${port}`);
});

function setHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; base-uri 'self'; frame-ancestors 'none';",
  );
}
