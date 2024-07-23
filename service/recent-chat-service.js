
const RecentChat = require('../models/recent_chat'); // Adjust path as necessary

const sequelize = require('../models/db-config')
var initModels = require("../models/init-models");
var models = initModels(sequelize);

async function updateRecentChat(data) {
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

module.exports = { updateRecentChat }