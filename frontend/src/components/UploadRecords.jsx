// src/components/UploadDocument.jsx
import React, { useState , useContext } from 'react';
// import ipfs from '../assets/ipfs';
import { uploadFileToIPFS } from '../assets/uploadToPinata';
import { useNavigate , useParams } from 'react-router-dom';
import toast , {Toaster} from 'react-hot-toast';
import { Web3Context } from '../context/Web3Context.jsx'; // Import your Web3 context
import { useEffect } from 'react';




const UploadDocument = () => {
    const Backend_URL = import.meta.env.VITE_BACKEND_URL ;
    const { hhNumber } = useParams(); // Assuming you have a route parameter for hhNumber
    const { web3, account, contract, network } = useContext(Web3Context);
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [ipfsHash, setIpfsHash] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // useEffect(() => {
    //     const init = async () => {
    //         if (!web3 || !contract || !account || !network) {
    //             alert('Web3 or contract not initialized.');
    //             return;
    //         }
    //         try {
    //             await contract.methods.addPatientIPFSHash(hhNumber , ipfsHash).send({ from: account , gas: 4000000 });
    //             toast.success('IPFS hash added to patient record successfully!');
    //             navigate(`/patient/${hhNumber}`);
                
    //         } catch (error) {
    //             console.error(error);
    //             alert('Failed to add IPFS hash to patient record.');
    //             return;
                
    //         }
    //     }
    //     init();
    // }, [web3, account, contract, hhNumber ,ipfsHash ]);

    const handleUpload = async () => {
        try {
            if (!file) return alert('Please select a file first!');
            setLoading(true);
            const hash = await uploadFileToIPFS(file);
            setIpfsHash(hash);
            // Store IPFS hash in MongoDB via backend API
            const response = await fetch(`${Backend_URL}/api/records`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patientNumber: hhNumber, ipfsHash: hash, fileName: file.name }),
            });
            if (response.ok) {
                toast.success('Record added to database successfully!');
            } else {
                toast.error('Failed to add record to database.');
            }
            setLoading(false);
        } catch (err) {
            alert('Upload or database transaction failed');
            setLoading(false);
        }
    };
    const BackToDashboard = () => {
        navigate(`/patient/${hhNumber}`); // Adjust the path as needed   
    };

    return (
        <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white h-screen flex flex-col justify-center items-center">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="h-full max-w-8xl bg-gray-700 p-24 rounded-lg shadow-lg flex flex-col justify-center items-center">
                <h1 className="text-3xl sm:text-4xl font-bold mb-6">
                    Upload Your Past Medical Records
                </h1>
            
            <label htmlFor="file-upload" className="mb-2 flex flex-col items-center cursor-pointer bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 border-2 border-dashed border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                </svg>
                <span>Click to select a file</span>
                <input id="file-upload" type="file" onChange={handleFileChange} className="hidden" />
            </label>
            {file && (
                <div className="mb-6 text-teal-200 text-sm font-medium animate-fade-in">
                    You selected: <span className="font-semibold">{file.name}</span>
                </div>
            )}
            
            <button
                onClick={handleUpload}
                className="bg-teal-500 px-4 py-2 rounded hover:bg-teal-600"
            >
                {loading ? 'Uploading...' : 'Upload to IPFS'}
            </button>
            <button
                onClick={BackToDashboard}
                className="bg-teal-500 px-4 py-2 rounded hover:bg-teal-600"
            >
                Back to Dashboard
            </button>

            {ipfsHash && (
                <div className="mt-6">
                    <p>✅ File uploaded successfully!</p>
                    <p><strong>IPFS Hash:</strong> {ipfsHash}</p>
                    <a
                        href={`https://ipfs.io/ipfs/${ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline"
                    >
                        View Document
                    </a>
                </div>
            )}
        </div>
        </div>
    );
};

export default UploadDocument;
