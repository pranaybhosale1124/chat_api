const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chat', {
    chat_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    chat_data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    last_timestamp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_message: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'chat',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "chat_id" },
        ]
      },
    ]
  });
};
