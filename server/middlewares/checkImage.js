const jwt = require('jsonwebtoken')

let checkImage = (req, res, next) => {
    let token = req.query.token

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



module.exports = checkImage