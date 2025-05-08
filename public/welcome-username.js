document.addEventListener("DOMContentLoaded", function () {
  const accountName = localStorage.getItem("userName");
  const displayName = localStorage.getItem("displayName");
  const usernameEl = document.querySelector('.username');

  if (!usernameEl) return;

  if (!accountName) {
    usernameEl.textContent = "歡迎，訪客";
    usernameEl.style.visibility = "visible";
    return;
  }

  if (displayName) {
    usernameEl.textContent = `歡迎，${displayName}`;
    usernameEl.style.visibility = "visible";
  }

  fetch('/api/proxy-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Account_Name: accountName })
  })
    .then(res => res.json())
    .then(data => {
      if (data.Result === 0 && data.Name) {
        localStorage.setItem("displayName", data.Name);
        usernameEl.textContent = `歡迎，${data.Name}`;
      } else {
        usernameEl.textContent = "歡迎，會員";
      }
      usernameEl.style.visibility = "visible";
    })
    .catch(err => {
      console.error("查詢會員錯誤：", err);
      usernameEl.textContent = "歡迎，會員";
      usernameEl.style.visibility = "visible";
    });
});
