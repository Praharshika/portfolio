const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

mongoose.connect("mongodb+srv://praharshika:praharshikavijith1820@cluster0.jehfonk.mongodb.net/loginDB?retryWrites=true&w=majority")
.then(()=>{
    console.log("MongoDB Connected Successfully");
})
.catch((err)=>{
    console.log(err);
});

app.get("/",(req,res)=>{
    res.send("Server Running");
});


// REGISTER
app.post("/register", async (req,res)=>{

    try{

        const {name,email,password} = req.body;

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.json({message:"User registered successfully"});

    }
    catch(error){
        res.status(500).json({error:error.message});
    }

});


// LOGIN
app.post("/login", async (req,res)=>{

    try{

        const {email,password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.json({message:"User not found"});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.json({message:"Invalid password"});
        }

        const token = jwt.sign(
            {id:user._id},
            "secretkey",
            {expiresIn:"1d"}
        );

        res.json({
            message:"Login successful",
            token
        });

    }
    catch(error){
        res.status(500).json({error:error.message});
    }

});


app.listen(5000,()=>{
    console.log("Server running on port 5000");
});