const authMiddleware = (req,res,next)=>{
    if(req.session.auth){
        next();
    }else{
        res.redirect('/admin/login');
    }
}

module.exports = {authMiddleware};