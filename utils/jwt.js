const jwt = require('jsonwebtoken');
const jwtconfig = require('../app/config/jwt.config')
require('dotenv').config()

module.exports = {
    set_jwt_auth: async function (userdata, res) {
        try {
            if (userdata.dataValues.id > 0) {
                const token = jwt.sign({ user_id: userdata.dataValues.id }, process.env.API_KEY, { expiresIn: jwtconfig.jwtAccessExpiration });
                const refreshToken = jwt.sign({ user_id: userdata.dataValues.id }, process.env.API_KEY)
                res.cookie("accessToken", token, { httpOnly: true })
                res.cookie("refreshToken", refreshToken, { httpOnly: true });
                var result = {
                user_id: userdata.dataValues.id, first_name: userdata.dataValues.first_name, last_name: userdata.dataValues.last_name,
                email: userdata.dataValues.email
                };
                return await result;
            } else {
                res.status(400).send({
                    msg: 'Bad request'
                })
            }

        } catch (error) {
            res.status(400).send({
                msg: 'bad request'
            })
        }
    }
}