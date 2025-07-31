const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const app = express()
const checkRoutes = require('./routes/checkRoutes.js')
const mongoose = require('mongoose');

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.use('/api', checkRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("An Error occured while connecting mongoDB: ", err));


app.listen(process.env.PORT || 5000, ()=>{
    console.log(`Server running in port ${process.env.PORT}`)
})