// pages/api/proxy-query.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { Account_Name } = req.body;

    if (!Account_Name) {
      return res.status(400).json({ message: 'Account_Name is required' });
    }

    const fixedUserID = 'vastar';
    const fixedPassword = 'vastar@2673';

    const apiPayload = {
      UserID: fixedUserID,
      Password: fixedPassword,
      Account_Name
    };

    const apiResponse = await fetch('https://webapi.vastar.com.tw/api/Member/Query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiPayload)
    });

    const data = await apiResponse.json();
    return res.status(apiResponse.status).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Proxy Error', error: error.message });
  }
}
