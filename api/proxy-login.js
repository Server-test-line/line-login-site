//login+hash
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // 若方法不是 POST，回傳 405
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { Account_Name, Password } = req.body;

    // 先呼叫 HASHBYTES API 加密密碼
  const hashResponse = await fetch('https://webapi.vastar.com.tw/api/Member/HASHBYTES', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      UserID: 'vastar',
      Password: 'vastar@2673',
      Input: Password
    })
  });

  const hashData = await hashResponse.json();
  if (!hashData.HASHBYTES) {
    return res.status(500).json({ message: 'HASH 加密失敗', detail: hashData });
  }

      // 使用 HASH 傳送登入請求
    const loginPayload = {
      UserID: 'vastar',
      Password: 'vastar@2673',
      Account_Name,
      HASHBYTES: hashData.HASHBYTES
    };

    // 發送 POST 請求到原始 API
    const loginResponse = await fetch('https://webapi.vastar.com.tw/api/Member/Login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginPayload)
    });

    const loginData = await loginResponse.json();
    return res.status(loginResponse.status).json(loginData);

  } catch (error) {
    return res.status(500).json({ message: 'Login Proxy Error', error: error.message });
  }
}
