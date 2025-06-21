function loginUser(username, password) {
    fetch('https://backend-film.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }) // ✅ username!
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          alert("Login berhasil!");
          window.location.href = 'index.html';
        } else {
          alert("Login gagal! Cek username/password.");
        }
      })
      .catch(err => console.error("Login error:", err));
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('login-form');
    if (formLogin) {
      formLogin.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        loginUser(username, password);
      });
    }
  }); 