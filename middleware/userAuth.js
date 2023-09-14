const authMiddleware =(req,res,next)=>{
    if(req.session.auth){
        //// user is authenticated
        next();
    }else{
        res.redirect('/login');
    }
}

module.exports = {authMiddleware}