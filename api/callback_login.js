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
  let message = {};

  if (loginSuccess) {
    // 登入成功時發送包含按鈕的訊息
    message = {
      to: userId,
      messages: [
        {
          type: 'template',
          altText: '登入成功，選擇下一步操作',
          template: {
            type: 'buttons',
            title: '登入成功！',
            text: '選擇您接下來想做的操作：',
            actions: [
              {
                type: 'message',
                label: '查看帳戶',
                text: '查看帳戶',
              },
              {
                type: 'message',
                label: '聯繫客服',
                text: '聯繫客服',
              },
              {
                type: 'message',
                label: '退出',
                text: '退出',
              },
            ],
          },
        },
      ],
    };
  } else {
    // 登入失敗時，發送簡單的訊息
    message = {
      to: userId,
      messages: [
        {
          type: 'text',
          text: '登入失敗，請重新嘗試。',
        },
      ],
    };
  }

  const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

  try {
    // 1. 推送訊息給使用者
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

    // 2. 通知 Line Bot 更新 user_states
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
    return res.status(500).json({ message: '內部伺服器錯誤' });
  }

  return res.status(200).json({ message: '收到登入回傳！', userId, loginSuccess });
}
