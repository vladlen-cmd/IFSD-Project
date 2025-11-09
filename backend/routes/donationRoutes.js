import express from 'express';
import {
  createDonation,
  getUserDonations,
  getDonationStats,
  getAllDonations
} from '../controllers/donationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createDonation);

router.get('/my-donations', getUserDonations);

router.get('/stats', getDonationStats);

router.get('/all', getAllDonations);

export default router;