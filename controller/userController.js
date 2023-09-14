const User = require('../model/userModel')

const { hashPassword, comparePassword } = require('../helpers/user')
const jwt = require('jsonwebtoken');


// signup end points
const signupPost = async (req, res,) => {


    try {
        const { name, email, password } = req.body;

        // check if name entered
        if (!name) {
            const error= 'user name is required'
            return res.render('user/signup',{error})
            // res.json({
            //     error: ' user name is required'
            // })
        }
        // if password is good
        if (!password) {
            const error= 'password is required'
            return res.render('user/signup',{error})


        
        }
        // chack email
        const exist = await User.findOne({ email })
        if (exist) {
            const error= 'email already exists'
            return res.render('user/signup',{error})
        }

        //hashing password
        const hashedPassword = await hashPassword(password)
        //creating user in database

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        req.session.auth = true
        res.redirect('/home')
    } catch (error) {
        console.log(error);
    }
};

// login endPoints
const loginUserPost = async(req,res)=>{

    try {
        const {email,password} = req.body;

    //check if user exists
    const user = await User.findOne({email});

    if(!user){
        const error = 'user not found'
        return res.render('user/login',{error})
    }

    // Check password match
    const match = await comparePassword(password, user.password);
    
    if(match){
        req.session.auth = true
        return res.redirect('/home');
    }
    } catch (error) {
        console.log(error);
    }
    
}
//get home page
const getHomePage = async(req,res)=>{
    res.render('user/home')
}
//get login
const getLogin = async (req,res)=>{
    if(req.session.auth){
        res.redirect('/home')
    }
    res.render('user/login',{error:""})
}
//getSignup
const getSignup = async (req,res)=>{
    if(req.session.auth){
        res.redirect('/home')
    }
    res.render('user/signup',{error:""})
}
//getLogout
const getLogout = async (req,res)=>{
    req.session.auth =false;
    res.redirect('/login')
}


module.exports = { signupPost, loginUserPost, getHomePage, getLogin, getSignup, getLogout }

