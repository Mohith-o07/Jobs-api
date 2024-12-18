
const express = require('express');
const app = express();
require('dotenv').config();
require('express-async-errors');

//extra security packages
const helmet=require('helmet')
const cors=require('cors')
const rateLimiter=require('express-rate-limit')
const xssClean=require('xss-clean')
//Swagger
const swaggerUI=require('swagger-ui-express')
const yaml=require('yamljs')
const swaggerDoc=yaml.load('./swagger.yaml')

const mongoose=require('mongoose');
const morgan=require('morgan');
const authRouter=require('./routes/auth');
const jobsRouter=require('./routes/jobs');
const authenticateUser=require('./middleware/authentication')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.set('trust proxy',1)
app.use(
    rateLimiter({
        windowMs:15*60*1000, //15 minutes
        max:100, //limits each ip to 100 requests per windowMs
    }))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xssClean())

app.use(morgan('tiny'));

app.get('/',(req,res)=>{
    res.send('<h1>Jobs api</h1><a href="/api-docs">Documentation</a>')
});

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDoc));

//routes
app.use('/v1/jobs/auth',authRouter);
app.use('/v1/jobs',authenticateUser,jobsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const dbURI=process.env.dbURI;
const port=process.env.PORT || 5000;
mongoose.connect(dbURI)
.then(res=>{
    app.listen(port);
    console.log('connected to db!');
})
.catch(err=>console.log(err))