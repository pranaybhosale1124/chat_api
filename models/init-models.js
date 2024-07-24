var DataTypes = require("sequelize").DataTypes;
// var _chat = require("./chat");
var _recent_chat = require("./recent_chat");
var _user = require("./user");

function initModels(sequelize) {
  // var chat = _chat(sequelize, DataTypes);
  var recent_chat = _recent_chat(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  recent_chat.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(recent_chat, { as: "recent_chats", foreignKey: "user_id"});

  return {
    recent_chat,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
