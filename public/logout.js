async function logout() {
  try {
    await fetch('/api/proxy-logout', { method: 'POST' });
    localStorage.clear();
    window.location.href = 'index.html';
  } catch (error) {
    console.error('登出失敗', error);
    alert('登出失敗，請稍後再試。');
  }
}
