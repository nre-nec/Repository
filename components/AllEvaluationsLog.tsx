import React from 'react';
import type { Evaluation, Evaluator } from '../types';
import { PrintIcon } from './icons/PrintIcon';

interface AllEvaluationsLogProps {
  evaluations: Evaluation[];
  evaluators: Evaluator[];
  guestNames: Record<string, string>;
}

export const AllEvaluationsLog: React.FC<AllEvaluationsLogProps> = ({ evaluations, evaluators, guestNames }) => {
  const getEvaluatorName = (evaluatorId: string) => {
    if (guestNames[evaluatorId]) {
      return guestNames[evaluatorId];
    }
    return evaluators.find(e => e.id === evaluatorId)?.name || 'غير معروف';
  };
  
  const handlePrint = () => {
    window.print();
  };

  const sortedEvaluations = [...evaluations].sort((a, b) => a.candidateId.localeCompare(b.candidateId) || a.timestamp - b.timestamp);

  return (
    <div id="evaluations-log-section" className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center mb-4 print-hide">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg inline-flex items-center gap-2 transition duration-300"
          >
            <PrintIcon className="h-5 w-5"/>
            <span>طباعة التقييمات</span>
          </button>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">سجل جميع التقييمات (للإدارة فقط)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">المقيم</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">كود المرشح</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">مؤهل</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">سمات</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">تواصل</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">ثقافة</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">الإجمالي</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEvaluations.length > 0 ? (
                sortedEvaluations.map((ev) => {
                    const total = ev.qualifications + ev.personalTraits + ev.communication + ev.generalKnowledge;
                    return (
                        <tr key={ev.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getEvaluatorName(ev.evaluatorId)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ev.candidateId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{ev.qualifications}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{ev.personalTraits}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{ev.communication}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{ev.generalKnowledge}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 text-center">{total}</td>
                        </tr>
                    );
                })
            ) : (
                <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500">لم يتم إدخال أي تقييمات حتى الآن.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};