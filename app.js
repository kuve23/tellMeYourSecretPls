require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect(process.env.STRING);

const userSchema = new mongoose.Schema({
    email : String,
    password : String
})


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});


const User = mongoose.model("User", userSchema);


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){
    res.render("home");
});


app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User ({
        email : req.body.username,
        password : req.body.password
    })
   const savedData =  newUser.save()

   if(savedData){
    res.render("secrets");
   }else{
    console.log("There has been some error");
   }     
   
})

app.post("/login", function(req, res){
    const username = req.body.username
    const password = req.body.password

    async function run(err){
       const foundUser =  await User.findOne({email: username})

       if(err){
        console.log(err);
       }else{
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets")
            }
        }
       }
    }
    run();

})




app.listen(3000, function(){
    console.log("server is listening on port 3000");
})
