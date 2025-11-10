const express = require('express');
const app = express();
const path= require('path');
const userModel = require('./Models/user');
const postModel = require('./Models/post');
const bcrypt  = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


app.get('/create', function(req, res){
    res.render('index');
})

app.post('/Register', async(req, res) => {
    let{name, email, password, age, gender} = req.body;
    
    // check user is already register 
    let user =await userModel.findOne({ email: email });
    // if(user) return res.status(500).send('User Already Register!');
    if (user) {
            return res.status(400).send('User already registered!');
        }
    
    
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, async(err, hash) =>{
            let userCreate = await userModel.create({
                name : name,
                email: email,
                password: hash,
                age: age,
                gender: gender
                })

        let token = jwt.sign({ email: userCreate.email, userId: userCreate._id}, 'shhhhhhh');
        res.cookie('token' , token);
        // res.send(userCreate);
        res.redirect('login');
            });
        });
})

app.get('/login', function(req, res){
    res.render('login');
})

app.post('/login', async(req, res) => {

     let{email, password} = req.body;
    
    // check user is already register 
    let user =await userModel.findOne({ email: email });
    if (!user) {
            return res.status(400).send("Please try again !");
        }
    
    bcrypt.compare(password, user.password, function(err, result) {
    if(result){
          // to set a token cookie 
            let token = jwt.sign({ email: user.email, userId: user._id }, 'shhhhhh');
            res.cookie('token', token);

        // res.send("Welcome To dashboad", req.body.username);
         res.send(`Welcome to dashboard, ${user.name}`); 
    }else{
        res.send("Please try again !!!");

    }
    });
})

app.get('/logout', function(req, res){
    res.cookie('token', "");
    res.redirect('/login');
})

app.get('/profile',IsLoginUser, function(req, res){
   console.log(req.user);
})

// middleware 
function IsLoginUser(req, res, next){
    if(req.cookies.token === ""){
        res.send('Please Login First');
    }else{
        let data = jwt.verify(req.cookies.token, 'shhhhhh');
        req.user = data;
        next();
    }

}


app.listen(3000);