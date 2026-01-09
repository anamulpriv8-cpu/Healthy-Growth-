
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import DietPlanner from './components/DietPlanner';
import Profile from './components/Profile';
import Login from './components/Login';
import { Tab, UserProfile, FoodItem, ExerciseItem, User } from './types';

const INITIAL_PROFILE: UserProfile = {
  name: '',
  age: 25,
  gender: 'male',
  weight: 70,
  height: 170,
  activityLevel: 'moderate',
  targetWeight: 65
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('hg_session_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [loggedFoods, setLoggedFoods] = useState<FoodItem[]>([]);
  const [loggedExercises, setLoggedExercises] = useState<ExerciseItem[]>([]);
  const [waterLogs, setWaterLogs] = useState<Record<string, number>>({});
  const [apiError, setApiError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hasApiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY;
    if (!hasApiKey) {
      setApiError(true);
    }
  }, []);

  const getUserKey = useCallback((base: string) => currentUser ? `hg_${currentUser.id}_${base}` : `hg_guest_${base}`, [currentUser]);

  // Load user data once when user changes
  useEffect(() => {
    if (currentUser) {
      try {
        const p = localStorage.getItem(getUserKey('profile'));
        const f = localStorage.getItem(getUserKey('foods'));
        const e = localStorage.getItem(getUserKey('exercises'));
        const w = localStorage.getItem(getUserKey('water_logs'));

        setProfile(p ? JSON.parse(p) : { ...INITIAL_PROFILE, name: currentUser.name });
        setLoggedFoods(f ? JSON.parse(f) : []);
        setLoggedExercises(e ? JSON.parse(e) : []);
        setWaterLogs(w ? JSON.parse(w) : {});
      } catch (e) {
        console.error("Data load failed:", e);
      }
      setIsReady(true);
    } else {
      setIsReady(true); // Ready to show login
    }
  }, [currentUser, getUserKey]);

  // Save data on changes
  useEffect(() => {
    if (currentUser && isReady) {
      try {
        localStorage.setItem(getUserKey('profile'), JSON.stringify(profile));
        localStorage.setItem(getUserKey('foods'), JSON.stringify(loggedFoods));
        localStorage.setItem(getUserKey('exercises'), JSON.stringify(loggedExercises));
        localStorage.setItem(getUserKey('water_logs'), JSON.stringify(waterLogs));
      } catch (e) {
        console.error("Data save failed:", e);
      }
    }
  }, [profile, loggedFoods, loggedExercises, waterLogs, currentUser, isReady, getUserKey]);

  const handleLogin = (user: User) => {
    localStorage.setItem('hg_session_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsReady(false); // Trigger reload of data for new user
  };

  const handleLogout = () => {
    localStorage.removeItem('hg_session_user');
    setCurrentUser(null);
    setIsReady(true);
    setActiveTab(Tab.Dashboard);
  };

  const handleUpdateWater = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    setWaterLogs(prev => ({
      ...prev,
      [today]: Math.max(0, (prev[today] || 0) + amount)
    }));
  };

  const getWaterHistory = () => {
    const history = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      history.push({ name: label, amount: waterLogs[dateStr] || 0 });
    }
    return history;
  };

  if (!isReady) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-bold text-xs uppercase tracking-widest">Loading Health Data...</p>
      </div>
    );
  }

  if (!currentUser) return <Login onLogin={handleLogin} />;

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Dashboard:
        return (
          <Dashboard 
            profile={profile} 
            loggedFoods={loggedFoods} 
            loggedExercises={loggedExercises}
            waterIntake={waterLogs[new Date().toISOString().split('T')[0]] || 0}
            waterHistory={getWaterHistory()}
            onDeleteFood={(id) => setLoggedFoods(f => f.filter(x => x.id !== id))}
            onUpdateFood={(food) => setLoggedFoods(f => f.map(x => x.id === food.id ? food : x))}
            onUpdateWater={handleUpdateWater}
            onAddExercise={(ex) => setLoggedExercises(e => [...e, { ...ex, id: Math.random().toString(36).substr(2, 9) }])}
            onDeleteExercise={(id) => setLoggedExercises(e => e.filter(x => x.id !== id))}
          />
        );
      case Tab.Scanner:
        return <Scanner onFoodLogged={(newFoods) => { setLoggedFoods(f => [...f, ...newFoods]); setActiveTab(Tab.Dashboard); }} />;
      case Tab.DietPlan:
        return <DietPlanner profile={profile} />;
      case Tab.Profile:
        return <Profile profile={profile} setProfile={setProfile} onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} userName={currentUser.name}>
      <div className="animate-in fade-in duration-300">
        {apiError && (
          <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 items-center">
            <div className="text-amber-500 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-tight">
              AI features are offline (Check API Configuration)
            </p>
          </div>
        )}
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
