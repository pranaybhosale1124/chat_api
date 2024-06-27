var DataTypes = require("sequelize").DataTypes;
var _chat = require("./chat");
var _user = require("./user");

function initModels(sequelize) {
  var chat = _chat(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);


  return {
    chat,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
