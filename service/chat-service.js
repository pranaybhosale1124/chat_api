const crypto = require('crypto');
const Sequelize = require('sequelize');
const sequelize = require('../models/db-config')
var initModels = require("../models/init-models");
const chat = require('../models/chat');
const { timeStamp } = require('console');

var models = initModels(sequelize);

async function getChatKey(sender, receiver) {
    const sortedNumbers = [sender, receiver].sort((a, b) => a - b);
    const key = sortedNumbers.join('_');
    const hash = await crypto.createHash('sha256').update(key).digest('hex');
    return hash;
}

async function saveChat(senderId, recipientId, message) {
    try {
        const chat_id = await getChatKey(senderId, recipientId);
        const existingChat = await models.chat.findOne({ where: { chat_id } });

        if (existingChat) {
            // Update existing chat_data if chat_id already exists
            const updatedChatData = existingChat.chat_data.concat({ 'senderId': senderId, 'recipientId': recipientId, 'message': message, 'timestamp': new Date() });
            await models.chat.update({ chat_data: updatedChatData }, { where: { chat_id } });
            console.log(`Chat with chat_id ${chat_id} updated`);
        } else {
            // Insert new chat_data if chat_id doesn't exist
            await models.chat.create({ chat_id, chat_data: [{ 'senderId': senderId, 'recipientId': recipientId, 'message': message, 'timestamp': new Date() }] });
            console.log(`New chat with chat_id ${chat_id} inserted`);
        }
    } catch (error) {
        console.error('Error saving chat:', error);
    }
}


module.exports = { saveChat, getChatKey }