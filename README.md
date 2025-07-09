# 🩺 ArogyaBridge — Decentralized Electronic Health Record (EHR) System

> **Built with MERN Stack + Blockchain + IPFS + AI Chatbot**  
> Bridging the gap between secure medical data, transparency, and control for patients, doctors, and labs.

<br>

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
- AI ChatBot Integration:  Gemini API

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
 

<br>


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



