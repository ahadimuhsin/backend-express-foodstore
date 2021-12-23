//mengambil token
const {getToken} = require('../utils/get-token');
//import jwt
const jwt = require('jsonwebtoken');
//import config
const config = require('../config');
//import model User
const User = require('../user/model');


//untuk membaca token dan mengubahnya menjadi objek user
function decodeToken()
{
    return async function(req, res, next)
    {
        try{
            let token = getToken(req);
            //jika request tidak ada token, lanjutkan untuk diproses
            if(!token) return next();
            //kalo ada token, decode dengan jwt.verify
            req.user = jwt.verify(token, config.secretKey);
            //cari token yg ada di model User
            let user = await User.findOne({token: {$in: [token]}});

            if(!user)
            {
                return res.json({
                    error: 1,
                    message: 'Token Expired'
                });
            }
        }
        catch(err)
        {
            //error handling
            if(err && err.name === 'JsonWebTokenError')
            {
                return res.json({
                    error: 1,
                    message: err.message
                });
            }
            next(err);
        }

        return next();
    }
}

module.exports = {
    decodeToken
}