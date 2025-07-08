# 🩺 ArogyaBridge — Decentralized Electronic Health Record (EHR) System

> **Built with MERN Stack + Blockchain + IPFS + AI Chatbot**  
> Bridging the gap between secure medical data, transparency, and control for patients, doctors, and labs.

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
- AI ChatBot Integration:  OpenAI API

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

<br>


## Requirements for this projects

1.Install nodeJs

* [Node JS](https://nodejs.org/en/download/)

2.Install Ganache

* [Ganache Truffle](https://www.trufflesuite.com/ganache)

3. Download IPFS (kubo)

* [IPFS Kubo](https://dist.ipfs.tech/#go-ipfs)

4.Add Metamask Extension in Browser

* [Metamask Chrome](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en-US)

5. open cmd in project directory

```
npm install --force
```

5.open cmd/terminal as Administrator and type

```
npm install -g truffle
```

6.open Ganache
 
 *  New Workspace
 *  AddProject
 *  Select truffle-config.js in Project Directory
 *  Save Workspace

7.Compile and migrate Contracts
 ```
 truffle compile
 truffle migrate
 ```
8. Run Server

```
npm start
```
