// server.js
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");

// 2. Inisialisasi aplikasi Express dan server HTTP
const app = express();
const server = http.createServer(app);
const io = new Server(server); // Ikat Socket.IO ke server HTTP

// 3. Konfigurasi Express
// Set EJS sebagai view engine
app.set('view engine', 'ejs');
// Tentukan lokasi folder views
app.set('views', path.join(__dirname, 'views'));
// Sajikan file statis (CSS, gambar) dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// 4. Buat route utama untuk menyajikan halaman chat
app.get('/', (req, res) => {
  res.render('index', { title: 'Chat Real-Time Sederhana' }); // Render file index.ejs
});

// 5. Logika Socket.IO untuk real-time communication
io.on('connection', (socket) => {
  console.log('✅ Seorang pengguna terhubung:', socket.id);

  // Kirim pesan ke semua klien KECUALI yang baru terhubung
  socket.broadcast.emit('system message', 'Seorang pengguna baru telah bergabung.');

  // Mendengarkan event 'chat message' dari klien
  socket.on('chat message', (msg) => {
    console.log(`💬 Pesan dari ${socket.id}: ${msg}`);
    // Meneruskan pesan tersebut ke SEMUA klien yang terhubung
    io.emit('chat message', msg);
  });

  // Menangani ketika klien terputus
  socket.on('disconnect', () => {
    console.log('❌ Seorang pengguna terputus:', socket.id);
    // Kirim pesan ke semua klien yang tersisa
    io.emit('system message', 'Seorang pengguna telah meninggalkan chat.');
  });
});


// 6. Jalankan server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});