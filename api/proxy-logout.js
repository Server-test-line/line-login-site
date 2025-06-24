export async function logout() {
  try {
    await fetch('/api/logout', { method: 'POST' });

    // 清除登入資訊
    localStorage.removeItem('userName');

    // 導回登入頁面
    window.location.href = 'index.html';
  } catch (error) {
    console.error('登出失敗', error);
    alert('登出失敗，請稍後再試。');
  }
}
