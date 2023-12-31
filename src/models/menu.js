const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('menu', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
      allowNull: false,
      primaryKey: true,
      comment: "菜单表"
    },
    menu_name: {
      type: DataTypes.STRING(16),
      allowNull: true,
      comment: "菜单名称"
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "父菜单名称"
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "排序"
    },
    menu_url: {
      type: DataTypes.STRING(16),
      allowNull: false,
      comment: "菜单路由"
    },
    icon: {
      type: DataTypes.STRING(16),
      allowNull: false,
      comment: "图标"
    },
    perms: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(8),
      allowNull: false,
      comment: "状态"
    },
    createtime: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'menu',
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
