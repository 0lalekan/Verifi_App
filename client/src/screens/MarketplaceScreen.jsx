import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { useUserProfile } from '../hooks/useUserProfile';
import { 
  Search, Filter, Plus, Store, Mail, Tag, ShoppingBag, Loader2 
} from 'lucide-react';
import { toast } from 'react-toastify';

const MarketplaceScreen = () => {
  const { data: userProfile } = useUserProfile();
  const [view, setView] = useState('browse'); // 'browse' or 'create'
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  // Fetch Listings
  const { data: listings, isLoading } = useQuery({
    queryKey: ['marketListings', searchTerm, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (category) params.append('category', category);
      return (await api.get(`/market?${params.toString()}`)).data;
    }
  });

  const isSeller = ['manufacturer', 'distributor'].includes(userProfile?.role);

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 transition-colors duration-500 pb-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-600/10 text-blue-600 rounded-xl"><Store size={24} /></div>
              <h1 className="text-3xl font-display font-bold text-foreground">Trade Hub</h1>
            </div>
            <p className="text-muted-foreground">Direct access to verified manufacturers and suppliers.</p>
          </div>

          {isSeller && (
            <button 
              onClick={() => setView(view === 'browse' ? 'create' : 'browse')}
              className="px-6 py-3 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
            >
              {view === 'browse' ? <><Plus size={18} /> Post Listing</> : 'Back to Browse'}
            </button>
          )}
        </div>

        {/* CREATE FORM */}
        {view === 'create' && <CreateListingForm onSuccess={() => setView('browse')} />}

        {/* BROWSE VIEW */}
        {view === 'browse' && (
          <>
            {/* Filters */}
            <div className="glass-card p-4 mb-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 border border-input outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                {['All', 'Pharmaceuticals', 'FMCG', 'Electronics'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat === 'All' ? '' : cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                      (cat === 'All' && !category) || category === cat 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : listings?.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No active listings found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(item => (
                  <div key={item._id} className="glass-card p-0 flex flex-col group hover:-translate-y-1 transition-transform duration-300">
                    <div className="h-48 bg-secondary relative overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ShoppingBag size={48} opacity={0.2} /></div>
                      )}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                        {item.category}
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-foreground line-clamp-1">{item.productName}</h3>
                        <span className="text-primary font-extrabold">₦{item.price.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{item.description}</p>
                      
                      <div className="text-xs font-medium text-muted-foreground mb-4 flex items-center gap-2">
                        <Store size={12} /> {item.seller?.organizationDetails?.orgName || 'Verified Seller'}
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <a 
                          href={`mailto:${item.seller?.email}?subject=Order Inquiry: ${item.productName}&body=I am interested in purchasing ${item.productName}...`}
                          className="flex-1 py-2.5 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <Mail size={16} /> Contact Supplier
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Simple Create Component (Internal)
const CreateListingForm = ({ onSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ productName: '', description: '', price: '', category: 'FMCG', minOrderQuantity: 1 });
  
  const mutation = useMutation({
    mutationFn: async (data) => await api.post('/market', data),
    onSuccess: () => {
      toast.success('Listing created!');
      queryClient.invalidateQueries(['marketListings']);
      onSuccess();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="glass-card p-8 mb-8 animate-in fade-in zoom-in-95">
      <h3 className="text-xl font-bold mb-6">New Listing</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Product Name" required className="p-3 rounded-xl bg-background border border-input outline-none focus:ring-2 focus:ring-primary" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} />
          <input type="number" placeholder="Price (NGN)" required className="p-3 rounded-xl bg-background border border-input outline-none focus:ring-2 focus:ring-primary" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
        </div>
        <textarea placeholder="Description" required className="w-full p-3 rounded-xl bg-background border border-input outline-none focus:ring-2 focus:ring-primary" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onSuccess} className="px-6 py-3 font-bold text-muted-foreground">Cancel</button>
          <button type="submit" disabled={mutation.isPending} className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl">{mutation.isPending ? 'Posting...' : 'Post Item'}</button>
        </div>
      </form>
    </div>
  );
};

export default MarketplaceScreen;