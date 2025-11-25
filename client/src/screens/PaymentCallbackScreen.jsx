import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { Loader2, XCircle, CheckCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const PaymentCallbackScreen = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('Verifying Payment...');
  const [icon, setIcon] = useState(<Loader2 size={48} className="animate-spin text-primary mx-auto mb-4" />);
  
  // Flutterwave sends 'transaction_id' and 'status'
  const transactionId = searchParams.get('transaction_id');
  const status = searchParams.get('status');

  useEffect(() => {
    if (status === 'successful' && transactionId) {
      verifyTransaction(transactionId);
    } 
    else if (status === 'cancelled' || status === 'failed') {
      handleFailure();
    }
  }, [status, transactionId]);

  const handleFailure = () => {
    setMessage('Payment Cancelled');
    setIcon(<XCircle size={48} className="text-red-500 mx-auto mb-4" />);
    toast.error('Payment was cancelled.');
    // Give user a moment to see the status before redirecting
    setTimeout(() => navigate('/subscription'), 2000);
  };

  const verifyTransaction = async (id) => {
    try {
      await api.post('/payment/verify', { transaction_id: id });
      
      setMessage('Payment Successful!');
      setIcon(<CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />);
      toast.success('Plan upgraded successfully.');
      
      // Force refresh user profile to update UI
      await queryClient.invalidateQueries(['userProfile']);
      
      setTimeout(() => navigate('/manufacturer/portal'), 2000);
    } catch (error) {
      setMessage('Verification Failed');
      setIcon(<XCircle size={48} className="text-red-500 mx-auto mb-4" />);
      toast.error('Payment verification failed.');
      setTimeout(() => navigate('/subscription'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="glass-card p-10 text-center rounded-[2rem] border border-border max-w-sm w-full">
        {icon}
        <h2 className="text-xl font-display font-bold text-foreground">{message}</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {status === 'successful' ? 'Finalizing your upgrade...' : 'Redirecting you back...'}
        </p>
      </div>
    </div>
  );
};

export default PaymentCallbackScreen;