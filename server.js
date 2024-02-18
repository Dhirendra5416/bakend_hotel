const express = require('express')
const app = express();
const db = require('./db')
require('dotenv').config()
const cors = require('cors');
const bodyParser = require('body-parser')
const port = process.env.PORT || 4444;
const menuRoutes = require('./routes/menuRouter')
const personRoutes = require('./routes/personRouter')

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());


// Enable CORS with specific options
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

app.get('/',function(req,res){
res.send('Welcome to my Hotel')
})




app.use('/person',personRoutes)
app.use('/menu',menuRoutes)


app.listen(port,()=>{
    console.log(`Server connected at post number ${port}`)
})