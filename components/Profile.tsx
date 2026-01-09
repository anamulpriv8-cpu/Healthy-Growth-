
import React, { useState, useEffect } from 'react';
import { UserProfile, User } from '../types';

interface ProfileProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, setProfile, onLogout }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Fetch all registered users from local storage
    const users = JSON.parse(localStorage.getItem('hg_registered_users') || '[]');
    setAllUsers(users);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: name === 'age' || name === 'weight' || name === 'height' || name === 'targetWeight' ? Number(value) : value
    });
  };

  const inputClass = "w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold";
  const labelClass = "block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-2";

  return (
    <div className="p-6 space-y-10 animate-in fade-in duration-500 pb-32">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-gray-800">My Profile</h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Personalized Settings</p>
        </div>
        <button 
          onClick={onLogout}
          className="p-3 bg-red-50 text-red-500 rounded-2xl border border-red-100 active:scale-95 transition-all"
          title="Logout"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </header>
      
      <div className="space-y-6">
        <div>
          <label className={labelClass}>Display Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="Your name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Age</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={profile.weight}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={profile.height}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Target Weight (kg)</label>
          <input
            type="number"
            name="targetWeight"
            value={profile.targetWeight}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Activity Level</label>
          <select
            name="activityLevel"
            value={profile.activityLevel}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="sedentary">Sedentary (Little/No Exercise)</option>
            <option value="moderate">Moderate (Exercise 3-5 days/wk)</option>
            <option value="active">Active (Heavy Exercise daily)</option>
          </select>
        </div>
      </div>

      <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex items-start gap-4">
        <div className="bg-white p-2 rounded-xl text-emerald-500 shadow-sm shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-xs font-bold text-emerald-800/70 leading-relaxed">
          Your data is saved locally for this account. Logging out and switching accounts will load separate progress.
        </p>
      </div>

      {/* Admin Toggle & Panel */}
      <div className="pt-10 border-t border-gray-100">
        <button 
          onClick={() => setShowAdmin(!showAdmin)}
          className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-emerald-500 transition-colors"
        >
          {showAdmin ? 'Hide Admin Panel' : 'Access Admin Panel'}
        </button>

        {showAdmin && (
          <div className="mt-6 bg-gray-900 rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-black text-lg">Local User Database</h3>
              <span className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-full font-black uppercase">
                {allUsers.length} Users
              </span>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {allUsers.length === 0 ? (
                <p className="text-gray-500 text-sm font-bold text-center py-4">No users found in local storage.</p>
              ) : (
                allUsers.map((u) => (
                  <div key={u.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                    <p className="text-emerald-400 font-black text-sm">{u.name}</p>
                    <p className="text-gray-400 font-bold text-xs mt-1">{u.email}</p>
                    <div className="mt-2 flex gap-2">
                       <span className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">ID: {u.id}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onLogout}
        className="w-full py-5 bg-gray-100 text-gray-500 rounded-3xl font-black text-sm active:scale-95 transition-all mt-4"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Profile;
