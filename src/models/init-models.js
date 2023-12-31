var DataTypes = require("sequelize").DataTypes;
var _admin_user = require("./admin_user");
var _product_type = require("./product_type");
var _xlxw_address = require("./xlxw_address");
var _xlxw_balance = require("./xlxw_balance");
var _xlxw_balance_order = require("./xlxw_balance_order");
var _xlxw_coupon = require("./xlxw_coupon");
var _xlxw_coupon_user = require("./xlxw_coupon_user");
var _xlxw_log = require("./xlxw_log");
var _xlxw_order = require("./xlxw_order");
var _xlxw_order_trade = require("./xlxw_order_trade");
var _xlxw_rotationchart = require("./xlxw_rotationchart");
var _xlxw_trade = require("./xlxw_trade");
var _xlxw_user = require("./xlxw_user");
var _menu = require("./menu");
var _menupermission = require("./menupermission");


var _xlxw_drawing = require('./xlxw_drawing');

function initModels(sequelize) {
  var admin_user = _admin_user(sequelize, DataTypes);
  var product_type = _product_type(sequelize, DataTypes);
  var xlxw_address = _xlxw_address(sequelize, DataTypes);
  var xlxw_balance = _xlxw_balance(sequelize, DataTypes);
  var xlxw_balance_order = _xlxw_balance_order(sequelize, DataTypes);
  var xlxw_coupon = _xlxw_coupon(sequelize, DataTypes);
  var xlxw_coupon_user = _xlxw_coupon_user(sequelize, DataTypes);
  var xlxw_log = _xlxw_log(sequelize, DataTypes);
  var xlxw_order = _xlxw_order(sequelize, DataTypes);
  var xlxw_order_trade = _xlxw_order_trade(sequelize, DataTypes);
  var xlxw_rotationchart = _xlxw_rotationchart(sequelize, DataTypes);
  var xlxw_trade = _xlxw_trade(sequelize, DataTypes);
  var xlxw_user = _xlxw_user(sequelize, DataTypes);
  var xlxw_drawing = _xlxw_drawing(sequelize, DataTypes);
  var menu = _menu(sequelize, DataTypes);
  var menupermission = _menupermission(sequelize, DataTypes);

  xlxw_trade.belongsTo(product_type, { foreignKey: 'product_type_id' })
  product_type.hasMany(xlxw_trade, { foreignKey: 'product_type_id' });


  xlxw_address.hasMany(xlxw_order, { foreignKey: 'address_id' })
  xlxw_order.belongsTo(xlxw_address, { foreignKey: 'address_id' })


  xlxw_coupon.hasMany(xlxw_order, { foreignKey: 'coupon_id' })
  xlxw_order.belongsTo(xlxw_coupon, { foreignKey: 'coupon_id' })


  xlxw_coupon.belongsTo(admin_user, { targetKey: 'user_id', foreignKey: 'user_id' });


  xlxw_order.hasMany(xlxw_order_trade, { sourceKey: 'order_id', foreignKey: 'order_id' });
  xlxw_order_trade.belongsTo(xlxw_order, { targetKey: 'order_id', foreignKey: 'order_id' });



  xlxw_order_trade.belongsTo(xlxw_trade, { foreignKey: 'trade_id' })



  xlxw_coupon_user.belongsTo(xlxw_coupon, { foreignKey: "coupon_id" })
  xlxw_coupon.hasMany(xlxw_coupon_user, { foreignKey: "coupon_id" })


  xlxw_user.hasMany(xlxw_coupon_user, { sourceKey: 'user_id', foreignKey: "user_id" })
  xlxw_coupon_user.belongsTo(xlxw_user, { targetKey: 'user_id', foreignKey: "user_id" })


  xlxw_log.belongsTo(xlxw_user, { targetKey: 'user_id', foreignKey: "admin_user_id" })

  xlxw_log.belongsTo(admin_user, { targetKey: 'user_id', foreignKey: "admin_user_id" })

  xlxw_user.hasMany(xlxw_balance, { sourceKey: "user_id", foreignKey: "user_id" })
  xlxw_balance.belongsTo(xlxw_user, { targetKey: 'user_id', foreignKey: "user_id" })


  admin_user.belongsTo(xlxw_drawing, { foreignKey: "user_id" })
  // xlxw_drawing.hasMany(admin_user, { foreignKey: "user_id" })

  // xlxw_coupon.belongsTo(xlxw_order, { foreignKey: 'coupon_id' })
  // xlxw_address.belongsTo(xlxw_order, { foreignKey: "address_id" })
  // xlxw_address.hasMany(xlxw_order, { foreignKey: 'address_id' });
  // xlxw_order.belongsTo(xlxw_address, { foreignKey: 'address_id' });

  admin_user.hasMany(xlxw_drawing, { sourceKey: "user_id", foreignKey: "user_id" })
  xlxw_drawing.belongsTo(admin_user, { targetKey: 'user_id', foreignKey: "user_id" })

  return {
    admin_user,
    product_type,
    xlxw_address,
    xlxw_balance,
    xlxw_balance_order,
    xlxw_coupon,
    xlxw_coupon_user,
    xlxw_log,
    xlxw_order,
    xlxw_order_trade,
    xlxw_rotationchart,
    xlxw_trade,
    xlxw_user,
    xlxw_drawing,
    menupermission,
    menu
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
