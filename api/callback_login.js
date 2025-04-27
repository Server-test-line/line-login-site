export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支援 POST 方法' });
  }

  const { userId, loginSuccess } = req.body;

  if (!userId) {
    return res.status(400).json({ message: '缺少 userId' });
  }

  console.log('🔔 收到登入通知：', { userId, loginSuccess });

  // TODO: 這邊可以自己加更多功能，比如：
  // - 更新資料庫
  // - 把 userId 綁定到某個 session 等等

  // 準備發送訊息
  const message = {
    to: userId,  // 假設 userId 是 LINE 的 userId
    messages: [
      {
        type: 'text',
        text: loginSuccess ? '登入成功！' : '登入失敗！'
      }
    ]
  };

  // LINE BOT 的 Channel Access Token
  const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

  try {
    // 使用 CHANNEL_ACCESS_TOKEN 發送訊息給使用者
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`  // 使用 Bearer token
      },
      body: JSON.stringify(message)  // 訊息內容
    });

    if (response.ok) {
      console.log('✅ 成功發送訊息給使用者！');
    } else {
      console.error('🚫 發送訊息失敗：', response.statusText);
    }
  } catch (error) {
    console.error('🚫 發送訊息時發生錯誤：', error);
  }

  return res.status(200).json({ message: '收到登入回傳！', userId, loginSuccess });
}
