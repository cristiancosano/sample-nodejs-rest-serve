const jwt = require('jsonwebtoken')

let checkToken = (req, res, next) => {
    let token = req.get('token')

    jwt.verify(token, process.env.SEED, (error, decoded) => {
        if(error){
            res.status(400).json({
                ok: false,
                error
            })
        }
        else{
            req.user = decoded.user
            next()
        }
    })
    
}



module.exports = checkToken
