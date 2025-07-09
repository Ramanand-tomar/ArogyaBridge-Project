import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  patientNumber: { type: String, required: true },
  ipfsHash: { type: String, required: true },
  fileName: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});
export const Record = mongoose.model('Record', recordSchema);