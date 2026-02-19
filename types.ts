
export type TestType = 'EPT' | 'TOEFL_JR' | 'TOEFL';

export interface Student {
  id: string;
  name: string;
  score: string;
  score2?: string; // TOEFL JR. 전용 (S+W)
  assignedClass: string;
  testType: TestType;
}
