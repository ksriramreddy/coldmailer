import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import mongoose from 'mongoose';
import { connectDB } from './lib/connectdb.js';
import { login, signup } from './controller/authController.js';
import { AddMailContents, composeMail, deleteMailContent, getMailContents, uploadFile } from './controller/mailController.js';

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(cors({ 
    credentials:true,
    origin:"http://localhost:5173"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/signup', signup)
app.post('/api/login', login)
app.put('/api/update',AddMailContents)
app.post('/api/delete', deleteMailContent)
app.post('/api/mailContents',getMailContents)
app.post('/api/compose', composeMail)
app.post('/api/uploadFile',upload.single('file'), uploadFile)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})