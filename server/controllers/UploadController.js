import axios from 'axios';
import FormData from 'form-data';
import multer from 'multer';

// Use memory storage so files are streamed directly to Pinata without persisting unencrypted to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max limit
  },
});

export const uploadMiddleware = upload.single('file');

export const uploadToIPFS = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided for upload.' });
    }

    const pinataJwt = process.env.PINATA_JWT;
    if (!pinataJwt) {
      return res.status(500).json({ 
        error: 'Server configuration error: PINATA_JWT is not configured.' 
      });
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Optional metadata
    const metadata = JSON.stringify({
      name: req.file.originalname,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
        uploadedBy: req.user ? req.user.walletAddress : 'anonymous',
      },
    });
    formData.append('pinataMetadata', metadata);

    const pinataUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const response = await axios.post(pinataUrl, formData, {
      maxBodyLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${pinataJwt}`,
      },
    });

    const ipfsHash = response.data.IpfsHash;

    return res.status(200).json({
      message: 'File pinned to IPFS successfully',
      ipfsHash,
      fileName: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    console.error('Pinata backend upload error:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Failed to upload file to IPFS via Pinata pinning service' 
    });
  }
};
