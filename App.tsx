import React, { useState, useEffect } from 'react';
import { db } from './firebase/config';
import { fetchCandidates, fetchEvaluations, fetchGuestNames, updateCandidate, addCandidate, updateEvaluation, updateGuestName } from './firebase/service';
import type { Candidate, Evaluation, Evaluator } from './types';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { DataEntryDashboard } from './components/DataEntryDashboard';
import { AllEvaluationsLog } from './components/AllEvaluationsLog';
import { SimpleResultsTable } from './components/SimpleResultsTable';
import { EVALUATORS, GUEST_EVALUATOR_IDS } from './constants';
import { LogoutIcon } from './components/icons/LogoutIcon';
import { CandidateManagement } from './components/CandidateManagement';
import { GuestNameModal } from './components/GuestNameModal';
import { useLocalStorage } from './hooks/useLocalStorage';


const App: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [guestNames, setGuestNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedInEvaluator, setLoggedInEvaluator] = useLocalStorage<Evaluator | null>('loggedInEvaluator', null);

  useEffect(() => {
    const handleError = (err: Error) => {
        console.error("Firebase connection error:", err);
        setError("حدث خطأ أثناء الاتصال بقاعدة البيانات. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
        setIsLoading(false);
    };

    // Set up real-time listeners
    const unsubscribeCandidates = db.collection('candidates').orderBy('id').onSnapshot(snapshot => {
      const candidatesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Candidate));
      setCandidates(candidatesData);
      setIsLoading(false); // Only set loading false on the primary data fetch
    }, handleError);
    
    const unsubscribeEvaluations = db.collection('evaluations').onSnapshot(snapshot => {
      const evaluationsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Evaluation));
      setEvaluations(evaluationsData);
    }, handleError);

    const unsubscribeGuestNames = db.collection('guestNames').onSnapshot(snapshot => {
        const guestNamesData: Record<string, string> = {};
        snapshot.docs.forEach(doc => {
            guestNamesData[doc.id] = doc.data().name;
        });
        setGuestNames(guestNamesData);
    }, handleError);

    // Clean up listeners on unmount
    return () => {
      unsubscribeCandidates();
      unsubscribeEvaluations();
      unsubscribeGuestNames();
    };
  }, []);


  const handleLogin = (evaluator: Evaluator) => {
    const originalEvaluator = EVALUATORS.find(e => e.id === evaluator.id)!;
    const savedName = guestNames[evaluator.id];
    
    if (savedName) {
      setLoggedInEvaluator({ ...originalEvaluator, name: savedName });
    } else {
      setLoggedInEvaluator(originalEvaluator);
    }
  };

  const handleLogout = () => {
    setLoggedInEvaluator(null);
  };

  const handleAddEvaluation = async (newEvaluation: Evaluation) => {
    await updateEvaluation(newEvaluation);
  };

  const handleSetCandidates = async (newCandidates: Candidate[] | ((prev: Candidate[]) => Candidate[])) => {
    if (typeof newCandidates === 'function') {
        const updatedCandidates = newCandidates(candidates);
        // This is complex to handle with batch writes, simplified for now
        // A better approach would be specific functions like add, update, delete
        console.log("Function updates to candidates list should be handled with specific firebase calls.");
    } else {
        // This case is also not ideal, it implies replacing the whole collection.
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-xl text-gray-500">جاري تحميل البيانات...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-red-700 mb-4">خطأ في الاتصال</h2>
                <p className="text-gray-600">{error}</p>
                <p className="text-sm text-gray-500 mt-4">ملاحظة للمطور: قد تحتاج إلى إضافة نطاق `your-username.github.io` إلى قائمة النطاقات المعتمدة في إعدادات مصادقة Firebase.</p>
            </div>
        </div>
    );
  }

  if (!loggedInEvaluator) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isGuestWithoutSavedName = GUEST_EVALUATOR_IDS.includes(loggedInEvaluator.id) && !guestNames[loggedInEvaluator.id];

  if (isGuestWithoutSavedName) {
      return (
          <GuestNameModal 
              defaultName={loggedInEvaluator.name}
              onLogout={handleLogout}
              onSubmit={async (newName) => {
                  await updateGuestName(loggedInEvaluator.id, newName);
                  setLoggedInEvaluator(prev => ({ ...prev!, name: newName }));
              }}
          />
      );
  }
  
  const AdminDashboard = () => (
    <div className="min-h-screen bg-gray-100 text-gray-800">
        <header className="bg-white shadow-md print-hide">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">لوحة تحكم مدير النظام</h1>
                        <p className="text-sm text-gray-500">مرحباً، {loggedInEvaluator.name}</p>
                    </div>
                    <button
                        onClick={handleLogout}
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
                <SimpleResultsTable candidates={candidates} evaluations={evaluations} />
                <CandidateManagement candidates={candidates} setCandidates={handleSetCandidates} />
                <AllEvaluationsLog evaluations={evaluations} evaluators={EVALUATORS} guestNames={guestNames} />
            </div>
        </main>
    </div>
  );

  switch (loggedInEvaluator.role) {
    case 'evaluator':
      return <Dashboard 
        evaluator={loggedInEvaluator} 
        candidates={candidates}
        evaluations={evaluations}
        onAddEvaluation={handleAddEvaluation}
        onLogout={handleLogout}
      />;
    case 'admin':
        return <AdminDashboard />;
    case 'data_entry':
        return <DataEntryDashboard
            evaluator={loggedInEvaluator}
            candidates={candidates}
            setCandidates={handleSetCandidates}
            onLogout={handleLogout}
        />;
    default:
      return <LoginPage onLogin={handleLogin} />;
  }
};

export default App;