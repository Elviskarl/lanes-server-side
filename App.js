const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const imageRouter = require('./routes/Images');
const loginRouter = require('./routes/Login');
const notFound = require('./middleware/not-found');
// For now - To fit the current usage of the middleware in the app, we will not throw an error if the token is not present.
// const auth = require('./middleware/authentication');
const app = express();

app.set('trust proxy', 1);
app.use(express.json({limit: '20mb'}));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Swagger
const swaggerUI = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDocument = yaml.load('./swagger.yaml');

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument));
app.get('/',(req,res)=>{
  res.status(200).send('<h1>Welcome</h1><a href="/api-docs">Documentation</a>');
})

// Routes
app.use('/api/v1',imageRouter);
app.use('/api/v1/user',loginRouter);

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