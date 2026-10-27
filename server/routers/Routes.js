import express from 'express';
import { AddingUserRecords, GettingUserRecords, AllUserReports } from '../controllers/UserRecords.js';
import { AddingPrescrition, GettingPrescrition, AllPrescritionReports } from '../controllers/PrecriptionReports.js';
import { AddingDiagnosisReport, GettingDiagnosisReport, AllDiagnosisReport } from '../controllers/DiagnosisReports.js'; 
import { LoginHistoryStore, LoginHisoryGet } from '../controllers/LoginHistory.js';
import { ChatBot } from '../controllers/ChatBot.js';
import { FeedbackGet, createFeedback } from '../controllers/Feedback.js';
import { getNonce, verifySignature, getCurrentUser } from '../controllers/AuthController.js';
import { uploadMiddleware, uploadToIPFS } from '../controllers/UploadController.js';
import { authenticateToken, optionalAuth, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// ==================== Authentication Routes ====================
router.get('/api/auth/nonce', getNonce);
router.post('/api/auth/verify', verifySignature);
router.get('/api/auth/me', authenticateToken, getCurrentUser);

// ==================== Secure File Upload (IPFS) ====================
router.post('/api/upload', uploadMiddleware, uploadToIPFS);

// ==================== User Records ====================
router.post('/api/records', optionalAuth, AddingUserRecords);
router.get('/api/records/:patientNumber', optionalAuth, GettingUserRecords);
router.get('/api/AllUserReports', optionalAuth, AllUserReports);

// ==================== Prescriptions ====================
router.post('/api/prescriptions', optionalAuth, AddingPrescrition);
router.get('/api/prescriptions/:patientNumber', optionalAuth, GettingPrescrition);
router.get('/api/prescription_reports', optionalAuth, AllPrescritionReports);

// ==================== Diagnosis Reports ====================
router.post('/api/diagnosis/report', optionalAuth, AddingDiagnosisReport);
router.get('/api/:hhNumber/diagnosticreport', optionalAuth, GettingDiagnosisReport);
router.get('/api/diagnosisreport', optionalAuth, AllDiagnosisReport);

// ==================== Login History & Auditing ====================
router.post('/api/login-history', LoginHistoryStore);
router.get('/api/login-history', optionalAuth, LoginHisoryGet);

// ==================== AI Chatbot ====================
router.post('/api/chatbot', ChatBot);

// ==================== Feedback ====================
router.get('/api/feedback', FeedbackGet);
router.post('/api/feedback', createFeedback);

export default router;