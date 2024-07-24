const mongoDB = require('../models/mongo-config');
const Schema = mongoDB.Schema;

const chatSchema = new Schema({
    chat_id: { type: String, required: true, unique: true },
    chat_data: [{
        message: { type: String, required: true },
        senderId: { type: Number, required: true },
        recipientId: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    last_timestamp: { type: Date }
}, { timestamps: true });

const Chat = mongoDB.model('chats', chatSchema);

module.exports = Chat;
