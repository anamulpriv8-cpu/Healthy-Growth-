
import React, { useState, useEffect, useRef } from 'react';
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
    const saved = localStorage.getItem('hg_session_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [loggedFoods, setLoggedFoods] = useState<FoodItem[]>([]);
  const [loggedExercises, setLoggedExercises] = useState<ExerciseItem[]>([]);
  const [waterLogs, setWaterLogs] = useState<Record<string, number>>({});

  // Utility to get user-specific storage keys
  const getUserKey = (base: string) => currentUser ? `hg_${currentUser.id}_${base}` : `hg_guest_${base}`;

  // 1. Load data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setIsDataLoaded(false); // Reset loading state for new user
      
      const p = localStorage.getItem(getUserKey('profile'));
      const f = localStorage.getItem(getUserKey('foods'));
      const e = localStorage.getItem(getUserKey('exercises'));
      const w = localStorage.getItem(getUserKey('water_logs'));

      setProfile(p ? JSON.parse(p) : { ...INITIAL_PROFILE, name: currentUser.name });
      setLoggedFoods(f ? JSON.parse(f) : []);
      setLoggedExercises(e ? JSON.parse(e) : []);
      setWaterLogs(w ? JSON.parse(w) : {});
      
      // Mark as loaded so we can start saving updates
      setIsDataLoaded(true);
      
      // Ensure session is synced
      localStorage.setItem('hg_session_user', JSON.stringify(currentUser));
    } else {
      setIsDataLoaded(false);
    }
  }, [currentUser?.id]);

  // 2. Persist data only after it's been loaded
  useEffect(() => {
    if (currentUser && isDataLoaded) {
      localStorage.setItem(getUserKey('profile'), JSON.stringify(profile));
    }
  }, [profile, currentUser, isDataLoaded]);

  useEffect(() => {
    if (currentUser && isDataLoaded) {
      localStorage.setItem(getUserKey('foods'), JSON.stringify(loggedFoods));
    }
  }, [loggedFoods, currentUser, isDataLoaded]);

  useEffect(() => {
    if (currentUser && isDataLoaded) {
      localStorage.setItem(getUserKey('exercises'), JSON.stringify(loggedExercises));
    }
  }, [loggedExercises, currentUser, isDataLoaded]);

  useEffect(() => {
    if (currentUser && isDataLoaded) {
      localStorage.setItem(getUserKey('water_logs'), JSON.stringify(waterLogs));
    }
  }, [waterLogs, currentUser, isDataLoaded]);

  const handleLogin = (user: User) => {
    localStorage.setItem('hg_session_user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('hg_session_user');
    setCurrentUser(null);
    setIsDataLoaded(false);
    setActiveTab(Tab.Dashboard);
  };

  const handleFoodLogged = (newFoods: FoodItem[]) => {
    setLoggedFoods(prev => [...prev, ...newFoods]);
    setActiveTab(Tab.Dashboard);
  };

  const handleDeleteFood = (id: string) => {
    setLoggedFoods(prev => prev.filter(f => f.id !== id));
  };

  const handleUpdateFood = (updatedFood: FoodItem) => {
    setLoggedFoods(prev => prev.map(f => f.id === updatedFood.id ? updatedFood : f));
  };

  const handleUpdateWater = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    setWaterLogs(prev => ({
      ...prev,
      [today]: Math.max(0, (prev[today] || 0) + amount)
    }));
  };

  const handleAddExercise = (ex: Omit<ExerciseItem, 'id'>) => {
    const newEx = { ...ex, id: Math.random().toString(36).substr(2, 9) };
    setLoggedExercises(prev => [...prev, newEx]);
  };

  const handleDeleteExercise = (id: string) => {
    setLoggedExercises(prev => prev.filter(e => e.id !== id));
  };

  const getWaterHistory = () => {
    const history = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      history.push({
        name: label,
        amount: waterLogs[dateStr] || 0
      });
    }
    return history;
  };

  const today = new Date().toISOString().split('T')[0];
  const waterIntakeToday = waterLogs[today] || 0;

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (!isDataLoaded) {
      return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading your workspace...</p>
        </div>
      );
    }

    switch (activeTab) {
      case Tab.Dashboard:
        return (
          <Dashboard 
            profile={profile} 
            loggedFoods={loggedFoods} 
            loggedExercises={loggedExercises}
            waterIntake={waterIntakeToday}
            waterHistory={getWaterHistory()}
            onDeleteFood={handleDeleteFood}
            onUpdateFood={handleUpdateFood}
            onUpdateWater={handleUpdateWater}
            onAddExercise={handleAddExercise}
            onDeleteExercise={handleDeleteExercise}
          />
        );
      case Tab.Scanner:
        return <Scanner onFoodLogged={handleFoodLogged} />;
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
      {renderContent()}
    </Layout>
  );
};

export default App;
