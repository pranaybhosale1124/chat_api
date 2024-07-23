var express = require('express');
var router = express.Router();

const sequelize = require('../models/db-config')
var initModels = require("../models/init-models");
var models = initModels(sequelize);

async function getUnreadChats(userId) {
    const transaction = await sequelize.transaction();

    try {
        // Find the recent chat record for the user within the transaction
        const recentChat = await models.recent_chat.findOne({
            where: { user_id: userId },
            transaction
        });

        if (!recentChat) {
            await transaction.commit();
            return []; // No recent chats found
        }

        // Extract the unread chats
        const unreadChats = recentChat.chat;

        // Delete the record from the table
        await models.recent_chat.destroy({
            where: { user_id: userId },
            transaction
        });

        // Commit the transaction
        await transaction.commit();

        return unreadChats;
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        console.error('Error fetching or deleting unread chats:', error);
        throw new Error('Unable to fetch or delete unread chats');
    }
}

router.get('/unread-chats/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const unreadChats = await getUnreadChats(userId);
        res.status(200).json(unreadChats);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Unable to fetch unread chats' });
    }
});


module.exports=router