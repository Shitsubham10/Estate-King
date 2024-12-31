import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js';
dotenv.config();

const app=express();
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow sending cookies with requests
  };
  app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('connected to db');
})
.catch((error)=>{
    console.log(error);
});

app.use(cookieParser());
app.listen(3000,()=>{
    console.log('server is running at port 3000');
}
);
app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message = err.message|| 'internal server error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});
