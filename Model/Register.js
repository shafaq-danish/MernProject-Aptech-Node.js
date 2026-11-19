import mongoose from "mongoose";

const regisdata=mongoose.Schema({
    name:{type:String, required:true},
    age:{type:Number, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    role:{type:String, enum:['admin','user'], default:'user'},
    RPT:{type:String, default:null},
    RPE:{type:Date, default:null},
})

const user=mongoose.model('register' ,regisdata);

export default user;