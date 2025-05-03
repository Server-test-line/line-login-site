// api/proxy-hash.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { Password: userInputPassword } = req.body;

    const payload = {
      UserID: "vastar",
      Password: "vastar@2673",
      Input: userInputPassword,  // 使用者輸入的密碼
    };

    const apiResponse = await fetch('https://webapi.vastar.com.tw/api/Member/HASHBYTES', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await apiResponse.json();

    return res.status(apiResponse.status).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Proxy Error', error: error.message });
  }
}
