var express = require('express');
var router = express.Router();

const sequelize = require('../models/db-config')
var initModels = require("../models/init-models");
const { getChatKey } = require('../service/chat-service')
var models = initModels(sequelize);
const { storeChat, updateChat, getChat } = require('../bin/cache-store')

router.post('/get-chat', async (req, res) => {
    let currentUser = req.body.me;
    let user = req.body.user;
    let chat_id = await getChatKey(currentUser, user);

    let chat = await getChat(chat_id);
    if (!chat)
        chat = await models.chat.findOne({ where: { chat_id }, attributes: ['chat_data'] });
    if (chat) {
        res.status(200).json({ chat_data: chat.chat_data });
    } else {
        res.status(200).json({ chat_data: [] });
    }
});

module.exports = router;