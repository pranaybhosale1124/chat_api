const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('812383719002-m9ng6v57jds0cd452f15nlq7lomivtca.apps.googleusercontent.com');
const { welcomeMessage } = require('./public/welcome-message');
const { saveChat, getChatKey } = require('./service/chat-service')
const sequelize = require('./models/db-config')
var initModels = require("./models/init-models");
const { updateRecentChat } = require('./service/recent-chat-service');

var models = initModels(sequelize);

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '812383719002-m9ng6v57jds0cd452f15nlq7lomivtca.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();
    req.user = payload;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};


const authorizeUser = async (req, res, next) => {
  const payload = req.user;
  try {
    let user = await models.user.findOne({ where: { 'email_id': payload.email } });

    if (!user) {
      user = await models.user.create({
        user_name: payload.name,
        profile_picture: payload.picture,
        last_name: payload.family_name,
        first_name: payload.given_name,
        email_id: payload.email,
        active_status: true,
        information: '',
        contact_number: ''
      });

      await saveChat( welcomeMessage.sender, user.user_id, welcomeMessage.message)

      await updateRecentChat({
        recipientId: user.user_id,
        senderId: welcomeMessage.sender
      })
    }
    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: 'USER NOT FOUND' });
  }
};


module.exports = { verifyToken, authorizeUser };
