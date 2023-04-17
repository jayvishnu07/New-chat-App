const jwt = require('jsonwebtoken')


const getJwtTocken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{ expiresIn : '10d' })
}

module.exports = getJwtTocken;