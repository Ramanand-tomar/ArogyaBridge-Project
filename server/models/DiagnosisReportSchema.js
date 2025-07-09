import mongoose from 'mongoose';
const diagnosisReportSchema = new mongoose.Schema({
  hhNumber: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  ipfsHash: { type: String, required: true },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const DiagnosisReport = mongoose.model('DiagnosisReport', diagnosisReportSchema);