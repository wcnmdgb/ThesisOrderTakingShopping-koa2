const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('xlxw_drawing', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    image: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0为使用 1为下架"
    },
    del: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0为正常 1为删除"
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "分类标题"
    }
  }, {
    sequelize,
    tableName: 'xlxw_drawing',
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
