import React, { useState, useEffect, useMemo } from 'react';
import type { Candidate, Evaluation, Evaluator } from '../types';
import { EVALUATION_CRITERIA, CriteriaKey } from '../constants';

interface EvaluationFormProps {
  candidates: Candidate[];
  evaluator: Evaluator;
  onAddEvaluation: (evaluation: Evaluation) => void;
  myEvaluations: Evaluation[];
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({ candidates, evaluator, onAddEvaluation, myEvaluations }) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [scores, setScores] = useState<Record<CriteriaKey, number>>({
    qualifications: 0,
    personalTraits: 0,
    communication: 0,
    generalKnowledge: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const existingEvaluation = useMemo(() => {
    if (!selectedCandidateId) return undefined;
    return myEvaluations.find(ev => ev.candidateId === selectedCandidateId);
  }, [selectedCandidateId, myEvaluations]);

  useEffect(() => {
    if (existingEvaluation) {
      setScores({
        qualifications: existingEvaluation.qualifications,
        personalTraits: existingEvaluation.personalTraits,
        communication: existingEvaluation.communication,
        generalKnowledge: existingEvaluation.generalKnowledge,
      });
    } else {
      setScores({ qualifications: 0, personalTraits: 0, communication: 0, generalKnowledge: 0 });
    }
  }, [existingEvaluation]);

  const handleScoreChange = (criterion: CriteriaKey, value: string) => {
    const max = EVALUATION_CRITERIA[criterion].max;
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= max) {
      setScores(prev => ({ ...prev, [criterion]: numValue }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedCandidateId) {
      setError('يرجى اختيار مرشح.');
      return;
    }

    const totalScore = Object.values(scores).reduce((sum, score) => sum + (score || 0), 0);
    if (totalScore === 0) {
        setError('لا يمكن تقديم تقييم بدرجات صفرية بالكامل.');
        return;
    }

    const newEvaluation: Evaluation = {
      id: existingEvaluation?.id || `${evaluator.id}-${selectedCandidateId}-${Date.now()}`,
      candidateId: selectedCandidateId,
      evaluatorId: evaluator.id,
      ...scores,
      timestamp: Date.now(),
    };

    onAddEvaluation(newEvaluation);
    setSuccess(`تم ${existingEvaluation ? 'تحديث' : 'حفظ'} تقييم المرشح بنجاح!`);
    
    setTimeout(() => setSuccess(''), 3000);
  };
  
  const total = Object.values(scores).reduce((sum, score) => sum + (score || 0), 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{existingEvaluation ? 'تعديل تقييم المرشح' : 'تقييم مرشح جديد'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="candidate" className="block text-gray-700 text-sm font-bold mb-2">
            اختر المرشح
          </label>
          <select
            id="candidate"
            value={selectedCandidateId}
            onChange={(e) => setSelectedCandidateId(e.target.value)}
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>-- اختر مرشحًا --</option>
            {candidates.map(c => (
              <option key={c.id} value={c.id}>({c.id}) {c.name}</option>
            ))}
          </select>
        </div>

        {Object.entries(EVALUATION_CRITERIA).map(([key, { label, max }]) => (
          <div key={key} className="mb-4 flex items-center justify-between">
            <label htmlFor={key} className="text-gray-700">{label} ({max})</label>
            <input
              type="number"
              id={key}
              value={scores[key as CriteriaKey]}
              onChange={(e) => handleScoreChange(key as CriteriaKey, e.target.value)}
              min="0"
              max={max}
              className="shadow-sm appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              required
            />
          </div>
        ))}
        
        <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-lg font-bold text-gray-800">
                المجموع الكلي: <span className="text-blue-600">{total} / 100</span>
            </p>
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-4">{success}</p>}

        <div className="flex items-center justify-end mt-6">
          <button
            type="submit"
            disabled={!selectedCandidateId}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 disabled:bg-gray-400"
          >
            {existingEvaluation ? 'تحديث التقييم' : 'حفظ التقييم'}
          </button>
        </div>
      </form>
    </div>
  );
};
