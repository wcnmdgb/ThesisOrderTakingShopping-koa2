const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('xlxw_order', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "订单id"
    },
    user_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "用户id"
    },
    coupon_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "用户优惠券id"
    },
    actual_payment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "实付"
    },
    payment: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "支付方式 0 微信 1 余额"
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "修改时间"
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "创建时间"
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "地址id"
    },
    ip: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: "创建ip"
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "订单类型 0未支付 1待取货 2待清洗 3配送中 4 已完成  5订单失效"
    },
    del: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0 未删除 1已删除"
    }
  }, {
    sequelize,
    tableName: 'xlxw_order',
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
