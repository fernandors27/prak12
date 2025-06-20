const API_URL = 'http://localhost:5000/api/films';

const container = document.getElementById("daftar-film");
const loadingText = document.getElementById("loading");
const formFilm = document.getElementById("form-film");

let semuaFilm = [];

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("Anda belum login.");
    window.location.href = 'login.html';
    return;
  }

  if (formFilm) formFilm.onsubmit = defaultSubmit;

  tampilkanDaftarFilm();
});

function tampilkanDaftarFilm() {
  loadingText.style.display = 'block';

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      semuaFilm = data;
      container.innerHTML = "";

      data.forEach(film => {
        const filmDiv = document.createElement("div");
        filmDiv.classList.add("film-card");

        filmDiv.innerHTML = `
          <img src="${film.gambar}" alt="${film.judul}">
          <h3>${film.judul}</h3>
          <p>${film.deskripsi}</p>
          <small>Kategori: ${film.kategori}</small><br>
          <button onclick="editFilm('${film._id}')">Edit</button>
          <button onclick="hapusFilm('${film._id}')">Hapus</button>
        `;

        container.appendChild(filmDiv);
      });
    })
    .catch(err => console.error("Gagal mengambil data:", err))
    .finally(() => {
      loadingText.style.display = 'none';
    });
}

function defaultSubmit(event) {
  event.preventDefault();
  const token = localStorage.getItem('token');
  if (!token) return alert("Anda harus login dulu");

  const filmBaru = {
    judul: document.getElementById("judul").value,
    deskripsi: document.getElementById("deskripsi").value,
    kategori: document.getElementById("kategori").value,
    gambar: document.getElementById("gambar").value
  };

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(filmBaru)
  })
    .then(res => res.json())
    .then(() => {
      tampilkanDaftarFilm();
      formFilm.reset();
    })
    .catch(err => console.error("Gagal tambah film:", err));
}

function hapusFilm(id) {
  const token = localStorage.getItem('token');
  if (!token) return alert("Anda harus login dulu");

  fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(() => {
      tampilkanDaftarFilm();
    })
    .catch(err => console.error("Gagal menghapus film:", err));
}

function editFilm(id) {
  const film = semuaFilm.find(f => f._id === id);
  if (!film) return alert("Film tidak ditemukan!");

  document.getElementById("judul").value = film.judul;
  document.getElementById("deskripsi").value = film.deskripsi;
  document.getElementById("kategori").value = film.kategori;
  document.getElementById("gambar").value = film.gambar;

  formFilm.onsubmit = function (event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return alert("Anda harus login dulu");

    const filmUpdate = {
      judul: document.getElementById("judul").value,
      deskripsi: document.getElementById("deskripsi").value,
      kategori: document.getElementById("kategori").value,
      gambar: document.getElementById("gambar").value
    };

    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(filmUpdate)
    })
      .then(res => res.json())
      .then(() => {
        tampilkanDaftarFilm();
        formFilm.reset();
        formFilm.onsubmit = defaultSubmit;
      })
      .catch(err => console.error("Gagal mengedit film:", err));
  };
}

function logout() {
  localStorage.removeItem('token');
  alert("Logout berhasil!");
  window.location.href = 'login.html';
}
