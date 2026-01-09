
import React from 'react';
import { Tab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  userName?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userName }) => {
  const navItems = [
    { id: Tab.Dashboard, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Home' },
    { id: Tab.Scanner, icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z', label: 'Scan' },
    { id: Tab.DietPlan, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', label: 'Plan' },
    { id: Tab.Profile, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Me' },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#FDFDFD] max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      {/* Dynamic Header */}
      <header className="px-6 pt-8 pb-4 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
              {userName ? `Hi, ${userName}` : 'Health Companion'}
            </p>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-1">
              Healthy<span className="text-emerald-500">Growth</span>
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200 overflow-hidden">
            {userName ? (
              <span className="font-black text-sm uppercase">{userName.charAt(0)}</span>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-28">
        {children}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-0 right-0 max-w-[calc(100%-3rem)] mx-auto z-50">
        <nav className="bg-gray-900/95 backdrop-blur-md rounded-3xl flex justify-around p-3 shadow-2xl ring-1 ring-white/10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 ${
                activeTab === item.id ? 'text-emerald-400' : 'text-gray-500'
              }`}
            >
              <svg className={`w-6 h-6 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {activeTab === item.id && (
                <span className="absolute -bottom-1 w-1 h-1 bg-emerald-400 rounded-full"></span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
