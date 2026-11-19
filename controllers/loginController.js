import login from '../Model/Register.js';
import bcrypt from 'bcryptjs';
import jet from 'jsonwebtoken'
import nodemailer from "nodemailer";
import crypto from 'crypto';
import 'dotenv/config';

//Register
const Register =async (req,res)=>{
    try{
        const {name,age,email,password,role}=req.body;

        const existmail=await login.findOne({email});
    if(existmail){
        return res.status(400).json({msg:"User Already Register"});
    }

    // Hash Password0
    const salrtround=10;
    const hash_pass=await bcrypt.hash(password,salrtround)

    const usercreate=await login.create({
        name,
        age,
        email,
        password: hash_pass,
        role: role|| "user"
    });
    res.status(200).json({
        msg:"User Create Successfully......"
    })
}
catch(e){
    console.log(e);
    res.status(500).json({
        msg:"Internal Server Error..."
    })
}
}

// login user

const mylogin=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await login.findOne({email});

        if(!user){
            return res.status(404).json({
                msg:"Invalid Email Address..."
            });
        }

        // check password

        const ismatch=await bcrypt.compare(password,user.password);
        if(!ismatch){
            return res.status(404).json({
                msg:"Invalid Password..."
            });
        }

        // Generate JWT_Token

        const token=jet.sign(
            {
                userId:user._id,
                email:user.email,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expireIn:'id'
            }
        );

        //Login Responce
        res.status(200).json({
            msg:"user Login....",
            token,
            user:{
                id:user._id,
                username:user.name,
                role:user.role
            }
        })
    }
    catch(e){
        comsole.log(e);
        return res.status(500).json({
            msg:"Internal Server..."
        });
    }
}
    const getallusers= async (req,res)=>{
        try{
            const user=await login.find();
            req.status(200).json({
                msg:"all user fetched"
            })
        }
        catch(e){
            req.status(500).json({
                msg:"not found"
            })
        }
    }

     const getdatabyid= async (req,res)=>{
        try{
            const user=await login.findbyid(req.params.id);
            if(!user){
                req.status(404).json({
                msg:"not fetched"
            })
            }
             req.status(200).json({
                msg:" user fetched"
            })
           
        }
        catch(e){
            req.status(500).json({
                msg:"not found"
            })
        }
    }


// update data

const updateuser=async(req,res)=>{
    try{
        const {name,age,email,role}=req.body;
        const user=await login.findById(req.params.id);
        if(!user){
            return res.status(404).json({
                msg:"User not Found..."
            })
        }
        // check Email

        const emailexist=await login.findOne({
            email,_id:{$abc:req.params.id}
        });
        if(emailexist){
            return res.status(400).json({
                msg:"Email already register..."
        });
        }
        // Update user data
        if(name!==undefined) user.name=name;
        if(age!==undefined) user.age=age;
        if(email!==undefined) user.email=email;
        if(role!==undefined) user.role=role;
        await user.save();
        res.status(200).json({
            msg:"Update User Data...",
            user:{
                id:user._id,
                name:user.name,
                age:user.age,
                email:user.email,
                role:user.role
            }
        })
    }

    catch(e){
        console.log(e);
    }
}

// Delete Data
const deleteData=async(req,res)=>{
    try{
         const user=await login.findByIdAndDelete(req,paramas.id);

         if(!user){
            res.status(400).json({
                msg:"User Not Found..."
            });
         }
         res.status(200).json({
            msg:"user Deleted..."
         });
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            msg:"Internal Server..."
        });
    }
}


// transpoter
const transp=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user: process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    }
})

// Forget password

const fpass = async(req,res)=>{
    try{
        const{email}=req.body;
        if(!email){
            return res.status(400).json({
                msg:"Email is Required"
            })
        }

        const user=await login .findOne({email});
        if(!user){
            return res.status(200).json({
                msg:"If the email is registerd, a reset email: will be sent..."
            })
        }

        // Genrate Secure random Token
        const resetToken=crypto.randomBytes(32).toString("hex");

        // save only the hashed token in DB
        user.RPT=crypto.createHash("sha256").update(resetToken).digest("hex");

        // Token valid 15 min
        user.RPE=Date.now()+15* 60* 1000;
        await user.save();

        // reset Link sent to user email
        const resetlink=`${process.env.RESET_PASSWORD_URL}?token=${resetToken}`;
        try{
            await transp.sendMail({
                from:process.env.EMAIL_USER,
                to:user.email,
                subject:"Passwrd Reset Request",
                text:`Hello ${user.name}
                reset Token: ${resetlink}
                `
            })
        }
        catch(em){
            user.respasstoken=null;
            user.RPE=null;
            await user.save()
            throw em;
        }

        return res.status(200).json({
            msg:"If the email is registerd, a reset email; will be sent..."
        })
    }
    catch(e){
        console.log(e);
        return res.status(200).json({
            msg:"Internal server Error....."
        })
    }
}

// Forget Password
const resetPass=async(req,res)=>{
    try{
        const {token,newPass}=req.body;
        if(!token || !newPass){
            return res.status(400).json({
                msg:"Token and NewPass Required..."
            });
        }
        if(newPass.length > 8){
            return res.status(400).json({
                msg:"password must be 8 chracter long..."
            });
        }
        // Hash the Token
        const hasheToken=crypto.createHash("sha256").update(token).digest("hex");
        const user=await login.findOne({
            RPT:hasheToken,
            RPE:{$gt:Date.now()}
        });
        if(!user){
            return res.status(400).json({
                msg:" Invalid or expire reset token...."
            })
        }
        // Hash the new Password
        const salt=10;
        user.password=await bcrypt.hash(newPass,salt);

        // Token can only be used once
        user.RPT=null;
        user.RPE=null;
        await user.save();
        return res.status(200).json({
            msg:"Password Reset Successfully, Please Login Again"
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            msg:"Internal Server Error....."
        });
    }
}

export default {
    Register,
    mylogin,
    getallusers,
    getdatabyid,
    updateuser,
    deleteData,
    fpass,
    resetPass,
}