const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    user_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    profile_picture: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    information: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "email_id"
    },
    contact_number: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    active_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "email_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email_id" },
        ]
      },
    ]
  });
};
