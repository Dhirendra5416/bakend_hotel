const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    age:{
        type:Number,

    },
    work:{
        type:String,
        enum:['chef','waiter','manager'],
        reuired:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    mobile:{
        type:String
    },
    address:{
        type:String
    },
    salary:{
        type:Number,
        required:true
    },
    resetToken: String,
    resetTokenExpiration: Date,
     
});

// Create Person model

const Person = mongoose.model('Person',personSchema);
module.exports = Person;