const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('account', {
    accountid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    account: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: "字段 如’admin‘,'user'"
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    permits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "权限值"
    },
    forbidden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "是否被禁用"
    },
    createtime: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'account',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "accountid" },
        ]
      },
    ]
  });
};
