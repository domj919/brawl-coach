const https = require("https");
const http = require("http");

const API_KEY = process.env.BRAWLSTARS_API_KEY;
const PORT = process.env.PORT || 3001;
const BS_HOST = "api.brawlstars.com";

if (!API_KEY) {
  console.error("BRAWLSTARS_API_KEY env var is required");
  process.exit(1);
}

http.createServer((req, res) => {
  // Health + outbound IP check
  if (req.url === "/health" || req.url === "/ip") {
    https.get("https://api.ipify.org?format=json", (ipRes) => {
      let data = "";
      ipRes.on("data", (chunk) => data += chunk);
      ipRes.on("end", () => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, outboundIp: JSON.parse(data).ip }));
      });
    }).on("error", () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, outboundIp: "unknown" }));
    });
    return;
  }

  // CORS headers so Vercel can call this
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Forward to Brawl Stars API
  const options = {
    hostname: BS_HOST,
    path: req.url,
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
    },
  };

  const proxy = https.request(options, (bsRes) => {
    res.writeHead(bsRes.statusCode, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    bsRes.pipe(res);
  });

  proxy.on("error", (err) => {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Proxy error", detail: err.message }));
  });

  proxy.end();
}).listen(PORT, () => {
  console.log(`BS proxy running on port ${PORT}`);
});
