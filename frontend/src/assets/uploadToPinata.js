import axios from 'axios';

// Set your Pinata JWT here (never commit secrets in production)
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

if (!PINATA_JWT) {
  throw new Error('Pinata JWT is not set. Please set VITE_PINATA_JWT in your .env file.');
}

export const uploadFileToIPFS = async (file) => {

  if (!file) {
    throw new Error('No file provided for upload.');
  }
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(url, formData, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    });

    return response.data.IpfsHash; // returns the CID
  } catch (error) {
    console.error('Pinata Upload Error:', error);
    alert('Failed to upload file to Pinata.');
  }
};