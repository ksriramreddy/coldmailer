import User from "../models/userModels.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            username,
            email,
            password : hashedPassword,
        });
        if(newUser){
            newUser.save()
            return res.status(201).json(
                {
                    message: "User created successfully",
                    user: {
                        id: newUser._id,
                        username: newUser.username,
                        email: newUser.email
                    }
                });
        }
        return res.status(400).json({message: "User creation failed"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal server error"});   
    }
}

export const login = async (req, res) =>{
    const {email, password}  = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        const isMatch  = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }
        return res.status(200).json({message: "Login successful", user});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal server error"});   
    }
}