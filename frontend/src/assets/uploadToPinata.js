import axios from 'axios';

/**
 * Upload a file to IPFS via the secure ArogyaBridge Backend Proxy.
 * This guarantees the Pinata JWT master credentials are NEVER exposed to the client-side browser bundle.
 *
 * @param {File} file - The file to upload
 * @returns {Promise<string>} The IPFS CID hash
 */
export const uploadFileToIPFS = async (file) => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const url = `${backendUrl}/api/upload`;

  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('arogya_auth_token');
  const headers = {
    'Content-Type': 'multipart/form-data',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await axios.post(url, formData, {
      headers,
    });

    if (!response.data || !response.data.ipfsHash) {
      throw new Error('Backend failed to return IPFS hash');
    }

    return response.data.ipfsHash; // returns the IPFS CID
  } catch (error) {
    console.error('IPFS Upload Error via backend proxy:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to upload file to IPFS. Please verify server connection.');
  }
};