import mongoose from "mongoose";

const proddata=mongoose.Schema({
    p_name:{type:String, required:true},
    p_price:{type:Number, required:true},
    p_des:{type:String, required:true},
    p_image:{type:String, required:true},
   
})

const prod=mongoose.model('product' ,proddata);

export default prod;