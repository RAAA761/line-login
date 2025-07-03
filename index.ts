// deno run --allow-net --allow-read server.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { loginWithPassword } from "@evex/linejs";

/* ---------- セッション ---------- */
interface Session {
  pincode: string;
  token?: string;
  refresh?: string;
  error?: string;
  created: number;
}
const sessions = new Map<string, Session>();
const TTL = 30 * 60 * 1000;          // 30 分で破棄

/* ---------- 定期クリーンアップ ---------- */
setInterval(() => {
  const now = Date.now();
  for (const [sid, s] of sessions) if (now - s.created > TTL) sessions.delete(sid);
}, 60_000);

/* ---------- HTTP サーバ ---------- */
serve(async (req) => {
  const url = new URL(req.url);
  const { pathname, searchParams } = url;
  console.log("[REQ]", req.method, pathname);

  /* --- HTML 配信 --- */
  if (req.method === "GET" && (pathname === "/" || pathname.endsWith(".html"))) {
    const filePath = pathname === "/" ? "./index.html" : `.${pathname}`;
    try {
      return await serveFile(req, filePath);
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  }

  /* --- POST /api/login : PIN 発行 --- */
  if (req.method === "POST" && pathname === "/api/login") {
    const { email, password, device = "DESKTOPWIN" } = await req.json();
    const pincode = Math.floor(100000 + Math.random() * 900000).toString();
    const sid = crypto.randomUUID();

    sessions.set(sid, { pincode, created: Date.now() });

    // 非同期ログイン
    loginWithPassword({ email, password, pincode }, { device })
      .then(async (client) => {
        const profile = await client.base.talk.getProfile();
        const refresh = await client.base.storage.get("refreshToken");

        const s = sessions.get(sid);
        if (s) {
          s.token = client.authToken;
          s.refresh = refresh;
        }
      })
      .catch((e) => {
        const s = sessions.get(sid);
        if (s) s.error = String(e);
      });

    return Response.json({ sessionId: sid, pincode });
  }

  /* --- GET /api/result?sid=xxx : 結果だけ返す --- */
  if (req.method === "GET" && pathname === "/api/result") {
    const sid = searchParams.get("sid")!;
    const s = sessions.get(sid);
    if (!s) return Response.json({ status: "INVALID" }, { status: 404 });

    if (s.token) {
      return Response.json({ status: "OK", token: s.token, refresh: s.refresh });
    }
    if (s.error) return Response.json({ status: "ERROR", error: s.error });
    return Response.json({ status: "PENDING" });
  }

  return new Response("Not Found", { status: 404 });
}, { port: 8000 });