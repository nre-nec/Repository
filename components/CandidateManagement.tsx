import React, { useState } from 'react';
import type { Candidate } from '../types';
import { addCandidate, updateCandidate } from '../firebase/service';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';
import { EditIcon } from './icons/EditIcon';
import { SaveIcon } from './icons/SaveIcon';
import { CloseIcon } from './icons/CloseIcon';

interface CandidateManagementProps {
  candidates: Candidate[];
  setCandidates: (value: Candidate[] | ((val: Candidate[]) => Candidate[])) => void; // Prop is now for local state updates, but we use firebase service
}

export const CandidateManagement: React.FC<CandidateManagementProps> = ({ candidates }) => {
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateId, setNewCandidateId] = useState('');
  const [editingCandidate, setEditingCandidate] = useState<{ id: string; name: string } | null>(null);
  const [error, setError] = useState('');

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newCandidateId.trim() || !newCandidateName.trim()) {
      setError('الرجاء إدخال كود واسم المرشح.');
      return;
    }
    const finalId = newCandidateId.trim().toUpperCase();
    if (candidates.some(c => c.id.toLowerCase() === finalId.toLowerCase())) {
      setError('كود المرشح موجود بالفعل.');
      return;
    }
    
    const newCandidate: Candidate = {
      id: finalId,
      name: newCandidateName.trim(),
      isVisible: true,
    };
    
    try {
        await addCandidate(newCandidate);
        setNewCandidateId('');
        setNewCandidateName('');
    } catch(err) {
        setError('حدث خطأ أثناء إضافة المرشح.');
        console.error(err);
    }
  };

  const handleToggleVisibility = async (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
        await updateCandidate(candidateId, { isVisible: !candidate.isVisible });
    }
  };
  
  const startEditing = (candidate: Candidate) => {
    setEditingCandidate({ id: candidate.id, name: candidate.name });
  };
  
  const cancelEditing = () => {
    setEditingCandidate(null);
  };
  
  const handleUpdateCandidate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingCandidate || !editingCandidate.name.trim()) return;
      
      try {
        await updateCandidate(editingCandidate.id, { name: editingCandidate.name.trim() });
        setEditingCandidate(null);
      } catch(err) {
        // handle error
        console.error(err);
      }
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">إدارة المرشحين</h2>
      
      <form onSubmit={handleAddCandidate} className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">إضافة مرشح جديد</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newCandidateId}
            onChange={(e) => setNewCandidateId(e.target.value)}
            placeholder="كود المرشح (e.g., C005)"
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={newCandidateName}
            onChange={(e) => setNewCandidateName(e.target.value)}
            placeholder="اسم المرشح الكامل"
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 whitespace-nowrap">
            إضافة مرشح
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">قائمة المرشحين</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">الكود</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">الاسم</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">إجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidates.map(candidate => (
                <tr key={candidate.id}>
                  {editingCandidate?.id === candidate.id ? (
                     <td colSpan={4} className="px-6 py-4">
                        <form onSubmit={handleUpdateCandidate} className="flex items-center gap-2">
                             <span className="font-medium text-gray-900">{candidate.id}</span>
                             <input 
                                type="text" 
                                value={editingCandidate.name}
                                onChange={(e) => setEditingCandidate({...editingCandidate, name: e.target.value})}
                                className="shadow-sm appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                            <button type="submit" className="p-2 text-green-600 hover:text-green-800">
                                <SaveIcon className="h-5 w-5" />
                            </button>
                            <button type="button" onClick={cancelEditing} className="p-2 text-red-600 hover:text-red-800">
                                <CloseIcon className="h-5 w-5" />
                            </button>
                        </form>
                     </td>
                  ) : (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{candidate.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {candidate.isVisible ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                ظاهر
                                </span>
                            ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                مخفي
                                </span>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                            <div className="flex items-center justify-center gap-2">
                                <button onClick={() => startEditing(candidate)} className="text-blue-600 hover:text-blue-900" title="تعديل الاسم">
                                    <EditIcon className="h-5 w-5" />
                                </button>
                                <button onClick={() => handleToggleVisibility(candidate.id)} className="text-gray-600 hover:text-gray-900" title={candidate.isVisible ? 'إخفاء المرشح' : 'إظهار المرشح'}>
                                    {candidate.isVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>
                        </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {candidates.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>لم يتم إضافة أي مرشحين بعد.</p>
          </div>
        )}
      </div>
    </div>
  );
};