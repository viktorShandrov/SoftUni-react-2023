const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const utils = require("../utils/utils");




exports.register = async(email,password,repeatedPassword)=>{
    if(!email||!password||!repeatedPassword){
        throw new Error("All fields are required")
    }

    const user =await userModel.findOne({email})
    if(user){
        throw new Error("Email already exists!")
    }

    await  userModel.create({email,password,repeatedPassword})
    return exports.login(email,password)

}
exports.login = async (email,password)=>{
    const user = await userModel.findOne({email});
    if(!user) throw new Error("Email or password is incorrect.")
    const isPasswordMatching = await bcrypt.compare(password,user.password);
    if(!isPasswordMatching) throw new Error("Email or password is incorrect.")

    const payload = {
        email,
        _id:user._id,
    }
    const token = await utils.sign(payload,utils.secret)
    return {
        token,
        email,
        userId:user._id,
        role:user.role,
        lastReading:user.lastReading
    }

}
exports.getUserInfo = async (_id)=>{
    const user = await userModel.findById(_id);

    delete user.password

    return user.toObject()


}