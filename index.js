const express = require('express');
const mysql = require("mysql");
const bcrypt = require("bcrypt")
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const app = express();
app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//create a database connection 
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"register"
});


app.post("/register", async (req,res)=>{
    const sql = "INSERT INTO users (`name`,`email`,`password`) VALUES (?)";
     const PASS = req.body.password;
     let hashpassword = await bcrypt.hash(PASS,8);
     console.log(hashpassword);
     
       
            const values = [
                req.body.name,
                req.body.email,
                hashpassword
            ]	
           


            db.query(sql,[values],(err,data)=>{
                if(err){
                    console.log("err hai bhai");
                    console.log(err.message);
                    return res.json(err);
                }
                res.json(data);
            })
        
  
    
    
})

app.post("/login",(req,res)=>{
    const sql = "SELECT * FROM users WHERE `email`=?";
    db.query(sql,[ req.body.email],(err,data)=>{
        if(err){
            console.log("err hai bhai");
            console.log(err.message);
            return res.json(err);
        }
        
        if(data.length>0){
          
            bcrypt.compare(req.body.password.toString(),data[0].password,(err,response)=>{
            
                if(err){
                    console.log("err hai bro yha compare me")
                    return res.json("there is an Error")
                }
                else if(response){
                    console.log("hey biro")
                    return res.json("Success");
                }
                
                
            })
            
        }else{
            return res.json("Failed")
        }
        
    })
})


app.listen(8081,()=>{
    console.log("the server is running well😊")
})
