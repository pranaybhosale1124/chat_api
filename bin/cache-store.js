const redis = require('redis');
const redisClient = redis.createClient({
    url: "rediss://default:AZUEAAIncDFkOWM5NGYxZWNjMTM0YWQxYjM2YjUyNzZmOTUwMjg1M3AxMzgxNDg@humane-sponge-38148.upstash.io:6379"
});

async function connectRedisClient() {
    await redisClient.connect()
}

async function storeChat(key, data) {
    try {
        data = JSON.stringify(data);
        console.log(key, data);
        await redisClient.set(key, data);
        return true;
    } catch (err) {
        console.error('Error storing object:', err);
        return false;
    }
}

async function getChat(key) {
    try {
        const data = await redisClient.get(key);
        if (data) {
            return JSON.parse(data);
        } else {
            return null;
        }
    } catch (err) {
        console.error('Error retrieving object:', err);
        return null;
    }
}

async function updateChat(key, data) {
    try {
        const existingChat = await getChat(key);

        if (existingChat) {
            try {
                const { chat_data } = JSON.parse(existingChat); // Parse and destructure
                const updatedChat = { ...existingChat, chat_data: [...chat_data, data] };
                const updateResult = await storeChat(key, updatedChat);
                return updateResult ? true : false;
            } catch (parseErr) {
                console.error('Error parsing existing chat data:', parseErr);
                return false;
            }
        } else {
            const storeResult = await storeChat(key, data);
            return storeResult ? true : false;
        }
    } catch (err) {
        console.error('Error updating object:', err);
        return false;
    }
}

async function deletePair(keyToDelete) {
    try {
        const deleted = await redisClient.DEL(keyToDelete);
        if (deleted === 1) {
            console.log('Key-value pair deleted successfully');
            return true;
        } else {
            console.log('Key not found');
            return false;
        }
    } catch (err) {
        console.error('Error deleting key:', err);
        return false;
    }
}


module.exports = { connectRedisClient, storeChat, updateChat, getChat, deletePair };
