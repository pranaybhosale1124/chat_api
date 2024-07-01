const redis = require('redis');
const redisClient = redis.createClient();

async function connectRedisClient() {
    await redisClient.connect()

}


async function storeChat(key, data) {
    try {
        data = JSON.stringify(data)
        console.log(key, data);
        await redisClient.set(key, data); // Ensure value is serialized
        console.log('Object stored in Redis');
    } catch (err) {
        console.error('Error storing object:', err);
    }
}

async function getChat(key) {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error('Error retrieving object:', err);
        return null;
    }
}

async function updateChat(key, data) {
    try {
        const chat = await getChat(key);
        console.log(chat);
        if (chat) {
            chat = JSON.parse(chat)
            chat.chat_data = [...chat.chat_data, data]; // Use spread operator for updates
            console.log(chat);
            let result = await storeChat(key, chat);
        } else {
            await storeChat(key, data)
        }
    } catch (err) {
        console.error('Error updating object:', err);
    }
}

async function deletePair(keyToDelete) {
    redisClient.DEL(keyToDelete, (err, deleted) => {
        if (err) {
            console.error('Error deleting key:', err);
        } else if (deleted === 1) {
            console.log('Key-value pair deleted successfully');
        } else {
            console.log('Key not found');
        }
    })
}

module.exports = { connectRedisClient, storeChat, updateChat, getChat, deletePair };
