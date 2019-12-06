const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const User = require('../models/user')


/* GET home page. */
router.post('/', (req, res, next) => {
    let email = req.body.email 
    let password = req.body.password

    User.findOne({email}, (error, user) => {
            if(error){
                res.status(400).json({
                    ok: false,
                    error
                })
            }
            else if(!user){
                res.status(400).json({
                    ok: false,
                    error:{
                        message: "Incorrect user or password"
                    }
                })
            }
            else if(!bcrypt.compareSync(password, user.password)){
                res.status(400).json({
                    ok: false,
                    error:{
                        message: "Incorrect user or password"
                    }
                })
            }
            else{
                let token = jwt.sign({
                    user
                }, process.env.SEED, {
                    expiresIn: process.env.EXP_TOKEN
                })
                res.json({
                    ok: true,
                    user,
                    token
                })
            }
    })

})

// Google configs

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    let name = payload.name, email = payload.email, img = payload.picture;

    return {
        name,
        email,
        img,
        google: true
    }

}


router.post('/google', async (req, res, next) => {
    
    let token = req.body.idtoken;

    let googleUser = await verify(token).catch(e => {
        res.status(400).json({
            ok: false,
            error: e,
        })
        return 'error';
        
    })

    if(googleUser == 'error') return

    User.findOne({email: googleUser.email}, (error, user) => {
        if(error){
            return res.status(400).json({
                ok: false,
                error
            })
        }
        else if(user){
            if(user.google == false){
                res.status(500).json({
                    ok: false,
                    error: {
                        message: 'You must use email authentication'
                    }
                })
            }
            else{
                let token = jwt.sign({user}, process.env.SEED, {expiresIn: process.env.EXP_TOKEN} )
                return res.json({
                    ok: true,
                    user,
                    token
                })
            }
        }
        else{
            let user = new User({
                name: googleUser.name,
                email: googleUser.email,
                password: ':)',
                img: googleUser.img,
                google: googleUser.google
            })
            user.save((error, userDB) => {
                if(error){ 
                    return res.status(400).json({
                        ok: false,
                        error
                    })
                } 
                else{
                    return res.json({
                        ok: true,
                        user: userDB
                    })
                }
            })

        }
    })
})

module.exports = router
