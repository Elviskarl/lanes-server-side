const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const imageRouter = require('./routes/Images');
const loginRouter = require('./routes/Login');
const notFound = require('./middleware/not-found');
const app = express();


app.use(cors());
app.use(express.json({limit: '20mb'}));

app.get('/',(req,res)=>{
  res.status(200).send('Welcome');
})

// Routes
app.use('/api/v1',imageRouter);
app.use('/api/v1/login',loginRouter);

app.use(notFound);
const port = process.env.PORT || 5000;

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mongoDb');
    app.listen(port,()=>{
      console.log(`Server is listening on port: ${port}`);
    });    
  } catch (error) {
    console.log(error.message);
  }
}
connectToDb();