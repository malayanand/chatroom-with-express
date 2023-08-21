const express = require('express');
const path = require("path");
const http = require("http");
const socketio = require('socket.io');
const messageObject = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app)
const io = socketio(server);

const bot = "ChatCord bot";

// STATIC FILE
app.use(express.static(path.join(__dirname, 'public')));


// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom' , ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit('message', messageObject(bot, "Welcome to ChatCord!"));
        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', messageObject(bot, `${user.username} user joined the room`));    // use to broadcast to everyone in room except the user
        // io.emit(); -> use to broadcast message to eveyone
        
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for chat message
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        
        // sending it back to the client
        io.to(user.room).emit('message', messageObject(user.username, msg));
    });       
    
    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', messageObject(bot,`${user.username} has left the room`));            
        }
        
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
