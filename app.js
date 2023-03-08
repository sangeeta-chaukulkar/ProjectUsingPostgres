const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
const session=require('express-session')
const cookieParser = require("cookie-parser");
const upload= require('express-fileupload')

const db=require('./query')
const path = require('path')
const app = express();
app.use(cookieParser());
app.use(session({secret:"abcd1234",resave: true,
saveUninitialized: true }))
var cors = require('cors')
app.use(cors())
app.use(upload())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.post('/signup',db.createUser)
app.get('/user/:id',db.getUserByID)
app.get('/users',db.getUsers)
app.post('/login',db.login)
app.get('/logout',db.userLogout)
app.patch('/updatUser/:id',db.updateUser)
app.patch('/uploadImage/:id',db.uploadImage)

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'))
app.set('view engine', 'pug');

app.use('/',(req, res)=>{
    res.sendFile(path.join(__dirname,`public/signup/signup.html`));
  })

app.listen(3000,()=> console.log('connected to server.....'));

