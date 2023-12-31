const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('xlxw_address', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    checked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "是否为默认地址"
    },
    del: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0未删除 1删除"
    },
    phone: {
      type: DataTypes.STRING(16),
      allowNull: false,
      comment: "手机号"
    },
    dormitory_number: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: "宿舍楼号"
    },
    lou_number: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: "楼号"
    },
    desc: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "描述"
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    consignee_name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: "收货人名称"
    }
  }, {
    sequelize,
    tableName: 'xlxw_address',
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
