const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = "your_jwt_secret_key";

// ------------------- MongoDB Atlas Connection -------------------
mongoose.connect('mongodb+srv://praharshika:praharshika1234@cluster0.p9v6tge.mongodb.net/portfolioDB?retryWrites=true&w=majority')
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.error("MongoDB connection error:",err));

// ------------------- User Schema -------------------
const userSchema = new mongoose.Schema({
  username: {type: String, required:true},
  password: {type: String,required: true}
});
const User = mongoose.model('User', userSchema);

// ------------------- Predefined User -------------------
async function createPredefinedUser(){
  const existing = await User.findOne({username:"praharshika"});
  if(!existing){
    const hashedPassword = await bcrypt.hash("123456",10);
    await new User({username:"praharshika", password:hashedPassword}).save();
    console.log("Predefined user created: praharshika / 123456");
  }
}
createPredefinedUser();

// ------------------- LOGIN -------------------
app.post('/login', async (req,res)=>{
  const {username,password} = req.body;
  const user = await User.findOne({username});
  if(!user) return res.status(400).json({message:"Invalid username/password"});

  const isMatch = await bcrypt.compare(password,user.password);
  if(!isMatch) return res.status(400).json({message:"Invalid username/password"});

  const token = jwt.sign({id:user._id},JWT_SECRET,{expiresIn:"1h"});
  res.json({message:"Login successful", token});
});

// ------------------- Protected Route Example -------------------
app.get('/profile', async (req,res)=>{
  const token = req.headers['authorization'];
  if(!token) return res.status(401).json({message:"No token"});

  try{
    const decoded = jwt.verify(token,JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.json({user});
  }catch(err){
    res.status(401).json({message:"Invalid token"});
  }
});

// ------------------- Start Server -------------------
app.listen(5000, ()=>console.log("Server running on port 5000"));