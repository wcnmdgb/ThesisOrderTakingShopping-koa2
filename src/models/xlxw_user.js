const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('xlxw_user', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: "用户账号"
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "创建时间"
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "修改时间"
    },
    vip: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "顺序vip 最多到5"
    },
    ban: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0 封禁 1 正常"
    },
    user_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "opena-id"
    }
  }, {
    sequelize,
    tableName: 'xlxw_user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
