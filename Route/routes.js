import express, { Router } from 'express';

const router=express.Router();
import login from '../controllers/loginController.js';
import prod from "../controllers/Product_file_Controller.js";
import middle from "../middleware/upload.js";

//---------------------------Login Routes--------------------------

router.post('/register', login.Register);
router.post('/login', login.mylogin);
router.get('/getdata', login.getallusers);
router.get('/getdatabyid/:id', login.getdatabyid);
router.put('/updatedata/:id', login.updateuser); 
router.delete('/deletedata/:id', login.deleteData);
router.post('/forgot-password', login.fpass);
router.post('/reset-password', login.resetPass);


//---------------------------Product Routes--------------------------

router.post("/mrprodadd", middle.single("p_image"),prod.create);
router.get('/getprod',prod.get_pro);
router.put("/mrprodupdate", middle.single("p_image"),prod.Updateprod);
router.delete('/delete',prod.delete_prod);


export default router;