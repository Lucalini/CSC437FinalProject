import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, "public");
const PORT = Number(process.env.PORT ?? 3000);
// Bind to all interfaces by default so reverse proxies / remote clients can reach it on a VPS.
const HOST = process.env.HOST ?? "0.0.0.0";

const MIME_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
  [".txt", "text/plain; charset=utf-8"],
]);

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    "Cache-Control": "no-store",
    ...headers,
  });
  res.end(body);
}

function safeJoinPublic(requestPath) {
  // Strip query/hash, decode, and prevent directory traversal
  const clean = requestPath.split("?")[0].split("#")[0];
  let decoded;
  try {
    decoded = decodeURIComponent(clean);
  } catch {
    return null;
  }

  const rel = decoded.startsWith("/") ? decoded.slice(1) : decoded;
  const normalized = path.normalize(rel);

  // If normalization attempts to escape public, reject
  if (normalized.startsWith("..") || path.isAbsolute(normalized)) return null;

  return path.join(PUBLIC_DIR, normalized);
}

const server = http.createServer(async (req, res) => {
  if (!req.url) return send(res, 400, "Bad Request");

  // Default route → index.html
  const urlPath = req.url === "/" ? "/index.html" : req.url;
  const filePath = safeJoinPublic(urlPath);
  if (!filePath) return send(res, 400, "Bad Request");

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      // Directory requests also default to index.html
      const indexPath = path.join(filePath, "index.html");
      const data = await fs.readFile(indexPath);
      return send(res, 200, data, { "Content-Type": MIME_TYPES.get(".html") ?? "text/html" });
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES.get(ext) ?? "application/octet-stream";
    const data = await fs.readFile(filePath);
    return send(res, 200, data, { "Content-Type": contentType });
  } catch (err) {
    if (err && (err.code === "ENOENT" || err.code === "ENOTDIR")) {
      return send(res, 404, "Not Found");
    }
    return send(res, 500, "Internal Server Error");
  }
});

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${HOST}:${PORT}`);
});

