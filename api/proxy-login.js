// api/proxy-login.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // 若方法不是 POST，回傳 405
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const payload = req.body;

    const apiResponse = await fetch('https://webapi.vastar.com.tw/api/Member/Login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await apiResponse.json();
    return res.status(apiResponse.status).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Proxy Error', error: error.message });
  }
}
