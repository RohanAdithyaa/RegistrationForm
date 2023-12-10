import http from "http";
import { connect, Schema, model } from "mongoose";
import bodyParser from "body-parser";

const { urlencoded, json } = bodyParser;
import { config } from "dotenv";
import express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const app = express ();
app.use(express.static('public'));

//handling the get request of home page
app.get('/Home.css', (req, res) => {
    res.header('Content-Type', 'text/css');
    res.sendFile(__dirname + '/Home.css');
  });
config();

const port = process.env.PORT || 3000;

//connecting to the database
connect('mongodb+srv://rohanadithyaanandedapu:QqdjbhKZeG34EzBV@cluster1.pohp1qe.mongodb.net/?retryWrites=true&w=majority', {
    serverSelectionTimeoutMS: 5000, 
}).then(console.log('connected'));


//creating a new schema and data model
const registrationSchema = new Schema({
    username : String,
    email : String,
    password : String
});

const registration = model("Registration", registrationSchema);

app.use(urlencoded({extended:true}));
app.use(json());
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/Home.html");
})
app.use(express.static('public'));

//handling the post request 
app.post('/register',async (req, res) => {
    try{
    const { username, email, password } = req.body;
    console.log("recieved data:",{username,email,password});
  
    // Example: Simple validation, you should add more validation as needed
    if (!username || !email || !password) {
      return res.redirect('/Error');
    }
    //checking for already existing user with same email
    const existingUser = await registration.findOne({email:email});
        if(!existingUser){
            const newUser = new registration({ username, email, password });
            await newUser.save();
            res.redirect('/Sucess');
        }
        else{
            console.log("user already exists");
            res.redirect('/wrong')
        }
    
}
    catch(err){
        console.error(err);
        res.redirect('/Error');
    }
});

//handling get requests of success and error pages
app.get("/Sucess", (req,res) =>{
    res.sendFile(__dirname+"/Sucess.html");
})
app.get("/Error",(req,res) =>{
    res.sendFile(__dirname+"/Error.html");
})
app.get("/Wrong",(req,res)=>{
    res.sendFile(__dirname+"/wrong.html");
})

app.listen(port, () =>{
    console.log(`server is running on port ${port}`);
})

