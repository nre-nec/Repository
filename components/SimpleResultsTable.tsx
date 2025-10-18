import React, { useMemo } from 'react';
import type { Candidate, Evaluation } from '../types';

interface SimpleResultsTableProps {
  candidates: Candidate[];
  evaluations: Evaluation[];
}

export const SimpleResultsTable: React.FC<SimpleResultsTableProps> = ({ candidates, evaluations }) => {
  const results = useMemo(() => {
    const sortedCandidates = [...candidates].sort((a, b) => a.id.localeCompare(b.id));
    return sortedCandidates.map(candidate => {
      const candidateEvaluations = evaluations.filter(ev => ev.candidateId === candidate.id);
      const count = candidateEvaluations.length;
      if (count === 0) {
        return { candidate, count, average: 0 };
      }
      const totalSum = candidateEvaluations.reduce((sum, ev) => {
        return sum + ev.qualifications + ev.personalTraits + ev.communication + ev.generalKnowledge;
      }, 0);
      const average = totalSum / count;
      return { candidate, count, average };
    });
  }, [candidates, evaluations]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">متوسط التقييمات (للإدارة فقط)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">الكود</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">اسم المرشح</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">عدد التقييمات</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">المتوسط</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map(({ candidate, count, average }) => (
              <tr key={candidate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{candidate.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 text-center">
                  {count > 0 ? average.toFixed(2) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};