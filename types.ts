export interface Candidate {
  id: string;
  name: string;
  isVisible: boolean;
}

export interface Evaluator {
  id: string;
  name: string;
  password?: string;
  role: 'evaluator' | 'admin' | 'data_entry';
}

export interface Evaluation {
  id: string;
  candidateId: string;
  evaluatorId: string;
  qualifications: number;
  personalTraits: number;
  communication: number;
  generalKnowledge: number;
  timestamp: number;
}

export interface AverageScores {
  qualifications: number;
  personalTraits: number;
  communication: number;
  generalKnowledge: number;
  total: number;
}