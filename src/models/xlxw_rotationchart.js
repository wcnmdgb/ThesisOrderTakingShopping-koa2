const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('xlxw_rotationchart', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    del: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0 删除1不删除"
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0启用 1不启用"
    }
  }, {
    sequelize,
    tableName: 'xlxw_rotationchart',
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
