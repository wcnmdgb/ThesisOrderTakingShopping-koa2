const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('xlxw_log', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "id"
    },
    admin_user_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "用户id"
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0 登陆 1删除 "
    },
    desc: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: "描述日志信息 "
    },
    ip: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: "记录操作的ip"
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'xlxw_log',
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
