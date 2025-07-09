import express from 'express';
import { AddingUserRecords, GettingUserRecords, AllUserReports } from '../controllers/UserRecords.js';
import { AddingPrescrition, GettingPrescrition, AllPrescritionReports } from '../controllers/PrecriptionReports.js';
import { AddingDiagnosisReport, GettingDiagnosisReport, AllDiagnosisReport } from '../controllers/DiagnosisReports.js'; 
import { LoginHistoryStore, LoginHisoryGet } from '../controllers/LoginHistory.js';
import { ChatBot } from '../controllers/ChatBot.js';
import { FeedbackGet , createFeedback } from '../controllers/Feedback.js';




const router = express.Router();

// API endpoint to store IPFS hash
router.post('/api/records', AddingUserRecords);
// API endpoint to get records for a patient
router.get('/api/records/:patientNumber', GettingUserRecords);
// API endpoint to store prescription
router.post('/api/prescriptions', AddingPrescrition);
// API endpoint to get prescriptions for a patient
router.get('/api/prescriptions/:patientNumber', GettingPrescrition);
// API endpoint to store diagnosis report
router.post('/api/diagnosis/report', AddingDiagnosisReport);
// API endpoint to get diagnosis report for a patient
router.get('/api/:hhNumber/diagnosticreport', GettingDiagnosisReport);
// API endpoint to get all diagnosis reports
router.get('/api/diagnosisreport', AllDiagnosisReport);
// API endpoint to get all user reports
router.get('/api/AllUserReports', AllUserReports);
// API endpoint to get all prescription reports
router.get('/api/prescription_reports', AllPrescritionReports);

router.post('/api/login-history', LoginHistoryStore);

router.get('/api/login-history', LoginHisoryGet);

router.post('/api/chatbot' , ChatBot);





router.get('/api/feedback', FeedbackGet);

router.post('/api/feedback', createFeedback);

export default router;