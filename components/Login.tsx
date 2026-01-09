
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const users = JSON.parse(localStorage.getItem('hg_registered_users') || '[]');
    let user = users.find((u: User) => u.email === email);

    if (isSignup) {
      if (user) {
        alert('User already exists! Please login.');
        setIsSignup(false);
        return;
      }
      user = { id: Math.random().toString(36).substr(2, 9), email, name: name || 'User' };
      users.push(user);
      localStorage.setItem('hg_registered_users', JSON.stringify(users));
    } else {
      if (!user) {
        alert('User not found. Please sign up first.');
        setIsSignup(true);
        return;
      }
    }

    onLogin(user);
  };

  const inputClasses = "w-full p-4 bg-gray-50 border-2 border-gray-100 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:bg-white rounded-3xl outline-none transition-all font-semibold shadow-sm";

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-8 animate-in fade-in duration-700">
      <div className="w-full max-w-sm space-y-10">
        <header className="text-center space-y-2">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-emerald-200 mb-6 rotate-3">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Healthy<span className="text-emerald-500">Growth</span>
          </h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Your Personalized Health Journey</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase ml-4">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className={inputClasses}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase ml-4">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className={inputClasses}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-5 bg-emerald-500 text-white rounded-3xl font-black text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-600 active:scale-[0.98] transition-all"
          >
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-gray-500 font-bold text-xs uppercase tracking-wider hover:text-emerald-500 transition-colors"
          >
            {isSignup ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
