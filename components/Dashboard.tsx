import React, { useMemo } from 'react';
import type { Candidate, Evaluation, Evaluator } from '../types';
import { EvaluationForm } from './EvaluationForm';
import { LogoutIcon } from './icons/LogoutIcon';

interface DashboardProps {
  evaluator: Evaluator;
  candidates: Candidate[];
  evaluations: Evaluation[];
  onAddEvaluation: (evaluation: Evaluation) => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ evaluator, candidates, evaluations, onAddEvaluation, onLogout }) => {
    const myEvaluations = useMemo(() => {
        return evaluations.filter(ev => ev.evaluatorId === evaluator.id);
    }, [evaluations, evaluator.id]);

    const visibleCandidates = useMemo(() => {
        return candidates.filter(c => c.isVisible);
    }, [candidates]);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">لوحة تحكم المقيم</h1>
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
                <div className="max-w-2xl mx-auto">
                    <EvaluationForm
                        candidates={visibleCandidates}
                        evaluator={evaluator}
                        onAddEvaluation={onAddEvaluation}
                        myEvaluations={myEvaluations}
                    />
                </div>
            </main>
        </div>
    );
};