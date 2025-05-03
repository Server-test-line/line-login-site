// api/proxy-login.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // 若方法不是 POST，回傳 405
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const payload = req.body;

    // 發送 POST 請求到原始 API
    const apiResponse = await fetch('https://webapi.vastar.com.tw/api/Member/Login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), // 轉發資料
    });

    // 從原始 API 接收的回應資料
    const data = await apiResponse.json();
    // 返回原始 API 的回應結果
    return res.status(apiResponse.status).json(data);
  } catch (error) {
    // 如果有錯誤，返回錯誤訊息
    return res.status(500).json({ message: 'Proxy Error', error: error.message });
  }
}
