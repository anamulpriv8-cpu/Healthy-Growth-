
import React, { useState } from 'react';
import { UserProfile, FoodItem, ExerciseItem } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
  profile: UserProfile;
  loggedFoods: FoodItem[];
  loggedExercises: ExerciseItem[];
  waterIntake: number; // in ml
  waterHistory: { name: string, amount: number }[];
  onDeleteFood: (id: string) => void;
  onUpdateFood: (food: FoodItem) => void;
  onUpdateWater: (amount: number) => void;
  onAddExercise: (exercise: Omit<ExerciseItem, 'id'>) => void;
  onDeleteExercise: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  profile, 
  loggedFoods, 
  loggedExercises,
  waterIntake,
  waterHistory,
  onDeleteFood, 
  onUpdateFood, 
  onUpdateWater,
  onAddExercise,
  onDeleteExercise
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FoodItem | null>(null);
  const [exerciseType, setExerciseType] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState('');
  const [exerciseCalories, setExerciseCalories] = useState('');

  const totalCaloriesIn = loggedFoods.reduce((acc, food) => acc + food.calories, 0);
  const totalCaloriesOut = loggedExercises.reduce((acc, ex) => acc + ex.caloriesBurned, 0);
  const targetCalories = 2000;
  const netCalories = totalCaloriesIn - totalCaloriesOut;
  const waterGoal = 2500; // ml

  const macroData = [
    { name: 'Protein', value: loggedFoods.reduce((acc, f) => acc + (f.protein || 0), 0), color: '#6366F1' },
    { name: 'Carbs', value: loggedFoods.reduce((acc, f) => acc + (f.carbs || 0), 0), color: '#F59E0B' },
    { name: 'Fats', value: loggedFoods.reduce((acc, f) => acc + (f.fats || 0), 0), color: '#EC4899' },
  ];

  const calProgress = Math.min((totalCaloriesIn / targetCalories) * 100, 100);
  const waterProgress = Math.min((waterIntake / waterGoal) * 100, 100);

  const startEditing = (food: FoodItem) => {
    setEditingId(food.id);
    setEditForm({ ...food });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editForm) return;
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === 'name' || name === 'portion' ? value : Number(value)
    });
  };

  const saveEdit = () => {
    if (editForm) {
      onUpdateFood(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleLogExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseType || !exerciseDuration || !exerciseCalories) return;
    onAddExercise({
      type: exerciseType,
      duration: Number(exerciseDuration),
      caloriesBurned: Number(exerciseCalories)
    });
    setExerciseType('');
    setExerciseDuration('');
    setExerciseCalories('');
  };

  const dashboardInputClass = "w-full px-4 py-3 text-sm bg-white border border-gray-200 text-gray-900 rounded-2xl focus:ring-2 focus:ring-emerald-400 outline-none font-medium";

  return (
    <div className="p-5 space-y-8 animate-in fade-in duration-500">
      {/* Welcome Greeting */}
      <section>
        <h2 className="text-gray-800 text-3xl font-black leading-tight">
          Welcome back,<br />
          <span className="text-emerald-500">{profile.name || 'Champion'}</span> 👋
        </h2>
      </section>

      {/* Main Energy Score Card */}
      <section className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-[2.5rem] p-7 text-white shadow-xl shadow-emerald-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-white/70 text-sm font-bold uppercase tracking-wider">Net Calories</p>
            <h3 className="text-5xl font-black mt-1">{netCalories}</h3>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-2xl border border-white/30">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.334-.398-1.817a1 1 0 00-1.487-.876 7.998 7.998 0 00-4.451 7.7 5.999 5.999 0 0011.724 2.29c.473-1.2.523-2.522.508-3.32-.014-.765-.052-1.374-.115-1.766-.07-.432-.143-.624-.183-.683A1 1 0 0012.395 2.553z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-1000" 
              style={{ width: `${calProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/80">
            <span>{totalCaloriesIn} kcal in</span>
            <span>{targetCalories} Target</span>
          </div>
        </div>
      </section>

      {/* Grid Stats */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase">Weight</p>
          <p className="text-xl font-black text-gray-800">{profile.weight} kg</p>
        </div>
        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase">Burned</p>
          <p className="text-xl font-black text-gray-800">{totalCaloriesOut} kcal</p>
        </div>
      </section>

      {/* Water Intake */}
      <section className="bg-white rounded-[2.5rem] p-7 border border-gray-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-gray-800">Hydration</h3>
          <span className="text-blue-500 font-black">{(waterIntake/1000).toFixed(1)}L</span>
        </div>
        
        <div className="flex justify-around items-end h-32 gap-3">
          {waterHistory.map((day, idx) => {
            const h = Math.min((day.amount / waterGoal) * 100, 100);
            return (
              <div key={idx} className="flex flex-col items-center flex-1 gap-2">
                <div className="w-full bg-blue-50 rounded-t-xl relative overflow-hidden flex flex-col justify-end" style={{ height: '100px' }}>
                  <div 
                    className="bg-blue-400 w-full transition-all duration-500 rounded-t-xl" 
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{day.name}</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => onUpdateWater(250)}
            className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            +250ml
          </button>
          <button 
            onClick={() => onUpdateWater(500)}
            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-200 active:scale-95 transition-all"
          >
            +500ml
          </button>
        </div>
      </section>

      {/* Exercise Section */}
      <section className="bg-white rounded-[2.5rem] p-7 border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
          Activity Tracker
        </h3>
        
        <form onSubmit={handleLogExercise} className="space-y-3 bg-gray-50/50 p-4 rounded-3xl">
          <input
            type="text"
            placeholder="What activity did you do?"
            className={dashboardInputClass}
            value={exerciseType}
            onChange={(e) => setExerciseType(e.target.value)}
          />
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Min"
              className={dashboardInputClass}
              value={exerciseDuration}
              onChange={(e) => setExerciseDuration(e.target.value)}
            />
            <input
              type="number"
              placeholder="Calories"
              className={dashboardInputClass}
              value={exerciseCalories}
              onChange={(e) => setExerciseCalories(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl text-sm active:scale-95 transition-all"
          >
            Log Activity
          </button>
        </form>

        <div className="space-y-3">
          {loggedExercises.slice(0, 3).map((ex) => (
            <div key={ex.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-bold text-gray-800">{ex.type}</p>
                <p className="text-xs text-gray-400 font-bold uppercase">{ex.duration} min • {ex.caloriesBurned} kcal</p>
              </div>
              <button onClick={() => onDeleteExercise(ex.id)} className="text-red-400 p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Macros */}
      <section className="bg-white rounded-[2.5rem] p-7 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-black text-gray-800 mb-4">Macros Overview</h3>
        <div className="h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={macroData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-gray-800">{totalCaloriesIn}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Total Kcal</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {macroData.map(item => (
            <div key={item.name} className="flex flex-col items-center p-2 rounded-2xl bg-gray-50">
              <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-black uppercase text-gray-400">{item.name}</span>
              <span className="text-xs font-bold text-gray-800">{item.value}g</span>
            </div>
          ))}
        </div>
      </section>

      {/* Food Log */}
      <section className="bg-white rounded-[2.5rem] p-7 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xl font-black text-gray-800">Food Log</h3>
        {loggedFoods.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-gray-400 font-bold text-sm">No meals logged today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {loggedFoods.map((food) => (
              <div key={food.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-colors group">
                {editingId === food.id && editForm ? (
                  <div className="w-full space-y-2 animate-in fade-in zoom-in duration-200">
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="w-full p-2 text-sm border-2 border-emerald-500 rounded-xl bg-white text-gray-900 font-bold"
                      placeholder="Food Name"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        name="calories"
                        value={editForm.calories}
                        onChange={handleEditChange}
                        className="p-2 text-sm border rounded-xl bg-white text-gray-900"
                        placeholder="Calories"
                      />
                      <input
                        type="text"
                        name="portion"
                        value={editForm.portion}
                        onChange={handleEditChange}
                        className="p-2 text-sm border rounded-xl bg-white text-gray-900"
                        placeholder="Portion"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={saveEdit}
                        className="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="flex-1 py-2 bg-gray-300 text-gray-700 text-xs font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-bold text-gray-800 group-hover:text-emerald-700">{food.name}</p>
                      <p className="text-xs text-gray-400 font-bold uppercase">{food.portion} • {food.calories} kcal</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEditing(food)} className="p-2 text-gray-300 hover:text-blue-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button onClick={() => onDeleteFood(food.id)} className="p-2 text-gray-300 hover:text-red-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
