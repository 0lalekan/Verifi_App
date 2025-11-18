import React from 'react';
import { useUserProfile } from '../hooks/useUserProfile';

const ProfileScreen = () => {
  const { data: userProfile, isLoading, error } = useUserProfile();

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-600">Error loading profile: {error.message}</div>;

  if (!userProfile) return <div>No user profile found.</div>;

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-slate-800 text-white text-center py-6">
        <h2 className="text-2xl font-bold">User Profile</h2>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <p className="mt-1 text-lg text-slate-900">{userProfile.firstName} {userProfile.lastName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <p className="mt-1 text-lg text-slate-900">{userProfile.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Role</label>
          <p className="mt-1 text-lg text-slate-900">{userProfile.role}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Points Total</label>
          <p className="mt-1 text-lg text-slate-900">{userProfile.points}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
