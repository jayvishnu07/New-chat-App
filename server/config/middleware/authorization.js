require('dotenv').config()
const jwt = require('jsonwebtoken');


const authorization = async (req, res, next) => {
    let token;
    try {
        const header = req.headers && req.headers['authorization']
        token = header.split(' ')[1];
        if (token) {
            jwt.verify(token, 'Jaivishnu@123', (error, user) => {
                if (error) return res.status(403).send('Jwt verification error')
                req.currentUser = user;
                next();
            })
        }
        else {
            res.status(401);
            throw new Error("No Token Found")
        }
    } catch (error) {
        res.status(401).send("error from authorization")
    }
}


module.exports = authorization; 


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0M2MwMjk0Y2ZkMmQ3ZGQyY2ExOTUyZCIsImlhdCI6MTY4Mjc2NTA5MywiZXhwIjoxNjgzNjI5MDkzfQ.FBt3cO3FCBObvV_dxHwtwjwPVga8G1rULzxYPPIFVME