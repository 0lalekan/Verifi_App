import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { toast } from 'react-toastify';
import { useUserProfile } from '../hooks/useUserProfile';
import useAuthStore from '../store';

const ProfileScreen = () => {
  const { setCredentials } = useAuthStore();
  const { data: userProfile, isLoading } = useUserProfile();
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
    mutationFn: async (data) => {
      const response = await api.put('/users/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;

  const isManufacturer = formData.role === 'manufacturer';
  
  // --- FIX IS HERE ---
  // Renamed 'profileImg' to 'serverImageUrl' to match usage in the return statement
  const serverImageUrl = userProfile?.profileImage || null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="h-32 bg-slate-900 relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>
          
          <div className="px-8 pb-8 relative flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="relative -mt-12">
              <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-lg overflow-hidden flex items-center justify-center bg-slate-100">
                {previewImage || serverImageUrl ? (
                  <img 
                    src={previewImage || serverImageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                  type="button"
                >
                  📷
                </button>
              )}
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">{userProfile?.firstName} {userProfile?.lastName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-bold uppercase tracking-wider text-slate-500">
                  {userProfile?.role}
                </span>
                {userProfile?.organizationDetails?.isVerified && (
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold uppercase tracking-wider">
                    Verified ✅
                  </span>
                )}
              </div>
            </div>

            <button 
              onClick={() => setIsEditing(!isEditing)}
              type="button"
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${isEditing ? 'bg-slate-100 text-slate-700' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'}`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span>📝</span> Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
              <input 
                type="text" 
                disabled={!isEditing}
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
              <input 
                type="text" 
                disabled={!isEditing}
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 transition-all"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              disabled={!isEditing}
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 transition-all"
            />
          </div>

          <div className="border-t border-slate-100 pt-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>🏢</span> Account Type
            </h2>
            
            <div className="mb-6">
              <select 
                disabled={!isEditing}
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 transition-all cursor-pointer"
              >
                <option value="consumer">Consumer</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="regulator">Regulator</option>
              </select>
            </div>

            {isManufacturer && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                 {!userProfile?.organizationDetails?.isVerified && (
                   <div className="flex items-start gap-3 text-amber-700 bg-amber-50 px-4 py-3 rounded-xl border border-amber-100 mb-4">
                      <span className="text-xl">⚠️</span>
                      <p className="text-sm leading-relaxed">
                        <strong>Verification Required:</strong> Complete your details below. You cannot create batches until verified.
                      </p>
                   </div>
                 )}
                 
                 <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Organization Name</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={formData.orgName}
                          onChange={e => setFormData({...formData, orgName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">License / RC Number</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={formData.orgLicense}
                          onChange={e => setFormData({...formData, orgLicense: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Headquarters Address</label>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={formData.orgAddress}
                      onChange={e => setFormData({...formData, orgAddress: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500"
                    />
                 </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span>🔒</span> Security
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                  <input 
                    type="password" 
                    disabled={!isEditing}
                    placeholder="Leave blank to keep current"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 transition-all"
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
                  <input 
                    type="password" 
                    disabled={!isEditing}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 transition-all"
                  />
               </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end pt-8 mt-8 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 mr-4 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={mutation.isPending}
                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {mutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileScreen;