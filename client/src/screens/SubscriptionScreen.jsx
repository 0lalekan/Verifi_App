import React from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Loader2, ArrowLeft } from 'lucide-react';

const PlanCard = ({ title, price, features, current, onSubscribe, recommended, color, isProcessing }) => (
  <div className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col !overflow-visible ${
    current 
      ? 'bg-emerald-500/5 border-emerald-500 ring-1 ring-emerald-500/50' 
      : 'glass-card hover:border-primary/50'
  } ${recommended ? 'md:scale-105 shadow-xl z-10' : ''}`}>
    
    {/* "Current Plan" Badge - Inside Card */}
    {current && (
      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
        Current Plan
      </div>
    )}

    {/* "Best Value" Badge - Floating Outside Card (Now Visible) */}
    {recommended && !current && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg whitespace-nowrap z-20">
        Best Value
      </div>
    )}

    <div className="mb-6">
      <h3 className={`text-lg font-bold uppercase tracking-wider mb-2 ${color}`}>{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-display font-extrabold text-foreground">{price}</span>
        {price !== 'Free' && <span className="text-muted-foreground text-sm font-medium">/mo</span>}
      </div>
    </div>

    <ul className="space-y-4 mb-8 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
          <Check size={16} className={`shrink-0 mt-0.5 ${color}`} />
          <span>{f}</span>
        </li>
      ))}
    </ul>

    <button
      onClick={onSubscribe}
      disabled={current || isProcessing}
      className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
        current
          ? 'bg-emerald-500 text-white opacity-100 cursor-default'
          : recommended
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
            : 'bg-secondary hover:bg-secondary/80 text-foreground'
      }`}
    >
      {isProcessing ? <Loader2 className="animate-spin" /> : current ? (
        <> <Check size={18} /> Active </>
      ) : (
        <> <CreditCard size={18} /> Upgrade </>
      )}
    </button>
  </div>
);

const SubscriptionScreen = () => {
  const navigate = useNavigate();
  const { data: userProfile } = useUserProfile();
  const currentPlan = userProfile?.organizationDetails?.plan || 'Starter';

  const mutation = useMutation({
    mutationFn: async (plan) => (await api.post('/payment/initialize', { plan })).data,
    onSuccess: (data) => {
      // Redirect to Flutterwave Standard Checkout
      if (data.link) {
          window.location.href = data.link;
      } else {
          toast.error("Payment link not generated");
      }
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Payment init failed')
  });

  const handleUpgrade = (plan) => {
    mutation.mutate(plan);
  };

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-6xl mx-auto pt-6 pb-20">
        
        <button 
          onClick={() => navigate('/manufacturer/portal')} 
          className="mb-8 flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Portal
        </button>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-display font-extrabold text-foreground mb-4">Upgrade your Capacity</h1>
          <p className="text-muted-foreground">
            Scale your production verification with higher limits and advanced brand protection tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mt-8">
          
          <PlanCard 
            title="Starter" 
            price="Free"
            color="text-slate-500"
            current={currentPlan === 'Starter'}
            onSubscribe={() => {}}
            features={[
              "5 Batches / month (Trial)",
              "Max 500 items/batch",
              "Basic Reporting",
              "Manual Entry Only"
            ]}
          />

          <PlanCard 
            title="Growth" 
            price="₦50,000"
            color="text-blue-500"
            recommended={true}
            current={currentPlan === 'Growth'}
            isProcessing={mutation.isPending && mutation.variables === 'Growth'}
            onSubscribe={() => handleUpgrade('Growth')}
            features={[
              "100 Batches / month",
              "Max 10,000 items/batch",
              "Bulk CSV Upload",
              "Real-time Fraud Alerts",
              "Email Support"
            ]}
          />

          <PlanCard 
            title="Scale" 
            price="₦150,000"
            color="text-purple-500"
            current={currentPlan === 'Scale'}
            isProcessing={mutation.isPending && mutation.variables === 'Scale'}
            onSubscribe={() => handleUpgrade('Scale')}
            features={[
              "Unlimited Batches",
              "Unlimited Items",
              "Advanced Analytics & Heatmaps",
              "Dedicated Account Manager",
              "API Access"
            ]}
          />

        </div>
      </div>
    </div>
  );
};

export default SubscriptionScreen;