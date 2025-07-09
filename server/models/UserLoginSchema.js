import mongoose from 'mongoose';

const LoginSchema = new mongoose.Schema({
  hhNumber: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});
export const LoginRecord = mongoose.model('LoginRecord', LoginSchema);  