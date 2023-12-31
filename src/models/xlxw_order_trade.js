const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('xlxw_order_trade', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "id"
    },
    order_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "订单id"
    },
    trade_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "商品id"
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "商品购买的数量"
    }
  }, {
    sequelize,
    tableName: 'xlxw_order_trade',
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
