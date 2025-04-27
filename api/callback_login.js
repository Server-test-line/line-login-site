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
  // - 發送訊息給使用者
  // - 把 userId 綁定到某個 session 等等

  return res.status(200).json({ message: '收到登入回傳！', userId, loginSuccess });
}
