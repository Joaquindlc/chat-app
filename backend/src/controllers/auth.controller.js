import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
  
      const user = await User.findOne({ email });
  
      if (user) return res.status(400).json({ message: "Email already exists" });
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
      });
  
      if (newUser) {
        // generate jwt token here
        await newUser.save();
        generateToken(newUser._id, res);
  
        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        });
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }
    } catch (error) {
      console.log("Error in signup controller", error.message);
      res.status(500).json({ message: "Internal Server Error Trying to SignUp" });
    }
};

export const login = async (req, res) => {
   //  check if the user is already in the DB
   const {email, password} = req.body;
   try{
    const user = await User.findOne({ email });

    if(!user){
      return res.status(400).json({ message: "Invalid Credentials"});

    }
    const PasswordValid = await bcrypt.compare(password, user.password);
    if(!PasswordValid){
      return res.status(400).json({ message: "Invalid Credentials"});
    }
    generateToken(user._id, res)

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic
    })
   } catch(error){
    console.log("Error in Login Controller", error.message);
    res.status(500).json({ message: "Internal Server Error trying to Login"});
   }

};
export const logout = (req, res) => {
    try{
      res.cookie("jwt", "", {maxAge:0});
      res.status(200).json({ message: "Logged out succesfuly"});
    } catch(error){
      console.log("Error in Logout controller", error.message);
      res.status(500).json({ message: "Internal Server Error Trying to Logout" });
    }
};

export const updateProfile = async (req, res) => {
  try{
    const { profilePic }= req.body;
    const userId = req.user._id;
    if(!profilePic){
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {profilePic:uploadResponse.secure_url},
      {new:true});
      /* By default, findOneANdUpdate() returns the document as it was before update was applied. */

    res.status(200).json(updatedUser);
  } catch(error){
    console.log("Error in updated profile", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user); // devuelve los datos del usuario autenticado
  } catch (error) {
    console.log("Error in checkAuth Controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
