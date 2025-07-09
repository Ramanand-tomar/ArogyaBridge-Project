import { DiagnosisReport } from '../models/DiagnosisReportSchema.js';
import express from 'express';


const AddingDiagnosisReport =  async (req, res) => {
  try {
    const { hhNumber, title, description, ipfsHash, date } = req.body;
    
    if (!hhNumber || !title || !description || !ipfsHash || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newReport = new DiagnosisReport({ hhNumber, title, description, ipfsHash, date });
    await newReport.save();
    res.status(201).json({ message: 'Diagnosis report saved', report: newReport });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save diagnosis report' });
  }
}

const GettingDiagnosisReport =  async (req, res) => {
  try {
    const { hhNumber } = req.params;
    const reports = await DiagnosisReport.find({ hhNumber });
    if (!reports || reports.length === 0) {
      return res.status(404).json({ error: 'No diagnosis reports found for this patient' });
    }
    
    // Return the reports
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch diagnosis reports' });
  }
}


const AllDiagnosisReport =  async (req, res) => {
  try {
    
    const reports = await DiagnosisReport.find({});
    if (!reports || reports.length === 0) {
      return res.status(404).json({ error: 'No diagnosis reports found for this patient' });
    }
    
    // Return the reports
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch diagnosis reports' });
  }
}

export { AddingDiagnosisReport, GettingDiagnosisReport, AllDiagnosisReport };