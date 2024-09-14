const express = require('express');
const userRoutes = require('./routes/userRouters');
const messegeRouter = require('./routes/messegesRoute');
const authRoutes = require('./routes/authRoutes');
const socket = require('socket.io');
const cors = require('cors');

const app = express();
require("dotenv").config(); // this is use to configure the environment variable here.
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json()); // This has been used por parsing json string passed in POST method
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Access-Control-Allow-Headers'
    );
    next();
});

app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', messegeRouter);

app.get('/', (req, res) => {
    res.send("This is the Home Page !");
    res.end();
})

const server = app.listen(PORT, () => {
    console.log("Server started on Port-", PORT);
});

// const io = socket(server, {
//     cors: {
//         origin: process.env.ORIGIN,
//         credentials: true,
//     },
// });

// global.onlineUsers = new Map();
// global.online = new Map();

// io.on('connection', (socket) => {
//     global.chatSocket = socket;

//     socket.on('add-user', (userId) => {
//         onlineUsers.set(userId, socket.id);
//         online.set(socket.id, userId);
//     });

//     socket.on('online', (userID) => {
//         const isOnline = onlineUsers.has(userID);
//         if (isOnline)
//             socket.emit('isOnline', true);
//         else
//             socket.emit('isOnline', false);
//     });

//     socket.on('send-msg', (data) => {
//         const sendUserSocket = onlineUsers.get(data.to);
//         if (sendUserSocket) {
//             socket.to(sendUserSocket).emit('msg-recieved', data.messege);
//         }
//     });

//     socket.on('delete-msg', (data) => {
//         const sendUserSocket = onlineUsers.get(data.to);
//         if (sendUserSocket) {
//             socket.to(sendUserSocket).emit('msg-deleted');
//         }
//     });

//     socket.on('disconnect', () => {
//         const offlineUserId = online.get(socket.id);
//         onlineUsers.delete(offlineUserId);
//         online.delete(socket.id);
//     });
// });