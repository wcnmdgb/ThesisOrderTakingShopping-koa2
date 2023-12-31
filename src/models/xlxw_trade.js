const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('xlxw_trade', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    desc: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "商品描述"
    },
    image: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "图片链接"
    },
    money: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "价格"
    },
    product_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "绑定类型的id"
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    del: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0未删除 1 已删除"
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0上架 1下架"
    }
  }, {
    sequelize,
    tableName: 'xlxw_trade',
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
