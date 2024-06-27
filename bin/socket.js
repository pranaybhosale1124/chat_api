const { Server } = require("socket.io");
const {saveChat}=require('../service/chat-service')
let users = {};




function setupWebSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        // Register new User
        socket.on('store_user', (userId) => {
            users[userId] = socket.id;
        });

        // On Incoming Message
        socket.on('message', (data) => {
            const recipientSocketId = users[data.recipientId];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('message', data);
            } else {
                console.log(`Recipient ${data.recipientId} is not online.`);
            }
            saveChat(data.senderId, data.recipientId, data.message)
        });


        // On Client Disconnect 
        socket.on('disconnect', () => {
            Object.keys(users).forEach((userId) => {
                if (users[userId] === socket.id) {
                    delete users[userId];
                    console.log(`User ${userId} removed from users map.`);
                }
            });
        });
    });
}

module.exports = setupWebSocket;
