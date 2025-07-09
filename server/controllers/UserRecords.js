// controller/recordController // Adjust path as needed
 // Adjust path as needed
import { Record } from '../models/UserRecordSchema.js'; // Adjust path as needed    
import express from 'express';

const AddingUserRecords = async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { patientNumber, ipfsHash, fileName } = req.body;

    // Validate request body
    if (!patientNumber || !ipfsHash) {
      console.log("Missing required fields:", { patientNumber, ipfsHash });
      return res.status(400).json({ error: 'patientNumber and ipfsHash are required' });
    }

    // Create new record
    const newRecord = new Record({ patientNumber, ipfsHash, fileName });
    await newRecord.save();

    res.status(201).json({ message: 'Record saved', record: newRecord });

  } catch (err) {
    console.error('Error saving record:', err);
    res.status(500).json({ error: 'Failed to save record' });
  }
};

const GettingUserRecords = async (req, res) => {
  try {
    const { patientNumber } = req.params;
    const records = await Record.find({ patientNumber });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
}

const AllUserReports =  async (req, res) => {
  try {
    
    const reports = await Record.find({});
    if (!reports || reports.length === 0) {
      return res.status(404).json({ error: 'No User reports found for this patient' });
    }
    
    // Return the reports
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch User reports' });
  }
}

export { AddingUserRecords, GettingUserRecords, AllUserReports };
