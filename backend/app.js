import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import listingRouter from './routes/listings.routes.js'

export const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(cookieParser());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/listing', listingRouter);