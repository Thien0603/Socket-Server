const express = require('express');
const app = express();
const http = require('http').createServer(app);

// 1. Tạo một trang chủ nhỏ để Render nhận diện Server đang "sống"
app.get('/', (req, res) => {
    res.send('TDTU Socket Server is Running 100% OK!');
});

// 2. Khởi tạo Socket.io với CORS "mở toang" (Dấu * nghĩa là cho phép tất cả)
const io = require("socket.io")(http, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
    console.log('Một người dùng đã kết nối');

    socket.on('join-note', (noteId) => {
        socket.join(`note_${noteId}`);
        console.log(`User đã vào phòng: note_${noteId}`);
    });

    socket.on('edit-note', (data) => {
        socket.to(`note_${data.noteId}`).emit('note-updated', data.content);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Socket.io server đang chạy tại port ${PORT}`);
});