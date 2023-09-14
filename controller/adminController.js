const mongoose = require('mongoose');
const Admin = require('../model/adminModel');
const Users = require('../model/userModel')
const {hashPassword} =require('../helpers/user')
//get
const getLogin = async (req,res)=>{
    if(req.session.auth){
        res.redirect('/admin/');
    }
    res.render('admin/login')
}
const dashboard = async (req,res)=>{
    if(!req.session.auth){
        res.redirect('/admin/login');
    }
    res.render('admin/dashboard')
}

//get
const createUser = async (req,res)=>{
    res.render('admin/create-user')
}
//post
const createUserPost = async(req,res)=>{
   try {
    const {name,email,password} = req.body;
        await Users.create({name:name,email:email,password:password});
        res.render('admin/create-user',{status:'user created successfully'})
    
   } catch (error) {
    console.log(error);
    if (error.code===11000){

        error = 'user already exists'
        res.render('admin/create-user',{error})
    }
    
   }
    
}
// edit users get
const editUser= async (req,res)=>{
    try {
        const id = req.query.id;
        const user = await Users.findOne({_id:id})
        res.render('admin/edit-user',{data: { name: user.name, email: user.email, id: user._id }});
    } catch (error) {
        console.log(error);
    }
}

//edit users post
const editUSerPost = async (req,res)=>{
    try {
        const id= req.body.id;
        await Users.updateOne({_id:id},{name: req.body.name, email: req.body.email, password: await hashPassword(req.body.password)})
        res.render('admin/edit-user',{status: 'data updated'})
    } catch (error) {
        console.log(error);
        if(error.code===11000){ 
            res.render('admin/edit-user',{error:'email already exists'})
        }
    }
}

//search user get
const searchUser= async (req,res)=>{
    res.render('admin/search-user')
}
//search user post
const searchUserPost = async(req,res)=>{
    try {
        const searchText = req.body.searchText;
        // console.log(searchText);
        const data = await Users.find({
            $or :[
                {name:{$regex: '^'+searchText , $options: 'i'}},
                {email:{$regex: '^'+searchText , $options: 'i'}}
            ]
        })
         if(data!==null && searchText.length>0){
            const users = data.map((doc)=>{
                return {
                    id: doc._id,
                    name: doc.name,
                    email: doc.email
                }
            })
            console.log(data);
            res.render('admin/search-user',{users})
         }else{
            res.render('admin/search-user',{notFound: 'not found'})
         }
    } catch (error) {
        console.log(error);
        res.render('admin/search-user',{notFound: 'failed to fetch'});
    }
}


const users = async (req,res)=>{
    try {
        const users =await Users.find({})
    let data = users.map((doc) => {
        return {
            id:doc._id,
            name:doc.name,
            email:doc.email
        }
    })
    res.render('admin/users',{users: data})
    } catch (error) {
        console.log(error);
    }
}

//post login

const postLogin =async(req,res)=>{

    try {
        const {username, password} = req.body;

        const admin = await Admin.findOne({username})
        console.log(admin);
        if(!admin){
            const err ={message: 'admin not found'};
            res.render('admin/login',{err});
        }else{
            if(password !== admin.password){
                const err ={message: 'username or password incorrect'};
                res.render('admin/login',{err});
            }else{
                req.session.auth=true;
                res.redirect('/admin/');
            }
        }
    } catch (error) {
        console.log(error);
    }
}   



//delete

const deleteUser = async (req,res)=>{
    try {
        const id = req.query.id;
        await Users.deleteOne({_id:id});
        
        res.redirect('/admin/dashboard/users')
    } catch (error) {
        console.log(error);
    }

}

// delete all 

const deleteAll = async (req,res)=>{
    try {
        await Users.deleteMany  ({});
        res.redirect('/admin/')
    } catch (error) {
        console.log(error);
    }
}

const getLogout= async (req,res)=>{
    req.session.auth= false;
    res.redirect('/admin/login')
}

module.exports ={
    getLogin,
    postLogin,
    dashboard,
    createUser,
    createUserPost,
    editUser,
    editUSerPost,
    searchUser,
    searchUserPost,
    users,
    deleteUser,
    deleteAll,
    getLogout
    
}