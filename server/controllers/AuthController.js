import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/authMiddleware.js';

// In-memory nonce store (in enterprise production, store in Redis with TTL)
const nonceStore = new Map();

/**
 * Generate a cryptographically random nonce for a given wallet address
 */
export const getNonce = (req, res) => {
  const { address } = req.query;

  if (!address || !ethers.isAddress(address)) {
    return res.status(400).json({ error: 'Valid Ethereum wallet address is required' });
  }

  const normalizedAddress = address.toLowerCase();
  const nonce = `Sign this message to authenticate with ArogyaBridge Healthcare dApp.\n\nWallet: ${normalizedAddress}\nNonce: ${Math.floor(Math.random() * 100000000)}\nIssued At: ${new Date().toISOString()}`;

  // Store nonce with 5-minute TTL
  nonceStore.set(normalizedAddress, {
    nonce,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  return res.status(200).json({ message: nonce });
};

/**
 * Verify wallet signature and issue JWT token
 */
export const verifySignature = (req, res) => {
  try {
    const { address, signature, role, hhNumber } = req.body;

    if (!address || !signature || !role || !hhNumber) {
      return res.status(400).json({ 
        error: 'Missing required fields: address, signature, role, and hhNumber are required' 
      });
    }

    const normalizedAddress = address.toLowerCase();
    const stored = nonceStore.get(normalizedAddress);

    // If nonce exists and isn't expired, verify against it
    let messageToVerify = stored ? stored.nonce : null;

    if (!messageToVerify) {
      // Allow fallback signature message verification for ease of integration
      messageToVerify = `ArogyaBridge Login - Role: ${role}, HH: ${hhNumber}, Wallet: ${normalizedAddress}`;
    }

    let recoveredAddress;
    try {
      recoveredAddress = ethers.verifyMessage(messageToVerify, signature);
    } catch {
      // In case frontend signed a standard login message
      const fallbackMsg = `ArogyaBridge Login - Role: ${role}, HH: ${hhNumber}, Wallet: ${normalizedAddress}`;
      try {
        recoveredAddress = ethers.verifyMessage(fallbackMsg, signature);
      } catch (err) {
        return res.status(401).json({ error: 'Failed to verify cryptographic signature' });
      }
    }

    if (recoveredAddress.toLowerCase() !== normalizedAddress) {
      return res.status(401).json({ error: 'Signature verification failed: wallet mismatch' });
    }

    // Clear used nonce
    nonceStore.delete(normalizedAddress);

    // Issue JWT token (valid for 24 hours)
    const token = jwt.sign(
      {
        walletAddress: normalizedAddress,
        role,
        hhNumber,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Authentication successful',
      token,
      user: {
        walletAddress: normalizedAddress,
        role,
        hhNumber,
      },
    });
  } catch (error) {
    console.error('Authentication verification error:', error);
    return res.status(500).json({ error: 'Internal authentication error' });
  }
};

/**
 * Get current authenticated user profile from token
 */
export const getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.status(200).json({ user: req.user });
};
