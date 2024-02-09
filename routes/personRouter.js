const express = require('express')
const router = express.Router();
const excel = require('exceljs');
const fs = require('fs');
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

router.get('/work/:workType',async(req,res)=>{
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


// Define your API route to retrieve data from MongoDB and generate Excel file
router.get('/download-excel', async (req, res) => {
    try {
      // Retrieve data from MongoDB (replace {} with your query)
      const data = await Person.find({});
  
      // Create a new Excel workbook and worksheet
      const workbook = new excel.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');
  
      // Add headers to the worksheet
      const headers = Object.keys(data[0]._doc);
      worksheet.addRow(headers);
  
      // Add data to the worksheet
      data.forEach(item => {
        const row = Object.values(item._doc);
        worksheet.addRow(row);
      });
  
      // Save the workbook to a file
      const excelFilePath = 'output.xlsx';
      await workbook.xlsx.writeFile(excelFilePath);
  
      // Send the file as a response
      res.download(excelFilePath, 'output.xlsx', (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        }
        // Delete the file after sending
        fs.unlinkSync(excelFilePath);
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });


module.exports = router;