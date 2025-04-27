export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支援 POST 方法' });
  }

  const { userId, loginSuccess } = req.body;

  if (!userId) {
    return res.status(400).json({ message: '缺少 userId' });
  }

  console.log('🔔 收到登入通知：', { userId, loginSuccess });

  // 準備發送訊息到 LINE 官方
  const message = {
    to: userId,
    messages: [
      {
        type: 'text',
        text: loginSuccess ? '登入成功！' : '登入失敗！'
      }
    ]
  };

  const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

  try {
    // 1. 先推送訊息給使用者
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify(message)
    });

    if (response.ok) {
      console.log('✅ 成功發送訊息給使用者！');
    } else {
      console.error('🚫 發送訊息失敗：', response.statusText);
    }

    // 2. 再通知自己的 Line Bot 更新 user_states
    const callbackLoginResponse = await fetch('https://line-bot-test-1nbj7bgpq-server-tests-projects.vercel.app/callback_login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, loginSuccess })
    });

    if (callbackLoginResponse.ok) {
      console.log('✅ 成功通知 Line Bot 更新登入狀態');
    } else {
      console.error('🚫 通知 Line Bot 失敗：', callbackLoginResponse.statusText);
    }

  } catch (error) {
    console.error('🚫 發送訊息或通知 Line Bot 時發生錯誤：', error);
  }

  return res.status(200).json({ message: '收到登入回傳！', userId, loginSuccess });
}
