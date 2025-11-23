import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { toast } from 'react-toastify';
import { useUserProfile } from '../hooks/useUserProfile';
import useAuthStore from '../store';
import { 
  User, 
  Mail, 
  Building2, 
  MapPin, 
  FileBadge, 
  Camera, 
  Save, 
  Loader2,
  ShieldCheck,
  LogOut,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const ProfileScreen = () => {
  const { setCredentials, logout } = useAuthStore();
  
  // 1. Destructure error and refetch from the hook
  const { data: userProfile, isLoading, error, refetch } = useUserProfile();
  
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'consumer',
    password: '',
    confirmPassword: '',
    orgName: '',
    orgAddress: '',
    orgLicense: ''
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        role: userProfile.role || 'consumer',
        orgName: userProfile.organizationDetails?.orgName || '',
        orgAddress: userProfile.organizationDetails?.orgAddress || '',
        orgLicense: userProfile.organizationDetails?.orgLicense || ''
      }));
    }
  }, [userProfile]);

  const mutation = useMutation({
    mutationFn: async (data) => (await api.put('/users/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })).data,
    onSuccess: (data) => {
      setCredentials(data);
      queryClient.invalidateQueries(['userProfile']);
      setIsEditing(false);
      toast.success('Profile updated successfully');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed')
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const submitData = new FormData();
    submitData.append('firstName', formData.firstName);
    submitData.append('lastName', formData.lastName);
    submitData.append('email', formData.email);
    submitData.append('role', formData.role); 
    
    if (formData.password) submitData.append('password', formData.password);
    if (uploadFile) submitData.append('profileImage', uploadFile);

    if (formData.role === 'manufacturer') {
      const orgData = {
        orgName: formData.orgName,
        orgAddress: formData.orgAddress,
        orgLicense: formData.orgLicense
      };
      submitData.append('organizationDetails', JSON.stringify(orgData));
    }

    mutation.mutate(submitData);
  };

  // 2. Error Handling UI
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="glass-card p-8 text-center max-w-md border-red-500/20 bg-red-500/5">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="font-bold text-xl text-foreground mb-2">Unable to load profile</h3>
          <p className="text-sm text-muted-foreground mb-6">
            {error?.response?.data?.message || error.message || "We couldn't connect to the server. Please try again."}
          </p>
          <button 
            onClick={() => refetch()}
            className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all"
          >
            <RefreshCw size={18} /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground gap-4">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="font-medium">Loading Profile...</p>
      </div>
    );
  }

  const isManufacturer = formData.role === 'manufacturer';
  const serverImageUrl = userProfile?.profileImage || null;

  return (
    <div className="min-h-screen w-full bg-background bg-gradient-mesh dark:bg-gradient-mesh-dark p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-4xl mx-auto pt-6 pb-20">
        
        {/* Profile Header Card */}
        <div className="glass rounded-[2.5rem] p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
          
          {/* Avatar */}
          <div className="relative group shrink-0">
            <div className="w-32 h-32 rounded-full border-4 border-background shadow-2xl overflow-hidden bg-secondary flex items-center justify-center">
              {previewImage || serverImageUrl ? (
                <img src={previewImage || serverImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-muted-foreground/50" />
              )}
            </div>
            {isEditing && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <Camera size={18} />
              </button>
            )}
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
          </div>

          {/* Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-display font-bold text-foreground">
              {userProfile?.firstName} {userProfile?.lastName}
            </h1>
            <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
              <Mail size={14} /> {userProfile?.email}
            </p>
            
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
              <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider">
                {userProfile?.role}
              </span>
              {userProfile?.organizationDetails?.isVerified && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-emerald-500/20">
                  <ShieldCheck size={14} /> Verified
                </span>
              )}
            </div>
          </div>

          {/* Edit Toggle */}
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isEditing 
                  ? 'bg-secondary text-muted-foreground hover:text-foreground' 
                  : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90'
              }`}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            {!isEditing && (
              <button onClick={logout} className="px-6 py-2.5 rounded-xl font-bold text-sm text-destructive hover:bg-destructive/10 transition-all flex items-center justify-center gap-2">
                <LogOut size={16} /> Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Personal Info */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <User size={20} className="text-primary" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:ring-2 focus:ring-primary disabled:opacity-60 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:ring-2 focus:ring-primary disabled:opacity-60 transition-all outline-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <input 
                  type="email" 
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:ring-2 focus:ring-primary disabled:opacity-60 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Organization Info (Manufacturer Only) */}
          {isManufacturer && (
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Building2 size={20} className="text-primary" /> Organization Details
              </h2>
              
              {!userProfile?.organizationDetails?.isVerified && (
                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm flex gap-3">
                  <ShieldCheck className="shrink-0" />
                  <p><strong>Verification Required:</strong> Accurate details are required for regulator approval. Changing these fields may re-trigger verification.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={formData.orgName}
                    onChange={e => setFormData({...formData, orgName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:ring-2 focus:ring-primary disabled:opacity-60 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">License / RC Number</label>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={formData.orgLicense}
                    onChange={e => setFormData({...formData, orgLicense: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:ring-2 focus:ring-primary disabled:opacity-60 outline-none"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Headquarters Address</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={formData.orgAddress}
                      onChange={e => setFormData({...formData, orgAddress: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 border border-input focus:ring-2 focus:ring-primary disabled:opacity-60 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password Reset (Optional) */}
          {isEditing && (
            <div className="glass-card p-8 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <FileBadge size={20} className="text-primary" /> Security
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="password" 
                  placeholder="New Password (leave blank to keep)"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:ring-2 focus:ring-primary outline-none"
                />
                <input 
                  type="password" 
                  placeholder="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={mutation.isPending}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-xl shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {mutation.isPending ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                Save Changes
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default ProfileScreen;