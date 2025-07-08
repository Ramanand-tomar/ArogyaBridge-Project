import express from "express"
import mongoose from "mongoose"
import cors from "cors" 
const app = express()
import dotenv from "dotenv"

dotenv.config()

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));

  
app.use(express.json());



// Mongoose schema and model for IPFS records
const recordSchema = new mongoose.Schema({
  patientNumber: { type: String, required: true },
  ipfsHash: { type: String, required: true },
  fileName: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});
const Record = mongoose.model('Record', recordSchema);


// API endpoint to store IPFS hash
app.post('/api/records', async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    // Validate request body
    
    const { patientNumber, ipfsHash, fileName } = req.body;
    if (!patientNumber || !ipfsHash) {
      console.log("Missing required fields:", { patientNumber, ipfsHash });
      return res.status(400).json({ error: 'patientNumber and ipfsHash are required' });

    }
    const newRecord = new Record({ patientNumber, ipfsHash, fileName });
    await newRecord.save();
    res.status(201).json({ message: 'Record saved', record: newRecord });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save record' });
  }
});


// API endpoint to get records for a patient
app.get('/api/records/:patientNumber', async (req, res) => {
  try {
    const { patientNumber } = req.params;
    const records = await Record.find({ patientNumber });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});



// Mongoose schema and model for Prescriptions
const prescriptionSchema = new mongoose.Schema({
  patientNumber: { type: String, required: true },
  doctorNumber: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Prescription = mongoose.model('Prescription', prescriptionSchema);


// API endpoint to store prescription
app.post('/api/prescriptions', async (req, res) => {
  try {
    const { patientNumber, doctorNumber, title, description, date } = req.body;
    if (!patientNumber || !doctorNumber || !title || !description || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newPrescription = new Prescription({ patientNumber, doctorNumber, title, description, date });
    await newPrescription.save();
    res.status(201).json({ message: 'Prescription saved', prescription: newPrescription });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save prescription' });
  }
});


// API endpoint to get prescriptions for a patient
app.get('/api/prescriptions/:patientNumber', async (req, res) => {
  try {
    const { patientNumber } = req.params;
    const prescriptions = await Prescription.find({ patientNumber });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});



// Mongoose schema and model for Diagnosis Reports
const diagnosisReportSchema = new mongoose.Schema({
  hhNumber: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  ipfsHash: { type: String, required: true },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});
const DiagnosisReport = mongoose.model('DiagnosisReport', diagnosisReportSchema);


// API endpoint to store diagnosis report
app.post('/api/diagnosis/report', async (req, res) => {
  try {
    const { hhNumber, title, description, ipfsHash, date } = req.body;
    console.log("Received request body for diagnosis report:", req.body);
    if (!hhNumber || !title || !description || !ipfsHash || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newReport = new DiagnosisReport({ hhNumber, title, description, ipfsHash, date });
    await newReport.save();
    res.status(201).json({ message: 'Diagnosis report saved', report: newReport });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save diagnosis report' });
  }
});

app.get('/api/:hhNumber/diagnosticreport', async (req, res) => {
  try {
    const { hhNumber } = req.params;
    const reports = await DiagnosisReport.find({ hhNumber });
    if (!reports || reports.length === 0) {
      return res.status(404).json({ error: 'No diagnosis reports found for this patient' });
    }
    console.log("Fetched reports:", reports);
    // Return the reports
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch diagnosis reports' });
  }
});


app.listen(5000 , ()=>console.log("server is running on port no. 5000"));
