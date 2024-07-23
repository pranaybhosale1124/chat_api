const { Server } = require("socket.io");
const {saveChat}=require('../service/chat-service')
let users = {};
const RecentChat = require('../models/recent_chat'); // Adjust path as necessary

const sequelize = require('../models/db-config')
var initModels = require("../models/init-models");
var models = initModels(sequelize);

function setupWebSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
        }
    });

    io.on('connection', (socket) => {
        // Register new User
        socket.on('store_user', (userId) => {
            users[userId] = socket.id;
        });

        // On Incoming Message
        socket.on('message', async (data) => {
            const recipientSocketId = users[data.recipientId];
            const senderSocketId = users[data.senderId];

            if (recipientSocketId) {
                io.to(recipientSocketId).emit('message', data);
            } else {
                // Update or create recent chat record for the offline recipient
                try {
                    const existingChat = await models.recent_chat.findOne({
                        where: { user_id: data.recipientId }
                    });

                    if (existingChat) {
                        // Update the chat array with the senderId
                        const chatArray = [data.senderId, ...existingChat.chat];
                        await existingChat.update({ chat: chatArray });
                    } else {
                        // Create a new record if not found
                        await models.recent_chat.create({
                            user_id: data.recipientId,
                            chat: [data.senderId]
                        });
                    }
                } catch (error) {
                    console.error('Error updating or creating recent chat record:', error);
                }
            }

            if (senderSocketId) {
                io.to(senderSocketId).emit('message', data);
            }

            // Function to save chat in a database or other storage
            saveChat(data.senderId, data.recipientId, data.message);
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
