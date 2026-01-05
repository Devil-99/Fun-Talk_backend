const express = require('express');
const http = require('http');
const userRoutes = require('./routes/userRouters');
const messegeRouter = require('./routes/messegesRoute');
const authRoutes = require('./routes/authRoutes');
const socket = require('socket.io');
const cors = require('cors');

const app = express();
require("dotenv").config(); // this is use to configure the environment variable here.
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json()); // This has been used por parsing json string passed in POST method
const allowedOrigins = [
    'http://localhost:3000',
    'https://fun-talk.netlify.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin like mobile apps or curl
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', messegeRouter);

app.get('/', (req, res) => {
    res.send("This is the Home Page !");
    res.end();
})

// Create HTTP server using the Express app
const server = http.createServer(app);

// Setup Socket.IO with the HTTP server
const io = socket(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Setup the connection event
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle receiving a message from the client
    socket.on('message', (message) => {
        // Emit message back to the client
        io.emit('message', message); // Broadcast to all connected clients
    });

    socket.on('delete-message', (msg) => {
        io.emit('deleted',msg);
    });

    socket.on('login', (user) => {
        // Broadcast the user login event to all clients
        io.emit('login', user);
    });

    socket.on('logout', (user) => {
        // Broadcast the user logout event to all clients
        io.emit('logout', user);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log("Server is listening on Port-", PORT);
});