const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const excel = require('exceljs');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const Person = require('../models/person')



//Auth Api

//Login
//console.log(process.env.JWT_SECRET,"token")
// Register User
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      age,
      work,
      email,
      password,
      mobile,
      address,
      salary,
    } = req.body;

    // Check if the user with the provided email already exists
    const existingUser = await Person.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const person = new Person({
      name,
      age,
      work,
      email,
      password: hashedPassword,
      mobile,
      address,
      salary,
    });

    await person.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Person.findOne({ email });

    if (!user) {
      return res.status(401).send('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send('Invalid email or password.');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Include additional user information in the response
    const response = {
      token,
      id: user._id,
      name: user.name,
      work: user.work,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Forget Password
router.post('/forget-password', async (req, res) => {
 
  try {
    const { email } = req.body;
    const user = await Person.findOne({ email });
    console.log(user,"dhgh")
    if (!user) {
      return res.status(404).send('User not found.');
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    user.resetToken = resetToken;
    user.resetTokenExpiration = new Date() + 10 * 60 * 1000;
    await user.save();

    // Send reset token to user's email (using nodemailer)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        // user: process.env.EMAIL_USER,
        // pass: process.env.EMAIL_PASSWORD,
        user:'dhirendrapratap28maurya@gmail.com',
        pass:'Dhirendra@123',
      },
    });

    const mailOptions = {
      from: 'dhirendrapratap28maurya@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
        return res.status(500).send('Failed to send email.');
      }
      res.status(200).send('Email sent successfully.');
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const user = await Person.findOne({ resetToken, resetTokenExpiration: { $gt: new Date() } });

    if (!user) {
      return res.status(400).send('Invalid or expired reset token.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    res.status(200).send('Password reset successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

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