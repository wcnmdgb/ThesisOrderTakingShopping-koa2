const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('xlxw_coupon', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    money: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "卡券金额"
    },
    condition: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "卡券条件"
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "发放人"
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "数量"
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0为过期 1 过期"
    },
    del: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "删除"
    },
    title: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "卡券标题"
    }
  }, {
    sequelize,
    tableName: 'xlxw_coupon',
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
