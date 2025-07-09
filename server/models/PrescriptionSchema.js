import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  patientNumber: { type: String, required: true },
  doctorNumber: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  ipfsHash: { type: String, required: true },
  fileName :{type : String , required: true},
  
});
export const Prescription = mongoose.model('Prescription', prescriptionSchema);