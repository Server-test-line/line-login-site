// api/proxy-hash.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const response = await fetch('https://webapi.vastar.com.tw/api/Member/HASHBYTES', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Proxy Error', error: error.message });
  }
}
