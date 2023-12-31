const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('menupermission', {
    id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true
    },
    menupermissionname: {
      type: DataTypes.STRING(16),
      allowNull: false,
      comment: "角色名称"
    },
    menulists: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: "权限集合"
    },
    details: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    createtime: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'menupermission',
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
