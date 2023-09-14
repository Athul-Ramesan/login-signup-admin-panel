
const express = require('express');
const path = require('path');
const app = express()
const fs = require('fs')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const handlebars = require('express-handlebars')

const session = require('express-session')


// setting view engine
app.engine('.hbs', handlebars.create({
    extname: '.hbs', defaultLayout: 'layout', layoutsDir: __dirname+'/views/layout/',partialsDir: __dirname+'/views/partials/'
}).engine);

app.set('view engine','hbs');
app.set('views','views');
app.use(express.static(path.join(__dirname,'public')))



const cookieParser = require('cookie-parser')
const mangoose = require('mongoose');
require('dotenv').config()
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))


app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Expires', '-1');
    res.setHeader('Pragma', 'no-cache');
    next();
});


app.use(session({
    secret: 'samplkey',
    resave : false,
    saveUninitialized : false,
    cookie:{maxAge: 1000*60*60*24}
}))

app.use('/', userRouter);
app.use('/admin', adminRouter);










const PORT = process.env.PORT;
mangoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(PORT,()=>{
        console.log('db connected & server is running');
    })
}).catch((err)=>{
    console.log(err);
})












