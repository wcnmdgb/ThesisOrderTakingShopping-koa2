const { xlxw_log: log, pic_user: user, pic_system: System } = require('../db')

class sysService {
   
    async intolog(admin_user_id, status, desc, ip) {
        const res = await log.create({
            admin_user_id,
            status,
            desc,
            ip,
            create_time: new Date()
        })
        return res.dataValues
    }
}

module.exports = new sysService()