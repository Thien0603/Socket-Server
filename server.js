const express = require('express');
const app = express();
const http = require('http').createServer(app);

// Khởi tạo Socket.io với biến 'http' đã khai báo ở trên
const io = require("socket.io")(http, {
  cors: {
    origin: "http://ghichucuatoi.gt.tc", // Tên miền web Laravel của bạn
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
    console.log('Một người dùng đã kết nối');

    // Khi người dùng mở ghi chú, họ sẽ vào một "Room" riêng biệt
    socket.on('join-note', (noteId) => {
        socket.join(`note_${noteId}`);
        console.log(`User đã vào phòng: note_${noteId}`);
    });

    // Lắng nghe sự kiện gõ chữ và phát lại cho những người khác trong phòng 
    socket.on('edit-note', (data) => {
        // data bao gồm: noteId, content
        socket.to(`note_${data.noteId}`).emit('note-updated', data.content);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Cấu hình PORT linh hoạt cho Render (dùng biến môi trường PORT hoặc mặc định 3000)
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Socket.io server đang chạy tại port ${PORT}`);
});