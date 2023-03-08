const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs=require('fs')
const path=require('path')
const Pool= require('pg').Pool
const pool=new Pool({
  user:process.env.User,
  host:process.env.Host,
  database: process.env.Database,
  password:process.env.Password,
  port:5432
}) 

const uploadImage = (req,res)=>{
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
    const id=parseInt(req.params.id)
    const profilePicture = req.files.profilePictureName;
    const filename=req.files.profilePictureName.name
    const uploadPath=path.join(__dirname, 'upload',filename)
    profilePicture.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);
    });
    let file = fs.readFileSync(uploadPath,{encoding:'base64'})
    pool.query('update users set profilepicturename=$1,base64data=$2 where id=$3',[filename,file,id],(error,result)=>{
      if(error){ throw error}
      res.json({result:result.rows,message:'profile photo uploaded successfully'})
    })
}
const createUser= (req,res)=>{
  const {name,email,password} = req.body
  console.log(name ,email, password )
  if(!(name && email && password)){ res.json({message:"All fields are required"})}
  pool.query('select * from users where email = $1',[email],(error,result)=>{
    if(error){ throw error}
    if(result.rowCount > 0)  { res.json({message:'User already exists, Please Login'})}
    else {
      bcrypt.hash(password,12)  
      .then(hashpassword=>{
      pool.query('INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING * ',[name,email,hashpassword],(error,result)=>{
        if(error){ throw error}
        jwt.sign({id:result.rows[0].id,email:email}, process.env.TOKEN_SECRET, { expiresIn: '1800s' },(err,token)=>{
            res.status(201).send({token:token,message:`Successfuly signed up`}); 
        });
      })
    })
    }
  })
}

const login=(req,res)=>{
  const token = req.headers["authorization"];
  const {email,password}=req.body;
  if(!( email && password)){ res.json({message:"All fields are required"})}
  pool.query('select * from users where email=$1',[email],(error,result)=>{
    if(error){ throw error}
    console.log("result.rows[0].password",result.rows[0].password)
    bcrypt.compare(password,result.rows[0].password)
    .then(isMatch=>{
      if(isMatch){
        const emailid = String(jwt.verify(token, process.env.TOKEN_SECRET).email);
        const id = Number(jwt.verify(token, process.env.TOKEN_SECRET).id);
        req.session.email=email;
        req.session.token=token;
        req.session.id=id;
        req.session.save();
        res.status(200).send({id:id,message:'Login successfully'}); 
      }
      else{
        return res.status(401).json({ message: "Credentials are incorrect" });
      }
    })
  })
}

const userLogout = (req, res) => {
  req.session.destroy()
  res.json({message:'Logged out successfully'})   
}

const getUserByID=(req,res)=>{
    const id=parseInt(req.params.id)
    console.log( req.session.email)
    pool.query('select * from users where id = $1',[id],(error,result)=>{
      if(error){ throw error}
      if(result.rowCount == '0')  { res.json({message:'Data does not exists'})}
      else {
        res.status(200).json(result.rows)
      }
    })
}
const getUsers=(req,res)=>{
  const id=parseInt(req.params.id)
  console.log( req.session.email)
  pool.query('select * from users',(error,result)=>{
    if(error){ throw error}
    if(result.rowCount == '0')  { res.json({message:'Data does not exists'})}
      else {
  res.status(200).json(result.rows)
      }
  })
}

const updateUser=(req,res)=>{
  console.log( req.session.email)
  if(!req.session.email){
    res.json({message:'Session has been expired. Kindly login'})
  }
  else{
    const id=parseInt(req.params.id)
  const {name,email,password}=req.body
  bcrypt.hash(password,12)  
      .then(hashpassword=>{
        pool.query('update users set name=$1,email=$2,password=$3 where id=$4 RETURNING *',[name,email,hashpassword,id],(error,result)=>{
          if(error){ throw error}
          if(result.rowCount == '0')  { res.json({message:'Data does not exists'})}
            else {
              res.status(200).json({message:"data updated",result:result.rows})
          }
      })
    })
  }
}
module.exports = {
  createUser,getUserByID,updateUser,getUsers,login,userLogout,uploadImage
}
