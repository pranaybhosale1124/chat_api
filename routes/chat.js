var express = require('express');
var router = express.Router();

const sequelize = require('../models/db-config')
var initModels = require("../models/init-models");
const { getChatKey } = require('../service/chat-service')
const Chat = require('../models/chat');
var models = initModels(sequelize);
const { storeChat, updateChat, getChat } = require('../bin/cache-store')

router.post('/get-chat', async (req, res) => {
    try {
        let currentUser = req.body.me;
        let user = req.body.user;
        let chat_id = await getChatKey(currentUser, user);

        // Check cache for existing chat data
        let chat = await getChat(chat_id);

        if (!chat) {
            // Fetch chat data from MongoDB if not found in cache
            chat = await Chat.findOne({ chat_id }, 'chat_data');
        }

        if (chat) {
            res.status(200).json({ chat_data: chat.chat_data });
        } else {
            res.status(200).json({ chat_data: [] });
        }
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;