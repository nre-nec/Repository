
import React, { useState } from 'react';
import type { Evaluator } from '../types';
import { EVALUATORS } from '../constants';

interface LoginPageProps {
  onLogin: (evaluator: Evaluator) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const evaluator = EVALUATORS.find(ev => ev.id === selectedEvaluatorId);

    if (evaluator && evaluator.password === password) {
      setError('');
      onLogin(evaluator);
    } else {
      setError('كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 m-4">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">نظام تقييم المرشحين</h1>
            <p className="text-gray-500 mt-2">يرجى تسجيل الدخول للمتابعة</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="evaluator" className="block text-gray-700 text-sm font-bold mb-2">
              اسم عضو اللجنة
            </label>
            <select
              id="evaluator"
              value={selectedEvaluatorId}
              onChange={(e) => setSelectedEvaluatorId(e.target.value)}
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="" disabled>-- اختر اسمك --</option>
              {EVALUATORS.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
            >
              تسجيل الدخول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
