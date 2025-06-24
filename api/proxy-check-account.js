export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { Account_Name } = req.body;
  try {
    const queryRes = await fetch('https://webapi.vastar.com.tw/api/Member/Query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        UserID: 'vastar',
        Password: 'vastar@2673',
        Account_Name,
      }),
    });

    const queryData = await queryRes.json();

    if (queryData.Result === 0 && queryData.Account_Name) {
      return res.status(200).json({ registered: true, message: '此手機號碼已註冊' });
    } else {
      return res.status(200).json({ registered: false, message: '此號碼尚未註冊，可使用' });
    }
  } catch (error) {
    return res.status(500).json({ message: '查詢失敗', error: error.message });
  }
}
