const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.ATLAS_URI;

mongoose.connect(uri  ,
    { useNewUrlParser:true, useCreateIndex:true , useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open',()=>{
    console.log("MongoDB database connection established successfully")
})


const usersRouter = require('./controllers/router/userRoute');
const coursRouter = require('./controllers/router/coursRoute');
const authRouter = require('./controllers/router/authRoute');
const abonnementRoute = require('./controllers/router/abonnementRoute');
const paymentRoute = require('./controllers/router/paymentRouter');
const stripeRoute = require('./controllers/router/stripeRoute');
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use('/users',usersRouter);
app.use('/auth',authRouter);
app.use('/cours',coursRouter);
app.use('/abonnement',abonnementRoute);
app.use('/payment',paymentRoute);
app.use('/stripe',stripeRoute);

app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
});