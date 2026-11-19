 import express from 'express';
 import dotenv from 'dotenv'
const port=3000;
import path from "path"; //-------------------------- 1
import { fileURLToPath } from 'url'; //------------------------ 2
import cors from "cors";

const __filename=fileURLToPath(import.meta.url); //--------------------- 3
const __dirname=path.dirname(__filename); //------------------------------ 4
const app=express();
import connectdb from "./config/config.js";
import router from './Route/routes.js';
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const corsoption={
    origin:"http://localhost:5173",
    methods:"GET, POST, PUT, DELETE",
    credential:true
}
app.use(cors(corsoption));
app.use('/uploads',express.static(path.join(__dirname,"uploads"))); // ------------------------ 5
 app.use('/',router);
 connectdb().then(()=>{
    app.listen(port,()=>{
        console.log('Server Connected.....${port}')
    })
 })