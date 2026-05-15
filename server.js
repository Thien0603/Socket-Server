const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" } // Cho phép Laravel truy cập
});

io.on('connection', (socket) => {
    // Khi người dùng mở ghi chú, họ sẽ vào một "Room" riêng biệt [cite: 265]
    socket.on('join-note', (noteId) => {
        socket.join(`note_${noteId}`);
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

http.listen(3000, () => {
    console.log('Socket.io server đang chạy tại port 3000');
});