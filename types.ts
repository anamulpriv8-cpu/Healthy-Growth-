
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; // in kg
  height: number; // in cm
  activityLevel: 'sedentary' | 'moderate' | 'active';
  targetWeight: number;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  portion: string;
}

export interface ExerciseItem {
  id: string;
  type: string;
  duration: number; // in minutes
  caloriesBurned: number;
}

export interface DietPlan {
  dailyCalories: number;
  meals: {
    time: string;
    label: string;
    suggestions: string[];
    approxCalories: number;
  }[];
  advice: string[];
}

export enum Tab {
  Dashboard = 'dashboard',
  Scanner = 'scanner',
  DietPlan = 'dietplan',
  Profile = 'profile'
}
