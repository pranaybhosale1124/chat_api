const { createHmac } = require('node:crypto');
const Chat = require('../models/chat');
const { storeChat, updateChat, getChat } = require('../bin/cache-store');

async function getChatKey(sender, receiver) {
    const sortedNumbers = [sender, receiver].sort((a, b) => a - b);
    const key = sortedNumbers.join('_');
    const hash = createHmac('sha256', 'abcde').update(key).digest('hex');
    return hash;
}

async function saveChat(senderId, recipientId, message) {
    try {
        const chat_id = await getChatKey(senderId, recipientId);

        // 1. Check Cache for Existing Chat Data
        const cachedChat = await getChat(chat_id);

        if (cachedChat) {
            console.log(`Chat data retrieved from cache for chat_id: ${chat_id}`);
            // Update existing chat data in cache
            const updatedChatData = cachedChat.chat_data.concat({ 'senderId': senderId, 'recipientId': recipientId, 'message': message, 'timestamp': new Date() });
            await storeChat(chat_id, { ...cachedChat, chat_data: updatedChatData });
            if (updatedChatData.length % 10 === 0) {
                await Chat.updateOne({ chat_id }, {
                    chat_data: updatedChatData,
                    last_timestamp: new Date(),
                    last_message: message
                });
            }
        } else {
            // 2. Fetch Chat Data from Model (if not found in cache)
            const existingChat = await Chat.findOne({ chat_id });

            if (existingChat) {
                // Update existing chat data in model and potentially cache it
                const updatedChatData = existingChat.chat_data.concat({ 'senderId': senderId, 'recipientId': recipientId, 'message': message, 'timestamp': new Date() });
                if (existingChat.chat_data.length % 10 === 1) {
                    await Chat.updateOne({ chat_id }, {
                        chat_data: updatedChatData,
                        last_timestamp: new Date(),
                        last_message: message
                    });
                }
                // Update cache with the latest data (optional)
                await storeChat(chat_id, { ...existingChat._doc, chat_data: updatedChatData });
            } else {
                // Insert new chat data in model and cache it
                const newChat = new Chat({
                    chat_id,
                    chat_data: [{ 'senderId': senderId, 'recipientId': recipientId, 'message': message, 'timestamp': new Date() }],
                    last_timestamp: new Date(),
                    last_message: message
                });
                await newChat.save();

                // Store new chat data in cache
                await storeChat(chat_id, {
                    chat_id,
                    chat_data: [{ 'senderId': senderId, 'recipientId': recipientId, 'message': message, 'timestamp': new Date() }],
                    last_timestamp: new Date(),
                    last_message: message
                });
            }
        }
    } catch (error) {
        console.error('Error saving chat:', error);
    }
}


module.exports = { saveChat, getChatKey }