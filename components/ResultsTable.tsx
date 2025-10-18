
import React, { useMemo } from 'react';
import type { Candidate, Evaluation, AverageScores } from '../types';
import { EVALUATION_CRITERIA } from '../constants';

interface ResultsTableProps {
  candidates: Candidate[];
  evaluations: Evaluation[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ candidates, evaluations }) => {
  const averageResults = useMemo(() => {
    const results = new Map<string, { scores: AverageScores; count: number }>();

    evaluations.forEach(ev => {
      if (!results.has(ev.candidateId)) {
        results.set(ev.candidateId, {
          scores: { qualifications: 0, personalTraits: 0, communication: 0, generalKnowledge: 0, total: 0 },
          count: 0,
        });
      }

      const entry = results.get(ev.candidateId)!;
      entry.scores.qualifications += ev.qualifications;
      entry.scores.personalTraits += ev.personalTraits;
      entry.scores.communication += ev.communication;
      entry.scores.generalKnowledge += ev.generalKnowledge;
      entry.scores.total += ev.qualifications + ev.personalTraits + ev.communication + ev.generalKnowledge;
      entry.count += 1;
    });

    const finalAverages: { candidate: Candidate; averages: AverageScores }[] = [];
    candidates.forEach(candidate => {
      const result = results.get(candidate.id);
      if (result && result.count > 0) {
        finalAverages.push({
          candidate,
          averages: {
            qualifications: result.scores.qualifications / result.count,
            personalTraits: result.scores.personalTraits / result.count,
            communication: result.scores.communication / result.count,
            generalKnowledge: result.scores.generalKnowledge / result.count,
            total: result.scores.total / result.count,
          },
        });
      } else {
        finalAverages.push({
          candidate,
          averages: { qualifications: 0, personalTraits: 0, communication: 0, generalKnowledge: 0, total: 0 },
        });
      }
    });

    return finalAverages.sort((a, b) => b.averages.total - a.averages.total);
  }, [candidates, evaluations]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">ورقة متوسط التقييم</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">كود المرشح</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم المرشح</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{EVALUATION_CRITERIA.qualifications.label} ({EVALUATION_CRITERIA.qualifications.max})</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{EVALUATION_CRITERIA.personalTraits.label} ({EVALUATION_CRITERIA.personalTraits.max})</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{EVALUATION_CRITERIA.communication.label} ({EVALUATION_CRITERIA.communication.max})</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{EVALUATION_CRITERIA.generalKnowledge.label} ({EVALUATION_CRITERIA.generalKnowledge.max})</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المتوسط الإجمالي (100)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {averageResults.map(({ candidate, averages }) => (
              <tr key={candidate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{candidate.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{averages.qualifications.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{averages.personalTraits.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{averages.communication.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{averages.generalKnowledge.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{averages.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {evaluations.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p>لم يتم إدخال أي تقييمات حتى الآن.</p>
        </div>
       )}
    </div>
  );
};
