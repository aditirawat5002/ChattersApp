import express from "express"
import dotenv from 'dotenv'
import dbConnect from "./DB/dbConnect.js";
import authRouter from  './rout/authUser.js'
import messageRouter from './rout/messageRout.js'
import userRouter from './rout/userRout.js'
import cookieParser from "cookie-parser";
import path from "path";

import {app , server} from './Socket/socket.js'

const __dirname = path.resolve();

dotenv.config();


// allow larger payloads (base64 images); default limit is ~100kb
// we bump the limit because base64 images can easily exceed 10MB for high-res files
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser())

// optional: enable CORS in case front and back run cross‑origin
import cors from 'cors';
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use('/api/auth',authRouter)
app.use('/api/message',messageRouter)
app.use('/api/user',userRouter)

app.use(express.static(path.join(__dirname,"/frontend/dist")))

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
})

const PORT = process.env.PORT || 3000

const startServer = async () => {
    await dbConnect();
    server.listen(PORT,()=>{
        console.log(`Working at ${PORT}`);
    })
}

startServer();