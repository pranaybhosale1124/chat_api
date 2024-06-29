var DataTypes = require("sequelize").DataTypes;
var _cenent_chat = require("./cenent_chat");
var _chat = require("./chat");
var _user = require("./user");

function initModels(sequelize) {
  var cenent_chat = _cenent_chat(sequelize, DataTypes);
  var chat = _chat(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  cenent_chat.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(cenent_chat, { as: "cenent_chats", foreignKey: "user_id"});

  return {
    cenent_chat,
    chat,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
