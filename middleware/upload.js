import { Error } from "mongoose";
import multer from "multer";
import path from "path";

// Stroge Config
const storage= multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads');
    },

    filename:function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname))
    }
}) 

// File Filter ----------------------
const filefilter=(req,file,cb)=>{
    if(file.mimetype==="image/jpg"|| 
        file.mimetype==="image/png"|| 
        file.mimetype==="image/jfif"
     ){
        cb(null,true);
     }else{
        cb(new Error("Only Image Allow"),false)
     }
}

const upload=multer({
    storage:storage,
    fileFilter:filefilter
});

export default upload;