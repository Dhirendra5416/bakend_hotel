const express = require('express')
const router = express.Router();
const Person = require('../models/person')

router.post('/add-person',async(req,res)=>{
    try{
        const data = req.body // Assuming the request body contains the person data
        const newPerson = new Person(data);
        //Save new  Person data
        const response = await newPerson.save()
        console.log(response)
        res.status(200).json(response)
    }catch(error){
        console.error(error)
        res.status(500).json(error)
    }
})

router.get('/',async(req,res)=>{
    try{
        const response = await Person.find()
        res.status(200).json(response)
    }catch(error){
        console.error(error)
        res.status(500).json(error)
    }
})

router.get('/:workType',async(req,res)=>{
    try{
        const workType = req.params.workType;
        if(workType =='chef' || workType == 'manager' || workType == 'waiter'){
            const response = await Person.find({work:workType});
            res.status(200).json(response)
        }else{
    res.status(404).json({error:"invalid work type"})
        }
    }catch(error){
        console.error(error)
        res.status(500).json(error)
    }
   
})


module.exports = router;