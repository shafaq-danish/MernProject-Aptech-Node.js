import prod from "../Model/Product.js";

//===================== Craete Product ===================

const create=async(req,res)=>{
try{
    const {p_name,p_price,p_des}=req.body;
    const filename=req.file ? req.file.filename:null;

    const pro_create=await prod.create({
        p_name,
        p_price,
        p_des,
        p_image:filename
    });
    res.status(200).json({msg:"Product Create...",data:pro_create})
}
catch(e){
    console.log(e);
     res.status(500).json({msg:"Internal Server Error"})
}
}

//===================== Get All Product ===================

const get_pro=async(req,res)=>{
    try{
        const data=await prod.find();
        if(!data || data.length==0){
            return res.status(404).json({msg:"Data Not Found..."})
        }
         res.status(200).json({msg:"Product Create..."})
    }
    catch(e){
        console.log(e);
        res.status(500).json({msg:"Internal Server Error"})
    }
}

//===================== Delete Product ===================
const delete_prod=async(req,res)=>{
    try{
        const{id}=req.params;
        const data=await prod.findById(id);
        if(!data){
            res.status(404).json({msg:"Data Not Found..."})
        }

        await prod.findByIdAndDelete(id);
         res.status(200).json({msg:"Product Delete Successfully..."})
    }catch(e){
        console.log(e);
        res.status(500).json({msg:"Internal Server Error"})     
    }
}

const Updateprod=async (req,res)=>{
    try{
        const {id}=req.params;
        const {p_name,p_price,p_des,p_image}=req.body;

        const data=await prod.findById(id);
        if(!data){
            return res.status(404).json({msg:"Data Not Found..."})
        }

        const updateprod={
            p_name,
            p_price,
            p_des,
            p_image
        };

        // update image if new file upload.....
        if(req.file){
            updateprod.p_image=req.file.filename;
        }
        const updatedata=await prod.findByIdAndUpdate(id,updateprod,{
            new:true
        })
         res.status(200).json({msg:"Product Update Successfully..."})
    }
    catch(e){
        console.log(e)
         res.status(500).json({msg:"Internal Server Error"}) 
    }
}
export default{create,get_pro,delete_prod,Updateprod}