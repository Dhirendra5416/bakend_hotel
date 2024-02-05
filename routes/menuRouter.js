const express = require('express')
const router = express.Router();
const MenuItem = require('../models/menu')


//Menu Items
router.post('/add-menu-items',async(req,res)=>{
    try{
        const data = req.body // Assuming the request body contains the person data
        const newMenu = new MenuItem(data);
        //Save new  Person data
        const response = await newMenu.save()
       
        res.status(200).json(response)
    }catch(error){
        console.error(error)
        res.status(500).json(error)
    }
})

router.get('/',async(req,res)=>{
    try{
        const response = await MenuItem.find()
        res.status(200).json(response)
    }catch(error){
        console.error(error)
        res.status(500).json(error)
    }
})

module.exports = router;