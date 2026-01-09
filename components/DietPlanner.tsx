
import React, { useState, useEffect } from 'react';
import { generateDietPlan } from '../services/geminiService';
import { UserProfile, DietPlan } from '../types';

interface DietPlannerProps {
  profile: UserProfile;
}

const DietPlanner: React.FC<DietPlannerProps> = ({ profile }) => {
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const data = await generateDietPlan(profile);
      setPlan(data);
    } catch (error) {
      console.error(error);
      alert('Problem generating diet plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!plan && profile.weight > 0) {
      fetchPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Diet Plan</h2>
        <button 
          onClick={fetchPlan}
          className="text-emerald-600 text-sm font-semibold flex items-center gap-1"
          disabled={loading}
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Creating your custom diet chart...</p>
        </div>
      )}

      {!loading && plan && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-3xl shadow-lg">
            <p className="text-sm opacity-80 uppercase tracking-wider mb-1">Recommended Daily Calories</p>
            <p className="text-4xl font-black">{plan.dailyCalories} kcal</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-700">Daily Routine:</h3>
            {plan.meals.map((meal, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                <div className="bg-emerald-50 p-3 rounded-xl h-fit">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800">{meal.label}</h4>
                      <p className="text-xs text-gray-400">{meal.time}</p>
                    </div>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                      ~{meal.approxCalories} cal
                    </span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {meal.suggestions.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100">
            <h3 className="font-bold text-lg text-yellow-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Important Tips:
            </h3>
            <ul className="space-y-2 text-sm text-yellow-900 opacity-80">
              {plan.advice.map((a, i) => (
                <li key={i} className="flex gap-2">
                  <span>•</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietPlanner;
