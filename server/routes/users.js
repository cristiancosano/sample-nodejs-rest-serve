const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const underscore = require('underscore')
const checkAdmin = require('../middlewares/checkAdmin')
const User = require('../models/user')


/* GET home page. */
router.get('/', (req, res, next) => {
    let skip = Number(req.query.skip) || 0 
    let limit = Number(req.query.limit) || 5

    User.find({status: true}, 'name email role google img')
        .skip(skip)
        .limit(limit)
        .exec((error, users) => {
            if(error){
                res.status(400).json({
                    ok: false,
                    error
                })
            }
            else{
                User.countDocuments({status: true}, (error, count) => {
                    if(error){
                        res.status(400).json({
                            ok: false,
                            error
                        })
                    }
                    else{
                        res.json({
                            ok: true,
                            users,
                            count
                        })
                    }
                })
                
            }
        })

});

router.post('/', checkAdmin, (req, res, next) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        role: req.body.role,
        img: req.body.img
    })
    user.save((error, userDB) => {
        if(error) res.status(400).json({
            ok: false,
            error
        })
        else{
            res.json({
                ok: true,
                user: userDB
            })
        }
    })
});

router.put('/:id', (req, res, next) => {

    let userId = req.params.id;
    let body = underscore.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(userId, body, {new: true, runValidators: true} ,(error, user)=>{ //{new:true} returns to callback the updated user
        if(error){
            res.status(400).json({
                ok: false,
                error
            })
        }
        else{
            res.json({
                ok: true,
                user
            })
        }
    });
});

router.delete('/:id', (req, res, next) => {
    let id = req.params.id

    //User.findByIdAndDelete(id, (error, user) => {
    User.findByIdAndUpdate(id, {status: false}, {new:true}, (error, user) => {
        if(error){
            res.status(400).json({
                ok: false,
                error
            })
        }
        else if(!user){
            res.status(400).json({
                ok: false,
                error: 'User not found',
            })
        }
        else{
            res.json({
                ok: true,
                //message: 'User deleted'
                user
            })
        }
    })
})

module.exports = router;