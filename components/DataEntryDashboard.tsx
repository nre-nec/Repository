import React from 'react';
import type { Candidate, Evaluator } from '../types';
// FIX: Corrected import path for CandidateManagement component.
import { CandidateManagement } from './CandidateManagement';
import { LogoutIcon } from './icons/LogoutIcon';

interface DataEntryDashboardProps {
  evaluator: Evaluator;
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  onLogout: () => void;
}

export const DataEntryDashboard: React.FC<DataEntryDashboardProps> = ({ evaluator, candidates, setCandidates, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
       <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">لوحة تحكم إدخال البيانات</h1>
              <p className="text-sm text-gray-500">مرحباً، {evaluator.name}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <LogoutIcon className="h-5 w-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-8">
          <CandidateManagement candidates={candidates} setCandidates={setCandidates} />
        </div>
      </main>
    </div>
  );
};