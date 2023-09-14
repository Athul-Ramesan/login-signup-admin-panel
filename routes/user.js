const express = require('express');
const router = express.Router();
const controller = require('../controller/userController')
const auth = require('../middleware/userAuth')


router.get('/',(req,res)=>{
    res.redirect('/login')
})

//get login
router.get('/login',controller.getLogin)
// post a login data 
router.post('/login',controller.loginUserPost)
//get signup
router.get('/signup',controller.getSignup)
//get home
router.get('/home', auth.authMiddleware,controller.getHomePage)

router.get('/logout',auth.authMiddleware,controller.getLogout)

//post a new signup data

router.post('/signup',controller.signupPost)



module.exports = router;
