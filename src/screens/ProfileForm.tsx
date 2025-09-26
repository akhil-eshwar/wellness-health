import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/Card';

export const ProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [wellnessGoal, setWellnessGoal] = useState<string>('');

  const wellnessGoals = [
    'Weight Loss',
    'Muscle Building',
    'Stress Management',
    'Better Sleep',
    'Improved Energy',
    'Mental Health',
    'Flexibility & Mobility',
    'Heart Health',
    'Nutrition Improvement',
    'Overall Wellness'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!age || !gender || !wellnessGoal) {
      alert('Please fill in all fields');
      return;
    }

    dispatch({
      type: 'SET_PROFILE',
      payload: {
        age: parseInt(age),
        gender: gender as 'male' | 'female' | 'other',
        wellnessGoal,
      },
    });

    navigate('/tips');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Wellness Journey! 🌟
          </h1>
          <p className="text-lg text-gray-600">
            Tell us about yourself to get personalized wellness tips
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="13"
                max="120"
                className="wellness-input"
                placeholder="Enter your age"
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                className="wellness-select"
                required
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="wellnessGoal" className="block text-sm font-medium text-gray-700 mb-2">
                Primary Wellness Goal
              </label>
              <select
                id="wellnessGoal"
                value={wellnessGoal}
                onChange={(e) => setWellnessGoal(e.target.value)}
                className="wellness-select"
                required
              >
                <option value="">Select your wellness goal</option>
                {wellnessGoals.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full wellness-button py-3 text-lg font-semibold"
            >
              Get My Wellness Tips ✨
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};