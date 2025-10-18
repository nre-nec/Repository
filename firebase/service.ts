import { db } from './config';
import type { Candidate, Evaluation } from '../types';

const candidatesCollection = db.collection('candidates');
const evaluationsCollection = db.collection('evaluations');
const guestNamesCollection = db.collection('guestNames');

// --- Candidate Services ---

export const fetchCandidates = async (): Promise<Candidate[]> => {
    const snapshot = await candidatesCollection.orderBy('id').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Candidate));
};

export const addCandidate = async (candidate: Omit<Candidate, 'id'> & { id: string }): Promise<void> => {
    // Firestore uses the document ID as the key, so we set it directly
    await candidatesCollection.doc(candidate.id).set(candidate);
};

export const updateCandidate = async (candidateId: string, updates: Partial<Candidate>): Promise<void> => {
    await candidatesCollection.doc(candidateId).update(updates);
};

// --- Evaluation Services ---

export const fetchEvaluations = async (): Promise<Evaluation[]> => {
    const snapshot = await evaluationsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Evaluation));
};

export const updateEvaluation = async (evaluation: Evaluation): Promise<void> => {
    // Use set with merge option to create or update
    await evaluationsCollection.doc(evaluation.id).set(evaluation, { merge: true });
};

// --- Guest Name Services ---

export const fetchGuestNames = async (): Promise<Record<string, string>> => {
    const snapshot = await guestNamesCollection.get();
    const names: Record<string, string> = {};
    snapshot.forEach(doc => {
        names[doc.id] = doc.data().name;
    });
    return names;
};

export const updateGuestName = async (guestId: string, name: string): Promise<void> => {
    await guestNamesCollection.doc(guestId).set({ name });
};
