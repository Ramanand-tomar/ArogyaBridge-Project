
// File: server%20side/controllers/PrecriptionReports.js
import { Prescription } from '../models/PrescriptionSchema.js'; // Adjust path as needed    

import express from 'express';


const AddingPrescrition =  async (req, res) => {
  try {
    const { patientNumber, doctorNumber, title, description, date , ipfsHash , fileName } = req.body;
    console.log("Prescription data at backend is : " , req.body)
    if (!patientNumber || !doctorNumber || !title || !description || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newPrescription = new Prescription({ patientNumber, doctorNumber, title, description, date  , ipfsHash, fileName});
    await newPrescription.save();
    res.status(201).json({ message: 'Prescription saved', prescription: newPrescription });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save prescription' });
  }
}

// API endpoint to get prescriptions for a patient
const GettingPrescrition =  async (req, res) => {
  try {
    const { patientNumber } = req.params;
    const prescriptions = await Prescription.find({ patientNumber });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
}

const AllPrescritionReports =  async (req, res) => {
  try {
    
    const reports = await Prescription.find({});
    if (!reports || reports.length === 0) {
      return res.status(404).json({ error: 'No User reports found for this patient' });
    }
    
    // Return the reports
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch User reports' });
  }
}

export { AddingPrescrition, GettingPrescrition , AllPrescritionReports };