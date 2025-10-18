import type { Evaluator, Candidate } from './types';

export const EVALUATORS: Evaluator[] = [
  { id: 'evaluator1', name: 'د. نورة بنت عبد الله الهديب', password: '1111', role: 'evaluator' },
  { id: 'evaluator2', name: 'د. محمد بن رفعت السوداني', password: '2222', role: 'evaluator' },
  { id: 'evaluator3', name: 'د. عبيد بن عياد حمر الوثيري', password: '3333', role: 'evaluator' },
  { id: 'evaluator4', name: 'د. إشراق بنت سلامة هاشم مرعي', password: '4444', role: 'evaluator' },
  { id: 'evaluator5', name: 'د. نبيلة بنت سالم محمد سالم', password: '5555', role: 'evaluator' },
  { id: 'evaluator6', name: 'د. رباب بنت صبري حسن محمد', password: '6666', role: 'evaluator' },
  { id: 'evaluator7', name: 'أ. أشواق بنت نايف فاحس الزوين', password: '7777', role: 'evaluator' },
  { id: 'evaluator8', name: 'ضيف8', password: '8888', role: 'evaluator' },
  { id: 'evaluator9', name: 'ضيف9', password: '9999', role: 'evaluator' },
  { id: 'evaluator10', name: 'ضيف10', password: '1010', role: 'evaluator' },
  { id: 'admin', name: 'مدير النظام', password: 'adminpassword', role: 'admin' },
  { id: 'data_entry', name: 'مدخل البيانات', password: 'datapassword', role: 'data_entry' },
];

export const GUEST_EVALUATOR_IDS = ['evaluator8', 'evaluator9', 'evaluator10'];

export const INITIAL_CANDIDATES: Candidate[] = [
  { id: 'C001', name: 'رزان احمد عبدالله', isVisible: true },
  { id: 'C002', name: 'ايمن إبراهيم اسلام', isVisible: true },
  { id: 'C003', name: 'حسن السيد محمد العدوي', isVisible: true },
  { id: 'C004', name: 'محمد محمد احمد عامر', isVisible: true },
];


export const EVALUATION_CRITERIA = {
  qualifications: { label: 'المؤهلات والخبرة', max: 30 },
  personalTraits: { label: 'السمات الشخصية', max: 30 },
  communication: { label: 'مهارات التواصل', max: 20 },
  generalKnowledge: { label: 'الثقافة العامة', max: 20 },
};

export type CriteriaKey = keyof typeof EVALUATION_CRITERIA;