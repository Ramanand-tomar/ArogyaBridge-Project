import express from "express"
import mongoose from "mongoose"
import cors from "cors" 
import Router from './routers/Routes.js';
const app = express()
import dotenv from "dotenv";
dotenv.config();




const mongoURI = process.env.mongoURI || "mongodb://localhost:27017/healthcare"; // Replace with your MongoDB URI

const port = process.env.PORT || 5000




mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));



// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json());

// Mongoose schema and model for IPFS records



// API endpoint to store IPFS hash
app.use(Router);
// API endpoint to get records for a patient
// app.get('/api/records/:patientNumber', GettingUserRecords);  
// API endpoint to store prescription
// app.post('/api/prescriptions', AddingPrescrition);   
// API endpoint to get prescriptions for a patient




app.listen(port , ()=>console.log(`server is running on port no. ${port}`));