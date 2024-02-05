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
    mobile:{
        type:String
    },
    address:{
        type:String
    },
    salary:{
        type:Number,
        required:true
    }
});

// Create Person model

const Person = mongoose.model('Person',personSchema);
module.exports = Person;