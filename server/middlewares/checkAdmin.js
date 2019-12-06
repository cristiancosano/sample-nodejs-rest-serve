

let checkAdmin = (req, res, next) => {
    if(req.user.role == 'ADMIN_ROLE'){
        next();
    }
    else{
        res.status(401).json({
            ok: true,
            error:{
                message:'Unauthorized. You need admin privileges for this action.'
            }
        })
    }
}

module.exports = checkAdmin