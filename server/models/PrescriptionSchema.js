import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  patientNumber: { type: String, required: true, index: true },
  doctorNumber: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  ipfsHash: { type: String, default: '' },
  fileName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export const Prescription = mongoose.model('Prescription', prescriptionSchema);