export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const { Account_Name, Password, Name, Phone_Check } = req.body;

    const hashRes = await fetch('https://webapi.vastar.com.tw/api/Member/HASHBYTES', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        UserID: 'vastar',
        Password: 'vastar@2673',
        Input: Password,
      }),
    });

    const hashData = await hashRes.json();
    if (!hashData.HASHBYTES) {
      return res.status(500).json({ message: '密碼加密失敗', detail: hashData });
    }

    const registerPayload = {
      UserID: 'vastar',
      Password: 'vastar@2673',
      Account_Name,
      HashPassword: hashData.HASHBYTES,
      Phone_Check: Phone_Check || 0,
      Name,
      RegisterTime: new Date().toISOString(),
    };

    const registerRes = await fetch('https://webapi.vastar.com.tw/api/Member/Register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerPayload),
    });

    const registerData = await registerRes.json();
    return res.status(registerRes.status).json(registerData);
  } catch (err) {
    return res.status(500).json({ message: '伺服器錯誤', error: err.message });
  }
}
