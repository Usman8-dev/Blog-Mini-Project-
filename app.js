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




app.listen(3000);