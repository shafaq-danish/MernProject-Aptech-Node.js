import mongoose from "mongoose";
const url='mongodb://localhost:27017/mern_project';

const connectdb=async()=>{
    try{
        await mongoose.connect(url);
        console.log("DB Connected...");
    }
    catch(e){
        console.log("Db Not Connected");
        process.exit(0);
    }
}

export default connectdb;