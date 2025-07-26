# 🩺 ArogyaBridge — Decentralized Electronic Health Record (EHR) System

> **Built with MERN Stack + Blockchain + IPFS + AI Chatbot**  
> Bridging the gap between secure medical data, transparency, and control for patients, doctors, and labs.

<br>

## 🔗 Live Demo  
👉 [Click here to view the live demo](https://arogya-bridge-ycwl.vercel.app/)
- make sure you have metamask account to open this project


## 📚 Table of Contents
- [🚀 Project Overview](#-project-overview)
- [🎯 Problem Statement](#-problem-statement)
- [💡 Our Solution](#-our-solution)
- [🛠️ Tech Stack](#️-tech-stack)
- [🧩 Project Demo](#-project-demo)
- [Key Features](#key-features)
  - [1. Patient Management](#1-patient-management)
  - [2. Doctor Management](#2-doctor-management)
  - [3. Diagnosis Center Management](#3-diagnosis-center-management)
  - [4. Admin Panel](#4-admin-panel)
  - [5. Feedback System](#5-feedback-system)
  - [6. Security & Best Practices](#6-security--best-practices)
  - [7. AI Chatbot](#7-ai-chatbot)
- [Requirements for this project (How to Run on Your PC)](#requirements-for-this-projects-how-to-run-in-your-pc)
- [⚠️ Drawbacks & Limitations](#️-drawbacks--limitations)
- [🧪 Future Scope](#-future-scope)
- [🧩 Core Features](#-core-features)
  - [✅ General](#-general)
  - [👤 Patient](#-patient)
  - [🧑‍⚕ Doctor](#-doctor)
  - [🧪 Diagnostic Center](#-diagnostic-center)
  - [🔐 Security & Decentralization](#-security--decentralization)
- [🧩 Project Demo](#-project-demo)
  
<br>

## 🚀 Project Overview

**ArogyaBridge** is a blockchain-powered platform that enables secure, tamper-proof, and decentralized storage of medical records. It empowers **patients** with ownership and control over their health data, while providing **doctors** and **diagnostic centers** seamless yet permissioned access. The system ensures **trust, traceability, and transparency** — eliminating the risks of centralized failures, data leaks, and fake reports.

<br>

**Summary** : The "Secure Electronic Health Records" project utilizes Ethereum blockchain, Metamask, and Ganache to enable patients to securely upload medical data and also view his data, manage doctor access, and view data history. Doctors can manage patient lists, access records, generate consultancy reports, and revoke access given by patient. Diagnostic centers can create EHR reports, ensuring visibility for both patients and doctors through IPFS integration. This decentralized approach enhances data security, interoperability, and patient control over health information, ultimately improving healthcare delivery and patient outcomes.


<br>

## 🎯 Problem Statement

- Health records are fragmented across hospitals with **no unified view**.
- **Patients lack control** over who can access their sensitive data.
- **Medical reports and prescriptions can be faked**.
- **Insurance approvals are delayed** due to manual verification.
- Lack of **audit logs** and **transparent access history**.

<br>

## 💡 Our Solution

A decentralized Electronic Health Record system with:

- **Ethereum blockchain** for tamper-proof access control.
- **IPFS** for decentralized file storage.
- **MetaMask** for secure login and transaction signing.
- **Smart contracts** to manage access permissions.
- **AI Chatbot** to answer patient queries and FAQs.
- **Role-based functionality** for Patients, Doctors, and Labs.
- **MongoDB** to store user metadata and analytics.
- **MVC architecture** for clean backend organization.

<br>

## 🛠️ Tech Stack

## Frontend

- Framework: React.js (Vite) , React-icons
- UI Library: TailwindCSS
- Charts: Recharts 
- State Management: Context API
- Blockchain Interaction: Web3.js

## Backend
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB
- AI  Integration:  Gemini API (for Medical Records analysis)

## Blockchain
- Wallet Connection : Metamask
- Smart Contracts: Solidity
- Development: Truffle Suite
- Local Blockchain: Ganache
- File Storage: IPFS

<br>

## Key Features

 # 1. Patient Management
- Registration: Patients can register with personal details (name, DOB, gender, blood group, address, email, HH number, password).
- Authentication: Login with HH number and password (validated on-chain).
- IPFS File Upload: Patients (or admins) can upload files (e.g., medical records) to IPFS, and store the hash on-chain.
- Data Retrieval: All patient data can be fetched and displayed in tables or charts.

 # 2. Doctor Management
- Registration: Doctors register with details like name, hospital, DOB, gender, email, HH number, specialization, department, designation, work experience, and password.
- Authentication: Login with HH number and password.
- Data Retrieval: All doctor data can be fetched and visualized (including specialization analytics).

 # 3. Diagnosis Center Management
- Registration: Diagnostic centers register with name, hospital, location, email, HH number, and password.
- Authentication: Login with HH number and password.
- Data Retrieval: All diagnostic center data can be fetched and visualized.
  
 # 4. Admin Panel
- Dashboard: Visualizes system data using bar and pie charts (patients, doctors, diagnosis centers, gender distribution, doctor specializations, etc.).
- Tables: Lists for login history, registered patients, doctors, diagnosis centers, patient files (IPFS), prescription reports, and diagnosis reports.
- Responsive & Animated UI: Modern, animated, and responsive design using TailwindCSS and custom CSS animations.
  
 # 5. Feedback System
- Submission: Users can submit feedback via the homepage.
- Display: Feedback is fetched from the backend and displayed with animated sliders and cards.
  
 # 6. Security & Best Practices
- On-chain Validation: All sensitive operations (registration, login, file upload) are validated on-chain.
- Password Handling: Passwords are stored as hashes (though for production, consider off-chain authentication).
- IPFS Integration: Medical files are stored off-chain on IPFS, with hashes referenced on-chain.

 # 7. AI Chatbot
- Answers basic user queries.

 # 8. 🧬 AI-Based Health Summary Generation
- Generates a readable health summary based on lab reports, prescriptions, and history.
- Useful for emergency sharing with doctors.
- Multilingual support available.


 <br>



Aarogya Setu+ is a next-generation, AI-integrated, decentralized healthcare platform designed to empower patients with privacy, transparency, and access to modern health services. The system utilizes blockchain for secure medical data sharing, and integrates AI for health analysis and treatment recommendations.

---



## 🌟 Key Features have to be implementing in future Scale Up for Large level productions



### 1. 🔁 Chatting System (Patient ↔ Doctor / Patient ↔ Support)
- Real-time encrypted chat interface.
- Audio and text messaging support.
- Chat records securely stored with consent.

### 2. 💸 Patient Treatment Funding
- Public and private donation system for underprivileged patients.
- Track donations, disbursements, and treatment status transparently.
- KYC + blockchain for donor and recipient verification.

### 3. 🛡️ Insurance Scheme Integration
- Compare & apply to government and private insurance plans.
- Auto-fetch eligibility using Aadhaar and health data.
- Claim filing and tracking from within the app.

### 4. 💊 Smart Medicine Tracker
- Buy, store, and get reminders for your prescribed medicines.
- Integrates with local pharmacies for delivery.
- AI warns of possible side effects or expiry alerts.

### 5. 🧠 AI-Based Health File Analysis
- Upload any health report (PDF, image, or doc).
- AI extracts values, flags anomalies, and summarizes findings.
- Cross-check against past records and suggest next steps.

### 6. 📈 Track Your Health System
- Daily/weekly tracking of vitals (BP, sugar, HR, etc.).
- Sync with wearables (optional).
- Visual health trends & alerts for irregularities.

### 7. 🏥 Treatment Loan Schemes
- Compare treatment-based micro-loan providers.
- EMI estimation based on treatment cost.
- Pre-approved limits for recurring patients.

---


## Requirements for this projects (How to Run in Your PC)

## 📂 Clone the Repository

```
git clone https://github.com/Ramanand-tomar/ArogyaBridge-Project
cd  ArogyaBridge-Project
```

1.Install nodeJs

* [Node JS](https://nodejs.org/en/download/)

2.Install Ganache

* [Ganache Truffle](https://www.trufflesuite.com/ganache)

3. Download IPFS (kubo)

* [IPFS Kubo](https://dist.ipfs.tech/#go-ipfs)

4.Add Metamask Extension in Browser

* [Metamask Chrome](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en-US)

5. open cmd in project directory.

```
npm install --force
```

6.open cmd/terminal as Administrator and type.

```
npm install -g truffle
```

7.open Ganache
 
 *  New Workspace
 *  AddProject
 *  Select truffle-config.js in Project Directory
 *  Save Workspace



8. Make Metamask New Account By Adding Ganache Private key Account


9. Compile and migrate Contracts.
 ```
 truffle compile
 truffle migrate --reset
 ```

10. Replaces Smart Contracts deployed Address
    
    
11. Replace ABIs into json files and changes ABI folder files


12. Make JWT key of IPFS using Pinata Library [IPFS](https://app.pinata.cloud/ipfs/files) and Replace it in your project file connection to ipfs
    

13. Run frontent

```
npm run dev
```

13. Connect Backend with MongoDb
  
   
14. Run Backend server
    ```
     npm start
    ```

<br> 

## ⚠️ Drawbacks & Limitations

- **Ethereum Gas Fees**: Costly on public chains (can be solved via L2 chains like Polygon)
- **IPFS Privacy**: CIDs are public; requires encryption for sensitive files
- **Learning Curve**: MetaMask and wallets may be unfamiliar for non-tech users
- **Offline Access**: Requires wallet and internet connection

<br>

## 🧪 Future Scope

- End-to-end encryption for files on IPFS
- Integration with insurance systems
- E-prescription module for pharmacies
- Cross-border health record portability
- ML-based health insights from patient records

  <br>

## 🧩 Core Features

### ✅ General
- MetaMask login for all users (no passwords)
- Role selection: Patient, Doctor, Diagnostic Lab
- User data stored in MongoDB

### 👤 Patient
- Upload medical records (PDF, images, etc.)
- Grant or revoke access to doctors or labs
- View access logs and history

### 🧑‍⚕ Doctor
- View accessible patient reports
- Upload diagnosis or consultation notes
- Request access if not granted

### 🧪 Diagnostic Center
- Upload lab reports
- Share with patients and doctors via IPFS + smart contract

### 🔐 Security & Decentralization
- All files stored on IPFS for immutability
- Access control via Ethereum smart contracts
- Access requests are signed transactions
- Audit logs stored both on-chain and in MongoDB

<br>

## 🧩 Project Demo
- Landing Page
  
![Landing Page](frontend/public/Screenshot%202025-07-09%20211846.png)
![Landing Page](frontend/public/Screenshot%202025-07-09%20212250.png)

- User Feedback
  
![Landing Page](frontend/public/Screenshot%202025-07-09%20212923.png)

- About
   
![Landing Page](frontend/public/Screenshot%202025-07-09%20213001.png)

- Patient Registration
  
![Landing Page](frontend/public/Screenshot%202025-07-09%20213059.png)

- Login

![Landing Page](frontend/public/Screenshot%202025-07-09%20213336.png)

- Patient Dashboard

![Landing Page](frontend/public/Screenshot%202025-07-09%20213421.png)

- Patient's Profile

![Landing Page](frontend/public/Screenshot%202025-07-09%20213439.png)

- Uploading Past Records

![Landing Page](frontend/public/Screenshot%202025-07-09%20213521.png)

- Patient's Record

![Landing Page](frontend/public/Screenshot%202025-07-09%20213552.png)

- Grant Permission to your Doctor

![Landing Page](frontend/public/Screenshot%202025-07-09%20213830.png)

- Prescription Details 

![Landing Page](frontend/public/Screenshot%202025-07-09%20213854.png)

- Diagonostic Centre Dashboard

![Landing Page](frontend/public/Screenshot%202025-07-09%20214024.png)

- Diagonostic Report Creation

![Landing Page](frontend/public/Screenshot%202025-07-09%20214103.png)

-  Diagonostic Report Details

![Landing Page](frontend/public/Screenshot%202025-07-09%20214457.png)

- Doctor Profile

![Landing Page](frontend/public/Screenshot%202025-07-09%20214611.png)

- Patient's Details to Doctor

![Landing Page](frontend/public/Screenshot%202025-07-09%20214642.png)

- Patient's Presciption

![Landing Page](frontend/public/Screenshot%202025-07-09%20214705.png)

- ArogyaBrigde Prescription

![Landing Page](frontend/public/Screenshot%202025-07-09%20214835.png)

- ArogyaBrigde Chatbot

![Landing Page](frontend/public/Screenshot%202025-07-09%20214941.png)

- Admin Panel

![Landing Page](frontend/public/Screenshot%202025-07-09%20221347.png)

- System Overview / User Login History

![Landing Page](frontend/public/Screenshot%202025-07-09%20221404.png)

- Patient's Files and Reports 

![Landing Page](frontend/public/Screenshot%202025-07-09%20221444.png)




