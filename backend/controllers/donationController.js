import Donation from '../models/Donation.js';
import User from '../models/User.js';

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private
export const createDonation = async (req, res) => {
  try {
    const { amount, category, name, email, message } = req.body;

    // Validation
    if (!amount || !category || !name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Donation amount must be at least ₹1'
      });
    }

    // Create donation
    const donation = await Donation.create({
      user: req.user._id,
      amount,
      category,
      donorName: name,
      email,
      message
    });

    // Populate user info
    await donation.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Donation created successfully!',
      data: donation
    });

  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing donation'
    });
  }
};

// @desc    Get user's donation history
// @route   GET /api/donations/my-donations
// @access  Private
export const getUserDonations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const donations = await Donation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'name email');

    const total = await Donation.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: {
        donations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get user donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching donation history'
    });
  }
};

// @desc    Get donation statistics for user
// @route   GET /api/donations/stats
// @access  Private
export const getDonationStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total donations and amount
    const totalStats = await Donation.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalDonations: { $sum: 1 }
        }
      }
    ]);

    // Get category breakdown
    const categoryStats = await Donation.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { amount: -1 } }
    ]);

    // Get monthly stats for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Donation.aggregate([
      { 
        $match: { 
          user: userId,
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const stats = {
      total: totalStats[0] || { totalAmount: 0, totalDonations: 0 },
      categories: categoryStats,
      monthly: monthlyStats,
      favoriteCause: categoryStats[0]?._id || 'education'
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get donation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching donation statistics'
    });
  }
};

// @desc    Get all donations (Admin only - for future use)
// @route   GET /api/donations/all
// @access  Private/Admin
export const getAllDonations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const donations = await Donation.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'name email');

    const total = await Donation.countDocuments();

    res.json({
      success: true,
      data: {
        donations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get all donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching donations'
    });
  }
};