const express= require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRouters');
const messegeRouter = require('./routes/messegesRoute');
const socket = require('socket.io');
const cors = require('cors');

const app = express();
require("dotenv").config(); // this is use to configure the environment variable here.
app.use(cors()); // this is used to allow CORS Policy to allow cross origin connection (from localost:3000 to localhost:5000)
app.use(express.json()); // This has been used por parsing json string passed in POST method

app.use('/api/auth', userRoutes);
app.use('/api/messeges', messegeRouter);

mongoose.set('strictQuery', true); // For DeprecationWarning
mongoose.connect(process.env.MONGO_CLOUD_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // We pass the useNewUrlParser: true, etc. to mongoose.connect() to avoid the DeprecationWarning.
}).then(()=>{
    console.log("Connection with Database is successful.")
}).catch((err)=>{
    console.log("Error occured while connecting with database",err);
});

app.get('/',(req,res)=>{
    res.send("This is the Home Page !");
    res.end();
})

const server = app.listen(process.env.PORT || 5000,()=>{
    console.log("Server started on Port-",process.env.PORT || 5000);
});

const io = socket(server,{
    cors: {
        origin: process.env.ORIGIN,
        credentials: true,
    },
});

global.onlineUsers = new Map();
global.online = new Map();

io.on('connection',(socket)=>{
    global.chatSocket = socket;

    socket.on('add-user',(userId)=>{
        onlineUsers.set(userId,socket.id);
        online.set(socket.id,userId);
    });

    socket.on('online',(userID)=>{
        const isOnline = onlineUsers.has(userID);
        if(isOnline)
            socket.emit('isOnline',true);
        else
            socket.emit('isOnline',false);
    });

    socket.on('send-msg',(data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('msg-recieved',data.messege);
        }
    });

    socket.on('delete-msg',(data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('msg-deleted');
        }
    });

    socket.on('disconnect',()=>{
        const offlineUserId = online.get(socket.id);
        onlineUsers.delete(offlineUserId);
        online.delete(socket.id);
    });
});