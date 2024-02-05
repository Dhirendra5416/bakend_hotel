const mongoose = require('mongoose')

const mongoURL = 'mongodb://localhost:27017/hotels';

mongoose.connect(mongoURL,{
    // useNewUrlParser:true,
    // useUnifiedTopology:true
})

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("Mongodb Connected Successfully")
})

db.on('error',()=>{
    console.log("Mongodb Connected Error")
})

db.on('disconnected',()=>{
    console.log("Mongodb disconnected")
})

//Export the database connection

module.exports = db;