import React, { useState } from 'react';
import { LogoutIcon } from './icons/LogoutIcon';

interface GuestNameModalProps {
  defaultName: string;
  onSubmit: (name: string) => void;
  onLogout: () => void;
}

export const GuestNameModal: React.FC<GuestNameModalProps> = ({ defaultName, onSubmit, onLogout }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('الرجاء إدخال اسمك.');
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 m-4 relative">
        <button
            onClick={onLogout}
            className="absolute top-2 left-2 flex items-center gap-2 text-xs text-gray-500 hover:text-red-600 transition-colors"
            title="تسجيل الخروج"
        >
            <LogoutIcon className="h-4 w-4" />
        </button>
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">مرحباً بك، {defaultName}</h1>
            <p className="text-gray-500 mt-2">يرجى إدخال اسمك الكامل للمتابعة.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="guestName" className="block text-gray-700 text-sm font-bold mb-2">
              الاسم الكامل
            </label>
            <input
              type="text"
              id="guestName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
            >
              حفظ والمتابعة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
