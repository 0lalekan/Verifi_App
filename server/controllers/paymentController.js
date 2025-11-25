import asyncHandler from 'express-async-handler';
import axios from 'axios';
import User from '../models/userModel.js';

// Add FLW_SECRET_KEY to your .env file
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

const PLANS = {
  'Growth': { amount: 50000, durationDays: 30 }, // 50,000 NGN
  'Scale': { amount: 150000, durationDays: 30 }  // 150,000 NGN
};

// @desc    Initialize Flutterwave Payment
// @route   POST /api/payment/initialize
// @access  Manufacturer
export const initializePayment = asyncHandler(async (req, res) => {
  const { plan } = req.body;
  const user = await User.findById(req.user._id);

  if (!PLANS[plan]) {
    res.status(400);
    throw new Error('Invalid plan selected');
  }

  const amount = PLANS[plan].amount;
  // Create a unique tx_ref
  const tx_ref = `verifi-${user._id}-${Date.now()}`;

  try {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref,
        amount,
        currency: 'NGN',
        redirect_url: `${process.env.CLIENT_URL}/payment/callback`,
        payment_options: 'card,banktransfer',
        customer: {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        },
        customizations: {
          title: `Verifi ${plan} Plan`,
          description: `Upgrade to ${plan} tier for 30 days`,
          logo: 'https://verifi-five.vercel.app/verifi-logo.png', // Ensure this URL is valid/public
        },
        meta: {
            userId: user._id,
            planType: plan
        }
      },
      {
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Send the link to frontend
    res.json(response.data.data); 
  } catch (error) {
    console.error('Flutterwave Init Error:', error.response?.data || error.message);
    res.status(500);
    throw new Error('Payment initialization failed');
  }
});

// @desc    Verify Payment (Transaction ID)
// @route   POST /api/payment/verify
// @access  Manufacturer
export const verifyPayment = asyncHandler(async (req, res) => {
  const { transaction_id } = req.body; // Flutterwave sends 'transaction_id' (or id) in URL query
  
  if (!transaction_id) {
      res.status(400);
      throw new Error('Transaction ID missing');
  }

  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` },
      }
    );

    const data = response.data.data;

    if (data.status === 'successful' && data.amount >= 0) {
        // Retrieve metadata we sent earlier
        // Note: Flutterwave sometimes returns meta as an array or object depending on version.
        // We should rely on the planType passed or user context if meta is tricky, 
        // but usually data.meta.planType works if sent correctly.
        // A safer fallback is to verify the amount against our PLAN constants.
        
        let planType = 'Starter';
        if (data.amount >= 150000) planType = 'Scale';
        else if (data.amount >= 50000) planType = 'Growth';

        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Update User Plan
        const daysToAdd = 30;
        const newExpiry = new Date();
        newExpiry.setDate(newExpiry.getDate() + daysToAdd);

        user.organizationDetails.plan = planType;
        user.organizationDetails.planExpiresAt = newExpiry;
        user.organizationDetails.paymentReference = String(data.id);
        
        await user.save();

        res.json({ status: 'success', plan: planType, expiresAt: newExpiry });
    } else {
        res.status(400);
        throw new Error('Payment verification failed or declined');
    }

  } catch (error) {
    console.error('Flutterwave Verify Error:', error.response?.data || error.message);
    res.status(500);
    throw new Error('Payment verification error');
  }
});