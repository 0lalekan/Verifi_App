import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { useUserProfile } from '../hooks/useUserProfile';
import { 
  Search, Plus, Store, Mail, ShoppingBag, Loader2, Building2, MapPin, CheckCircle2, Truck 
} from 'lucide-react';
import { toast } from 'react-toastify';

const MarketplaceScreen = () => {
  const { data: userProfile } = useUserProfile();
  const [view, setView] = useState('browse'); // 'browse', 'directory', 'create'
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  // 1. Fetch Listings
  const { data: listings, isLoading: loadingListings } = useQuery({
    queryKey: ['marketListings', searchTerm, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (category) params.append('category', category);
      return (await api.get(`/market?${params.toString()}`)).data;
    },
    // Only fetch when in 'browse' mode
    enabled: view === 'browse'
  });

  // 2. Fetch Manufacturers/Distributors (Directory)
  const { data: suppliers, isLoading: loadingSuppliers } = useQuery({
    queryKey: ['publicManufacturers'],
    queryFn: async () => (await api.get('/users/directory')).data,
    // Only fetch when in 'directory' mode
    enabled: view === 'directory'
  });

  // Allow Manufacturers and Distributors to post
  const isSeller = ['manufacturer', 'distributor'].includes(userProfile?.role);

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 transition-colors duration-500 pb-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-600/10 text-blue-600 rounded-xl"><Store size={24} /></div>
              <h1 className="text-3xl font-display font-bold text-foreground">Trade Hub</h1>
            </div>
            <p className="text-muted-foreground">Source authentic products directly from verified partners.</p>
          </div>

          <div className="flex gap-2">
            <div className="bg-secondary/50 p-1 rounded-xl flex">
              <button 
                onClick={() => setView('browse')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'browse' ? 'bg-white shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Listings
              </button>
              <button 
                onClick={() => setView('directory')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'directory' ? 'bg-white shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Suppliers
              </button>
            </div>
            
            {isSeller && (
              <button 
                onClick={() => setView(view === 'create' ? 'browse' : 'create')}
                className="px-4 py-2 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
              >
                {view === 'create' ? 'Cancel' : <><Plus size={18} /> Post</>}
              </button>
            )}
          </div>
        </div>

        {/* --- VIEW: CREATE LISTING --- */}
        {view === 'create' && <CreateListingForm onSuccess={() => setView('browse')} />}

        {/* --- VIEW: LISTINGS --- */}
        {view === 'browse' && (
          <>
            {/* Search & Category Filter */}
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
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {['All', 'Pharmaceuticals', 'FMCG', 'Electronics', 'Luxury'].map(cat => (
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

            {/* Listings Grid */}
            {loadingListings ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : !listings || listings.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No active listings found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings?.map(item => (
                  <div key={item._id} className="glass-card p-0 flex flex-col group hover:-translate-y-1 transition-transform duration-300">
                    {/* Image Area */}
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
                    
                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-foreground line-clamp-1">{item.productName}</h3>
                        <span className="text-primary font-extrabold">₦{item.price.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{item.description}</p>
                      
                      <div className="text-xs font-medium text-muted-foreground mb-4 flex items-center gap-2">
                        <Store size={12} /> {item.seller?.organizationDetails?.orgName || 'Verified Seller'}
                      </div>

                      <a 
                        href={`mailto:${item.seller?.email}?subject=Order Inquiry: ${item.productName}&body=I am interested in purchasing ${item.productName} (Min Order: ${item.minOrderQuantity})...`} 
                        className="w-full py-2.5 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <Mail size={16} /> Contact Supplier
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* --- VIEW: SUPPLIER DIRECTORY --- */}
        {view === 'directory' && (
          <>
             <div className="glass-card p-4 mb-8 border-l-4 border-blue-500">
               <h2 className="font-bold text-lg mb-1">Partner Directory</h2>
               <p className="text-sm text-muted-foreground">Connect with verified manufacturers and distributors to initiate new supply agreements.</p>
             </div>

             {loadingSuppliers ? (
               <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={40} /></div>
             ) : !suppliers || suppliers.length === 0 ? (
               <div className="text-center py-20 text-muted-foreground">No verified partners found.</div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {suppliers?.map(partner => (
                   <div key={partner._id} className="glass-card p-6 flex items-start gap-4 group hover:border-primary/30 transition-all">
                     
                     {/* Role Icon */}
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                       partner.role === 'manufacturer' 
                         ? 'bg-blue-500/10 text-blue-600' 
                         : 'bg-purple-500/10 text-purple-600'
                     }`}>
                       {partner.role === 'manufacturer' ? <Building2 size={24} /> : <Truck size={24} />}
                     </div>

                     <div className="flex-1">
                       <div className="flex justify-between items-start">
                         <div>
                           <h3 className="font-bold text-lg text-foreground">{partner.organizationDetails?.orgName || 'Verified Partner'}</h3>
                           
                           {/* Role Badge */}
                           <div className="flex items-center gap-2 mt-1">
                             <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                               partner.role === 'manufacturer'
                                 ? 'bg-blue-500/5 text-blue-600 border-blue-500/20'
                                 : 'bg-purple-500/5 text-purple-600 border-purple-500/20'
                             }`}>
                               {partner.role}
                             </span>
                             <span className="text-[10px] flex items-center gap-1 text-emerald-600 font-bold">
                               <CheckCircle2 size={10} /> Verified
                             </span>
                           </div>
                         </div>
                       </div>

                       <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3 mb-4">
                         <MapPin size={14} /> {partner.organizationDetails?.orgAddress || 'Location Hidden'}
                       </div>

                       <a 
                         href={`mailto:${partner.email}?subject=Partnership Inquiry via Verifi&body=Hello ${partner.organizationDetails?.orgName},%0D%0A%0D%0AWe found your profile on the Verifi Trade Hub and would like to discuss potential collaboration...`}
                         className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline bg-secondary/50 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
                       >
                         <Mail size={14} /> Send Inquiry
                       </a>
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

// --- Internal Component: Create Listing Form ---
const CreateListingForm = ({ onSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ productName: '', description: '', price: '', category: 'FMCG', minOrderQuantity: 1 });
  
  const mutation = useMutation({
    mutationFn: async (data) => await api.post('/market', data),
    onSuccess: () => {
      toast.success('Listing created successfully!');
      queryClient.invalidateQueries(['marketListings']);
      onSuccess(); // Switch back to browse view
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to post listing')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="glass-card p-8 mb-8 animate-in fade-in zoom-in-95 max-w-3xl mx-auto">
      <h3 className="text-xl font-bold mb-6">Create New Listing</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Product Name</label>
            <input 
              required 
              className="w-full p-3 rounded-xl bg-background border border-input outline-none focus:ring-2 focus:ring-primary transition-all" 
              value={formData.productName} 
              onChange={e => setFormData({...formData, productName: e.target.value})} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Price (NGN)</label>
            <input 
              type="number" 
              required 
              className="w-full p-3 rounded-xl bg-background border border-input outline-none focus:ring-2 focus:ring-primary transition-all" 
              value={formData.price} 
              onChange={e => setFormData({...formData, price: e.target.value})} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
             <label className="text-xs font-bold text-muted-foreground uppercase">Category</label>
             <select 
               className="w-full p-3 rounded-xl bg-background border border-input outline-none focus:ring-2 focus:ring-primary transition-all"
               value={formData.category}
               onChange={e => setFormData({...formData, category: e.target.value})}
             >
               {['Pharmaceuticals', 'FMCG', 'Electronics', 'Luxury', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
             </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Min Order Qty</label>
            <input 
              type="number" 
              required 
              className="w-full p-3 rounded-xl bg-background border border-input outline-none focus:ring-2 focus:ring-primary transition-all" 
              value={formData.minOrderQuantity} 
              onChange={e => setFormData({...formData, minOrderQuantity: e.target.value})} 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Description</label>
          <textarea 
            required 
            className="w-full p-3 rounded-xl bg-background border border-input outline-none focus:ring-2 focus:ring-primary transition-all resize-none" 
            rows="4" 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button" 
            onClick={onSuccess} 
            className="px-6 py-3 font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={mutation.isPending} 
            className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            Post Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default MarketplaceScreen;